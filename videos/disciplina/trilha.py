"""Trilha + efeitos do curta DISCIPLINA (48 kHz mono) -> build/trilha.wav.

Arco musical: alegre com a Motivação -> chuva e silêncio na porta -> pulso
constante nos treinos -> tensão na prova -> explosão na chegada.
Passos sincronizados com a passada do Joseph (mesmas tabelas da cena.html).
"""
import json
import re
import wave
from pathlib import Path

import numpy as np

HERE = Path(__file__).parent
SR = 48000
DUR = json.load(open(HERE / "timeline.json"))["duration"]
N = int(SR * DUR)
out = np.zeros(N)
rng = np.random.default_rng(11)


def sm(k):
    k = np.clip(k, 0, 1)
    return k * k * (3 - 2 * k)


def kf(t, pts):
    t = np.asarray(t, dtype=float)
    ts = np.array([p[0] for p in pts]); vs = np.array([p[1] for p in pts])
    i = np.clip(np.searchsorted(ts, t), 1, len(ts) - 1)
    t0, t1, v0, v1 = ts[i - 1], ts[i], vs[i - 1], vs[i]
    return np.where(t <= ts[0], vs[0], np.where(t >= ts[-1], vs[-1], v0 + (v1 - v0) * sm((t - t0) / np.maximum(t1 - t0, 1e-9))))


def table(name):
    """Read a keyframe table (e.g. SPEED) straight from cena.html."""
    src = (HERE / "cena.html").read_text()
    body = re.search(rf"const {name} = (\[.*?\]);", src, re.S).group(1)
    return json.loads(body)


def lowpass(x, n):
    k = np.ones(n) / n
    return np.convolve(x, k, mode="same")


def put(t0, x, gain=1.0):
    i0 = int(t0 * SR)
    if i0 >= N or i0 < 0:
        return
    x = x[: N - i0]
    out[i0:i0 + len(x)] += x * gain


def env_span(a, b, fi, fo):
    i0, i1 = int(a * SR), min(N, int(b * SR))
    t = np.arange(i0, i1) / SR
    return i0, i1, t, np.clip(np.minimum((t - a) / fi, (b - t) / fo), 0, 1)


def pad(a, b, freqs, gain, fi=1.0, fo=1.0, trem=0.15):
    i0, i1, t, e = env_span(a, b, fi, fo)
    v = sum(np.sin(2 * np.pi * f * (1 + 0.002 * np.sin(t * 0.4 + k)) * t) for k, f in enumerate(freqs)) / len(freqs)
    out[i0:i1] += v * e * ((1 - trem) + trem * np.sin(2 * np.pi * 0.2 * t)) * gain


def tone(freqs, dur, decay):
    t = np.arange(int(SR * dur)) / SR
    return np.exp(-t * decay) * sum(np.sin(2 * np.pi * f * t) for f in freqs) / len(freqs)


def kick(f0=120, f1=46, dur=0.4):
    t = np.arange(int(SR * dur)) / SR
    return np.exp(-t * 9) * np.sin(2 * np.pi * np.cumsum(f0 * np.exp(-t * 18) + f1) / SR)


def noise(dur, smooth=1, decay=None):
    n = int(SR * dur)
    x = rng.uniform(-1, 1, n)
    if smooth > 1:
        x = lowpass(x, smooth) * np.sqrt(smooth)
    if decay:
        x *= np.exp(-np.arange(n) / SR * decay)
    return x


def boom(dur=2.4, f0=75, f1=40, decay=2.2):
    t = np.arange(int(SR * dur)) / SR
    return np.exp(-t * decay) * np.sin(2 * np.pi * np.cumsum(f0 * np.exp(-t * 1.5) + f1) / SR)


def beat(a, b, bpm, gain, fn=kick):
    t = a
    while t < b:
        put(t, fn(), gain)
        t += 60 / bpm


def arp(a, b, chords, bpm, gain, bar=2.0):
    step, t, k = 60 / bpm / 2, a, 0
    while t < b:
        ch = chords[int((t - a) / bar) % len(chords)]
        f = ch[k % len(ch)] * 2
        put(t, tone([f, f * 2.003], 0.5, 8), gain)
        t += step
        k += 1


C = [130.81, 164.81, 196.0]; G = [98.0, 146.83, 196.0]; Am = [110.0, 130.81, 164.81]; F = [87.31, 130.81, 174.61]
Em = [82.41, 123.47, 164.81]; Dm = [73.42, 110.0, 146.83]

# ---------------- music ----------------
# 1. motivation: bright, bouncy
pad(0.3, 14.0, [65.41] + C, 0.10, fi=1.5, fo=0.4)
arp(2.6, 13.9, [C, G, Am, F], 120, 0.06)
beat(2.6, 13.9, 120, 0.25)
# day 7: thinner, no drums
pad(14.2, 17.8, [65.41] + C, 0.07, fi=0.4, fo=0.4)
arp(15.6, 17.8, [C, G], 92, 0.035)
# day 10: rain, minor
pad(18.2, 21.2, [55.0] + Am, 0.08, fi=0.5, fo=0.5)
# door: almost silence, low sad drone
pad(21.4, 29.7, [55.0, 82.41], 0.07, fi=1.0, fo=0.4)
pad(29.8, 31.9, Dm, 0.06, fi=0.3, fo=0.5)
# training montage: steady, minor, building
prog = [Am, F, C, G]
pad(32.0, 52.3, [55.0], 0.08, fi=0.5, fo=0.6)
t0 = 32.0
for i in range(10):
    pad(t0 + i * 2.05, t0 + (i + 1) * 2.05 + 0.2, prog[i % 4], 0.05 + 0.004 * i, fi=0.2, fo=0.3)
beat(32.0, 52.2, 100, 0.22)
arp(43.2, 52.2, prog, 100, 0.04, bar=2.4)
# race: tension then build
pad(52.6, 58.4, [55.0, 58.27], 0.08, fi=0.6, fo=0.2)
beat(52.8, 58.3, 62, 0.35, fn=lambda: kick(90, 40, 0.5))  # heartbeat
pad(58.4, 64.5, [55.0] + Em, 0.09, fi=0.2, fo=0.05)
beat(58.4, 64.4, 140, 0.28)
riser = noise(6.0, smooth=6) * np.linspace(0, 1, int(SR * 6.0)) ** 2
put(58.5, riser, 0.18)
# finish: major explosion
pad(64.5, 72.8, [65.41] + C + [261.63], 0.13, fi=0.05, fo=1.2)
arp(64.6, 72.6, [C, F, G, C], 128, 0.06)
beat(64.6, 72.4, 128, 0.25)
# quote + title
pad(74.0, 83.4, F + [261.63], 0.06, fi=1.0, fo=1.0)
pad(84.0, 90.5, [65.41] + C, 0.08, fi=0.6, fo=1.5)

# ---------------- ambience ----------------
# rain: steady filtered noise following the RAIN table (+ full rain in the door scene)
rain_tab = table("RAIN")
tt = np.arange(N) / SR
rain_amt = np.maximum(kf(tt, rain_tab), ((tt >= 21.3) & (tt < 31.95)).astype(float) * 0.8)
rain_noise = lowpass(rng.uniform(-1, 1, N), 3) * 0.6 + lowpass(rng.uniform(-1, 1, N), 40) * 2.0
out += rain_noise * rain_amt * 0.05
# crowd during the race
crowd_amt = np.clip((tt - 52.6) / 0.6, 0, 1) * np.clip((73.0 - tt) / 0.8, 0, 1)
crowd_amt *= 0.5 + 0.5 * np.clip((tt - 63.5) / 1.0, 0, 1)
crowd = lowpass(rng.uniform(-1, 1, N), 12) * (1 + 0.3 * np.sin(2 * np.pi * 0.7 * tt))
out += crowd * crowd_amt * 0.08

# ---------------- footsteps (same stride as the animation) ----------------
SPEED, GAIT = table("SPEED"), table("GAIT")
dt = 1 / 240
ts = np.arange(0, DUR, dt)
v, g = kf(ts, SPEED), kf(ts, GAIT)
rate = np.where(v > 1, v / 250, np.where(g > 0.05, 1.3, 0))
phase = np.cumsum(rate * 2 * np.pi * dt)
steps = np.where(np.diff(np.floor(phase / np.pi)) > 0)[0]
for i in steps:
    t = ts[i]
    if g[i] < 0.2:
        continue
    wet = kf(t, rain_tab) > 0.4 or 21.3 <= t < 32
    s = noise(0.09, smooth=4 if wet else 10, decay=45) * (1.4 if wet else 1.0)
    put(t, s, 0.10 * min(1, g[i]))

# ---------------- sfx ----------------
up = np.arange(int(SR * 0.25)) / SR
put(2.6, np.exp(-up * 8) * np.sin(2 * np.pi * np.cumsum(300 + 1400 * up / 0.25) / SR), 0.22)   # flame pop
put(2.65, tone([1567.98, 2093.0, 2637.0], 0.8, 4), 0.08)                                        # sparkle
for k in range(4):
    put(4.6 + k * 0.45, tone([1318.5, 1975.5], 0.25, 14), 0.05)                                  # cheering chirps
put(15.6, noise(1.2, smooth=20) * np.sin(np.linspace(0, np.pi, int(SR * 1.2))), 0.15)           # late arrival whoosh
crackle = noise(1.8, smooth=2) * (rng.random(int(SR * 1.8)) > 0.985)
put(18.4, crackle, 0.6)                                                                          # sputtering in the rain
put(23.0, noise(1.4, smooth=30) * np.sin(np.linspace(0, np.pi, int(SR * 1.4))), 0.10)           # smoke wisp
put(29.9, noise(0.5, smooth=8, decay=6), 0.10)                                                   # hood up (fabric)
put(31.0, boom(2.0, 70, 38, 2.6), 0.4)                                                           # steps out
put(64.5, noise(0.25, smooth=2, decay=20), 0.35)                                                 # tape snap
put(64.5, boom(2.5, 85, 42, 2.0), 0.6)
put(64.55, noise(2.0, smooth=1, decay=2.5), 0.10)                                                # cymbal wash
put(68.6, np.exp(-up * 8) * np.sin(2 * np.pi * np.cumsum(300 + 1400 * up / 0.25) / SR), 0.25)  # flame pops back
horn_t = np.arange(int(SR * 0.7)) / SR
horn = np.sign(np.sin(2 * np.pi * np.cumsum(420 + 200 * horn_t / 0.7) / SR)) * np.exp(-horn_t * 3) * 0.5
put(68.75, lowpass(horn, 6), 0.18)                                                               # party horn
for k in range(6):
    put(68.8 + k * 0.12, tone([2093.0, 2637.0], 0.4, 10), 0.05)
put(84.2, boom(), 0.5)

# ---------------- write ----------------
peak = np.max(np.abs(out)) or 1.0
pcm = (np.clip(out * (0.7 / peak), -1, 1) * 32767).astype("<i2")
dst = HERE / "build" / "trilha.wav"
dst.parent.mkdir(exist_ok=True)
with wave.open(str(dst), "wb") as w:
    w.setnchannels(1); w.setsampwidth(2); w.setframerate(SR)
    w.writeframes(pcm.tobytes())
print("ok", dst, "steps:", len(steps))
