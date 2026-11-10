import { toast } from '../core/notifications.js';

export function normalizeWebAddress(value) {
  const input = String(value || '').trim();
  if (!input) return '';

  const explicitHttp = /^https?:\\/\\//i.test(input);
  const looksLikeDomain = /^[^\\s/]+\\.[a-z]{2,}(?::\\d+)?(?:\\/[^\\s]*)?$/i.test(input);
  const candidate = explicitHttp ? input : (looksLikeDomain ? `https://${input}` : '');

  if (candidate) {
    try {
      const url = new URL(candidate);
      if (url.protocol === 'http:' || url.protocol === 'https:') return url.href;
    } catch (error) {
      // Fall through to web search.
    }
  }

  return `https://www.google.com/search?q=${encodeURIComponent(input)}`;
}

export function buildEmbeddableUrl(value) {
  const source = normalizeWebAddress(value);
  if (!source) return '';
  const url = new URL(source);
  const host = url.hostname.toLowerCase().replace(/^www\./, '');

  if (host === 'youtu.be') {
    const videoId = url.pathname.split('/').filter(Boolean)[0];
    if (videoId) return `https://www.youtube.com/embed/${encodeURIComponent(videoId)}`;
  }

  if (host === 'youtube.com' || host === 'm.youtube.com' || host === 'youtube-nocookie.com') {
    const videoId = url.searchParams.get('v')
      || url.pathname.match(/^\/(?:embed|shorts|live)\/([^/]+)/)?.[1];
    if (videoId) return `https://www.youtube.com/embed/${encodeURIComponent(videoId)}`;
  }

  if (host === 'archive.org' && url.pathname.startsWith('/details/')) {
    const identifier = url.pathname.split('/').filter(Boolean)[1];
    if (identifier) return `https://archive.org/embed/${encodeURIComponent(identifier)}`;
  }

  if (host === 'open.spotify.com') {
    const match = url.pathname.match(/^\/(album|playlist|track|episode|show)\/([^/]+)/);
    if (match) return `https://open.spotify.com/embed/${match[1]}/${encodeURIComponent(match[2])}`;
  }

  if (host === 'codepen.io') {
    const match = url.pathname.match(/^\/([^/]+)\/pen\/([^/]+)/);
    if (match) return `https://codepen.io/${match[1]}/embed/${match[2]}?default-tab=result`;
  }

  if (host === 'docs.google.com' && /^\/forms\/d\/e\/[^/]+\/viewform/.test(url.pathname)) {
    url.searchParams.set('embedded', 'true');
    return url.href;
  }

  return source;
}

export function initializeInternetApp(win) {
  const form = win.querySelector('#internetForm');
  const address = win.querySelector('#webAddress');
  const view = win.querySelector('#browserView');
  const status = win.querySelector('#internetStatus');
  const goWeb = win.querySelector('#goWeb');
  const openChrome = win.querySelector('#openChrome');
  const backButton = win.querySelector('#internetBack');
  const forwardButton = win.querySelector('#internetForward');
  const reloadButton = win.querySelector('#internetReload');

  if (!form || !address || !view || !status) return;

  let history = [];
  let historyIndex = -1;
  let currentSourceUrl = '';

  const setStatus = message => {
    status.textContent = message;
  };

  const updateHistoryControls = () => {
    backButton.disabled = historyIndex <= 0;
    forwardButton.disabled = historyIndex < 0 || historyIndex >= history.length - 1;
    reloadButton.disabled = historyIndex < 0;
    openChrome.hidden = historyIndex < 0;
  };

  const showMessage = (heading, message) => {
    const placeholder = document.createElement('div');
    placeholder.className = 'internet-placeholder';
    const title = document.createElement('strong');
    const paragraph = document.createElement('p');
    paragraph.className = 'muted';
    title.textContent = heading;
    paragraph.textContent = message;
    placeholder.append(title, paragraph);
    view.classList.remove('is-loaded');
    view.replaceChildren(placeholder);
  };

  const renderFrame = entry => {
    currentSourceUrl = entry.source;
    address.value = entry.source;
    openChrome.hidden = false;
    const frame = document.createElement('iframe');
    frame.title = 'Página externa dentro do Galaxy Legacy';
    frame.loading = 'eager';
    frame.referrerPolicy = 'strict-origin-when-cross-origin';
    frame.allow = 'autoplay; fullscreen; encrypted-media; picture-in-picture';
    frame.allowFullscreen = true;
    frame.setAttribute('sandbox', 'allow-forms allow-scripts allow-same-origin allow-popups allow-popups-to-escape-sandbox');
    frame.addEventListener('load', () => {
      setStatus('O frame terminou de carregar. Confira se o conteúdo apareceu; alguns sites bloqueiam a exibição mesmo sem mostrar um erro.');
    });
    view.classList.add('is-loaded');
    view.replaceChildren(frame);
    frame.src = entry.embed;
    updateHistoryControls();
  };

  const navigateInside = value => {
    const source = normalizeWebAddress(value);
    if (!source) {
      toast('Digite um endereço ou termo para pesquisar.');
      address.focus();
      return;
    }
    const entry = { source, embed: buildEmbeddableUrl(source) };
    history = history.slice(0, historyIndex + 1);
    history.push(entry);
    historyIndex = history.length - 1;
    renderFrame(entry);
    setStatus('Tentando abrir dentro do Galaxy Legacy…');
  };

  const navigateExternal = value => {
    const source = normalizeWebAddress(value);
    if (!source) {
      toast('Digite um endereço ou termo para pesquisar.');
      address.focus();
      return;
    }
    currentSourceUrl = source;
    address.value = source;
    openChrome.hidden = false;
    window.open(source, '_blank', 'noopener,noreferrer');
    showMessage('ABERTO EM OUTRA ABA', 'O Chrome recebeu este endereço. Para tentar visualizar nesta janela, use ABRIR AQUI.');
    setStatus('O endereço foi enviado para uma nova aba do Chrome.');
    toast('Abrindo em uma nova aba do Chrome ♡');
  };

  form.addEventListener('submit', event => {
    event.preventDefault();
    navigateInside(address.value);
  });

  goWeb.addEventListener('click', () => navigateExternal(address.value));
  openChrome.addEventListener('click', () => {
    if (currentSourceUrl) window.open(currentSourceUrl, '_blank', 'noopener,noreferrer');
  });

  backButton.addEventListener('click', () => {
    if (historyIndex <= 0) return;
    historyIndex -= 1;
    renderFrame(history[historyIndex]);
    setStatus('Voltando para a página anterior.');
  });

  forwardButton.addEventListener('click', () => {
    if (historyIndex >= history.length - 1) return;
    historyIndex += 1;
    renderFrame(history[historyIndex]);
    setStatus('Avançando para a próxima página.');
  });

  reloadButton.addEventListener('click', () => {
    if (historyIndex < 0) return;
    renderFrame(history[historyIndex]);
    setStatus('Recarregando a página atual…');
  });

  win.querySelectorAll('[data-internet-url]').forEach(button => {
    button.addEventListener('click', () => {
      const target = button.getAttribute('data-internet-url');
      navigateInside(target);
    });
  });

  updateHistoryControls();
}
