"""Trilha do TUTORIAL: groove leve e positivo por baixo da explicação, som de 'passo' a cada etapa,
cliques de digitação, pausa mais séria na monetização e subida no CTA."""
import sys
sys.path.insert(0, "../_lib")
from som import *

end = TL["duration"]
# intro hook
put(0.3, boom(1.8, 90, 45, 3.0), 0.5); put(0.4, tone([1046.5, 1567.98], 0.9, 4), 0.10)
for i in range(8):
    put(0.2 + i * 0.15, pluck([261.63, 329.63, 392.0, 523.25, 392.0, 523.25, 659.25, 783.99][i] * 2, decay=10), 0.06)
pad(0.3, S(5) - 0.6, [65.41] + C, 0.07, fi=0.6, fo=0.4)
put(S(2) + 1.6, boom(1.4, 90, 45, 3.2), 0.4)
# steps: steady groove
pad(S(5) - 0.4, S(29) - 0.6, [65.41, 98.0, 130.81], 0.05, fi=0.8, fo=0.6)
beat(S(5) - 0.4, S(29) - 0.8, 96, 0.13)
arp(S(5) - 0.4, S(29) - 0.8, [C, G, Am, F], 96, 0.025, bar=2.5, decay=8)
for i in range(int((S(29) - S(5)) / 0.625)):                     # soft hats
    put(S(5) - 0.4 + i * 0.625 + 0.3125, hat(), 0.03)
for sid in [5, 9, 11, 14, 17, 23, 24, 26]:                         # step change
    put(S(sid) - 0.75, whoosh(0.45), 0.12)
    put(S(sid) - 0.25, tone([1318.5, 1975.5], 0.35, 10), 0.07)
def typing(a, b, rate=9):
    k = 0
    while a + k / rate < b:
        put(a + k / rate + (hash_ := (k * 0.37) % 0.04), noise(0.025, smooth=2, decay=150), 0.05); k += 1
typing(S(8) + 0.3, S(8) + 2.6)
typing(S(15), E(15))
typing(S(16) + 3.6, E(16))
typing(S(25), S(25) + 1.0)
typing(S(27) + 0.3, S(27) + 2.4)
for a in [S(8) + 3.0, S(16) - 0.4, S(23) + 3.4, S(23) + 7.4]:     # reply pops
    put(a, tone([880.0, 1318.5], 0.25, 12), 0.07)
put(S(10) + 2.4, tone([1046.5, 1318.5, 1567.98], 0.8, 4), 0.09)   # connected
put(S(13) + 0.3, tone([1567.98, 2093.0], 0.5, 6), 0.08)
for a in [S(18), S(19), S(20), S(21)]:
    put(a, pluck(523.25), 0.08)
put(S(27) + 3.6, tone([1318.5, 1760.0], 0.3, 10), 0.08)
# money: more serious
pad(S(29) - 0.4, S(35) - 0.6, [55.0, 82.41, 110.0], 0.07, fi=0.6, fo=0.4)
beat(S(29), S(35) - 0.8, 84, 0.16, fn=lambda: kick(100, 44, 0.45))
for a in [S(29) + 3.0, S(29) + 4.6, S(29) + 7.2, S(31) + 3.6]:
    put(a, tone([1046.5, 1318.5], 0.4, 8), 0.08)
for i in range(3):
    put(S(32) + 0.3 + i * 1.0, tone([311.13, 293.66], 0.4, 7), 0.07)
put(S(34) + 2.2, boom(1.4, 90, 45, 3.2), 0.35)
# recap + CTA: bright
pad(S(35) - 0.4, end, [65.41] + C + [261.63], 0.08, fi=0.4, fo=2.0)
arp(S(35), E(39) + 0.8, [C, F, G, C], 112, 0.04)
beat(S(35), E(39) + 0.6, 112, 0.16)
for a in [S(35) + 1.0, S(35) + 2.5, S(35) + 4.0, S(35) + 6.0, S(38) + 1.2, S(38) + 1.9, S(38) + 3.0]:
    put(a, tone([1318.5, 1975.5], 0.3, 10), 0.07)
put(S(36) + 3.0, boom(1.6, 85, 42, 2.8), 0.4)
put(E(39) + 0.8, tone([523.25, 659.25, 783.99, 1046.5], 3.0, 1.2), 0.13)
save()
