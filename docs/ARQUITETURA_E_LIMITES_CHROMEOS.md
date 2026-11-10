# Arquitetura e limites do ChromeOS — Galaxy Legacy

**Plataforma alvo:** Chromebook / ChromeOS  
**Perfil de referência:** Intel Celeron N4000, 2 núcleos, 4 GB RAM, Intel UHD Graphics 600  
**Estratégia:** web-first, PWA, 2D-first

## 1. Objetivo

Galaxy Legacy será um ambiente de desktop web pessoal, com atalhos, pastas, janelas internas, dock, widgets, personagens e aplicativos próprios. Deve parecer um pequeno sistema visual, mas continuar sendo uma aplicação executada pelo ChromeOS.

O ChromeOS permanece responsável pelo Launcher, Shelf, janelas do sistema, notificações globais, permissões e aplicativos nativos. Galaxy Legacy não deve fingir que controla esses componentes.

## 2. PWA no ChromeOS

A direção principal é publicar o projeto por HTTPS com Web App Manifest e identidade própria. Segundo a documentação do Google, PWAs instalados podem aparecer no Launcher do ChromeOS e ser fixados na Shelf. A instalação é feita pelo próprio Chrome, sem APK.

O manifesto deve definir nome, ícone, cor, URL inicial e modo standalone. A instalação real só poderá ser confirmada depois da publicação HTTPS e de teste no Chromebook.

Não adicionar modo offline, cache programado ou Service Worker sem requisito aprovado: a primeira fase é online-first e deve ser simples.

## 3. Módulos

### Desktop Shell
- Área de trabalho responsiva.
- Páginas/cenários, dock e atalhos.
- Pastas internas.
- Janelas que podem abrir, focar, mover, minimizar, maximizar e fechar.
- Painel de personalização e saída clara.

### Aplicativos internos
- Cada aplicativo é um módulo web do próprio Galaxy Legacy.
- Carregar recursos apenas quando o módulo for aberto.
- Separar o estado dos aplicativos e evitar que um erro isolado derrube todo o desktop.

### Navegação na internet
- Barra de URL/pesquisa, favoritos próprios e páginas recentes do próprio Galaxy Legacy.
- Tentar iframe somente quando o destino permitir incorporação.
- Se o site bloquear iframe via X-Frame-Options ou Content-Security-Policy, oferecer abertura externa pelo Chrome.
- Não prometer navegação universal dentro de iframe ou acesso ao histórico privado do Chrome.

### Widgets e personagens
- Widgets com posições, dimensões, visibilidade e configurações próprias.
- Personagens/stickers em PNG, SVG, GIF ou spritesheets, após avaliar desempenho.
- Animações curtas e pausadas quando a aplicação estiver oculta.
- Ações visuais internas não devem ser confundidas com ações reais no sistema.

### Armazenamento
- LocalStorage para preferências pequenas.
- IndexedDB para imagens e conteúdo local maior, com tratamento de quota.
- Exportação/importação de perfis JSON.
- Nuvem e sincronização serão uma etapa separada; nenhum backend está conectado neste início.

## 4. Três níveis de wallpaper

Não misturar:

1. **Wallpaper interno:** imagem ou fundo visível dentro do desktop Galaxy Legacy. É implementável no website.
2. **PWA em janela independente/tela cheia:** a aplicação ocupa sua própria janela. Outros aplicativos e janelas do ChromeOS continuam fora dela.
3. **Wallpaper real do ChromeOS:** é administrado pelo sistema. A API `chrome.wallpaper` é específica do ChromeOS e requer a permissão `wallpaper` em uma extensão Chrome. Ela define uma imagem, não executa uma página HTML interativa atrás de todas as janelas.

Uma integração de wallpaper nativo pode ser pesquisada como extensão opcional, sujeita às permissões, compatibilidade, política de instalação e teste. Não é dependência do desktop web.

## 5. Desempenho

- Tratar Celeron N4000 e 4 GB RAM como orçamento limitado.
- Preferir HTML, CSS, JavaScript, SVG e Canvas 2D.
- Evitar frameworks grandes, blur extenso, vídeos de fundo e animações contínuas.
- Carregar imagens sob demanda e limitar stickers animados simultâneos.
- Pausar timers/animações quando a página estiver oculta.
- Testar mouse, teclado, touchpad, toque e escalas de tela.
- Testes estáticos não comprovam fluidez no Chromebook físico.

## 6. Segurança e privacidade

- Conteúdo externo é não confiável; não executar scripts externos no contexto principal.
- Links externos em nova aba devem usar noopener/noreferrer.
- Não guardar senhas, tokens ou segredos em JSON.
- Importação de arquivos sempre exige escolha explícita.
- Não enviar arquivos, notas ou histórico à nuvem sem ação clara e consentimento.
- O MVP não exige extensão ou permissões de sistema.

## 7. Roteiro inicial

1. **v0.1:** shell pixel/coquette, janelas, atalhos e personalização básica.
2. **v0.2:** editor de ícones/atalhos, páginas, pastas, drag-and-drop e perfis.
3. **v0.3:** aplicativos internos e ferramentas.
4. **v0.4:** engine de widgets, stickers, personagens e cenários.
5. **v0.5:** publicar em HTTPS, instalar como PWA e testar desempenho no Chromebook.
6. **Pesquisa futura:** extensão opcional para definir wallpaper estático do ChromeOS.
7. **Futuro:** nuvem/sincronização após escolha de infraestrutura e avaliação de custos.

## 8. Fontes técnicas

- Google for Developers — Desktop Progressive Web Apps on ChromeOS: https://developers.google.com/chromeos/app-development/learn/desktop-progressive-web-apps
- Google Chromebook Help — Use web apps: https://support.google.com/chromebook/answer/9658361
- Chrome for Developers — chrome.wallpaper API: https://developer.chrome.com/docs/extensions/reference/api/wallpaper

## 9. Estado

**Direção aprovada:** PWA/website desktop-first para ChromeOS, visual pixel + coquette e personalização profunda.

**Pendente:** implementação completa, publicação HTTPS, instalação e teste no Chromebook real, consumo de RAM e qualquer integração nativa de wallpaper.


## 10. Comportamento de janelas — v0.2.0

O modelo de janelas deve seguir o protótipo anterior do tablet, adaptado ao Chromebook:

- Drag-and-drop pela barra de título com Pointer Events.
- Controles de minimizar, maximizar e fechar.
- Alvo inferior opcional para fechar ao soltar uma janela.
- Tela cheia interna por controle, duplo clique ou arraste até o topo.
- Botão de retorno e Esc para voltar ao desktop.
- Preservação do mesmo nó DOM ao alternar para tela cheia, mantendo o estado em memória.
- Limites e reposicionamento das janelas após redimensionamento da viewport.

O shell deve ocupar a área disponível, usar linhas flexíveis e rolagem interna por janela. Não deve produzir rolagem horizontal em telas estreitas. Os testes automatizados preliminares de 1280×800, 1280×540 e 390×844 estão registrados em [Interações de janelas e layout responsivo](INTERACOES_JANELAS_E_LAYOUT_RESPONSIVO.md).

A homologação no Chromebook real continua pendente. As medições automatizadas não comprovam desempenho físico nem a instalação PWA via HTTPS.


## 11. Workspace imersivo e painéis auto-ocultáveis — v0.2.1

A área de trabalho usa todo o viewport. A barra superior, o painel lateral e o dock são camadas sobrepostas, não colunas/linhas reservadas do layout. Permanecem completamente fora da área visível até o ponteiro aproximar-se da borda correspondente:

- Borda superior revela a barra superior.
- Borda esquerda revela os atalhos laterais.
- Borda inferior revela o dock.

Cada painel permanece visível enquanto o ponteiro estiver sobre ele e se recolhe quando o ponteiro sai. Em telas touch, o usuário pode tocar na borda para alternar a visibilidade. Durante o arraste de janelas, as barras se recolhem para deixar livres os gestos de maximização e fechamento.

A mudança não substitui a área de trabalho pelo ChromeOS: é uma organização visual dentro da janela do Galaxy Legacy.


## 12. Viewport fluido — v0.2.2

A raiz da aplicação segue o mesmo padrão do protótipo do tablet: o corpo ocupa o contexto disponível e o shell fica preso às quatro bordas (top, right, bottom, left). O desktop não declara largura/altura fixa de produto; suas dimensões são determinadas pelo contêiner e pelo viewport atual do navegador.

O workspace e a cena também usam inset 0. O modo de aplicativo em tela cheia usa o mesmo padrão. ResizeObserver, resize, orientationchange e visualViewport.resize acionam o ajuste.

As posições das janelas são proporcionais à dimensão da cena. Durante o arraste, coordenadas em pixels são usadas para fluidez; ao soltar, convertem-se em porcentagens. Ao diminuir o viewport, janelas que excedem os limites são reposicionadas para permanecer integralmente visíveis. Conteúdos internos rolam dentro das respectivas janelas.

**Validação automatizada:** nove viewports (1920×1080, 1600×900, 1366×768, 1280×800, 1024×768, 800×600, 768×1024, 390×844 e 320×568). O shell/cena acompanhou a área disponível, sem scroll horizontal/vertical do documento; todas as janelas visíveis permaneceram dentro da cena. Abrir janela, reduzir para 600×500 e continuar usando maximizar/restaurar também passou. A homologação no Chromebook físico permanece pendente.

## 13. Referências open source

A pesquisa comparativa está em [PESQUISA_REFERENCIAS_DESKTOP_WEB.md](PESQUISA_REFERENCIAS_DESKTOP_WEB.md). A direção é manter a identidade e o código original do Galaxy Legacy, usar a divisão modular do WebDEX como modelo principal, SimplexOS como referência de funcionalidades vanilla e YukiOS apenas para padrões de persistência e separação de shell/estado. Nenhum código de terceiros foi incorporado à v0.2.2.


## 14. Refatoração modular v0.3.0

A implementação passou de um script inline único para ES Modules nativos, sem framework de UI e sem bundler obrigatório.

- `src/core/`: DOM, notificações/relógio, armazenamento e personalização.
- `src/managers/`: gerenciador de janelas, desktop/eventos e painéis das bordas.
- `src/apps/`: templates/registro de aplicativos e editor Picatsso.
- `src/main.js`: inicialização e composição dos módulos.
- O CSS original é preservado em folha externa no pacote entregue.

A extração foi incremental: a marcação visual e o CSS da v0.2.2 foram mantidos; somente o código foi separado por responsabilidade. Não foi incorporado código de terceiros.

Para desenvolvimento local, servir a pasta por HTTP (por exemplo `python -m http.server 8000`). ES Modules podem ser bloqueados se o HTML for aberto diretamente por `file://`.

**Estado:** módulos nativos criados e verificados. Publicação HTTPS e homologação no Chromebook físico pendentes.


## 15. Navegador web e limpeza do Cat Club — v0.3.3

O domínio example.com não é página inicial apropriada: ele é reservado a exemplos de documentação. O navegador do Galaxy Legacy inicia com o campo vazio e os atalhos Google, DuckDuckGo e Wikipedia.

A ação principal NAVEGAR abre uma nova aba do Chrome. Assim o usuário navega no navegador real, sem a falsa expectativa de que todos os sites aceitam iframe. A ação opcional TENTAR ABRIR AQUI tenta incorporar a página dentro da janela; sites com X-Frame-Options ou Content-Security-Policy podem bloquear. ABRIR NO CHROME é uma contingência explícita.

O Cat Club/Catz foi removido da lista de apps, do dock, templates, registro e estilos. O Mail demonstrativo não possui mais referência a sticker club.
