export const appTitles = {
  mail: 'MAIL.EXE', trash: 'TRASH', files: 'FILES.EXE', save: 'SAVE CENTER',
  internet: 'INTERNET.EXE', library: 'BIBLIOTECA', notes: 'NOTES.TXT', settings: 'PERSONALIZE',
  paint: 'PICATSSO'
};

export function escapeHtml(value) {
  return String(value).replace(/[&<>"']/g, character => ({
    '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;'
  })[character]);
}


function renderInternet() {
  return `
    <div class="internet-app" id="internetApp">
      <div class="internet-browser-chrome">
        <div class="internet-browser-tabstrip">
          <div class="internet-browser-tabs" id="internetBrowserTabs" role="tablist" aria-label="Abas do navegador"></div>
          <button class="internet-new-tab-button" id="internetNewTab" type="button" title="Nova aba (Ctrl+T)" aria-label="Nova aba">＋</button>
        </div>
        <form class="internet-browser-toolbar" id="internetAddressForm" autocomplete="off">
          <button class="internet-browser-control" id="internetBrowserBack" type="button" title="Voltar (Alt+←)" aria-label="Voltar" disabled>‹</button>
          <button class="internet-browser-control" id="internetBrowserForward" type="button" title="Avançar (Alt+→)" aria-label="Avançar" disabled>›</button>
          <button class="internet-browser-control" id="internetBrowserReload" type="button" title="Atualizar (Ctrl+R)" aria-label="Atualizar" disabled>↻</button>
          <button class="internet-browser-control" id="internetBrowserHome" type="button" title="Página inicial" aria-label="Página inicial">⌂</button>
          <div class="internet-address-wrap">
            <span class="internet-address-lock" aria-hidden="true">⌕</span>
            <input id="internetAddressInput" type="text" inputmode="url" list="internetAddressSuggestions" placeholder="Pesquise ou digite um endereço da web" aria-label="Pesquisar ou digitar endereço" spellcheck="false">
            <datalist id="internetAddressSuggestions"></datalist>
          </div>
          <select id="internetSearchEngine" class="internet-search-engine" aria-label="Mecanismo de pesquisa">
            <option value="google">Google</option>
            <option value="bing">Bing</option>
            <option value="duckduckgo">DuckDuckGo</option>
          </select>
          <button class="internet-browser-control internet-bookmark-current" id="internetBookmarkCurrent" type="button" title="Salvar página nos favoritos" aria-label="Salvar página nos favoritos" disabled>☆</button>
          <button class="internet-browser-control" id="internetShowBookmarks" type="button" title="Favoritos" aria-label="Favoritos">☆</button>
          <button class="internet-browser-control" id="internetShowHistory" type="button" title="Histórico" aria-label="Histórico">◷</button>
          <button class="internet-browser-control" id="internetFindButton" type="button" title="Pesquisar nesta página (Ctrl+F)" aria-label="Pesquisar nesta página">⌕</button>
          <button class="internet-browser-control" id="internetImmersiveButton" type="button" title="Modo imersivo" aria-label="Modo imersivo">⛶</button>
          <button class="internet-browser-control internet-open-external" id="internetOpenExternal" type="button" title="Abrir no Chrome" aria-label="Abrir no Chrome" disabled>↗</button>
          <button class="internet-browser-control internet-close-window" id="internetCloseWindow" type="button" title="Fechar janela Internet" aria-label="Fechar janela Internet">×</button>
        </form>
        <div class="internet-browser-bookmarkbar">
          <span>FAVORITOS</span>
          <div class="internet-bookmarkbar-items" id="internetBookmarkBar"><small>Salve páginas usando ☆ para colocá-las aqui.</small></div>
        </div>
        <div class="internet-browser-panels">
          <section class="internet-browser-popover" id="internetBookmarksPanel" hidden>
            <div class="internet-popover-heading"><strong>Meus favoritos</strong><button type="button" data-close-popover="bookmarks" aria-label="Fechar favoritos">×</button></div>
            <div class="internet-popover-list" id="internetBookmarksList"></div>
          </section>
          <section class="internet-browser-popover" id="internetHistoryPanel" hidden>
            <div class="internet-popover-heading"><strong>Histórico de navegação</strong><button type="button" id="internetClearHistory">Limpar</button><button type="button" data-close-popover="history" aria-label="Fechar histórico">×</button></div>
            <div class="internet-popover-list" id="internetHistoryList"></div>
          </section>
        </div>
        <div class="internet-findbar" id="internetFindBar" hidden>
          <span>LOCALIZAR</span>
          <input id="internetFindInput" type="search" placeholder="Palavra nesta página…" aria-label="Texto para localizar">
          <button type="button" id="internetFindPrevious" title="Ocorrência anterior">↑</button>
          <button type="button" id="internetFindNext" title="Próxima ocorrência">↓</button>
          <small id="internetFindStatus" role="status">Digite para procurar.</small>
          <button type="button" id="internetFindClose" aria-label="Fechar pesquisa">×</button>
        </div>
      </div>

      <div class="internet-browser-status" id="internetBrowserStatus" role="status" aria-live="polite">♡ Galaxy Web está pronta. Pesquise ou digite um endereço para começar.</div>
      <main class="internet-page-host" id="internetPageHost">
        <section class="internet-browser-page active" id="internetHomeBrowserPage">
          <div class="internet-home-content" id="internetHomePage">
            <header class="internet-hero-banner">
              <svg class="internet-hero-illustration" viewBox="0 0 1000 180" preserveAspectRatio="xMidYMid slice" aria-hidden="true">
                <defs><linearGradient id="glInternetBannerWash" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#f3b8d0"/><stop offset=".48" stop-color="#ffe4ee"/><stop offset="1" stop-color="#e9cbe9"/></linearGradient><radialGradient id="glInternetPetal"><stop offset="0" stop-color="#fff8fc"/><stop offset="1" stop-color="#d987aa"/></radialGradient></defs>
                <rect width="1000" height="180" fill="url(#glInternetBannerWash)"/>
                <path d="M-20 160Q90 30 190 115T385 105M1020 165Q920 25 820 113T620 110" fill="none" stroke="#a96e8d" stroke-width="3" opacity=".35"/>
                <g fill="#94a57f" stroke="#80936f" stroke-width="1.5" opacity=".72"><ellipse cx="94" cy="85" rx="22" ry="9" transform="rotate(-28 94 85)"/><ellipse cx="151" cy="51" rx="23" ry="9" transform="rotate(34 151 51)"/><ellipse cx="193" cy="128" rx="24" ry="9" transform="rotate(-45 193 128)"/><ellipse cx="893" cy="70" rx="25" ry="9" transform="rotate(27 893 70)"/><ellipse cx="835" cy="134" rx="22" ry="8" transform="rotate(-35 835 134)"/><ellipse cx="940" cy="116" rx="24" ry="8" transform="rotate(45 940 116)"/></g>
                <g fill="url(#glInternetPetal)" stroke="#c982a2" stroke-width="2" opacity=".9"><g transform="translate(111 91)"><ellipse cy="-19" rx="11" ry="19"/><ellipse cy="19" rx="11" ry="19"/><ellipse cx="-19" rx="19" ry="11"/><ellipse cx="19" rx="19" ry="11"/><circle r="8" fill="#fff4bd"/></g><g transform="translate(885 101) scale(.8)"><ellipse cy="-19" rx="11" ry="19"/><ellipse cy="19" rx="11" ry="19"/><ellipse cx="-19" rx="19" ry="11"/><ellipse cx="19" rx="19" ry="11"/><circle r="8" fill="#fff4bd"/></g><g transform="translate(760 37) scale(.5)"><ellipse cy="-19" rx="11" ry="19"/><ellipse cy="19" rx="11" ry="19"/><ellipse cx="-19" rx="19" ry="11"/><ellipse cx="19" rx="19" ry="11"/><circle r="8" fill="#fff4bd"/></g></g>
                <g fill="#fff" opacity=".8"><path d="M265 36l4 10 10 4-10 4-4 10-4-10-10-4 10-4z"/><path d="M710 118l3 8 8 3-8 3-3 8-3-8-8-3 8-3z"/><circle cx="340" cy="146" r="3"/><circle cx="661" cy="31" r="3"/></g>
                <g fill="#b97d9a" opacity=".75"><path d="M72 142q-18-21-35 0q17-4 25 13q0-12 10-13z"/><path d="M955 45q-18-21-35 0q17-4 25 13q0-12 10-13z"/></g>
              </svg>
              <div class="internet-hero-ornaments" aria-hidden="true"><span>✿</span><span>୨୧</span><span>❀</span><span>♡</span><span>✧</span></div>
              <div class="internet-hero-title"><small>BEM-VINDA AO MEU CANTINHO</small><strong>Galaxy Web</strong><span>pequenas descobertas em um cantinho da internet</span></div>
              <div class="internet-hero-seal" aria-hidden="true"><span>♡</span><small>DESDE</small><b>2026</b></div>
            </header>
            <div class="internet-banner-editor" aria-label="Personalizar banner">
              <span>CAPA DA SUA INTERNET</span>
              <button type="button" id="internetChooseBanner">✧ ESCOLHER IMAGEM</button>
              <button type="button" id="internetResetBanner" hidden>RESTAURAR ORIGINAL</button>
              <input type="file" id="internetBannerFile" accept="image/png,image/jpeg,image/webp,image/gif,image/avif" hidden>
            </div>
            <div class="internet-lace-divider" aria-hidden="true">❀ · · · ୨୧ · · · ♡ · · · ୨୧ · · · ❀</div>
            <div class="internet-site-shell">
              <nav class="internet-tabs" role="tablist" aria-label="Espaços da Internet">
                <button class="internet-tab active" id="internetTabArchive" type="button" role="tab" aria-selected="true" aria-controls="archivePanel"><span>⌂</span> INÍCIO / ARCHIVE</button>
                <button class="internet-tab" id="internetTabBlogs" type="button" role="tab" aria-selected="false" aria-controls="neocitiesPanel"><span>✿</span> NEOCITIES</button>
                <span class="internet-nav-note">♡ sua pequena janela para a web ♡</span>
              </nav>
              <section class="internet-panel internet-archive-panel" id="archivePanel" role="tabpanel" aria-labelledby="internetTabArchive">
                <div class="internet-archive-layout">
                  <aside class="internet-profile-card">
                    <div class="internet-profile-avatar" aria-hidden="true"><span>✿</span><i>୨୧</i></div>
                    <strong>Bem-vinda, visitante!</strong><p>Faça uma pausa, explore os arquivos antigos e encontre algo especial para ler, ouvir ou assistir.</p>
                    <div class="internet-profile-divider">୨୧ · · · ୨୧</div><div class="internet-profile-info"><span>♡ DIGITAL CORNER</span><b>Feito com carinho</b><small>Archive.org · Neocities</small></div><div class="internet-profile-stamps" aria-hidden="true"><span>✧</span><span>♡</span><span>✿</span></div>
                  </aside>
                  <div class="internet-archive-content">
                    <div class="internet-section-heading archive-heading"><div><span class="internet-kicker">PESQUISA DO ARQUIVO</span><h3>O que vamos descobrir hoje?</h3></div><span class="internet-heading-note">pesquisa do Archive.org ♡</span></div>
                    <form class="archive-search-form" id="archiveSearchForm">
                      <label class="field-label" for="archiveSearchInput">O QUE VOCÊ PROCURA HOJE?</label>
                      <div class="archive-search-row"><div class="archive-search-input-wrap"><span aria-hidden="true">⌕</span><input class="field" id="archiveSearchInput" type="search" placeholder="Pesquise livros, filmes, músicas, imagens e mais…" autocomplete="off"></div>
                        <select class="field" id="archiveMediaType" aria-label="Tipo de conteúdo"><option value="all">Tudo</option><option value="movies">Filmes e vídeos</option><option value="audio">Áudio e música</option><option value="texts">Livros e textos</option><option value="software">Programas e jogos</option><option value="image">Imagens</option></select><button class="pixel-btn" id="archiveSearchButton" type="submit">PESQUISAR ♡</button></div>
                    </form>
                    <div class="archive-neocities-shortcuts"><div class="archive-shortcuts-heading"><div><span class="internet-kicker">ATALHOS RÁPIDOS</span><strong>Seus sites Neocities</strong></div><span>4 favoritos</span></div>
                      <div class="archive-neocities-links" id="archiveNeocitiesShortcuts">
                        <button type="button" class="archive-neocities-link" data-blog-id="sweet-pea"><span>✿</span><b>Sweet-pea</b></button><button type="button" class="archive-neocities-link" data-blog-id="sakura-dreams"><span>❀</span><b>Sakura Dreams</b></button><button type="button" class="archive-neocities-link" data-blog-id="pixel-safari"><span>▧</span><b>Pixel Safari</b></button><button type="button" class="archive-neocities-link" data-blog-id="rss-list"><span>⌁</span><b>RSS List</b></button>
                      </div>
                    </div>
                    <div class="archive-search-status" id="archiveSearchStatus" role="status" aria-live="polite">Digite uma pesquisa acima ou escolha um dos seus sites favoritos para visitar.</div>
                    <div class="archive-explore-collections" id="archiveExploreCollections"><span>OU EXPLORE POR CATEGORIA</span><button type="button" data-archive-type="texts">▤ Livros</button><button type="button" data-archive-type="audio">♫ Áudio</button><button type="button" data-archive-type="movies">▣ Filmes</button><button type="button" data-archive-type="image">▧ Imagens</button><button type="button" data-archive-type="software">✧ Software</button></div>
                    <div class="archive-results-area" id="archiveResultsArea"><div class="archive-results-grid" id="archiveResults"></div><button class="pixel-btn secondary archive-more" id="archiveMore" type="button" hidden>CARREGAR MAIS RESULTADOS</button></div>
                    <div class="archive-item-viewer" id="archiveViewer" hidden><div class="internet-viewer-toolbar archive-viewer-toolbar"><button class="pixel-btn secondary" id="archiveBackResults" type="button">← RESULTADOS</button><strong id="archiveViewerTitle">ITEM DO ACERVO</strong><a class="archive-original-link" id="archiveOpenItem" href="https://archive.org/" target="_blank" rel="noopener noreferrer">PÁGINA COMPLETA ↗</a></div><div class="internet-frame archive-frame" id="archiveFrameHost"><div class="internet-placeholder"><span class="internet-placeholder-symbol">▣</span><strong>ABRINDO ITEM</strong></div></div></div>
                    <p class="archive-footnote muted">A pesquisa usa os metadados do catálogo do Archive.org. A reprodução ou leitura depende do formato, da disponibilidade e das permissões de cada item.</p>
                  </div>
                </div>
              </section>
              <section class="internet-panel internet-neocities-panel" id="neocitiesPanel" role="tabpanel" aria-labelledby="internetTabBlogs" hidden>
                <div class="internet-section-heading"><div><span class="internet-kicker">BLOGOTECA SELECIONADA</span><h3>Pequenos cantinhos pela web</h3></div><span class="internet-heading-note">4 páginas Neocities selecionadas</span></div>
                <p class="internet-panel-copy muted">Escolha um site para abrir a página completa dentro do navegador do Galaxy Legacy.</p>
                <div class="internet-blog-grid" id="neocitiesCatalog">
                  <button class="internet-blog-card" type="button" data-blog-id="sweet-pea"><span class="internet-blog-art sweet-pea-art">✿</span><span class="internet-blog-copy"><strong>Sweet-pea</strong><small>Layouts, graphics e um cantinho pessoal</small></span><span class="internet-blog-arrow">›</span></button>
                  <button class="internet-blog-card" type="button" data-blog-id="sakura-dreams"><span class="internet-blog-art sakura-art">❀</span><span class="internet-blog-copy"><strong>Sakura Dreams</strong><small>Pixel art, stickers e coleções</small></span><span class="internet-blog-arrow">›</span></button>
                  <button class="internet-blog-card" type="button" data-blog-id="pixel-safari"><span class="internet-blog-art safari-art">▧</span><span class="internet-blog-copy"><strong>Pixel Safari</strong><small>Divisórias, favicons e blinkies</small></span></button>
                  <button class="internet-blog-card" type="button" data-blog-id="rss-list"><span class="internet-blog-art rss-art">⌁</span><span class="internet-blog-copy"><strong>Neocities RSS List</strong><small>Um diretório de páginas pessoais</small></span></button>
                </div>
              </section>
            </div>
            <div class="internet-lace-divider internet-footer-lace" aria-hidden="true">୨୧ · · · ♡ · · · ❀ · · · ♡ · · · ୨୧</div>
          </div>
          <div class="internet-web-host" data-web-host hidden></div>
        </section>
      </main>
      <div class="internet-immersive-hint" id="internetImmersiveHint" hidden><span>Modo de leitura imersivo</span><button type="button" id="internetExitImmersive">SAIR DA TELA CHEIA ✕</button></div>
    </div>
  `;
}

function renderLibrary() {
  return `
    <div class="library-app" id="libraryApp">
      <div class="library-intro"><div><strong>♡ BIBLIOTECA</strong><p class="muted">Livros, novels e fanfics em um só lugar.</p></div><span class="library-version">V0.9.0</span></div>
      <div class="library-tabs" role="tablist" aria-label="Seções da Biblioteca">
        <button class="library-tab active" type="button" data-library-tab="sites" role="tab" aria-selected="true">PLATAFORMAS</button>
        <button class="library-tab" type="button" data-library-tab="archive" role="tab" aria-selected="false">INTERNET ARCHIVE</button>
        <button class="library-tab" type="button" data-library-tab="openlibrary" role="tab" aria-selected="false">OPEN LIBRARY</button>
        <button class="library-tab" type="button" data-library-tab="shelf" role="tab" aria-selected="false">MINHA ESTANTE</button>
      </div>
      <section class="library-panel" data-library-panel="sites" role="tabpanel">
        <div class="library-section-title"><h3>Explore plataformas</h3><small>Catálogos oficiais e leitores compatíveis</small></div>
        <div class="library-toolbar"><input class="field" id="libraryPlatformSearch" type="search" placeholder="Pesquisar plataforma…" aria-label="Pesquisar plataforma"><select class="field" id="libraryCategory" aria-label="Filtrar categoria"><option value="all">Todas as categorias</option><option value="books">Livros</option><option value="novels">Novels</option><option value="fanfic">Fanfics</option></select></div>
        <p class="library-footnote">“Abrir na Biblioteca” tenta carregar a página oficial em um iframe: alguns sites bloqueiam incorporação, login ou cookies de terceiros. Se a página ficar vazia, abra-a no Chrome. Serviços com restrições conhecidas permanecem como acesso externo oficial.</p>
        <div class="library-platform-grid" id="libraryPlatforms"></div>
      </section>
      <section class="library-panel" data-library-panel="archive" role="tabpanel" hidden>
        <div class="library-section-title"><h3>Livros e textos do Internet Archive</h3><small>Busca no catálogo de textos</small></div>
        <form class="library-toolbar" id="libraryArchiveForm"><input class="field" id="libraryArchiveInput" type="search" placeholder="Título, autor ou assunto…" autocomplete="off" aria-label="Pesquisar Internet Archive"><button class="pixel-btn" type="submit">PESQUISAR</button></form>
        <div class="library-search-status" id="libraryArchiveStatus" role="status" aria-live="polite">Pesquise livros e textos. A leitura depende da disponibilidade e das permissões de cada item.</div>
        <div class="library-results" id="libraryArchiveResults"></div>
        <button class="pixel-btn secondary library-results-more" id="libraryArchiveMore" type="button" hidden>CARREGAR MAIS</button>
      </section>
      <section class="library-panel" data-library-panel="openlibrary" role="tabpanel" hidden>
        <div class="library-section-title"><h3>Pesquisar no Open Library</h3><small>Catálogo de autores, obras e edições</small></div>
        <form class="library-toolbar" id="openLibrarySearchForm"><input class="field" id="openLibrarySearchInput" type="search" placeholder="Nome do livro, autor ou tema…" autocomplete="off" aria-label="Pesquisar Open Library"><button class="pixel-btn" type="submit">PESQUISAR</button></form>
        <div class="library-search-status" id="openLibrarySearchStatus" role="status" aria-live="polite">Resultados com cópia digital vinculada podem abrir no BookReader oficial do Internet Archive.</div>
        <div class="library-results" id="openLibraryResults"></div>
        <p class="library-footnote">A API pública do Open Library é usada para buscas pontuais, não para baixar catálogos em massa. Alguns registros não possuem cópia legível; outros exigem empréstimo ou login.</p>
      </section>
      <section class="library-panel" data-library-panel="shelf" role="tabpanel" hidden>
        <div class="library-section-title"><h3>Minha estante</h3><small>Links salvos neste navegador</small></div>
        <div class="library-toolbar"><button class="pixel-btn secondary" id="libraryExportShelf" type="button">EXPORTAR JSON</button><label class="pixel-btn secondary" for="libraryImportShelf" style="display:inline-flex;align-items:center;cursor:pointer">IMPORTAR JSON</label><input id="libraryImportShelf" type="file" accept="application/json,.json" hidden></div>
        <div class="library-shelf-list" id="libraryShelfList"></div>
        <form class="library-add-shelf" id="libraryAddShelfForm"><input class="field" id="libraryAddShelfTitle" type="text" maxlength="180" placeholder="Título da história ou livro" required aria-label="Título"><input class="field" id="libraryAddShelfUrl" type="url" placeholder="https://…" required aria-label="Endereço HTTPS"><button class="pixel-btn" type="submit">＋ SALVAR LINK</button></form>
        <p class="library-footnote">A estante guarda títulos e links; não copia capítulos nem acessa contas. Os dados ficam localmente neste navegador. Use exportação JSON para fazer backup.</p>
      </section>
      <section class="library-panel library-reader-panel" id="libraryReaderPanel" data-library-panel="reader" role="tabpanel" hidden>
        <div class="library-reader-toolbar">
          <button class="pixel-btn secondary library-reader-home" id="libraryReaderBack" type="button">← BIBLIOTECA</button>
          <div class="library-browser-nav">
            <button class="pixel-btn secondary" id="libraryBrowserBack" type="button" aria-label="Voltar" title="Voltar">‹</button>
            <button class="pixel-btn secondary" id="libraryBrowserForward" type="button" aria-label="Avançar" title="Avançar">›</button>
            <button class="pixel-btn secondary" id="libraryBrowserReload" type="button" aria-label="Atualizar" title="Atualizar">↻</button>
            <form id="libraryReaderAddressForm" class="library-browser-address">
              <input id="libraryReaderAddress" type="url" inputmode="url" autocomplete="url" placeholder="Endereço de uma plataforma da Biblioteca…" aria-label="Endereço para navegar dentro da Biblioteca">
              <button class="pixel-btn" type="submit">IR</button>
            </form>
          </div>
          <strong id="libraryReaderTitle">LEITOR</strong>
          <button class="pixel-btn secondary library-reader-external" id="libraryReaderExternal" type="button">ABRIR NO CHROME ↗</button>
        </div>
        <p class="library-reader-status" id="libraryReaderStatus">A navegação interna depende de cada plataforma permitir iframe. Sites que bloqueiam continuarão disponíveis no Chrome.</p>
        <div class="library-reader-host" id="libraryReaderHost"></div>
      </section>
    </div>`;
}

function renderPaint() {
  return `<div class="paint-layout"><div class="tools"><button title="Lápis" data-tool="pen">✎</button><button title="Borracha" data-tool="erase">▱</button><button title="Pincel" data-tool="brush">✿</button><button title="Limpar" id="clearCanvas">⌫</button></div><div class="paint-canvas-wrap"><canvas class="paint-canvas" id="paintCanvas" width="620" height="360"></canvas></div></div><div class="palette" id="palette"><button class="swatch selected" style="background:#f5a9c8" data-color="#f5a9c8"></button><button class="swatch" style="background:#ffd98c" data-color="#ffd98c"></button><button class="swatch" style="background:#fff0b9" data-color="#fff0b9"></button><button class="swatch" style="background:#bdebe5" data-color="#bdebe5"></button><button class="swatch" style="background:#b9c9f2" data-color="#b9c9f2"></button><button class="swatch" style="background:#c9c4e9" data-color="#c9c4e9"></button><button class="swatch" style="background:#fff" data-color="#fff"></button><button class="swatch" style="background:#765064" data-color="#765064"></button></div><div class="paint-bottom"><span>♡ draw something sweet</span><button class="pixel-btn" id="downloadArt">SAVE ART</button></div>`;
}

export function renderAppContent(name) {
  if (name === 'paint') return renderPaint();
  if (name === 'mail') return '<div class="panel-card"><strong>♡ Welcome to your mailbox</strong><p class="muted">This is a local demo inbox. Online mail services open in your browser.</p></div><div class="list-row"><span>♡ A note from Galaxy Legacy</span><span class="muted">Today</span></div><div class="list-row"><span>✿ Your desktop is looking lovely!</span><span class="muted">Yesterday</span></div><button class="pixel-btn" data-open-url="https://mail.google.com">OPEN WEBMAIL</button>';
  if (name === 'trash') return '<div class="panel-card" style="text-align:center;padding:25px"><div style="font-size:38px">♡</div><strong>TRASH IS EMPTY</strong><p class="muted">No lost stickers here!</p></div>';
  if (name === 'files') return '<div class="file-drop"><strong>MY LITTLE FILES</strong><p>Choose files from your Chromebook to preview their names here. Nothing is uploaded.</p><input type="file" id="localFiles" multiple></div><div id="fileList" class="panel-card muted">No files selected yet.</div><p class="muted">Cloud storage is a future module and is not connected in this prototype.</p>';
  if (name === 'save') return '<div class="panel-card"><strong>DESKTOP SAVE CENTER</strong><p class="muted">Export or import your visual preferences as JSON.</p><button class="pixel-btn" id="exportSettings">EXPORT PROFILE</button> <label class="pixel-btn" for="importSettings" style="display:inline-block">IMPORT PROFILE</label><input id="importSettings" type="file" accept="application/json" hidden></div><p class="muted">Notes and custom settings stay in this browser profile in this prototype.</p>';
  if (name === 'internet') return renderInternet();
  if (name === 'library') return renderLibrary();
  if (name === 'notes') return `
    <div class="notes-app" id="notesApp">
      <div class="notes-toolbar">
        <input class="field notes-search" id="notesSearch" type="search" placeholder="Pesquisar nas minhas notas…" aria-label="Pesquisar notas">
        <button class="pixel-btn" id="newNote">+ NOVA NOTA</button>
        <button class="pixel-btn secondary" id="exportNotes">EXPORTAR</button>
        <label class="pixel-btn secondary notes-import-label" for="importNotes">IMPORTAR</label>
        <input id="importNotes" type="file" accept="application/json,.json" hidden>
      </div>
      <div class="notes-toolbar-secondary">
        <label><input type="checkbox" id="showArchivedNotes"> Mostrar arquivadas</label>
        <span id="notesCount" class="muted">0 notas</span>
      </div>
      <div class="notes-layout">
        <aside class="notes-list-panel"><div id="notesList" class="notes-list"></div></aside>
        <section class="notes-editor-panel">
          <div id="notesEditorEmpty" class="notes-editor-empty">
            <span class="notes-empty-symbol">୨୧</span><strong>Seu cantinho de ideias</strong>
            <p>Crie uma nota ou escolha uma da lista.</p>
            <button class="pixel-btn" data-create-first-note>CRIAR PRIMEIRA NOTA</button>
          </div>
          <div id="notesEditor" class="notes-editor" hidden>
            <div class="notes-title-row">
              <input class="field notes-title-input" id="noteTitle" maxlength="120" placeholder="Título da nota" aria-label="Título da nota">
              <button class="pixel-btn secondary" id="noteFavorite">☆ FAVORITAR</button>
            </div>
            <label class="field-label" for="noteBody">CONTEÚDO</label>
            <textarea class="note-area notes-body-input" id="noteBody" maxlength="50000" placeholder="Escreva suas ideias aqui…"></textarea>
            <p class="notes-body-help muted" id="noteBodyHelp">Sua anotação é salva automaticamente neste navegador.</p>
            <div class="notes-options-row">
              <div><label class="field-label" for="noteType">TIPO</label><select class="field" id="noteType"><option value="text">Texto livre</option><option value="checklist">Checklist</option></select></div>
              <div><label class="field-label" for="noteColor">PAPEL</label><select class="field" id="noteColor"><option value="pink">Rosa</option><option value="mint">Menta</option><option value="butter">Baunilha</option><option value="lilac">Lilás</option><option value="blue">Azul</option><option value="white">Branco</option></select></div>
            </div>
            <div class="notes-actions-row">
              <button class="pixel-btn" id="pinNote">FIXAR NO DESKTOP</button>
              <button class="pixel-btn secondary" id="duplicateNote">DUPLICAR</button>
              <button class="pixel-btn secondary" id="archiveNote">ARQUIVAR</button>
              <button class="pixel-btn notes-delete-btn" id="deleteNote">EXCLUIR</button>
            </div>
            <div class="notes-save-line"><span id="noteSaveStatus">Salvo</span><span>♡ Salvo neste navegador</span></div>
          </div>
        </section>
      </div>
    </div>`;
  if (name === 'settings') return '<div class="panel-card"><strong>DESKTOP PERSONALIZATION</strong><p class="muted">Make this little space yours.</p><div class="field-label">COLOR THEMES</div><div class="theme-choice"><button title="Mint Strawberry" data-theme="mint" style="background:#bdebe5"></button><button title="Strawberry Milk" data-theme="strawberry" style="background:#f5c5d9"></button><button title="Lavender Dream" data-theme="lavender" style="background:#c9c4e9"></button><button title="Buttercream" data-theme="butter" style="background:#fff0b9"></button></div><div class="settings-grid"><div><label class="field-label" for="uiScale">ICON & UI SIZE</label><input class="field" id="uiScale" type="range" min="0.8" max="1.2" step="0.05" value="1"></div><div><label class="field-label" for="wallpaperFile">OWN WALLPAPER</label><input class="field" id="wallpaperFile" type="file" accept="image/png,image/jpeg,image/webp"></div></div><div class="switch-row"><span>Show pixel grid</span><input type="checkbox" id="gridToggle" checked></div><div class="switch-row"><span>Show coquette decorations</span><input type="checkbox" id="bowsToggle" checked></div><div class="switch-row"><span>Soft square window corners</span><input type="checkbox" id="pixelToggle"></div><div class="window-footer"><button class="pixel-btn" id="resetSettings">RESET</button><button class="pixel-btn" id="saveSettings">SAVE LOOK</button></div></div><div class="panel-card"><strong>PROFILE PRESETS</strong><p class="muted">Save a theme preset or export it for later.</p><div class="profile-list"><button class="pixel-btn" id="savePreset">SAVE PRESET</button><button class="pixel-btn" id="exportProfile">EXPORT JSON</button></div></div><p class="muted">Wallpaper images are kept only in this browser in this prototype. Cloud sync is not connected yet.</p>';
  return '';
}
