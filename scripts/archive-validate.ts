import { trackedSchema, captureSchema, partySchema } from './archive-schema';
import { root, digest } from './archive-fetch';
import { captureTexts, quoteFound } from './archive-quotes';
import type { Party } from './archive-schema';
const errors:string[]=[];
const check=(condition:unknown,message:string)=>{if(!condition)errors.push(message);};
const normal=(value:string)=>value.normalize('NFKC').replace(/\u00ad/g,'').replace(/\s+/g,' ').toLowerCase();
const bareUrl=(value:string)=>value.toLowerCase().replace(/^https?:\/\//,'').replace(/^www\./,'').replace(/[?#].*$/,'').replace(/\/+$/,'');
// Matches 43.8 as "43.8" or "43,8", and 22 as a whole number, never as part of 122. Trailing zeros in
// the document are allowed, so a value of 9.3 is still backed by a source printing "9,30 %".
const hasNumber=(text:string,value:number)=>{const [whole,fraction]=String(value).split('.');return new RegExp(`(^|[^\\d])${whole}${fraction?`[.,]${fraction}0*`:'([.,]0+)?'}([^\\d]|$)`).test(text);};

/** Why a fact's sources fail to show its value, or null. Statements are checked for speaker and date, not for the fairness of the summary. */
function unsupported(fact:Party['facts'][number],quotes:string,urls:string[],pages:string,retrieved:string[]):string|null{
 const hasUrl=(value:string)=>urls.some(url=>bareUrl(url)===bareUrl(value))||quotes.includes(bareUrl(value));
 switch(fact.key){
  case 'name_full':case 'name_short':case 'lead_candidate':return quotes.includes(normal(fact.value))?null:`no quote contains "${fact.value}"`;
  case 'ballot_list_number':return hasNumber(quotes,fact.value)?null:`no quote contains ${fact.value}`;
  // Zero seats means the party is absent from the member list, so there is no number to quote.
  case 'seats_before_election':return fact.value===0||hasNumber(quotes,fact.value)?null:`no quote contains ${fact.value}`;
  // Vote shares are published on election night; the seat allocation can follow weeks later, so seats stay null until then.
  case 'election_result':{
   if(!hasNumber(quotes,fact.value.second_vote_pct))return `no quote contains ${fact.value.second_vote_pct}%`;
   if(fact.value.seats!==null&&!hasNumber(quotes,fact.value.seats))return `no quote contains ${fact.value.seats} seats`;
   return null;
  }
  case 'website':case 'state_association_website':case 'parliamentary_group_website':case 'program':return hasUrl(fact.value)?null:`neither a source URL nor a quote matches ${fact.value}`;
  case 'social_account':return hasUrl(fact.value.url)?null:`neither a source URL nor a quote matches ${fact.value.url}`;
  case 'coalition_position':case 'sondierung_status':{
   const surname=normal(fact.value.speaker).split(' ').at(-1)!;
   if(!pages.includes(surname))return `speaker "${fact.value.speaker}" does not appear in any source`;
   if(retrieved.every(at=>fact.value.stated_on>at.slice(0,10)))return `stated_on ${fact.value.stated_on} is after every source was retrieved`;
   if(/^\d{4}-\d{2}-\d{2}|^\d{1,2}\. \p{L}+ \d{4}/u.test(fact.value.summary))return 'summary starts with a date; use stated_on';
   return null;
  }
  default:return null;
 }
}
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
  if(capture.page){
   check(capture.page.blob.endsWith('.html'),`${label}: page snapshot must be HTML`);
   check(capture.page.files.some(file=>file.blob===capture.page!.blob&&file.sha256===capture.page!.sha256),`${label}: page missing from snapshot files`);
   for(const asset of capture.page.files){
    check(asset.blob.split('/').at(-1)?.startsWith(asset.sha256+'.'),`${label}: asset path/hash mismatch`);
    const file=Bun.file(`${root}/${asset.blob}`);
    check(await file.exists(),`${label}: missing snapshot asset ${asset.blob}`);
    if(await file.exists())check(digest(new Uint8Array(await file.arrayBuffer()))===asset.sha256,`${label}: snapshot asset hash mismatch ${asset.blob}`);
   }
   for(const resource of capture.page.resources)if(resource.original)check(capture.page.files.some(file=>file.blob===resource.original!.blob&&file.sha256===resource.original!.sha256),`${label}: resource missing from snapshot files`);
  }
  byId.set(label,capture);latest.set(capture.url,capture);
 }
 for(const item of tracked){
  check(latest.has(item.url),`No capture for ${item.url}`);
  // A document URL answering with HTML is a soft 404: the server served a page instead of the file.
  // It never fails, so without this the homepage is archived as though it were the document.
  const last=latest.get(item.url);
  if(last&&!last.error&&!item.retired&&/\.(pdf|docx?|epub)(\?|$)/i.test(item.url))
   check(!last.content_type?.includes('html'),`${item.url}: document URL served HTML from ${last.final_url}; replace it or retire it`);
 }
 let parties=0;
 for await(const path of new Bun.Glob('data/parties/**/*.json').scan(root)){
  const party=partySchema.parse(await Bun.file(`${root}/${path}`).json());parties++;
  check(path===`data/parties/${party.state}/${party.slug}.json`,`${path}: state or slug mismatch`);
  for(const fact of party.facts){
   if(fact.key==='program')check(tracked.some(t=>t.url===fact.value),`${path}: untracked program`);
   const quotes:string[]=[];const urls:string[]=[];const sourceTexts:string[]=[];const retrieved:string[]=[];
   for(const source of fact.sources){const capture=byId.get(source.capture);check(capture,`${path}: unknown capture ${source.capture}`);if(!capture)continue;
    check(!capture.error,`${path}: source is failed capture`);
    check(fact.observed_at>=capture.retrieved_at,`${path}: fact predates capture`);
    check(capture.pdf_info?source.page!==null&&source.page<=capture.pdf_info.pages:source.page===null,`${path}: invalid source page`);
    // Scanned PDFs have no text layer; quotes are checked against their OCR text instead.
    const texts=await captureTexts(capture);const {text,raw}=texts;
    check(!texts.scanWithoutOcr,`${path}: scanned PDF ${source.capture} has no OCR text, run bun scripts/archive-ocr.ts`);
    check(quoteFound(capture,texts,source.quote,source.page),`${path}: quote absent from capture ${source.capture}: ${source.quote.slice(0,60)}`);
    quotes.push(normal(source.quote));urls.push(capture.url);if(capture.final_url)urls.push(capture.final_url);
    sourceTexts.push(normal(text),normal(raw));retrieved.push(capture.retrieved_at);
   }
   const problem=unsupported(fact,quotes.join('\n'),urls,sourceTexts.join('\n'),retrieved);
   check(!problem,`${path}: ${fact.key} not supported by its sources: ${problem}`);
  }
  for(const gap of party.gaps){
   check(gap.searched.length>0,`${path}: gap ${gap.key} lists no searched pages`);
   for(const url of gap.searched)check(captures.some(capture=>capture.url===url&&capture.retrieved_at<=gap.checked_at),`${path}: gap ${gap.key} searched ${url} without a capture before checked_at`);
  }
 }
 if(errors.length){console.error(errors.join('\n'));process.exitCode=1;}else console.log(`Valid: ${tracked.length} tracked URLs, ${captures.length} captures, ${parties} party files.`);
}
try{await main();}catch(error){console.error(error);process.exitCode=1;}
