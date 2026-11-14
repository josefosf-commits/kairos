# FOCO — piloto (canal Joseph)

Piloto de ~28s do curta animado **FOCO**, feito inteiramente por código.

| Parte | Como é feita |
|---|---|
| Narração | Speko → Cartesia, voz "Bruno" (pt-BR), um arquivo por fala em `audio/` |
| Tempos e legendas | `timeline.json` (início/fim de cada fala) |
| Animação | `cena.html` — SVG desenhado e animado por uma função `render(t)` |
| Gravação dos quadros | `render.js` — Playwright grava 30 fps e envia ao ffmpeg |
| Trilha e efeitos | `trilha.py` — pad, ding, swipes, tic-tac e impacto, sintetizados |
| Mixagem final | `montar.sh` — narração + trilha com ducking, loudness -14 LUFS |

## Como gerar

```bash
node render.js                          # build/video-mudo.mp4
python3 trilha.py                       # build/trilha.wav
./montar.sh                             # build/FOCO-piloto.mp4
node render.js stills 5.5,12,21         # quadros soltos para revisão
```

Fonte: Kalam (SIL OFL, ver `assets/kalam-LICENSE`).
