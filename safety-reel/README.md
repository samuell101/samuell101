# 10 Safety Rules Every Girl Must Know — animated reel

A 34-second, 9:16 (1080×1920, 30 fps) 2D vector explainer built only with
HTML, CSS, JavaScript and SVG. No video clips, no dependencies.

* **Finished render:** `output/safety-reel.mp4` (with sound effects, no narration; follows the storyboard)
* **Live preview:** open `index.html` in a browser

## Preview

Open `index.html`. Controls: play / pause / restart, speed (0.25×–2×), loop,
sound-FX toggle, a scrubbable timeline and a jump button per scene.
Keys: `Space`, `←` `→` (one frame), `1`–`9` `0` (scene), `R`.

## Export to MP4

```bash
npm i playwright && npx playwright install chromium   # once; ffmpeg must be on PATH
node tools/render.js                                   # → output/safety-reel.mp4
```

The script seeks the timeline frame by frame (1026 frames), so the result is
frame-exact rather than a screen recording. It mixes in the sound-effects bed
and, if present, `audio/voiceover.mp3`. Options: `--fps`, `--out`, `--no-sfx`,
`--voiceover <file>`, `--seconds <n>` (quick partial test).

## Adding the narration

See `audio/README.md` for the script and timings. Nothing is synthesized —
the voiceover track is an empty placeholder until you add your recording.

## How it is organised

| File | What it holds |
|------|---------------|
| `js/config.js` | Scene durations, transition length, on-screen keywords, voiceover lines, palette |
| `js/character.js` | The reusable character rig (one rig; the heroine and every extra are "looks" of it) |
| `js/props.js` | Shared art: pin, cards, clock, cab, signs, street furniture |
| `js/scenes/s01…s10` | One file per scene |
| `js/transitions.js` | The nine match-cut transitions |
| `js/hud.js` | Progress bar, rule badge, keyword titles, opening hook |
| `js/audio.js` | Sound-effect cue sheet + synth, voiceover sync, offline audio render |
| `js/player.js` | Master timeline, controls, `render(t)` |

Everything on screen is a pure function of the timeline time `t`, which is why
scrubbing, any playback speed and export all show identical frames.

**Retiming:** change a scene's `duration` in `js/config.js`; that scene's
action stretches to fit and everything after it shifts.

Fonts: Poppins (SIL Open Font License, bundled in `fonts/`).
