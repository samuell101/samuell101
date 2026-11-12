// Renders index.html frame-by-frame to video with Playwright + ffmpeg.
//   node render.mjs                      -> frames to silent.mp4 + sfx.json
//   node render.mjs --stills 1,2.5 dir   -> debug PNGs
import { spawn } from 'node:child_process';
import { createRequire } from 'node:module';
import { fileURLToPath, pathToFileURL } from 'node:url';
import path from 'node:path';
import fs from 'node:fs';
const require = createRequire(import.meta.url);
const { chromium } = require('playwright');
const here = path.dirname(fileURLToPath(import.meta.url));
const url = pathToFileURL(path.join(here, 'index.html')).href + '?capture=1';
const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 540, height: 960 } });
page.on('console', m => console.log('[page]', m.text()));
page.on('pageerror', e => console.log('[pageerror]', e.message));
await page.goto(url);
await page.waitForFunction(() => window.READY === true, null, { timeout: 120000 });
const grab = (t, fmt = 'image/png') => page.evaluate(([t, fmt]) => { window.renderAt(t); return document.getElementById('c').toDataURL(fmt, .95).split(',')[1]; }, [t, fmt]);
if (process.argv[2] === '--stills') {
  const times = process.argv[3].split(',').map(Number);
  const dir = process.argv[4] || path.join(here, 'stills');
  fs.mkdirSync(dir, { recursive: true });
  for (const t of times) fs.writeFileSync(path.join(dir, `t${t.toFixed(2).padStart(5, '0')}.png`), Buffer.from(await grab(t), 'base64'));
} else {
  const out = path.resolve(process.argv[2] || path.join(here, 'build', 'silent.mp4'));
  fs.mkdirSync(path.dirname(out), { recursive: true });
  const fps = Number(process.argv[3] || 30);
  const duration = await page.evaluate(() => window.DURATION);
  fs.writeFileSync(path.join(path.dirname(out), 'sfx.json'), JSON.stringify(await page.evaluate(() => window.SFX), null, 1));
  const frames = Math.round(duration * fps);
  const ff = spawn('ffmpeg', ['-y', '-loglevel', 'error', '-f', 'image2pipe', '-framerate', String(fps), '-i', '-',
    '-c:v', 'libx264', '-preset', 'medium', '-crf', '17', '-pix_fmt', 'yuv420p', '-movflags', '+faststart', out], { stdio: ['pipe', 'inherit', 'inherit'] });
  for (let i = 0; i < frames; i++) {
    const buf = Buffer.from(await grab(i / fps, 'image/jpeg'), 'base64');
    if (!ff.stdin.write(buf)) await new Promise(r => ff.stdin.once('drain', r));
    if (i % 150 === 0) console.log(`frame ${i}/${frames}`);
  }
  ff.stdin.end(); await new Promise(r => ff.on('close', r));
  console.log('wrote', out);
}
await browser.close();
