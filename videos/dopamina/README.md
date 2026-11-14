# DOPAMINA — curta animado (canal Joseph)

Curta de 4:05 sobre vencer a dopamina do celular, com a parte educativa (gráfico de dopamina,
tempo de tela) e os benefícios mostrados na tela: **o mundo perde a cor enquanto ele vive no
celular e as cores voltam uma a uma** — sono, leitura, corrida, conversa, pôr do sol.

| Parte | Arquivo |
|---|---|
| Roteiro, tempos e legendas | `timeline.json` (46 falas) |
| Narração | `audio/l1.wav` … `audio/l46.wav` — Speko/Cartesia, voz "Bruno" |
| Animação (23 cenas) | `cena.html` — Joseph de frente e de perfil, amigo, cama, jantar, janela, rua, gráfico, cartões |
| Gravação dos quadros | `render.js` (Playwright → ffmpeg, 30 fps) |
| Trilha e efeitos | `trilha.py` |
| Mixagem final | `montar.sh` |
| Thumbnail antes/depois | `thumb.js` |
| Título, descrição, capítulos | `publicacao.md` |

## Atos

| Tempo | Ato |
|---|---|
| 0:00 | O ciclo — celular antes de abrir os olhos; gráfico de dopamina; "busca, não prazer"; feed infinito |
| 0:32 | O preço — tolerância; o mundo fica cinza; livro, conversa, pôr do sol, silêncio; 2h da manhã |
| 1:24 | A decisão — 7h/dia de tela (≈44% do dia acordado); as 4 regras do teste de 30 dias |
| 1:48 | Os piores dias — vibração fantasma, inquietação, abstinência no gráfico, recalibrando |
| 2:11 | As cores voltam — sono, leitura, corrida, risada com o amigo, pôr do sol colorido, prazeres simples |
| 2:54 | No controle — pega o celular de volta, liga para a mãe, deixa de lado |
| 3:12 | Recapitulação — Sono, Foco, Presença, Energia, Calma |
| 3:50 | "Desligue o automático. Recupere a sua atenção." |

## Como gerar

```bash
node render.js            # build/video-mudo.mp4  (~7 min)
python3 trilha.py         # build/trilha.wav
./montar.sh               # build/DOPAMINA.mp4
node thumb.js             # build/thumbnail.png
node render.js stills 44,158,200   # quadros soltos para revisão
```
