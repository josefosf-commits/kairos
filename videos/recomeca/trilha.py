"""Trilha de RECOMEÇA.: piano maduro e caloroso, tensão no consultório, construção nas caminhadas,
alívio no resultado e final emocionante na corrida."""
import sys
sys.path.insert(0, "../_lib")
from som import *

end = TL["duration"]
def piano(a, b, chords, bpm, gain, bar=2.0):
    arp(a, b, chords, bpm, gain, bar=bar, decay=3.2)
pad(0.2, S(4) - 0.6, [55.0] + Am, 0.06, fi=1.2, fo=0.6)
piano(0.6, S(4) - 0.6, [Am, F, C, G], 76, 0.035)
for i in range(6):
    put(S(2) - 0.2 + i * 0.14, noise(0.05, smooth=3, decay=60), 0.04)
# doctor 1
pad(S(4) - 0.6, E(5) + 0.8, [55.0, 58.27, 82.41], 0.07, fi=0.4, fo=0.3)
beat(S(4) - 0.4, E(5) + 0.6, 62, 0.25, fn=lambda: kick(80, 38, 0.5))
for a in [S(5), S(5) + 1.4, S(5) + 3.0]:
    put(a, tone([233.08, 246.94], 0.8, 3), 0.06)
put(E(5) + 0.9, boom(2.6, 80, 40, 1.8), 0.5)
put(E(5) + 0.9, tone([261.63, 329.63, 392.0, 523.25], 3.5, 0.9), 0.10)
# night + together
pad(S(6) - 0.6, S(9) - 0.5, [55.0] + Am, 0.06, fi=0.8, fo=0.5)
put(S(7), sweep(1.2, 140, 70), 0.08)
piano(S(8), S(9) - 0.5, [C, G], 72, 0.035)
put(S(8) + 4.2, tone([523.25, 659.25, 783.99], 1.6, 2.0), 0.08)
# mistake
pad(S(9) - 0.5, S(11) - 0.5, [55.0, 82.41], 0.05, fi=0.4, fo=0.4)
put(S(10) + 3.2, boom(1.4, 60, 32, 2.6), 0.4)
# deal + rules
pad(S(11) - 0.5, S(18) - 0.4, [65.41] + C, 0.07, fi=0.6, fo=0.4, bright=0.2)
piano(S(11) - 0.4, S(18) - 0.4, [C, Em, F, G], 96, 0.04)
beat(S(12) - 0.3, S(18) - 0.4, 96, 0.10)
for sid in [12, 13, 14]:
    put(S(sid) - 0.3, boom(1.4, 90, 45, 3.0), 0.3); put(S(sid) - 0.3, whoosh(0.4), 0.06)
put(S(16), tone([233.08, 246.94], 0.8, 3), 0.05)
put(S(17) + 3.0, tone([1046.5, 1318.5], 0.5, 6), 0.06)
# obstacles
pad(S(18) - 0.4, S(20) - 0.4, [55.0] + Am, 0.06, fi=0.4, fo=0.4)
for a in [S(18), S(18) + 1.8, S(18) + 3.6]:
    put(a, thud(0.6), 0.2)
put(S(19) + 3.8, boom(1.2, 70, 36, 3.0), 0.3)
# family
pad(S(20) - 0.4, S(23) - 0.7, [65.41] + Cmaj7, 0.08, fi=0.6, fo=0.5, bright=0.3)
piano(S(20) - 0.4, S(23) - 0.7, [C, F, Am, G], 88, 0.045)
beat(S(20), S(23) - 0.9, 88, 0.09)
put(S(22) + 2.8, boom(1.8, 85, 42, 2.4), 0.35)
# doctor 2: suspense then relief
pad(S(23) - 0.7, S(26) - 0.2, [55.0, 58.27, 82.41], 0.07, fi=0.4, fo=0.2)
beat(S(23) - 0.5, S(25) + 2.4, 66, 0.25, fn=lambda: kick(80, 38, 0.5))
put(S(25) + 2.4, tone([523.25, 659.25, 783.99], 1.8, 1.8), 0.09)
put(S(26) - 0.2, boom(2.6, 85, 42, 1.6), 0.5)
put(S(26) - 0.2, tone([261.63, 329.63, 392.0, 523.25, 659.25], 4.0, 0.8), 0.13)
pad(S(26), S(28) - 0.6, [65.41] + Cmaj7, 0.07, fi=0.6, fo=0.4, bright=0.2)
# the run: emotional build
pad(S(28) - 0.6, S(32) - 0.6, [65.41] + C, 0.08, fi=0.6, fo=0.8, bright=0.4)
piano(S(28) - 0.6, S(32) - 0.6, [C, G, Am, F], 112, 0.05)
beat(S(28) - 0.4, S(31) - 0.4, 112, 0.14)
beat(S(28) + 0.6, S(31) - 0.4, 112, 0.03, fn=hat)
put(S(30) + 2.0, sweep(1.6, 300, 1400), 0.06)
put(S(31) - 0.4, boom(2.6, 85, 42, 1.6), 0.5)
put(S(31) - 0.4, tone([261.63, 329.63, 392.0, 523.25, 659.25, 783.99], 5.0, 0.6), 0.13)
# viewer + recap + CTA
pad(S(32) - 0.6, end, [65.41] + C, 0.07, fi=1.0, fo=3.0, bright=0.2)
piano(S(32) - 0.6, end - 2.0, [Am, F, C, G], 90, 0.04)
beat(S(34) - 0.4, end - 3.0, 90, 0.10)
for a in [S(34) + 1.6, S(34) + 3.4, S(34) + 5.0, S(35) + 0.2]:
    put(a, tone([1046.5, 1318.5], 0.4, 8), 0.07)
put(S(36), boom(2.0, 85, 42, 2.4), 0.4)
put(S(37) + 0.8, tone([1567.98, 2093.0], 0.3, 10), 0.08)
save()
