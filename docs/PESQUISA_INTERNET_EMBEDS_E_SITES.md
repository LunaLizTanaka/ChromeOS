# Pesquisa de sites incorporáveis no navegador Galaxy Legacy

**Consulta:** 10/11/2026  
**Objetivo:** definir quais serviços e páginas podem funcionar dentro da janela Internet do Galaxy Legacy usando iframe ou código oficial de incorporação, sem confundir uma prévia incorporada com um navegador completo.

## 1. Resultado executivo

Os três serviços solicitados não têm o mesmo tipo de suporte:

| Serviço | O que pode funcionar dentro do Galaxy Legacy | Limite |
|---|---|---|
| Tumblr | Blogs e posts incorporados pelo método oficial | Não equivale ao dashboard completo; login e ações sociais podem exigir autenticação |
| Neocities | Páginas individuais que permitam iframe | Não há garantia global; cada destino pode bloquear incorporação |
| Internet Archive | BookReader e players/item embeds oficiais | Usar URL de embed específica; página principal e Wayback não têm garantia de incorporação |

A página Internet do Galaxy Legacy pode manter um iframe para destinos compatíveis e oferecer abertura externa como fallback. Não é possível contornar com código do Galaxy Legacy um bloqueio de framing emitido pelo servidor de destino.

## 2. Tumblr

### Métodos oficiais

- Blog incorporado: `https://NOME-DO-BLOG.tumblr.com/js`
- Post individual: o usuário do Tumblr seleciona Share → Embed e copia o código oficial.

O Tumblr Help Center descreve as duas formas. Para posts incorporados, usuários autenticados podem curtir, reblogar, seguir e abrir as opções do post. Visitantes não autenticados conseguem abrir a fonte, mas precisam entrar/criar conta para recursos sociais.

### Estratégia para Galaxy Legacy

Criar uma opção dedicada **Tumblr** no navegador:
1. Campo para inserir o nome do blog ou URL do post.
2. Para blog público, carregar o script oficial do Tumblr num painel de incorporação separado.
3. Para post, aceitar o código ou URL oficial de embed.
4. Mostrar sempre **Abrir no Chrome** como alternativa.

**Não prometer:** acesso ao dashboard completo, mensagens privadas, configurações ou todos os fluxos de conta dentro da janela incorporada. O método documentado é para apresentar blogs/posts, não para embutir o aplicativo Tumblr inteiro.

Fontes:
- https://help.tumblr.com/knowledge-base/embed-basics/
- https://help.tumblr.com/pt-br/informacoes-basicas-sobre-incorporacao/

## 3. Neocities

Neocities hospeda sites estáticos e permite explorar uma galeria/diretório com tags. As páginas pertencem a criadores independentes. Não encontrei garantia de plataforma dizendo que todos os sites Neocities permitem que outros domínios os carreguem em iframe.

A regra técnica é por página: o cabeçalho HTTP `X-Frame-Options` e/ou a diretiva CSP `frame-ancestors` pode impedir que um site apareça num iframe. Esses cabeçalhos são definidos pelo servidor do destino e não podem ser anulados pelo Galaxy Legacy.

### Diretórios úteis

- Neocities Browse: https://neocities.org/browse
- Tag cute: https://neocities.org/browse?tag=cute
- Tag kawaii: https://neocities.org/browse?tag=kawaii
- Tag pixels: https://neocities.org/browse?tag=pixels
- Tag pastel: https://neocities.org/browse?tag=pastel
- Big List of Neocities RSS Feeds: https://rss-list.neocities.org/

### Páginas encontradas para explorar

As páginas abaixo foram abertas e inspecionadas como sites normais. Isso **não comprova** que aceitam iframe; precisam passar pelo teste dentro do próprio Galaxy Legacy.

- Sweet-pea — https://sweet-pea.neocities.org/  
  Tags cute, personal, pastel, kawaii e pink. Diretório com graphics, layouts, tutorials, cliques e webring. Boa primeira candidata para conteúdo delicado/coquette.

- Sakura Dreams — https://sakuradreams.neocities.org/  
  Página pessoal com coleções gráficas, stickers, pixel clubs, goodies e atualizações recentes. Muito alinhada ao tema pixel/coquette.

- Coco's Pixel Safari — https://pixelsafari.neocities.org/  
  Arquivo de dividers, favicons, stamps, blinkies, buttons e gráficos. A própria página alerta para luzes piscantes e imagens em movimento.

- Big List of Neocities RSS Feeds — https://rss-list.neocities.org/  
  Diretório com centenas de sites e feeds; útil para descobrir blogs pessoais, arte, jogos, escrita e outros projetos independentes.

**Cautela:** os sites são feitos por usuários independentes. Verificar conteúdo, avisos de flashing/autoplay e links antes de favoritar. Um diretório antigo chamado Peelopaalu informa que deixou de receber atualizações em 20/07/2024 e alerta que links podem estar mortos ou apontar para destinos indesejados; não recomendar como diretório principal.

## 4. Internet Archive

### Livros

O Internet Archive BookReader oferece URL própria para iframe:

`https://archive.org/embed/IDENTIFICADOR`

É melhor do que tentar abrir a página geral de detalhes. O leitor suporta navegação pelas páginas e tem interface própria para exibição incorporada.

Exemplo oficial documentado pelo projeto BookReader:
- https://archive.org/embed/birdbookillustra00reedrich

### Outros materiais

Na página do item, usar Share → Embed para obter o código específico do player. Isso é preferível a tentar enquadrar `archive.org` inteiro.

### Wayback Machine

Não encontrei uma URL universal de embed oficialmente documentada para a Wayback Machine. Tratar URLs `web.archive.org/web/...` como navegação normal e oferecer abertura externa.

Fontes:
- https://github.com/internetarchive/bookreader
- https://openlibrary.org/dev/docs/bookreader
- https://archivesupport.zendesk.com/hc/en-us/articles/360016634811-Managing-and-Editing-Your-Items-Tips-Troubleshooting
- https://archivesupport.zendesk.com/hc/en-us/articles/360016638171-Books-and-Texts-Tips-Troubleshooting

## 5. Outros destinos com métodos oficiais de incorporação

Estes serviços são bons candidatos para uma seção **Explorar dentro do Galaxy Legacy**. O método recomendado é incorporar um recurso específico, não o site principal inteiro.

| Serviço | Recurso que funciona em embed | Observações |
|---|---|---|
| YouTube | Player de vídeo em `youtube.com/embed/VIDEO_ID` | Player interativo com controles; nem todo vídeo permite reprodução incorporada |
| itch.io | Jogos HTML5 configurados para Embed in page ou Click to launch in fullscreen | Jogos rodam dentro da página usando HTML/JS/CSS |
| CodePen | Embedded Pen com preview/código | É um embed de uma criação específica, não todo o editor |
| Spotify | Player de álbum, playlist, podcast ou episódio | Embed interativo; autenticação, disponibilidade e reprodução dependem da conta/região |
| Google Forms | Formulário publicado/incorporado pelo comando Embed HTML | Permite responder dentro da janela, conforme permissões do formulário |
| Google Maps | Maps Embed API | Exige configurar uma chave de API e seguir as condições do Google Maps |
| Google Sheets | Planilha publicada na web/Embed | Mostrar dados publicados; planilhas privadas precisam de compartilhamento adequado |

Fontes oficiais:
- YouTube: https://developers.google.com/youtube/player_parameters
- itch.io HTML5: https://itch.io/docs/creators/html5
- itch.io Widget: https://itch.io/docs/creators/widget
- CodePen: https://codepen.io/features/embeds
- Spotify: https://developer.spotify.com/documentation/embeds
- Google Forms: https://support.google.com/docs/answer/2839588
- Google Maps: https://developers.google.com/maps/documentation/embed/get-started
- Google Docs/Sheets/Slides: https://support.google.com/docs/answer/183965

## 6. Por que alguns sites falham dentro da janela

A política de incorporação é enviada pelo servidor do site de destino:
- `X-Frame-Options: DENY` bloqueia incorporação.
- `X-Frame-Options: SAMEORIGIN` permite somente páginas da mesma origem.
- CSP `frame-ancestors` controla quais origens podem incorporar.

O Galaxy Legacy não pode remover essas restrições. A proteção existe, entre outros motivos, para reduzir clickjacking.

Fontes técnicas:
- https://developer.mozilla.org/en-US/docs/Web/HTTP/Reference/Headers/X-Frame-Options
- https://developer.mozilla.org/en-US/docs/Web/HTTP/Reference/Headers/Content-Security-Policy/frame-ancestors
- https://developer.mozilla.org/en-US/docs/Web/Security/Attacks/Clickjacking

## 7. Arquitetura recomendada para a Internet do Galaxy Legacy

A janela Internet deve ter dois modos claros:

1. **Navegador interno:** usar iframe para URLs e endpoints oficiais de incorporação que funcionem.
2. **Abrir no Chrome:** fallback para páginas bloqueadas, login completo, Wayback e sites que precisem de recursos não permitidos no frame.

Adicionar um catálogo **Explorar** separado do endereço livre:
- Tumblr: blog embed e post embed.
- Neocities: diretório, tags e páginas candidatas, com aviso de compatibilidade por site.
- Internet Archive: busca/identificador de item convertido para BookReader/Embed quando existir endpoint oficial.
- YouTube, itch.io, CodePen, Spotify, Google Forms e Google Maps: apenas os embeds oficiais.

Para Neocities e qualquer URL arbitrária, executar um teste real de iframe e apresentar o fallback sem afirmar que a página está funcionando quando o navegador a bloqueia. O evento `load` de um iframe, isoladamente, não prova que o conteúdo foi renderizado corretamente.

O navegador deve manter atribuição/link para o site original. Conteúdo externo deve ficar isolado em iframe; não executar diretamente JavaScript arbitrário de terceiros no DOM principal do Galaxy Legacy.

## 8. Ordem recomendada de implementação

1. **Internet v0.5:** modo interno como padrão, barra de endereço, voltar/avançar/recarregar, abrir no Chrome, indicador de carregamento e mensagem clara quando o conteúdo não puder ser exibido.
2. **Integrações oficiais:** Internet Archive BookReader, Tumblr blog/post embed e YouTube.
3. **Explore:** diretórios Neocities e lista de sites; testar cada site para iframe individualmente.
4. **Outros embeds:** itch.io, CodePen, Spotify, Google Forms, Maps e Sheets.
5. **Favoritos:** guardar destinos e embeds escolhidos pelo usuário.

Nenhum código desses serviços foi copiado. A pesquisa apenas identificou endpoints e padrões oficiais.

