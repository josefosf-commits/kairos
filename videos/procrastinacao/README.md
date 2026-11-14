# PROCRASTINAÇÃO — curta animado (canal Joseph)

Curta de 4:04. O Joseph de Hoje joga cada tarefa na mochila do **Joseph de Amanhã**, que vai se curvando
até desabar na véspera da entrega — e a etiqueta "JOSEPH DE AMANHÃ" vira "VOCÊ". Depois, 4 técnicas
práticas esvaziam a mochila, e os dois se fundem num só.

| Parte | Arquivo |
|---|---|
| Roteiro, tempos e legendas | `timeline.json` (42 falas) |
| Narração | `audio/l1.wav` … `audio/l42.wav` — Speko/Cartesia, voz "Bruno" |
| Animação | `cena.html` — escritório com porta e calendário, os dois Josephs, mochila com caixas, ciclo da procrastinação, cartões das técnicas, recapitulação |
| Gravação dos quadros | `render.js` (Playwright → ffmpeg, 30 fps; `thumb` gera a capa) |
| Trilha e efeitos | `trilha.py` |
| Mixagem final | `montar.sh` |
| Título, descrição, capítulos | `publicacao.md` |

## Como gerar

```bash
node render.js            # build/video-mudo.mp4  (~7 min)
python3 trilha.py         # build/trilha.wav
./montar.sh               # build/PROCRASTINACAO.mp4
node render.js thumb      # build/thumbnail.png
node render.js stills 49,108,176   # quadros soltos para revisão
```
