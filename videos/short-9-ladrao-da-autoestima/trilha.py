"""Trilha do SHORT O LADRÃO DA AUTOESTIMA: pizzicato do ladrão, 'likes' brilhantes nos posts,
som de vidro quando ele leva um pedaço, cortina no palco, virada calorosa no final."""
import sys
sys.path.insert(0, "../_lib")
from som import *

end = TL["duration"]
steals = [S(3) - 0.2, S(3) + 1.0, S(3) + 2.2]
put(0.1, boom(1.8, 70, 36, 2.6), 0.45); put(0.15, sweep(0.9, 200, 900), 0.08)
pad(0.2, S(9), [55.0, 82.41, 110.0], 0.065, fi=0.4, fo=0.4)
walk = [110.0, 130.81, 146.83, 155.56, 164.81, 155.56, 146.83, 130.81]
tt, k = 0.5, 0
while tt < S(5) - 0.2:
    put(tt, pluck(walk[k % 8], dur=0.3, decay=14), 0.09); tt += 0.36; k += 1
for a in [S(2) + 0.2, S(2) + 1.7, S(2) + 3.2]:                        # likes
    put(a, tone([1318.5, 1760.0, 2093.0], 0.4, 9), 0.08)
for a in steals:
    put(a + 0.9, tone([2637.0, 3520.0], 0.5, 7), 0.07)                # glass
    put(a + 1.0, sweep(0.5, 1200, 300), 0.07)
put(S(4) + 2.2, tone([311.13, 293.66], 0.6, 5), 0.07); put(S(4) + 3.6, tone([277.18, 261.63], 0.8, 4), 0.07)
put(S(5) + 1.6, boom(1.4, 90, 45, 3.0), 0.35)
put(S(5) + 2.8, noise(1.0, smooth=25) * np.sin(np.linspace(0, np.pi, SR)), 0.12)   # curtain
put(S(5) + 3.8, noise(0.8, smooth=25) * np.sin(np.linspace(0, np.pi, int(SR * 0.8))), 0.12)
for i in range(12):
    put(S(5) + 4.4 + i * 0.05, noise(0.03, smooth=2, decay=120), 0.05)  # photos
put(S(6) + 2.6, thud(0.7), 0.25)
put(S(7) + 3.0, boom(1.6, 70, 38, 2.4), 0.4)
# turn
pad(S(8), end, [65.41] + Cmaj7, 0.08, fi=0.4, fo=1.0, bright=0.2)
beat(S(8), E(11), 100, 0.15)
arp(S(8), E(11) + 0.3, [C, G, Am, F], 100, 0.04)
put(S(8) + 2.0, tone([2093.0], 0.06, 40), 0.08)                       # click
put(S(9) + 1.4, tone([523.25, 659.25, 783.99], 1.2, 3), 0.09)
for i in range(3):
    put(S(10) + 0.4 + i * 0.5, tone([1318.5, 1760.0], 0.4, 8), 0.07)
put(E(11) + 0.3, tone([523.25, 659.25, 783.99, 1046.5], 2.0, 1.6), 0.12)
save()
