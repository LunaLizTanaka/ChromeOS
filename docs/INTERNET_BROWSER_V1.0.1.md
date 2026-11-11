# Internet v1.0.1 — correções e personalização

## Pesquisa pública do Internet Archive

O formulário da homepage agora abre a página de resultados do próprio Internet Archive na aba ativa. O link público usado é `https://archive.org/search.php?query=...`. O campo de categoria adiciona o filtro de `mediatype` à consulta. O formulário deixa de mostrar apenas os cartões construídos pela API e passa a abrir a experiência de pesquisa oficial do Archive.org.

A busca programática anterior `advancedsearch.php`, o leitor `archive.org/embed/IDENTIFIER` e os helpers de cartões continuam no código para compatibilidade e futuras opções.

## Histórico interno e limite de mesma origem

O histórico do Galaxy guarda endereços iniciados pela barra, favoritos e atalhos. Voltar/avançar entre esses endereços é controlado pelo próprio aplicativo. Depois que a pessoa clica em um link dentro de um site externo carregado no iframe, a página pai não pode consultar a URL nem o histórico do frame.

O código anterior tentava acessar `iframe.contentWindow.history.back()` e `forward()`, o que pode disparar `SecurityError` para conteúdo de outra origem. Essa tentativa foi removida. Quando não há uma entrada própria anterior/seguinte, os botões explicam que a navegação precisa ser feita pelo próprio site. Isso não é um bloqueio que possa ser removido com JavaScript da página hospedeira.

## Banner personalizável

A homepage apresenta os controles **ESCOLHER IMAGEM** e **RESTAURAR ORIGINAL** logo abaixo do banner. Imagens PNG, JPEG, WebP, GIF ou AVIF de até 2 MB podem ser escolhidas. A imagem é guardada na chave local `gl-internet-banner-v1`, de modo que persiste ao fechar e reabrir o aplicativo no mesmo perfil de navegador. O botão restaurar remove o valor local e reexibe a arte SVG padrão.

## Fechamento da janela

A janela Internet ganhou um controle adicional de fechar dentro da barra do navegador. Os botões do título de todas as janelas também recebem handlers diretos, além da delegação global. O arraste agora ignora botões, campos, links, seletores e outros controles para não iniciar um movimento quando a pessoa pretende clicar neles.

## Testes

`npm run verify` adiciona verificações para:
- URLs públicas do Archive.org e filtros de mídia.
- IDs dos controles de banner e fechamento.
- Persistência local da imagem customizada.
- Ausência de tentativas de acessar diretamente `contentWindow.history`.
- Handlers diretos de fechar/minimizar/maximizar e proteção de arraste.
- Preservação da API de busca e do leitor embed do Archive.org, da homepage Neocities e da Biblioteca.
