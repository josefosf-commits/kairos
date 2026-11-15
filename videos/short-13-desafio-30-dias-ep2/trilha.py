"""Trilha do DESAFIO 30 DIAS · EP 2: abre no acorde do cliffhanger do EP 1 e resolve numa manhã luminosa,
cresce com os dias, e corta para o toque do telefone (tensão) no dia 10."""
import sys
sys.path.insert(0, "../_lib")
from som import *

end = TL["duration"]
put(0.05, tone([311.13, 392.0, 466.16], 1.6, 1.4), 0.08)          # EP1 cliff chord
put(0.3, sweep(1.4, 300, 1600), 0.10)
put(1.6, tone([523.25, 659.25, 783.99, 1046.5], 2.6, 1.2), 0.14)  # door opens -> morning
pad(1.4, S(9) - 0.3, [65.41] + Cmaj7, 0.08, fi=0.6, fo=0.3, bright=0.25)
arp(1.6, S(9) - 0.4, [C, G, Am, F], 100, 0.04)
beat(S(4) - 0.3, S(9) - 0.4, 100, 0.14)
for a in [S(4) - 0.3, S(4) + 2.6, S(6) - 0.3, S(8) - 0.3, S(8) + 1.4]:    # day changes
    put(a, tone([1318.5, 1975.5], 0.35, 10), 0.07); put(a, whoosh(0.3), 0.06)
put(S(2) + 0.6, tone([1046.5, 1318.5, 1567.98], 0.8, 4), 0.08)
for i in range(4):
    put(S(4) + 1.6 + i * 0.12, noise(0.04, smooth=4, decay=60), 0.05)   # page flips
put(S(5) + 2.4, tone([1567.98, 2093.0], 0.6, 5), 0.08)                  # star at crossing
put(S(6) - 0.3, boom(1.4, 90, 45, 3.0), 0.35)
for i in range(3):
    put(S(7) + 0.6 + i * 0.7, thud(0.6), 0.2)                             # tug
# day 10: ringing phone
put(S(9) - 0.3, boom(2.4, 60, 32, 1.8), 0.55)
pad(S(9) - 0.3, end, [55.0, 58.27, 82.41], 0.08, fi=0.2, fo=1.0)
ring = 0.0
while S(9) + ring < S(11) - 0.2:
    for j in range(2):
        put(S(9) + ring + j * 0.18, tone([1318.5, 1567.98], 0.15, 18), 0.09)
    ring += 1.1
riser = noise(E(10) - S(10), smooth=6) * np.linspace(0, 1, int(SR * (E(10) - S(10)))) ** 2
put(S(10), riser, 0.12)
put(S(11) - 0.1, boom(2.4, 50, 26, 1.6), 0.5)
save()
