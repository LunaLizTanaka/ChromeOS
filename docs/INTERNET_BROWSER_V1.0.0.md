# Internet v1.0.0 — navegador integrado

## O que foi implementado

A janela Internet passou a ter uma camada de navegação composta por:

- Faixa de abas com criar, selecionar e fechar.
- Barra de endereço que distingue URLs de pesquisas.
- Seleção persistente do mecanismo de pesquisa (Google, Bing ou DuckDuckGo).
- Botões de voltar, avançar, atualizar/parar, página inicial e abrir no Chrome.
- Favoritos e histórico persistidos em localStorage; remoção de favoritos e limpeza do histórico.
- Sugestões de endereços baseadas no histórico local.
- Localizar texto na página com Ctrl+F quando o contexto do iframe permite.
- Modo imersivo que oculta as barras do navegador e amplia o conteúdo.
- Novas abas com pesquisa e atalhos Neocities.

## O que foi preservado

A homepage coquette rosa, as quatro entradas Neocities, a pesquisa por metadados no Internet Archive, os filtros de mídia, paginação, cartões de resultado e o player/leitor oficial do Archive.org permanecem. A Biblioteca e seu armazenamento local não foram alterados.

## Como a barra decide o que abrir

Texto que parece URL (por exemplo, `example.org` ou `https://example.org/pagina`) é tratado como endereço. Texto comum é codificado e enviado para o mecanismo de pesquisa selecionado. Somente HTTP/HTTPS são aceitos; esquemas como `javascript:`, `data:` e `file:` são recusados. O próprio domínio da aplicação não é incorporado dentro dela.

## Como funciona a visualização de páginas

Cada aba tem um iframe próprio, mantido separado ao alternar entre abas. O iframe ocupa a largura e a altura disponíveis da área de leitura e acompanha o redimensionamento da janela do Galaxy. O modo imersivo esconde a barra do navegador para maximizar a área útil.

O Galaxy não é um navegador Chromium independente. Sites que enviam `X-Frame-Options` ou `Content-Security-Policy: frame-ancestors` podem recusar a incorporação. Cookies de terceiros, login, pop-ups, downloads e navegação interna também dependem das políticas do site e do Chrome. A ocorrência do evento `load` no iframe não prova que a página foi exibida com sucesso. Para páginas vazias ou bloqueadas, o botão **↗ Abrir no Chrome** é o caminho alternativo; nenhum bloqueio é contornado.

A API de mesma origem impede que o Galaxy leia o endereço, o título e o histórico interno de sites de outra origem. Por isso, o histórico local guarda as URLs abertas pela barra e pelos atalhos. Os controles voltar/avançar também tentam usar o histórico do próprio iframe, mas o resultado pode variar conforme o site e o navegador. A busca dentro da página funciona quando o navegador permite chamar `window.find` no contexto do iframe; caso contrário, o usuário recebe uma mensagem para usar a pesquisa do próprio site ou o Chrome.

## Armazenamento local

- `gl-internet-bookmarks-v1`: favoritos do navegador.
- `gl-internet-history-v1`: até 120 entradas recentes.
- `gl-internet-search-engine-v1`: mecanismo de pesquisa selecionado.

Os dados permanecem no perfil de navegador em que o Galaxy está aberto. Não há sincronização em nuvem nem contas externas.

## Testes

`npm run verify` verifica a sintaxe JavaScript, a estrutura dos controles, o roteamento de endereço/pesquisa, os esquemas permitidos, os três mecanismos de busca e as rotas de busca/leitor do Archive.org. Os testes não tentam provar que sites de terceiros permitem iframe; isso só pode ser confirmado abrindo cada site no ChromeOS.
