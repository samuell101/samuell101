# The Power of Silence — animated reel

Cinematic 2D motivational reel. 1080×1920 (9:16), 30 fps, 45 s.

**Theme ("1% Mindset" neon look):** navy-black `#060A12` with a faint grid, blue spotlight cones `#1F6FD8`, glowing white line-art characters, a protagonist with spiky orange hair `#FFA51F`, orange floor glow and corner embers. A HUD frame runs throughout: the header `THE POWER OF SILENCE // PART 01` with a `00–04 /04` rule counter, and a bottom title block (label + rule + number, a bold Poppins ExtraBold title in white/orange, and a mono sub-line `RULE 0X // …`).

- `STORYBOARD.md` — the full production storyboard: shot-by-shot direction, character bible, VO timing sheet and QC checklist.
- `power-of-silence.mp4` — the rendered reel, with synthesized music and sound effects. **No voiceover yet**: record it using the timing sheet in `STORYBOARD.md` and lay it on top.
- `index.html` — the animation, drawn on a canvas with one reusable character rig (`person()`). Open it in a browser to watch; click to replay. Add `?t=12.5` to show a single frame.
- `audio.mjs` — rebuilds `soundtrack.wav` (score + SFX, mixed with headroom for VO): `node audio.mjs`
- `render.mjs` — renders the video and muxes in the soundtrack: `node render.mjs power-of-silence.mp4 30`. Needs Playwright and ffmpeg. `--stills 3.5,9.5 outdir` writes debug PNGs.
- `fonts/` — Poppins, JetBrains Mono and Bebas Neue (SIL Open Font License).

The story beats, timing and VO in `STORYBOARD.md` are unchanged by the theme. Read its colour/typography section as superseded by the theme above.

| Time | Scene | Caption |
|---|---|---|
| 0–5s | Hook: chaotic crowd freezes, he turns to camera, push into his eye | THE POWER OF **SILENCE** |
| 5–13s | Angry: argument, fist clenches, close-up, breath, fist opens, walks away | CONTROL YOUR **ANGER** |
| 13–21s | Planning: friends doubt/laugh/distract → phone off, time-lapse of work until dawn | WORK IN **SILENCE** |
| 21–29s | Provoked: table slam, mocking, shove → close-up of eyes, silence, calm turn away | DON'T REACT. **STAY IN CONTROL** |
| 29–37s | Don't know enough: debate, he listens and observes, insight on the whiteboard, writes it down | LISTEN MORE. **LEARN MORE.** |
| 37–45s | Ending: distractions dissolve, the golden path opens, end card | SPEAK WITH PURPOSE. **STAY SILENT WITH POWER.** |
