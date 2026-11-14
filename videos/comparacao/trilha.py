"""Trilha do curta A VIDA DOS OUTROS: pings de posts, grave que pesa enquanto
o quarto encolhe, cortina e viradas de carta no palco, explicação neutra,
técnicas calorosas e a música se abrindo no final."""
import sys
sys.path.insert(0, "../_lib")
from som import *

end = S(28) - 1.4
ins = [S(2) + 1.0, S(2) + 2.4, S(2) + 3.6, S(4) + 0.3, S(4) + 2.0, S(4) + 4.0]
flips = [S(7) + 0.4, S(8) + 0.4, S(10) + 0.3, S(10) + 0.6, S(9) + 0.4, S(10) + 0.9]
# opening: light, a little hollow
pad(0.3, S(6) - 0.4, [65.41, 98.0, 130.81], 0.06, fi=1.5, fo=0.4)
arp(0.8, S(3), [C, G], 100, 0.03, bar=2.4, decay=6)
for a in ins:
    put(a, tone([1318.5, 1760.0], 0.3, 12), 0.08)       # new post
    put(a + 0.1, tone([2093.0], 0.15, 20), 0.04)
# shrinking: heavy low drone, descending
i0, i1 = int(S(3) * SR), int((S(6) - 0.4) * SR)
tt = np.arange(i1 - i0) / SR
f = 110 * np.exp(-tt / (i1 - i0) * SR * 0.02)
out[i0:i1] += np.sin(2 * np.pi * np.cumsum(f) / SR) * np.minimum(1, tt / 2) * 0.05
put(S(30), tone([220.0, 207.65, 196.0], 1.6, 1.6), 0.07)
# stage
put(S(6) - 0.4, noise(1.2, smooth=30) * np.sin(np.linspace(0, np.pi, int(SR * 1.2))), 0.12)   # curtain
put(S(6), tone([523.25, 659.25, 783.99], 1.4, 2.0), 0.08)
t = S(6) + 0.8
while t < S(7):
    put(t, noise(0.04, smooth=2, decay=60), 0.04); t += 0.07                                   # snare roll
pad(S(6), S(11) - 0.6, [73.42, 110.0, 146.83], 0.05, fi=0.6, fo=0.6, trem=0.3)
for a in flips:
    put(a, whoosh(0.35), 0.10); put(a + 0.25, tone([392.0, 311.13], 0.5, 6), 0.06)
# explainer
pad(S(11) - 0.6, S(16) - 0.6, [65.41, 98.0, 130.81], 0.05, fi=0.6, fo=0.6)
beat(S(11), S(16) - 0.8, 76, 0.10, fn=lambda: kick(90, 44, 0.4))
for k in range(16):
    put(S(13) + k * 0.4, tone([1318.5 + (k % 5) * 80], 0.15, 18), 0.025)                       # mosaic flicker
put(S(14), boom(1.0, 80, 45, 3.5), 0.25)
put(S(15), tone([196.0, 185.0], 1.2, 2), 0.07)
# techniques: warm and steady
pad(S(16) - 0.6, S(24), [65.41] + Fmaj7, 0.06, fi=0.6, fo=0.6, bright=0.2)
beat(S(17) - 0.2, S(24) - 0.2, 88, 0.13)
arp(S(17), S(24) - 0.2, [Fmaj7, Cmaj7, Am, G], 88, 0.03, bar=2.7, decay=5)
for a in [S(17), S(18), S(19), S(22)]:
    put(a - 0.2, boom(1.0, 90, 50, 4.0), 0.22); put(a - 0.2, tone([523.25, 783.99], 0.6, 6), 0.07)
for k in range(2):
    put(S(18) - 0.3 + 1.6 + (k * 2 + 1) * 0.6, tone([660.0, 520.0], 0.25, 10), 0.06)            # unfollow clicks
for k in range(3):
    put(S(23) + 1.2 + k * 1.3, tone([1567.98, 2093.0], 0.3, 12), 0.07)                         # gratitude list
# room grows back: bloom
pad(S(24) - 0.2, end, [65.41] + Cmaj7 + [329.63], 0.11, fi=1.2, fo=0.8, bright=0.4)
put(S(24), sweep(2.5, 200, 900), 0.06)
put(S(24) + 1.0, tone([523.25, 659.25, 783.99, 1046.5], 3.0, 1.0), 0.09)
arp(S(25), end, [Cmaj7, G, Am, Fmaj7], 92, 0.035, bar=2.6, decay=4)
beat(S(27), end - 0.4, 92, 0.12)
for k in [1.4, 3.4, 5.0, 6.4]:
    put(S(27) + k, tone([783.99, 1046.5, 1318.5], 0.9, 4), 0.08)
# ending
pad(end, E(29) + 2.0, [87.31, 130.81, 174.61], 0.05, fi=0.8, fo=0.6)
put(S(29), boom(1.4, 90, 45, 3.0), 0.3)
put(E(29) + 2.4, boom(), 0.5)
pad(E(29) + 2.4, TL["duration"], [65.41] + C, 0.07, fi=0.4, fo=1.4)
save()
