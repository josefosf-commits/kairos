"""Trilha do DESAFIO 30 DIAS · EP 5 (final): mistério, alerta do automático, solução, e a vitória no dia 30."""
import sys
sys.path.insert(0, "../_lib")
from som import *
end = TL["duration"]
pad(0.0, S(4) - 0.2, [55.0, 58.27, 82.41], 0.07, fi=0.2, fo=0.3)
for i in range(3):
    put(S(1) + 2.6 + i * 0.3, tone([880.0 - i * 60], 0.2, 10), 0.05)
put(S(2) + 1.0, sweep(0.8, 300, 900), 0.06); put(S(2) + 1.8, boom(1.6, 70, 36, 2.6), 0.4)
beat(S(3), S(4) - 0.2, 60, 0.22, fn=lambda: kick(80, 38, 0.5))
put(S(4), boom(2.0, 55, 28, 1.8), 0.5)
pad(S(5) - 0.2, S(7) - 0.2, [65.41] + C, 0.07, fi=0.4, fo=0.2, bright=0.2)
arp(S(5), S(7) - 0.3, [C, G, Am, F], 100, 0.04)
put(S(5) + 1.0, tone([1318.5, 1975.5], 0.35, 10), 0.07)
for a in [S(6) - 0.3, S(6) + 1.4]:
    put(a, tone([1318.5, 1975.5], 0.35, 10), 0.07); put(a, whoosh(0.3), 0.06)
put(S(7) - 0.2, boom(3.0, 85, 42, 1.4), 0.6)
put(S(7) - 0.2, tone([261.63, 329.63, 392.0, 523.25, 659.25, 783.99], 5.0, 0.6), 0.14)
pad(S(7), end, [65.41] + Cmaj7, 0.08, fi=0.5, fo=1.0, bright=0.3)
arp(S(8), end - 0.5, [C, F, G, C], 108, 0.04)
beat(S(8), end - 1.0, 108, 0.12)
put(S(9) + 2.8, boom(1.6, 90, 45, 3.0), 0.35)
save()
