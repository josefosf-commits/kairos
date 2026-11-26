"""Ep. 9 do QI (Poder Mental): trilha épica (build/trilha.wav, abaixa com a voz) + efeitos de luta (build/sfx.wav, não abaixa)."""
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
pad(0.0, 3.3, [36.71, 73.42, 110.0], 0.07, fi=0.3, fo=0.3)
put(0.0, riser(3.2, 120, 900), 0.05)
pad(3.3, 8.0, [73.42, 110.0, 146.83], 0.04, fi=0.3, fo=0.3)
pad(8.0, 19.0, [36.71, 73.42, 110.0], 0.05, fi=0.5, fo=0.2, bright=0.3)
ostinato(11.2, 19.0, ROOTS, 0.05)
for i in range(int((19.0 - 8.0) / (b8 * 8))): put(8.0 + i * b8 * 8, tom(80), 0.12)
drums(19.0, 28.0, 0.12); ostinato(19.0, 28.0, ROOTS, 0.06)
pad(19.0, 28.0, Dm2, 0.04, bright=0.4)
pad(28.0, 34.3, [36.71, 73.42, 110.0, 146.83], 0.06, fi=1.0, fo=0.1, bright=0.5)
for i in range(16): put(30.3 + i * (4.0 / 16) * (1 - i / 40), tom(70 + i * 3), 0.05 + i * 0.006)
drums(34.3, 44.0, 0.14); ostinato(34.3, 44.0, ROOTS, 0.07)
for i, ch in enumerate([Dm2, Bb2, C3, A2, Dm2, Bb2, C3, A2]):
    brass(34.3 + i * b8 * 8, ch, b8 * 6, 0.09)
pad(44.0, 53.5, [36.71, 38.89, 73.42], 0.07, fi=0.4, fo=0.3)
for i in range(6): put(47.0 + i * 0.8, tom(55), 0.16)
pad(53.5, 55.9, [36.71, 73.42, 77.78], 0.07, fi=0.1, fo=0.2)
for i in range(30): put(55.9 + 5.0 * (1 - (1 - i / 30) ** 1.6), tom(70 + i * 2), 0.05 + i * 0.004)
put(58.9, riser(2.1, 200, 2600), 0.07)
pad(61.0, 67.0, Dm2 + [220.0, 293.66], 0.08, fi=0.2, fo=0.05, bright=0.6)
drums(61.0, 67.0, 0.14); ostinato(61.0, 67.0, ROOTS, 0.07)
for i, ch in enumerate([Dm2, Bb2, C3, A2, Dm2]): brass(61.0 + i * b8 * 8, ch, b8 * 7, 0.1)
# 67.0–69.3: silêncio total (só o zumbido)
pad(69.3, 75.7, [73.42, 110.0, 164.81, 174.61], 0.04, fi=1.2, fo=0.5)
drums(75.7, 78.0, 0.1); ostinato(75.7, 78.0, ROOTS, 0.05)
pad(78.0, 81.0, [293.66, 311.13], 0.03, fi=0.5, fo=0.1, trem=0.6)
put(81.05, boom(2.4, 70, 34, 1.6), 0.25); brass(81.05, [36.71, 73.42, 77.78, 110.0], 2.0, 0.1)
pad(81.2, 84.3, [36.71, 73.42, 110.0], 0.05, fi=0.4, fo=0.4)
pad(84.3, end, [73.42, 110.0, 146.83, 174.61], 0.05, fi=0.6, fo=1.5, bright=0.3)
arp(84.4, end - 1.0, [Dm, [58.27, 116.54, 146.83], [65.41, 130.81, 164.81], [55.0, 110.0, 164.81]], 120, 0.04, decay=4)
out[:] = np.tanh(out / np.abs(out).max() * 1.6)
save("trilha.wav")

# ---------------- EFEITOS (sem ducking) ----------------
out[:] = 0
put(0.4, rumble(2.8), 0.5); put(0.5, creak(2.4), 0.5)
put(1.0, punch(0.8), 0.5)
put(3.2, dash(0.4), 0.4); put(3.6, punch(0.8), 0.25); put(5.5, dash(0.4), 0.3)
put(8.05, punch(0.7), 0.4); put(8.3, riser(0.9, 600, 3000), 0.12); put(9.95, tone([1567.98, 2093.0], 0.5, 6), 0.15)
put(11.4, rumble(2.4), 0.5); put(11.5, creak(2.2), 0.5)
put(14.45, punch(0.6), 0.35)
put(15.35, creak(1.0), 0.5); put(15.4, thunk(), 0.5); put(15.4, rumble(1.0), 0.4)
for i in range(4): put(16.6 + i * 0.12, thunk(), 0.25)
put(18.95, dash(0.7), 0.6); put(19.3, dash(0.8), 0.5); put(19.45, whiff(), 0.4)
put(20.1, clang(), 0.6)
for i in range(4): put(20.35 + i * 0.08, thunk(), 0.4)
put(20.4, riser(0.55, 400, 2400), 0.2); put(20.95, laser(0.7), 0.6)
put(21.05, slowmo(), 0.7); put(21.5, heartbeat(), 0.6); put(22.15, heartbeat(), 0.6)
put(22.95, explosion(3.0, 0.9), 0.8); put(23.05, explosion(2.2, 0.6), 0.5); put(23.3, fire(4.7), 0.35)
for t0 in (24.95, 25.65, 26.35, 27.05): put(t0, stomp(0.5), 0.5); put(t0, clang()[:int(SR * 0.3)], 0.1)
put(28.5, charge(0.9), 0.5); put(29.35, stomp(1.2), 0.7); put(29.4, dash(0.7), 0.8); put(29.4, explosion(1.2, 0.5), 0.4)
put(31.4, beam(2.6, 55), 0.25); put(31.4, band(noise(2.6), 200, 3000) * 0.5, 0.25); put(31.8, dash(0.8), 0.6)
put(33.9, band(noise(6.5), 150, 2500), 0.06)  # propulsores no ar
put(34.3, dash(0.55), 0.7)
put(34.85, punch(1.4), 1.0); put(34.85, explosion(1.6, 0.6), 0.5); put(34.85, clang()[:int(SR * 0.6)], 0.2)
for k in range(12):
    t0 = 35.0 + k * 0.16 + 0.02
    put(t0, jab(), 0.55)
    if k % 3 == 2: put(t0, punch(0.7), 0.35)
put(37.0, punch(1.3), 0.9); put(37.0, boom(1.0, 90, 40, 3), 0.4)
put(37.05, dash(0.5), 0.35)
put(38.0, dash(0.3), 0.6); put(38.22, punch(1.5), 1.0); put(38.36, slowmo(), 0.45)
put(38.7, dash(0.3), 0.5); put(38.95, clang(), 0.8)
put(39.55, whiff(), 0.5); put(39.62 - 0.12, zip_tp(), 0.8); put(39.86 - 0.12, zip_tp(), 0.8)
put(40.1, dash(0.25), 0.5); put(40.25, punch(1.6), 1.0)
put(40.36, np.sin(2 * np.pi * np.cumsum(np.linspace(1800, 300, int(SR * 0.64))) / SR) * np.linspace(0.2, 1, int(SR * 0.64)), 0.15); put(40.36, dash(0.64), 0.5)
put(41.0, explosion(3.6, 1.3), 1.0); put(41.0, stomp(1.6), 0.9); put(41.0, rumble(2.5), 0.6)
put(44.6, creak(1.2), 0.4); put(45.4, riser(0.4, 300, 2000), 0.2); put(45.45, laser(0.4), 0.25)
put(45.7, heartbeat(), 0.7); put(46.4, heartbeat(), 0.7)
put(47.0, riser(3.6, 120, 900), 0.25); put(47.0, crackle(4.0, 45), 0.4)
for i in range(7): put(47.6 + i * 0.4, power_down(0.9), 0.4)
put(50.2, power_down(1.4), 0.7); put(50.6, stomp(1.5), 0.8); put(50.6, boom(2.0, 60, 30, 1.5), 0.6)
for t0 in (50.9, 51.6, 52.3): put(t0, stomp(1.4), 0.8); put(t0, creak(0.6), 0.3)
put(53.5, rumble(2.4), 0.4)
put(55.9, charge(3.8), 0.75); put(55.9, rumble(3.8), 0.4); put(56.2, crackle(3.4, 50), 0.3)
put(59.6, dash(0.7), 0.5); put(60.3, riser(0.7, 500, 3500), 0.3)
put(61.0, beam(6.0, 98), 0.45); put(61.0, beam(6.0, 73.4), 0.4)
put(61.25, punch(1.5), 0.9); put(61.25, explosion(1.5, 0.7), 0.5)
put(61.3, crackle(5.7, 70), 0.45); put(61.0, rumble(6.0), 0.5)
put(64.3, charge(0.5), 0.5); put(64.3, punch(1.0), 0.6)
put(65.8, riser(1.2, 300, 3200), 0.4)
put(67.0, explosion(4.5, 1.7), 1.0); put(67.0, stomp(2.0), 1.0)
put(67.6, tinnitus(2.6), 0.35)
put(69.3, band(noise(6.4), 60, 400) * np.sin(np.linspace(0, np.pi, int(SR * 6.4))), 0.25)
for i in range(9): put(71.95 + i * 0.1, tone([1800 + i * 90], 0.06, 30), 0.12)
put(71.9, laser(1.0), 0.15); put(72.85, tone([880.0, 1318.5], 0.35, 6), 0.18)
put(73.0, zip_tp(), 0.6); put(73.0, riser(0.4, 800, 4000), 0.2)
put(73.65, tone([3136.0, 4186.0], 0.4, 8), 0.12)
put(74.25, dash(0.9), 0.6)
put(75.7, band(noise(2.3), 300, 2500) * np.sin(np.linspace(0, np.pi, int(SR * 2.3))), 0.35); put(75.8, dash(0.8), 0.4)
put(78.4, creak(1.0), 0.25)
put(80.55, dash(0.5), 0.6); put(81.05, stomp(1.0), 0.8)
put(82.95, punch(0.5), 0.35); put(83.7, tone([2637.0, 3520.0], 0.3, 10), 0.15)
put(84.45, dash(0.4), 0.35); put(88.4, punch(0.6), 0.3)
out[:] = np.tanh(out / np.abs(out).max() * 2.6)  # compressão: socos mais presentes, explosões sem estourar
save("sfx.wav")
