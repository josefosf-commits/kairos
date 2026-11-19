"""Trilha de OS LADRÕES T2 EP1 · O LADRÃO DO DEPOIS: tema de heist, carimbos, pilha caindo, virada com o timer."""
import sys
sys.path.insert(0, "../_lib")
from som import *
end = TL["duration"]
walk = [110.0, 130.81, 146.83, 155.56, 164.81, 155.56, 146.83, 130.81]
pad(0.0, S(6) - 0.2, [55.0, 82.41, 110.0], 0.07, fi=0.3, fo=0.4)
tt, k = 0.3, 0
while tt < S(6) - 0.3:
    put(tt, pluck(walk[k % 8], dur=0.3, decay=14), 0.07); tt += 0.36; k += 1
beat(S(1) + 1.0, S(5) - 0.2, 83, 0.10, fn=lambda: kick(90, 40, 0.4))
put(S(2) + 1.6, whoosh(0.5), 0.08); put(S(2) + 2.0, tone([392.0, 466.16], 0.6, 5), 0.08)
for a in [S(3) + 1.3, S(3) + 3.4, S(3) + 5.6]:
    put(a, thud(0.8), 0.3)
for i in range(6):
    put(S(4) - 0.1 + i * 0.5, thud(0.5), 0.18)
put(S(5) + 2.0, boom(2.4, 60, 30, 1.6), 0.6); put(S(5) + 2.0, noise(0.8, smooth=8, decay=5), 0.12)
pad(S(6) - 0.2, end, [65.41] + C, 0.07, fi=0.5, fo=1.0, bright=0.2)
arp(S(7), S(9) - 0.2, [C, G, Am, F], 104, 0.04)
beat(S(7), S(9) - 0.3, 104, 0.12)
for i in range(10):
    put(S(7) + 0.3 + i * 0.5, tone([2093.0], 0.03, 70), 0.025)
put(S(8) + 2.0, tone([1046.5, 1318.5, 1567.98], 0.8, 4), 0.08)
put(S(9), boom(2.4, 50, 26, 1.6), 0.5)
pad(S(9), end, [55.0, 58.27, 82.41], 0.06, fi=0.3, fo=1.0)
save()
