import { $, $$ } from '../core/dom.js';
import { storage } from '../core/storage.js';
import { toast } from '../core/notifications.js';
import { bindSettings, exportConfig, importConfig } from '../core/settings.js';
import { activateWindow, getWindow, showWindow } from '../managers/window-manager.js';
import { appTitles, renderAppContent, escapeHtml } from './app-templates.js';
import { initializePaintApp } from './paint-app.js';

function normalizeWebAddress(value) {
  const input = String(value || '').trim();
  if (!input) return '';

  const candidate = /^https?:\\/\\//i.test(input) ? input : `https://${input}`;
  try {
    const url = new URL(candidate);
    const looksLikeDomain = input.includes('.') && !/\\s/.test(input);
    if (['http:', 'https:'].includes(url.protocol) && (looksLikeDomain || /^https?:\\/\\//i.test(input))) {
      return url.href;
    }
  } catch (error) {
    // A plain phrase is treated as a web search below.
  }

  return `https://www.google.com/search?q=${encodeURIComponent(input)}`;
}

function bindApp(name, win) {
  if (name === 'notes') {
    const textArea = $('#noteText', win);
    textArea.value = storage.getItem('gl-notes') || '';
    textArea.addEventListener('input', () => storage.setItem('gl-notes', textArea.value));
    $('#clearNotes', win).addEventListener('click', () => {
      textArea.value = '';
      storage.removeItem('gl-notes');
      toast('Notebook cleared ♡');
    });
  }

  if (name === 'internet') {
    const address = $('#webAddress', win);
    const view = $('#browserView', win);
    const openChrome = $('#openChrome', win);
    let currentUrl = '';

    const showStatus = (title, message) => {
      view.replaceChildren();
      const box = document.createElement('div');
      const heading = document.createElement('strong');
      const paragraph = document.createElement('p');
      paragraph.className = 'muted';
      heading.textContent = title;
      paragraph.textContent = message;
      box.append(heading, paragraph);
      view.appendChild(box);
    };

    const navigateInChrome = () => {
      const url = normalizeWebAddress(address.value);
      if (!url) {
        toast('Digite um endereço ou termo para pesquisar.');
        address.focus();
        return;
      }
      currentUrl = url;
      address.value = url;
      openChrome.disabled = false;
      window.open(url, '_blank', 'noopener,noreferrer');
      showStatus(
        'ABERTURA SOLICITADA',
        'O Chrome recebeu o endereço para abrir em uma nova aba. Se a nova aba não aparecer, clique em ABRIR NO CHROME.'
      );
      toast('Abrindo em uma nova aba do Chrome ♡');
    };

    const tryInside = () => {
      const url = normalizeWebAddress(address.value);
      if (!url) {
        toast('Digite um endereço válido primeiro.');
        address.focus();
        return;
      }
      currentUrl = url;
      address.value = url;
      openChrome.disabled = false;
      view.replaceChildren();
      const frame = document.createElement('iframe');
      frame.src = url;
      frame.title = 'Página externa incorporada';
      frame.loading = 'eager';
      frame.referrerPolicy = 'strict-origin-when-cross-origin';
      frame.setAttribute('sandbox', 'allow-forms allow-scripts allow-same-origin allow-popups allow-popups-to-escape-sandbox');
      view.appendChild(frame);
      toast('Tentando exibir dentro da janela. Alguns sites bloqueiam isso.');
    };

    $('#goWeb', win).addEventListener('click', navigateInChrome);
    $('#openHere', win).addEventListener('click', tryInside);
    address.addEventListener('keydown', event => {
      if (event.key === 'Enter') navigateInChrome();
    });
    openChrome.addEventListener('click', () => {
      if (!currentUrl) currentUrl = normalizeWebAddress(address.value);
      if (currentUrl) window.open(currentUrl, '_blank', 'noopener,noreferrer');
    });
    $$('[data-quick-url]', win).forEach(link => {
      link.addEventListener('click', event => {
        event.preventDefault();
        const url = link.getAttribute('href');
        currentUrl = url;
        address.value = url;
        openChrome.disabled = false;
        window.open(url, '_blank', 'noopener,noreferrer');
        showStatus('ATALHO ABERTO NO CHROME', `O site ${url} foi solicitado em uma nova aba.`);
      });
    });
  }

  if (name === 'files') {
    $('#localFiles', win).addEventListener('change', event => {
      const files = Array.from(event.target.files || []);
      $('#fileList', win).innerHTML = files.length
        ? files.map(file => `<div class="list-row"><span>▤ ${escapeHtml(file.name)}</span><span class="muted">${Math.round(file.size / 1024)} KB</span></div>`).join('')
        : 'No files selected.';
    });
  }

  if (name === 'save') {
    $('#exportSettings', win)?.addEventListener('click', exportConfig);
    $('#importSettings', win)?.addEventListener('change', importConfig);
  }
  if (name === 'settings') bindSettings(win);
  if (name === 'paint') initializePaintApp(win);
  if (name === 'cats') $('#moreCats', win)?.addEventListener('click', () => toast('You found all the tiny friends for now ♡'));
  $$('[data-open-url]', win).forEach(button => {
    button.addEventListener('click', () => {
      const url = normalizeWebAddress(button.dataset.openUrl);
      if (url) window.open(url, '_blank', 'noopener,noreferrer');
    });
  });
}

export function openApp(name) {
  const staticWindow = getWindow(name);
  if (staticWindow) {
    showWindow(name);
    return staticWindow;
  }
  if (!appTitles[name]) {
    toast('This little app is still being made ♡');
    return null;
  }
  const id = `app-${name}`;
  const existing = getWindow(id);
  if (existing) {
    showWindow(id);
    return existing;
  }
  const windowElement = document.createElement('section');
  windowElement.className = 'window';
  windowElement.dataset.window = id;
  const openCount = $('#scene > .window:not(.hidden)').length;
  const cascade = openCount % 6;
  windowElement.style.cssText = [
    `left:${Math.min(42, 7 + cascade * 4)}%`,
    `top:${Math.min(38, 6 + cascade * 4)}%`
  ].join(';');
  windowElement.innerHTML = `
    <div class="window-head" title="Arraste para mover · duplo clique para tela cheia">
      <span class="window-title">${appTitles[name]}</span>
      <div class="window-actions">
        <button data-min="${id}" aria-label="Minimizar" title="Minimizar"></button>
        <button data-max="${id}" aria-label="Maximizar" title="Maximizar"></button>
        <button data-close="${id}" aria-label="Fechar" title="Fechar"></button>
      </div>
    </div>
    <div class="window-body">${renderAppContent(name)}</div>`;
  const scene = $('#scene');
  if (!scene) {
    toast('The desktop workspace is unavailable.');
    return null;
  }
  scene.appendChild(windowElement);
  activateWindow(windowElement);
  bindApp(name, windowElement);
  return windowElement;
}
