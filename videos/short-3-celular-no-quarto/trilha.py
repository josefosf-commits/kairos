"""Trilha do SHORT O CELULAR NO QUARTO: noite fria com zumbido de tela, solução clara, manhã quente."""
import sys
sys.path.insert(0, "../_lib")
from som import *

end = TL["duration"]
put(0.4, boom(1.6, 80, 40, 3.0), 0.45); put(0.4, tone([880, 1174.66], 0.4, 10), 0.08)
pad(0.2, S(6), [55.0, 82.41, 110.0], 0.07, fi=0.6, fo=0.3)
hum = np.sin(2 * np.pi * 120 * np.arange(int(SR * (S(4) - 0.2))) / SR) * 0.3 + noise(S(4) - 0.2, smooth=40) * 0.5
put(0.2, hum * np.minimum(1, np.arange(len(hum)) / SR), 0.03)              # screen hum
for k in range(3):
    put(S(2) + k * 0.5, tone([1760.0], 0.08, 40), 0.06)                       # 02:13 beeps
put(S(3) + 0.3, tone([1046.5, 1318.5, 1567.98], 1.2, 3), 0.08)
put(S(4) + 0.6, sweep(1.2, 500, 200), 0.10)
put(S(4) + 2.4, tone([311.13, 293.66], 0.8, 4), 0.08)
for a in [S(5) + 1.4, S(5) + 2.2, S(5) + 3.1]:
    put(a, sweep(0.8, 700, 150), 0.08)                                      # draining
put(S(6), boom(2.0, 85, 42, 2.5), 0.55)
pad(S(6) + 0.5, S(9), [65.41] + C, 0.07, fi=0.6, fo=0.4)
arp(S(7), S(8), [C, G], 96, 0.04)
put(S(7) + 0.4, tone([1318.5, 1760.0], 0.3, 12), 0.07); put(S(7) + 2.4, tone([1567.98, 2093.0], 0.3, 12), 0.07)
pad(S(8), S(9), [55.0, 82.41], 0.05, fi=0.3, fo=0.3)
put(S(8) + 2.6, tone([1046.5, 1567.98], 1.0, 3), 0.07)
# morning
put(S(9), tone([523.25, 659.25, 783.99, 1046.5], 2.4, 1.4), 0.14)
pad(S(9), end, [65.41] + Cmaj7, 0.08, fi=0.3, fo=1.0, bright=0.25)
arp(S(9), E(10) + 0.6, [C, F, G, C], 104, 0.05)
beat(S(9), E(10) + 0.4, 104, 0.18)
put(S(9) + 1.4, sweep(1.2, 300, 1500), 0.08)
save()
