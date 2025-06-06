/*
 * AVA test file dom-aid.js module.
 */

// Set up global objects for browser emulation:
import { JSDOM } from 'jsdom';
const jsDOM = new JSDOM();

jsDOM.reconfigure({ windowTop: 100 });
const { window } = jsDOM;
const { document } = window;

import test from 'ava';
import dom from '../src/dom-aid.js';
dom.setEnvironment(window); // set window object for tests.

// Helper function to create a new HTML Element.
function tag(type, id) {
  const t = document.createElement(type);
  id && (t.id = id);
  return t;
}

// class to create custom element with a shadow DOM.
class TestShadowElement extends window.HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
  }

  connectedCallback() {
    this.shadowRoot.innerHTML = `
      <div class="wrapper">
        <p>Test content</p>
      </div>
    `;
  }
}

window.customElements.define('test-element', TestShadowElement);

test('Imported DOMaid is an object', t => {
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

test('can check that passed values is NOT an HTML element', t => {
  let result = dom.isElement();
  t.false(result, 'Undefined is not an Element node');

  let test = 'foo';
  result = dom.isElement(test);
  t.false(result, 'String is not an Element node');

  test = 10;
  result = dom.isElement(test);
  t.false(result, 'Number is not an Element node');

  test = document.createTextNode('test');
  result = dom.isElement(test);
  t.false(result, 'Text node is not an Element node');
});

test('can check passed value is an HTML element', t => {
  let el = tag('div');
  let result = dom.isElement(el);
  t.true(result);

  el = tag('p');
  result = dom.isElement(el);
  t.true(result);
});

test('can convert a string of HTML into an Element', t => {
  const s = '<p id="testContent">test content</p>';
  const result = dom.stringToNodes(s);

  t.true(Array === (result).constructor);
  t.is(result.length, 1);

  const el = result[0];
  t.is(el.nodeName, 'P', 'Expected element of wrong type');
  t.is(el.textContent, 'test content', 'Unexpected text content');
});

test('can convert a string of HTML into multiple Elements', t => {
  const s = '<p id="p1">test content</p><p id="p2">test 2 content</p>';
  const result = dom.stringToNodes(s);

  t.true(Array === (result).constructor);
  t.is(result.length, 2);

  let el = result[0];
  t.is(el.nodeName, 'P', 'Expected element of wrong type');
  t.is(el.textContent, 'test content', 'Unexpected text content');
  el = result[1];
  t.is(el.nodeName, 'P', 'Expected element of wrong type');
  t.is(el.textContent, 'test 2 content', 'Unexpected text content');
});

test('can convert a string of nested HTML into multiple Elements', t => {
  const s = '<p id="p1">test <span>content</span></p><p id="p2">test 2 <a>content</a></p>';
  const result = dom.stringToNodes(s);

  t.true(Array === (result).constructor);
  t.is(result.length, 2);

  // first parent element:
  let el = result[0];
  t.is(el.nodeName, 'P', 'Expected element of wrong type');
  t.is(el.textContent, 'test content', 'Unexpected text content');

  // … and its child element:
  el = el.querySelector('span');
  t.is(el.nodeName, 'SPAN', 'Expected element of wrong type');

  // second parent element:
  el = result[1];
  t.is(el.nodeName, 'P', 'Expected element of wrong type');

  // … and its child element:
  el = el.querySelector('a');
  t.is(el.nodeName, 'A', 'Expected element of wrong type');
});

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

test('can remove multiple class names as a String from a modern browser element', t => {
  const element = tag('div');

  dom.modern = true;
  dom.addClass('foo bar', element);
  t.true(element.classList.contains('foo'));
  t.true(element.classList.contains('bar'));

  dom.removeClass('foo bar', element);
  t.false(element.classList.contains('foo'));
  t.false(element.classList.contains('bar'));
});

test('can remove multiple class names as an Array from a modern browser element', t => {
  const element = tag('div');

  dom.modern = true;
  dom.addClass('foo bar', element);
  t.true(element.classList.contains('foo'));
  t.true(element.classList.contains('bar'));

  dom.removeClass(['foo', 'bar'], element);
  t.false(element.classList.contains('foo'));
  t.false(element.classList.contains('bar'));
});

test('can remove multiple class names from a legacy browser element', t => {
  const element = tag('div');

  dom.modern = false;
  dom.addClass('foo bar', element);
  t.true(element.classList.contains('foo'));

  dom.removeClass('foo bar', element);
  t.false(element.classList.contains('foo'));
  t.false(element.classList.contains('bar'));
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
    width: '200px',
    height: '100px',
    backgroundColor: 'blue'
  };

  dom.setStyle(styles, element);

  t.is(element.style.width, styles.width);
  t.is(element.style.height, styles.height);
  t.is(element.style.backgroundColor, styles.backgroundColor);
});

test('can remove single style rule as a string from an element', t => {
  const element = tag('div');
  const styles = {
    backgroundColor: 'blue'
  };

  dom.setStyle(styles, element);
  t.is(element.style.backgroundColor, styles.backgroundColor);

  dom.removeStyle('backgroundColor', element);
  t.not(element.style.backgroundColor, styles.backgroundColor);
});

test('can remove multiple style rules as a string from an element', t => {
  const element = tag('div');
  const styles = {
    width: '100px',
    backgroundColor: 'blue'
  };

  dom.setStyle(styles, element);
  t.is(element.style.width, styles.width);
  t.is(element.style.backgroundColor, styles.backgroundColor);

  dom.removeStyle('backgroundColor width', element);
  t.not(element.style.width, styles.width);
  t.not(element.style.backgroundColor, styles.backgroundColor);
});

test('can remove a collection object of styles rules from an element', t => {
  const element = tag('div');
  const styles = {
    width: '200px',
    height: '100px',
    backgroundColor: 'blue'
  };

  dom.setStyle(styles, element);

  t.is(element.style.width, styles.width);
  t.is(element.style.height, styles.height);
  t.is(element.style.backgroundColor, styles.backgroundColor);

  dom.removeStyle(styles, element);

  t.not(element.style.width, styles.width);
  t.not(element.style.height, styles.height);
  t.not(element.style.backgroundColor, styles.backgroundColor);
});

test('can remove a collection array of styles rules from an element', t => {
  const element = tag('div');
  const styles = {
    width: '200px',
    height: '100px',
    backgroundColor: 'blue'
  };

  dom.setStyle(styles, element);

  t.is(element.style.width, styles.width);
  t.is(element.style.height, styles.height);
  t.is(element.style.backgroundColor, styles.backgroundColor);

  const toRemove = ['width', 'backgroundColor'];
  dom.removeStyle(toRemove, element);

  t.not(element.style.width, styles.width);
  t.is(element.style.height, styles.height);
  t.not(element.style.backgroundColor, styles.backgroundColor);
});

test('can remove styles from a custom element shadowRoot', t => {
  const element = tag('div');
  element.mockSR = true;

  const styles = {
    width: '200px',
    height: '100px',
    backgroundColor: 'blue'
  };

  dom.setStyle(styles, element);
  t.is(element.style.width, styles.width);
  t.is(element.style.height, styles.height);
  t.is(element.style.backgroundColor, styles.backgroundColor);

  dom.removeStyle(styles, element);
  t.not(element.style.width, styles.width);
  t.not(element.style.height, styles.height);
  t.not(element.style.backgroundColor, styles.backgroundColor);
});

test('can set a collection of attributes on an element', t => {
  const element = tag('div');
  const attrs = {
    id: 'foo',
    style: 'position: absolute; top: 10px; left: 20px;',
    'data-test': 'bar'
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

test('can find all elements for a given query selector', t => {
  dom.empty(); // clear body Element of HTML.

  const elements = [
    tag('div'),
    tag('div'),
    tag('div')
  ];

  elements.forEach(item => {
    item.classList.add('test');
    document.body.appendChild(item);
  });

  const result = dom.find('.test');
  t.true(Array === (result).constructor);
  t.is(result.length, 3);
  t.is(result[0], elements[0]);
});

test('can add an element to the DOM body element', t => {
  dom.empty(); // clear body Element of HTML.

  const element = tag('div', 'test');
  dom.add(element);

  const found = document.querySelector('div#test');
  t.is(found, element);
});

test('can add an element to a ShadowRoot', t => {
  const parent = tag('div');
  parent.attachShadow({ mode: "open" });

  const element = tag('div', 'test');
  dom.add(element, parent.shadowRoot);

  const found = parent.shadowRoot.querySelector('div#test');
  t.is(found, element);
  t.is(found.id, 'test');
});

test('can add multiple elements to a ShadowRoot', t => {
  const parent = tag('div');
  parent.attachShadow({ mode: "open" });

  const mix = [
    tag('h1'),
    '<p></p>',
    tag('div')
  ];

  dom.add(mix, parent.shadowRoot);

  const nodes = parent.shadowRoot.childNodes;
  t.is(nodes.item(0), mix[0]);
  t.is(nodes.item(1).nodeName, 'P');
  t.is(nodes.item(2), mix[2]);
});

test('can not add an empty string as an element', t => {
  dom.empty(); // clear body Element of HTML.

  dom.add('  ');

  const nodes = dom.body.childNodes;
  t.is(nodes.length, 0);
  t.is(dom.body.innerHTML, '', 'Unexpected HTML in the body element');
});

test('can add an plain Text node to the DOM body', t => {
  dom.empty(); // clear body Element of HTML.

  const txt = 'test content';
  dom.add(txt);

  const nodes = dom.body.childNodes;
  t.is(nodes.length, 1);

  const node = nodes.item(0);
  t.is(node.nodeType, document.body.TEXT_NODE);
  t.is(dom.body.textContent, txt, 'Unexpected text in the body element');
});

test('can add an an HTML string as an element to the DOM body element', t => {
  dom.empty(); // clear body Element of HTML.

  const html = '<div id="test2"></div>';
  dom.add(html);

  const found = document.querySelector('div#test2');

  t.is(typeof found, 'object');
  t.is(found.nodeName, 'DIV', 'Added node is expected type');
  t.true('test2' === found.id, 'Added element has expected ID');
});

test('can add an element to a defined parent element', t => {
  const parent = tag('div', 'testParent');

  const element = tag('h1');
  const content = 'Test Title';
  element.textContent = content;
  dom.add(element, parent);

  const found = parent.querySelector('h1');
  t.is(found, element);
  t.is(found.textContent, content);
});

test('can add multiple elements to the DOM body element', t => {
  dom.empty(); // clear body Element of HTML.

  const elements = [
    tag('div', 'test1'),
    tag('div', 'test2'),
    tag('div', 'test3'),
  ];

  dom.add(elements); // add array of Elements to DOM.

  // find first element:
  let found = document.querySelector('div#test1');
  t.is(typeof found, 'object');
  t.is(found.nodeName, 'DIV');
  t.true('test1' === found.id);

  // find second element:
  found = document.querySelector('div#test2');
  t.is(typeof found, 'object');
  t.is(found.nodeName, 'DIV');
  t.true('test2' === found.id);

  // find third element:
  found = document.querySelector('div#test3');
  t.is(typeof found, 'object');
  t.is(found.nodeName, 'DIV');
  t.true('test3' === found.id);
});

test('can add multiple HTML strings to the DOM body element', t => {
  dom.empty(); // clear body Element of HTML.

  const html = [
    '<div id="test3"></div>',
    '<div id="test4"></div>',
    '<div id="test5"></div>'
  ];
  dom.add(html); // add array of HTML strings to DOM.

  // find first element:
  let found = document.querySelector('div#test3');
  t.is(typeof found, 'object');
  t.is(found.nodeName, 'DIV');
  t.is('test3', found.id);

  // find second element:
  found = document.querySelector('div#test4');
  t.is(typeof found, 'object');
  t.is(found.nodeName, 'DIV');
  t.is('test4', found.id);

  // find third element:
  found = document.querySelector('div#test5');
  t.is(typeof found, 'object');
  t.is(found.nodeName, 'DIV');
  t.true('test5' === found.id);
});

test('can add a mix of HTML strings and Elements into body element', t => {
  dom.empty(); // clear body Element of HTML.

  const el1 = tag('h1', 'test1');
  el1.textContent = 'heading';
  const el4 = tag('p', 'test4');
  el4.textContent = 'paragraph 2';

  const mix = [
    el1,
    '<div id="test2"><a>anchor</a></div><p>paragraph 1</p>',
    el4
  ];

  dom.add(mix);

  const nodes = dom.body.childNodes;
  t.is(nodes.length, 4);

  // check all 4 expected Elements, in order:
  let node = nodes.item(0);
  t.is(node.nodeName, 'H1');
  t.is(node.textContent, el1.textContent);

  node = nodes.item(1);
  t.is(node.nodeName, 'DIV');
  t.is(node.id, 'test2');

  // check expected child element of previous node:
  node = node.firstChild;
  t.is(node.nodeName, 'A');
  t.is(node.textContent, 'anchor');

  node = nodes.item(2);
  t.is(node.nodeName, 'P');
  t.is(node.textContent, 'paragraph 1');

  node = nodes.item(3);
  t.is(node.nodeName, 'P');
  t.is(node.textContent, el4.textContent);
});

test('can add a mix of Elements and HTML strings in a parent Element', t => {
  const parent = tag('div', 'test1');

  const h1 = tag('h1');
  h1.textContent = 'heading';

  const mix = [
    h1,
    '<p>paragraph</p>',
    '<figure><img src=""></figure>'
  ];

  dom.add(mix, parent);

  const nodes = parent.childNodes;
  t.is(nodes.length, mix.length);

  // check all 3 expected Elements, in order:
  let node = nodes.item(0);
  t.is(node, h1);
  t.is(node.textContent, h1.textContent);

  node = nodes.item(1);
  t.is(node.nodeName, 'P');
  t.is(node.textContent, 'paragraph');

  node = nodes.item(2);
  t.is(node.nodeName, 'FIGURE');
  t.is(node.firstChild.nodeName, 'IMG');
});

test('can prepend an element to a defined parent element', t => {
  const parent = tag('div', 'testParent');

  const element = tag('h1');
  const content = 'Test Title';
  element.textContent = content;

  dom.prepend(element, parent);

  let found = parent.firstChild;
  t.is(found, element);

  const header = tag('header');
  dom.prepend(header, parent);

  found = parent.firstChild;
  t.is(found.nodeName, 'HEADER');
});

test('can prepend HTML string to BODY Element', t => {
  dom.empty(); // clear body Element of HTML.

  const id = 'prependTest';
  const test = `<div id="${id}"></div>`;
  dom.prepend(test);

  const found = document.querySelector('#' + id);
  t.is(found.nodeName, 'DIV', 'Added node is expected type');
  t.true(id === found.id, 'Added element has expected ID');
});

test('can prepend HTML string to defined parent Element', t => {
  const parent = tag('div', 'testParent');

  const id = 'prependTest2';
  const test = `<p id="${id}"></p>`;
  dom.prepend(test, parent);

  const found = parent.firstChild;
  t.is(found.nodeName, 'P', 'Added node is expected type');
  t.true(id === found.id, 'Added element has expected ID');
});

test('can not prepend a empty HTML string to a parent element', t => {
  const parent = tag('div');
  dom.prepend('   ', parent);

  const nodes = parent.childNodes;
  t.is(nodes.length, 0);

  t.is(parent.innerHTML, '');
  t.is(parent.textContent, '');
});

test('can prepend an element to a ShadowRoot', t => {
  const parent = tag('div');
  parent.attachShadow({ mode: "open" });

  const element = tag('div', 'test');
  dom.prepend(element, parent.shadowRoot);

  const found = parent.shadowRoot.firstChild;
  t.is(found, element);
  t.is(found.id, 'test');
});

test('can prepend an HTML string to a ShadowRoot', t => {
  const parent = tag('div');
  parent.attachShadow({ mode: "open" });

  const html = '<p id="test">paragraph</p>';
  dom.prepend(html, parent.shadowRoot);

  const found = parent.shadowRoot.firstChild;
  t.is(found.nodeName, 'P');
  t.is(found.id, 'test');
});

test('can check if an element matches a given selector', t => {
  const element = tag('div', 'test');

  let result = dom.matches(element, 'div#test');
  t.true(result);

  element.classList.add('foo');
  result = dom.matches(element, 'div#test.foo');
  t.true(result);
});

test('can find an element\'s parent node', t => {
  const parent = tag('div', 'testParent');
  document.body.appendChild(parent);

  const element = tag('h1');
  const content = 'Test Title';
  element.textContent = content;
  parent.appendChild(element);

  const found = dom.parent(element);
  t.is(found, parent);
});

test('can find an element\'s parent node of a given selector', t => {
  const parent = tag('div');
  parent.classList.add('test_parent');
  document.body.appendChild(parent);

  const element = tag('h1');
  const content = 'Test Title';
  element.textContent = content;
  parent.appendChild(element);

  const found = dom.parent(element, '.test_parent');
  t.is(found, parent);
});

test('can find an element\'s direct parent from within shadowDOM', t => {
  // first, let's create a custom element for this test.
  const testElement = new TestShadowElement();
  document.body.appendChild(testElement);

  const w = testElement.shadowRoot.querySelector('.wrapper');
  const found = dom.parent(w);

  t.is(found, testElement);
});

test('can find an element\'s parent with selector from within shadowDOM', t => {
  // first, let's create a custom element for this test.
  const testElement = new TestShadowElement();
  document.body.appendChild(testElement);

  const id = 'outsideShadow';
  const parent = tag('div', id);
  parent.appendChild(testElement);
  document.body.appendChild(parent);

  const p = testElement.shadowRoot.querySelector('p');
  const found = dom.parent(p, `#${id}`);

  t.is(found, parent);
  t.true(found.id === 'outsideShadow');
});

test('can return null when an element\'s parent node does not exist for a given selector', t => {
  const parent = tag('div');
  parent.classList.add('test_parent');
  document.body.appendChild(parent);

  const element = tag('h1');
  const content = 'Test Title';
  element.textContent = content;
  parent.appendChild(element);

  const found = dom.parent(element, '.not_test_parent');
  t.is(found, null);
});

test('can return the dimensions of the viewport', t => {
  const dims = dom.dims();

  t.is(typeof dims, 'object');
  t.is(typeof dims.top, 'number');
  t.is(dims.top, 0);

  t.is(typeof dims.bottom, 'number');
  t.true(dims.bottom > 0);

  t.is(typeof dims.width, 'number');
  t.true(dims.width > 0);

  t.is(typeof dims.height, 'number');
  t.true(dims.height > 0);
});

test('can return the dimensions of an element', t => {
  const element = tag('div');
  document.body.appendChild(element);
  element.style.cssText = 'width: 100px; height: 50px;';

  const dims = dom.dims(element);
  t.is(typeof dims, 'object');

  t.is(typeof dims.width, 'number');
  t.is(typeof dims.height, 'number');
});

test('has customEvents property, initially set to null', t => {
  t.is(dom.customEvents, null);
});

test('can trigger a custom event on the body element with data', t => {
  const body = document.body;
  const eventName = 'test.foo';

  const handler = e => {
    t.is(typeof e.detail, 'function');
    t.is(typeof e.detail(eventName).foo, 'string');
    t.is(e.detail(eventName).foo, 'bar');
  };

  body.addEventListener(eventName, handler, { once: true });
  dom.trigger(eventName, body, { foo: 'bar' });
});

test('can trigger the same custom event but with new data', t => {
  const body = document.body;
  const eventName = 'test.foo';

  const handler = e => {
    t.is(typeof e.detail, 'function');
    t.is(typeof e.detail(e.type).bar, 'string');
    t.is(e.detail(e.type).bar, 'foo');
  };

  body.addEventListener(eventName, handler, { once: true });
  dom.trigger(eventName, body, { bar: 'foo' });
});

test('now has custom event registered', t => {
  t.is(typeof dom.customEvents, 'object');
  t.is(typeof dom.customEvents['test.foo'], 'object');
  t.true(dom.customEvents['test.foo'].target instanceof window.HTMLBodyElement);
});

test('can trigger a custom event without data', t => {
  const body = document.body;
  const eventName = 'test.value';

  const handler = e => {
    // without event data we expect event.detail still be a function:
    t.is(typeof e.detail, 'function');

    // …but return no data:
    t.is(e.detail(e.type), undefined);

    // check that our custom event is registered:
    t.is(typeof dom.customEvents, 'object');
    t.is(typeof dom.customEvents['test.value'], 'object');
    t.true(dom.customEvents['test.value'].target instanceof window.HTMLBodyElement);
  };

  body.addEventListener(eventName, handler, { once: true });
  dom.trigger(eventName, body);
});

test('can now add data to a previous custom event', t => {
  const body = document.body;
  const eventName = 'test.value';
  const eventData = { value: 'foo' };

  const handler = e => {
    // this time we expect detail to return an object:
    t.is(typeof e.detail, 'function');
    const data = e.detail(e.type);
    t.is(typeof data, 'object');

    // check returned object is equal to our test eventData:
    t.deepEqual(data, eventData);
    t.is(typeof data.value, 'string');
    t.is(data.value, eventData.value);
  };

  body.addEventListener(eventName, handler, { once: true });
  dom.trigger(eventName, body, eventData);
});

test('can trigger custom event that includes a function as its data', t => {
  const body = document.body;
  const eventName = 'test.function';
  const testFunc = () => 'function value';

  const handler = e => {
    // this time we expect detail to return the value from our test function:
    const data = e.detail(e.type);
    t.is(typeof data, 'string');
    t.is(data, 'function value');
  };

  body.addEventListener(eventName, handler, { once: true });
  dom.trigger(eventName, body, testFunc);
});
