import { toast } from '../core/notifications.js';
import { buildArchiveSearchUrl, buildArchiveEmbedUrl, buildArchiveDetailsUrl } from './internet-manager.js';

export const LIBRARY_PLATFORMS = Object.freeze([
  { id:'archive', name:'Internet Archive', category:'books', url:'https://archive.org/', mode:'reader', badge:'BookReader oficial', description:'Livros digitalizados, revistas, textos e outros materiais.', note:'O BookReader oficial pode ser incorporado quando o item permite leitura.' },
  { id:'openlibrary', name:'Open Library', category:'books', url:'https://openlibrary.org/', mode:'reader', badge:'API + BookReader', description:'Catálogo de livros, autores, edições e disponibilidade.', note:'Busca pela API oficial; leitura quando existe cópia vinculada ao Internet Archive.' },
  { id:'gutenberg', name:'Project Gutenberg', category:'books', url:'https://www.gutenberg.org/', mode:'try', badge:'Teste interno', description:'Livros eletrônicos gratuitos, principalmente obras em domínio público nos EUA.', note:'Pode abrir no iframe ou exigir uma aba externa.' },
  { id:'wikisource', name:'Wikisource', category:'books', url:'https://pt.wikisource.org/', mode:'try', badge:'Teste interno', description:'Biblioteca livre de textos e documentos em português.', note:'Pode abrir no iframe ou exigir uma aba externa.' },
  { id:'ao3', name:'Archive of Our Own (AO3)', category:'fanfic', url:'https://archiveofourown.org/', mode:'try', badge:'Teste interno', description:'Arquivo comunitário de fanworks, fanfics e obras transformativas.', note:'Mantém avisos, classificações e exigências próprias de acesso.' },
  { id:'wattpad', name:'Wattpad', category:'fanfic', url:'https://www.wattpad.com/', mode:'try', badge:'Teste interno', description:'Histórias originais, romances, fantasia e fanfics.', note:'Login, cookies ou políticas de enquadramento podem exigir o Chrome.' },
  { id:'spirit', name:'Spirit Fanfics', category:'fanfic', url:'https://www.spiritfanfiction.com/', mode:'try', badge:'Teste interno', description:'Plataforma brasileira de histórias e fanfics.', note:'Os termos mencionam um player incorporável; ele não foi integrado nesta versão.' },
  { id:'wuxiaworld', name:'Wuxiaworld', category:'novels', url:'https://www.wuxiaworld.com/', mode:'external', badge:'Acesso oficial', description:'Web novels chinesas e coreanas com traduções licenciadas.', note:'Os termos proíbem enquadrar ou incorporar a plataforma sem autorização escrita.' },
  { id:'royalroad', name:'Royal Road', category:'novels', url:'https://www.royalroad.com/', mode:'try', badge:'Teste interno', description:'Ficção original, fantasia, LitRPG e histórias de progressão.', note:'Incorporação não confirmada; abra no Chrome se o quadro não carregar.' },
  { id:'scribblehub', name:'Scribble Hub', category:'novels', url:'https://www.scribblehub.com/', mode:'try', badge:'Teste interno', description:'Histórias originais em inglês, fantasia, romance e ficção científica.', note:'Os termos exigem permissão de responsável para menores de 18 anos.' },
  { id:'ciweimao', name:'Ciweimao', category:'novels', url:'https://www.ciweimao.com/', mode:'try', badge:'Teste interno', description:'Plataforma chinesa de publicação original de web novels.', note:'Interface e conteúdo predominantemente em chinês.' }
]);

const SHELF_KEY = 'gl-library-v1';
const PAGE_SIZE = 18;

export function buildOpenLibrarySearchUrl(term, page = 1) {
  const query = String(term || '').trim().replace(/\s+/g, ' ');
  if (!query) return '';
  const url = new URL('https://openlibrary.org/search.json');
  url.searchParams.set('q', query);
  url.searchParams.set('fields', 'key,title,author_name,first_publish_year,cover_i,ia,has_fulltext,public_scan_b');
  url.searchParams.set('limit', String(PAGE_SIZE));
  url.searchParams.set('page', String(Math.max(1, Math.floor(Number(page) || 1))));
  url.searchParams.set('lang', 'pt');
  return url.href;
}

export function buildOpenLibraryReaderUrl(identifier) {
  const id = String(identifier || '').trim();
  return id ? 'https://archive.org/stream/' + encodeURIComponent(id) + '?ui=embed' : '';
}

function safeUrl(value) {
  try { const parsed = new URL(String(value || '')); return parsed.protocol === 'https:' ? parsed.href : ''; }
  catch { return ''; }
}

export function isInternalLibraryUrl(value) {
  const safe = safeUrl(value);
  if (!safe) return false;
  const hostname = new URL(safe).hostname.toLowerCase().replace(/^www\./, '');
  const allowedHosts = LIBRARY_PLATFORMS
    .filter(platform => platform.mode !== 'external')
    .map(platform => new URL(platform.url).hostname.toLowerCase().replace(/^www\./, ''));
  return allowedHosts.some(domain => hostname === domain || hostname.endsWith('.' + domain));
}

function el(tag, className, value) {
  const node = document.createElement(tag);
  if (className) node.className = className;
  if (value !== undefined) node.textContent = String(value);
  return node;
}

function button(label, className, action) {
  const node = el('button', className, label);
  node.type = 'button';
  node.addEventListener('click', action);
  return node;
}

function readShelf() {
  try {
    const list = JSON.parse(localStorage.getItem(SHELF_KEY) || '[]');
    return Array.isArray(list) ? list.filter(item => item && typeof item.title === 'string' && safeUrl(item.url)) : [];
  } catch { return []; }
}

function writeShelf(list) {
  try { localStorage.setItem(SHELF_KEY, JSON.stringify(list)); return true; }
  catch { toast('Não foi possível salvar a estante neste navegador.'); return false; }
}

export function initializeLibraryApp(win) {
  const root = win.querySelector('#libraryApp');
  if (!root || root.dataset.initialized === 'true') return;
  root.dataset.initialized = 'true';

  const $ = selector => root.querySelector(selector);
  const tabs = [...root.querySelectorAll('[data-library-tab]')];
  const panels = [...root.querySelectorAll('[data-library-panel]')];
  const platformGrid = $('#libraryPlatforms');
  const resultsArchive = $('#libraryArchiveResults');
  const resultsOpen = $('#openLibraryResults');
  const shelfList = $('#libraryShelfList');
  const readerHost = $('#libraryReaderHost');
  const readerPanel = $('#libraryReaderPanel');
  let shelf = readShelf();
  let archiveTerm = '';
  let archivePage = 1;
  let archiveTotal = 0;
  let archiveController;

  const setTab = name => {
    tabs.forEach(tab => {
      const active = tab.dataset.libraryTab === name;
      tab.classList.toggle('active', active);
      tab.setAttribute('aria-selected', String(active));
    });
    panels.forEach(panel => { panel.hidden = panel.dataset.libraryPanel !== name; });
  };
  tabs.forEach(tab => tab.addEventListener('click', () => setTab(tab.dataset.libraryTab)));

  const openExternal = value => {
    const url = safeUrl(value);
    if (!url) return toast('Este endereço não é válido.');
    const opened = window.open(url, '_blank');
    if (opened) opened.opener = null;
    else toast('O Chrome bloqueou a nova aba. Permita pop-ups para o Galaxy Legacy.');
  };

  const readerAddress = $('#libraryReaderAddress');
  const readerAddressForm = $('#libraryReaderAddressForm');
  const readerBrowserBack = $('#libraryBrowserBack');
  const readerBrowserForward = $('#libraryBrowserForward');
  const readerBrowserReload = $('#libraryBrowserReload');
  const readerTitle = $('#libraryReaderTitle');
  const readerStatus = $('#libraryReaderStatus');
  let readerHistory = [];
  let readerHistoryIndex = -1;
  const isAllowedLibraryAddress = isInternalLibraryUrl;

  const updateReaderNavigation = () => {
    if (readerBrowserBack) readerBrowserBack.disabled = readerHistoryIndex <= 0;
    if (readerBrowserForward) readerBrowserForward.disabled = readerHistoryIndex < 0 || readerHistoryIndex >= readerHistory.length - 1;
    if (readerBrowserReload) readerBrowserReload.disabled = readerHistoryIndex < 0;
    if (readerAddress) readerAddress.value = readerHistoryIndex >= 0 ? readerHistory[readerHistoryIndex].url : '';
  };

  const showFrame = (title, value, source, options = {}) => {
    const url = safeUrl(value);
    if (!url) return;
    if (!isAllowedLibraryAddress(url)) {
      readerStatus.textContent = 'Por segurança, a barra interna aceita apenas os domínios das plataformas cadastradas na Biblioteca. Use o Chrome para outros endereços.';
      return;
    }

    if (options.record !== false) {
      readerHistory = readerHistory.slice(0, readerHistoryIndex + 1);
      readerHistory.push({ title, url, source });
      readerHistoryIndex = readerHistory.length - 1;
    }

    readerTitle.textContent = title;
    readerStatus.textContent = source + ' · O site está sendo aberto dentro da Biblioteca. Se aparecer uma tela vazia, aviso de bloqueio ou falha de login, use “Abrir no Chrome”. O Galaxy não remove proteções do site.';
    let frame = readerHost.querySelector('iframe');
    if (!frame) {
      frame = el('iframe', 'library-reader-frame');
      frame.title = title;
      frame.loading = 'eager';
      frame.referrerPolicy = 'strict-origin-when-cross-origin';
      frame.allow = 'fullscreen; autoplay; encrypted-media; picture-in-picture';
      frame.allowFullscreen = true;
      frame.setAttribute('sandbox', 'allow-forms allow-scripts allow-same-origin allow-popups allow-popups-to-escape-sandbox');
      readerHost.replaceChildren(frame);
    }
    frame.title = title;
    frame.src = url;
    frame.addEventListener('load', () => {
      if (readerHistoryIndex >= 0 && readerHistory[readerHistoryIndex]?.url === url) {
        readerStatus.textContent = 'O quadro concluiu a navegação. Isso não confirma que a plataforma permite incorporação: confira a página. Os controles da Biblioteca percorrem os endereços abertos pela barra; links internos mantêm o histórico próprio do site.';
      }
    }, { once: true });
    readerPanel.hidden = false;
    setTab('reader');
    updateReaderNavigation();
  };

  const navigateReaderHistory = index => {
    const entry = readerHistory[index];
    if (!entry) return;
    readerHistoryIndex = index;
    showFrame(entry.title, entry.url, entry.source, { record: false });
  };

  readerAddressForm?.addEventListener('submit', event => {
    event.preventDefault();
    let value = String(readerAddress?.value || '').trim();
    if (value && !/^[a-z][a-z0-9+.-]*:\/\//i.test(value)) value = 'https://' + value;
    if (!isAllowedLibraryAddress(value)) {
      readerStatus.textContent = 'Endereço não permitido nesta janela. Use HTTPS e um domínio cadastrado na Biblioteca.';
      return;
    }
    showFrame(new URL(value).hostname, value, 'Navegação pela barra interna');
  });

  readerBrowserBack?.addEventListener('click', () => navigateReaderHistory(readerHistoryIndex - 1));
  readerBrowserForward?.addEventListener('click', () => navigateReaderHistory(readerHistoryIndex + 1));
  readerBrowserReload?.addEventListener('click', () => {
    const entry = readerHistory[readerHistoryIndex];
    if (entry) showFrame(entry.title, entry.url, 'Atualizando página interna', { record: false });
  });

  const save = item => {
    const title = String(item.title || '').trim().slice(0, 180);
    const url = safeUrl(item.url);
    if (!title || !url) return toast('Informe título e endereço HTTPS válido.');
    if (shelf.some(entry => entry.url === url)) { setTab('shelf'); return toast('Este item já está na sua estante.'); }
    shelf.unshift({ id: 'shelf-' + Date.now().toString(36), title, url, source: String(item.source || '').slice(0, 80), type: String(item.type || '').slice(0, 40), addedAt: new Date().toISOString() });
    if (writeShelf(shelf)) { renderShelf(); toast('Adicionado à sua estante.'); }
  };

  const renderShelf = () => {
    shelfList.replaceChildren();
    if (!shelf.length) return shelfList.append(el('p', 'library-empty', 'Sua estante está vazia. Adicione plataformas, livros ou histórias para guardar os links aqui.'));
    shelf.forEach(item => {
      const row = el('article', 'library-shelf-item');
      const detail = el('div', 'library-shelf-copy');
      detail.append(el('strong', '', item.title), el('small', '', [item.source, item.type].filter(Boolean).join(' · ') || 'Link salvo'));
      const actions = el('div', 'library-shelf-actions');
      actions.append(button('ABRIR ↗', 'pixel-btn', () => openExternal(item.url)));
      actions.append(button('REMOVER', 'library-save-link', () => { shelf = shelf.filter(entry => entry.id !== item.id); writeShelf(shelf); renderShelf(); }));
      row.append(detail, actions);
      shelfList.append(row);
    });
  };

  const savePlatform = platform => save({ title:platform.name, url:platform.url, source:platform.name, type:platform.category });

  const renderPlatforms = () => {
    platformGrid.replaceChildren();
    const term = String($('#libraryPlatformSearch')?.value || '').trim().toLocaleLowerCase('pt-BR');
    const category = $('#libraryCategory')?.value || 'all';
    const filtered = LIBRARY_PLATFORMS.filter(item => (category === 'all' || item.category === category) && (item.name + ' ' + item.description).toLocaleLowerCase('pt-BR').includes(term));
    filtered.forEach(platform => {
      const card = el('article', 'library-platform-card');
      const top = el('div', 'library-card-top');
      top.append(el('strong', 'library-card-title', platform.name), el('span', 'library-mode-badge ' + (platform.mode === 'reader' ? 'is-reader' : platform.mode === 'external' ? 'is-external' : 'is-try'), platform.badge));
      card.append(top, el('p', 'library-card-description', platform.description), el('small', 'library-card-note', platform.note));
      const actions = el('div', 'library-card-actions');
      actions.append(button('ABRIR NO CHROME ↗', 'pixel-btn library-card-button', () => openExternal(platform.url)));
      if (platform.mode === 'try') actions.append(button('ABRIR NA BIBLIOTECA', 'pixel-btn secondary library-card-button', () => showFrame(platform.name, platform.url, 'Página oficial aberta em janela interna')));
      if (platform.mode === 'reader') actions.append(button('PESQUISAR NA BIBLIOTECA', 'pixel-btn secondary library-card-button', () => setTab(platform.id === 'openlibrary' ? 'openlibrary' : 'archive')));
      actions.append(button('＋ ADICIONAR À ESTANTE', 'library-save-link', () => savePlatform(platform)));
      card.append(actions);
      platformGrid.append(card);
    });
    if (!filtered.length) platformGrid.append(el('p', 'library-empty', 'Nenhuma plataforma corresponde à pesquisa.'));
  };

  const renderArchive = docs => {
    docs.forEach(item => {
      if (!item.identifier) return;
      const card = el('article', 'library-result-card');
      const cover = el('img', 'library-result-cover');
      cover.alt = '';
      cover.loading = 'lazy';
      cover.src = 'https://archive.org/services/img/' + encodeURIComponent(item.identifier);
      cover.addEventListener('error', () => { cover.hidden = true; }, { once:true });
      const body = el('div', 'library-result-body');
      const title = item.title || item.identifier;
      body.append(el('small', 'library-result-source', 'INTERNET ARCHIVE'), el('strong', 'library-result-title', title));
      const creator = Array.isArray(item.creator) ? item.creator.slice(0, 2).join(', ') : item.creator || 'Autor não informado';
      body.append(el('small', 'library-result-meta', creator));
      if (item.year || item.date) body.append(el('small', 'library-result-meta', item.year || String(item.date).slice(0,4)));
      const actions = el('div', 'library-result-actions');
      actions.append(button('ABRIR LEITOR', 'pixel-btn', () => showFrame(title, buildArchiveEmbedUrl(item.identifier), 'Internet Archive BookReader / player')));
      actions.append(button('PÁGINA DO ITEM ↗', 'library-save-link', () => openExternal(buildArchiveDetailsUrl(item.identifier))));
      body.append(actions);
      card.append(cover, body);
      resultsArchive.append(card);
    });
  };

  $('#libraryArchiveForm')?.addEventListener('submit', async event => {
    event.preventDefault();
    archiveTerm = $('#libraryArchiveInput').value.trim();
    if (!archiveTerm) { $('#libraryArchiveStatus').textContent = 'Digite título, autor ou assunto.'; return; }
    archivePage = 1;
    archiveController?.abort();
    archiveController = new AbortController();
    resultsArchive.replaceChildren();
    await searchArchive(false);
  });

  const searchArchive = async append => {
    const controller = archiveController;
    const page = append ? archivePage + 1 : 1;
    $('#libraryArchiveStatus').textContent = 'Consultando o catálogo do Internet Archive…';
    $('#libraryArchiveMore').disabled = true;
    try {
      const response = await fetch(buildArchiveSearchUrl(archiveTerm, 'texts', page), { signal:controller.signal, headers:{Accept:'application/json'} });
      if (!response.ok) throw new Error('HTTP ' + response.status);
      const data = (await response.json()).response || {};
      if (controller !== archiveController) return;
      const docs = Array.isArray(data.docs) ? data.docs : [];
      archiveTotal = Number(data.numFound) || 0;
      if (!append) resultsArchive.replaceChildren();
      renderArchive(docs);
      archivePage = page;
      const count = resultsArchive.children.length;
      $('#libraryArchiveStatus').textContent = count ? archiveTotal.toLocaleString('pt-BR') + ' resultados · exibindo ' + count.toLocaleString('pt-BR') + '.' : 'Nenhum livro ou texto encontrado.';
      $('#libraryArchiveMore').hidden = docs.length < PAGE_SIZE || count >= archiveTotal;
    } catch (error) {
      if (error.name !== 'AbortError') { $('#libraryArchiveStatus').textContent = 'Não foi possível consultar o Archive. Abra o site oficial como alternativa.'; console.warn(error); }
      $('#libraryArchiveMore').hidden = true;
    } finally { $('#libraryArchiveMore').disabled = false; }
  };
  $('#libraryArchiveMore')?.addEventListener('click', () => { archiveController?.abort(); archiveController = new AbortController(); searchArchive(true); });

  $('#openLibrarySearchForm')?.addEventListener('submit', async event => {
    event.preventDefault();
    const term = $('#openLibrarySearchInput').value.trim();
    if (!term) { $('#openLibrarySearchStatus').textContent = 'Digite título, autor ou assunto.'; return; }
    $('#openLibrarySearchStatus').textContent = 'Pesquisando no Open Library…';
    resultsOpen.replaceChildren();
    try {
      const response = await fetch(buildOpenLibrarySearchUrl(term), { headers:{Accept:'application/json'} });
      if (!response.ok) throw new Error('HTTP ' + response.status);
      const payload = await response.json();
      const docs = Array.isArray(payload.docs) ? payload.docs : [];
      docs.forEach(item => {
        if (!item.key) return;
        const card = el('article', 'library-result-card');
        const cover = el('img', 'library-result-cover');
        cover.alt = '';
        cover.loading = 'lazy';
        if (Number.isFinite(Number(item.cover_i))) cover.src = 'https://covers.openlibrary.org/b/id/' + Number(item.cover_i) + '-M.jpg';
        else cover.hidden = true;
        cover.addEventListener('error', () => { cover.hidden = true; }, { once:true });
        const body = el('div', 'library-result-body');
        body.append(el('small', 'library-result-source', 'OPEN LIBRARY'), el('strong', 'library-result-title', item.title || 'Livro sem título'));
        body.append(el('small', 'library-result-meta', (item.author_name || ['Autor não informado']).slice(0,2).join(', ')));
        if (item.first_publish_year) body.append(el('small', 'library-result-meta', item.first_publish_year));
        const actions = el('div', 'library-result-actions');
        const ia = Array.isArray(item.ia) ? item.ia.find(value => typeof value === 'string') : '';
        if (ia) actions.append(button('ABRIR BOOKREADER', 'pixel-btn', () => showFrame(item.title || 'BookReader', buildOpenLibraryReaderUrl(ia), 'Open Library / Internet Archive BookReader')));
        else actions.append(el('small', 'library-result-unavailable', 'Sem cópia BookReader vinculada nesta ficha.'));
        const url = safeUrl('https://openlibrary.org' + item.key);
        actions.append(button('FICHA DO LIVRO ↗', 'library-save-link', () => openExternal(url)));
        actions.append(button('＋ ESTANTE', 'library-save-link', () => save({title:item.title || 'Livro sem título', url, source:'Open Library', type:'Livro'})));
        body.append(actions);
        card.append(cover, body);
        resultsOpen.append(card);
      });
      $('#openLibrarySearchStatus').textContent = docs.length ? (Number(payload.numFound) || docs.length).toLocaleString('pt-BR') + ' obras encontradas · mostrando ' + docs.length + '.' : 'Nenhuma obra encontrada.';
    } catch (error) {
      $('#openLibrarySearchStatus').textContent = 'Não foi possível consultar a API. Abra o catálogo oficial.';
      console.warn('Open Library:', error);
    }
  });

  $('#libraryAddShelfForm')?.addEventListener('submit', event => {
    event.preventDefault();
    save({title:$('#libraryAddShelfTitle').value, url:$('#libraryAddShelfUrl').value, source:'Adicionado manualmente', type:'Link'});
    event.target.reset();
    setTab('shelf');
  });

  $('#libraryExportShelf')?.addEventListener('click', () => {
    const blob = new Blob([JSON.stringify({version:1, items:shelf}, null, 2)], {type:'application/json'});
    const url = URL.createObjectURL(blob);
    const link = el('a');
    link.href = url; link.download = 'galaxy-library-shelf.json'; link.click();
    URL.revokeObjectURL(url);
  });

  $('#libraryImportShelf')?.addEventListener('change', async event => {
    const file = event.target.files?.[0]; event.target.value = '';
    if (!file) return;
    try {
      const payload = JSON.parse(await file.text());
      const incoming = Array.isArray(payload) ? payload : payload.items;
      if (!Array.isArray(incoming)) throw new Error('Formato inválido');
      const clean = incoming.map(item => ({id:String(item.id || Date.now()), title:String(item.title || '').trim().slice(0,180), url:safeUrl(item.url), source:String(item.source || '').slice(0,80), type:String(item.type || '').slice(0,40)})).filter(item => item.title && item.url);
      shelf = [...clean, ...shelf].filter((item, index, all) => all.findIndex(entry => entry.url === item.url) === index).slice(0,500);
      if (writeShelf(shelf)) { renderShelf(); toast(clean.length + ' itens importados.'); }
    } catch { toast('Não foi possível importar este arquivo JSON.'); }
  });

  $('#libraryPlatformSearch')?.addEventListener('input', renderPlatforms);
  $('#libraryCategory')?.addEventListener('change', renderPlatforms);
  $('#libraryReaderBack')?.addEventListener('click', () => { readerHost.replaceChildren(); readerHistory = []; readerHistoryIndex = -1; updateReaderNavigation(); setTab('sites'); });
  $('#libraryReaderExternal')?.addEventListener('click', () => { const url = readerAddress?.value || readerHistory[readerHistoryIndex]?.url; if (url) openExternal(url); });

  renderPlatforms();
  renderShelf();
}
