/* ------------------------------------------------------------------
   CHARACTER RIG
   One reusable, posable SVG person. The heroine and every supporting
   character are instances of this rig with a different "look", so
   proportions, joints and colours stay identical in all 10 scenes.

   Local space: origin = hip centre, +x = facing direction, y down.
   Angles are in degrees, "forward" (towards +x) is positive.
------------------------------------------------------------------ */
(function () {
  const { clamp, lerp } = Reel.U;
  const D = Math.PI / 180;
  const DIM = { thigh: 140, shin: 130, upper: 100, fore: 95, shX: 44, shY: -186, hipX: 15, neckY: -212 };
  const FOOT = 20;                       // ankle → ground

  const LOOKS = {
    girl: {
      skin: '#C98B62', skinShade: '#AE6F49', hair: '#1D1524', hairHi: '#45324F',
      top: '#A78BFA', topShade: '#8E70EE', trousers: '#3A2F6C', trousersShade: '#2C2356',
      shoe: '#FFFFFF', sole: '#D8D0F5', pack: '#4A2A5E', packShade: '#371D48',
      lips: '#9E3F3A', hairStyle: 'wavy', backpack: true, shortSleeve: true, earrings: true
    },
    stranger: {
      skin: '#3A304F', skinShade: '#2E2640', hair: '#1A1526', hairHi: '#1A1526',
      top: '#4A4166', topShade: '#3C3455', trousers: '#231D36', trousersShade: '#1B162B',
      shoe: '#6B6385', sole: '#4A4166', lips: '#2E2640', hairStyle: 'hood', faceless: true
    },
    friend: {
      skin: '#B97A52', skinShade: '#9C623F', hair: '#231A1A', hairHi: '#3D2C2C',
      top: '#2E2B45', topShade: '#232036', trousers: '#4B5378', trousersShade: '#3B4263',
      shoe: '#FFFFFF', sole: '#D8D0F5', lips: '#8A3B33', hairStyle: 'short'
    },
    extraA: {
      skin: '#B4764F', skinShade: '#9A5F3C', hair: '#20171F', hairHi: '#20171F',
      top: '#FF7B72', topShade: '#E5625A', trousers: '#34406B', trousersShade: '#283357',
      shoe: '#FFF4E8', sole: '#C9C1E6', lips: '#8A3B33', hairStyle: 'bun'
    },
    extraB: {
      skin: '#D09A72', skinShade: '#B57E58', hair: '#2A1E1A', hairHi: '#2A1E1A',
      top: '#FFF4E8', topShade: '#E6D6C3', trousers: '#5B4B8A', trousersShade: '#4A3C75',
      shoe: '#FFFFFF', sole: '#C9C1E6', lips: '#8A3B33', hairStyle: 'short'
    },
    extraC: {
      skin: '#A86B45', skinShade: '#8E5735', hair: '#17121C', hairHi: '#17121C',
      top: '#6D5BD0', topShade: '#5B4BB8', trousers: '#2B3252', trousersShade: '#222843',
      shoe: '#FFF4E8', sole: '#C9C1E6', lips: '#7A342E', hairStyle: 'long'
    },
    extraD: {
      skin: '#C48A63', skinShade: '#A9714D', hair: '#1D1524', hairHi: '#1D1524',
      top: '#4ADE80', topShade: '#35C36A', trousers: '#33294F', trousersShade: '#281F40',
      shoe: '#FFFFFF', sole: '#C9C1E6', lips: '#8A3B33', hairStyle: 'short'
    }
  };

  LOOKS.guy = Object.assign({}, LOOKS.friend, { top: '#34314F', topShade: '#28263E', trousers: '#262338', trousersShade: '#1D1B2C', hairStyle: 'short' });

  const HAIR = {
    wavy: {
      back: 'M-56,-70 C-60,-116 -28,-128 0,-128 C28,-128 60,-116 56,-70 C62,-46 76,-30 69,-6 C63,14 78,30 69,54 C60,78 38,84 26,68 C17,56 21,38 14,18 L-14,18 C-21,38 -17,56 -26,68 C-38,84 -60,78 -69,54 C-78,30 -63,14 -69,-6 C-76,-30 -62,-46 -56,-70 Z',
      front: 'M-47,-58 C-53,-104 -25,-120 2,-120 C29,-120 52,-104 47,-56 C43,-80 30,-95 10,-100 C-3,-86 -25,-71 -47,-58 Z'
    },
    bob: {
      back: 'M-54,-70 C-56,-113 -28,-125 0,-125 C28,-125 56,-113 54,-70 C56,-42 64,-12 59,7 C42,17 24,13 15,3 L-15,3 C-24,13 -42,17 -59,7 C-64,-12 -56,-42 -54,-70 Z',
      front: 'M-47,-60 C-52,-104 -25,-118 2,-118 C29,-118 51,-103 47,-58 C42,-80 28,-94 8,-99 C-5,-86 -26,-72 -47,-60 Z'
    },
    long: {
      back: 'M-54,-70 C-56,-113 -28,-125 0,-125 C28,-125 56,-113 54,-70 C58,-20 62,30 54,62 C36,70 22,60 16,40 L-16,40 C-22,60 -36,70 -54,62 C-62,30 -58,-20 -54,-70 Z',
      front: 'M-47,-60 C-52,-104 -25,-118 2,-118 C29,-118 51,-103 47,-58 C40,-84 22,-98 0,-100 C-18,-96 -38,-82 -47,-60 Z'
    },
    bun: {
      back: 'M-50,-66 C-54,-112 -26,-124 0,-124 C28,-124 54,-112 50,-66 C52,-48 52,-34 46,-24 L-46,-24 C-52,-34 -52,-48 -50,-66 Z M-24,-146 a20,20 0 1,0 40,0 a20,20 0 1,0 -40,0 Z',
      front: 'M-47,-60 C-52,-104 -25,-118 2,-118 C29,-118 51,-103 47,-58 C42,-82 26,-96 4,-100 C-14,-94 -36,-80 -47,-60 Z'
    },
    short: {
      back: 'M-46,-62 C-54,-116 -22,-126 2,-126 C32,-126 54,-108 46,-62 C42,-82 34,-96 4,-100 C-26,-98 -40,-84 -46,-62 Z',
      front: ''
    },
    hood: {
      back: 'M-62,-40 C-70,-112 -34,-136 0,-136 C34,-136 70,-112 62,-40 C60,-14 52,4 40,10 L-40,10 C-52,4 -60,-14 -62,-40 Z',
      front: ''
    }
  };

  let uid = 0;

  function palmMarkup(L) {
    return `<rect x="-13" y="-62" width="8.4" height="30" rx="4.2" fill="${L.skin}"/>
              <rect x="-4" y="-68" width="8.4" height="36" rx="4.2" fill="${L.skin}"/>
              <rect x="5" y="-66" width="8.4" height="34" rx="4.2" fill="${L.skin}"/>
              <rect x="14" y="-56" width="8" height="26" rx="4" fill="${L.skin}"/>
              <rect x="-17" y="-40" width="38" height="46" rx="13" fill="${L.skin}"/>
              <rect x="-27" y="-30" width="14" height="32" rx="7" fill="${L.skin}" transform="rotate(-30 -14 0)"/>`;
  }

  function markup(L, id) {
    const hs = HAIR[L.hairStyle] || HAIR.bob;
    const hood = L.hairStyle === 'hood';
    const arm = (cls, col) => `
      <g class="${cls}">
        <line x1="0" y1="0" x2="0" y2="${DIM.upper}" stroke="${col}" stroke-width="30" stroke-linecap="round"/>
        <g class="elbow" transform="translate(0 ${DIM.upper})">
          <line x1="0" y1="0" x2="0" y2="${DIM.fore - 12}" stroke="${L.shortSleeve ? (cls === 'armB' ? L.skinShade : L.skin) : col}" stroke-width="${L.shortSleeve ? 22 : 26}" stroke-linecap="round"/>${L.shortSleeve ? `<circle r="15" fill="${col}"/>` : ''}
          <g class="hand" transform="translate(0 ${DIM.fore})"><g class="upright">
            <g class="fist"><circle r="14.5" fill="${L.skin}"/></g>
            <g class="palm" style="display:none">
              ${palmMarkup(L)}
            </g>
            <g class="prop-phone" style="display:none">
              <rect x="-18" y="-56" width="36" height="66" rx="8" fill="#0B1020"/>
              <rect x="-14.5" y="-52" width="29" height="58" rx="5" fill="url(#${id}-scr)"/>
              <rect x="-22" y="-12" width="13" height="22" rx="6.5" fill="${L.skin}"/>
            </g>
            <g class="prop-phone-ear" style="display:none">
              <rect x="-9" y="-62" width="18" height="70" rx="7" fill="#0B1020"/>
              <rect x="-9" y="-62" width="6" height="70" rx="3" fill="#2A3350"/>
              <rect x="-4" y="-22" width="20" height="13" rx="6.5" fill="${L.skin}"/>
              <rect x="-4" y="-6" width="20" height="13" rx="6.5" fill="${L.skin}"/>
            </g>
            <g class="prop-glass" style="display:none">
              <path d="M-17,-58 L17,-58 L13,6 Q13,10 9,10 L-9,10 Q-13,10 -13,6 Z" fill="#FFF4E8" opacity=".28"/>
              <path d="M-15.4,-34 L15.4,-34 L13,6 Q13,10 9,10 L-9,10 Q-13,10 -13,6 Z" fill="#FB923C"/>
              <ellipse cx="0" cy="-34" rx="15.4" ry="3.6" fill="#FDBA74"/>
              <ellipse cx="0" cy="-58" rx="17" ry="4" fill="none" stroke="#FFF4E8" stroke-width="2.2" opacity=".9"/>
              <rect x="-20" y="-20" width="13" height="24" rx="6.5" fill="${L.skin}"/>
            </g>
          </g></g>
        </g>
      </g>`;
    const leg = (cls, col) => `
      <g class="${cls}">
        <line x1="0" y1="0" x2="0" y2="${DIM.thigh}" stroke="${col}" stroke-width="50" stroke-linecap="round"/>
        <g class="knee" transform="translate(0 ${DIM.thigh})">
          <line x1="0" y1="0" x2="0" y2="${DIM.shin - 14}" stroke="${col}" stroke-width="40" stroke-linecap="round"/>
          <g class="foot" transform="translate(0 ${DIM.shin})">
            <path d="M-18,-10 q0,-11 12,-11 h13 q8,15 26,19 q13,3 13,13 v${FOOT - 13} h-64 z" fill="${L.shoe}"/>
            <rect x="-18" y="${FOOT - 7}" width="64" height="7" rx="3.5" fill="${L.sole}"/>
          </g>
        </g>
      </g>`;
    const face = L.faceless ? `
        <ellipse cx="4" cy="-58" rx="40" ry="46" fill="${L.skinShade}"/>
        <g class="features"><ellipse cx="-8" cy="-60" rx="5" ry="2.4" fill="#7C7396" opacity=".55"/><ellipse cx="22" cy="-60" rx="5" ry="2.4" fill="#7C7396" opacity=".55"/></g>` : `
        <ellipse cx="0" cy="-58" rx="42" ry="48" fill="${L.skin}"/>
        <circle cx="-25" cy="-41" r="8.5" fill="#FF7B72" opacity=".22"/><circle cx="26" cy="-41" r="8.5" fill="#FF7B72" opacity=".22"/>
        <g class="features">
          <g class="browL"><path d="M-27,-79 q9,-6 19,-2" stroke="${L.hair}" stroke-width="4.2" fill="none" stroke-linecap="round"/></g>
          <g class="browR"><path d="M8,-81 q10,-4 19,2" stroke="${L.hair}" stroke-width="4.2" fill="none" stroke-linecap="round"/></g>
          <g class="eyes">
            <ellipse cx="-17" cy="-60" rx="8.4" ry="9.4" fill="#fff"/><ellipse cx="17" cy="-60" rx="8.4" ry="9.4" fill="#fff"/>
            <g class="pupils">
              <circle cx="-17" cy="-59.5" r="5.6" fill="#1D1524"/><circle cx="17" cy="-59.5" r="5.6" fill="#1D1524"/>
              <circle cx="-15" cy="-62" r="1.8" fill="#fff"/><circle cx="19" cy="-62" r="1.8" fill="#fff"/>
            </g>
            <path d="M-27,-63 q10,-10 20,0" stroke="${L.hair}" stroke-width="3.2" fill="none" stroke-linecap="round"/>
            <path d="M7,-63 q10,-10 20,0" stroke="${L.hair}" stroke-width="3.2" fill="none" stroke-linecap="round"/>
          </g>
          <g class="lids" style="display:none">
            <path d="M-26,-59 q9,5 18,0" stroke="${L.hair}" stroke-width="3.4" fill="none" stroke-linecap="round"/>
            <path d="M8,-59 q9,5 18,0" stroke="${L.hair}" stroke-width="3.4" fill="none" stroke-linecap="round"/>
          </g>
          <path d="M2,-52 q5,8 -2,11" stroke="${L.skinShade}" stroke-width="3" fill="none" stroke-linecap="round"/>
          <g class="mouths">
            <path class="m-smile" d="M-11,-33 q12,11 24,0" stroke="${L.lips}" stroke-width="4" fill="none" stroke-linecap="round"/>
            <path class="m-neutral" d="M-8,-30 q9,3 18,0" stroke="${L.lips}" stroke-width="4" fill="none" stroke-linecap="round"/>
            <path class="m-worry" d="M-8,-27 q9,-6 18,0" stroke="${L.lips}" stroke-width="4" fill="none" stroke-linecap="round"/>
            <path class="m-firm" d="M-9,-29 q10,-2 20,0" stroke="${L.lips}" stroke-width="4.4" fill="none" stroke-linecap="round"/>
            <g class="m-open"><ellipse cx="1" cy="-28" rx="9" ry="7.5" fill="#5A1E22"/><ellipse cx="1" cy="-24" rx="5.5" ry="3" fill="#D8615A"/></g>
          </g>
        </g>`;
    return `
    <defs>
      <linearGradient id="${id}-top" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="${L.top}"/><stop offset="1" stop-color="${L.topShade}"/></linearGradient>
      <linearGradient id="${id}-scr" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#EDE9FE"/><stop offset="1" stop-color="#A78BFA"/></linearGradient>
    </defs>
    <g class="body">
      <g class="up"><g transform="translate(${-DIM.shX} ${DIM.shY})">${arm('armB', L.topShade)}</g></g>
      ${L.backpack ? `<g class="up"><g class="pack">
        <rect x="-82" y="-190" width="62" height="128" rx="24" fill="${L.pack}"/>
        <rect x="-82" y="-124" width="34" height="48" rx="12" fill="${L.packShade}"/>
        <rect x="-60" y="-200" width="22" height="16" rx="8" fill="${L.packShade}"/>
      </g></g>` : ''}
      <g transform="translate(${-DIM.hipX} 0)">${leg('legB', L.trousersShade)}</g>
      <g transform="translate(${DIM.hipX} 0)">${leg('legF', L.trousers)}</g>
      <rect x="-42" y="-18" width="84" height="46" rx="22" fill="${L.trousers}"/>
      <g class="up">
        <rect x="-12" y="-232" width="24" height="40" rx="10" fill="${L.skinShade}"/>
        <path d="M-58,-186 Q-60,-206 -38,-208 L38,-208 Q60,-206 58,-186 L46,-96 Q44,-44 50,2 Q50,16 36,16 L-36,16 Q-50,16 -50,2 Q-44,-44 -46,-96 Z" fill="url(#${id}-top)"/>
        <path d="M-17,-208 Q0,-190 17,-208 Z" fill="${L.skin}"/>
        ${L.backpack ? `<path d="M-33,-208 Q-42,-160 -47,-112" stroke="${L.pack}" stroke-width="10" fill="none" stroke-linecap="round"/>
        <path d="M33,-208 Q42,-160 47,-112" stroke="${L.pack}" stroke-width="10" fill="none" stroke-linecap="round"/>` : ''}
        <g class="head" transform="translate(0 ${DIM.neckY})">
          <g class="hairBack"><path d="${hs.back}" fill="${hood ? L.top : L.hair}"/></g>
          ${face}
          ${L.earrings ? `<circle cx="-43" cy="-30" r="8" fill="none" stroke="#F6E7C8" stroke-width="3.5"/><circle cx="43" cy="-30" r="8" fill="none" stroke="#F6E7C8" stroke-width="3.5"/>` : ''}
          ${hs.front ? `<g class="hairFront"><path d="${hs.front}" fill="${L.hair}"/><path d="M-30,-101 q20,-13 44,-9" stroke="${L.hairHi}" stroke-width="3.5" fill="none" stroke-linecap="round" opacity=".8"/></g>` : '<g class="hairFront"></g>'}
        </g>
      </g>
      <g class="up"><g transform="translate(${DIM.shX} ${DIM.shY})">${arm('armF', L.top)}</g></g>
    </g>`;
  }

  const DEFAULTS = {
    x: 0, y: 0, s: 1, flip: 1, rot: 0, opacity: 1, ground: null,
    hipF: 0, kneeF: 0, hipB: 0, kneeB: 0,
    shF: 4, elF: 10, shB: -6, elB: 10, handF: null, handB: null,
    lean: 0, tilt: 0, turn: 0.45, blink: 0, brow: 0, browY: 0,
    mouth: 'smile', lookX: 0, lookY: 0,
    prop: null, propTilt: 0, propB: null, palmF: false, palmB: false, palmScale: 1, palmTilt: 0
  };

  /* two-bone IK: local target → shoulder + elbow angles */
  function reach(side, tx, ty) {
    const sx = side === 'F' ? DIM.shX : -DIM.shX, sy = DIM.shY;
    const a = DIM.upper, b = DIM.fore;
    const dx = tx - sx, dy = ty - sy;
    const d = clamp(Math.hypot(dx, dy), Math.abs(a - b) + 2, a + b - 0.5);
    let th = Math.atan2(dx, dy);
    if (th < -Math.PI / 2) th += 2 * Math.PI;      // keep 'up and over' reaches continuous
    const A = Math.acos(clamp((a * a + d * d - b * b) / (2 * a * d), -1, 1));
    const E = Math.acos(clamp((a * a + b * b - d * d) / (2 * a * b), -1, 1));
    return { sh: (th - A) / D, el: 180 - E / D };
  }

  function Person(parent, look) {
    const L = typeof look === 'string' ? LOOKS[look] : look;
    const id = 'p' + (++uid);
    const root = Reel.U.svg('g', { class: 'person' }, parent);
    root.innerHTML = markup(L, id);
    const q = s => root.querySelector(s);
    const qa = s => Array.from(root.querySelectorAll(s));
    const el = {
      body: q('.body'), ups: qa('.up'),
      armF: q('.armF'), armB: q('.armB'), elbF: q('.armF .elbow'), elbB: q('.armB .elbow'),
      upF: q('.armF .upright'), upB: q('.armB .upright'),
      legF: q('.legF'), legB: q('.legB'), kneeF: q('.legF .knee'), kneeB: q('.legB .knee'),
      footF: q('.legF .foot'), footB: q('.legB .foot'),
      head: q('.head'), hairBack: q('.hairBack'), hairFront: q('.hairFront'), features: q('.features'),
      eyes: q('.eyes'), lids: q('.lids'), pupils: q('.pupils'), browL: q('.browL'), browR: q('.browR'),
      mouths: qa('.mouths > *')
    };
    const propEls = side => ({
      fist: q(`.arm${side} .fist`), palm: q(`.arm${side} .palm`),
      phone: q(`.arm${side} .prop-phone`), ear: q(`.arm${side} .prop-phone-ear`), glass: q(`.arm${side} .prop-glass`)
    });
    const props = { F: propEls('F'), B: propEls('B') };
    const state = Object.assign({}, DEFAULTS);
    let lastMouth = null;

    function set(p) {
      const s = Object.assign(state, DEFAULTS, p);
      let { shF, elF, shB, elB } = s;
      if (s.handF) { const r = reach('F', s.handF[0], s.handF[1]); shF = r.sh; elF = r.el; }
      if (s.handB) { const r = reach('B', s.handB[0], s.handB[1]); shB = r.sh; elB = r.el; }
      s._shF = shF; s._elF = elF; s._shB = shB; s._elB = elB;

      // legs (forward kinematics) + keep the lowest foot on the ground
      const fy = (h, k) => DIM.thigh * Math.cos(h * D) + DIM.shin * Math.cos((h - k) * D);
      let y = s.y;
      if (s.ground !== null) y = s.ground - s.s * (Math.max(fy(s.hipF, s.kneeF), fy(s.hipB, s.kneeB)) + FOOT);
      s._y = y;
      root.setAttribute('transform',
        `translate(${s.x.toFixed(2)} ${y.toFixed(2)}) rotate(${s.rot.toFixed(2)}) scale(${(s.s * s.flip).toFixed(4)} ${s.s.toFixed(4)})`);
      root.setAttribute('opacity', s.opacity.toFixed(3));
      root.style.display = s.opacity <= 0.001 ? 'none' : '';

      const R = (e, a) => e.setAttribute('transform', `rotate(${a.toFixed(2)})`);
      const RT = (e, y0, a) => e.setAttribute('transform', `translate(0 ${y0}) rotate(${a.toFixed(2)})`);
      R(el.legF, -s.hipF); RT(el.kneeF, DIM.thigh, s.kneeF); RT(el.footF, DIM.shin, (s.hipF - s.kneeF) * 0.85);
      R(el.legB, -s.hipB); RT(el.kneeB, DIM.thigh, s.kneeB); RT(el.footB, DIM.shin, (s.hipB - s.kneeB) * 0.85);
      for (const u of el.ups) R(u, s.lean);
      R(el.armF, -shF); RT(el.elbF, DIM.upper, -elF);
      R(el.armB, -shB); RT(el.elbB, DIM.upper, -elB);
      const pF = s.palmF ? s.palmScale : 1;
      el.upF.setAttribute('transform', `rotate(${(shF + elF - s.lean + (s.palmF ? s.palmTilt : s.propTilt)).toFixed(2)}) scale(${pF})`);
      el.upB.setAttribute('transform', `rotate(${(shB + elB - s.lean + (s.palmB ? s.palmTilt : 0)).toFixed(2)})`);

      const setProps = (P, prop, palm) => {
        P.palm.style.display = palm ? '' : 'none';
        P.fist.style.display = palm ? 'none' : '';
        P.phone.style.display = prop === 'phone' ? '' : 'none';
        P.ear.style.display = prop === 'ear' ? '' : 'none';
        P.glass.style.display = prop === 'glass' ? '' : 'none';
      };
      setProps(props.F, s.prop, s.palmF); setProps(props.B, s.propB, s.palmB);

      // head + face
      el.head.setAttribute('transform', `translate(0 ${DIM.neckY}) rotate(${s.tilt.toFixed(2)})`);
      const tr = clamp(s.turn, -1, 1);
      el.features.setAttribute('transform', `translate(${(tr * 13).toFixed(2)} ${(s.lookY * 1.5).toFixed(2)})`);
      el.hairBack.setAttribute('transform', `translate(${(-tr * 6).toFixed(2)} 0)`);
      el.hairFront.setAttribute('transform', `translate(${(tr * 3).toFixed(2)} 0)`);
      if (el.eyes) {
        const b = clamp(s.blink);
        el.eyes.setAttribute('transform', `translate(0 ${(-60 * (1 - (1 - b * 0.92))).toFixed(2)}) scale(1 ${(1 - b * 0.92).toFixed(3)})`);
        el.eyes.style.display = b > 0.8 ? 'none' : '';
        el.lids.style.display = b > 0.8 ? '' : 'none';
        el.pupils.setAttribute('transform', `translate(${(s.lookX * 3).toFixed(2)} ${(s.lookY * 3).toFixed(2)})`);
        el.browL.setAttribute('transform', `translate(0 ${s.browY}) rotate(${(-s.brow).toFixed(2)} -17 -80)`);
        el.browR.setAttribute('transform', `translate(0 ${s.browY}) rotate(${s.brow.toFixed(2)} 17 -80)`);
        if (s.mouth !== lastMouth) {
          lastMouth = s.mouth;
          for (const m of el.mouths) m.style.display = m.classList.contains('m-' + s.mouth) ? '' : 'none';
        }
      }
      return api;
    }

    /* stage-space position of a hand for the last applied pose */
    function handPos(side = 'F', lift = 0) {
      const s = state, sx = side === 'F' ? DIM.shX : -DIM.shX;
      const sh = (side === 'F' ? s._shF : s._shB) * D, e = (side === 'F' ? s._elF : s._elB) * D;
      let lx = sx + DIM.upper * Math.sin(sh) + DIM.fore * Math.sin(sh + e);
      let ly = DIM.shY + DIM.upper * Math.cos(sh) + DIM.fore * Math.cos(sh + e) - lift;
      const c = Math.cos(s.lean * D), n = Math.sin(s.lean * D);
      const rx = lx * c - ly * n, ry = lx * n + ly * c;
      return [s.x + s.flip * s.s * rx, s._y + s.s * ry];
    }
    /* local hand position for given joint angles (to blend FK → IK) */
    function fk(side, sh, e) {
      const sx = side === 'F' ? DIM.shX : -DIM.shX;
      return [sx + DIM.upper * Math.sin(sh * D) + DIM.fore * Math.sin((sh + e) * D),
        DIM.shY + DIM.upper * Math.cos(sh * D) + DIM.fore * Math.cos((sh + e) * D)];
    }

    const api = { root, set, handPos, fk, state, look: L };
    set({});
    return api;
  }

  /* natural blink driven purely by time (deterministic) */
  function blink(t, seed = 0) {
    const period = 2.3 + (seed % 5) * 0.37;
    const ph = ((t + seed * 1.31) % period + period) % period;
    return ph < 0.15 ? Math.sin((ph / 0.15) * Math.PI) : 0;
  }

  /* walk cycle: returns joint angles for a phase (radians) */
  function walk(ph, amp = 1, armAmp = 1) {
    const s = Math.sin(ph), c = Math.cos(ph);
    return {
      hipF: 27 * s * amp, kneeF: 6 + 50 * Math.max(0, c) * amp,
      hipB: -27 * s * amp, kneeB: 6 + 50 * Math.max(0, -c) * amp,
      shF: -26 * s * armAmp, elF: 16 + 10 * Math.max(0, -s) * armAmp,
      shB: 26 * s * armAmp, elB: 16 + 10 * Math.max(0, s) * armAmp,
      lean: 3 * amp
    };
  }

  const SIT = { hipF: 86, kneeF: 86, hipB: 80, kneeB: 82 };
  const HEIGHT = DIM.thigh + DIM.shin + FOOT;     // hip → ground when standing

  Reel.Person = Person;
  Reel.rig = { blink, walk, SIT, HEIGHT, DIM, LOOKS, palmMarkup };
})();
