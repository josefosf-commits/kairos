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
while t0 < S(17) - 0.3:
    put(t0, pluck(bass[(k // 4) % 4], dur=0.6, decay=5), 0.11); t0 += 0.5; k += 1
pad(0.2, S(17) - 0.3, [55.0, 65.41, 77.78], 0.05, fi=1.0, fo=0.4)
beat(S(3), S(17) - 0.3, 60, 0.05, fn=hat)
for i, sid in enumerate([3, 5, 7]): put(S(sid), tone([523.25 + 60 * i], 0.3, 8), 0.06)
for i in range(6): put(S(7) + 5.4 + i * 0.7, noise(0.25, smooth=4, decay=10), 0.05)   # crowd chant hits
put(S(9) + 2.0, sweep(1.2, 200, 900), 0.06); put(S(9) + 3.2, boom(2.0, 70, 36, 2.0), 0.4); put(S(10), tone([196.0, 233.08, 293.66], 2.5, 1.2), 0.10)
for sid in [11, 13, 15]:
    put(S(sid), tone([1567.98, 1318.5], 0.4, 7), 0.08); put(S(sid), thud(0.5), 0.2)
pad(S(17) - 0.2, S(18) - 0.2, [55.0, 58.27, 82.41], 0.06, fi=0.5, fo=0.3)
g0 = E(17) + 0.2
for i in range(5):
    put(g0 + i * 1.0, tone([1046.5], 0.08, 30), 0.10); put(g0 + i * 1.0, thud(0.3), 0.15)
put(S(18) - 0.1, boom(2.4, 55, 28, 1.6), 0.5)
for i in range(int((S(21) - S(18)) / 0.25)):
    put(S(18) + i * 0.25, tone([2093.0], 0.03, 70), 0.02 + 0.03 * i / 70)
put(S(20) + 4.4, boom(2.4, 55, 28, 1.6), 0.6); put(S(20) + 4.4, tone([146.83, 174.61, 207.65], 2.0, 1.4), 0.10)
put(S(22) + 1.6, tone([2637.0, 3135.96, 3520.0], 0.8, 4), 0.07); put(S(22) + 2.2, boom(2.4, 50, 26, 1.4), 0.6)
pad(S(23) - 0.2, S(24) - 0.3, [55.0, 65.41, 82.41], 0.05, fi=0.6, fo=0.4)
pad(S(24) - 0.3, end, [55.0, 82.41, 110.0, 130.81], 0.07, fi=0.6, fo=1.5)
arp(S(24), end - 0.8, [[110.0, 130.81, 164.81], [98.0, 116.54, 146.83]], 70, 0.035, decay=3.0)
put(S(25), boom(2.0, 60, 30, 2.0), 0.45)
save()
