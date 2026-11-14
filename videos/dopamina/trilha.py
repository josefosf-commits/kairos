"""Trilha + efeitos do curta DOPAMINA (48 kHz mono) -> build/trilha.wav.

Arco: loop hipnótico (o ciclo) -> frio e vazio (mundo cinza) -> dissonância
(abstinência) -> a música vai se abrindo conforme as cores voltam -> calma.
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
Em = [82.41, 123.47, 164.81]; Dm = [73.42, 110.0, 146.83]; Cmaj7 = [130.81, 164.81, 196.0, 246.94]; Fmaj7 = [87.31, 130.81, 174.61, 220.0]

# ================= A: o ciclo (0–32) =================
pad(0.0, 32.0, [55.0, 82.41], 0.08, fi=2.5, fo=0.6)
arp(7.0, 31.8, [Am, Am, F, Em], 112, 0.045, bar=2.14, decay=9)          # hypnotic loop
# pings on every dopamine event (same times as the HUD)
for e, a in [(3.0, 0.5), (7.4, 1.0), (8.6, 0.9), (9.8, 1.1), (12.2, 0.9), (13.1, 1.0), (14.0, 0.8), (15.0, 1.1),
             (27.6, 0.9), (28.3, 0.9), (29.0, 1.0), (29.7, 0.9), (30.4, 1.0), (33.4, 1.0), (34.4, 1.1), (35.4, 1.2),
             (36.8, 1.3), (37.8, 1.45), (38.8, 1.6), (39.8, 1.75), (40.8, 1.9)]:
    put(e, tone([1318.5, 1975.5], 0.5, 9), 0.08 * min(a, 1.4))
# vibration on the nightstand
put(3.0, (((np.arange(int(SR * 0.6)) / SR) % 0.3) < 0.22) * np.sin(2 * np.pi * 150 * np.arange(int(SR * 0.6)) / SR), 0.12)
# explainer cards
put(18.4, noise(0.3, smooth=3, decay=12), 0.25)                 # X slash
put(19.0, sweep(0.6, 300, 1200), 0.12)                          # BUSCA
put(23.3, noise(0.3, smooth=3, decay=12), 0.25)                 # strike
put(24.4, tone([1567.98, 2093.0, 2637.0], 1.2, 3), 0.10)        # quero mais
t = 27.2
while t < 31.6:                                                  # infinite scroll
    put(t, noise(0.12, smooth=8) * np.sin(np.linspace(0, np.pi, int(SR * 0.12))) ** 2, 0.10)
    t += 0.18

# ================= B: o preço (32–84) =================
pad(32.0, 43.0, [55.0] + Am, 0.07, fi=0.4, fo=0.6)
put(43.0, sweep(3.0, 400, 60), 0.12)                            # colour drains
pad(44.0, 84.0, [55.0, 58.27, 82.41], 0.06, fi=1.5, fo=0.5, trem=0.25)
put(49.0, noise(0.25, smooth=4, decay=10), 0.10)                # page
# dinner murmur (friend talking)
i0, i1 = int(53.6 * SR), int(57.6 * SR)
tt = np.arange(i1 - i0) / SR
out[i0:i1] += lowpass(rng.uniform(-1, 1, i1 - i0), 18) * (0.5 + 0.5 * np.abs(np.sin(2 * np.pi * 2.3 * tt))) * 0.10
put(62.0, noise(0.08, smooth=1, decay=60), 0.25)                # camera shutter
put(62.08, noise(0.06, smooth=1, decay=70), 0.18)
for k in range(int((73 - 67) / 0.5)):                           # loud clock in the silence
    put(67.2 + k * 0.5, tone([2400 if k % 2 else 1900], 0.05, 120), 0.10)
t = 67.4
while t < 70.6:                                                  # finger tapping
    put(t, noise(0.04, smooth=6, decay=80), 0.12)
    t += 0.22
t = 73.2
while t < 77.2:                                                  # scrolling at night
    put(t, noise(0.12, smooth=8) * np.sin(np.linspace(0, np.pi, int(SR * 0.12))) ** 2, 0.06)
    t += 0.5

# ================= C: a decisão (84–108) =================
pad(84.0, 92.6, [55.0, 82.41], 0.05)
for k in range(7):
    put(86.2 + k * 0.12, tone([880 + k * 60], 0.15, 20), 0.06)  # bars rising
put(90.0, sweep(1.2, 200, 900), 0.10)
put(91.0, boom(1.8, 80, 42, 2.8), 0.4)
pad(92.6, 108.4, [65.41, 98.0, 130.81], 0.07, fi=1.0, fo=0.6)    # resolve
beat(93.4, 108.0, 76, 0.18, fn=lambda: kick(100, 44, 0.4))
put(95.4, boom(), 0.45)
for c in [98.7, 100.5, 102.3, 105.7]:
    put(c - 0.6, noise(0.5, smooth=3) * 0.4, 0.06)              # pen scratch
    put(c, tone([1567.98, 2093.0], 0.3, 12), 0.08)

# ================= D: abstinência (108–131.4) =================
pad(108.6, 125.4, [55.0, 58.27, 116.54], 0.07, fi=0.8, fo=0.8, trem=0.35)
for k in range(int((131 - 108.8) / 0.6)):
    put(108.8 + k * 0.6, tone([2400 if k % 2 else 1900], 0.05, 120), 0.07)
put(113.2, (((np.arange(int(SR * 0.9)) / SR) % 0.3) < 0.22) * np.sin(2 * np.pi * 140 * np.arange(int(SR * 0.9)) / SR), 0.10)  # phantom buzz
put(114.0, noise(0.12, smooth=5, decay=30), 0.25)              # pocket slap
put(115.2, tone([330, 311], 0.8, 3), 0.06)                       # "empty"
t = 117.8
while t < 121.6:                                                 # pacing steps
    put(t, noise(0.09, smooth=10, decay=45), 0.10)
    t += 0.385
t = 121.9
while t < 125.2:                                                 # restless tapping
    put(t, noise(0.04, smooth=6, decay=80), 0.10)
    t += 0.2
put(125.4, sweep(5.6, 180, 420), 0.07)                          # recalibrating
for k in range(10):
    put(125.6 + k * 0.55, tone([660 + k * 40], 0.12, 25), 0.04)

# ================= E: as cores voltam (131.4–174.4) =================
for k, f in enumerate([261.63, 329.63, 392.0, 329.63, 261.63, 392.0, 440.0, 392.0]):
    put(131.6 + k * 0.45, pluck(f, 1.0, 4), 0.07)                # first gentle notes
pad(135.2, 145.2, Cmaj7, 0.07, fi=1.0, fo=0.4, bright=0.3)
for k in range(6):                                                # birds
    tb = 137.5 + k * 0.45 + rng.uniform(0, 0.2)
    put(tb, sweep(0.12, 2600, 3600) * 0.8, 0.05)
for f_ in [141.6, 142.8, 143.9]:
    put(f_, noise(0.3, smooth=4, decay=9), 0.10)                # page flips
put(142.0, tone([1567.98, 2093.0], 0.3, 12), 0.06)
# run: energy
pad(145.2, 151.2, [65.41] + C, 0.09, fi=0.2, fo=0.4, bright=0.4)
arp(145.2, 151.0, [C, G, Am, F], 126, 0.05, bar=1.5)
beat(145.2, 151.0, 126, 0.25)
t = 145.2
while t < 151.0:
    put(t + 0.24, hat(), 0.08)
    t += 60 / 126
t = 145.3
while t < 151.0:                                                 # running steps
    put(t, noise(0.08, smooth=10, decay=45), 0.08)
    t += 1 / 6.08
# dinner, warm
pad(151.2, 157.4, Fmaj7, 0.08, fi=0.4, fo=0.4, bright=0.3)
arp(151.4, 157.2, [Fmaj7, Cmaj7], 96, 0.04, bar=3.0, decay=4)
# the sunset bloom
pad(157.4, 165.0, [65.41] + Cmaj7 + [329.63], 0.13, fi=0.8, fo=1.2, bright=0.5)
put(158.2, sweep(1.6, 200, 800), 0.08)
put(158.4, tone([523.25, 659.25, 783.99, 987.77], 3.0, 1.2), 0.10)
# small joys
pad(164.6, 174.4, Cmaj7, 0.07, fi=0.6, fo=0.6, bright=0.2)
for e in [165.6, 167.0, 168.6, 170.2, 171.8]:
    put(e, tone([1046.5, 1318.5], 0.6, 6), 0.06)

# ================= F: equilíbrio (174.4–192.4) =================
pad(174.4, 192.4, Fmaj7 + [261.63], 0.07, fi=0.6, fo=1.0, bright=0.2)
arp(176.0, 192.0, [Fmaj7, Cmaj7, Am, G], 84, 0.035, bar=3.0, decay=4)
put(176.6, noise(0.05, smooth=3, decay=60), 0.15)               # pick up
for k in range(2):
    put(180.8 + k * 0.6, tone([440, 480], 0.4, 3), 0.05)        # ring
put(186.4, noise(0.06, smooth=6, decay=50), 0.15)               # phone down

# ================= recap (192.4–229.8) =================
prog = [Cmaj7, G, Am, Fmaj7]
for i in range(9):
    a = 193.0 + i * 4.0
    pad(a, a + 4.2, [prog[i % 4][0] / 2] + prog[i % 4], 0.07 + 0.003 * i, fi=0.3, fo=0.3, bright=0.3)
arp(197.0, 229.0, prog, 96, 0.04, bar=4.0, decay=4)
beat(198.0, 229.0, 96, 0.15)
for c in [198.0, 203.6, 209.0, 214.4, 219.2]:
    put(c, tone([783.99, 1046.5, 1318.5], 0.9, 4), 0.10)        # card pop
put(225.0, tone([523.25, 659.25, 783.99, 1046.5], 3.0, 1.2), 0.10)

# ================= end =================
pad(230.0, 237.2, [87.31, 130.81, 174.61], 0.05, fi=0.8, fo=0.6)
put(237.6, boom(), 0.5)
pad(237.6, 245.0, [65.41] + C, 0.07, fi=0.4, fo=1.4)

peak = np.max(np.abs(out)) or 1.0
pcm = (np.clip(out * (0.7 / peak), -1, 1) * 32767).astype("<i2")
dst = HERE / "build" / "trilha.wav"
dst.parent.mkdir(exist_ok=True)
with wave.open(str(dst), "wb") as w:
    w.setnchannels(1); w.setsampwidth(2); w.setframerate(SR)
    w.writeframes(pcm.tobytes())
print("ok", dst)
