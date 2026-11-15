"""Trilha de A QUADRILHA: tema de suspense de 'heist' (pizzicato + baixo), um som para cada ladrão,
revelação grave do chefe, virada heroica no plano e nas armadilhas, final quente."""
import sys
sys.path.insert(0, "../_lib")
from som import *

end = TL["duration"]
walk = [110.0, 130.81, 146.83, 155.56, 164.81, 155.56, 146.83, 130.81]
def heist(a, b, gain=0.08, step=0.36):
    tt, k = a, 0
    while tt < b:
        put(tt, pluck(walk[k % 8], dur=0.3, decay=14), gain); tt += step; k += 1
# intro
put(0.2, boom(2.0, 60, 32, 2.0), 0.5)
pad(0.2, S(4) - 0.6, [55.0, 82.41, 110.0], 0.07, fi=0.6, fo=0.5)
for i in range(5):
    put(0.3 + i * 0.35, tone([220.0 * (1 + i * 0.12)], 0.3, 8), 0.06)
for a in [S(2) + 0.6, S(2) + 2.0]:
    put(a, sweep(0.4, 1200, 300), 0.08)
for i in range(5):
    put(S(2) + 3.4 + i * 0.25, tone([1318.5, 1760.0], 0.3, 10), 0.06)
put(S(3) + 2.0, boom(2.4, 50, 28, 1.6), 0.5)
put(E(3) + 0.9, boom(2.2, 85, 42, 2.4), 0.55)                        # title hit
put(E(3) + 0.9, tone([261.63, 311.13, 392.0], 2.5, 1.4), 0.10)
# the day (heist groove)
pad(S(4) - 0.4, S(20) - 1.0, [55.0, 82.41, 110.0], 0.06, fi=0.8, fo=0.6)
heist(S(4) - 0.2, S(20) - 1.2)
beat(S(4) - 0.2, S(20) - 1.2, 83, 0.11, fn=lambda: kick(90, 40, 0.4))
for i in range(int(4.6 * 6)):
    put(S(4) + i / 6, tone([2093.0 if i % 2 else 1760.0], 0.05, 40), 0.05 * (i < 26))   # alarm
for a in [S(4) + 2.8, S(4) + 3.6, S(4) + 4.4]:
    put(a, thud(0.5), 0.2)
for a in [S(5) + 2.2, S(8) + 1.0, S(12) + 0.6, S(15) + 1.0, S(18) + 2.4]:     # thief name stingers
    put(a, tone([392.0, 466.16], 0.6, 5), 0.08); put(a, whoosh(0.4), 0.08)
for a in [S(8) + 0.2, S(9) + 0.5, S(9) + 2.5]:
    put(a + 0.2, tone([1567.98, 2093.0], 0.35, 9), 0.12)              # plim
for i in range(3):
    put(S(12) + 2.2 + i, tone([2637.0, 3135.96], 0.25, 18), 0.07)       # coins
put(S(13), sweep(1.0, 300, 1200), 0.08)
for i, a in enumerate([S(15) + 2.0, S(15) + 3.4, S(15) + 4.8]):
    put(a + 0.5, tone([2637.0, 3520.0], 0.5, 7), 0.06)
put(S(17), tone([1760.0], 0.1, 30), 0.06)
put(S(19), sweep(2.5, 200, 600), 0.06)
# the lair + boss
pad(S(20) - 0.8, S(25) - 0.6, [41.2, 55.0, 61.74], 0.09, fi=0.8, fo=0.4)
beat(S(20), S(22) - 0.2, 60, 0.3, fn=lambda: kick(80, 38, 0.6))          # heartbeat
put(S(22) - 0.2, boom(3.0, 50, 26, 1.2), 0.7)
put(S(22) - 0.2, tone([65.41, 77.78, 98.0], 3.5, 0.9), 0.12)
for a in [S(23) + 4.0, S(23) + 6.0, S(23) + 7.8]:
    put(a, tone([1046.5, 987.77], 0.3, 10), 0.08)                         # remote clicks
put(S(24) + 0.6, noise(1.0, smooth=30) * np.linspace(1, 0, SR), 0.10)    # door creak
# plan + traps: heroic
put(S(25) + 2.6, boom(1.6, 90, 45, 3.0), 0.4)
pad(S(25) - 0.4, S(31) - 0.8, [65.41] + C, 0.08, fi=0.6, fo=0.4)
beat(S(26), S(31) - 0.8, 100, 0.16)
arp(S(26), S(31) - 0.8, [C, G, Am, F], 100, 0.04)
for i in range(4):
    put(S(26) + 0.8 + i * 0.4, noise(0.05, smooth=3, decay=60), 0.06)      # writing
for sid in [27, 28, 29, 30]:
    put(S(sid) + 0.8, thud(1.0), 0.35); put(S(sid) + 0.85, tone([196.0, 185.0], 0.4, 6), 0.08)   # lock
    for j in range(2):
        put(S(sid) + 2.4 + j * 0.3, thud(0.4), 0.18)                        # toc toc
    put(S(sid) + 1.25, tone([1318.5, 1975.5], 0.3, 10), 0.06)
# results: warm resolution
pad(S(31) - 0.4, end, [65.41] + Cmaj7, 0.08, fi=0.6, fo=2.0, bright=0.2)
for i in range(6):
    put(S(31) + 0.5 + i * 0.8, thud(0.35), 0.12)
put(S(33), tone([523.25, 659.25, 783.99, 1046.5], 2.6, 1.3), 0.13)
arp(S(33), E(37) + 1.0, [C, F, G, C], 108, 0.04)
beat(S(33), E(37) + 1.0, 108, 0.14)
put(S(36) + 3.4, thud(1.0), 0.35)
put(S(37) + 1.6, tone([2093.0], 0.06, 40), 0.08)
put(E(37) + 1.5, boom(2.2, 85, 42, 2.4), 0.45)
put(E(37) + 1.5, tone([523.25, 659.25, 783.99, 1046.5], 3.0, 1.0), 0.12)
save()
