"""Trilha do CASO ESPECIAL 2 (O Bilhete de 40 Milhões), sem ruído de fundo: contrabaixo noir, 'plim' do caixa,
duas contagens de palpite, crescendo nas contas e golpe na revelação."""
import sys
sys.path.insert(0, "../../../videos/_lib")
from som import *
end = TL["duration"]
bass = [55.0, 65.41, 61.74, 58.27]
def walk(a, b, g=0.10):
    t0, k = a, 0
    while t0 < b:
        put(t0, pluck(bass[(k // 4) % 4], dur=0.6, decay=5), g); t0 += 0.5; k += 1
def plim(a, g=0.09): put(a, tone([2093.0, 2637.0], 0.7, 4), g)
def tick(a): put(a, tone([1567.98, 1318.5], 0.4, 7), 0.08); put(a, thud(0.5), 0.2)
def pause(a, b, g0):
    pad(a, b, [55.0, 58.27, 82.41], 0.06, fi=0.5, fo=0.3)
    for i in range(5): put(g0 + i * 1.1, tone([1046.5], 0.08, 30), 0.10); put(g0 + i * 1.1, thud(0.3), 0.15)
pad(0.2, S(4), [65.41, 82.41, 98.0], 0.05, fi=1.0, fo=0.5)
for i in range(6): put(1.2 + i * 0.35, tone([783.99 + 40 * i], 0.25, 8), 0.06)                          # lottery balls
put(S(3), tone([523.25, 659.25, 783.99, 1046.5], 1.2, 2), 0.10)                                         # "GANHEI!"
put(S(4) + 1.0, boom(2.4, 55, 28, 1.6), 0.55)
put(E(7) + 0.3, tone([196.0, 233.08, 293.66], 3.0, 1.0), 0.10); put(E(7) + 0.3, boom(2.0, 60, 30, 2.0), 0.4)
walk(S(8), S(26) - 0.3); pad(S(8), S(26) - 0.3, [55.0, 65.41, 77.78], 0.045, fi=1.0, fo=0.4)
beat(S(12), S(26) - 0.3, 60, 0.045, fn=hat)
plim(S(8) + 0.4); plim(S(11) + 1.0); put(S(11) + 3.4, boom(1.8, 60, 30, 2.0), 0.35)
for i in range(4): put(S(13 + i), tone([523.25 + 60 * i], 0.3, 8), 0.06)
put(S(17), tone([392.0, 493.88, 587.33], 2.0, 1.2), 0.07)                                               # "hero" chord for the delegado
put(S(18) + 1.8, sweep(1.4, 200, 900), 0.06); put(S(18) + 3.2, boom(2.0, 70, 36, 2.0), 0.4)
put(S(19), tone([196.0, 233.08, 293.66], 2.5, 1.2), 0.10)
for sid in [20, 34, 39, 42]: tick(S(sid))
for sid in [21, 22, 23]: put(S(sid), tone([220.0], 0.5, 5), 0.07)
pause(S(26) - 0.2, S(27) - 0.2, E(26) + 0.2)
put(S(27) - 0.1, boom(2.0, 60, 30, 2.0), 0.4)
walk(S(27), S(44) - 0.3, 0.09); pad(S(27), S(44) - 0.3, [55.0, 65.41, 77.78], 0.045, fi=1.0, fo=0.4)
put(S(28) + 2.0, boom(1.6, 70, 36, 2.0), 0.35); put(S(31) + 0.6, tone([392.0, 523.25], 0.8, 4), 0.07)
plim(S(36) + 0.4); plim(S(36) + 3.4)
put(S(38) + 0.6, boom(2.0, 55, 28, 1.6), 0.45)
for i in range(int((S(42) - S(39)) / 0.25)): put(S(39) + i * 0.25, tone([2093.0], 0.03, 70), 0.015 + 0.025 * i / 50)
put(S(43) + 1.4, boom(2.0, 55, 28, 1.6), 0.45)
pause(S(44) - 0.2, S(47) - 0.2, E(46) + 0.2)
put(S(47) - 0.1, boom(2.6, 50, 26, 1.4), 0.6)
walk(S(47), S(54) - 0.3, 0.10); beat(S(49), S(54) - 0.3, 60, 0.05, fn=hat)
plim(S(49) + 0.2); put(S(50), boom(1.8, 60, 30, 2.0), 0.4)
put(S(53) + 1.2, tone([2637.0, 3135.96, 3520.0], 1.0, 3), 0.08); put(S(53) + 2.4, boom(2.2, 55, 28, 1.6), 0.5)
pad(S(54), S(56) - 0.3, [55.0, 65.41, 82.41], 0.05, fi=0.6, fo=0.4)
put(S(55) + 0.2, boom(2.0, 55, 28, 1.6), 0.5)
pad(S(56) - 0.3, end, [55.0, 82.41, 110.0, 130.81], 0.07, fi=0.6, fo=2.0)
arp(S(56), end - 1.0, [[110.0, 130.81, 164.81], [98.0, 116.54, 146.83]], 70, 0.035, decay=3.0)
put(S(57), boom(2.0, 60, 30, 2.0), 0.45)
save()
