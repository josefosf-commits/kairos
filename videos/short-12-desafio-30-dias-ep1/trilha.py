"""Trilha do DESAFIO 30 DIAS · EP 1: começo decidido, silêncio estranho, manhã quente no café,
tensão crescente nos dias 2 e 3 (pulso de relógio), cliffhanger com subida e corte."""
import sys
sys.path.insert(0, "../_lib")
from som import *

end = TL["duration"]
put(0.05, boom(1.6, 90, 45, 3.0), 0.4)
pad(0.05, S(2), [65.41] + C, 0.07, fi=0.2, fo=0.4)
arp(0.3, S(2) - 0.2, [C, G], 96, 0.035)
for i in range(10):
    put(0.2 + i * 0.12, noise(0.02, smooth=2, decay=150), 0.04)          # writing
# day 1 morning
for i in range(int((S(3) - S(2)) * 6)):
    put(S(2) + i / 6, tone([2093.0 if i % 2 else 1760.0], 0.05, 40), 0.045)   # alarm
put(S(3), thud(1.0), 0.35); put(S(3) + 1.6, thud(0.8), 0.3)
pad(S(4) - 0.2, S(5), [110.0, 164.81], 0.04, fi=0.6, fo=0.4)                  # thin silence
put(S(5), tone([523.25, 659.25, 783.99], 2.0, 1.5), 0.10)
pad(S(5), S(6) - 0.3, [65.41] + Cmaj7, 0.08, fi=0.4, fo=0.3, bright=0.2)
arp(S(5), S(6) - 0.3, [C, F], 84, 0.035)
# days 2-3: tension
put(S(6) - 0.3, boom(1.4, 85, 42, 3.0), 0.35)
pad(S(6) - 0.3, S(10) + 3.6, [55.0, 58.27, 82.41], 0.08, fi=0.4, fo=0.2)
beat(S(6), S(8) - 0.3, 72, 0.14, fn=lambda: kick(90, 40, 0.4))
put(S(8) - 0.3, boom(1.6, 70, 36, 2.4), 0.45)
beat(S(8), S(10) + 3.5, 92, 0.18, fn=lambda: kick(90, 40, 0.4))
for i in range(int((S(10) - S(8)) * 3)):
    put(S(8) + i / 3, tone([2400 if i % 2 else 1800], 0.03, 150), 0.045)   # clock
riser = noise(3.4, smooth=6) * np.linspace(0, 1, int(SR * 3.4)) ** 2
put(S(10) + 0.2, riser, 0.12)
# cliffhanger
put(S(10) + 3.6, boom(3.0, 50, 26, 1.4), 0.6)
put(S(10) + 3.7, tone([311.13, 392.0, 466.16], 3.0, 1.0), 0.10)
pad(S(10) + 3.6, end, [55.0, 77.78], 0.06, fi=0.3, fo=1.0)
put(S(11), tone([1318.5, 1760.0], 0.4, 8), 0.08)
save()
