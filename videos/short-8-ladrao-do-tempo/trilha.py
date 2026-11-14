"""Trilha do SHORT O LADRÃO DO TEMPO: tique-taque constante (o tempo indo embora), pizzicato do ladrão,
moedas tilintando a cada roubo, virada clara quando o tempo volta."""
import sys
sys.path.insert(0, "../_lib")
from som import *

end = TL["duration"]
grabs = [S(3), S(3) + (E(3) - S(3)) * 0.38, S(3) + (E(3) - S(3)) * 0.68]
put(0.2, boom(1.8, 70, 36, 2.6), 0.45)
pad(0.2, S(11) - 0.2, [55.0, 82.41, 110.0], 0.065, fi=0.4, fo=0.4)
for i in range(int((S(9) - 0.4) / 0.5)):                           # clock tick
    put(0.4 + i * 0.5, tone([2200 if i % 2 else 1700], 0.03, 160), 0.05)
walk = [110.0, 130.81, 146.83, 155.56, 164.81, 155.56, 146.83, 130.81]
tt, k = 0.6, 0
while tt < S(6) - 0.2:
    put(tt, pluck(walk[k % 8], dur=0.3, decay=14), 0.09); tt += 0.36; k += 1
put(1.6, sweep(0.4, 1200, 300), 0.08)                              # strike
put(2.6, boom(1.4, 90, 45, 3.0), 0.4)
def coins(a, n=1):
    for j in range(n):
        put(a + j * 0.06, tone([2637.0, 3135.96], 0.25, 18), 0.07)
for a in grabs:
    coins(a + 0.6, 2)
for j in range(9):
    coins(S(4) + j * 0.25)
put(S(5) + 2.4, boom(2.0, 60, 32, 2.0), 0.5)
# year
for i in range(20):
    put(S(6) + 1.6 + i * 0.1, tone([311.13], 0.06, 40), 0.04)
put(S(6) + 3.4, boom(1.8, 55, 30, 2.0), 0.45)
for a in [S(7) + 1.0, S(7) + 2.8, S(7) + 4.2]:
    put(a, whoosh(0.4), 0.10)
put(S(8) + 1.0, tone([523.25, 622.25], 0.6, 5), 0.07)
# the fix
pad(S(9) - 0.2, end, [65.41] + C, 0.08, fi=0.4, fo=1.0)
beat(S(9), E(12), 104, 0.16)
arp(S(9), E(12) + 0.3, [C, G, Am, F], 104, 0.04)
for i in range(4):
    put(S(9) + 1.0 + i * 0.2, tone([1318.5], 0.05, 60), 0.05)
put(E(10) - 1.5, thud(0.9), 0.3); put(E(10) - 1.45, tone([196.0, 185.0], 0.4, 6), 0.08)
for i in range(8):
    put(S(11) + 0.9 + i * 0.25, tone([1567.98, 2093.0], 0.3, 12), 0.06)
put(S(11) + 0.4, tone([523.25, 659.25, 783.99, 1046.5], 2.2, 1.6), 0.12)
for i in range(2):
    put(S(12) + 0.6 + i * 0.4, pluck(392.0 * (1 + i * 0.25), decay=10), 0.08)
save()
