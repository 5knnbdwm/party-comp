import { root } from './archive-fetch';
import { ocrPath } from './archive-ocr';
import type { Capture } from './archive-schema';

/**
 * Loads the text a quote from this capture is checked against: the extracted text, OCR text for scanned PDFs,
 * and the raw HTML. `scanWithoutOcr` is true for a scanned PDF whose OCR text is missing.
 */
export async function captureTexts(capture: Capture) {
 let text = capture.text ? await Bun.file(`${root}/${capture.text}`).text() : '';
 let scanWithoutOcr = false;
 if (capture.pdf_info && capture.sha256 && !text.trim()) {
  const ocr = Bun.file(`${root}/${ocrPath(capture.sha256)}`);
  if (await ocr.exists()) text = await ocr.text(); else scanWithoutOcr = true;
 }
 const raw = capture.blob?.endsWith('.html') ? await Bun.file(`${root}/${capture.blob}`).text() : '';
 return {text, raw, scanWithoutOcr};
}

/** Whether `quote` appears in the capture, on `page` for PDFs. */
export function quoteFound(capture: Capture, texts: {text:string; raw:string}, quote: string, page: number | null) {
 const pages = texts.text.split('\f').filter((content, index) => index !== 0 || content.trim());
 const quoted = capture.pdf_info && page ? pages[page - 1] ?? '' : texts.text;
 return quoted.includes(quote) || texts.raw.includes(quote);
}
