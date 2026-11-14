"""Biblioteca de sons dos curtas: pad, pluck, kick, noise, boom, sweep, arp, beat... (import * from som)"""
import json
import wave
from pathlib import Path

import numpy as np

HERE = Path.cwd()
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



def thud(g=1.0):
    t = np.arange(int(SR * 0.35)) / SR
    return (np.exp(-t * 18) * np.sin(2 * np.pi * (90 * np.exp(-t * 6) + 45) * t) + noise(0.35, smooth=20, decay=25) * 0.6) * g


def whoosh(dur=0.5):
    return noise(dur, smooth=10) * np.sin(np.linspace(0, np.pi, int(SR * dur))) ** 2


def chime(t0, gain=0.08):
    put(t0, tone([1567.98, 2093.0], 0.35, 11), gain)


Am = [110.0, 130.81, 164.81]; F = [87.31, 130.81, 174.61]; C = [130.81, 164.81, 196.0]; G = [98.0, 146.83, 196.0]
Em = [82.41, 123.47, 164.81]; Dm = [73.42, 110.0, 146.83]; Cmaj7 = [130.81, 164.81, 196.0, 246.94]; Fmaj7 = [87.31, 130.81, 174.61, 220.0]
TL = json.load(open(HERE / "timeline.json"))
def S(i): return next(l["start"] for l in TL["lines"] if l["id"] == i)
def E(i): return next(l["end"] for l in TL["lines"] if l["id"] == i)


def save():
    peak = np.max(np.abs(out)) or 1.0
    pcm = (np.clip(out * (0.7 / peak), -1, 1) * 32767).astype("<i2")
    dst = HERE / "build" / "trilha.wav"
    dst.parent.mkdir(exist_ok=True)
    with wave.open(str(dst), "wb") as w:
        w.setnchannels(1); w.setsampwidth(2); w.setframerate(SR); w.writeframes(pcm.tobytes())
    print("ok", dst)
