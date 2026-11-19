"""Trilha do CASO ESPECIAL 1 (O Homem que Sumiu do Elevador): noir com chuva, contrabaixo, ding de elevador,
duas contagens de palpite, crescendo nas contas e golpe na revelação."""
import sys
sys.path.insert(0, "../../../videos/_lib")
from som import *
end = TL["duration"]
def rainbed(a, b, g):
    x = noise(b - a, smooth=5); n = len(x); e = np.clip(np.minimum(np.arange(n) / SR / 1.5, (n - np.arange(n)) / SR / 1.5), 0, 1); put(a, x * e, g)
rainbed(0, end, 0.028)
for a in [0.5, 59.5, 113.6, 185.4, 219.6, 284.3]:
    put(a + 0.15, boom(3.0, 45, 24, 1.0), 0.40); put(a + 0.1, noise(1.2, smooth=20, decay=3), 0.11)
bass = [55.0, 65.41, 61.74, 58.27]
def walk(a, b, g=0.10):
    t0, k = a, 0
    while t0 < b:
        put(t0, pluck(bass[(k // 4) % 4], dur=0.6, decay=5), g); t0 += 0.5; k += 1
def ding(a, g=0.09): put(a, tone([1318.5, 1046.5], 0.9, 3), g)
# hook
pad(0.2, S(5), [55.0, 58.27, 82.41], 0.05, fi=1.0, fo=0.5)
ding(S(2) + 2.2); ding(S(4) - 0.3)
put(S(4) + 0.4, boom(2.4, 55, 28, 1.6), 0.55)
put(E(7) + 0.3, tone([196.0, 233.08, 293.66], 3.0, 1.0), 0.10); put(E(7) + 0.3, boom(2.0, 60, 30, 2.0), 0.4)   # title
walk(S(8), S(28) - 0.3); pad(S(8), S(28) - 0.3, [55.0, 65.41, 77.78], 0.045, fi=1.0, fo=0.4)
beat(S(14), S(28) - 0.3, 60, 0.045, fn=hat)
for i in range(4): put(S(15 + i), tone([523.25 + 60 * i], 0.3, 8), 0.06)
put(S(19) + 1.8, sweep(1.4, 200, 900), 0.06); put(S(19) + 3.2, boom(2.0, 70, 36, 2.0), 0.4)
put(S(20), tone([196.0, 233.08, 293.66], 2.5, 1.2), 0.10)
for sid in [25, 26, 39, 41, 43]:
    put(S(sid), tone([1567.98, 1318.5], 0.4, 7), 0.08); put(S(sid), thud(0.5), 0.2)
for i in range(int((E(24) - S(21)) / 0.25)):
    put(S(21) + i * 0.25, tone([2093.0], 0.03, 70), 0.015 + 0.02 * i / 60)
def pause(a, b, g0):
    pad(a, b, [55.0, 58.27, 82.41], 0.06, fi=0.5, fo=0.3)
    for i in range(5): put(g0 + i * 1.1, tone([1046.5], 0.08, 30), 0.10); put(g0 + i * 1.1, thud(0.3), 0.15)
pause(S(28) - 0.2, S(31) - 0.2, E(30) + 0.2)
put(S(31) - 0.2, boom(2.0, 60, 30, 2.0), 0.4)
for i in range(6): put(S(31) + 0.3 + i * 0.45 + (0.9 if i > 2 else 0), thud(0.25), 0.25)                  # knocks
walk(S(31), S(46) - 0.3, 0.09); pad(S(31), S(46) - 0.3, [55.0, 65.41, 77.78], 0.045, fi=1.0, fo=0.4)
put(S(37), sweep(0.6, 900, 200), 0.05); put(S(37) + 1.6, boom(1.6, 70, 36, 2.0), 0.35)
put(S(38), tone([146.83, 174.61, 207.65], 2.5, 1.0), 0.08)
pause(S(46) - 0.2, S(49) - 0.2, E(48) + 0.2)
put(S(49) - 0.1, boom(2.6, 50, 26, 1.4), 0.6); ding(S(49) + 0.3, 0.10)
walk(S(49), S(55) - 0.3, 0.10); beat(S(52), S(55) - 0.3, 60, 0.05, fn=hat)
put(S(54) + 3.0, boom(2.4, 55, 28, 1.6), 0.55); put(S(54) + 3.0, tone([146.83, 174.61, 207.65], 2.0, 1.4), 0.10)
for i in range(int((S(57) - S(55)) / 0.25)): put(S(55) + i * 0.25, tone([2093.0], 0.03, 70), 0.02 + 0.03 * i / 40)
put(S(57), tone([2637.0, 3135.96, 3520.0], 1.2, 3), 0.09); put(S(57), boom(2.0, 60, 30, 2.0), 0.45)
pad(S(58), S(60) - 0.3, [55.0, 65.41, 82.41], 0.05, fi=0.6, fo=0.4)
put(S(59) + 0.6, boom(2.0, 55, 28, 1.6), 0.5)
pad(S(60) - 0.3, end, [55.0, 82.41, 110.0, 130.81], 0.07, fi=0.6, fo=2.0)
arp(S(60), end - 1.0, [[110.0, 130.81, 164.81], [98.0, 116.54, 146.83]], 70, 0.035, decay=3.0)
put(S(61), boom(2.0, 60, 30, 2.0), 0.45)
save()
