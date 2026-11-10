import { storage } from '../core/storage.js';

export const appTitles = {
  mail: 'MAIL.EXE', trash: 'TRASH', files: 'FILES.EXE', save: 'SAVE CENTER',
  internet: 'INTERNET.EXE', notes: 'NOTES.TXT', settings: 'PERSONALIZE',
  paint: 'PICATSSO', cats: 'CATZ.EXE'
};

export function escapeHtml(value) {
  return String(value).replace(/[&<>"']/g, character => ({
    '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;'
  })[character]);
}


function catSvg(fill = '#fff') {
  return `<svg viewBox="0 0 40 40" aria-hidden="true"><path d="M6 15L5 4L14 10Q20 6 26 10L35 4L34 16Q38 30 20 34Q2 31 6 15Z" fill="${fill}" stroke="#9d6680" stroke-width="2"/><circle cx="14" cy="19" r="2" fill="#765064"/><circle cx="26" cy="19" r="2" fill="#765064"/><path d="M17 24L20 26L23 24" stroke="#d67f9e" fill="none" stroke-width="2"/></svg>`;
}

function renderCats() {
  const colors = ['#fff', '#fff0b9', '#c9c4e9', '#bdebe5', '#f5c5d9', '#fff', '#c9c4e9', '#fff0b9', '#bdebe5', '#f5c5d9'];
  return `<div class="cat-grid" id="catGrid">${colors.map(color => `<div class="cat-tile">${catSvg(color)}</div>`).join('')}</div><div class="window-footer"><span>♡ 10 tiny friends found</span><button class="pixel-btn" id="moreCats">MORE CATS</button></div>`;
}

function renderPaint() {
  return `<div class="paint-layout"><div class="tools"><button title="Lápis" data-tool="pen">✎</button><button title="Borracha" data-tool="erase">▱</button><button title="Pincel" data-tool="brush">✿</button><button title="Limpar" id="clearCanvas">⌫</button></div><div class="paint-canvas-wrap"><canvas class="paint-canvas" id="paintCanvas" width="620" height="360"></canvas></div></div><div class="palette" id="palette"><button class="swatch selected" style="background:#f5a9c8" data-color="#f5a9c8"></button><button class="swatch" style="background:#ffd98c" data-color="#ffd98c"></button><button class="swatch" style="background:#fff0b9" data-color="#fff0b9"></button><button class="swatch" style="background:#bdebe5" data-color="#bdebe5"></button><button class="swatch" style="background:#b9c9f2" data-color="#b9c9f2"></button><button class="swatch" style="background:#c9c4e9" data-color="#c9c4e9"></button><button class="swatch" style="background:#fff" data-color="#fff"></button><button class="swatch" style="background:#765064" data-color="#765064"></button></div><div class="paint-bottom"><span>♡ draw something sweet</span><button class="pixel-btn" id="downloadArt">SAVE ART</button></div>`;
}

export function renderAppContent(name) {
  if (name === 'cats') return renderCats();
  if (name === 'paint') return renderPaint();
  if (name === 'mail') return '<div class="panel-card"><strong>♡ Welcome to your mailbox</strong><p class="muted">This is a local demo inbox. Online mail services open in your browser.</p></div><div class="list-row"><span>♡ A note from the sticker club</span><span class="muted">Today</span></div><div class="list-row"><span>✿ Your desktop is looking lovely!</span><span class="muted">Yesterday</span></div><button class="pixel-btn" data-open-url="https://mail.google.com">OPEN WEBMAIL</button>';
  if (name === 'trash') return '<div class="panel-card" style="text-align:center;padding:25px"><div style="font-size:38px">♡</div><strong>TRASH IS EMPTY</strong><p class="muted">No lost stickers here!</p></div>';
  if (name === 'files') return '<div class="file-drop"><strong>MY LITTLE FILES</strong><p>Choose files from your Chromebook to preview their names here. Nothing is uploaded.</p><input type="file" id="localFiles" multiple></div><div id="fileList" class="panel-card muted">No files selected yet.</div><p class="muted">Cloud storage is a future module and is not connected in this prototype.</p>';
  if (name === 'save') return '<div class="panel-card"><strong>DESKTOP SAVE CENTER</strong><p class="muted">Export or import your visual preferences as JSON.</p><button class="pixel-btn" id="exportSettings">EXPORT PROFILE</button> <label class="pixel-btn" for="importSettings" style="display:inline-block">IMPORT PROFILE</label><input id="importSettings" type="file" accept="application/json" hidden></div><p class="muted">Notes and custom settings stay in this browser profile in this prototype.</p>';
  if (name === 'internet') return '<label class="field-label" for="webAddress">ADDRESS OR SEARCH</label><div class="browser-bar"><input class="field" id="webAddress" value="https://example.com" aria-label="Endereço"><button class="pixel-btn" id="goWeb">GO</button></div><div class="browser-view" id="browserView"><div><strong>♡ YOUR WINDOW TO THE INTERNET</strong><p class="muted">Some websites do not allow embedded viewing. Use OPEN IN CHROME when a page refuses to load.</p><button class="pixel-btn" id="openChrome">OPEN IN CHROME</button></div></div><div class="window-footer"><span class="muted">External sites may block frames.</span><a href="https://www.google.com" target="_blank" rel="noopener noreferrer">Google ↗</a></div>';
  if (name === 'notes') return '<label class="field-label" for="noteText">MY LITTLE NOTEBOOK</label><textarea class="note-area" id="noteText" placeholder="Write something sweet..."></textarea><div class="window-footer"><span class="muted">Autosaved in this browser</span><button class="pixel-btn" id="clearNotes">CLEAR</button></div>';
  if (name === 'settings') return '<div class="panel-card"><strong>DESKTOP PERSONALIZATION</strong><p class="muted">Make this little space yours.</p><div class="field-label">COLOR THEMES</div><div class="theme-choice"><button title="Mint Strawberry" data-theme="mint" style="background:#bdebe5"></button><button title="Strawberry Milk" data-theme="strawberry" style="background:#f5c5d9"></button><button title="Lavender Dream" data-theme="lavender" style="background:#c9c4e9"></button><button title="Buttercream" data-theme="butter" style="background:#fff0b9"></button></div><div class="settings-grid"><div><label class="field-label" for="uiScale">ICON & UI SIZE</label><input class="field" id="uiScale" type="range" min="0.8" max="1.2" step="0.05" value="1"></div><div><label class="field-label" for="wallpaperFile">OWN WALLPAPER</label><input class="field" id="wallpaperFile" type="file" accept="image/png,image/jpeg,image/webp"></div></div><div class="switch-row"><span>Show pixel grid</span><input type="checkbox" id="gridToggle" checked></div><div class="switch-row"><span>Show coquette decorations</span><input type="checkbox" id="bowsToggle" checked></div><div class="switch-row"><span>Soft square window corners</span><input type="checkbox" id="pixelToggle"></div><div class="window-footer"><button class="pixel-btn" id="resetSettings">RESET</button><button class="pixel-btn" id="saveSettings">SAVE LOOK</button></div></div><div class="panel-card"><strong>PROFILE PRESETS</strong><p class="muted">Save a theme preset or export it for later.</p><div class="profile-list"><button class="pixel-btn" id="savePreset">SAVE PRESET</button><button class="pixel-btn" id="exportProfile">EXPORT JSON</button></div></div><p class="muted">Wallpaper images are kept only in this browser in this prototype. Cloud sync is not connected yet.</p>';
  return '';
}
