"""Trilha do SHORT MOTIVAÇÃO × DISCIPLINA: alegre com a chama, chuva e silêncio, pulso firme na disciplina."""
import sys
sys.path.insert(0, "../_lib")
from som import *

end = TL["duration"]
up = np.arange(int(SR * 0.25)) / SR
flame_pop = np.exp(-up * 8) * np.sin(2 * np.pi * np.cumsum(300 + 1400 * up / 0.25) / SR)
put(0.3, flame_pop, 0.3); put(0.35, tone([1567.98, 2093.0, 2637.0], 0.8, 4), 0.10)
pad(0.2, S(4) - 0.3, [65.41] + C, 0.08, fi=0.3, fo=0.5)
arp(0.6, S(4) - 0.4, [C, G, Am, F], 120, 0.05)
beat(S(2), S(4) - 0.4, 120, 0.2)
put(S(2) + 1.9, thud(0.6), 0.25)
# rain
tt = np.arange(N) / SR
rain_amt = np.clip((tt - S(4) + 0.4) / 1.0, 0, 1) * np.clip(1 - (tt - S(10)) / 2.0, 0, 1)
out += (lowpass(rng.uniform(-1, 1, N), 3) * 0.6 + lowpass(rng.uniform(-1, 1, N), 40) * 2.0) * rain_amt * 0.05
pad(S(4), S(7), [55.0, 82.41], 0.07, fi=0.6, fo=0.3)
crackle = noise(1.4, smooth=2) * (rng.random(int(SR * 1.4)) > 0.985)
put(S(4) + 0.4, crackle, 0.5)
put(S(5) + 0.2, noise(1.2, smooth=30) * np.sin(np.linspace(0, np.pi, int(SR * 1.2))), 0.12)    # puff out
# discipline
put(S(7), boom(2.0, 70, 38, 2.6), 0.5)
pad(S(7), S(9), [55.0] + Am, 0.08, fi=0.3, fo=0.3)
beat(S(8), S(9), 100, 0.24)
for a in [S(8) + 0.2, S(8) + 1.9, S(8) + 3.8]:
    put(a, thud(0.9), 0.3)
pad(S(9), end, [65.41] + C + [261.63], 0.09, fi=0.2, fo=1.0)
arp(S(9), end - 1.0, [C, F, G, C], 112, 0.05)
beat(S(10), E(10) + 0.4, 112, 0.2)
put(S(9) + 1.8, boom(1.6, 85, 42, 2.6), 0.4)
put(S(10) + 1.6, tone([523.25, 659.25, 783.99, 1046.5], 2.2, 1.6), 0.13)
# footsteps from the speed table in cena.js (same integration)
def kf1(t, pts):
    for i in range(1, len(pts)):
        if t <= pts[i][0]:
            t0, v0 = pts[i - 1]; t1, v1 = pts[i]; k = min(1, max(0, (t - t0) / (t1 - t0))); k = k * k * (3 - 2 * k)
            return v0 + (v1 - v0) * k
    return pts[-1][1]
SP = [[0, 0], [S(3) - 0.3, 0], [S(3), 560], [S(4), 520], [S(4) + 1.2, 260], [S(5) + 0.8, 0], [S(8) - 0.1, 0], [S(8) + 0.5, 600],
      [S(8) + 2.0, 600], [S(8) + 2.5, 230], [S(8) + 3.4, 230], [S(8) + 3.9, 600], [99, 600]]
ph, last, u = 0.0, 0, 0.0
while u < end:
    if S(9) - 0.1 <= u < S(10) - 0.1 or u < S(3) - 0.1:
        u += 1 / 60; continue
    v = kf1(u, SP); ph += (v / 250 if v > 1 else 0) * 2 * np.pi / 60
    if int(ph / np.pi) > last:
        last = int(ph / np.pi); wet = u > S(4)
        put(u, noise(0.09, smooth=4 if wet else 10, decay=45) * (1.4 if wet else 1.0), 0.10)
    u += 1 / 60
save()
