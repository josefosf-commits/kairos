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

## Formato "comenta antes do fim" (desde o Caso 2)
- Logo no começo: "No final, eu vou te pedir pra apontar o culpado."
- Antes da revelação: tela "COMENTA AGORA" com os suspeitos marcados A, B e C e contagem de 5 s.
- O culpado é quem parece menos suspeito. As pistas são justas, mas as primeiras apontam para os suspeitos óbvios.
- No fim: "Se você acertou, comenta: eu sabia."

## Capa (padrão desde o Caso 2)
- Copiar `ep02-o-quadro/capa.html` e trocar só os textos. Sempre com o número do caso em destaque: faixa dourada grande "MISTÉRIO N" no alto, carimbo "CASO Nº N" e um "N" gigante e apagado atrás do Joseph.
- Pergunta do caso no alto ("Quem roubou...?"), JOSEPH / O CALCULISTA e a frase no rodapé. Sem entregar o culpado.

## Som (regra)
- **Sem chiado no fundo.** Não usar o `rainbed` (ruído contínuo de chuva) na `trilha.py`. Chuva e trovão só como efeito curto, na hora da cena. Nada de `noise()` tocando o vídeo inteiro.

## Estilo
- Noir: noite, chuva, trovões, fundo azul-escuro (#0b0f1a), dourado (GOLD) e vermelho (#e5484d).
- Estrutura do episódio: crime → 3 suspeitos com álibi → entrada do Joseph (título "JOSEPH, O CALCULISTA") → 3 pistas numeradas → teste que entrega o culpado → quadro com a conta ("= MENTIU") → "Os números não mentem. As pessoas, sim." → "CASO N · RESOLVIDO" + gancho do próximo caso.
- Série original: não copiar nomes, personagens, vilões ou casos de outras séries.

## Canal
- `canal/`: foto de perfil (`perfil.png`, 800x800) e banner (`banner.png`, 2560x1440). Gerar com `node canal/gerar.js`; `canal/build/banner-guias.png` mostra a área segura.

## Episódios
- `ep01-o-colar/`: Caso 1, O Colar e a Chuva (1:17). Roteiro, cena, trilha, capa, SEO e amostras de voz.
- `ep02-o-quadro/`: Caso 2, O Quadro no Escuro (2:22). Novidades: pede o palpite do público (A, B ou C, com contagem de 5 s) antes da revelação; a culpada é a suspeita menos provável (a leiloeira de 72 anos). O `collect.py` local é uma cópia do da `_lib` com o caminho dos resultados do Speko desta sessão.
- `ep03-o-trofeu/`: Caso 3, O Troféu do Intervalo (1:17). Futebol; culpado é o goleiro herói. Palpite A/B/C com contagem de 3 s; sem ruído de fundo.
- `especial01-o-elevador/`: Caso Especial 1, O Homem que Sumiu do Elevador (vídeo longo 16:9, 6:05). Duas pausas para o palpite (A–D e depois A–E); o culpado é a própria "vítima". Cena horizontal em `cena.js` com `capLong` (legenda grande para TV); capa em `capa.html` (1280x720).

## Vídeo longo semanal
- 1 por semana, 6 a 7 min, 16:9, história própria (não precisa ser dos shorts). Mesma estrutura dos shorts, mas com 4 suspeitos, 6 pistas, uma reviravolta no meio e 2 pausas para comentar.
- Para o próximo: copiar `especial01-o-elevador/cena.js` (funções `cctv`, `card`, `countdown`, `logTable`, `capLong`) e trocar só o `render`.

## Como rodar (dentro da pasta do episódio)
`node ../../../videos/_lib/render.js` e depois `bash ../../../videos/_lib/montar.sh` → `build/<NOME>.mp4`
