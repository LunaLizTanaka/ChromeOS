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
