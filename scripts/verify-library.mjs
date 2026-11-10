import assert from 'node:assert/strict';
import { LIBRARY_PLATFORMS, FEATURED_READING, buildOpenLibrarySearchUrl, buildOpenLibraryReaderUrl, isInternalLibraryUrl } from '../src/apps/library-manager.js';

const expected = ['archive','openlibrary','gutenberg','wikisource','ao3','novelupdates','wattpad','spirit','mangaplus','comikey','webtoon','viz','wuxiaworld','royalroad','scribblehub','ciweimao'];
assert.deepEqual(LIBRARY_PLATFORMS.map(item => item.id), expected, 'All requested reading platforms must remain present.');
for (const platform of LIBRARY_PLATFORMS) {
  assert.ok(platform.url.startsWith('https://'), platform.name + ' must use HTTPS.');
  assert.ok(['reader','try','external'].includes(platform.mode), platform.name + ' needs an explicit integration mode.');
  assert.ok(platform.description && platform.note, platform.name + ' needs a compatibility note.');
}
assert.equal(LIBRARY_PLATFORMS.find(item => item.id === 'wuxiaworld').mode, 'external',
  'Wuxiaworld remains external because its terms prohibit framing without written authorization.');
for (const id of ['spirit','mangaplus','comikey','webtoon','viz','ciweimao','ao3','novelupdates','wattpad','royalroad','scribblehub']) {
  assert.equal(LIBRARY_PLATFORMS.find(item => item.id === id).mode, 'try',
    id + ' should be available for an iframe compatibility attempt with official-site fallback.');
}
assert.equal(isInternalLibraryUrl('https://www.novelupdates.com/series/example/'), true);
assert.equal(isInternalLibraryUrl('https://mangaplus.shueisha.co.jp/titles/100012'), true);
assert.equal(isInternalLibraryUrl('https://archive.org/stream/sample-book?ui=embed'), true);
assert.equal(isInternalLibraryUrl('https://subdomain.royalroad.com/fiction/example'), true);
assert.equal(isInternalLibraryUrl('https://www.wuxiaworld.com/'), false);
assert.equal(isInternalLibraryUrl('https://example.com/'), false);
assert.equal(isInternalLibraryUrl('javascript:alert(1)'), false);
assert.equal(isInternalLibraryUrl('http://www.novelupdates.com/'), false);
assert.equal(buildOpenLibrarySearchUrl(''), '');
const search = new URL(buildOpenLibrarySearchUrl('Little Tyrant', 2));
assert.equal(search.origin, 'https://openlibrary.org');
assert.equal(search.pathname, '/search.json');
assert.equal(search.searchParams.get('q'), 'Little Tyrant');
assert.equal(search.searchParams.get('page'), '2');
assert.equal(search.searchParams.get('limit'), '18');
assert.ok(search.searchParams.get('fields').includes('ia'));
assert.equal(buildOpenLibraryReaderUrl(''), '');
assert.equal(buildOpenLibraryReaderUrl('sample-book_001'), 'https://archive.org/stream/sample-book_001?ui=embed');
assert.equal(buildOpenLibraryReaderUrl('a/b c'), 'https://archive.org/stream/a%2Fb%20c?ui=embed');
assert.equal(FEATURED_READING.length, 1);
assert.equal(FEATURED_READING[0].id, 'little-tyrant');
assert.equal(FEATURED_READING[0].url, 'https://www.novelupdates.com/series/little-tyrant-doesnt-want-to-meet-with-a-bad-end/');
console.log('Library checks OK: ' + LIBRARY_PLATFORMS.length + ' platforms, Open Library search/reader URLs, Little Tyrant bookmark, and policy-aware modes.');
