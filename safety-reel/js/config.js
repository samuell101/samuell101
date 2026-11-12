/* ------------------------------------------------------------------
   REEL CONFIG — everything you are likely to tweak lives here.
   Scene durations are in seconds; the master timeline, the HUD, the
   sound cues and the export script all derive from these numbers.
------------------------------------------------------------------ */
window.Reel = window.Reel || {};

Reel.config = {
  width: 1080,
  height: 1920,
  fps: 30,

  // Length of every scene-to-scene transition (centred on the cut point).
  transition: 0.8,

  // Extra time after scene 10 for the "SHARE THIS" end card.
  outro: 3.2,

  palette: {
    navy: '#111827', purple: '#272044', lavender: '#A78BFA', coral: '#FF7B72',
    cream: '#FFF4E8', white: '#FFFFFF', red: '#EF4444', green: '#4ADE80'
  },

  // label:   on-screen scene label (shown in a numbered pill, as in the storyboard).
  // vo:      the voiceover line for that scene (shown only in the editor
  //          panel as a recording guide — never burned into the video).
  scenes: [
    { id: 'night',     duration: 3, label: 'NIGHT TRAVEL',
      vo: 'Night travel chesthunnappudu mee live location trusted person ki share cheyandi.' },
    { id: 'strangers', duration: 3, label: 'STRANGERS',
      vo: 'Unknown people tho mee personal details share cheyakandi.' },
    { id: 'cafe',      duration: 3, label: 'FIRST MEETING',
      vo: 'First time meet avuthunnappudu public place lo maatrame meet avvandi.' },
    { id: 'college',   duration: 3, label: 'COLLEGE LIFE',
      vo: 'College nunchi late ga return avuthunnappudu family ki inform cheyandi.' },
    { id: 'cab',       duration: 3, label: 'CAB SAFETY',
      vo: 'Cab ekkemundhu number plate and driver details check cheyandi.' },
    { id: 'followed',  duration: 3, label: 'BEING FOLLOWED',
      vo: 'Evaraina follow chesthunnaru anipisthe, crowded places ki vellandi.' },
    { id: 'party',     duration: 3, label: 'PARTIES &amp; OUTINGS',
      vo: 'Mee drink ni unattended ga vadileyakandi.' },
    { id: 'sos',       duration: 3, label: 'EMERGENCY CONTACTS',
      vo: 'Mee phone lock screen meedha emergency contacts accessible ga pettukondi.' },
    { id: 'boundary',  duration: 3, label: 'PERSONAL BOUNDARIES',
      vo: 'Evaraina uncomfortable ga behave chesthe, NO cheppadaniki hesitate avvakandi.' },
    { id: 'emergency', duration: 4, label: 'EMERGENCY',
      vo: 'Danger lo unte help kosam loud ga call cheyandi. Emergency number 112.' }
  ],

  ending: {
    lines: ['SHARE THIS.', 'IT COULD HELP', 'SOMEONE.'],
    vo: 'Ee information mee friends and sisters ki kuda share cheyandi.'
  },

  // VOICEOVER PLACEHOLDER --------------------------------------------
  // Drop your recorded narration at this path (mp3 / wav / m4a). It is
  // synced to the master timeline in the preview and muxed by the export
  // script. `offset` shifts it in seconds (positive = starts later).
  voiceover: { src: 'audio/voiceover.mp3', offset: 0, volume: 1 },

  // Subtle synthesized sound effects (no voice is ever synthesized).
  sfx: { enabled: true, volume: 0.55 }
};

/* Derived master timeline: start/end of each scene + total duration. */
Reel.buildTimeline = function () {
  const c = Reel.config;
  let t = 0;
  const marks = c.scenes.map((s, i) => {
    const m = { index: i, id: s.id, start: t, end: t + s.duration, duration: s.duration };
    t += s.duration;
    return m;
  });
  marks[marks.length - 1].end += c.outro;      // scene 10 hosts the end card
  marks[marks.length - 1].outroAt = t;         // global time the end card begins
  return { marks, total: t + c.outro, outroAt: t };
};
