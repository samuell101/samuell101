/* SCENE 10 — EMERGENCY: call 112, then the closing "share this" card */
Reel.defineScene(9, function (root) {
  const { U, P, rig, config: c } = Reel;
  const { group, prog, ease, lerp, place, op, show, win, mix } = U;
  const C = c.palette, GY = 1850, S = 1.38;

  group(root, `<rect width="1080" height="1920" fill="url(#skyNight)"/>
    <g class="redglow"><circle cx="760" cy="800" r="760" fill="url(#glowRed)" opacity=".5"/>
    ${[300, 440, 600, 780].map((r, i) => `<circle class="bgr" cx="760" cy="790" r="${r}" fill="none" stroke="${C.coral}" stroke-width="3" opacity="${0.22 - i * 0.045}"/>`).join('')}</g>
    <path d="M0,1700 Q400,1600 1080,1690 V1920 H0 Z" fill="#1A1533"/>`);
  const glowEnd = group(root, `<circle cx="540" cy="900" r="900" fill="url(#glowLav)" opacity=".45"/>`);
  const waves = group(root, [0, 1, 2].map(i => `<path d="M0,-${40 + i * 30} a${40 + i * 30},${40 + i * 30} 0 0 1 0,${80 + i * 60}" fill="none" stroke="${C.cream}" stroke-width="8" stroke-linecap="round"/>`).join(''));
  const shadow = group(root, `<ellipse cy="${GY - 2}" rx="150" ry="16" fill="#0B0A1A" opacity=".4"/>`);
  const girl = Reel.Person(root, 'girl');

  const card = group(root, `<g filter="url(#shadow)"><rect x="-260" y="-250" width="520" height="500" rx="56" fill="#141B33"/></g>
    <rect x="-260" y="-250" width="520" height="500" rx="56" fill="none" stroke="${C.coral}" stroke-width="4" opacity=".6"/>
    <circle cx="-176" cy="-188" r="10" fill="${C.red}" class="rec"/>${P.text(-154, -178, 'EMERGENCY CALL', 27, C.coral, 800, 'start', 'letter-spacing="3"')}
    ${P.text(0, 30, '112', 236, '#fff', 800, 'middle', 'letter-spacing="-4"')}
    <text class="status" x="0" y="92" font-size="30" font-weight="600" fill="${C.cream}" text-anchor="middle">Calling…</text>
    <g class="pr" transform="translate(0 174)"><circle r="46" fill="none" stroke="${C.green}" stroke-width="6"/><circle r="46" fill="none" stroke="${C.green}" stroke-width="6"/></g>
    <g transform="translate(0 174)"><circle r="46" fill="${C.green}"/><g transform="scale(.72)">${P.icon.phone('#0B3B1E')}</g></g>`);
  const status = card.querySelector('.status'), pr = card.querySelectorAll('.pr circle'), rec = card.querySelector('.rec');
  const CARD = [760, 790];

  // end card
  const cta = c.ending.lines.map((ln, i) => group(root, P.text(0, 0, ln, i ? 88 : 124, i ? '#fff' : C.coral, 800, 'middle', 'letter-spacing="-1"')));
  const ctaY = [640, 760, 866];
  const pill = group(root, `<rect x="-190" y="-38" width="380" height="76" rx="38" fill="${C.red}"/>${P.text(0, 12, 'EMERGENCY · 112', 32, '#fff', 800, 'middle', 'letter-spacing="2"')}`);
  const plane = group(root, `<g transform="scale(1.5)">${P.icon.plane(C.cream)}</g>`);
  const trail = group(root, `<path d="" fill="none" stroke="${C.cream}" stroke-width="6" stroke-dasharray="4 18" stroke-linecap="round" opacity=".7"/>`);
  let lastStatus = '';

  function update(u, env) {
    const lt = env.lt, o = env.outro, end = prog(o, 0, 0.7, ease.io);
    U.cam(root, 1.03 + 0.03 * prog(u, -0.4, 4), 540, 1100);
    op(glowEnd, end); op(root.querySelector('.redglow'), 1 - 0.85 * end);

    const connected = u > 2.75;
    const txt = connected ? 'Connected · help is on the way' : 'Calling' + '.'.repeat(1 + ((Math.floor(lt * 3) % 3) + 3) % 3);
    if (txt !== lastStatus) { status.textContent = txt; lastStatus = txt; status.setAttribute('fill', connected ? C.green : C.cream); }
    const ck = prog(u, 0.25, 0.7, ease.back);
    place(card, CARD[0], CARD[1] - end * 520 + (1 - ck) * 60, (0.7 + 0.3 * ck) * (1 - 0.2 * end)); op(card, Math.min(prog(u, 0.25, 0.5), 1 - end)); show(card, u > 0.25 && end < 1);
    pr.forEach((r, i) => { const k = (lt * 1.2 + i * 0.5) % 1; r.setAttribute('transform', `scale(${(1 + k * 1.3).toFixed(3)})`); r.setAttribute('opacity', ((1 - k) * 0.8).toFixed(2)); });
    rec.setAttribute('opacity', Math.sin(lt * 8) > 0 ? 1 : 0.25);
    root.querySelectorAll('.bgr').forEach((r, i) => r.setAttribute('transform', `translate(760 790) scale(${(1 + 0.04 * Math.sin(lt * 3 - i * 0.7)).toFixed(3)}) translate(-760 -790)`));

    // heroine: calls loudly for help → confident final pose
    const talk = o < 0 && u > 0.6 && Math.sin(lt * 15) > -0.2 && !connected;
    const gx = lerp(290, 540, end), stepping = Math.sin(end * Math.PI);
    const callPose = { handF: [104, -214], handB: [lerp(-52, 96, prog(u, 0.5, 0.9, ease.io) * (1 - prog(u, 2.6, 3, ease.io))), lerp(8, -250, prog(u, 0.5, 0.9, ease.io) * (1 - prog(u, 2.6, 3, ease.io)))] };
    const finalPose = { handF: [112, -196], handB: [-78, -14] };
    const w = rig.walk(gx / 44, stepping * 0.6, 0);
    const p = mix(callPose, finalPose, end);
    girl.set(Object.assign(w, p, { x: gx, s: S, ground: GY, prop: 'phone', propTilt: -8 + 14 * end, palmB: p.handB[1] < -200, palmTilt: 30,
      turn: 0.75 - 0.75 * end, tilt: -3 + 3 * end, brow: -8 * (1 - end) * (connected ? 0.3 : 1), mouth: o > 0.3 || connected ? 'smile' : (talk ? 'open' : 'firm'),
      lean: 2 * (1 - end), blink: rig.blink(env.t, 1) }));
    place(shadow, gx, 0, 1);
    const hp = girl.handPos('F', 60);
    place(waves, hp[0] + 46, hp[1], 1 + 0.08 * Math.sin(lt * 12)); show(waves, o < 0 && u > 0.6);
    Array.from(waves.children).forEach((wv, i) => wv.setAttribute('opacity', (0.25 + 0.6 * Math.max(0, Math.sin(lt * 9 - i * 1.1))).toFixed(2)));

    // end card
    cta.forEach((g, i) => {
      const k = prog(o, 0.35 + i * 0.16, 0.8 + i * 0.16, ease.back);
      place(g, 540, ctaY[i] + (1 - k) * 60, 0.8 + 0.2 * k); op(g, prog(o, 0.35 + i * 0.16, 0.6 + i * 0.16)); show(g, o > 0.3);
    });
    const pk = prog(o, 0.95, 1.3, ease.back); place(pill, 540, 980, Math.max(0.001, pk)); show(pill, pk > 0);
    const fly = prog(o, 0.75, 1.7, ease.soft), P0 = hp, P1 = [760, 1150], P2 = [900, 470];
    const q = t => [(1 - t) * (1 - t) * P0[0] + 2 * t * (1 - t) * P1[0] + t * t * P2[0], (1 - t) * (1 - t) * P0[1] + 2 * t * (1 - t) * P1[1] + t * t * P2[1]];
    const a = q(fly), b = q(Math.min(1, fly + 0.02));
    place(plane, a[0], a[1] + Math.sin(lt * 3) * 8 * (fly >= 1 ? 1 : 0), 0.6 + 0.6 * fly, Math.atan2(b[1] - a[1], b[0] - a[0]) * 57.3 + 20 + (fly >= 1 ? -42 : 0) * 0);
    show(plane, fly > 0);
    let d = `M${P0[0].toFixed(0)},${P0[1].toFixed(0)}`;
    for (let i = 1; i <= 20; i++) { const pt = q(fly * i / 20); d += ` L${pt[0].toFixed(0)},${pt[1].toFixed(0)}`; }
    trail.firstChild.setAttribute('d', d); show(trail, fly > 0.02); op(trail, 1 - prog(o, 1.9, 2.5));
  }
  return { update, base: 4 };
});
