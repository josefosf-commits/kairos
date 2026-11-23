# Canal Joseph — regras do projeto

Canal de YouTube em português (pt-BR) com curtas animados sobre disciplina, foco e hábitos. O personagem é o Joseph: pardo (#a86f4a), mais forte, moletom verde-oliva (#4f5d40). A narração usa a voz "Bruno" (Cartesia `b603811e-54c2-4a0a-8854-09eab9ffa63f`, via Speko). Os vídeos longos têm de 4 a 5 minutos; os shorts são verticais, com até 60 s.

## Entrega obrigatória em TODO vídeo novo (longo ou short)

Junto com o MP4 e a thumbnail, sempre entregar o pacote completo de SEO. Ele vai em `seo.md`, na pasta do vídeo, e numa nova seção de `videos/SEO.md`, seguindo o mesmo modelo:
- Título principal (palavra-chave no começo, até 60 caracteres antes do " | ") e 2 títulos alternativos para teste A/B
- Texto da thumbnail
- Descrição completa: 2 primeiras linhas com palavra-chave e gancho, capítulos com tempos reais do `timeline.json`, técnicas numeradas, link para o próximo vídeo, aviso de saúde quando o tema pedir (CVV 188 em saúde mental), chamada para se inscrever e 3 a 5 hashtags
- Tags (até 500 caracteres, da mais importante para a menos importante)
- Palavras-chave: principal, secundárias e frases longas
- Comentário fixado
- Playlist(s) e tela final (para shorts: vídeo relacionado)
- Configurações comuns: Educação, pt-BR, "não é conteúdo para crianças"

## Plataforma: siga exatamente o que o usuário pedir

- **"YouTube"**: formato YouTube. Longo em 16:9 1920x1080, short vertical; SEO do YouTube (título, descrição com capítulos, tags, #shorts).
- **"Instagram"**: formato Instagram. Reel vertical 1080x1920 com o conteúdo importante no centro 3:4, para a grade do perfil; carrossel em 4:5, 1080x1350. Legenda do Instagram com gancho na 1ª linha, CTA e hashtags (sem #shorts). Arquivos em `instagram/`.
- Não misturar: não entregar formato de YouTube quando o pedido for Instagram, e vice-versa.

## Público (YouTube Studio): use ao escolher temas

**Atualizado em 19/11/2026 (28 dias, público mensal 9,3 mil):**
- Idade: 13–17: 27,0% · 18–24: 13,0% · 25–34: 21,5% · 35–44: 24,8% · 45–54: 10,7% · 55+: 2,9%.
- Gênero: masculino 65,6% · feminino 34,4%.
- Região: Brasil 92,8% · Portugal 2,9% · Angola 0,9%. Pode usar referências brasileiras.
- Dispositivo: **TV 39,1%** (o resto é quase tudo celular). Texto grande e legível em tudo: legendas, thumbnails e números na tela.
- **99,9% dos espectadores são novos** (casuais e frequentes < 0,1%). Quase ninguém volta. Esse é o maior problema do canal.
- Mais vistos por novos espectadores: O Ladrão das 2 da Manhã (1,6 mil), 1% por dia, Os Cadeados, Ladrão do Tempo, Ladrão da Energia (1,2 a 1,3 mil). **O universo dos Ladrões domina.**

**O que mudou desde 16/11:** o público ficou mais jovem e mais masculino. 13 a 24 anos foi de 35% para 40%. 35 a 44 caiu de 30% para 25%, mas ainda é o 2º maior grupo. Mulheres foram de 39% para 34%.

**Estratégia:**
1. **Shorts são o motor** (mais de 95% das views). Postar pelo menos 1 por dia, sem pausa. Quando houver créditos, produzir em lote e agendar.
2. **Séries com personagens fixos, para criar quem volta:** Os Ladrões (temporada 2), Desafio 30 Dias. Toda série termina com gancho para o próximo episódio. Playlist para cada série.
3. **Mistura de temas nos shorts:** cerca de 2 de jovem (escola, celular, sono, foco, games, primeiro emprego) para 1 de adulto (família, saúde, trabalho, recomeço). O short adulto "A Mãe do Joseph" teve o maior ritmo da semana, então manter os adultos, mas em menor proporção.
4. **Evitar conceitos abstratos.** O "Piloto Automático" foi o pior short (325 views). Histórias concretas com vilão e situação do dia a dia funcionam.
5. **Vídeos longos:** no máximo 1 por semana, sempre com um short "trailer" ligado a ele (vídeo relacionado). Os longos ainda têm poucas views (20 a 190).
6. **Converter em inscritos:** gancho de série no fim ("o próximo ladrão sai amanhã") em vez de "se inscreva" genérico. Comentário fixado com resposta curta (SIM/NÃO, um número). Lembrar que 39% assistem na TV, onde é difícil se inscrever: pedir para seguir "pra não perder o próximo episódio".
7. Formato que mais performa nos longos: história emocional de esforço, título curto, thumbnail com rosto + 1 a 3 palavras ou um número forte ("7 HORAS POR DIA", "AOS 43", antes/depois).
8. Revisar estes números toda semana enquanto o canal é novo.
9. **Checado em 19/11 (prints de 22/10 a 18/11):** "Tudo" ≈ "Shorts". A aba "Vídeos" mostrou 13–17 = 100%, mas com poucas views: é amostra pequena, não é conclusão. Junto com o desempenho (longos jovens/universais: 117 a 189 views; RECOMEÇA., adulto: 23 views em 2 dias), o sinal é que **o público dos longos é mais jovem do que se apostou**. Por enquanto: longos com tema jovem/universal (escola, prova, celular, sono, foco, primeiro emprego) ou compilação dos Ladrões; o tema adulto fica nos shorts. Reavaliar a aba "Vídeos" em 1 a 2 semanas.

## Série "E se? QI dobrado" (3D) — prioridade (23/11/2026)

- Quando o usuário pedir "mais um short" sem dizer o tema, **fazer o próximo episódio da série do QI** (ep. 1 a 3 = shorts 20 a 22; cada um termina com gancho "dia X em breve"). Se o pedido for ambíguo, perguntar antes de gastar créditos.
- O usuário achou fraco o short solto "tempo de celular na testa" (short 23): evitar temas soltos desse tipo; preferir histórias da série com vilão (o robô) e gancho.
- Base técnica: `videos/_lib/mundo3d.js` + copiar `src/cena3d.js` do episódio anterior (robô, botão, celular, quarto já prontos).

## Plano de publicação (combinado em 19/11/2026)

- **Semana-modelo:** segunda a sábado, 2 shorts por dia (cerca de 12h e 19h); domingo, 1 vídeo longo + 1 short "trailer" dele (com o longo como vídeo relacionado). Mínimo absoluto: 1 short por dia, sem pausa.
- **Os 2 shorts do dia:** ~12h, um episódio de série (alternar Ladrões T2 e Desafio 30 Dias); ~19h, um short solto (cerca de 2 de jovem para 1 de adulto).
- **Horários:** começar com 12h e 19h e ajustar quando o Studio mostrar "Quando seus espectadores estão no YouTube".
- **Longo barato:** de vez em quando, o longo da semana é a compilação de uma série completa ("Os Ladrões do Joseph: temporada 1", "Desafio 30 Dias: o filme"). Reaproveita material e funciona na TV.
- **Produção em lote:** 3 a 4 shorts por sessão; o usuário agenda no Studio ("Programar").

### Economia de créditos (o usuário precisa de créditos para outras atividades)
- Narração (Speko): cerca de US$ 0,04 por short e US$ 0,18 por longo; saldo de US$ 6,68 em 19/11, dá para 9 a 10 semanas. Conferir o saldo de vez em quando com `credits_balance_get`.
- O que mais gasta é o uso do Claude (escrever as cenas, conferir quadros, renderizar). Para economizar:
  - reaproveitar cenários, personagens e funções das séries (copiar `cena.js` do episódio anterior e trocar só o `render`);
  - conferir tudo numa única folha de quadros (`vsheet.sh`/`sheet.sh`) e corrigir em uma rodada;
  - não refazer thumbnails sem pedido;
  - parar depois do lote combinado.
- Se os créditos apertarem, cair para 1 short por dia e trocar o longo da semana por uma compilação.

## Estrutura

- `videos/_lib/`: biblioteca comum (rig.js, short.js, som.py, render.js, montar.sh, collect.py, fila.sh)
- `videos/<curta>/`: roteiro.json → narração (Speko) → collect.py → timeline.json → cena.html/js + trilha.py → render.js → montar.sh
- `videos/canal/`: logo e capa do canal
- `videos/SEO.md`: SEO de todos os vídeos
