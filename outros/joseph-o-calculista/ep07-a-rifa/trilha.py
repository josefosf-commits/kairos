"""Trilha dos casos curtos 6 e 7 (sem ruído de fundo): contrabaixo noir, tiques nas pistas, lápis,
contagem de 3 s e golpe na revelação. Mesma estrutura de falas nos dois episódios."""
import sys
sys.path.insert(0, "../../../videos/_lib")
from som import *
end = TL["duration"]
bass = [55.0, 65.41, 61.74, 58.27]
t0, k = 0.3, 0
while t0 < S(9) - 0.2:
    put(t0, pluck(bass[(k // 4) % 4], dur=0.6, decay=5), 0.11); t0 += 0.5; k += 1
pad(0.2, S(9) - 0.2, [55.0, 65.41, 77.78], 0.05, fi=0.8, fo=0.4)
beat(S(3), S(9) - 0.2, 60, 0.05, fn=hat)
put(2.6, boom(2.0, 60, 30, 2.0), 0.45)
for i, sid in enumerate([3, 4, 5]): put(S(sid), tone([523.25 + 60 * i], 0.3, 8), 0.06)
for sid in [6, 7, 8]: put(S(sid), tone([1567.98, 1318.5], 0.4, 7), 0.08); put(S(sid), thud(0.5), 0.2)
g0 = E(9) + 0.15
pad(S(9) - 0.2, S(10) - 0.2, [55.0, 58.27, 82.41], 0.06, fi=0.3, fo=0.3)
for i in range(3): put(g0 + i * 0.95, tone([1046.5], 0.08, 30), 0.10); put(g0 + i * 0.95, thud(0.3), 0.15)
for i in range(int((S(11) - S(10)) / 0.09)): put(S(10) + i * 0.09, noise(0.05, smooth=2, decay=40), 0.025)
put(S(11) + 0.1, boom(2.4, 55, 28, 1.6), 0.6); put(S(11) + 0.1, tone([146.83, 174.61, 207.65], 2.0, 1.4), 0.10)
pad(S(12) - 0.2, end, [55.0, 82.41, 110.0, 130.81], 0.07, fi=0.5, fo=1.0)
arp(S(12), end - 0.5, [[110.0, 130.81, 164.81], [98.0, 116.54, 146.83]], 70, 0.035, decay=3.0)
put(S(12) + 3.0, boom(2.0, 60, 30, 2.0), 0.45)
save()
