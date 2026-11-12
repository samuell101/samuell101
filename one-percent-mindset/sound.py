"""Synthesises the reel's sound design (score + SFX) from build/sfx.json.
Usage: python3 sound.py build/sfx.json build/sound.wav
Everything is generated procedurally with numpy — no samples needed.
The mix leaves headroom in the 300 Hz–3 kHz range for a voiceover."""
import json, sys, wave
import numpy as np

SR = 44100
DUR = 47.0
N = int(SR * DUR)
rng = np.random.default_rng(11)
L = np.zeros(N); R = np.zeros(N)


def t_(d):
    return np.arange(int(SR * d)) / SR


def place(sig, t0, gain=1.0, pan=0.0):
    i = int(t0 * SR)
    if i >= N:
        return
    sig = sig[: N - i]
    l, r = np.sqrt(0.5 * (1 - pan)), np.sqrt(0.5 * (1 + pan))
    L[i:i + len(sig)] += sig * gain * l
    R[i:i + len(sig)] += sig * gain * r


def band(sig, lo, hi):
    f = np.fft.rfft(sig)
    fr = np.fft.rfftfreq(len(sig), 1 / SR)
    m = np.clip((fr - lo * .7) / (lo * .3 + 1e-9), 0, 1) * np.clip((hi * 1.3 - fr) / (hi * .3 + 1e-9), 0, 1)
    return np.fft.irfft(f * m, len(sig))


def env(n, a, d):
    t = np.arange(n) / SR
    return np.minimum(t / max(a, 1e-4), 1) * np.exp(-np.maximum(t - a, 0) / d)


def norm(x):
    return x / (np.max(np.abs(x)) + 1e-9)

# ---------------- score: soft pad following the scenes ----------------
def note(f):
    return 440 * 2 ** ((f - 69) / 12)

# (start, end, midi notes)
CHORDS = [(0, 4, [45, 52, 57, 60]), (4, 9.5, [41, 48, 53, 57]), (9.5, 15, [43, 50, 55, 59]),
          (15, 20.5, [45, 52, 57, 60]), (20.5, 26, [41, 48, 53, 57]), (26, 31, [38, 45, 50, 53]),
          (31, 36, [40, 47, 52, 55]), (36, 41.5, [41, 48, 53, 57]), (41.5, 47, [48, 55, 60, 64, 67])]
tt = np.arange(N) / SR
pad = np.zeros(N)
for s, e, notes in CHORDS:
    a, b = int(max(0, s - .6) * SR), int(min(DUR, e + .6) * SR)
    t = tt[a:b]
    fade = np.clip((t - (s - .6)) / 1.2, 0, 1) * np.clip(((e + .6) - t) / 1.2, 0, 1)
    sig = np.zeros(b - a)
    for k, m in enumerate(notes):
        f = note(m)
        for det in (-.12, .12):
            sig += np.sin(2 * np.pi * f * (1 + det / 100) * t + k) * (0.5 if k else 0.8)
        sig += 0.18 * np.sin(2 * np.pi * 2 * f * t + k * 2)
    sig *= (0.75 + 0.25 * np.sin(2 * np.pi * 0.18 * t))
    pad[a:b] += sig * fade
pad = norm(pad)
# score intensity curve: quiet hook, gentle build, lift for the finale, fade out
inten = np.interp(tt, [0, 3.9, 4.2, 30, 36, 41.5, 44, 46.2, 47], [.55, .7, .5, .75, .65, .9, 1.0, .5, 0])
place(pad * inten, 0, .16)
# low heartbeat pulse from scene 2 onward (72 bpm)
beat = np.zeros(N)
kick = np.sin(2 * np.pi * (55 * t_(.35) - 40 * t_(.35) ** 2)) * env(int(.35 * SR), .004, .09)
for bt in np.arange(4.2, 46.0, 60 / 72):
    g = 0.5 if bt < 41.5 else 0.8
    place(kick, bt, .07 * g)
# sub drone under the finale
place(np.sin(2 * np.pi * note(36) * t_(5.5)) * np.clip(t_(5.5) / 1.5, 0, 1) * np.clip((5.5 - t_(5.5)) / 1.2, 0, 1), 41.5, .08)

# ---------------- SFX ----------------
def impact(big=1.0):
    d = 2.6 if big > 1 else 1.8
    t = t_(d)
    f = 70 * np.exp(-t * 3) + 32
    sub = np.sin(2 * np.pi * np.cumsum(f) / SR) * env(len(t), .005, .55 * big)
    hit = band(rng.standard_normal(len(t)), 60, 900) * env(len(t), .002, .06)
    tail = band(rng.standard_normal(len(t)), 200, 3000) * env(len(t), .05, .7) * .08
    return norm(sub * 1.0 + hit * .35 + tail)


def whoosh(d=.7):
    n = int(d * SR)
    x = rng.standard_normal(n)
    out = np.zeros(n)
    seg = 2048
    for i in range(0, n, seg):
        c = i / n
        lo, hi = 300 + 2200 * np.sin(np.pi * c), 900 + 5200 * np.sin(np.pi * c)
        out[i:i + seg] = band(x[i:i + seg], lo, hi)[: len(out[i:i + seg])]
    shape = np.sin(np.pi * np.linspace(0, 1, n)) ** 2
    return norm(out * shape)


def ding(f=1320):
    t = t_(.9)
    return norm((np.sin(2 * np.pi * f * t) + .5 * np.sin(2 * np.pi * f * 1.5 * t)) * env(len(t), .003, .18))


def pop():
    t = t_(.25)
    f = 900 + 700 * np.exp(-t * 30)
    return norm(np.sin(2 * np.pi * np.cumsum(f) / SR) * env(len(t), .002, .05))


def key():
    n = int(.05 * SR)
    return norm(band(rng.standard_normal(n), 1500, 7000) * env(n, .001, .008) + .4 * band(rng.standard_normal(n), 200, 800) * env(n, .001, .012))


def step():
    n = int(.22 * SR)
    t = t_(.22)
    thump = np.sin(2 * np.pi * (90 * t - 60 * t * t)) * env(n, .002, .04)
    scuff = band(rng.standard_normal(n), 300, 2500) * env(n, .004, .03)
    return norm(thump + .5 * scuff)


def buzz():
    t = t_(.75)
    gate = ((t % .25) < .17).astype(float)
    sig = np.sign(np.sin(2 * np.pi * 150 * t)) * .5 + np.sin(2 * np.pi * 150 * t)
    return norm(band(sig * gate, 80, 900)) * .8


def thud():
    t = t_(.3)
    return norm(np.sin(2 * np.pi * (120 * t - 120 * t * t)) * env(len(t), .002, .05) + .3 * band(rng.standard_normal(len(t)), 200, 1500) * env(len(t), .001, .02))


def click():
    n = int(.06 * SR)
    return norm(band(rng.standard_normal(n), 2000, 9000) * env(n, .0005, .006))


def tick():
    n = int(.08 * SR)
    t = t_(.08)
    return norm(np.sin(2 * np.pi * 2400 * t) * env(n, .0005, .008) + .5 * band(rng.standard_normal(n), 3000, 9000) * env(n, .0003, .004))


def low():
    t = t_(2.0)
    return norm(np.sin(2 * np.pi * 49 * t) * env(len(t), .3, .8) + .3 * np.sin(2 * np.pi * 73.4 * t) * env(len(t), .4, .7))


def breath():
    n = int(1.1 * SR)
    sh = np.sin(np.pi * np.linspace(0, 1, n)) ** 1.5
    return norm(band(rng.standard_normal(n), 400, 2500) * sh)


def carpass():
    d = 1.6
    n = int(d * SR)
    t = t_(d)
    f = 70 * (1 + .25 * np.tanh((.8 - t) * 4))
    eng = np.sin(2 * np.pi * np.cumsum(f) / SR) + .5 * np.sin(2 * np.pi * np.cumsum(2 * f) / SR)
    sh = np.exp(-((t - .8) / .35) ** 2)
    return norm((band(eng, 40, 600) + .3 * band(rng.standard_normal(n), 200, 3000)) * sh)


def shutter():
    n = int(.12 * SR)
    a = band(rng.standard_normal(n), 1500, 8000) * env(n, .0005, .01)
    b = np.roll(a, int(.05 * SR)) * .7
    return norm(a + b)


def switch():
    n = int(.15 * SR)
    return norm(band(rng.standard_normal(n), 800, 6000) * env(n, .0005, .01) + np.sin(2 * np.pi * 180 * t_(.15)) * env(n, .001, .03))


def done():
    out = np.zeros(int(1.4 * SR))
    for i, f in enumerate([880, 1108.7, 1318.5]):
        d = ding(f)
        s = int(i * .07 * SR)
        out[s:s + len(d)] += d[: len(out) - s] * (1 - i * .15)
    return norm(out)


def shimmer():
    t = t_(2.5)
    sig = sum(np.sin(2 * np.pi * f * t + i) for i, f in enumerate([1760, 2217, 2637, 3520]))
    return norm(sig * np.sin(np.pi * np.clip(t / 2.5, 0, 1)) ** 2 * (0.6 + .4 * np.sin(2 * np.pi * 6 * t)))


def riser():
    d = 1.1
    t = t_(d)
    sw = band(rng.standard_normal(len(t)), 500, 6000) * (t / d) ** 2
    tone = np.sin(2 * np.pi * np.cumsum(200 + 600 * (t / d) ** 2) / SR) * (t / d) ** 2 * .4
    return norm(sw + tone)


def crowd():
    d = 4.2
    n = int(d * SR)
    x = band(rng.standard_normal(n), 250, 1800)
    am = 0.7 + .3 * np.sin(2 * np.pi * 3.1 * t_(d)) * np.sin(2 * np.pi * .7 * t_(d))
    fade = np.clip(t_(d) / .3, 0, 1) * np.clip((d - t_(d)) / .8, 0, 1)
    return norm(x * am * fade)


def swell():
    d = 2.5
    t = t_(d)
    return norm(band(rng.standard_normal(len(t)), 100, 1200) * np.sin(np.pi * t / d) ** 2)


def glitch():
    n = int(.14 * SR)
    t = t_(.14)
    sq = np.sign(np.sin(2 * np.pi * 620 * t)) * ((t * 60) % 1 < .5)
    return norm(band(rng.standard_normal(n), 1500, 9000) * .6 * env(n, .001, .03) + sq * env(n, .001, .05) * .5)


GEN = {'glitch': glitch, 'impact': lambda: impact(1), 'final': lambda: impact(1.6), 'whoosh': whoosh, 'ding': ding, 'pop': pop, 'key': key,
       'step': step, 'buzz': buzz, 'thud': thud, 'click': click, 'tick': tick, 'low': low, 'breath': breath, 'carpass': carpass,
       'shutter': shutter, 'switch': switch, 'done': done, 'shimmer': shimmer, 'riser': riser, 'crowd': crowd, 'swell': swell}
LEVEL = {'glitch': .09, 'impact': .55, 'final': .7, 'whoosh': .22, 'ding': .16, 'pop': .12, 'key': .07, 'step': .16, 'buzz': .2, 'thud': .25,
         'click': .12, 'tick': .08, 'low': .28, 'breath': .06, 'carpass': .25, 'shutter': .12, 'switch': .15, 'done': .18,
         'shimmer': .05, 'riser': .16, 'crowd': .07, 'swell': .1}
cache = {}
events = json.load(open(sys.argv[1]))
for i, ev in enumerate(events):
    ty = ev['type']
    if ty in ('key', 'step', 'pop'):
        sig = GEN[ty]()  # fresh noise each time so repeats don't sound identical
    else:
        sig = cache.setdefault(ty, GEN[ty]())
    pan = {'key': .25, 'pop': -.3 + .6 * ((i * 7) % 10) / 10, 'carpass': 0}.get(ty, 0)
    place(sig, ev['t'], LEVEL[ty] * ev['g'] * (0.85 + .3 * rng.random() if ty in ('key', 'step') else 1), pan)

# final fade + soft limiter
fade = np.clip((DUR - tt) / 0.9, 0, 1)
out = np.stack([L, R], 1) * fade[:, None]
out = np.tanh(out * 1.4) / np.tanh(1.4)
out *= 0.89 / (np.max(np.abs(out)) + 1e-9)
pcm = (out * 32767).astype('<i2')
with wave.open(sys.argv[2], 'wb') as w:
    w.setnchannels(2); w.setsampwidth(2); w.setframerate(SR); w.writeframes(pcm.tobytes())
print('wrote', sys.argv[2], len(events), 'events')
