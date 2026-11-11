# Histórico de versões — Galaxy Legacy

## v1.0.3 — fechamento da janela Internet
- Corrigida a especificidade CSS que mantinha a janela Internet visível depois de receber a classe `hidden`.
- Fechar pelo X superior, pelo controle na barra do navegador e pelo alvo de arraste agora usa a mesma classe visual de fechamento sem ser anulada pelo layout flex.
- Adicionado teste de regressão para garantir que a janela Internet desapareça quando fechada.


## v1.0.2 — pesquisa do Archive.org em novas abas
- O campo de pesquisa da nova aba criada pelo botão + agora consulta o Internet Archive por padrão.
- Endereços HTTP/HTTPS continuam sendo abertos diretamente a partir da mesma caixa.
- A barra de endereço principal mantém a pesquisa geral selecionável (Google, Bing ou DuckDuckGo).
- Testes adicionados para pesquisa do Archive.org, endereços diretos e bloqueio de esquemas inseguros.


## v1.0.1 — correções de navegação e banner configurável
- Pesquisa da homepage abre a página pública de resultados do Internet Archive dentro da aba atual, com filtro de mídia aplicado.
- Banner da homepage pode ser substituído por PNG, JPG, WebP, GIF ou AVIF de até 2 MB; a escolha fica salva localmente e pode ser restaurada.
- Botão dedicado para fechar a janela Internet e handlers diretos para fechar/minimizar/maximizar todas as janelas.
- Arraste de janelas ignora controles clicáveis para não interceptar seus cliques.
- Histórico voltar/avançar usa apenas endereços iniciados pela barra e atalhos do Galaxy; a política de mesma origem impede ler o histórico de links internos de sites externos.


## v1.0.0 — navegador integrado na Internet
- Barra de endereço com reconhecimento de URLs e pesquisas gerais.
- Mecanismos de pesquisa configuráveis: Google, Bing e DuckDuckGo.
- Abas independentes, criar/fechar/alternar, página inicial e histórico de endereços por aba.
- Navegação voltar/avançar/recarregar e abrir a página no Chrome como alternativa.
- Favoritos e histórico persistidos localmente com remoção e limpeza.
- Sugestões de endereços com base no histórico.
- Localizar texto na página quando o navegador permite acesso ao contexto do iframe.
- Modo imersivo e páginas externas ocupando a área de leitura inteira.
- Preservados a homepage rosa, quatro atalhos Neocities, busca/paginação do Archive.org e leitor de itens.
- Documentadas as limitações de iframe, cookies de terceiros e política de mesma origem.


## v0.9.0 — Internet coquette e Biblioteca simplificada
- Internet redesenhada como homepage pessoal rosa, com banner ilustrado, divisórias decorativas, perfil de boas-vindas e navegação entre Archive e Neocities.
- Pesquisa do Internet Archive no topo, quatro atalhos Neocities logo abaixo e chips de categoria que preselecionam filtros.
- Removidos Novel Updates, Little Tyrant como destaque e todos os provedores de mangá da Biblioteca.
- Mantidos livros, novels e fanfics; estante JSON preservada sem apagar favoritos locais.


## v0.8.0 — Navegação interna da Biblioteca
- Barra de endereço HTTPS com lista permitida limitada às plataformas cadastradas.
- Controles de voltar, avançar e atualizar o histórico iniciado pela Biblioteca.
- Tentativa de abertura interna de sites de mangá, novels e fanfics, sem remover bloqueios X-Frame-Options ou CSP.
- Wuxiaworld mantido no acesso externo em respeito aos seus termos.
- Preservadas a busca do Archive.org, Open Library, BookReader e a estante JSON.

## v0.7.0 — Biblioteca de leitura
- Aplicativo independente Biblioteca para livros, mangás, novels e fanfics.
- Catálogo de 16 plataformas, incluindo AO3, Novel Updates, Wattpad, Spirit Fanfics, MANGA Plus, Comikey, WEBTOON, VIZ, Wuxiaworld, Royal Road, Scribble Hub e Ciweimao.
- Busca no Internet Archive e Open Library; BookReader oficial quando há item disponível.
- Estante local com favoritos por link e importação/exportação JSON.
- Mantido o aplicativo Internet e suas funções existentes.

# Histórico de versões — Galaxy Legacy

## v0.4.0 — Notes e papéis adesivos
- Biblioteca com várias notas independentes.
- Autosave, busca, cores, checklist, favoritas, arquivamento e duplicação.
- Importação/exportação JSON com validação e confirmação.
- Migração do texto legado sem apagar a chave antiga.
- Papéis adesivos na área de trabalho, com mover, redimensionar, recolher, editar e desafixar.
- Posição, tamanho, cor e ordem visual persistidos localmente.

## v0.3.4
- Corrigido hover do painel lateral e dock por zonas transparentes de ativação de 44px.
- Zonas tornam-se click-through quando os painéis estão visíveis.
- Adicionado fallback mousemove e toque por pointerdown.
- Mantidas janelas, Internet, abertura de aplicativos sob demanda e remoção do Cat Club.

## v0.3.3
- Removido o aplicativo Cat Club/Catz e seus atalhos e estilos associados.
- Removidas referências a sticker club do conteúdo demonstrativo de Mail.
- Removido example.com da tela inicial do navegador.
- Navegador inicia com campo vazio e atalhos reais para Google, DuckDuckGo e Wikipedia.
- NAVEGAR abre URL ou pesquisa em uma nova aba do Chrome.
- TENTAR ABRIR AQUI mantém uma opção separada para sites que permitem incorporação.

## v0.3.2
- Desktop começa sem janelas abertas.
- Cats e Picatsso passaram a ser aplicativos dinâmicos, abertos sob demanda.
- Arraste de janelas reforçado com Pointer Events.
