/* SCENE 7 — PARTIES & OUTINGS: she refuses a drink from a stranger and keeps her own in hand */
Reel.defineScene(6, function (root) {
  const { U, P, rig, config: c } = Reel;
  const { group, prog, ease, lerp, place, op, show, win } = U;
  const C = c.palette, LIGHT = [540, 650], BAR = 1500, GLASS = [250, BAR], RIM = [250, BAR - 172];
  const r = U.rng(5);

  group(root, `<rect width="1080" height="1920" fill="url(#roomPurple)"/><rect x="537" y="0" width="6" height="${LIGHT[1] - 50}" fill="#6B5CB8"/>`);
  const beams = group(root, [C.lavender, C.coral, C.cream, C.lavender, C.coral].map((col, i) =>
    `<g class="beam"><path d="M-12,0 L-170,1500 L170,1500 L12,0 Z" fill="${col}" opacity="${i === 2 ? 0.1 : 0.17}"/></g>`).join(''));
  beams.setAttribute('transform', `translate(${LIGHT[0]} ${LIGHT[1]})`);
  const beamEls = beams.querySelectorAll('.beam');
  group(root, `<circle cx="${LIGHT[0]}" cy="${LIGHT[1]}" r="230" fill="url(#glowLav)" opacity=".6"/>`);
  const ball = group(root, `<circle r="58" fill="#C9C1E6"/><clipPath id="s7ball"><circle r="58"/></clipPath>
    <g clip-path="url(#s7ball)"><g class="tiles">${Array.from({ length: 40 }, (_, i) => `<rect x="${-80 + (i % 8) * 24}" y="${-60 + Math.floor(i / 8) * 24}" width="20" height="20" rx="3" fill="${['#fff', C.lavender, '#8E84B5', C.coral, '#EDE9FE'][(i * 7) % 5]}" opacity=".8"/>`).join('')}</g></g>`);
  place(ball, LIGHT[0], LIGHT[1], 1);
  const bokeh = group(root, Array.from({ length: 18 }, (_, i) => `<circle cx="${(r() * 1080).toFixed(0)}" cy="${(620 + r() * 760).toFixed(0)}" r="${(10 + r() * 34).toFixed(0)}" fill="${[C.lavender, C.coral, C.cream][i % 3]}"/>`).join(''));
  const dancerDefs = [['extraC', 110, 1], ['extraD', 330, -1], ['extraA', 545, 1], ['extraB', 950, -1]];
  const dancers = dancerDefs.map(d => Reel.Person(root, d[0]));
  group(root, `<rect y="600" width="1080" height="900" fill="#1A1533" opacity=".42"/>`);
  const girl = Reel.Person(root, 'girl');

  // bar counter (foreground)
  group(root, `<rect y="${BAR}" width="1080" height="46" fill="#7C6BD6"/><rect y="${BAR}" width="1080" height="8" fill="#A78BFA" opacity=".7"/>
    <rect y="${BAR + 46}" width="1080" height="400" fill="#33295E"/>
    ${[40, 400, 760].map(x => `<rect x="${x}" y="${BAR + 90}" width="300" height="340" rx="22" fill="#3D3273"/>`).join('')}`);
  const glass = group(root, `<ellipse cx="0" cy="2" rx="54" ry="9" fill="#0B0A1A" opacity=".35"/>
    <path d="M-46,-172 L46,-172 L34,-6 Q33,0 26,0 L-26,0 Q-33,0 -34,-6 Z" fill="#FFF4E8" opacity=".2"/>
    <path class="liq" d="M-41,-112 L41,-112 L34,-6 Q33,0 26,0 L-26,0 Q-33,0 -34,-6 Z" fill="${C.coral}"/>
    <ellipse cx="0" cy="-112" rx="41" ry="8" fill="#FF9B93"/>
    <g class="fizz">${Array.from({ length: 7 }, (_, i) => `<circle cx="${-22 + i * 7.5}" cy="-20" r="${3 + i % 3}" fill="#fff" opacity=".7"/>`).join('')}</g>
    <path d="M12,-200 L4,-30" stroke="${C.cream}" stroke-width="7" stroke-linecap="round"/>
    <ellipse cx="0" cy="-172" rx="46" ry="10" fill="none" stroke="${C.cream}" stroke-width="5"/>
    <circle cx="-40" cy="-176" r="22" fill="#FFE08A"/><circle cx="-40" cy="-176" r="14" fill="#FFF1B8"/>`);
  const fizz = glass.querySelectorAll('.fizz circle'), liq = glass.querySelector('.liq');
  const ring = group(root, `<ellipse rx="96" ry="130" fill="none" stroke="${C.red}" stroke-width="6" stroke-dasharray="16 16" stroke-linecap="round"/>`);
  const pill = group(root, `<rect x="-10" y="-6" width="20" height="12" rx="6" fill="#fff"/>`);
  const arm = group(root, `<path class="a" d="" stroke="#34314F" stroke-width="56" fill="none" stroke-linecap="round"/><circle class="h" r="31" fill="#B97A52"/>`);
  const cross = group(root, `<path d="M-44,-44 L44,44 M44,-44 L-44,44" stroke="#fff" stroke-width="34" stroke-linecap="round"/><path d="M-44,-44 L44,44 M44,-44 L-44,44" stroke="${C.red}" stroke-width="22" stroke-linecap="round"/>`);
  const warn = group(root, `<circle r="130" fill="url(#glowRed)"/>${P.warn()}`);
  const pillLabel = (txt, col, w) => `<g filter="url(#shadow)"><rect x="${-w / 2}" y="-34" width="${w}" height="68" rx="34" fill="${col}"/></g>${P.text(0, 11, txt, 30, col === C.green ? '#0B3B1E' : '#fff', 800, 'middle', 'letter-spacing="1"')}`;
  const lab1 = group(root, pillLabel('NOT FROM STRANGERS', C.red, 400));
  const lab2 = group(root, pillLabel('KEEP YOUR OWN', C.green, 320));
  const tick = group(root, P.tick(36));

  function update(u, env) {
    const lt = env.lt, beat = Math.abs(Math.sin(lt * Math.PI * 2));
    U.cam(root, 1.04 + 0.03 * prog(u, -0.4, 3.4), 540, 1200);
    beamEls.forEach((b, i) => b.setAttribute('transform', `rotate(${((i - 2) * 24 + Math.sin(lt * (1.1 + i * 0.23) + i * 2) * 16).toFixed(2)})`));
    ball.querySelector('.tiles').setAttribute('transform', `translate(${((lt * 30) % 24).toFixed(1)} 0)`);
    Array.from(bokeh.children).forEach((b, i) => b.setAttribute('opacity', (0.07 + 0.13 * Math.abs(Math.sin(lt * 1.3 + i * 1.9))).toFixed(2)));

    dancers.forEach((p, i) => {
      const d = dancerDefs[i], ph = lt * Math.PI * 2 + i * 1.1, b = Math.abs(Math.sin(ph));
      p.set({ x: d[1] + Math.sin(ph * 0.5) * 16, s: 0.9, flip: d[2], ground: 1480 - b * 18, hipF: 10 * b, kneeF: 20 * b, hipB: 4, kneeB: 14 * b,
        handF: [60 + 30 * Math.sin(ph), -300 - 30 * b], handB: [-40 - 30 * Math.sin(ph), -280 - 30 * (1 - b)], lean: Math.sin(ph * 0.5) * 6, tilt: Math.sin(ph) * 5, blink: rig.blink(env.t, 20 + i) });
    });

    // a stranger's hand offers a drink; she refuses; it is left on the bar — never touch it
    const offer = prog(u, 0.15, 0.85, ease.io), down = prog(u, 1.55, 2.0, ease.io), retreat = prog(u, 2.0, 2.55, ease.io);
    const P0 = [-140, 1290], P1 = [470, 1330], P2 = [GLASS[0] - 44, BAR - 86];
    let hx = lerp(lerp(P0[0], P1[0], offer), P2[0], down), hy = lerp(lerp(P0[1], P1[1], offer), P2[1], down) - Math.sin(down * Math.PI) * 40;
    const gx = hx + 44, gy = hy + 86;                       // glass rides in the hand until it is set down
    hx = lerp(hx, P0[0], retreat); hy = lerp(hy, P0[1], retreat);
    arm.querySelector('.a').setAttribute('d', `M-140,1190 Q${(hx - 110).toFixed(0)},${(hy - 50).toFixed(0)} ${hx.toFixed(0)},${hy.toFixed(0)}`);
    arm.querySelector('.h').setAttribute('transform', `translate(${hx.toFixed(1)} ${hy.toFixed(1)})`);
    const wob = Math.sin(lt * 9) * 2.5 * offer * (1 - down);
    place(glass, gx, gy, 1, wob);
    fizz.forEach(f => f.setAttribute('opacity', 0)); show(pill, false);
    const xk = prog(u, 1.0, 1.25, ease.back) * (1 - prog(u, 1.9, 2.05));
    place(cross, gx + 6, gy - 290, Math.max(0.001, xk) * (1 + 0.05 * Math.sin(lt * 10))); show(cross, xk > 0);
    const wk = prog(u, 2.0, 2.3, ease.back);
    place(warn, 250, 1130 + Math.sin(lt * 5) * 6, Math.max(0.001, wk) * (1.25 + 0.06 * Math.sin(lt * 10))); show(warn, wk > 0 && env.pout <= 0.15);
    place(ring, 250, BAR - 96, 1 + 0.04 * Math.sin(lt * 8)); op(ring, prog(u, 2.0, 2.2)); ring.firstChild.setAttribute('stroke-dashoffset', (lt * 60).toFixed(1));
    const l1 = prog(u, 1.25, 1.55, ease.back); place(lab1, 270, BAR + 150, Math.max(0.001, l1)); show(lab1, l1 > 0);

    // heroine: enjoying the music, sees the offer, raises her palm — her own drink never leaves her hand
    const see = prog(u, 0.45, 0.8, ease.io), refuse = prog(u, 0.8, 1.15, ease.back) * (1 - prog(u, 1.95, 2.35, ease.io)), sway = Math.sin(lt * Math.PI * 2) * (1 - see);
    girl.set({ x: 770 + sway * 10, s: 1.3, flip: -1, ground: 1810, lean: sway * 3 - 3 * refuse, tilt: sway * 4 - 3 * see,
      handF: [lerp(98, 60, refuse), -128 - 6 * beat * (1 - see)], prop: 'glass',
      handB: [lerp(-40, 158, refuse), lerp(-60, -196, refuse)], palmB: refuse > 0.5, palmScale: 1, palmTilt: 0,
      turn: 0.3 + 0.6 * see, lookX: see, brow: -10 * see * (1 - prog(u, 2.2, 2.6)), mouth: u > 2.25 ? 'smile' : (see > 0.5 ? 'firm' : 'smile'), blink: rig.blink(env.t, 1) });
    const tk = prog(u, 2.05, 2.35, ease.back), hp = girl.handPos('F', 0);
    place(tick, hp[0] + 84, hp[1] - 70, Math.max(0.001, tk)); show(tick, tk > 0);
    const l2 = prog(u, 2.1, 2.4, ease.back); place(lab2, 800, BAR + 150, Math.max(0.001, l2)); show(lab2, l2 > 0);
  }
  return { update, lightPos: LIGHT, rim: () => ({ pos: U.camPt(RIM[0], RIM[1], 1.04 + 0.03, 540, 1200), rx: 46 * 1.07, ry: 10 * 1.07 }) };
});
