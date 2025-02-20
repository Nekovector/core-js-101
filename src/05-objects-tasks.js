/* ************************************************************************************************
 *                                                                                                *
 * Please read the following tutorial before implementing tasks:                                   *
 * https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Object_initializer *
 * https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object        *
 *                                                                                                *
 ************************************************************************************************ */


/**
 * Returns the rectangle object with width and height parameters and getArea() method
 *
 * @param {number} width
 * @param {number} height
 * @return {Object}
 *
 * @example
 *    const r = new Rectangle(10,20);
 *    console.log(r.width);       // => 10
 *    console.log(r.height);      // => 20
 *    console.log(r.getArea());   // => 200
 */
function Rectangle(width, height) {
  const r = {
    width,
    height,
    getArea() {
      return this.width * this.height;
    },
  };

  return r;
}


/**
 * Returns the JSON representation of specified object
 *
 * @param {object} obj
 * @return {string}
 *
 * @example
 *    [1,2,3]   =>  '[1,2,3]'
 *    { width: 10, height : 20 } => '{"height":10,"width":20}'
 */
function getJSON(obj) {
  let result = '';
  if (typeof obj === 'object' && !Array.isArray(obj)) {
    result += '{';
    const keys = Object.keys(obj);
    const values = Object.values(obj);
    for (let i = 0; i < keys.length; i += 1) {
      result = result.concat('"', `${keys[i]}`, '"', ':', `${values[i]}`, ',');
    }

    result = result.substring(0, result.length - 1);
    result += '}';
  }

  if (Array.isArray(obj)) {
    result += '[';
    for (let i = 0; i < obj.length; i += 1) {
      result = result.concat(`${obj[i]}`, ',');
    }

    result = result.substring(0, result.length - 1);
    result += ']';
  }

  return result;
}


/**
 * Returns the object of specified type from JSON representation
 *
 * @param {Object} proto
 * @param {string} json
 * @return {object}
 *
 * @example
 *    const r = fromJSON(Circle.prototype, '{"radius":10}');
 *
 */
function fromJSON(proto, json) {
  let str = json;
  str = str.substring(1, str.length - 1); // Убираем скобки {}
  const strArr = str.split(',').map((value) => value.trim());
  const obj = Object.create(proto);
  for (let i = 0; i < strArr.length; i += 1) {
    const tmpArr = strArr[i].split(':');
    const key = tmpArr[0].substring(1, tmpArr[0].length - 1); // Убираем кавычки ""
    const value = Number(tmpArr[1]);
    obj[key] = value;
  }

  return obj;
}


/**
 * Css selectors builder
 *
 * Each complex selector can consists of type, id, class, attribute, pseudo-class
 * and pseudo-element selectors:
 *
 *    element#id.class[attr]:pseudoClass::pseudoElement
 *              \----/\----/\----------/
 *              Can be several occurrences
 *
 * All types of selectors can be combined using the combination ' ','+','~','>' .
 *
 * The task is to design a single class, independent classes or classes hierarchy
 * and implement the functionality to build the css selectors using the provided cssSelectorBuilder.
 * Each selector should have the stringify() method to output the string representation
 * according to css specification.
 *
 * Provided cssSelectorBuilder should be used as facade only to create your own classes,
 * for example the first method of cssSelectorBuilder can be like this:
 *   element: function(value) {
 *       return new MySuperBaseElementSelector(...)...
 *   },
 *
 * The design of class(es) is totally up to you, but try to make it as simple,
 * clear and readable as possible.
 *
 * @example
 *
 *  const builder = cssSelectorBuilder;
 *
 *  builder.id('main').class('container').class('editable').stringify()
 *    => '#main.container.editable'
 *
 *  builder.element('a').attr('href$=".png"').pseudoClass('focus').stringify()
 *    => 'a[href$=".png"]:focus'
 *
 *  builder.combine(
 *      builder.element('div').id('main').class('container').class('draggable'),
 *      '+',
 *      builder.combine(
 *          builder.element('table').id('data'),
 *          '~',
 *           builder.combine(
 *               builder.element('tr').pseudoClass('nth-of-type(even)'),
 *               ' ',
 *               builder.element('td').pseudoClass('nth-of-type(even)')
 *           )
 *      )
 *  ).stringify()
 *    => 'div#main.container.draggable + table#data ~ tr:nth-of-type(even)   td:nth-of-type(even)'
 *
 *  For more examples see unit tests.
 */


class Selector {
  constructor() {
    this.element = '';
    this.id = '';
    this.classes = [];
    this.attrs = [];
    this.pseudoClasses = [];
    this.pseudoElements = [];
  }

  setElement(element) {
    this.element = element;
  }

  setId(id) {
    this.id = id;
  }

  addClass(cl) {
    this.classes.push(cl);
  }

  addAttr(attr) {
    this.attrs.push(attr);
  }

  addPseudoClass(pseudoClass) {
    this.pseudoClasses.push(pseudoClass);
  }

  addPseudoElement(pseudoElement) {
    this.pseudoElements.push(pseudoElement);
  }

  stringify() {
    let result = '';
    if (this.element) {
      result += this.element;
    }

    if (this.id) {
      result += `#${this.id}`;
    }

    if (this.classes.length !== 0) {
      result += `.${this.classes.join('.')}`;
    }

    if (this.attrs.length !== 0) {
      result += Array.from(this.attrs, (value) => `[${value}]`).join('');
    }

    if (this.pseudoClasses.length !== 0) {
      result += `:${this.pseudoClasses.join(':')}`;
    }

    if (this.pseudoElements.length !== 0) {
      result += `::${this.pseudoElements.join('::')}`;
    }

    return result;
  }
}

const cssSelectorBuilder = {
  selector: new Selector(),

  element(value) {
    this.selector.setElement(value);
    return this;
  },

  id(value) {
    this.selector.setId(value);
    return this;
  },

  class(value) {
    this.selector.addClass(value);
    return this;
  },

  attr(value) {
    this.selector.addAttr(value);
    return this;
  },

  pseudoClass(value) {
    this.selector.addPseudoClass(value);
    return this;
  },

  pseudoElement(value) {
    this.selector.addPseudoElement(value);
    return this;
  },

  stringify() {
    const result = this.selector.stringify();
    this.selector = new Selector();
    return result;
  },

  combine(/* selector1, combinator, selector2 */) {
    throw new Error('Not implemented');
  },
};

module.exports = {
  Rectangle,
  getJSON,
  fromJSON,
  cssSelectorBuilder,
};
