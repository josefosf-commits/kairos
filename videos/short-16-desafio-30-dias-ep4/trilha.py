"""Trilha do DESAFIO 30 DIAS · EP 4: tentação do convite, alerta do "só hoje", firmeza, alegria com o Lucas
entrando no desafio, e tensão no dia 25 (o celular sumiu)."""
import sys
sys.path.insert(0, "../_lib")
from som import *

end = TL["duration"]
pad(0.0, S(2) - 0.2, [65.41] + C, 0.07, fi=0.3, fo=0.3, bright=0.2)
arp(0.1, S(2) - 0.2, [C, G, Am, F], 104, 0.035)
beat(0.1, S(2) - 0.3, 104, 0.10)
put(S(1) + 2.0, tone([1318.5, 1567.98], 0.4, 6), 0.07)          # campeonato
put(S(2), boom(2.0, 55, 28, 1.8), 0.5)                          # SÓ HOJE
pad(S(2), S(4) - 0.2, [55.0, 58.27, 82.41], 0.08, fi=0.2, fo=0.2)
for i, a in enumerate([S(3), S(3) + 1.6, S(3) + 2.9]):
    put(a, thud(0.5 + 0.3 * i), 0.25)
put(S(4), boom(1.4, 90, 45, 3.0), 0.35)
pad(S(4) - 0.2, S(6) - 0.3, [65.41] + Am, 0.06, fi=0.4, fo=0.3)
arp(S(4) + 1.0, S(6) - 0.4, [Am, F, C, G], 92, 0.03)
for i in range(4):
    put(S(5) + i * 0.18, tone([987.77 + i * 60], 0.1, 20), 0.04)  # laugh
for i in range(2):
    put(S(6) + 1.6 + i * 0.35, thud(0.9), 0.35)                   # knock
put(S(6) + 2.8, sweep(0.8, 300, 900), 0.06)                       # door
pad(S(6) + 2.8, S(9) - 0.3, [65.41] + Cmaj7, 0.08, fi=0.6, fo=0.3, bright=0.3)
arp(S(6) + 3.4, S(9) - 0.4, [C, G, Am, F], 100, 0.04)
beat(S(8) - 0.3, S(9) - 0.4, 100, 0.12)
put(S(8) + 2.6, tone([1046.5, 1318.5, 1567.98], 0.8, 4), 0.08)
put(S(9) - 0.3, boom(2.4, 60, 32, 1.8), 0.55)                     # day 25
pad(S(9) - 0.3, end, [55.0, 58.27, 82.41], 0.08, fi=0.2, fo=1.0)
riser = noise(E(9) - S(9) - 1.5, smooth=6) * np.linspace(0, 1, int(SR * (E(9) - S(9) - 1.5))) ** 2
put(S(9) + 1.5, riser, 0.12)
put(S(10) - 0.1, boom(2.4, 50, 26, 1.6), 0.5)
save()
