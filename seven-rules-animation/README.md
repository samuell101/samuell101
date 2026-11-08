# Seven Rules — motion graphic

Minimalist 2D animation (1920×1080, 60fps, 11.2s). Palette: navy `#101827`, ivory `#F5F0E6`, orange `#FF9F43`.

- `index.html` — the animation, drawn on a canvas. Open it in a browser to watch; click to replay. Add `?t=3.2` to show a single frame.
- `seven-rules.mp4` — the rendered video.
- `render.mjs` — renders the video again: `node render.mjs seven-rules.mp4 60` (needs Playwright and ffmpeg).

| Time | Beat |
|---|---|
| 0–2s | Walks in, stops at center; glowing ring and 7 orbiting dots appear; camera pushes in |
| 2–4s | Dots turn into 7 icons; the 7th (a moon) grows brighter; he points at it |
| 4–6s | Ring turns into the bedroom wall, the moon flies into the window, the room draws in; he walks toward the bed holding a glowing phone |
| 6–8s | Turns, walks to the door, sets the phone on a small table outside; its glow fades |
| 8–9.4s | Walks back and lies down; the door slowly closes |
| 9.4–11.2s | The rest fades out; the closed door turns into a tall glowing rectangle that frames the next scene |
