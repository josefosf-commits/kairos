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

## Público (YouTube Studio, 28 dias até 15/11/2026): use ao escolher temas

- **35 a 44 anos: 30% das views e 31% do tempo de exibição.** É o maior público e o mais valioso (anúncios pagam mais). **Vídeos longos** devem falar com ele: recomeçar depois dos 35, trabalho, família e filhos, saúde e treino, acordar cedo, dinheiro. Personagens adultos da família do Joseph (pai, mãe) funcionam.
- **13 a 17 anos: 25% das views.** Escola, prova, celular, foco. Funciona nos **shorts** e nas séries (Ladrões, Desafio 30 Dias).
- **18 a 24 anos: só 11%.** É o ponto fraco. Às vezes, testar temas de faculdade, primeiro emprego e morar sozinho.
- **Mulheres: 39% do público**, concentradas em 35 a 44 anos. Incluir personagens femininas fortes nas histórias.
- Homens: 61%. 25 a 34 anos: 21%. 45+: 13%.
- Formato que mais performa nos longos: história emocional de esforço, título curto e imperativo, thumbnail com rosto + 1 a 3 palavras, e chamada para se inscrever dentro da história.
- **Checado em 16/11/2026: o filtro "Shorts" mostra exatamente os mesmos números do total.** Quase todas as views vêm dos shorts, e o Studio ainda não mostra idade para os vídeos longos (poucas views). Ou seja: **os adultos de 35 a 44 anos também chegam pelos shorts.** Então os shorts devem alternar temas de adolescente (escola, celular) e de adulto (trabalho, família, saúde, acordar cedo, dinheiro), e cada short adulto é uma porta para os vídeos longos. Por enquanto, ainda é uma aposta que os longos agradam mais aos adultos. Confirmar quando a aba "Vídeos" tiver dados de idade.
- Regiões (shorts): Brasil 46,7%, Portugal 3,3%, Angola 0,8%, Moçambique 0,5%. Manter o pt-BR, mas evitar gíria regional pesada, para não afastar o público lusófono.
- Revisar estes números a cada mês.

## Estrutura

- `videos/_lib/`: biblioteca comum (rig.js, short.js, som.py, render.js, montar.sh, collect.py, fila.sh)
- `videos/<curta>/`: roteiro.json → narração (Speko) → collect.py → timeline.json → cena.html/js + trilha.py → render.js → montar.sh
- `videos/canal/`: logo e capa do canal
- `videos/SEO.md`: SEO de todos os vídeos
