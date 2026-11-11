/* SCENE 9 — PERSONAL BOUNDARIES: someone gets too close; she says STOP */
Reel.defineScene(8, function (root) {
  const { U, P, rig, config: c } = Reel;
  const { group, prog, ease, lerp, place, op, show, win } = U;
  const C = c.palette, GX = 370, GYH = 1630, S = 2.05, CAM = [480, 1150], R = 168;

  group(root, `<rect width="1080" height="1920" fill="url(#roomPurple)"/>
    <circle cx="380" cy="1200" r="900" fill="url(#glowLav)" opacity=".3"/>
    <path d="M0,1500 Q300,1420 620,1500 T1080,1470 V1920 H0 Z" fill="#231D40"/>
    <circle cx="930" cy="700" r="210" fill="#3A2F68" opacity=".5"/><circle cx="120" cy="820" r="120" fill="#3A2F68" opacity=".5"/>`);
  const zone = group(root, `<ellipse rx="372" ry="560" fill="${C.lavender}" opacity=".07"/><ellipse class="ln" rx="372" ry="560" fill="none" stroke="${C.lavender}" stroke-width="7" stroke-dasharray="26 22" stroke-linecap="round"/>`);
  place(zone, GX, 1330, 1);
  const zl = zone.querySelector('.ln');
  const intruder = Reel.Person(root, 'stranger');
  const sign = group(root, `<circle r="${R * 1.5}" fill="url(#glowRed)"/><g filter="url(#shadow)">${P.stopSign(R, 1)}</g>`);
  const girl = Reel.Person(root, 'girl');
  const bubble = group(root, `<g filter="url(#shadow)"><path d="M-130,-80 h260 q40,0 40,40 v80 q0,40 -40,40 h-150 l-70,56 l14,-56 h-54 q-40,0 -40,-40 v-80 q0,-40 40,-40 z" fill="${C.cream}"/></g>
    ${P.text(0, 36, 'NO!', 104, C.red, 800, 'middle', 'letter-spacing="2"')}`);
  const st = { stop: [0, 0], palm: [0, 0], k: 1, camS: 1, push: 1 };

  function update(u, env) {
    const lt = env.lt, camS = st.camS = 1 + 0.1 * prog(u, -0.4, 3.4, ease.soft);
    U.cam(root, camS, CAM[0], CAM[1]);
    const raise = prog(u, -0.4, 0.28, ease.io), push = prog(u, 1.85, 2.45, ease.io), palmScale = 1.5 + 0.34 * push;
    const rest = girl.fk('F', 4, 10);
    const say = win(u, 1.1, 1.75, 0.05, 0.1);
    girl.set({ x: GX, y: GYH, s: S, handF: [lerp(rest[0], 176 + 8 * push, raise), lerp(rest[1], -176, raise)], palmF: raise > 0.35, palmScale, palmTilt: 0,
      handB: [-64, -16], turn: 0.85, lookX: 0.6, brow: -12 * prog(u, -0.2, 0.2), mouth: say > 0.5 ? 'open' : 'firm', lean: 2 + 2 * push, tilt: -2,
      blink: rig.blink(env.t, 1) * 0.0 });
    const hb = girl.handPos('F', 0), hc = girl.handPos('F', 17 * palmScale);
    st.palm = U.camPt(hb[0], hb[1], camS, CAM[0], CAM[1]); st.k = S * palmScale * camS;
    st.stop = U.camPt(hc[0] + 4 * palmScale, hc[1], camS, CAM[0], CAM[1]); st.push = 1 + 0.14 * push;
    place(sign, hc[0] + 4 * palmScale, hc[1], st.push + 0.02 * Math.sin(lt * 6)); show(sign, env.pin >= 1);

    // the person crossing her boundary: leans in, is stopped, backs away
    const inn = prog(u, -0.4, 0.45, ease.out), back = prog(u, 0.95, 1.7, ease.io), away = prog(u, 1.85, 2.6, ease.io);
    const rch = inn * (1 - back);
    intruder.set({ x: lerp(1500, 1085, inn) + 150 * back + 160 * away, y: GYH, s: S, flip: -1, lean: 9 * rch - 8 * back, tilt: 5,
      handF: [lerp(40, 168, rch), lerp(-20, -168, rch)], handB: [-50, -10], hipF: 6 * rch });

    const crossed = win(u, 0.0, 1.5, 0.3, 0.4);
    zl.setAttribute('stroke', crossed > 0.3 ? C.red : C.lavender); zl.setAttribute('stroke-dashoffset', (lt * 40).toFixed(1));
    zone.setAttribute('transform', `translate(${GX} 1330) scale(${(1 + 0.03 * crossed * Math.sin(lt * 14)).toFixed(3)})`);

    const bk = prog(u, 1.1, 1.38, ease.back) * (1 - prog(u, 2.3, 2.5, ease.in));
    place(bubble, 690, 800, Math.max(0.001, bk), -4); show(bubble, bk > 0);
  }
  return { update, stop: () => ({ pos: st.stop, R: R * st.camS * st.push }), palm: () => ({ pos: st.palm, k: st.k }) };
});
