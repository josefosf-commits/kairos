"""Trilha de A MÃE DO JOSEPH: piano íntimo de madrugada que esquenta até o nascer do sol."""
import sys
sys.path.insert(0, "../_lib")
from som import *

end = TL["duration"]
pad(0.1, S(4) - 0.2, [55.0] + Am, 0.06, fi=0.5, fo=0.4)
arp(0.2, S(4) - 0.2, [Am, F, C, G], 84, 0.035, decay=3.5)
for a in [S(1) + 2.4, S(1) + 3.6, S(1) + 4.6]:
    put(a, tone([1318.5], 0.2, 12), 0.05)
put(S(1) + 4.6, tone([233.08, 246.94], 1.0, 2), 0.06)
for i in range(3):
    put(S(2) + 2.4 + i * 0.9, noise(0.08, smooth=4, decay=40), 0.05)     # pages
put(S(3) + 3.8, boom(1.8, 85, 42, 2.4), 0.4)
put(S(3) + 3.8, tone([261.63, 329.63, 392.0], 2.0, 1.4), 0.09)
for i in range(4):
    put(S(4) - 0.2 + i * 0.12, tone([1760.0], 0.08, 25), 0.06)            # alarm
pad(S(4) - 0.2, end, [65.41] + C, 0.07, fi=1.2, fo=1.0, bright=0.2)
arp(S(4), S(9) - 0.3, [C, G, Am, F], 96, 0.04)
beat(S(5) + 2.2, S(9) - 0.3, 96, 0.11)
put(S(5) + 2.3, boom(1.4, 90, 45, 3.0), 0.35)
for i in range(5):
    put(S(6) + i * 0.44, noise(0.05, smooth=3, decay=60), 0.04)
put(S(7) - 0.1, tone([523.25, 659.25, 783.99, 1046.5], 2.0, 1.6), 0.10)
put(S(8) + 2.2, whoosh(0.4), 0.06)
put(S(8) + 3.6, tone([1567.98, 2093.0], 0.5, 6), 0.07)
put(S(9) + 1.6, boom(2.0, 85, 42, 2.4), 0.45)
arp(S(9), end - 0.5, [Cmaj7, Fmaj7], 80, 0.03)
save()
