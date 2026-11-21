"""Trilha do TESTE 3D "E se?": curiosidade leve, poof no celular, ideia, noite, retorno do celular, pergunta final."""
import sys
sys.path.insert(0, "../_lib")
from som import *
end = TL["duration"]
pad(0.0, S(2) - 0.3, [65.41] + C, 0.06, fi=1.0, fo=0.3)
arp(0.3, end - 0.6, [C, Am, F, G], 96, 0.035, decay=4)
put(3.5, whoosh(0.5), 0.12); put(3.7, tone([1567.98, 2093.0, 2637.0], 0.6, 7), 0.07)
beat(S(2), S(4) - 0.3, 96, 0.12)
put(S(3) + 2.8, tone([523.25, 659.25, 783.99, 1046.5], 1.2, 3), 0.09)
pad(S(4) - 0.2, S(4) + 1.4, [55.0, 82.41, 110.0], 0.06, fi=0.3, fo=0.4)
chime(S(4) + 1.6, 0.07)
put(S(5) + 0.1, sweep(1.3, 300, 1400), 0.06)
put(S(5) + 1.3, boom(1.6, 80, 45, 2.0), 0.35)
beat(S(5), S(6) - 0.2, 96, 0.16)
put(S(6) + 2.2, tone([523.25, 659.25, 783.99], 0.8, 4), 0.08)
save()
