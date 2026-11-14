# DISCIPLINA — curta animado (canal Joseph)

Curta de ~1:30. O Joseph começa a correr acompanhado da **Motivação** — uma chaminha que grita e empurra.
Ela se atrasa, some na chuva e não volta. Ele vai assim mesmo, por 60 dias. Na linha de chegada, ela reaparece.

| Parte | Arquivo |
|---|---|
| Roteiro, tempos e legendas | `timeline.json` (17 falas) |
| Narração | `audio/l1.wav` … `audio/l17.wav` — Speko/Cartesia, voz "Bruno" |
| Animação | `cena.html` — Joseph de perfil com ciclo de corrida, rua com parallax, chuva, porta, prova |
| Gravação dos quadros | `render.js` (Playwright → ffmpeg, 30 fps) |
| Trilha e efeitos | `trilha.py` — lê as tabelas `SPEED`/`GAIT`/`RAIN` da cena para sincronizar passos e chuva |
| Mixagem final | `montar.sh` |
| Título, descrição, capítulos | `publicacao.md` |

## Como gerar

```bash
node render.js            # build/video-mudo.mp4
python3 trilha.py         # build/trilha.wav
./montar.sh               # build/DISCIPLINA.mp4
node render.js thumb      # build/thumbnail.png
node render.js stills 12,27,66   # quadros soltos para revisão
```
