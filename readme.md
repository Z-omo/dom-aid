# DOMaid

While jQuery provides a comprehensive set of tools to modify elements within the DOM, some projects require just something smaller and simpler.

DOMaid provides helper functions to perform simple and regularly used HTML DOM actions supporting both modern and some legacy browsers.

## Usage

```javascript
import dom from './path-to/dom-aid.js';
```

## What can it do?

DOMaid provides a collection of methods to find, examine, modify and insert HTML elements in the DOM.

### Find elements

```javascript
// returns an array of found HTMLElements which match the specified selector:
const found = dom.find('.foo');

// returns an array of found HTMLElements from within specified parent HTMLElement:
const found = dom.find('.foo', parent);

// returns parent element of the supplied HTMLElement:
const parent = dom.parent(element);

// returns element's parent node which matches specified selector:
const parent = dom.parent(element, '#parent-id');
```

### Examine elements

```javascript
// whether an HTMLElement has the class name specified (returns a boolean):
const result = dom.hasClass('foo', element);

// whether an HTMLElement has an attribute set, returns attribute value or false:
const result = dom.hasAttr('data-foo', element);

// check whether HTMLElement matches the specified selector:
const result = dom.matches(element, 'div#foo');

// get the browser view-port dimensions:
const dims = dom.dims();

// get dimensions of the supplied HTMLElement:
const dims = dom.dims(element);
```

### Modify elements

```javascript
// Adds classname/s to an HTMLElement:
dom.addClass('foo bar', element);

// toggle HTMLElement's classname:
dom.toggleClass('foo', element);

// remove an HTMLElement's classname:
dom.removeClass('foo', element);

// hide or show an element:
dom.hide(element);
dom.show(element);

// hide or show multiple HTMLElements with an array:
dom.hide([element1, element2]);
dom.show([element1, element2]);

// set CSS rules on an HTMLElement:
const rules = { width: '100px', height: '50px', backgroundColor: 'blue' };
dom.setStyle(rules, element);

// set attributes on an HTMLElement:
const attrs = {
  id:           'foo',
  style:        'position: absolute; top: 10px; left: 20px;',
  'data-test':  'bar'
};

dom.setAttrs(attrs, element);
```

### Inserting elements into the DOM

```javascript
// add HTMLElement to page body:
const element = document.createElement('div');
dom.add(element);

// add HTMLElement to specified parent HTMLElement:
dom.add(element, parent);

// prepend HTMLElement to page body, or specified parent:
dom.prepend(element);
dom.prepend(element, parent);
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
  // e.detail is function.
  console.log(e.detail && e.detail().foo);
});