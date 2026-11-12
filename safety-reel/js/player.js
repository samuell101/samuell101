/* ------------------------------------------------------------------
   PLAYER — the single master timeline.
   render(t) is a pure function of time: every scene, transition and HUD
   element is posed from `t` alone. That makes scrubbing, any playback
   speed and frame-exact export behave identically.
------------------------------------------------------------------ */
(function () {
  const { U, config: c } = Reel;
  const { svg, clamp, show } = U;
  const TL = Reel.TL = Reel.buildTimeline();
  const T = c.transition, last = TL.marks.length - 1;
  const $ = id => document.getElementById(id);

  $('defs').innerHTML = Reel.P.defs;
  const scenesG = $('scenes'), fxG = $('fx');

  /* build scenes */
  const scenes = TL.marks.map((m, i) => {
    const wrap = svg('g', { class: 'scene', id: 'scene-' + (i + 1) }, scenesG);
    const camG = svg('g', { class: 'cam' }, wrap);
    const inst = Reel.sceneDefs[i] ? Reel.sceneDefs[i](camG, m) : { update() {} };
    return Object.assign(inst, { wrap, cam: camG, mark: m, base: inst.base || 3 });
  });
  Reel.S = scenes;
  const transitions = (Reel.transitionDefs || []).map((def, i) => {
    const g = svg('g', { class: 'fx fx-' + (i + 1) }, fxG);
    return { g, run: def(g, scenes[i], scenes[i + 1]) };
  });
  const hud = Reel.Hud($('hud'), TL);

  function render(t) {
    t = clamp(t, 0, TL.total);
    scenes.forEach((s, i) => {
      const m = s.mark;
      const a = i === 0 ? -1 : m.start - T / 2, b = i === last ? 1e9 : m.start + m.duration + T / 2;
      const vis = t >= a && t < b;
      show(s.wrap, vis);
      if (!vis) return;
      s.wrap.removeAttribute('transform'); s.wrap.removeAttribute('opacity'); s.wrap.removeAttribute('clip-path');
      const lt = t - m.start, k = s.base / m.duration;
      s.update(lt * k, {
        t, lt, k,
        pin: i === 0 ? 1 : clamp((t - (m.start - T / 2)) / T),            // incoming transition progress
        pout: i === last ? 0 : clamp((t - (m.start + m.duration - T / 2)) / T), // outgoing transition progress
        outro: t - TL.outroAt
      });
    });
    transitions.forEach((tr, i) => {
      const b = TL.marks[i].start + TL.marks[i].duration, p = (t - (b - T / 2)) / T;
      const on = p >= 0 && p < 1;
      show(tr.g, on);
      if (on) tr.run(p, scenes[i], scenes[i + 1], t);
    });
    hud.update(t);
  }

  /* ---------------- transport ---------------- */
  let time = 0, playing = false, speed = 1, raf = 0, lastNow = 0, loop = false;
  const isRender = /[?&]render=1/.test(location.search);
  if (isRender) document.body.classList.add('render');

  function ui() {
    if (isRender) return;
    $('time').textContent = `${time.toFixed(2)} / ${TL.total.toFixed(2)} s`;
    $('tl-head').style.left = (time / TL.total * 100) + '%';
    let cur = 0; TL.marks.forEach((m, i) => { if (time >= m.start) cur = i; });
    document.querySelectorAll('#tl-scenes span, #scene-list button').forEach(e => e.classList.toggle('on', +e.dataset.i === cur));
    $('vo-line').textContent = time >= TL.outroAt ? '“' + c.ending.vo + '”' : `${cur + 1}. “${c.scenes[cur].vo}”`;
    $('btn-play').textContent = playing ? 'Pause' : (time >= TL.total - 0.01 ? 'Replay' : 'Play');
    $('big-play').classList.toggle('hidden', playing || time > 0.01);
  }
  function frame(now) {
    if (!playing) return;
    time += (now - lastNow) / 1000 * speed; lastNow = now;
    if (time >= TL.total) {
      if (loop) { time = 0; Reel.audio.play(0, speed); }
      else { time = TL.total; playing = false; Reel.audio.stop(); }
    }
    render(time); ui();
    if (playing) raf = requestAnimationFrame(frame);
  }
  function play() {
    if (playing) return;
    if (time >= TL.total - 0.01) time = 0;
    playing = true; lastNow = performance.now();
    Reel.audio.play(time, speed);
    raf = requestAnimationFrame(frame); ui();
  }
  function pause() { playing = false; cancelAnimationFrame(raf); Reel.audio.stop(); ui(); }
  function seek(t, keepPlaying) {
    const was = playing && keepPlaying; pause();
    time = clamp(t, 0, TL.total); render(time); ui();
    if (was) play();
  }
  Reel.player = { play, pause, seek, render, get time() { return time; }, get playing() { return playing; } };
  window.__seek = t => { time = t; render(t); };                      // used by tools/render.js
  window.__info = { total: TL.total, fps: c.fps, width: c.width, height: c.height };

  Reel.audio.init(TL);
  render(0);

  if (!isRender) {
    // timeline + scene list
    TL.marks.forEach((m, i) => {
      const s = document.createElement('span'); s.dataset.i = i; s.textContent = i + 1;
      s.style.flex = (i === last ? m.duration + c.outro : m.duration) + ' 0 0'; $('tl-scenes').appendChild(s);
      const li = document.createElement('li'), b = document.createElement('button');
      b.dataset.i = i; b.innerHTML = `<b>${String(i + 1).padStart(2, '0')}</b>${c.scenes[i].label}`;
      b.onclick = () => seek(m.start + 0.001, true); li.appendChild(b); $('scene-list').appendChild(li);
    });
    const tl = $('timeline');
    const scrub = e => { const r = tl.getBoundingClientRect(); seek(clamp((e.clientX - r.left) / r.width) * TL.total); };
    tl.addEventListener('pointerdown', e => { tl.setPointerCapture(e.pointerId); scrub(e); tl.onpointermove = scrub; });
    tl.addEventListener('pointerup', () => { tl.onpointermove = null; });
    $('btn-play').onclick = () => (playing ? pause() : play());
    $('big-play').onclick = play;
    $('stage').onclick = () => (playing ? pause() : play());
    $('btn-restart').onclick = () => { seek(0); play(); };
    $('sel-speed').onchange = e => { speed = +e.target.value; if (playing) { pause(); play(); } };
    $('chk-sfx').onchange = e => { Reel.audio.setEnabled(e.target.checked); if (playing) { pause(); play(); } };
    $('chk-loop').onchange = e => { loop = e.target.checked; };
    $('vo-file').onchange = e => { if (e.target.files[0]) Reel.audio.loadVoiceover(e.target.files[0]); };
    $('btn-sfx-wav').onclick = async () => {
      const a = document.createElement('a');
      a.href = URL.createObjectURL(new Blob([await Reel.audio.renderWav(TL)], { type: 'audio/wav' }));
      a.download = 'safety-reel-sfx.wav'; a.click();
    };
    document.addEventListener('keydown', e => {
      if (e.target.tagName === 'SELECT' || e.target.tagName === 'INPUT') return;
      if (e.code === 'Space') { e.preventDefault(); playing ? pause() : play(); }
      else if (e.key === 'ArrowRight') seek(time + 1 / c.fps);
      else if (e.key === 'ArrowLeft') seek(time - 1 / c.fps);
      else if (e.key === 'r' || e.key === 'R') { seek(0); play(); }
      else if (/^[0-9]$/.test(e.key)) seek(TL.marks[e.key === '0' ? 9 : +e.key - 1].start + 0.001, true);
    });
    ui();
  }
})();
