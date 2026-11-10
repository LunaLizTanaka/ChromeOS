# src — módulos do Galaxy Legacy v0.3.0

O projeto executável usa ES Modules nativos; veja o pacote completo v0.3.0 para index.html, estilos, manifesto e assets.

- core/dom.js — helpers DOM
- core/notifications.js — toasts e relógio
- core/storage.js — LocalStorage, IndexedDB do wallpaper e downloads
- core/settings.js — temas, wallpaper, presets e perfis
- managers/window-manager.js — foco, arraste, limites, minimizar, fechar e fullscreen
- managers/edge-panel-manager.js — painéis auto-ocultáveis
- managers/desktop-manager.js — eventos do desktop e abertura de apps
- apps/app-templates.js — templates dos aplicativos
- apps/app-registry.js — criação e conexão dos apps
- apps/paint-app.js — editor Picatsso
- main.js — inicialização

Sem framework de UI ou dependências runtime.
