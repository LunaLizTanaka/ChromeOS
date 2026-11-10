# src — módulos do Galaxy Legacy v0.4.0

- core/dom.js — helpers DOM
- core/notifications.js — notificações e relógio
- core/storage.js — LocalStorage, IndexedDB do wallpaper e downloads
- core/settings.js — temas, personalização, wallpaper e perfis
- managers/window-manager.js — foco, arraste, minimizar, fechar, maximizar, restaurar e limites
- managers/edge-panel-manager.js — painéis revelados pelas bordas
- managers/desktop-manager.js — delegação de eventos e lançamento de apps
- apps/app-templates.js — templates e títulos dos aplicativos
- apps/app-registry.js — criação e ligação dos apps
- apps/paint-app.js — canvas e ferramentas Picatsso
- apps/notes-manager.js — biblioteca Notes, migração, backup JSON e papéis adesivos persistentes
- main.js — inicialização e composição

O projeto usa ES Modules nativos, sem framework de UI ou dependências runtime.
