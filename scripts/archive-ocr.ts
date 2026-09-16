import { mkdir, mkdtemp, readdir, rm } from 'node:fs/promises';
import { readCaptures, root } from './archive-fetch';

// PDFs without a text layer (scans) get OCR text at archive/ocr/<sha256>.txt, pages separated by \f.
// The capture record stays untouched; OCR output is derived from the blob and can be regenerated.
export const ocrPath = (sha256: string) => `archive/ocr/${sha256}.txt`;

async function run(args: string[]) {
 const process = Bun.spawn(args, {stdout:'pipe',stderr:'pipe',env:{...Bun.env,TMPDIR:`${root}/tmp`}});
 const [stdout,stderr,code] = await Promise.all([new Response(process.stdout).text(),new Response(process.stderr).text(),process.exited]);
 if (code !== 0) throw new Error(`${args[0]}: ${stderr}`);
 return stdout;
}

/** Writes OCR text for a scanned PDF blob unless it already exists. Needs vendor/tessdata/deu.traineddata. */
export async function ocrPdf(blob: string, sha256: string) {
 if (await Bun.file(`${root}/${ocrPath(sha256)}`).exists()) return;
 await mkdir(`${root}/archive/ocr`,{recursive:true});await mkdir(`${root}/tmp`,{recursive:true});
 const directory = await mkdtemp(`${root}/tmp/ocr-`);
 try {
  await run(['pdftoppm','-r','300','-png',`${root}/${blob}`,`${directory}/page`]);
  const images = (await readdir(directory)).filter(name => name.endsWith('.png')).sort();
  const pages: string[] = [];
  for (const image of images) pages.push(await run(['tesseract',`${directory}/${image}`,'-','-l','deu','--tessdata-dir',`${root}/vendor/tessdata`]));
  await Bun.write(`${root}/${ocrPath(sha256)}`, pages.join('\f'));
 } finally {await rm(directory,{recursive:true,force:true});}
}

// `bun scripts/archive-ocr.ts` fills in OCR text for every captured PDF with an empty text layer.
if (import.meta.main) {
 const done = new Set<string>();
 for (const capture of await readCaptures()) {
  if (!capture.pdf_info || !capture.blob || !capture.text || !capture.sha256 || done.has(capture.sha256)) continue;
  done.add(capture.sha256);
  if ((await Bun.file(`${root}/${capture.text}`).text()).trim()) continue;
  await ocrPdf(capture.blob, capture.sha256);
  console.log(`OCR ${capture.url} ${ocrPath(capture.sha256)}`);
 }
}
