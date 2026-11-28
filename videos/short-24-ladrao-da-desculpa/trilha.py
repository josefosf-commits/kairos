"""Trilha de OS LADRÕES T2 EP4 · O LADRÃO DA DESCULPA: voz sombria, desculpas, virada com AINDA, treino, chefe."""
import sys
sys.path.insert(0, "../_lib")
from som import *
end = TL["duration"]
walk = [110.0, 130.81, 146.83, 155.56, 164.81, 155.56, 146.83, 130.81]
pad(0.0, S(7) - 0.2, [55.0, 82.41, 110.0], 0.07, fi=0.3, fo=0.4)
tt, k = S(2), 0
while tt < S(6) - 0.3:
    put(tt, pluck(walk[k % 8], dur=0.3, decay=14), 0.07); tt += 0.36; k += 1
put(S(1) + 3.0, sweep(1.2, 200, 600), 0.05)
put(S(3) + 1.6, tone([196.0, 185.0], 0.9, 3), 0.07)
put(S(4) + 1.4, whoosh(0.6), 0.08)
for a in [S(5), S(5) + 1.3, S(5) + 2.6]:
    put(a, thud(0.5), 0.15)
put(S(6) + 5.6, boom(2.2, 80, 40, 1.8), 0.4); put(S(6) + 5.6, tone([523.25, 659.25, 783.99], 1.5, 2), 0.08)
pad(S(7) - 0.2, S(10) - 0.2, [65.41] + C, 0.07, fi=0.5, fo=0.6, bright=0.25)
arp(S(7) + 1.0, S(10) - 0.2, [C, G, Am, F], 108, 0.04)
beat(S(8), S(10) - 0.3, 108, 0.12)
for i in range(4):
    put(S(8) + 0.4 + i * 0.83, thud(0.4), 0.12)
put(S(9) + 2.0, tone([1046.5, 1318.5, 1567.98], 0.9, 4), 0.09)
put(S(10), boom(2.8, 45, 24, 1.4), 0.55)
pad(S(10), end, [49.0, 51.91, 73.42], 0.07, fi=0.3, fo=1.0)
save()
