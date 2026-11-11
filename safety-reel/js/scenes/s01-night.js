/* SCENE 1 — NIGHT TRAVEL: walk cycle, parallax street, live-location share */
Reel.defineScene(0, function (root) {
  const { U, P, rig, config: c } = Reel;
  const { group, prog, ease, lerp, place, op, show, win } = U;
  const C = c.palette, GY = 1520;

  group(root, `<rect width="1080" height="1920" fill="url(#skyNight)"/>${P.stars(7, 70, 1080, 1100)}
    <circle cx="900" cy="640" r="150" fill="url(#glowLav)" opacity=".5"/><circle cx="900" cy="640" r="52" fill="${C.cream}"/><circle cx="880" cy="626" r="52" fill="#1B1D38" opacity=".0"/>`);
  const tileW = [1500, 1600, 1520, 1700];
  const far = group(root, [0, 1].map(i => `<g transform="translate(${i * tileW[0]} 0)">${P.skyline(11, tileW[0], 1340, 240, 520, '#1B1A3A', '#A78BFA')}</g>`).join(''));
  const near = group(root, [0, 1].map(i => `<g transform="translate(${i * tileW[1]} 0)">${P.skyline(23, tileW[1], 1350, 300, 620, '#241F47', '#FFE2B8')}</g>`).join(''));
  group(root, `<rect y="1340" width="1080" height="250" fill="#352C63"/><rect y="1340" width="1080" height="10" fill="#40367A"/>
    <rect y="1584" width="1080" height="22" fill="#4A4086"/><rect y="1606" width="1080" height="320" fill="#191630"/>`);
  const lane = group(root, [0, 1, 2, 3, 4, 5].map(i => `<rect x="${i * 380}" y="1752" width="200" height="14" rx="7" fill="#FFF4E8" opacity=".3"/>`).join(''));
  const lamps = group(root, [0, 1, 2, 3].map(i => `<g transform="translate(${i * 760 + 240} 1356)">${P.streetlight(640, 90)}</g>`).join(''));
  const shadow = group(root, `<ellipse cx="400" cy="${GY + 6}" rx="120" ry="16" fill="#0B0A1A" opacity=".4"/>`);
  const girl = Reel.Person(root, 'girl');

  // phone UI: map card → pin → confirmation chip
  const card = group(root, `
    <g filter="url(#shadow)"><rect x="-200" y="-150" width="400" height="300" rx="40" fill="${C.cream}"/></g>
    <clipPath id="s1map"><rect x="-184" y="-134" width="368" height="268" rx="28"/></clipPath>
    <g clip-path="url(#s1map)"><rect x="-200" y="-150" width="400" height="300" fill="#E9DFF7"/>
      <path d="M-200,-40 L200,-90 M-200,70 L200,30 M-90,-150 L-50,150 M90,-150 L120,150" stroke="#fff" stroke-width="22"/>
      <rect x="-170" y="-120" width="60" height="50" rx="10" fill="#D5C8F0"/><rect x="-30" y="80" width="110" height="60" rx="10" fill="#D5C8F0"/><rect x="130" y="-70" width="80" height="80" rx="10" fill="#D5C8F0"/>
      <path class="route" d="M-150,100 L-66,62 L-78,-52 L60,-70" fill="none" stroke="${C.lavender}" stroke-width="10" stroke-linecap="round" stroke-linejoin="round" stroke-dasharray="420" stroke-dashoffset="420"/>
      <circle cx="-150" cy="100" r="13" fill="${C.purple}"/></g>`);
  const rings = group(root, `<circle r="34" fill="none" stroke="${C.coral}" stroke-width="6"/><circle r="34" fill="none" stroke="${C.coral}" stroke-width="6"/>`);
  const pin = group(root, P.pin());
  const chip = group(root, `<g filter="url(#shadow)"><rect x="-215" y="-40" width="430" height="80" rx="40" fill="${C.navy}" stroke="${C.green}" stroke-width="4"/></g>
    <circle cx="-176" cy="0" r="11" fill="${C.green}"/>${P.text(-152, 10, 'Shared with Amma', 29, '#fff', 800)}<g transform="translate(174 0)">${P.tick(22)}</g>`);
  const route = card.querySelector('.route'), ringEls = rings.children;
  const CARD = [800, 800], PIN = [860, 730];

  function update(u, env) {
    const lt = env.lt, scroll = lt * 520 + 300;
    const tile = (g, f, w) => g.setAttribute('transform', `translate(${(-((scroll * f) % w)).toFixed(1)} 0)`);
    tile(far, 0.12, tileW[0]); tile(near, 0.35, tileW[1]); tile(lamps, 1, tileW[2]); tile(lane, 1.3, 380 * 2);
    U.cam(root, 1 + 0.035 * prog(u, 0, 3.4), 540, 1300);

    const ph = lt * Math.PI * 2 / 1.02, w = rig.walk(ph), up = prog(u, 0.55, 1.05, ease.io);
    const swing = girl.fk('F', w.shF, w.elF);
    girl.set(Object.assign(w, {
      x: 400, s: 1.2, ground: GY, handF: [lerp(swing[0], 122, up), lerp(swing[1], -152, up)],
      prop: up > 0.25 ? 'phone' : null, tilt: 9 * up, lookY: up, turn: 0.55, blink: rig.blink(env.t, 1),
      mouth: u > 2.05 ? 'smile' : 'neutral'
    }));
    shadow.firstChild.setAttribute('rx', 110 + 16 * Math.cos(ph * 2));

    const hp = girl.handPos('F', 30), k = prog(u, 1.2, 1.65, ease.back);
    place(card, lerp(hp[0], CARD[0], k), lerp(hp[1], CARD[1], k), Math.max(0.001, k));
    show(card, k > 0);
    route.setAttribute('stroke-dashoffset', (420 * (1 - prog(u, 1.45, 1.95, ease.io))).toFixed(1));
    const drop = prog(u, 1.55, 1.95, ease.back);
    place(pin, PIN[0], PIN[1] - (1 - drop) * 150, 0.4 + 0.6 * drop + 0.06 * Math.sin(lt * 6) * (drop >= 1 ? 1 : 0));
    op(pin, prog(u, 1.55, 1.7)); show(pin, u > 1.55 && env.pout <= 0);
    for (let i = 0; i < 2; i++) {
      const r = ((lt * 0.9 + i * 0.5) % 1);
      place(ringEls[i], PIN[0], PIN[1], 1 + r * 2.2); op(ringEls[i], (1 - r) * 0.7 * prog(u, 1.9, 2.0));
    }
    show(rings, u > 1.9 && env.pout <= 0);
    const ck = prog(u, 2.0, 2.4, ease.back);
    place(chip, CARD[0], 1030 + (1 - ck) * 40, 0.6 + 0.4 * ck); op(chip, prog(u, 2.0, 2.2));
  }
  return { update, pinPos: PIN };
});
