import { startClock, toast } from './core/notifications.js';
import { initializeSettings } from './core/settings.js';
import { initializeWindowManager } from './managers/window-manager.js';
import { initializeEdgePanelManager } from './managers/edge-panel-manager.js';
import { initializeDesktopManager } from './managers/desktop-manager.js';
import { openApp } from './apps/app-registry.js';
import { initializeNotesSystem } from './apps/notes-manager.js';

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
    version: '0.7.0',
    openApp,
    getVersion() { return '0.7.0'; }
  };
}

async function initialize() {
  try {
    exposeDiagnostics();
    startClock();
    await initializeSettings();
    initializeNotesSystem();
    initializeWindowManager();
    initializeEdgePanelManager();
    initializeDesktopManager();
    document.documentElement.dataset.glReady = 'true';
  } catch (error) {
    console.error('Galaxy Legacy initialization failed:', error);
    toast('Galaxy Legacy could not start. Please reload the page.');
    document.documentElement.dataset.glReady = 'error';
  }
}

initialize();
