"""Trilha de DESAFIO 30 DIAS T2 EP2 · SEM AÇÚCAR: festa, virada leve, descobertas, rótulo, cliffhanger na cozinha escura."""
import sys
sys.path.insert(0, "../_lib")
from som import *
end = TL["duration"]
pad(0.0, S(4) - 0.3, [65.41] + C, 0.06, fi=0.3, fo=0.4, bright=0.3)
arp(0.2, S(4) - 0.3, [C, F, G, C], 120, 0.035)
put(S(1) + 4.3, tone([523.25, 659.25], 0.4, 6), 0.06)
put(S(2) + 0.2, noise(0.6, smooth=3, decay=6), 0.04)
put(S(3) + 0.6, tone([523.25, 659.25, 783.99], 0.6, 5), 0.07)
pad(S(4) - 0.3, S(9) - 0.3, [65.41] + C, 0.06, fi=0.5, fo=0.5, bright=0.2)
arp(S(4) - 0.3, S(9) - 0.3, [C, G, Am, F], 100, 0.04)
beat(S(5), S(9) - 0.3, 100, 0.08)
for i in range(5):
    put(S(4) + 2.4 + i * 0.12, tone([1567.98 + i * 200], 0.15, 20), 0.03)
put(S(7) + 1.0, tone([196.0, 185.0], 0.8, 3), 0.08)
put(S(8) + 2.0, tone([1046.5, 1318.5], 0.4, 6), 0.07)
put(S(9) + 3.4, boom(2.4, 60, 30, 1.8), 0.45)
pad(S(9) + 3.4, end, [55.0, 58.27, 82.41], 0.07, fi=0.3, fo=1.0)
save()
