"""Trilha + efeitos do curta PROCRASTINAÇÃO (48 kHz mono) -> build/trilha.wav.

Arco: leve e engraçada (segunda) -> pesada a cada tarefa jogada na mochila ->
neutra (o ciclo) -> tensão (quinta à noite) -> animada (as 4 técnicas) -> leve.
"""
import json
import wave
from pathlib import Path

import numpy as np

HERE = Path(__file__).parent
SR = 48000
DUR = json.load(open(HERE / "timeline.json"))["duration"]
N = int(SR * DUR)
out = np.zeros(N)
rng = np.random.default_rng(21)


def lowpass(x, n):
    return np.convolve(x, np.ones(n) / n, mode="same")


def put(t0, x, gain=1.0):
    i0 = int(t0 * SR)
    if 0 <= i0 < N:
        x = x[: N - i0]
        out[i0:i0 + len(x)] += x * gain


def pad(a, b, freqs, gain, fi=1.0, fo=1.0, trem=0.15, bright=0.0):
    i0, i1 = int(a * SR), min(N, int(b * SR))
    t = np.arange(i0, i1) / SR
    e = np.clip(np.minimum((t - a) / fi, (b - t) / fo), 0, 1)
    v = np.zeros_like(t)
    for k, f in enumerate(freqs):
        ph = 2 * np.pi * f * (1 + 0.002 * np.sin(t * 0.4 + k)) * t
        v += np.sin(ph) + bright * 0.3 * np.sin(2 * ph) + bright * 0.12 * np.sin(3 * ph)
    v /= len(freqs)
    out[i0:i1] += v * e * ((1 - trem) + trem * np.sin(2 * np.pi * 0.2 * t)) * gain


def tone(freqs, dur, decay):
    t = np.arange(int(SR * dur)) / SR
    return np.exp(-t * decay) * sum(np.sin(2 * np.pi * f * t) for f in freqs) / len(freqs)


def pluck(f, dur=0.7, decay=6):
    t = np.arange(int(SR * dur)) / SR
    return np.exp(-t * decay) * (np.sin(2 * np.pi * f * t) + 0.35 * np.sin(4 * np.pi * f * t) + 0.12 * np.sin(6 * np.pi * f * t)) / 1.5


def kick(f0=120, f1=46, dur=0.4):
    t = np.arange(int(SR * dur)) / SR
    return np.exp(-t * 9) * np.sin(2 * np.pi * np.cumsum(f0 * np.exp(-t * 18) + f1) / SR)


def hat():
    return lowpass(rng.uniform(-1, 1, int(SR * 0.05)), 1) * np.exp(-np.arange(int(SR * 0.05)) / SR * 90)


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


def sweep(dur, f0, f1, gain_shape="sin"):
    t = np.arange(int(SR * dur)) / SR
    f = f0 + (f1 - f0) * t / dur
    e = np.sin(np.pi * t / dur)
    return np.sin(2 * np.pi * np.cumsum(f) / SR) * e


def beat(a, b, bpm, gain, fn=kick):
    t = a
    while t < b:
        put(t, fn(), gain)
        t += 60 / bpm


def arp(a, b, chords, bpm, gain, bar=2.0, decay=6):
    step, t, k = 60 / bpm / 2, a, 0
    while t < b:
        ch = chords[int((t - a) / bar) % len(chords)]
        put(t, pluck(ch[k % len(ch)] * 2, decay=decay), gain)
        t += step
        k += 1



Am = [110.0, 130.81, 164.81]; F = [87.31, 130.81, 174.61]; C = [130.81, 164.81, 196.0]; G = [98.0, 146.83, 196.0]
Dm = [73.42, 110.0, 146.83]; E7 = [82.41, 103.83, 146.83]; Cmaj7 = [130.81, 164.81, 196.0, 246.94]; Fmaj7 = [87.31, 130.81, 174.61, 220.0]
BOXES = [("PROJETO", 28.6, 137.8), ("ACADEMIA", 38.6, 160.2), ("DENTISTA", 41.4, 123.6), ("E-MAILS", 42.6, 122.0), ("ESTUDO", 43.8, 150.4), ("RELATÓRIO", 89.2, 162.4)]


def bassoon(f, dur):
    t = np.arange(int(SR * dur)) / SR
    e = np.minimum(1, t / 0.03) * np.exp(-t * 3)
    return e * (np.sin(2 * np.pi * f * t) + 0.5 * np.sin(4 * np.pi * f * t) + 0.25 * np.sin(6 * np.pi * f * t)) / 1.75


def whoosh(dur=0.5):
    n = int(SR * dur)
    return noise(dur, smooth=10) * np.sin(np.linspace(0, np.pi, n)) ** 2


def thud(g=1.0):
    t = np.arange(int(SR * 0.35)) / SR
    return (np.exp(-t * 18) * np.sin(2 * np.pi * (90 * np.exp(-t * 6) + 45) * t) + noise(0.35, smooth=20, decay=25) * 0.6) * g


# ======== segunda: leve e engraçada ========
melody = [(0, 261.63), (0.5, 329.63), (1.0, 392.0), (1.5, 329.63), (2.0, 293.66), (2.5, 349.23), (3.0, 440.0), (3.5, 349.23)]
def quirky(a, b, rate=1.0, gain=0.06, low=False):
    t = a
    while t < b:
        for dt, f in melody:
            tt = t + dt / rate
            if tt < b:
                put(tt, pluck(f / (2 if low else 1), 0.4, 9), gain)
        put(t, bassoon(65.41 if not low else 55.0, 0.5), gain * 1.4)
        put(t + 2.0 / rate, bassoon(73.42 if not low else 49.0, 0.5), gain * 1.4)
        t += 4.0 / rate
quirky(1.0, 13.2, 1.0, 0.05)
put(11.6, noise(1.2, smooth=40) * np.linspace(1, 0, int(SR * 1.2)), 0.10)        # door creak-ish
put(15.4, tone([523.25, 659.25, 783.99, 1046.5], 2.0, 1.5), 0.10)               # "perfect" fanfare
put(15.4, noise(1.0, smooth=1, decay=4), 0.03)
for a in [19.4, 20.9, 22.4]:
    put(a, tone([1046.5, 1318.5], 0.3, 12), 0.08)
quirky(16.4, 35.8, 1.0, 0.05)
put(31.6, tone([783.99, 987.77, 1174.66], 1.4, 2), 0.08)                        # relief chime
# ======== terça/quarta: mais pesado ========
quirky(36.4, 51.2, 0.85, 0.05, low=True)
pad(44.0, 51.2, [55.0, 58.27], 0.05, fi=1.0, fo=0.4)
for lab, tt, done in BOXES:
    put(tt, whoosh(0.5), 0.12)
    put(tt + 0.6, thud(), 0.25)
    put(tt + 0.7, bassoon(49.0, 0.6), 0.10)                                   # groan
# ======== o ciclo (educativo) ========
pad(51.6, 87.0, [65.41, 98.0, 130.81], 0.06, fi=1.0, fo=0.6, trem=0.2)
beat(59.2, 80.0, 72, 0.12, fn=lambda: kick(90, 44, 0.4))
put(55.8, noise(0.3, smooth=3, decay=12), 0.2)                                  # strike-through
for a in [59.4, 60.8, 65.0, 70.0, 72.3]:
    put(a, tone([880.0, 1318.5], 0.4, 10), 0.08)
put(76.8, boom(1.6, 70, 40, 3.0), 0.35)                                         # task gets heavier
put(82.6, sweep(1.0, 600, 200), 0.06)                                           # the stranger
quirky(87.6, 91.2, 0.85, 0.04, low=True)
# ======== quinta à noite ========
pad(91.6, 112.0, [55.0, 58.27, 82.41], 0.07, fi=1.0, fo=0.8, trem=0.3)
t = 92.8
while t < 97.2:
    put(t, thud(0.6), 0.18)                                                    # heavy steps
    t += 0.55
put(FALL := 98.6, thud(), 0.6)
put(98.9, boom(2.2, 80, 40, 2.0), 0.6)
for k in range(6):
    put(99.0 + k * 0.09 + rng.uniform(0, 0.05), thud(0.5), 0.2)                # boxes clatter
for k, f in enumerate([220.0, 207.65, 196.0, 174.61]):
    put(105.6 + k * 0.9, pluck(f, 1.6, 2.5), 0.08)                              # sad notes
put(107.0, whoosh(0.4), 0.10)                                                   # tag flip
put(107.5, tone([392.0, 466.16], 1.2, 2), 0.07)
# ======== a virada: as 4 técnicas ========
pad(112.0, 158.6, [65.41, 98.0, 130.81], 0.05, fi=0.4, fo=0.4)
beat(114.4, 158.4, 96, 0.18)
t = 114.4
while t < 158.4:
    put(t + 60 / 96 / 2, hat(), 0.05)
    t += 60 / 96
arp(127.4, 158.4, [C, G, Am, F], 96, 0.035, bar=2.5, decay=6)
for a in [114.4, 127.4, 141.6, 151.8]:
    put(a, boom(1.2, 90, 50, 4.0), 0.3)
    put(a, tone([523.25, 783.99], 0.6, 6), 0.08)
for lab, tt, done in BOXES:
    put(done, tone([1567.98, 2093.0], 0.3, 12), 0.10)                           # task done
for c in [135.0, 136.4, 137.8]:
    put(c, tone([1318.5, 1760.0], 0.25, 14), 0.08)
for k in range(12):
    put(114.8 + k * 0.5, tone([2400], 0.04, 120), 0.06)                         # stopwatch
for k in range(14):
    put(142.0 + k * 0.5, tone([1900], 0.04, 120), 0.05)                         # 5-min timer
for k in range(2):
    put(123.0 + k * 0.5, tone([440, 480], 0.3, 4), 0.04)                        # ring
put(156.4, whoosh(0.7), 0.12)                                                   # phone leaves
click = tone([3200, 4100], 0.03, 160)
for a, b in [(0.4, 6.0), (112.0, 158.6), (158.6, 168.4)]:
    t = a
    while t < b:
        if not (123.0 <= t < 124.2):
            put(t, click, 0.03 * rng.uniform(0.6, 1.0))
        t += rng.uniform(0.07, 0.2)
# ======== sexta: leve ========
pad(158.8, 182.8, [65.41] + Cmaj7, 0.08, fi=0.8, fo=1.2, bright=0.3)
arp(158.8, 182.4, [Cmaj7, G, Am, Fmaj7], 112, 0.045, bar=2.2, decay=5)
beat(160.0, 182.0, 112, 0.18)
put(169.6, thud(), 0.5)                                                         # stamp
put(176.0, boom(0.8, 140, 60, 6.0), 0.4)                                        # fist bump
put(176.0, tone([1046.5, 1318.5, 1567.98], 1.0, 3), 0.10)
put(177.6, sweep(2.0, 400, 1600), 0.05)                                         # merge shimmer
put(178.0, tone([523.25, 659.25, 783.99, 1046.5], 3.0, 1.0), 0.08)
# ======== recap ========
prog = [Cmaj7, G, Am, Fmaj7]
for i in range(8):
    a = 183.4 + i * 3.9
    pad(a, a + 4.1, [prog[i % 4][0] / 2] + prog[i % 4], 0.07, fi=0.3, fo=0.3, bright=0.3)
arp(185.0, 214.0, prog, 100, 0.035, bar=3.9, decay=5)
beat(185.0, 214.0, 100, 0.13)
for c in [190.0, 194.6, 199.2, 203.8]:
    put(c, tone([783.99, 1046.5, 1318.5], 0.9, 4), 0.10)
# ======== final ========
pad(215.0, 234.6, [87.31, 130.81, 174.61, 220.0], 0.05, fi=1.0, fo=0.8)
for k, f in enumerate([261.63, 329.63, 392.0, 329.63, 293.66, 349.23, 440.0, 349.23]):
    put(216.0 + k * 2.2, pluck(f, 1.4, 3), 0.05)
put(232.0, boom(1.6, 90, 45, 3.0), 0.4)
put(235.4, boom(), 0.5)
pad(235.4, 244.0, [65.41] + C, 0.07, fi=0.4, fo=1.4)

peak = np.max(np.abs(out)) or 1.0
pcm = (np.clip(out * (0.7 / peak), -1, 1) * 32767).astype("<i2")
dst = HERE / "build" / "trilha.wav"
dst.parent.mkdir(exist_ok=True)
with wave.open(str(dst), "wb") as w:
    w.setnchannels(1); w.setsampwidth(2); w.setframerate(SR)
    w.writeframes(pcm.tobytes())
print("ok", dst)
