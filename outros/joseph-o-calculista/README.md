# Joseph, o Calculista — série de investigação (outro canal, teste)

Projeto separado do canal Joseph Disciplinado. Não usa o SEO nem as regras de `videos/`.

## Personagem
- Arte do usuário: `ep01-o-colar/assets/joseph-original.png`. Recorte com fundo transparente: `ep01-o-colar/assets/joseph.png` (791x1249).
- Visual: black power volumoso, terno, camisa e gravata pretos, lenço branco no bolso, relógio prateado, brincos.
- Por enquanto só existe 1 pose (mãos no bolso). Para a série, pedir ao gerador da arte mais 3 ou 4 poses: apontando, de lado, mão no queixo.

## Voz (aprovada: "B, mais grave")
1. Narração com a voz Bruno (Cartesia `b603811e-54c2-4a0a-8854-09eab9ffa63f`, via Speko), `speed` 0.92.
2. Depois, cada fala passa por este filtro do ffmpeg (tom cerca de 4 semitons mais grave, mesma duração, eco leve):
   `ffmpeg -i audio/lN.wav -af "asetrate=24000*0.79,aresample=24000,atempo=1.2658,aecho=0.8:0.7:40:0.18,volume=1.25" -ar 24000 audio-grave/lN.wav`
3. No `timeline.json`, trocar `audio/` por `audio-grave/` antes de rodar o `montar.sh`.

## Estilo
- Noir: noite, chuva, trovões, fundo azul-escuro (#0b0f1a), dourado (GOLD) e vermelho (#e5484d).
- Estrutura do episódio: crime → 3 suspeitos com álibi → entrada do Joseph (título "JOSEPH, O CALCULISTA") → 3 pistas numeradas → teste que entrega o culpado → quadro com a conta ("= MENTIU") → "Os números não mentem. As pessoas, sim." → "CASO N · RESOLVIDO" + gancho do próximo caso.
- Série original: não copiar nomes, personagens, vilões ou casos de outras séries.

## Episódios
- `ep01-o-colar/`: Caso 1, O Colar e a Chuva (1:17). Roteiro, cena, trilha, SEO e amostras de voz. **Capa oficial (estilo pôster de série):** `capa.js` → `build/capa-serie.png`. Nome "JOSEPH / O CALCULISTA" em serifa dourada, contas ao fundo, selos "SÉRIE · EP. 1" e "CASO Nº 1", pergunta do caso no topo, frase-assinatura embaixo. Usar esse modelo em todos os episódios.

## Como rodar (dentro da pasta do episódio)
`node ../../../videos/_lib/render.js` e depois `bash ../../../videos/_lib/montar.sh` → `build/<NOME>.mp4`
