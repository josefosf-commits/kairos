"""Trilha de JOSEPH, O CALCULISTA · CASO 1: noir de suspense (contrabaixo, chuva, trovão), pistas com 'tique',
a conta em crescendo e o golpe final no '= MENTIU'."""
import sys
sys.path.insert(0, "../../../videos/_lib")
from som import *
end = TL["duration"]
def rainbed(a, b, g):
    x = noise(b - a, smooth=5); n = len(x); e = np.clip(np.minimum(np.arange(n) / SR / 1.5, (n - np.arange(n)) / SR / 1.5), 0, 1); put(a, x * e, g)
rainbed(0, end, 0.035)
for a in [0.6, 3.1, 16.0, 36.0]:
    put(a + 0.15, boom(3.0, 45, 24, 1.0), 0.45); put(a + 0.1, noise(1.2, smooth=20, decay=3), 0.12)   # thunder
bass = [55.0, 65.41, 61.74, 58.27]
t0, k = 0.3, 0
while t0 < S(11) - 0.3:
    put(t0, pluck(bass[(k // 4) % 4], dur=0.6, decay=5), 0.11); t0 += 0.5; k += 1                    # walking bass
pad(0.2, S(11) - 0.3, [55.0, 65.41, 77.78], 0.05, fi=1.0, fo=0.4)
beat(S(2), S(11) - 0.3, 60, 0.05, fn=hat)
put(S(4) + 2.0, sweep(1.4, 200, 900), 0.06); put(S(4) + 3.4, boom(2.0, 70, 36, 2.0), 0.4)          # Joseph enters
put(S(5), tone([196.0, 233.08, 293.66], 2.5, 1.2), 0.10)                                             # title chord
for sid in [6, 7, 8]:
    put(S(sid), tone([1567.98, 1318.5], 0.4, 7), 0.08); put(S(sid), thud(0.5), 0.2)                # clue ticks
for i, a in enumerate([S(10), S(10) + 1.6, S(10) + 3.4]):
    put(a, tone([392.0 if i < 2 else 233.08], 0.5, 5), 0.08)
# the calculation: ticking clock crescendo
for i in range(int((S(12) - S(11)) / 0.25)):
    put(S(11) + i * 0.25, tone([2093.0], 0.03, 70), 0.02 + 0.03 * i / 30)
riser = noise(S(12) - S(11) - 0.5, smooth=6) * np.linspace(0, 1, int(SR * (S(12) - S(11) - 0.5))) ** 2
put(S(11) + 0.5, riser, 0.10)
put(S(11) + 6.4, boom(2.4, 55, 28, 1.6), 0.6); put(S(11) + 6.4, tone([146.83, 174.61, 207.65], 2.0, 1.4), 0.10)
put(S(12) + 2.4, tone([2637.0, 3135.96, 3520.0], 0.8, 4), 0.07)                                     # necklace sparkle
pad(S(13) - 0.3, end, [55.0, 82.41, 110.0, 130.81], 0.07, fi=0.6, fo=1.5)
arp(S(13), end - 0.8, [[110.0, 130.81, 164.81], [98.0, 116.54, 146.83]], 70, 0.035, decay=3.0)
put(S(14), boom(2.0, 60, 30, 2.0), 0.45)
save()
