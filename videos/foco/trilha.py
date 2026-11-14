"""Trilha + efeitos do curta FOCO (48 kHz mono) -> build/trilha.wav.

Tudo sintetizado: pads por ato, progressão com pulso na fase de rotina, tensão na
última luta, acorde maior na conquista, e efeitos (ding, vibração, swipes,
tic-tac, gaveta, batida, carimbo, digitação, impactos).
"""
from pathlib import Path

import numpy as np

SR = 48000
DUR = 127.0
N = int(SR * DUR)
out = np.zeros(N)
rng = np.random.default_rng(7)


def span(a, b):
    i0, i1 = max(0, int(a * SR)), min(N, int(b * SR))
    return i0, i1, np.arange(i0, i1) / SR


def envelope(t, a, b, fi, fo):
    return np.clip(np.minimum((t - a) / fi, (b - t) / fo), 0, 1)


def pad(a, b, freqs, gain, fi=1.5, fo=1.5, trem=0.0, trem_hz=0.14, saw=False):
    i0, i1, t = span(a, b)
    v = np.zeros_like(t)
    for k, f in enumerate(freqs):
        ph = 2 * np.pi * f * (1 + 0.002 * np.sin(t * 0.3 + k)) * t
        if saw:  # soft "string": a few harmonics
            v += sum(np.sin(ph * h) / h for h in range(1, 6)) / len(freqs)
        else:
            v += np.sin(ph) / len(freqs) * (1.0 if k == 0 else 0.8)
    breathe = (1 - trem) + trem * np.sin(2 * np.pi * trem_hz * t)
    out[i0:i1] += v * envelope(t, a, b, fi, fo) * breathe * gain


def put(t0, x, gain=1.0):
    i0 = int(t0 * SR)
    if i0 >= N:
        return
    x = x[: N - i0]
    out[i0:i0 + len(x)] += x * gain


def tone(freqs, dur, decay):
    t = np.arange(int(SR * dur)) / SR
    return np.exp(-t * decay) * sum(np.sin(2 * np.pi * f * t) for f in freqs) / len(freqs)


def noise_burst(dur, lp=0.12, shape="sin"):
    n = int(SR * dur)
    x = rng.uniform(-1, 1, n)
    y = np.zeros(n)
    acc = 0.0
    for i in range(n):  # one-pole lowpass
        acc += lp * (x[i] - acc)
        y[i] = acc
    e = np.sin(np.pi * np.arange(n) / n) ** 2 if shape == "sin" else np.exp(-np.arange(n) / SR * 30)
    return (x - y) * e if lp < 0.5 else y * e


def boom(dur=2.5, f0=70, f1=38, decay=2.2):
    t = np.arange(int(SR * dur)) / SR
    f = f0 * np.exp(-t * 1.5) + f1
    return np.exp(-t * decay) * np.sin(2 * np.pi * np.cumsum(f) / SR)


def thud():
    t = np.arange(int(SR * 0.35)) / SR
    body = np.exp(-t * 18) * np.sin(2 * np.pi * (90 * np.exp(-t * 6) + 45) * t)
    return body + noise_burst(0.35, lp=0.05, shape="exp") * 1.5


def kick():
    t = np.arange(int(SR * 0.4)) / SR
    return np.exp(-t * 9) * np.sin(2 * np.pi * np.cumsum(120 * np.exp(-t * 18) + 48) / SR)


def vibration(dur, f=150):
    t = np.arange(int(SR * dur)) / SR
    gate = ((t % 0.3) < 0.22).astype(float)
    return gate * np.sin(2 * np.pi * f * t) * (0.6 + 0.4 * np.sin(2 * np.pi * 31 * t))


# ======================= music =======================
Am = [110.0, 130.81, 164.81]
F = [87.31, 130.81, 174.61]
C = [130.81, 164.81, 196.0]
G = [98.0, 146.83, 196.0]
pad(0.0, 23.9, [55.0] + Am, 0.12, fi=2.5, trem=0.25)
pad(24.0, 31.2, [55.0] + Am, 0.12, fi=0.4, fo=0.6, trem=0.35, trem_hz=0.8)
pad(31.5, 40.9, [55.0, 58.27, 110.0], 0.10, fi=1.0, trem=0.2)
pad(41.0, 52.6, [41.2, 61.7], 0.08, fi=1.0, trem=0.15)
pad(52.7, 63.3, [73.42, 110.0, 174.61], 0.09, fi=1.5, trem=0.2)
# rotina: progression Am F C G, building
prog = [Am, F, C, G]
t0, step = 63.4, 2.6
i = 0
while t0 < 84.0:
    g = 0.08 + 0.06 * min(1, (t0 - 63.4) / 20)
    pad(t0, min(t0 + step + 0.3, 84.2), [c / 2 for c in prog[i % 4][:1]] + prog[i % 4], g, fi=0.3, fo=0.4)
    t0 += step
    i += 1
# tension on the last night
pad(84.5, 95.75, [220.0, 233.08], 0.05, fi=4.0, fo=0.05, trem=0.5, trem_hz=6.0, saw=True)
pad(84.5, 95.75, [55.0, 82.41], 0.10, fi=2.0, fo=0.05)
pad(96.8, 99.9, Am, 0.06, fi=0.8, fo=1.0)
# conquest: major
pad(100.0, 111.3, [65.41] + C + [261.63], 0.12, fi=1.2, fo=1.5, trem=0.15)
pad(111.3, 119.8, F, 0.07, fi=1.0, fo=1.2)
pad(120.0, 127.0, [65.41] + C, 0.08, fi=0.8, fo=1.5)

# plucked arpeggio for rotina montage and conquest
def arpeggio(a, b, chords, bpm, gain):
    beat = 60 / bpm / 2
    t, k = a, 0
    while t < b:
        ch = chords[int((t - a) / 2.6) % len(chords)]
        f = ch[k % len(ch)] * 2
        put(t, tone([f, f * 2.01], 0.6, 7), gain)
        t += beat
        k += 1


arpeggio(73.4, 84.0, prog, 100, 0.05)
arpeggio(100.2, 111.0, [C + [261.63]], 90, 0.05)

# pulse (kicks) building through rotina, heartbeat on DIA 1
for k in range(4):
    put(59.6 + k * 0.95, kick(), 0.35)
    put(59.6 + k * 0.95 + 0.25, kick(), 0.2)
t = 73.4
while t < 84.0:
    put(t, kick(), 0.25)
    t += 60 / 100

# ======================= sfx =======================
put(7.6, vibration(0.65), 0.18)
put(7.62, tone([1318.5, 1975.5], 0.9, 6), 0.22)
put(10.75, tone([1318.5, 1975.5], 0.9, 6), 0.14)
sw = noise_burst(0.18)
for a, b, gap, g in [(12.9, 17.0, 0.28, 0.10), (24.0, 33.0, 0.45, 0.06)]:
    t = a
    while t < b:
        put(t, sw, g)
        t += gap
# accelerating clock ticks
def ticks(a, b, g):
    t, k = a, 0
    while t < b:
        prog_ = (t - a) / (b - a)
        put(t, tone([2400 if k % 2 == 0 else 1900], 0.05, 120), g * (1 - 0.5 * prog_))
        t += max(0.045, 0.5 * (1 - prog_) ** 2)
        k += 1


ticks(15.0, 19.0, 0.16)
ticks(73.4, 84.0, 0.06)
# battery dies
tt = np.arange(int(SR * 0.6)) / SR
put(33.6, np.exp(-tt * 5) * np.sin(2 * np.pi * np.cumsum(880 * np.exp(-tt * 4) + 120) / SR), 0.12)
# email chime + message lands
put(44.0, tone([987.8, 1318.5], 0.8, 5), 0.12)
put(44.25, tone([1318.5, 1760.0], 0.8, 5), 0.10)
put(46.4, boom(), 0.45)
# drawer: open, phone in, close
put(56.4, noise_burst(0.4, lp=0.03), 0.6)
put(57.9, thud(), 0.25)
put(58.45, thud(), 0.55)
put(59.6, boom(2.0, 80, 40, 2.5), 0.5)
# drawer buzzing (muffled)
for b in [64.0, 64.8, 65.6, 66.4, 68.0]:
    put(b, vibration(0.38, 120), 0.14)
# pages rustle during montage
t = 74.0
while t < 83.5:
    put(t, noise_burst(0.25, lp=0.6), 0.05)
    t += 1.3
# check marks
for c in [76.0, 79.0, 82.0]:
    put(c, tone([1567.98, 2093.0], 0.3, 12), 0.08)
# drawer opens by itself + humming phone, slam
put(90.2, noise_burst(0.7, lp=0.02), 0.5)
put(90.9, vibration(4.5, 110), 0.10)
put(95.75, thud(), 0.9)
put(95.75, boom(1.8, 90, 45, 3.0), 0.5)
# stamp
put(102.0, thud(), 0.6)
put(120.2, boom(), 0.5)
# typing clicks
click = tone([3200, 4100], 0.03, 160)
for a, b in [(0.3, 8.5), (41.0, 43.9), (63.4, 84.0), (84.5, 89.8)]:
    t = a
    while t < b:
        put(t, click, 0.035 * rng.uniform(0.6, 1.0))
        t += rng.uniform(0.07, 0.2) + (0.4 if rng.random() < 0.08 else 0)

# ======================= write =======================
peak = np.max(np.abs(out)) or 1.0
pcm = (np.clip(out * (0.7 / peak), -1, 1) * 32767).astype("<i2")
dst = Path(__file__).parent / "build" / "trilha.wav"
dst.parent.mkdir(exist_ok=True)
import wave
with wave.open(str(dst), "wb") as w:
    w.setnchannels(1)
    w.setsampwidth(2)
    w.setframerate(SR)
    w.writeframes(pcm.tobytes())
print("ok", dst)
