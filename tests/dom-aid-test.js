import test from 'ava';
import dom from '../src/dom-aid.js';

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
    width:  '200px',
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
    width:  '200px',
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
    width:  '200px',
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
    width:  '200px',
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

test('can find all elements for a given query selector', t => {
  const elements = [
    document.createElement('div'),
    document.createElement('div'),
    document.createElement('div')
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
  const element = document.createElement('div');
  element.id = 'test';

  dom.add(element);

  const found = document.querySelector('div#test');
  t.is(found, element);
});

test('can add an element to a defined parent element', t => {
  const parent = document.createElement('div');
  parent.id = 'testParent';
  document.body.appendChild(parent);

  const element = document.createElement('h1');
  const content = 'Test Title';
  element.innerHTML = content;
  dom.add(element, parent);

  const found = parent.querySelector('h1');
  t.is(found, element);
  t.is(found.innerHTML, content);
});

test('can prepend an element to a defined parent element', t => {
  const parent = document.createElement('div');
  parent.id = 'testParent';
  document.body.appendChild(parent);

  const element = document.createElement('h1');
  const content = 'Test Title';
  element.innerHTML = content;

  dom.prepend(element, parent);

  let found = parent.firstChild;
  t.is(found, element);

  const header = document.createElement('header');
  dom.prepend(header, parent);

  found = parent.firstChild;
  t.is(found.nodeName, 'HEADER');
});

test('can check if an element matches a given selector', t => {
  const element = document.createElement('div');
  element.id = 'test';

  let result = dom.matches(element, 'div#test');
  t.true(result);

  element.classList.add('foo');
  result = dom.matches(element, 'div#test.foo');
  t.true(result);
});

test('can find an element\'s parent node', t => {
  const parent = document.createElement('div');
  parent.id = 'testParent';
  document.body.appendChild(parent);

  const element = document.createElement('h1');
  const content = 'Test Title';
  element.innerHTML = content;
  parent.appendChild(element);

  const found = dom.parent(element);
  t.is(found, parent);
});

test('can find an element\'s parent node of a given selector', t => {
  const parent = document.createElement('div');
  parent.classList.add('test_parent');
  document.body.appendChild(parent);

  const element = document.createElement('h1');
  const content = 'Test Title';
  element.innerHTML = content;
  parent.appendChild(element);

  const found = dom.parent(element, '.test_parent');
  t.is(found, parent);
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
  const element = document.createElement('div');
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