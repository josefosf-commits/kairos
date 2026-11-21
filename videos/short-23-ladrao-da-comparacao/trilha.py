"""Trilha de OS LADRÕES T2 EP3 · O LADRÃO DA COMPARAÇÃO: tema de heist, feed, régua quebrando, virada."""
import sys
sys.path.insert(0, "../_lib")
from som import *
end = TL["duration"]
walk = [110.0, 130.81, 146.83, 155.56, 164.81, 155.56, 146.83, 130.81]
pad(0.0, S(8) - 0.2, [55.0, 82.41, 110.0], 0.07, fi=0.3, fo=0.4)
tt, k = S(2), 0
while tt < S(8) - 0.3:
    put(tt, pluck(walk[k % 8], dur=0.3, decay=14), 0.07); tt += 0.36; k += 1
put(S(1) + 2.4, tone([523.25, 659.25], 0.4, 6), 0.06)
put(S(2) + 1.4, whoosh(0.7), 0.09)
for a in [S(4) + 1.6, S(4) + 2.8, S(4) + 4.0]:
    put(a, tone([1318.5, 1760.0], 0.15, 20), 0.05)
put(S(5), sweep(2.0, 400, 120), 0.05)
for a in [S(7) - 0.1, S(7) + 1.6]:
    put(a, thud(0.6), 0.2)
put(S(8) + 0.8, noise(0.3, smooth=2, decay=15), 0.25)
pad(S(8) - 0.2, end, [65.41] + C, 0.07, fi=0.5, fo=1.0, bright=0.2)
arp(S(8) + 2.6, S(10) - 0.2, [C, G, Am, F], 104, 0.04)
beat(S(8) + 2.6, S(10) - 0.3, 104, 0.12)
put(S(9) + 1.5, tone([1046.5, 1318.5, 1567.98], 0.8, 4), 0.08)
put(S(10), boom(2.4, 50, 26, 1.6), 0.5)
pad(S(10), end, [55.0, 58.27, 82.41], 0.06, fi=0.3, fo=1.0)
save()
