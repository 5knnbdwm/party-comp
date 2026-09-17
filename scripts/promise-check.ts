import { readCaptures, root } from './archive-fetch';
import { captureTexts, quoteFound } from './archive-quotes';
import { trackedSchema } from './archive-schema';
import { promiseFileSchema } from './promise-schema';

// Checks every file in data/promises/: shape, ids, parents, and that each quote appears in a captured
// program document of the same party. Usage: bun scripts/promise-check.ts

const programKinds = new Set(['program_full','program_short','program_easy_language','program_html','points_list','program_immediate']);
const errors: string[] = [];
const check = (condition: unknown, message: string) => { if (!condition) errors.push(message); };

async function main() {
 const tracked = trackedSchema.parse(await Bun.file(`${root}/archive/tracked-urls.json`).json());
 const byId = new Map((await readCaptures()).map(capture => [capture.id, capture]));
 const texts = new Map<string, Awaited<ReturnType<typeof captureTexts>>>();
 let files = 0, promises = 0;
 for await (const path of new Bun.Glob('data/promises/**/*.json').scan(root)) {
  const file = promiseFileSchema.parse(await Bun.file(`${root}/${path}`).json());
  files++;
  check(path === `data/promises/${file.state}/${file.party}.json`, `${path}: state or party mismatch`);
  const ids = new Set<string>();
  for (const promise of file.promises) {
   promises++;
   const where = `${path} ${promise.id}`;
   check(promise.id.startsWith(`${file.state}-${file.party}-`), `${where}: id must start with ${file.state}-${file.party}-`);
   check(!ids.has(promise.id), `${where}: duplicate id`);
   ids.add(promise.id);
   check(!promise.measure || promise.done_when, `${where}: a promise with a measure needs a done_when`);
   check(!/\n|­/.test(promise.text), `${where}: text must be a single readable line`);
   for (const source of promise.sources) {
    const capture = byId.get(source.capture);
    if (!capture) { check(false, `${where}: unknown capture ${source.capture}`); continue; }
    const item = tracked.find(t => t.url === capture.url);
    check(item && item.state === file.state && item.party === file.party && programKinds.has(item.kind), `${where}: ${source.capture} is not a program document of ${file.state}/${file.party}`);
    if (!texts.has(capture.id)) texts.set(capture.id, await captureTexts(capture));
    check(capture.pdf_info ? source.page !== null : source.page === null, `${where}: page must be set for PDFs and null otherwise`);
    check(quoteFound(capture, texts.get(capture.id)!, source.quote, source.page), `${where}: quote absent from ${source.capture}: ${source.quote.slice(0, 60)}`);
   }
  }
  for (const promise of file.promises) {
   if (promise.parent === null) continue;
   check(promise.parent !== promise.id && ids.has(promise.parent), `${path} ${promise.id}: parent ${promise.parent} not found`);
  }
 }
 if (errors.length) {console.error(errors.join('\n')); process.exitCode = 1;}
 else console.log(`Valid: ${promises} promises in ${files} file(s).`);
}

try {await main();} catch (error) {console.error(error); process.exitCode = 1;}
