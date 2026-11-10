# Janelas, tela cheia e layout responsivo — Galaxy Legacy v0.2.0

**Data:** 09/11/2026  
**Base comportamental:** protótipo Galaxy Legacy do tablet v0.8.1.  
**Alvo desta implementação:** ChromeOS / Chrome desktop.

## 1. Comportamentos preservados do protótipo antigo

A versão ChromeOS retoma o modelo de janelas independentes do protótipo do tablet:

- Arrastar uma janela pela barra de título.
- Mover a janela usando mouse, touchpad, toque ou caneta por Pointer Events.
- Fechar pelo controle X do cabeçalho.
- Minimizar para deixar a janela oculta e poder abri-la novamente pelo atalho.
- Maximizar para modo de aplicativo em tela cheia.
- Arrastar a barra de título até a borda superior para entrar em tela cheia.
- Duplo clique na barra de título também alterna para tela cheia.
- Exibir uma barra própria de retorno e fechamento no modo de tela cheia.
- Pressionar Esc retorna ao desktop.
- Arrastar a janela até o alvo inferior "DROP HERE TO CLOSE" fecha a janela.
- Ao sair do modo de tela cheia, reutilizar o mesmo elemento DOM, preservando o conteúdo e o estado em memória do aplicativo.
- Reabrir aplicativos a partir dos atalhos depois de fechar/minimizar.

A tela cheia aqui é o modo de aplicativo dentro do Galaxy Legacy. Não é a tela cheia global do ChromeOS nem assume controle sobre outras janelas do sistema.

## 2. Modelo de interação

### Arrastar
O início do arraste é reconhecido somente na barra de título, exceto quando o usuário pressiona um botão de controle. Pointer Events unificam mouse, touchpad, touchscreen e stylus. A posição é limitada à área da cena para impedir que a janela desapareça fora do desktop.

### Controles do cabeçalho
- Primeiro controle: minimizar.
- Segundo controle: maximizar/entrar em tela cheia.
- Terceiro controle: fechar.

### Fechar por alvo
Durante o arraste, o desktop mostra o alvo inferior. Quando a janela intersecta o alvo e o ponteiro é solto, a janela é fechada. Cancelamento do ponteiro não deve fechar.

### Tela cheia/restauração
O aplicativo existente é movido para uma camada de tela cheia, em vez de criar uma cópia. A camada recebe uma barra com retorno e fechamento. Restaurar retorna o mesmo elemento à cena e recupera classe e estilos anteriores.

## 3. Layout responsivo

- O desktop ocupa a área disponível da janela do navegador.
- Cabeçalho, área principal e dock usam linhas flexíveis e alturas limitadas.
- A área da cena recebe o espaço restante e as janelas usam limites relativos ao contêiner.
- Conteúdo interno das janelas rola sem expandir o documento inteiro.
- Em telas estreitas, sidebar e atalhos são compactados e o conteúdo interno continua acessível.
- Em telas baixas, o desktop reduz alturas e permite rolagem do corpo interno, evitando rolagem horizontal.
- Janelas são limitadas ao tamanho e aos limites do espaço de trabalho.

## 4. Testes realizados

Testes automatizados de interação executados em Chromium com um shim temporário de armazenamento para isolar as funcionalidades da janela:

| Verificação | Resultado |
|---|---|
| Arrastar janela | Aprovado |
| Maximizar pelo controle | Aprovado |
| Restaurar sem recriar conteúdo | Aprovado |
| Fechar pelo X | Aprovado |
| Reabrir após fechar | Aprovado |
| Arrastar para o topo e maximizar | Aprovado |
| Arrastar para o alvo inferior e fechar | Aprovado |
| Abrir aplicativo dinâmico | Aprovado |
| Erros de JavaScript no fluxo testado | Nenhum observado |

Medições de viewport no Chromium:

| Viewport | Largura do documento | Altura do documento | Rolagem horizontal |
|---|---:|---:|---|
| 1280 × 800 | 1280 | 800 | Não |
| 1280 × 540 | 1280 | 540 | Não |
| 390 × 844 | 390 | 844 | Não |

**Limites da validação:** o ambiente de execução bloqueou a navegação normal por arquivo local/servidor local. Os testes com `set_content` usaram um shim temporário para LocalStorage. Portanto, a persistência real por origem HTTPS e o comportamento no Chromebook físico ainda precisam ser validados. Esses testes não comprovam desempenho ou compatibilidade em todos os dispositivos.

## 5. Arquivos entregues

A versão de teste v0.2.0 foi entregue como HTML independente e pacote ZIP com estrutura de aplicação, manifesto, ícones e documentação. A estrutura completa do código deve permanecer sincronizada com o repositório ao publicar a versão.

## 6. Estado

**Implementado no protótipo v0.2.0:** janelas móveis, minimizar, fechar pelo X, fechar pelo alvo inferior, modo fullscreen de aplicativo, retorno preservando DOM e layout adaptável.

**Pendente:** homologação no Chromebook físico, validação da instalação PWA via HTTPS, testes de persistência na origem definitiva e ajustes finos de usabilidade.


## 7. v0.2.1 — workspace imersivo e barras auto-ocultáveis

- Removida a área de boas-vindas do topo para liberar espaço.
- Área principal ampliada para 100% do viewport, sem reservar espaço permanente para cabeçalho, lateral ou dock.
- Barra superior, sidebar e dock ficam inteiramente fora da tela por padrão.
- A barra superior aparece ao chegar à borda superior; a sidebar aparece pela borda esquerda; o dock aparece pela borda inferior.
- Cada barra se recolhe quando o ponteiro sai de sua área.
- Foco de teclado pode revelar os controles; após abrir um aplicativo por um atalho, o foco do botão é liberado para permitir recolhimento.
- Em telas touch, tocar na borda alterna a exibição do painel correspondente.
- Durante o arraste de uma janela, todas as barras periféricas permanecem escondidas.

### Validação v0.2.1

Testes automatizados em Chromium headless (com armazenamento em memória durante o teste em documento de origem opaca):

| Verificação | Resultado |
|---|---|
| Desktop e workspace em 1280 × 800 | Aprovado |
| Texto de boas-vindas removido | Aprovado |
| Barra superior: oculta/revela/recolhe | Aprovado |
| Sidebar: oculta/revela/recolhe | Aprovado |
| Dock: oculto/revela/recolhe | Aprovado |
| Arrastar janelas | Aprovado |
| Maximizar e restaurar preservando o mesmo DOM | Aprovado |
| Fechar e reabrir janelas | Aprovado |
| Viewport 390 × 844 sem overflow | Aprovado |
| Erros JavaScript nos fluxos testados | Nenhum observado |

A ativação touch foi simulada com PointerEvent; precisa de homologação em tela sensível ao toque real. A publicação HTTPS e o desempenho no Chromebook físico continuam pendentes.


## 8. v0.2.2 — viewport sem dimensão fixa

A aplicação usa o padrão de contêiner do protótipo do tablet: o body fica preso às quatro bordas do espaço disponível e o desktop é posicionado por inset 0, com largura e altura automáticas. A área não é desenhada em uma resolução pré-definida.

- ResizeObserver observa shell e cena.
- resize, orientationchange e visualViewport.resize atualizam o posicionamento.
- Posições das janelas são proporcionais à cena; após arrastar, os valores em pixels são convertidos para porcentagens.
- Janelas são reposicionadas quando o viewport diminui e seus conteúdos têm rolagem interna.

### Validação v0.2.2

Chromium headless: 1920×1080, 1600×900, 1366×768, 1280×800, 1024×768, 800×600, 768×1024, 390×844 e 320×568.

| Verificação | Resultado |
|---|---|
| Shell ocupa exatamente o viewport disponível | Aprovado |
| Cena acompanha a largura e altura do shell | Aprovado |
| Sem rolagem horizontal/vertical do documento nos 9 viewports | Aprovado |
| Janelas visíveis permanecem dentro da cena | Aprovado |
| Posição das janelas adapta-se ao redimensionamento | Aprovado |
| Abrir uma janela em 1600×900 e reduzir para 600×500 | Aprovado |
| Maximizar/restaurar após redimensionamento | Aprovado |
| Erros JavaScript nos fluxos testados | Nenhum observado |

A validação usa Chromium automatizado e armazenamento em memória para isolar os fluxos. A instalação PWA via HTTPS e a homologação no Chromebook físico permanecem pendentes.


## 9. Refatoração modular v0.3.0 — regressão

O window manager foi extraído para `src/managers/window-manager.js`. Desktop/eventos, painéis, registro de apps, templates, personalização, armazenamento e Picatsso também foram separados em módulos.

Regressão automatizada no Chromium (montagem temporária de teste com armazenamento em memória):

| Fluxo | Resultado |
|---|---|
| Inicialização do desktop | Aprovado |
| Notas: persistir, minimizar e reabrir | Aprovado |
| Tema, escala e preferências | Aprovado |
| Files: selecionar e listar arquivos | Aprovado |
| Tela cheia/restauração preservando o mesmo DOM | Aprovado |
| Arrastar janela pela barra de título | Aprovado |
| Fechar e reabrir janela fixa | Aprovado |
| Fechar arrastando até o alvo inferior | Aprovado |
| Picatsso: desenho, ferramentas, paleta e limpar | Aprovado |
| Internet: normalização de endereço e iframe | Aprovado |
| Layout e janelas em dez viewports | Aprovado |
| Erros JavaScript nos fluxos exercitados | Nenhum observado |

Viewports: 1920×1080, 1600×900, 1366×768, 1280×800, 1024×768, 800×600, 768×1024, 600×500, 390×844 e 320×568.

O ambiente restringiu a navegação automatizada por `file://` e `localhost`; os fluxos foram exercitados em Chromium usando montagem temporária do código e shim de LocalStorage. A entrega de produção continua usando ES Modules nativos. A persistência por origem HTTPS e a homologação no Chromebook físico permanecem pendentes.


## 10. v0.3.2 — desktop vazio e aplicativos sob demanda

- Removidas as quatro janelas de demonstração que eram incluídas diretamente no HTML inicial.
- A cena inicia com zero janelas abertas; o usuário abre cada aplicativo pelos atalhos laterais ou dock auto-ocultáveis.
- Cats e Picatsso agora são registrados como aplicativos dinâmicos.
- Picatsso cria seu canvas e conecta os eventos de desenho somente depois da criação da janela; reabertura reutiliza a janela existente.
- O gerenciador inicia arraste no evento pointerdown em fase de captura na cena e mantém pointermove global não passivo.
- O arraste começa na barra de título, não nos controles de minimizar/maximizar/fechar.
- Adicionado fallback mouse/touch para navegadores sem Pointer Events no pacote executável.

### Validação automatizada v0.3.2

| Fluxo | Resultado |
|---|---|
| Desktop inicia sem nenhuma janela | Aprovado |
| Revelar painel lateral pelo hover da borda | Aprovado |
| Abrir Notes por clique real no atalho | Aprovado |
| Revelar dock pelo hover inferior e abrir Cats | Aprovado |
| Arrastar Cats pela barra de título | Aprovado |
| Maximizar/restaurar | Aprovado |
| Minimizar, reabrir, fechar e reabrir | Aprovado |
| Abrir Picatsso e desenhar no Canvas | Aprovado |
| Abrir Notes e persistir texto | Aprovado |
| Abrir Settings e trocar tema | Aprovado |
| Dez viewports, de 320×568 a 1920×1080 | Aprovado |
| Erros JavaScript nos fluxos testados | Nenhum observado |

Os testes foram feitos em Chromium automatizado com armazenamento de teste em memória. O comportamento real no Chromebook físico ainda precisa de homologação.
