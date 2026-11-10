# Pesquisa de sistemas desktop web semelhantes no GitHub

**Data da consulta:** 09/11/2026  
**Objetivo:** identificar bases e padrões reutilizáveis para desenvolver o Galaxy Legacy ChromeOS sem perder sua identidade pixel art + coquette e sem sobrecarregar o Chromebook de referência.

## 1. Conclusão executiva

Não recomendamos substituir o Galaxy Legacy por um sistema de terceiros completo. A melhor estratégia é manter o projeto atual como base visual e de produto e adotar padrões específicos:

- **WebDEX:** principal referência estrutural para separar gerenciador de janelas, área de trabalho, registro de aplicativos, módulos e armazenamento.
- **SimplexOS:** referência funcional para desktop web vanilla, personalização, widgets, menu de aplicativos e carregamento de apps.
- **YukiOS:** referência arquitetural para manter estado e aplicativos ao trocar o modo de apresentação, mas não para copiar o pacote completo devido ao tamanho e às dependências.
- **OS.js:** referência histórica de plataforma modular completa; não recomendado como base direta para a PWA enxuta.
- **NoveauWallplayper:** referência separada para experiência de wallpaper HTML/vídeo em tela cheia; não é um gerenciador de desktop e não equivale a wallpaper nativo do ChromeOS.

Nenhum código, design ou asset desses repositórios foi copiado para a v0.2.2. Antes de reutilizar qualquer implementação, verificar licença, avisos de copyright, dependências, segurança, manutenção e compatibilidade.

## 2. Comparação

### 2.1 WebDEX — arquitetura modular recomendada

Repositório: https://github.com/mobinh8585/WebDEX  
Licença encontrada: MIT.  
Último commit observado na consulta: 28/11/2025.

O README descreve um desktop de navegador em HTML, CSS e JavaScript vanilla. A estrutura separa:

- js/managers/windowManager.js: criação, foco, movimentação, redimensionamento e fechamento de janelas.
- js/managers/desktopManager.js: desktop, ícones e wallpaper.
- js/apps/appRegistry.js: registro e lançamento de aplicativos.
- js/core/fileSystemManager.js: armazenamento virtual apoiado em IndexedDB.
- js/core/state.js e js/core/uiConfigs.js: estado e configuração visual.

Também descreve aplicações internas, menus de contexto, importador de apps HTML em iframe sandbox, operações de arquivos, persistência IndexedDB e suporte básico a toque.

**Valor para o Galaxy Legacy:** melhor referência de organização modular. A próxima refatoração poderá separar o código atual em core/, managers/, apps/ e storage/, sem alterar a interface pixel/coquette.

**Ressalvas:** a atividade pública observada é antiga em comparação com SimplexOS e YukiOS; o README registra limitações do navegador iframe e do visualizador de arquivos. Não adotar seu browser iframe como promessa de navegação universal.

### 2.2 SimplexOS — referência de funcionalidades

Repositório: https://github.com/exanx/SimplexOS  
Licença encontrada: MIT.  
Últimas alterações observadas: atualização de licença em 23/08/2026 e alterações em código/apps em 28/06/2026.

O projeto é descrito como um ambiente desktop web em HTML, CSS e JavaScript vanilla, sem backend/framework. O README destaca:

- Janelas arrastáveis, redimensionáveis, minimizáveis e maximizáveis.
- Estado persistido em LocalStorage.
- Taskbar, menu de aplicativos e busca.
- Temas e wallpaper configuráveis.
- Aplicativos de notas, calculadora, relógio, pintura, visualizador de imagens e player de mídia.
- Instalação dinâmica de aplicativos JavaScript e widgets.

A inspeção do repositório mostra um index.html grande (aproximadamente 266 KB no momento da consulta), CSS separado, biblioteca de aplicativos e wallpapers.

**Valor para o Galaxy Legacy:** referência direta para recursos e fluxos de personalização. Boa fonte de ideias para ampliar o conjunto de apps e opções sem introduzir backend.

**Ressalvas:** a implementação principal é bastante concentrada em um HTML grande. Não copiar sua estrutura monolítica como solução final; preferir módulos pequenos e testes próprios. A identidade visual do Galaxy Legacy continuará original.

### 2.3 YukiOS — referência de runtime persistente e shell

Repositório: https://github.com/Reeyuki/YukiOS  
Licença encontrada: MIT, com pedido adicional de atribuição/crédito no README.  
Último commit observado: 06/11/2026.

O README descreve um desktop web em JavaScript vanilla com múltiplos modos, incluindo um modo ChromeOS simplificado, modo macOS, Windows-like, tiling e console. O projeto separa shell visual, gerenciador de janelas, aplicações e armazenamento persistente; declara que aplicativos e estado sobrevivem à troca de modo.

**Valor para o Galaxy Legacy:** estudar a separação entre estado central, janelas e shell; preservar o conteúdo dos apps ao mudar layout, tema ou perfil; considerar workspaces e foco de janelas como evolução futura.

**Ressalvas:** o metadado GitHub consultado indica tamanho de repositório de 228.366 KB. A árvore contém emuladores, WebAssembly e várias bibliotecas de terceiros (por exemplo Ruffle, Three.js, Pyodide e WebContainers). Isso é muito maior do que a necessidade atual e não é apropriado copiar integralmente para o Chromebook Celeron N4000/4 GB RAM. Usar apenas conceitos isolados.

### 2.4 OS.js — referência de plataforma completa, não de MVP

Repositório: https://github.com/os-js/OS.js  
Licença encontrada: BSD 2-Clause.  
Último commit observado: 16/09/2022.

OS.js é uma plataforma de desktop web com window manager, API de aplicativos, GUI toolkit, abstrações de sistema de arquivos e serviços. O pacote consultado usa Node.js, webpack e diversos pacotes de cliente/servidor e aplicativos.

**Valor para o Galaxy Legacy:** estudar conceitos de APIs de apps, diálogos, abstração de filesystem, pacotes e separação cliente/servidor caso o produto cresça bastante.

**Ressalvas:** arquitetura de servidor e conjunto de dependências tornam a adoção direta excessiva para o desktop web leve. O estado de atividade pública observado é antigo.

### 2.5 NoveauWallplayper — referência separada para wallpaper web

Repositório: https://github.com/krnelpan1c/NoveauWallplayper  
Última alteração observada: 31/01/2026.  
Não foi encontrado arquivo LICENSE no diretório principal consultado.

O README descreve um player/visualizador em tela cheia para vídeos e wallpapers web no formato ZIP do Lively Wallpaper, com conteúdo HTML interativo. A experiência fica em tela cheia e janelas de outros apps podem aparecer por cima; isso simula um wallpaper, mas não é uma página HTML realmente desenhada atrás de todo o desktop do sistema.

O pacote consultado usa React, Vite, Framer Motion, IndexedDB, JSZip e plugin PWA.

**Valor para o Galaxy Legacy:** referência para explorar importação e visualização de cenários web/vídeo em uma tela cheia própria, como modo de cena.

**Ressalvas:** não é a base do gerenciador de janelas; exige um conjunto de dependências maior que o MVP atual; não foi encontrada licença que autorize reutilização do código. Não copiar código ou assets sem confirmação de licença.

## 3. Decisão de base técnica

A arquitetura escolhida para continuar:

1. Preservar o HTML/CSS/JS atual como protótipo funcional e a identidade visual original.
2. Usar a divisão modular do WebDEX como referência principal para futura refatoração: core, managers, apps, storage e settings.
3. Usar SimplexOS como referência de funcionalidades vanilla: temas, wallpaper, widgets, apps e menu de aplicativos.
4. Estudar YukiOS para persistência de sessão e separação entre shell e estado, sem incorporar emuladores ou dependências pesadas.
5. Manter OS.js e NoveauWallplayper como referências específicas, não como dependências.

Não é necessário importar um desktop pronto. O código existente já contém a identidade visual, janelas, app demonstrativo, painel de configurações e comportamento auto-ocultável. A prioridade deve ser modularizar e ampliar com regressão controlada, não substituir.

## 4. Requisitos de desempenho

- Não trazer bibliotecas grandes apenas para implementar arraste, resize, foco ou modais simples.
- Preferir Pointer Events e CSS responsivo.
- Carregar aplicativos somente quando abertos.
- Evitar emuladores/WASM, vídeo de wallpaper e animações múltiplas no MVP.
- IndexedDB poderá ser usado para imagens e dados locais maiores, após definir quotas e política de exportação.
- Testar no Chromebook de referência antes de aumentar dependências.

## 5. Fontes consultadas

- WebDEX: https://github.com/mobinh8585/WebDEX
- SimplexOS: https://github.com/exanx/SimplexOS
- YukiOS: https://github.com/Reeyuki/YukiOS
- OS.js: https://github.com/os-js/OS.js
- NoveauWallplayper: https://github.com/krnelpan1c/NoveauWallplayper
