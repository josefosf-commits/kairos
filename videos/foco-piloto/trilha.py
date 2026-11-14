"""Gera trilha ambiente + efeitos sonoros do piloto FOCO (48 kHz, mono) -> build/trilha.wav.

Tudo sintetizado do zero: pad grave, "ding" de notificação, swipes, tic-tac acelerado
do relógio e um impacto grave no cartão de título.
"""
import math
import random
import struct
import wave
from pathlib import Path

SR = 48000
DUR = 28.5
N = int(SR * DUR)
buf = [0.0] * N
rnd = random.Random(7)


def add(t0, samples, gain=1.0):
    i0 = int(t0 * SR)
    for i, v in enumerate(samples):
        j = i0 + i
        if 0 <= j < N:
            buf[j] += v * gain


def env(t, a, b, fade_in=1.0, fade_out=1.0):
    """Trapezoid envelope over [a, b]."""
    if t < a or t > b:
        return 0.0
    return min(1.0, (t - a) / fade_in, (b - t) / fade_out)


# --- pad: acorde menor grave e lento (A1, E2, C3) com leve batimento ---
notes = [55.0, 82.41, 130.81, 164.81]
for i in range(N):
    t = i / SR
    e = env(t, 0.0, 23.8, 2.5, 1.2)
    if e == 0:
        continue
    night = min(1.0, max(0.0, (t - 15.3) / 3.5))
    v = 0.0
    for k, f in enumerate(notes):
        detune = 1 + 0.002 * math.sin(t * 0.3 + k)
        amp = [0.5, 0.35, 0.18 * (1 - 0.6 * night), 0.10 * night][k]
        v += amp * math.sin(2 * math.pi * f * detune * t)
    breathe = 0.75 + 0.25 * math.sin(2 * math.pi * t / 7.0)
    buf[i] += v * e * breathe * 0.12


# --- ding de notificação ---
def ding():
    out = []
    for i in range(int(SR * 0.9)):
        t = i / SR
        d = math.exp(-t * 6)
        out.append(d * (0.6 * math.sin(2 * math.pi * 1318.5 * t) + 0.4 * math.sin(2 * math.pi * 1975.5 * t)))
    return out


add(7.62, ding(), 0.22)
add(10.75, ding(), 0.14)

# --- vibração do celular na mesa ---
vib = []
for i in range(int(SR * 0.65)):
    t = i / SR
    gate = 1.0 if (t % 0.3) < 0.22 else 0.0
    vib.append(gate * math.sin(2 * math.pi * 150 * t) * (0.6 + 0.4 * math.sin(2 * math.pi * 31 * t)))
add(7.6, vib, 0.18)


# --- swipes (ruído filtrado) ---
def swipe(length=0.18):
    out, lp = [], 0.0
    n = int(SR * length)
    for i in range(n):
        x = rnd.uniform(-1, 1)
        lp += 0.12 * (x - lp)
        e = math.sin(math.pi * i / n) ** 2
        out.append((x - lp) * e)
    return out


t = 12.9
while t < 17.0:
    add(t, swipe(), 0.10 if t < 15.2 else 0.05)
    t += 0.28 if t < 15.2 else 0.55


# --- tic-tac acelerando durante a passagem do tempo ---
def tick(freq):
    return [math.exp(-i / SR * 120) * math.sin(2 * math.pi * freq * i / SR) for i in range(int(SR * 0.05))]


t, k = 15.0, 0
while t < 19.0:
    prog = (t - 15.0) / 4.0
    add(t, tick(2400 if k % 2 == 0 else 1900), 0.16 * (1 - 0.5 * prog))
    t += max(0.045, 0.5 * (1 - prog) ** 2)
    k += 1

# --- impacto grave no título ---
boom = []
for i in range(int(SR * 2.5)):
    tt = i / SR
    f = 70 * math.exp(-tt * 1.5) + 38
    boom.append(math.exp(-tt * 2.2) * math.sin(2 * math.pi * f * tt))
add(24.2, boom, 0.5)

# --- normaliza e salva ---
peak = max(abs(v) for v in buf) or 1.0
scale = 0.7 / peak
out = Path(__file__).parent / "build" / "trilha.wav"
out.parent.mkdir(exist_ok=True)
with wave.open(str(out), "wb") as w:
    w.setnchannels(1)
    w.setsampwidth(2)
    w.setframerate(SR)
    w.writeframes(b"".join(struct.pack("<h", int(max(-1, min(1, v * scale)) * 32767)) for v in buf))
print("ok", out)
