import { createCanvas } from 'canvas';
import * as pdfjs from 'pdfjs-dist/legacy/build/pdf.mjs';
import { readFileSync, writeFileSync } from 'fs';

const PDF_PATH = '/Users/jitendersharma/Downloads/FE App Walkthrough_compressed.pdf';
const data = new Uint8Array(readFileSync(PDF_PATH));

const doc = await pdfjs.getDocument({ data }).promise;
console.log('Pages:', doc.numPages);

// Render pages 5 and 10 (1-indexed)
for (const pageNum of [5, 10]) {
  const page = await doc.getPage(pageNum);
  const vp = page.getViewport({ scale: 2.0 });
  const canvas = createCanvas(vp.width, vp.height);
  const ctx = canvas.getContext('2d');
  await page.render({ canvasContext: ctx, viewport: vp }).promise;
  const buf = canvas.toBuffer('image/png');
  const outPath = `/tmp/slide-${pageNum}.png`;
  writeFileSync(outPath, buf);
  console.log(`Rendered slide ${pageNum} → ${outPath} (${vp.width}x${vp.height})`);
}
