# DOMaid

DOMaid provides helper functions to perform simple and regularly used HTML DOM actions supporting both modern and some legacy browsers.

## Usage

```javascript
import dom from './path-to/dom-aid.js';
```

## What can it do?

DOMaid provides a collection of methods to find, examine, modify and insert HTML elements in the DOM. Plus, trigger custom events on an element, easily.

### Find elements

```javascript
// returns an array of found HTML Elements which match the specified selector:
const found = dom.find('.foo');

// returns an array of found HTML Elements from within specified parent HTML Element:
const found = dom.find('.foo', parent);

// returns direct parent element of the supplied HTML Element:
const parent = dom.parent(element);

// returns element's parent (ancestor) node which matches specified selector:
const parent = dom.parent(element, '#parent-id');
```

### Examine elements

```javascript
// whether an HTML Element has the class name specified (returns a boolean):
const result = dom.hasClass('foo', element);

// whether an HTML Element has an attribute set, returns attribute value or false:
const result = dom.hasAttr('data-foo', element);

// check whether HTML Element matches the specified selector:
const result = dom.matches(element, 'div#foo');

// get the browser view-port dimensions:
const dims = dom.dims();

// get dimensions of the supplied HTML Element:
const dims = dom.dims(element);

// check if HTML document matches a specific media query:
const result = dom.media('(min-width: 640px)');
```

### Modify elements

```javascript
// Adds classname(s) to an HTML Element:
dom.addClass('foo bar', element);

// toggle HTML Element's classname:
dom.toggleClass('foo', element);

// remove an HTML Element's classname(s):
dom.removeClass('foo', element);
dom.removeClass('foo bar', element);
dom.removeClass(['foo', 'bar'], element);

// hide or show an element:
dom.hide(element);
dom.show(element);

// hide or show multiple HTML Elements with an array:
dom.hide([element1, element2]);
dom.show([element1, element2]);

// set CSS rules on an HTML Element:
const rules = { width: '100px', height: '50px', backgroundColor: 'blue' };
dom.setStyle(rules, element);

// remove same rules object on an HTML Element:
dom.removeStyle(rules, element);

// remove CSS rules passed as a string or an array:
dom.removeStyle('width height', element);
dom.removeStyle(['width', 'height'], element);

// set attributes on an HTML Element:
const attrs = {
  id:           'foo',
  style:        'position: absolute; top: 10px; left: 20px;',
  'data-test':  'bar'
};

dom.setAttrs(attrs, element);

// empty an HTML Element of its children:
dom.empty(element);
dom.empty(); // clears <body> element.
```

### Inserting elements into the DOM

```javascript
// add HTML Element to page body:
const element = document.createElement('div');
dom.add(element);

// add HTML Element to specified parent HTML Element:
dom.add(element, parent);

// add multiple HTML Elements, via an Array, to page body or parent Element:
const element1 = document.createElement('div');
const element2 = document.createElement('p');
dom.add([element1, element2]);
dom.add([element1, element2], parent);

// add prepared HTML string to page body or parent Element:
const html = '<p class="new-content">New content…</p>';
dom.add(html);
dom.add(html, parent);

// add plain text to a parent element (as Text node):
dom.add('My prepared content.', parent);

// add a mix of Elements and prepared HTML strings:
dom.add([element1, html, element2]);
dom.add([element1, html, element2], parent);

// prepend HTML Element to page body, or specified parent:
dom.prepend(element);
dom.prepend(element, parent);

// prepend prepared HTML string to page body, or specified parent:
const html = '<p class="new-content">New content…</p>';
dom.prepend(html);
dom.prepend(html, parent);
```

### Trigger a custom event on an element

```javascript
const element = document.createElement('div');
dom.trigger('custom.event', element);

// pass data when triggering a custom event:
const data = { foo: 'bar' };
dom.trigger('custom.event', element, data);

// to capture the data passed to a triggered event:
element.addEventListener('custom.event', (e) => {
  // e.detail is a function.
  console.log(e.detail && e.detail().foo);
});
