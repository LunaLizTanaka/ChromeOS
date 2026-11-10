export const appTitles = {
  mail: 'MAIL.EXE', trash: 'TRASH', files: 'FILES.EXE', save: 'SAVE CENTER',
  internet: 'INTERNET.EXE', notes: 'NOTES.TXT', settings: 'PERSONALIZE',
  paint: 'PICATSSO'
};

export function escapeHtml(value) {
  return String(value).replace(/[&<>"']/g, character => ({
    '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;'
  })[character]);
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
  if (name === 'internet') return '<div class="browser-home"><div class="browser-intro"><strong>♡ INTERNET</strong><p class="muted">Pesquise na web ou digite o endereço de um site.</p></div><label class="field-label" for="webAddress">ENDEREÇO OU PESQUISA</label><div class="browser-bar"><input class="field" id="webAddress" type="text" inputmode="url" placeholder="Ex.: wikipedia.org ou flores kawaii" autocomplete="url" aria-label="Endereço ou pesquisa"><button class="pixel-btn" id="goWeb">NAVEGAR</button></div><div class="browser-actions"><button class="pixel-btn secondary" id="openHere">TENTAR ABRIR AQUI</button><button class="pixel-btn secondary" id="openChrome" disabled>ABRIR NO CHROME</button></div><div class="browser-quicklinks"><a href="https://www.google.com" data-quick-url>GOOGLE ↗</a><a href="https://duckduckgo.com" data-quick-url>DUCKDUCKGO ↗</a><a href="https://www.wikipedia.org" data-quick-url>WIKIPEDIA ↗</a></div><div class="browser-view" id="browserView"><div><strong>SEU ESPAÇO NA INTERNET</strong><p class="muted">Use NAVEGAR para abrir o endereço em uma nova aba do Chrome. TENTAR ABRIR AQUI funciona apenas em sites que permitem incorporação.</p></div></div><p class="browser-hint muted">Alguns sites bloqueiam a exibição dentro de outros sites. Nesses casos, abra em uma nova aba do Chrome.</p></div>';
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
