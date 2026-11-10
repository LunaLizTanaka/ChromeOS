# Galaxy Legacy — ChromeOS Edition

**Estado:** v0.3.3 — navegador corrigido e Cat Club removido
**Plataforma principal:** Chromebook com ChromeOS  
**Formato:** website/PWA, sem aplicativo Android nativo  
**Identidade:** pixel art + coquette + kawaii desktop

Galaxy Legacy será um ambiente de desktop web personalizável. A intenção é que, ao abrir o app no Chromebook, a pessoa encontre um pequeno desktop próprio, com atalhos, pastas, janelas, widgets, personagens e ferramentas — sem substituir o ChromeOS real.

## Direção visual

A imagem de referência enviada pela responsável define a linguagem visual inicial:

- **Pixel art:** tipografia quadrada/monoespaçada, ícones pixelados, grade e molduras bem marcadas.
- **Coquette:** laços, corações, flores, fitas, pérolas e pequenos enfeites.
- **Kawaii retrô:** personagens/adesivos, notificações divertidas e janelas com cabeçalhos pastel.
- **Composição:** coluna lateral de atalhos, área central com janelas, pequenos widgets e dock.

Paleta inicial:

| Cor | HEX |
|---|---|
| Menta | `#BDEBE5` |
| Rosa | `#F5C5D9` |
| Baunilha | `#FFF0B9` |
| Lilás | `#C9C4E9` |
| Malva/contorno | `#B56C89` |
| Branco quente | `#FFFDFB` |

## Personalização como requisito central

A aparência não deve ser fixa. A direção de produto inclui:

- Temas e paletas configuráveis.
- Papel de parede próprio da área de trabalho Galaxy Legacy.
- Ícones e pacotes de adesivos substituíveis.
- Laços, flores, grade e efeitos decorativos que podem ser ligados/desligados.
- Tamanho de ícones e controles.
- Posição, tamanho e visibilidade de widgets.
- Pastas, páginas, dock e atalhos organizáveis.
- Janelas com cores e molduras ajustáveis.
- Perfis de desktop salváveis, exportáveis e importáveis.
- Cenários e personagens personalizáveis.

As preferências de cada componente devem ser independentes: mudar o wallpaper não deve apagar a organização dos ícones; trocar ícones não deve reiniciar widgets ou notas.

## Aplicativos planejados

Mail, Trash, Files, Save, Internet, Notes, Galeria, Música, Calendário, Calculadora, editor de desenho, personagens, widgets e ferramentas futuras. Parte dos aplicativos será criada como módulos internos do Galaxy Legacy; outros serão atalhos para serviços web externos.

A área de Internet deverá tentar incorporar uma página apenas quando o site permitir. Se a página bloquear iframe ou não funcionar corretamente, o Galaxy Legacy deverá oferecer abertura pelo próprio Chrome.

## Plataforma e desempenho

O perfil técnico documentado do Chromebook de referência indica Intel Celeron N4000, 2 núcleos, 4 GB RAM e Intel UHD Graphics 600. A estratégia é **2D-first e Chromebook-friendly**:

- HTML, CSS e JavaScript como base.
- SVG e Canvas 2D quando úteis.
- Imagens e animações leves, carregadas sob demanda.
- Evitar frameworks e processos pesados sem necessidade.
- Pausar animações quando a aplicação estiver oculta.
- Testar no Chromebook real antes de declarar fluidez ou compatibilidade.

## Integração com ChromeOS

O caminho principal será um website publicado por HTTPS, preparado como PWA. Um PWA instalado pode aparecer no Launcher e ser fixado na Shelf do ChromeOS, segundo a documentação do Google. Isso é uma aplicação web em janela própria, não uma substituição do launcher/sistema operacional.

**Não confundir três coisas:**

1. Wallpaper dentro da página do Galaxy Legacy: faz parte do projeto web.
2. PWA em janela independente: pode parecer um pequeno desktop e ocupar a própria janela.
3. Wallpaper real do ChromeOS: é controlado pelo sistema. A API de wallpaper é uma API de extensão e define imagens; não executa uma página HTML interativa atrás de todas as janelas.

Uma pesquisa de integração nativa poderá ser feita no futuro, mas não é dependência do desktop web.

## Arquivos de planejamento

- [Identidade visual e personalização](docs/IDENTIDADE_VISUAL_E_PERSONALIZACAO.md)
- [Arquitetura e limites do ChromeOS](docs/ARQUITETURA_E_LIMITES_CHROMEOS.md)

## Estado atual

A direção visual e a arquitetura inicial estão sendo registradas. O código do protótipo será adicionado incrementalmente; a instalação PWA depende de publicação HTTPS e teste no Chromebook. Nuvem, autenticação e sincronização ainda não estão conectadas.


## Interações e layout responsivo — v0.2.0

A v0.2.0 retoma o comportamento de janelas do protótipo antigo do tablet:

- Arrastar janelas por sua barra de título com mouse, touchpad, toque ou caneta.
- Minimizar, maximizar e fechar pelos controles do cabeçalho.
- Fechar também arrastando a janela até o alvo inferior.
- Entrar no modo de aplicativo em tela cheia pelo controle, por duplo clique no cabeçalho ou arrastando a janela até o topo.
- Retornar ao desktop com Esc ou pelo botão de voltar, preservando o conteúdo existente do aplicativo.
- Reabrir aplicativos minimizados/fechados pelos atalhos.
- Ajustar o desktop à largura e altura disponíveis, incluindo viewports estreitos e de pouca altura.

O modo de tela cheia é interno ao Galaxy Legacy e não substitui a tela cheia global do ChromeOS.

Consulte [Interações de janelas e layout responsivo](docs/INTERACOES_JANELAS_E_LAYOUT_RESPONSIVO.md).

**Entrega de teste v0.2.0:** HTML independente e pacote ZIP disponibilizados nesta conversa. O código ainda precisa ser sincronizado como fonte versionado do repositório antes de publicar a PWA.


## v0.2.1 — workspace imersivo

- Removida a faixa superior de apresentação com o texto “Chantei's sticker club” e a frase complementar.
- A área de trabalho agora ocupa 100% da janela da aplicação.
- Barra superior, lateral de atalhos e dock ficam completamente escondidos por padrão, fora da área visível.
- O ponteiro revela a barra correspondente ao alcançar a borda superior, esquerda ou inferior; a barra se recolhe quando o ponteiro sai de sua área.
- Em telas sensíveis ao toque, as bordas podem ser tocadas para revelar os painéis.
- As barras se recolhem durante o arraste das janelas para não interferir com maximização e fechamento.
- Janelas móveis, minimizar, fechar, modo de tela cheia e retorno preservando conteúdo foram mantidos.

Consulte [Interações de janelas e layout responsivo](docs/INTERACOES_JANELAS_E_LAYOUT_RESPONSIVO.md) para critérios e resultados de validação.


## v0.2.2 — viewport fluido

O desktop acompanha o espaço real disponível no Chrome/ChromeOS. A raiz segue o padrão do protótipo do tablet: contêiner preso às quatro bordas do espaço disponível, sem largura ou altura fixa de produto. ResizeObserver, eventos de redimensionamento e posições proporcionais reposicionam as janelas quando a janela/aba muda de tamanho.

As janelas permanecem dentro da área útil quando a tela diminui, e o conteúdo rola dentro de cada janela quando necessário. Foram verificados nove viewports entre 1920×1080 e 320×568, sem overflow do documento e sem janelas fora dos limites.

Consulte:
- [Interações, janelas e layout responsivo](docs/INTERACOES_JANELAS_E_LAYOUT_RESPONSIVO.md)
- [Arquitetura e limites do ChromeOS](docs/ARQUITETURA_E_LIMITES_CHROMEOS.md)
- [Pesquisa de referências desktop web](docs/PESQUISA_REFERENCIAS_DESKTOP_WEB.md)


## v0.3.0 — refatoração modular

O JavaScript foi separado em módulos nativos por responsabilidade: core, managers e apps. A divisão preserva o shell visual pixel/coquette e o comportamento anterior de janelas, tela cheia, painéis auto-ocultáveis e viewport fluido.

O código modular está em [src/](src/). O pacote completo v0.3.0, com index.html, CSS externo, manifesto, ícones e estrutura executável, foi entregue nesta conversa. A publicação/execução de ES Modules exige uma origem HTTP/HTTPS.

- [Mapa da refatoração v0.3.0](docs/MODULARIZACAO_V0.3.0.md)
- [Arquitetura ChromeOS](docs/ARQUITETURA_E_LIMITES_CHROMEOS.md)
- [Interações e layout responsivo](docs/INTERACOES_JANELAS_E_LAYOUT_RESPONSIVO.md)


## v0.3.2 — inicialização vazia e janelas dinâmicas

O desktop inicia sem janelas de aplicativos. Nenhum popup de demonstração é aberto automaticamente; a pessoa usuária abre o que deseja pelo painel lateral (borda esquerda) ou pelo dock (borda inferior).

Cats e Picatsso agora são criados sob demanda. Picatsso inicializa o Canvas e seus eventos somente depois que a janela é criada. O gerenciador de janelas usa captura de Pointer Events na cena, impedindo que eventos de aplicativos interfiram no início do arraste.

**Como arrastar:** pressione o botão esquerdo sobre a barra superior da janela, onde aparece o nome do aplicativo, mantenha pressionado e mova. Não comece sobre os controles circulares, pois eles minimizam, maximizam ou fecham.


## v0.3.3 — correção de navegação e remoção do Cat Club

- Removido o aplicativo Catz/Cat Club, seu atalho do dock, seu registro e seus estilos.
- Removidas referências a "sticker club" do aplicativo Mail.
- O navegador não inicia mais com example.com, domínio reservado para exemplos e não um serviço de navegação.
- A tela inicial da Internet começa vazia e inclui atalhos para Google, DuckDuckGo e Wikipedia.
- NAVEGAR abre URL ou pesquisa em uma nova aba do Chrome, sem depender de iframe.
- TENTAR ABRIR AQUI é uma opção separada para os sites que permitem incorporação; ABRIR NO CHROME fica disponível como alternativa.
- Endereços de domínio sem protocolo recebem https://; texto simples é convertido em pesquisa Google.
