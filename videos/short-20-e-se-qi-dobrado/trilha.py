"""Trilha do short "E se o seu QI dobrasse?": energia crescente a cada dia e suspense no robô."""
import sys
sys.path.insert(0, "../_lib")
from som import *
end = TL["duration"]
pad(0.0, 3.3, [65.41] + C, 0.06, fi=0.6, fo=0.2)
for i, t0 in enumerate((3.3, 10.1, 15.6, 20.9, 27.4)):
    put(t0, whoosh(0.4), 0.1)
    put(t0 + 0.35, tone([523.25 * 2 ** (i / 6), 659.25 * 2 ** (i / 6), 783.99 * 2 ** (i / 6)], 0.8, 4), 0.08)
arp(3.3, 27.2, [C, G, Am, F], 104, 0.035, decay=4)
beat(3.3, 27.2, 104, 0.09)
for i in range(30): put(6.6 + i * 0.09, noise(0.04, 2, 40), 0.04)
put(9.0, tone([783.99, 1046.5], 0.5, 6), 0.08)
for i in range(16): put(10.8 + i * 0.2, noise(0.05, 1, 30), 0.04)
put(14.0, tone([523.25, 659.25, 783.99, 1046.5], 1.0, 3), 0.1)
for i in range(6): put(18.3 + i * 0.25, tone([220 + i * 40], 0.15, 12), 0.06)
put(20.05, thud(0.9), 0.5); put(20.1, tone([1318.5, 1567.98], 0.4, 8), 0.06)
for i in range(12): put(22.5 + i * 0.2, tone([880 + (i * 137) % 700], 0.1, 15), 0.03)
put(25.5, sweep(0.6, 900, 200), 0.06)
pad(27.4, 34.2, [55.0, 82.41, 110.0], 0.05, fi=0.5, fo=0.5)
put(29.2, sweep(1.4, 200, 1400), 0.06)
pad(34.2, end, [55.0, 58.27, 82.41], 0.07, fi=0.4, fo=0.8)
put(35.8, tone([1046.5, 1318.5], 0.6, 5), 0.08)
put(37.3, boom(1.6, 70, 38, 2.2), 0.4)
put(39.5, tone([523.25, 622.25, 783.99], 1.4, 2.5), 0.09)
save()
