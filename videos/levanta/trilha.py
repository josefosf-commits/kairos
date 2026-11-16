"""Trilha de LEVANTA.: piano emotivo, chuva, batimento no dia da prova, quase silêncio na queda,
crescendo quando ele levanta e final heroico na chegada."""
import sys
sys.path.insert(0, "../_lib")
from som import *

end = TL["duration"]
Bb = [58.27, 116.54, 138.59]
def rain(a, b, gain):
    n = int((b - a) * SR)
    if n <= 0:
        return
    x = noise(b - a, smooth=6)
    e = np.clip(np.minimum(np.arange(n) / SR / 1.0, (n - np.arange(n)) / SR / 1.0), 0, 1)
    put(a, x * e, gain)
def piano(a, b, chords, bpm, gain, bar=2.0):
    arp(a, b, chords, bpm, gain, bar=bar, decay=3.5)

# 1) intro: hope, first run, doubt
put(0.3, tone([523.25, 659.25, 783.99], 2.5, 1.2), 0.08)
pad(0.2, E(5) + 0.5, [65.41] + C, 0.07, fi=1.0, fo=0.6)
piano(0.6, S(3) - 0.2, [C, G, Am, F], 84, 0.035)
put(S(2) + 2.0, thud(0.6), 0.15); chime(S(2) + 2.1, 0.06)                     # poster
beat(S(3), S(3) + 3.0, 150, 0.06, fn=lambda: thud(0.4))                        # footsteps
put(S(3) + 3.0, sweep(0.6, 500, 200), 0.05)
pad(S(4), E(5) + 0.5, Am, 0.06, fi=0.6, fo=0.4)
piano(S(4), E(5) + 0.3, [Am, F], 70, 0.025)
# 2) title
put(E(5) + 0.7, boom(2.6, 80, 40, 1.8), 0.5)
put(E(5) + 0.7, tone([261.63, 329.63, 392.0, 523.25], 3.5, 0.9), 0.10)
# 3) week 1 (motivation): bright, then the flame leaves
pad(S(6) - 0.6, S(8) - 0.5, [65.41] + C, 0.06, fi=0.5, fo=0.8, bright=0.2)
piano(S(6) - 0.6, S(7) + 1.0, [C, G, Am, F], 100, 0.04)
beat(S(6) - 0.6, S(7) + 1.0, 100, 0.10)
put(S(6) + 4.2, noise(0.12, smooth=2, decay=30), 0.10)                         # camera
put(S(7) + 0.4, sweep(2.2, 900, 200), 0.05)
# 4) bad weeks: rain, sleepiness, nothing
rain(S(8) - 0.5, S(8) + 2.4, 0.05)
pad(S(8) - 0.5, S(11) - 0.5, Am, 0.06, fi=0.6, fo=0.6)
for i, a in enumerate([S(8), S(8) + 2.4, S(8) + 4.9]):
    put(a, pluck([220.0, 196.0, 174.61][i], dur=1.5, decay=2.5), 0.07)
put(S(9) - 0.3, noise(0.5, smooth=4, decay=6), 0.03)                           # chalk
for i in range(6):
    put(S(9) + 2.6 + i * 0.25, noise(0.06, smooth=3, decay=50), 0.04)
put(S(10) + 0.9, sweep(0.5, 300, 900), 0.06)                                   # strike-through
# 5) three rules: hope returns
pad(S(11) - 0.5, S(15) - 0.6, [65.41] + C, 0.06, fi=0.6, fo=0.5)
piano(S(11) - 0.4, S(15) - 0.6, [C, Em, F, G], 92, 0.035)
beat(S(12) - 0.3, S(15) - 0.6, 92, 0.07)
for sid in [12, 13, 14]:
    put(S(sid) - 0.3, boom(1.4, 90, 45, 3.0), 0.3); put(S(sid) - 0.3, whoosh(0.4), 0.06)
for i in range(14):
    put(S(14) + 2.3 + i * 0.32, noise(0.05, smooth=3, decay=60), 0.04)        # marker X
put(S(14) + 3.3, tone([1318.5, 1567.98], 0.6, 5), 0.06)
# 6) montage: build up
rain(S(16) - 0.4, S(17) - 0.4, 0.05)
pad(S(15) - 0.6, S(18) - 0.4, [65.41] + C, 0.07, fi=0.4, fo=0.4, bright=0.3)
piano(S(15) - 0.6, S(18) - 0.4, [Am, F, C, G], 104, 0.045)
beat(S(15) - 0.6, S(18) - 0.4, 104, 0.12)
for sid in [15, 16, 17]:
    chime(S(sid) - 0.2, 0.06)
pad(S(18) - 0.4, S(20) - 2.8, [65.41] + Cmaj7, 0.07, fi=0.5, fo=0.8, bright=0.2)
piano(S(18) - 0.4, S(20) - 2.8, [Cmaj7, Fmaj7], 80, 0.03)
put(S(19), boom(1.8, 85, 42, 2.4), 0.3)
# 7) race day: heartbeat, countdown, start
beat(S(20) - 2.8, S(21) - 0.2, 72, 0.32, fn=lambda: kick(80, 38, 0.5))
pad(S(20) - 2.8, S(21) - 0.2, [55.0, 82.41], 0.06, fi=0.8, fo=0.2)
go = S(21) - 0.2
for k in [3, 2, 1]:
    put(go - k, tone([880.0], 0.25, 8), 0.10)
put(go, tone([1760.0, 880.0], 0.6, 3), 0.12); put(go, boom(1.5, 90, 45, 3.0), 0.35)
pad(go, S(23) - 0.9, [55.0] + Am, 0.07, fi=0.4, fo=0.6, bright=0.3)
piano(go, S(22) + 2.2, [Am, F, C, G], 120, 0.045)
beat(go, S(22) + 2.2, 120, 0.14)
beat(go + 0.25, S(22) + 2.2, 120, 0.03, fn=hat)
# km 7: rain, cramp, fall
rain(S(22) + 0.9, S(29) + 2.0, 0.07)
put(S(22) + 2.2, tone([233.08, 246.94], 1.8, 1.0), 0.09)                       # cramp dissonance
put(S(22) + 2.2, sweep(1.2, 600, 150), 0.06)
put(S(23) - 0.4, thud(1.0), 0.6); put(S(23) - 0.4, boom(2.0, 60, 30, 2.0), 0.4)
pad(S(23), S(26) - 0.5, Bb, 0.06, fi=1.5, fo=0.8)
for i, a in enumerate([S(24) - 1.2, S(24) + 0.3, S(24) + 1.7, S(24) + 3.2]):    # runners passing
    put(a, whoosh(0.6), 0.10)
    for j in range(4):
        put(a - 0.4 + j * 0.25, thud(0.3), 0.08)
# the voice: slow heart, low drone
beat(S(25) - 0.4, E(25) + 1.0, 52, 0.30, fn=lambda: kick(70, 34, 0.6))
put(S(25) + 1.0, sweep(1.0, 120, 60), 0.10)
# memories: music box
pad(S(26) - 0.5, S(29) - 3.8, [65.41] + Cmaj7, 0.05, fi=1.2, fo=0.5)
piano(S(26), S(28) + 1.0, [Cmaj7, Fmaj7, Am, G], 80, 0.04)
arp(S(27) - 0.2, E(27) + 0.4, [[523.25, 659.25, 783.99, 987.77]], 120, 0.02, decay=4)
# resolve + rise: crescendo
pad(S(28), S(29) + 0.4, [65.41, 98.0, 130.81, 196.0], 0.08, fi=3.0, fo=0.2, bright=0.4)
beat(S(28) + 1.0, S(29) - 0.2, 70, 0.18, fn=lambda: boom(0.8, 70, 40, 4.0))
put(S(29) - 3.6, sweep(3.6, 150, 1200), 0.06)
put(S(29), boom(3.0, 85, 42, 1.6), 0.6)
put(S(29), tone([261.63, 329.63, 392.0, 523.25, 659.25], 4.0, 0.8), 0.13)
# running again: heroic build to the finish
pad(S(29) + 0.4, S(33) - 1.6, [65.41] + C, 0.08, fi=1.0, fo=0.2, bright=0.4)
piano(S(30), S(33) - 1.6, [C, G, Am, F], 112, 0.05)
beat(S(30) + 1.4, S(33) - 1.6, 112, 0.14)
beat(S(30) + 2.6, S(33) - 1.6, 112, 0.03, fn=hat)
for sid in [31]:
    chime(S(sid) + 0.2, 0.06); chime(S(sid) + 1.8, 0.06)
fin = S(33) - 1.6
put(fin, boom(3.0, 90, 44, 1.4), 0.6)
put(fin, tone([261.63, 329.63, 392.0, 523.25, 659.25, 783.99], 5.0, 0.6), 0.14)
put(fin, noise(3.0, smooth=8) * np.linspace(1, 0, int(SR * 3.0)) ** 2, 0.06)   # crowd
# warm resolution
pad(fin, S(37) - 0.6, [65.41] + Cmaj7, 0.08, fi=0.5, fo=1.0, bright=0.3)
piano(fin + 1.0, S(37) - 0.6, [C, F, Am, G], 90, 0.04)
put(S(36) + 3.4, boom(2.0, 85, 42, 2.4), 0.35)
# your km 7
rain(S(37) - 0.6, S(38) - 0.4, 0.05)
pad(S(37) - 0.6, S(38) - 0.4, Am, 0.06, fi=0.6, fo=0.4)
# recap + E LEVANTA + CTA + end
pad(S(38) - 0.4, end, [65.41] + C, 0.07, fi=0.6, fo=3.0, bright=0.2)
piano(S(38) - 0.4, end - 2.0, [C, G, Am, F], 100, 0.04)
beat(S(38) - 0.4, S(39) - 0.6, 100, 0.10)
for a in [S(38) + 1.8, S(38) + 3.9, S(38) + 5.5]:
    put(a, tone([1046.5, 1318.5], 0.4, 8), 0.07)
put(S(39), boom(2.4, 85, 42, 2.0), 0.5)
put(S(39), tone([261.63, 329.63, 392.0, 523.25], 3.0, 1.0), 0.12)
beat(S(40), end - 3.0, 100, 0.11)
put(S(40) + 0.4, tone([1567.98, 2093.0], 0.3, 10), 0.08)
save()
