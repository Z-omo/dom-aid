'use strict';

const DOM = {
  customEvents: null,
  modern: true, // for switching testing routines.
  win: null,    // represents window object.
  doc: null,    // represents window.document object.
  
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

  /**
   * 
   * @param {string} query - representing @media query string. 
   * @returns 
   */
  media(query) {
    return this.win.matchMedia && this.win.matchMedia(query).matches;
  },

  /**
   * Does the target element have the defined css class name.
   * @param {string} className – representing css class selector.
   * @param {Element} element - target HTML element.
   * @returns 
   */
  hasClass(className, element) {
    if (!element) { return; }

    if (DOM.modern && element.classList) {
      return (element.classList && element.classList.contains(className));
    } else {
      const regexName = new RegExp('[\w\s]*'+ className + '[\s\w]*');
      return regexName.test(element.className);
    }
  },

  /**
   * Add css class selectors to target HTML element.
   * @param {string} classname – selector to add, or multiple selectors
   * separated by a space.
   * @params {Element} element – on which class is to be added.
   */
  addClass(className, element) {
    if (!element) { return; }

    if (DOM.modern && element.classList) {
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

  /**
   * Remove single/multiple css class selectors from target element.
   * @param {string} className – selector to remove, or multiple selectors
   * separated by a space.
   * @param {Element} element - target HTML element.
   * @returns 
   */
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

    // when element class attribute ends being empty, remove it:
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

  /**
   * Is target element of type tag name.
   * @param {Element} element - target HTML element.
   * @param {string} tagName - element tag name to match.
   * @returns {boolean}
   */
  is(element, tagName) {
    if (!element) { return; }
    return element.tagName.toLowerCase() === tagName.toLowerCase();
  },

  find(selector, element = DOM.doc) {
    const nodes = element.querySelectorAll(selector);
    if (!nodes || 0 === nodes.length) { return; }

   /*
    * convert NodeList to an Array, otherwise IE throws error on a
    * subsequent forEach:
    */
    return Array.prototype.slice.call(nodes);
  },

  /**
   * Append supplied element to document body element or defined parent element.
   * @param {Element} element – to be appended.
   * @param {Element} [parent=<body>] - defined parent HTML element.
   */
  add(element, parent = DOM.body) {
    if (!element) { return; }
    parent.appendChild(element);
  },

  /**
   * Prepend supplied element to document body element or
   * defined parent element.
   * @param {Element} element – to be prepended.
   * @param {Element} [parent=<body>] - defined parent HTML element.
   */
  prepend(element, parent = DOM.body) {
    if (!element) { return; }
    parent.insertBefore(element, parent.firstChild);
  },

  /**
   * Does the supplied element match the defined css selector.
   * @param {Element} element - target HTML element. 
   * @param {string} selector - css selector to test against.
   * @returns {boolean}
   */
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

  /**
   * Get the direct parent element of the supplied element, or the
   * ancestor element that matches the css selector.
   * @param {Element} element - target element.
   * @param {string} selector - css selector to test against.
   * @returns {Element|null} - found parent element or null for none found.
   */
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

  /**
   * Trigger custom event on defined HTML element. Optionally, include
   * event data.
   * @param {string} eventName - represent custom event name.
   * @param {Element} element - target on which event is to be triggered.
   * @param {*} [data] - event accompanying data. 
   */
  trigger(eventName, element, data) {
    const event = getCustomEvent(eventName, data);
    if (!event) {
      throw new Error('Unable to trigger custom event: ' + eventName);
    }

    element.dispatchEvent(event);
  }
}

// When operating within a browser environment.
if ('undefined' !== typeof window) { DOM.setEnvironment(window); }

export default DOM;

/*
 * DOMAid supporting functions.
 */

// Repository for storing, temporarily, custom event data.
const customEventDataStore = {};

/**
 * Create a native CustomEvent object, and include optional event data.
 * Event data can be anything, including a function, which is invoked when
 * event data are recalled (see function eventData).
 * @param {string} eventName – representing custom event name.
 * @param {*} [data] – data to accompany a custom event.
 * @returns {CustomEvent}
 */
function getCustomEvent(eventName, data) {
  /*
   * CustomEvent objects are cached and any accompanying data are
   * registered locally for easier recall via an event object's
   * detail method, i.e. (evt) => evt.detail()
   */
  data && (customEventDataStore[eventName] = data);
  
  // return early with an already registered custom event:
  if (DOM.customEvents && DOM.customEvents[eventName]) {
    return DOM.customEvents[eventName];
  }

  // …otherwise create and register the custom event:
  const event = createCustomEvent(eventName);
  registerCustomEvent(eventName, event);

  return event;
}

/**
 * Create custom event object, which will include a ‘detail’ property
 * for any event accompanying data.
 * @param {string} eventName - representing custom event name.
 * @returns {CustomEvent}
 */
function createCustomEvent(eventName) {
  if ('function' !== typeof DOM.win.CustomEvent) {
    window.CustomEvent = PolyCustomEvent;
  }

  /*
   * Note: setting detail property allows event data to be added
   * after event creation.
   */
  const event = new DOM.win.CustomEvent(eventName, { detail: eventData });

  return event;
}

/**
 * Custom events are stored locally, for easier recall (triggering).
 * @param {string} eventName - representing custom event name.
 * @param {CustomEvent} event object. 
 */
function registerCustomEvent(eventName, event) {
  if (null === DOM.customEvents) { DOM.customEvents = {}; }
  DOM.customEvents[eventName] = event;
}

/**
 * Returns the data for the given custom event name.
 * @param {string} eventName - representing custom event name.
 * @returns {*} registered event accompanying data.
 */
function eventData(eventName) {
  let data = customEventDataStore[eventName];
  // when needed, invoke data function:
  if ('function' == typeof data) { data = data(); }
  
  // make sure any stored data are removed after all event handler calls.
  data && setTimeout(() => clearEventData(eventName), 0);
  return data;
}

/**
 * Remove, locally stored, custom event data.
 * @param {string} eventName - representing custom event name.
 */
function clearEventData(eventName) {
  if (!customEventDataStore[eventName]) { return; }
  delete customEventDataStore[eventName];
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
