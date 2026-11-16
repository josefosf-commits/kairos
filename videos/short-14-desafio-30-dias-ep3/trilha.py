"""Trilha do DESAFIO 30 DIAS · EP 3: continua o toque do EP 2, resolve no carinho da mãe,
fica tensa na armadilha das notificações, alivia no "parou", cresce até a metade e termina no convite do Lucas."""
import sys
sys.path.insert(0, "../_lib")
from som import *

end = TL["duration"]
# ringing (continuity with EP 2)
pad(0.0, S(2) - 0.2, [55.0, 58.27, 82.41], 0.07, fi=0.1, fo=0.4)
ring = 0.1
while ring < S(1) + 3.0:
    for j in range(2):
        put(ring + j * 0.18, tone([1318.5, 1567.98], 0.15, 18), 0.09)
    ring += 1.1
put(S(1) + 3.0, tone([523.25, 659.25, 783.99], 2.0, 1.4), 0.10)          # it's mom
# the call: warm
pad(S(2) - 0.2, S(4) + 1.6, [65.41] + Cmaj7, 0.08, fi=0.5, fo=0.4, bright=0.25)
arp(S(2) - 0.2, S(4) + 1.6, [C, Am, F, G], 92, 0.04)
put(S(2) + 0.3, tone([1046.5, 1318.5, 1567.98], 0.8, 4), 0.07)
put(S(3) + 2.0, tone([1567.98, 2093.0], 0.6, 5), 0.07)
# the trap: notifications
put(S(4) + 1.6, boom(2.0, 60, 32, 2.0), 0.45)
pad(S(4) + 1.6, S(7), [55.0, 58.27, 82.41], 0.08, fi=0.3, fo=0.2)
beat(S(4) + 1.6, S(7), 120, 0.18, fn=lambda: kick(80, 38, 0.5))
for i in range(12):
    put(S(5) + 0.6 + i * 0.17, tone([1567.98 + (i % 3) * 200], 0.08, 30), 0.05)   # pings
riser = noise(E(6) - S(6), smooth=6) * np.linspace(0, 1, int(SR * (E(6) - S(6)))) ** 2
put(S(6), riser, 0.12)
# stop
put(S(7), boom(1.6, 90, 45, 3.0), 0.5)
put(S(7) + 1.0, tone([1318.5, 1975.5], 0.35, 10), 0.07)
put(S(7) + 2.2, tone([392.0, 370.0], 0.4, 6), 0.08)
# morning back + days
pad(S(7) + 0.4, S(10) - 0.3, [65.41] + C, 0.08, fi=0.6, fo=0.3, bright=0.25)
arp(S(8) - 0.2, S(10) - 0.4, [C, G, Am, F], 100, 0.04)
beat(S(8) + 1.6, S(10) - 0.4, 100, 0.13)
put(S(8), thud(0.6), 0.25)
for a in [S(9) - 0.3, S(9) + 1.3]:
    put(a, tone([1318.5, 1975.5], 0.35, 10), 0.07); put(a, whoosh(0.3), 0.06)
put(S(9) + 2.7, tone([523.25, 659.25, 783.99, 1046.5], 1.6, 2.0), 0.12)
# Lucas: tension
put(S(10) - 0.3, thud(0.8), 0.3); put(S(10) - 0.1, thud(0.8), 0.3)       # knock knock
pad(S(10) - 0.3, end, [55.0, 58.27, 82.41], 0.08, fi=0.5, fo=1.0)
put(S(10) + 3.0, boom(2.4, 60, 32, 1.8), 0.5)
put(S(11) - 0.1, boom(2.4, 50, 26, 1.6), 0.5)
save()
