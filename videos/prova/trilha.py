"""Trilha de PROVA.: piano triste na nota 2, título, relógio da véspera, regras com batida leve,
semanas em crescendo, tensão na questão 7, silêncio, e final feliz no 8,5."""
import sys
sys.path.insert(0, "../_lib")
from som import *
end = TL["duration"]
def piano(a, b, chords, bpm, gain):
    arp(a, b, chords, bpm, gain, bar=2.0, decay=3.5)
# 1) a nota 2, a conta, a dúvida
put(S(1) - 0.1, boom(2.0, 70, 38, 1.8), 0.4)
pad(0.2, E(5) + 0.5, Am, 0.06, fi=0.8, fo=0.6)
piano(1.0, E(5) + 0.3, [Am, F, C, G], 72, 0.03)
# 2) título
put(E(5) + 0.8, boom(2.6, 80, 40, 1.8), 0.45)
put(E(5) + 0.8, tone([220.0, 261.63, 329.63, 440.0], 3.5, 0.9), 0.09)
# 3) jeito antigo: relógio, notificações
pad(S(6) - 0.6, S(9) - 0.5, [55.0, 82.41, 110.0], 0.06, fi=0.5, fo=0.5)
beat(S(6), S(8) - 0.5, 60, 0.05, fn=lambda: tone([1760.0], 0.03, 60))
for i in range(5):
    put(S(8) + 1.2 + i * 0.9, tone([1318.5, 1760.0], 0.12, 25), 0.05)
# 4) três regras: virada, batida leve
put(S(9) - 0.4, whoosh(0.6), 0.08)
pad(S(9) - 0.5, S(14) - 0.8, [65.41] + C, 0.06, fi=0.6, fo=0.6, bright=0.2)
piano(S(9), S(14) - 1.0, [C, G, Am, F], 92, 0.035)
beat(S(10), S(14) - 1.0, 92, 0.07)
for a in [S(10) - 0.3, S(12) - 0.3, S(13) - 0.3]:
    chime(a, 0.06)
# 5) semanas: começa pesado, vai clareando
pad(S(14) - 0.8, S(17) - 0.7, Am, 0.06, fi=0.5, fo=0.5)
piano(S(14), S(17) - 0.8, [Am, F, Am, Em], 76, 0.03)
pad(S(17) - 0.7, S(23) - 0.9, [65.41] + C, 0.06, fi=0.6, fo=0.6, bright=0.3)
piano(S(17), S(23) - 1.0, [C, G, Am, F], 104, 0.04)
beat(S(19), S(23) - 1.0, 104, 0.09)
# 6) dia da prova: tensão
put(S(23) - 0.6, boom(2.4, 60, 30, 2.0), 0.4)
pad(S(23) - 0.6, S(26) - 0.2, [55.0, 82.41], 0.06, fi=0.4, fo=0.3)
beat(S(24), S(26) - 0.2, 70, 0.06, fn=lambda: kick(70, 40, 0.5))
put(S(26), sweep(1.8, 300, 120), 0.06)
pad(S(26), S(28) - 0.2, [49.0, 51.91, 73.42], 0.07, fi=0.6, fo=0.4)
beat(S(26), S(28) - 0.2, 96, 0.08, fn=lambda: kick(70, 40, 0.5))
# 7) respirou: resolve
pad(S(28) - 0.2, S(31) - 0.9, [65.41] + C, 0.05, fi=1.0, fo=0.6)
piano(S(29), S(31) - 1.0, [C, G], 84, 0.03)
# 8) resultado
pad(S(31) - 0.9, S(32) - 0.5, [55.0, 82.41], 0.05, fi=0.4, fo=0.2)
put(S(32) - 0.1, boom(2.4, 90, 45, 1.6), 0.45)
put(S(32), tone([523.25, 659.25, 783.99, 1046.5], 3.0, 1.0), 0.10)
pad(S(32), end, [65.41] + C, 0.07, fi=0.4, fo=2.0, bright=0.35)
piano(S(33), E(39) + 1.0, [C, G, Am, F], 100, 0.045)
beat(S(36), E(38), 100, 0.08)
save()
