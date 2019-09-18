import test from 'ava';
import dom from '../src/dom-aid.js';

test('Imported DOM Aid is an object', t => {
  t.is(typeof dom, 'object');
});
