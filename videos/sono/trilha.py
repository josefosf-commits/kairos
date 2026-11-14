"""Trilha do curta O LADRÃO DAS 2 DA MANHÃ: noite com grilos, tema sorrateiro
do ladrão (pizzicato), tilintar dos frascos, dia cansado, explicação calma,
técnicas, noite protegida e manhã com pássaros."""
import sys
sys.path.insert(0, "../_lib")
from som import *

end = S(35) - 1.5
steals = [(0, S(5) - 0.4), (1, S(7) - 0.4), (2, S(9) - 0.5), (3, S(10) - 0.4), (4, S(10) + 0.4)]
nights = [(0, S(6) - 0.6), (S(7) - 0.6, S(8) - 0.5), (S(9) - 0.6, S(9) + 1.6), (S(10) - 0.5, S(10) + 2.2), (S(27) - 0.8, S(31) - 0.8)]
# crickets at night
tt = np.arange(N) / SR
crick = np.sin(2 * np.pi * 4200 * tt) * (np.sin(2 * np.pi * 18 * tt) > 0.6) * (0.5 + 0.5 * np.sin(2 * np.pi * 0.7 * tt))
mask = np.zeros(N)
for a, b in nights:
    i0, i1 = int(a * SR), int(b * SR)
    mask[i0:i1] = 1
mask = lowpass(mask, 4800)
out += crick * mask * 0.012

def sneaky(a, b, gain=0.06):
    notes = [146.83, 0, 174.61, 0, 164.81, 146.83, 0, 130.81]
    t, k = a, 0
    while t < b:
        f = notes[k % len(notes)]
        if f: put(t, pluck(f, 0.25, 14), gain)
        if k % 4 == 0: put(t, pluck(73.42, 0.4, 8), gain * 1.2)
        t += 0.24; k += 1

# intro night + thief appears
pad(0.3, S(5) - 0.4, [73.42, 110.0, 146.83], 0.06, fi=2.0, fo=0.4, trem=0.3)
put(S(2) + 0.6, sweep(1.6, 900, 200), 0.08)
sneaky(S(2) + 1.2, S(5) - 0.6, 0.05)
put(S(3), tone([146.83, 174.61, 220.0], 1.5, 2.0), 0.08)
# thefts
for i, a in steals:
    sneaky(a, a + 3.2, 0.06)
    put(a + 1.6, tone([1567.98, 2093.0, 2637.0], 0.6, 6), 0.08)    # clink
    put(a + 1.7, whoosh(0.5), 0.10)
# day vignettes (muted, tired)
for a, b in [(S(6) - 0.6, S(7) - 0.6), (S(8) - 0.5, S(9) - 0.6), (S(9) + 1.6, S(10) - 0.5), (S(10) + 2.2, S(12) - 0.6)]:
    pad(a, b, [55.0, 82.41, 98.0], 0.05, fi=0.4, fo=0.4)
for k in range(3):
    put(S(8) + 0.8 + k * 1.1, tone([311.13, 293.66], 0.4, 6), 0.06)  # irritations
for k in range(5):
    put(S(11) + k * 0.9, noise(0.4, smooth=20) * np.linspace(1, 0, int(SR * 0.4)), 0.05)  # coffee pours
# explainer: calm, starry
pad(S(12) - 0.6, S(18) - 0.6, [65.41, 98.0, 130.81, 164.81], 0.07, fi=0.8, fo=0.6, bright=0.2)
for k, f in enumerate([523.25, 659.25, 783.99, 659.25, 587.33, 698.46, 880.0, 698.46]):
    put(S(12) + k * 3.2, pluck(f, 1.6, 2.5), 0.04)
for a in [S(13), S(14), S(15), S(16)]:
    put(a - 0.2, tone([1046.5, 1318.5], 0.6, 5), 0.06)
put(S(17), tone([220.0, 207.65], 1.2, 2), 0.07)
# techniques: gentle steady groove
pad(S(18) - 0.6, S(27) - 0.8, [65.41] + Fmaj7, 0.06, fi=0.6, fo=0.6, bright=0.2)
beat(S(19) - 0.2, S(27) - 1.0, 80, 0.12, fn=lambda: kick(90, 44, 0.4))
arp(S(19), S(27) - 1.0, [Fmaj7, Cmaj7, Am, G], 80, 0.03, bar=3.0, decay=4)
for a in [S(19), S(21), S(23), S(24), S(26)]:
    put(a - 0.2, boom(1.0, 90, 50, 4.0), 0.22); put(a - 0.2, tone([523.25, 783.99], 0.6, 6), 0.07)
put(S(22) - 0.6, noise(0.06, smooth=4, decay=50), 0.12)          # phone put away
put(S(23) + 1.0, noise(1.4, smooth=30) * np.linspace(1, 0, int(SR * 1.4)), 0.06)  # curtains
# protected night: thief comes and leaves with nothing
pad(S(27) - 0.8, S(31) - 0.8, [73.42, 110.0], 0.05, fi=0.8, fo=0.6)
sneaky(S(27) + 0.4, S(29) + 1.0, 0.05)
put(S(29) + 0.2, tone([1567.98, 2093.0], 0.4, 8), 0.05)
put(S(30), pluck(98.0, 0.8, 4), 0.10); put(S(30) + 0.35, pluck(87.31, 0.9, 4), 0.10)  # "huh?"
# morning: birds and a bright major
pad(S(31) - 0.8, S(34) - 0.8, [65.41] + Cmaj7 + [329.63], 0.11, fi=1.2, fo=0.6, bright=0.4)
for k in range(10):
    put(S(31) + k * 0.6 + rng.uniform(0, 0.2), sweep(0.12, 2600, 3600) * 0.8, 0.04)
for i in range(5):
    put(S(32) + i * 0.95, tone([1046.5 * (1 + i * 0.12), 1318.5 * (1 + i * 0.12)], 0.8, 4), 0.08)
arp(S(32), S(34) - 0.8, [Cmaj7, G, Am, Fmaj7], 84, 0.035, bar=3.0, decay=4)
# recap
prog = [Cmaj7, G, Am, Fmaj7]
for i in range(int((end - S(34)) / 3.0) + 1):
    a = S(34) - 0.8 + i * 3.0
    pad(a, min(a + 3.2, end), [prog[i % 4][0] / 2] + prog[i % 4], 0.07, fi=0.3, fo=0.3, bright=0.3)
beat(S(34), end - 0.4, 92, 0.12)
for k in [1.2, 2.6, 4.2, 5.6, 6.8]:
    put(S(34) + k, tone([783.99, 1046.5, 1318.5], 0.9, 4), 0.08)
# ending
pad(end, E(37) + 2.0, [87.31, 130.81, 174.61], 0.05, fi=0.8, fo=0.6)
for k, f in enumerate([523.25, 659.25, 783.99, 659.25]):
    put(end + 0.4 + k * 2.4, pluck(f, 1.6, 2.5), 0.05)
put(E(37) + 2.4, boom(), 0.5)
pad(E(37) + 2.4, TL["duration"], [65.41] + C, 0.07, fi=0.4, fo=1.4)
save()
