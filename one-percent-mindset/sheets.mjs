// Exports the storyboard and the character/style sheet as PNGs.
import { createRequire } from 'node:module';
import { fileURLToPath, pathToFileURL } from 'node:url';
import path from 'node:path'; import fs from 'node:fs';
const require = createRequire(import.meta.url);
const { chromium } = require('playwright');
const here = path.dirname(fileURLToPath(import.meta.url));
const browser = await chromium.launch();
for (const mode of ['sheet', 'board']) {
  const page = await browser.newPage();
  page.on('pageerror', e => console.log('[pageerror]', e.message));
  await page.goto(pathToFileURL(path.join(here, 'index.html')).href + '?mode=' + mode);
  await page.waitForFunction(() => window.SHEET_DONE === true, null, { timeout: 120000 });
  const b64 = await page.evaluate(() => document.getElementById('c').toDataURL('image/png').split(',')[1]);
  const out = path.join(here, mode === 'board' ? 'storyboard.png' : 'character-style-sheet.png');
  fs.writeFileSync(out, Buffer.from(b64, 'base64')); console.log('wrote', out);
}
await browser.close();
