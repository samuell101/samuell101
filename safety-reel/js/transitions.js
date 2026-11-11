/* ------------------------------------------------------------------
   TRANSITIONS — nine match-cuts. Each one animates the outgoing scene
   (A) and the incoming scene (B) together while a single "hero" object
   travels from its exact position in A to its exact position in B.
   p runs 0 → 1 across config.transition seconds.
------------------------------------------------------------------ */
(function () {
  const { U, P, config: c } = Reel;
  const { group, prog, ease, lerp, place, op, show, clamp } = U;
  const C = c.palette, W = 1080, H = 1920;
  const defs = Reel.transitionDefs = [];
  const L2 = (a, b, t) => [lerp(a[0], b[0], t), lerp(a[1], b[1], t)];

  /* 1 → 2  location pin expands and becomes the stranger's profile icon */
  defs[0] = function (g, A, B) {
    group(g, `<defs><clipPath id="t1clip"><circle r="10"/></clipPath></defs>`);
    const clip = g.querySelector('#t1clip circle');
    const halo = group(g, `<circle r="50" fill="none" stroke="${C.coral}" stroke-width="10" opacity=".6"/>`);
    const pin = group(g, P.pin() + `<g class="glyph" transform="scale(.986)">${P.profileGlyph()}</g>`);
    const tail = pin.querySelector('.pin-tail'), dot = pin.querySelector('.pin-dot'), glyph = pin.querySelector('.glyph');
    return function (p) {
      const m = prog(p, 0, 0.5, ease.io), pos = L2(A.pinPos, B.avatarPos, m), s = lerp(1, 50 / 34, m);
      place(pin, pos[0], pos[1] - Math.sin(m * Math.PI) * 60, s);
      const py = pos[1] - Math.sin(m * Math.PI) * 60;
      tail.setAttribute('transform', `scale(${(1 - prog(p, 0, 0.3, ease.io)).toFixed(3)})`);
      op(dot, 1 - prog(p, 0.12, 0.34)); op(glyph, prog(p, 0.26, 0.48));
      const r = p < 0.42 ? 34 * s - 1.5 : lerp(48.5, 2300, Math.pow(prog(p, 0.42, 1), 2.2));
      clip.setAttribute('cx', pos[0]); clip.setAttribute('cy', py); clip.setAttribute('r', r.toFixed(1));
      B.wrap.setAttribute('clip-path', 'url(#t1clip)');
      place(halo, pos[0], py, r / 50); op(halo, prog(p, 0.42, 0.5) * (1 - prog(p, 0.6, 0.95)));
    };
  };

  /* 2 → 3  profile card flips over into the café invitation / sign (camera pans on) */
  defs[1] = function (g, A, B) {
    const cardA = group(g, `<g filter="url(#shadow)">${P.profileCard()}</g>`);
    const cardB = group(g, `<g filter="url(#shadow)">${P.cafeSign()}</g>`);
    return function (p) {
      const e = ease.io(p);
      A.wrap.setAttribute('transform', `translate(${(-W * e).toFixed(1)} 0)`);
      B.wrap.setAttribute('transform', `translate(${(W * (1 - e)).toFixed(1)} 0)`);
      const pos = L2(A.cardPos, B.signPos, e), flip = Math.cos(p * Math.PI), lift = Math.sin(p * Math.PI);
      const which = p < 0.5 ? cardA : cardB;
      show(cardA, p < 0.5); show(cardB, p >= 0.5);
      which.setAttribute('transform', `translate(${pos[0].toFixed(1)} ${(pos[1] - lift * 46).toFixed(1)}) rotate(${(-6 * lift).toFixed(2)}) scale(${(Math.max(0.02, Math.abs(flip)) * (1 + lift * 0.1)).toFixed(3)} ${(1 + lift * 0.1).toFixed(3)})`);
    };
  };

  /* 3 → 4  coffee-cup rim lifts off, becomes the college clock (time passes) */
  defs[2] = function (g, A, B) {
    const clock = group(g, `<g filter="url(#shadow)">${P.clock()}</g><circle class="coffee" r="94" fill="#6B4630"/>`);
    const face = clock.querySelector('.clock-face'), coffee = clock.querySelector('.coffee');
    const hh = clock.querySelector('.hh'), mh = clock.querySelector('.mh');
    clock.insertBefore(coffee, null);
    return function (p) {
      const rim = A.rim(), m = prog(p, 0, 0.55, ease.io), n = prog(p, 0.55, 1, ease.io);
      const mid = [540, 960];
      const pos = n > 0 ? L2(mid, B.clockPos, n) : L2(rim.pos, mid, m);
      const R = n > 0 ? lerp(250, B.clockR, n) : lerp(30 * rim.s, 250, m);
      const squash = lerp(0.25, 1, prog(p, 0, 0.3, ease.out));
      clock.setAttribute('transform', `translate(${pos[0].toFixed(1)} ${pos[1].toFixed(1)}) scale(${(R / 100).toFixed(4)} ${(R / 100 * squash).toFixed(4)})`);
      op(coffee, 1 - prog(p, 0.08, 0.34)); op(face, prog(p, 0.2, 0.42));
      const spin = 1 - ease.out(p);
      mh.setAttribute('transform', `rotate(${(B.clockTime[1] - spin * 1080).toFixed(1)})`);
      hh.setAttribute('transform', `rotate(${(B.clockTime[0] - spin * 90).toFixed(1)})`);
      B.wrap.setAttribute('opacity', prog(p, 0.12, 0.78, ease.io).toFixed(3));
    };
  };

  /* 4 → 5  her smartphone grows until its screen (the cab-booking app) is the whole frame */
  defs[3] = function (g, A, B) {
    group(g, `<defs><clipPath id="t4clip"><rect width="${W}" height="${H}" rx="150"/></clipPath></defs>`);
    const clip = g.querySelector('#t4clip rect');
    const bezel = group(g, `<rect x="-14" y="-14" width="${W + 28}" height="${H + 28}" rx="160" fill="none" stroke="#0B1020" stroke-width="70"/>`);
    const rect = bezel.firstChild;
    return function (p) {
      const ph = A.phone(), e = Math.pow(ease.io(p), 1.5), k = lerp(ph.w / W, 1, e);
      const cx = lerp(ph.x, W / 2, e), cy = lerp(ph.y, H / 2, e);
      const tfm = `translate(${(cx - W / 2 * k).toFixed(2)} ${(cy - H / 2 * k).toFixed(2)}) scale(${k.toFixed(5)})`;
      B.wrap.setAttribute('transform', tfm); B.wrap.setAttribute('clip-path', 'url(#t4clip)');
      const rx = lerp(150, 0, prog(p, 0.6, 1));
      clip.setAttribute('rx', rx.toFixed(1)); rect.setAttribute('rx', (rx + 10).toFixed(1));
      rect.setAttribute('stroke-width', lerp(70, 0, prog(p, 0.55, 0.98)).toFixed(1));
      bezel.setAttribute('transform', tfm);
    };
  };

  /* 5 → 6  the cab pulls away past the camera; its motion streak wipes in the next street */
  defs[4] = function (g, A, B) {
    group(g, `<defs><clipPath id="t5clip"><path d=""/></clipPath></defs>`);
    const clip = g.querySelector('#t5clip path');
    const streak = group(g, `<path class="band" d="" fill="url(#streak)"/>
      ${Array.from({ length: 9 }, (_, i) => `<rect class="ln" x="${40 + (i * 53) % 190}" y="${90 + i * 210}" width="${260 + (i * 97) % 300}" height="${8 + (i % 3) * 5}" rx="6" fill="${i % 2 ? '#FFF4E8' : '#A78BFA'}" opacity=".7"/>`).join('')}`);
    const band = streak.querySelector('.band');
    const car = group(g, P.car('t5car'));
    const wheels = car.querySelectorAll('.spin');
    const rider = Reel.Person(car.querySelector('.car-passenger'), 'girl');
    rider.set({ x: 96, y: -46, s: 0.5, flip: -1, turn: 0.6, mouth: 'smile' });
    return function (p) {
      const [x0, y0, s0] = A.carPos;
      const acc = Math.pow(p, 1.9), s = s0 + 1.5 * prog(p, 0, 0.6, ease.io);
      const x = x0 - acc * 4300, y = y0 + 240 * prog(p, 0, 0.6, ease.io);
      car.setAttribute('transform', `translate(${x.toFixed(1)} ${y.toFixed(1)}) scale(${s.toFixed(3)}) rotate(${(-1.6 * Math.sin(Math.min(p * 3, 1) * Math.PI)).toFixed(2)})`);
      if (p > 0.3) car.setAttribute('filter', 'url(#blurX)'); else car.removeAttribute('filter');
      wheels.forEach(wl => wl.setAttribute('transform', `rotate(${(acc * 4300 / (50 * s) * 57.3 % 360).toFixed(1)})`));
      rider.root.setAttribute('opacity', prog(p, 0.05, 0.25).toFixed(2));
      const edge = x + 300 * s, sl = 150;                      // wipe edge follows the cab's tail
      clip.setAttribute('d', `M${edge + sl},0 L${W + 400},0 L${W + 400},${H} L${edge - sl},${H} Z`);
      B.wrap.setAttribute('clip-path', 'url(#t5clip)');
      band.setAttribute('d', `M${edge + sl - 60},0 L${edge + sl + 520},0 L${edge - sl + 520},${H} L${edge - sl - 60},${H} Z`);
      streak.querySelectorAll('.ln').forEach((l, i) => l.setAttribute('transform', `translate(${(edge + (i % 2) * 60).toFixed(1)} 0)`));
      op(streak, prog(p, 0.05, 0.3) * (1 - prog(p, 0.85, 1)));
    };
  };

  /* 6 → 7  the street-light's glow swells until it is the party lighting */
  defs[5] = function (g, A, B) {
    group(g, `<defs><clipPath id="t6clip"><circle r="10"/></clipPath>
      <radialGradient id="t6glow"><stop offset="0" stop-color="#FFF4E8" stop-opacity="0"/><stop offset=".62" stop-color="#FFF4E8" stop-opacity="0"/><stop offset=".78" stop-color="#FFE2B8" stop-opacity=".95"/><stop offset=".9" stop-color="#FF7B72" stop-opacity=".5"/><stop offset="1" stop-color="#A78BFA" stop-opacity="0"/></radialGradient></defs>`);
    const clip = g.querySelector('#t6clip circle');
    const glow = group(g, `<circle r="100" fill="url(#t6glow)"/>`);
    const core = group(g, `<circle r="100" fill="url(#glowWarm)"/>`);
    return function (p) {
      const pos = L2(A.lampPos(), B.lightPos, ease.io(p));
      const r = lerp(30, 2500, Math.pow(p, 2));
      clip.setAttribute('cx', pos[0].toFixed(1)); clip.setAttribute('cy', pos[1].toFixed(1)); clip.setAttribute('r', r.toFixed(1));
      B.wrap.setAttribute('clip-path', 'url(#t6clip)');
      place(glow, pos[0], pos[1], r / 78); op(glow, 1 - prog(p, 0.75, 1));
      place(core, pos[0], pos[1], 1.6 + 4 * p); op(core, 0.9 * (1 - prog(p, 0.2, 0.9)));
    };
  };

  /* 7 → 8  the glass rim lifts off and becomes the phone's SOS button */
  defs[6] = function (g, A, B) {
    const btn = group(g, `<circle class="fill" r="100" fill="${C.red}"/><circle class="rim" r="100" fill="none" stroke="${C.cream}" stroke-width="10"/>
      ${P.text(0, 23, 'SOS', 67.4, '#fff', 800, 'middle', 'letter-spacing="2"')}`);
    const fill = btn.querySelector('.fill'), rim = btn.querySelector('.rim'), txt = btn.querySelector('text');
    return function (p) {
      const from = A.rim(), to = B.btn(p), m = prog(p, 0, 0.9, ease.io);
      const pos = L2(from.pos, to.pos, m), rx = lerp(from.rx, to.r, m), sq = lerp(from.ry / from.rx, 1, prog(p, 0, 0.4, ease.out));
      btn.setAttribute('transform', `translate(${pos[0].toFixed(1)} ${(pos[1] - Math.sin(m * Math.PI) * 120).toFixed(1)}) scale(${(rx / 100).toFixed(4)} ${(rx / 100 * sq).toFixed(4)})`);
      op(fill, prog(p, 0.08, 0.4)); op(rim, 1 - prog(p, 0.3, 0.7)); op(txt, prog(p, 0.55, 0.85));
      B.wrap.setAttribute('opacity', prog(p, 0.1, 0.75, ease.io).toFixed(3));
    };
  };

  /* 8 → 9  camera tilts up from the phone to her; the SOS disc becomes the STOP sign behind her palm */
  defs[7] = function (g, A, B) {
    group(g, `<defs><clipPath id="t8clip"><rect width="${W}" height="${H}"/></clipPath></defs>`);
    const sign = group(g, '');
    const txt = group(g, P.text(0, 22, 'SOS', 64, '#fff', 800, 'middle', 'letter-spacing="2"'));
    return function (p) {
      const e = ease.io(p);
      A.wrap.setAttribute('transform', `translate(0 ${(H * e).toFixed(1)})`);
      B.wrap.setAttribute('transform', `translate(0 ${(-H * (1 - e)).toFixed(1)})`);
      A.wrap.setAttribute('clip-path', 'url(#t8clip)'); B.wrap.setAttribute('clip-path', 'url(#t8clip)');
      const to = B.stop(), m = prog(p, 0.1, 1, ease.io);
      const pos = L2(A.sosPos, [to.pos[0], to.pos[1] - H * (1 - e) * 0], m);
      const R = lerp(A.sosR, to.R, m);
      sign.innerHTML = P.stopSign(R, prog(p, 0.35, 1, ease.io));
      const arc = Math.sin(m * Math.PI) * 90;
      place(sign, pos[0] + arc, pos[1], 1, 22.5 * (1 - m) * 0);
      place(txt, pos[0] + arc, pos[1], R / A.sosR); op(txt, 1 - prog(p, 0.1, 0.4));
    };
  };

  /* 9 → 10  her STOP hand pushes into the lens and wipes the frame to the emergency call */
  defs[8] = function (g, A, B) {
    const hand = group(g, Reel.rig.palmMarkup(Reel.rig.LOOKS.girl));
    const KMAX = 62, C0 = [2, -18];
    return function (p) {
      const a = A.palm(), grow = Math.pow(prog(p, 0, 0.52), 2.4), slide = prog(p, 0.5, 1, ease.io);
      const k = lerp(a.k, KMAX, grow);
      const c0 = [a.pos[0] + C0[0] * a.k, a.pos[1] + C0[1] * a.k];
      const cx = lerp(c0[0], W / 2, grow), cy = lerp(c0[1], H / 2, grow) + slide * 5400;
      hand.setAttribute('transform', `translate(${(cx - C0[0] * k).toFixed(1)} ${(cy - C0[1] * k).toFixed(1)}) rotate(${(-6 * slide).toFixed(2)}) scale(${k.toFixed(3)})`);
      B.wrap.style.display = p < 0.5 ? 'none' : '';
    };
  };
})();
