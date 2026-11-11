/* Small maths / easing / SVG helpers shared by every module. */
(function () {
  const NS = 'http://www.w3.org/2000/svg';
  const clamp = (v, a = 0, b = 1) => Math.min(b, Math.max(a, v));
  const lerp = (a, b, t) => a + (b - a) * t;

  /* CSS-style cubic-bezier(x1,y1,x2,y2) easing, solved numerically. */
  function bezier(x1, y1, x2, y2) {
    const cx = 3 * x1, bx = 3 * (x2 - x1) - cx, ax = 1 - cx - bx;
    const cy = 3 * y1, by = 3 * (y2 - y1) - cy, ay = 1 - cy - by;
    const fx = t => ((ax * t + bx) * t + cx) * t;
    const fy = t => ((ay * t + by) * t + cy) * t;
    const dfx = t => (3 * ax * t + 2 * bx) * t + cx;
    return function (x) {
      if (x <= 0) return 0;
      if (x >= 1) return 1;
      let t = x;
      for (let i = 0; i < 6; i++) {
        const d = dfx(t);
        if (Math.abs(d) < 1e-6) break;
        t -= (fx(t) - x) / d;
      }
      return fy(clamp(t));
    };
  }

  const ease = {
    io: bezier(0.65, 0, 0.35, 1),        // smooth in-out
    out: bezier(0.16, 1, 0.3, 1),        // expo-ish out
    in: bezier(0.7, 0, 0.84, 0),         // strong in
    soft: bezier(0.4, 0, 0.2, 1),        // material standard
    back: bezier(0.34, 1.56, 0.64, 1),   // overshoot (pop)
    lin: x => clamp(x)
  };

  /* progress of t through [a,b], clamped 0..1, optionally eased */
  const prog = (t, a, b, e) => {
    const p = clamp((t - a) / (b - a));
    return e ? e(p) : p;
  };
  /* 0→1→0 window: rises over [a,a+r], falls over [b-f,b] */
  const win = (t, a, b, r = 0.2, f = r) => Math.min(prog(t, a, a + r), 1 - prog(t, b - f, b));

  function svg(tag, attrs, parent) {
    const e = document.createElementNS(NS, tag);
    if (attrs) for (const k in attrs) e.setAttribute(k, attrs[k]);
    if (parent) parent.appendChild(e);
    return e;
  }
  /* group with markup */
  function group(parent, markup, attrs) {
    const g = svg('g', attrs, parent);
    if (markup) g.innerHTML = markup;
    return g;
  }
  const show = (el, on) => { el.style.display = on ? '' : 'none'; };
  const tf = (el, s) => el.setAttribute('transform', s);
  const op = (el, v) => el.setAttribute('opacity', clamp(v).toFixed(3));
  /* translate + uniform scale about the element's own origin */
  const place = (el, x, y, s = 1, r = 0) =>
    el.setAttribute('transform', `translate(${x.toFixed(2)} ${y.toFixed(2)}) rotate(${r.toFixed(2)}) scale(${s.toFixed(4)})`);
  /* camera: scale about a pivot, then pan */
  const cam = (el, s, px, py, dx = 0, dy = 0) =>
    el.setAttribute('transform',
      `translate(${(px + dx - px * s).toFixed(2)} ${(py + dy - py * s).toFixed(2)}) scale(${s.toFixed(4)})`);
  const camPt = (x, y, s, px, py, dx = 0, dy = 0) => [px + dx + (x - px) * s, py + dy + (y - py) * s];

  /* deterministic pseudo-random */
  function rng(seed) {
    let s = seed >>> 0;
    return () => ((s = (s * 1664525 + 1013904223) >>> 0) / 4294967296);
  }
  const mix = (a, b, t) => {           // blend two numeric pose objects
    const o = {};
    for (const k in a) o[k] = a[k];
    for (const k in b) {
      const x = a[k], y = b[k];
      if (typeof y === 'number' && typeof x === 'number') o[k] = lerp(x, y, t);
      else if (Array.isArray(y) && Array.isArray(x)) o[k] = [lerp(x[0], y[0], t), lerp(x[1], y[1], t)];
      else o[k] = t < 0.5 && x !== undefined ? x : y;
    }
    return o;
  };

  window.Reel = window.Reel || {};
  Reel.U = { NS, clamp, lerp, bezier, ease, prog, win, svg, group, show, tf, op, place, cam, camPt, rng, mix };
  Reel.sceneDefs = [];
  Reel.defineScene = (index, build) => { Reel.sceneDefs[index] = build; };
})();
