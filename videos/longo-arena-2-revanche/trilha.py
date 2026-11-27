"""Longo "Arena Galáctica 2: A Revanche": trilha épica (build/trilha.wav, abaixa com a voz) + efeitos e plateia (build/sfx.wav, não abaixa)."""
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
drums(0.0, 8.7, 0.13, 132); ostinato(0.0, 8.7, R1, 0.06, 132)
for i, ch in enumerate([Cm, Ab, Bb, G2]): brass(i * 2.0, ch, 1.8, 0.1)
pad(8.7, 18.9, [130.81, 155.56, 196.0], 0.04, fi=0.6, fo=0.5)
arp(9.0, 13.6, [[130.81, 155.56, 196.0], [103.83, 130.81, 155.56]], 90, 0.03, decay=4)
pad(13.6, 18.9, [196.0, 261.63, 311.13], 0.03, fi=0.4, fo=0.5, bright=0.5, trem=0.5)
pad(18.9, 31.8, [49.0, 51.91, 73.42], 0.07, fi=0.8, fo=0.3, trem=0.3)
for t0 in (19.0, 21.0, 23.0, 25.86, 27.86, 29.86): put(t0, tom(55), 0.25)
pad(31.8, 34.3, [65.41, 98.0, 130.81, 196.0], 0.05, fi=0.4, fo=0.1, bright=0.5)
# 34.3–37.9: arena em silêncio
fanfare(37.9, 0.12); drums(38.9, 46.8, 0.1, 120, half=True); pad(39.6, 46.8, [61.74, 92.5, 123.47], 0.05, trem=0.3)
arp(46.8, 55.0, [[130.81, 164.81, 196.0], [123.47, 146.83, 196.0]], 100, 0.03, decay=5)
# luta 1
drums(55.1, 69.6, 0.13, 132); ostinato(55.1, 69.6, R1, 0.07, 132)
for i in range(7): brass(55.1 + i * 2.0, [Cm, Ab, Bb, G2][i % 4], 1.6, 0.08)
pad(69.6, 81.3, [65.41, 69.3, 98.0], 0.06, fi=0.2, fo=0.3)
pad(81.3, 87.9, [65.41, 98.0], 0.05, fi=0.3, fo=0.1, trem=0.5)
drums(87.9, 95.4, 0.13, 144); ostinato(87.9, 95.4, R1, 0.065, 144)
pad(96.6, 103.2, [130.81, 164.81, 196.0, 261.63], 0.07, fi=0.4, fo=0.2, bright=0.6); fanfare(96.8, 0.09)
pad(103.2, 106.7, [65.41, 98.0, 130.81, 196.0], 0.06, fi=1.5, fo=0.05, bright=0.6); put(103.3, riser(3.4, 200, 3400), 0.08)
pad(109.2, 120.2, [130.81, 164.81, 196.0, 261.63], 0.05, fi=0.3, fo=0.8, bright=0.4); fanfare(109.3, 0.1)
# luta 2
pad(120.3, 133.1, [73.42, 77.78, 110.0], 0.06, fi=0.4, fo=0.3, trem=0.4); put(120.3, tom(50), 0.3)
drums(127.2, 133.1, 0.1, 110, half=True)
pad(133.1, 144.2, [73.42, 87.31, 110.0], 0.05, trem=0.6)
drums(144.2, 152.1, 0.14, 160); ostinato(144.2, 152.1, [73.42, 58.27, 65.41, 55.0], 0.07, 160)
pad(152.1, 156.5, [73.42, 77.78, 103.83], 0.06, fi=0.1, fo=0.4)
pad(156.5, 164.6, [146.83, 220.0, 293.66], 0.035, fi=1.2, fo=0.5, bright=0.2)
pad(164.6, 172.3, [146.83, 174.61, 220.0, 293.66], 0.045, fi=1.0, fo=0.05, bright=0.4)
pad(176.4, 186.6, [146.83, 185.0, 220.0, 293.66], 0.05, fi=0.2, fo=0.6, bright=0.5); fanfare(176.4, 0.1)
# luta 3
fanfare(186.7, 0.11); pad(189.4, 200.9, [61.74, 92.5, 123.47], 0.06, trem=0.3); drums(192.8, 200.9, 0.1, 120, half=True)
drums(200.9, 210.3, 0.15, 150); ostinato(200.9, 210.3, RV, 0.07, 150)
for i in range(5): brass(200.9 + i * 1.6, [Cm, Ab, Bb, G2][i % 4], 1.4, 0.09)
pad(210.3, 219.2, [61.74, 92.5, 123.47, 185.0], 0.06, fi=0.3, fo=0.2, bright=0.4)
pad(219.2, 229.6, [61.74, 65.41, 92.5], 0.06, fi=0.3, fo=0.3, trem=0.5)
pad(229.6, 239.3, [130.81, 164.81, 196.0, 261.63], 0.05, fi=3.0, fo=0.05, bright=0.5)
drums(239.3, 243.0, 0.15, 150)
for i in range(2): brass(239.3 + i * 1.8, [Cm, Bb][i], 1.6, 0.11)
pad(243.0, 249.6, [65.41, 98.0, 130.81, 196.0, 261.63], 0.07, fi=0.5, fo=0.02, bright=0.7); put(246.2, riser(3.4, 150, 4000), 0.1)
# 249.65–250.96: silêncio depois da maior explosão
fanfare(250.96, 0.13); drums(251.3, 257.0, 0.12, 120); pad(250.96, 265.0, [130.81, 164.81, 196.0, 261.63], 0.06, fi=0.2, fo=0.8, bright=0.5)
pad(265.0, 278.8, [130.81, 164.81, 196.0, 246.94], 0.04, fi=1.0, fo=0.5)
arp(278.8, end - 1.0, [[130.81, 164.81, 196.0], [174.61, 220.0, 261.63], [196.0, 246.94, 293.66], [130.81, 164.81, 196.0]], 110, 0.035, decay=4)
drums(278.8, end - 1.5, 0.09, 110, half=True)
out[:] = np.tanh(out / np.abs(out).max() * 1.6)
save("trilha.wav")

# ---------------- EFEITOS + PLATEIA ----------------
out[:] = 0
put(0.0, beam(8.7, 70), 0.3); put(0.0, beam(8.7, 92), 0.25); put(0.0, crackle(8.7, 40), 0.25); put(0.0, crowd_bed(8.7, 1.0), 0.25)
put(8.74, tone([1567.98, 2093.0], 0.8, 4), 0.15); put(13.6, riser(0.5, 600, 2400), 0.12); put(13.7, tone([880.0, 1318.5], 0.6, 5), 0.1)
put(18.9, rumble(3.0), 0.4); put(22.3, growl(1.6), 0.6); put(24.45, dash(0.3), 0.4); put(24.6, punch(1.6), 1.0); put(24.6, explosion(1.2, 0.5), 0.5); put(24.62, crackle(1.0, 40), 0.3)
put(28.4, fire(2.5), 0.5); put(28.4, riser(0.6, 100, 1200), 0.3); put(28.5, rumble(1.5), 0.5)
put(31.9, beam(2.4, 55), 0.15); put(31.9, riser(2.2, 300, 2400), 0.12); put(33.9, dash(0.5), 0.4)
put(34.3, beam(1.8, 41), 0.1); put(34.6, band(noise(3.2), 200, 900) * 0.3, 0.15)
put(37.9, cheer(3.5), 0.6)
for b in range(5): put(38.0 + b * 0.55, explosion(1.2, 0.3), 0.25); put(38.0 + b * 0.55, crackle(1.2, 30), 0.2)
put(39.6, growl(1.4), 0.4); put(39.6, fire(2.0), 0.3); put(43.7, zip_tp(), 0.7); put(43.75, zip_tp(), 0.5); put(44.4, growl(1.4), 0.6); put(44.0, ooh(1.6), 0.4)
put(46.85, crowd_bed(196.0, 0.8) * np.clip((196.0 - np.arange(int(SR * 196.0)) / SR) / 0.6, 0, 1), 0.2)
# luta 1
put(55.3, dash(1.0), 0.5); put(56.6, stomp(1.8), 1.0); put(56.6, explosion(1.6, 0.8), 0.7); put(56.7, cheer(3.0), 0.5)
put(59.84, growl(1.8), 0.8); put(62.6, growl(1.0), 0.4)
for t0 in (64.3, 64.55, 64.8, 65.05): put(t0 - 0.05, jab(), 0.8); put(t0, whiff(), 0.4)
for t0 in (66.7, 67.35): put(t0 - 0.1, whiff(), 0.8); put(t0, ooh(0.8), 0.2)
put(68.6, clang(), 1.0); put(69.6, slowmo(), 0.5); put(70.3, dash(0.2), 0.5); put(70.45, punch(1.9), 1.0); put(70.45, ooh(1.6), 0.5)
put(70.5, dash(1.6), 0.5); put(72.1, explosion(1.4, 0.6), 0.8); put(72.1, thunk(), 0.6); put(72.15, stomp(1.0), 0.6); put(72.8, laugh(2.4), 0.5)
put(82.6, slowmo(), 0.5)
for i in range(4): put(82.6 + i * 0.9, heartbeat(), 0.6)
for t0 in (84.6, 86.6): put(t0 - 0.1, whiff(), 0.9); put(t0, ooh(0.9), 0.2)
put(88.7, stomp(1.2), 0.9); put(88.7, explosion(0.8, 0.3), 0.4); put(89.85, whiff(), 0.8)
for i in range(6): put(90.7 + i * 0.42, whiff(), 0.6)
put(93.4, growl(1.8), 0.8); put(93.4, riser(1.9, 120, 1600), 0.15); put(95.3, dash(0.6), 0.6)
put(95.45, stomp(2.0), 1.0); put(95.45, explosion(2.4, 1.0), 0.9); put(95.5, cheer(3.0), 0.5)
put(96.8, riser(0.5, 400, 3000), 0.4); put(96.8, explosion(1.2, 0.4), 0.4); put(96.9, fire(6.0), 0.25); put(97.0, cheer(4.0), 0.6)
put(103.3, charge(3.4), 0.9); put(103.3, crackle(3.4, 30), 0.3)
put(106.75, beam(2.0, 110), 0.9); put(106.75, laser(0.4), 0.5); put(107.0, punch(1.9), 1.0); put(107.0, explosion(3.0, 1.3), 1.0); put(107.05, slowmo(), 0.3)
put(109.2, cheer(5.0), 0.8); put(110.0, thud(0.5), 0.4)
# luta 2
put(120.3, fire(4.0), 0.6); put(120.3, rumble(3.0), 0.6); put(121.0, growl(2.0), 0.7)
put(129.0, growl(2.2), 0.9); put(130.0, rumble(1.5), 0.6); put(130.0, fire(2.0), 0.4)
put(136.9, laugh(1.2), 0.2); put(141.2, crackle(3.0, 25), 0.3); put(141.4, fire(3.0), 0.2)
put(144.4, dash(0.5), 0.6)
for i, h in enumerate([145.0, 145.6, 146.2, 146.8, 147.4, 148.0, 148.6, 149.2]): put(h, punch(1.2 + 0.1 * (i % 3)), 0.9); put(h, rumble(0.4), 0.3)
put(150.0, punch(1.6), 0.9); put(150.0, dash(0.8), 0.5); put(150.8, thud(0.7), 0.6); put(150.2, ooh(1.4), 0.4)
put(152.1, growl(1.2), 0.5); put(152.3, laugh(2.8), 0.5)
put(156.6, slowmo(), 0.5)
for i in range(4): put(156.8 + i * 1.0, heartbeat(), 0.7)
for t0 in (161.4, 162.6): put(t0, stomp(1.5), 0.9); put(t0, rumble(0.6), 0.5)
put(165.0, fire(5.0) * np.linspace(1, 0, int(SR * 5.0)), 0.4); put(165.0, band(noise(5.0), 2000, 9000) * np.linspace(0.2, 1, int(SR * 5.0)) * np.linspace(1, 0, int(SR * 5.0)), 0.15)
put(166.0, creak(2.0), 0.4); put(168.2, crackle(1.2, 50), 0.4); put(168.2, creak(1.5), 0.5)
put(170.6, charge(1.3), 0.6); put(171.9, dash(0.45), 0.7); put(172.35, punch(1.9), 1.0); put(172.35, explosion(2.5, 1.0), 0.9); put(172.4, slowmo(), 0.4)
for i in range(6): put(173.2 + i * 0.22, thunk(), 0.4)
put(176.4, cheer(5.0), 0.8)
# luta 3
put(186.7, cheer(3.0), 0.5)
for b in range(5): put(187.0 + b * 0.55, explosion(1.2, 0.3), 0.25)
put(191.0, fire(2.5), 0.5); put(191.0, growl(1.5), 0.6); put(192.9, riser(2.3, 100, 1800), 0.2); put(192.9, fire(2.4), 0.3)
put(195.2, stomp(2.0), 1.0); put(195.2, explosion(2.0, 0.9), 0.8); put(195.3, ooh(1.8), 0.4)
put(200.95, dash(0.65), 0.7); put(201.6, punch(2.0), 1.0); put(201.6, explosion(1.8, 0.9), 0.7); put(201.6, crackle(1.0, 50), 0.5); put(201.65, slowmo(), 0.3)
put(202.6, whiff(), 0.7); put(202.85, zip_tp(), 0.9); put(203.25, punch(1.5), 1.0); put(203.85, clang(), 0.9); put(204.2, punch(1.6), 1.0)
put(204.5, dash(0.6), 0.6); put(205.3, punch(1.4), 0.9); put(205.9, punch(1.4), 0.9); put(206.3, punch(1.8), 1.0); put(206.3, explosion(1.5, 0.8), 0.6); put(206.3, crackle(0.8, 60), 0.5)
put(206.6, dash(0.5), 0.5)
for h in (207.3, 208.3, 209.3): put(h, punch(1.7), 1.0); put(h, explosion(1.4, 0.7), 0.6); put(h, crackle(0.7, 60), 0.5)
put(209.4, dash(0.9), 0.6); put(210.3, stomp(1.8), 0.9); put(210.3, explosion(1.2, 0.6), 0.6)
put(210.4, charge(4.0), 0.7); put(210.4, charge(4.0) * 0.8, 0.5); put(210.4, fire(4.0), 0.25)
put(214.4, laser(0.6), 0.6); put(214.4, beam(28.6, 75), 0.35); put(214.4, beam(28.6, 98), 0.3); put(214.4, crackle(28.6, 25), 0.25)
put(215.0, explosion(1.6, 0.9), 0.8); put(215.0, punch(1.5), 0.7)
for i in range(6): put(223.0 + i * 1.0, heartbeat(), 0.7)
put(229.8, cheer(6.0), 0.4); put(231.5, cheer(5.0), 0.5); put(233.0, ooh(2.0), 0.3)
put(237.2, slowmo(), 0.3); put(238.6, riser(0.7, 300, 3000), 0.4)
put(239.3, explosion(1.5, 0.7), 0.7); put(239.3, fire(3.7), 0.4); put(239.4, cheer(4.0), 0.6)
put(243.0, explosion(3.0, 1.2), 1.0); put(243.0, punch(1.8), 0.8)
put(244.0, dash(1.5), 0.6); put(244.0, riser(3.6, 200, 3500), 0.25); put(246.2, beam(1.8, 140), 0.2)
put(248.0, dash(1.6), 0.8); put(248.0, riser(1.6, 400, 5000), 0.4); put(248.55, laser(1.0), 0.6)
put(249.65, punch(2.2), 1.0); put(249.65, explosion(1.25, 1.8) * np.linspace(1, 0, int(SR * 1.25)) ** 0.5, 1.2); put(249.7, tinnitus(1.3), 0.25)
put(250.96, cheer(6.0), 1.0)
for b in range(5): put(251.3 + b * 0.55, explosion(1.2, 0.3), 0.3); put(251.3 + b * 0.55, crackle(1.2, 30), 0.2)
put(254.0, cheer(4.0), 0.6); put(250.96, crowd_bed(44.0, 1.0), 0.25)
put(268.6, thunk(), 0.4); put(270.0, ooh(1.4), 0.2); put(276.6, riser(0.4, 800, 2400), 0.15)
for b in range(4): put(279.0 + b * 3, explosion(1.2, 0.3), 0.2)
put(284.5, punch(0.5), 0.25)
out[:] = np.tanh(out / np.abs(out).max() * 2.4)
save("sfx.wav")
