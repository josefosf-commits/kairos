"""Trilha do REEL 4 CADEADOS (loop): tudo contínuo de 0 até o fim, sem fade-in/fade-out,
duração = 98 batidas exatas (96 bpm), o fim cai no mesmo acorde do começo -> o loop não 'pula'."""
import sys
sys.path.insert(0, "../../videos/_lib")
from som import *

end = TL["duration"]; beatlen = 60 / 96
# continuous bed (no fades so the end meets the start)
pad(0, end, [55.0, 82.41, 110.0, 130.81], 0.07, fi=0.01, fo=0.01, trem=0.0)
k, t = 0, 0.0
while t < end - 1e-6:                      # heist pizzicato, one note per half beat
    put(t, pluck([110.0, 130.81, 146.83, 164.81][k % 4], dur=0.28, decay=16), 0.08); t += beatlen / 2; k += 1
t = 0.0
while t < end - 1e-6:                      # soft pulse on every beat
    put(t, kick(90, 40, 0.3), 0.10); t += beatlen
for i in range(int(end / beatlen)):
    put(i * beatlen + beatlen / 2, hat(), 0.025)
# door closes + locks
put(S(2) - 0.4, noise(0.6, smooth=20) * np.linspace(1, 0, int(SR * 0.6)), 0.10)
put(S(2) + 0.4, thud(1.0), 0.35)
for a in [S(2) + 1.4, S(4) + 1.6, S(6) + 1.6, S(8) + 1.8]:
    put(a + 0.4, thud(0.8), 0.3); put(a + 0.42, tone([1975.5, 2637.0], 0.2, 18), 0.07)   # lock click
# knocks + shrugs
for a in [S(3), S(3) + 1.8, S(5), S(7), S(9) + 2.0]:
    for j in range(3):
        put(a + 0.85 + j * 0.18, thud(0.5), 0.2)
    put(a + 2.0, tone([311.13, 293.66], 0.4, 6), 0.05)
put(S(9) + 3.3, tone([2637.0, 3135.96], 0.3, 14), 0.06)                       # key falls
for i in range(4):
    put(S(10) + 2.4 + i * 0.4, tone([1318.5, 1760.0], 0.25, 12), 0.05)
put(S(11), tone([1046.5, 1318.5, 1567.98], 0.6, 6), 0.07)
# the loop point: phone calls, locks pop, door creaks open
put(S(12) - 0.9, tone([1567.98, 2093.0], 0.35, 9), 0.12)
for i in range(4):
    put(S(12) + 0.2 + i * 0.25, tone([1318.5, 987.77], 0.2, 14), 0.06)
put(S(12) + 1.3, noise(1.2, smooth=30) * np.linspace(1, 0.2, int(SR * 1.2)), 0.08)
save()
