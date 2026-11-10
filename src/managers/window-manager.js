import { $, $$ } from '../core/dom.js';
import { toast } from '../core/notifications.js';

let zIndex = 30;
let dragState = null;
let elements = null;

export function getWindow(id) {
  return $$('[data-window]').find(element => element.dataset.window === String(id)) || null;
}

export function activateWindow(windowElement) {
  if (!windowElement) return;
  zIndex += 1;
  windowElement.style.zIndex = String(zIndex);
  $$('.window').forEach(element => element.classList.remove('active'));
  windowElement.classList.add('active');
}

function currentWindowTitle(windowElement) {
  const title = $('.window-title', windowElement);
  return title ? title.textContent.replace(/\s+/g, ' ').trim() : 'APPLICATION';
}

export function clampWindow(windowElement) {
  const { scene } = elements || {};
  if (!scene || !windowElement || windowElement.parentNode !== scene || windowElement.classList.contains('hidden')) return;
  const sceneRect = scene.getBoundingClientRect();
  const rect = windowElement.getBoundingClientRect();
  const maxX = Math.max(0, sceneRect.width - rect.width);
  const maxY = Math.max(0, sceneRect.height - rect.height);
  const rawLeft = rect.left - sceneRect.left;
  const rawTop = rect.top - sceneRect.top;
  const left = Math.max(0, Math.min(maxX, rawLeft));
  const top = Math.max(0, Math.min(maxY, rawTop));
  if (Math.abs(left - rawLeft) > 0.5) {
    windowElement.style.left = `${sceneRect.width ? left / sceneRect.width * 100 : 0}%`;
    windowElement.style.right = 'auto';
  }
  if (Math.abs(top - rawTop) > 0.5) windowElement.style.top = `${sceneRect.height ? top / sceneRect.height * 100 : 0}%`;
}

function commitWindowPosition(windowElement) {
  const { scene } = elements || {};
  if (!scene || !windowElement || windowElement.parentNode !== scene) return;
  const sceneRect = scene.getBoundingClientRect();
  const rect = windowElement.getBoundingClientRect();
  const left = Math.max(0, Math.min(Math.max(0, sceneRect.width - rect.width), rect.left - sceneRect.left));
  const top = Math.max(0, Math.min(Math.max(0, sceneRect.height - rect.height), rect.top - sceneRect.top));
  windowElement.style.left = `${sceneRect.width ? left / sceneRect.width * 100 : 0}%`;
  windowElement.style.top = `${sceneRect.height ? top / sceneRect.height * 100 : 0}%`;
  windowElement.style.right = 'auto';
}

export function clampAllWindows() {
  const { scene } = elements || {};
  if (scene) $$('.window', scene).forEach(clampWindow);
}

export function showWindow(id) {
  const windowElement = getWindow(id);
  if (!windowElement) { toast('This app is coming soon ♡'); return null; }
  if (windowElement.parentNode === elements.fullLayer) restoreFullscreen(windowElement);
  windowElement.classList.remove('hidden');
  activateWindow(windowElement);
  clampWindow(windowElement);
  return windowElement;
}

export function restoreFullscreen(windowElement) {
  const { fullLayer, scene, desktop } = elements || {};
  windowElement = windowElement || fullLayer?.querySelector('.fullscreen-window');
  if (!windowElement || windowElement.parentNode !== fullLayer) return null;
  const saved = windowElement._glRestore || {};
  $('.fullscreen-head', windowElement)?.remove();
  windowElement.classList.remove('fullscreen-window');
  windowElement.className = saved.className || windowElement.className.replace(/\s*fullscreen-window/g, '');
  if (saved.style === null || saved.style === undefined) windowElement.removeAttribute('style');
  else windowElement.setAttribute('style', saved.style);
  scene.appendChild(windowElement);
  desktop.classList.remove('is-fullscreen');
  windowElement._glRestore = null;
  activateWindow(windowElement);
  clampWindow(windowElement);
  return windowElement;
}

export function enterFullscreen(windowElement) {
  const { fullLayer, scene, desktop, closeTarget } = elements || {};
  if (!windowElement) return null;
  if (windowElement.parentNode === fullLayer) return restoreFullscreen(windowElement);
  if (windowElement.parentNode !== scene) return null;
  const rect = windowElement.getBoundingClientRect();
  const sceneRect = scene.getBoundingClientRect();
  windowElement._glRestore = {
    style: windowElement.getAttribute('style'),
    className: windowElement.className,
    left: rect.left - sceneRect.left,
    top: rect.top - sceneRect.top,
    width: rect.width,
    height: rect.height
  };
  const head = document.createElement('div');
  head.className = 'fullscreen-head';
  const back = document.createElement('button');
  back.type = 'button';
  back.className = 'full-back';
  back.dataset.restoreWindow = '';
  back.setAttribute('aria-label', 'Voltar ao desktop');
  back.title = 'Voltar ao desktop';
  back.textContent = '‹';
  const label = document.createElement('strong');
  label.textContent = currentWindowTitle(windowElement);
  const close = document.createElement('button');
  close.type = 'button';
  close.dataset.closeFullscreen = '';
  close.setAttribute('aria-label', 'Fechar aplicativo');
  close.title = 'Fechar';
  close.textContent = '×';
  head.append(back, label, close);
  windowElement.insertBefore(head, windowElement.firstChild);
  windowElement.classList.add('fullscreen-window');
  fullLayer.appendChild(windowElement);
  desktop.classList.add('is-fullscreen');
  closeTarget.classList.remove('visible', 'over');
  activateWindow(windowElement);
  return windowElement;
}

export function hideWindow(id) {
  const windowElement = getWindow(id);
  if (!windowElement) return;
  if (windowElement.parentNode === elements.fullLayer) restoreFullscreen(windowElement);
  windowElement.classList.add('hidden');
  windowElement.classList.remove('active');
}

export function closeWindow(windowElement) {
  if (!windowElement) return;
  if (windowElement.parentNode === elements.fullLayer) restoreFullscreen(windowElement);
  windowElement.classList.add('hidden');
  windowElement.classList.remove('active');
  toast('Window closed ♡');
}

function pointerPoint(event) { return { x: event.clientX, y: event.clientY }; }

function beginWindowDrag(event) {
  const head = event.target.closest?.('.window-head');
  if (!head || event.target.closest?.('.window-actions button') || dragState || event.isPrimary === false || (event.button !== undefined && event.button !== 0)) return;
  const windowElement = head.closest('.window');
  const { scene, desktop, closeTarget } = elements;
  if (!windowElement || windowElement.parentNode !== scene) return;
  event.preventDefault();
  activateWindow(windowElement);
  const rect = windowElement.getBoundingClientRect();
  const sceneRect = scene.getBoundingClientRect();
  const point = pointerPoint(event);
  dragState = { windowElement, head, pointerId: event.pointerId, startX: point.x, startY: point.y, left: rect.left - sceneRect.left, top: rect.top - sceneRect.top, moved: false };
  desktop.classList.add('is-window-dragging');
  desktop.classList.remove('topbar-open', 'sidebar-open', 'dock-open');
  windowElement.classList.add('dragging');
  closeTarget.classList.add('visible');
  try { scene.setPointerCapture(event.pointerId); } catch (error) { /* Pointer capture is optional. */ }
}

function moveWindowDrag(event) {
  if (!dragState || (event.pointerId !== undefined && event.pointerId !== dragState.pointerId)) return;
  const point = pointerPoint(event);
  const sceneRect = elements.scene.getBoundingClientRect();
  const windowElement = dragState.windowElement;
  const deltaX = point.x - dragState.startX;
  const deltaY = point.y - dragState.startY;
  if (Math.abs(deltaX) > 3 || Math.abs(deltaY) > 3) dragState.moved = true;
  const maxX = Math.max(0, sceneRect.width - windowElement.offsetWidth);
  const maxY = Math.max(0, sceneRect.height - windowElement.offsetHeight);
  const left = Math.max(0, Math.min(maxX, dragState.left + deltaX));
  const top = Math.max(0, Math.min(maxY, dragState.top + deltaY));
  windowElement.style.left = `${left}px`;
  windowElement.style.top = `${top}px`;
  windowElement.style.right = 'auto';
  const targetRect = elements.closeTarget.getBoundingClientRect();
  const rect = windowElement.getBoundingClientRect();
  const overTarget = rect.bottom > targetRect.top + 8 && rect.left < targetRect.right && rect.right > targetRect.left;
  elements.closeTarget.classList.toggle('over', overTarget);
  windowElement.classList.toggle('near-fullscreen', point.y <= sceneRect.top + 24);
}

function finishWindowDrag(event, cancelled = false) {
  if (!dragState) return;
  const current = dragState;
  const windowElement = current.windowElement;
  const point = event && typeof event.clientX === 'number' ? pointerPoint(event) : { x: current.startX, y: current.startY };
  const sceneRect = elements.scene.getBoundingClientRect();
  const targetRect = elements.closeTarget.getBoundingClientRect();
  const rect = windowElement.getBoundingClientRect();
  const closeHit = !cancelled && (elements.closeTarget.classList.contains('over') || (rect.bottom > targetRect.top + 8 && rect.left < targetRect.right && rect.right > targetRect.left));
  const movedToTop = !cancelled && current.moved && (point.y <= sceneRect.top + 18 || rect.top <= sceneRect.top + 3);
  dragState = null;
  elements.desktop.classList.remove('is-window-dragging');
  windowElement.classList.remove('dragging', 'near-fullscreen');
  elements.closeTarget.classList.remove('visible', 'over');
  try {
    if (elements.scene.hasPointerCapture(current.pointerId)) elements.scene.releasePointerCapture(current.pointerId);
  } catch (error) { /* Pointer capture may already have been released. */ }
  if (closeHit) closeWindow(windowElement);
  else {
    commitWindowPosition(windowElement);
    if (movedToTop) enterFullscreen(windowElement);
    else clampWindow(windowElement);
  }
}

export function handleWindowControls(event) {
  const close = event.target.closest('[data-close]');
  const minimize = event.target.closest('[data-min]');
  const maximize = event.target.closest('[data-max]');
  if (close) { closeWindow(getWindow(close.dataset.close)); return true; }
  if (minimize) { hideWindow(minimize.dataset.min); return true; }
  if (maximize) { enterFullscreen(getWindow(maximize.dataset.max)); return true; }
  if (event.target.closest('[data-restore-window]')) { restoreFullscreen(); return true; }
  if (event.target.closest('[data-close-fullscreen]')) {
    closeWindow(elements.fullLayer.querySelector('.fullscreen-window'));
    return true;
  }
  return false;
}

export function initializeWindowManager() {
  elements = { desktop: $('#desktop'), scene: $('#scene'), fullLayer: $('#fullscreenLayer'), closeTarget: $('#closeTarget') };
  const { desktop, scene } = elements;
  if (!desktop || !scene || !elements.fullLayer || !elements.closeTarget) throw new Error('Galaxy Legacy window manager could not find its required desktop elements.');
  scene.addEventListener('pointerdown', beginWindowDrag, true);
  document.addEventListener('pointermove', moveWindowDrag, { passive: false });
  document.addEventListener('pointerup', event => finishWindowDrag(event, false));
  document.addEventListener('pointercancel', event => finishWindowDrag(event, true));
  scene.addEventListener('dblclick', event => {
    const head = event.target.closest('.window-head');
    if (head && !event.target.closest('button')) enterFullscreen(head.closest('.window'));
  });
  const syncLayout = () => window.requestAnimationFrame(clampAllWindows);
  window.addEventListener('resize', syncLayout, { passive: true });
  window.addEventListener('orientationchange', () => window.setTimeout(syncLayout, 80), { passive: true });
  window.visualViewport?.addEventListener('resize', syncLayout, { passive: true });
  if ('ResizeObserver' in window) {
    const observer = new ResizeObserver(syncLayout);
    observer.observe(desktop);
    observer.observe(scene);
  }
  document.addEventListener('keydown', event => {
    if (event.key === 'Escape' && desktop.classList.contains('is-fullscreen')) restoreFullscreen();
  });
}
