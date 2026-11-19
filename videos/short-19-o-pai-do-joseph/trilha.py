"""Trilha de O PAI DO JOSEPH (trailer de RECOMEÇA.): piano maduro, tensão no médico, alívio e convite."""
import sys
sys.path.insert(0, "../_lib")
from som import *
end = TL["duration"]
pad(0.1, S(2) - 0.2, [55.0] + Am, 0.06, fi=0.6, fo=0.3)
arp(0.2, S(2) - 0.2, [Am, F, C, G], 76, 0.035, decay=3.2)
pad(S(2) - 0.2, S(4) - 0.2, [55.0, 58.27, 82.41], 0.07, fi=0.3, fo=0.3)
beat(S(2), S(4) - 0.3, 62, 0.24, fn=lambda: kick(80, 38, 0.5))
put(S(3), tone([233.08, 246.94], 0.8, 3), 0.06)
pad(S(4) - 0.2, end, [65.41] + C, 0.07, fi=0.6, fo=1.0, bright=0.2)
arp(S(4), end - 0.5, [C, G, Am, F], 92, 0.04, decay=3.2)
beat(S(5), S(7) - 0.3, 92, 0.09)
put(S(6) + 3.4, boom(2.2, 85, 42, 2.0), 0.45)
put(S(6) + 3.4, tone([261.63, 329.63, 392.0, 523.25], 3.0, 1.0), 0.11)
put(S(7), whoosh(0.5), 0.08); put(S(7) + 0.8, tone([1567.98, 2093.0], 0.5, 6), 0.07)
save()
