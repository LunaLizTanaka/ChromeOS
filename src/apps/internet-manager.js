import { toast } from '../core/notifications.js';
import { closeWindow } from '../managers/window-manager.js';

export const NEOCITIES_BLOGS = Object.freeze([
  {
    id: 'sweet-pea',
    name: 'Sweet-pea',
    description: 'Layouts, graphics e um cantinho pessoal',
    url: 'https://sweet-pea.neocities.org/'
  },
  {
    id: 'sakura-dreams',
    name: 'Sakura Dreams',
    description: 'Pixel art, stickers e coleções',
    url: 'https://sakuradreams.neocities.org/'
  },
  {
    id: 'pixel-safari',
    name: 'Pixel Safari',
    description: 'Divisórias, favicons e blinkies',
    url: 'https://pixelsafari.neocities.org/'
  },
  {
    id: 'rss-list',
    name: 'Neocities RSS List',
    description: 'Um diretório de páginas pessoais',
    url: 'https://rss-list.neocities.org/'
  }
]);

const ARCHIVE_MEDIA_TYPES = new Set(['movies', 'audio', 'texts', 'software', 'image']);
const ARCHIVE_FIELDS = ['identifier', 'title', 'creator', 'date', 'year', 'mediatype', 'subject'];
const ARCHIVE_PAGE_SIZE = 18;
const LUCENE_RESERVED = new Set(['+', '-', '!', '(', ')', '{', '}', '[', ']', '^', '"', '~', '*', '?', ':', '\\', '/', '|', '&']);

function escapeArchiveSearchTerm(value) {
  return Array.from(value, character => LUCENE_RESERVED.has(character) ? '\\' + character : character).join('');
}

export function buildArchiveSearchUrl(term, mediaType = 'all', page = 1) {
  const cleanTerm = String(term || '').trim().replace(/\s+/g, ' ');
  if (!cleanTerm) return '';

  // Pesquisa no índice geral de metadados, preservando a busca ampla do Archive.org.
  const broadTerms = escapeArchiveSearchTerm(cleanTerm);
  const type = ARCHIVE_MEDIA_TYPES.has(mediaType) ? mediaType : 'all';
  const query = type === 'all' ? broadTerms : '(' + broadTerms + ') AND mediatype:' + type;
  const safePage = Math.max(1, Math.floor(Number(page) || 1));

  const url = new URL('https://archive.org/advancedsearch.php');
  url.searchParams.set('q', query);
  ARCHIVE_FIELDS.forEach(field => url.searchParams.append('fl[]', field));
  url.searchParams.set('rows', String(ARCHIVE_PAGE_SIZE));
  url.searchParams.set('page', String(safePage));
  url.searchParams.set('output', 'json');
  return url.href;
}
export function buildArchivePublicSearchUrl(term, mediaType = 'all') {
  const cleanTerm = String(term || '').trim().replace(/\s+/g, ' ');
  if (!cleanTerm) return '';
  const type = ARCHIVE_MEDIA_TYPES.has(mediaType) ? mediaType : 'all';
  const query = type === 'all'
    ? escapeArchiveSearchTerm(cleanTerm)
    : '(' + escapeArchiveSearchTerm(cleanTerm) + ') AND mediatype:' + type;
  const url = new URL('https://archive.org/search.php');
  url.searchParams.set('query', query);
  return url.href;
}

export function buildArchiveEmbedUrl(identifier) {
  const value = String(identifier || '').trim();
  return value ? 'https://archive.org/embed/' + encodeURIComponent(value) : '';
}

export function buildArchiveDetailsUrl(identifier) {
  const value = String(identifier || '').trim();
  return value ? 'https://archive.org/details/' + encodeURIComponent(value) : 'https://archive.org/';
}

function readableValue(value) {
  if (Array.isArray(value)) {
    return value.filter(item => typeof item === 'string' && item.trim()).slice(0, 2).join(', ');
  }
  return typeof value === 'string' || typeof value === 'number' ? String(value).trim() : '';
}

function readableSummary(value, maxLength = 84) {
  const text = Array.isArray(value)
    ? value.filter(item => typeof item === 'string' && item.trim()).slice(0, 2).join(', ')
    : readableValue(value);
  return text.length > maxLength ? text.slice(0, maxLength - 1).trimEnd() + '…' : text;
}

function mediaTypeLabel(value) {
  const labels = {
    movies: 'FILME / VÍDEO',
    audio: 'ÁUDIO',
    texts: 'LIVRO / TEXTO',
    software: 'SOFTWARE',
    image: 'IMAGEM',
    data: 'DADOS',
    web: 'WEB'
  };
  return labels[value] || 'ITEM DO ACERVO';
}

function createEmbeddedFrame(url, title) {
  const frame = document.createElement('iframe');
  frame.title = title;
  frame.loading = 'eager';
  frame.referrerPolicy = 'strict-origin-when-cross-origin';
  frame.allow = 'autoplay; fullscreen; encrypted-media; picture-in-picture';
  frame.allowFullscreen = true;
  frame.setAttribute('sandbox', 'allow-forms allow-scripts allow-same-origin allow-popups allow-popups-to-escape-sandbox');
  frame.src = url;
  return frame;
}

function createArchiveResult(item, onOpen) {
  const identifier = readableValue(item.identifier);
  if (!identifier) return null;

  const card = document.createElement('button');
  card.type = 'button';
  card.className = 'archive-result-card';
  card.setAttribute('aria-label', 'Abrir ' + (readableValue(item.title) || identifier));

  const artwork = document.createElement('span');
  artwork.className = 'archive-result-artwork';

  const image = document.createElement('img');
  image.alt = '';
  image.loading = 'lazy';
  image.decoding = 'async';
  image.src = 'https://archive.org/services/img/' + encodeURIComponent(identifier);
  image.addEventListener('error', () => {
    image.remove();
    artwork.classList.add('no-artwork');
    artwork.textContent = '▣';
  }, { once: true });
  artwork.appendChild(image);

  const content = document.createElement('span');
  content.className = 'archive-result-copy';

  const type = document.createElement('small');
  type.className = 'archive-result-type';
  type.textContent = mediaTypeLabel(readableValue(item.mediatype));

  const title = document.createElement('strong');
  title.className = 'archive-result-title';
  title.textContent = readableValue(item.title) || identifier;

  const creatorText = readableValue(item.creator);
  const creator = document.createElement('small');
  creator.className = 'archive-result-creator';
  creator.textContent = creatorText || 'Criador não informado';

  const subjectText = readableSummary(item.subject);
  const subject = document.createElement('small');
  subject.className = 'archive-result-subject';
  subject.textContent = subjectText ? 'Assunto: ' + subjectText : '';

  const year = readableValue(item.year) || readableValue(item.date).slice(0, 4);
  const meta = document.createElement('small');
  meta.className = 'archive-result-meta';
  meta.textContent = year;

  content.append(type, title, creator);
  if (subjectText) content.appendChild(subject);
  if (year) content.appendChild(meta);
  card.append(artwork, content);
  card.addEventListener('click', () => onOpen(item));
  return card;
}


export const BROWSER_SEARCH_ENGINES = Object.freeze({
  google: 'https://www.google.com/search?q=',
  bing: 'https://www.bing.com/search?q=',
  duckduckgo: 'https://duckduckgo.com/?q='
});

export function normalizeBrowserUrl(value) {
  const raw = String(value || '').trim();
  if (!raw) return '';
  try {
    const candidate = /^https?:\/\//i.test(raw) ? raw : 'https://' + raw;
    const url = new URL(candidate);
    if ((url.protocol !== 'http:' && url.protocol !== 'https:') || !url.hostname || url.username || url.password) return '';
    return url.href;
  } catch (error) {
    return '';
  }
}

export function resolveBrowserInput(value, engine = 'google') {
  const raw = String(value || '').trim();
  if (!raw) return { kind: 'empty', url: '', query: '' };
  if (/^(javascript|data|file|blob|chrome|about|intent|view-source):/i.test(raw)) {
    return { kind: 'blocked', url: '', query: raw, reason: 'Esse tipo de endereço não pode ser aberto pelo navegador web do Galaxy.' };
  }
  const hasExplicitScheme = /^[a-z][a-z0-9+.-]*:/i.test(raw);
  const explicitWeb = /^https?:\/\//i.test(raw);
  const looksLikeHost = !/\s/.test(raw) && (
    /^www\./i.test(raw) ||
    /^localhost(?::\d+)?(?:\/|$)/i.test(raw) ||
    /^(?:\d{1,3}\.){3}\d{1,3}(?::\d+)?(?:\/|$)/.test(raw) ||
    raw.includes('.')
  );
  if (hasExplicitScheme && !explicitWeb) {
    return { kind: 'blocked', url: '', query: raw, reason: 'Somente endereços HTTP e HTTPS são aceitos.' };
  }
  if (explicitWeb || looksLikeHost) {
    const url = normalizeBrowserUrl(raw);
    if (!url) return { kind: 'blocked', url: '', query: raw, reason: 'O endereço digitado não é válido. Confira e tente novamente.' };
    return { kind: 'url', url, query: '' };
  }
  const searchBase = BROWSER_SEARCH_ENGINES[engine] || BROWSER_SEARCH_ENGINES.google;
  return { kind: 'search', url: searchBase + encodeURIComponent(raw), query: raw };
}

export function resolveNewTabInput(value) {
  const result = resolveBrowserInput(value, 'google');
  if (result.kind !== 'search') return result;
  return {
    kind: 'archive-search',
    query: result.query,
    url: buildArchivePublicSearchUrl(result.query, 'all')
  };
}

function readStoredList(key, limit) {
  try {
    const parsed = JSON.parse(window.localStorage.getItem(key) || '[]');
    return Array.isArray(parsed) ? parsed.filter(item => item && typeof item.url === 'string' && /^https?:\/\//i.test(item.url)).slice(0, limit) : [];
  } catch (error) {
    return [];
  }
}

function writeStoredList(key, value) {
  try {
    window.localStorage.setItem(key, JSON.stringify(value));
  } catch (error) {
    toast('Não foi possível salvar os dados do navegador neste contexto.');
  }
}

function formatVisitedAt(value) {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return '';
  return date.toLocaleString('pt-BR', { dateStyle: 'short', timeStyle: 'short' });
}

function titleForUrl(value) {
  try {
    return new URL(value).hostname.replace(/^www\./i, '') || value;
  } catch (error) {
    return value;
  }
}

function createLandingPage() {
  const root = document.createElement('section');
  root.className = 'internet-browser-page internet-newtab-root';
  const landing = document.createElement('div');
  landing.className = 'internet-newtab-page';
  landing.innerHTML = '<div class="internet-newtab-decoration" aria-hidden="true">✿　୨୧　♡　❀</div>' +
    '<div class="internet-newtab-card"><span class="internet-kicker">UM NOVO CANTINHO</span><h2>Onde vamos navegar hoje?</h2><p>Pesquise no Internet Archive ou digite o endereço de um site.</p>' +
    '<form data-newtab-search class="internet-newtab-search"><input type="search" placeholder="Pesquisar no Internet Archive…" aria-label="Pesquisar no Internet Archive"><button class="pixel-btn" type="submit">PESQUISAR ♡</button></form>' +
    '<div class="internet-newtab-links"><strong>Atalhos Neocities</strong><div data-newtab-shortcuts></div></div>' +
    '<p class="internet-newtab-tip">Ctrl+L seleciona o endereço · Ctrl+T abre uma nova aba · Ctrl+F localiza texto na página.</p></div>';
  const webHost = document.createElement('div');
  webHost.className = 'internet-web-host';
  webHost.hidden = true;
  root.append(landing, webHost);
  const shortcutHost = landing.querySelector('[data-newtab-shortcuts]');
  NEOCITIES_BLOGS.forEach(blog => {
    const button = document.createElement('button');
    button.type = 'button';
    button.className = 'internet-newtab-link';
    button.dataset.blogId = blog.id;
    button.textContent = blog.name;
    shortcutHost.appendChild(button);
  });
  return { root, landing, webHost };
}

function createBrowserFrame(url, title) {
  const frame = createEmbeddedFrame(url, title);
  frame.className = 'internet-web-frame';
  frame.setAttribute('allow', 'autoplay; fullscreen; encrypted-media; picture-in-picture');
  frame.setAttribute('allowfullscreen', '');
  frame.setAttribute('sandbox', 'allow-forms allow-scripts allow-same-origin allow-popups allow-popups-to-escape-sandbox allow-downloads');
  return frame;
}

export function initializeInternetApp(win) {
  const $ = selector => win.querySelector(selector);
  const elements = {
    app: $('#internetApp'),
    tabs: $('#internetBrowserTabs'), newTab: $('#internetNewTab'),
    addressForm: $('#internetAddressForm'), addressInput: $('#internetAddressInput'),
    suggestions: $('#internetAddressSuggestions'), searchEngine: $('#internetSearchEngine'),
    back: $('#internetBrowserBack'), forward: $('#internetBrowserForward'), reload: $('#internetBrowserReload'),
    home: $('#internetBrowserHome'), bookmarkCurrent: $('#internetBookmarkCurrent'),
    showBookmarks: $('#internetShowBookmarks'), showHistory: $('#internetShowHistory'),
    findButton: $('#internetFindButton'), immersiveButton: $('#internetImmersiveButton'),
    openExternal: $('#internetOpenExternal'), closeWindowButton: $('#internetCloseWindow'),
    banner: $('.internet-hero-banner'), chooseBanner: $('#internetChooseBanner'),
    resetBanner: $('#internetResetBanner'), bannerFile: $('#internetBannerFile'),
    bookmarkBar: $('#internetBookmarkBar'),
    bookmarksPanel: $('#internetBookmarksPanel'), bookmarksList: $('#internetBookmarksList'),
    historyPanel: $('#internetHistoryPanel'), historyList: $('#internetHistoryList'),
    clearHistory: $('#internetClearHistory'), findBar: $('#internetFindBar'),
    findInput: $('#internetFindInput'), findPrevious: $('#internetFindPrevious'),
    findNext: $('#internetFindNext'), findStatus: $('#internetFindStatus'),
    findClose: $('#internetFindClose'), status: $('#internetBrowserStatus'),
    pageHost: $('#internetPageHost'), homeBrowserPage: $('#internetHomeBrowserPage'),
    homePage: $('#internetHomePage'), homeWebHost: $('#internetHomeBrowserPage [data-web-host]'),
    immersiveHint: $('#internetImmersiveHint'), exitImmersive: $('#internetExitImmersive'),
    tabBlogs: $('#internetTabBlogs'), tabArchive: $('#internetTabArchive'),
    blogsPanel: $('#neocitiesPanel'), archivePanel: $('#archivePanel'),
    blogCatalog: $('#neocitiesCatalog'), archiveForm: $('#archiveSearchForm'),
    archiveInput: $('#archiveSearchInput'), archiveType: $('#archiveMediaType'),
    archiveSearchButton: $('#archiveSearchButton'), archiveStatus: $('#archiveSearchStatus'),
    archiveResultsArea: $('#archiveResultsArea'), archiveResults: $('#archiveResults'),
    archiveMore: $('#archiveMore'), archiveViewer: $('#archiveViewer'),
    archiveFrameHost: $('#archiveFrameHost'), archiveViewerTitle: $('#archiveViewerTitle'),
    archiveBack: $('#archiveBackResults'), archiveOpenItem: $('#archiveOpenItem')
  };
  if (Object.values(elements).some(element => !element)) return;
  if (win.dataset.internetInitialized === 'true') return;
  win.dataset.internetInitialized = 'true';

  const blogsById = new Map(NEOCITIES_BLOGS.map(blog => [blog.id, blog]));
  const BOOKMARKS_KEY = 'gl-internet-bookmarks-v1';
  const HISTORY_KEY = 'gl-internet-history-v1';
  const ENGINE_KEY = 'gl-internet-search-engine-v1';
  let bookmarks = readStoredList(BOOKMARKS_KEY, 100);
  let historyItems = readStoredList(HISTORY_KEY, 120);
  let engine = 'google';
  try {
    engine = window.localStorage.getItem(ENGINE_KEY) || 'google';
  } catch (error) {
    engine = 'google';
  }
  if (!BROWSER_SEARCH_ENGINES[engine]) engine = 'google';
  elements.searchEngine.value = engine;

  let tabs = [];
  let activeTabId = 1;
  let nextTabId = 2;
  let currentArchiveItem = null;
  let currentSearchTerm = '';
  let currentSearchType = 'all';
  let currentPage = 1;
  let totalResults = 0;
  let activeSearchController = null;
  let searchRequestId = 0;
  let immersive = false;

  const homeTab = {
    id: 1, title: 'Galaxy Web', url: '', mode: 'home', kind: 'home',
    pageRoot: elements.homeBrowserPage, landing: elements.homePage,
    webHost: elements.homeWebHost, frame: null, entries: [], historyIndex: -1, loading: false
  };
  tabs.push(homeTab);

  function activeTab() {
    return tabs.find(tab => tab.id === activeTabId) || tabs[0] || null;
  }

  function setStatus(message) {
    elements.status.textContent = message;
  }

  function saveBookmarks() { writeStoredList(BOOKMARKS_KEY, bookmarks); }
  function saveHistory() { writeStoredList(HISTORY_KEY, historyItems); }

  function recordVisit(url, title) {
    historyItems = historyItems.filter(item => item.url !== url);
    historyItems.unshift({ url, title: title || titleForUrl(url), visitedAt: new Date().toISOString() });
    historyItems = historyItems.slice(0, 120);
    saveHistory();
    renderHistory();
  }

  function closePanels() {
    elements.bookmarksPanel.hidden = true;
    elements.historyPanel.hidden = true;
  }

  function showPanel(which) {
    const showBookmarks = which === 'bookmarks' && elements.bookmarksPanel.hidden;
    const showHistory = which === 'history' && elements.historyPanel.hidden;
    closePanels();
    elements.bookmarksPanel.hidden = !showBookmarks;
    elements.historyPanel.hidden = !showHistory;
  }

  function isBookmarked(url) {
    return !!url && bookmarks.some(item => item.url === url);
  }

  function renderBookmarks() {
    elements.bookmarkBar.replaceChildren();
    elements.bookmarksList.replaceChildren();
    if (!bookmarks.length) {
      const empty = document.createElement('small');
      empty.textContent = 'Salve páginas usando ☆ para colocá-las aqui.';
      elements.bookmarkBar.appendChild(empty);
      const emptyPanel = document.createElement('p');
      emptyPanel.className = 'internet-popover-empty';
      emptyPanel.textContent = 'Nenhum favorito salvo ainda. Abra uma página e pressione ☆.';
      elements.bookmarksList.appendChild(emptyPanel);
      return;
    }

    bookmarks.slice(0, 12).forEach(item => {
      const shortcut = document.createElement('button');
      shortcut.type = 'button';
      shortcut.className = 'internet-bookmark-shortcut';
      shortcut.title = item.url;
      shortcut.textContent = item.title || titleForUrl(item.url);
      shortcut.addEventListener('click', () => {
        closePanels();
        navigateTo(item.url, item.title);
      });
      elements.bookmarkBar.appendChild(shortcut);

      const row = document.createElement('div');
      row.className = 'internet-popover-row';
      const open = document.createElement('button');
      open.type = 'button';
      open.className = 'internet-popover-open';
      open.textContent = item.title || titleForUrl(item.url);
      const address = document.createElement('small');
      address.textContent = item.url;
      open.appendChild(address);
      open.addEventListener('click', () => {
        closePanels();
        navigateTo(item.url, item.title);
      });
      const remove = document.createElement('button');
      remove.type = 'button';
      remove.className = 'internet-popover-remove';
      remove.textContent = '×';
      remove.title = 'Remover favorito';
      remove.addEventListener('click', () => {
        bookmarks = bookmarks.filter(bookmark => bookmark.url !== item.url);
        saveBookmarks();
        renderBookmarks();
        updateToolbar();
      });
      row.append(open, remove);
      elements.bookmarksList.appendChild(row);
    });
  }

  function renderHistory() {
    elements.historyList.replaceChildren();
    if (!historyItems.length) {
      const empty = document.createElement('p');
      empty.className = 'internet-popover-empty';
      empty.textContent = 'O histórico ainda está vazio.';
      elements.historyList.appendChild(empty);
      return;
    }
    historyItems.slice(0, 60).forEach(item => {
      const row = document.createElement('button');
      row.type = 'button';
      row.className = 'internet-history-row';
      const title = document.createElement('strong');
      title.textContent = item.title || titleForUrl(item.url);
      const address = document.createElement('span');
      address.textContent = item.url;
      const date = document.createElement('small');
      date.textContent = formatVisitedAt(item.visitedAt);
      row.append(title, address, date);
      row.addEventListener('click', () => {
        closePanels();
        navigateTo(item.url, item.title);
      });
      elements.historyList.appendChild(row);
    });
  }

  function updateToolbar() {
    const tab = activeTab();
    if (!tab) return;
    elements.addressInput.value = tab.url || '';
    elements.addressInput.placeholder = tab.mode === 'web' ? 'Endereço da página aberta' : 'Pesquise ou digite um endereço da web';
    elements.back.disabled = !(tab.historyIndex > 0);
    elements.forward.disabled = !(tab.historyIndex >= 0 && tab.historyIndex < tab.entries.length - 1);
    elements.reload.disabled = tab.mode !== 'web' || !tab.frame;
    elements.home.disabled = tab.mode === 'home';
    elements.bookmarkCurrent.disabled = tab.mode !== 'web' || !tab.url;
    elements.bookmarkCurrent.textContent = isBookmarked(tab.url) ? '★' : '☆';
    elements.bookmarkCurrent.classList.toggle('is-bookmarked', isBookmarked(tab.url));
    elements.openExternal.disabled = tab.mode !== 'web' || !tab.url;
    elements.reload.textContent = tab.loading ? '×' : '↻';
    elements.reload.title = tab.loading ? 'Parar carregamento' : 'Atualizar página (Ctrl+R)';
    elements.tabs.querySelectorAll('[data-tab-id]').forEach(node => {
      node.classList.toggle('active', Number(node.dataset.tabId) === tab.id);
      node.setAttribute('aria-selected', String(Number(node.dataset.tabId) === tab.id));
    });
  }

  function renderTabs() {
    elements.tabs.replaceChildren();
    tabs.forEach(tab => {
      const shell = document.createElement('div');
      shell.className = 'internet-browser-tab' + (tab.id === activeTabId ? ' active' : '');
      shell.dataset.tabId = String(tab.id);
      shell.setAttribute('role', 'tab');
      shell.setAttribute('aria-selected', String(tab.id === activeTabId));

      const select = document.createElement('button');
      select.type = 'button';
      select.className = 'internet-browser-tab-select';
      select.dataset.selectTab = String(tab.id);
      const icon = document.createElement('span');
      icon.className = 'internet-browser-tab-icon';
      icon.textContent = tab.loading ? '◌' : (tab.mode === 'home' ? '✿' : '◎');
      const label = document.createElement('span');
      label.className = 'internet-browser-tab-label';
      label.textContent = tab.title || 'Nova aba';
      select.append(icon, label);

      const close = document.createElement('button');
      close.type = 'button';
      close.className = 'internet-browser-tab-close';
      close.dataset.closeTab = String(tab.id);
      close.setAttribute('aria-label', 'Fechar aba ' + (tab.title || 'Nova aba'));
      close.title = 'Fechar aba';
      close.textContent = '×';
      shell.append(select, close);
      elements.tabs.appendChild(shell);
    });
    updateToolbar();
  }

  function activateTab(id) {
    const tab = tabs.find(item => item.id === Number(id));
    if (!tab) return;
    activeTabId = tab.id;
    tabs.forEach(item => { item.pageRoot.hidden = item.id !== activeTabId; });
    if (tab.mode === 'web') {
      tab.landing.hidden = true;
      tab.webHost.hidden = false;
      setStatus('Página aberta em ' + titleForUrl(tab.url) + '. Se o site bloquear a incorporação, use ↗ para abrir no Chrome.');
    } else {
      tab.landing.hidden = false;
      tab.webHost.hidden = true;
      setStatus(tab.kind === 'home' ? '♡ Galaxy Web · Archive.org e Neocities' : 'Nova aba · pesquise ou escolha um atalho.');
    }
    renderTabs();
    closePanels();
  }

  function createTab() {
    const created = createLandingPage();
    const tab = {
      id: nextTabId++, title: 'Nova aba', url: '', mode: 'home', kind: 'newtab',
      pageRoot: created.root, landing: created.landing, webHost: created.webHost,
      frame: null, entries: [], historyIndex: -1, loading: false
    };
    elements.pageHost.appendChild(tab.pageRoot);
    tabs.push(tab);
    activateTab(tab.id);
    return tab;
  }

  function closeTab(id) {
    const index = tabs.findIndex(tab => tab.id === Number(id));
    if (index < 0) return;
    const tab = tabs[index];
    if (tab.frame) {
      try { tab.frame.src = 'about:blank'; } catch (error) { /* Detached frame. */ }
    }
    tab.pageRoot.remove();
    tabs.splice(index, 1);
    if (!tabs.length) {
      activateTab(createTab().id);
      return;
    }
    if (tab.id === activeTabId) activateTab(tabs[Math.max(0, index - 1)].id);
    else renderTabs();
  }

  function addHistoryEntry(tab, url, title, kind = 'web') {
    if (!tab.entries.length) {
      tab.entries.push({
        url: '',
        title: tab.kind === 'home' ? 'Galaxy Web' : 'Nova aba',
        kind: 'home'
      });
    }
    tab.entries = tab.entries.slice(0, tab.historyIndex + 1);
    tab.entries.push({ url, title, kind });
    tab.historyIndex = tab.entries.length - 1;
  }

  function targetIsSafe(url) {
    try {
      const parsed = new URL(url);
      if (parsed.protocol !== 'http:' && parsed.protocol !== 'https:') return false;
      if (parsed.origin === window.location.origin) {
        setStatus('Por segurança, o navegador interno não incorpora o próprio domínio do Galaxy. Use outra página HTTPS ou abra esse endereço no Chrome.');
        return false;
      }
      return true;
    } catch (error) {
      setStatus('Endereço inválido.');
      return false;
    }
  }

  function navigateTo(value, title = '', options = {}) {
    const url = normalizeBrowserUrl(value);
    if (!url || !targetIsSafe(url)) return false;
    const tab = activeTab();
    if (!tab) return false;
    const pageTitle = title || titleForUrl(url);

    if (!tab.frame) {
      tab.frame = createBrowserFrame(url, pageTitle);
      tab.frame.addEventListener('load', () => {
        tab.loading = false;
        renderTabs();
        if (activeTabId === tab.id) {
          setStatus('O quadro terminou de carregar. Isso não confirma que o site permite incorporação. Se a página estiver vazia ou incompleta, use ↗ para abrir no Chrome.');
          updateToolbar();
        }
      });
      tab.webHost.appendChild(tab.frame);
    }

    tab.mode = 'web';
    tab.url = url;
    tab.title = pageTitle;
    tab.frame.title = pageTitle;
    tab.landing.hidden = true;
    tab.webHost.hidden = false;
    tab.loading = true;

    if (options.record !== false) {
      addHistoryEntry(tab, url, pageTitle);
      recordVisit(url, pageTitle);
    } else if (typeof options.historyIndex === 'number') {
      tab.historyIndex = options.historyIndex;
    }

    tab.frame.src = url;
    if (activeTabId === tab.id) {
      elements.addressInput.value = url;
      setStatus('Carregando ' + pageTitle + '… páginas externas podem bloquear a incorporação ou o login.');
    }
    renderTabs();
    closePanels();
    return true;
  }

  function navigateFromInput(value) {
    const result = resolveBrowserInput(value, elements.searchEngine.value);
    if (result.kind === 'empty') {
      elements.addressInput.focus();
      setStatus('Digite um endereço ou uma palavra para pesquisar.');
      return;
    }
    if (result.kind === 'blocked') {
      setStatus(result.reason);
      return;
    }
    const title = result.kind === 'search' ? 'Pesquisa: ' + result.query : titleForUrl(result.url);
    navigateTo(result.url, title, { record: true });
  }

  function back() {
    const tab = activeTab();
    if (!tab) return;
    if (tab.kind === 'home' && currentArchiveItem && !elements.archiveViewer.hidden) {
      showArchiveResults();
      return;
    }
    if (tab.historyIndex > 0) {
      const index = tab.historyIndex - 1;
      const entry = tab.entries[index];
      if (entry.kind === 'home' || !entry.url) {
        tab.historyIndex = index;
        goHome({ record: false });
        setStatus('Voltando para ' + entry.title + '…');
        return;
      }
      navigateTo(entry.url, entry.title, { record: false, historyIndex: index });
      setStatus('Voltando para ' + entry.title + '…');
      return;
    }
    if (tab.mode === 'web' && tab.frame) {
      setStatus('Não há uma página anterior aberta pela barra do Galaxy. Para voltar entre links clicados dentro deste site, use o botão voltar do próprio site: o Chrome não permite que o Galaxy controle o histórico interno de outra origem.');
      return;
    }
    setStatus('Não há uma página anterior nesta aba.');
  }

  function forward() {
    const tab = activeTab();
    if (!tab) return;
    if (tab.historyIndex >= 0 && tab.historyIndex < tab.entries.length - 1) {
      const index = tab.historyIndex + 1;
      const entry = tab.entries[index];
      if (entry.kind === 'home' || !entry.url) {
        tab.historyIndex = index;
        goHome({ record: false });
        setStatus('Avançando para ' + entry.title + '…');
        return;
      }
      navigateTo(entry.url, entry.title, { record: false, historyIndex: index });
      setStatus('Avançando para ' + entry.title + '…');
      return;
    }
    if (tab.mode === 'web' && tab.frame) {
      setStatus('Não há uma próxima página aberta pela barra do Galaxy. A navegação entre links internos permanece sob controle do próprio site.');
      return;
    }
    setStatus('Não há uma página seguinte nesta aba.');
  }

  function reloadPage() {
    const tab = activeTab();
    if (!tab || tab.mode !== 'web' || !tab.frame) return;
    if (tab.loading) {
      try { tab.frame.contentWindow.stop(); } catch (error) { /* Cross-origin frames may hide stop(). */ }
      tab.loading = false;
      setStatus('Solicitação de interrupção enviada. Alguns recursos já iniciados podem continuar.');
      updateToolbar();
      renderTabs();
      return;
    }
    tab.loading = true;
    try { tab.frame.contentWindow.location.reload(); }
    catch (error) { tab.frame.src = tab.url; }
    setStatus('Atualizando ' + tab.title + '…');
    updateToolbar();
    renderTabs();
  }

  function goHome(options = {}) {
    const tab = activeTab();
    if (!tab) return;
    if (options.record !== false && tab.mode === 'web' && tab.url) {
      addHistoryEntry(tab, '', tab.kind === 'home' ? 'Galaxy Web' : 'Nova aba', 'home');
    }
    tab.mode = 'home';
    tab.url = '';
    tab.title = tab.kind === 'home' ? 'Galaxy Web' : 'Nova aba';
    tab.loading = false;
    tab.landing.hidden = false;
    tab.webHost.hidden = true;
    updateToolbar();
    renderTabs();
    setStatus(tab.kind === 'home' ? '♡ Página inicial do Galaxy Web.' : 'Nova aba pronta para pesquisar.');
  }

  function addCurrentBookmark() {
    const tab = activeTab();
    if (!tab || tab.mode !== 'web' || !tab.url) return;
    if (isBookmarked(tab.url)) {
      bookmarks = bookmarks.filter(item => item.url !== tab.url);
      setStatus('Página removida dos favoritos.');
    } else {
      bookmarks.unshift({ url: tab.url, title: tab.title || titleForUrl(tab.url), savedAt: new Date().toISOString() });
      bookmarks = bookmarks.slice(0, 100);
      setStatus('Página salva nos favoritos ♡');
    }
    saveBookmarks();
    renderBookmarks();
    updateToolbar();
  }

  function findText(backwards = false) {
    const query = elements.findInput.value.trim();
    if (!query) {
      elements.findStatus.textContent = 'Digite uma palavra.';
      return;
    }
    const tab = activeTab();
    let found = false;
    try {
      if (tab && tab.mode === 'web' && tab.frame) {
        const frameWindow = tab.frame.contentWindow;
        if (!frameWindow || typeof frameWindow.find !== 'function') throw new Error('Pesquisa indisponível');
        found = frameWindow.find(query, false, backwards, true, false, false, false);
      } else {
        found = window.find(query, false, backwards, true, false, false, false);
      }
    } catch (error) {
      elements.findStatus.textContent = 'O site não permite pesquisa de texto pela janela do Galaxy. Use a busca do próprio site ou abra no Chrome.';
      return;
    }
    elements.findStatus.textContent = found ? 'Correspondência encontrada.' : 'Nenhuma correspondência encontrada.';
  }

  function toggleFind(show = true) {
    elements.findBar.hidden = !show;
    if (show) {
      elements.findInput.focus();
      elements.findInput.select();
    }
  }

  function toggleImmersive() {
    immersive = !immersive;
    elements.app.classList.toggle('is-immersive', immersive);
    elements.immersiveHint.hidden = !immersive;
    elements.immersiveButton.classList.toggle('active', immersive);
    elements.immersiveButton.title = immersive ? 'Sair do modo imersivo (Esc)' : 'Modo imersivo';
    if (immersive) setStatus('Modo imersivo ativado. Pressione Esc ou use SAIR DA TELA CHEIA para voltar.');
  }

  function setSection(section) {
    const showBlogs = section === 'blogs';
    elements.tabBlogs.classList.toggle('active', showBlogs);
    elements.tabArchive.classList.toggle('active', !showBlogs);
    elements.tabBlogs.setAttribute('aria-selected', String(showBlogs));
    elements.tabArchive.setAttribute('aria-selected', String(!showBlogs));
    elements.blogsPanel.hidden = !showBlogs;
    elements.archivePanel.hidden = showBlogs;
  }

  elements.tabBlogs.addEventListener('click', () => setSection('blogs'));
  elements.tabArchive.addEventListener('click', () => setSection('archive'));

  function setArchiveStatus(message) {
    elements.archiveStatus.textContent = message;
  }

  function openArchiveItem(item) {
    const identifier = readableValue(item.identifier);
    if (!identifier) return;
    currentArchiveItem = item;
    elements.archiveViewerTitle.textContent = readableValue(item.title) || identifier;
    elements.archiveOpenItem.href = buildArchiveDetailsUrl(identifier);
    elements.archiveResultsArea.hidden = true;
    elements.archiveViewer.hidden = false;
    elements.archiveFrameHost.replaceChildren();
    const frame = createEmbeddedFrame(buildArchiveEmbedUrl(identifier), 'Internet Archive: ' + (readableValue(item.title) || identifier));
    frame.addEventListener('load', () => {
      setArchiveStatus('O item foi carregado pelo Internet Archive. Use os controles do próprio leitor; se o quadro estiver vazio, abra a ficha completa.');
    }, { once: true });
    elements.archiveFrameHost.appendChild(frame);

    const tab = activeTab();
    if (tab && tab.kind === 'home' && tab.mode === 'home') {
      tab.url = buildArchiveDetailsUrl(identifier);
      tab.title = readableValue(item.title) || identifier;
      recordVisit(tab.url, tab.title);
      updateToolbar();
      renderTabs();
    }
  }

  function showArchiveResults() {
    currentArchiveItem = null;
    elements.archiveFrameHost.replaceChildren();
    elements.archiveViewer.hidden = true;
    elements.archiveResultsArea.hidden = false;
    const tab = activeTab();
    if (tab && tab.kind === 'home' && tab.mode === 'home') {
      tab.url = '';
      tab.title = 'Galaxy Web';
      updateToolbar();
      renderTabs();
    }
  }

  function appendResults(items) {
    items.forEach(item => {
      const card = createArchiveResult(item, openArchiveItem);
      if (card) elements.archiveResults.appendChild(card);
    });
  }

  async function performSearch(page = 1, append = false) {
    const term = append ? currentSearchTerm : elements.archiveInput.value.trim();
    const type = append ? currentSearchType : elements.archiveType.value;
    if (!term) {
      setArchiveStatus('Digite uma palavra, tema, obra, pessoa ou assunto para pesquisar em todo o acervo do Archive.org.');
      elements.archiveInput.focus();
      return;
    }
    if (!append) {
      activeSearchController?.abort();
      currentSearchTerm = term;
      currentSearchType = type;
      currentPage = 1;
      totalResults = 0;
      elements.archiveResults.replaceChildren();
      elements.archiveViewer.hidden = true;
      elements.archiveFrameHost.replaceChildren();
      elements.archiveResultsArea.hidden = false;
      elements.archiveMore.hidden = true;
      currentArchiveItem = null;
    }
    activeSearchController?.abort();
    activeSearchController = new AbortController();
    const controller = activeSearchController;
    const requestId = ++searchRequestId;
    currentPage = page;
    elements.archiveSearchButton.disabled = true;
    elements.archiveMore.disabled = true;
    setArchiveStatus('Pesquisando no catálogo do Internet Archive…');
    try {
      const response = await fetch(buildArchiveSearchUrl(term, type, page), {
        method: 'GET',
        headers: { Accept: 'application/json' },
        signal: controller.signal
      });
      if (!response.ok) throw new Error('O Archive.org respondeu com HTTP ' + response.status + '.');
      const payload = await response.json();
      if (requestId !== searchRequestId) return;
      const responseData = payload && payload.response ? payload.response : {};
      const items = Array.isArray(responseData.docs) ? responseData.docs : [];
      totalResults = Number(responseData.numFound) || 0;
      if (page === 1) elements.archiveResults.replaceChildren();
      appendResults(items);
      const shown = elements.archiveResults.children.length;
      if (totalResults === 0 || shown === 0) {
        setArchiveStatus('Nenhum item encontrado. Tente outro termo ou escolha outro tipo de conteúdo.');
      } else {
        setArchiveStatus(totalResults.toLocaleString('pt-BR') + ' resultados no Internet Archive · exibindo ' + shown.toLocaleString('pt-BR') + ' itens.');
      }
      elements.archiveMore.hidden = items.length < ARCHIVE_PAGE_SIZE || shown >= totalResults;
    } catch (error) {
      if (error && error.name === 'AbortError') return;
      if (requestId === searchRequestId) {
        setArchiveStatus('Não foi possível pesquisar agora. Confira a conexão e tente novamente.');
        console.error('Galaxy Legacy Internet Archive search failed:', error);
      }
    } finally {
      if (requestId === searchRequestId) {
        elements.archiveSearchButton.disabled = false;
        elements.archiveMore.disabled = false;
      }
    }
  }

  elements.addressForm.addEventListener('submit', event => {
    event.preventDefault();
    navigateFromInput(elements.addressInput.value);
  });
  elements.newTab.addEventListener('click', () => createTab());
  elements.tabs.addEventListener('click', event => {
    const closeButton = event.target.closest('[data-close-tab]');
    if (closeButton) {
      event.stopPropagation();
      closeTab(closeButton.dataset.closeTab);
      return;
    }
    const selectButton = event.target.closest('[data-select-tab]');
    if (selectButton) activateTab(selectButton.dataset.selectTab);
  });
  elements.back.addEventListener('click', back);
  elements.forward.addEventListener('click', forward);
  elements.reload.addEventListener('click', reloadPage);
  elements.home.addEventListener('click', goHome);
  elements.bookmarkCurrent.addEventListener('click', addCurrentBookmark);
  elements.showBookmarks.addEventListener('click', () => showPanel('bookmarks'));
  elements.showHistory.addEventListener('click', () => showPanel('history'));
  elements.findButton.addEventListener('click', () => toggleFind(true));
  elements.findPrevious.addEventListener('click', () => findText(true));
  elements.findNext.addEventListener('click', () => findText(false));
  elements.findInput.addEventListener('keydown', event => {
    if (event.key === 'Enter') {
      event.preventDefault();
      findText(event.shiftKey);
    }
    if (event.key === 'Escape') toggleFind(false);
  });
  elements.findClose.addEventListener('click', () => toggleFind(false));
  elements.immersiveButton.addEventListener('click', toggleImmersive);
  elements.exitImmersive.addEventListener('click', () => { if (immersive) toggleImmersive(); });
  elements.openExternal.addEventListener('click', () => {
    const tab = activeTab();
    if (tab && tab.url) window.open(tab.url, '_blank', 'noopener,noreferrer');
  });

  elements.closeWindowButton.addEventListener('click', event => {
    event.preventDefault();
    event.stopPropagation();
    closeWindow(win.closest('.window'));
  });

  const BANNER_STORAGE_KEY = 'gl-internet-banner-v1';
  let customBannerImage = null;

  function applyBannerImage(dataUrl) {
    if (!dataUrl || !/^data:image\/(?:png|jpeg|webp|gif|avif);base64,/i.test(dataUrl)) return false;
    if (!customBannerImage) {
      customBannerImage = document.createElement('img');
      customBannerImage.className = 'internet-hero-custom-image';
      customBannerImage.alt = '';
      customBannerImage.setAttribute('aria-hidden', 'true');
      elements.banner.prepend(customBannerImage);
    }
    customBannerImage.src = dataUrl;
    elements.banner.classList.add('has-custom-banner');
    elements.resetBanner.hidden = false;
    return true;
  }

  try {
    const savedBanner = window.localStorage.getItem(BANNER_STORAGE_KEY);
    if (savedBanner) applyBannerImage(savedBanner);
  } catch (error) {
    setStatus('O banner personalizado não pôde ser recuperado neste perfil do navegador.');
  }

  elements.chooseBanner.addEventListener('click', () => elements.bannerFile.click());
  elements.bannerFile.addEventListener('change', () => {
    const file = elements.bannerFile.files?.[0];
    elements.bannerFile.value = '';
    if (!file) return;
    if (!/^image\/(?:png|jpeg|webp|gif|avif)$/i.test(file.type)) {
      toast('Escolha uma imagem PNG, JPG, WebP, GIF ou AVIF.');
      return;
    }
    if (file.size > 2 * 1024 * 1024) {
      toast('A imagem do banner deve ter até 2 MB.');
      return;
    }
    const reader = new FileReader();
    reader.onerror = () => toast('Não foi possível ler essa imagem.');
    reader.onload = () => {
      const dataUrl = String(reader.result || '');
      if (!applyBannerImage(dataUrl)) {
        toast('Não foi possível aplicar essa imagem ao banner.');
        return;
      }
      try {
        window.localStorage.setItem(BANNER_STORAGE_KEY, dataUrl);
        setStatus('Seu banner personalizado foi salvo neste navegador ♡');
      } catch (error) {
        toast('A imagem foi aplicada, mas não coube no armazenamento local. Escolha uma imagem menor.');
      }
    };
    reader.readAsDataURL(file);
  });
  elements.resetBanner.addEventListener('click', () => {
    try { window.localStorage.removeItem(BANNER_STORAGE_KEY); } catch (error) { /* Reset visually even if storage is blocked. */ }
    customBannerImage?.remove();
    customBannerImage = null;
    elements.banner.classList.remove('has-custom-banner');
    elements.resetBanner.hidden = true;
    setStatus('Banner original restaurado.');
  });
  elements.searchEngine.addEventListener('change', () => {
    engine = BROWSER_SEARCH_ENGINES[elements.searchEngine.value] ? elements.searchEngine.value : 'google';
    try { window.localStorage.setItem(ENGINE_KEY, engine); } catch (error) { /* Session preference still applies. */ }
    setStatus('Mecanismo de pesquisa padrão: ' + elements.searchEngine.options[elements.searchEngine.selectedIndex].text + '.');
  });
  elements.clearHistory.addEventListener('click', () => {
    historyItems = [];
    saveHistory();
    renderHistory();
    setStatus('Histórico limpo neste navegador.');
  });
  win.querySelectorAll('[data-close-popover]').forEach(button => button.addEventListener('click', closePanels));

  elements.archiveForm.addEventListener('submit', event => {
    event.preventDefault();
    const term = elements.archiveInput.value.trim();
    if (!term) {
      setArchiveStatus('Digite um título, autor, tema ou palavra para pesquisar no Internet Archive.');
      elements.archiveInput.focus();
      return;
    }
    const url = buildArchivePublicSearchUrl(term, elements.archiveType.value);
    navigateTo(url, 'Archive.org · ' + term, { record: true });
  });
  elements.archiveMore.addEventListener('click', () => {
    if (currentSearchTerm && !elements.archiveMore.disabled) performSearch(currentPage + 1, true);
  });
  elements.archiveBack.addEventListener('click', showArchiveResults);

  win.addEventListener('click', event => {
    const blogButton = event.target.closest('[data-blog-id]');
    if (blogButton) {
      const blog = blogsById.get(blogButton.dataset.blogId);
      if (blog) {
        if (event.ctrlKey || event.metaKey || event.button === 1) createTab();
        navigateTo(blog.url, blog.name);
      }
      return;
    }
    const categoryButton = event.target.closest('[data-archive-type]');
    if (categoryButton) {
      elements.archiveType.value = categoryButton.dataset.archiveType;
      elements.archiveInput.focus();
      setArchiveStatus('Categoria selecionada: ' + categoryButton.textContent.trim() + '. Digite um termo para pesquisar.');
    }
  });

  function navigateFromNewTab(value) {
    const result = resolveNewTabInput(value);
    if (result.kind === 'empty') {
      setStatus('Digite um termo para pesquisar no Internet Archive ou um endereço para abrir.');
      return;
    }
    if (result.kind === 'blocked') {
      setStatus(result.reason);
      return;
    }
    if (result.kind === 'url') {
      navigateTo(result.url, titleForUrl(result.url), { record: true });
      return;
    }
    navigateTo(result.url, 'Archive.org · ' + result.query, { record: true });
  }

  win.addEventListener('submit', event => {
    const form = event.target.closest('[data-newtab-search]');
    if (!form) return;
    event.preventDefault();
    navigateFromNewTab(form.querySelector('input')?.value || '');
  });

  elements.bookmarksPanel.addEventListener('click', event => event.stopPropagation());
  elements.historyPanel.addEventListener('click', event => event.stopPropagation());
  win.addEventListener('click', event => {
    if (!event.target.closest('.internet-browser-panels') &&
        !event.target.closest('#internetShowBookmarks') &&
        !event.target.closest('#internetShowHistory')) closePanels();
  });

  elements.addressInput.addEventListener('input', () => {
    const needle = elements.addressInput.value.toLowerCase();
    elements.suggestions.replaceChildren();
    historyItems.filter(item => !needle || item.url.toLowerCase().includes(needle) || (item.title || '').toLowerCase().includes(needle))
      .slice(0, 8).forEach(item => {
        const option = document.createElement('option');
        option.value = item.url;
        option.label = item.title || titleForUrl(item.url);
        elements.suggestions.appendChild(option);
      });
  });

  win.addEventListener('keydown', event => {
    const key = event.key.toLowerCase();
    if (event.key === 'Escape' && immersive) {
      toggleImmersive();
      return;
    }
    if (event.ctrlKey && key === 'l') {
      event.preventDefault();
      elements.addressInput.focus();
      elements.addressInput.select();
    } else if (event.ctrlKey && key === 't') {
      event.preventDefault();
      createTab();
    } else if (event.ctrlKey && key === 'w') {
      event.preventDefault();
      closeTab(activeTabId);
    } else if (event.ctrlKey && key === 'f') {
      event.preventDefault();
      toggleFind(true);
    } else if (event.ctrlKey && key === 'r') {
      event.preventDefault();
      reloadPage();
    } else if (event.altKey && event.key === 'ArrowLeft') {
      event.preventDefault();
      back();
    } else if (event.altKey && event.key === 'ArrowRight') {
      event.preventDefault();
      forward();
    }
  });

  renderBookmarks();
  renderHistory();
  homeTab.pageRoot.hidden = false;
  homeTab.landing.hidden = false;
  homeTab.webHost.hidden = true;
  renderTabs();
  activateTab(homeTab.id);
}
