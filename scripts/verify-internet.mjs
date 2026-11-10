import assert from 'node:assert/strict';
import {
  buildEmbeddableUrl,
  getTumblrBlogName,
  normalizeWebAddress
} from '../src/apps/internet-manager.js';

assert.equal(normalizeWebAddress(''), '');
assert.equal(normalizeWebAddress('neocities.org/browse'), 'https://neocities.org/browse');
assert.equal(normalizeWebAddress('flores kawaii'), 'https://www.google.com/search?q=flores%20kawaii');
assert.equal(normalizeWebAddress('javascript:alert(1)'), 'https://www.google.com/search?q=javascript%3Aalert(1)');

assert.equal(getTumblrBlogName('https://your-blog.tumblr.com/'), 'your-blog');
assert.equal(getTumblrBlogName('https://www.tumblr.com/'), '');
assert.equal(getTumblrBlogName('https://your-blog.tumblr.com/post/123'), '');
assert.equal(getTumblrBlogName('https://invalid_name.tumblr.com/'), '');

const cases = [
  ['https://www.youtube.com/watch?v=video123&t=45', 'https://www.youtube.com/embed/video123'],
  ['https://youtu.be/video123?t=45', 'https://www.youtube.com/embed/video123'],
  ['https://www.youtube.com/shorts/video123', 'https://www.youtube.com/embed/video123'],
  ['https://archive.org/details/birdbookillustra00reedrich', 'https://archive.org/embed/birdbookillustra00reedrich'],
  ['https://open.spotify.com/track/track123?si=share-code', 'https://open.spotify.com/embed/track/track123'],
  ['https://open.spotify.com/playlist/list123', 'https://open.spotify.com/embed/playlist/list123'],
  ['https://codepen.io/lunaliz/pen/demo123', 'https://codepen.io/lunaliz/embed/demo123?default-tab=result']
];

for (const [source, expected] of cases) {
  assert.equal(buildEmbeddableUrl(source), expected, 'Embed conversion failed for ' + source);
}

const form = new URL(buildEmbeddableUrl('https://docs.google.com/forms/d/e/example/viewform?usp=sf_link'));
assert.equal(form.searchParams.get('embedded'), 'true');

assert.equal(
  buildEmbeddableUrl('https://sweet-pea.neocities.org/'),
  'https://sweet-pea.neocities.org/'
);

console.log('Internet checks OK: address normalization and supported embed URL conversions.');
