'use strict';

const DOM = {
  customEvents: null,
  modern: true, // for switching testing routines.
  win: null, // represents window object.
  doc: null, // represents window.document object.
  
  /**
   * Set operating environment and related properties, via a window object.
   * In normal operation this would be the browser window object; in testing
   * this will be an instance of the JSDOM module window object.
   * 
   * @param {Object} w – representing global window object
   */
  setEnvironment(w = window) {
    this.win = w;
    this.doc = w.document;
    this.html = this.doc.querySelector('html');
    this.body = this.doc.querySelector('body');
  },

  media(query) {
    return this.win.matchMedia && this.win.matchMedia(query).matches;
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

  /**
   * @param {string} classname – selector to add, or multiple selectors
   * separated by a space.
   * @params {HTMLElement} element – on which class is to be added.
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
      if ('string' === typeof className) {
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

  /**
   * @params {HTMLElement|Array} elements - to be hidden.
   */
  hide(elements) {
    if (Array !== (elements).constructor) { elements = [elements]; }
    elements.forEach(e => e.style.display = 'none');
  },

  /**
   * @params {HTMLElement|Array} elements - to be made visible.
   */
  show(elements) {
    if (Array !== (elements).constructor) { elements = [elements]; }
    elements.forEach(e => e.style.display = '');
  },

  /**
   * @params {Object} rules - style rule properties and their values.
   * @params {HTMLElement} element - on which style rules are to be applied.
   */
  setStyle(rules, element) {
    if (!element) { return; }

    for (let prop in rules) {
      if (rules.hasOwnProperty(prop)) { element.style[prop] = rules[prop]; }
    }
  },

  /**
   * @params {Object} rules - style rule properties and their values.
   * @params {HTMLElement} element - on which style rules are to be removed.
   */
  removeStyle(rules, element) {
    if (!element) { return; }
    const hasSR = !!element.shadowRoot || element.mockSR;
    
    const rcn = rules.constructor.name;
    if ('Object' === rcn) {
      rules = Object.keys(rules);
    } else if ('String' === rcn) {
      rules = rules.trim().split(' ');
    } 

    /*
     * CSSStyleDeclaration.removeProperty() expects property name
     * to be hyphenated and not camelCase, e.g. background-color
     */
    const regexCamelCase = /([a-zA-Z])(?=[A-Z])/g;

    rules.forEach(prop => {
      prop = prop.replace(regexCamelCase, '$1-').toLowerCase();
      if (hasSR) {
        //delete element.style[prop];
        element.style[prop] = '';
      } else {
        element.style.removeProperty(prop);
      }
    });
  },

  /**
   * @params {Object} attrs - attribute property names and their values.
   * @params {HTMLElement} element - on which attributes are to be applied.
   */
  setAttrs(attrs, element) {
    if (!element) { return; }

    for (let prop in attrs) {
      if (attrs.hasOwnProperty(prop)) {
        element.setAttribute(prop, attrs[prop]);
      }
    }
  },

  /**
   * Check if an element has an attribute value.
   * 
   * @param {String} attrName - to be read on hte targeted element.
   * @param {HTMLElement} element - on which to read the required attribute.
   * @returns {String|Boolean} – found attribute value or false if named
   * attribute does not exist on the target element.
   */
  hasAttr(attrName, element) {
    if (!element) { return false; }
    const value = element.getAttribute(attrName);
    return value || false;
  },

  is(element, tagName) {
    if (!element) { return; }
    return element.tagName.toLowerCase() === tagName.toLowerCase();
  },

  find(selector, element = DOM.doc) {
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

  /**
   * Get the dimensions of the defined element or, when no element is passed,
   * the window object (browser viewport).
   * 
   * @params {HTMLElement} element (optional) – target DOM element.
   * @return {DOMRect|Object} – of target element, or if element is undefined, 
   * values for the view-port (window).
   */
  dims(element) {
    if (element) { return element.getBoundingClientRect(); }

    return {
      top:    DOM.win.pageYOffset,
      width:  DOM.win.innerWidth,
      height: DOM.win.innerHeight,
      bottom: DOM.win.pageYOffset + DOM.win.innerHeight
    };
  },

  trigger(eventName, element, data) {
    let event = getCustomEvent(eventName, data);
    if (!event) {
      throw new Error('Unable to trigger custom event: ' + eventName);
    }

    element.dispatchEvent(event);
  }
}

if ('undefined' !== typeof window) { DOM.setEnvironment(window); }

export default DOM;

/*
 * Support functions.
 */

function getCustomEvent(eventName, data) {
  // CustomEvents are cached so any data are stored locally to DOMaid,
  // and can be recalled via the eventData function, which is set as
  // the event handler event object detail, i.e. (evt) => evt.detail()
  data && (customEventDataStore[eventName] = data);
  
  if (DOM.customEvents && DOM.customEvents[eventName]) {
    // already registered custom event.
    return DOM.customEvents[eventName];
  }

  // …otherwise create the custom event:
  const event = createCustomEvent(eventName);

  registerCustomEvent(eventName, event);
  return event;
}

// Holds, temporarily, custom event data.
const customEventDataStore = {};

// eventData function will return stored event data, if available.
// Note: event data can be anything including a function.
// Once called, stored eventName data is deleted.
// Handlers for custom events can access data via event.detail(event.type);
function eventData(eventName) {
  let data = customEventDataStore[eventName];
  if ('function' == typeof data) { data = data(); }
  
  // make sure any stored data is removed after all event handler calls.
  data && setTimeout(() => clearEventData(eventName), 0);
  return data;
}

// clearEventData makes sure event data is removed from the local store.
function clearEventData(eventName) {
  if (!customEventDataStore[eventName]) { return; }
  delete customEventDataStore[eventName];
}

function createCustomEvent(eventName) {
  if ('function' !== typeof DOM.win.CustomEvent) {
    window.CustomEvent = PolyCustomEvent;
  }

  const event = new DOM.win.CustomEvent(
    // detail (eventData function) is always included to allow
    // data to be added to already registered custom events.
    eventName, { detail: eventData }
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

  let evt = DOM.doc.createEvent('CustomEvent');
  evt.initCustomEvent(
    event, params.bubbles, params.cancelable, params.detail
  );

  return evt;
}

function registerCustomEvent(eventName, event) {
  if (null === DOM.customEvents) { DOM.customEvents = {}; }
  DOM.customEvents[eventName] = event;
}
