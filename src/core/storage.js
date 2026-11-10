const memoryStore = new Map();

function createStorage() {
  try {
    const native = window.localStorage;
    const probe = '__galaxy_legacy_storage_probe__';
    native.setItem(probe, '1');
    native.removeItem(probe);
    return native;
  } catch (error) {
    return {
      getItem: key => memoryStore.has(key) ? memoryStore.get(key) : null,
      setItem: (key, value) => memoryStore.set(key, String(value)),
      removeItem: key => memoryStore.delete(key),
      clear: () => memoryStore.clear()
    };
  }
}

export const storage = createStorage();

function openDatabase() {
  return new Promise((resolve, reject) => {
    if (!('indexedDB' in window)) {
      reject(new Error('IndexedDB is not available in this browser context.'));
      return;
    }
    const request = window.indexedDB.open('galaxy-legacy-desktop', 1);
    request.onupgradeneeded = () => {
      if (!request.result.objectStoreNames.contains('assets')) request.result.createObjectStore('assets');
    };
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error || new Error('Could not open the local asset database.'));
    request.onblocked = () => reject(new Error('The local asset database is blocked by another tab.'));
  });
}

function runAssetTransaction(mode, action) {
  return openDatabase().then(db => new Promise((resolve, reject) => {
    let settled = false;
    const finish = (callback, value) => {
      if (settled) return;
      settled = true;
      db.close();
      callback(value);
    };
    let transaction;
    try {
      transaction = db.transaction('assets', mode);
      action(transaction.objectStore('assets'), transaction, finish);
    } catch (error) {
      finish(reject, error);
      return;
    }
    transaction.oncomplete = () => finish(resolve, undefined);
    transaction.onerror = () => finish(reject, transaction.error || new Error('Asset transaction failed.'));
    transaction.onabort = () => finish(reject, transaction.error || new Error('Asset transaction was aborted.'));
  }));
}

export function saveWallpaper(dataUrl) {
  return runAssetTransaction('readwrite', store => store.put(dataUrl, 'wallpaper'));
}

export function loadWallpaper() {
  return openDatabase().then(db => new Promise((resolve, reject) => {
    const transaction = db.transaction('assets', 'readonly');
    const request = transaction.objectStore('assets').get('wallpaper');
    request.onsuccess = () => {
      const value = request.result || null;
      db.close();
      resolve(value);
    };
    request.onerror = () => {
      const error = request.error || new Error('Could not read the saved wallpaper.');
      db.close();
      reject(error);
    };
    transaction.onabort = () => {
      db.close();
      reject(transaction.error || new Error('Wallpaper read was aborted.'));
    };
  }));
}

export function deleteWallpaper() {
  return runAssetTransaction('readwrite', store => store.delete('wallpaper'));
}

export function downloadBlob(content, filename, mimeType = 'text/plain') {
  const blob = content instanceof Blob ? content : new Blob([content], { type: mimeType });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  link.hidden = true;
  document.body.appendChild(link);
  link.click();
  link.remove();
  window.setTimeout(() => URL.revokeObjectURL(url), 1500);
}
