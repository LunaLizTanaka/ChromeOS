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
  return [
    '<div class="internet-app" id="internetApp">',
      '<div class="internet-intro">',
        '<div><strong>♡ INTERNET</strong><p class="muted">Uma blogoteca independente e uma coleção de livros, filmes, músicas e arquivos.</p></div>',
        '<span class="internet-version">V0.6.0</span>',
      '</div>',
      '<div class="internet-tabs" role="tablist" aria-label="Espaços da Internet">',
        '<button class="internet-tab active" id="internetTabBlogs" type="button" role="tab" aria-selected="true" aria-controls="neocitiesPanel">NEOCITIES</button>',
        '<button class="internet-tab" id="internetTabArchive" type="button" role="tab" aria-selected="false" aria-controls="archivePanel">INTERNET ARCHIVE</button>',
      '</div>',
      '<section class="internet-panel" id="neocitiesPanel" role="tabpanel" aria-labelledby="internetTabBlogs">',
        '<div class="internet-section-heading"><div><span class="internet-kicker">BLOGOTECA SELECIONADA</span><h3>Pequenos cantinhos da web</h3></div><span class="muted">4 blogs verificados</span></div>',
        '<p class="internet-panel-copy muted">Escolha um blog para abrir aqui dentro do Galaxy. Esta lista contém apenas páginas Neocities testadas.</p>',
        '<div class="internet-blog-grid" id="neocitiesCatalog">',
          '<button class="internet-blog-card" type="button" data-blog-id="sweet-pea"><span class="internet-blog-art sweet-pea-art">✿</span><span class="internet-blog-copy"><strong>Sweet-pea</strong><small>Layouts, graphics e um cantinho pessoal</small></span><span class="internet-blog-arrow">›</span></button>',
          '<button class="internet-blog-card" type="button" data-blog-id="sakura-dreams"><span class="internet-blog-art sakura-art">❀</span><span class="internet-blog-copy"><strong>Sakura Dreams</strong><small>Pixel art, stickers e coleções</small></span><span class="internet-blog-arrow">›</span></button>',
          '<button class="internet-blog-card" type="button" data-blog-id="pixel-safari"><span class="internet-blog-art safari-art">▧</span><span class="internet-blog-copy"><strong>Pixel Safari</strong><small>Divisórias, favicons e blinkies</small></span><span class="internet-blog-arrow">›</span></button>',
          '<button class="internet-blog-card" type="button" data-blog-id="rss-list"><span class="internet-blog-art rss-art">⌁</span><span class="internet-blog-copy"><strong>Neocities RSS List</strong><small>Um diretório de páginas pessoais</small></span><span class="internet-blog-arrow">›</span></button>',
        '</div>',
        '<div class="internet-blog-viewer" id="neocitiesViewer" hidden>',
          '<div class="internet-viewer-toolbar"><button class="pixel-btn secondary" id="neocitiesBack" type="button">← BLOGOTECA</button><strong id="neocitiesCurrentTitle">BLOG</strong><button class="internet-control" id="neocitiesReload" type="button" title="Recarregar blog" aria-label="Recarregar blog">⟳</button></div>',
          '<div class="internet-frame" id="neocitiesFrameHost"><div class="internet-placeholder"><span class="internet-placeholder-symbol">୨୧</span><strong>ABRINDO BLOG</strong></div></div>',
        '</div>',
      '</section>',
      '<section class="internet-panel" id="archivePanel" role="tabpanel" aria-labelledby="internetTabArchive" hidden>',
        '<div class="internet-section-heading"><div><span class="internet-kicker">BIBLIOTECA DIGITAL</span><h3>Explore o Internet Archive</h3></div><span class="muted">Busca exclusiva no Archive.org</span></div>',
        '<p class="internet-panel-copy muted">A busca percorre os metadados do acervo, incluindo títulos, criadores, assuntos e outras descrições. Você também pode filtrar por tipo de conteúdo.</p>',
        '<form class="archive-search-form" id="archiveSearchForm">',
          '<label class="field-label" for="archiveSearchInput">O QUE VOCÊ QUER ENCONTRAR?</label>',
          '<div class="archive-search-row">',
            '<input class="field" id="archiveSearchInput" type="search" placeholder="Ex.: Beethoven, Studio Ghibli, horror, manga…" autocomplete="off">',
            '<select class="field" id="archiveMediaType" aria-label="Tipo de conteúdo"><option value="all">Tudo</option><option value="movies">Filmes e vídeos</option><option value="audio">Áudio e música</option><option value="texts">Livros e textos</option><option value="software">Software e jogos</option><option value="image">Imagens</option></select>',
            '<button class="pixel-btn" id="archiveSearchButton" type="submit">PESQUISAR</button>',
          '</div>',
        '</form>',
        '<div class="archive-search-status" id="archiveSearchStatus" role="status" aria-live="polite">Digite algo para pesquisar dentro do Internet Archive.</div>',
        '<div class="archive-results-area" id="archiveResultsArea">',
          '<div class="archive-results-grid" id="archiveResults"></div>',
          '<button class="pixel-btn secondary archive-more" id="archiveMore" type="button" hidden>CARREGAR MAIS RESULTADOS</button>',
        '</div>',
        '<div class="archive-item-viewer" id="archiveViewer" hidden>',
          '<div class="internet-viewer-toolbar archive-viewer-toolbar"><button class="pixel-btn secondary" id="archiveBackResults" type="button">← RESULTADOS</button><strong id="archiveViewerTitle">ITEM DO ACERVO</strong><a class="archive-original-link" id="archiveOpenItem" href="https://archive.org/" target="_blank" rel="noopener noreferrer">PÁGINA COMPLETA ↗</a></div>',
          '<div class="internet-frame archive-frame" id="archiveFrameHost"><div class="internet-placeholder"><span class="internet-placeholder-symbol">▣</span><strong>ABRINDO ITEM</strong></div></div>',
        '</div>',
        '<p class="archive-footnote muted">A pesquisa consulta os metadados do catálogo do Internet Archive (não o texto OCR de dentro de cada livro). A reprodução depende do formato, da disponibilidade do arquivo e das permissões do acervo.</p>',
      '</section>',
    '</div>'
  ].join('');
}

function renderLibrary() {
  return `
    <div class="library-app" id="libraryApp">
      <div class="library-intro"><div><strong>♡ BIBLIOTECA</strong><p class="muted">Livros, mangás, novels e fanfics em um só lugar.</p></div><span class="library-version">V0.7.0</span></div>
      <div class="library-tabs" role="tablist" aria-label="Seções da Biblioteca">
        <button class="library-tab active" type="button" data-library-tab="sites" role="tab" aria-selected="true">PLATAFORMAS</button>
        <button class="library-tab" type="button" data-library-tab="archive" role="tab" aria-selected="false">INTERNET ARCHIVE</button>
        <button class="library-tab" type="button" data-library-tab="openlibrary" role="tab" aria-selected="false">OPEN LIBRARY</button>
        <button class="library-tab" type="button" data-library-tab="shelf" role="tab" aria-selected="false">MINHA ESTANTE</button>
      </div>
      <section class="library-panel" data-library-panel="sites" role="tabpanel">
        <div class="library-section-title"><h3>Explore plataformas</h3><small>Catálogos oficiais e leitores compatíveis</small></div>
        <div class="library-featured"><span class="library-featured-art">LT</span><span class="library-featured-copy"><strong>Little Tyrant Doesn’t Want to Meet with a Bad End</strong><small>Novel chinesa · 670 capítulos concluídos na origem · ficha do Novel Updates</small></span><span class="library-featured-actions"><button class="pixel-btn secondary" id="libraryLittleTyrantLink" type="button">VER FICHA</button><button class="pixel-btn" id="libraryOpenLittleTyrant" type="button">＋ ESTANTE</button></span></div>
        <div class="library-toolbar"><input class="field" id="libraryPlatformSearch" type="search" placeholder="Pesquisar plataforma…" aria-label="Pesquisar plataforma"><select class="field" id="libraryCategory" aria-label="Filtrar categoria"><option value="all">Todas as categorias</option><option value="books">Livros</option><option value="manga">Mangás / manhwas</option><option value="novels">Novels</option><option value="fanfic">Fanfics</option></select></div>
        <p class="library-footnote">“Tentar nesta janela” é apenas um teste visual de iframe: alguns sites bloqueiam incorporação, login ou cookies de terceiros. Se a página ficar vazia, abra-a no Chrome. Serviços com restrições conhecidas permanecem como acesso externo oficial.</p>
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
        <div class="library-reader-toolbar"><button class="pixel-btn secondary" id="libraryReaderBack" type="button">← BIBLIOTECA</button><strong id="libraryReaderTitle">LEITOR</strong><button class="pixel-btn secondary" id="libraryReaderExternal" type="button">ABRIR NO CHROME ↗</button></div>
        <p class="library-reader-status" id="libraryReaderStatus">Aguarde o carregamento do leitor.</p><div class="library-reader-host" id="libraryReaderHost"></div>
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
