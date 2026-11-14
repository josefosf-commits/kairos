"""Organiza a narração de um curta.

Uso: python3 ../_lib/collect.py roteiro.json ids.txt
- roteiro.json: {"name": "ARQUIVO", "tail": 12, "lines": [{"id":1, "text":"...", "gap":1.0, "nocap":false}, ...]}
  gap = segundos de silêncio antes da fala (pausas visuais); "at" força o início absoluto.
- ids.txt: ids dos resultados do Speko, na mesma ordem das falas.
Copia os WAVs para audio/, calcula os tempos e escreve timeline.json.
"""
import json, subprocess, sys, hashlib
from pathlib import Path
R = Path("/root/.claude/projects/-home-user-kairos/593589ff-6868-5eeb-b05a-08dc925cf235/tool-results")
spec = json.load(open(sys.argv[1]))
ids = open(sys.argv[2]).read().split()
assert len(ids) == len(spec["lines"]), (len(ids), len(spec["lines"]))
Path("audio").mkdir(exist_ok=True)
t, out, seen = 0.0, [], set()
for L, rid in zip(spec["lines"], ids):
    txt = (R / f"mcp-Speko-audio_synthesize-{rid}.txt").read_text()
    wav = txt.split("saved to ")[1].split(".wav")[0] + ".wav"
    dst = Path(f"audio/l{L['id']}.wav")
    dst.write_bytes(Path(wav).read_bytes())
    h = hashlib.md5(dst.read_bytes()).hexdigest()
    assert h not in seen, f"duplicate audio for line {L['id']}"
    seen.add(h)
    d = float(subprocess.check_output(["ffprobe", "-v", "error", "-show_entries", "format=duration", "-of", "csv=p=0", str(dst)]))
    start = L.get("at", t + L.get("gap", 0.8))
    item = {"id": L["id"], "audio": str(dst), "start": round(start, 2), "end": round(start + d, 2), "text": L["text"]}
    if L.get("nocap"): item["nocap"] = True
    out.append(item)
    t = start + d
dur = round(t + spec.get("tail", 12), 2)
meta = {"w": 1080, "h": 1920} if spec.get("vertical") else {}
json.dump({"name": spec["name"], "duration": dur, "fps": 30, **meta, "lines": out}, open("timeline.json", "w"), ensure_ascii=False, indent=1)
print(f"ok {len(out)} falas, duração {dur:.1f}s ({int(dur//60)}:{int(dur%60):02d})")
for L in out: print(f"  {L['id']:>2} {L['start']:7.2f}-{L['end']:7.2f} {L['text'][:60]}")
