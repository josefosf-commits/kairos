"""Teste de efeitos: trilha + efeitos de luta (sem narração). Tempos da história convertidos para tempo real (hit-stop e câmera lenta)."""
import sys
sys.path.insert(0, "../_lib")
from som import *
from luta import *
FREEZE = [[2.29, 0.06], [2.65, 0.06], [3.36, 0.1], [7.45, 0.13], [9.45, 0.15], [11.9, 0.16]]
SLOW = [[4.75, 5.35, 0.3]]
tl = []; real = te = 0.0; step = 1 / 300; done = set()
while real < 16.5:
    sp = 1
    for a, b, k in SLOW:
        if a <= te < b: sp = k
    fz = next((f for f in FREEZE if f[0] <= te < f[0] + 0.02 and f[0] not in done), None)
    if fz:
        done.add(fz[0]); n = round(fz[1] / step)
        tl += [te] * n; real += step * n; te = fz[0] + 0.02
    tl.append(te); te += step * sp; real += step
def R(x):  # tempo da história -> tempo real
    return next(i for i, v in enumerate(tl) if v >= x) / 300
end = TL["duration"]
# música
pad(0.0, R(1.4), [36.71, 73.42, 77.78], 0.08, fi=0.3, fo=0.05, trem=0.6)
put(0.0, riser(R(1.4), 150, 1800), 0.08)
BPM = 160; b8 = 60 / BPM / 2
t = R(1.4)
while t < R(11.9):
    k = int((t - R(1.4)) / b8)
    if k % 4 == 0: put(t, kick(130, 45, 0.4), 0.16)
    if k % 4 == 2: put(t, band(noise(0.2), 900, 8000) * np.exp(-np.arange(int(SR * 0.2)) / SR * 18), 0.1)
    put(t, hat(), 0.03); t += b8
pad(R(1.4), R(11.9), [73.42, 110.0, 146.83], 0.05, fi=0.1, fo=0.1, bright=0.5)
pad(R(12.4), end, [73.42, 110.0, 146.83, 220.0], 0.05, fi=1.2, fo=1.0, bright=0.3)
out[:] = np.tanh(out / np.abs(out).max() * 1.5) * 0.6
music = out.copy(); out[:] = 0
# efeitos
put(R(0.4), charge(0.6), 0.35)
for h in (2.29, 2.65, 3.36): put(R(h), punch(1.2 if h < 3 else 1.6), 0.9); put(R(h) - 0.05, jab(), 0.4)
put(R(4.6), dash(0.3), 0.5); put(R(4.75), slowmo(), 0.6); put(R(4.95), whiff(), 0.6); put(R(5.2), whiff(), 0.4)
put(R(7.2), whiff(), 0.6); put(R(7.45), punch(1.7), 1.0); put(R(7.45), clang()[:int(SR * 0.4)], 0.3)
put(R(9.2), dash(0.4), 0.6); put(R(9.45), punch(1.9), 1.0); put(R(9.45), explosion(0.8, 0.5), 0.5); put(R(9.5), dash(1.0), 0.6)
put(R(10.55), stomp(1.4), 0.9)
put(R(10.7), charge(0.75), 0.7); put(R(10.7), crackle(0.75, 60), 0.4)
put(R(11.45), beam(0.45, 98), 0.7); put(R(11.45), laser(0.45), 0.5)
put(R(11.9), explosion(3.0, 1.8), 1.0); put(R(11.9), stomp(2.0), 0.9); put(R(11.9) + 0.16, tinnitus(1.4), 0.25)
out[:] = np.tanh(out / np.abs(out).max() * 2.4)
out[:] = out * 0.9 + music
out[:] = out / np.abs(out).max() * 0.95
save("audio.wav")
