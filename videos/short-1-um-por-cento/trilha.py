"""Trilha do SHORT 1% POR DIA: pulso desde o 1º segundo, sobe no 37x, cai no 0,03, volta no final."""
import sys
sys.path.insert(0, "../_lib")
from som import *

end = TL["duration"]
put(0.2, boom(1.6, 90, 45, 3.0), 0.5)                      # hook hit
put(0.3, tone([1046.5, 1567.98], 0.8, 5), 0.10)
pad(0.2, S(5), [65.41] + C, 0.08, fi=0.4, fo=0.3)
beat(0.4, S(3), 100, 0.18)
for k in range(10):                                         # number roll ticks (37,8)
    put(S(3) + 3.0 + k * 0.25, tone([2400], 0.03, 150), 0.05)
put(S(3) + 1.2, whoosh(0.4), 0.15)
riser = noise(S(4) - S(3), smooth=6) * np.linspace(0, 1, int(SR * (S(4) - S(3)))) ** 2
put(S(3), riser, 0.10)
put(S(4), boom(2.0, 85, 42, 2.5), 0.6); put(S(4), tone([523.25, 659.25, 783.99, 1046.5], 2.2, 1.6), 0.14)
arp(S(4), S(5) - 0.2, [C, G], 128, 0.05)
# the other way: dark
put(S(5) - 0.1, sweep(0.6, 900, 200), 0.10)
pad(S(5), S(8), [55.0, 58.27, 82.41], 0.08, fi=0.3, fo=0.4)
beat(S(5), S(7), 70, 0.22, fn=lambda: kick(90, 40, 0.5))
for k in range(10):
    put(S(6) + 3.2 + k * 0.28, tone([600 - k * 30], 0.05, 80), 0.05)
put(S(7), boom(2.4, 60, 32, 1.8), 0.5)
# difference + days
pad(S(8), end, [65.41] + Cmaj7, 0.07, fi=0.5, fo=1.0, bright=0.2)
for a in [S(8) + 1.6, S(8) + 3.3, S(8) + 5.2]:
    put(a, tone([1318.5, 1760.0], 0.4, 9), 0.08); put(a, whoosh(0.3), 0.08)
beat(S(8), E(10), 96, 0.18)
arp(S(9), E(10), [C, G, Am, F], 96, 0.04)
put(S(9) + 2.6, sweep(0.5, 400, 2000), 0.10); put(S(9) + 2.9, boom(1.6, 90, 45, 3.0), 0.4)
put(E(10) + 0.6, tone([523.25, 659.25, 783.99], 2.0, 1.5), 0.12)
save()
