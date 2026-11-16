"""Trilha de NINGUÉM VIU.: piano noturno e íntimo, queda na reprovação, construção no ano 2,
suspense na lista de aprovados e acorde grande no "Aprovado"."""
import sys
sys.path.insert(0, "../_lib")
from som import *

end = TL["duration"]
def piano(a, b, chords, bpm, gain, bar=2.0):
    arp(a, b, chords, bpm, gain, bar=bar, decay=3.2)
# night opening
pad(0.2, E(4) + 0.6, [55.0] + Am, 0.06, fi=1.5, fo=0.6)
piano(0.6, E(4) + 0.4, [Am, F, C, G], 72, 0.035)
for i in range(int(S(4) / 1.2)):
    put(0.3 + i * 1.2, tone([2093.0], 0.04, 60), 0.012)                       # clock tick
put(E(4) + 0.8, boom(2.6, 80, 40, 1.8), 0.5)
put(E(4) + 0.8, tone([220.0, 261.63, 329.63, 440.0], 3.5, 0.9), 0.10)      # title
# year 1: hopeful then drifting
pad(S(5) - 0.5, S(10) - 0.6, [65.41] + C, 0.06, fi=0.6, fo=0.6, bright=0.2)
piano(S(5) - 0.5, S(8) - 0.4, [C, G, Am, F], 96, 0.04)
beat(S(5) - 0.5, S(7) - 0.2, 96, 0.08)
put(S(6) + 1.8, tone([1567.98, 2093.0], 0.5, 6), 0.06)
for i in range(6):
    put(S(6) + 1.9 + i * 0.2, tone([2637.0], 0.08, 25), 0.03)              # likes
put(S(7), boom(1.2, 90, 45, 3.5), 0.25)
beat(S(8) - 0.4, S(9) - 0.5, 118, 0.08, fn=lambda: kick(100, 50, 0.3))    # party
piano(S(9) - 0.5, S(10) - 0.6, [Am, F], 70, 0.025)
# exam 1 + failure
pad(S(10) - 0.6, S(12) - 0.5, [55.0, 58.27, 82.41], 0.07, fi=0.4, fo=0.4)
beat(S(10) - 0.4, S(12) - 0.6, 66, 0.25, fn=lambda: kick(80, 38, 0.5))
put(S(11) + 1.6, sweep(1.0, 600, 150), 0.06)
put(S(12) + 0.4, boom(2.4, 55, 28, 1.4), 0.55)
put(S(13) - 0.2, tone([110.0, 116.54], 2.0, 1.2), 0.08)
pad(S(12), S(16) - 0.4, [55.0] + Am, 0.06, fi=0.8, fo=0.4)
piano(S(14), S(16) - 0.5, [Am, Em], 60, 0.025)
put(S(15), sweep(1.2, 140, 70), 0.10)
# method + year 2: building
put(S(16) + 2.4, boom(1.8, 90, 45, 2.6), 0.4)
put(S(16) + 2.4, tone([261.63, 329.63, 392.0], 2.0, 1.4), 0.09)
pad(S(17) - 0.6, S(25) - 0.4, [65.41] + C, 0.07, fi=0.8, fo=0.4, bright=0.2)
piano(S(17) - 0.6, S(25) - 0.4, [C, Em, F, G], 100, 0.04)
beat(S(18) - 0.3, S(25) - 0.4, 100, 0.11)
for sid in [18, 19, 20]:
    put(S(sid) - 0.3, boom(1.4, 90, 45, 3.0), 0.3); put(S(sid) - 0.3, whoosh(0.4), 0.06)
for i in range(12):
    put(S(19) + 3.4 + i * 0.5, tone([2093.0], 0.03, 70), 0.02)            # timer ticks
for a in [S(21) + 0.1, S(21) + 2.4]:
    put(a, tone([1318.5], 0.12, 20), 0.05)                                   # message pings
for i in range(14):
    put(S(23) + 0.5 + i * 0.3, noise(0.05, smooth=3, decay=60), 0.04)      # marker
for i in range(8):
    put(S(24) + i * 0.6, tone([523.25 * (1 + i * 0.06)], 0.25, 8), 0.04)   # rising scores
# nobody saw / 6am
pad(S(25) - 0.4, S(27) - 0.7, [65.41] + Cmaj7, 0.06, fi=0.6, fo=0.6, bright=0.2)
piano(S(25) - 0.4, S(27) - 0.7, [Cmaj7, Fmaj7], 80, 0.035)
# exam 2: calm confidence
pad(S(27) - 0.7, S(30) - 0.6, [65.41] + C, 0.07, fi=0.6, fo=0.4)
beat(S(27) - 0.5, S(29), 72, 0.18, fn=lambda: kick(80, 38, 0.5))
put(S(28) + 2.4, tone([1046.5, 1318.5, 1567.98], 1.0, 3), 0.08)
piano(S(29), S(30) - 0.6, [C, G], 80, 0.03)
# result: suspense, then APROVADO
pad(S(30) - 0.6, S(33) - 0.1, [55.0, 58.27, 82.41], 0.07, fi=0.3, fo=0.1)
beat(S(30) - 0.4, S(32) - 0.2, 80, 0.28, fn=lambda: kick(80, 38, 0.5))
riser = noise(S(32) - S(31), smooth=6) * np.linspace(0, 1, int(SR * (S(32) - S(31)))) ** 2
put(S(31), riser, 0.10)
put(S(32) - 0.2, tone([1567.98], 0.6, 4), 0.08)
put(S(33) - 0.1, boom(3.2, 85, 42, 1.4), 0.6)
put(S(33) - 0.1, tone([261.63, 329.63, 392.0, 523.25, 659.25, 783.99], 5.0, 0.6), 0.15)
pad(S(33), S(37) - 0.6, [65.41] + Cmaj7, 0.08, fi=1.0, fo=0.8, bright=0.3)
piano(S(34), S(37) - 0.6, [C, F, Am, G], 84, 0.04)
for i in range(10):
    put(S(35) + 1.0 + i * 0.25, tone([2637.0, 3135.96][i % 2:i % 2 + 1], 0.1, 20), 0.03)
put(S(36) + 1.6, boom(2.0, 80, 40, 2.4), 0.4)
# your year + recap + CTA
pad(S(37) - 0.6, end, [65.41] + C, 0.07, fi=1.0, fo=3.0, bright=0.2)
piano(S(37) - 0.6, end - 2.0, [Am, F, C, G], 92, 0.04)
beat(S(39) - 0.4, end - 3.0, 92, 0.10)
for a in [S(39) + 2.2, S(39) + 4.6, S(39) + 6.4]:
    put(a, tone([1046.5, 1318.5], 0.4, 8), 0.07)
put(S(40), boom(2.0, 85, 42, 2.4), 0.35)
put(S(41) + 1.0, tone([1567.98, 2093.0], 0.3, 10), 0.08)
save()
