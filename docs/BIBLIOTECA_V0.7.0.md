# Biblioteca v0.7.0 — catálogos, leitores e estante

A Biblioteca é um aplicativo separado do Internet. Ela centraliza links de plataformas de livros, mangás, web novels e fanfics, oferece buscas em catálogos com APIs documentadas e mantém uma estante local de links.

## Plataformas incluídas

| Categoria | Plataforma | Modo desta versão |
|---|---|---|
| Livros | Internet Archive | Busca de textos e BookReader/player oficial para itens disponíveis |
| Livros | Open Library | Busca pela API oficial; BookReader quando a ficha contém identificador do Internet Archive |
| Livros | Project Gutenberg | Link oficial e tentativa manual de iframe |
| Livros | Wikisource | Link oficial e tentativa manual de iframe |
| Fanfics | Archive of Our Own (AO3) | Link oficial e tentativa manual de iframe |
| Novels | Novel Updates | Índice e ficha da obra; tentativa manual de iframe |
| Fanfics | Wattpad | Link oficial e tentativa manual de iframe |
| Fanfics | Spirit Fanfics | Link oficial; o player próprio não está integrado nesta versão |
| Mangás | MANGA Plus | Link oficial externo |
| Mangás | Comikey Brasil | Link oficial externo |
| Mangás | WEBTOON | Link oficial externo |
| Mangás | VIZ / Shonen Jump | Link oficial externo; disponibilidade regional pode variar |
| Novels | Wuxiaworld | Link oficial externo; termos proíbem frame/mirror/incorporação sem autorização escrita |
| Novels | Royal Road | Link oficial e tentativa manual de iframe |
| Novels | Scribble Hub | Link oficial e tentativa manual de iframe |
| Novels | Ciweimao | Link para a plataforma original chinesa |

## Compatibilidade e limites

O botão **TENTAR NESTA JANELA** abre a página dentro de um iframe isolado. Isso não é uma confirmação automática de compatibilidade: navegadores não permitem que a página principal leia livremente o conteúdo ou os cabeçalhos de outra origem. Um evento `load` também pode ocorrer quando o servidor bloqueia a incorporação. Confira visualmente se a página realmente apareceu. Sempre há o botão **ABRIR NO CHROME** como alternativa.

Não se tenta incorporar Wuxiaworld, Comikey, WEBTOON, MANGA Plus, VIZ, Spirit ou Ciweimao nesta versão. Isso evita apresentar leitores de terceiros como se fossem componentes autorizados dos serviços oficiais. No caso do Wuxiaworld, os termos proíbem enquadrar, espelhar ou incorporar a plataforma sem autorização escrita. O Spirit menciona um player incorporável, mas o player oficial não foi integrado.

## Internet Archive

A aba **INTERNET ARCHIVE** reutiliza a busca `advancedsearch.php` do aplicativo Internet, filtrada para textos. Os resultados podem abrir pelo endpoint `archive.org/embed/IDENTIFIER` ou pela página completa do item. A leitura depende da disponibilidade, formato, empréstimo e permissões de cada item.

O BookReader oficial pode ser incorporado em iframe. A documentação descreve integração por iframe e mensagens `postMessage` para sincronizar página e modo de leitura:

- https://github.com/internetarchive/bookreader
- https://openlibrary.org/dev/docs/bookreader

## Open Library

A aba **OPEN LIBRARY** consulta `https://openlibrary.org/search.json` com uma busca pontual, campos necessários e limite de 18 obras. Se o resultado incluir identificador `ia`, a Biblioteca abre `https://archive.org/stream/IDENTIFIER?ui=embed`. Caso contrário, oferece a ficha do Open Library.

A API pública é voltada a consultas úteis em nome de usuários, não a coleta em massa. A documentação recomenda cache e identificação do aplicativo para acessos frequentes:

- https://openlibrary.org/dev/docs/api/search
- https://openlibrary.org/developers/api

## Destaque: Little Tyrant

A Biblioteca contém um atalho para a ficha de **Little Tyrant Doesn’t Want to Meet with a Bad End** no Novel Updates:

https://www.novelupdates.com/series/little-tyrant-doesnt-want-to-meet-with-a-bad-end/

A ficha consultada indica web novel chinesa, autora Bells on Cat Ears, publicação original associada a Ciweimao e 670 capítulos concluídos no país de origem. A ficha também não indica licença de publicação em inglês. Por isso, o atalho leva à ficha de catálogo e não inclui cópias não oficiais dos capítulos.

## Estante local

A estante guarda título, URL HTTPS, origem e categoria na chave `gl-library-v1` do armazenamento local. Itens podem ser removidos, exportados em `galaxy-library-shelf.json` ou importados de JSON. Nenhum capítulo é copiado, nenhum login externo é interceptado e não há sincronização em nuvem nesta versão.

## Limitações de teste desta entrega

A verificação automatizada cobre sintaxe JavaScript, importações, estrutura da interface, catálogo de plataformas, URLs de busca/leitor e fluxo de estante. O ambiente de construção não conseguiu resolver domínios externos por DNS, portanto não foi possível medir diretamente os cabeçalhos `X-Frame-Options` e `Content-Security-Policy` de todos os sites. Por isso, a interface distingue leitores oficialmente documentados, links externos e tentativas de iframe ainda não confirmadas. A tentativa visual pode ser feita no Chromebook, com a conexão e o perfil de navegador da pessoa usuária.
