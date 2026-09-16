import { trackedSchema, captureSchema, partySchema } from './archive-schema';
import { root, digest } from './archive-fetch';
const errors:string[]=[];
const check=(condition:unknown,message:string)=>{if(!condition)errors.push(message);};
async function main(){
 const tracked=trackedSchema.parse(await Bun.file(`${root}/archive/tracked-urls.json`).json());
 const captures=(await Bun.file(`${root}/archive/captures.jsonl`).text()).split('\n').filter(Boolean).map(line=>captureSchema.parse(JSON.parse(line)));
 const byId=new Map<string,typeof captures[number]>();const latest=new Map<string,typeof captures[number]>();
 for(const capture of captures){
  const label=capture.id;check(!byId.has(label),`Duplicate id ${label}`);
  check(tracked.some(t=>t.url===capture.url),`${label}: untracked URL`);
  check(label===`cap_${capture.retrieved_at.replace(/[-:.]/g,'')}_${capture.sha256?.slice(0,8)??'failed'}`,`${label}: invalid id`);
  const previous=latest.get(capture.url);check(capture.previous_capture===(previous?.id??null),`${label}: wrong previous capture`);
  if(previous)check(previous.retrieved_at<capture.retrieved_at,`${label}: timestamps out of order`);
  if(capture.error){check(capture.sha256===null&&capture.text_sha256===null&&capture.blob===null&&capture.text===null,`${label}: failed capture has hashes or paths`);}
  else {
   check(capture.http_status!==null&&capture.http_status>=200&&capture.http_status<300,`${label}: unsuccessful HTTP status`);
   check(capture.blob?.match(new RegExp(`^archive/blobs/${capture.sha256}\\.(pdf|html|bin)$`)),`${label}: invalid blob path`);
   check(capture.text===`archive/text/${capture.sha256}.txt`,`${label}: invalid text path`);
   if(capture.blob?.startsWith('archive/blobs/')&&!capture.blob.includes('..')){
    const file=Bun.file(`${root}/${capture.blob}`);check(await file.exists(),`${label}: missing blob`);
    if(await file.exists()){const bytes=new Uint8Array(await file.arrayBuffer());check(digest(bytes)===capture.sha256,`${label}: blob hash mismatch`);check(bytes.length===capture.bytes,`${label}: byte count mismatch`);}
   }
   if(capture.text?.startsWith('archive/text/')&&!capture.text.includes('..')){
    const file=Bun.file(`${root}/${capture.text}`);check(await file.exists(),`${label}: missing text`);if(await file.exists())check(digest(new Uint8Array(await file.arrayBuffer()))===capture.text_sha256,`${label}: text hash mismatch`);
   }
   check(capture.content_changed===(previous?previous.sha256!==capture.sha256:null),`${label}: wrong content_changed`);
   check(capture.text_changed===(previous?previous.text_sha256!==capture.text_sha256:null),`${label}: wrong text_changed`);
   check(Boolean(capture.pdf_info)===capture.blob?.endsWith('.pdf'),`${label}: invalid PDF metadata`);
  }
  byId.set(label,capture);latest.set(capture.url,capture);
 }
 for(const item of tracked)check(latest.has(item.url),`No capture for ${item.url}`);
 let parties=0;
 for await(const path of new Bun.Glob('data/parties/**/*.json').scan(root)){
  const party=partySchema.parse(await Bun.file(`${root}/${path}`).json());parties++;
  check(path===`data/parties/${party.state}/${party.slug}.json`,`${path}: state or slug mismatch`);
  for(const fact of party.facts){
   if(fact.key==='program')check(tracked.some(t=>t.url===fact.value),`${path}: untracked program`);
   for(const source of fact.sources){const capture=byId.get(source.capture);check(capture,`${path}: unknown capture ${source.capture}`);if(!capture)continue;
    check(!capture.error,`${path}: source is failed capture`);
    check(fact.observed_at>=capture.retrieved_at,`${path}: fact predates capture`);
    check(capture.pdf_info?source.page!==null&&source.page<=capture.pdf_info.pages:source.page===null,`${path}: invalid source page`);
    const text=capture.text?await Bun.file(`${root}/${capture.text}`).text():'';
    const raw=capture.blob?.endsWith('.html')?await Bun.file(`${root}/${capture.blob}`).text():'';
    const pages = text.split('\f').filter((page, index) => index !== 0 || page.trim());
    const quoted=capture.pdf_info&&source.page?pages[source.page-1]??'':text;
    check((capture.pdf_info && !text.trim()) || quoted.includes(source.quote)||raw.includes(source.quote),`${path}: quote absent from capture ${source.capture}: ${source.quote.slice(0,60)}`);
   }
  }
 }
 if(errors.length){console.error(errors.join('\n'));process.exitCode=1;}else console.log(`Valid: ${tracked.length} tracked URLs, ${captures.length} captures, ${parties} party files.`);
}
try{await main();}catch(error){console.error(error);process.exitCode=1;}
