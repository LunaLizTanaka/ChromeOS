import { $, $$ } from './dom.js';
import { storage, saveWallpaper, loadWallpaper, deleteWallpaper, downloadBlob } from './storage.js';
import { toast } from './notifications.js';

export const themes = {
  mint: { mint: '#bdebe5', pink: '#f5c5d9', butter: '#fff0b9', lilac: '#c9c4e9', rose: '#b56c89', wall: 'linear-gradient(180deg,#bdebe5 0%,#d7f1e8 45%,#fff0cf 100%)' },
  strawberry: { mint: '#d6eee8', pink: '#f5b8d1', butter: '#fff0c4', lilac: '#ded1ee', rose: '#b56c89', wall: 'linear-gradient(180deg,#f9dce7 0%,#f4dce9 52%,#fff0cf 100%)' },
  lavender: { mint: '#dce4f8', pink: '#eac8e8', butter: '#fff1c8', lilac: '#c9c4e9', rose: '#987cae', wall: 'linear-gradient(180deg,#d8d7f1 0%,#f0deef 55%,#fff0dc 100%)' },
  butter: { mint: '#d9eee0', pink: '#f8d2d2', butter: '#ffedb0', lilac: '#ddd6ec', rose: '#b27b88', wall: 'linear-gradient(180deg,#fff0bb 0%,#fce6d4 60%,#f8d9df 100%)' }
};

const defaults = { theme: 'mint', grid: true, bows: true, pixel: false, scale: 1, wallpaper: null };
export const state = { ...defaults };

function persistSettings() {
  const { theme, grid, bows, pixel, scale } = state;
  storage.setItem('gl-settings', JSON.stringify({ theme, grid, bows, pixel, scale }));
}

export function applyState({ persist = true } = {}) {
  const selectedTheme = themes[state.theme] || themes.mint;
  const root = document.documentElement;
  root.style.setProperty('--mint', selectedTheme.mint);
  root.style.setProperty('--pink', selectedTheme.pink);
  root.style.setProperty('--butter', selectedTheme.butter);
  root.style.setProperty('--lilac', selectedTheme.lilac);
  root.style.setProperty('--rose', selectedTheme.rose);
  root.style.setProperty('--wallpaper', selectedTheme.wall);
  root.style.setProperty('--workspace-wallpaper', state.wallpaper ? `url("${state.wallpaper.replace(/"/g, '%22')}")` : 'none');
  $('#workspace')?.classList.toggle('no-grid', !state.grid);
  document.body.classList.toggle('coquette-off', !state.bows);
  document.body.classList.toggle('pixel-soft', state.pixel);
  root.style.setProperty('--ui-scale', String(state.scale));
  if (persist) persistSettings();
}

export async function initializeSettings() {
  try {
    const saved = JSON.parse(storage.getItem('gl-settings') || 'null');
    if (saved && typeof saved === 'object') {
      if (themes[saved.theme]) state.theme = saved.theme;
      ['grid', 'bows', 'pixel'].forEach(key => {
        if (typeof saved[key] === 'boolean') state[key] = saved[key];
      });
      if (Number.isFinite(Number(saved.scale))) state.scale = Math.min(1.2, Math.max(0.8, Number(saved.scale)));
    }
  } catch (error) {
    console.warn('Galaxy Legacy: stored settings were ignored because they are invalid.', error);
  }
  applyState({ persist: false });
  try {
    state.wallpaper = await loadWallpaper();
    applyState({ persist: false });
  } catch (error) {
    console.info('Galaxy Legacy: custom wallpaper storage is unavailable in this context.', error);
  }
}

export function exportConfig() {
  const profile = {
    name: 'Galaxy Legacy profile',
    version: 1,
    settings: { theme: state.theme, grid: state.grid, bows: state.bows, pixel: state.pixel, scale: state.scale },
    notes: storage.getItem('gl-notes') || '',
    wallpaperIncluded: false
  };
  downloadBlob(JSON.stringify(profile, null, 2), 'galaxy-legacy-profile.json', 'application/json');
  toast('Profile exported ♡');
}

export function importConfig(event) {
  const file = event.target.files?.[0];
  if (!file) return;
  const reader = new FileReader();
  reader.onload = () => {
    try {
      const profile = JSON.parse(String(reader.result));
      const settings = profile.settings || profile;
      if (settings.theme && themes[settings.theme]) state.theme = settings.theme;
      ['grid', 'bows', 'pixel'].forEach(key => {
        if (typeof settings[key] === 'boolean') state[key] = settings[key];
      });
      if (Number.isFinite(Number(settings.scale)) && settings.scale !== '') state.scale = Math.min(1.2, Math.max(0.8, Number(settings.scale)));
      if (typeof profile.notes === 'string') storage.setItem('gl-notes', profile.notes);
      applyState();
      toast('Profile imported ♡');
    } catch (error) {
      toast('This profile file is not valid JSON.');
    } finally {
      event.target.value = '';
    }
  };
  reader.onerror = () => toast('Could not read this profile file.');
  reader.readAsText(file);
}

export function bindSettings(win) {
  $('#uiScale', win).value = String(state.scale);
  $('#gridToggle', win).checked = state.grid;
  $('#bowsToggle', win).checked = state.bows;
  $('#pixelToggle', win).checked = state.pixel;

  $$('[data-theme]', win).forEach(button => {
    button.addEventListener('click', () => {
      state.theme = button.dataset.theme;
      applyState();
    });
  });

  $('#uiScale', win).addEventListener('input', event => {
    state.scale = Number(event.target.value);
    document.documentElement.style.setProperty('--ui-scale', String(state.scale));
  });
  $('#gridToggle', win).addEventListener('change', event => { state.grid = event.target.checked; applyState(); });
  $('#bowsToggle', win).addEventListener('change', event => { state.bows = event.target.checked; applyState(); });
  $('#pixelToggle', win).addEventListener('change', event => { state.pixel = event.target.checked; applyState(); });

  $('#wallpaperFile', win).addEventListener('change', event => {
    const file = event.target.files?.[0];
    if (!file) return;
    if (!/^image\/(png|jpeg|webp)$/i.test(file.type)) {
      toast('Choose a PNG, JPEG or WebP image ♡');
      event.target.value = '';
      return;
    }
    if (file.size > 4 * 1024 * 1024) {
      toast('Choose an image smaller than 4 MB ♡');
      event.target.value = '';
      return;
    }
    const reader = new FileReader();
    reader.onload = async () => {
      try {
        state.wallpaper = String(reader.result);
        await saveWallpaper(state.wallpaper);
        applyState();
        toast('Wallpaper saved in this browser ♡');
      } catch (error) {
        state.wallpaper = null;
        applyState({ persist: false });
        toast('Browser storage could not save this wallpaper.');
        console.error(error);
      } finally {
        event.target.value = '';
      }
    };
    reader.onerror = () => toast('Could not read this image.');
    reader.readAsDataURL(file);
  });

  $('#saveSettings', win).addEventListener('click', () => { applyState(); toast('Your desktop look was saved ♡'); });
  $('#resetSettings', win).addEventListener('click', async () => {
    Object.assign(state, defaults);
    storage.removeItem('gl-settings');
    try { await deleteWallpaper(); } catch (error) { console.warn(error); }
    applyState();
    $('#uiScale', win).value = String(state.scale);
    $('#gridToggle', win).checked = state.grid;
    $('#bowsToggle', win).checked = state.bows;
    $('#pixelToggle', win).checked = state.pixel;
    toast('Desktop look restored ♡');
  });
  $('#savePreset', win).addEventListener('click', () => {
    storage.setItem(`gl-preset-${state.theme}`, JSON.stringify({ theme: state.theme, grid: state.grid, bows: state.bows, pixel: state.pixel, scale: state.scale }));
    toast('Preset saved in this browser ♡');
  });
  $('#exportProfile', win).addEventListener('click', exportConfig);
}
