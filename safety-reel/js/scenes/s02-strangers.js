/* SCENE 2 — STRANGERS: a stranger approaches, private details stay private */
Reel.defineScene(1, function (root) {
  const { U, P, rig, config: c } = Reel;
  const { group, prog, ease, lerp, place, op, show, win } = U;
  const C = c.palette, GY = 1520;

  group(root, `<rect width="1080" height="1920" fill="url(#skyNight)"/>${P.stars(31, 50, 1080, 1000)}
    ${P.skyline(41, 1080, 1345, 260, 560, '#1E1B3E', '#A78BFA')}
    ${P.tree(930, 1350, 1.25)}${P.tree(60, 1350, 0.9)}
    <rect y="1340" width="1080" height="250" fill="#352C63"/><rect y="1340" width="1080" height="10" fill="#40367A"/>
    <rect y="1584" width="1080" height="22" fill="#4A4086"/><rect y="1606" width="1080" height="320" fill="#191630"/>
    <g transform="translate(790 1356)">${P.streetlight(640, -90)}</g>
    <!-- bus shelter -->
    <g transform="translate(60 0)">
      <rect x="0" y="930" width="16" height="430" rx="8" fill="#4A4086"/><rect x="424" y="930" width="16" height="430" rx="8" fill="#4A4086"/>
      <rect x="-24" y="900" width="488" height="40" rx="20" fill="#5B4FA0"/>
      <rect x="16" y="960" width="408" height="250" rx="10" fill="#A78BFA" opacity=".12"/>
      <rect x="40" y="1270" width="360" height="22" rx="11" fill="#5B4FA0"/><rect x="70" y="1292" width="14" height="66" fill="#4A4086"/><rect x="356" y="1292" width="14" height="66" fill="#4A4086"/>
      <rect x="300" y="985" width="96" height="96" rx="16" fill="${C.lavender}" opacity=".85"/><text x="348" y="1052" font-size="52" fill="${C.purple}" text-anchor="middle">B</text>
    </g>`);
  group(root, `<ellipse cx="330" cy="${GY + 6}" rx="120" ry="16" fill="#0B0A1A" opacity=".4"/>`);
  const sShadow = group(root, `<ellipse cy="${GY + 6}" rx="125" ry="16" fill="#0B0A1A" opacity=".4"/>`);
  const stranger = Reel.Person(root, 'stranger');
  const girl = Reel.Person(root, 'girl');

  const chips = ['home', 'phone', 'id'].map((n, i) => group(root,
    `<g filter="url(#shadow)"><circle r="54" fill="${C.cream}"/></g><g class="ic">${P.icon[n](C.purple)}</g>`));
  const chipPos = [[505, 905], [612, 830], [722, 905]];
  const block = group(root, P.noSymbol(128));
  const lock = group(root, `<circle r="40" fill="${C.green}"/><g transform="scale(.9)">${P.icon.lock('#0B3B1E')}</g>`);
  const card = group(root, `<g filter="url(#shadow)">${P.profileCard()}</g>`);
  const bg = card.querySelector('.card-bg'), body = card.querySelector('.card-body');
  const CARD = [760, 640];

  function update(u, env) {
    const lt = env.lt;
    U.cam(root, 1.02 + 0.03 * prog(u, -0.4, 3.4), 540, 1200);
    // stranger walks in, reaches, then backs off
    const app = prog(u, -0.2, 1.15, ease.out), back = prog(u, 1.95, 2.6, ease.io);
    const sx = lerp(1330, 835, app) + back * 110, moving = (1 - app) > 0.02 ? 1 : 0;
    const w = rig.walk(lt * 6.2, (1 - app) * 0.9 + 0.05, 0.6), rch = win(u, 0.75, 2.05, 0.4, 0.3);
    const sw = stranger.fk('F', w.shF, w.elF);
    stranger.set(Object.assign(w, { x: sx, s: 1.22, flip: -1, ground: GY, lean: 4 + 5 * rch - 9 * back, tilt: 4,
      handF: [lerp(sw[0], 150, rch), lerp(sw[1], -150, rch)] }));
    place(sShadow, sx, 0, 1);

    // heroine: looks up from phone, then refuses
    const look = prog(u, 0.5, 0.9, ease.io), no = prog(u, 1.65, 2.0, ease.back);
    girl.set({ x: 330, s: 1.2, ground: GY, handF: [lerp(122, 86, no), lerp(-152, -138, no)], prop: 'phone', propTilt: -6 * no,
      handB: [lerp(-52, 150, no), lerp(8, -196, no)], palmB: no > 0.5, palmTilt: 0,
      tilt: 9 * (1 - look), lookY: 1 - look, turn: 0.6 + 0.3 * look, lean: -3 * no, brow: -9 * prog(u, 1.3, 1.8), mouth: u > 1.3 ? 'firm' : 'neutral',
      blink: rig.blink(env.t, 2), hipB: -6 * no, kneeB: 3 * no });

    // personal-detail chips float out of the phone, then get blocked
    const blk = prog(u, 1.8, 2.1, ease.back), hp = girl.handPos('F', 30);
    chips.forEach((ch, i) => {
      const k = prog(u, 0.95 + i * 0.15, 1.3 + i * 0.15, ease.back), pull = prog(u, 1.35, 1.8, ease.io) * (1 - prog(u, 1.85, 2.3, ease.out));
      const shake = Math.sin(lt * 40 + i) * 5 * win(u, 1.8, 2.25, 0.05, 0.3);
      place(ch, lerp(hp[0], chipPos[i][0], k) + pull * 46 + shake, lerp(hp[1], chipPos[i][1], k) + Math.sin(lt * 3 + i * 2) * 7, Math.max(0.001, k) * (1 - 0.12 * prog(u, 1.9, 2.3)));
      show(ch, k > 0); op(ch, 1 - 0.45 * prog(u, 1.9, 2.3));
    });
    place(block, 612, 872, blk > 0 ? lerp(1.9, 1, blk) : 0.001); op(block, prog(u, 1.8, 1.95)); show(block, u > 1.8);
    const lk = prog(u, 2.25, 2.55, ease.back);
    place(lock, hp[0] + 4, hp[1] - 78, Math.max(0.001, lk)); show(lock, lk > 0);

    // profile card grows out of the avatar the pin turned into
    const grow = prog(env.pin < 1 ? -1 : u, 0.4, 0.8, ease.out);
    bg.setAttribute('width', lerp(150, 400, grow).toFixed(1)); op(bg, prog(grow, 0, 0.2)); op(body, prog(grow, 0.5, 1));
    api.cardPos[1] = CARD[1] + Math.sin(lt * 2.2) * 6 * grow;
    place(card, CARD[0], api.cardPos[1], 1);
    show(card, env.pin >= 1 && env.pout <= 0);
  }
  const api = { update, cardPos: [CARD[0], CARD[1]], avatarPos: [CARD[0] - 125, CARD[1]] };
  return api;
});
