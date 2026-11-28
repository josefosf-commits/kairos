# pós-narração da Arena 3: vozes (A locutor, Z Zib, V Vorg, S Nyx), corta silêncio, refaz tempos e amp (30 fps)
import json, subprocess, numpy as np, wave, os
FX = {
 'A': "asetrate=24000*0.84,aresample=24000,atempo=1.19,aecho=0.8:0.6:80|160:0.35|0.2,volume=1.25",
 'Z': "asetrate=24000*1.32,aresample=24000,atempo=0.76,volume=1.1",
 'V': "asetrate=24000*0.74,aresample=24000,atempo=1.25,acompressor=threshold=0.1:ratio=4,aecho=0.7:0.5:30:0.25,volume=1.4",
 'S': "asetrate=24000*1.06,aresample=24000,atempo=0.94,chorus=0.6:0.9:50|60:0.4|0.32:0.25|0.4:2|2.3,aecho=0.8:0.7:60|120:0.45|0.3,volume=1.35",
}
TRIM = "silenceremove=start_periods=1:start_threshold=-45dB,areverse,silenceremove=start_periods=1:start_threshold=-45dB,areverse,apad=pad_dur=0.08"
sp = json.load(open('roteiro.json')); tl = json.load(open('timeline.json'))
t = 0.0
for L, S in zip(tl['lines'], sp['lines']):
    src = L['audio']; raw = src.replace('.wav', '.raw.wav')
    if not os.path.exists(raw): os.rename(src, raw)
    af = TRIM + ("," + FX[S['who']] if S['who'] in FX else "")
    subprocess.run(['ffmpeg', '-y', '-loglevel', 'error', '-i', raw, '-af', af, '-ar', '24000', '-ac', '1', src], check=True)
    w = wave.open(src); x = np.frombuffer(w.readframes(w.getnframes()), np.int16).astype(float); sr = w.getframerate()
    d = len(x) / sr; n = int(np.ceil(d * 30)); fr = sr // 30
    rms = np.array([np.sqrt(np.mean(x[i*fr:(i+1)*fr]**2)) if len(x[i*fr:(i+1)*fr]) else 0 for i in range(n)])
    amp = np.round(np.clip(rms / (np.percentile(rms, 90) + 1e-6), 0, 1), 2).tolist()
    start = S.get('at', t + S.get('gap', 0.5))
    L.update(start=round(start, 2), end=round(start + d, 2), amp=amp, who=S['who']); t = start + d
tl['duration'] = round(t + sp['tail'], 2)
json.dump(tl, open('timeline.json', 'w'), ensure_ascii=False, indent=1)
print('dur', tl['duration']); [print(L['id'], L['who'], L['start'], L['end'], L['text'][:50]) for L in tl['lines']]
