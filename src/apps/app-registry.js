import { $, $$ } from '../core/dom.js';
import { toast } from '../core/notifications.js';
import { bindSettings, exportConfig, importConfig } from '../core/settings.js';
import { activateWindow, getWindow, showWindow } from '../managers/window-manager.js';
import { appTitles, renderAppContent, escapeHtml } from './app-templates.js';
import { initializePaintApp } from './paint-app.js';
import { initializeNotesApp } from './notes-manager.js';
import { initializeInternetApp } from './internet-manager.js';

function normalizeWebAddress(value) {
  const input = String(value || '').trim();
  if (!input) return '';

  const lowerInput = input.toLowerCase();
  const explicitHttp = lowerInput.startsWith('http://') || lowerInput.startsWith('https://');
  const hasWhitespace = [' ', '\t', '\n', '\r'].some(character => input.includes(character));
  const looksLikeDomain = input.includes('.') && !hasWhitespace;
  const candidate = explicitHttp ? input : (looksLikeDomain ? `https://${input}` : '');

  if (candidate) {
    try {
      const url = new URL(candidate);
      if (url.protocol === 'http:' || url.protocol === 'https:') return url.href;
    } catch (error) {
      // Treat malformed input as a web search below.
    }
  }

  return `https://www.google.com/search?q=${encodeURIComponent(input)}`;
}

function bindApp(name, win) {
  if (name === 'notes') initializeNotesApp(win);

  if (name === 'internet') initializeInternetApp(win);

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
  const openCount = $$('#scene > .window:not(.hidden)').length;
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
