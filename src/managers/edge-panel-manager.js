import { $ } from '../core/dom.js';

export function initializeEdgePanelManager() {
  const desktop = $('#desktop');
  const topbar = $('.topbar');
  const sidebar = $('.sidebar');
  const dock = $('.dock');
  if (!desktop || !topbar || !sidebar || !dock) return;

  function updateFromPointer(event) {
    if (!event || event.pointerType === 'touch' || desktop.classList.contains('is-window-dragging') || desktop.classList.contains('is-fullscreen')) return;
    const rect = desktop.getBoundingClientRect();
    const x = event.clientX;
    const y = event.clientY;
    const topOpen = y <= rect.top + 18 || (desktop.classList.contains('topbar-open') && y <= rect.top + topbar.offsetHeight + 3);
    const sideOpen = x <= rect.left + 18 || (desktop.classList.contains('sidebar-open') && x <= rect.left + sidebar.offsetWidth + 3);
    const dockOpen = y >= rect.bottom - 18 || (desktop.classList.contains('dock-open') && y >= rect.bottom - dock.offsetHeight - 3);
    desktop.classList.toggle('topbar-open', topOpen);
    desktop.classList.toggle('sidebar-open', sideOpen);
    desktop.classList.toggle('dock-open', dockOpen);
  }

  document.addEventListener('pointermove', updateFromPointer, { passive: true });
  document.addEventListener('pointerdown', event => {
    if (event.pointerType !== 'touch' || desktop.classList.contains('is-fullscreen')) return;
    const rect = desktop.getBoundingClientRect();
    if (event.clientY <= rect.top + 18) desktop.classList.toggle('topbar-open');
    else if (event.clientX <= rect.left + 18) desktop.classList.toggle('sidebar-open');
    else if (event.clientY >= rect.bottom - 18) desktop.classList.toggle('dock-open');
    else if (!event.target.closest('.topbar,.sidebar,.dock')) desktop.classList.remove('topbar-open', 'sidebar-open', 'dock-open');
  });
}
