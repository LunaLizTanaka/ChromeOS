# Refatoração modular — Galaxy Legacy v0.3.0

A v0.3.0 separa o script inline anterior em módulos nativos, mantendo o HTML/CSS, identidade pixel/coquette e comportamentos testados da v0.2.2.

## Mapa de módulos

| Pasta/módulo | Responsabilidade |
|---|---|
| core/dom.js | consultas DOM |
| core/notifications.js | notificações e relógio |
| core/storage.js | LocalStorage, IndexedDB de wallpaper, downloads |
| core/settings.js | temas, personalização, wallpaper e perfis JSON |
| managers/window-manager.js | foco, drag, minimizar, fechar, maximizar, restaurar, limites |
| managers/edge-panel-manager.js | painéis revelados pelas bordas |
| managers/desktop-manager.js | delegação de eventos e lançamento de apps |
| apps/app-templates.js | templates e títulos |
| apps/app-registry.js | criação e ligação dos aplicativos |
| apps/paint-app.js | canvas e ferramentas Picatsso |
| main.js | inicialização e composição |

## Preservação

- Janelas são ocultadas, não destruídas, ao minimizar/fechar, preservando conteúdo para reabrir.
- A tela cheia move o mesmo elemento DOM para a camada própria e o devolve ao desktop.
- Posições de janelas continuam proporcionais e são limitadas após redimensionamento.
- Preferências pequenas permanecem em LocalStorage e wallpaper em IndexedDB.
- CSS, marcação pixel/coquette e painéis auto-ocultáveis são mantidos.
- Não foram adicionados frameworks ou dependências de runtime.

## Robustez

- Navegação aceita somente HTTP/HTTPS e oferece abertura externa no Chrome.
- Links externos usam noopener/noreferrer.
- Seleção de arquivos não faz upload automático.
- Wallpapers aceitos: PNG, JPEG ou WebP, até 4 MB.
- O desenho também encerra em lostpointercapture.
- A inicialização tolera indisponibilidade do IndexedDB/localStorage.

## Verificações

- node --check em 11 módulos.
- Parsing de HTML e JSON do manifesto.
- Resolução estática de todos os imports e existência dos ícones.
- Regressão automatizada Chromium: notas, temas, Files, janelas, drag, fullscreen, Picatsso e navegador.
- Dez viewports, de 320×568 a 1920×1080, sem overflow horizontal do documento ou janelas fora da cena.
- Nenhum erro JavaScript nos fluxos exercitados.

Os testes de navegador usaram montagem temporária em Chromium e shim de LocalStorage porque o ambiente bloqueou navegação por file:// e localhost. O pacote de produção continua usando ES Modules nativos. HTTPS, IndexedDB na origem publicada e homologação física permanecem pendentes.
