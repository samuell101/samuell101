/* SCENE 5 — CAB SAFETY: booking UI becomes the street; verify plate + driver */
Reel.defineScene(4, function (root) {
  const { U, P, rig, config: c } = Reel;
  const { group, prog, ease, lerp, place, op, show, win } = U;
  const C = c.palette, GY = 1750, CAR_Y = 1560, CAR_S = 1.6, CAR_X = 580;

  group(root, `<rect width="1080" height="1920" fill="url(#skyNight)"/>${P.stars(51, 50, 1080, 1000)}
    ${P.skyline(61, 1080, 1300, 240, 560, '#1E1B3E', '#A78BFA')}
    <g transform="translate(0 0)">${P.skyline(67, 1080, 1310, 120, 300, '#262150', '#FFE2B8')}</g>
    <rect y="1300" width="1080" height="130" fill="#352C63"/><rect y="1300" width="1080" height="10" fill="#40367A"/>
    <g transform="translate(900 1316)">${P.streetlight(600, -90)}</g>
    <rect y="1424" width="1080" height="20" fill="#4A4086"/><rect y="1444" width="1080" height="210" fill="#191630"/>
    <rect y="1654" width="1080" height="22" fill="#4A4086"/><rect y="1676" width="1080" height="250" fill="#352C63"/>
    <g transform="translate(60 1676)"><rect x="-7" y="-250" width="14" height="250" rx="7" fill="#5B4FA0"/><rect x="-62" y="-340" width="124" height="100" rx="20" fill="${C.lavender}"/>
      ${P.text(0, -292, 'PICK', 26, C.purple, 800, 'middle')}${P.text(0, -264, 'UP', 26, C.purple, 800, 'middle')}</g>`);
  const car = group(root, P.car('s5car'));
  const beam = group(car, `<path d="M-300,-120 L-640,-170 L-640,-20 L-300,-92 Z" fill="url(#coneWarm)" opacity=".5" transform="rotate(0)"/>`);
  const wheels = car.querySelectorAll('.spin');
  const scan = group(root, `<rect x="-70" y="-26" width="140" height="52" rx="12" fill="none" stroke="${C.lavender}" stroke-width="6" stroke-dasharray="26 14"/>`);
  const shadow = group(root, `<ellipse cy="${GY + 6}" rx="112" ry="15" fill="#0B0A1A" opacity=".4"/>`);
  const girl = Reel.Person(root, 'girl');

  // full-screen booking app (what the phone from scene 4 opens into)
  const app = group(root, `<rect width="1080" height="1920" fill="#E9DFF7"/>
    <path d="M-20,700 L1100,560 M-20,1050 L1100,1180 M250,-20 L330,1940 M760,-20 L820,1940 M-20,1420 L1100,1380" stroke="#fff" stroke-width="54"/>
    <rect x="60" y="760" width="170" height="230" rx="24" fill="#D5C8F0"/><rect x="380" y="1240" width="330" height="110" rx="24" fill="#D5C8F0"/><rect x="860" y="700" width="260" height="400" rx="24" fill="#D5C8F0"/><rect x="400" y="760" width="300" height="250" rx="24" fill="#DCD0F4"/>
    <path d="M800,1560 L770,1130 L310,1075 L290,740" fill="none" stroke="${C.lavender}" stroke-width="20" stroke-linecap="round" stroke-linejoin="round"/>
    <g transform="translate(290 720)">${P.pin()}</g>
    <g class="mk"><circle r="44" fill="${C.navy}"/><rect x="-22" y="-13" width="44" height="26" rx="9" fill="${C.cream}"/><rect x="-12" y="-21" width="24" height="12" rx="5" fill="${C.cream}"/></g>
    <path d="M0,1500 Q0,1440 60,1440 L1020,1440 Q1080,1440 1080,1500 L1080,1920 L0,1920 Z" fill="#fff"/><rect x="470" y="1462" width="140" height="10" rx="5" fill="#D9CFC2"/>`);
  // plate call-out (magnified front plate)
  const callout = group(root, `<path class="lead" d="M-60,58 Q-150,200 -168,395" stroke="${C.lavender}" stroke-width="5" fill="none" stroke-dasharray="4 14" stroke-linecap="round"/>
    <g filter="url(#shadow)"><g transform="scale(1.12)">${P.plate()}</g></g>
    <rect class="hl" x="-158" y="-50" width="316" height="100" rx="22" fill="none" stroke="${C.lavender}" stroke-width="7"/>
    <g class="tk" transform="translate(150 -44)">${P.tick(34)}</g>`);
  // booking card (persists from the app UI)
  const book = group(root, `<g filter="url(#shadow)"><rect x="-230" y="-150" width="460" height="300" rx="40" fill="${C.cream}"/></g>
    ${P.text(-194, -98, 'YOUR CAB', 24, C.coral, 800, 'start', 'letter-spacing="3"')}${P.text(194, -98, 'Arriving', 24, '#7A7389', 600, 'end')}
    <g transform="translate(-44 -34) scale(.92)">${P.plate()}</g>
    <rect class="hl" x="-178" y="-78" width="268" height="88" rx="20" fill="none" stroke="${C.lavender}" stroke-width="6"/>
    <g class="tk1" transform="translate(150 -34)">${P.tick(30)}</g>
    <rect x="-194" y="28" width="388" height="3" fill="#E6DACB"/>
    <circle cx="-152" cy="88" r="38" fill="#5B6BD6"/><circle cx="-152" cy="80" r="15" fill="#B97A52"/><path d="M-176,112 q0,-20 24,-20 q24,0 24,20 z" fill="#B97A52"/>
    ${P.text(-98, 80, 'Ravi K.', 32, C.navy)}${P.text(-98, 112, '★ 4.8 · White sedan', 22, '#7A7389', 600)}
    <g class="tk2" transform="translate(150 88)">${P.tick(30)}</g>`);
  const mk = app.querySelector('.mk');
  const BOOK = [800, 700], CALL = [270, 1010];

  function update(u, env) {
    const lt = env.lt;
    U.cam(root, 1 + 0.03 * prog(u, 0.6, 3.4), 540, 1300);
    // app → street
    const fade = prog(u, 0.25, 0.75, ease.io);
    op(app, 1 - fade); show(app, fade < 1);
    const mp = prog(u, -0.4, 0.8); mk.setAttribute('transform', `translate(${lerp(800, 770, mp).toFixed(1)} ${lerp(1560, 1130, mp).toFixed(1)})`);
    const bk = prog(u, 0.2, 0.8, ease.io);
    place(book, lerp(540, BOOK[0], bk), lerp(1680, BOOK[1], bk), lerp(1.9, 1, bk));

    // cab arrives
    const arr = prog(u, 0.3, 1.45, ease.out), cx = lerp(2200, CAR_X, arr), settle = Math.sin(prog(u, 1.3, 1.9) * Math.PI) * 1.2;
    car.setAttribute('transform', `translate(${cx.toFixed(1)} ${CAR_Y}) scale(${CAR_S}) rotate(${settle.toFixed(2)})`);
    wheels.forEach(wl => wl.setAttribute('transform', `rotate(${(-(2200 - cx) / (50 * CAR_S) * 57.3).toFixed(1)})`));
    show(car, env.pout <= 0);

    // verify: plate call-out, scan, ticks
    const ck = prog(u, 1.35, 1.7, ease.back);
    place(callout, CALL[0], CALL[1], Math.max(0.001, ck)); show(callout, ck > 0 && env.pout <= 0);
    const pulse = win(u, 1.55, 2.0, 0.1, 0.15) * (0.55 + 0.45 * Math.sin(lt * 26));
    callout.querySelector('.hl').setAttribute('opacity', pulse.toFixed(2)); book.querySelector('.hl').setAttribute('opacity', pulse.toFixed(2));
    place(scan, CAR_X - 286 * CAR_S + 20, CAR_Y - 70 * CAR_S, 1); op(scan, win(u, 1.45, 2.1, 0.1, 0.2)); show(scan, env.pout <= 0);
    scan.firstChild.setAttribute('stroke-dashoffset', (lt * 80).toFixed(1));
    const t0 = prog(u, 1.95, 2.2, ease.back), t1 = prog(u, 2.02, 2.27, ease.back), t2 = prog(u, 2.14, 2.4, ease.back);
    callout.querySelector('.tk').setAttribute('transform', `translate(150 -44) scale(${Math.max(0.001, t0).toFixed(3)})`);
    book.querySelector('.tk1').setAttribute('transform', `translate(150 -34) scale(${Math.max(0.001, t1).toFixed(3)})`);
    book.querySelector('.tk2').setAttribute('transform', `translate(150 88) scale(${Math.max(0.001, t2).toFixed(3)})`);

    // heroine checks her phone against the car, then heads for the door
    const lookCar = prog(u, 1.2, 1.5, ease.io) * (1 - win(u, 1.75, 2.05, 0.12, 0.12)), go = prog(u, 2.3, 3.05, ease.soft);
    const gx = lerp(350, 640, go), w = rig.walk(gx / 44, go > 0 && go < 1 ? 0.9 : 0, 0.3);
    girl.set(Object.assign(w, { x: gx, s: 1.08, ground: GY, handF: [118, -152 + 26 * go], prop: 'phone', tilt: 9 * (1 - lookCar), lookY: 1 - lookCar,
      turn: 0.6 + 0.3 * lookCar, mouth: u > 2.1 ? 'smile' : 'neutral', blink: rig.blink(env.t, 1), opacity: 1 - prog(env.pout, 0.02, 0.22) }));
    place(shadow, gx, 0, 1); op(shadow, 1 - prog(env.pout, 0.02, 0.22));
  }
  return { update, base: 3, carPos: [CAR_X, CAR_Y, CAR_S] };
});
