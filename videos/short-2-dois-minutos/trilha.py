"""Trilha do SHORT REGRA DOS 2 MINUTOS: tensão na montanha, alívio quando ela encolhe, relógio no fim."""
import sys
sys.path.insert(0, "../_lib")
from som import *

end = TL["duration"]
put(0.5, thud(1.2), 0.5)                                    # stamp
put(2.0, whoosh(0.3), 0.2); put(2.4, boom(1.2, 90, 45, 3.5), 0.35)
pad(0.2, S(2), [55.0, 82.41], 0.06, fi=0.3, fo=0.3)
# mountain: low tension
pad(S(2), S(4), [55.0, 58.27, 82.41], 0.09, fi=1.0, fo=0.2)
put(S(2), boom(3.0, 50, 30, 1.2), 0.4)
beat(S(2) + 0.5, S(4) - 0.2, 66, 0.25, fn=lambda: kick(90, 40, 0.5))
put(S(3) + 1.4, tone([1318.5, 1760.0], 0.25, 14), 0.08)       # phone ping
# the rule: bright
put(S(4) + 1.6, boom(1.6, 90, 45, 3.0), 0.5); put(S(4) + 1.6, tone([523.25, 659.25, 783.99, 1046.5], 2.0, 1.8), 0.13)
pad(S(4) + 1.6, S(8), [65.41] + C, 0.08, fi=0.3, fo=0.4)
beat(S(5), S(8), 108, 0.18)
arp(S(5), S(8), [C, G, Am, F], 108, 0.04)
for a in [S(5) + 0.4, S(6) + 0.4]:
    put(a, sweep(0.4, 1200, 300), 0.08)                          # strike-through
for a in [S(5) + 1.6, S(6) + 1.6, S(6) + 2.2]:
    put(a, tone([1046.5, 1567.98], 0.4, 8), 0.08)
for k in range(int((E(7) - S(7)) * 4)):                          # countdown ticks
    put(S(7) + 0.3 + k * 0.25, tone([2000 if k % 2 else 2600], 0.03, 140), 0.05)
# the secret
pad(S(8), S(10), [65.41] + Cmaj7, 0.08, fi=0.4, fo=0.4, bright=0.2)
for a in [S(8) + 1.4, S(8) + 2.6, S(8) + 2.9, S(8) + 3.2]:
    put(a, pluck(523.25 if a == S(8) + 1.4 else 783.99), 0.10)
beat(S(9), S(10), 120, 0.2)
arp(S(9), S(10), [C, G], 120, 0.05)
# tomorrow-Joseph + now
pad(S(10), S(10) + 2.9, [55.0, 82.41], 0.06, fi=0.3, fo=0.2)
put(S(10) + 2.9, boom(1.8, 85, 42, 2.6), 0.55); put(S(10) + 3.9, boom(1.8, 85, 42, 2.6), 0.6)
for k in range(int(end - S(10) - 4.2)):
    put(S(10) + 4.2 + k, tone([2400], 0.04, 120), 0.06)
pad(S(10) + 3.9, end, [65.41] + C, 0.07, fi=0.2, fo=1.0)
save()
