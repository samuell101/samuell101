/* ------------------------------------------------------------------
   AUDIO
   • Subtle synthesized sound effects, scheduled from the master timeline
     (footsteps, notifications, pin pop, car, café ambience, warning, SOS).
   • A voiceover PLACEHOLDER: the <audio id="voiceover"> element plays
     config.voiceover.src in sync if the file exists. No voice is ever
     synthesized here — record your own narration and drop it in.
   The same cue list renders offline to a .wav for the video export.
------------------------------------------------------------------ */
(function () {
  const { config: c } = Reel;

  /* cue sheet: [sceneId, offset seconds (scene-local), type, gain] */
  function cues(TL) {
    const list = [];
    const add = (id, off, type, g = 1, extra) => {
      const m = TL.marks.find(x => x.id === id);
      list.push(Object.assign({ t: m.start + off * (m.duration / (id === 'emergency' ? 4 : 3)), type, g }, extra));
    };
    [0.15, 0.6, 1.05, 1.5, 1.95, 2.4].forEach(o => add('night', o, 'step', 0.5));
    add('night', 1.3, 'notify', 0.6); add('night', 1.62, 'pop', 0.8); add('night', 2.15, 'tick', 0.6);
    [0.25, 0.6, 0.95].forEach(o => add('strangers', o, 'step', 0.6));
    [1.0, 1.15, 1.3].forEach(o => add('strangers', o, 'pop', 0.5)); add('strangers', 1.85, 'warn', 0.7);
    add('cafe', 0, 'ambience', 0.5, { dur: 3 }); add('cafe', 0.2, 'chime', 0.5); add('cafe', 2.05, 'clink', 0.5);
    [0.2, 0.65, 1.1].forEach(o => add('college', o, 'step', 0.45));
    [1.0, 1.1, 1.2, 1.3, 1.4].forEach(o => add('college', o, 'type', 0.35));
    add('college', 1.5, 'notify', 0.6); add('college', 2.3, 'notify', 0.45);
    add('cab', 0.25, 'car', 0.6, { dur: 1.2 }); add('cab', 1.6, 'type', 0.6); add('cab', 2.0, 'tick', 0.7); add('cab', 2.7, 'whoosh', 0.7, { dur: 0.7 });
    for (let o = 0.15; o < 2.6; o += 0.34) add('followed', o, 'step', 0.6);
    add('followed', 0.1, 'drone', 0.5, { dur: 2.0 }); add('followed', 1.7, 'ambience', 0.5, { dur: 1.5 });
    for (let o = 0; o < 3; o += 0.5) add('party', o, 'kick', 0.5);
    add('party', 0.95, 'pop', 0.5); add('party', 1.15, 'warn', 0.7); add('party', 2.05, 'tick', 0.6);
    add('sos', 0.35, 'type', 0.7); [0.9, 1.1, 1.3].forEach(o => add('sos', o, 'pop', 0.5));
    [1.6, 2.1, 2.6].forEach(o => add('sos', o, 'sos', 0.55));
    add('boundary', -0.3, 'whoosh', 0.4, { dur: 0.5 }); add('boundary', 0.35, 'thud', 0.8); add('boundary', 1.2, 'thud', 0.5);
    add('emergency', -0.35, 'whoosh', 0.7, { dur: 0.7 }); [0.7, 1.7].forEach(o => add('emergency', o, 'ring', 0.4));
    add('emergency', 2.8, 'tick', 0.6);
    list.push({ t: TL.outroAt + 0.55, type: 'whoosh', g: 0.4, dur: 0.6 }, { t: TL.outroAt + 1.2, type: 'chime', g: 0.6 });
    return list.sort((a, b) => a.t - b.t);
  }

  /* ---------- tiny synth ---------- */
  let noiseBuf = null;
  function noise(ctx) {
    if (noiseBuf && noiseBuf.sampleRate === ctx.sampleRate) return noiseBuf;
    const b = ctx.createBuffer(1, ctx.sampleRate * 2, ctx.sampleRate), d = b.getChannelData(0);
    let s = 1234567;
    for (let i = 0; i < d.length; i++) { s = (s * 1664525 + 1013904223) >>> 0; d[i] = s / 2147483648 - 1; }
    return (noiseBuf = b);
  }
  function tone(ctx, out, t, { f = 440, f2, dur = 0.15, type = 'sine', g = 0.2, a = 0.005 }) {
    const o = ctx.createOscillator(), v = ctx.createGain();
    o.type = type; o.frequency.setValueAtTime(f, t);
    if (f2) o.frequency.exponentialRampToValueAtTime(f2, t + dur);
    v.gain.setValueAtTime(0.0001, t); v.gain.exponentialRampToValueAtTime(g, t + a);
    v.gain.exponentialRampToValueAtTime(0.0001, t + dur);
    o.connect(v).connect(out); o.start(t); o.stop(t + dur + 0.05);
  }
  function hiss(ctx, out, t, { dur = 0.2, f = 1000, f2, q = 1, g = 0.2, kind = 'bandpass', a = 0.01, hold = 0 }) {
    const s = ctx.createBufferSource(), fl = ctx.createBiquadFilter(), v = ctx.createGain();
    s.buffer = noise(ctx); s.loop = true; fl.type = kind; fl.Q.value = q;
    fl.frequency.setValueAtTime(f, t); if (f2) fl.frequency.exponentialRampToValueAtTime(f2, t + dur);
    v.gain.setValueAtTime(0.0001, t); v.gain.exponentialRampToValueAtTime(g, t + a);
    if (hold) v.gain.setValueAtTime(g, t + hold);
    v.gain.exponentialRampToValueAtTime(0.0001, t + dur);
    s.connect(fl).connect(v).connect(out); s.start(t); s.stop(t + dur + 0.05);
  }
  const SFX = {
    step: (x, o, t, e) => { hiss(x, o, t, { dur: 0.09, f: 320, q: 0.8, g: 0.5 * e.g, kind: 'lowpass' }); tone(x, o, t, { f: 110, f2: 60, dur: 0.08, g: 0.25 * e.g }); },
    pop: (x, o, t, e) => tone(x, o, t, { f: 720, f2: 240, dur: 0.12, g: 0.3 * e.g }),
    notify: (x, o, t, e) => { tone(x, o, t, { f: 880, dur: 0.14, g: 0.2 * e.g }); tone(x, o, t + 0.11, { f: 1318, dur: 0.22, g: 0.2 * e.g }); },
    chime: (x, o, t, e) => { [1046, 1318, 1568].forEach((f, i) => tone(x, o, t + i * 0.09, { f, dur: 0.5, g: 0.14 * e.g })); },
    tick: (x, o, t, e) => { tone(x, o, t, { f: 660, dur: 0.1, g: 0.2 * e.g }); tone(x, o, t + 0.09, { f: 990, dur: 0.24, g: 0.22 * e.g }); },
    type: (x, o, t, e) => hiss(x, o, t, { dur: 0.04, f: 2600, q: 2, g: 0.25 * e.g }),
    clink: (x, o, t, e) => { tone(x, o, t, { f: 2400, dur: 0.25, g: 0.1 * e.g }); tone(x, o, t + 0.01, { f: 3300, dur: 0.18, g: 0.06 * e.g }); },
    warn: (x, o, t, e) => { [0, 0.16].forEach(d => tone(x, o, t + d, { f: 392, dur: 0.13, type: 'triangle', g: 0.3 * e.g })); },
    sos: (x, o, t, e) => { [0, 0.12, 0.24].forEach(d => tone(x, o, t + d, { f: 1175, dur: 0.08, g: 0.16 * e.g })); },
    thud: (x, o, t, e) => { tone(x, o, t, { f: 150, f2: 45, dur: 0.28, g: 0.5 * e.g }); hiss(x, o, t, { dur: 0.1, f: 500, g: 0.2 * e.g, kind: 'lowpass' }); },
    kick: (x, o, t, e) => tone(x, o, t, { f: 120, f2: 42, dur: 0.22, g: 0.3 * e.g }),
    ring: (x, o, t, e) => { [0, 0.4].forEach(d => { tone(x, o, t + d, { f: 440, dur: 0.3, g: 0.1 * e.g, a: 0.02 }); tone(x, o, t + d, { f: 480, dur: 0.3, g: 0.1 * e.g, a: 0.02 }); }); },
    whoosh: (x, o, t, e) => hiss(x, o, t, { dur: e.dur || 0.6, f: 300, f2: 3200, q: 1.2, g: 0.35 * e.g, a: (e.dur || 0.6) * 0.5 }),
    car: (x, o, t, e) => { hiss(x, o, t, { dur: e.dur, f: 900, f2: 180, q: 0.7, g: 0.3 * e.g, a: 0.3, kind: 'lowpass' }); tone(x, o, t, { f: 95, f2: 60, dur: e.dur, type: 'sawtooth', g: 0.05 * e.g, a: 0.2 }); },
    ambience: (x, o, t, e) => hiss(x, o, t, { dur: e.dur, f: 700, q: 0.4, g: 0.07 * e.g, a: 0.4, hold: e.dur - 0.6 }),
    drone: (x, o, t, e) => { tone(x, o, t, { f: 58, dur: e.dur, type: 'sawtooth', g: 0.06 * e.g, a: 0.5 }); tone(x, o, t, { f: 61.5, dur: e.dur, type: 'sine', g: 0.1 * e.g, a: 0.5 }); }
  };

  function schedule(ctx, out, list, fromT, at, speed) {
    for (const e of list) {
      if (e.t < fromT - 0.01) continue;
      SFX[e.type](ctx, out, at + (e.t - fromT) / speed, e);
    }
  }

  /* ---------- live playback ---------- */
  let ctx = null, session = null, list = null, enabled = c.sfx.enabled;
  const vo = () => document.getElementById('voiceover');
  let voReady = false;

  function init(TL) {
    list = cues(TL);
    const el = vo();
    if (el && c.voiceover.src) {
      el.addEventListener('canplay', () => { voReady = true; status('Narration loaded: ' + (el.dataset.name || c.voiceover.src)); });
      el.addEventListener('error', () => { voReady = false; });
      el.volume = c.voiceover.volume; el.src = c.voiceover.src;
    }
  }
  function status(s) { const n = document.getElementById('vo-status'); if (n) n.textContent = s; }
  function loadVoiceover(file) {
    const el = vo(); el.dataset.name = file.name; el.src = URL.createObjectURL(file);
  }
  function stop() {
    if (session) { try { session.gain.value = 0; session.disconnect(); } catch (e) {} session = null; }
    const el = vo(); if (el && !el.paused) el.pause();
  }
  function play(t, speed) {
    stop();
    if (enabled) {
      try {
        ctx = ctx || new (window.AudioContext || window.webkitAudioContext)();
        if (ctx.state === 'suspended') ctx.resume();
        session = ctx.createGain(); session.gain.value = c.sfx.volume; session.connect(ctx.destination);
        schedule(ctx, session, list, t, ctx.currentTime + 0.03, speed);
      } catch (e) { /* audio unavailable — animation still plays */ }
    }
    const el = vo();
    if (el && voReady) {
      const vt = t - c.voiceover.offset;
      if (vt >= 0 && vt < (el.duration || 1e9)) { el.currentTime = vt; el.playbackRate = speed; el.play().catch(() => {}); }
    }
  }

  /* ---------- offline render (for export / download) ---------- */
  async function renderWav(TL) {
    const sr = 44100, len = Math.ceil((TL.total + 0.5) * sr);
    const off = new OfflineAudioContext(2, len, sr), g = off.createGain();
    g.gain.value = c.sfx.volume; g.connect(off.destination);
    schedule(off, g, cues(TL), 0, 0, 1);
    const buf = await off.startRendering();
    const L = buf.getChannelData(0), R = buf.getChannelData(1), dv = new DataView(new ArrayBuffer(44 + len * 4));
    const w = (o, s) => { for (let i = 0; i < s.length; i++) dv.setUint8(o + i, s.charCodeAt(i)); };
    w(0, 'RIFF'); dv.setUint32(4, 36 + len * 4, true); w(8, 'WAVEfmt '); dv.setUint32(16, 16, true); dv.setUint16(20, 1, true);
    dv.setUint16(22, 2, true); dv.setUint32(24, sr, true); dv.setUint32(28, sr * 4, true); dv.setUint16(32, 4, true); dv.setUint16(34, 16, true);
    w(36, 'data'); dv.setUint32(40, len * 4, true);
    for (let i = 0; i < len; i++) {
      dv.setInt16(44 + i * 4, Math.max(-1, Math.min(1, L[i])) * 32767, true);
      dv.setInt16(46 + i * 4, Math.max(-1, Math.min(1, R[i])) * 32767, true);
    }
    return dv.buffer;
  }
  async function wavBase64(TL) {
    const u8 = new Uint8Array(await renderWav(TL)); let s = '';
    for (let i = 0; i < u8.length; i += 0x8000) s += String.fromCharCode.apply(null, u8.subarray(i, i + 0x8000));
    return btoa(s);
  }

  Reel.audio = { init, play, stop, loadVoiceover, renderWav, wavBase64, setEnabled: v => { enabled = v; }, cues };
})();
