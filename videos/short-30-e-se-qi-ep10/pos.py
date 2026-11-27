# pós-narração: voz do robô (R), corta silêncio nas pontas, refaz tempos e amp (30 fps)
import json, subprocess, numpy as np, wave
R = "flanger=delay=1.5:depth=3:speed=6:regen=40,acrusher=bits=10:mix=0.35,highpass=f=180,volume=1.3"
TRIM = "silenceremove=start_periods=1:start_threshold=-45dB,areverse,silenceremove=start_periods=1:start_threshold=-45dB,areverse,apad=pad_dur=0.08"
sp = json.load(open('roteiro.json')); tl = json.load(open('timeline.json'))
t = 0.0
for L, S in zip(tl['lines'], sp['lines']):
    src = L['audio']; raw = src.replace('.wav', '.raw.wav')
    import os
    if not os.path.exists(raw): os.rename(src, raw)
    af = TRIM + ("," + R if S['who'] == 'R' else "")
    subprocess.run(['ffmpeg', '-y', '-loglevel', 'error', '-i', raw, '-af', af, '-ar', '24000', '-ac', '1', src], check=True)
    w = wave.open(src); x = np.frombuffer(w.readframes(w.getnframes()), np.int16).astype(float); sr = w.getframerate()
    d = len(x) / sr; n = int(np.ceil(d * 30)); fr = sr // 30
    rms = np.array([np.sqrt(np.mean(x[i*fr:(i+1)*fr]**2)) if len(x[i*fr:(i+1)*fr]) else 0 for i in range(n)])
    amp = np.round(np.clip(rms / (np.percentile(rms, 90) + 1e-6), 0, 1), 2).tolist()
    start = S.get('at', t + S.get('gap', 0.5))
    L.update(start=round(start, 2), end=round(start + d, 2), amp=amp, who=S['who']); t = start + d
tl['duration'] = round(t + sp['tail'], 2)
json.dump(tl, open('timeline.json', 'w'), ensure_ascii=False, indent=1)
print('dur', tl['duration']); [print(L['id'], L['who'], L['start'], L['end'], L['text'][:40]) for L in tl['lines']]
