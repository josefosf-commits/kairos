"""T2 ep. 1 (A Cabeça de Meteoro): trilha épica (build/trilha.wav, abaixa com a voz) + efeitos de luta (build/sfx.wav, não abaixa)."""
import sys
sys.path.insert(0, "../_lib")
from som import *
from luta import *
end = TL["duration"]
BPM = 150; b8 = 60 / BPM / 2

def saw_note(f, d, cut=900):
    t = np.arange(int(SR * d)) / SR
    x = (saw(f, t) + saw(f * 1.006, t)) * 0.5 * np.exp(-t * 3)
    return band(x, None, cut)

def ostinato(a, b, roots, gain, bar=8):
    t, k = a, 0
    pat = [1, 1, 2, 1, 1, 2, 1.5, 1]
    while t < b:
        r = roots[(k // bar) % len(roots)]
        put(t, saw_note(r * (1 if pat[k % 8] != 2 else 2) * (1.5 if pat[k % 8] == 1.5 else 1), b8 * 0.9), gain)
        t += b8; k += 1

def snare():
    d = 0.25; t = np.arange(int(SR * d)) / SR
    return band(noise(d), 900, 8000) * np.exp(-t * 18) + np.sin(2 * np.pi * 190 * t) * np.exp(-t * 25) * 0.5

def tom(f=90):
    d = 0.6; t = np.arange(int(SR * d)) / SR
    return np.sin(2 * np.pi * np.cumsum(f * (1 + 0.6 * np.exp(-t * 12))) / SR) * np.exp(-t * 6) + band(noise(d), None, 400) * np.exp(-t * 12) * 0.4

def drums(a, b, gain, half=False):
    t, k = a, 0
    while t < b:
        if k % 4 == 0: put(t, kick(130, 45, 0.4), gain)
        if k % 4 == 2: put(t, snare(), gain * 0.7)
        if not half and k % 8 == 7: put(t, kick(130, 45, 0.3), gain * 0.6)
        put(t, hat(), gain * 0.15)
        t += b8 * (2 if half else 1); k += 1

def brass(t0, ch, d, gain):
    t = np.arange(int(SR * d)) / SR
    x = sum(saw(f, t) + saw(f * 1.004, t) for f in ch) / (2 * len(ch))
    e = np.clip(t / 0.04, 0, 1) * np.exp(-t * 1.6)
    put(t0, band(x, None, 1600) * e, gain)

Dm2 = [73.42, 110.0, 146.83]; Bb2 = [58.27, 116.54, 146.83]; C3 = [65.41, 130.81, 164.81]; A2 = [55.0, 110.0, 164.81]
ROOTS = [73.42, 58.27, 65.41, 55.0]

# ---------------- MÚSICA ----------------
Dm = [73.42, 110.0, 146.83]
pad(0.0, 4.45, [146.83, 220.0, 293.66], 0.04, fi=0.2, fo=0.3, trem=0.4)
put(1.6, riser(1.4, 300, 2400), 0.06)
pad(4.45, 8.6, [36.71, 38.89, 73.42], 0.05, fi=0.3, fo=0.3, trem=0.7)
pad(8.6, 22.3, [146.83, 174.61, 220.0, 261.63], 0.04, fi=0.6, fo=0.4, bright=0.4)
arp(8.8, 22.0, [Dm, [87.31, 130.81, 174.61], [98.0, 146.83, 196.0], [65.41, 130.81, 164.81]], 100, 0.035, decay=4)
pad(22.3, 29.4, [130.81, 164.81, 196.0, 261.63], 0.04, fi=0.4, fo=0.3)
pad(29.4, 36.8, [36.71, 38.89, 73.42, 77.78], 0.07, fi=0.3, fo=0.2, trem=0.8)
put(29.5, riser(2.6, 100, 1500), 0.08)
drums(36.8, 51.9, 0.14); ostinato(36.8, 51.9, ROOTS, 0.07)
for i, ch in enumerate([Dm2, Bb2, C3, A2, Dm2, Bb2, C3, A2, Dm2]): brass(36.8 + i * b8 * 8, ch, b8 * 6, 0.08)
pad(53.9, end, [73.42, 110.0, 146.83, 174.61], 0.05, fi=1.0, fo=1.5, bright=0.3)
arp(56.5, end - 0.8, [Dm, [58.27, 116.54, 146.83], [65.41, 130.81, 164.81], [55.0, 110.0, 164.81]], 120, 0.04, decay=4)
out[:] = np.tanh(out / np.abs(out).max() * 1.6)
save("trilha.wav")

# ---------------- EFEITOS (sem ducking) ----------------
out[:] = 0
for i in range(6): put(1.7 + i * 0.22, tone([880 + i * 110], 0.12, 18), 0.08)
put(3.0, punch(0.5), 0.4); put(3.0, tone([1318.5, 1760.0], 0.35, 8), 0.2)
put(9.0, creak(0.8), 0.2)
for i in range(16): put(13.3 + i * 0.25, tone([1500 + i * 60], 0.05, 40), 0.06)
put(17.2, tone([1046.5, 1318.5, 1568.0], 0.6, 5), 0.18)
put(22.4, creak(0.9), 0.3); put(24.3, tone([523.25, 659.25], 0.3, 6), 0.12)
put(27.3, tone([2093.0, 2637.0, 3136.0], 0.5, 6), 0.12)
put(29.6, band(noise(2.5), 200, 3000) * np.linspace(0.2, 1, int(SR * 2.5)), 0.3)
put(32.1, explosion(1.2, 0.8), 0.8); put(32.1, stomp(1.8), 1.0)
put(33.2, power_down(0.6), 0.2)
put(37.0, dash(0.3), 0.5); put(37.9, slowmo(), 0.6); put(38.2, whiff(), 0.6)
put(40.3, punch(1.3), 0.9); put(40.25, jab(), 0.4); put(41.0, punch(1.4), 0.9)
put(43.3, whiff(), 0.6); put(43.65, punch(1.7), 1.0); put(43.65, clang()[:int(SR * 0.4)], 0.3)
put(45.5, dash(0.4), 0.6); put(45.75, punch(1.9), 1.0); put(45.75, explosion(0.8, 0.5), 0.5); put(45.8, dash(1.2), 0.6)
put(50.6, charge(0.9), 0.7); put(50.6, crackle(0.9, 60), 0.4)
put(51.5, beam(0.4, 98), 0.7); put(51.5, laser(0.4), 0.5)
put(51.9, explosion(3.0, 1.8), 1.0); put(51.9, stomp(2.0), 0.9); put(52.1, tinnitus(1.6), 0.25)
put(54.0, band(noise(3.0), 80, 800) * np.sin(np.linspace(0, np.pi, int(SR * 3.0))), 0.2)
out[:] = np.tanh(out / np.abs(out).max() * 2.6)
save("sfx.wav")
