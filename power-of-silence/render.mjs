// Renders index.html frame-by-frame to an MP4 using Playwright + ffmpeg.
// Usage: node render.mjs [out.mp4] [fps] [audio.wav]
//        node render.mjs --stills 0.5,1.9,3.2 outdir   (debug PNGs)
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
const page = await browser.newPage({ viewport: { width: 1080, height: 1920 } });
await page.goto(url);
await page.evaluate(() => window.ready);
const grab = t => page.evaluate(t => { window.renderAt(t); return document.getElementById('c').toDataURL('image/png').split(',')[1]; }, t);

if (process.argv[2] === '--stills') {
  const times = process.argv[3].split(',').map(Number);
  const dir = process.argv[4] || path.join(here, 'stills');
  fs.mkdirSync(dir, { recursive: true });
  for (const t of times) fs.writeFileSync(path.join(dir, `t${t.toFixed(2)}.png`), Buffer.from(await grab(t), 'base64'));
} else {
  const out = path.resolve(process.argv[2] || path.join(here, 'power-of-silence.mp4'));
  const fps = Number(process.argv[3] || 30);
  const duration = await page.evaluate(() => window.DURATION);
  const frames = Math.round(duration * fps);
  const audio = process.argv[4] || path.join(here, 'soundtrack.wav');
  const aArgs = fs.existsSync(audio) ? ['-i', audio, '-map', '0:v', '-map', '1:a', '-c:a', 'aac', '-b:a', '192k', '-shortest'] : [];
  const ff = spawn('ffmpeg', ['-y', '-loglevel', 'error', '-f', 'image2pipe', '-framerate', String(fps), '-i', '-', ...aArgs,
    '-c:v', 'libx264', '-preset', 'slow', '-crf', '16', '-pix_fmt', 'yuv420p', '-movflags', '+faststart', out], { stdio: ['pipe', 'inherit', 'inherit'] });
  for (let i = 0; i < frames; i++) {
    const buf = Buffer.from(await grab(i / fps), 'base64');
    if (!ff.stdin.write(buf)) await new Promise(r => ff.stdin.once('drain', r));
    if (i % 90 === 0) process.stdout.write(`frame ${i}/${frames}\n`);
  }
  ff.stdin.end();
  await new Promise(r => ff.on('close', r));
  console.log('wrote', out);
}
await browser.close();
