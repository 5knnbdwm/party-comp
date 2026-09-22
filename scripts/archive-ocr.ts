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

/**
 * Tesseract reads the chevron bullet that starts each item on the AfD flyers as "SS". The documents
 * contain no such letters, and leaving it in produces quotes like "SS KÜNDIGEN" that misrepresent what
 * the party printed. Only a bullet at the start of a line is removed, so "SS" inside a sentence stays.
 */
export const withoutBulletArtefact = (text: string) => text.replace(/^SS (?=[A-ZÄÖÜ])/gm, '');

/**
 * Writes OCR text for a scanned PDF blob unless it already exists, or always with `redo`.
 * Pages render at 400 dpi and OCR runs on the red channel, thresholded: party flyers often set text in blue,
 * which is dark in the red channel but too faint for Tesseract in colour or plain grayscale.
 * Needs vendor/tessdata/deu.traineddata and ImageMagick.
 */
export async function ocrPdf(blob: string, sha256: string, redo = false) {
 if (!redo && await Bun.file(`${root}/${ocrPath(sha256)}`).exists()) return;
 await mkdir(`${root}/archive/ocr`,{recursive:true});await mkdir(`${root}/tmp`,{recursive:true});
 const directory = await mkdtemp(`${root}/tmp/ocr-`);
 try {
  await run(['pdftoppm','-r','400','-png',`${root}/${blob}`,`${directory}/page`]);
  const images = (await readdir(directory)).filter(name => /^page-\d+\.png$/.test(name)).sort();
  const pages: string[] = [];
  for (const image of images) {
   const red = `${directory}/red-${image}`;
   await run(['magick',`${directory}/${image}`,'-channel','R','-separate','-threshold','60%',red]);
   pages.push(await run(['tesseract',red,'-','-l','deu','--tessdata-dir',`${root}/vendor/tessdata`]));
  }
  await Bun.write(`${root}/${ocrPath(sha256)}`, withoutBulletArtefact(pages.join('\f')));
 } finally {await rm(directory,{recursive:true,force:true});}
}

// `bun scripts/archive-ocr.ts` fills in OCR text for every captured PDF with an empty text layer.
// `--redo <sha256>` regenerates one file. Quotes already taken from the old OCR text may stop matching.
if (import.meta.main) {
 const redo = process.argv[2] === '--redo' ? process.argv[3] : undefined;
 const done = new Set<string>();
 for (const capture of await readCaptures()) {
  if (!capture.pdf_info || !capture.blob || !capture.text || !capture.sha256 || done.has(capture.sha256)) continue;
  done.add(capture.sha256);
  if (redo && capture.sha256 !== redo) continue;
  if ((await Bun.file(`${root}/${capture.text}`).text()).trim()) continue;
  await ocrPdf(capture.blob, capture.sha256, Boolean(redo));
  console.log(`OCR ${capture.url} ${ocrPath(capture.sha256)}`);
 }
}
