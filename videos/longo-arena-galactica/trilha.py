"""Longo "Arena Galáctica": trilha épica (build/trilha.wav, abaixa com a voz) + efeitos e plateia (build/sfx.wav, não abaixa)."""
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
R1 = [65.41, 51.91, 58.27, 49.0]

# ---------------- MÚSICA ----------------
drums(0.0, 8.6, 0.12, 120, half=True); ostinato(0.0, 8.6, R1, 0.06, 120)
for i, ch in enumerate([Cm, Ab, Bb, G2]): brass(i * 2.0, ch, 1.8, 0.1)
pad(8.6, 16.1, [130.81, 155.56, 196.0], 0.04, fi=0.6, fo=0.5)
arp(8.8, 12.9, [[130.81, 155.56, 196.0], [103.83, 130.81, 155.56]], 90, 0.035, decay=4)
pad(12.9, 24.3, [65.41, 98.0, 130.81, 196.0, 261.63], 0.06, fi=1.0, fo=0.3, bright=0.5, trem=0.4)
put(21.6, riser(2.7, 200, 3000), 0.07)
pad(24.3, 30.0, [87.31, 130.81, 174.61, 220.0], 0.05, fi=0.8, fo=0.3, bright=0.3)
fanfare(30.1, 0.12); drums(31.0, 42.5, 0.1, 120, half=True); pad(31.0, 42.5, Cm + [196.0], 0.05, bright=0.4)
pad(42.5, 49.3, [65.41, 69.3, 98.0], 0.06, fi=0.5, fo=0.3)
arp(49.3, 76.4, [[130.81, 164.81, 196.0], [146.83, 174.61, 220.0], [130.81, 164.81, 196.0], [123.47, 146.83, 196.0]], 100, 0.03, decay=5)
pad(52.5, 76.4, [130.81, 196.0], 0.025, fi=1.0, fo=1.0)
# luta 1
drums(76.6, 95.2, 0.13, 120); ostinato(76.6, 95.2, R1, 0.07, 120)
for i in range(9): brass(76.6 + i * 2.0, [Cm, Ab, Bb, G2][i % 4], 1.6, 0.09)
pad(95.2, 101.8, [65.41, 69.3], 0.07, fi=0.3, fo=0.3)
drums(101.8, 115.4, 0.12, 132); ostinato(101.8, 115.4, R1, 0.06, 132)
pad(115.4, 121.2, [65.41, 98.0, 130.81, 196.0], 0.06, fi=1.5, fo=0.05, bright=0.6); put(118.5, riser(2.7, 200, 3200), 0.08)
pad(122.2, 131.4, [130.81, 164.81, 196.0, 261.63], 0.06, fi=0.3, fo=0.8, bright=0.4); fanfare(122.3, 0.1)
# luta 2
drums(131.5, 151.4, 0.13, 156); ostinato(131.5, 151.4, [73.42, 58.27, 65.41, 55.0], 0.065, 156)
pad(151.4, 168.6, [73.42, 77.78, 110.0], 0.05, fi=0.6, fo=0.05, trem=0.5)
pad(168.7, 176.6, [146.83, 185.0, 220.0, 293.66], 0.06, fi=0.1, fo=0.6, bright=0.5); fanfare(171.9, 0.1)
pad(176.7, 183.1, [146.83, 185.0, 220.0], 0.04, fi=0.5, fo=0.5)
# luta 3
pad(183.2, 212.2, [61.74, 92.5, 123.47], 0.05, fi=0.5, fo=0.3, trem=0.3)
ostinato(186.0, 212.2, [61.74, 49.0, 55.0, 46.25], 0.055, 140); drums(188.0, 201.0, 0.1, 140)
# 212.3–223.4: quase silêncio (só batimento, no sfx)
pad(223.4, 227.5, [65.41, 98.0, 130.81, 196.0], 0.07, fi=0.1, fo=0.3, bright=0.6)
fanfare(227.6, 0.13); drums(227.6, 233.0, 0.13, 120); pad(227.6, 244.7, [130.81, 164.81, 196.0, 261.63], 0.06, fi=0.3, fo=0.8, bright=0.5)
fanfare(238.4, 0.1)
pad(244.7, end, [130.81, 164.81, 196.0, 246.94], 0.04, fi=1.0, fo=2.0)
arp(244.9, end - 1.5, [[130.81, 164.81, 196.0], [174.61, 220.0, 261.63], [196.0, 246.94, 293.66], [130.81, 164.81, 196.0]], 96, 0.035, decay=4)
out[:] = np.tanh(out / np.abs(out).max() * 1.6)
save("trilha.wav")

# ---------------- EFEITOS + PLATEIA ----------------
out[:] = 0
put(0.0, crowd_bed(8.6, 1.0), 0.3); put(0.5, cheer(3.5), 0.35); put(2.6, punch(0.8), 0.4)
put(12.9, beam(11.4, 55), 0.12); put(12.9, riser(1.2, 300, 1800), 0.15)
put(16.1, beam(8.2, 82), 0.08); put(19.9, beam(4.4, 41), 0.15); put(21.6, riser(2.7, 150, 2500), 0.15); put(23.9, dash(0.5), 0.4)
put(24.3, crowd_bed(188.0, 1.0) * np.clip((188.0 - np.arange(int(SR * 188.0)) / SR) / 0.6, 0, 1), 0.22); put(222.4, crowd_bed(22.3, 1.0), 0.22)
put(30.0, dash(0.6), 0.4)
for b in range(5): put(30.2 + b * 0.55, explosion(1.2, 0.3), 0.25); put(30.2 + b * 0.55, crackle(1.2, 30), 0.2)
put(30.3, cheer(3.0), 0.5); put(38.84, ooh(1.6), 0.4)
put(47.0, ooh(1.4), 0.25); put(52.0, tone([880.0, 1174.7], 0.25, 8), 0.08)
put(67.25, tone([1567.98, 2093.0, 2637.0], 0.8, 4), 0.2); put(67.25, riser(0.5, 800, 3000), 0.15); put(74.4, tone([523.25, 783.99], 1.2, 2), 0.1)
# luta 1
put(76.8, rumble(2.5), 0.8); put(76.8, cheer(3.0), 0.5); put(79.0, growl(1.6), 0.9); put(79.0, stomp(1.2), 0.5)
for t0 in (84.55, 86.05): put(t0, stomp(1.4), 0.9); put(t0, rumble(0.8), 0.5)
put(89.6, dash(0.4), 0.3); put(90.35, dash(0.25), 0.6); put(90.55, punch(1.6), 1.0); put(90.55, ooh(1.5), 0.45)
put(90.7, dash(1.2), 0.5); put(92.0, stomp(0.7), 0.6); put(92.25, thud(0.6), 0.4); put(92.6, laugh(2.6), 0.6)
for t0 in (96.2, 98.2, 100.2): put(t0, stomp(1.0), 0.6)
put(99.0, slowmo(), 0.3)
put(104.2, dash(0.4), 0.5); put(104.6, stomp(1.5), 0.9); put(104.6, explosion(1.2, 0.5), 0.4); put(106.2, dash(0.5), 0.5)
for t0 in (108.0, 108.95): put(t0, whiff(), 0.7); put(t0 + 0.15, ooh(1.0), 0.2)
for i in range(6): put(109.8 + i * 0.15, whiff(), 0.5)
for i in range(4): put(110.8 + i * 1.1, band(noise(0.6), 80, 700) * np.sin(np.linspace(0, np.pi, int(SR * 0.6))), 0.5)
put(115.6, charge(4.9), 0.8); put(115.6, crackle(4.9, 30), 0.25); put(120.6, dash(0.65), 0.7)
put(121.25, punch(1.8), 1.0); put(121.25, explosion(1.8, 0.8), 0.6); put(121.42, slowmo(), 0.4)
put(124.0, explosion(3.0, 1.2), 0.9); put(124.0, stomp(1.8), 0.9); put(122.3, cheer(4.0), 0.7)
# luta 2
put(131.85, zip_tp(), 0.9); put(132.0, laser(0.5), 0.3); put(132.0, explosion(0.8, 0.4), 0.4); put(131.6, cheer(2.5), 0.4)
k = 0
while 136.0 + k * 0.74 < 145.0: put(136.0 + k * 0.74, dash(0.5), 0.35); k += 1
for t0 in (146.18, 147.63, 148.76): put(t0 - 0.1, whiff(), 0.4); put(t0, punch(1.2), 0.9); put(t0 + 0.05, ooh(0.9), 0.25)
put(149.6, thud(0.8), 0.6); put(155.0, ooh(2.0), 0.4)
put(160.3, slowmo(), 0.6)
for i in range(7): put(160.6 + i * 1.15, heartbeat(), 0.7)
put(161.2, band(noise(2.3), 400, 3000) * np.sin(np.linspace(0, np.pi, int(SR * 2.3))) ** 2, 0.35)
put(168.75, riser(0.25, 800, 4000), 0.4); put(169.0, clang(), 0.9); put(169.6, dash(0.4), 0.5); put(170.0, punch(1.6), 1.0)
put(171.0, explosion(2.0, 0.8), 0.8); put(170.2, cheer(4.5), 0.7)
# luta 3
put(183.4, explosion(1.0, 0.4), 0.4); put(183.4, zip_tp(), 0.6); put(183.5, ooh(1.5), 0.3)
for t0 in (189.16, 190.71, 191.95): put(t0 - 0.12, zip_tp(), 0.8); put(t0, tone([392.0, 523.25], 0.3, 10), 0.15)
put(195.7, dash(0.3), 0.5); put(195.98, explosion(0.9, 0.35), 0.5); put(196.0, laugh(1.8), 0.4); put(197.6, dash(0.5), 0.4)
put(201.3, power_down(1.2), 0.6); put(201.0, crackle(4.5, 20), 0.3)
for i in range(6): put(202.0 + i * 0.6, tone([880.0], 0.12, 20), 0.15)
put(212.34, tone([1318.5, 1760.0], 1.5, 3), 0.12)
for i in range(10): put(212.5 + i * 1.0, heartbeat(), 0.8)
for i in range(4): put(216.0 + i * 0.45, thunk(), 0.3)
put(222.46, tone([523.25, 783.99, 1046.5], 0.8, 4), 0.2)
put(223.5, dash(0.7), 0.8); put(224.2, punch(1.9), 1.0); put(224.2, explosion(2.5, 1.1), 0.8)
for i in range(7): put(224.4 + i * 0.04, explosion(0.6, 0.25), 0.2)
put(224.42, np.sin(2 * np.pi * np.cumsum(np.linspace(2000, 400, int(SR * 2.0))) / SR) * np.linspace(1, 0.1, int(SR * 2.0)), 0.12); put(224.45, slowmo(), 0.5)
put(226.0, cheer(5.0), 0.8)
for b in range(5): put(227.6 + b * 0.55, explosion(1.2, 0.3), 0.3); put(227.6 + b * 0.55, crackle(1.2, 30), 0.2)
put(230.0, cheer(4.0), 0.5)
t0 = 238.5
while t0 < 241.0: put(t0, chant_beat(), 0.8); t0 += 0.6
put(240.8, beam(4.0, 55), 0.15); put(240.8, riser(3.5, 200, 2400), 0.12); put(244.3, dash(0.5), 0.4)
for i in range(9): put(245.0 + i * 1.3 + 0.3 * (i % 2), chirp_bird(), 0.2)
put(253.83, tone([1567.98, 2093.0, 2637.0, 3136.0], 1.2, 3), 0.25)
put(256.1, dash(0.4), 0.3); put(261.0, punch(0.5), 0.25)
out[:] = np.tanh(out / np.abs(out).max() * 2.4)
save("sfx.wav")
