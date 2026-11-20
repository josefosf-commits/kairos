"""Trilha de JOSEPH, O CALCULISTA · CASO 4 (sem ruído de fundo): ondas curtas, contrabaixo noir, passos,
lápis no caderno, contagem de 5 s e golpe na revelação."""
import sys
sys.path.insert(0, "../../../videos/_lib")
from som import *
end = TL["duration"]
bass = [55.0, 65.41, 61.74, 58.27]
def walk(a, b, g=0.10):
    t0, k = a, 0
    while t0 < b:
        put(t0, pluck(bass[(k // 4) % 4], dur=0.6, decay=5), g); t0 += 0.5; k += 1
def tick(a): put(a, tone([1567.98, 1318.5], 0.4, 7), 0.08); put(a, thud(0.5), 0.2)
put(0.3, noise(2.0, smooth=30, decay=1.5), 0.05)                                                     # one wave
put(3.4, boom(2.4, 55, 28, 1.6), 0.5)
walk(0.3, S(14) - 0.3); pad(0.2, S(14) - 0.3, [55.0, 65.41, 77.78], 0.05, fi=1.0, fo=0.4)
beat(S(4), S(14) - 0.3, 60, 0.05, fn=hat)
for i, sid in enumerate([4, 5, 6]): put(S(sid), tone([523.25 + 60 * i], 0.3, 8), 0.06)
for i in range(6): put(S(7) + 2.4 + i * 0.45, thud(0.2), 0.18)                                      # Joseph's steps
put(S(8), tone([196.0, 233.08, 293.66], 2.5, 1.2), 0.10); put(S(8), boom(2.0, 70, 36, 2.0), 0.35)
for sid in [9, 11, 13]: tick(S(sid))
put(S(10) + 0.2, boom(1.4, 70, 36, 2.0), 0.3)
pad(S(14) - 0.2, S(15) - 0.2, [55.0, 58.27, 82.41], 0.06, fi=0.5, fo=0.3)
g0 = E(14) + 0.2
for i in range(5): put(g0 + i, tone([1046.5], 0.08, 30), 0.10); put(g0 + i, thud(0.3), 0.15)
put(S(15) - 0.1, boom(2.4, 55, 28, 1.6), 0.5)
for a, d in [(S(15) + 1.0, 2.6), (S(15) + 5.0, 2.0), (S(16) + 0.2, 1.6), (S(16) + 2.6, 1.8), (S(17) - 0.6, 3.0)]:
    n = int(d / 0.09)
    for i in range(n): put(a + i * 0.09, noise(0.05, smooth=2, decay=40), 0.03)                     # pencil scratch
walk(S(15), S(19) - 0.3, 0.08)
for i in range(int((S(19) - S(17)) / 0.25)): put(S(17) + i * 0.25, tone([2093.0], 0.03, 70), 0.02 + 0.03 * i / 28)
put(S(19) + 0.3, boom(2.6, 50, 26, 1.4), 0.6); put(S(19) + 0.3, tone([146.83, 174.61, 207.65], 2.0, 1.4), 0.10)
put(S(20) + 1.6, tone([2637.0, 3135.96], 0.6, 4), 0.06)
pad(S(21) - 0.2, S(22) - 0.3, [55.0, 65.41, 82.41], 0.05, fi=0.6, fo=0.4)
pad(S(22) - 0.3, end, [55.0, 82.41, 110.0, 130.81], 0.07, fi=0.6, fo=1.5)
arp(S(22), end - 0.8, [[110.0, 130.81, 164.81], [98.0, 116.54, 146.83]], 70, 0.035, decay=3.0)
put(S(23), boom(2.0, 60, 30, 2.0), 0.45)
save()
