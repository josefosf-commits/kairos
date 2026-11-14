"""Trilha do curta 1% POR DIA: um pulso de relógio (os dias), a música cresce
com os juros compostos, efeitos das técnicas e dos votos de identidade."""
import sys
sys.path.insert(0, "../_lib")
from som import *

end = S(35) - 1.2
# intro: two equal rooms, soft and neutral
pad(0.3, S(5), [65.41, 98.0, 130.81], 0.07, fi=2.0, fo=0.6)
for k in range(int((S(9) - 1.0) / 1.0)):                     # day clock
    put(1.0 + k * 1.0, tone([1900 if k % 2 else 2400], 0.04, 120), 0.04)
pad(S(5) - 0.3, S(10) - 0.4, [65.41] + C, 0.07, fi=0.6, fo=0.4)
arp(S(5), S(10) - 0.4, [C, G, Am, F], 92, 0.035, bar=2.6, decay=6)
for a in [S(9), S(15), S(31)]:                                 # day jumps
    put(a - 0.8, sweep(1.0, 300, 1400), 0.08)
    put(a - 0.2, tone([1046.5, 1318.5, 1567.98], 1.2, 3), 0.08)
# expectation vs reality + compound interest
pad(S(10) - 0.4, E(14) + 1.6, [55.0, 82.41, 110.0], 0.06, fi=0.6, fo=0.6)
put(S(10) + 3.0, boom(1.2, 80, 45, 3.5), 0.3)
riser = noise(E(13) - S(12), smooth=6) * np.linspace(0, 1, int(SR * (E(13) - S(12)))) ** 2
put(S(12), riser, 0.10)
put(S(13), tone([523.25, 659.25, 783.99, 1046.5], 2.0, 1.5), 0.12)
put(S(14), tone([220.0, 207.65], 1.5, 2.0), 0.08)
# day 100: contrast
pad(S(15) - 0.3, E(18) + 1.0, [65.41] + Cmaj7, 0.07, fi=0.6, fo=0.6, bright=0.2)
for i in range(3):
    put(S(16) + 0.8 + i * 1.2, tone([1318.5, 1760.0], 0.3, 12), 0.06)
    put(S(17) + 0.8 + i * 1.3, tone([311.13, 293.66], 0.5, 6), 0.05)
# techniques: steady groove, builds
pad(S(19) - 0.4, E(27) + 1.6, [65.41, 98.0, 130.81], 0.05, fi=0.6, fo=0.4)
beat(S(20) - 0.2, E(27) + 1.4, 96, 0.17)
t = S(20) - 0.2
while t < E(27) + 1.4:
    put(t + 60 / 96 / 2, hat(), 0.05); t += 60 / 96
arp(S(20), E(27) + 1.4, [C, G, Am, F], 96, 0.03, bar=2.5, decay=6)
for a in [S(20), S(22), S(24), S(26)]:
    put(a - 0.2, boom(1.2, 90, 50, 4.0), 0.28); put(a - 0.2, tone([523.25, 783.99], 0.6, 6), 0.08)
for k in range(14):                                            # the chain
    put(S(21) + 0.1 + k * 0.22, tone([880 + k * 30], 0.15, 18), 0.04)
put(S(27) + 1.0, tone([233.08, 220.0], 0.6, 5), 0.06)
put(S(27) + 3.6, boom(0.9, 70, 40, 4.0), 0.25)
# identity + votes
pad(S(28) - 0.3, E(30) + 1.6, Fmaj7, 0.07, fi=0.6, fo=0.6, bright=0.2)
put(S(29) + 1.6, noise(0.3, smooth=3, decay=12), 0.2)
put(S(29) + 2.4, tone([783.99, 987.77, 1174.66], 1.4, 2), 0.08)
for d in [0.6, 1.4, 3.2, 4.0, 4.8]:
    put(S(30) + d + 0.75, tone([1567.98, 2093.0], 0.25, 14), 0.08)
# day 365: emotional swell
pad(S(31) - 0.8, S(34) - 0.6, [65.41] + Cmaj7 + [329.63], 0.11, fi=1.5, fo=0.8, bright=0.4)
arp(S(32), S(34) - 0.6, [Cmaj7, G, Am, Fmaj7], 84, 0.035, bar=3.0, decay=4)
# recap
prog = [Cmaj7, G, Am, Fmaj7]
for i in range(int((end - S(34)) / 3.0) + 1):
    a = S(34) - 0.6 + i * 3.0
    pad(a, min(a + 3.2, end), [prog[i % 4][0] / 2] + prog[i % 4], 0.07, fi=0.3, fo=0.3, bright=0.3)
beat(S(34), end - 0.4, 100, 0.13)
for k in [1.0, 2.6, 4.4, 5.8]:
    put(S(34) + k, tone([783.99, 1046.5, 1318.5], 0.9, 4), 0.09)
# ending
pad(end, E(36) + 2.0, [87.31, 130.81, 174.61], 0.05, fi=0.8, fo=0.6)
put(S(36), boom(1.4, 90, 45, 3.0), 0.35)
put(E(36) + 2.4, boom(), 0.5)
pad(E(36) + 2.4, TL["duration"], [65.41] + C, 0.07, fi=0.4, fo=1.4)
save()
