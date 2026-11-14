"""Trilha do SHORT TELA CINZA: brilho e plim de notificação no colorido, tudo abafa no cinza."""
import sys
sys.path.insert(0, "../_lib")
from som import *

end = TL["duration"]
put(0.3, boom(1.6, 90, 45, 3.0), 0.5); put(0.3, tone([1046.5, 1567.98], 0.8, 5), 0.10)
pad(0.2, S(2), [65.41] + C, 0.07, fi=0.3, fo=0.3)
beat(0.4, S(2), 110, 0.16)
put(S(2) + 0.3, sweep(1.6, 1500, 200), 0.10)                    # wipe to grey
# colour: bright, busy
pad(S(3), S(5), [65.41] + Cmaj7, 0.07, fi=0.2, fo=0.2, bright=0.4)
arp(S(3), S(5), [C, G, Am, F], 132, 0.05, decay=9)
beat(S(3), S(5), 132, 0.16)
for k in range(6):
    put(S(4) + 0.2 + k * 0.45, tone([1567.98, 2093.0], 0.25, 12), 0.10)     # notification pings
put(S(4) + 3.6, whoosh(0.8), 0.15)
# grey: muffled
put(S(5) - 0.1, sweep(1.0, 1500, 150), 0.10)
pad(S(5), S(9), [55.0, 82.41, 110.0], 0.06, fi=0.3, fo=0.4)
beat(S(6), S(7), 70, 0.15, fn=lambda: kick(90, 40, 0.5))
put(S(6) + 1.7, thud(0.8), 0.25)                                 # phone down
for a in [S(7) + 1.0, S(7) + 2.6, S(7) + 3.4]:
    put(a, tone([2400], 0.03, 150), 0.06)                        # taps
put(S(7) + 4.0, tone([1318.5, 1760.0], 0.3, 10), 0.08)          # toggle
for i in range(7):
    put(S(8) + 0.3 + i * 0.18, pluck([261.63, 293.66, 329.63, 349.23, 392.0, 440.0, 523.25][i] * 2, decay=10), 0.08)
pad(S(9), end, [65.41] + C, 0.08, fi=0.5, fo=1.0)
arp(S(9), end - 1, [C, F, G, C], 100, 0.04)
put(S(10) - 0.1, tone([523.25, 659.25, 783.99], 2.0, 1.5), 0.12)
save()
