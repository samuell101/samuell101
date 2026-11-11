/* ------------------------------------------------------------------
   SHARED ART COMPONENTS (SVG markup generators)
   Anything that appears in more than one place — including the objects
   that travel through a transition — is defined once here, so the
   outgoing and incoming versions are pixel-identical.
------------------------------------------------------------------ */
(function () {
  const C = Reel.config.palette;
  const P = {};

  P.text = (x, y, str, size, fill = '#fff', weight = 800, anchor = 'start', extra = '') =>
    `<text x="${x}" y="${y}" font-size="${size}" font-weight="${weight}" fill="${fill}" text-anchor="${anchor}" ${extra}>${str}</text>`;

  /* gradients / filters shared by all scenes */
  P.defs = `
    <radialGradient id="glowWarm"><stop offset="0" stop-color="#FFF4E8" stop-opacity=".95"/><stop offset=".25" stop-color="#FFE2B8" stop-opacity=".5"/><stop offset="1" stop-color="#FFE2B8" stop-opacity="0"/></radialGradient>
    <radialGradient id="glowLav"><stop offset="0" stop-color="#C4B5FD" stop-opacity=".9"/><stop offset=".3" stop-color="#A78BFA" stop-opacity=".4"/><stop offset="1" stop-color="#A78BFA" stop-opacity="0"/></radialGradient>
    <radialGradient id="glowCoral"><stop offset="0" stop-color="#FFB4AE" stop-opacity=".9"/><stop offset=".3" stop-color="#FF7B72" stop-opacity=".4"/><stop offset="1" stop-color="#FF7B72" stop-opacity="0"/></radialGradient>
    <radialGradient id="glowRed"><stop offset="0" stop-color="#EF4444" stop-opacity=".7"/><stop offset="1" stop-color="#EF4444" stop-opacity="0"/></radialGradient>
    <radialGradient id="glowGreen"><stop offset="0" stop-color="#4ADE80" stop-opacity=".6"/><stop offset="1" stop-color="#4ADE80" stop-opacity="0"/></radialGradient>
    <linearGradient id="coneWarm" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#FFE9C9" stop-opacity=".42"/><stop offset="1" stop-color="#FFE9C9" stop-opacity="0"/></linearGradient>
    <linearGradient id="skyNight" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#111827"/><stop offset=".7" stop-color="#272044"/><stop offset="1" stop-color="#3A2D63"/></linearGradient>
    <linearGradient id="skyDusk" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#1B1836"/><stop offset=".45" stop-color="#3A2D63"/><stop offset=".78" stop-color="#B0597A"/><stop offset="1" stop-color="#FF7B72"/></linearGradient>
    <linearGradient id="roomPurple" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#1A1533"/><stop offset="1" stop-color="#322857"/></linearGradient>
    <linearGradient id="streak" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#FFF4E8" stop-opacity=".95"/><stop offset=".35" stop-color="#A78BFA" stop-opacity=".75"/><stop offset="1" stop-color="#A78BFA" stop-opacity="0"/></linearGradient>
    <filter id="blurX" x="-30%" y="-10%" width="160%" height="120%"><feGaussianBlur stdDeviation="14 0"/></filter>
    <filter id="soft" x="-20%" y="-20%" width="140%" height="140%"><feGaussianBlur stdDeviation="10"/></filter>
    <filter id="shadow" x="-20%" y="-20%" width="140%" height="150%"><feDropShadow dx="0" dy="14" stdDeviation="16" flood-color="#0B0A1A" flood-opacity=".45"/></filter>`;

  /* location pin — origin at the centre of its round head */
  P.pin = () => `
    <path class="pin-tail" d="M-27,20 L0,68 L27,20 Z" fill="${C.coral}"/>
    <circle r="34" fill="${C.coral}"/>
    <circle class="pin-dot" r="13" fill="#fff"/>`;

  /* generic profile glyph (fits a r=34 circle) */
  P.profileGlyph = (col = '#fff') => `
    <circle cx="0" cy="-8" r="11" fill="${col}"/>
    <path d="M-20,24 q0,-22 20,-22 q20,0 20,22 z" fill="${col}"/>`;

  /* stranger profile card — 400×150, origin = card centre, avatar at (-125,0) */
  P.profileCard = () => `
    <rect class="card-bg" x="-200" y="-75" width="400" height="150" rx="38" fill="${C.cream}"/>
    <g class="card-body">
      ${P.text(-55, -8, 'UNKNOWN', 33, C.navy)}
      <rect x="-55" y="14" width="150" height="14" rx="7" fill="#D9CFC2"/>
      <rect x="-55" y="38" width="96" height="14" rx="7" fill="#E6DDD0"/>
      <circle cx="162" cy="34" r="17" fill="${C.red}"/>${P.text(162, 44, '?', 27, '#fff', 800, 'middle')}
    </g>
    <g class="card-avatar" transform="translate(-125 0)"><circle r="50" fill="${C.coral}"/><g transform="scale(1.45)">${P.profileGlyph()}</g></g>`;

  /* café invitation / sign board — same footprint as the profile card */
  P.cafeSign = () => `
    <rect x="-200" y="-75" width="400" height="150" rx="38" fill="${C.cream}"/>
    <rect x="-188" y="-63" width="376" height="126" rx="28" fill="none" stroke="${C.coral}" stroke-width="4" stroke-dasharray="2 12" stroke-linecap="round"/>
    <g transform="translate(-118 4)">
      <path d="M-34,-18 h60 v22 a30,30 0 0 1 -60,0 z" fill="${C.purple}"/>
      <path d="M26,-10 h8 a13,13 0 0 1 0,26 h-12" fill="none" stroke="${C.purple}" stroke-width="8" stroke-linecap="round"/>
      <rect x="-44" y="38" width="80" height="8" rx="4" fill="${C.purple}"/>
      <path d="M-14,-30 q-8,-10 0,-20 M6,-30 q-8,-10 0,-20" stroke="${C.coral}" stroke-width="5" fill="none" stroke-linecap="round"/>
    </g>
    ${P.text(-48, 6, 'CAFÉ', 62, C.purple)}
    ${P.text(-46, 44, 'PUBLIC · OPEN', 22, C.coral, 800, 'start', 'letter-spacing="2"')}`;

  /* clock — origin centre, radius 100; hands are .hh / .mh groups */
  P.clock = () => {
    let ticks = '';
    for (let i = 0; i < 12; i++) ticks += `<rect x="-3" y="-88" width="6" height="${i % 3 ? 10 : 18}" rx="3" fill="${C.purple}" transform="rotate(${i * 30})"/>`;
    return `<circle r="100" fill="${C.cream}" stroke="${C.purple}" stroke-width="12"/>
      <g class="clock-face">${ticks}
        <g class="hh"><rect x="-6" y="-50" width="12" height="58" rx="6" fill="${C.purple}"/></g>
        <g class="mh"><rect x="-4.5" y="-76" width="9" height="84" rx="4.5" fill="${C.coral}"/></g>
        <circle r="9" fill="${C.purple}"/></g>`;
  };

  /* number plate — origin centre, 270×76 */
  P.plateText = 'TS09 EA 4521';
  P.plate = () => `
    <rect x="-135" y="-38" width="270" height="76" rx="14" fill="${C.cream}" stroke="${C.navy}" stroke-width="6"/>
    <rect x="-129" y="-32" width="30" height="64" rx="8" fill="#5B6BD6"/>
    ${P.text(17, 12, P.plateText, 30, C.navy, 800, 'middle')}`;

  /* cab — side view, facing left; origin = centre of wheelbase on the ground */
  P.car = (uid = 'car') => `
    <ellipse cx="0" cy="2" rx="330" ry="16" fill="#0B0A1A" opacity=".35"/>
    <g class="car-body">
      <path d="M-306,-58 Q-312,-112 -268,-126 L-170,-146 L-108,-214 Q-96,-230 -72,-230 L112,-230 Q138,-230 154,-212 L214,-146 L282,-134 Q310,-128 308,-100 L304,-58 Q302,-40 284,-40 L-286,-40 Q-304,-40 -306,-58 Z" fill="${C.cream}"/>
      <path d="M-306,-74 L306,-74 L304,-58 Q302,-40 284,-40 L-286,-40 Q-304,-40 -306,-58 Z" fill="#E7D8C6"/>
      <rect x="-300" y="-104" width="604" height="16" fill="${C.coral}"/>
      <clipPath id="${uid}-win"><path d="M-150,-150 L-98,-206 Q-92,-212 -80,-212 L-2,-212 L-2,-150 Z M14,-212 L106,-212 Q122,-212 134,-200 L182,-150 L14,-150 Z"/></clipPath>
      <path d="M-150,-150 L-98,-206 Q-92,-212 -80,-212 L-2,-212 L-2,-150 Z M14,-212 L106,-212 Q122,-212 134,-200 L182,-150 L14,-150 Z" fill="#1B2140"/>
      <g clip-path="url(#${uid}-win)">
        <g class="car-driver"><circle cx="-62" cy="-176" r="20" fill="#B97A52"/><path d="M-84,-180 q4,-24 26,-22 q20,2 18,22 q-12,-12 -44,0 z" fill="#231A1A"/><rect x="-92" y="-156" width="60" height="40" rx="18" fill="#5B6BD6"/></g>
        <g class="car-passenger"></g>
        <path d="M-120,-150 L-76,-212 L-56,-212 L-100,-150 Z M60,-212 L84,-212 L124,-150 L100,-150 Z" fill="#fff" opacity=".1"/>
      </g>
      <rect x="2" y="-140" width="4" height="96" fill="#D9C9B5"/>
      <rect x="-40" y="-132" width="30" height="8" rx="4" fill="#CDBBA5"/><rect x="150" y="-132" width="30" height="8" rx="4" fill="#CDBBA5"/>
      <rect x="-34" y="-256" width="72" height="28" rx="10" fill="${C.lavender}"/>${P.text(2, -235, 'CAB', 19, C.purple, 800, 'middle')}
      <path d="M-306,-116 q4,-10 22,-12 l0,24 q-18,2 -22,-12 z" fill="#FFE9A8"/>
      <rect x="296" y="-122" width="12" height="26" rx="6" fill="${C.red}"/>
      <circle cx="-190" cy="-52" r="62" fill="#191530"/><circle cx="188" cy="-52" r="62" fill="#191530"/>
    </g>
    <g class="wheel" transform="translate(-190 -50)">${P.wheel()}</g>
    <g class="wheel" transform="translate(188 -50)">${P.wheel()}</g>`;
  P.wheel = () => `<g class="spin"><circle r="50" fill="#0F1220"/><circle r="27" fill="#CFC7E8"/>
    <path d="M0,-25 V25 M-25,0 H25 M-17.5,-17.5 L17.5,17.5 M-17.5,17.5 L17.5,-17.5" stroke="#8D84AD" stroke-width="5" stroke-linecap="round"/><circle r="8" fill="#5E567E"/></g>`;

  P.warn = () => `<path d="M0,-58 L58,44 Q60,52 50,52 L-50,52 Q-60,52 -58,44 Z" fill="${C.red}" stroke="#fff" stroke-width="7" stroke-linejoin="round"/>
    <rect x="-6" y="-26" width="12" height="44" rx="6" fill="#fff"/><circle cx="0" cy="33" r="7.5" fill="#fff"/>`;
  P.noSymbol = (r = 90) => `<circle r="${r}" fill="rgba(239,68,68,.16)" stroke="${C.red}" stroke-width="${r * 0.2}"/>
    <line x1="${-r * 0.64}" y1="${-r * 0.64}" x2="${r * 0.64}" y2="${r * 0.64}" stroke="${C.red}" stroke-width="${r * 0.2}" stroke-linecap="round"/>`;
  P.tick = (r = 40) => `<circle r="${r}" fill="${C.green}"/><path d="M${-r * 0.42},${r * 0.04} L${-r * 0.1},${r * 0.36} L${r * 0.46},${-r * 0.3}" stroke="#0B3B1E" stroke-width="${r * 0.2}" fill="none" stroke-linecap="round" stroke-linejoin="round"/>`;
  P.octPoints = r => { let s = ''; for (let i = 0; i < 8; i++) { const a = (22.5 + i * 45) * Math.PI / 180; s += `${(r * Math.cos(a)).toFixed(1)},${(r * Math.sin(a)).toFixed(1)} `; } return s; };

  /* STOP sign that can morph from a disc (m=0) to an octagon (m=1); R = outer radius */
  P.stopSign = (R, m) => {
    const inner = 20 + (R * 0.9 - 20) * m, sw = 2 * (R - inner);
    return `<polygon points="${P.octPoints(inner)}" fill="${C.red}" stroke="${C.red}" stroke-width="${sw.toFixed(1)}" stroke-linejoin="round"/>
      <polygon points="${P.octPoints(R * 0.8)}" fill="none" stroke="#fff" stroke-width="${(R * 0.05).toFixed(1)}" stroke-linejoin="round" opacity="${(m * m).toFixed(2)}"/>`;
  };

  /* 56px line icons, origin centre */
  P.icon = {
    home: c => `<path d="M-24,-2 L0,-24 L24,-2 M-16,-6 V22 H16 V-6" stroke="${c}" stroke-width="7" fill="none" stroke-linecap="round" stroke-linejoin="round"/><rect x="-5" y="6" width="10" height="16" rx="2" fill="${c}"/>`,
    phone: c => `<path d="M-20,-22 q8,-6 14,2 l4,8 q2,5 -4,9 q4,12 16,18 q4,-6 9,-4 l9,4 q8,6 2,14 q-8,8 -22,2 q-26,-12 -36,-38 q-2,-10 8,-15 z" fill="${c}"/>`,
    id: c => `<rect x="-27" y="-19" width="54" height="38" rx="8" stroke="${c}" stroke-width="6" fill="none"/><circle cx="-11" cy="-3" r="6" fill="${c}"/><path d="M-20,11 q9,-10 18,0 M6,-6 H18 M6,6 H18" stroke="${c}" stroke-width="5" fill="none" stroke-linecap="round"/>`,
    lock: c => `<rect x="-17" y="-4" width="34" height="27" rx="7" fill="${c}"/><path d="M-10,-4 v-8 a10,10 0 0 1 20,0 v8" stroke="${c}" stroke-width="6" fill="none"/>`,
    call: c => `<g transform="scale(.8) rotate(0)">${P.icon.phone(c)}</g>`,
    plane: c => `<path d="M-30,-4 L30,-26 L10,28 L-2,6 Z" fill="${c}"/><path d="M-2,6 L30,-26" stroke="#111827" stroke-width="3" opacity=".25"/>`
  };

  /* street light — origin at pole base; lamp head ends at (reach, -h) */
  P.streetlight = (h = 620, reach = 90, glow = 1) => `
    <path d="M${reach - 150},40 L${reach + 150},40 L${reach + 34},${-h + 14} L${reach - 34},${-h + 14} Z" fill="url(#coneWarm)" opacity="${0.5 * glow}"/>
    <rect x="-7" y="${-h + 20}" width="14" height="${h - 20}" rx="7" fill="#3B355C"/>
    <path d="M0,${-h + 26} Q0,${-h} ${reach - 30},${-h}" stroke="#3B355C" stroke-width="12" fill="none" stroke-linecap="round"/>
    <rect x="${reach - 44}" y="${-h - 10}" width="88" height="22" rx="11" fill="#4A4370"/>
    <ellipse cx="${reach}" cy="${-h + 14}" rx="34" ry="8" fill="#FFF4E8"/>
    <circle cx="${reach}" cy="${-h + 20}" r="${170 * glow}" fill="url(#glowWarm)" opacity=".8"/>
    <rect x="-16" y="-14" width="32" height="14" rx="5" fill="#3B355C"/>`;

  /* a block of city buildings; deterministic from seed */
  P.skyline = (seed, w, baseY, minH, maxH, fill, lit) => {
    const r = Reel.U.rng(seed); let s = '', x = 0;
    while (x < w) {
      const bw = 90 + r() * 110, bh = minH + r() * (maxH - minH);
      s += `<rect x="${x.toFixed(0)}" y="${(baseY - bh).toFixed(0)}" width="${(bw + 2).toFixed(0)}" height="${(bh + 4).toFixed(0)}" fill="${fill}"/>`;
      if (lit) for (let wy = baseY - bh + 26; wy < baseY - 40; wy += 46)
        for (let wx = x + 16; wx < x + bw - 24; wx += 34)
          if (r() > 0.55) s += `<rect x="${wx.toFixed(0)}" y="${wy.toFixed(0)}" width="16" height="22" rx="3" fill="${lit}" opacity="${(0.35 + r() * 0.5).toFixed(2)}"/>`;
      x += bw;
    }
    return s;
  };
  P.stars = (seed, n, w, h) => {
    const r = Reel.U.rng(seed); let s = '';
    for (let i = 0; i < n; i++) s += `<circle cx="${(r() * w).toFixed(0)}" cy="${(r() * h).toFixed(0)}" r="${(1 + r() * 2.2).toFixed(1)}" fill="#fff" opacity="${(0.25 + r() * 0.6).toFixed(2)}"/>`;
    return s;
  };
  P.tree = (x, y, s = 1, c1 = '#2F2A55', c2 = '#3B3568') => `<g transform="translate(${x} ${y}) scale(${s})">
    <rect x="-9" y="-150" width="18" height="150" rx="8" fill="#2A2447"/>
    <circle cx="0" cy="-230" r="92" fill="${c1}"/><circle cx="-62" cy="-180" r="62" fill="${c1}"/><circle cx="62" cy="-176" r="66" fill="${c1}"/>
    <circle cx="-24" cy="-256" r="46" fill="${c2}"/><circle cx="46" cy="-214" r="34" fill="${c2}"/></g>`;

  Reel.P = P;
})();
