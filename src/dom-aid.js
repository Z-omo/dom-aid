'use strict';

const DOM = {
  html: document.querySelector('html'),
  body: document.querySelector('body'),
  customEvents: null,
  modern: true, // for testing routines.

  hasClass(className, element) {
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
    element.classList.toggle(className);
  },

  removeClass(className, element) {
    if (!element) { return; }

    if (DOM.modern && element.classList)
    {
      element.classList.remove(className);
    } else {
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
    for (let prop in rules)
    {
      if (rules.hasOwnProperty(prop)) { element.style[prop] = rules[prop]; }
    }
  },

  /*
   * @params Object collection of element attribute properties and their values.
   */
  setAttrs(attrs, element) {
    for (let prop in attrs)
    {
      if (attrs.hasOwnProperty(prop))
      {
        element.setAttribute(prop, attrs[prop]);
      }
    }
  },

  // @return false or attribute value.
  hasAttr(attrName, element) {
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
    parent.appendChild(element);
  },

  prepend(element, parent = DOM.body) {
    parent.insertBefore(element, parent.firstChild);
  },

  matches(element, selector) {
    const match = (
      element.matches ||
      element.matchesSelector ||
      element.msMatchesSelector ||
      element.mozMatchesSelector ||
      element.webkitMatchesSelector ||
      element.oMatchesSelector).call(element, selector);

    return match;
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

    if (!element )
    {
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

  trigger(eventName, element, data)
  {
    let event = getCustomEvent(eventName, data);
    if (!event)
    {
      throw new Error('Unable to trigger custom event: ' + eventName);
    }

    element.dispatchEvent(event);
  }
}

export default DOM;


function getCustomEvent(eventName, data)
{
  if (DOM.customEvents && DOM.customEvents[eventName])
  {
    return DOM.customEvents[eventName];
  }

  let event = createCustomEvent(eventName, data);

  registerCustomEvent(eventName, event);
  return event;
}

function createCustomEvent(eventName, data)
{
  if ('function' !== typeof window.CustomEvent)
  {
    CustomEvent.prototype = window.Event.prototype;
  }

  let event = new CustomEvent(eventName, data && { detail: data });
  return event;
}

/*
 * Polyfill code gleaned from MDN:
 * https://developer.mozilla.org/en-US/docs/Web/API/CustomEvent/CustomEvent
 */
function CustomEvent(event, params)
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

function registerCustomEvent(eventName, event)
{
  if (null === DOM.customEvents) { DOM.customEvents = {}; }
  DOM.customEvents[eventName] = event;
}
