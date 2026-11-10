import assert from 'node:assert/strict';
import {
  NEOCITIES_BLOGS,
  buildArchiveSearchUrl,
  buildArchiveEmbedUrl,
  buildArchiveDetailsUrl
} from '../src/apps/internet-manager.js';

assert.equal(NEOCITIES_BLOGS.length, 4, 'The Neocities library must contain only the four selected blogs.');
assert.deepEqual(NEOCITIES_BLOGS.map(blog => blog.id), [
  'sweet-pea',
  'sakura-dreams',
  'pixel-safari',
  'rss-list'
]);
for (const blog of NEOCITIES_BLOGS) {
  assert.ok(blog.url.startsWith('https://'), 'Neocities blogs must use HTTPS.');
  assert.ok(new URL(blog.url).hostname.endsWith('.neocities.org'), 'Only Neocities domains belong in the blog library.');
  assert.ok(blog.description.length > 0);
}

assert.equal(buildArchiveSearchUrl('', 'all'), '');
assert.equal(buildArchiveEmbedUrl(''), '');
assert.equal(buildArchiveDetailsUrl(''), 'https://archive.org/');

const audioSearch = new URL(buildArchiveSearchUrl('Moonlight Sonata', 'audio', 2));
assert.equal(audioSearch.origin, 'https://archive.org');
assert.equal(audioSearch.pathname, '/advancedsearch.php');
assert.equal(audioSearch.searchParams.get('q'), '"Moonlight Sonata" AND mediatype:audio');
assert.equal(audioSearch.searchParams.get('output'), 'json');
assert.equal(audioSearch.searchParams.get('rows'), '12');
assert.equal(audioSearch.searchParams.get('page'), '2');
assert.deepEqual(audioSearch.searchParams.getAll('fl[]'), [
  'identifier', 'title', 'creator', 'year', 'mediatype'
]);

const allSearch = new URL(buildArchiveSearchUrl('Pride and Prejudice'));
assert.equal(allSearch.searchParams.get('q'), '"Pride and Prejudice"');
assert.equal(allSearch.searchParams.get('page'), '1');

const unknownTypeSearch = new URL(buildArchiveSearchUrl('classic cinema', 'unknown'));
assert.equal(unknownTypeSearch.searchParams.get('q'), '"classic cinema"');

const escapedSearch = new URL(buildArchiveSearchUrl('music "live"'));
assert.equal(escapedSearch.searchParams.get('q'), '"music \\"live\\""');

assert.equal(buildArchiveEmbedUrl('Night.Of.The.Living.Dead_1080p'),
  'https://archive.org/embed/Night.Of.The.Living.Dead_1080p');
assert.equal(buildArchiveEmbedUrl('a/b c'),
  'https://archive.org/embed/a%2Fb%20c');
assert.equal(buildArchiveDetailsUrl('prideprejudice00aust'),
  'https://archive.org/details/prideprejudice00aust');

console.log('Internet checks OK: Neocities whitelist, Archive.org search URLs, and item players.');
