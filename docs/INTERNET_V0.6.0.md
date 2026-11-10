# Internet v0.6.0 — Neocities + Internet Archive

**Versão:** 0.6.0  
**Data:** 10/11/2026

## Objetivo

A aba Internet deixa de simular um navegador geral. Ela passa a ter somente dois espaços:

1. **Neocities:** uma pequena blogoteca com páginas independentes selecionadas.
2. **Internet Archive:** pesquisa dentro do acervo digital do Archive.org e abertura dos itens no player/leitor do próprio serviço.

A interface não pesquisa no Google nem em mecanismos externos. Também não permite digitar endereços arbitrários, navegar por tags do Neocities ou tentar incorporar serviços que bloqueiam a janela.

## Blogoteca Neocities

A lista contém quatro páginas verificadas durante a implementação:

| Blog | Endereço |
|---|---|
| Sweet-pea | https://sweet-pea.neocities.org/ |
| Sakura Dreams | https://sakuradreams.neocities.org/ |
| Pixel Safari | https://pixelsafari.neocities.org/ |
| Neocities RSS List | https://rss-list.neocities.org/ |

As quatro páginas responderam com HTTP 200 no teste de navegador, sem o cabeçalho `X-Frame-Options` que impediria a incorporação. O teste também observou respostas 200 para recursos estáticos de Sweet-pea. Isso confirma a possibilidade de carregamento no momento do teste, mas não garante que os sites permaneçam online ou mantenham a mesma política no futuro.

O Galaxy abre somente essas páginas dentro do visualizador Neocities. A lista é fixa nesta versão; não há campo para inserir qualquer URL.

## Pesquisa no Internet Archive

A pesquisa usa o endpoint público:

`https://archive.org/advancedsearch.php`

As consultas pedem JSON e os campos `identifier`, `title`, `creator`, `year` e `mediatype`. A busca utiliza a frase digitada e, quando um filtro é escolhido, acrescenta o filtro de tipo de mídia.

Filtros disponíveis:

- Tudo
- Filmes e vídeos (`movies`)
- Áudio e música (`audio`)
- Livros e textos (`texts`)
- Software e jogos (`software`)
- Imagens (`image`)

A API de busca do Internet Archive documenta o formato JSON, os parâmetros de paginação e o limite de paginação da pesquisa avançada. Consulte [Item Search APIs](https://doc-tools.readthedocs.io/en/ia-test-gsod/item-search-apis.html) e o [guia de pesquisa do Internet Archive](https://archivesupport.zendesk.com/hc/en-us/articles/360018359991-Search-A-Basic-Guide).

## Player e leitor

Ao escolher um resultado, o Galaxy cria um iframe para:

`https://archive.org/embed/IDENTIFIER`

O visualizador permite que o próprio Archive.org apresente o player ou leitor adequado ao item. O botão **PÁGINA COMPLETA** abre a ficha original em `https://archive.org/details/IDENTIFIER`, caso o player incorporado não seja adequado para aquele item.

O Internet Archive descreve a opção de compartilhar e incorporar livros, filmes e áudio a partir do player do item em seu [guia oficial de incorporação](https://archivesupport.zendesk.com/hc/en-us/articles/360016634811-Managing-and-Editing-Your-Items-Tips-Troubleshooting).

Nem todos os resultados têm necessariamente uma prévia reproduzível. A disponibilidade do arquivo, o formato, os direitos e as restrições do item continuam sob responsabilidade do Archive.org e de quem o disponibilizou.

## Testes realizados

- As quatro páginas Neocities retornaram HTTP 200.
- A busca JSON do Archive.org funcionou por `fetch()` diretamente no navegador, sem chave de API.
- Consultas de exemplo para filmes, áudio e textos retornaram resultados com identificadores.
- As rotas `/embed/IDENTIFIER` para um filme, uma gravação de áudio e um livro responderam no teste de navegador; uma das rotas de livro redirecionou para a ficha do item.
- `npm run verify` cobre os URLs de pesquisa, filtros de mídia, paginação e links de incorporação.

## Arquivos principais

- `src/apps/app-templates.js` — abas, blogoteca, pesquisa, resultados e visualizador.
- `src/apps/internet-manager.js` — lista permitida de blogs, consulta JSON, montagem de resultados e incorporação.
- `styles/internet.css` — visual da nova interface.
- `scripts/verify-internet.mjs` — testes de regressão.
