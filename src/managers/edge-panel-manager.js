import { $ } from '../core/dom.js';

export function initializeEdgePanelManager() {
  const desktop = $('#desktop');
  const topbar = $('.topbar');
  const sidebar = $('.sidebar');
  const dock = $('.dock');
  if (!desktop || !topbar || !sidebar || !dock) return;

  const EDGE_SIZE = 44;
  const KEEP_GAP = 14;

  function ensureHotspot(className, geometry) {
    let zone = desktop.querySelector(`.${className}`);
    if (!zone) {
      zone = document.createElement('div');
      zone.className = `edge-hotspot ${className}`;
      zone.setAttribute('aria-hidden', 'true');
      desktop.appendChild(zone);
    }
    Object.assign(zone.style, {
      position: 'absolute',
      display: 'block',
      zIndex: '140',
      background: 'transparent',
      pointerEvents: 'auto',
      touchAction: 'manipulation',
      ...geometry
    });
    return zone;
  }

  const zones = {
    topbar: ensureHotspot('edge-hotspot-top', { top: '0', left: '0', right: '0', height: `${EDGE_SIZE}px` }),
    sidebar: ensureHotspot('edge-hotspot-left', { top: '0', left: '0', bottom: '0', width: `${EDGE_SIZE}px` }),
    dock: ensureHotspot('edge-hotspot-bottom', { left: '0', right: '0', bottom: '0', height: `${EDGE_SIZE}px` })
  };

  function syncHotspots() {
    zones.topbar.style.pointerEvents = desktop.classList.contains('topbar-open') ? 'none' : 'auto';
    zones.sidebar.style.pointerEvents = desktop.classList.contains('sidebar-open') ? 'none' : 'auto';
    zones.dock.style.pointerEvents = desktop.classList.contains('dock-open') ? 'none' : 'auto';
    if (desktop.classList.contains('is-window-dragging') || desktop.classList.contains('is-fullscreen')) {
      Object.values(zones).forEach(zone => { zone.style.pointerEvents = 'none'; });
    }
  }

  function collapsed() {
    desktop.classList.remove('topbar-open', 'sidebar-open', 'dock-open');
    syncHotspots();
  }

  function isBusy() {
    return desktop.classList.contains('is-window-dragging') || desktop.classList.contains('is-fullscreen');
  }

  function reveal(panel) {
    if (isBusy()) return;
    desktop.classList.add(`${panel}-open`);
    syncHotspots();
  }

  function updateFromPointer(event) {
    if (!event || event.pointerType === 'touch' || isBusy()) return;
    const rect = desktop.getBoundingClientRect();
    const x = event.clientX;
    const y = event.clientY;

    const topOpen = y <= rect.top + EDGE_SIZE || (
      desktop.classList.contains('topbar-open') && y <= rect.top + topbar.offsetHeight + KEEP_GAP
    );
    const sideOpen = x <= rect.left + EDGE_SIZE || (
      desktop.classList.contains('sidebar-open') && x <= rect.left + sidebar.offsetWidth + KEEP_GAP
    );
    const dockOpen = y >= rect.bottom - EDGE_SIZE || (
      desktop.classList.contains('dock-open') && y >= rect.bottom - dock.offsetHeight - KEEP_GAP
    );

    desktop.classList.toggle('topbar-open', topOpen);
    desktop.classList.toggle('sidebar-open', sideOpen);
    desktop.classList.toggle('dock-open', dockOpen);
    syncHotspots();
  }

  // Explicit transparent hit zones sit on top of the hidden bars and reliably receive hover.
  // As soon as a bar opens, its zone becomes click-through so the bar buttons are usable.
  const bindings = [
    [zones.topbar, 'topbar'],
    [zones.sidebar, 'sidebar'],
    [zones.dock, 'dock']
  ];
  for (const [zone, panel] of bindings) {
    zone.addEventListener('pointerenter', event => {
      if (event.pointerType !== 'touch') reveal(panel);
    });
    zone.addEventListener('pointerdown', event => {
      if (event.pointerType === 'touch') reveal(panel);
    });
  }

  document.addEventListener('pointermove', updateFromPointer, { passive: true, capture: true });
  // Compatibility fallback for environments reporting mousemove without Pointer Events.
  document.addEventListener('mousemove', event => updateFromPointer({
    clientX: event.clientX,
    clientY: event.clientY,
    pointerType: 'mouse'
  }), { passive: true, capture: true });

  document.addEventListener('pointerdown', event => {
    if (event.pointerType !== 'touch' || isBusy()) return;
    const rect = desktop.getBoundingClientRect();
    if (event.clientY <= rect.top + EDGE_SIZE) reveal('topbar');
    else if (event.clientX <= rect.left + EDGE_SIZE) reveal('sidebar');
    else if (event.clientY >= rect.bottom - EDGE_SIZE) reveal('dock');
    else if (!event.target.closest('.topbar,.sidebar,.dock')) collapsed();
  }, true);

  window.addEventListener('blur', collapsed);
  document.addEventListener('keydown', event => {
    if (event.key === 'Escape' && !desktop.classList.contains('is-fullscreen')) collapsed();
  });

  syncHotspots();
}
