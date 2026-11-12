/* SCENE 6 — BEING FOLLOWED: she notices, changes course, heads for light + people */
Reel.defineScene(5, function (root) {
  const { U, P, rig, config: c } = Reel;
  const { group, prog, ease, lerp, place, op, show, win } = U;
  const C = c.palette, GY = 1520, PAN = 900, LAMP_X = 1680, LAMP_Y = 716;

  group(root, `<rect width="1080" height="1920" fill="url(#skyNight)"/>${P.stars(91, 60, 1080, 1000)}`);
  const far = group(root, P.skyline(93, 2400, 1345, 260, 560, '#1A1838', '#A78BFA'));
  const world = group(root, '');
  const shop = (x, w, col, label) => `<g transform="translate(${x} 0)">
    <rect x="0" y="830" width="${w}" height="520" fill="#3A2F68"/><rect x="24" y="1010" width="${w - 48}" height="340" rx="14" fill="#FFE2B8"/>
    <rect x="${w / 2 - 6}" y="1010" width="12" height="340" fill="#3A2F68"/><rect x="24" y="1200" width="${w - 48}" height="10" fill="#3A2F68" opacity=".5"/>
    <path d="M-10,950 h${w + 20} l-16,74 h-${w - 12} z" fill="${col}"/><path d="M-10,950 h${w + 20} l-4,18 h-${w + 12} z" fill="#fff" opacity=".2"/>
    <rect x="${w / 2 - 110}" y="858" width="220" height="64" rx="14" fill="#1A1533"/>${P.text(w / 2, 903, label, 34, C.cream, 800, 'middle', 'letter-spacing="2"')}
    <circle cx="${w / 2}" cy="1180" r="260" fill="url(#glowWarm)" opacity=".28"/></g>`;
  group(world, `
    <rect x="-200" y="1340" width="2600" height="250" fill="#2A2350"/><rect x="-200" y="1340" width="2600" height="10" fill="#352C63"/>
    <rect x="-200" y="1584" width="2600" height="22" fill="#40367A"/><rect x="-200" y="1606" width="2600" height="320" fill="#151228"/>
    <!-- dark, empty stretch -->
    <rect x="-200" y="760" width="560" height="590" fill="#15122B"/><rect x="420" y="880" width="520" height="470" fill="#17142E"/>
    ${[0, 1, 2].map(i => `<rect x="${-120 + i * 150}" y="900" width="90" height="130" rx="8" fill="#1E1A3A"/><rect x="${-120 + i * 150}" y="1110" width="90" height="130" rx="8" fill="#1E1A3A"/>`).join('')}
    ${[0, 1, 2].map(i => `<rect x="${470 + i * 150}" y="980" width="110" height="370" rx="8" fill="#1E1A3A"/><path d="M${470 + i * 150},1040 h110 M${470 + i * 150},1100 h110 M${470 + i * 150},1160 h110 M${470 + i * 150},1220 h110 M${470 + i * 150},1280 h110" stroke="#15122B" stroke-width="6"/>`).join('')}
    <rect x="360" y="700" width="60" height="650" fill="#0F0D20"/>
    <!-- bright, busy stretch -->
    <rect x="980" y="1340" width="1420" height="250" fill="#3D3273"/><rect x="980" y="1340" width="1420" height="10" fill="#4B3F85"/>
    ${shop(1010, 400, C.coral, '24/7 STORE')}${shop(1430, 440, C.lavender, 'CHAI CAFÉ')}${shop(1890, 420, C.coral, 'BOOKS')}
    <path d="M1010,812 q200,60 400,0 q220,60 440,0 q210,60 460,0" stroke="#6B5CB8" stroke-width="4" fill="none"/>
    ${Array.from({ length: 16 }, (_, i) => `<circle cx="${1040 + i * 84}" cy="${836 + ((i % 5) - 2) ** 2 * -3 + 8}" r="9" fill="${i % 2 ? C.coral : C.cream}"/>`).join('')}
    <g transform="translate(${LAMP_X - 90} 1356)">${P.streetlight(640, 90, 1.5)}</g>`);
  const flick = group(world, `<g transform="translate(180 1356)">${P.streetlight(640, 90, 0.55)}</g>`);
  const fShadow = group(world, `<path d="M-70,6 L70,6 L330,26 L250,-8 Z" fill="#07060F" opacity=".55"/>`);
  const crowdDefs = [['extraB', 1560, -1, 1.06, 1500], ['extraA', 1690, 1, 1.0, 1490], ['extraC', 1850, -1, 1.08, 1530], ['extraD', 1985, 1, 1.02, 1500], ['friend', 2120, -1, 1.05, 1540]];
  const crowd = crowdDefs.map(d => Reel.Person(world, d[0]));
  const follower = Reel.Person(world, 'stranger');
  const gShadow = group(world, `<ellipse cy="${GY + 6}" rx="120" ry="16" fill="#07060F" opacity=".5"/>`);
  const girl = Reel.Person(world, 'girl');
  const dark = group(root, `<rect width="1080" height="1920" fill="#080712"/>`);
  const alert = group(root, `<circle r="40" fill="${C.coral}"/><rect x="-6" y="-24" width="12" height="30" rx="6" fill="#fff"/><circle cy="18" r="7" fill="#fff"/>`);
  const crowdSign = group(root, `<g filter="url(#shadow)"><rect x="-170" y="-70" width="340" height="140" rx="26" fill="#15803D" stroke="#fff" stroke-width="6"/></g>
    ${P.text(-26, -8, 'CROWD', 44, '#fff', 800, 'middle')}${P.text(-26, 40, 'AREA', 44, '#fff', 800, 'middle')}<path d="M92,10 l20,22 l40,-48" stroke="#fff" stroke-width="12" fill="none" stroke-linecap="round" stroke-linejoin="round"/>`);
  const arrow = group(root, `<path class="sh" d="M0,0 Q110,-150 300,-170" stroke="#fff" stroke-width="20" fill="none" stroke-linecap="round" stroke-dasharray="380" stroke-dashoffset="380"/><path class="hd" d="M268,-212 L324,-172 L268,-128" stroke="#fff" stroke-width="20" fill="none" stroke-linecap="round" stroke-linejoin="round"/>`);
  let cam = 0;
  const camAt = u => PAN * prog(u, 0.95, 2.6, ease.io);

  function update(u, env) {
    const lt = env.lt;
    cam = camAt(u);
    world.setAttribute('transform', `translate(${(-cam).toFixed(1)} 0)`);
    far.setAttribute('transform', `translate(${(-cam * 0.3 - 80).toFixed(1)} 0)`);
    op(dark, 0.16 * (1 - prog(u, 1.2, 2.5)));
    flick.setAttribute('opacity', (0.55 + 0.45 * (Math.sin(lt * 31) > -0.3 ? 1 : 0.3)).toFixed(2));

    // heroine
    const gx = 250 + 95 * u + cam * 1.0 + 60 * prog(u, 1.0, 2.6, ease.io);
    const notice = win(u, 0.45, 1.1, 0.18, 0.2), hurry = prog(u, 0.95, 1.3), safe = prog(u, 2.25, 2.6);
    const w = rig.walk(gx / 44, 0.8 + 0.25 * hurry, 0.9 + 0.3 * hurry);
    girl.set(Object.assign(w, { x: gx, s: 1.2, ground: GY, turn: 0.6 - 1.6 * notice, lookX: -notice, tilt: -4 * notice,
      brow: 11 * (1 - safe) * prog(u, 0.45, 0.7), mouth: safe > 0.5 ? 'smile' : (u > 0.5 ? 'worry' : 'neutral'), lean: 3 + 4 * hurry * (1 - safe), blink: rig.blink(env.t, 1) }));
    place(gShadow, gx, 0, 1);
    place(alert, gx - cam + 92, 700, Math.max(0.001, prog(u, 0.55, 0.8, ease.back) * (1 - prog(u, 1.25, 1.45, ease.in)))); show(alert, u > 0.55 && u < 1.45);

    // the follower: keeps pace, then gives up when she reaches people
    const fx = -60 + 120 * Math.min(u, 1.5) + 40 * prog(u, 1.5, 2.2, ease.out);
    const fw = rig.walk(fx / 44 + 1, 1 - prog(u, 1.5, 2.2), 0.5);
    follower.set(Object.assign(fw, { x: fx, s: 1.24, ground: GY, lean: 6, tilt: 6 }));
    place(fShadow, fx, GY, 1 + 0.25 * Math.sin(lt * 2));

    const ar = prog(u, 1.05, 1.5, ease.io), arOut = 1 - prog(u, 2.1, 2.4);
    place(arrow, 520, 890, 1); arrow.querySelector('.sh').setAttribute('stroke-dashoffset', (380 * (1 - ar)).toFixed(1));
    op(arrow.querySelector('.hd'), prog(u, 1.4, 1.5)); op(arrow, arOut * 0.9); show(arrow, ar > 0 && arOut > 0);
    const cs = prog(u, 1.55, 1.9, ease.back); place(crowdSign, 800, 640, Math.max(0.001, cs)); show(crowdSign, cs > 0 && env.pout < 0.25);
    crowd.forEach((p, i) => {
      const d = crowdDefs[i], talk = Math.sin(lt * 3 + i * 1.3);
      p.set({ x: d[1] + Math.sin(lt * 0.8 + i) * 8, s: d[3], flip: d[2], ground: d[4], handF: [70 + 26 * talk, -150 - 22 * talk], turn: 0.6,
        tilt: 3 * talk, mouth: talk > 0.3 ? 'open' : 'smile', blink: rig.blink(env.t, 10 + i), shB: -8 });
    });
  }
  return { update, lampPos: () => [LAMP_X - cam, LAMP_Y] };
});
