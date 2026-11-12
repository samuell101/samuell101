// Synthesizes the reel's music bed + SFX (no voiceover) to soundtrack.wav.
// Deterministic; no samples needed.  Usage: node audio.mjs [out.wav]
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const here = path.dirname(fileURLToPath(import.meta.url));
const SR = 48000, DUR = 45, N = SR * DUR;
const L = new Float32Array(N), R = new Float32Array(N);
const TAU = Math.PI * 2;
const clamp = (v, a = 0, b = 1) => Math.max(a, Math.min(b, v));
const seg = (t, a, b) => clamp((t - a) / (b - a));
let seed = 1; const rnd = () => (seed = (seed * 16807) % 2147483647) / 2147483647;

function add(t0, len, fn, pan = 0, gain = 1) {
  const i0 = Math.max(0, Math.floor(t0 * SR)), i1 = Math.min(N, Math.floor((t0 + len) * SR));
  const gl = gain * Math.cos((pan + 1) * Math.PI / 4), gr = gain * Math.sin((pan + 1) * Math.PI / 4);
  for (let i = i0; i < i1; i++) { const v = fn((i - i0) / SR, i / SR); L[i] += v * gl; R[i] += v * gr; }
}
const env = (x, a, d) => x < a ? x / a : Math.exp(-(x - a) / d);

/* ---- music bed ---- */
// level automation for the drone/pad per scene
function bedLevel(t) {
  let v = 0.55 * seg(t, 0, 1.2);
  if (t > 2.6 && t < 3.6) v *= 0.08 + 0.92 * seg(t, 3.2, 3.6);  // sudden drop on the freeze
  if (t > 25.0 && t < 25.7) v *= 0.05;                          // silence before he walks away
  if (t > 37) v *= 1 + 1.2 * seg(t, 37, 42.5);                   // ending build
  v *= 1 - seg(t, 44.0, 45);
  return v;
}
const chords = [ // root freqs (Hz) per section — minor, mysterious → warmer
  [0, [55, 82.4, 110, 130.8]], [13, [49, 73.4, 98, 116.5]], [21, [55, 82.4, 110, 130.8]],
  [29, [43.7, 65.4, 87.3, 110]], [37, [49, 73.4, 98, 123.5]], [41, [55, 82.4, 110, 138.6]],
];
const chordAt = t => { let c = chords[0][1]; for (const [s, f] of chords) if (t >= s) c = f; return c; };
const ph = [0, 0, 0, 0, 0, 0, 0, 0];
for (let i = 0; i < N; i++) {
  const t = i / SR, lvl = bedLevel(t), ch = chordAt(t);
  let l = 0, r = 0;
  for (let k = 0; k < 4; k++) {
    const det = 1 + (k % 2 ? 0.002 : -0.002);
    ph[k] += TAU * ch[k] * det / SR; ph[k + 4] += TAU * ch[k] * 2.003 / SR;
    const lfo = 0.6 + 0.4 * Math.sin(TAU * (0.07 + k * 0.03) * t + k);
    const w = Math.sin(ph[k]) * (k === 0 ? 0.5 : 0.22) * lfo + Math.sin(ph[k + 4]) * 0.05 * lfo * (t > 37 ? 1 + 2 * seg(t, 37, 43) : 1);
    if (k % 2) l += w; else r += w; l += w * 0.5; r += w * 0.5;
  }
  L[i] += l * lvl * 0.5; R[i] += r * lvl * 0.5;
}

/* ---- SFX ---- */
// crowd chatter 0–2.6s (band-limited noise with syllable bursts), hard cut on freeze
{ let lp = 0, lp2 = 0;
  add(0, 2.6, (x, t) => { const n = rnd() * 2 - 1; lp += (n - lp) * 0.08; lp2 += (lp - lp2) * 0.3;
    const syl = 0.5 + 0.5 * Math.sin(TAU * 5.3 * t) * Math.sin(TAU * 3.1 * t + 1);
    return (lp - lp2) * 2.2 * syl * seg(t, 0, 0.4); }, 0, 0.9); }
// whooshes at transitions
function whoosh(t0, len = 0.9, g = 0.35, pan = 0) { let lp = 0; add(t0 - len * 0.6, len, x => { const k = x / len; lp += ((rnd() * 2 - 1) - lp) * (0.02 + 0.2 * Math.sin(Math.PI * k)); return lp * Math.sin(Math.PI * k) ** 2 * 3; }, pan, g); }
[2.6, 5.0, 13.0, 16.8, 29.0, 37.0].forEach((t, i) => whoosh(t, 0.9, 0.3, i % 2 ? 0.4 : -0.4));
// soft impact
function impact(t0, g = 0.8, f = 50) { add(t0, 1.6, x => Math.sin(TAU * f * x * (1 - x * 0.3)) * env(x, 0.005, 0.35) + (rnd() * 2 - 1) * env(x, 0.001, 0.03) * 0.5, 0, g); }
impact(2.6, 0.6, 42);
// tension tone during the argument (5–9s)
add(5.6, 3.6, (x, t) => Math.sin(TAU * (440 + 30 * x) * x) * 0.04 * (0.5 + 0.5 * Math.sin(TAU * 7 * x)) * seg(x, 0, 2) * (1 - seg(x, 3.2, 3.6)), 0.2, 1);
// heartbeat during the slow-down (8.3–10.4)
for (let t = 8.35; t < 10.4; t += 0.86) { add(t, 0.4, x => Math.sin(TAU * 55 * x) * env(x, 0.01, 0.07), 0, 0.9); add(t + 0.2, 0.4, x => Math.sin(TAU * 48 * x) * env(x, 0.01, 0.08), 0, 0.6); }
// fist clench (cloth/leather creak) at 7.4, breath out 10.0
{ let lp = 0; add(7.3, 0.5, x => { lp += ((rnd() * 2 - 1) - lp) * 0.25; return lp * env(x, 0.05, 0.12); }, 0.3, 0.6); }
{ let lp = 0; add(9.6, 1.4, x => { lp += ((rnd() * 2 - 1) - lp) * 0.05; return lp * Math.sin(Math.PI * x / 1.4) * 1.6; }, 0, 0.5); }
// footsteps
function steps(t0, t1, every, pan, g = 0.35) { for (let t = t0; t < t1; t += every) add(t, 0.15, x => (rnd() * 2 - 1) * env(x, 0.002, 0.02) + Math.sin(TAU * 90 * x) * env(x, 0.002, 0.04), pan, g); }
steps(11.2, 12.9, 0.5, 0.3);
steps(27.6, 29.6, 0.5, 0.3);
steps(29.0, 30.4, 0.48, -0.3, 0.3);
steps(37.2, 42.5, 0.56, 0, 0.25);
// planning: steady rhythmic pulse 17.6–21
for (let t = 17.6; t < 20.9; t += 0.5) add(t, 0.3, x => Math.sin(TAU * 60 * x * (1 - x)) * env(x, 0.003, 0.09), 0, 0.5 * seg(t, 17.6, 18.6));
// phone tap 17.4 + screen off blip
add(17.37, 0.06, x => (rnd() * 2 - 1) * env(x, 0.001, 0.006), 0.2, 0.7);
add(17.44, 0.15, x => Math.sin(TAU * 1200 * x) * env(x, 0.002, 0.03) * 0.3, 0.2, 0.6);
// time-lapse scribbles 18.4–20.4
{ let lp = 0; add(18.4, 2.0, (x, t) => { lp += ((rnd() * 2 - 1) - lp) * 0.6; return lp * (0.5 + 0.5 * Math.sin(TAU * 14 * x)) * 0.25; }, 0.1, 0.6); }
// notebook close 20.85
add(20.85, 0.4, x => (rnd() * 2 - 1) * env(x, 0.001, 0.03) + Math.sin(TAU * 110 * x) * env(x, 0.002, 0.06), 0, 0.7);
// table slam 21.28
impact(21.28, 0.9, 58);
add(21.28, 0.2, x => (rnd() * 2 - 1) * env(x, 0.001, 0.04), 0, 0.7);
// laughter-ish bursts 22–26.6 (filtered noise pulses), cut to silence at 25
{ let lp = 0; add(22.0, 3.0, x => { lp += ((rnd() * 2 - 1) - lp) * 0.12; return lp * Math.max(0, Math.sin(TAU * 6 * x)) ** 2 * 1.2; }, -0.4, 0.45); }
// shoulder push 24.1
add(24.1, 0.25, x => (rnd() * 2 - 1) * env(x, 0.004, 0.05), 0.2, 0.5);
// listening scene: soft atmospheric texture 29–37
{ let lp = 0; add(29.0, 8.0, x => { lp += ((rnd() * 2 - 1) - lp) * 0.01; return lp * 2 * Math.sin(Math.PI * x / 8); }, 0, 0.35); }
add(35.2, 1.6, x => Math.sin(TAU * 880 * x) * env(x, 0.01, 0.4) * 0.15 + Math.sin(TAU * 1320 * x) * env(x, 0.01, 0.3) * 0.08, 0.2, 0.7); // "understanding" chime
add(36.45, 0.3, x => (rnd() * 2 - 1) * env(x, 0.001, 0.025), 0, 0.5); // notebook close
// ending: rising swell + two cinematic hits on the final lines
add(39.0, 3.6, x => { const f = 110 + 110 * (x / 3.6); return Math.sin(TAU * f * x) * 0.06 * (x / 3.6) ** 2; }, 0, 1);
impact(42.75, 0.8, 46); impact(43.45, 1.0, 41);
add(43.45, 1.5, x => Math.sin(TAU * 220 * x) * env(x, 0.01, 0.6) * 0.12 + Math.sin(TAU * 330 * x) * env(x, 0.01, 0.6) * 0.08, 0, 1);

/* ---- master: leave headroom for voiceover, normalize to -6 dBFS ---- */
let peak = 0; for (let i = 0; i < N; i++) peak = Math.max(peak, Math.abs(L[i]), Math.abs(R[i]));
const g = 0.5 / peak;
const buf = Buffer.alloc(44 + N * 4);
buf.write('RIFF', 0); buf.writeUInt32LE(36 + N * 4, 4); buf.write('WAVEfmt ', 8);
buf.writeUInt32LE(16, 16); buf.writeUInt16LE(1, 20); buf.writeUInt16LE(2, 22); buf.writeUInt32LE(SR, 24);
buf.writeUInt32LE(SR * 4, 28); buf.writeUInt16LE(4, 32); buf.writeUInt16LE(16, 34); buf.write('data', 36); buf.writeUInt32LE(N * 4, 40);
for (let i = 0; i < N; i++) {
  const fade = Math.min(1, i / 2400, (N - i) / 4800);
  buf.writeInt16LE(Math.round(clamp(L[i] * g * fade, -1, 1) * 32767), 44 + i * 4);
  buf.writeInt16LE(Math.round(clamp(R[i] * g * fade, -1, 1) * 32767), 46 + i * 4);
}
const out = path.resolve(process.argv[2] || path.join(here, 'soundtrack.wav'));
fs.writeFileSync(out, buf);
console.log('wrote', out);
