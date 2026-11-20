"""Trilha de OS LADRÕES T2 EP2 · O LADRÃO DA CORAGEM: tema de heist, sussurro e risadas, contagem 3-2-1, virada."""
import sys
sys.path.insert(0, "../_lib")
from som import *
end = TL["duration"]
walk = [110.0, 130.81, 146.83, 155.56, 164.81, 155.56, 146.83, 130.81]
pad(0.0, S(6) - 0.2, [55.0, 82.41, 110.0], 0.07, fi=0.3, fo=0.4)
tt, k = 0.3, 0
while tt < S(6) - 0.3:
    put(tt, pluck(walk[k % 8], dur=0.3, decay=14), 0.07); tt += 0.36; k += 1
put(S(1) + 2.2, whoosh(0.6), 0.08)
put(S(2) + 2.6, tone([523.25, 659.25], 0.4, 6), 0.07)
put(S(3) + 0.6, noise(1.2, smooth=8, decay=3), 0.06)
for i in range(5):
    put(S(3) + 3.4 + i * 0.25, thud(0.3), 0.12)
put(S(4) + 0.2, tone([196.0, 185.0], 0.9, 3), 0.08)
put(S(5) + 4.4, tone([783.99, 1046.5], 0.5, 5), 0.08)
pad(S(6) - 0.2, end, [65.41] + C, 0.07, fi=0.5, fo=1.0, bright=0.2)
for a in [S(7) + 1.4, S(7) + 2.0, S(7) + 2.6]:
    put(a, tone([1046.5], 0.12, 20), 0.1)
put(S(7) + 3.4, whoosh(0.5), 0.09)
arp(S(7) + 3.4, S(9) - 0.2, [C, G, Am, F], 104, 0.04)
beat(S(7) + 3.4, S(9) - 0.3, 104, 0.12)
put(S(8) + 1.4, tone([1046.5, 1318.5, 1567.98], 0.8, 4), 0.08)
put(S(9), boom(2.4, 50, 26, 1.6), 0.5)
pad(S(9), end, [55.0, 58.27, 82.41], 0.06, fi=0.3, fo=1.0)
save()
