/* ------------------------------------------------------------------
   HUD — the persistent typographic layer (progress segments, numbered
   scene label as in the storyboard, opening hook). It never cuts, which
   helps the ten scenes read as one continuous film.
------------------------------------------------------------------ */
(function () {
  const { U, config: c } = Reel;
  const { group, prog, ease, clamp, op, place } = U;
  const C = c.palette;

  Reel.Hud = function (g, TL) {
    const n = c.scenes.length, T = c.transition;
    group(g, `<defs><linearGradient id="hudScrim" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0" stop-color="#0D1220" stop-opacity=".82"/><stop offset=".6" stop-color="#0D1220" stop-opacity=".4"/><stop offset="1" stop-color="#0D1220" stop-opacity="0"/></linearGradient></defs>
      <rect width="1080" height="640" fill="url(#hudScrim)"/>`);

    // progress segments
    const segW = (952 - (n - 1) * 8) / n, segs = [];
    for (let i = 0; i < n; i++) {
      const x = 64 + i * (segW + 8);
      const s = group(g, `<rect x="${x}" y="232" width="${segW}" height="8" rx="4" fill="#fff" opacity=".22"/><rect class="f" x="${x}" y="232" width="0" height="8" rx="4" fill="#fff"/>`);
      segs.push(s.querySelector('.f'));
    }

    // numbered scene labels: [ n ] LABEL
    const labels = c.scenes.map((s, i) => {
      const len = s.label.replace(/&amp;/g, '&').length, w = 130 + len * 38;
      const tg = group(g, `<g class="pill"><g filter="url(#shadow)"><rect x="-10" y="-48" width="${w}" height="96" rx="48" fill="#3B1F6B" stroke="#fff" stroke-width="4"/></g>
        <text x="78" y="19" font-size="52" fill="#fff" letter-spacing="1">${s.label}</text></g>
        <g class="num"><circle r="60" fill="#EBC4FF" stroke="#fff" stroke-width="5"/><text x="0" y="23" font-size="${i === 9 ? 58 : 66}" fill="#3B1F6B" text-anchor="middle">${i + 1}</text></g>`);
      return { tg, pill: tg.querySelector('.pill'), num: tg.querySelector('.num') };
    });

    // opening hook
    const hook = group(g, `
      <text x="0" y="0" font-size="330" fill="${C.coral}" text-anchor="middle" letter-spacing="-8">10</text>
      <text x="0" y="118" font-size="96" fill="#fff" text-anchor="middle">SAFETY RULES</text>
      <text x="0" y="192" font-size="46" fill="${C.cream}" text-anchor="middle" letter-spacing="3" font-weight="600">EVERY GIRL MUST KNOW</text>`);
    const HOOK = 1.15;                                   // seconds the hook stays up

    function update(t) {
      const outro = TL.outroAt;
      segs.forEach((f, i) => {
        const m = TL.marks[i];
        f.setAttribute('width', (segW * clamp((t - m.start) / m.duration)).toFixed(2));
      });

      const hookIn = prog(t, 0.05, 0.5, ease.back), hookOut = prog(t, HOOK - 0.3, HOOK, ease.in);
      place(hook, 540, 780 - hookOut * 120, 0.7 + 0.3 * hookIn);
      op(hook, Math.min(prog(t, 0.02, 0.25), 1 - hookOut));
      hook.style.display = t < HOOK ? '' : 'none';

      labels.forEach((L, i) => {
        const m = TL.marks[i];
        const tin = i === 0 ? HOOK - 0.1 : m.start - T / 2 + T * 0.5;
        const tout = i === n - 1 ? outro - 0.2 : m.start + m.duration - T / 2;
        const a = prog(t, tin, tin + 0.45, ease.back), b = prog(t, tin + 0.1, tin + 0.6, ease.out);
        const o = prog(t, tout, tout + T * 0.42, ease.in);
        const vis = a > 0 && o < 1;
        L.tg.style.display = vis ? '' : 'none';
        if (!vis) return;
        place(L.tg, 126, 356 - o * 60, 1);
        op(L.tg, 1 - o);
        L.num.setAttribute('transform', `scale(${Math.max(0.001, a).toFixed(3)})`);
        L.pill.setAttribute('transform', `translate(${(-(1 - b) * 70).toFixed(1)} 0)`); op(L.pill, b);
      });
    }
    return { update };
  };
})();
