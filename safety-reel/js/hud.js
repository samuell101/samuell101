/* ------------------------------------------------------------------
   HUD — the persistent typographic layer (progress segments, rule
   badge, keyword titles, opening hook). It never cuts, which helps the
   ten scenes read as one continuous film.
------------------------------------------------------------------ */
(function () {
  const { U, config: c } = Reel;
  const { group, prog, ease, clamp, op, place, win } = U;
  const C = c.palette;

  const tspans = line => line.split('*').map((s, i) => i % 2 ? `<tspan fill="${C.coral}">${s}</tspan>` : s).join('');

  Reel.Hud = function (g, TL) {
    const n = c.scenes.length, T = c.transition;
    group(g, `<defs><linearGradient id="hudScrim" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0" stop-color="#0D1220" stop-opacity=".82"/><stop offset=".6" stop-color="#0D1220" stop-opacity=".4"/><stop offset="1" stop-color="#0D1220" stop-opacity="0"/></linearGradient></defs>
      <rect width="1080" height="700" fill="url(#hudScrim)"/>`);

    // progress segments
    const segW = (952 - (n - 1) * 8) / n, segs = [];
    const segG = group(g, '');
    for (let i = 0; i < n; i++) {
      const x = 64 + i * (segW + 8);
      const s = group(segG, `<rect x="${x}" y="232" width="${segW}" height="8" rx="4" fill="#fff" opacity=".22"/><rect class="f" x="${x}" y="232" width="0" height="8" rx="4" fill="#fff"/>`);
      segs.push(s.querySelector('.f'));
    }

    // rule badge
    const badge = group(g, `<rect x="0" y="-25" width="182" height="50" rx="25" fill="${C.lavender}"/>
      <text x="24" y="10" font-size="26" fill="${C.purple}" letter-spacing="1.5">RULE <tspan class="num">01</tspan></text>
      <text x="198" y="9" font-size="24" fill="#fff" opacity=".55" font-weight="600">of 10</text>`);
    const num = badge.querySelector('.num');

    // keyword titles (one group per scene, two lines each)
    const titles = c.scenes.map(s => {
      const tg = group(g, '');
      return s.keyword.map((line, j) => group(tg, `<text x="64" y="${404 + j * 86}" font-size="72" fill="#fff" letter-spacing="-.5">${tspans(line)}</text>`));
    });

    // opening hook
    const hook = group(g, `
      <text x="0" y="0" font-size="330" fill="${C.coral}" text-anchor="middle" letter-spacing="-8">10</text>
      <text x="0" y="118" font-size="96" fill="#fff" text-anchor="middle">SAFETY RULES</text>
      <text x="0" y="192" font-size="46" fill="${C.cream}" text-anchor="middle" letter-spacing="3" font-weight="600">EVERY GIRL MUST KNOW</text>`);
    const HOOK = 1.15;                                   // seconds the hook stays up

    let lastNum = -1;
    function update(t) {
      const outro = TL.outroAt;
      // which rule are we on (switch mid-transition)
      let cur = 0;
      for (let i = 0; i < n; i++) if (t >= TL.marks[i].start) cur = i;
      if (cur !== lastNum) { num.textContent = String(cur + 1).padStart(2, '0'); lastNum = cur; }

      segs.forEach((f, i) => {
        const m = TL.marks[i];
        f.setAttribute('width', (segW * clamp((t - m.start) / m.duration)).toFixed(2));
      });

      const hookIn = prog(t, 0.05, 0.5, ease.back), hookOut = prog(t, HOOK - 0.3, HOOK, ease.in);
      place(hook, 540, 780 - hookOut * 120, 0.7 + 0.3 * hookIn);
      op(hook, Math.min(prog(t, 0.02, 0.25), 1 - hookOut));
      hook.style.display = t < HOOK ? '' : 'none';

      const endFade = 1 - prog(t, outro - 0.15, outro + 0.3);
      const badgeIn = prog(t, HOOK - 0.2, HOOK + 0.3, ease.out);
      const b = TL.marks[cur].start, pulse = cur ? win(t, b - 0.02, b + 0.4, 0.12, 0.28) : 0;
      place(badge, 64, 304 - (1 - badgeIn) * 30, 1 + pulse * 0.1);
      op(badge, badgeIn * endFade);

      titles.forEach((lines, i) => {
        const m = TL.marks[i];
        const tin = i === 0 ? HOOK - 0.05 : m.start - T / 2 + T * 0.55;
        const tout = i === n - 1 ? outro - 0.2 : m.start + m.duration - T / 2;
        lines.forEach((ln, j) => {
          const a = prog(t, tin + j * 0.09, tin + j * 0.09 + 0.5, ease.out);
          const o = prog(t, tout + j * 0.05, tout + j * 0.05 + T * 0.4, ease.in);
          const vis = a > 0 && o < 1;
          ln.style.display = vis ? '' : 'none';
          if (!vis) return;
          ln.setAttribute('transform', `translate(0 ${((1 - a) * 54 - o * 54).toFixed(2)})`);
          op(ln, Math.min(a * 1.4, 1) * (1 - o));
        });
      });
    }
    return { update };
  };
})();
