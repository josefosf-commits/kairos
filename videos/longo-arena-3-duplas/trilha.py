"""Longo "Arena Galáctica 3: O Torneio das Duplas": trilha épica (build/trilha.wav, abaixa com a voz) + efeitos e plateia (build/sfx.wav, não abaixa)."""
import sys
sys.path.insert(0, "../_lib")
from som import *
from luta import *
end = TL["duration"]

def saw_note(f, d, cut=900, dec=3):
    t = np.arange(int(SR * d)) / SR
    return band((saw(f, t) + saw(f * 1.006, t)) * 0.5 * np.exp(-t * dec), None, cut)

def ostinato(a, b, roots, gain, bpm, bar=8):
    s8 = 60 / bpm / 2; t, k = a, 0; pat = [1, 1, 2, 1, 1, 2, 1.5, 1]
    while t < b:
        r = roots[(k // bar) % len(roots)]; m = pat[k % 8]
        put(t, saw_note(r * (2 if m == 2 else 1.5 if m == 1.5 else 1), s8 * 0.9), gain); t += s8; k += 1

def snare():
    d = 0.25; t = np.arange(int(SR * d)) / SR
    return band(noise(d), 900, 8000) * np.exp(-t * 18) + np.sin(2 * np.pi * 190 * t) * np.exp(-t * 25) * 0.5

def tom(f=90):
    d = 0.6; t = np.arange(int(SR * d)) / SR
    return np.sin(2 * np.pi * np.cumsum(f * (1 + 0.6 * np.exp(-t * 12))) / SR) * np.exp(-t * 6) + band(noise(d), None, 400) * np.exp(-t * 12) * 0.4

def drums(a, b, gain, bpm, half=False):
    s8 = 60 / bpm / 2; t, k = a, 0
    while t < b:
        if k % 4 == 0: put(t, kick(130, 45, 0.4), gain)
        if k % 4 == 2: put(t, snare(), gain * 0.7)
        if not half and k % 8 == 7: put(t, kick(130, 45, 0.3), gain * 0.6)
        put(t, hat(), gain * 0.15); t += s8 * (2 if half else 1); k += 1

def brass(t0, ch, d, gain):
    t = np.arange(int(SR * d)) / SR
    x = sum(saw(f, t) + saw(f * 1.004, t) for f in ch) / (2 * len(ch))
    put(t0, band(x, None, 1700) * np.clip(t / 0.04, 0, 1) * np.exp(-t * 1.4), gain)

def fanfare(t0, gain=0.1, bpm=120):
    b = 60 / bpm
    for i, ch in enumerate([[130.81, 196.0, 261.63], [130.81, 196.0, 261.63], [146.83, 220.0, 293.66], [174.61, 261.63, 349.23], [196.0, 293.66, 392.0]]):
        brass(t0 + [0, 0.5, 1, 1.5, 2.0][i] * b, ch, b * (0.45 if i < 4 else 2.0), gain)

Cm = [65.41, 98.0, 130.81]; Ab = [51.91, 103.83, 130.81]; Bb = [58.27, 116.54, 146.83]; G2 = [49.0, 98.0, 146.83]
Cm = [65.41, 98.0, 130.81]; Ab = [51.91, 103.83, 130.81]; Bb = [58.27, 116.54, 146.83]; G2 = [49.0, 98.0, 146.83]
R1 = [65.41, 51.91, 58.27, 49.0]
Dm = [73.42, 110.0, 146.83]; Eb = [77.78, 116.54, 155.56]
R2 = [65.41, 51.91, 58.27, 49.0]; RV = [61.74, 49.0, 55.0, 46.25]

# ---------------- MÚSICA ----------------
drums(0.0, 6.0, 0.13, 132); ostinato(0.0, 6.0, R1, 0.06, 132)
for i, ch in enumerate([Cm, Ab, Bb]): brass(i * 1.6, ch, 1.5, 0.1)
fanfare(4.3, 0.1)
pad(6.0, 21.6, [130.81, 155.56, 196.0], 0.04, fi=0.6, fo=0.5)
arp(9.6, 21.4, [[130.81, 155.56, 196.0], [103.83, 130.81, 155.56], [116.54, 146.83, 174.61]], 96, 0.03, decay=4)
pad(21.6, 33.0, [49.0, 51.91, 73.42, 77.78], 0.07, fi=0.8, fo=0.3, trem=0.5)
pad(33.0, 40.0, [65.41, 98.0, 130.81, 196.0], 0.05, fi=0.4, fo=0.2, bright=0.4)
fanfare(40.36, 0.12); drums(41.0, 47.5, 0.1, 120, half=True); pad(40.4, 47.5, [61.74, 92.5, 123.47], 0.05, trem=0.3)
# luta 1 (Zentrix): rápida
drums(47.6, 67.4, 0.13, 150); ostinato(47.6, 67.4, R1, 0.06, 150)
pad(67.4, 75.3, [130.81, 196.0, 261.63], 0.035, fi=0.5, fo=0.2, trem=0.6)
drums(75.3, 81.4, 0.14, 150); for_i = [brass(75.3 + i * 1.2, ch, 1.0, 0.1) for i, ch in enumerate([Cm, Ab, Bb, G2, Cm])]
fanfare(81.4, 0.11); pad(85.0, 91.7, [130.81, 164.81, 196.0, 261.63], 0.04, fi=0.6, fo=0.5, bright=0.3)
# luta 2 (Grolm): pesada
pad(91.8, 130.0, [32.7, 49.0, 65.41], 0.06, fi=1.0, fo=0.5, trem=0.2)
drums(96.0, 124.3, 0.15, 96); ostinato(96.0, 124.3, R2, 0.06, 96)
for i, ch in enumerate([Cm, Ab, Bb, G2] * 3): brass(108.0 + i * 1.33, ch, 1.1, 0.08)
fanfare(126.5, 0.11); pad(130.1, 135.7, [130.81, 164.81, 196.0, 261.63], 0.04, fi=0.6, fo=0.5, bright=0.3)
# luta final (Nyx): sombria, depois heroica
pad(135.7, 151.6, [46.25, 49.0, 69.3, 73.42], 0.07, fi=0.6, fo=0.2, trem=0.7)
drums(151.6, 162.0, 0.14, 140); ostinato(151.6, 162.0, RV, 0.06, 140)
pad(162.0, 171.7, [46.25, 49.0, 69.3], 0.06, fi=0.3, fo=0.4, trem=0.5)
pad(171.7, 185.4, [130.81, 164.81, 196.0, 246.94], 0.05, fi=1.5, fo=0.2, bright=0.5)
arp(171.8, 185.3, [[130.81, 164.81, 196.0], [146.83, 174.61, 220.0], [164.81, 196.0, 246.94]], 110, 0.035, decay=5)
drums(185.4, 196.0, 0.15, 150); for_j = [brass(185.4 + i * 1.3, ch, 1.1, 0.1) for i, ch in enumerate([Cm, Ab, Bb, G2, Cm, Ab, Bb, G2])]
# 196.0–198.0: silêncio depois da explosão de luz
fanfare(201.3, 0.13); pad(201.3, end, [130.81, 164.81, 196.0, 261.63], 0.05, fi=0.8, fo=2.0, bright=0.4)
arp(205.3, end - 1.5, [[130.81, 164.81, 196.0], [110.0, 130.81, 164.81], [116.54, 146.83, 174.61], [98.0, 123.47, 146.83]], 100, 0.03, decay=5)
out[:] = np.tanh(out / np.abs(out).max() * 1.6)
save("trilha.wav")

# ---------------- EFEITOS + PLATEIA ----------------
out[:] = 0
put(0.0, crowd_bed(6.0, 1.0), 0.25); put(4.3, cheer(2.0), 0.3)
put(6.3, tone([1567.98, 2093.0], 0.8, 4), 0.15); put(9.6, riser(0.5, 600, 2400), 0.12); put(9.7, tone([880.0, 1318.5], 0.6, 5), 0.1)
put(21.9, rumble(4.0), 0.3); put(22.4, band(noise(3.0), 100, 700) * 0.4, 0.3)
put(27.6, rumble(2.0), 0.3)
put(33.0, beam(2.4, 55), 0.15); put(33.0, riser(2.2, 300, 2400), 0.12); put(35.2, stomp(1.0), 0.6)
put(40.4, cheer(3.5), 0.6)
for b in range(5): put(40.5 + b * 0.55, explosion(1.2, 0.3), 0.25)
put(48.0, zip_tp(), 0.7); put(48.1, zip_tp(), 0.5); put(48.6, ooh(1.6), 0.4)
put(47.6, crowd_bed(154.0, 0.8), 0.18)
for i in range(30): put(52.0 + i * 0.5, whiff(), 0.25 + 0.1 * (i % 3 == 0))
for i in range(12): put(56.5 + i * 0.6, jab(), 0.35)
for i in range(12): put(67.6 + i * 0.62, thunk(), 0.35)
put(75.4, dash(0.3), 0.5); put(75.8, slowmo(), 0.6); put(76.1, whiff(), 0.6)
put(77.9, punch(1.9), 1.0); put(77.9, explosion(0.8, 0.5), 0.5); put(78.0, dash(1.2), 0.6); put(78.4, cheer(3.0), 0.5)
put(92.4, rumble(3.0), 0.7); put(92.4, stomp(2.0), 0.8); put(93.5, growl(1.8), 0.6)
for i in range(6): put(97.2 + i * 0.3, clang()[:int(SR * 0.3)], 0.35)
put(100.4, growl(1.0), 0.5); put(101.0, explosion(1.6, 1.0), 0.9); put(101.0, stomp(2.0), 1.0)
put(108.1, charge(3.0), 0.4); put(108.2, crackle(9.0, 40), 0.35)
put(113.6, tone([2093.0, 2637.0], 0.8, 4), 0.2)
put(121.3, punch(1.7), 1.0); put(121.7, beam(0.9, 98), 0.6); put(121.7, laser(0.9), 0.4)
put(122.6, explosion(1.0, 0.7), 0.8); put(122.6, tone([3136.0, 4186.0], 0.6, 6), 0.25)
put(124.3, explosion(3.0, 1.8), 1.0); put(124.3, stomp(2.2), 1.0); put(124.3, rumble(3.0), 0.7); put(125.5, cheer(4.0), 0.6)
put(136.0, band(noise(4.0), 60, 400) * 0.5, 0.3); put(140.0, rumble(4.0), 0.4); put(140.0, crackle(4.0, 30), 0.3); put(141.5, ooh(1.6), 0.4)
put(153.2, punch(1.5), 0.9); put(153.0, jab(), 0.4); put(155.0, punch(1.6), 1.0)
put(157.6, beam(2.8, 98), 0.5); put(157.6, beam(2.8, 92.5), 0.45); put(157.6, crackle(2.8, 60), 0.4)
put(162.0, stomp(1.4), 0.8); put(162.3, stomp(1.2), 0.7); put(162.6, ooh(1.6), 0.5)
put(176.0, charge(2.0), 0.4)
for i, t0 in enumerate([177.6, 179.35, 181.1]):
    put(t0, riser(0.5, 400, 2400), 0.3); put(t0 + 0.5, tone([1046.5 * (1 + 0.25 * i)], 0.4, 6), 0.15)
put(179.4, stomp(1.4), 0.6)
put(185.5, dash(0.8), 0.7); put(186.0, whiff(), 0.7); put(186.6, punch(1.5), 0.9); put(187.4, punch(1.9), 1.0); put(187.4, explosion(0.8, 0.5), 0.5)
put(189.4, power_down(1.2), 0.4)
for i in range(8): put(189.6 + i * 0.25, tone([600 + 200 * (i % 3)], 0.06, 30), 0.12)
put(196.0, explosion(1.0, 1.5), 1.0); put(196.0, tone([1046.5, 1318.5, 1568.0], 2.0, 1.5), 0.25); put(196.2, tinnitus(1.6), 0.25)
put(201.3, cheer(5.0), 0.7)
for b in range(5): put(201.4 + b * 0.55, explosion(1.2, 0.3), 0.25)
put(213.0, thunk(), 0.4); put(213.3, ooh(1.4), 0.25)
for b in range(5): put(224.6 + b * 3, explosion(1.2, 0.3), 0.2)
put(224.6, cheer(4.0), 0.4); put(230.5, punch(0.5), 0.25)
out[:] = np.tanh(out / np.abs(out).max() * 2.4)
save("sfx.wav")
