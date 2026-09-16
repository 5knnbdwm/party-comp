import { appendFile, mkdir, open, unlink } from 'node:fs/promises';
import { resolve } from 'node:path';
import { parseHTML, DOMParser } from 'linkedom';
import { Readability } from '@mozilla/readability';
import { captureSchema, trackedSchema, type Capture } from './archive-schema';
export const root = resolve(import.meta.dir, '..');
export const digest = (bytes: Uint8Array | string) => new Bun.CryptoHasher('sha256').update(bytes).digest('hex');
export async function readCaptures(): Promise<Capture[]> {
 const file = Bun.file(`${root}/archive/captures.jsonl`);
 return await file.exists() ? (await file.text()).split('\n').filter(Boolean).map(line => captureSchema.parse(JSON.parse(line))) : [];
}
const hosts = new Map<string, number>();
// Redirects also pass through the host limiter. Never follow social-media links.
async function request(url: string, timeout = 45000): Promise<Response> {
 for (let redirects = 0; redirects <= 10; redirects++) {
  const host = new URL(url).host;
  const delay = 1050 - (Date.now() - (hosts.get(host) ?? 0));
  if (delay > 0) await Bun.sleep(delay);
  hosts.set(host, Date.now());
  const response = await fetch(url, {headers:{'User-Agent':'party-promise-tracker-archiver/0.1'},redirect:'manual',signal:AbortSignal.timeout(timeout)});
  if ([301,302,303,307,308].includes(response.status) && response.headers.has('location')) {url = new URL(response.headers.get('location')!,url).href; await response.body?.cancel(); continue;}
  return response;
 }
 throw new Error('Too many redirects');
}
async function command(args: string[]) {
 const process = Bun.spawn(args, {stdout:'pipe',stderr:'pipe',env:{...Bun.env,TMPDIR:`${root}/tmp`}});
 const [stdout,stderr,code] = await Promise.all([new Response(process.stdout).text(),new Response(process.stderr).text(),process.exited]);
 if (code !== 0) throw new Error(`${args[0]}: ${stderr}`);
 return stdout;
}
export function htmlText(html: string): string {
 const {document} = parseHTML(html);
 document.querySelectorAll('script,style,noscript,svg,nav,footer,header,form').forEach(node => node.remove());
 const main = document.querySelector('main,[role="main"],article');
 let content = main?.innerHTML;
 if (!content) content = new Readability(document as unknown as Document).parse()?.content ?? document.body.innerHTML;
 const parsed = parseHTML(`<html><body>${content}</body></html>`).document;
 parsed.querySelectorAll('p,div,section,article,h1,h2,h3,h4,li,tr,br').forEach(node => {node.before('\n');node.after('\n');});
 parsed.querySelectorAll('td,th').forEach(node => node.after('\t'));
 return (parsed.body.textContent ?? '').split('\n').map(line => line.replace(/[\t \u00a0]+/g,' ').trim()).filter(Boolean).join('\n')+'\n';
}
async function store(path: string, bytes: Uint8Array | string) {
 try {const file = await open(`${root}/${path}`,'wx'); try {await file.writeFile(bytes);} finally {await file.close();}}
 catch(error) {if (!(error instanceof Error && 'code' in error && error.code === 'EEXIST')) throw error;}
}
async function capture(url:string, previous:Capture|undefined, wayback:boolean):Promise<Capture> {
 const retrieved_at = new Date().toISOString();
 const result:Capture = {id:'',url,final_url:null,retrieved_at,http_status:null,content_type:null,bytes:null,sha256:null,text_sha256:null,blob:null,text:null,http_last_modified:null,http_etag:null,pdf_info:null,wayback_url:null,previous_capture:previous?.id??null,content_changed:null,text_changed:null,error:null};
 try {
  const response = await request(url);
  result.final_url = response.url; result.http_status = response.status;
  result.content_type = response.headers.get('content-type');result.http_last_modified=response.headers.get('last-modified');result.http_etag=response.headers.get('etag');
  if (!response.ok) throw new Error(`HTTP ${response.status}`);
  const bytes = new Uint8Array(await response.arrayBuffer());
  const pdf = new TextDecoder().decode(bytes.slice(0,5)) === '%PDF-';
  const html = !pdf && (result.content_type?.includes('html') || /^\s*<!doctype html|^\s*<html/i.test(new TextDecoder().decode(bytes.slice(0,500))));
  const sha = digest(bytes); const blob = `archive/blobs/${sha}.${pdf?'pdf':html?'html':'bin'}`;
  await store(blob,bytes);
  // Keep raw bytes even when extraction fails; the failed log entry cannot back facts.
  let text:string;
  if (pdf) {
   text = await command(['pdftotext','-layout',`${root}/${blob}`,'-']);
   const info = await command(['pdfinfo',`${root}/${blob}`]);
   const field = (key:string) => info.match(new RegExp(`^${key}:\\s*(.*)$`,'m'))?.[1] ?? null;
   result.pdf_info = {title:field('Title'),creation_date:field('CreationDate'),mod_date:field('ModDate'),pages:Number(field('Pages'))};
  } else if (/\.docx(?:\?|$)/i.test(url)) {
   const xml = await command(['unzip','-p',`${root}/${blob}`,'word/document.xml']);
   const doc = new DOMParser().parseFromString(xml,'text/xml');
   text = [...doc.getElementsByTagName('w:p')].map(p => p.textContent).join('\n')+'\n';
  } else if (/\.epub(?:\?|$)/i.test(url)) {
   const files = (await command(['unzip','-Z1',`${root}/${blob}`])).split('\n').filter(p => /\.(xhtml|html|htm)$/.test(p));
   const pages: string[] = [];
   for (const path of files) pages.push(htmlText(await command(['unzip','-p',`${root}/${blob}`,path])));
   text = pages.join('\n');
  } else text = html ? htmlText(new TextDecoder().decode(bytes)) : new TextDecoder().decode(bytes);
  const textPath = `archive/text/${sha}.txt`;
  // A blob keeps its original extraction, even after parser versions change.
  if (await Bun.file(`${root}/${textPath}`).exists()) text = await Bun.file(`${root}/${textPath}`).text();
  await store(textPath,text);
  Object.assign(result,{sha256:sha,text_sha256:digest(text),blob,text:textPath,bytes:bytes.length,content_changed:previous?previous.sha256!==sha:null,text_changed:previous?previous.text_sha256!==digest(text):null});
 } catch(error) {result.error=String(error);result.pdf_info=null;}
 if (wayback) {
  try {
   const response = await request(`https://web.archive.org/save/${url}`, 15000);
   const location = response.headers.get('content-location');
   if (response.ok && location) result.wayback_url=new URL(location,'https://web.archive.org').href;
   else if (response.ok && /^https:\/\/web.archive.org\/web\/\d+\//.test(response.url)) result.wayback_url=response.url;
   else console.error(`WAYBACK FAILED ${url}: HTTP ${response.status}, no snapshot URL`);
   await response.body?.cancel();
  } catch(error) {console.error(`WAYBACK FAILED ${url}: ${error}`);}
 }
 result.id = `cap_${retrieved_at.replace(/[-:.]/g,'')}_${result.sha256?.slice(0,8) ?? 'failed'}`;
 return captureSchema.parse(result);
}
async function main() {
 const args=process.argv.slice(2);let selected:string|undefined;let wayback=false;
 for(let i=0;i<args.length;i++){if(args[i]==='--wayback')wayback=true;else if(args[i]==='--url' && args[i+1]) selected=args[++i];else throw new Error(`Unknown or incomplete argument: ${args[i]}`);}
 const tracked=trackedSchema.parse(await Bun.file(`${root}/archive/tracked-urls.json`).json());
 if(selected && !tracked.some(item=>item.url===selected))throw new Error('URL is not tracked');
 await mkdir(`${root}/tmp`,{recursive:true});await mkdir(`${root}/archive/blobs`,{recursive:true});await mkdir(`${root}/archive/text`,{recursive:true});
 const lock=await open(`${root}/tmp/archive-fetch.lock`,'wx');
 try {
 const captures=await readCaptures();let failed=false;
 for(const url of new Set(tracked.filter(item=>!selected||item.url===selected).map(item=>item.url))){
  const previous=captures.findLast(item=>item.url===url);const current=await capture(url,previous,wayback);
  await appendFile(`${root}/archive/captures.jsonl`,JSON.stringify(current)+'\n');captures.push(current);
  console.log(`${current.error?'FAILED':current.text_changed?'TEXT CHANGED':current.content_changed?'BYTES CHANGED':'CAPTURED'} ${url} ${current.id}${current.error?' '+current.error:''}`);
  failed ||= current.error!==null;
 }
 if(failed)process.exitCode=1;
 } finally {await lock.close();await unlink(`${root}/tmp/archive-fetch.lock`);}
}
if(import.meta.main)await main();
