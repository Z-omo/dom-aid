'use strict';

const DOM = {
  html: document.querySelector('html'),
  body: document.querySelector('body'),
  modern: true, // for testing routines.

  hasClass(className, element)
  {
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
  addClass(className, element)
  {
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

  toggleClass(className, element)
  {
    element.classList.toggle(className);
  },

  removeClass(className, element)
  {
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
  hide(elements)
  {
    if (Array !== (elements).constructor) { elements = [elements]; }
    elements.forEach(e => e.style.display = 'none');
  },

  /*
   * @params HTMLElement or array of elements.
   */
  show(elements)
  {
    if (Array !== (elements).constructor) { elements = [elements]; }
    elements.forEach(e => e.style.display = '');
  },

  /*
   * @params Object collection of style rule properties and their values.
   */
  setStyle(rules, element)
  {
    for (let prop in rules)
    {
      if (rules.hasOwnProperty(prop)) { element.style[prop] = rules[prop]; }
    }
  },

  /*
   * @params Object collection of element attribute properties and their values.
   */
  setAttrs(attrs, element)
  {
    for (let prop in attrs)
    {
      if (attrs.hasOwnProperty(prop))
      {
        element.setAttribute(prop, attrs[prop]);
      }
    }
  },

  // @return false or attribute value.
  hasAttr(attrName, element)
  {
    const value = element.getAttribute(attrName);
    return value || false;
  },

  is(element, tagName)
  {
    if (!element) { return; }
    return element.tagName.toLowerCase() === tagName.toLowerCase();
  },
}

export default DOM;