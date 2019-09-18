import test from 'ava';
import dom from '../src/dom-aid.js';

test('Imported DOM Aid is an object', t => {
  t.is(typeof dom, 'object');
});

test('includes a reference to the document <html> element', t => {
  t.is(typeof dom.html, 'object');
  t.is(dom.html.nodeName, 'HTML');
});

test('includes a reference to the document <body> element', t => {
  t.is(typeof dom.body, 'object');
  t.is(dom.body.nodeName, 'BODY');
});

function tag(type) {
  return document.createElement(type);
}

test('can check if modern browser element has a classname', t => {
  const element = tag('div');
  element.classList.add('test', 'foo');

  t.true(dom.hasClass('test', element));
});

test('can check if legacy browser element has a classname', t => {
  const element = tag('div');
  element.classList.add('test', 'foo');

  dom.modern = false;

  t.true(dom.hasClass('test', element));
  
});

test('can add a classname to a modern browser element', t => {
  const element = tag('div');

  dom.modern = true;
  dom.addClass('foo bar', element);

  t.true(element.classList.contains('foo'));
  t.true(element.classList.contains('bar'));
});

test('can add a classname to a legacy browser element', t => {
  const element = tag('div');

  dom.modern = false;
  dom.addClass('foo bar', element);

  t.true(element.classList.contains('foo'));
  t.true(element.classList.contains('bar'));
});

test('can toggle the class of a modern browser element', t => {
  const element = tag('div');

  dom.modern = true;
  dom.addClass('foo bar', element);
  dom.toggleClass('foo', element);

  t.false(element.classList.contains('foo'));

  dom.toggleClass('foo', element);
  t.true(element.classList.contains('foo'));
});

test('can remove a class from a modern browser element', t => {
  const element = tag('div');

  dom.modern = true;
  dom.addClass('foo bar', element);
  t.true(element.classList.contains('foo'));

  dom.removeClass('foo', element);
  t.false(element.classList.contains('foo'));
});

test('can remove a class from a legacy browser element', t => {
  const element = tag('div');

  dom.modern = false;
  dom.addClass('foo bar', element);
  t.true(element.classList.contains('foo'));

  dom.removeClass('foo', element);
  t.false(element.classList.contains('foo'));
  dom.modern = true;
});

test('can hide an element from view', t => {
  const element = tag('div');

  dom.hide(element);
  t.is(element.style.display, 'none');
});

test('can hide multiple element from view', t => {
  const elements = [
    tag('div'),
    tag('span')
  ];

  dom.hide(elements);
  t.is(elements[0].style.display, 'none');
  t.is(elements[1].style.display, 'none');
});

test('can show a hidden element', t => {
  const element = tag('div');

  element.style.display = 'none';
  t.is(element.style.display, 'none');

  dom.show(element);
  t.is(element.style.display, '');
});

test('can show multiple hidden elements', t => {
  const elements = [
    tag('div'),
    tag('span')
  ];

  dom.hide(elements);
  t.is(elements[0].style.display, 'none');
  t.is(elements[1].style.display, 'none');

  dom.show(elements);
  t.is(elements[0].style.display, '');
  t.is(elements[1].style.display, '');
});

test('can set a collection of styles rules on an element', t => {
  const element = tag('div');
  const styles = {
    width:  '200px',
    height: '100px',
    backgroundColor: 'blue'
  };

  dom.setStyle(styles, element);

  t.is(element.style.width, styles.width);
  t.is(element.style.height, styles.height);
  t.is(element.style.backgroundColor, styles.backgroundColor);
});

test('can set a colelction of attributes on an element', t => {
  const element = tag('div');
  const attrs = {
    id:           'foo',
    style:        'position: absolute; top: 10px; left: 20px;',
    'data-test':  'bar'
  };

  dom.setAttrs(attrs, element);

  t.is(element.getAttribute('id'), attrs.id);
  t.is(element.getAttribute('style'), attrs.style);
  t.is(element.getAttribute('data-test'), attrs['data-test']);
});

test('can check that an element has an attribute set', t => {
  const element = tag('div');
  t.false(dom.hasAttr('id', element));
  
  element.setAttribute('id', 'bar');
  t.is(dom.hasAttr('id', element), 'bar');
});

test('can check if an element is a certain tag', t => {
  const element = tag('div');

  t.false(dom.is(element, 'p'));
  t.true(dom.is(element, 'DIV'));
});