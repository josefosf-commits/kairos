"""Trilha do SHORT O PILOTO AUTOMÁTICO: baixo grave do chefe, clique de botão em cada aperto,
tique-taque no 'só mais um', virada clara no 'decida antes', botões mortos, final heroico."""
import sys
sys.path.insert(0, "../_lib")
from som import *

end = TL["duration"]
put(0.05, boom(2.6, 55, 28, 1.4), 0.6); put(0.05, tone([65.41, 77.78, 98.0], 3.0, 1.0), 0.12)
pad(0.1, S(7) - 0.2, [41.2, 55.0, 61.74, 82.41], 0.08, fi=0.3, fo=0.4)
beat(0.4, S(7) - 0.2, 76, 0.16, fn=lambda: kick(80, 38, 0.5))
walk = [82.41, 98.0, 110.0, 103.83]
tt, k = 0.4, 0
while tt < S(7) - 0.2:
    put(tt, pluck(walk[k % 4], dur=0.35, decay=12), 0.08); tt += 0.395; k += 1
def click(a, g=0.1):
    put(a, tone([1046.5, 987.77], 0.12, 30), g); put(a, thud(0.4), 0.12)
for a in [S(3) + 2.4, S(3) + 3.2, S(3) + 4.0]:
    click(a); put(a + 0.05, tone([1760.0], 0.15, 25), 0.05)              # alarm stops
for i in range(6):
    put(S(3) + i * 0.15, tone([2093.0], 0.05, 40), 0.04)                 # alarm ring
click(S(4) + 2.2); put(S(4) + 3.0, tone([1567.98, 2093.0], 0.35, 9), 0.1)
for i in range(5):
    click(S(5) + 1.4 + i * 0.9)
for i in range(int((S(6) - S(5)) * 4)):
    put(S(5) + i * 0.25, tone([2400 if i % 2 else 1900], 0.03, 150), 0.04)
put(S(6), sweep(1.0, 600, 200), 0.08)
# decide before: bright
put(S(7), boom(1.6, 90, 45, 3.0), 0.45); put(S(7), tone([523.25, 659.25, 783.99], 1.8, 2.0), 0.12)
pad(S(7), end, [65.41] + C, 0.08, fi=0.3, fo=1.0)
beat(S(7), E(11), 104, 0.15)
arp(S(7), E(11) + 0.3, [C, G, Am, F], 104, 0.04)
for a in [S(7) + 2.2, S(8), S(8) + 3.0]:
    for i in range(10):
        put(a + 0.3 + i * 0.09, noise(0.02, smooth=2, decay=150), 0.04)    # typing
for i in range(6):
    put(S(9) + 0.6 + i * 0.33, tone([523.25], 0.05, 60), 0.05)            # dead clicks
put(S(9) + 1.6, tone([196.0, 185.0], 0.5, 6), 0.08)
put(S(10) + 2.6, tone([523.25, 659.25, 783.99, 1046.5], 2.2, 1.5), 0.12)
for i in range(3):
    put(S(11) + i * 0.4, tone([1318.5, 1760.0], 0.25, 12), 0.06)
save()
