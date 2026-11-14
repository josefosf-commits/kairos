"""Trilha do SHORT COMO FAZEMOS ESTE CANAL: groove leve de 'making of', um som por etapa, subida no inscreva-se."""
import sys
sys.path.insert(0, "../_lib")
from som import *

end = TL["duration"]
put(0.3, thud(1.2), 0.45); put(0.35, tone([1046.5, 1567.98], 0.8, 5), 0.10)
pad(0.2, S(6), [65.41] + Cmaj7, 0.07, fi=0.4, fo=0.4, bright=0.2)
beat(S(2), S(6), 104, 0.16)
arp(S(2), S(6), [C, G, Am, F], 104, 0.035, decay=8)
for a in [S(2), S(3), S(4), S(5)]:                                  # step badges
    put(a, whoosh(0.35), 0.12); put(a + 0.05, tone([1318.5, 1975.5], 0.3, 12), 0.08)
for k in range(24):                                                 # typing
    put(S(2) + 0.7 + k * 0.17, noise(0.03, smooth=2, decay=120), 0.06)
for k in range(18):                                                 # code typing
    put(S(4) + 0.9 + k * 0.12, noise(0.03, smooth=2, decay=120), 0.05)
put(S(4) + 2.4, sweep(2.0, 300, 1500), 0.07)                        # colour wipe
put(E(5) - 1.4, thud(1.0), 0.35)                                    # stamp
# money + rule
put(S(6), boom(1.6, 85, 42, 2.8), 0.45)
pad(S(6), S(8), [55.0, 82.41, 110.0], 0.07, fi=0.3, fo=0.3)
beat(S(6), S(8), 90, 0.18, fn=lambda: kick(100, 44, 0.45))
for a in [S(6) + 2.6, S(6) + 4.3, S(7) + 0.4]:
    put(a, tone([1046.5, 1318.5], 0.4, 8), 0.09)
put(S(7) + 2.6, tone([311.13, 293.66], 0.5, 6), 0.08)
# library of videos + subscribe
pad(S(8), end, [65.41] + C + [261.63], 0.08, fi=0.3, fo=1.0)
arp(S(8), end - 1, [C, F, G, C], 116, 0.045)
beat(S(8), E(10), 116, 0.18)
for i in range(8):
    put(S(8) + 0.2 + i * 0.4, pluck([261.63, 293.66, 329.63, 392.0, 440.0, 523.25, 587.33, 659.25][i] * 2, decay=9), 0.07)
put(S(9), boom(1.4, 90, 45, 3.0), 0.35)
put(S(10) + 1.0, tone([2093.0], 0.08, 40), 0.10)                    # click
put(S(10) + 1.05, tone([523.25, 659.25, 783.99, 1046.5], 2.2, 1.6), 0.13)
save()
