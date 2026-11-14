"""Trilha do curta CONECTADO: madrugada vazia com notificações, fio que
arrebenta, explicação calma, digitar e apagar, a resposta do Lucas, o fio
dourado, o café e as técnicas, e o final com três fios de ouro."""
import sys
sys.path.insert(0, "../_lib")
from som import *

end = S(32) - 1.4
lucasEnd, cafeEnd, techEnd = S(19) - 0.6, S(21) - 0.6, S(28) - 0.6
# lonely night
pad(0.3, S(8) - 0.6, [55.0, 82.41, 110.0], 0.06, fi=2.0, fo=0.6, trem=0.3)
for k in range(10):
    put(1.0 + k * 0.33, tone([1318.5 + (k % 3) * 120], 0.12, 20), 0.025)         # threads appearing
for a in [S(2), S(2) + 0.6, S(2) + 1.1]:
    put(a, tone([1318.5, 1760.0], 0.25, 12), 0.05)                              # notifications
for k in range(int((S(4) - S(3)) / 0.5)):
    put(S(3) + k * 0.5, tone([2400 if k % 2 else 1900], 0.04, 120), 0.05)          # 3am clock
put(S(5) + 1.6, noise(0.08, smooth=1, decay=60), 0.25)                           # thread snaps
put(S(5) + 1.65, tone([1567.98, 1046.5], 0.4, 10), 0.06)
put(S(6) + 0.4, noise(0.05, smooth=1, decay=70), 0.2)                            # selfie shutter
for k in range(10):
    put(S(7) - 0.2 + k * 0.18, tone([1046.5], 0.08, 25), 0.03)                    # likes ticking
put(E(7), tone([220.0, 207.65], 1.4, 2), 0.06)
# explainer
pad(S(8) - 0.6, S(13) - 0.6, [65.41, 98.0, 130.81], 0.06, fi=0.6, fo=0.6)
for k, f in enumerate([523.25, 659.25, 587.33, 698.46, 659.25, 783.99]):
    put(S(8) + k * 4.0, pluck(f, 1.6, 2.5), 0.04)
put(S(10) + 0.4, tone([523.25, 659.25, 783.99], 1.2, 2), 0.06)
for i in range(8):
    put(S(11) + 0.4 + i * 0.5, tone([783.99 + i * 40], 0.2, 14), 0.04)
# remembering Lucas, typing and deleting
pad(S(13) - 0.6, lucasEnd, [73.42, 110.0, 146.83], 0.05, fi=0.8, fo=0.6)
put(S(13) + 0.6, tone([523.25, 659.25, 783.99, 987.77], 2.0, 1.5), 0.06)          # memory
click = tone([3200, 4100], 0.03, 160)
t = S(15) - 0.2
while t < S(16) + 2.4:
    put(t, click, 0.04 * rng.uniform(0.6, 1)); t += rng.uniform(0.08, 0.16)
put(S(16) + 2.6, sweep(0.35, 600, 1600), 0.10)                                   # sent
for k in range(3):
    put(S(17) - 0.4 + k * 0.3, tone([880.0], 0.08, 25), 0.03)                     # typing dots
put(S(17) + 0.8, tone([1318.5, 1760.0, 2093.0], 0.7, 6), 0.10)                   # reply!
# golden thread
put(S(18) - 0.2, sweep(2.0, 200, 900), 0.06)
pad(S(18), lucasEnd, [65.41] + Cmaj7 + [329.63], 0.11, fi=1.0, fo=0.4, bright=0.4)
put(S(18) + 0.4, tone([523.25, 659.25, 783.99, 1046.5], 3.0, 1.0), 0.10)
# café + techniques: warm groove
pad(lucasEnd, techEnd, [65.41] + Fmaj7, 0.07, fi=0.4, fo=0.6, bright=0.2)
arp(lucasEnd, techEnd, [Fmaj7, Cmaj7, Am, G], 96, 0.035, bar=2.5, decay=4)
beat(S(20), techEnd - 0.4, 96, 0.13)
for a in [S(20) + 0.2, S(20) + 1.6]:
    put(a, tone([1046.5, 1318.5], 0.4, 8), 0.06)
put(S(21) - 0.4, boom(1.4, 80, 45, 3.0), 0.25)
for a in [S(22), S(23), S(24), S(26)]:
    put(a - 0.2, boom(1.0, 90, 50, 4.0), 0.22); put(a - 0.2, tone([523.25, 783.99], 0.6, 6), 0.07)
put(S(27), tone([392.0, 493.88, 587.33], 1.6, 1.6), 0.06)
# final: three golden threads
pad(techEnd, end, [65.41] + Cmaj7 + [329.63], 0.11, fi=1.0, fo=0.8, bright=0.4)
for i, a in enumerate([S(29), S(29) + 0.6]):
    put(a, tone([783.99 * (1 + i * 0.12), 1046.5 * (1 + i * 0.12)], 1.2, 3), 0.08)
arp(S(29), end, [Cmaj7, G, Am, Fmaj7], 92, 0.035, bar=2.6, decay=4)
beat(S(31), end - 0.4, 92, 0.12)
for k in [1.2, 3.0, 4.8, 6.4]:
    put(S(31) + k, tone([783.99, 1046.5, 1318.5], 0.9, 4), 0.08)
pad(end, E(33) + 2.0, [87.31, 130.81, 174.61], 0.05, fi=0.8, fo=0.6)
put(S(33), sweep(0.35, 600, 1600), 0.08)
put(E(33) + 2.4, boom(), 0.5)
pad(E(33) + 2.4, TL["duration"], [65.41] + C, 0.07, fi=0.4, fo=1.4)
save()
