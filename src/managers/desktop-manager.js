import { $ } from '../core/dom.js';
import { openApp } from '../apps/app-registry.js';
import { activateWindow, handleWindowControls } from './window-manager.js';

export function initializeDesktopManager() {
  const desktop = $('#desktop');
  const scene = $('#scene');
  if (!desktop || !scene) throw new Error('Galaxy Legacy desktop shell is missing.');

  document.addEventListener('click', event => {
    if (handleWindowControls(event)) return;
    const shortcut = event.target.closest('[data-app]');
    if (shortcut) {
      openApp(shortcut.dataset.app);
      desktop.classList.remove('topbar-open', 'sidebar-open', 'dock-open');
      if (typeof shortcut.blur === 'function') shortcut.blur();
      return;
    }
    const windowElement = event.target.closest('.window');
    if (windowElement && (windowElement.parentNode === scene || windowElement.parentNode === $('#fullscreenLayer'))) {
      activateWindow(windowElement);
    }
  });
}
