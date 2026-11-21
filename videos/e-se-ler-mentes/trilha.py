"""Trilha de "E se você pudesse ler mentes?": manhã curiosa, comédia, caos de vozes, silêncio e abraço."""
import sys
sys.path.insert(0, "../_lib")
from som import *
end = TL["duration"]
pad(0.0, 5.3, [65.41] + C, 0.06, fi=1.0, fo=0.3)
put(2.0, sweep(1.0, 300, 1500), 0.07)
for i in range(4): put(3.0 + i * 0.3, tone([1046.5 + i * 130], 0.2, 12), 0.04)
arp(5.3, 23.3, [C, G, Am, F], 100, 0.035, decay=4)
beat(5.3, 23.3, 100, 0.08, fn=hat)
put(10.5, tone([1567.98, 1975.53], 0.4, 8), 0.06); put(18.8, tone([1567.98, 1975.53], 0.4, 8), 0.06)
put(11.0, tone([196.0, 185.0], 0.6, 5), 0.07); put(19.0, tone([196.0, 185.0], 0.6, 5), 0.07)
put(23.5, sweep(5.0, 200, 2400), 0.08)
for i in range(30): put(23.8 + i * 0.13, tone([300 + (i * 97) % 900], 0.1, 18), 0.02 + 0.001 * i)
beat(24.0, 28.6, 150, 0.12)
put(28.8, noise(0.05, 1, 40), 0.05)
pad(29.2, 39.0, [55.0, 82.41, 110.0, 130.81], 0.06, fi=1.5, fo=1.0)
put(35.6, sweep(0.9, 1500, 200), 0.06); chime(36.5, 0.06)
pad(38.0, end, [65.41] + C, 0.07, fi=2.0, fo=1.5, bright=0.2)
arp(38.3, 44.8, [F, C, G, C], 72, 0.035, decay=3)
put(43.2, tone([523.25, 659.25, 783.99], 1.5, 2.5), 0.08)
arp(45.0, end - 0.6, [C, Am, F, G], 96, 0.03, decay=4)
put(46.6, tone([523.25, 659.25, 783.99, 1046.5], 1.2, 3), 0.08)
save()
