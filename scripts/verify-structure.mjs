import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const read = relative => fs.readFileSync(path.join(root, relative), 'utf8');
const html = read('index.html');
const manifest = JSON.parse(read('manifest.webmanifest'));
const packageJson = JSON.parse(read('package.json'));

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
  'src/apps/paint-app.js'
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

console.log(`Structure OK: ${sourceFiles.length} JavaScript modules, ${manifest.icons.length} manifest icons, all imports resolved.`);
