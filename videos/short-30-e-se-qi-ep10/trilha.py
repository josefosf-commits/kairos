"""Ep. 10 do QI (Qual é o verdadeiro?): trilha épica (build/trilha.wav, abaixa com a voz) + efeitos de luta (build/sfx.wav, não abaixa)."""
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
pad(0.0, 3.3, [36.71, 73.42, 77.78], 0.07, fi=0.2, fo=0.3, trem=0.5)
put(0.0, riser(3.2, 120, 700), 0.05)
pad(3.3, 6.75, [73.42, 110.0, 146.83], 0.04, fi=0.3, fo=0.3)
pad(6.75, 17.4, [36.71, 73.42, 87.31], 0.05, fi=0.8, fo=0.3, trem=0.3)
for i in range(int((17.4 - 11.6) / (b8 * 4))): put(11.6 + i * b8 * 4, tom(70), 0.07)
pad(17.4, 30.45, [73.42, 87.31, 110.0, 155.56], 0.045, fi=0.5, fo=0.5, trem=0.6)
for i in range(int((30.45 - 21.3) / 0.5)): put(21.3 + i * 0.5, tone([1046.5 if i % 2 else 880.0], 0.1, 25), 0.03)
pad(30.45, 36.45, [36.71, 38.89, 73.42], 0.06, fi=0.4, fo=0.2, trem=0.7)
drums(38.75, 51.0, 0.13); ostinato(38.75, 51.0, ROOTS, 0.065)
for i, ch in enumerate([Dm2, Bb2, C3, A2, Dm2, Bb2, C3]): brass(38.75 + i * b8 * 8, ch, b8 * 6, 0.08)
pad(53.6, 61.4, [73.42, 77.78, 110.0], 0.04, fi=1.0, fo=0.4, trem=0.6)
pad(61.4, 80.0, [73.42, 110.0, 146.83, 174.61, 220.0], 0.06, fi=1.2, fo=0.6, bright=0.2)
arp(64.4, 80.0, [Dm, [58.27, 116.54, 146.83], [87.31, 130.81, 174.61], [65.41, 130.81, 164.81]], 84, 0.035, decay=3)
pad(80.0, 87.6, [36.71, 38.89, 73.42, 77.78], 0.07, fi=0.2, fo=0.2, trem=0.8)
drums(82.5, 87.6, 0.1, half=True)
put(87.6, boom(2.6, 70, 34, 1.6), 0.2); brass(87.6, [36.71, 73.42, 87.31, 110.0], 2.2, 0.1)
pad(87.6, end, [73.42, 110.0, 146.83, 174.61], 0.05, fi=0.6, fo=1.5, bright=0.3)
arp(89.8, end - 1.0, [Dm, [58.27, 116.54, 146.83], [65.41, 130.81, 164.81], [55.0, 110.0, 164.81]], 120, 0.04, decay=4)
out[:] = np.tanh(out / np.abs(out).max() * 1.6)
save("trilha.wav")

# ---------------- EFEITOS (sem ducking) ----------------
out[:] = 0
put(2.2, tone([1760.0, 2637.0], 0.25, 12), 0.12)  # brilho no olho
put(3.4, laser(1.9), 0.12); put(3.6, band(noise(1.7), 800, 5000), 0.05); put(5.3, zip_tp(), 0.5)
put(6.8, power_down(0.9), 0.3)
put(21.3, tone([2093.0, 2637.0], 0.15, 20), 0.12)
for i in range(8): put(24.7 + i * 0.4, tone([1800 + i * 120], 0.05, 40), 0.08)
put(27.6, tone([220.0, 207.65], 0.6, 3), 0.15)
put(31.2, creak(1.2), 0.35)
put(34.6, tone([1760.0, 2637.0], 0.45, 7), 0.18); put(34.6, riser(0.8, 300, 2200), 0.12)
put(38.75, punch(1.4), 0.9); put(38.75, thunk(), 0.6); for_i = [put(38.8 + i * 0.07, thunk(), 0.3) for i in range(4)]
put(40.0, dash(0.35), 0.6); put(40.35, punch(1.6), 1.0); put(40.35, clang()[:int(SR * 0.4)], 0.2)
put(41.0, stomp(0.6), 0.3); put(41.8, stomp(0.5), 0.25)
put(44.6, dash(0.3), 0.5); put(44.75, slowmo(), 0.6); put(45.2, whiff(), 0.5); put(45.35, heartbeat(), 0.5)
put(45.95, punch(1.4), 1.0)
put(46.4, charge(0.6), 0.4); put(46.5, rumble(0.5), 0.4); put(46.95, dash(0.4), 0.6)
put(47.35, explosion(0.9, 0.5), 0.6); put(47.35, punch(1.2), 0.7); [put(47.4 + i * 0.06, thunk(), 0.4) for i in range(5)]
put(48.25, laser(2.8), 0.5); put(48.25, beam(2.8, 73.4), 0.35)
put(48.85, charge(0.4), 0.4); put(48.9, clang(), 0.7); put(48.95, crackle(2.1, 60), 0.4); put(48.9, beam(2.1, 98), 0.3)
put(50.3, riser(0.7, 300, 3000), 0.35)
put(51.0, explosion(1.3, 1.5), 1.0); put(51.0, stomp(1.8), 0.9)
put(51.6, tinnitus(2.0), 0.3)
put(54.0, band(noise(3.4), 60, 400) * np.sin(np.linspace(0, np.pi, int(SR * 3.4))), 0.2)
put(64.5, dash(0.6), 0.3)
for i in range(10): put(68.6 + i * 0.28, tone([1500 + (i % 3) * 200], 0.05, 40), 0.08)
put(71.45, tone([311.13, 293.66], 0.9, 2), 0.25); put(71.5, crackle(2.5, 40), 0.25)
put(80.0, crackle(1.4, 70), 0.5); put(80.0, zip_tp(), 0.6); put(80.6, zip_tp(), 0.5); put(81.2, stomp(0.8), 0.6)
put(86.2, charge(0.5), 0.5); put(86.4, band(noise(1.2), 150, 2500), 0.3); put(86.6, dash(0.7), 0.8)
put(87.1, explosion(0.6, 0.4), 0.4); [put(87.15 + i * 0.05, tone([3000 + i * 400], 0.12, 25), 0.15) for i in range(6)]
put(88.2, band(noise(5.0), 100, 1500) * np.sin(np.linspace(0, np.pi, int(SR * 5.0))), 0.08)
out[:] = np.tanh(out / np.abs(out).max() * 2.6)
save("sfx.wav")
