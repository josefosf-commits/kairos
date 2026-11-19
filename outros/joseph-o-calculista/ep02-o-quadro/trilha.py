"""Trilha de JOSEPH, O CALCULISTA · CASO 2: noir de suspense (contrabaixo, chuva, trovão), apagão,
pistas com 'tique', contagem regressiva do palpite, a conta em crescendo e o golpe no '= MENTIU'."""
import sys
sys.path.insert(0, "../../../videos/_lib")
from som import *
end = TL["duration"]
def rainbed(a, b, g):
    x = noise(b - a, smooth=5); n = len(x); e = np.clip(np.minimum(np.arange(n) / SR / 1.5, (n - np.arange(n)) / SR / 1.5), 0, 1); put(a, x * e, g)
rainbed(0, end, 0.03)
for a in [0.5, 9.0, 43.6, 97.7]:
    put(a + 0.15, boom(3.0, 45, 24, 1.0), 0.42); put(a + 0.1, noise(1.2, smooth=20, decay=3), 0.12)   # thunder
put(3.0, boom(1.5, 90, 30, 3.0), 0.5)                                                                # blackout clunk
bass = [55.0, 65.41, 61.74, 58.27]
def walk(a, b, g=0.11):
    t0, k = a, 0
    while t0 < b:
        put(t0, pluck(bass[(k // 4) % 4], dur=0.6, decay=5), g); t0 += 0.5; k += 1
walk(0.3, S(15) - 0.3); walk(S(17), S(20) - 0.3)
pad(0.2, S(15) - 0.3, [55.0, 65.41, 77.78], 0.05, fi=1.0, fo=0.4)
beat(S(5), S(15) - 0.3, 60, 0.05, fn=hat)
put(S(9) + 2.0, sweep(1.4, 200, 900), 0.06); put(S(9) + 3.3, boom(2.0, 70, 36, 2.0), 0.4)            # Joseph enters
put(S(10), tone([196.0, 233.08, 293.66], 2.5, 1.2), 0.10)                                            # title chord
for sid in [11, 12, 13]:
    put(S(sid), tone([1567.98, 1318.5], 0.4, 7), 0.08); put(S(sid), thud(0.5), 0.2)               # clue ticks
for a in [S(13) + 4.0, S(14) + 3.6]:
    put(a, noise(0.25, smooth=3, decay=12), 0.10)                                                    # the cough
# the challenge: tense pad + countdown clock
pad(S(15) - 0.2, S(17) - 0.2, [55.0, 58.27, 82.41], 0.06, fi=0.5, fo=0.3)
g0 = E(16) + 0.2
for i in range(5):
    put(g0 + i * 1.1, tone([1046.5], 0.08, 30), 0.10); put(g0 + i * 1.1, thud(0.3), 0.15)
put(S(17) - 0.1, boom(2.4, 55, 28, 1.6), 0.5)                                                        # reveal hit
# the calculation: ticking crescendo
for i in range(int((S(20) - S(19)) / 0.25)):
    put(S(19) + i * 0.25, tone([2093.0], 0.03, 70), 0.02 + 0.03 * i / 22)
put(S(19) + 4.8, boom(2.4, 55, 28, 1.6), 0.6); put(S(19) + 4.8, tone([146.83, 174.61, 207.65], 2.0, 1.4), 0.10)
put(S(20) + 3.6, tone([2637.0, 3135.96, 3520.0], 0.8, 4), 0.07)                                      # canvas reveal
pad(S(21) - 0.2, S(22) - 0.3, [55.0, 65.41, 82.41], 0.05, fi=0.8, fo=0.5)                            # sad motive
pad(S(22) - 0.3, end, [55.0, 82.41, 110.0, 130.81], 0.07, fi=0.6, fo=1.5)
arp(S(22), end - 0.8, [[110.0, 130.81, 164.81], [98.0, 116.54, 146.83]], 70, 0.035, decay=3.0)
put(S(23), boom(2.0, 60, 30, 2.0), 0.45)
save()
