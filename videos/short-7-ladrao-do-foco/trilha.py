"""Trilha do SHORT O LADRÃO DO FOCO: suspense em pizzicato (ladrão), 'plim' de notificação em cada roubo,
tique-taque nos 23 minutos, virada clara quando a porta fecha."""
import sys
sys.path.insert(0, "../_lib")
from som import *

end = TL["duration"]
steals = [S(3), S(4), S(4) + 2.0]
# sneaky night theme (minor pizzicato walk)
put(0.2, boom(1.8, 70, 36, 2.6), 0.45)
pad(0.2, S(8), [55.0, 82.41, 110.0], 0.07, fi=0.4, fo=0.4)
walk = [110.0, 130.81, 146.83, 155.56, 164.81, 155.56, 146.83, 130.81]
k, tt = 0, 0.6
while tt < S(5) - 0.2:
    put(tt, pluck(walk[k % 8], dur=0.3, decay=14), 0.10); tt += 0.36; k += 1
beat(0.6, S(5) - 0.2, 83, 0.12, fn=lambda: kick(90, 40, 0.4))
put(S(2) + 0.4, sweep(1.2, 200, 900), 0.08)                      # thief emerges
for a in steals:
    put(a, tone([1567.98, 2093.0], 0.35, 9), 0.16)                # plim
    put(a + 1.1, sweep(0.5, 1200, 300), 0.08)                     # grab
    put(a + 1.6, tone([196.0, 185.0], 0.4, 6), 0.06)
# 23 minutes: clock ticks
for i in range(int((E(5) + 0.3 - S(5) - 3.6) * 4)):
    put(S(5) + 3.6 + i * 0.25, tone([2400 if i % 2 else 1800], 0.03, 150), 0.05)
put(S(5) + 5.0, boom(1.4, 85, 42, 3.0), 0.35)
for i in range(10):                                               # 10 pings in an hour
    put(S(6) + 0.3 + i * (E(6) - S(6) - 0.3) / 10, tone([1567.98], 0.12, 20), 0.06)
put(S(7) + 2.6, boom(1.8, 60, 32, 2.0), 0.45)
# the weak spot + locks
put(S(8), tone([523.25, 659.25, 783.99], 1.6, 2.0), 0.10)
pad(S(8), end, [65.41] + C, 0.08, fi=0.5, fo=1.0)
beat(S(9), E(11), 104, 0.16)
arp(S(9), E(11) + 0.4, [C, G, Am, F], 104, 0.04)
for a in [S(9), S(9) + 1.7, S(9) + 3.6]:
    put(a, thud(0.7), 0.25); put(a + 0.05, tone([1318.5, 1975.5], 0.3, 10), 0.07)   # lock click
put(S(10) + 1.4, tone([311.13, 293.66], 0.6, 5), 0.07)          # shrug
put(S(10) + 2.4, sweep(1.6, 300, 1400), 0.08)                    # jar refills
for i in range(3):
    put(S(11) + 0.8 + i * 0.3, pluck(392.0 * (1 + i * 0.25), decay=10), 0.08)
put(E(11) + 0.4, tone([523.25, 659.25, 783.99, 1046.5], 2.0, 1.6), 0.12)
save()
