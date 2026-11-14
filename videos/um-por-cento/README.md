# 1% POR DIA — curta animado (canal Joseph)

Feito com a biblioteca comum em `../_lib` (Joseph de frente e de perfil, cenários, legendas, cartões, sons).

| Parte | Arquivo |
|---|---|
| Roteiro (falas e pausas) | `roteiro.json` → `timeline.json` via `../_lib/collect.py` |
| Narração | `audio/` — Speko/Cartesia, voz "Bruno" |
| Animação | `cena.html` (usa `../_lib/rig.js`) |
| Trilha | `trilha.py` (usa `../_lib/som.py`) |
| Capa | `thumb.json` |
| Publicação | `publicacao.md` |

```bash
node ../_lib/render.js            # build/video-mudo.mp4
python3 trilha.py                 # build/trilha.wav
../_lib/montar.sh                 # build/<NOME>.mp4
node ../_lib/render.js thumb      # build/thumbnail.png
```
