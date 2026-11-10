import { startClock, toast } from './core/notifications.js';
import { initializeSettings } from './core/settings.js';
import { initializeWindowManager } from './managers/window-manager.js';
import { initializeEdgePanelManager } from './managers/edge-panel-manager.js';
import { initializeDesktopManager } from './managers/desktop-manager.js';
import { openApp } from './apps/app-registry.js';
import { initializePaintApp } from './apps/paint-app.js';

function exposeDiagnostics() {
  const desktop = document.querySelector('#desktop');
  window.GalaxyLegacyViewport = {
    mode: 'fluid-inset',
    getBounds() {
      const rect = desktop.getBoundingClientRect();
      return { width: Math.round(rect.width), height: Math.round(rect.height) };
    }
  };
  window.GalaxyLegacy = {
    version: '0.3.0',
    openApp,
    getVersion() { return '0.3.0'; }
  };
}

async function initialize() {
  try {
    exposeDiagnostics();
    startClock();
    await initializeSettings();
    initializeWindowManager();
    initializeEdgePanelManager();
    initializeDesktopManager();
    initializePaintApp();
    document.documentElement.dataset.glReady = 'true';
  } catch (error) {
    console.error('Galaxy Legacy initialization failed:', error);
    toast('Galaxy Legacy could not start. Please reload the page.');
    document.documentElement.dataset.glReady = 'error';
  }
}

initialize();
