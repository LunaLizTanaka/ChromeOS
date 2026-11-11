import assert from 'node:assert/strict';
import {
  NEOCITIES_BLOGS,
  BROWSER_SEARCH_ENGINES,
  normalizeBrowserUrl,
  resolveBrowserInput,
  buildArchiveSearchUrl,
  buildArchiveEmbedUrl,
  buildArchiveDetailsUrl
} from '../src/apps/internet-manager.js';

assert.equal(NEOCITIES_BLOGS.length, 4, 'The Neocities library must contain only the four selected blogs.');
assert.deepEqual(NEOCITIES_BLOGS.map(blog => blog.id), [
  'sweet-pea', 'sakura-dreams', 'pixel-safari', 'rss-list'
]);
for (const blog of NEOCITIES_BLOGS) {
  assert.ok(blog.url.startsWith('https://'), 'Neocities blogs must use HTTPS.');
  assert.ok(new URL(blog.url).hostname.endsWith('.neocities.org'), 'Only Neocities domains belong in the blog library.');
  assert.ok(blog.description.length > 0);
}

assert.deepEqual(Object.keys(BROWSER_SEARCH_ENGINES), ['google', 'bing', 'duckduckgo']);
assert.equal(normalizeBrowserUrl(''), '');
assert.equal(normalizeBrowserUrl('example.com/path'), 'https://example.com/path');
assert.equal(normalizeBrowserUrl('https://example.com/a?b=1'), 'https://example.com/a?b=1');
assert.equal(normalizeBrowserUrl('javascript:alert(1)'), '');

const directHttps = resolveBrowserInput('https://example.org/chapter/4');
assert.equal(directHttps.kind, 'url');
assert.equal(directHttps.url, 'https://example.org/chapter/4');

const bareDomain = resolveBrowserInput('www.example.org/path');
assert.equal(bareDomain.kind, 'url');
assert.equal(bareDomain.url, 'https://www.example.org/path');

const httpAddress = resolveBrowserInput('http://example.org');
assert.equal(httpAddress.kind, 'url');
assert.equal(httpAddress.url, 'http://example.org/');

const googleSearch = resolveBrowserInput('pixel art tutorials');
assert.equal(googleSearch.kind, 'search');
assert.equal(new URL(googleSearch.url).origin, 'https://www.google.com');
assert.equal(new URL(googleSearch.url).searchParams.get('q'), 'pixel art tutorials');

const bingSearch = resolveBrowserInput('cute website layouts', 'bing');
assert.equal(new URL(bingSearch.url).origin, 'https://www.bing.com');
assert.equal(new URL(bingSearch.url).searchParams.get('q'), 'cute website layouts');

const duckSearch = resolveBrowserInput('neocities personal sites', 'duckduckgo');
assert.equal(new URL(duckSearch.url).origin, 'https://duckduckgo.com');
assert.equal(new URL(duckSearch.url).searchParams.get('q'), 'neocities personal sites');

assert.equal(resolveBrowserInput('').kind, 'empty');
assert.equal(resolveBrowserInput('javascript:alert(1)').kind, 'blocked');
assert.equal(resolveBrowserInput('data:text/html,hello').kind, 'blocked');
assert.equal(resolveBrowserInput('file:///etc/passwd').kind, 'blocked');
assert.equal(resolveBrowserInput('ftp://example.org').kind, 'blocked');
assert.equal(resolveBrowserInput('https://').kind, 'blocked');

assert.equal(buildArchiveSearchUrl('', 'all'), '');
assert.equal(buildArchiveEmbedUrl(''), '');
assert.equal(buildArchiveDetailsUrl(''), 'https://archive.org/');

const audioSearch = new URL(buildArchiveSearchUrl('Moonlight Sonata', 'audio', 2));
assert.equal(audioSearch.origin, 'https://archive.org');
assert.equal(audioSearch.pathname, '/advancedsearch.php');
assert.equal(audioSearch.searchParams.get('q'), '(Moonlight Sonata) AND mediatype:audio');
assert.equal(audioSearch.searchParams.get('output'), 'json');
assert.equal(audioSearch.searchParams.get('rows'), '18');
assert.equal(audioSearch.searchParams.get('page'), '2');
assert.deepEqual(audioSearch.searchParams.getAll('fl[]'), [
  'identifier', 'title', 'creator', 'date', 'year', 'mediatype', 'subject'
]);

const allSearch = new URL(buildArchiveSearchUrl('Pride and Prejudice'));
assert.equal(allSearch.searchParams.get('q'), 'Pride and Prejudice');
assert.equal(allSearch.searchParams.get('page'), '1');

const unknownTypeSearch = new URL(buildArchiveSearchUrl('classic cinema', 'unknown'));
assert.equal(unknownTypeSearch.searchParams.get('q'), 'classic cinema');

const escapedSearch = new URL(buildArchiveSearchUrl('music "live"'));
const escapedTerm = 'music ' + '\\' + '"live' + '\\' + '"';
assert.equal(escapedSearch.searchParams.get('q'), escapedTerm);

const broadSubjectSearch = new URL(buildArchiveSearchUrl('Studio Ghibli'));
assert.equal(broadSubjectSearch.searchParams.get('q'), 'Studio Ghibli');

assert.equal(buildArchiveEmbedUrl('Night.Of.The.Living.Dead_1080p'),
  'https://archive.org/embed/Night.Of.The.Living.Dead_1080p');
assert.equal(buildArchiveEmbedUrl('a/b c'),
  'https://archive.org/embed/a%2Fb%20c');
assert.equal(buildArchiveDetailsUrl('prideprejudice00aust'),
  'https://archive.org/details/prideprejudice00aust');

console.log('Internet checks OK: browser URL/search routing, safe schemes, tabs/search engines and preserved Archive/Neocities functions.');
