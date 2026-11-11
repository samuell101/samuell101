#!/usr/bin/env node
/* ------------------------------------------------------------------
   Frame-exact export: 1080×1920 @ 30 fps → output/safety-reel.mp4

   Every frame is produced by seeking the master timeline (no screen
   recording, no dropped frames), piped straight into ffmpeg.

   Usage:   node tools/render.js [--fps 30] [--out output/safety-reel.mp4]
                                 [--no-sfx] [--voiceover path/to/file]
   Needs:   Node 18+, `npm i playwright` (+ `npx playwright install chromium`),
            and ffmpeg on your PATH.
------------------------------------------------------------------ */
const path = require('path'), fs = require('fs'), { spawn, spawnSync } = require('child_process');
const { chromium } = require('playwright');

const arg = (name, def) => { const i = process.argv.indexOf('--' + name); return i > -1 ? (process.argv[i + 1] || true) : def; };
const root = path.resolve(__dirname, '..');
const out = path.resolve(root, arg('out', 'output/safety-reel.mp4'));
const noSfx = process.argv.includes('--no-sfx');
const run = (args) => { const r = spawnSync('ffmpeg', args, { stdio: ['ignore', 'ignore', 'pipe'] }); if (r.status) throw new Error(r.stderr.toString().slice(-800)); };

(async () => {
  fs.mkdirSync(path.dirname(out), { recursive: true });
  const browser = await chromium.launch(process.env.CHROME_PATH ? { executablePath: process.env.CHROME_PATH } : {});
  const page = await browser.newPage({ viewport: { width: 1080, height: 1920 }, deviceScaleFactor: 1 });
  page.on('pageerror', e => { console.error('Page error:', e.message); process.exitCode = 1; });
  await page.goto('file://' + path.join(root, 'index.html') + '?render=1');
  await page.evaluate(() => document.fonts.ready);
  const info = await page.evaluate(() => window.__info);
  const fps = +arg('fps', info.fps), frames = Math.round(Math.min(info.total, +arg('seconds', 1e9)) * fps);   // --seconds N = quick partial test
  console.log(`Rendering ${frames} frames (${info.total.toFixed(2)} s @ ${fps} fps, ${info.width}×${info.height})`);

  // audio first: synthesized SFX bed (rendered offline in the page)
  const inputs = [], sfxWav = out.replace(/\.mp4$/, '.sfx.wav');
  if (!noSfx) {
    try {
      fs.writeFileSync(sfxWav, Buffer.from(await page.evaluate(() => Reel.audio.wavBase64(Reel.TL)), 'base64'));
      inputs.push(sfxWav);
    } catch (e) { console.warn('SFX render failed, continuing without it:', e.message); }
  }
  const cfgVo = await page.evaluate(() => Reel.config.voiceover);

  const silent = out.replace(/\.mp4$/, '.video-only.mp4');
  const ff = spawn('ffmpeg', ['-y', '-f', 'image2pipe', '-framerate', String(fps), '-c:v', 'png', '-i', '-',
    '-c:v', 'libx264', '-preset', 'slow', '-crf', '17', '-pix_fmt', 'yuv420p', '-movflags', '+faststart', silent],
    { stdio: ['pipe', 'ignore', 'pipe'] });
  let fferr = ''; ff.stderr.on('data', d => { fferr = (fferr + d).slice(-2000); });
  const done = new Promise((res, rej) => ff.on('close', c => (c ? rej(new Error(fferr)) : res())));

  for (let i = 0; i < frames; i++) {
    await page.evaluate(t => window.__seek(t), i / fps);
    const buf = await page.screenshot({ type: 'png' });
    if (!ff.stdin.write(buf)) await new Promise(r => ff.stdin.once('drain', r));
    if (i % 60 === 0) process.stdout.write(`\r  frame ${i}/${frames}`);
  }
  ff.stdin.end(); await done;
  process.stdout.write(`\r  frame ${frames}/${frames}\n`);

  const vo = [arg('voiceover', null), path.join(root, cfgVo.src)].filter(Boolean).map(p => path.resolve(p)).find(p => fs.existsSync(p));
  if (vo) { inputs.push(vo); console.log('Voiceover:', vo); } else console.log('Voiceover: none found (placeholder track left empty)');
  await browser.close();

  if (!inputs.length) fs.renameSync(silent, out);
  else {
    const a = ['-y', '-i', silent];
    inputs.forEach((f, i) => { if (f === vo && cfgVo.offset > 0) a.push('-itsoffset', String(cfgVo.offset)); a.push('-i', f); });
    if (inputs.length === 2) a.push('-filter_complex', `[1:a]volume=1[s];[2:a]volume=${cfgVo.volume}[v];[s][v]amix=inputs=2:duration=longest:normalize=0[a]`, '-map', '0:v', '-map', '[a]');
    else a.push('-map', '0:v', '-map', '1:a');
    a.push('-c:v', 'copy', '-c:a', 'aac', '-b:a', '192k', '-t', info.total.toFixed(3), '-movflags', '+faststart', out);
    run(a); fs.unlinkSync(silent); if (fs.existsSync(sfxWav)) fs.unlinkSync(sfxWav);
  }
  console.log('Done →', path.relative(process.cwd(), out));
})().catch(e => { console.error(e); process.exit(1); });
