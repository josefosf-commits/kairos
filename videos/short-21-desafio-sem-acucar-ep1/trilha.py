"""Trilha de DESAFIO 30 DIAS T2 EP1 · SEM AÇÚCAR: manhã leve, tensão da vontade, dia 2 pesado, festa e cliffhanger."""
import sys
sys.path.insert(0, "../_lib")
from som import *
end = TL["duration"]
pad(0.0, S(4) - 0.2, [65.41] + C, 0.06, fi=0.4, fo=0.4, bright=0.3)
arp(0.3, S(4) - 0.3, [C, G, Am, F], 96, 0.035)
for a in [S(2) + 2.2, S(2) + 3.2, S(2) + 4.2]:
    put(a, tone([784.0, 1046.5], 0.25, 8), 0.06)
put(S(3) + 2.2, tone([196.0, 185.0], 0.8, 3), 0.08)
pad(S(4) - 0.2, S(6) - 0.3, [55.0, 82.41, 110.0], 0.07, fi=0.3, fo=0.4)
beat(S(4), S(5) + 2.0, 110, 0.08, fn=lambda: kick(90, 40, 0.4))
put(S(5) + 3.8, tone([523.25, 659.25, 783.99], 0.6, 5), 0.07)
pad(S(6) - 0.3, S(7) - 0.3, [49.0, 73.42, 98.0], 0.08, fi=0.3, fo=0.4)
for i in range(6):
    put(S(6) + i * 0.9, thud(0.5), 0.12)
put(S(6) + 3.2, whoosh(0.6), 0.08)
arp(S(7) - 0.3, S(9) - 0.2, [C, F, G, C], 120, 0.04)
beat(S(7), S(9) - 0.3, 120, 0.1)
pad(S(9) - 0.2, end, [55.0, 58.27, 82.41], 0.07, fi=0.3, fo=1.0)
put(S(10) - 0.1, boom(2.4, 50, 26, 1.6), 0.5)
save()
