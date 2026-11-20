"""Trilha de JOSEPH, O CALCULISTA · CASO 3 (sem ruído de fundo): apito, torcida curta, contrabaixo noir,
pistas com 'tique', contagem de 3 s do palpite e golpe no '= MENTIU'."""
import sys
sys.path.insert(0, "../../../videos/_lib")
from som import *
end = TL["duration"]
put(0.3, tone([2793.0, 2637.0], 0.6, 2), 0.06)                                                   # whistle
put(2.5, boom(2.0, 60, 30, 2.0), 0.45)                                                           # empty showcase hit
bass = [55.0, 65.41, 61.74, 58.27]
t0, k = 0.3, 0
while t0 < S(10) - 0.3:
    put(t0, pluck(bass[(k // 4) % 4], dur=0.6, decay=5), 0.11); t0 += 0.5; k += 1
pad(0.2, S(10) - 0.3, [55.0, 65.41, 77.78], 0.05, fi=1.0, fo=0.4)
beat(S(3), S(10) - 0.3, 60, 0.05, fn=hat)
for i, sid in enumerate([3, 4, 5]): put(S(sid), tone([523.25 + 60 * i], 0.3, 8), 0.06)
put(S(6), sweep(1.0, 200, 900), 0.06); put(S(6) + 1.0, boom(2.0, 70, 36, 2.0), 0.4); put(S(6) + 1.0, tone([196.0, 233.08, 293.66], 2.5, 1.2), 0.10)
for sid in [7, 8]:
    put(S(sid), tone([1567.98, 1318.5], 0.4, 7), 0.08); put(S(sid), thud(0.5), 0.2)
for i in range(int((S(10) - S(9)) / 0.25)):
    put(S(9) + i * 0.25, tone([2093.0], 0.03, 70), 0.02 + 0.03 * i / 24)
put(S(9) + 5.4, boom(2.4, 55, 28, 1.6), 0.6); put(S(9) + 5.4, tone([146.83, 174.61, 207.65], 2.0, 1.4), 0.10)
pad(S(10) - 0.2, S(11) - 0.2, [55.0, 58.27, 82.41], 0.06, fi=0.5, fo=0.3)
g0 = E(10) + 0.2
for i in range(3):
    put(g0 + i * 1.2, tone([1046.5], 0.08, 30), 0.10); put(g0 + i * 1.2, thud(0.3), 0.15)
put(S(11) - 0.1, boom(2.4, 55, 28, 1.6), 0.5)
put(S(12) + 2.0, tone([2637.0, 3135.96, 3520.0], 0.8, 4), 0.07); put(S(12) + 2.4, boom(2.0, 60, 30, 2.0), 0.45)
pad(S(13) - 0.3, end, [55.0, 82.41, 110.0, 130.81], 0.07, fi=0.6, fo=1.5)
arp(S(13), end - 0.8, [[110.0, 130.81, 164.81], [98.0, 116.54, 146.83]], 70, 0.035, decay=3.0)
put(S(14), boom(2.0, 60, 30, 2.0), 0.45)
save()
