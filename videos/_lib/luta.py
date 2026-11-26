"""Efeitos sonoros de luta estilo anime (sintetizados do zero, sem samples): socos em camadas,
teleporte, investida, bloqueio metálico, carga de energia, raio, choque, explosão, apagão...
Uso: from luta import *  (depois de `from som import *`). Cada função devolve um array em SR."""
import numpy as np
from som import SR, rng, noise, lowpass


def _t(d):
    return np.arange(int(SR * d)) / SR


def band(x, lo=None, hi=None):
    """filtro passa-faixa por FFT (bom para trechos curtos e médios)"""
    X = np.fft.rfft(x); f = np.fft.rfftfreq(len(x), 1 / SR)
    m = np.ones_like(f)
    if lo: m *= 1 / (1 + (lo / np.maximum(f, 1)) ** 4)
    if hi: m *= 1 / (1 + (f / hi) ** 4)
    return np.fft.irfft(X * m, len(x))


def sat(x, k=2.0):
    return np.tanh(x * k) / np.tanh(k)


def verb(x, dur=0.9, decay=5.0, mix=0.25):
    ir = rng.uniform(-1, 1, int(SR * dur)) * np.exp(-_t(dur) * decay)
    ir = band(ir, 200, 7000); ir /= np.sqrt(np.sum(ir ** 2)) + 1e-9
    n = len(x) + len(ir)
    wet = np.fft.irfft(np.fft.rfft(x, n) * np.fft.rfft(ir, n), n)
    y = np.concatenate([x, np.zeros(len(ir))]) * (1 - mix) + wet * mix * 1.5
    return y


def chirp(d, f0, f1, curve=8.0):
    t = _t(d)
    f = f1 + (f0 - f1) * np.exp(-t * curve)
    return np.sin(2 * np.pi * np.cumsum(f) / SR)


def saw(f, t):
    return 2 * ((f * t) % 1.0) - 1


def punch(heavy=1.0):
    """soco pesado: grave que despenca + estalo + corpo saturado + rabo de reverb"""
    d = 0.5; t = _t(d)
    sub = chirp(d, 170 * heavy ** 0.2, 42, 14) * np.exp(-t * 9)
    body = sat(np.sin(2 * np.pi * np.cumsum(240 * np.exp(-t * 30) + 80) / SR) * np.exp(-t * 22), 3)
    crack = band(noise(d), 1500, 9000) * np.exp(-t * 90)
    slap = band(noise(d), 500, 2500) * np.exp(-t * 35)
    x = sub * 1.0 + body * 0.55 + crack * 0.9 + slap * 0.5
    return verb(sat(x * heavy, 1.6), 0.6, 6, 0.18)


def jab():
    """golpe rápido (para a sequência de socos)"""
    d = 0.22; t = _t(d); p = rng.uniform(0.85, 1.2)
    x = chirp(d, 220 * p, 70 * p, 25) * np.exp(-t * 20) + band(noise(d), 1200 * p, 7000) * np.exp(-t * 70) * 0.8
    return sat(x, 1.8)


def clang():
    """bloqueio metálico"""
    d = 1.2; t = _t(d)
    parts = [523, 1187, 1843, 2633, 3415, 4610]
    m = sum(np.sin(2 * np.pi * f * t + i) * np.exp(-t * (5 + i * 2.5)) for i, f in enumerate(parts)) / 3
    x = m * 0.8 + np.concatenate([punch(0.8), np.zeros(int(SR * d))])[:len(t)] * 0.6
    return x


def zip_tp():
    """teleporte: puxada curta (começa 0,12 s antes do ponto) + 'fwip' agudo"""
    pre = 0.12; d = pre + 0.25; t = _t(d)
    sw = band(noise(d), 2500, 10000) * np.clip(t / pre, 0, 1) ** 3 * np.exp(-np.maximum(t - pre, 0) * 45)
    ch = chirp(d, 900, 7000, -6) * np.exp(-np.maximum(t - pre, 0) * 35) * (t > pre * 0.6)
    return sw * 0.9 + ch * 0.35


def dash(d=0.55):
    """investida: vento com efeito doppler"""
    t = _t(d); e = np.sin(np.pi * t / d) ** 3
    x = band(noise(d), 300, 4000) * e
    w = np.sin(2 * np.pi * np.cumsum(900 - 500 * t / d) / SR) * e * 0.12
    return x + w


def whiff():
    """golpe no vazio"""
    return dash(0.3) * 0.8


def charge(d=4.0):
    """carga de energia: acorde que sobe + tremolo que acelera + estalos + grave"""
    t = _t(d); k = t / d
    f = 55 * (1 + k * 1.2)
    ph = np.cumsum(f) / SR
    x = (np.sin(2 * np.pi * ph) + 0.5 * np.sin(2 * np.pi * ph * 1.5) + 0.35 * np.sin(2 * np.pi * ph * 2.01) + 0.2 * saw(1, ph * 3))
    trem = 0.6 + 0.4 * np.sin(2 * np.pi * np.cumsum(5 + 25 * k ** 2) / SR)
    rum = band(noise(d), None, 120) * 3
    cr = crackle(d, 8 + 60 * k) * (0.2 + k)
    return (x * trem * 0.5 + rum * 0.4 + cr * 0.35) * (0.15 + 0.85 * k ** 1.5)


def crackle(d, dens=30):
    """estalos elétricos"""
    n = int(SR * d); y = np.zeros(n)
    c = int(d * dens if np.isscalar(dens) else 0)
    times = rng.uniform(0, d, max(c, int(np.mean(dens) * d) if not np.isscalar(dens) else c))
    for t0 in times:
        L = int(SR * rng.uniform(0.004, 0.03)); i = int(t0 * SR)
        if i + L < n: y[i:i + L] += rng.uniform(-1, 1, L) * np.exp(-np.arange(L) / L * 4) * rng.uniform(0.3, 1)
    return band(y, 1500, None)


def beam(d=3.0, f=98.0):
    """raio de energia contínuo: zumbido brilhante + chiado"""
    t = _t(d)
    fl = 1 + 0.02 * np.sin(2 * np.pi * 7 * t)
    ph = np.cumsum(f * fl) / SR
    x = (saw(1, ph) + 0.7 * saw(1, ph * 1.007) + 0.5 * saw(1, ph * 2.01) + 0.3 * saw(1, ph * 3.02)) / 2.5
    x = band(x, None, 3500)
    h = band(noise(d), 3000, None) * 0.35
    e = np.clip(t / 0.06, 0, 1) * np.clip((d - t) / 0.3, 0, 1)
    return (x * 0.7 + h) * e * (0.85 + 0.15 * np.sin(2 * np.pi * 13 * t))


def laser(d=0.9):
    """raio dos olhos"""
    t = _t(d)
    f = 2200 * np.exp(-t * 3) + 500 + 120 * np.sin(2 * np.pi * 40 * t)
    x = np.sin(2 * np.pi * np.cumsum(f) / SR) * np.exp(-t * 1.5)
    return x * 0.6 + band(noise(d), 2000, None) * np.exp(-t * 3) * 0.3


def explosion(d=4.0, big=1.0):
    """explosão grande: grave longo + ruído que cai + detritos"""
    t = _t(d)
    sub = chirp(d, 90, 24, 2.5) * np.exp(-t * 1.3)
    body = band(noise(d), None, 900) * np.exp(-t * 1.8) * 2.2
    top = band(noise(d), 1500, None) * np.exp(-t * 6) * 0.6
    deb = crackle(d, 25) * np.exp(-t * 1.2) * 0.4
    x = sat((sub * 1.2 + body + top) * big, 1.4) + deb
    return x


def tinnitus(d=2.2):
    """zumbido no ouvido depois da explosão"""
    t = _t(d)
    return np.sin(2 * np.pi * 3700 * t) * np.sin(np.pi * t / d) ** 2 * 0.25


def power_down(d=1.1):
    """máquina desligando (apagão de uma casa)"""
    t = _t(d)
    f = 40 + 700 * np.exp(-t * 3.2)
    ph = np.cumsum(f) / SR
    x = (np.sin(2 * np.pi * ph) + 0.4 * saw(1, ph)) * np.exp(-t * 2.2)
    k = np.zeros(len(t)); n = int(SR * 0.25); tt = np.arange(n) / SR
    k[:n] = np.sin(2 * np.pi * np.cumsum(120 * np.exp(-tt * 20) + 40) / SR) * np.exp(-tt * 18)
    return band(x, None, 2500) * 0.6 + k * 0.8


def stomp(heavy=1.0):
    """passo/crescimento gigante"""
    d = 0.9; t = _t(d)
    return sat(chirp(d, 80, 28, 6) * np.exp(-t * 5) * 1.3 + band(noise(d), None, 300) * np.exp(-t * 7) * 1.5, 1.5) * heavy


def rumble(d=3.0):
    """chão tremendo"""
    t = _t(d)
    return band(noise(d), 20, 90) * 4 * np.sin(np.pi * t / d) ** 0.5


def creak(d=2.0):
    """metal rangendo (carro/poste levantando)"""
    t = _t(d); y = np.zeros(len(t))
    for t0 in rng.uniform(0, d - 0.4, 6):
        L = 0.35; tt = _t(L); f0 = rng.uniform(180, 420)
        s = np.sin(2 * np.pi * np.cumsum(f0 + 60 * np.sin(2 * np.pi * 9 * tt)) / SR) * np.sin(np.pi * tt / L)
        i = int(t0 * SR); y[i:i + len(s)] += sat(s * 2, 2) * 0.4
    return band(y, 120, 3000)


def slowmo():
    """entrada de câmera lenta: 'vuuum' grave que desce"""
    d = 1.0; t = _t(d)
    x = np.sin(2 * np.pi * np.cumsum(320 * np.exp(-t * 3) + 45) / SR) * np.sin(np.pi * t / d)
    return x * 0.6 + band(noise(d), 80, 600) * np.sin(np.pi * t / d) * 0.6


def riser(d=2.0, f0=200, f1=2400):
    """subida de tensão"""
    t = _t(d); k = t / d
    f = f0 * (f1 / f0) ** k
    x = np.sin(2 * np.pi * np.cumsum(f) / SR) * k ** 2 + band(noise(d), 1000, None) * k ** 3 * 0.5
    return x


def fire(d=4.0):
    """fogo crepitando"""
    t = _t(d)
    return band(noise(d), None, 700) * 0.8 * np.clip(np.minimum(t / 0.2, (d - t) / 1.0), 0, 1) + crackle(d, 20) * 0.25


def thunk():
    """objeto cravando no chão"""
    d = 0.4; t = _t(d)
    return sat(chirp(d, 300, 90, 20) * np.exp(-t * 14) + band(noise(d), 300, 3000) * np.exp(-t * 40) * 0.6, 2)


def heartbeat():
    d = 0.7; t = _t(d)
    one = lambda: np.sin(2 * np.pi * 52 * _t(0.18)) * np.exp(-_t(0.18) * 20)
    y = np.zeros(len(t)); a = one(); y[:len(a)] += a; i = int(0.22 * SR); y[i:i + len(a)] += a * 0.7
    return y
