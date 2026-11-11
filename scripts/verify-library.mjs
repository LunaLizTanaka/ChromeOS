import assert from 'node:assert/strict';
import { LIBRARY_PLATFORMS, buildOpenLibrarySearchUrl, buildOpenLibraryReaderUrl, isInternalLibraryUrl } from '../src/apps/library-manager.js';

const expected = ['archive','openlibrary','gutenberg','wikisource','ao3','wattpad','spirit','wuxiaworld','royalroad','scribblehub','ciweimao'];
assert.deepEqual(LIBRARY_PLATFORMS.map(item => item.id), expected, 'Library should keep books, novels and fanfiction only.');
for (const platform of LIBRARY_PLATFORMS) {
  assert.ok(platform.url.startsWith('https://'), platform.name + ' must use HTTPS.');
  assert.ok(['reader','try','external'].includes(platform.mode), platform.name + ' needs an explicit integration mode.');
  assert.ok(platform.description && platform.note, platform.name + ' needs a compatibility note.');
}
assert.equal(LIBRARY_PLATFORMS.some(item => item.id === 'novelupdates'), false);
assert.equal(LIBRARY_PLATFORMS.some(item => item.category === 'manga'), false);
assert.equal(LIBRARY_PLATFORMS.find(item => item.id === 'wuxiaworld').mode, 'external');
for (const id of ['ao3','wattpad','spirit','royalroad','scribblehub','ciweimao']) {
  assert.equal(LIBRARY_PLATFORMS.find(item => item.id === id).mode, 'try', id + ' should allow an internal iframe attempt with official fallback.');
}
assert.equal(isInternalLibraryUrl('https://archive.org/stream/sample-book?ui=embed'), true);
assert.equal(isInternalLibraryUrl('https://subdomain.royalroad.com/fiction/example'), true);
assert.equal(isInternalLibraryUrl('https://www.novelupdates.com/series/example/'), false);
assert.equal(isInternalLibraryUrl('https://mangaplus.shueisha.co.jp/titles/100012'), false);
assert.equal(isInternalLibraryUrl('https://example.com/'), false);
assert.equal(isInternalLibraryUrl('javascript:alert(1)'), false);
assert.equal(isInternalLibraryUrl('http://www.royalroad.com/'), false);
assert.equal(buildOpenLibrarySearchUrl(''), '');
const search = new URL(buildOpenLibrarySearchUrl('classic literature', 2));
assert.equal(search.origin, 'https://openlibrary.org');
assert.equal(search.pathname, '/search.json');
assert.equal(search.searchParams.get('q'), 'classic literature');
assert.equal(search.searchParams.get('page'), '2');
assert.equal(search.searchParams.get('limit'), '18');
assert.ok(search.searchParams.get('fields').includes('ia'));
assert.equal(buildOpenLibraryReaderUrl(''), '');
assert.equal(buildOpenLibraryReaderUrl('sample-book_001'), 'https://archive.org/stream/sample-book_001?ui=embed');
assert.equal(buildOpenLibraryReaderUrl('a/b c'), 'https://archive.org/stream/a%2Fb%20c?ui=embed');
console.log('Library checks OK: ' + LIBRARY_PLATFORMS.length + ' book, novel and fanfiction platforms; Novel Updates and manga links removed.');
