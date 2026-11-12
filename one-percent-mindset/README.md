# The 1% Mindset — animated reel (47s, 1080×1920)

A 2D stick-figure animation drawn with code on an HTML canvas. There are no AI-generated video clips. Every character, prop, UI screen and title is a function you can edit in `index.html`.

| File | What it is |
|---|---|
| `one-percent-mindset.mp4` | Final reel: 1080×1920, 30fps, 47.0s, with sound design and score (no voiceover) |
| `storyboard.png` | All 9 storyboard frames, each with its camera move and transition notes |
| `character-style-sheet.png` | Hero turnaround (front, 3/4, side, back, walk), expressions, supporting cast, palette, typography |
| `index.html` | The animation. Open it in a browser to play (click to pause). Add `?t=12.5` to view one frame, `?mode=board` for the storyboard, `?mode=sheet` for the style sheet |
| `render.mjs` / `sound.py` / `sheets.mjs` | Rebuild the video, the audio and the sheets |

## Rebuild
```bash
node render.mjs build/silent.mp4 30        # frames -> silent.mp4 + build/sfx.json (sound cue sheet)
python3 sound.py build/sfx.json build/sound.wav
ffmpeg -i build/silent.mp4 -i build/sound.wav -c:v copy -c:a aac -b:a 192k -shortest one-percent-mindset.mp4
node sheets.mjs
```
Requires Playwright (Chromium), ffmpeg and Python with numpy.

## Timing (the 53s script fitted to 47s; voiceover text unchanged)
| # | Time | Voiceover | On-screen text | Camera | Into next scene |
|---|---|---|---|---|---|
| 01 | 0.0–4.0 | Ee generation lo successful avvalante… mundhu nee mindset 99% people ki different ga undali. | 99% FOLLOW THE CROWD → 1% THINK DIFFERENT | Push-in 1.1→1.45x; crowd blurs as he stops and lifts his head; amber backlight | Dive into his eye; scene 2 opens inside the pupil |
| 02 | 4.0–9.5 | Andharu easy money kosam chase chesthunte, nuvvu valuable skill nerchuko. Money skill venaka vasthundi. | CHASE SKILLS. NOT SHORTCUTS. | Split screen: shaky, fast left side (get-rich notifications); steady right side (editing timeline, skill bar fills) | His monitor timeline expands to fill the frame |
| 03 | 9.5–15.0 | Friends weekend plans chesthunte, nee goals kosam konni weekends sacrifice cheyyadam nerchuko. | SHORT-TERM FUN vs LONG-TERM GOALS | Pull back out of the monitor; phone buzzes, party invite; push in; phone goes face down, back to work | Push into the phone; cross-fade to the email |
| 04 | 15.0–20.5 | Evaraina ninnu reject chesthe, nee worth ni doubt cheyaku. Rejection ni personal ga teesukokunda move on avvu. | REJECTION IS NOT YOUR VALUE. | Full-screen rejection email pulls back to him outside the office; deep breath; he walks; light turns warm; camera follows his steps | Footsteps match-cut |
| 05 | 20.5–26.0 | Nee age vaallu cars, phones konukkuntunnaru ani pressure feel avvaku. Vallatho compare avvadam kanna, nee financial future build chesuko. | BUILD YOUR FUTURE. NOT THEIR IMAGE. | Tilt up from his feet: luxury store, a sports car passes, a show-off takes selfies; close on his cracked phone and empty wallet; he sits and opens his laptop to a savings graph | The rising graph becomes a progress bar |
| 06 | 26.0–31.0 | Motivation kosam wait cheyaku. Mood baalekapoyina nee work complete cheyyadam nerchuko. | DISCIPLINE OVER MOTIVATION | Night, clock at 11:30; rubs his eyes, half-closes the laptop, dozes; sits up, opens it, finishes (100% ✓) | Lid closes; black |
| 07 | 31.0–36.0 | Prathi okkaritho nee success gurinchi discuss cheyaku. Nee progress ni prove cheyadaniki social media validation avasaram ledu. | WORK IN SILENCE. | Lit only by his phone: likes and views pop up; he swipes them away and switches it off; spotlight comes on; pan across finished work; zoom out to him standing | Pull back, dip to dark |
| 08 | 36.0–41.5 | Biggest thing enti telusa? Nee mistakes ki excuses cheppadam aapi, responsibility teesukovadam start cheyyi. | TAKE RESPONSIBILITY. | Pull back out of the mirror to an over-the-shoulder; memories (missed deadline, unfinished work, excuses) fade in behind his lowered reflection; he lifts his head and they dissolve; push in | Mirror fills with sunrise light |
| 09 | 41.5–47.0 | 1% men ante special ga puttina vaallu kaadu… difficult choices ni daily choose chesukune vaallu. | THE 1% MINDSET / BUILD YOURSELF. | From behind him, slow pull-back as he walks to the sunrise; thumbnails of earlier scenes drift past | Final impact, fade to black |

## Sound
The track is generated procedurally from a cue sheet that `index.html` exports, so the effects stay in sync with the picture. It includes a soft pad score that changes chord each scene, a low pulse, bass impacts on the reveals (2.0s, 34.0s, 38.7s, 44.2s, 45.0s final), whooshes on transitions, notification pops, phone vibration, keyboard typing, footsteps timed to the walk cycles, clock ticks and a car pass. The mid range is kept clear for a voiceover recorded on top.
