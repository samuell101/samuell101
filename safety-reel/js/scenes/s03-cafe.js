/* SCENE 3 — FIRST MEETING: a busy public café, camera push-in */
Reel.defineScene(2, function (root) {
  const { U, P, rig, config: c } = Reel;
  const { group, prog, ease, lerp, place, op, show, win, mix } = U;
  const C = c.palette, FLOOR = 1600, S = 1.15;
  const SEAT_Y = FLOOR - (rig.DIM.shin + 20) * S;

  const cup = `<rect x="-40" y="-6" width="80" height="8" rx="4" fill="#E7D8C6"/>
    <path d="M-28,-48 h56 v20 a28,24 0 0 1 -56,0 z" fill="${C.cream}"/>
    <path d="M28,-40 h7 a11,11 0 0 1 0,22 h-10" fill="none" stroke="${C.cream}" stroke-width="7" stroke-linecap="round"/>
    <ellipse cx="0" cy="-48" rx="28" ry="7" fill="#6B4630" stroke="${C.cream}" stroke-width="4"/>`;
  const steam = `<path class="steam" d="M-8,-62 q-10,-14 0,-28 q10,-14 0,-28 M10,-66 q-10,-14 0,-28" stroke="#fff" stroke-width="5" fill="none" stroke-linecap="round" opacity=".35"/>`;
  const chair = f => `<g transform="scale(${f} 1)"><rect x="-96" y="-360" width="24" height="250" rx="12" fill="#6B5CB8"/><rect x="-96" y="-152" width="170" height="24" rx="12" fill="#6B5CB8"/>
    <rect x="-90" y="-130" width="12" height="130" fill="#51459A"/><rect x="52" y="-130" width="12" height="130" fill="#51459A"/></g>`;

  group(root, `<rect width="1080" height="1920" fill="#2B2350"/><rect width="1080" height="566" fill="#1D1838"/><rect y="556" width="1080" height="16" fill="#3D3273"/>
    <rect y="1190" width="1080" height="420" fill="#3A2F68"/><rect y="1184" width="1080" height="12" fill="#4B3F85"/>
    <rect y="${FLOOR}" width="1080" height="330" fill="#1F1A3C"/><rect y="${FLOOR}" width="1080" height="10" fill="#4B3F85" opacity=".5"/>
    <ellipse cx="545" cy="${FLOOR + 40}" rx="380" ry="44" fill="#2B2350"/>
    <!-- window onto the street -->
    <clipPath id="s3win"><rect x="610" y="770" width="410" height="400" rx="26"/></clipPath>
    <g clip-path="url(#s3win)"><rect x="610" y="770" width="410" height="400" fill="#141B33"/>
      <g transform="translate(600 0)">${P.skyline(77, 430, 1180, 120, 300, '#1F2547', '#FFE2B8')}</g>
      <circle cx="940" cy="850" r="26" fill="${C.cream}" opacity=".9"/></g>
    <rect x="610" y="770" width="410" height="400" rx="26" fill="none" stroke="${C.cream}" stroke-width="14"/>
    <path d="M815,770 V1170 M610,960 H1020" stroke="${C.cream}" stroke-width="10"/>
    <!-- menu board + counter -->
    <rect x="336" y="800" width="230" height="170" rx="18" fill="#1A1533" stroke="#6B5CB8" stroke-width="8"/>
    <text x="451" y="850" font-size="28" fill="${C.cream}" text-anchor="middle" letter-spacing="3">MENU</text>
    <path d="M364,884 h120 M364,912 h170 M364,940 h96" stroke="${C.lavender}" stroke-width="8" stroke-linecap="round" opacity=".7"/>
    <!-- pendant lamps -->
    ${[200, 880].map(x => `<rect x="${x - 3}" y="566" width="6" height="96" fill="#6B5CB8"/><path d="M${x - 58},712 a58,52 0 0 1 116,0 z" fill="${C.coral}"/><circle cx="${x}" cy="716" r="190" fill="url(#glowWarm)" opacity=".55"/><ellipse cx="${x}" cy="712" rx="40" ry="8" fill="${C.cream}"/>`).join('')}`);
  const sign = group(root, `<path d="M-140,-75 V-142 M140,-75 V-142" stroke="#6B5CB8" stroke-width="6"/><g filter="url(#shadow)">${P.cafeSign()}</g>`);
  place(sign, 540, 708, 1);

  // door (left) — opens as she walks in
  group(root, `<rect x="56" y="812" width="236" height="${FLOOR - 812}" rx="16" fill="#141B33"/><circle cx="170" cy="1010" r="120" fill="url(#glowWarm)" opacity=".22"/>`);
  const door = group(root, `<rect x="0" y="0" width="212" height="${FLOOR - 836}" rx="10" fill="#7C6BD6"/><rect x="24" y="30" width="164" height="300" rx="10" fill="#A78BFA" opacity=".35"/>
    <rect x="24" y="370" width="164" height="340" rx="10" fill="#6B5CB8"/><circle cx="182" cy="390" r="12" fill="${C.cream}"/>`);
  group(root, `<rect x="56" y="812" width="236" height="${FLOOR - 812}" rx="16" fill="none" stroke="#51459A" stroke-width="24"/>`);

  // counter + barista, and other guests (a public place!)
  const barista = Reel.Person(root, 'extraA');
  group(root, `<rect x="320" y="1250" width="290" height="${FLOOR - 1250}" rx="14" fill="#51459A"/><rect x="306" y="1232" width="318" height="30" rx="15" fill="#7C6BD6"/>
    <rect x="500" y="1150" width="84" height="84" rx="12" fill="#1A1533"/><rect x="514" y="1166" width="56" height="26" rx="6" fill="${C.coral}"/><circle cx="542" cy="1212" r="8" fill="${C.cream}"/>`);
  group(root, `<g transform="translate(772 ${FLOOR - 20}) scale(.62)">${chair(1)}</g><g transform="translate(1010 ${FLOOR - 20}) scale(.62)">${chair(-1)}</g>`);
  const g1 = Reel.Person(root, 'extraC'), g2 = Reel.Person(root, 'extraB');
  group(root, `<rect x="820" y="1470" width="150" height="14" rx="7" fill="${C.cream}"/><rect x="889" y="1484" width="12" height="100" fill="#51459A"/><g transform="translate(866 1470) scale(.55)">${cup}</g><g transform="translate(930 1470) scale(.55)">${cup}</g>`);

  // hero table
  group(root, `<g transform="translate(350 ${FLOOR})">${chair(1)}</g><g transform="translate(740 ${FLOOR})">${chair(-1)}</g>`);
  const friend = Reel.Person(root, 'friend');
  const girl = Reel.Person(root, 'girl');
  group(root, `<rect x="536" y="1354" width="18" height="${FLOOR - 1354}" fill="#51459A"/><ellipse cx="545" cy="${FLOOR}" rx="80" ry="12" fill="#51459A"/>
    <rect x="420" y="1334" width="250" height="24" rx="12" fill="${C.cream}"/><rect x="420" y="1348" width="250" height="10" rx="5" fill="#E2D2BF"/>`);
  const cupA = group(root, cup + steam), cupB = group(root, cup + steam);
  place(cupA, 486, 1334, 1);
  const tip = group(root, `<g filter="url(#shadow)"><rect x="-190" y="-58" width="380" height="116" rx="44" fill="#fff"/></g><g transform="translate(-132 0)">${P.tick(34)}</g>${P.text(-82, -6, 'Meet in', 32, C.navy)}${P.text(-82, 34, 'Public Place', 32, C.navy)}`);
  const RIM = [486, 1286];
  let camS = 1;

  function update(u, env) {
    const lt = env.lt;
    camS = 1 + 0.14 * prog(u, 0.2, 3.5, ease.soft);
    U.cam(root, camS, 520, 1000);

    const dk = win(u, -0.3, 1.5, 0.45, 0.45);
    door.setAttribute('transform', `translate(68 836) scale(${(1 - 0.78 * ease.io(dk)).toFixed(3)} 1)`);
    op(sign, 1); show(sign, env.pin >= 1);
    sign.setAttribute('transform', `translate(540 708) rotate(${(Math.sin(lt * 2.4) * 1.6 * (1 - prog(u, 0.4, 1.8))).toFixed(2)} 0 -142)`);

    // heroine walks in from the door and takes her seat
    const walkP = prog(u, -0.3, 0.9, ease.soft), sit = prog(u, 0.8, 1.35, ease.io);
    const w = rig.walk(lt * 6.4, 1 - sit);
    const seated = Object.assign({}, rig.SIT, { handF: [104, -98], handB: [60, -96], lean: 2 });
    const wp = Object.assign({}, w, { handF: girl.fk('F', w.shF, w.elF), handB: girl.fk('B', w.shB, w.elB) });
    const aware = win(u, 1.75, 2.5, 0.25, 0.25);
    const pose = mix(wp, seated, sit);
    girl.set(Object.assign(pose, { x: lerp(165, 350, walkP), s: S, ground: null, y: lerp(FLOOR - rig.HEIGHT * S, SEAT_Y, sit),
      turn: 0.7 - 1.1 * aware, lookX: -aware, mouth: 'smile', blink: rig.blink(env.t, 3), tilt: -3 * aware,
      handB: sit >= 1 ? [60 + 40 * win(u, 1.4, 1.75, 0.15, 0.15), -96 - 60 * win(u, 1.4, 1.75, 0.15, 0.15)] : pose.handB }));

    // the person she is meeting: waves, then sips coffee
    const wave = win(u, -0.1, 1.1, 0.3, 0.3), lift = win(u, 1.55, 2.6, 0.4, 0.4);
    const cx = lerp(604, 652, ease.io(lift)), cy = lerp(1334, 1228, ease.io(lift));
    place(cupB, cx, cy, 1, -14 * ease.io(lift));
    const toLocal = (x, y) => [(740 - x) / S, (y - SEAT_Y) / S];
    const hold = toLocal(cx + 34, cy - 26);
    friend.set(Object.assign({}, rig.SIT, { x: 740, s: S, flip: -1, y: SEAT_Y, handF: hold,
      handB: [lerp(60, 30 + Math.sin(lt * 11) * 26, wave), lerp(-96, -300, wave)], palmB: wave > 0.5, palmTilt: Math.sin(lt * 11) * 14,
      turn: 0.7, mouth: lift > 0.6 ? 'neutral' : 'smile', blink: rig.blink(env.t, 4), tilt: -6 * lift }));

    barista.set({ x: 420, s: 0.86, ground: 1560, turn: 0.5, handF: [90 + Math.sin(lt * 3) * 10, -150], blink: rig.blink(env.t, 5) });
    g1.set(Object.assign({}, rig.SIT, { x: 800, s: 0.62, y: FLOOR - 20 - 150 * 0.62, turn: 0.6, handF: [100, -100 + Math.sin(lt * 2.4) * 8], blink: rig.blink(env.t, 6) }));
    g2.set(Object.assign({}, rig.SIT, { x: 990, s: 0.62, flip: -1, y: FLOOR - 20 - 150 * 0.62, turn: 0.6, handF: [96, -104], tilt: Math.sin(lt * 1.7) * 3, blink: rig.blink(env.t, 7) }));

    const tk = prog(u, 1.35, 1.7, ease.back); place(tip, 560, 930, Math.max(0.001, tk)); show(tip, tk > 0 && env.pout < 0.3);
    root.querySelectorAll('.steam').forEach((s, i) => {
      s.setAttribute('transform', `translate(0 ${(-((lt * 14 + i * 9) % 18)).toFixed(1)})`);
      s.setAttribute('opacity', (0.18 + 0.2 * Math.abs(Math.sin(lt * 1.6 + i))).toFixed(2));
    });
  }
  /* stage-space position / scale of the heroine's cup rim (for the clock match-cut) */
  return { update, rim: () => ({ pos: U.camPt(RIM[0], RIM[1], camS, 520, 1000), s: camS }), signPos: [540, 708] };
});
