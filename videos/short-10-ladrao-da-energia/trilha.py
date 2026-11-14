"""Trilha do SHORT O LADRÃO DA ENERGIA: pizzicato do ladrão, zumbido elétrico nos roubos, bocejo de manhã,
som de pico e queda no açúcar, passos e virada para cima no plano."""
import sys
sys.path.insert(0, "../_lib")
from som import *

end = TL["duration"]
put(0.1, boom(1.8, 70, 36, 2.6), 0.45)
pad(0.2, S(8), [55.0, 82.41, 110.0], 0.065, fi=0.4, fo=0.4)
walk = [110.0, 130.81, 146.83, 155.56, 164.81, 155.56, 146.83, 130.81]
tt, k = 0.5, 0
while tt < S(7) - 0.2:
    put(tt, pluck(walk[k % 8], dur=0.3, decay=14), 0.085); tt += 0.36; k += 1
def zap(a):
    n = int(SR * 0.4); x = np.sign(np.sin(2 * np.pi * 120 * np.arange(n) / SR)) * np.exp(-np.arange(n) / SR * 9)
    put(a, lowpass(x, 8), 0.06); put(a, tone([1975.5, 2637.0], 0.2, 20), 0.05)
zap(2.3)
put(S(2) + 1.8, sweep(1.6, 500, 200), 0.07)
put(S(3) + 1.6, sweep(0.4, 1200, 300), 0.08); put(S(3) + 2.2, boom(1.4, 85, 42, 3.0), 0.35)
for i in range(3):
    put(S(4) + 3.4 + i * 0.9, tone([783.99, 659.25], 0.4, 8), 0.06)
# sugar spike and crash
put(S(5) + 0.8, tone([1046.5, 1318.5, 1567.98], 0.6, 6), 0.08)
put(S(5) + 2.5, sweep(1.0, 300, 1600), 0.10)
put(S(5) + 3.5, sweep(1.6, 1600, 120), 0.10)
put(S(6) + 1.5, sweep(2.5, 400, 150), 0.06)
# movement + plan
pad(S(7), end, [65.41] + C, 0.08, fi=0.4, fo=1.0)
beat(S(7), E(12), 108, 0.16)
arp(S(7), E(12) + 0.3, [C, G, Am, F], 108, 0.04)
for i in range(int((S(8) - S(7)) * 2.2)):
    put(S(7) + i / 2.2, noise(0.08, smooth=10, decay=45), 0.07)       # footsteps
put(S(8) + 1.4, tone([2093.0, 2637.0], 0.4, 8), 0.08)                  # price tag
for a in [S(9), S(9) + 2.4, S(10), S(10) + 2.6]:
    put(a, thud(0.6), 0.2); put(a + 0.05, tone([1318.5, 1975.5], 0.3, 10), 0.07)
put(S(11) + 1.2, sweep(1.8, 300, 1500), 0.08)                          # battery fills
for i in range(7):
    put(S(11) + 0.2 + i * 0.15, pluck([261.63, 293.66, 329.63, 349.23, 392.0, 440.0, 523.25][i] * 2, decay=10), 0.07)
put(S(11) + 2.6, tone([523.25, 659.25, 783.99, 1046.5], 2.0, 1.6), 0.12)
for i in range(4):
    put(S(12) + 0.4 + i * 0.25, tone([1318.5, 1760.0], 0.25, 12), 0.06)
save()
