import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const read = relative => fs.readFileSync(path.join(root, relative), 'utf8');
const html = read('index.html');
const manifest = JSON.parse(read('manifest.webmanifest'));
const packageJson = JSON.parse(read('package.json'));

const appRegistry = read('src/apps/app-registry.js');
const edgePanelManager = read('src/managers/edge-panel-manager.js');
const paintApp = read('src/apps/paint-app.js');
const internetTemplate = read('src/apps/app-templates.js');
const internetManager = read('src/apps/internet-manager.js');
const libraryManager = read('src/apps/library-manager.js');
const libraryStyles = read('styles/library.css');
const internetStyles = read('styles/internet.css');
const windowManager = read('src/managers/window-manager.js');
const resizeStyles = read('styles/window-resize.css');
if (!paintApp.includes("$$('[data-color]', root).forEach") || !paintApp.includes("$$('[data-tool]', root).forEach")) {
  throw new Error('Picatsso lists of color swatches and tools must use multi-element selectors.');
}
if (!edgePanelManager.includes("const pointerWithinSidebar = desktop.classList.contains('sidebar-open')")) {
  throw new Error('Opening the dock must not cover the sidebar actions.');
}
if (!appRegistry.includes("const openCount = $$('#scene > .window:not(.hidden)').length;")) {
  throw new Error('App window count must use the multi-element selector so the first application can open.');
}

const requiredInternetIds = [
  'internetTabBlogs', 'internetTabArchive', 'neocitiesPanel', 'archivePanel',
  'neocitiesCatalog', 'archiveSearchForm', 'archiveSearchInput', 'archiveMediaType',
  'archiveResults', 'archiveViewer', 'archiveFrameHost'
];
for (const id of requiredInternetIds) {
  if (!internetTemplate.includes('id="' + id + '"')) {
    throw new Error('Internet v0.6.0 is missing required UI element #' + id + '.');
  }
}
for (const retiredControl of ['internetForm', 'webAddress', 'tumblrBlogInput', 'openTumblrBlog', 'data-internet-url', 'goWeb']) {
  if (internetTemplate.includes(retiredControl)) {
    throw new Error('Internet v0.6.0 must not expose the retired general-browser control: ' + retiredControl);
  }
}
if (!internetManager.includes('https://archive.org/advancedsearch.php') ||
    !internetManager.includes('https://archive.org/embed/')) {
  throw new Error('Internet Archive search and embedded item viewer must remain connected to Archive.org.');
}
if (!internetStyles.includes('.archive-results-grid') || !internetStyles.includes('.internet-blog-grid')) {
  throw new Error('Internet v0.6.0 styles are incomplete.');
}
if (!appRegistry.includes("initializeLibraryApp(win)") || !appRegistry.includes("name === 'library'")) {
  throw new Error('The Library app must be registered.');
}
if (!internetTemplate.includes('data-library-tab="sites"') || !internetTemplate.includes('id="libraryPlatforms"') || !internetTemplate.includes('id="libraryShelfList"')) {
  throw new Error('The Library template is missing its platform catalog or local shelf.');
}

if (!internetTemplate.includes('class="internet-hero-banner"') ||
    !internetTemplate.includes('id="archiveSearchForm"') ||
    !internetTemplate.includes('id="archiveNeocitiesShortcuts"') ||
    !internetTemplate.includes('data-archive-type="texts"')) {
  throw new Error('Internet v0.9.0 must show its banner, Archive search, Neocities favorites and media shortcuts.');
}
if (!internetManager.includes("win.querySelectorAll('[data-blog-id]')") ||
    !internetManager.includes("win.querySelectorAll('[data-archive-type]')") ||
    !internetManager.includes("setSection('archive')")) {
  throw new Error('Internet shortcuts must open Neocities and media shortcuts must preselect Archive filters.');
}
for (const removed of ["id:'novelupdates'","id:'mangaplus'","id:'comikey'","id:'webtoon'","id:'viz'","FEATURED_READING"]) {
  if (libraryManager.includes(removed)) throw new Error('Excluded novel/manga provider remains: ' + removed);
}
if (internetTemplate.includes('library-featured') || internetTemplate.includes('value="manga"')) {
  throw new Error('Library must not show the removed novel card or manga filters.');
}
if (!libraryManager.includes('https://openlibrary.org/search.json') || !libraryManager.includes('https://archive.org/stream/') || !libraryManager.includes('gl-library-v1')) {
  throw new Error('The Library must retain Open Library search, BookReader links and local shelf storage.');
}
if (!internetTemplate.includes('id="libraryReaderAddressForm"') ||
    !internetTemplate.includes('id="libraryBrowserBack"') ||
    !internetTemplate.includes('id="libraryBrowserForward"') ||
    !internetTemplate.includes('id="libraryBrowserReload"')) {
  throw new Error('The Library must expose internal navigation controls.');
}
if (!libraryManager.includes('isInternalLibraryUrl') ||
    !libraryManager.includes('readerHistory') ||
    !libraryManager.includes('ABRIR NA BIBLIOTECA')) {
  throw new Error('The Library must validate internal addresses and keep its own navigation history.');
}
if (!libraryStyles.includes('.library-platform-grid') || !libraryStyles.includes('.library-reader-frame')) {
  throw new Error('Library styles are incomplete.');
}
if (!html.includes('./styles/library.css') || !html.includes('data-app="library"')) {
  throw new Error('index.html must expose the Library app and load its stylesheet.');
}
if (!windowManager.includes('beginWindowResize') || !windowManager.includes('moveWindowResize') || !windowManager.includes('finishWindowResize') ||
    !appRegistry.includes('data-window-resize="se"') || !resizeStyles.includes('.window-resize-handle.resize-se')) {
  throw new Error('Resizable windows must expose pointer-driven resize handles and matching styles.');
}
if (!html.includes('./styles/window-resize.css')) {
  throw new Error('index.html must load the resizable-window stylesheet.');
}
if (!windowManager.includes("desktop.style.cursor = resizeState.direction + '-resize'") ||
    !windowManager.includes('Math.min(160,') || !windowManager.includes('Math.min(112,')) {
  throw new Error('Window resizing must use a valid directional cursor and support compact window sizes.');
}
if (packageJson.version !== '0.9.0' || manifest.version !== '0.9.0' || !html.includes('v0.9.0')) {
  throw new Error('Project package, manifest and page title must match version 0.6.0.');
}

if (!/<script\s+type=["']module["']\s+src=["']\.\/src\/main\.js["']\s*>/i.test(html)) {
  throw new Error('index.html must load src/main.js as a native ES module.');
}
if (/<script\s*>/i.test(html) || /<style\s*>/i.test(html)) {
  throw new Error('Application script and stylesheet must stay external to keep module boundaries explicit.');
}
if (packageJson.type !== 'module') throw new Error('package.json must declare type=module.');

const sourceFiles = [
  'src/main.js',
  'src/core/dom.js',
  'src/core/notifications.js',
  'src/core/settings.js',
  'src/core/storage.js',
  'src/managers/desktop-manager.js',
  'src/managers/edge-panel-manager.js',
  'src/managers/window-manager.js',
  'src/apps/app-registry.js',
  'src/apps/app-templates.js',
  'src/apps/notes-manager.js',
  'src/apps/paint-app.js',
  'src/apps/internet-manager.js',
  'src/apps/library-manager.js'
];
const missing = [];
for (const file of sourceFiles) {
  const source = read(file);
  const imports = source.matchAll(/from\s+["']([^"']+)["']/g);
  for (const match of imports) {
    if (!match[1].startsWith('.')) continue;
    const target = path.resolve(path.dirname(path.join(root, file)), match[1]);
    if (!fs.existsSync(target)) missing.push(`${file} -> ${match[1]}`);
  }
}
if (missing.length) throw new Error(`Missing module imports:\n${missing.join('\n')}`);

for (const asset of manifest.icons.map(icon => icon.src)) {
  if (!fs.existsSync(path.join(root, asset))) throw new Error(`Manifest icon not found: ${asset}`);
}
if (!fs.existsSync(path.join(root, 'styles/main.css'))) throw new Error('Missing styles/main.css');
if (!fs.existsSync(path.join(root, 'styles/notes.css'))) throw new Error('Missing styles/notes.css');
if (!fs.existsSync(path.join(root, 'styles/internet.css'))) throw new Error('Missing styles/internet.css');
if (!fs.existsSync(path.join(root, 'styles/library.css'))) throw new Error('Missing styles/library.css');
if (!fs.existsSync(path.join(root, 'styles/window-resize.css'))) throw new Error('Missing styles/window-resize.css');
if (!html.includes('id="stickyLayer"')) throw new Error('index.html must include the sticky desktop layer.');

console.log(`Structure OK: ${sourceFiles.length} JavaScript modules, ${manifest.icons.length} manifest icons, all imports resolved.`);
