/* SCENE 4 — COLLEGE LIFE: leaving campus late, messaging family */
Reel.defineScene(3, function (root) {
  const { U, P, rig, config: c } = Reel;
  const { group, prog, ease, lerp, place, op, show, win } = U;
  const C = c.palette, GY = 1620, CLOCK = [540, 772], CLOCK_R = 72, TIME = [185, 60];

  let win2 = '';
  for (let r = 0; r < 3; r++) for (let i = 0; i < 8; i++) {
    const x = 150 + i * 98 + (i > 3 ? 20 : 0); if (i === 3 || i === 4) continue;
    win2 += `<rect x="${x}" y="${985 + r * 118}" width="56" height="78" rx="10" fill="${(i * 3 + r) % 4 ? '#FFE2B8' : '#5B4FA0'}" opacity="${(i + r) % 3 ? 0.9 : 0.55}"/>`;
  }
  group(root, `<rect width="1080" height="1920" fill="url(#skyDusk)"/>
    <circle cx="210" cy="1150" r="330" fill="url(#glowCoral)" opacity=".7"/><circle cx="210" cy="1180" r="92" fill="#FFD9B0"/>
    <path d="M-40,760 q90,-34 180,0 q70,-24 130,6 q-150,24 -310,-6 z M760,700 q80,-30 160,0 q90,-22 190,10 q-200,20 -350,-10 z" fill="#fff" opacity=".12"/>
    ${P.tree(60, 1420, 1.5, '#33295E', '#3F3472')}${P.tree(1030, 1420, 1.6, '#33295E', '#3F3472')}
    <!-- college building -->
    <rect x="120" y="940" width="840" height="470" fill="#4A3F85"/><rect x="100" y="920" width="880" height="34" rx="8" fill="#5B4FA0"/>
    ${win2}
    <rect x="424" y="660" width="232" height="750" fill="#554898"/><path d="M400,668 L540,560 L680,668 Z" fill="#6B5CB8"/><rect x="404" y="656" width="272" height="26" rx="8" fill="#6B5CB8"/>
    <rect x="442" y="876" width="196" height="58" rx="12" fill="#2B2350"/>${P.text(540, 917, 'COLLEGE', 33, C.cream, 800, 'middle', 'letter-spacing="3"')}
    <path d="M478,1410 V1130 a62,62 0 0 1 124,0 V1410 Z" fill="#2B2350"/><path d="M496,1410 V1136 a44,44 0 0 1 88,0 V1410 Z" fill="#FFE2B8" opacity=".85"/>
    <rect x="380" y="1396" width="320" height="18" rx="6" fill="#6B5CB8"/><rect x="350" y="1412" width="380" height="18" rx="6" fill="#7C6BD6"/>
    <rect y="1428" width="1080" height="500" fill="#3A2F68"/><path d="M400,1428 L680,1428 L900,1920 L180,1920 Z" fill="#4A3F85"/>`);
  const clock = group(root, P.clock()); place(clock, CLOCK[0], CLOCK[1], CLOCK_R / 100);
  clock.querySelector('.hh').setAttribute('transform', `rotate(${TIME[0]})`);
  const mh = clock.querySelector('.mh');

  const students = [['extraB', 1], ['extraA', -1], ['extraD', 1], ['extraC', -1]].map(([l, f]) => ({ p: Reel.Person(root, l), f }));
  // boundary wall + open gate (foreground frame)
  const bars = x => [0, 1, 2, 3].map(i => `<rect x="${x + i * 22}" y="1210" width="8" height="330" rx="4" fill="#231D40"/>`).join('') + `<rect x="${x - 6}" y="1236" width="86" height="10" rx="5" fill="#231D40"/><rect x="${x - 6}" y="1500" width="86" height="10" rx="5" fill="#231D40"/>`;
  group(root, `<rect x="-20" y="1330" width="110" height="230" fill="#2B2350"/><rect x="990" y="1330" width="110" height="230" fill="#2B2350"/>
    ${bars(150)}${bars(858)}
    ${[60, 930].map(x => `<rect x="${x}" y="1130" width="90" height="430" rx="10" fill="#51459A"/><rect x="${x - 12}" y="1112" width="114" height="30" rx="10" fill="#6B5CB8"/>
      <circle cx="${x + 45}" cy="1076" r="120" fill="url(#glowWarm)" opacity=".5"/><circle cx="${x + 45}" cy="1082" r="30" fill="${C.cream}"/>`).join('')}`);
  const shadow = group(root, `<ellipse cy="${GY + 6}" rx="118" ry="16" fill="#0B0A1A" opacity=".35"/>`);
  const girl = Reel.Person(root, 'girl');

  // chat card
  const card = group(root, `<g filter="url(#shadow)"><rect x="-230" y="-170" width="460" height="340" rx="40" fill="${C.cream}"/></g>
    <circle cx="-176" cy="-116" r="34" fill="${C.lavender}"/>${P.text(-176, -103, 'A', 36, C.purple, 800, 'middle')}
    ${P.text(-128, -110, 'Amma', 34, C.navy)}<circle cx="-118" cy="-86" r="7" fill="${C.green}"/>${P.text(-104, -78, 'online', 20, '#7A7389', 600)}
    <rect x="-230" y="-66" width="460" height="3" fill="#E6DACB"/>
    <g class="typing"><rect x="96" y="-44" width="104" height="54" rx="27" fill="${C.lavender}"/><circle class="d" cx="124" cy="-17" r="7" fill="#fff"/><circle class="d" cx="148" cy="-17" r="7" fill="#fff"/><circle class="d" cx="172" cy="-17" r="7" fill="#fff"/></g>
    <g class="out"><rect x="-150" y="-48" width="350" height="96" rx="30" fill="${C.lavender}"/>
      ${P.text(-124, -10, 'Leaving college now.', 26, '#fff')}${P.text(-124, 26, 'Home by 7!', 26, '#fff')}
      <path class="ticks" d="M134,20 l8,8 l16,-18 M150,20 l8,8 l16,-18" stroke="#fff" stroke-width="4.5" fill="none" stroke-linecap="round" stroke-linejoin="round"/></g>
    <g class="in"><rect x="-200" y="64" width="310" height="70" rx="30" fill="#fff"/>${P.text(-174, 109, 'Sare, jagratha!', 27, C.navy)}
      <path d="M72,92 c-7,-12 -24,-2 -12,12 l12,12 l12,-12 c12,-14 -5,-24 -12,-12 z" fill="${C.coral}"/></g>`);
  const typing = card.querySelector('.typing'), out = card.querySelector('.out'), inn = card.querySelector('.in'), ticks = card.querySelector('.ticks');
  const dots = card.querySelectorAll('.d');
  const CARD = [800, 1010];

  function update(u, env) {
    const lt = env.lt;
    U.cam(root, 1.06 - 0.06 * prog(u, -0.4, 1.6, ease.out) + 0.03 * prog(u, 1.6, 3.4), 540, 1100);
    show(clock, env.pin >= 1);
    mh.setAttribute('transform', `rotate(${(TIME[1] + lt * 0.6).toFixed(2)})`);

    const sx = [300 + lt * 34, 800 - lt * 40, 690 + lt * 20, 240 - lt * 26];
    students.forEach((s, i) => s.p.set(Object.assign(rig.walk(lt * 5.2 + i * 1.7, 0.55, 0.6), { x: sx[i], s: 0.56, flip: s.f, ground: 1470, blink: rig.blink(env.t, 8 + i) })));

    // heroine strolls out through the gate, slows to text home
    const slow = prog(u, 0.7, 1.2, ease.io), up = prog(u, 0.55, 1.0, ease.io);
    const tau = Math.min(Math.max(u - 0.7, 0), 0.5);
    const dist = 190 * Math.min(u, 0.7) + 190 * tau - 140 * tau * tau + 30 * Math.max(0, u - 1.2);
    const gx = 150 + dist, w = rig.walk(gx / 44, 1 - 0.72 * slow, 1);
    const sw = girl.fk('F', w.shF, w.elF), happy = u > 2.35;
    girl.set(Object.assign(w, { x: gx, s: 1.2, ground: GY, handF: [lerp(sw[0], 120, up), lerp(sw[1], -154, up)], prop: up > 0.25 ? 'phone' : null,
      tilt: 9 * up, lookY: up, turn: 0.6, mouth: happy ? 'smile' : 'neutral', blink: rig.blink(env.t, 1) }));
    place(shadow, gx, 0, 1);

    const hp = girl.handPos('F', 30), k = prog(u, 0.95, 1.35, ease.back);
    place(card, lerp(hp[0], CARD[0], k), lerp(hp[1], CARD[1], k), Math.max(0.001, k)); show(card, k > 0);
    show(typing, u < 1.5); dots.forEach((d, i) => d.setAttribute('cy', (-17 - 7 * Math.max(0, Math.sin(lt * 12 - i * 0.9))).toFixed(1)));
    const o = prog(u, 1.5, 1.8, ease.back); show(out, o > 0);
    out.setAttribute('transform', `translate(${(200 * (1 - o)).toFixed(1)} ${(30 * (1 - o)).toFixed(1)}) scale(${Math.max(0.01, o).toFixed(3)})`);
    ticks.setAttribute('stroke', u > 2.05 ? '#0B3B1E' : '#fff'); ticks.setAttribute('opacity', u > 1.85 ? 1 : 0);
    const r = prog(u, 2.3, 2.6, ease.back); show(inn, r > 0);
    inn.setAttribute('transform', `translate(${(-200 * (1 - r)).toFixed(1)} ${(40 * (1 - r)).toFixed(1)}) scale(${Math.max(0.01, r).toFixed(3)})`);
  }
  return { update, clockPos: CLOCK, clockR: CLOCK_R, clockTime: TIME,
    phone: () => { const p = girl.handPos('F', 27); return { x: p[0], y: p[1], w: 36 * 1.2 }; } };
});
