import { toast } from '../core/notifications.js';

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
const ARCHIVE_FIELDS = ['identifier', 'title', 'creator', 'year', 'mediatype'];
const ARCHIVE_PAGE_SIZE = 12;

export function buildArchiveSearchUrl(term, mediaType = 'all', page = 1) {
  const cleanTerm = String(term || '').trim();
  if (!cleanTerm) return '';

  // Search a quoted phrase in the Archive's own metadata index.
  const escapedPhrase = cleanTerm.replace(/\\/g, '\\\\').replace(/"/g, '\\"');
  const phrase = '"' + escapedPhrase + '"';
  const type = ARCHIVE_MEDIA_TYPES.has(mediaType) ? mediaType : 'all';
  const query = type === 'all' ? phrase : phrase + ' AND mediatype:' + type;
  const safePage = Math.max(1, Math.floor(Number(page) || 1));

  const url = new URL('https://archive.org/advancedsearch.php');
  url.searchParams.set('q', query);
  ARCHIVE_FIELDS.forEach(field => url.searchParams.append('fl[]', field));
  url.searchParams.set('rows', String(ARCHIVE_PAGE_SIZE));
  url.searchParams.set('page', String(safePage));
  url.searchParams.set('output', 'json');
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

  const year = readableValue(item.year);
  const meta = document.createElement('small');
  meta.className = 'archive-result-meta';
  meta.textContent = year;

  content.append(type, title, creator);
  if (year) content.appendChild(meta);
  card.append(artwork, content);
  card.addEventListener('click', () => onOpen(item));
  return card;
}

export function initializeInternetApp(win) {
  const elements = {
    tabBlogs: win.querySelector('#internetTabBlogs'),
    tabArchive: win.querySelector('#internetTabArchive'),
    blogsPanel: win.querySelector('#neocitiesPanel'),
    archivePanel: win.querySelector('#archivePanel'),
    blogCatalog: win.querySelector('#neocitiesCatalog'),
    blogViewer: win.querySelector('#neocitiesViewer'),
    blogFrameHost: win.querySelector('#neocitiesFrameHost'),
    blogTitle: win.querySelector('#neocitiesCurrentTitle'),
    blogBack: win.querySelector('#neocitiesBack'),
    blogReload: win.querySelector('#neocitiesReload'),
    archiveForm: win.querySelector('#archiveSearchForm'),
    archiveInput: win.querySelector('#archiveSearchInput'),
    archiveType: win.querySelector('#archiveMediaType'),
    archiveSearchButton: win.querySelector('#archiveSearchButton'),
    archiveStatus: win.querySelector('#archiveSearchStatus'),
    archiveResultsArea: win.querySelector('#archiveResultsArea'),
    archiveResults: win.querySelector('#archiveResults'),
    archiveMore: win.querySelector('#archiveMore'),
    archiveViewer: win.querySelector('#archiveViewer'),
    archiveFrameHost: win.querySelector('#archiveFrameHost'),
    archiveViewerTitle: win.querySelector('#archiveViewerTitle'),
    archiveBack: win.querySelector('#archiveBackResults'),
    archiveOpenItem: win.querySelector('#archiveOpenItem')
  };

  if (Object.values(elements).some(element => !element)) return;
  if (win.dataset.internetInitialized === 'true') return;
  win.dataset.internetInitialized = 'true';

  const blogsById = new Map(NEOCITIES_BLOGS.map(blog => [blog.id, blog]));
  let currentBlog = null;
  let currentArchiveItem = null;
  let currentSearchTerm = '';
  let currentSearchType = 'all';
  let currentPage = 1;
  let totalResults = 0;
  let activeSearchController = null;
  let searchRequestId = 0;

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

  function showBlogCatalog() {
    currentBlog = null;
    elements.blogFrameHost.replaceChildren();
    elements.blogViewer.hidden = true;
    elements.blogCatalog.hidden = false;
  }

  function openBlog(blog) {
    if (!blog) return;
    currentBlog = blog;
    elements.blogTitle.textContent = blog.name;
    elements.blogCatalog.hidden = true;
    elements.blogViewer.hidden = false;
    elements.blogFrameHost.replaceChildren();

    const frame = createEmbeddedFrame(blog.url, 'Blog Neocities: ' + blog.name);
    frame.addEventListener('load', () => {
      if (currentBlog === blog) {
        elements.blogTitle.textContent = blog.name + ' · carregado';
      }
    }, { once: true });
    elements.blogFrameHost.appendChild(frame);
  }

  elements.blogCatalog.querySelectorAll('[data-blog-id]').forEach(button => {
    button.addEventListener('click', () => {
      openBlog(blogsById.get(button.dataset.blogId));
    });
  });

  elements.blogBack.addEventListener('click', showBlogCatalog);
  elements.blogReload.addEventListener('click', () => {
    if (currentBlog) openBlog(currentBlog);
  });

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
      setArchiveStatus('O item foi carregado pelo Internet Archive. Use os controles do próprio player para assistir, ouvir ou ler.');
    }, { once: true });
    elements.archiveFrameHost.appendChild(frame);
  }

  function showArchiveResults() {
    currentArchiveItem = null;
    elements.archiveFrameHost.replaceChildren();
    elements.archiveViewer.hidden = true;
    elements.archiveResultsArea.hidden = false;
  }

  elements.archiveBack.addEventListener('click', showArchiveResults);

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
      setArchiveStatus('Digite o título, assunto, autor ou palavra que deseja encontrar no Archive.org.');
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
    }

    activeSearchController?.abort();
    activeSearchController = new AbortController();
    const controller = activeSearchController;
    const requestId = ++searchRequestId;
    currentPage = page;
    elements.archiveSearchButton.disabled = true;
    elements.archiveMore.disabled = true;
    setArchiveStatus('Pesquisando na coleção do Internet Archive…');

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
        setArchiveStatus(totalResults.toLocaleString('pt-BR') + ' resultados no Archive.org · exibindo ' + shown.toLocaleString('pt-BR') + '.');
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

  elements.archiveForm.addEventListener('submit', event => {
    event.preventDefault();
    performSearch(1, false);
  });

  elements.archiveMore.addEventListener('click', () => {
    if (currentSearchTerm && !elements.archiveMore.disabled) {
      performSearch(currentPage + 1, true);
    }
  });

  // Keep the blog library as the initial screen; no general web search or arbitrary URLs.
  showBlogCatalog();
  setSection('blogs');
}
