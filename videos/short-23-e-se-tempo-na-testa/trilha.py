"""Trilha do short solto "tempo de celular na testa": manhã leve, vergonha, noite pesada e alívio."""
import sys
sys.path.insert(0, "../_lib")
from som import *
end = TL["duration"]
pad(0.0, 5.2, [65.41] + C, 0.06, fi=0.6, fo=0.3)
for i in range(20): put(0.5 + i * 0.22, tone([1046.5 + (i % 4) * 120], 0.06, 30), 0.03)
put(5.5, tone([1567.98, 1318.5], 0.4, 6), 0.08)
arp(5.2, 30.0, [C, G, Am, F], 100, 0.035, decay=4)
beat(12.0, 30.0, 100, 0.07, fn=hat)
put(10.2, tone([880.0], 0.15, 20), 0.07); put(13.3, tone([880.0], 0.15, 20), 0.07)
put(24.5, tone([466.16, 493.88], 0.6, 5), 0.08); put(24.5, boom(0.8, 90, 45, 3), 0.25)
for i in range(6): put(26.1 + i * 0.25, tone([783.99 + (i % 2) * 196], 0.12, 15), 0.04)
put(28.0, whoosh(0.4), 0.08)
pad(30.2, 38.7, [55.0, 58.27, 82.41], 0.06, fi=0.8, fo=0.5)
put(32.6, boom(1.2, 70, 40, 2.4), 0.3)
put(37.1, sweep(0.4, 300, 900), 0.05); put(38.4, thud(0.6), 0.35)
put(38.8, tone([523.25, 659.25, 783.99, 1046.5], 1.4, 2.5), 0.1)
pad(38.8, end, [65.41] + C, 0.07, fi=0.8, fo=1.2, bright=0.2)
arp(39.0, end - 0.6, [C, Am, F, G], 96, 0.035, decay=4)
put(41.8, tone([523.25, 659.25, 783.99], 1.0, 3), 0.08)
save()
