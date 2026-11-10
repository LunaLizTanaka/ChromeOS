import assert from 'node:assert/strict';
import { LIBRARY_PLATFORMS, FEATURED_READING, buildOpenLibrarySearchUrl, buildOpenLibraryReaderUrl } from '../src/apps/library-manager.js';

const expected = ['archive','openlibrary','gutenberg','wikisource','ao3','novelupdates','wattpad','spirit','mangaplus','comikey','webtoon','viz','wuxiaworld','royalroad','scribblehub','ciweimao'];
assert.deepEqual(LIBRARY_PLATFORMS.map(item => item.id), expected, 'All requested reading platforms must remain present.');
for (const platform of LIBRARY_PLATFORMS) {
  assert.ok(platform.url.startsWith('https://'), platform.name + ' must use HTTPS.');
  assert.ok(['reader','try','external'].includes(platform.mode), platform.name + ' needs an explicit integration mode.');
  assert.ok(platform.description && platform.note, platform.name + ' needs a compatibility note.');
}
for (const id of ['wuxiaworld','comikey','webtoon','spirit','mangaplus','viz','ciweimao']) {
  assert.equal(LIBRARY_PLATFORMS.find(item => item.id === id).mode, 'external', id + ' must use official external access.');
}
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
