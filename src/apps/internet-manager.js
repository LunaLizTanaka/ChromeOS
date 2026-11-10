import { toast } from '../core/notifications.js';

export function normalizeWebAddress(value) {
  const input = String(value || '').trim();
  if (!input) return '';

  const lowerInput = input.toLowerCase();
  const explicitHttp = lowerInput.startsWith('http://') || lowerInput.startsWith('https://');
  const hasWhitespace = input.split('').some(character => character.charCodeAt(0) <= 32);
  const looksLikeDomain = input.includes('.') && !hasWhitespace;
  const candidate = explicitHttp ? input : (looksLikeDomain ? 'https://' + input : '');

  if (candidate) {
    try {
      const url = new URL(candidate);
      if (url.protocol === 'http:' || url.protocol === 'https:') return url.href;
    } catch (error) {
      // Treat malformed input as a web search below.
    }
  }

  return 'https://www.google.com/search?q=' + encodeURIComponent(input);
}

function getHost(url) {
  const host = url.hostname.toLowerCase();
  return host.startsWith('www.') ? host.slice(4) : host;
}

export function buildEmbeddableUrl(value) {
  const source = normalizeWebAddress(value);
  if (!source) return '';
  const url = new URL(source);
  const host = getHost(url);
  const parts = url.pathname.split('/').filter(Boolean);

  if (host === 'youtu.be' && parts[0]) {
    return 'https://www.youtube.com/embed/' + encodeURIComponent(parts[0]);
  }

  if (host === 'youtube.com' || host === 'm.youtube.com' || host === 'youtube-nocookie.com') {
    const videoId = url.searchParams.get('v')
      || ((parts[0] === 'embed' || parts[0] === 'shorts' || parts[0] === 'live') ? parts[1] : '');
    if (videoId) return 'https://www.youtube.com/embed/' + encodeURIComponent(videoId);
  }

  if (host === 'archive.org' && parts[0] === 'details' && parts[1]) {
    return 'https://archive.org/embed/' + encodeURIComponent(parts[1]);
  }

  if (host === 'open.spotify.com') {
    const allowedTypes = ['album', 'playlist', 'track', 'episode', 'show'];
    if (allowedTypes.includes(parts[0]) && parts[1]) {
      return 'https://open.spotify.com/embed/' + parts[0] + '/' + encodeURIComponent(parts[1]);
    }
  }

  if (host === 'codepen.io' && parts.length >= 3 && parts[1] === 'pen') {
    return 'https://codepen.io/' + parts[0] + '/embed/' + parts[2] + '?default-tab=result';
  }

  if (host === 'docs.google.com' && parts[0] === 'forms' && parts[1] === 'd' && parts[2] === 'e' && parts[3] && parts[4] === 'viewform') {
    url.searchParams.set('embedded', 'true');
    return url.href;
  }

  return source;
}

function isValidTumblrSlug(value) {
  if (typeof value !== 'string' || value.length === 0 || value.length > 128) return false;

  for (const character of value) {
    const code = character.toLowerCase().charCodeAt(0);
    const isLetter = code >= 97 && code <= 122;
    const isNumber = code >= 48 && code <= 57;
    if (!isLetter && !isNumber && code !== 45) return false;
  }

  return true;
}

export function getTumblrBlogName(value) {
  try {
    const url = new URL(value);
    const host = url.hostname.toLowerCase();
    const suffix = '.tumblr.com';
    if (!host.endsWith(suffix) || url.pathname !== '/') return '';

    const slug = host.slice(0, -suffix.length);
    const reserved = ['www', 'assets', 'api', 'staff', 'support', 'help'];
    if (reserved.includes(slug) || slug.includes('.')) return '';

    return isValidTumblrSlug(slug) ? slug : '';
  } catch (error) {
    return '';
  }
}

function createTumblrBlogDocument(blogName) {
  return '<!doctype html><html lang="en"><head><meta charset="utf-8">' +
    '<meta name="viewport" content="width=device-width, initial-scale=1">' +
    '<style>body{margin:0;padding:14px;background:#fffdfb;color:#765064;font:14px Arial,sans-serif;line-height:1.5}a{color:#b56c89}img{max-width:100%;height:auto}</style>' +
    '</head><body><p>Loading public Tumblr blog…</p>' +
    '<script type="text/javascript" src="https://' + blogName + '.tumblr.com/js"></script>' +
    '</body></html>';
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

  if (!form || !address || !view || !status || !goWeb || !openChrome || !backButton || !forwardButton || !reloadButton) {
    return;
  }

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

    const frame = document.createElement('iframe');
    frame.title = 'Página externa dentro do Galaxy Legacy';
    frame.loading = 'eager';
    frame.referrerPolicy = 'strict-origin-when-cross-origin';
    frame.allow = 'autoplay; fullscreen; encrypted-media; picture-in-picture';
    frame.allowFullscreen = true;

    const tumblrBlogName = getTumblrBlogName(entry.source);
    if (tumblrBlogName) {
      // Keep the official Tumblr widget in an opaque-origin sandboxed child frame.
      frame.setAttribute('sandbox', 'allow-scripts allow-popups allow-popups-to-escape-sandbox');
      frame.srcdoc = createTumblrBlogDocument(tumblrBlogName);
    } else {
      frame.setAttribute('sandbox', 'allow-forms allow-scripts allow-same-origin allow-popups allow-popups-to-escape-sandbox');
    }

    frame.addEventListener('load', () => {
      setStatus('O frame terminou de carregar. Confira se o conteúdo apareceu; alguns sites bloqueiam a exibição mesmo sem mostrar um erro.');
    });

    view.classList.add('is-loaded');
    view.replaceChildren(frame);
    if (!tumblrBlogName) frame.src = entry.embed;
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

  const tumblrBlogInput = win.querySelector('#tumblrBlogInput');
  const openTumblrBlog = win.querySelector('#openTumblrBlog');
  if (tumblrBlogInput && openTumblrBlog) {
    openTumblrBlog.addEventListener('click', () => {
      let host = String(tumblrBlogInput.value || '').trim().toLowerCase();
      if (host.startsWith('https://')) host = host.slice(8);
      else if (host.startsWith('http://')) host = host.slice(7);
      host = host.split('/')[0];

      const suffix = '.tumblr.com';
      if (host.endsWith(suffix)) host = host.slice(0, -suffix.length);

      if (host === 'www' || !isValidTumblrSlug(host)) {
        toast('Digite apenas o nome de um blog público do Tumblr.');
        tumblrBlogInput.focus();
        return;
      }

      navigateInside('https://' + host + '.tumblr.com/');
    });
  }

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
      navigateInside(button.getAttribute('data-internet-url'));
    });
  });

  updateHistoryControls();
}
