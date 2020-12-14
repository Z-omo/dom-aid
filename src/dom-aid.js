'use strict';

const DOM = {
  html: document.querySelector('html'),
  body: document.querySelector('body'),
  customEvents: null,
  modern: true, // for testing routines.

  media(query) {
    return window.matchMedia(query).matches;
  },

  hasClass(className, element) {
    if (!element) { return; }

    if (DOM.modern && element.classList)
    {
      return (element.classList && element.classList.contains(className));
    } else {
      const regexName = new RegExp('[\w\s]*'+ className + '[\s\w]*');
      return regexName.test(element.className);
    }
  },

  /*
   * @param string classname to add, or multiple names separated by a space.
   * @params HTMLElement on which class is to be added.
   */
  addClass(className, element) {
    if (!element) { return; }

    if (DOM.modern && element.classList)
    {
      className.trim().split(' ')
        .forEach((name) => element.classList.add(name));

      // Would prefer the following but IE does not support multiple arguments.
      // element.classList.add(...classNames);

    } else {

      let classNames = (element.className) ? element.className + ' ' : '';
      classNames += className;
      element.className = classNames;
    }
  },

  toggleClass(className, element) {
    if (!element) { return; }
    element.classList.toggle(className);
  },

  removeClass(className, element) {
    if (!element) { return; }

    if (DOM.modern && element.classList) {
      if ('String' === className.constructor.name) {
        className = className.trim().split(' ');
      }
      
      className.forEach((name) => element.classList.remove(name));

    } else {

      if ('Array' === className.constructor.name) {
        className = className.join(' ');
      }

      element.className = element.className
        .replace( new RegExp('(^|\\b)' + className.split(' ').join('|') + '(\\b|$)', 'gi'), ' ');
    }

    if ('' === element.className) { element.removeAttribute('class'); }
  },

  /*
   * @params HTMLElement or array of elements.
   */
  hide(elements) {
    if (Array !== (elements).constructor) { elements = [elements]; }
    elements.forEach(e => e.style.display = 'none');
  },

  /*
   * @params HTMLElement or array of elements.
   */
  show(elements) {
    if (Array !== (elements).constructor) { elements = [elements]; }
    elements.forEach(e => e.style.display = '');
  },

  /*
   * @params Object collection of style rule properties and their values.
   */
  setStyle(rules, element) {
    if (!element) { return; }

    for (let prop in rules) {
      if (rules.hasOwnProperty(prop)) { element.style[prop] = rules[prop]; }
    }
  },

  /*
   * @params Object collection of style rule properties and their values.
   */
  removeStyle(rules, element) {
    if (!element) { return; }

    /*
     * CSSStyleDeclaration.removeProperty() expects property name
     * to be hyphenated and not camelCase, e.g. background-color
     */
    const regexCamelCase = /([a-zA-Z])(?=[A-Z])/g;

    for (let prop in rules) {
      if (rules.hasOwnProperty(prop)) { 
        prop = prop.replace(regexCamelCase, '$1-').toLowerCase();
        element.style.removeProperty(prop);
      }
    }
  },

  /*
   * @params Object collection of element attribute properties and their values.
   */
  setAttrs(attrs, element) {
    if (!element) { return; }

    for (let prop in attrs) {
      if (attrs.hasOwnProperty(prop)) {
        element.setAttribute(prop, attrs[prop]);
      }
    }
  },

  // @return false or attribute value.
  hasAttr(attrName, element) {
    if (!element) { return false; }
    const value = element.getAttribute(attrName);
    return value || false;
  },

  is(element, tagName) {
    if (!element) { return; }
    return element.tagName.toLowerCase() === tagName.toLowerCase();
  },

  find(selector, element = document) {
    let nodes = element.querySelectorAll(selector);
    if (!nodes || 0 === nodes.length) { return; }

   /*
    * convert NodeList to an Array, otherwise IE throws error on a
    * subsequent forEach:
    */
    return Array.prototype.slice.call(nodes);
  },

  add(element, parent = DOM.body) {
    if (!element) { return; }
    parent.appendChild(element);
  },

  prepend(element, parent = DOM.body) {
    if (!element) { return; }
    parent.insertBefore(element, parent.firstChild);
  },

  matches(element, selector) {
    const matches = (
      element.matches ||
      element.matchesSelector ||
      element.msMatchesSelector ||
      element.mozMatchesSelector ||
      element.webkitMatchesSelector ||
      element.oMatchesSelector);

    return matches && matches.call(element, selector);
  },

  parent(element, selector) {
    if (!element) { return; }
    let target = element;
    let found;
    let parent;

    do {
      parent = target.parentNode;
      if (!parent) { break; }

      found = !selector || this.matches(parent, selector);
      target = parent;
    } while (!found && parent);

    return parent;
  },

  /*
   * @params HTMLElement.
   * @return DOMRect, or if element is undefined, object with values for the
   * view-port (window).
   */
  dims(element) {
    let dims;

    if (!element ) {
      dims = {
        top:    window.pageYOffset,
        width:  window.innerWidth,
        height: window.innerHeight,
        bottom: window.pageYOffset + window.innerHeight
      };

    } else {

      dims = element.getBoundingClientRect();
    }

    return dims;
  },

  trigger(eventName, element, data) {
    let event = getCustomEvent(eventName, data);
    if (!event) {
      throw new Error('Unable to trigger custom event: ' + eventName);
    }

    element.dispatchEvent(event);
  }
}

export default DOM;

/*
 * Support functions.
 */

function getCustomEvent(eventName, data) {
  // CustomEvents are cached so any data are stored locally to DOMaid,
  // and can be recalled via the eventData function, which is set as
  // the event handler event object detail, i.e. (evt) => evt.detail()
  if (data) { customEventDataStore[eventName] = data; }

  if (DOM.customEvents && DOM.customEvents[eventName]) {
    return DOM.customEvents[eventName];
  }

  const event = createCustomEvent(eventName, data);

  registerCustomEvent(eventName, event);
  return event;
}

// Holds, temporarily, custom event data.
const customEventDataStore = {};

// eventData function will return stored event data, if available.
// Once called, stored eventName data is deleted.
// Handlers for custom events can access data via event.detail(event.type);
function eventData(eventName) {
  const data = customEventDataStore[eventName];
  if ('function' == typeof data) {
    data = data();
  }

  // make sure stored data is removed after all event handler calls.
  setTimeout(() => clearEventData(eventName), 0);
  return data;
}

// clearEventData makes sure event data is removed from the local store.
function clearEventData(eventName) {
  if (!customEventDataStore[eventName]) { return; }
  delete customEventDataStore[eventName];
}

function createCustomEvent(eventName, data) {
  if ('function' !== typeof window.CustomEvent) {
    window.CustomEvent = PolyCustomEvent;
  }

  const event = new window.CustomEvent(
    eventName, customEventDataStore[eventName] && { detail: eventData }
  );
  return event;
}

/*
 * Polyfill code gleaned from MDN:
 * https://developer.mozilla.org/en-US/docs/Web/API/CustomEvent/CustomEvent
 */
function PolyCustomEvent(event, params)
{
  params = params || {
    bubbles: false, cancelable: false, detail: undefined
  };

  let evt = document.createEvent('CustomEvent');
  evt.initCustomEvent(
    event, params.bubbles, params.cancelable, params.detail
  );

  return evt;
}

function registerCustomEvent(eventName, event) {
  if (null === DOM.customEvents) { DOM.customEvents = {}; }
  DOM.customEvents[eventName] = event;
}
