# Internet e Biblioteca v0.9.0

## Internet — homepage pessoal

A janela Internet abre na tela Archive, com banner ilustrado em tons de rosa, detalhes decorativos, navegação entre Archive e Neocities e cartão lateral de boas-vindas. A barra de pesquisa do Internet Archive fica no topo da área principal. Logo abaixo aparecem quatro atalhos fixos: Sweet-pea, Sakura Dreams, Pixel Safari e Neocities RSS List. Os atalhos usam o visualizador Neocities existente e abrem o site dentro da janela.

Abaixo dos atalhos, os chips Livros, Áudio, Filmes, Imagens e Software apenas selecionam o filtro de mídia do Archive.org. A pesquisa continua usando o índice amplo de metadados, preservando termo livre, paginação, cartões de resultado e o player/leitor oficial. A busca continua no catálogo Archive.org; os atalhos Neocities são independentes.

## Biblioteca — plataformas removidas

Esta versão remove Novel Updates porque seus links encaminham para leitores hospedados em sites diferentes e não oferecem um fluxo de login/leitura único dentro do Galaxy. Também remove MANGA Plus, Comikey, WEBTOON, VIZ e os demais atalhos de mangá. Permanecem livros e textos (Internet Archive, Open Library, Project Gutenberg, Wikisource), novels (Wuxiaworld, Royal Road, Scribble Hub, Ciweimao) e fanfics (AO3, Wattpad, Spirit Fanfics).

O cartão de destaque de Little Tyrant que dependia da ficha Novel Updates foi retirado. A chave local `gl-library-v1` não foi apagada nem migrada: links que já estavam na estante, inclusive links adicionados manualmente, continuam preservados. Nenhuma entrada antiga é removida automaticamente.

## Verificações

`npm run verify` verifica os IDs da homepage Internet, atalhos Neocities, seleção de categorias, consulta e player do Archive, além da lista reduzida da Biblioteca e seus domínios internos permitidos. O workflow também monta o HTML standalone e o ZIP completo depois das verificações. A abertura de páginas externas continua sujeita às políticas de iframe e de sessão de cada plataforma.
