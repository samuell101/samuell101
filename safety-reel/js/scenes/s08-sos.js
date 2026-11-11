/* SCENE 8 — EMERGENCY CONTACTS: lock screen close-up with contacts + SOS */
Reel.defineScene(7, function (root) {
  const { U, P, rig, config: c } = Reel;
  const { group, prog, ease, lerp, place, op, show, win } = U;
  const C = c.palette, PC = [540, 1100], BTN = [0, 300], BTN_R = 95;
  const skin = rig.LOOKS.girl.skin, skinShade = rig.LOOKS.girl.skinShade;

  group(root, `<rect width="1080" height="1920" fill="url(#roomPurple)"/>
    <circle cx="540" cy="1100" r="900" fill="url(#glowLav)" opacity=".28"/>
    ${[380, 560, 760].map((r, i) => `<circle cx="540" cy="1100" r="${r}" fill="none" stroke="${C.lavender}" stroke-width="3" opacity="${0.16 - i * 0.04}"/>`).join('')}`);
  const rigG = group(root, '');
  // her hand + sleeve behind the phone
  group(rigG, `<rect x="-330" y="520" width="400" height="900" rx="110" fill="${rig.LOOKS.girl.top}" transform="rotate(-10 -130 700)"/>
    <rect x="-300" y="150" width="520" height="520" rx="150" fill="${skin}" transform="rotate(-8)"/>`);
  const contacts = [['Amma', C.lavender, C.purple], ['Nanna', C.coral, '#4A1512'], ['Akka', C.green, '#0B3B1E']];
  const phone = group(rigG, `<g filter="url(#shadow)"><rect x="-262" y="-522" width="524" height="1044" rx="78" fill="#0B1020"/></g>
    <rect x="-262" y="-522" width="524" height="1044" rx="78" fill="none" stroke="#3B4466" stroke-width="4"/>
    <defs><linearGradient id="s8scr" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#4A3A86"/><stop offset=".6" stop-color="#272044"/><stop offset="1" stop-color="#141B33"/></linearGradient>
      <clipPath id="s8clip"><rect x="-242" y="-502" width="484" height="1004" rx="60"/></clipPath></defs>
    <g clip-path="url(#s8clip)"><rect x="-242" y="-502" width="484" height="1004" fill="url(#s8scr)"/>
      <circle cx="-180" cy="-380" r="230" fill="${C.lavender}" opacity=".16"/><circle cx="220" cy="120" r="260" fill="${C.coral}" opacity=".1"/>
      <rect x="-56" y="-486" width="112" height="30" rx="15" fill="#0B1020"/>
      <g transform="translate(0 -410) scale(.8)">${P.icon.lock('#fff')}</g>
      ${P.text(0, -262, '9:41', 138, '#fff', 800, 'middle', 'letter-spacing="-3"')}
      ${P.text(0, -212, 'Emergency access is ON', 25, C.cream, 600, 'middle', 'opacity=".75"')}
      <g class="panel"><rect x="-208" y="-168" width="416" height="296" rx="44" fill="#fff" opacity=".12"/>
        ${P.text(0, -118, 'EMERGENCY CONTACTS', 23, C.lavender, 800, 'middle', 'letter-spacing="3"')}</g>
      ${contacts.map((ct, i) => `<g class="ct" data-x="${-132 + i * 132}"><circle r="48" fill="${ct[1]}"/>${P.text(0, 15, ct[0][0], 44, ct[2], 800, 'middle')}
        ${P.text(0, 88, ct[0], 26, '#fff', 800, 'middle')}<g transform="translate(34 -34)"><circle r="17" fill="#fff"/><g transform="scale(.36)">${P.icon.phone('#111827')}</g></g></g>`).join('')}
      <g class="rings"><circle r="${BTN_R}" fill="none" stroke="${C.red}" stroke-width="8"/><circle r="${BTN_R}" fill="none" stroke="${C.red}" stroke-width="8"/></g>
      <g class="btn"><circle r="${BTN_R}" fill="${C.red}"/>${P.text(0, 22, 'SOS', 64, '#fff', 800, 'middle', 'letter-spacing="2"')}</g>
      ${P.text(0, 446, 'Press and hold for help', 25, C.cream, 600, 'middle', 'opacity=".8"')}
      <rect class="off" x="-242" y="-502" width="484" height="1004" fill="#070912"/></g>`);
  // fingers wrapping the right edge + thumb in front
  group(rigG, [0, 1, 2, 3].map(i => `<rect x="226" y="${170 + i * 104}" width="92" height="88" rx="44" fill="${skin}"/><rect x="226" y="${170 + i * 104}" width="36" height="88" rx="18" fill="${skinShade}" opacity=".35"/>`).join(''));
  const thumb = group(rigG, `<path d="" stroke="${skin}" stroke-width="104" fill="none" stroke-linecap="round"/><ellipse rx="26" ry="32" fill="#E2A77F" opacity=".7"/>`);
  const cts = phone.querySelectorAll('.ct'), btn = phone.querySelector('.btn'), rings = phone.querySelectorAll('.rings circle');
  const ringG = phone.querySelector('.rings'), off = phone.querySelector('.off'), panel = phone.querySelector('.panel');

  /* phone "rotates into view": pose as a function of the incoming-transition progress */
  const pose = pin => { const e = ease.out(prog(pin, 0.05, 1)); return { rot: lerp(-34, 0, e), s: lerp(0.62, 1, e), ty: lerp(620, 0, e) }; };
  const btnStage = pin => {
    const q = pose(pin), a = q.rot * Math.PI / 180;
    return { pos: [PC[0] + (-BTN[1] * Math.sin(a)) * q.s, PC[1] + q.ty + BTN[1] * Math.cos(a) * q.s], r: BTN_R * q.s };
  };

  function update(u, env) {
    const lt = env.lt, q = pose(env.pin), idle = Math.sin(lt * 1.3) * 1.1 * (env.pin >= 1 ? 1 : 0);
    rigG.setAttribute('transform', `translate(${PC[0]} ${(PC[1] + q.ty).toFixed(1)}) rotate(${(q.rot + idle).toFixed(2)}) scale(${q.s.toFixed(4)})`);
    op(off, 1 - prog(u, 0.2, 0.55, ease.io));
    op(panel, prog(u, 0.6, 0.9));
    cts.forEach((ct, i) => {
      const k = prog(u, 0.85 + i * 0.2, 1.15 + i * 0.2, ease.back);
      ct.setAttribute('transform', `translate(${ct.dataset.x} ${(-28 + (1 - k) * 40).toFixed(1)}) scale(${Math.max(0.001, k).toFixed(3)})`);
    });
    const press = prog(u, 2.0, 2.3, ease.io), live = prog(u, 1.45, 1.6);
    btn.setAttribute('transform', `translate(${BTN[0]} ${BTN[1]}) scale(${(1 + 0.05 * Math.sin(lt * 7) * live - 0.07 * press).toFixed(3)})`);
    show(btn, env.pin >= 1 && env.pout <= 0);
    ringG.setAttribute('transform', `translate(${BTN[0]} ${BTN[1]})`);
    rings.forEach((r, i) => { const k = ((lt * 1.1 + i * 0.5) % 1); r.setAttribute('transform', `scale(${(1 + k * 0.85).toFixed(3)})`); r.setAttribute('opacity', ((1 - k) * 0.8 * live).toFixed(2)); });
    show(ringG, env.pout <= 0);
    const tx = lerp(-190, -80, press), ty = lerp(470, 356, press);
    thumb.firstChild.setAttribute('d', `M-360,760 Q-330,560 ${tx.toFixed(0)},${ty.toFixed(0)}`);
    thumb.lastChild.setAttribute('transform', `translate(${(tx + 8).toFixed(0)} ${(ty - 10).toFixed(0)}) rotate(28)`);
  }
  return { update, btn: btnStage, sosPos: [PC[0] + BTN[0], PC[1] + BTN[1]], sosR: BTN_R };
});
