# FOCO — curta animado (canal Joseph)

Curta de ~2:07 sobre distração e foco, com o personagem **Joseph** (pardo, forte, moletom verde-oliva).
Tudo é gerado por código neste diretório.

| Parte | Arquivo |
|---|---|
| Roteiro, tempos e legendas | `timeline.json` (25 falas) |
| Narração | `audio/l1.wav` … `audio/l25.wav` — Speko/Cartesia, voz "Bruno"; l20 é a voz da tentação ("Diogo") |
| Animação (7 atos) | `cena.html` — SVG desenhado por `render(t)` |
| Gravação dos quadros | `render.js` (Playwright → ffmpeg, 30 fps) |
| Trilha e efeitos | `trilha.py` (numpy) |
| Mixagem final | `montar.sh` — ducking + eco na voz da tentação, -14 LUFS |
| Título, descrição, capítulos | `publicacao.md` |

## Atos

| Tempo | Ato |
|---|---|
| 0:00 | Todo dia era igual — celular engole o dia; os dias viram meses |
| 0:31 | A tela preta — a bateria acaba e ele se vê no reflexo |
| 0:41 | O fundo do poço — "Você foi desligado do projeto." |
| 0:53 | Dia 1 — guarda o celular na gaveta |
| 1:03 | A rotina — Dia 1, 10, 30… páginas acumulando |
| 1:24 | A última tentação — a gaveta se abre sozinha; ele fecha |
| 1:40 | A entrega — carimbo "ENTREGUE", nascer do sol |
| 1:51 | Hoje, não amanhã — frase final e título |

## Como gerar

```bash
node render.js            # build/video-mudo.mp4
python3 trilha.py         # build/trilha.wav
./montar.sh               # build/FOCO.mp4
node render.js thumb      # build/thumbnail.png
node render.js stills 12,60,96   # quadros soltos para revisão
```
