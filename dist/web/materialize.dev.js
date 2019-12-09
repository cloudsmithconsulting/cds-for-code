"use strict";

function _possibleConstructorReturn(self, call) {
    if (call && (_typeof(call) === "object" || typeof call === "function")) {
        return call;
    }
    return _assertThisInitialized(self);
}

function _assertThisInitialized(self) {
    if (self === void 0) {
        throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
    }
    return self;
}

function _get(target, property, receiver) {
    if (typeof Reflect !== "undefined" && Reflect.get) {
        _get = Reflect.get;
    } else {
        _get = function _get(target, property, receiver) {
            var base = _superPropBase(target, property);
            if (!base) return;
            var desc = Object.getOwnPropertyDescriptor(base, property);
            if (desc.get) {
                return desc.get.call(receiver);
            }
            return desc.value;
        };
    }
    return _get(target, property, receiver || target);
}

function _superPropBase(object, property) {
    while (!Object.prototype.hasOwnProperty.call(object, property)) {
        object = _getPrototypeOf(object);
        if (object === null) break;
    }
    return object;
}

function _getPrototypeOf(o) {
    _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) {
        return o.__proto__ || Object.getPrototypeOf(o);
    };
    return _getPrototypeOf(o);
}

function _inherits(subClass, superClass) {
    if (typeof superClass !== "function" && superClass !== null) {
        throw new TypeError("Super expression must either be null or a function");
    }
    subClass.prototype = Object.create(superClass && superClass.prototype, {
        constructor: {
            value: subClass,
            writable: true,
            configurable: true
        }
    });
    if (superClass) _setPrototypeOf(subClass, superClass);
}

function _setPrototypeOf(o, p) {
    _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) {
        o.__proto__ = p;
        return o;
    };
    return _setPrototypeOf(o, p);
}

function _classCallCheck(instance, Constructor) {
    if (!(instance instanceof Constructor)) {
        throw new TypeError("Cannot call a class as a function");
    }
}

function _defineProperties(target, props) {
    for (var i = 0; i < props.length; i++) {
        var descriptor = props[i];
        descriptor.enumerable = descriptor.enumerable || false;
        descriptor.configurable = true;
        if ("value" in descriptor) descriptor.writable = true;
        Object.defineProperty(target, descriptor.key, descriptor);
    }
}

function _createClass(Constructor, protoProps, staticProps) {
    if (protoProps) _defineProperties(Constructor.prototype, protoProps);
    if (staticProps) _defineProperties(Constructor, staticProps);
    return Constructor;
}

function _typeof(obj) {
    if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") {
        _typeof = function _typeof(obj) {
            return typeof obj;
        };
    } else {
        _typeof = function _typeof(obj) {
            return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj;
        };
    }
    return _typeof(obj);
}

(function(factory) {
    window.cash = factory();
})(function() {
    var doc = document, win = window, ArrayProto = Array.prototype, slice = ArrayProto.slice, _filter = ArrayProto.filter, push = ArrayProto.push;
    var noop = function noop() {}, isFunction = function isFunction(item) {
        return _typeof(item) === _typeof(noop) && item.call;
    }, isString = function isString(item) {
        return _typeof(item) === _typeof("");
    };
    var idMatch = /^#[\w-]*$/, classMatch = /^\.[\w-]*$/, htmlMatch = /<.+>/, singlet = /^\w+$/;
    function _find(selector, context) {
        context = context || doc;
        var elems = classMatch.test(selector) ? context.getElementsByClassName(selector.slice(1)) : singlet.test(selector) ? context.getElementsByTagName(selector) : context.querySelectorAll(selector);
        return elems;
    }
    var frag;
    function parseHTML(str) {
        if (!frag) {
            frag = doc.implementation.createHTMLDocument(null);
            var base = frag.createElement("base");
            base.href = doc.location.href;
            frag.head.appendChild(base);
        }
        frag.body.innerHTML = str;
        return frag.body.childNodes;
    }
    function onReady(fn) {
        if (doc.readyState !== "loading") {
            fn();
        } else {
            doc.addEventListener("DOMContentLoaded", fn);
        }
    }
    function Init(selector, context) {
        if (!selector) {
            return this;
        }
        if (selector.cash && selector !== win) {
            return selector;
        }
        var elems = selector, i = 0, length;
        if (isString(selector)) {
            elems = idMatch.test(selector) ? doc.getElementById(selector.slice(1)) : htmlMatch.test(selector) ? parseHTML(selector) : _find(selector, context);
        } else if (isFunction(selector)) {
            onReady(selector);
            return this;
        }
        if (!elems) {
            return this;
        }
        if (elems.nodeType || elems === win) {
            this[0] = elems;
            this.length = 1;
        } else {
            length = this.length = elems.length;
            for (;i < length; i++) {
                this[i] = elems[i];
            }
        }
        return this;
    }
    function cash(selector, context) {
        return new Init(selector, context);
    }
    var fn = cash.fn = cash.prototype = Init.prototype = {
        cash: true,
        length: 0,
        push: push,
        splice: ArrayProto.splice,
        map: ArrayProto.map,
        init: Init
    };
    Object.defineProperty(fn, "constructor", {
        value: cash
    });
    cash.parseHTML = parseHTML;
    cash.noop = noop;
    cash.isFunction = isFunction;
    cash.isString = isString;
    cash.extend = fn.extend = function(target) {
        target = target || {};
        var args = slice.call(arguments), length = args.length, i = 1;
        if (args.length === 1) {
            target = this;
            i = 0;
        }
        for (;i < length; i++) {
            if (!args[i]) {
                continue;
            }
            for (var key in args[i]) {
                if (args[i].hasOwnProperty(key)) {
                    target[key] = args[i][key];
                }
            }
        }
        return target;
    };
    function _each(collection, callback) {
        var l = collection.length, i = 0;
        for (;i < l; i++) {
            if (callback.call(collection[i], collection[i], i, collection) === false) {
                break;
            }
        }
    }
    function matches(el, selector) {
        var m = el && (el.matches || el.webkitMatchesSelector || el.mozMatchesSelector || el.msMatchesSelector || el.oMatchesSelector);
        return !!m && m.call(el, selector);
    }
    function getCompareFunction(selector) {
        return isString(selector) ? matches : selector.cash ? function(el) {
            return selector.is(el);
        } : function(el, selector) {
            return el === selector;
        };
    }
    function unique(collection) {
        return cash(slice.call(collection).filter(function(item, index, self) {
            return self.indexOf(item) === index;
        }));
    }
    cash.extend({
        merge: function merge(first, second) {
            var len = +second.length, i = first.length, j = 0;
            for (;j < len; i++, j++) {
                first[i] = second[j];
            }
            first.length = i;
            return first;
        },
        each: _each,
        matches: matches,
        unique: unique,
        isArray: Array.isArray,
        isNumeric: function isNumeric(n) {
            return !isNaN(parseFloat(n)) && isFinite(n);
        }
    });
    var uid = cash.uid = "_cash" + Date.now();
    function getDataCache(node) {
        return node[uid] = node[uid] || {};
    }
    function setData(node, key, value) {
        return getDataCache(node)[key] = value;
    }
    function getData(node, key) {
        var c = getDataCache(node);
        if (c[key] === undefined) {
            c[key] = node.dataset ? node.dataset[key] : cash(node).attr("data-" + key);
        }
        return c[key];
    }
    function _removeData(node, key) {
        var c = getDataCache(node);
        if (c) {
            delete c[key];
        } else if (node.dataset) {
            delete node.dataset[key];
        } else {
            cash(node).removeAttr("data-" + name);
        }
    }
    fn.extend({
        data: function data(name, value) {
            if (isString(name)) {
                return value === undefined ? getData(this[0], name) : this.each(function(v) {
                    return setData(v, name, value);
                });
            }
            for (var key in name) {
                this.data(key, name[key]);
            }
            return this;
        },
        removeData: function removeData(key) {
            return this.each(function(v) {
                return _removeData(v, key);
            });
        }
    });
    var notWhiteMatch = /\S+/g;
    function getClasses(c) {
        return isString(c) && c.match(notWhiteMatch);
    }
    function _hasClass(v, c) {
        return v.classList ? v.classList.contains(c) : new RegExp("(^| )" + c + "( |$)", "gi").test(v.className);
    }
    function _addClass(v, c, spacedName) {
        if (v.classList) {
            v.classList.add(c);
        } else if (spacedName.indexOf(" " + c + " ")) {
            v.className += " " + c;
        }
    }
    function _removeClass(v, c) {
        if (v.classList) {
            v.classList.remove(c);
        } else {
            v.className = v.className.replace(c, "");
        }
    }
    fn.extend({
        addClass: function addClass(c) {
            var classes = getClasses(c);
            return classes ? this.each(function(v) {
                var spacedName = " " + v.className + " ";
                _each(classes, function(c) {
                    _addClass(v, c, spacedName);
                });
            }) : this;
        },
        attr: function attr(name, value) {
            if (!name) {
                return undefined;
            }
            if (isString(name)) {
                if (value === undefined) {
                    return this[0] ? this[0].getAttribute ? this[0].getAttribute(name) : this[0][name] : undefined;
                }
                return this.each(function(v) {
                    if (v.setAttribute) {
                        v.setAttribute(name, value);
                    } else {
                        v[name] = value;
                    }
                });
            }
            for (var key in name) {
                this.attr(key, name[key]);
            }
            return this;
        },
        hasClass: function hasClass(c) {
            var check = false, classes = getClasses(c);
            if (classes && classes.length) {
                this.each(function(v) {
                    check = _hasClass(v, classes[0]);
                    return !check;
                });
            }
            return check;
        },
        prop: function prop(name, value) {
            if (isString(name)) {
                return value === undefined ? this[0][name] : this.each(function(v) {
                    v[name] = value;
                });
            }
            for (var key in name) {
                this.prop(key, name[key]);
            }
            return this;
        },
        removeAttr: function removeAttr(name) {
            return this.each(function(v) {
                if (v.removeAttribute) {
                    v.removeAttribute(name);
                } else {
                    delete v[name];
                }
            });
        },
        removeClass: function removeClass(c) {
            if (!arguments.length) {
                return this.attr("class", "");
            }
            var classes = getClasses(c);
            return classes ? this.each(function(v) {
                _each(classes, function(c) {
                    _removeClass(v, c);
                });
            }) : this;
        },
        removeProp: function removeProp(name) {
            return this.each(function(v) {
                delete v[name];
            });
        },
        toggleClass: function toggleClass(c, state) {
            if (state !== undefined) {
                return this[state ? "addClass" : "removeClass"](c);
            }
            var classes = getClasses(c);
            return classes ? this.each(function(v) {
                var spacedName = " " + v.className + " ";
                _each(classes, function(c) {
                    if (_hasClass(v, c)) {
                        _removeClass(v, c);
                    } else {
                        _addClass(v, c, spacedName);
                    }
                });
            }) : this;
        }
    });
    fn.extend({
        add: function add(selector, context) {
            return unique(cash.merge(this, cash(selector, context)));
        },
        each: function each(callback) {
            _each(this, callback);
            return this;
        },
        eq: function eq(index) {
            return cash(this.get(index));
        },
        filter: function filter(selector) {
            if (!selector) {
                return this;
            }
            var comparator = isFunction(selector) ? selector : getCompareFunction(selector);
            return cash(_filter.call(this, function(e) {
                return comparator(e, selector);
            }));
        },
        first: function first() {
            return this.eq(0);
        },
        get: function get(index) {
            if (index === undefined) {
                return slice.call(this);
            }
            return index < 0 ? this[index + this.length] : this[index];
        },
        index: function index(elem) {
            var child = elem ? cash(elem)[0] : this[0], collection = elem ? this : cash(child).parent().children();
            return slice.call(collection).indexOf(child);
        },
        last: function last() {
            return this.eq(-1);
        }
    });
    var camelCase = function() {
        var camelRegex = /(?:^\w|[A-Z]|\b\w)/g, whiteSpace = /[\s-_]+/g;
        return function(str) {
            return str.replace(camelRegex, function(letter, index) {
                return letter[index === 0 ? "toLowerCase" : "toUpperCase"]();
            }).replace(whiteSpace, "");
        };
    }();
    var getPrefixedProp = function() {
        var cache = {}, doc = document, div = doc.createElement("div"), style = div.style;
        return function(prop) {
            prop = camelCase(prop);
            if (cache[prop]) {
                return cache[prop];
            }
            var ucProp = prop.charAt(0).toUpperCase() + prop.slice(1), prefixes = [ "webkit", "moz", "ms", "o" ], props = (prop + " " + prefixes.join(ucProp + " ") + ucProp).split(" ");
            _each(props, function(p) {
                if (p in style) {
                    cache[p] = prop = cache[prop] = p;
                    return false;
                }
            });
            return cache[prop];
        };
    }();
    cash.prefixedProp = getPrefixedProp;
    cash.camelCase = camelCase;
    fn.extend({
        css: function css(prop, value) {
            if (isString(prop)) {
                prop = getPrefixedProp(prop);
                return arguments.length > 1 ? this.each(function(v) {
                    return v.style[prop] = value;
                }) : win.getComputedStyle(this[0])[prop];
            }
            for (var key in prop) {
                this.css(key, prop[key]);
            }
            return this;
        }
    });
    function compute(el, prop) {
        return parseInt(win.getComputedStyle(el[0], null)[prop], 10) || 0;
    }
    _each([ "Width", "Height" ], function(v) {
        var lower = v.toLowerCase();
        fn[lower] = function() {
            return this[0].getBoundingClientRect()[lower];
        };
        fn["inner" + v] = function() {
            return this[0]["client" + v];
        };
        fn["outer" + v] = function(margins) {
            return this[0]["offset" + v] + (margins ? compute(this, "margin" + (v === "Width" ? "Left" : "Top")) + compute(this, "margin" + (v === "Width" ? "Right" : "Bottom")) : 0);
        };
    });
    function registerEvent(node, eventName, callback) {
        var eventCache = getData(node, "_cashEvents") || setData(node, "_cashEvents", {});
        eventCache[eventName] = eventCache[eventName] || [];
        eventCache[eventName].push(callback);
        node.addEventListener(eventName, callback);
    }
    function removeEvent(node, eventName, callback) {
        var events = getData(node, "_cashEvents"), eventCache = events && events[eventName], index;
        if (!eventCache) {
            return;
        }
        if (callback) {
            node.removeEventListener(eventName, callback);
            index = eventCache.indexOf(callback);
            if (index >= 0) {
                eventCache.splice(index, 1);
            }
        } else {
            _each(eventCache, function(event) {
                node.removeEventListener(eventName, event);
            });
            eventCache = [];
        }
    }
    fn.extend({
        off: function off(eventName, callback) {
            return this.each(function(v) {
                return removeEvent(v, eventName, callback);
            });
        },
        on: function on(eventName, delegate, callback, runOnce) {
            var originalCallback;
            if (!isString(eventName)) {
                for (var key in eventName) {
                    this.on(key, delegate, eventName[key]);
                }
                return this;
            }
            if (isFunction(delegate)) {
                callback = delegate;
                delegate = null;
            }
            if (eventName === "ready") {
                onReady(callback);
                return this;
            }
            if (delegate) {
                originalCallback = callback;
                callback = function callback(e) {
                    var t = e.target;
                    while (!matches(t, delegate)) {
                        if (t === this || t === null) {
                            return t = false;
                        }
                        t = t.parentNode;
                    }
                    if (t) {
                        originalCallback.call(t, e);
                    }
                };
            }
            return this.each(function(v) {
                var _finalCallback = callback;
                if (runOnce) {
                    _finalCallback = function finalCallback() {
                        callback.apply(this, arguments);
                        removeEvent(v, eventName, _finalCallback);
                    };
                }
                registerEvent(v, eventName, _finalCallback);
            });
        },
        one: function one(eventName, delegate, callback) {
            return this.on(eventName, delegate, callback, true);
        },
        ready: onReady,
        trigger: function trigger(eventName, data) {
            if (document.createEvent) {
                var evt = document.createEvent("HTMLEvents");
                evt.initEvent(eventName, true, false);
                evt = this.extend(evt, data);
                return this.each(function(v) {
                    return v.dispatchEvent(evt);
                });
            }
        }
    });
    function encode(name, value) {
        return "&" + encodeURIComponent(name) + "=" + encodeURIComponent(value).replace(/%20/g, "+");
    }
    function getSelectMultiple_(el) {
        var values = [];
        _each(el.options, function(o) {
            if (o.selected) {
                values.push(o.value);
            }
        });
        return values.length ? values : null;
    }
    function getSelectSingle_(el) {
        var selectedIndex = el.selectedIndex;
        return selectedIndex >= 0 ? el.options[selectedIndex].value : null;
    }
    function getValue(el) {
        var type = el.type;
        if (!type) {
            return null;
        }
        switch (type.toLowerCase()) {
          case "select-one":
            return getSelectSingle_(el);

          case "select-multiple":
            return getSelectMultiple_(el);

          case "radio":
            return el.checked ? el.value : null;

          case "checkbox":
            return el.checked ? el.value : null;

          default:
            return el.value ? el.value : null;
        }
    }
    fn.extend({
        serialize: function serialize() {
            var query = "";
            _each(this[0].elements || this, function(el) {
                if (el.disabled || el.tagName === "FIELDSET") {
                    return;
                }
                var name = el.name;
                switch (el.type.toLowerCase()) {
                  case "file":
                  case "reset":
                  case "submit":
                  case "button":
                    break;

                  case "select-multiple":
                    var values = getValue(el);
                    if (values !== null) {
                        _each(values, function(value) {
                            query += encode(name, value);
                        });
                    }
                    break;

                  default:
                    var value = getValue(el);
                    if (value !== null) {
                        query += encode(name, value);
                    }
                }
            });
            return query.substr(1);
        },
        val: function val(value) {
            if (value === undefined) {
                return getValue(this[0]);
            }
            return this.each(function(v) {
                return v.value = value;
            });
        }
    });
    function insertElement(el, child, prepend) {
        if (prepend) {
            var first = el.childNodes[0];
            el.insertBefore(child, first);
        } else {
            el.appendChild(child);
        }
    }
    function insertContent(parent, child, prepend) {
        var str = isString(child);
        if (!str && child.length) {
            _each(child, function(v) {
                return insertContent(parent, v, prepend);
            });
            return;
        }
        _each(parent, str ? function(v) {
            return v.insertAdjacentHTML(prepend ? "afterbegin" : "beforeend", child);
        } : function(v, i) {
            return insertElement(v, i === 0 ? child : child.cloneNode(true), prepend);
        });
    }
    fn.extend({
        after: function after(selector) {
            cash(selector).insertAfter(this);
            return this;
        },
        append: function append(content) {
            insertContent(this, content);
            return this;
        },
        appendTo: function appendTo(parent) {
            insertContent(cash(parent), this);
            return this;
        },
        before: function before(selector) {
            cash(selector).insertBefore(this);
            return this;
        },
        clone: function clone() {
            return cash(this.map(function(v) {
                return v.cloneNode(true);
            }));
        },
        empty: function empty() {
            this.html("");
            return this;
        },
        html: function html(content) {
            if (content === undefined) {
                return this[0].innerHTML;
            }
            var source = content.nodeType ? content[0].outerHTML : content;
            return this.each(function(v) {
                return v.innerHTML = source;
            });
        },
        insertAfter: function insertAfter(selector) {
            var _this = this;
            cash(selector).each(function(el, i) {
                var parent = el.parentNode, sibling = el.nextSibling;
                _this.each(function(v) {
                    parent.insertBefore(i === 0 ? v : v.cloneNode(true), sibling);
                });
            });
            return this;
        },
        insertBefore: function insertBefore(selector) {
            var _this2 = this;
            cash(selector).each(function(el, i) {
                var parent = el.parentNode;
                _this2.each(function(v) {
                    parent.insertBefore(i === 0 ? v : v.cloneNode(true), el);
                });
            });
            return this;
        },
        prepend: function prepend(content) {
            insertContent(this, content, true);
            return this;
        },
        prependTo: function prependTo(parent) {
            insertContent(cash(parent), this, true);
            return this;
        },
        remove: function remove() {
            return this.each(function(v) {
                if (!!v.parentNode) {
                    return v.parentNode.removeChild(v);
                }
            });
        },
        text: function text(content) {
            if (content === undefined) {
                return this[0].textContent;
            }
            return this.each(function(v) {
                return v.textContent = content;
            });
        }
    });
    var docEl = doc.documentElement;
    fn.extend({
        position: function position() {
            var el = this[0];
            return {
                left: el.offsetLeft,
                top: el.offsetTop
            };
        },
        offset: function offset() {
            var rect = this[0].getBoundingClientRect();
            return {
                top: rect.top + win.pageYOffset - docEl.clientTop,
                left: rect.left + win.pageXOffset - docEl.clientLeft
            };
        },
        offsetParent: function offsetParent() {
            return cash(this[0].offsetParent);
        }
    });
    fn.extend({
        children: function children(selector) {
            var elems = [];
            this.each(function(el) {
                push.apply(elems, el.children);
            });
            elems = unique(elems);
            return !selector ? elems : elems.filter(function(v) {
                return matches(v, selector);
            });
        },
        closest: function closest(selector) {
            if (!selector || this.length < 1) {
                return cash();
            }
            if (this.is(selector)) {
                return this.filter(selector);
            }
            return this.parent().closest(selector);
        },
        is: function is(selector) {
            if (!selector) {
                return false;
            }
            var match = false, comparator = getCompareFunction(selector);
            this.each(function(el) {
                match = comparator(el, selector);
                return !match;
            });
            return match;
        },
        find: function find(selector) {
            if (!selector || selector.nodeType) {
                return cash(selector && this.has(selector).length ? selector : null);
            }
            var elems = [];
            this.each(function(el) {
                push.apply(elems, _find(selector, el));
            });
            return unique(elems);
        },
        has: function has(selector) {
            var comparator = isString(selector) ? function(el) {
                return _find(selector, el).length !== 0;
            } : function(el) {
                return el.contains(selector);
            };
            return this.filter(comparator);
        },
        next: function next() {
            return cash(this[0].nextElementSibling);
        },
        not: function not(selector) {
            if (!selector) {
                return this;
            }
            var comparator = getCompareFunction(selector);
            return this.filter(function(el) {
                return !comparator(el, selector);
            });
        },
        parent: function parent() {
            var result = [];
            this.each(function(item) {
                if (item && item.parentNode) {
                    result.push(item.parentNode);
                }
            });
            return unique(result);
        },
        parents: function parents(selector) {
            var last, result = [];
            this.each(function(item) {
                last = item;
                while (last && last.parentNode && last !== doc.body.parentNode) {
                    last = last.parentNode;
                    if (!selector || selector && matches(last, selector)) {
                        result.push(last);
                    }
                }
            });
            return unique(result);
        },
        prev: function prev() {
            return cash(this[0].previousElementSibling);
        },
        siblings: function siblings(selector) {
            var collection = this.parent().children(selector), el = this[0];
            return collection.filter(function(i) {
                return i !== el;
            });
        }
    });
    return cash;
});

var Component = function() {
    function Component(classDef, el, options) {
        _classCallCheck(this, Component);
        if (!(el instanceof Element)) {
            console.error(Error(el + " is not an HTML Element"));
        }
        var ins = classDef.getInstance(el);
        if (!!ins) {
            ins.destroy();
        }
        this.el = el;
        this.$el = cash(el);
    }
    _createClass(Component, null, [ {
        key: "init",
        value: function init(classDef, els, options) {
            var instances = null;
            if (els instanceof Element) {
                instances = new classDef(els, options);
            } else if (!!els && (els.jquery || els.cash || els instanceof NodeList)) {
                var instancesArr = [];
                for (var i = 0; i < els.length; i++) {
                    instancesArr.push(new classDef(els[i], options));
                }
                instances = instancesArr;
            }
            return instances;
        }
    } ]);
    return Component;
}();

(function(window) {
    if (window.Package) {
        M = {};
    } else {
        window.M = {};
    }
    M.jQueryLoaded = !!window.jQuery;
})(window);

if (typeof define === "function" && define.amd) {
    define("M", [], function() {
        return M;
    });
} else if (typeof exports !== "undefined" && !exports.nodeType) {
    if (typeof module !== "undefined" && !module.nodeType && module.exports) {
        exports = module.exports = M;
    }
    exports["default"] = M;
} else {
    window.M = {};
}

M = M || window.M;

M.version = "1.0.0";

M.keys = {
    TAB: 9,
    ENTER: 13,
    ESC: 27,
    ARROW_UP: 38,
    ARROW_DOWN: 40
};

M.tabPressed = false;

M.keyDown = false;

var docHandleKeydown = function docHandleKeydown(e) {
    M.keyDown = true;
    if (e.which === M.keys.TAB || e.which === M.keys.ARROW_DOWN || e.which === M.keys.ARROW_UP) {
        M.tabPressed = true;
    }
};

var docHandleKeyup = function docHandleKeyup(e) {
    M.keyDown = false;
    if (e.which === M.keys.TAB || e.which === M.keys.ARROW_DOWN || e.which === M.keys.ARROW_UP) {
        M.tabPressed = false;
    }
};

var docHandleFocus = function docHandleFocus(e) {
    if (M.keyDown) {
        document.body.classList.add("keyboard-focused");
    }
};

var docHandleBlur = function docHandleBlur(e) {
    document.body.classList.remove("keyboard-focused");
};

document.addEventListener("keydown", docHandleKeydown, true);

document.addEventListener("keyup", docHandleKeyup, true);

document.addEventListener("focus", docHandleFocus, true);

document.addEventListener("blur", docHandleBlur, true);

M.initializeJqueryWrapper = function(plugin, pluginName, classRef) {
    jQuery.fn[pluginName] = function(methodOrOptions) {
        if (plugin.prototype[methodOrOptions]) {
            var params = Array.prototype.slice.call(arguments, 1);
            if (methodOrOptions.slice(0, 3) === "get") {
                var instance = this.first()[0][classRef];
                return instance[methodOrOptions].apply(instance, params);
            }
            return this.each(function() {
                var instance = this[classRef];
                instance[methodOrOptions].apply(instance, params);
            });
        } else if (_typeof(methodOrOptions) === "object" || !methodOrOptions) {
            plugin.init(this, arguments[0]);
            return this;
        }
        jQuery.error("Method ".concat(methodOrOptions, " does not exist on jQuery.").concat(pluginName));
    };
};

M.AutoInit = function(context) {
    var root = !!context ? context : document.body;
    var registry = {
        Autocomplete: root.querySelectorAll(".autocomplete:not(.no-autoinit)"),
        Carousel: root.querySelectorAll(".carousel:not(.no-autoinit)"),
        Chips: root.querySelectorAll(".chips:not(.no-autoinit)"),
        Collapsible: root.querySelectorAll(".collapsible:not(.no-autoinit)"),
        Datepicker: root.querySelectorAll(".datepicker:not(.no-autoinit)"),
        Dropdown: root.querySelectorAll(".dropdown-trigger:not(.no-autoinit)"),
        Materialbox: root.querySelectorAll(".materialboxed:not(.no-autoinit)"),
        Modal: root.querySelectorAll(".modal:not(.no-autoinit)"),
        Parallax: root.querySelectorAll(".parallax:not(.no-autoinit)"),
        Pushpin: root.querySelectorAll(".pushpin:not(.no-autoinit)"),
        ScrollSpy: root.querySelectorAll(".scrollspy:not(.no-autoinit)"),
        FormSelect: root.querySelectorAll("select:not(.no-autoinit)"),
        Sidenav: root.querySelectorAll(".sidenav:not(.no-autoinit)"),
        Tabs: root.querySelectorAll(".tabs:not(.no-autoinit)"),
        TapTarget: root.querySelectorAll(".tap-target:not(.no-autoinit)"),
        Timepicker: root.querySelectorAll(".timepicker:not(.no-autoinit)"),
        Tooltip: root.querySelectorAll(".tooltipped:not(.no-autoinit)"),
        FloatingActionButton: root.querySelectorAll(".fixed-action-btn:not(.no-autoinit)")
    };
    for (var pluginName in registry) {
        var plugin = M[pluginName];
        if (plugin && plugin !== null) {
            plugin.init(registry[pluginName]);
        }
    }
};

M.objectSelectorString = function(obj) {
    var tagStr = obj.prop("tagName") || "";
    var idStr = obj.attr("id") || "";
    var classStr = obj.attr("class") || "";
    return (tagStr + idStr + classStr).replace(/\s/g, "");
};

M.guid = function() {
    function s4() {
        return Math.floor((1 + Math.random()) * 65536).toString(16).substring(1);
    }
    return function() {
        return s4() + s4() + "-" + s4() + "-" + s4() + "-" + s4() + "-" + s4() + s4() + s4();
    };
}();

M.escapeHash = function(hash) {
    return hash.replace(/(:|\.|\[|\]|,|=|\/)/g, "\\$1");
};

M.elementOrParentIsFixed = function(element) {
    var $element = $(element);
    var $checkElements = $element.add($element.parents());
    var isFixed = false;
    $checkElements.each(function() {
        if ($(this).css("position") === "fixed") {
            isFixed = true;
            return false;
        }
    });
    return isFixed;
};

M.checkWithinContainer = function(container, bounding, offset) {
    var edges = {
        top: false,
        right: false,
        bottom: false,
        left: false
    };
    var containerRect = container.getBoundingClientRect();
    var containerBottom = container === document.body ? Math.max(containerRect.bottom, window.innerHeight) : containerRect.bottom;
    var scrollLeft = container.scrollLeft;
    var scrollTop = container.scrollTop;
    var scrolledX = bounding.left - scrollLeft;
    var scrolledY = bounding.top - scrollTop;
    if (scrolledX < containerRect.left + offset || scrolledX < offset) {
        edges.left = true;
    }
    if (scrolledX + bounding.width > containerRect.right - offset || scrolledX + bounding.width > window.innerWidth - offset) {
        edges.right = true;
    }
    if (scrolledY < containerRect.top + offset || scrolledY < offset) {
        edges.top = true;
    }
    if (scrolledY + bounding.height > containerBottom - offset || scrolledY + bounding.height > window.innerHeight - offset) {
        edges.bottom = true;
    }
    return edges;
};

M.checkPossibleAlignments = function(el, container, bounding, offset) {
    var canAlign = {
        top: true,
        right: true,
        bottom: true,
        left: true,
        spaceOnTop: null,
        spaceOnRight: null,
        spaceOnBottom: null,
        spaceOnLeft: null
    };
    var containerAllowsOverflow = getComputedStyle(container).overflow === "visible";
    var containerRect = container.getBoundingClientRect();
    var containerHeight = Math.min(containerRect.height, window.innerHeight);
    var containerWidth = Math.min(containerRect.width, window.innerWidth);
    var elOffsetRect = el.getBoundingClientRect();
    var scrollLeft = container.scrollLeft;
    var scrollTop = container.scrollTop;
    var scrolledX = bounding.left - scrollLeft;
    var scrolledYTopEdge = bounding.top - scrollTop;
    var scrolledYBottomEdge = bounding.top + elOffsetRect.height - scrollTop;
    canAlign.spaceOnRight = !containerAllowsOverflow ? containerWidth - (scrolledX + bounding.width) : window.innerWidth - (elOffsetRect.left + bounding.width);
    if (canAlign.spaceOnRight < 0) {
        canAlign.left = false;
    }
    canAlign.spaceOnLeft = !containerAllowsOverflow ? scrolledX - bounding.width + elOffsetRect.width : elOffsetRect.right - bounding.width;
    if (canAlign.spaceOnLeft < 0) {
        canAlign.right = false;
    }
    canAlign.spaceOnBottom = !containerAllowsOverflow ? containerHeight - (scrolledYTopEdge + bounding.height + offset) : window.innerHeight - (elOffsetRect.top + bounding.height + offset);
    if (canAlign.spaceOnBottom < 0) {
        canAlign.top = false;
    }
    canAlign.spaceOnTop = !containerAllowsOverflow ? scrolledYBottomEdge - (bounding.height - offset) : elOffsetRect.bottom - (bounding.height + offset);
    if (canAlign.spaceOnTop < 0) {
        canAlign.bottom = false;
    }
    return canAlign;
};

M.getOverflowParent = function(element) {
    if (element == null) {
        return null;
    }
    if (element === document.body || getComputedStyle(element).overflow !== "visible") {
        return element;
    }
    return M.getOverflowParent(element.parentElement);
};

M.getIdFromTrigger = function(trigger) {
    var id = trigger.getAttribute("data-target");
    if (!id) {
        id = trigger.getAttribute("href");
        if (id) {
            id = id.slice(1);
        } else {
            id = "";
        }
    }
    return id;
};

M.getDocumentScrollTop = function() {
    return window.pageYOffset || document.documentElement.scrollTop || document.body.scrollTop || 0;
};

M.getDocumentScrollLeft = function() {
    return window.pageXOffset || document.documentElement.scrollLeft || document.body.scrollLeft || 0;
};

var getTime = Date.now || function() {
    return new Date().getTime();
};

M.throttle = function(func, wait, options) {
    var context, args, result;
    var timeout = null;
    var previous = 0;
    options || (options = {});
    var later = function later() {
        previous = options.leading === false ? 0 : getTime();
        timeout = null;
        result = func.apply(context, args);
        context = args = null;
    };
    return function() {
        var now = getTime();
        if (!previous && options.leading === false) previous = now;
        var remaining = wait - (now - previous);
        context = this;
        args = arguments;
        if (remaining <= 0) {
            clearTimeout(timeout);
            timeout = null;
            previous = now;
            result = func.apply(context, args);
            context = args = null;
        } else if (!timeout && options.trailing !== false) {
            timeout = setTimeout(later, remaining);
        }
        return result;
    };
};

var $jscomp = {
    scope: {}
};

$jscomp.defineProperty = "function" == typeof Object.defineProperties ? Object.defineProperty : function(e, r, p) {
    if (p.get || p.set) throw new TypeError("ES3 does not support getters and setters.");
    e != Array.prototype && e != Object.prototype && (e[r] = p.value);
};

$jscomp.getGlobal = function(e) {
    return "undefined" != typeof window && window === e ? e : "undefined" != typeof global && null != global ? global : e;
};

$jscomp.global = $jscomp.getGlobal(void 0);

$jscomp.SYMBOL_PREFIX = "jscomp_symbol_";

$jscomp.initSymbol = function() {
    $jscomp.initSymbol = function() {};
    $jscomp.global.Symbol || ($jscomp.global.Symbol = $jscomp.Symbol);
};

$jscomp.symbolCounter_ = 0;

$jscomp.Symbol = function(e) {
    return $jscomp.SYMBOL_PREFIX + (e || "") + $jscomp.symbolCounter_++;
};

$jscomp.initSymbolIterator = function() {
    $jscomp.initSymbol();
    var e = $jscomp.global.Symbol.iterator;
    e || (e = $jscomp.global.Symbol.iterator = $jscomp.global.Symbol("iterator"));
    "function" != typeof Array.prototype[e] && $jscomp.defineProperty(Array.prototype, e, {
        configurable: !0,
        writable: !0,
        value: function value() {
            return $jscomp.arrayIterator(this);
        }
    });
    $jscomp.initSymbolIterator = function() {};
};

$jscomp.arrayIterator = function(e) {
    var r = 0;
    return $jscomp.iteratorPrototype(function() {
        return r < e.length ? {
            done: !1,
            value: e[r++]
        } : {
            done: !0
        };
    });
};

$jscomp.iteratorPrototype = function(e) {
    $jscomp.initSymbolIterator();
    e = {
        next: e
    };
    e[$jscomp.global.Symbol.iterator] = function() {
        return this;
    };
    return e;
};

$jscomp.array = $jscomp.array || {};

$jscomp.iteratorFromArray = function(e, r) {
    $jscomp.initSymbolIterator();
    e instanceof String && (e += "");
    var p = 0, m = {
        next: function next() {
            if (p < e.length) {
                var u = p++;
                return {
                    value: r(u, e[u]),
                    done: !1
                };
            }
            m.next = function() {
                return {
                    done: !0,
                    value: void 0
                };
            };
            return m.next();
        }
    };
    m[Symbol.iterator] = function() {
        return m;
    };
    return m;
};

$jscomp.polyfill = function(e, r, p, m) {
    if (r) {
        p = $jscomp.global;
        e = e.split(".");
        for (m = 0; m < e.length - 1; m++) {
            var u = e[m];
            u in p || (p[u] = {});
            p = p[u];
        }
        e = e[e.length - 1];
        m = p[e];
        r = r(m);
        r != m && null != r && $jscomp.defineProperty(p, e, {
            configurable: !0,
            writable: !0,
            value: r
        });
    }
};

$jscomp.polyfill("Array.prototype.keys", function(e) {
    return e ? e : function() {
        return $jscomp.iteratorFromArray(this, function(e) {
            return e;
        });
    };
}, "es6-impl", "es3");

var $jscomp$this = void 0;

(function(r) {
    M.anime = r();
})(function() {
    function e(a) {
        if (!h.col(a)) try {
            return document.querySelectorAll(a);
        } catch (c) {}
    }
    function r(a, c) {
        for (var d = a.length, b = 2 <= arguments.length ? arguments[1] : void 0, f = [], n = 0; n < d; n++) {
            if (n in a) {
                var k = a[n];
                c.call(b, k, n, a) && f.push(k);
            }
        }
        return f;
    }
    function p(a) {
        return a.reduce(function(a, d) {
            return a.concat(h.arr(d) ? p(d) : d);
        }, []);
    }
    function m(a) {
        if (h.arr(a)) return a;
        h.str(a) && (a = e(a) || a);
        return a instanceof NodeList || a instanceof HTMLCollection ? [].slice.call(a) : [ a ];
    }
    function u(a, c) {
        return a.some(function(a) {
            return a === c;
        });
    }
    function C(a) {
        var c = {}, d;
        for (d in a) {
            c[d] = a[d];
        }
        return c;
    }
    function D(a, c) {
        var d = C(a), b;
        for (b in a) {
            d[b] = c.hasOwnProperty(b) ? c[b] : a[b];
        }
        return d;
    }
    function z(a, c) {
        var d = C(a), b;
        for (b in c) {
            d[b] = h.und(a[b]) ? c[b] : a[b];
        }
        return d;
    }
    function T(a) {
        a = a.replace(/^#?([a-f\d])([a-f\d])([a-f\d])$/i, function(a, c, d, k) {
            return c + c + d + d + k + k;
        });
        var c = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(a);
        a = parseInt(c[1], 16);
        var d = parseInt(c[2], 16), c = parseInt(c[3], 16);
        return "rgba(" + a + "," + d + "," + c + ",1)";
    }
    function U(a) {
        function c(a, c, b) {
            0 > b && (b += 1);
            1 < b && --b;
            return b < 1 / 6 ? a + 6 * (c - a) * b : .5 > b ? c : b < 2 / 3 ? a + (c - a) * (2 / 3 - b) * 6 : a;
        }
        var d = /hsl\((\d+),\s*([\d.]+)%,\s*([\d.]+)%\)/g.exec(a) || /hsla\((\d+),\s*([\d.]+)%,\s*([\d.]+)%,\s*([\d.]+)\)/g.exec(a);
        a = parseInt(d[1]) / 360;
        var b = parseInt(d[2]) / 100, f = parseInt(d[3]) / 100, d = d[4] || 1;
        if (0 == b) f = b = a = f; else {
            var n = .5 > f ? f * (1 + b) : f + b - f * b, k = 2 * f - n, f = c(k, n, a + 1 / 3), b = c(k, n, a);
            a = c(k, n, a - 1 / 3);
        }
        return "rgba(" + 255 * f + "," + 255 * b + "," + 255 * a + "," + d + ")";
    }
    function y(a) {
        if (a = /([\+\-]?[0-9#\.]+)(%|px|pt|em|rem|in|cm|mm|ex|ch|pc|vw|vh|vmin|vmax|deg|rad|turn)?$/.exec(a)) return a[2];
    }
    function V(a) {
        if (-1 < a.indexOf("translate") || "perspective" === a) return "px";
        if (-1 < a.indexOf("rotate") || -1 < a.indexOf("skew")) return "deg";
    }
    function I(a, c) {
        return h.fnc(a) ? a(c.target, c.id, c.total) : a;
    }
    function E(a, c) {
        if (c in a.style) return getComputedStyle(a).getPropertyValue(c.replace(/([a-z])([A-Z])/g, "$1-$2").toLowerCase()) || "0";
    }
    function J(a, c) {
        if (h.dom(a) && u(W, c)) return "transform";
        if (h.dom(a) && (a.getAttribute(c) || h.svg(a) && a[c])) return "attribute";
        if (h.dom(a) && "transform" !== c && E(a, c)) return "css";
        if (null != a[c]) return "object";
    }
    function X(a, c) {
        var d = V(c), d = -1 < c.indexOf("scale") ? 1 : 0 + d;
        a = a.style.transform;
        if (!a) return d;
        for (var b = [], f = [], n = [], k = /(\w+)\((.+?)\)/g; b = k.exec(a); ) {
            f.push(b[1]), n.push(b[2]);
        }
        a = r(n, function(a, b) {
            return f[b] === c;
        });
        return a.length ? a[0] : d;
    }
    function K(a, c) {
        switch (J(a, c)) {
          case "transform":
            return X(a, c);

          case "css":
            return E(a, c);

          case "attribute":
            return a.getAttribute(c);
        }
        return a[c] || 0;
    }
    function L(a, c) {
        var d = /^(\*=|\+=|-=)/.exec(a);
        if (!d) return a;
        var b = y(a) || 0;
        c = parseFloat(c);
        a = parseFloat(a.replace(d[0], ""));
        switch (d[0][0]) {
          case "+":
            return c + a + b;

          case "-":
            return c - a + b;

          case "*":
            return c * a + b;
        }
    }
    function F(a, c) {
        return Math.sqrt(Math.pow(c.x - a.x, 2) + Math.pow(c.y - a.y, 2));
    }
    function M(a) {
        a = a.points;
        for (var c = 0, d, b = 0; b < a.numberOfItems; b++) {
            var f = a.getItem(b);
            0 < b && (c += F(d, f));
            d = f;
        }
        return c;
    }
    function N(a) {
        if (a.getTotalLength) return a.getTotalLength();
        switch (a.tagName.toLowerCase()) {
          case "circle":
            return 2 * Math.PI * a.getAttribute("r");

          case "rect":
            return 2 * a.getAttribute("width") + 2 * a.getAttribute("height");

          case "line":
            return F({
                x: a.getAttribute("x1"),
                y: a.getAttribute("y1")
            }, {
                x: a.getAttribute("x2"),
                y: a.getAttribute("y2")
            });

          case "polyline":
            return M(a);

          case "polygon":
            var c = a.points;
            return M(a) + F(c.getItem(c.numberOfItems - 1), c.getItem(0));
        }
    }
    function Y(a, c) {
        function d(b) {
            b = void 0 === b ? 0 : b;
            return a.el.getPointAtLength(1 <= c + b ? c + b : 0);
        }
        var b = d(), f = d(-1), n = d(1);
        switch (a.property) {
          case "x":
            return b.x;

          case "y":
            return b.y;

          case "angle":
            return 180 * Math.atan2(n.y - f.y, n.x - f.x) / Math.PI;
        }
    }
    function O(a, c) {
        var d = /-?\d*\.?\d+/g, b;
        b = h.pth(a) ? a.totalLength : a;
        if (h.col(b)) {
            if (h.rgb(b)) {
                var f = /rgb\((\d+,\s*[\d]+,\s*[\d]+)\)/g.exec(b);
                b = f ? "rgba(" + f[1] + ",1)" : b;
            } else b = h.hex(b) ? T(b) : h.hsl(b) ? U(b) : void 0;
        } else f = (f = y(b)) ? b.substr(0, b.length - f.length) : b, b = c && !/\s/g.test(b) ? f + c : f;
        b += "";
        return {
            original: b,
            numbers: b.match(d) ? b.match(d).map(Number) : [ 0 ],
            strings: h.str(a) || c ? b.split(d) : []
        };
    }
    function P(a) {
        a = a ? p(h.arr(a) ? a.map(m) : m(a)) : [];
        return r(a, function(a, d, b) {
            return b.indexOf(a) === d;
        });
    }
    function Z(a) {
        var c = P(a);
        return c.map(function(a, b) {
            return {
                target: a,
                id: b,
                total: c.length
            };
        });
    }
    function aa(a, c) {
        var d = C(c);
        if (h.arr(a)) {
            var b = a.length;
            2 !== b || h.obj(a[0]) ? h.fnc(c.duration) || (d.duration = c.duration / b) : a = {
                value: a
            };
        }
        return m(a).map(function(a, b) {
            b = b ? 0 : c.delay;
            a = h.obj(a) && !h.pth(a) ? a : {
                value: a
            };
            h.und(a.delay) && (a.delay = b);
            return a;
        }).map(function(a) {
            return z(a, d);
        });
    }
    function ba(a, c) {
        var d = {}, b;
        for (b in a) {
            var f = I(a[b], c);
            h.arr(f) && (f = f.map(function(a) {
                return I(a, c);
            }), 1 === f.length && (f = f[0]));
            d[b] = f;
        }
        d.duration = parseFloat(d.duration);
        d.delay = parseFloat(d.delay);
        return d;
    }
    function ca(a) {
        return h.arr(a) ? A.apply(this, a) : Q[a];
    }
    function da(a, c) {
        var d;
        return a.tweens.map(function(b) {
            b = ba(b, c);
            var f = b.value, e = K(c.target, a.name), k = d ? d.to.original : e, k = h.arr(f) ? f[0] : k, w = L(h.arr(f) ? f[1] : f, k), e = y(w) || y(k) || y(e);
            b.from = O(k, e);
            b.to = O(w, e);
            b.start = d ? d.end : a.offset;
            b.end = b.start + b.delay + b.duration;
            b.easing = ca(b.easing);
            b.elasticity = (1e3 - Math.min(Math.max(b.elasticity, 1), 999)) / 1e3;
            b.isPath = h.pth(f);
            b.isColor = h.col(b.from.original);
            b.isColor && (b.round = 1);
            return d = b;
        });
    }
    function ea(a, c) {
        return r(p(a.map(function(a) {
            return c.map(function(b) {
                var c = J(a.target, b.name);
                if (c) {
                    var d = da(b, a);
                    b = {
                        type: c,
                        property: b.name,
                        animatable: a,
                        tweens: d,
                        duration: d[d.length - 1].end,
                        delay: d[0].delay
                    };
                } else b = void 0;
                return b;
            });
        })), function(a) {
            return !h.und(a);
        });
    }
    function R(a, c, d, b) {
        var f = "delay" === a;
        return c.length ? (f ? Math.min : Math.max).apply(Math, c.map(function(b) {
            return b[a];
        })) : f ? b.delay : d.offset + b.delay + b.duration;
    }
    function fa(a) {
        var c = D(ga, a), d = D(S, a), b = Z(a.targets), f = [], e = z(c, d), k;
        for (k in a) {
            e.hasOwnProperty(k) || "targets" === k || f.push({
                name: k,
                offset: e.offset,
                tweens: aa(a[k], d)
            });
        }
        a = ea(b, f);
        return z(c, {
            children: [],
            animatables: b,
            animations: a,
            duration: R("duration", a, c, d),
            delay: R("delay", a, c, d)
        });
    }
    function q(a) {
        function c() {
            return window.Promise && new Promise(function(a) {
                return p = a;
            });
        }
        function d(a) {
            return g.reversed ? g.duration - a : a;
        }
        function b(a) {
            for (var b = 0, c = {}, d = g.animations, f = d.length; b < f; ) {
                var e = d[b], k = e.animatable, h = e.tweens, n = h.length - 1, l = h[n];
                n && (l = r(h, function(b) {
                    return a < b.end;
                })[0] || l);
                for (var h = Math.min(Math.max(a - l.start - l.delay, 0), l.duration) / l.duration, w = isNaN(h) ? 1 : l.easing(h, l.elasticity), h = l.to.strings, p = l.round, n = [], m = void 0, m = l.to.numbers.length, t = 0; t < m; t++) {
                    var x = void 0, x = l.to.numbers[t], q = l.from.numbers[t], x = l.isPath ? Y(l.value, w * x) : q + w * (x - q);
                    p && (l.isColor && 2 < t || (x = Math.round(x * p) / p));
                    n.push(x);
                }
                if (l = h.length) for (m = h[0], w = 0; w < l; w++) {
                    p = h[w + 1], t = n[w], isNaN(t) || (m = p ? m + (t + p) : m + (t + " "));
                } else m = n[0];
                ha[e.type](k.target, e.property, m, c, k.id);
                e.currentValue = m;
                b++;
            }
            if (b = Object.keys(c).length) for (d = 0; d < b; d++) {
                H || (H = E(document.body, "transform") ? "transform" : "-webkit-transform"), g.animatables[d].target.style[H] = c[d].join(" ");
            }
            g.currentTime = a;
            g.progress = a / g.duration * 100;
        }
        function f(a) {
            if (g[a]) g[a](g);
        }
        function e() {
            g.remaining && !0 !== g.remaining && g.remaining--;
        }
        function k(a) {
            var k = g.duration, n = g.offset, w = n + g.delay, r = g.currentTime, x = g.reversed, q = d(a);
            if (g.children.length) {
                var u = g.children, v = u.length;
                if (q >= g.currentTime) for (var G = 0; G < v; G++) {
                    u[G].seek(q);
                } else for (;v--; ) {
                    u[v].seek(q);
                }
            }
            if (q >= w || !k) g.began || (g.began = !0, f("begin")), f("run");
            if (q > n && q < k) b(q); else if (q <= n && 0 !== r && (b(0), x && e()), q >= k && r !== k || !k) b(k), 
            x || e();
            f("update");
            a >= k && (g.remaining ? (t = h, "alternate" === g.direction && (g.reversed = !g.reversed)) : (g.pause(), 
            g.completed || (g.completed = !0, f("complete"), "Promise" in window && (p(), m = c()))), 
            l = 0);
        }
        a = void 0 === a ? {} : a;
        var h, t, l = 0, p = null, m = c(), g = fa(a);
        g.reset = function() {
            var a = g.direction, c = g.loop;
            g.currentTime = 0;
            g.progress = 0;
            g.paused = !0;
            g.began = !1;
            g.completed = !1;
            g.reversed = "reverse" === a;
            g.remaining = "alternate" === a && 1 === c ? 2 : c;
            b(0);
            for (a = g.children.length; a--; ) {
                g.children[a].reset();
            }
        };
        g.tick = function(a) {
            h = a;
            t || (t = h);
            k((l + h - t) * q.speed);
        };
        g.seek = function(a) {
            k(d(a));
        };
        g.pause = function() {
            var a = v.indexOf(g);
            -1 < a && v.splice(a, 1);
            g.paused = !0;
        };
        g.play = function() {
            g.paused && (g.paused = !1, t = 0, l = d(g.currentTime), v.push(g), B || ia());
        };
        g.reverse = function() {
            g.reversed = !g.reversed;
            t = 0;
            l = d(g.currentTime);
        };
        g.restart = function() {
            g.pause();
            g.reset();
            g.play();
        };
        g.finished = m;
        g.reset();
        g.autoplay && g.play();
        return g;
    }
    var ga = {
        update: void 0,
        begin: void 0,
        run: void 0,
        complete: void 0,
        loop: 1,
        direction: "normal",
        autoplay: !0,
        offset: 0
    }, S = {
        duration: 1e3,
        delay: 0,
        easing: "easeOutElastic",
        elasticity: 500,
        round: 0
    }, W = "translateX translateY translateZ rotate rotateX rotateY rotateZ scale scaleX scaleY scaleZ skewX skewY perspective".split(" "), H, h = {
        arr: function arr(a) {
            return Array.isArray(a);
        },
        obj: function obj(a) {
            return -1 < Object.prototype.toString.call(a).indexOf("Object");
        },
        pth: function pth(a) {
            return h.obj(a) && a.hasOwnProperty("totalLength");
        },
        svg: function svg(a) {
            return a instanceof SVGElement;
        },
        dom: function dom(a) {
            return a.nodeType || h.svg(a);
        },
        str: function str(a) {
            return "string" === typeof a;
        },
        fnc: function fnc(a) {
            return "function" === typeof a;
        },
        und: function und(a) {
            return "undefined" === typeof a;
        },
        hex: function hex(a) {
            return /(^#[0-9A-F]{6}$)|(^#[0-9A-F]{3}$)/i.test(a);
        },
        rgb: function rgb(a) {
            return /^rgb/.test(a);
        },
        hsl: function hsl(a) {
            return /^hsl/.test(a);
        },
        col: function col(a) {
            return h.hex(a) || h.rgb(a) || h.hsl(a);
        }
    }, A = function() {
        function a(a, d, b) {
            return (((1 - 3 * b + 3 * d) * a + (3 * b - 6 * d)) * a + 3 * d) * a;
        }
        return function(c, d, b, f) {
            if (0 <= c && 1 >= c && 0 <= b && 1 >= b) {
                var e = new Float32Array(11);
                if (c !== d || b !== f) for (var k = 0; 11 > k; ++k) {
                    e[k] = a(.1 * k, c, b);
                }
                return function(k) {
                    if (c === d && b === f) return k;
                    if (0 === k) return 0;
                    if (1 === k) return 1;
                    for (var h = 0, l = 1; 10 !== l && e[l] <= k; ++l) {
                        h += .1;
                    }
                    --l;
                    var l = h + (k - e[l]) / (e[l + 1] - e[l]) * .1, n = 3 * (1 - 3 * b + 3 * c) * l * l + 2 * (3 * b - 6 * c) * l + 3 * c;
                    if (.001 <= n) {
                        for (h = 0; 4 > h; ++h) {
                            n = 3 * (1 - 3 * b + 3 * c) * l * l + 2 * (3 * b - 6 * c) * l + 3 * c;
                            if (0 === n) break;
                            var m = a(l, c, b) - k, l = l - m / n;
                        }
                        k = l;
                    } else if (0 === n) k = l; else {
                        var l = h, h = h + .1, g = 0;
                        do {
                            m = l + (h - l) / 2, n = a(m, c, b) - k, 0 < n ? h = m : l = m;
                        } while (1e-7 < Math.abs(n) && 10 > ++g);
                        k = m;
                    }
                    return a(k, d, f);
                };
            }
        };
    }(), Q = function() {
        function a(a, b) {
            return 0 === a || 1 === a ? a : -Math.pow(2, 10 * (a - 1)) * Math.sin(2 * (a - 1 - b / (2 * Math.PI) * Math.asin(1)) * Math.PI / b);
        }
        var c = "Quad Cubic Quart Quint Sine Expo Circ Back Elastic".split(" "), d = {
            In: [ [ .55, .085, .68, .53 ], [ .55, .055, .675, .19 ], [ .895, .03, .685, .22 ], [ .755, .05, .855, .06 ], [ .47, 0, .745, .715 ], [ .95, .05, .795, .035 ], [ .6, .04, .98, .335 ], [ .6, -.28, .735, .045 ], a ],
            Out: [ [ .25, .46, .45, .94 ], [ .215, .61, .355, 1 ], [ .165, .84, .44, 1 ], [ .23, 1, .32, 1 ], [ .39, .575, .565, 1 ], [ .19, 1, .22, 1 ], [ .075, .82, .165, 1 ], [ .175, .885, .32, 1.275 ], function(b, c) {
                return 1 - a(1 - b, c);
            } ],
            InOut: [ [ .455, .03, .515, .955 ], [ .645, .045, .355, 1 ], [ .77, 0, .175, 1 ], [ .86, 0, .07, 1 ], [ .445, .05, .55, .95 ], [ 1, 0, 0, 1 ], [ .785, .135, .15, .86 ], [ .68, -.55, .265, 1.55 ], function(b, c) {
                return .5 > b ? a(2 * b, c) / 2 : 1 - a(-2 * b + 2, c) / 2;
            } ]
        }, b = {
            linear: A(.25, .25, .75, .75)
        }, f = {}, e;
        for (e in d) {
            f.type = e, d[f.type].forEach(function(a) {
                return function(d, f) {
                    b["ease" + a.type + c[f]] = h.fnc(d) ? d : A.apply($jscomp$this, d);
                };
            }(f)), f = {
                type: f.type
            };
        }
        return b;
    }(), ha = {
        css: function css(a, c, d) {
            return a.style[c] = d;
        },
        attribute: function attribute(a, c, d) {
            return a.setAttribute(c, d);
        },
        object: function object(a, c, d) {
            return a[c] = d;
        },
        transform: function transform(a, c, d, b, f) {
            b[f] || (b[f] = []);
            b[f].push(c + "(" + d + ")");
        }
    }, v = [], B = 0, ia = function() {
        function a() {
            B = requestAnimationFrame(c);
        }
        function c(c) {
            var b = v.length;
            if (b) {
                for (var d = 0; d < b; ) {
                    v[d] && v[d].tick(c), d++;
                }
                a();
            } else cancelAnimationFrame(B), B = 0;
        }
        return a;
    }();
    q.version = "2.2.0";
    q.speed = 1;
    q.running = v;
    q.remove = function(a) {
        a = P(a);
        for (var c = v.length; c--; ) {
            for (var d = v[c], b = d.animations, f = b.length; f--; ) {
                u(a, b[f].animatable.target) && (b.splice(f, 1), b.length || d.pause());
            }
        }
    };
    q.getValue = K;
    q.path = function(a, c) {
        var d = h.str(a) ? e(a)[0] : a, b = c || 100;
        return function(a) {
            return {
                el: d,
                property: a,
                totalLength: N(d) * (b / 100)
            };
        };
    };
    q.setDashoffset = function(a) {
        var c = N(a);
        a.setAttribute("stroke-dasharray", c);
        return c;
    };
    q.bezier = A;
    q.easings = Q;
    q.timeline = function(a) {
        var c = q(a);
        c.pause();
        c.duration = 0;
        c.add = function(d) {
            c.children.forEach(function(a) {
                a.began = !0;
                a.completed = !0;
            });
            m(d).forEach(function(b) {
                var d = z(b, D(S, a || {}));
                d.targets = d.targets || a.targets;
                b = c.duration;
                var e = d.offset;
                d.autoplay = !1;
                d.direction = c.direction;
                d.offset = h.und(e) ? b : L(e, b);
                c.began = !0;
                c.completed = !0;
                c.seek(d.offset);
                d = q(d);
                d.began = !0;
                d.completed = !0;
                d.duration > b && (c.duration = d.duration);
                c.children.push(d);
            });
            c.seek(0);
            c.reset();
            c.autoplay && c.restart();
            return c;
        };
        return c;
    };
    q.random = function(a, c) {
        return Math.floor(Math.random() * (c - a + 1)) + a;
    };
    return q;
});

(function($, anim) {
    "use strict";
    var _defaults = {
        accordion: true,
        onOpenStart: undefined,
        onOpenEnd: undefined,
        onCloseStart: undefined,
        onCloseEnd: undefined,
        inDuration: 300,
        outDuration: 300
    };
    var Collapsible = function(_Component) {
        _inherits(Collapsible, _Component);
        function Collapsible(el, options) {
            var _this3;
            _classCallCheck(this, Collapsible);
            _this3 = _possibleConstructorReturn(this, _getPrototypeOf(Collapsible).call(this, Collapsible, el, options));
            _this3.el.M_Collapsible = _assertThisInitialized(_this3);
            _this3.options = $.extend({}, Collapsible.defaults, options);
            _this3.$headers = _this3.$el.children("li").children(".collapsible-header");
            _this3.$headers.attr("tabindex", 0);
            _this3._setupEventHandlers();
            var $activeBodies = _this3.$el.children("li.active").children(".collapsible-body");
            if (_this3.options.accordion) {
                $activeBodies.first().css("display", "block");
            } else {
                $activeBodies.css("display", "block");
            }
            return _this3;
        }
        _createClass(Collapsible, [ {
            key: "destroy",
            value: function destroy() {
                this._removeEventHandlers();
                this.el.M_Collapsible = undefined;
            }
        }, {
            key: "_setupEventHandlers",
            value: function _setupEventHandlers() {
                var _this4 = this;
                this._handleCollapsibleClickBound = this._handleCollapsibleClick.bind(this);
                this._handleCollapsibleKeydownBound = this._handleCollapsibleKeydown.bind(this);
                this.el.addEventListener("click", this._handleCollapsibleClickBound);
                this.$headers.each(function(header) {
                    header.addEventListener("keydown", _this4._handleCollapsibleKeydownBound);
                });
            }
        }, {
            key: "_removeEventHandlers",
            value: function _removeEventHandlers() {
                var _this5 = this;
                this.el.removeEventListener("click", this._handleCollapsibleClickBound);
                this.$headers.each(function(header) {
                    header.removeEventListener("keydown", _this5._handleCollapsibleKeydownBound);
                });
            }
        }, {
            key: "_handleCollapsibleClick",
            value: function _handleCollapsibleClick(e) {
                var $header = $(e.target).closest(".collapsible-header");
                if (e.target && $header.length) {
                    var $collapsible = $header.closest(".collapsible");
                    if ($collapsible[0] === this.el) {
                        var $collapsibleLi = $header.closest("li");
                        var $collapsibleLis = $collapsible.children("li");
                        var isActive = $collapsibleLi[0].classList.contains("active");
                        var index = $collapsibleLis.index($collapsibleLi);
                        if (isActive) {
                            this.close(index);
                        } else {
                            this.open(index);
                        }
                    }
                }
            }
        }, {
            key: "_handleCollapsibleKeydown",
            value: function _handleCollapsibleKeydown(e) {
                if (e.keyCode === 13) {
                    this._handleCollapsibleClickBound(e);
                }
            }
        }, {
            key: "_animateIn",
            value: function _animateIn(index) {
                var _this6 = this;
                var $collapsibleLi = this.$el.children("li").eq(index);
                if ($collapsibleLi.length) {
                    var $body = $collapsibleLi.children(".collapsible-body");
                    anim.remove($body[0]);
                    $body.css({
                        display: "block",
                        overflow: "hidden",
                        height: 0,
                        paddingTop: "",
                        paddingBottom: ""
                    });
                    var pTop = $body.css("padding-top");
                    var pBottom = $body.css("padding-bottom");
                    var finalHeight = $body[0].scrollHeight;
                    $body.css({
                        paddingTop: 0,
                        paddingBottom: 0
                    });
                    anim({
                        targets: $body[0],
                        height: finalHeight,
                        paddingTop: pTop,
                        paddingBottom: pBottom,
                        duration: this.options.inDuration,
                        easing: "easeInOutCubic",
                        complete: function complete(anim) {
                            $body.css({
                                overflow: "",
                                paddingTop: "",
                                paddingBottom: "",
                                height: ""
                            });
                            if (typeof _this6.options.onOpenEnd === "function") {
                                _this6.options.onOpenEnd.call(_this6, $collapsibleLi[0]);
                            }
                        }
                    });
                }
            }
        }, {
            key: "_animateOut",
            value: function _animateOut(index) {
                var _this7 = this;
                var $collapsibleLi = this.$el.children("li").eq(index);
                if ($collapsibleLi.length) {
                    var $body = $collapsibleLi.children(".collapsible-body");
                    anim.remove($body[0]);
                    $body.css("overflow", "hidden");
                    anim({
                        targets: $body[0],
                        height: 0,
                        paddingTop: 0,
                        paddingBottom: 0,
                        duration: this.options.outDuration,
                        easing: "easeInOutCubic",
                        complete: function complete() {
                            $body.css({
                                height: "",
                                overflow: "",
                                padding: "",
                                display: ""
                            });
                            if (typeof _this7.options.onCloseEnd === "function") {
                                _this7.options.onCloseEnd.call(_this7, $collapsibleLi[0]);
                            }
                        }
                    });
                }
            }
        }, {
            key: "open",
            value: function open(index) {
                var _this8 = this;
                var $collapsibleLi = this.$el.children("li").eq(index);
                if ($collapsibleLi.length && !$collapsibleLi[0].classList.contains("active")) {
                    if (typeof this.options.onOpenStart === "function") {
                        this.options.onOpenStart.call(this, $collapsibleLi[0]);
                    }
                    if (this.options.accordion) {
                        var $collapsibleLis = this.$el.children("li");
                        var $activeLis = this.$el.children("li.active");
                        $activeLis.each(function(el) {
                            var index = $collapsibleLis.index($(el));
                            _this8.close(index);
                        });
                    }
                    $collapsibleLi[0].classList.add("active");
                    this._animateIn(index);
                }
            }
        }, {
            key: "close",
            value: function close(index) {
                var $collapsibleLi = this.$el.children("li").eq(index);
                if ($collapsibleLi.length && $collapsibleLi[0].classList.contains("active")) {
                    if (typeof this.options.onCloseStart === "function") {
                        this.options.onCloseStart.call(this, $collapsibleLi[0]);
                    }
                    $collapsibleLi[0].classList.remove("active");
                    this._animateOut(index);
                }
            }
        } ], [ {
            key: "init",
            value: function init(els, options) {
                return _get(_getPrototypeOf(Collapsible), "init", this).call(this, this, els, options);
            }
        }, {
            key: "getInstance",
            value: function getInstance(el) {
                var domElem = !!el.jquery ? el[0] : el;
                return domElem.M_Collapsible;
            }
        }, {
            key: "defaults",
            get: function get() {
                return _defaults;
            }
        } ]);
        return Collapsible;
    }(Component);
    M.Collapsible = Collapsible;
    if (M.jQueryLoaded) {
        M.initializeJqueryWrapper(Collapsible, "collapsible", "M_Collapsible");
    }
})(cash, M.anime);

(function($, anim) {
    "use strict";
    var _defaults = {
        alignment: "left",
        autoFocus: true,
        constrainWidth: true,
        container: null,
        coverTrigger: true,
        closeOnClick: true,
        hover: false,
        inDuration: 150,
        outDuration: 250,
        onOpenStart: null,
        onOpenEnd: null,
        onCloseStart: null,
        onCloseEnd: null,
        onItemClick: null
    };
    var Dropdown = function(_Component2) {
        _inherits(Dropdown, _Component2);
        function Dropdown(el, options) {
            var _this9;
            _classCallCheck(this, Dropdown);
            _this9 = _possibleConstructorReturn(this, _getPrototypeOf(Dropdown).call(this, Dropdown, el, options));
            _this9.el.M_Dropdown = _assertThisInitialized(_this9);
            Dropdown._dropdowns.push(_assertThisInitialized(_this9));
            _this9.id = M.getIdFromTrigger(el);
            _this9.dropdownEl = document.getElementById(_this9.id);
            _this9.$dropdownEl = $(_this9.dropdownEl);
            _this9.options = $.extend({}, Dropdown.defaults, options);
            _this9.isOpen = false;
            _this9.isScrollable = false;
            _this9.isTouchMoving = false;
            _this9.focusedIndex = -1;
            _this9.filterQuery = [];
            if (!!_this9.options.container) {
                $(_this9.options.container).append(_this9.dropdownEl);
            } else {
                _this9.$el.after(_this9.dropdownEl);
            }
            _this9._makeDropdownFocusable();
            _this9._resetFilterQueryBound = _this9._resetFilterQuery.bind(_assertThisInitialized(_this9));
            _this9._handleDocumentClickBound = _this9._handleDocumentClick.bind(_assertThisInitialized(_this9));
            _this9._handleDocumentTouchmoveBound = _this9._handleDocumentTouchmove.bind(_assertThisInitialized(_this9));
            _this9._handleDropdownClickBound = _this9._handleDropdownClick.bind(_assertThisInitialized(_this9));
            _this9._handleDropdownKeydownBound = _this9._handleDropdownKeydown.bind(_assertThisInitialized(_this9));
            _this9._handleTriggerKeydownBound = _this9._handleTriggerKeydown.bind(_assertThisInitialized(_this9));
            _this9._setupEventHandlers();
            return _this9;
        }
        _createClass(Dropdown, [ {
            key: "destroy",
            value: function destroy() {
                this._resetDropdownStyles();
                this._removeEventHandlers();
                Dropdown._dropdowns.splice(Dropdown._dropdowns.indexOf(this), 1);
                this.el.M_Dropdown = undefined;
            }
        }, {
            key: "_setupEventHandlers",
            value: function _setupEventHandlers() {
                this.el.addEventListener("keydown", this._handleTriggerKeydownBound);
                this.dropdownEl.addEventListener("click", this._handleDropdownClickBound);
                if (this.options.hover) {
                    this._handleMouseEnterBound = this._handleMouseEnter.bind(this);
                    this.el.addEventListener("mouseenter", this._handleMouseEnterBound);
                    this._handleMouseLeaveBound = this._handleMouseLeave.bind(this);
                    this.el.addEventListener("mouseleave", this._handleMouseLeaveBound);
                    this.dropdownEl.addEventListener("mouseleave", this._handleMouseLeaveBound);
                } else {
                    this._handleClickBound = this._handleClick.bind(this);
                    this.el.addEventListener("click", this._handleClickBound);
                }
            }
        }, {
            key: "_removeEventHandlers",
            value: function _removeEventHandlers() {
                this.el.removeEventListener("keydown", this._handleTriggerKeydownBound);
                this.dropdownEl.removeEventListener("click", this._handleDropdownClickBound);
                if (this.options.hover) {
                    this.el.removeEventListener("mouseenter", this._handleMouseEnterBound);
                    this.el.removeEventListener("mouseleave", this._handleMouseLeaveBound);
                    this.dropdownEl.removeEventListener("mouseleave", this._handleMouseLeaveBound);
                } else {
                    this.el.removeEventListener("click", this._handleClickBound);
                }
            }
        }, {
            key: "_setupTemporaryEventHandlers",
            value: function _setupTemporaryEventHandlers() {
                document.body.addEventListener("click", this._handleDocumentClickBound, true);
                document.body.addEventListener("touchend", this._handleDocumentClickBound);
                document.body.addEventListener("touchmove", this._handleDocumentTouchmoveBound);
                this.dropdownEl.addEventListener("keydown", this._handleDropdownKeydownBound);
            }
        }, {
            key: "_removeTemporaryEventHandlers",
            value: function _removeTemporaryEventHandlers() {
                document.body.removeEventListener("click", this._handleDocumentClickBound, true);
                document.body.removeEventListener("touchend", this._handleDocumentClickBound);
                document.body.removeEventListener("touchmove", this._handleDocumentTouchmoveBound);
                this.dropdownEl.removeEventListener("keydown", this._handleDropdownKeydownBound);
            }
        }, {
            key: "_handleClick",
            value: function _handleClick(e) {
                e.preventDefault();
                this.open();
            }
        }, {
            key: "_handleMouseEnter",
            value: function _handleMouseEnter() {
                this.open();
            }
        }, {
            key: "_handleMouseLeave",
            value: function _handleMouseLeave(e) {
                var toEl = e.toElement || e.relatedTarget;
                var leaveToDropdownContent = !!$(toEl).closest(".dropdown-content").length;
                var leaveToActiveDropdownTrigger = false;
                var $closestTrigger = $(toEl).closest(".dropdown-trigger");
                if ($closestTrigger.length && !!$closestTrigger[0].M_Dropdown && $closestTrigger[0].M_Dropdown.isOpen) {
                    leaveToActiveDropdownTrigger = true;
                }
                if (!leaveToActiveDropdownTrigger && !leaveToDropdownContent) {
                    this.close();
                }
            }
        }, {
            key: "_handleDocumentClick",
            value: function _handleDocumentClick(e) {
                var _this10 = this;
                var $target = $(e.target);
                if (this.options.closeOnClick && $target.closest(".dropdown-content").length && !this.isTouchMoving) {
                    setTimeout(function() {
                        _this10.close();
                    }, 0);
                } else if ($target.closest(".dropdown-trigger").length || !$target.closest(".dropdown-content").length) {
                    setTimeout(function() {
                        _this10.close();
                    }, 0);
                }
                this.isTouchMoving = false;
            }
        }, {
            key: "_handleTriggerKeydown",
            value: function _handleTriggerKeydown(e) {
                if ((e.which === M.keys.ARROW_DOWN || e.which === M.keys.ENTER) && !this.isOpen) {
                    e.preventDefault();
                    this.open();
                }
            }
        }, {
            key: "_handleDocumentTouchmove",
            value: function _handleDocumentTouchmove(e) {
                var $target = $(e.target);
                if ($target.closest(".dropdown-content").length) {
                    this.isTouchMoving = true;
                }
            }
        }, {
            key: "_handleDropdownClick",
            value: function _handleDropdownClick(e) {
                if (typeof this.options.onItemClick === "function") {
                    var itemEl = $(e.target).closest("li")[0];
                    this.options.onItemClick.call(this, itemEl);
                }
            }
        }, {
            key: "_handleDropdownKeydown",
            value: function _handleDropdownKeydown(e) {
                if (e.which === M.keys.TAB) {
                    e.preventDefault();
                    this.close();
                } else if ((e.which === M.keys.ARROW_DOWN || e.which === M.keys.ARROW_UP) && this.isOpen) {
                    e.preventDefault();
                    var direction = e.which === M.keys.ARROW_DOWN ? 1 : -1;
                    var newFocusedIndex = this.focusedIndex;
                    var foundNewIndex = false;
                    do {
                        newFocusedIndex = newFocusedIndex + direction;
                        if (!!this.dropdownEl.children[newFocusedIndex] && this.dropdownEl.children[newFocusedIndex].tabIndex !== -1) {
                            foundNewIndex = true;
                            break;
                        }
                    } while (newFocusedIndex < this.dropdownEl.children.length && newFocusedIndex >= 0);
                    if (foundNewIndex) {
                        this.focusedIndex = newFocusedIndex;
                        this._focusFocusedItem();
                    }
                } else if (e.which === M.keys.ENTER && this.isOpen) {
                    var focusedElement = this.dropdownEl.children[this.focusedIndex];
                    var $activatableElement = $(focusedElement).find("a, button").first();
                    if (!!$activatableElement.length) {
                        $activatableElement[0].click();
                    } else if (!!focusedElement) {
                        focusedElement.click();
                    }
                } else if (e.which === M.keys.ESC && this.isOpen) {
                    e.preventDefault();
                    this.close();
                }
                var letter = String.fromCharCode(e.which).toLowerCase(), nonLetters = [ 9, 13, 27, 38, 40 ];
                if (letter && nonLetters.indexOf(e.which) === -1) {
                    this.filterQuery.push(letter);
                    var string = this.filterQuery.join(""), newOptionEl = $(this.dropdownEl).find("li").filter(function(el) {
                        return $(el).text().toLowerCase().indexOf(string) === 0;
                    })[0];
                    if (newOptionEl) {
                        this.focusedIndex = $(newOptionEl).index();
                        this._focusFocusedItem();
                    }
                }
                this.filterTimeout = setTimeout(this._resetFilterQueryBound, 1e3);
            }
        }, {
            key: "_resetFilterQuery",
            value: function _resetFilterQuery() {
                this.filterQuery = [];
            }
        }, {
            key: "_resetDropdownStyles",
            value: function _resetDropdownStyles() {
                this.$dropdownEl.css({
                    display: "",
                    width: "",
                    height: "",
                    left: "",
                    top: "",
                    "transform-origin": "",
                    transform: "",
                    opacity: ""
                });
            }
        }, {
            key: "_makeDropdownFocusable",
            value: function _makeDropdownFocusable() {
                this.dropdownEl.tabIndex = 0;
                $(this.dropdownEl).children().each(function(el) {
                    if (!el.getAttribute("tabindex")) {
                        el.setAttribute("tabindex", 0);
                    }
                });
            }
        }, {
            key: "_focusFocusedItem",
            value: function _focusFocusedItem() {
                if (this.focusedIndex >= 0 && this.focusedIndex < this.dropdownEl.children.length && this.options.autoFocus) {
                    this.dropdownEl.children[this.focusedIndex].focus();
                }
            }
        }, {
            key: "_getDropdownPosition",
            value: function _getDropdownPosition() {
                var offsetParentBRect = this.el.offsetParent.getBoundingClientRect();
                var triggerBRect = this.el.getBoundingClientRect();
                var dropdownBRect = this.dropdownEl.getBoundingClientRect();
                var idealHeight = dropdownBRect.height;
                var idealWidth = dropdownBRect.width;
                var idealXPos = triggerBRect.left - dropdownBRect.left;
                var idealYPos = triggerBRect.top - dropdownBRect.top;
                var dropdownBounds = {
                    left: idealXPos,
                    top: idealYPos,
                    height: idealHeight,
                    width: idealWidth
                };
                var closestOverflowParent = !!this.dropdownEl.offsetParent ? this.dropdownEl.offsetParent : this.dropdownEl.parentNode;
                var alignments = M.checkPossibleAlignments(this.el, closestOverflowParent, dropdownBounds, this.options.coverTrigger ? 0 : triggerBRect.height);
                var verticalAlignment = "top";
                var horizontalAlignment = this.options.alignment;
                idealYPos += this.options.coverTrigger ? 0 : triggerBRect.height;
                this.isScrollable = false;
                if (!alignments.top) {
                    if (alignments.bottom) {
                        verticalAlignment = "bottom";
                    } else {
                        this.isScrollable = true;
                        if (alignments.spaceOnTop > alignments.spaceOnBottom) {
                            verticalAlignment = "bottom";
                            idealHeight += alignments.spaceOnTop;
                            idealYPos -= alignments.spaceOnTop;
                        } else {
                            idealHeight += alignments.spaceOnBottom;
                        }
                    }
                }
                if (!alignments[horizontalAlignment]) {
                    var oppositeAlignment = horizontalAlignment === "left" ? "right" : "left";
                    if (alignments[oppositeAlignment]) {
                        horizontalAlignment = oppositeAlignment;
                    } else {
                        if (alignments.spaceOnLeft > alignments.spaceOnRight) {
                            horizontalAlignment = "right";
                            idealWidth += alignments.spaceOnLeft;
                            idealXPos -= alignments.spaceOnLeft;
                        } else {
                            horizontalAlignment = "left";
                            idealWidth += alignments.spaceOnRight;
                        }
                    }
                }
                if (verticalAlignment === "bottom") {
                    idealYPos = idealYPos - dropdownBRect.height + (this.options.coverTrigger ? triggerBRect.height : 0);
                }
                if (horizontalAlignment === "right") {
                    idealXPos = idealXPos - dropdownBRect.width + triggerBRect.width;
                }
                return {
                    x: idealXPos,
                    y: idealYPos,
                    verticalAlignment: verticalAlignment,
                    horizontalAlignment: horizontalAlignment,
                    height: idealHeight,
                    width: idealWidth
                };
            }
        }, {
            key: "_animateIn",
            value: function _animateIn() {
                var _this11 = this;
                anim.remove(this.dropdownEl);
                anim({
                    targets: this.dropdownEl,
                    opacity: {
                        value: [ 0, 1 ],
                        easing: "easeOutQuad"
                    },
                    scaleX: [ .3, 1 ],
                    scaleY: [ .3, 1 ],
                    duration: this.options.inDuration,
                    easing: "easeOutQuint",
                    complete: function complete(anim) {
                        if (_this11.options.autoFocus) {
                            _this11.dropdownEl.focus();
                        }
                        if (typeof _this11.options.onOpenEnd === "function") {
                            _this11.options.onOpenEnd.call(_this11, _this11.el);
                        }
                    }
                });
            }
        }, {
            key: "_animateOut",
            value: function _animateOut() {
                var _this12 = this;
                anim.remove(this.dropdownEl);
                anim({
                    targets: this.dropdownEl,
                    opacity: {
                        value: 0,
                        easing: "easeOutQuint"
                    },
                    scaleX: .3,
                    scaleY: .3,
                    duration: this.options.outDuration,
                    easing: "easeOutQuint",
                    complete: function complete(anim) {
                        _this12._resetDropdownStyles();
                        if (typeof _this12.options.onCloseEnd === "function") {
                            _this12.options.onCloseEnd.call(_this12, _this12.el);
                        }
                    }
                });
            }
        }, {
            key: "_placeDropdown",
            value: function _placeDropdown() {
                var idealWidth = this.options.constrainWidth ? this.el.getBoundingClientRect().width : this.dropdownEl.getBoundingClientRect().width;
                this.dropdownEl.style.width = idealWidth + "px";
                var positionInfo = this._getDropdownPosition();
                this.dropdownEl.style.left = positionInfo.x + "px";
                this.dropdownEl.style.top = positionInfo.y + "px";
                this.dropdownEl.style.height = positionInfo.height + "px";
                this.dropdownEl.style.width = positionInfo.width + "px";
                this.dropdownEl.style.transformOrigin = "".concat(positionInfo.horizontalAlignment === "left" ? "0" : "100%", " ").concat(positionInfo.verticalAlignment === "top" ? "0" : "100%");
            }
        }, {
            key: "open",
            value: function open() {
                if (this.isOpen) {
                    return;
                }
                this.isOpen = true;
                if (typeof this.options.onOpenStart === "function") {
                    this.options.onOpenStart.call(this, this.el);
                }
                this._resetDropdownStyles();
                this.dropdownEl.style.display = "block";
                this._placeDropdown();
                this._animateIn();
                this._setupTemporaryEventHandlers();
            }
        }, {
            key: "close",
            value: function close() {
                if (!this.isOpen) {
                    return;
                }
                this.isOpen = false;
                this.focusedIndex = -1;
                if (typeof this.options.onCloseStart === "function") {
                    this.options.onCloseStart.call(this, this.el);
                }
                this._animateOut();
                this._removeTemporaryEventHandlers();
                if (this.options.autoFocus) {
                    this.el.focus();
                }
            }
        }, {
            key: "recalculateDimensions",
            value: function recalculateDimensions() {
                if (this.isOpen) {
                    this.$dropdownEl.css({
                        width: "",
                        height: "",
                        left: "",
                        top: "",
                        "transform-origin": ""
                    });
                    this._placeDropdown();
                }
            }
        } ], [ {
            key: "init",
            value: function init(els, options) {
                return _get(_getPrototypeOf(Dropdown), "init", this).call(this, this, els, options);
            }
        }, {
            key: "getInstance",
            value: function getInstance(el) {
                var domElem = !!el.jquery ? el[0] : el;
                return domElem.M_Dropdown;
            }
        }, {
            key: "defaults",
            get: function get() {
                return _defaults;
            }
        } ]);
        return Dropdown;
    }(Component);
    Dropdown._dropdowns = [];
    M.Dropdown = Dropdown;
    if (M.jQueryLoaded) {
        M.initializeJqueryWrapper(Dropdown, "dropdown", "M_Dropdown");
    }
})(cash, M.anime);

(function($, anim) {
    "use strict";
    var _defaults = {
        opacity: .5,
        inDuration: 250,
        outDuration: 250,
        onOpenStart: null,
        onOpenEnd: null,
        onCloseStart: null,
        onCloseEnd: null,
        preventScrolling: true,
        dismissible: true,
        startingTop: "4%",
        endingTop: "10%"
    };
    var Modal = function(_Component3) {
        _inherits(Modal, _Component3);
        function Modal(el, options) {
            var _this13;
            _classCallCheck(this, Modal);
            _this13 = _possibleConstructorReturn(this, _getPrototypeOf(Modal).call(this, Modal, el, options));
            _this13.el.M_Modal = _assertThisInitialized(_this13);
            _this13.options = $.extend({}, Modal.defaults, options);
            _this13.isOpen = false;
            _this13.id = _this13.$el.attr("id");
            _this13._openingTrigger = undefined;
            _this13.$overlay = $('<div class="modal-overlay"></div>');
            _this13.el.tabIndex = 0;
            _this13._nthModalOpened = 0;
            Modal._count++;
            _this13._setupEventHandlers();
            return _this13;
        }
        _createClass(Modal, [ {
            key: "destroy",
            value: function destroy() {
                Modal._count--;
                this._removeEventHandlers();
                this.el.removeAttribute("style");
                this.$overlay.remove();
                this.el.M_Modal = undefined;
            }
        }, {
            key: "_setupEventHandlers",
            value: function _setupEventHandlers() {
                this._handleOverlayClickBound = this._handleOverlayClick.bind(this);
                this._handleModalCloseClickBound = this._handleModalCloseClick.bind(this);
                if (Modal._count === 1) {
                    document.body.addEventListener("click", this._handleTriggerClick);
                }
                this.$overlay[0].addEventListener("click", this._handleOverlayClickBound);
                this.el.addEventListener("click", this._handleModalCloseClickBound);
            }
        }, {
            key: "_removeEventHandlers",
            value: function _removeEventHandlers() {
                if (Modal._count === 0) {
                    document.body.removeEventListener("click", this._handleTriggerClick);
                }
                this.$overlay[0].removeEventListener("click", this._handleOverlayClickBound);
                this.el.removeEventListener("click", this._handleModalCloseClickBound);
            }
        }, {
            key: "_handleTriggerClick",
            value: function _handleTriggerClick(e) {
                var $trigger = $(e.target).closest(".modal-trigger");
                if ($trigger.length) {
                    var modalId = M.getIdFromTrigger($trigger[0]);
                    var modalInstance = document.getElementById(modalId).M_Modal;
                    if (modalInstance) {
                        modalInstance.open($trigger);
                    }
                    e.preventDefault();
                }
            }
        }, {
            key: "_handleOverlayClick",
            value: function _handleOverlayClick() {
                if (this.options.dismissible) {
                    this.close();
                }
            }
        }, {
            key: "_handleModalCloseClick",
            value: function _handleModalCloseClick(e) {
                var $closeTrigger = $(e.target).closest(".modal-close");
                if ($closeTrigger.length) {
                    this.close();
                }
            }
        }, {
            key: "_handleKeydown",
            value: function _handleKeydown(e) {
                if (e.keyCode === 27 && this.options.dismissible) {
                    this.close();
                }
            }
        }, {
            key: "_handleFocus",
            value: function _handleFocus(e) {
                if (!this.el.contains(e.target) && this._nthModalOpened === Modal._modalsOpen) {
                    this.el.focus();
                }
            }
        }, {
            key: "_animateIn",
            value: function _animateIn() {
                var _this14 = this;
                $.extend(this.el.style, {
                    display: "block",
                    opacity: 0
                });
                $.extend(this.$overlay[0].style, {
                    display: "block",
                    opacity: 0
                });
                anim({
                    targets: this.$overlay[0],
                    opacity: this.options.opacity,
                    duration: this.options.inDuration,
                    easing: "easeOutQuad"
                });
                var enterAnimOptions = {
                    targets: this.el,
                    duration: this.options.inDuration,
                    easing: "easeOutCubic",
                    complete: function complete() {
                        if (typeof _this14.options.onOpenEnd === "function") {
                            _this14.options.onOpenEnd.call(_this14, _this14.el, _this14._openingTrigger);
                        }
                    }
                };
                if (this.el.classList.contains("bottom-sheet")) {
                    $.extend(enterAnimOptions, {
                        bottom: 0,
                        opacity: 1
                    });
                    anim(enterAnimOptions);
                } else {
                    $.extend(enterAnimOptions, {
                        top: [ this.options.startingTop, this.options.endingTop ],
                        opacity: 1,
                        scaleX: [ .8, 1 ],
                        scaleY: [ .8, 1 ]
                    });
                    anim(enterAnimOptions);
                }
            }
        }, {
            key: "_animateOut",
            value: function _animateOut() {
                var _this15 = this;
                anim({
                    targets: this.$overlay[0],
                    opacity: 0,
                    duration: this.options.outDuration,
                    easing: "easeOutQuart"
                });
                var exitAnimOptions = {
                    targets: this.el,
                    duration: this.options.outDuration,
                    easing: "easeOutCubic",
                    complete: function complete() {
                        _this15.el.style.display = "none";
                        _this15.$overlay.remove();
                        if (typeof _this15.options.onCloseEnd === "function") {
                            _this15.options.onCloseEnd.call(_this15, _this15.el);
                        }
                    }
                };
                if (this.el.classList.contains("bottom-sheet")) {
                    $.extend(exitAnimOptions, {
                        bottom: "-100%",
                        opacity: 0
                    });
                    anim(exitAnimOptions);
                } else {
                    $.extend(exitAnimOptions, {
                        top: [ this.options.endingTop, this.options.startingTop ],
                        opacity: 0,
                        scaleX: .8,
                        scaleY: .8
                    });
                    anim(exitAnimOptions);
                }
            }
        }, {
            key: "open",
            value: function open($trigger) {
                if (this.isOpen) {
                    return;
                }
                this.isOpen = true;
                Modal._modalsOpen++;
                this._nthModalOpened = Modal._modalsOpen;
                this.$overlay[0].style.zIndex = 1e3 + Modal._modalsOpen * 2;
                this.el.style.zIndex = 1e3 + Modal._modalsOpen * 2 + 1;
                this._openingTrigger = !!$trigger ? $trigger[0] : undefined;
                if (typeof this.options.onOpenStart === "function") {
                    this.options.onOpenStart.call(this, this.el, this._openingTrigger);
                }
                if (this.options.preventScrolling) {
                    document.body.style.overflow = "hidden";
                }
                this.el.classList.add("open");
                this.el.insertAdjacentElement("afterend", this.$overlay[0]);
                if (this.options.dismissible) {
                    this._handleKeydownBound = this._handleKeydown.bind(this);
                    this._handleFocusBound = this._handleFocus.bind(this);
                    document.addEventListener("keydown", this._handleKeydownBound);
                    document.addEventListener("focus", this._handleFocusBound, true);
                }
                anim.remove(this.el);
                anim.remove(this.$overlay[0]);
                this._animateIn();
                this.el.focus();
                return this;
            }
        }, {
            key: "close",
            value: function close() {
                if (!this.isOpen) {
                    return;
                }
                this.isOpen = false;
                Modal._modalsOpen--;
                this._nthModalOpened = 0;
                if (typeof this.options.onCloseStart === "function") {
                    this.options.onCloseStart.call(this, this.el);
                }
                this.el.classList.remove("open");
                if (Modal._modalsOpen === 0) {
                    document.body.style.overflow = "";
                }
                if (this.options.dismissible) {
                    document.removeEventListener("keydown", this._handleKeydownBound);
                    document.removeEventListener("focus", this._handleFocusBound, true);
                }
                anim.remove(this.el);
                anim.remove(this.$overlay[0]);
                this._animateOut();
                return this;
            }
        } ], [ {
            key: "init",
            value: function init(els, options) {
                return _get(_getPrototypeOf(Modal), "init", this).call(this, this, els, options);
            }
        }, {
            key: "getInstance",
            value: function getInstance(el) {
                var domElem = !!el.jquery ? el[0] : el;
                return domElem.M_Modal;
            }
        }, {
            key: "defaults",
            get: function get() {
                return _defaults;
            }
        } ]);
        return Modal;
    }(Component);
    Modal._modalsOpen = 0;
    Modal._count = 0;
    M.Modal = Modal;
    if (M.jQueryLoaded) {
        M.initializeJqueryWrapper(Modal, "modal", "M_Modal");
    }
})(cash, M.anime);

(function($, anim) {
    "use strict";
    var _defaults = {
        inDuration: 275,
        outDuration: 200,
        onOpenStart: null,
        onOpenEnd: null,
        onCloseStart: null,
        onCloseEnd: null
    };
    var Materialbox = function(_Component4) {
        _inherits(Materialbox, _Component4);
        function Materialbox(el, options) {
            var _this16;
            _classCallCheck(this, Materialbox);
            _this16 = _possibleConstructorReturn(this, _getPrototypeOf(Materialbox).call(this, Materialbox, el, options));
            _this16.el.M_Materialbox = _assertThisInitialized(_this16);
            _this16.options = $.extend({}, Materialbox.defaults, options);
            _this16.overlayActive = false;
            _this16.doneAnimating = true;
            _this16.placeholder = $("<div></div>").addClass("material-placeholder");
            _this16.originalWidth = 0;
            _this16.originalHeight = 0;
            _this16.originInlineStyles = _this16.$el.attr("style");
            _this16.caption = _this16.el.getAttribute("data-caption") || "";
            _this16.$el.before(_this16.placeholder);
            _this16.placeholder.append(_this16.$el);
            _this16._setupEventHandlers();
            return _this16;
        }
        _createClass(Materialbox, [ {
            key: "destroy",
            value: function destroy() {
                this._removeEventHandlers();
                this.el.M_Materialbox = undefined;
                $(this.placeholder).after(this.el).remove();
                this.$el.removeAttr("style");
            }
        }, {
            key: "_setupEventHandlers",
            value: function _setupEventHandlers() {
                this._handleMaterialboxClickBound = this._handleMaterialboxClick.bind(this);
                this.el.addEventListener("click", this._handleMaterialboxClickBound);
            }
        }, {
            key: "_removeEventHandlers",
            value: function _removeEventHandlers() {
                this.el.removeEventListener("click", this._handleMaterialboxClickBound);
            }
        }, {
            key: "_handleMaterialboxClick",
            value: function _handleMaterialboxClick(e) {
                if (this.doneAnimating === false || this.overlayActive && this.doneAnimating) {
                    this.close();
                } else {
                    this.open();
                }
            }
        }, {
            key: "_handleWindowScroll",
            value: function _handleWindowScroll() {
                if (this.overlayActive) {
                    this.close();
                }
            }
        }, {
            key: "_handleWindowResize",
            value: function _handleWindowResize() {
                if (this.overlayActive) {
                    this.close();
                }
            }
        }, {
            key: "_handleWindowEscape",
            value: function _handleWindowEscape(e) {
                if (e.keyCode === 27 && this.doneAnimating && this.overlayActive) {
                    this.close();
                }
            }
        }, {
            key: "_makeAncestorsOverflowVisible",
            value: function _makeAncestorsOverflowVisible() {
                this.ancestorsChanged = $();
                var ancestor = this.placeholder[0].parentNode;
                while (ancestor !== null && !$(ancestor).is(document)) {
                    var curr = $(ancestor);
                    if (curr.css("overflow") !== "visible") {
                        curr.css("overflow", "visible");
                        if (this.ancestorsChanged === undefined) {
                            this.ancestorsChanged = curr;
                        } else {
                            this.ancestorsChanged = this.ancestorsChanged.add(curr);
                        }
                    }
                    ancestor = ancestor.parentNode;
                }
            }
        }, {
            key: "_animateImageIn",
            value: function _animateImageIn() {
                var _this17 = this;
                var animOptions = {
                    targets: this.el,
                    height: [ this.originalHeight, this.newHeight ],
                    width: [ this.originalWidth, this.newWidth ],
                    left: M.getDocumentScrollLeft() + this.windowWidth / 2 - this.placeholder.offset().left - this.newWidth / 2,
                    top: M.getDocumentScrollTop() + this.windowHeight / 2 - this.placeholder.offset().top - this.newHeight / 2,
                    duration: this.options.inDuration,
                    easing: "easeOutQuad",
                    complete: function complete() {
                        _this17.doneAnimating = true;
                        if (typeof _this17.options.onOpenEnd === "function") {
                            _this17.options.onOpenEnd.call(_this17, _this17.el);
                        }
                    }
                };
                this.maxWidth = this.$el.css("max-width");
                this.maxHeight = this.$el.css("max-height");
                if (this.maxWidth !== "none") {
                    animOptions.maxWidth = this.newWidth;
                }
                if (this.maxHeight !== "none") {
                    animOptions.maxHeight = this.newHeight;
                }
                anim(animOptions);
            }
        }, {
            key: "_animateImageOut",
            value: function _animateImageOut() {
                var _this18 = this;
                var animOptions = {
                    targets: this.el,
                    width: this.originalWidth,
                    height: this.originalHeight,
                    left: 0,
                    top: 0,
                    duration: this.options.outDuration,
                    easing: "easeOutQuad",
                    complete: function complete() {
                        _this18.placeholder.css({
                            height: "",
                            width: "",
                            position: "",
                            top: "",
                            left: ""
                        });
                        if (_this18.attrWidth) {
                            _this18.$el.attr("width", _this18.attrWidth);
                        }
                        if (_this18.attrHeight) {
                            _this18.$el.attr("height", _this18.attrHeight);
                        }
                        _this18.$el.removeAttr("style");
                        _this18.originInlineStyles && _this18.$el.attr("style", _this18.originInlineStyles);
                        _this18.$el.removeClass("active");
                        _this18.doneAnimating = true;
                        if (_this18.ancestorsChanged.length) {
                            _this18.ancestorsChanged.css("overflow", "");
                        }
                        if (typeof _this18.options.onCloseEnd === "function") {
                            _this18.options.onCloseEnd.call(_this18, _this18.el);
                        }
                    }
                };
                anim(animOptions);
            }
        }, {
            key: "_updateVars",
            value: function _updateVars() {
                this.windowWidth = window.innerWidth;
                this.windowHeight = window.innerHeight;
                this.caption = this.el.getAttribute("data-caption") || "";
            }
        }, {
            key: "open",
            value: function open() {
                var _this19 = this;
                this._updateVars();
                this.originalWidth = this.el.getBoundingClientRect().width;
                this.originalHeight = this.el.getBoundingClientRect().height;
                this.doneAnimating = false;
                this.$el.addClass("active");
                this.overlayActive = true;
                if (typeof this.options.onOpenStart === "function") {
                    this.options.onOpenStart.call(this, this.el);
                }
                this.placeholder.css({
                    width: this.placeholder[0].getBoundingClientRect().width + "px",
                    height: this.placeholder[0].getBoundingClientRect().height + "px",
                    position: "relative",
                    top: 0,
                    left: 0
                });
                this._makeAncestorsOverflowVisible();
                this.$el.css({
                    position: "absolute",
                    "z-index": 1e3,
                    "will-change": "left, top, width, height"
                });
                this.attrWidth = this.$el.attr("width");
                this.attrHeight = this.$el.attr("height");
                if (this.attrWidth) {
                    this.$el.css("width", this.attrWidth + "px");
                    this.$el.removeAttr("width");
                }
                if (this.attrHeight) {
                    this.$el.css("width", this.attrHeight + "px");
                    this.$el.removeAttr("height");
                }
                this.$overlay = $('<div id="materialbox-overlay"></div>').css({
                    opacity: 0
                }).one("click", function() {
                    if (_this19.doneAnimating) {
                        _this19.close();
                    }
                });
                this.$el.before(this.$overlay);
                var overlayOffset = this.$overlay[0].getBoundingClientRect();
                this.$overlay.css({
                    width: this.windowWidth + "px",
                    height: this.windowHeight + "px",
                    left: -1 * overlayOffset.left + "px",
                    top: -1 * overlayOffset.top + "px"
                });
                anim.remove(this.el);
                anim.remove(this.$overlay[0]);
                anim({
                    targets: this.$overlay[0],
                    opacity: 1,
                    duration: this.options.inDuration,
                    easing: "easeOutQuad"
                });
                if (this.caption !== "") {
                    if (this.$photocaption) {
                        anim.remove(this.$photoCaption[0]);
                    }
                    this.$photoCaption = $('<div class="materialbox-caption"></div>');
                    this.$photoCaption.text(this.caption);
                    $("body").append(this.$photoCaption);
                    this.$photoCaption.css({
                        display: "inline"
                    });
                    anim({
                        targets: this.$photoCaption[0],
                        opacity: 1,
                        duration: this.options.inDuration,
                        easing: "easeOutQuad"
                    });
                }
                var ratio = 0;
                var widthPercent = this.originalWidth / this.windowWidth;
                var heightPercent = this.originalHeight / this.windowHeight;
                this.newWidth = 0;
                this.newHeight = 0;
                if (widthPercent > heightPercent) {
                    ratio = this.originalHeight / this.originalWidth;
                    this.newWidth = this.windowWidth * .9;
                    this.newHeight = this.windowWidth * .9 * ratio;
                } else {
                    ratio = this.originalWidth / this.originalHeight;
                    this.newWidth = this.windowHeight * .9 * ratio;
                    this.newHeight = this.windowHeight * .9;
                }
                this._animateImageIn();
                this._handleWindowScrollBound = this._handleWindowScroll.bind(this);
                this._handleWindowResizeBound = this._handleWindowResize.bind(this);
                this._handleWindowEscapeBound = this._handleWindowEscape.bind(this);
                window.addEventListener("scroll", this._handleWindowScrollBound);
                window.addEventListener("resize", this._handleWindowResizeBound);
                window.addEventListener("keyup", this._handleWindowEscapeBound);
            }
        }, {
            key: "close",
            value: function close() {
                var _this20 = this;
                this._updateVars();
                this.doneAnimating = false;
                if (typeof this.options.onCloseStart === "function") {
                    this.options.onCloseStart.call(this, this.el);
                }
                anim.remove(this.el);
                anim.remove(this.$overlay[0]);
                if (this.caption !== "") {
                    anim.remove(this.$photoCaption[0]);
                }
                window.removeEventListener("scroll", this._handleWindowScrollBound);
                window.removeEventListener("resize", this._handleWindowResizeBound);
                window.removeEventListener("keyup", this._handleWindowEscapeBound);
                anim({
                    targets: this.$overlay[0],
                    opacity: 0,
                    duration: this.options.outDuration,
                    easing: "easeOutQuad",
                    complete: function complete() {
                        _this20.overlayActive = false;
                        _this20.$overlay.remove();
                    }
                });
                this._animateImageOut();
                if (this.caption !== "") {
                    anim({
                        targets: this.$photoCaption[0],
                        opacity: 0,
                        duration: this.options.outDuration,
                        easing: "easeOutQuad",
                        complete: function complete() {
                            _this20.$photoCaption.remove();
                        }
                    });
                }
            }
        } ], [ {
            key: "init",
            value: function init(els, options) {
                return _get(_getPrototypeOf(Materialbox), "init", this).call(this, this, els, options);
            }
        }, {
            key: "getInstance",
            value: function getInstance(el) {
                var domElem = !!el.jquery ? el[0] : el;
                return domElem.M_Materialbox;
            }
        }, {
            key: "defaults",
            get: function get() {
                return _defaults;
            }
        } ]);
        return Materialbox;
    }(Component);
    M.Materialbox = Materialbox;
    if (M.jQueryLoaded) {
        M.initializeJqueryWrapper(Materialbox, "materialbox", "M_Materialbox");
    }
})(cash, M.anime);

(function($) {
    "use strict";
    var _defaults = {
        responsiveThreshold: 0
    };
    var Parallax = function(_Component5) {
        _inherits(Parallax, _Component5);
        function Parallax(el, options) {
            var _this21;
            _classCallCheck(this, Parallax);
            _this21 = _possibleConstructorReturn(this, _getPrototypeOf(Parallax).call(this, Parallax, el, options));
            _this21.el.M_Parallax = _assertThisInitialized(_this21);
            _this21.options = $.extend({}, Parallax.defaults, options);
            _this21._enabled = window.innerWidth > _this21.options.responsiveThreshold;
            _this21.$img = _this21.$el.find("img").first();
            _this21.$img.each(function() {
                var el = this;
                if (el.complete) $(el).trigger("load");
            });
            _this21._updateParallax();
            _this21._setupEventHandlers();
            _this21._setupStyles();
            Parallax._parallaxes.push(_assertThisInitialized(_this21));
            return _this21;
        }
        _createClass(Parallax, [ {
            key: "destroy",
            value: function destroy() {
                Parallax._parallaxes.splice(Parallax._parallaxes.indexOf(this), 1);
                this.$img[0].style.transform = "";
                this._removeEventHandlers();
                this.$el[0].M_Parallax = undefined;
            }
        }, {
            key: "_setupEventHandlers",
            value: function _setupEventHandlers() {
                this._handleImageLoadBound = this._handleImageLoad.bind(this);
                this.$img[0].addEventListener("load", this._handleImageLoadBound);
                if (Parallax._parallaxes.length === 0) {
                    Parallax._handleScrollThrottled = M.throttle(Parallax._handleScroll, 5);
                    window.addEventListener("scroll", Parallax._handleScrollThrottled);
                    Parallax._handleWindowResizeThrottled = M.throttle(Parallax._handleWindowResize, 5);
                    window.addEventListener("resize", Parallax._handleWindowResizeThrottled);
                }
            }
        }, {
            key: "_removeEventHandlers",
            value: function _removeEventHandlers() {
                this.$img[0].removeEventListener("load", this._handleImageLoadBound);
                if (Parallax._parallaxes.length === 0) {
                    window.removeEventListener("scroll", Parallax._handleScrollThrottled);
                    window.removeEventListener("resize", Parallax._handleWindowResizeThrottled);
                }
            }
        }, {
            key: "_setupStyles",
            value: function _setupStyles() {
                this.$img[0].style.opacity = 1;
            }
        }, {
            key: "_handleImageLoad",
            value: function _handleImageLoad() {
                this._updateParallax();
            }
        }, {
            key: "_updateParallax",
            value: function _updateParallax() {
                var containerHeight = this.$el.height() > 0 ? this.el.parentNode.offsetHeight : 500;
                var imgHeight = this.$img[0].offsetHeight;
                var parallaxDist = imgHeight - containerHeight;
                var bottom = this.$el.offset().top + containerHeight;
                var top = this.$el.offset().top;
                var scrollTop = M.getDocumentScrollTop();
                var windowHeight = window.innerHeight;
                var windowBottom = scrollTop + windowHeight;
                var percentScrolled = (windowBottom - top) / (containerHeight + windowHeight);
                var parallax = parallaxDist * percentScrolled;
                if (!this._enabled) {
                    this.$img[0].style.transform = "";
                } else if (bottom > scrollTop && top < scrollTop + windowHeight) {
                    this.$img[0].style.transform = "translate3D(-50%, ".concat(parallax, "px, 0)");
                }
            }
        } ], [ {
            key: "init",
            value: function init(els, options) {
                return _get(_getPrototypeOf(Parallax), "init", this).call(this, this, els, options);
            }
        }, {
            key: "getInstance",
            value: function getInstance(el) {
                var domElem = !!el.jquery ? el[0] : el;
                return domElem.M_Parallax;
            }
        }, {
            key: "_handleScroll",
            value: function _handleScroll() {
                for (var i = 0; i < Parallax._parallaxes.length; i++) {
                    var parallaxInstance = Parallax._parallaxes[i];
                    parallaxInstance._updateParallax.call(parallaxInstance);
                }
            }
        }, {
            key: "_handleWindowResize",
            value: function _handleWindowResize() {
                for (var i = 0; i < Parallax._parallaxes.length; i++) {
                    var parallaxInstance = Parallax._parallaxes[i];
                    parallaxInstance._enabled = window.innerWidth > parallaxInstance.options.responsiveThreshold;
                }
            }
        }, {
            key: "defaults",
            get: function get() {
                return _defaults;
            }
        } ]);
        return Parallax;
    }(Component);
    Parallax._parallaxes = [];
    M.Parallax = Parallax;
    if (M.jQueryLoaded) {
        M.initializeJqueryWrapper(Parallax, "parallax", "M_Parallax");
    }
})(cash);

(function($, anim) {
    "use strict";
    var _defaults = {
        duration: 300,
        onShow: null,
        swipeable: false,
        responsiveThreshold: Infinity
    };
    var Tabs = function(_Component6) {
        _inherits(Tabs, _Component6);
        function Tabs(el, options) {
            var _this22;
            _classCallCheck(this, Tabs);
            _this22 = _possibleConstructorReturn(this, _getPrototypeOf(Tabs).call(this, Tabs, el, options));
            _this22.el.M_Tabs = _assertThisInitialized(_this22);
            _this22.options = $.extend({}, Tabs.defaults, options);
            _this22.$tabLinks = _this22.$el.children("li.tab").children("a");
            _this22.index = 0;
            _this22._setupActiveTabLink();
            if (_this22.options.swipeable) {
                _this22._setupSwipeableTabs();
            } else {
                _this22._setupNormalTabs();
            }
            _this22._setTabsAndTabWidth();
            _this22._createIndicator();
            _this22._setupEventHandlers();
            return _this22;
        }
        _createClass(Tabs, [ {
            key: "destroy",
            value: function destroy() {
                this._removeEventHandlers();
                this._indicator.parentNode.removeChild(this._indicator);
                if (this.options.swipeable) {
                    this._teardownSwipeableTabs();
                } else {
                    this._teardownNormalTabs();
                }
                this.$el[0].M_Tabs = undefined;
            }
        }, {
            key: "_setupEventHandlers",
            value: function _setupEventHandlers() {
                this._handleWindowResizeBound = this._handleWindowResize.bind(this);
                window.addEventListener("resize", this._handleWindowResizeBound);
                this._handleTabClickBound = this._handleTabClick.bind(this);
                this.el.addEventListener("click", this._handleTabClickBound);
            }
        }, {
            key: "_removeEventHandlers",
            value: function _removeEventHandlers() {
                window.removeEventListener("resize", this._handleWindowResizeBound);
                this.el.removeEventListener("click", this._handleTabClickBound);
            }
        }, {
            key: "_handleWindowResize",
            value: function _handleWindowResize() {
                this._setTabsAndTabWidth();
                if (this.tabWidth !== 0 && this.tabsWidth !== 0) {
                    this._indicator.style.left = this._calcLeftPos(this.$activeTabLink) + "px";
                    this._indicator.style.right = this._calcRightPos(this.$activeTabLink) + "px";
                }
            }
        }, {
            key: "_handleTabClick",
            value: function _handleTabClick(e) {
                var _this23 = this;
                var tab = $(e.target).closest("li.tab");
                var tabLink = $(e.target).closest("a");
                if (!tabLink.length || !tabLink.parent().hasClass("tab")) {
                    return;
                }
                if (tab.hasClass("disabled")) {
                    e.preventDefault();
                    return;
                }
                if (!!tabLink.attr("target")) {
                    return;
                }
                this.$activeTabLink.removeClass("active");
                var $oldContent = this.$content;
                this.$activeTabLink = tabLink;
                this.$content = $(M.escapeHash(tabLink[0].hash));
                this.$tabLinks = this.$el.children("li.tab").children("a");
                this.$activeTabLink.addClass("active");
                var prevIndex = this.index;
                this.index = Math.max(this.$tabLinks.index(tabLink), 0);
                if (this.options.swipeable) {
                    if (this._tabsCarousel) {
                        this._tabsCarousel.set(this.index, function() {
                            if (typeof _this23.options.onShow === "function") {
                                _this23.options.onShow.call(_this23, _this23.$content[0]);
                            }
                        });
                    }
                } else {
                    if (this.$content.length) {
                        this.$content[0].style.display = "block";
                        this.$content.addClass("active");
                        if (typeof this.options.onShow === "function") {
                            this.options.onShow.call(this, this.$content[0]);
                        }
                        if ($oldContent.length && !$oldContent.is(this.$content)) {
                            $oldContent[0].style.display = "none";
                            $oldContent.removeClass("active");
                        }
                    }
                }
                this._setTabsAndTabWidth();
                this._animateIndicator(prevIndex);
                e.preventDefault();
            }
        }, {
            key: "_createIndicator",
            value: function _createIndicator() {
                var _this24 = this;
                var indicator = document.createElement("li");
                indicator.classList.add("indicator");
                this.el.appendChild(indicator);
                this._indicator = indicator;
                setTimeout(function() {
                    _this24._indicator.style.left = _this24._calcLeftPos(_this24.$activeTabLink) + "px";
                    _this24._indicator.style.right = _this24._calcRightPos(_this24.$activeTabLink) + "px";
                }, 0);
            }
        }, {
            key: "_setupActiveTabLink",
            value: function _setupActiveTabLink() {
                this.$activeTabLink = $(this.$tabLinks.filter('[href="' + location.hash + '"]'));
                if (this.$activeTabLink.length === 0) {
                    this.$activeTabLink = this.$el.children("li.tab").children("a.active").first();
                }
                if (this.$activeTabLink.length === 0) {
                    this.$activeTabLink = this.$el.children("li.tab").children("a").first();
                }
                this.$tabLinks.removeClass("active");
                this.$activeTabLink[0].classList.add("active");
                this.index = Math.max(this.$tabLinks.index(this.$activeTabLink), 0);
                if (this.$activeTabLink.length) {
                    this.$content = $(M.escapeHash(this.$activeTabLink[0].hash));
                    this.$content.addClass("active");
                }
            }
        }, {
            key: "_setupSwipeableTabs",
            value: function _setupSwipeableTabs() {
                var _this25 = this;
                if (window.innerWidth > this.options.responsiveThreshold) {
                    this.options.swipeable = false;
                }
                var $tabsContent = $();
                this.$tabLinks.each(function(link) {
                    var $currContent = $(M.escapeHash(link.hash));
                    $currContent.addClass("carousel-item");
                    $tabsContent = $tabsContent.add($currContent);
                });
                var $tabsWrapper = $('<div class="tabs-content carousel carousel-slider"></div>');
                $tabsContent.first().before($tabsWrapper);
                $tabsWrapper.append($tabsContent);
                $tabsContent[0].style.display = "";
                var activeTabIndex = this.$activeTabLink.closest(".tab").index();
                this._tabsCarousel = M.Carousel.init($tabsWrapper[0], {
                    fullWidth: true,
                    noWrap: true,
                    onCycleTo: function onCycleTo(item) {
                        var prevIndex = _this25.index;
                        _this25.index = $(item).index();
                        _this25.$activeTabLink.removeClass("active");
                        _this25.$activeTabLink = _this25.$tabLinks.eq(_this25.index);
                        _this25.$activeTabLink.addClass("active");
                        _this25._animateIndicator(prevIndex);
                        if (typeof _this25.options.onShow === "function") {
                            _this25.options.onShow.call(_this25, _this25.$content[0]);
                        }
                    }
                });
                this._tabsCarousel.set(activeTabIndex);
            }
        }, {
            key: "_teardownSwipeableTabs",
            value: function _teardownSwipeableTabs() {
                var $tabsWrapper = this._tabsCarousel.$el;
                this._tabsCarousel.destroy();
                $tabsWrapper.after($tabsWrapper.children());
                $tabsWrapper.remove();
            }
        }, {
            key: "_setupNormalTabs",
            value: function _setupNormalTabs() {
                this.$tabLinks.not(this.$activeTabLink).each(function(link) {
                    if (!!link.hash) {
                        var $currContent = $(M.escapeHash(link.hash));
                        if ($currContent.length) {
                            $currContent[0].style.display = "none";
                        }
                    }
                });
            }
        }, {
            key: "_teardownNormalTabs",
            value: function _teardownNormalTabs() {
                this.$tabLinks.each(function(link) {
                    if (!!link.hash) {
                        var $currContent = $(M.escapeHash(link.hash));
                        if ($currContent.length) {
                            $currContent[0].style.display = "";
                        }
                    }
                });
            }
        }, {
            key: "_setTabsAndTabWidth",
            value: function _setTabsAndTabWidth() {
                this.tabsWidth = this.$el.width();
                this.tabWidth = Math.max(this.tabsWidth, this.el.scrollWidth) / this.$tabLinks.length;
            }
        }, {
            key: "_calcRightPos",
            value: function _calcRightPos(el) {
                return Math.ceil(this.tabsWidth - el.position().left - el[0].getBoundingClientRect().width);
            }
        }, {
            key: "_calcLeftPos",
            value: function _calcLeftPos(el) {
                return Math.floor(el.position().left);
            }
        }, {
            key: "updateTabIndicator",
            value: function updateTabIndicator() {
                this._setTabsAndTabWidth();
                this._animateIndicator(this.index);
            }
        }, {
            key: "_animateIndicator",
            value: function _animateIndicator(prevIndex) {
                var leftDelay = 0, rightDelay = 0;
                if (this.index - prevIndex >= 0) {
                    leftDelay = 90;
                } else {
                    rightDelay = 90;
                }
                var animOptions = {
                    targets: this._indicator,
                    left: {
                        value: this._calcLeftPos(this.$activeTabLink),
                        delay: leftDelay
                    },
                    right: {
                        value: this._calcRightPos(this.$activeTabLink),
                        delay: rightDelay
                    },
                    duration: this.options.duration,
                    easing: "easeOutQuad"
                };
                anim.remove(this._indicator);
                anim(animOptions);
            }
        }, {
            key: "select",
            value: function select(tabId) {
                var tab = this.$tabLinks.filter('[href="#' + tabId + '"]');
                if (tab.length) {
                    tab.trigger("click");
                }
            }
        } ], [ {
            key: "init",
            value: function init(els, options) {
                return _get(_getPrototypeOf(Tabs), "init", this).call(this, this, els, options);
            }
        }, {
            key: "getInstance",
            value: function getInstance(el) {
                var domElem = !!el.jquery ? el[0] : el;
                return domElem.M_Tabs;
            }
        }, {
            key: "defaults",
            get: function get() {
                return _defaults;
            }
        } ]);
        return Tabs;
    }(Component);
    M.Tabs = Tabs;
    if (M.jQueryLoaded) {
        M.initializeJqueryWrapper(Tabs, "tabs", "M_Tabs");
    }
})(cash, M.anime);

(function($, anim) {
    "use strict";
    var _defaults = {
        exitDelay: 200,
        enterDelay: 0,
        html: null,
        margin: 5,
        inDuration: 250,
        outDuration: 200,
        position: "bottom",
        transitionMovement: 10
    };
    var Tooltip = function(_Component7) {
        _inherits(Tooltip, _Component7);
        function Tooltip(el, options) {
            var _this26;
            _classCallCheck(this, Tooltip);
            _this26 = _possibleConstructorReturn(this, _getPrototypeOf(Tooltip).call(this, Tooltip, el, options));
            _this26.el.M_Tooltip = _assertThisInitialized(_this26);
            _this26.options = $.extend({}, Tooltip.defaults, options);
            _this26.isOpen = false;
            _this26.isHovered = false;
            _this26.isFocused = false;
            _this26._appendTooltipEl();
            _this26._setupEventHandlers();
            return _this26;
        }
        _createClass(Tooltip, [ {
            key: "destroy",
            value: function destroy() {
                $(this.tooltipEl).remove();
                this._removeEventHandlers();
                this.el.M_Tooltip = undefined;
            }
        }, {
            key: "_appendTooltipEl",
            value: function _appendTooltipEl() {
                var tooltipEl = document.createElement("div");
                tooltipEl.classList.add("material-tooltip");
                this.tooltipEl = tooltipEl;
                var tooltipContentEl = document.createElement("div");
                tooltipContentEl.classList.add("tooltip-content");
                tooltipContentEl.innerHTML = this.options.html;
                tooltipEl.appendChild(tooltipContentEl);
                document.body.appendChild(tooltipEl);
            }
        }, {
            key: "_updateTooltipContent",
            value: function _updateTooltipContent() {
                this.tooltipEl.querySelector(".tooltip-content").innerHTML = this.options.html;
            }
        }, {
            key: "_setupEventHandlers",
            value: function _setupEventHandlers() {
                this._handleMouseEnterBound = this._handleMouseEnter.bind(this);
                this._handleMouseLeaveBound = this._handleMouseLeave.bind(this);
                this._handleFocusBound = this._handleFocus.bind(this);
                this._handleBlurBound = this._handleBlur.bind(this);
                this.el.addEventListener("mouseenter", this._handleMouseEnterBound);
                this.el.addEventListener("mouseleave", this._handleMouseLeaveBound);
                this.el.addEventListener("focus", this._handleFocusBound, true);
                this.el.addEventListener("blur", this._handleBlurBound, true);
            }
        }, {
            key: "_removeEventHandlers",
            value: function _removeEventHandlers() {
                this.el.removeEventListener("mouseenter", this._handleMouseEnterBound);
                this.el.removeEventListener("mouseleave", this._handleMouseLeaveBound);
                this.el.removeEventListener("focus", this._handleFocusBound, true);
                this.el.removeEventListener("blur", this._handleBlurBound, true);
            }
        }, {
            key: "open",
            value: function open(isManual) {
                if (this.isOpen) {
                    return;
                }
                isManual = isManual === undefined ? true : undefined;
                this.isOpen = true;
                this.options = $.extend({}, this.options, this._getAttributeOptions());
                this._updateTooltipContent();
                this._setEnterDelayTimeout(isManual);
            }
        }, {
            key: "close",
            value: function close() {
                if (!this.isOpen) {
                    return;
                }
                this.isHovered = false;
                this.isFocused = false;
                this.isOpen = false;
                this._setExitDelayTimeout();
            }
        }, {
            key: "_setExitDelayTimeout",
            value: function _setExitDelayTimeout() {
                var _this27 = this;
                clearTimeout(this._exitDelayTimeout);
                this._exitDelayTimeout = setTimeout(function() {
                    if (_this27.isHovered || _this27.isFocused) {
                        return;
                    }
                    _this27._animateOut();
                }, this.options.exitDelay);
            }
        }, {
            key: "_setEnterDelayTimeout",
            value: function _setEnterDelayTimeout(isManual) {
                var _this28 = this;
                clearTimeout(this._enterDelayTimeout);
                this._enterDelayTimeout = setTimeout(function() {
                    if (!_this28.isHovered && !_this28.isFocused && !isManual) {
                        return;
                    }
                    _this28._animateIn();
                }, this.options.enterDelay);
            }
        }, {
            key: "_positionTooltip",
            value: function _positionTooltip() {
                var origin = this.el, tooltip = this.tooltipEl, originHeight = origin.offsetHeight, originWidth = origin.offsetWidth, tooltipHeight = tooltip.offsetHeight, tooltipWidth = tooltip.offsetWidth, newCoordinates, margin = this.options.margin, targetTop, targetLeft;
                this.xMovement = 0, this.yMovement = 0;
                targetTop = origin.getBoundingClientRect().top + M.getDocumentScrollTop();
                targetLeft = origin.getBoundingClientRect().left + M.getDocumentScrollLeft();
                if (this.options.position === "top") {
                    targetTop += -tooltipHeight - margin;
                    targetLeft += originWidth / 2 - tooltipWidth / 2;
                    this.yMovement = -this.options.transitionMovement;
                } else if (this.options.position === "right") {
                    targetTop += originHeight / 2 - tooltipHeight / 2;
                    targetLeft += originWidth + margin;
                    this.xMovement = this.options.transitionMovement;
                } else if (this.options.position === "left") {
                    targetTop += originHeight / 2 - tooltipHeight / 2;
                    targetLeft += -tooltipWidth - margin;
                    this.xMovement = -this.options.transitionMovement;
                } else {
                    targetTop += originHeight + margin;
                    targetLeft += originWidth / 2 - tooltipWidth / 2;
                    this.yMovement = this.options.transitionMovement;
                }
                newCoordinates = this._repositionWithinScreen(targetLeft, targetTop, tooltipWidth, tooltipHeight);
                $(tooltip).css({
                    top: newCoordinates.y + "px",
                    left: newCoordinates.x + "px"
                });
            }
        }, {
            key: "_repositionWithinScreen",
            value: function _repositionWithinScreen(x, y, width, height) {
                var scrollLeft = M.getDocumentScrollLeft();
                var scrollTop = M.getDocumentScrollTop();
                var newX = x - scrollLeft;
                var newY = y - scrollTop;
                var bounding = {
                    left: newX,
                    top: newY,
                    width: width,
                    height: height
                };
                var offset = this.options.margin + this.options.transitionMovement;
                var edges = M.checkWithinContainer(document.body, bounding, offset);
                if (edges.left) {
                    newX = offset;
                } else if (edges.right) {
                    newX -= newX + width - window.innerWidth;
                }
                if (edges.top) {
                    newY = offset;
                } else if (edges.bottom) {
                    newY -= newY + height - window.innerHeight;
                }
                return {
                    x: newX + scrollLeft,
                    y: newY + scrollTop
                };
            }
        }, {
            key: "_animateIn",
            value: function _animateIn() {
                this._positionTooltip();
                this.tooltipEl.style.visibility = "visible";
                anim.remove(this.tooltipEl);
                anim({
                    targets: this.tooltipEl,
                    opacity: 1,
                    translateX: this.xMovement,
                    translateY: this.yMovement,
                    duration: this.options.inDuration,
                    easing: "easeOutCubic"
                });
            }
        }, {
            key: "_animateOut",
            value: function _animateOut() {
                anim.remove(this.tooltipEl);
                anim({
                    targets: this.tooltipEl,
                    opacity: 0,
                    translateX: 0,
                    translateY: 0,
                    duration: this.options.outDuration,
                    easing: "easeOutCubic"
                });
            }
        }, {
            key: "_handleMouseEnter",
            value: function _handleMouseEnter() {
                this.isHovered = true;
                this.isFocused = false;
                this.open(false);
            }
        }, {
            key: "_handleMouseLeave",
            value: function _handleMouseLeave() {
                this.isHovered = false;
                this.isFocused = false;
                this.close();
            }
        }, {
            key: "_handleFocus",
            value: function _handleFocus() {
                if (M.tabPressed) {
                    this.isFocused = true;
                    this.open(false);
                }
            }
        }, {
            key: "_handleBlur",
            value: function _handleBlur() {
                this.isFocused = false;
                this.close();
            }
        }, {
            key: "_getAttributeOptions",
            value: function _getAttributeOptions() {
                var attributeOptions = {};
                var tooltipTextOption = this.el.getAttribute("data-tooltip");
                var positionOption = this.el.getAttribute("data-position");
                if (tooltipTextOption) {
                    attributeOptions.html = tooltipTextOption;
                }
                if (positionOption) {
                    attributeOptions.position = positionOption;
                }
                return attributeOptions;
            }
        } ], [ {
            key: "init",
            value: function init(els, options) {
                return _get(_getPrototypeOf(Tooltip), "init", this).call(this, this, els, options);
            }
        }, {
            key: "getInstance",
            value: function getInstance(el) {
                var domElem = !!el.jquery ? el[0] : el;
                return domElem.M_Tooltip;
            }
        }, {
            key: "defaults",
            get: function get() {
                return _defaults;
            }
        } ]);
        return Tooltip;
    }(Component);
    M.Tooltip = Tooltip;
    if (M.jQueryLoaded) {
        M.initializeJqueryWrapper(Tooltip, "tooltip", "M_Tooltip");
    }
})(cash, M.anime);

(function(window) {
    "use strict";
    var Waves = Waves || {};
    var $$ = document.querySelectorAll.bind(document);
    function isWindow(obj) {
        return obj !== null && obj === obj.window;
    }
    function getWindow(elem) {
        return isWindow(elem) ? elem : elem.nodeType === 9 && elem.defaultView;
    }
    function offset(elem) {
        var docElem, win, box = {
            top: 0,
            left: 0
        }, doc = elem && elem.ownerDocument;
        docElem = doc.documentElement;
        if (_typeof(elem.getBoundingClientRect) !== (typeof undefined === "undefined" ? "undefined" : _typeof(undefined))) {
            box = elem.getBoundingClientRect();
        }
        win = getWindow(doc);
        return {
            top: box.top + win.pageYOffset - docElem.clientTop,
            left: box.left + win.pageXOffset - docElem.clientLeft
        };
    }
    function convertStyle(obj) {
        var style = "";
        for (var a in obj) {
            if (obj.hasOwnProperty(a)) {
                style += a + ":" + obj[a] + ";";
            }
        }
        return style;
    }
    var Effect = {
        duration: 750,
        show: function show(e, element) {
            if (e.button === 2) {
                return false;
            }
            var el = element || this;
            var ripple = document.createElement("div");
            ripple.className = "waves-ripple";
            el.appendChild(ripple);
            var pos = offset(el);
            var relativeY = e.pageY - pos.top;
            var relativeX = e.pageX - pos.left;
            var scale = "scale(" + el.clientWidth / 100 * 10 + ")";
            if ("touches" in e) {
                relativeY = e.touches[0].pageY - pos.top;
                relativeX = e.touches[0].pageX - pos.left;
            }
            ripple.setAttribute("data-hold", Date.now());
            ripple.setAttribute("data-scale", scale);
            ripple.setAttribute("data-x", relativeX);
            ripple.setAttribute("data-y", relativeY);
            var rippleStyle = {
                top: relativeY + "px",
                left: relativeX + "px"
            };
            ripple.className = ripple.className + " waves-notransition";
            ripple.setAttribute("style", convertStyle(rippleStyle));
            ripple.className = ripple.className.replace("waves-notransition", "");
            rippleStyle["-webkit-transform"] = scale;
            rippleStyle["-moz-transform"] = scale;
            rippleStyle["-ms-transform"] = scale;
            rippleStyle["-o-transform"] = scale;
            rippleStyle.transform = scale;
            rippleStyle.opacity = "1";
            rippleStyle["-webkit-transition-duration"] = Effect.duration + "ms";
            rippleStyle["-moz-transition-duration"] = Effect.duration + "ms";
            rippleStyle["-o-transition-duration"] = Effect.duration + "ms";
            rippleStyle["transition-duration"] = Effect.duration + "ms";
            rippleStyle["-webkit-transition-timing-function"] = "cubic-bezier(0.250, 0.460, 0.450, 0.940)";
            rippleStyle["-moz-transition-timing-function"] = "cubic-bezier(0.250, 0.460, 0.450, 0.940)";
            rippleStyle["-o-transition-timing-function"] = "cubic-bezier(0.250, 0.460, 0.450, 0.940)";
            rippleStyle["transition-timing-function"] = "cubic-bezier(0.250, 0.460, 0.450, 0.940)";
            ripple.setAttribute("style", convertStyle(rippleStyle));
        },
        hide: function hide(e) {
            TouchHandler.touchup(e);
            var el = this;
            var width = el.clientWidth * 1.4;
            var ripple = null;
            var ripples = el.getElementsByClassName("waves-ripple");
            if (ripples.length > 0) {
                ripple = ripples[ripples.length - 1];
            } else {
                return false;
            }
            var relativeX = ripple.getAttribute("data-x");
            var relativeY = ripple.getAttribute("data-y");
            var scale = ripple.getAttribute("data-scale");
            var diff = Date.now() - Number(ripple.getAttribute("data-hold"));
            var delay = 350 - diff;
            if (delay < 0) {
                delay = 0;
            }
            setTimeout(function() {
                var style = {
                    top: relativeY + "px",
                    left: relativeX + "px",
                    opacity: "0",
                    "-webkit-transition-duration": Effect.duration + "ms",
                    "-moz-transition-duration": Effect.duration + "ms",
                    "-o-transition-duration": Effect.duration + "ms",
                    "transition-duration": Effect.duration + "ms",
                    "-webkit-transform": scale,
                    "-moz-transform": scale,
                    "-ms-transform": scale,
                    "-o-transform": scale,
                    transform: scale
                };
                ripple.setAttribute("style", convertStyle(style));
                setTimeout(function() {
                    try {
                        el.removeChild(ripple);
                    } catch (e) {
                        return false;
                    }
                }, Effect.duration);
            }, delay);
        },
        wrapInput: function wrapInput(elements) {
            for (var a = 0; a < elements.length; a++) {
                var el = elements[a];
                if (el.tagName.toLowerCase() === "input") {
                    var parent = el.parentNode;
                    if (parent.tagName.toLowerCase() === "i" && parent.className.indexOf("waves-effect") !== -1) {
                        continue;
                    }
                    var wrapper = document.createElement("i");
                    wrapper.className = el.className + " waves-input-wrapper";
                    var elementStyle = el.getAttribute("style");
                    if (!elementStyle) {
                        elementStyle = "";
                    }
                    wrapper.setAttribute("style", elementStyle);
                    el.className = "waves-button-input";
                    el.removeAttribute("style");
                    parent.replaceChild(wrapper, el);
                    wrapper.appendChild(el);
                }
            }
        }
    };
    var TouchHandler = {
        touches: 0,
        allowEvent: function allowEvent(e) {
            var allow = true;
            if (e.type === "touchstart") {
                TouchHandler.touches += 1;
            } else if (e.type === "touchend" || e.type === "touchcancel") {
                setTimeout(function() {
                    if (TouchHandler.touches > 0) {
                        TouchHandler.touches -= 1;
                    }
                }, 500);
            } else if (e.type === "mousedown" && TouchHandler.touches > 0) {
                allow = false;
            }
            return allow;
        },
        touchup: function touchup(e) {
            TouchHandler.allowEvent(e);
        }
    };
    function getWavesEffectElement(e) {
        if (TouchHandler.allowEvent(e) === false) {
            return null;
        }
        var element = null;
        var target = e.target || e.srcElement;
        while (target.parentNode !== null) {
            if (!(target instanceof SVGElement) && target.className.indexOf("waves-effect") !== -1) {
                element = target;
                break;
            }
            target = target.parentNode;
        }
        return element;
    }
    function showEffect(e) {
        var element = getWavesEffectElement(e);
        if (element !== null) {
            Effect.show(e, element);
            if ("ontouchstart" in window) {
                element.addEventListener("touchend", Effect.hide, false);
                element.addEventListener("touchcancel", Effect.hide, false);
            }
            element.addEventListener("mouseup", Effect.hide, false);
            element.addEventListener("mouseleave", Effect.hide, false);
            element.addEventListener("dragend", Effect.hide, false);
        }
    }
    Waves.displayEffect = function(options) {
        options = options || {};
        if ("duration" in options) {
            Effect.duration = options.duration;
        }
        Effect.wrapInput($$(".waves-effect"));
        if ("ontouchstart" in window) {
            document.body.addEventListener("touchstart", showEffect, false);
        }
        document.body.addEventListener("mousedown", showEffect, false);
    };
    Waves.attach = function(element) {
        if (element.tagName.toLowerCase() === "input") {
            Effect.wrapInput([ element ]);
            element = element.parentNode;
        }
        if ("ontouchstart" in window) {
            element.addEventListener("touchstart", showEffect, false);
        }
        element.addEventListener("mousedown", showEffect, false);
    };
    window.Waves = Waves;
    document.addEventListener("DOMContentLoaded", function() {
        Waves.displayEffect();
    }, false);
})(window);

(function($, anim) {
    "use strict";
    var _defaults = {
        html: "",
        displayLength: 4e3,
        inDuration: 300,
        outDuration: 375,
        classes: "",
        completeCallback: null,
        activationPercent: .8
    };
    var Toast = function() {
        function Toast(options) {
            _classCallCheck(this, Toast);
            this.options = $.extend({}, Toast.defaults, options);
            this.message = this.options.html;
            this.panning = false;
            this.timeRemaining = this.options.displayLength;
            if (Toast._toasts.length === 0) {
                Toast._createContainer();
            }
            Toast._toasts.push(this);
            var toastElement = this._createToast();
            toastElement.M_Toast = this;
            this.el = toastElement;
            this.$el = $(toastElement);
            this._animateIn();
            this._setTimer();
        }
        _createClass(Toast, [ {
            key: "_createToast",
            value: function _createToast() {
                var toast = document.createElement("div");
                toast.classList.add("toast");
                if (!!this.options.classes.length) {
                    $(toast).addClass(this.options.classes);
                }
                if ((typeof HTMLElement === "undefined" ? "undefined" : _typeof(HTMLElement)) === "object" ? this.message instanceof HTMLElement : this.message && _typeof(this.message) === "object" && this.message !== null && this.message.nodeType === 1 && typeof this.message.nodeName === "string") {
                    toast.appendChild(this.message);
                } else if (!!this.message.jquery) {
                    $(toast).append(this.message[0]);
                } else {
                    toast.innerHTML = this.message;
                }
                Toast._container.appendChild(toast);
                return toast;
            }
        }, {
            key: "_animateIn",
            value: function _animateIn() {
                anim({
                    targets: this.el,
                    top: 0,
                    opacity: 1,
                    duration: this.options.inDuration,
                    easing: "easeOutCubic"
                });
            }
        }, {
            key: "_setTimer",
            value: function _setTimer() {
                var _this29 = this;
                if (this.timeRemaining !== Infinity) {
                    this.counterInterval = setInterval(function() {
                        if (!_this29.panning) {
                            _this29.timeRemaining -= 20;
                        }
                        if (_this29.timeRemaining <= 0) {
                            _this29.dismiss();
                        }
                    }, 20);
                }
            }
        }, {
            key: "dismiss",
            value: function dismiss() {
                var _this30 = this;
                window.clearInterval(this.counterInterval);
                var activationDistance = this.el.offsetWidth * this.options.activationPercent;
                if (this.wasSwiped) {
                    this.el.style.transition = "transform .05s, opacity .05s";
                    this.el.style.transform = "translateX(".concat(activationDistance, "px)");
                    this.el.style.opacity = 0;
                }
                anim({
                    targets: this.el,
                    opacity: 0,
                    marginTop: -40,
                    duration: this.options.outDuration,
                    easing: "easeOutExpo",
                    complete: function complete() {
                        if (typeof _this30.options.completeCallback === "function") {
                            _this30.options.completeCallback();
                        }
                        _this30.$el.remove();
                        Toast._toasts.splice(Toast._toasts.indexOf(_this30), 1);
                        if (Toast._toasts.length === 0) {
                            Toast._removeContainer();
                        }
                    }
                });
            }
        } ], [ {
            key: "getInstance",
            value: function getInstance(el) {
                var domElem = !!el.jquery ? el[0] : el;
                return domElem.M_Toast;
            }
        }, {
            key: "_createContainer",
            value: function _createContainer() {
                var container = document.createElement("div");
                container.setAttribute("id", "toast-container");
                container.addEventListener("touchstart", Toast._onDragStart);
                container.addEventListener("touchmove", Toast._onDragMove);
                container.addEventListener("touchend", Toast._onDragEnd);
                container.addEventListener("mousedown", Toast._onDragStart);
                document.addEventListener("mousemove", Toast._onDragMove);
                document.addEventListener("mouseup", Toast._onDragEnd);
                document.body.appendChild(container);
                Toast._container = container;
            }
        }, {
            key: "_removeContainer",
            value: function _removeContainer() {
                document.removeEventListener("mousemove", Toast._onDragMove);
                document.removeEventListener("mouseup", Toast._onDragEnd);
                $(Toast._container).remove();
                Toast._container = null;
            }
        }, {
            key: "_onDragStart",
            value: function _onDragStart(e) {
                if (e.target && $(e.target).closest(".toast").length) {
                    var $toast = $(e.target).closest(".toast");
                    var toast = $toast[0].M_Toast;
                    toast.panning = true;
                    Toast._draggedToast = toast;
                    toast.el.classList.add("panning");
                    toast.el.style.transition = "";
                    toast.startingXPos = Toast._xPos(e);
                    toast.time = Date.now();
                    toast.xPos = Toast._xPos(e);
                }
            }
        }, {
            key: "_onDragMove",
            value: function _onDragMove(e) {
                if (!!Toast._draggedToast) {
                    e.preventDefault();
                    var toast = Toast._draggedToast;
                    toast.deltaX = Math.abs(toast.xPos - Toast._xPos(e));
                    toast.xPos = Toast._xPos(e);
                    toast.velocityX = toast.deltaX / (Date.now() - toast.time);
                    toast.time = Date.now();
                    var totalDeltaX = toast.xPos - toast.startingXPos;
                    var activationDistance = toast.el.offsetWidth * toast.options.activationPercent;
                    toast.el.style.transform = "translateX(".concat(totalDeltaX, "px)");
                    toast.el.style.opacity = 1 - Math.abs(totalDeltaX / activationDistance);
                }
            }
        }, {
            key: "_onDragEnd",
            value: function _onDragEnd() {
                if (!!Toast._draggedToast) {
                    var toast = Toast._draggedToast;
                    toast.panning = false;
                    toast.el.classList.remove("panning");
                    var totalDeltaX = toast.xPos - toast.startingXPos;
                    var activationDistance = toast.el.offsetWidth * toast.options.activationPercent;
                    var shouldBeDismissed = Math.abs(totalDeltaX) > activationDistance || toast.velocityX > 1;
                    if (shouldBeDismissed) {
                        toast.wasSwiped = true;
                        toast.dismiss();
                    } else {
                        toast.el.style.transition = "transform .2s, opacity .2s";
                        toast.el.style.transform = "";
                        toast.el.style.opacity = "";
                    }
                    Toast._draggedToast = null;
                }
            }
        }, {
            key: "_xPos",
            value: function _xPos(e) {
                if (e.targetTouches && e.targetTouches.length >= 1) {
                    return e.targetTouches[0].clientX;
                }
                return e.clientX;
            }
        }, {
            key: "dismissAll",
            value: function dismissAll() {
                for (var toastIndex in Toast._toasts) {
                    Toast._toasts[toastIndex].dismiss();
                }
            }
        }, {
            key: "defaults",
            get: function get() {
                return _defaults;
            }
        } ]);
        return Toast;
    }();
    Toast._toasts = [];
    Toast._container = null;
    Toast._draggedToast = null;
    M.Toast = Toast;
    M.toast = function(options) {
        return new Toast(options);
    };
})(cash, M.anime);

(function($, anim) {
    "use strict";
    var _defaults = {
        edge: "left",
        draggable: true,
        inDuration: 250,
        outDuration: 200,
        onOpenStart: null,
        onOpenEnd: null,
        onCloseStart: null,
        onCloseEnd: null,
        preventScrolling: true
    };
    var Sidenav = function(_Component8) {
        _inherits(Sidenav, _Component8);
        function Sidenav(el, options) {
            var _this31;
            _classCallCheck(this, Sidenav);
            _this31 = _possibleConstructorReturn(this, _getPrototypeOf(Sidenav).call(this, Sidenav, el, options));
            _this31.el.M_Sidenav = _assertThisInitialized(_this31);
            _this31.id = _this31.$el.attr("id");
            _this31.options = $.extend({}, Sidenav.defaults, options);
            _this31.isOpen = false;
            _this31.isFixed = _this31.el.classList.contains("sidenav-fixed");
            _this31.isDragged = false;
            _this31.lastWindowWidth = window.innerWidth;
            _this31.lastWindowHeight = window.innerHeight;
            _this31._createOverlay();
            _this31._createDragTarget();
            _this31._setupEventHandlers();
            _this31._setupClasses();
            _this31._setupFixed();
            Sidenav._sidenavs.push(_assertThisInitialized(_this31));
            return _this31;
        }
        _createClass(Sidenav, [ {
            key: "destroy",
            value: function destroy() {
                this._removeEventHandlers();
                this._enableBodyScrolling();
                this._overlay.parentNode.removeChild(this._overlay);
                this.dragTarget.parentNode.removeChild(this.dragTarget);
                this.el.M_Sidenav = undefined;
                this.el.style.transform = "";
                var index = Sidenav._sidenavs.indexOf(this);
                if (index >= 0) {
                    Sidenav._sidenavs.splice(index, 1);
                }
            }
        }, {
            key: "_createOverlay",
            value: function _createOverlay() {
                var overlay = document.createElement("div");
                this._closeBound = this.close.bind(this);
                overlay.classList.add("sidenav-overlay");
                overlay.addEventListener("click", this._closeBound);
                document.body.appendChild(overlay);
                this._overlay = overlay;
            }
        }, {
            key: "_setupEventHandlers",
            value: function _setupEventHandlers() {
                if (Sidenav._sidenavs.length === 0) {
                    document.body.addEventListener("click", this._handleTriggerClick);
                }
                this._handleDragTargetDragBound = this._handleDragTargetDrag.bind(this);
                this._handleDragTargetReleaseBound = this._handleDragTargetRelease.bind(this);
                this._handleCloseDragBound = this._handleCloseDrag.bind(this);
                this._handleCloseReleaseBound = this._handleCloseRelease.bind(this);
                this._handleCloseTriggerClickBound = this._handleCloseTriggerClick.bind(this);
                this.dragTarget.addEventListener("touchmove", this._handleDragTargetDragBound);
                this.dragTarget.addEventListener("touchend", this._handleDragTargetReleaseBound);
                this._overlay.addEventListener("touchmove", this._handleCloseDragBound);
                this._overlay.addEventListener("touchend", this._handleCloseReleaseBound);
                this.el.addEventListener("touchmove", this._handleCloseDragBound);
                this.el.addEventListener("touchend", this._handleCloseReleaseBound);
                this.el.addEventListener("click", this._handleCloseTriggerClickBound);
                if (this.isFixed) {
                    this._handleWindowResizeBound = this._handleWindowResize.bind(this);
                    window.addEventListener("resize", this._handleWindowResizeBound);
                }
            }
        }, {
            key: "_removeEventHandlers",
            value: function _removeEventHandlers() {
                if (Sidenav._sidenavs.length === 1) {
                    document.body.removeEventListener("click", this._handleTriggerClick);
                }
                this.dragTarget.removeEventListener("touchmove", this._handleDragTargetDragBound);
                this.dragTarget.removeEventListener("touchend", this._handleDragTargetReleaseBound);
                this._overlay.removeEventListener("touchmove", this._handleCloseDragBound);
                this._overlay.removeEventListener("touchend", this._handleCloseReleaseBound);
                this.el.removeEventListener("touchmove", this._handleCloseDragBound);
                this.el.removeEventListener("touchend", this._handleCloseReleaseBound);
                this.el.removeEventListener("click", this._handleCloseTriggerClickBound);
                if (this.isFixed) {
                    window.removeEventListener("resize", this._handleWindowResizeBound);
                }
            }
        }, {
            key: "_handleTriggerClick",
            value: function _handleTriggerClick(e) {
                var $trigger = $(e.target).closest(".sidenav-trigger");
                if (e.target && $trigger.length) {
                    var sidenavId = M.getIdFromTrigger($trigger[0]);
                    var sidenavInstance = document.getElementById(sidenavId).M_Sidenav;
                    if (sidenavInstance) {
                        sidenavInstance.open($trigger);
                    }
                    e.preventDefault();
                }
            }
        }, {
            key: "_startDrag",
            value: function _startDrag(e) {
                var clientX = e.targetTouches[0].clientX;
                this.isDragged = true;
                this._startingXpos = clientX;
                this._xPos = this._startingXpos;
                this._time = Date.now();
                this._width = this.el.getBoundingClientRect().width;
                this._overlay.style.display = "block";
                this._initialScrollTop = this.isOpen ? this.el.scrollTop : M.getDocumentScrollTop();
                this._verticallyScrolling = false;
                anim.remove(this.el);
                anim.remove(this._overlay);
            }
        }, {
            key: "_dragMoveUpdate",
            value: function _dragMoveUpdate(e) {
                var clientX = e.targetTouches[0].clientX;
                var currentScrollTop = this.isOpen ? this.el.scrollTop : M.getDocumentScrollTop();
                this.deltaX = Math.abs(this._xPos - clientX);
                this._xPos = clientX;
                this.velocityX = this.deltaX / (Date.now() - this._time);
                this._time = Date.now();
                if (this._initialScrollTop !== currentScrollTop) {
                    this._verticallyScrolling = true;
                }
            }
        }, {
            key: "_handleDragTargetDrag",
            value: function _handleDragTargetDrag(e) {
                if (!this.options.draggable || this._isCurrentlyFixed() || this._verticallyScrolling) {
                    return;
                }
                if (!this.isDragged) {
                    this._startDrag(e);
                }
                this._dragMoveUpdate(e);
                var totalDeltaX = this._xPos - this._startingXpos;
                var dragDirection = totalDeltaX > 0 ? "right" : "left";
                totalDeltaX = Math.min(this._width, Math.abs(totalDeltaX));
                if (this.options.edge === dragDirection) {
                    totalDeltaX = 0;
                }
                var transformX = totalDeltaX;
                var transformPrefix = "translateX(-100%)";
                if (this.options.edge === "right") {
                    transformPrefix = "translateX(100%)";
                    transformX = -transformX;
                }
                this.percentOpen = Math.min(1, totalDeltaX / this._width);
                this.el.style.transform = "".concat(transformPrefix, " translateX(").concat(transformX, "px)");
                this._overlay.style.opacity = this.percentOpen;
            }
        }, {
            key: "_handleDragTargetRelease",
            value: function _handleDragTargetRelease() {
                if (this.isDragged) {
                    if (this.percentOpen > .2) {
                        this.open();
                    } else {
                        this._animateOut();
                    }
                    this.isDragged = false;
                    this._verticallyScrolling = false;
                }
            }
        }, {
            key: "_handleCloseDrag",
            value: function _handleCloseDrag(e) {
                if (this.isOpen) {
                    if (!this.options.draggable || this._isCurrentlyFixed() || this._verticallyScrolling) {
                        return;
                    }
                    if (!this.isDragged) {
                        this._startDrag(e);
                    }
                    this._dragMoveUpdate(e);
                    var totalDeltaX = this._xPos - this._startingXpos;
                    var dragDirection = totalDeltaX > 0 ? "right" : "left";
                    totalDeltaX = Math.min(this._width, Math.abs(totalDeltaX));
                    if (this.options.edge !== dragDirection) {
                        totalDeltaX = 0;
                    }
                    var transformX = -totalDeltaX;
                    if (this.options.edge === "right") {
                        transformX = -transformX;
                    }
                    this.percentOpen = Math.min(1, 1 - totalDeltaX / this._width);
                    this.el.style.transform = "translateX(".concat(transformX, "px)");
                    this._overlay.style.opacity = this.percentOpen;
                }
            }
        }, {
            key: "_handleCloseRelease",
            value: function _handleCloseRelease() {
                if (this.isOpen && this.isDragged) {
                    if (this.percentOpen > .8) {
                        this._animateIn();
                    } else {
                        this.close();
                    }
                    this.isDragged = false;
                    this._verticallyScrolling = false;
                }
            }
        }, {
            key: "_handleCloseTriggerClick",
            value: function _handleCloseTriggerClick(e) {
                var $closeTrigger = $(e.target).closest(".sidenav-close");
                if ($closeTrigger.length && !this._isCurrentlyFixed()) {
                    this.close();
                }
            }
        }, {
            key: "_handleWindowResize",
            value: function _handleWindowResize() {
                if (this.lastWindowWidth !== window.innerWidth) {
                    if (window.innerWidth > 992) {
                        this.open();
                    } else {
                        this.close();
                    }
                }
                this.lastWindowWidth = window.innerWidth;
                this.lastWindowHeight = window.innerHeight;
            }
        }, {
            key: "_setupClasses",
            value: function _setupClasses() {
                if (this.options.edge === "right") {
                    this.el.classList.add("right-aligned");
                    this.dragTarget.classList.add("right-aligned");
                }
            }
        }, {
            key: "_removeClasses",
            value: function _removeClasses() {
                this.el.classList.remove("right-aligned");
                this.dragTarget.classList.remove("right-aligned");
            }
        }, {
            key: "_setupFixed",
            value: function _setupFixed() {
                if (this._isCurrentlyFixed()) {
                    this.open();
                }
            }
        }, {
            key: "_isCurrentlyFixed",
            value: function _isCurrentlyFixed() {
                return this.isFixed && window.innerWidth > 992;
            }
        }, {
            key: "_createDragTarget",
            value: function _createDragTarget() {
                var dragTarget = document.createElement("div");
                dragTarget.classList.add("drag-target");
                document.body.appendChild(dragTarget);
                this.dragTarget = dragTarget;
            }
        }, {
            key: "_preventBodyScrolling",
            value: function _preventBodyScrolling() {
                var body = document.body;
                body.style.overflow = "hidden";
            }
        }, {
            key: "_enableBodyScrolling",
            value: function _enableBodyScrolling() {
                var body = document.body;
                body.style.overflow = "";
            }
        }, {
            key: "open",
            value: function open() {
                if (this.isOpen === true) {
                    return;
                }
                this.isOpen = true;
                if (typeof this.options.onOpenStart === "function") {
                    this.options.onOpenStart.call(this, this.el);
                }
                if (this._isCurrentlyFixed()) {
                    anim.remove(this.el);
                    anim({
                        targets: this.el,
                        translateX: 0,
                        duration: 0,
                        easing: "easeOutQuad"
                    });
                    this._enableBodyScrolling();
                    this._overlay.style.display = "none";
                } else {
                    if (this.options.preventScrolling) {
                        this._preventBodyScrolling();
                    }
                    if (!this.isDragged || this.percentOpen != 1) {
                        this._animateIn();
                    }
                }
            }
        }, {
            key: "close",
            value: function close() {
                if (this.isOpen === false) {
                    return;
                }
                this.isOpen = false;
                if (typeof this.options.onCloseStart === "function") {
                    this.options.onCloseStart.call(this, this.el);
                }
                if (this._isCurrentlyFixed()) {
                    var transformX = this.options.edge === "left" ? "-105%" : "105%";
                    this.el.style.transform = "translateX(".concat(transformX, ")");
                } else {
                    this._enableBodyScrolling();
                    if (!this.isDragged || this.percentOpen != 0) {
                        this._animateOut();
                    } else {
                        this._overlay.style.display = "none";
                    }
                }
            }
        }, {
            key: "_animateIn",
            value: function _animateIn() {
                this._animateSidenavIn();
                this._animateOverlayIn();
            }
        }, {
            key: "_animateSidenavIn",
            value: function _animateSidenavIn() {
                var _this32 = this;
                var slideOutPercent = this.options.edge === "left" ? -1 : 1;
                if (this.isDragged) {
                    slideOutPercent = this.options.edge === "left" ? slideOutPercent + this.percentOpen : slideOutPercent - this.percentOpen;
                }
                anim.remove(this.el);
                anim({
                    targets: this.el,
                    translateX: [ "".concat(slideOutPercent * 100, "%"), 0 ],
                    duration: this.options.inDuration,
                    easing: "easeOutQuad",
                    complete: function complete() {
                        if (typeof _this32.options.onOpenEnd === "function") {
                            _this32.options.onOpenEnd.call(_this32, _this32.el);
                        }
                    }
                });
            }
        }, {
            key: "_animateOverlayIn",
            value: function _animateOverlayIn() {
                var start = 0;
                if (this.isDragged) {
                    start = this.percentOpen;
                } else {
                    $(this._overlay).css({
                        display: "block"
                    });
                }
                anim.remove(this._overlay);
                anim({
                    targets: this._overlay,
                    opacity: [ start, 1 ],
                    duration: this.options.inDuration,
                    easing: "easeOutQuad"
                });
            }
        }, {
            key: "_animateOut",
            value: function _animateOut() {
                this._animateSidenavOut();
                this._animateOverlayOut();
            }
        }, {
            key: "_animateSidenavOut",
            value: function _animateSidenavOut() {
                var _this33 = this;
                var endPercent = this.options.edge === "left" ? -1 : 1;
                var slideOutPercent = 0;
                if (this.isDragged) {
                    slideOutPercent = this.options.edge === "left" ? endPercent + this.percentOpen : endPercent - this.percentOpen;
                }
                anim.remove(this.el);
                anim({
                    targets: this.el,
                    translateX: [ "".concat(slideOutPercent * 100, "%"), "".concat(endPercent * 105, "%") ],
                    duration: this.options.outDuration,
                    easing: "easeOutQuad",
                    complete: function complete() {
                        if (typeof _this33.options.onCloseEnd === "function") {
                            _this33.options.onCloseEnd.call(_this33, _this33.el);
                        }
                    }
                });
            }
        }, {
            key: "_animateOverlayOut",
            value: function _animateOverlayOut() {
                var _this34 = this;
                anim.remove(this._overlay);
                anim({
                    targets: this._overlay,
                    opacity: 0,
                    duration: this.options.outDuration,
                    easing: "easeOutQuad",
                    complete: function complete() {
                        $(_this34._overlay).css("display", "none");
                    }
                });
            }
        } ], [ {
            key: "init",
            value: function init(els, options) {
                return _get(_getPrototypeOf(Sidenav), "init", this).call(this, this, els, options);
            }
        }, {
            key: "getInstance",
            value: function getInstance(el) {
                var domElem = !!el.jquery ? el[0] : el;
                return domElem.M_Sidenav;
            }
        }, {
            key: "defaults",
            get: function get() {
                return _defaults;
            }
        } ]);
        return Sidenav;
    }(Component);
    Sidenav._sidenavs = [];
    M.Sidenav = Sidenav;
    if (M.jQueryLoaded) {
        M.initializeJqueryWrapper(Sidenav, "sidenav", "M_Sidenav");
    }
})(cash, M.anime);

(function($, anim) {
    "use strict";
    var _defaults = {
        throttle: 100,
        scrollOffset: 200,
        activeClass: "active",
        getActiveElement: function getActiveElement(id) {
            return 'a[href="#' + id + '"]';
        }
    };
    var ScrollSpy = function(_Component9) {
        _inherits(ScrollSpy, _Component9);
        function ScrollSpy(el, options) {
            var _this35;
            _classCallCheck(this, ScrollSpy);
            _this35 = _possibleConstructorReturn(this, _getPrototypeOf(ScrollSpy).call(this, ScrollSpy, el, options));
            _this35.el.M_ScrollSpy = _assertThisInitialized(_this35);
            _this35.options = $.extend({}, ScrollSpy.defaults, options);
            ScrollSpy._elements.push(_assertThisInitialized(_this35));
            ScrollSpy._count++;
            ScrollSpy._increment++;
            _this35.tickId = -1;
            _this35.id = ScrollSpy._increment;
            _this35._setupEventHandlers();
            _this35._handleWindowScroll();
            return _this35;
        }
        _createClass(ScrollSpy, [ {
            key: "destroy",
            value: function destroy() {
                ScrollSpy._elements.splice(ScrollSpy._elements.indexOf(this), 1);
                ScrollSpy._elementsInView.splice(ScrollSpy._elementsInView.indexOf(this), 1);
                ScrollSpy._visibleElements.splice(ScrollSpy._visibleElements.indexOf(this.$el), 1);
                ScrollSpy._count--;
                this._removeEventHandlers();
                $(this.options.getActiveElement(this.$el.attr("id"))).removeClass(this.options.activeClass);
                this.el.M_ScrollSpy = undefined;
            }
        }, {
            key: "_setupEventHandlers",
            value: function _setupEventHandlers() {
                var throttledResize = M.throttle(this._handleWindowScroll, 200);
                this._handleThrottledResizeBound = throttledResize.bind(this);
                this._handleWindowScrollBound = this._handleWindowScroll.bind(this);
                if (ScrollSpy._count === 1) {
                    window.addEventListener("scroll", this._handleWindowScrollBound);
                    window.addEventListener("resize", this._handleThrottledResizeBound);
                    document.body.addEventListener("click", this._handleTriggerClick);
                }
            }
        }, {
            key: "_removeEventHandlers",
            value: function _removeEventHandlers() {
                if (ScrollSpy._count === 0) {
                    window.removeEventListener("scroll", this._handleWindowScrollBound);
                    window.removeEventListener("resize", this._handleThrottledResizeBound);
                    document.body.removeEventListener("click", this._handleTriggerClick);
                }
            }
        }, {
            key: "_handleTriggerClick",
            value: function _handleTriggerClick(e) {
                var $trigger = $(e.target);
                for (var i = ScrollSpy._elements.length - 1; i >= 0; i--) {
                    var scrollspy = ScrollSpy._elements[i];
                    if ($trigger.is('a[href="#' + scrollspy.$el.attr("id") + '"]')) {
                        e.preventDefault();
                        var offset = scrollspy.$el.offset().top + 1;
                        anim({
                            targets: [ document.documentElement, document.body ],
                            scrollTop: offset - scrollspy.options.scrollOffset,
                            duration: 400,
                            easing: "easeOutCubic"
                        });
                        break;
                    }
                }
            }
        }, {
            key: "_handleWindowScroll",
            value: function _handleWindowScroll() {
                ScrollSpy._ticks++;
                var top = M.getDocumentScrollTop(), left = M.getDocumentScrollLeft(), right = left + window.innerWidth, bottom = top + window.innerHeight;
                var intersections = ScrollSpy._findElements(top, right, bottom, left);
                for (var i = 0; i < intersections.length; i++) {
                    var scrollspy = intersections[i];
                    var lastTick = scrollspy.tickId;
                    if (lastTick < 0) {
                        scrollspy._enter();
                    }
                    scrollspy.tickId = ScrollSpy._ticks;
                }
                for (var _i = 0; _i < ScrollSpy._elementsInView.length; _i++) {
                    var _scrollspy = ScrollSpy._elementsInView[_i];
                    var _lastTick = _scrollspy.tickId;
                    if (_lastTick >= 0 && _lastTick !== ScrollSpy._ticks) {
                        _scrollspy._exit();
                        _scrollspy.tickId = -1;
                    }
                }
                ScrollSpy._elementsInView = intersections;
            }
        }, {
            key: "_enter",
            value: function _enter() {
                ScrollSpy._visibleElements = ScrollSpy._visibleElements.filter(function(value) {
                    return value.height() != 0;
                });
                if (ScrollSpy._visibleElements[0]) {
                    $(this.options.getActiveElement(ScrollSpy._visibleElements[0].attr("id"))).removeClass(this.options.activeClass);
                    if (ScrollSpy._visibleElements[0][0].M_ScrollSpy && this.id < ScrollSpy._visibleElements[0][0].M_ScrollSpy.id) {
                        ScrollSpy._visibleElements.unshift(this.$el);
                    } else {
                        ScrollSpy._visibleElements.push(this.$el);
                    }
                } else {
                    ScrollSpy._visibleElements.push(this.$el);
                }
                $(this.options.getActiveElement(ScrollSpy._visibleElements[0].attr("id"))).addClass(this.options.activeClass);
            }
        }, {
            key: "_exit",
            value: function _exit() {
                var _this36 = this;
                ScrollSpy._visibleElements = ScrollSpy._visibleElements.filter(function(value) {
                    return value.height() != 0;
                });
                if (ScrollSpy._visibleElements[0]) {
                    $(this.options.getActiveElement(ScrollSpy._visibleElements[0].attr("id"))).removeClass(this.options.activeClass);
                    ScrollSpy._visibleElements = ScrollSpy._visibleElements.filter(function(el) {
                        return el.attr("id") != _this36.$el.attr("id");
                    });
                    if (ScrollSpy._visibleElements[0]) {
                        $(this.options.getActiveElement(ScrollSpy._visibleElements[0].attr("id"))).addClass(this.options.activeClass);
                    }
                }
            }
        } ], [ {
            key: "init",
            value: function init(els, options) {
                return _get(_getPrototypeOf(ScrollSpy), "init", this).call(this, this, els, options);
            }
        }, {
            key: "getInstance",
            value: function getInstance(el) {
                var domElem = !!el.jquery ? el[0] : el;
                return domElem.M_ScrollSpy;
            }
        }, {
            key: "_findElements",
            value: function _findElements(top, right, bottom, left) {
                var hits = [];
                for (var i = 0; i < ScrollSpy._elements.length; i++) {
                    var scrollspy = ScrollSpy._elements[i];
                    var currTop = top + scrollspy.options.scrollOffset || 200;
                    if (scrollspy.$el.height() > 0) {
                        var elTop = scrollspy.$el.offset().top, elLeft = scrollspy.$el.offset().left, elRight = elLeft + scrollspy.$el.width(), elBottom = elTop + scrollspy.$el.height();
                        var isIntersect = !(elLeft > right || elRight < left || elTop > bottom || elBottom < currTop);
                        if (isIntersect) {
                            hits.push(scrollspy);
                        }
                    }
                }
                return hits;
            }
        }, {
            key: "defaults",
            get: function get() {
                return _defaults;
            }
        } ]);
        return ScrollSpy;
    }(Component);
    ScrollSpy._elements = [];
    ScrollSpy._elementsInView = [];
    ScrollSpy._visibleElements = [];
    ScrollSpy._count = 0;
    ScrollSpy._increment = 0;
    ScrollSpy._ticks = 0;
    M.ScrollSpy = ScrollSpy;
    if (M.jQueryLoaded) {
        M.initializeJqueryWrapper(ScrollSpy, "scrollSpy", "M_ScrollSpy");
    }
})(cash, M.anime);

(function($) {
    "use strict";
    var _defaults = {
        data: {},
        limit: Infinity,
        onAutocomplete: null,
        minLength: 1,
        sortFunction: function sortFunction(a, b, inputString) {
            return a.indexOf(inputString) - b.indexOf(inputString);
        }
    };
    var Autocomplete = function(_Component10) {
        _inherits(Autocomplete, _Component10);
        function Autocomplete(el, options) {
            var _this37;
            _classCallCheck(this, Autocomplete);
            _this37 = _possibleConstructorReturn(this, _getPrototypeOf(Autocomplete).call(this, Autocomplete, el, options));
            _this37.el.M_Autocomplete = _assertThisInitialized(_this37);
            _this37.options = $.extend({}, Autocomplete.defaults, options);
            _this37.isOpen = false;
            _this37.count = 0;
            _this37.activeIndex = -1;
            _this37.oldVal;
            _this37.$inputField = _this37.$el.closest(".input-field");
            _this37.$active = $();
            _this37._mousedown = false;
            _this37._setupDropdown();
            _this37._setupEventHandlers();
            return _this37;
        }
        _createClass(Autocomplete, [ {
            key: "destroy",
            value: function destroy() {
                this._removeEventHandlers();
                this._removeDropdown();
                this.el.M_Autocomplete = undefined;
            }
        }, {
            key: "_setupEventHandlers",
            value: function _setupEventHandlers() {
                this._handleInputBlurBound = this._handleInputBlur.bind(this);
                this._handleInputKeyupAndFocusBound = this._handleInputKeyupAndFocus.bind(this);
                this._handleInputKeydownBound = this._handleInputKeydown.bind(this);
                this._handleInputClickBound = this._handleInputClick.bind(this);
                this._handleContainerMousedownAndTouchstartBound = this._handleContainerMousedownAndTouchstart.bind(this);
                this._handleContainerMouseupAndTouchendBound = this._handleContainerMouseupAndTouchend.bind(this);
                this.el.addEventListener("blur", this._handleInputBlurBound);
                this.el.addEventListener("keyup", this._handleInputKeyupAndFocusBound);
                this.el.addEventListener("focus", this._handleInputKeyupAndFocusBound);
                this.el.addEventListener("keydown", this._handleInputKeydownBound);
                this.el.addEventListener("click", this._handleInputClickBound);
                this.container.addEventListener("mousedown", this._handleContainerMousedownAndTouchstartBound);
                this.container.addEventListener("mouseup", this._handleContainerMouseupAndTouchendBound);
                if (typeof window.ontouchstart !== "undefined") {
                    this.container.addEventListener("touchstart", this._handleContainerMousedownAndTouchstartBound);
                    this.container.addEventListener("touchend", this._handleContainerMouseupAndTouchendBound);
                }
            }
        }, {
            key: "_removeEventHandlers",
            value: function _removeEventHandlers() {
                this.el.removeEventListener("blur", this._handleInputBlurBound);
                this.el.removeEventListener("keyup", this._handleInputKeyupAndFocusBound);
                this.el.removeEventListener("focus", this._handleInputKeyupAndFocusBound);
                this.el.removeEventListener("keydown", this._handleInputKeydownBound);
                this.el.removeEventListener("click", this._handleInputClickBound);
                this.container.removeEventListener("mousedown", this._handleContainerMousedownAndTouchstartBound);
                this.container.removeEventListener("mouseup", this._handleContainerMouseupAndTouchendBound);
                if (typeof window.ontouchstart !== "undefined") {
                    this.container.removeEventListener("touchstart", this._handleContainerMousedownAndTouchstartBound);
                    this.container.removeEventListener("touchend", this._handleContainerMouseupAndTouchendBound);
                }
            }
        }, {
            key: "_setupDropdown",
            value: function _setupDropdown() {
                var _this38 = this;
                this.container = document.createElement("ul");
                this.container.id = "autocomplete-options-".concat(M.guid());
                $(this.container).addClass("autocomplete-content dropdown-content");
                this.$inputField.append(this.container);
                this.el.setAttribute("data-target", this.container.id);
                this.dropdown = M.Dropdown.init(this.el, {
                    autoFocus: false,
                    closeOnClick: false,
                    coverTrigger: false,
                    onItemClick: function onItemClick(itemEl) {
                        _this38.selectOption($(itemEl));
                    }
                });
                this.el.removeEventListener("click", this.dropdown._handleClickBound);
            }
        }, {
            key: "_removeDropdown",
            value: function _removeDropdown() {
                this.container.parentNode.removeChild(this.container);
            }
        }, {
            key: "_handleInputBlur",
            value: function _handleInputBlur() {
                if (!this._mousedown) {
                    this.close();
                    this._resetAutocomplete();
                }
            }
        }, {
            key: "_handleInputKeyupAndFocus",
            value: function _handleInputKeyupAndFocus(e) {
                if (e.type === "keyup") {
                    Autocomplete._keydown = false;
                }
                this.count = 0;
                var val = this.el.value.toLowerCase();
                if (e.keyCode === 13 || e.keyCode === 38 || e.keyCode === 40) {
                    return;
                }
                if (this.oldVal !== val && (M.tabPressed || e.type !== "focus")) {
                    this.open();
                }
                this.oldVal = val;
            }
        }, {
            key: "_handleInputKeydown",
            value: function _handleInputKeydown(e) {
                Autocomplete._keydown = true;
                var keyCode = e.keyCode, liElement, numItems = $(this.container).children("li").length;
                if (keyCode === M.keys.ENTER && this.activeIndex >= 0) {
                    liElement = $(this.container).children("li").eq(this.activeIndex);
                    if (liElement.length) {
                        this.selectOption(liElement);
                        e.preventDefault();
                    }
                    return;
                }
                if (keyCode === M.keys.ARROW_UP || keyCode === M.keys.ARROW_DOWN) {
                    e.preventDefault();
                    if (keyCode === M.keys.ARROW_UP && this.activeIndex > 0) {
                        this.activeIndex--;
                    }
                    if (keyCode === M.keys.ARROW_DOWN && this.activeIndex < numItems - 1) {
                        this.activeIndex++;
                    }
                    this.$active.removeClass("active");
                    if (this.activeIndex >= 0) {
                        this.$active = $(this.container).children("li").eq(this.activeIndex);
                        this.$active.addClass("active");
                    }
                }
            }
        }, {
            key: "_handleInputClick",
            value: function _handleInputClick(e) {
                this.open();
            }
        }, {
            key: "_handleContainerMousedownAndTouchstart",
            value: function _handleContainerMousedownAndTouchstart(e) {
                this._mousedown = true;
            }
        }, {
            key: "_handleContainerMouseupAndTouchend",
            value: function _handleContainerMouseupAndTouchend(e) {
                this._mousedown = false;
            }
        }, {
            key: "_highlight",
            value: function _highlight(string, $el) {
                var img = $el.find("img");
                var matchStart = $el.text().toLowerCase().indexOf("" + string.toLowerCase() + ""), matchEnd = matchStart + string.length - 1, beforeMatch = $el.text().slice(0, matchStart), matchText = $el.text().slice(matchStart, matchEnd + 1), afterMatch = $el.text().slice(matchEnd + 1);
                $el.html("<span>".concat(beforeMatch, "<span class='highlight'>").concat(matchText, "</span>").concat(afterMatch, "</span>"));
                if (img.length) {
                    $el.prepend(img);
                }
            }
        }, {
            key: "_resetCurrentElement",
            value: function _resetCurrentElement() {
                this.activeIndex = -1;
                this.$active.removeClass("active");
            }
        }, {
            key: "_resetAutocomplete",
            value: function _resetAutocomplete() {
                $(this.container).empty();
                this._resetCurrentElement();
                this.oldVal = null;
                this.isOpen = false;
                this._mousedown = false;
            }
        }, {
            key: "selectOption",
            value: function selectOption(el) {
                var text = el.text().trim();
                this.el.value = text;
                this.$el.trigger("change");
                this._resetAutocomplete();
                this.close();
                if (typeof this.options.onAutocomplete === "function") {
                    this.options.onAutocomplete.call(this, text);
                }
            }
        }, {
            key: "_renderDropdown",
            value: function _renderDropdown(data, val) {
                var _this39 = this;
                this._resetAutocomplete();
                var matchingData = [];
                for (var key in data) {
                    if (data.hasOwnProperty(key) && key.toLowerCase().indexOf(val) !== -1) {
                        if (this.count >= this.options.limit) {
                            break;
                        }
                        var entry = {
                            data: data[key],
                            key: key
                        };
                        matchingData.push(entry);
                        this.count++;
                    }
                }
                if (this.options.sortFunction) {
                    var sortFunctionBound = function sortFunctionBound(a, b) {
                        return _this39.options.sortFunction(a.key.toLowerCase(), b.key.toLowerCase(), val.toLowerCase());
                    };
                    matchingData.sort(sortFunctionBound);
                }
                for (var i = 0; i < matchingData.length; i++) {
                    var _entry = matchingData[i];
                    var $autocompleteOption = $("<li></li>");
                    if (!!_entry.data) {
                        $autocompleteOption.append('<img src="'.concat(_entry.data, '" class="right circle"><span>').concat(_entry.key, "</span>"));
                    } else {
                        $autocompleteOption.append("<span>" + _entry.key + "</span>");
                    }
                    $(this.container).append($autocompleteOption);
                    this._highlight(val, $autocompleteOption);
                }
            }
        }, {
            key: "open",
            value: function open() {
                var val = this.el.value.toLowerCase();
                this._resetAutocomplete();
                if (val.length >= this.options.minLength) {
                    this.isOpen = true;
                    this._renderDropdown(this.options.data, val);
                }
                if (!this.dropdown.isOpen) {
                    this.dropdown.open();
                } else {
                    this.dropdown.recalculateDimensions();
                }
            }
        }, {
            key: "close",
            value: function close() {
                this.dropdown.close();
            }
        }, {
            key: "updateData",
            value: function updateData(data) {
                var val = this.el.value.toLowerCase();
                this.options.data = data;
                if (this.isOpen) {
                    this._renderDropdown(data, val);
                }
            }
        } ], [ {
            key: "init",
            value: function init(els, options) {
                return _get(_getPrototypeOf(Autocomplete), "init", this).call(this, this, els, options);
            }
        }, {
            key: "getInstance",
            value: function getInstance(el) {
                var domElem = !!el.jquery ? el[0] : el;
                return domElem.M_Autocomplete;
            }
        }, {
            key: "defaults",
            get: function get() {
                return _defaults;
            }
        } ]);
        return Autocomplete;
    }(Component);
    Autocomplete._keydown = false;
    M.Autocomplete = Autocomplete;
    if (M.jQueryLoaded) {
        M.initializeJqueryWrapper(Autocomplete, "autocomplete", "M_Autocomplete");
    }
})(cash);

(function($) {
    M.updateTextFields = function() {
        var input_selector = "input[type=text], input[type=password], input[type=email], input[type=url], input[type=tel], input[type=number], input[type=search], input[type=date], input[type=time], textarea";
        $(input_selector).each(function(element, index) {
            var $this = $(this);
            if (element.value.length > 0 || $(element).is(":focus") || element.autofocus || $this.attr("placeholder") !== null) {
                $this.siblings("label").addClass("active");
            } else if (element.validity) {
                $this.siblings("label").toggleClass("active", element.validity.badInput === true);
            } else {
                $this.siblings("label").removeClass("active");
            }
        });
    };
    M.validate_field = function(object) {
        var hasLength = object.attr("data-length") !== null;
        var lenAttr = parseInt(object.attr("data-length"));
        var len = object[0].value.length;
        if (len === 0 && object[0].validity.badInput === false && !object.is(":required")) {
            if (object.hasClass("validate")) {
                object.removeClass("valid");
                object.removeClass("invalid");
            }
        } else {
            if (object.hasClass("validate")) {
                if (object.is(":valid") && hasLength && len <= lenAttr || object.is(":valid") && !hasLength) {
                    object.removeClass("invalid");
                    object.addClass("valid");
                } else {
                    object.removeClass("valid");
                    object.addClass("invalid");
                }
            }
        }
    };
    M.textareaAutoResize = function($textarea) {
        if ($textarea instanceof Element) {
            $textarea = $($textarea);
        }
        if (!$textarea.length) {
            console.error("No textarea element found");
            return;
        }
        var hiddenDiv = $(".hiddendiv").first();
        if (!hiddenDiv.length) {
            hiddenDiv = $('<div class="hiddendiv common"></div>');
            $("body").append(hiddenDiv);
        }
        var fontFamily = $textarea.css("font-family");
        var fontSize = $textarea.css("font-size");
        var lineHeight = $textarea.css("line-height");
        var paddingTop = $textarea.css("padding-top");
        var paddingRight = $textarea.css("padding-right");
        var paddingBottom = $textarea.css("padding-bottom");
        var paddingLeft = $textarea.css("padding-left");
        if (fontSize) {
            hiddenDiv.css("font-size", fontSize);
        }
        if (fontFamily) {
            hiddenDiv.css("font-family", fontFamily);
        }
        if (lineHeight) {
            hiddenDiv.css("line-height", lineHeight);
        }
        if (paddingTop) {
            hiddenDiv.css("padding-top", paddingTop);
        }
        if (paddingRight) {
            hiddenDiv.css("padding-right", paddingRight);
        }
        if (paddingBottom) {
            hiddenDiv.css("padding-bottom", paddingBottom);
        }
        if (paddingLeft) {
            hiddenDiv.css("padding-left", paddingLeft);
        }
        if (!$textarea.data("original-height")) {
            $textarea.data("original-height", $textarea.height());
        }
        if ($textarea.attr("wrap") === "off") {
            hiddenDiv.css("overflow-wrap", "normal").css("white-space", "pre");
        }
        hiddenDiv.text($textarea[0].value + "\n");
        var content = hiddenDiv.html().replace(/\n/g, "<br>");
        hiddenDiv.html(content);
        if ($textarea[0].offsetWidth > 0 && $textarea[0].offsetHeight > 0) {
            hiddenDiv.css("width", $textarea.width() + "px");
        } else {
            hiddenDiv.css("width", window.innerWidth / 2 + "px");
        }
        if ($textarea.data("original-height") <= hiddenDiv.innerHeight()) {
            $textarea.css("height", hiddenDiv.innerHeight() + "px");
        } else if ($textarea[0].value.length < $textarea.data("previous-length")) {
            $textarea.css("height", $textarea.data("original-height") + "px");
        }
        $textarea.data("previous-length", $textarea[0].value.length);
    };
    $(document).ready(function() {
        var input_selector = "input[type=text], input[type=password], input[type=email], input[type=url], input[type=tel], input[type=number], input[type=search], input[type=date], input[type=time], textarea";
        $(document).on("change", input_selector, function() {
            if (this.value.length !== 0 || $(this).attr("placeholder") !== null) {
                $(this).siblings("label").addClass("active");
            }
            M.validate_field($(this));
        });
        $(document).ready(function() {
            M.updateTextFields();
        });
        $(document).on("reset", function(e) {
            var formReset = $(e.target);
            if (formReset.is("form")) {
                formReset.find(input_selector).removeClass("valid").removeClass("invalid");
                formReset.find(input_selector).each(function(e) {
                    if (this.value.length) {
                        $(this).siblings("label").removeClass("active");
                    }
                });
                setTimeout(function() {
                    formReset.find("select").each(function() {
                        if (this.M_FormSelect) {
                            $(this).trigger("change");
                        }
                    });
                }, 0);
            }
        });
        document.addEventListener("focus", function(e) {
            if ($(e.target).is(input_selector)) {
                $(e.target).siblings("label, .prefix").addClass("active");
            }
        }, true);
        document.addEventListener("blur", function(e) {
            var $inputElement = $(e.target);
            if ($inputElement.is(input_selector)) {
                var selector = ".prefix";
                if ($inputElement[0].value.length === 0 && $inputElement[0].validity.badInput !== true && $inputElement.attr("placeholder") === null) {
                    selector += ", label";
                }
                $inputElement.siblings(selector).removeClass("active");
                M.validate_field($inputElement);
            }
        }, true);
        var radio_checkbox = "input[type=radio], input[type=checkbox]";
        $(document).on("keyup", radio_checkbox, function(e) {
            if (e.which === M.keys.TAB) {
                $(this).addClass("tabbed");
                var $this = $(this);
                $this.one("blur", function(e) {
                    $(this).removeClass("tabbed");
                });
                return;
            }
        });
        var text_area_selector = ".materialize-textarea";
        $(text_area_selector).each(function() {
            var $textarea = $(this);
            $textarea.data("original-height", $textarea.height());
            $textarea.data("previous-length", this.value.length);
            M.textareaAutoResize($textarea);
        });
        $(document).on("keyup", text_area_selector, function() {
            M.textareaAutoResize($(this));
        });
        $(document).on("keydown", text_area_selector, function() {
            M.textareaAutoResize($(this));
        });
        $(document).on("change", '.file-field input[type="file"]', function() {
            var file_field = $(this).closest(".file-field");
            var path_input = file_field.find("input.file-path");
            var files = $(this)[0].files;
            var file_names = [];
            for (var i = 0; i < files.length; i++) {
                file_names.push(files[i].name);
            }
            path_input[0].value = file_names.join(", ");
            path_input.trigger("change");
        });
    });
})(cash);

(function($, anim) {
    "use strict";
    var _defaults = {
        indicators: true,
        height: 400,
        duration: 500,
        interval: 6e3
    };
    var Slider = function(_Component11) {
        _inherits(Slider, _Component11);
        function Slider(el, options) {
            var _this40;
            _classCallCheck(this, Slider);
            _this40 = _possibleConstructorReturn(this, _getPrototypeOf(Slider).call(this, Slider, el, options));
            _this40.el.M_Slider = _assertThisInitialized(_this40);
            _this40.options = $.extend({}, Slider.defaults, options);
            _this40.$slider = _this40.$el.find(".slides");
            _this40.$slides = _this40.$slider.children("li");
            _this40.activeIndex = _this40.$slides.filter(function(item) {
                return $(item).hasClass("active");
            }).first().index();
            if (_this40.activeIndex != -1) {
                _this40.$active = _this40.$slides.eq(_this40.activeIndex);
            }
            _this40._setSliderHeight();
            _this40.$slides.find(".caption").each(function(el) {
                _this40._animateCaptionIn(el, 0);
            });
            _this40.$slides.find("img").each(function(el) {
                var placeholderBase64 = "data:image/gif;base64,R0lGODlhAQABAIABAP///wAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==";
                if ($(el).attr("src") !== placeholderBase64) {
                    $(el).css("background-image", 'url("' + $(el).attr("src") + '")');
                    $(el).attr("src", placeholderBase64);
                }
            });
            _this40._setupIndicators();
            if (_this40.$active) {
                _this40.$active.css("display", "block");
            } else {
                _this40.$slides.first().addClass("active");
                anim({
                    targets: _this40.$slides.first()[0],
                    opacity: 1,
                    duration: _this40.options.duration,
                    easing: "easeOutQuad"
                });
                _this40.activeIndex = 0;
                _this40.$active = _this40.$slides.eq(_this40.activeIndex);
                if (_this40.options.indicators) {
                    _this40.$indicators.eq(_this40.activeIndex).addClass("active");
                }
            }
            _this40.$active.find("img").each(function(el) {
                anim({
                    targets: _this40.$active.find(".caption")[0],
                    opacity: 1,
                    translateX: 0,
                    translateY: 0,
                    duration: _this40.options.duration,
                    easing: "easeOutQuad"
                });
            });
            _this40._setupEventHandlers();
            _this40.start();
            return _this40;
        }
        _createClass(Slider, [ {
            key: "destroy",
            value: function destroy() {
                this.pause();
                this._removeIndicators();
                this._removeEventHandlers();
                this.el.M_Slider = undefined;
            }
        }, {
            key: "_setupEventHandlers",
            value: function _setupEventHandlers() {
                var _this41 = this;
                this._handleIntervalBound = this._handleInterval.bind(this);
                this._handleIndicatorClickBound = this._handleIndicatorClick.bind(this);
                if (this.options.indicators) {
                    this.$indicators.each(function(el) {
                        el.addEventListener("click", _this41._handleIndicatorClickBound);
                    });
                }
            }
        }, {
            key: "_removeEventHandlers",
            value: function _removeEventHandlers() {
                var _this42 = this;
                if (this.options.indicators) {
                    this.$indicators.each(function(el) {
                        el.removeEventListener("click", _this42._handleIndicatorClickBound);
                    });
                }
            }
        }, {
            key: "_handleIndicatorClick",
            value: function _handleIndicatorClick(e) {
                var currIndex = $(e.target).index();
                this.set(currIndex);
            }
        }, {
            key: "_handleInterval",
            value: function _handleInterval() {
                var newActiveIndex = this.$slider.find(".active").index();
                if (this.$slides.length === newActiveIndex + 1) newActiveIndex = 0; else newActiveIndex += 1;
                this.set(newActiveIndex);
            }
        }, {
            key: "_animateCaptionIn",
            value: function _animateCaptionIn(caption, duration) {
                var animOptions = {
                    targets: caption,
                    opacity: 0,
                    duration: duration,
                    easing: "easeOutQuad"
                };
                if ($(caption).hasClass("center-align")) {
                    animOptions.translateY = -100;
                } else if ($(caption).hasClass("right-align")) {
                    animOptions.translateX = 100;
                } else if ($(caption).hasClass("left-align")) {
                    animOptions.translateX = -100;
                }
                anim(animOptions);
            }
        }, {
            key: "_setSliderHeight",
            value: function _setSliderHeight() {
                if (!this.$el.hasClass("fullscreen")) {
                    if (this.options.indicators) {
                        this.$el.css("height", this.options.height + 40 + "px");
                    } else {
                        this.$el.css("height", this.options.height + "px");
                    }
                    this.$slider.css("height", this.options.height + "px");
                }
            }
        }, {
            key: "_setupIndicators",
            value: function _setupIndicators() {
                var _this43 = this;
                if (this.options.indicators) {
                    this.$indicators = $('<ul class="indicators"></ul>');
                    this.$slides.each(function(el, index) {
                        var $indicator = $('<li class="indicator-item"></li>');
                        _this43.$indicators.append($indicator[0]);
                    });
                    this.$el.append(this.$indicators[0]);
                    this.$indicators = this.$indicators.children("li.indicator-item");
                }
            }
        }, {
            key: "_removeIndicators",
            value: function _removeIndicators() {
                this.$el.find("ul.indicators").remove();
            }
        }, {
            key: "set",
            value: function set(index) {
                var _this44 = this;
                if (index >= this.$slides.length) index = 0; else if (index < 0) index = this.$slides.length - 1;
                if (this.activeIndex != index) {
                    this.$active = this.$slides.eq(this.activeIndex);
                    var $caption = this.$active.find(".caption");
                    this.$active.removeClass("active");
                    anim({
                        targets: this.$active[0],
                        opacity: 0,
                        duration: this.options.duration,
                        easing: "easeOutQuad",
                        complete: function complete() {
                            _this44.$slides.not(".active").each(function(el) {
                                anim({
                                    targets: el,
                                    opacity: 0,
                                    translateX: 0,
                                    translateY: 0,
                                    duration: 0,
                                    easing: "easeOutQuad"
                                });
                            });
                        }
                    });
                    this._animateCaptionIn($caption[0], this.options.duration);
                    if (this.options.indicators) {
                        this.$indicators.eq(this.activeIndex).removeClass("active");
                        this.$indicators.eq(index).addClass("active");
                    }
                    anim({
                        targets: this.$slides.eq(index)[0],
                        opacity: 1,
                        duration: this.options.duration,
                        easing: "easeOutQuad"
                    });
                    anim({
                        targets: this.$slides.eq(index).find(".caption")[0],
                        opacity: 1,
                        translateX: 0,
                        translateY: 0,
                        duration: this.options.duration,
                        delay: this.options.duration,
                        easing: "easeOutQuad"
                    });
                    this.$slides.eq(index).addClass("active");
                    this.activeIndex = index;
                    this.start();
                }
            }
        }, {
            key: "pause",
            value: function pause() {
                clearInterval(this.interval);
            }
        }, {
            key: "start",
            value: function start() {
                clearInterval(this.interval);
                this.interval = setInterval(this._handleIntervalBound, this.options.duration + this.options.interval);
            }
        }, {
            key: "next",
            value: function next() {
                var newIndex = this.activeIndex + 1;
                if (newIndex >= this.$slides.length) newIndex = 0; else if (newIndex < 0) newIndex = this.$slides.length - 1;
                this.set(newIndex);
            }
        }, {
            key: "prev",
            value: function prev() {
                var newIndex = this.activeIndex - 1;
                if (newIndex >= this.$slides.length) newIndex = 0; else if (newIndex < 0) newIndex = this.$slides.length - 1;
                this.set(newIndex);
            }
        } ], [ {
            key: "init",
            value: function init(els, options) {
                return _get(_getPrototypeOf(Slider), "init", this).call(this, this, els, options);
            }
        }, {
            key: "getInstance",
            value: function getInstance(el) {
                var domElem = !!el.jquery ? el[0] : el;
                return domElem.M_Slider;
            }
        }, {
            key: "defaults",
            get: function get() {
                return _defaults;
            }
        } ]);
        return Slider;
    }(Component);
    M.Slider = Slider;
    if (M.jQueryLoaded) {
        M.initializeJqueryWrapper(Slider, "slider", "M_Slider");
    }
})(cash, M.anime);

(function($, anim) {
    $(document).on("click", ".card", function(e) {
        if ($(this).children(".card-reveal").length) {
            var $card = $(e.target).closest(".card");
            if ($card.data("initialOverflow") === undefined) {
                $card.data("initialOverflow", $card.css("overflow") === undefined ? "" : $card.css("overflow"));
            }
            var $cardReveal = $(this).find(".card-reveal");
            if ($(e.target).is($(".card-reveal .card-title")) || $(e.target).is($(".card-reveal .card-title i"))) {
                anim({
                    targets: $cardReveal[0],
                    translateY: 0,
                    duration: 225,
                    easing: "easeInOutQuad",
                    complete: function complete(anim) {
                        var el = anim.animatables[0].target;
                        $(el).css({
                            display: "none"
                        });
                        $card.css("overflow", $card.data("initialOverflow"));
                    }
                });
            } else if ($(e.target).is($(".card .activator")) || $(e.target).is($(".card .activator i"))) {
                $card.css("overflow", "hidden");
                $cardReveal.css({
                    display: "block"
                });
                anim({
                    targets: $cardReveal[0],
                    translateY: "-100%",
                    duration: 300,
                    easing: "easeInOutQuad"
                });
            }
        }
    });
})(cash, M.anime);

(function($) {
    "use strict";
    var _defaults = {
        data: [],
        placeholder: "",
        secondaryPlaceholder: "",
        autocompleteOptions: {},
        limit: Infinity,
        onChipAdd: null,
        onChipSelect: null,
        onChipDelete: null
    };
    var Chips = function(_Component12) {
        _inherits(Chips, _Component12);
        function Chips(el, options) {
            var _this45;
            _classCallCheck(this, Chips);
            _this45 = _possibleConstructorReturn(this, _getPrototypeOf(Chips).call(this, Chips, el, options));
            _this45.el.M_Chips = _assertThisInitialized(_this45);
            _this45.options = $.extend({}, Chips.defaults, options);
            _this45.$el.addClass("chips input-field");
            _this45.chipsData = [];
            _this45.$chips = $();
            _this45._setupInput();
            _this45.hasAutocomplete = Object.keys(_this45.options.autocompleteOptions).length > 0;
            if (!_this45.$input.attr("id")) {
                _this45.$input.attr("id", M.guid());
            }
            if (_this45.options.data.length) {
                _this45.chipsData = _this45.options.data;
                _this45._renderChips(_this45.chipsData);
            }
            if (_this45.hasAutocomplete) {
                _this45._setupAutocomplete();
            }
            _this45._setPlaceholder();
            _this45._setupLabel();
            _this45._setupEventHandlers();
            return _this45;
        }
        _createClass(Chips, [ {
            key: "getData",
            value: function getData() {
                return this.chipsData;
            }
        }, {
            key: "destroy",
            value: function destroy() {
                this._removeEventHandlers();
                this.$chips.remove();
                this.el.M_Chips = undefined;
            }
        }, {
            key: "_setupEventHandlers",
            value: function _setupEventHandlers() {
                this._handleChipClickBound = this._handleChipClick.bind(this);
                this._handleInputKeydownBound = this._handleInputKeydown.bind(this);
                this._handleInputFocusBound = this._handleInputFocus.bind(this);
                this._handleInputBlurBound = this._handleInputBlur.bind(this);
                this.el.addEventListener("click", this._handleChipClickBound);
                document.addEventListener("keydown", Chips._handleChipsKeydown);
                document.addEventListener("keyup", Chips._handleChipsKeyup);
                this.el.addEventListener("blur", Chips._handleChipsBlur, true);
                this.$input[0].addEventListener("focus", this._handleInputFocusBound);
                this.$input[0].addEventListener("blur", this._handleInputBlurBound);
                this.$input[0].addEventListener("keydown", this._handleInputKeydownBound);
            }
        }, {
            key: "_removeEventHandlers",
            value: function _removeEventHandlers() {
                this.el.removeEventListener("click", this._handleChipClickBound);
                document.removeEventListener("keydown", Chips._handleChipsKeydown);
                document.removeEventListener("keyup", Chips._handleChipsKeyup);
                this.el.removeEventListener("blur", Chips._handleChipsBlur, true);
                this.$input[0].removeEventListener("focus", this._handleInputFocusBound);
                this.$input[0].removeEventListener("blur", this._handleInputBlurBound);
                this.$input[0].removeEventListener("keydown", this._handleInputKeydownBound);
            }
        }, {
            key: "_handleChipClick",
            value: function _handleChipClick(e) {
                var $chip = $(e.target).closest(".chip");
                var clickedClose = $(e.target).is(".close");
                if ($chip.length) {
                    var index = $chip.index();
                    if (clickedClose) {
                        this.deleteChip(index);
                        this.$input[0].focus();
                    } else {
                        this.selectChip(index);
                    }
                } else {
                    this.$input[0].focus();
                }
            }
        }, {
            key: "_handleInputFocus",
            value: function _handleInputFocus() {
                this.$el.addClass("focus");
            }
        }, {
            key: "_handleInputBlur",
            value: function _handleInputBlur() {
                this.$el.removeClass("focus");
            }
        }, {
            key: "_handleInputKeydown",
            value: function _handleInputKeydown(e) {
                Chips._keydown = true;
                if (e.keyCode === 13) {
                    if (this.hasAutocomplete && this.autocomplete && this.autocomplete.isOpen) {
                        return;
                    }
                    e.preventDefault();
                    this.addChip({
                        tag: this.$input[0].value
                    });
                    this.$input[0].value = "";
                } else if ((e.keyCode === 8 || e.keyCode === 37) && this.$input[0].value === "" && this.chipsData.length) {
                    e.preventDefault();
                    this.selectChip(this.chipsData.length - 1);
                }
            }
        }, {
            key: "_renderChip",
            value: function _renderChip(chip) {
                if (!chip.tag) {
                    return;
                }
                var renderedChip = document.createElement("div");
                var closeIcon = document.createElement("i");
                renderedChip.classList.add("chip");
                renderedChip.textContent = chip.tag;
                renderedChip.setAttribute("tabindex", 0);
                $(closeIcon).addClass("material-icons close");
                closeIcon.textContent = "close";
                if (chip.image) {
                    var img = document.createElement("img");
                    img.setAttribute("src", chip.image);
                    renderedChip.insertBefore(img, renderedChip.firstChild);
                }
                renderedChip.appendChild(closeIcon);
                return renderedChip;
            }
        }, {
            key: "_renderChips",
            value: function _renderChips() {
                this.$chips.remove();
                for (var i = 0; i < this.chipsData.length; i++) {
                    var chipEl = this._renderChip(this.chipsData[i]);
                    this.$el.append(chipEl);
                    this.$chips.add(chipEl);
                }
                this.$el.append(this.$input[0]);
            }
        }, {
            key: "_setupAutocomplete",
            value: function _setupAutocomplete() {
                var _this46 = this;
                this.options.autocompleteOptions.onAutocomplete = function(val) {
                    _this46.addChip({
                        tag: val
                    });
                    _this46.$input[0].value = "";
                    _this46.$input[0].focus();
                };
                this.autocomplete = M.Autocomplete.init(this.$input[0], this.options.autocompleteOptions);
            }
        }, {
            key: "_setupInput",
            value: function _setupInput() {
                this.$input = this.$el.find("input");
                if (!this.$input.length) {
                    this.$input = $("<input></input>");
                    this.$el.append(this.$input);
                }
                this.$input.addClass("input");
            }
        }, {
            key: "_setupLabel",
            value: function _setupLabel() {
                this.$label = this.$el.find("label");
                if (this.$label.length) {
                    this.$label.setAttribute("for", this.$input.attr("id"));
                }
            }
        }, {
            key: "_setPlaceholder",
            value: function _setPlaceholder() {
                if (this.chipsData !== undefined && !this.chipsData.length && this.options.placeholder) {
                    $(this.$input).prop("placeholder", this.options.placeholder);
                } else if ((this.chipsData === undefined || !!this.chipsData.length) && this.options.secondaryPlaceholder) {
                    $(this.$input).prop("placeholder", this.options.secondaryPlaceholder);
                }
            }
        }, {
            key: "_isValid",
            value: function _isValid(chip) {
                if (chip.hasOwnProperty("tag") && chip.tag !== "") {
                    var exists = false;
                    for (var i = 0; i < this.chipsData.length; i++) {
                        if (this.chipsData[i].tag === chip.tag) {
                            exists = true;
                            break;
                        }
                    }
                    return !exists;
                }
                return false;
            }
        }, {
            key: "addChip",
            value: function addChip(chip) {
                if (!this._isValid(chip) || this.chipsData.length >= this.options.limit) {
                    return;
                }
                var renderedChip = this._renderChip(chip);
                this.$chips.add(renderedChip);
                this.chipsData.push(chip);
                $(this.$input).before(renderedChip);
                this._setPlaceholder();
                if (typeof this.options.onChipAdd === "function") {
                    this.options.onChipAdd.call(this, this.$el, renderedChip);
                }
            }
        }, {
            key: "deleteChip",
            value: function deleteChip(chipIndex) {
                var $chip = this.$chips.eq(chipIndex);
                this.$chips.eq(chipIndex).remove();
                this.$chips = this.$chips.filter(function(el) {
                    return $(el).index() >= 0;
                });
                this.chipsData.splice(chipIndex, 1);
                this._setPlaceholder();
                if (typeof this.options.onChipDelete === "function") {
                    this.options.onChipDelete.call(this, this.$el, $chip[0]);
                }
            }
        }, {
            key: "selectChip",
            value: function selectChip(chipIndex) {
                var $chip = this.$chips.eq(chipIndex);
                this._selectedChip = $chip;
                $chip[0].focus();
                if (typeof this.options.onChipSelect === "function") {
                    this.options.onChipSelect.call(this, this.$el, $chip[0]);
                }
            }
        } ], [ {
            key: "init",
            value: function init(els, options) {
                return _get(_getPrototypeOf(Chips), "init", this).call(this, this, els, options);
            }
        }, {
            key: "getInstance",
            value: function getInstance(el) {
                var domElem = !!el.jquery ? el[0] : el;
                return domElem.M_Chips;
            }
        }, {
            key: "_handleChipsKeydown",
            value: function _handleChipsKeydown(e) {
                Chips._keydown = true;
                var $chips = $(e.target).closest(".chips");
                var chipsKeydown = e.target && $chips.length;
                if ($(e.target).is("input, textarea") || !chipsKeydown) {
                    return;
                }
                var currChips = $chips[0].M_Chips;
                if (e.keyCode === 8 || e.keyCode === 46) {
                    e.preventDefault();
                    var selectIndex = currChips.chipsData.length;
                    if (currChips._selectedChip) {
                        var index = currChips._selectedChip.index();
                        currChips.deleteChip(index);
                        currChips._selectedChip = null;
                        selectIndex = Math.max(index - 1, 0);
                    }
                    if (currChips.chipsData.length) {
                        currChips.selectChip(selectIndex);
                    }
                } else if (e.keyCode === 37) {
                    if (currChips._selectedChip) {
                        var _selectIndex = currChips._selectedChip.index() - 1;
                        if (_selectIndex < 0) {
                            return;
                        }
                        currChips.selectChip(_selectIndex);
                    }
                } else if (e.keyCode === 39) {
                    if (currChips._selectedChip) {
                        var _selectIndex2 = currChips._selectedChip.index() + 1;
                        if (_selectIndex2 >= currChips.chipsData.length) {
                            currChips.$input[0].focus();
                        } else {
                            currChips.selectChip(_selectIndex2);
                        }
                    }
                }
            }
        }, {
            key: "_handleChipsKeyup",
            value: function _handleChipsKeyup(e) {
                Chips._keydown = false;
            }
        }, {
            key: "_handleChipsBlur",
            value: function _handleChipsBlur(e) {
                if (!Chips._keydown) {
                    var $chips = $(e.target).closest(".chips");
                    var currChips = $chips[0].M_Chips;
                    currChips._selectedChip = null;
                }
            }
        }, {
            key: "defaults",
            get: function get() {
                return _defaults;
            }
        } ]);
        return Chips;
    }(Component);
    Chips._keydown = false;
    M.Chips = Chips;
    if (M.jQueryLoaded) {
        M.initializeJqueryWrapper(Chips, "chips", "M_Chips");
    }
    $(document).ready(function() {
        $(document.body).on("click", ".chip .close", function() {
            var $chips = $(this).closest(".chips");
            if ($chips.length && $chips[0].M_Chips) {
                return;
            }
            $(this).closest(".chip").remove();
        });
    });
})(cash);

(function($) {
    "use strict";
    var _defaults = {
        top: 0,
        bottom: Infinity,
        offset: 0,
        onPositionChange: null
    };
    var Pushpin = function(_Component13) {
        _inherits(Pushpin, _Component13);
        function Pushpin(el, options) {
            var _this47;
            _classCallCheck(this, Pushpin);
            _this47 = _possibleConstructorReturn(this, _getPrototypeOf(Pushpin).call(this, Pushpin, el, options));
            _this47.el.M_Pushpin = _assertThisInitialized(_this47);
            _this47.options = $.extend({}, Pushpin.defaults, options);
            _this47.originalOffset = _this47.el.offsetTop;
            Pushpin._pushpins.push(_assertThisInitialized(_this47));
            _this47._setupEventHandlers();
            _this47._updatePosition();
            return _this47;
        }
        _createClass(Pushpin, [ {
            key: "destroy",
            value: function destroy() {
                this.el.style.top = null;
                this._removePinClasses();
                this._removeEventHandlers();
                var index = Pushpin._pushpins.indexOf(this);
                Pushpin._pushpins.splice(index, 1);
            }
        }, {
            key: "_setupEventHandlers",
            value: function _setupEventHandlers() {
                document.addEventListener("scroll", Pushpin._updateElements);
            }
        }, {
            key: "_removeEventHandlers",
            value: function _removeEventHandlers() {
                document.removeEventListener("scroll", Pushpin._updateElements);
            }
        }, {
            key: "_updatePosition",
            value: function _updatePosition() {
                var scrolled = M.getDocumentScrollTop() + this.options.offset;
                if (this.options.top <= scrolled && this.options.bottom >= scrolled && !this.el.classList.contains("pinned")) {
                    this._removePinClasses();
                    this.el.style.top = "".concat(this.options.offset, "px");
                    this.el.classList.add("pinned");
                    if (typeof this.options.onPositionChange === "function") {
                        this.options.onPositionChange.call(this, "pinned");
                    }
                }
                if (scrolled < this.options.top && !this.el.classList.contains("pin-top")) {
                    this._removePinClasses();
                    this.el.style.top = 0;
                    this.el.classList.add("pin-top");
                    if (typeof this.options.onPositionChange === "function") {
                        this.options.onPositionChange.call(this, "pin-top");
                    }
                }
                if (scrolled > this.options.bottom && !this.el.classList.contains("pin-bottom")) {
                    this._removePinClasses();
                    this.el.classList.add("pin-bottom");
                    this.el.style.top = "".concat(this.options.bottom - this.originalOffset, "px");
                    if (typeof this.options.onPositionChange === "function") {
                        this.options.onPositionChange.call(this, "pin-bottom");
                    }
                }
            }
        }, {
            key: "_removePinClasses",
            value: function _removePinClasses() {
                this.el.classList.remove("pin-top");
                this.el.classList.remove("pinned");
                this.el.classList.remove("pin-bottom");
            }
        } ], [ {
            key: "init",
            value: function init(els, options) {
                return _get(_getPrototypeOf(Pushpin), "init", this).call(this, this, els, options);
            }
        }, {
            key: "getInstance",
            value: function getInstance(el) {
                var domElem = !!el.jquery ? el[0] : el;
                return domElem.M_Pushpin;
            }
        }, {
            key: "_updateElements",
            value: function _updateElements() {
                for (var elIndex in Pushpin._pushpins) {
                    var pInstance = Pushpin._pushpins[elIndex];
                    pInstance._updatePosition();
                }
            }
        }, {
            key: "defaults",
            get: function get() {
                return _defaults;
            }
        } ]);
        return Pushpin;
    }(Component);
    Pushpin._pushpins = [];
    M.Pushpin = Pushpin;
    if (M.jQueryLoaded) {
        M.initializeJqueryWrapper(Pushpin, "pushpin", "M_Pushpin");
    }
})(cash);

(function($, anim) {
    "use strict";
    var _defaults = {
        direction: "top",
        hoverEnabled: true,
        toolbarEnabled: false
    };
    $.fn.reverse = [].reverse;
    var FloatingActionButton = function(_Component14) {
        _inherits(FloatingActionButton, _Component14);
        function FloatingActionButton(el, options) {
            var _this48;
            _classCallCheck(this, FloatingActionButton);
            _this48 = _possibleConstructorReturn(this, _getPrototypeOf(FloatingActionButton).call(this, FloatingActionButton, el, options));
            _this48.el.M_FloatingActionButton = _assertThisInitialized(_this48);
            _this48.options = $.extend({}, FloatingActionButton.defaults, options);
            _this48.isOpen = false;
            _this48.$anchor = _this48.$el.children("a").first();
            _this48.$menu = _this48.$el.children("ul").first();
            _this48.$floatingBtns = _this48.$el.find("ul .btn-floating");
            _this48.$floatingBtnsReverse = _this48.$el.find("ul .btn-floating").reverse();
            _this48.offsetY = 0;
            _this48.offsetX = 0;
            _this48.$el.addClass("direction-".concat(_this48.options.direction));
            if (_this48.options.direction === "top") {
                _this48.offsetY = 40;
            } else if (_this48.options.direction === "right") {
                _this48.offsetX = -40;
            } else if (_this48.options.direction === "bottom") {
                _this48.offsetY = -40;
            } else {
                _this48.offsetX = 40;
            }
            _this48._setupEventHandlers();
            return _this48;
        }
        _createClass(FloatingActionButton, [ {
            key: "destroy",
            value: function destroy() {
                this._removeEventHandlers();
                this.el.M_FloatingActionButton = undefined;
            }
        }, {
            key: "_setupEventHandlers",
            value: function _setupEventHandlers() {
                this._handleFABClickBound = this._handleFABClick.bind(this);
                this._handleOpenBound = this.open.bind(this);
                this._handleCloseBound = this.close.bind(this);
                if (this.options.hoverEnabled && !this.options.toolbarEnabled) {
                    this.el.addEventListener("mouseenter", this._handleOpenBound);
                    this.el.addEventListener("mouseleave", this._handleCloseBound);
                } else {
                    this.el.addEventListener("click", this._handleFABClickBound);
                }
            }
        }, {
            key: "_removeEventHandlers",
            value: function _removeEventHandlers() {
                if (this.options.hoverEnabled && !this.options.toolbarEnabled) {
                    this.el.removeEventListener("mouseenter", this._handleOpenBound);
                    this.el.removeEventListener("mouseleave", this._handleCloseBound);
                } else {
                    this.el.removeEventListener("click", this._handleFABClickBound);
                }
            }
        }, {
            key: "_handleFABClick",
            value: function _handleFABClick() {
                if (this.isOpen) {
                    this.close();
                } else {
                    this.open();
                }
            }
        }, {
            key: "_handleDocumentClick",
            value: function _handleDocumentClick(e) {
                if (!$(e.target).closest(this.$menu).length) {
                    this.close();
                }
            }
        }, {
            key: "open",
            value: function open() {
                if (this.isOpen) {
                    return;
                }
                if (this.options.toolbarEnabled) {
                    this._animateInToolbar();
                } else {
                    this._animateInFAB();
                }
                this.isOpen = true;
            }
        }, {
            key: "close",
            value: function close() {
                if (!this.isOpen) {
                    return;
                }
                if (this.options.toolbarEnabled) {
                    window.removeEventListener("scroll", this._handleCloseBound, true);
                    document.body.removeEventListener("click", this._handleDocumentClickBound, true);
                    this._animateOutToolbar();
                } else {
                    this._animateOutFAB();
                }
                this.isOpen = false;
            }
        }, {
            key: "_animateInFAB",
            value: function _animateInFAB() {
                var _this49 = this;
                this.$el.addClass("active");
                var time = 0;
                this.$floatingBtnsReverse.each(function(el) {
                    anim({
                        targets: el,
                        opacity: 1,
                        scale: [ .4, 1 ],
                        translateY: [ _this49.offsetY, 0 ],
                        translateX: [ _this49.offsetX, 0 ],
                        duration: 275,
                        delay: time,
                        easing: "easeInOutQuad"
                    });
                    time += 40;
                });
            }
        }, {
            key: "_animateOutFAB",
            value: function _animateOutFAB() {
                var _this50 = this;
                this.$floatingBtnsReverse.each(function(el) {
                    anim.remove(el);
                    anim({
                        targets: el,
                        opacity: 0,
                        scale: .4,
                        translateY: _this50.offsetY,
                        translateX: _this50.offsetX,
                        duration: 175,
                        easing: "easeOutQuad",
                        complete: function complete() {
                            _this50.$el.removeClass("active");
                        }
                    });
                });
            }
        }, {
            key: "_animateInToolbar",
            value: function _animateInToolbar() {
                var _this51 = this;
                var scaleFactor;
                var windowWidth = window.innerWidth;
                var windowHeight = window.innerHeight;
                var btnRect = this.el.getBoundingClientRect();
                var backdrop = $('<div class="fab-backdrop"></div>');
                var fabColor = this.$anchor.css("background-color");
                this.$anchor.append(backdrop);
                this.offsetX = btnRect.left - windowWidth / 2 + btnRect.width / 2;
                this.offsetY = windowHeight - btnRect.bottom;
                scaleFactor = windowWidth / backdrop[0].clientWidth;
                this.btnBottom = btnRect.bottom;
                this.btnLeft = btnRect.left;
                this.btnWidth = btnRect.width;
                this.$el.addClass("active");
                this.$el.css({
                    "text-align": "center",
                    width: "100%",
                    bottom: 0,
                    left: 0,
                    transform: "translateX(" + this.offsetX + "px)",
                    transition: "none"
                });
                this.$anchor.css({
                    transform: "translateY(" + -this.offsetY + "px)",
                    transition: "none"
                });
                backdrop.css({
                    "background-color": fabColor
                });
                setTimeout(function() {
                    _this51.$el.css({
                        transform: "",
                        transition: "transform .2s cubic-bezier(0.550, 0.085, 0.680, 0.530), background-color 0s linear .2s"
                    });
                    _this51.$anchor.css({
                        overflow: "visible",
                        transform: "",
                        transition: "transform .2s"
                    });
                    setTimeout(function() {
                        _this51.$el.css({
                            overflow: "hidden",
                            "background-color": fabColor
                        });
                        backdrop.css({
                            transform: "scale(" + scaleFactor + ")",
                            transition: "transform .2s cubic-bezier(0.550, 0.055, 0.675, 0.190)"
                        });
                        _this51.$menu.children("li").children("a").css({
                            opacity: 1
                        });
                        _this51._handleDocumentClickBound = _this51._handleDocumentClick.bind(_this51);
                        window.addEventListener("scroll", _this51._handleCloseBound, true);
                        document.body.addEventListener("click", _this51._handleDocumentClickBound, true);
                    }, 100);
                }, 0);
            }
        }, {
            key: "_animateOutToolbar",
            value: function _animateOutToolbar() {
                var _this52 = this;
                var windowWidth = window.innerWidth;
                var windowHeight = window.innerHeight;
                var backdrop = this.$el.find(".fab-backdrop");
                var fabColor = this.$anchor.css("background-color");
                this.offsetX = this.btnLeft - windowWidth / 2 + this.btnWidth / 2;
                this.offsetY = windowHeight - this.btnBottom;
                this.$el.removeClass("active");
                this.$el.css({
                    "background-color": "transparent",
                    transition: "none"
                });
                this.$anchor.css({
                    transition: "none"
                });
                backdrop.css({
                    transform: "scale(0)",
                    "background-color": fabColor
                });
                this.$menu.children("li").children("a").css({
                    opacity: ""
                });
                setTimeout(function() {
                    backdrop.remove();
                    _this52.$el.css({
                        "text-align": "",
                        width: "",
                        bottom: "",
                        left: "",
                        overflow: "",
                        "background-color": "",
                        transform: "translate3d(" + -_this52.offsetX + "px,0,0)"
                    });
                    _this52.$anchor.css({
                        overflow: "",
                        transform: "translate3d(0," + _this52.offsetY + "px,0)"
                    });
                    setTimeout(function() {
                        _this52.$el.css({
                            transform: "translate3d(0,0,0)",
                            transition: "transform .2s"
                        });
                        _this52.$anchor.css({
                            transform: "translate3d(0,0,0)",
                            transition: "transform .2s cubic-bezier(0.550, 0.055, 0.675, 0.190)"
                        });
                    }, 20);
                }, 200);
            }
        } ], [ {
            key: "init",
            value: function init(els, options) {
                return _get(_getPrototypeOf(FloatingActionButton), "init", this).call(this, this, els, options);
            }
        }, {
            key: "getInstance",
            value: function getInstance(el) {
                var domElem = !!el.jquery ? el[0] : el;
                return domElem.M_FloatingActionButton;
            }
        }, {
            key: "defaults",
            get: function get() {
                return _defaults;
            }
        } ]);
        return FloatingActionButton;
    }(Component);
    M.FloatingActionButton = FloatingActionButton;
    if (M.jQueryLoaded) {
        M.initializeJqueryWrapper(FloatingActionButton, "floatingActionButton", "M_FloatingActionButton");
    }
})(cash, M.anime);

(function($) {
    "use strict";
    var _defaults = {
        autoClose: false,
        format: "mmm dd, yyyy",
        parse: null,
        defaultDate: null,
        setDefaultDate: false,
        disableWeekends: false,
        disableDayFn: null,
        firstDay: 0,
        minDate: null,
        maxDate: null,
        yearRange: 10,
        minYear: 0,
        maxYear: 9999,
        minMonth: undefined,
        maxMonth: undefined,
        startRange: null,
        endRange: null,
        isRTL: false,
        showMonthAfterYear: false,
        showDaysInNextAndPreviousMonths: false,
        container: null,
        showClearBtn: false,
        i18n: {
            cancel: "Cancel",
            clear: "Clear",
            done: "Ok",
            previousMonth: "‹",
            nextMonth: "›",
            months: [ "January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December" ],
            monthsShort: [ "Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec" ],
            weekdays: [ "Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday" ],
            weekdaysShort: [ "Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat" ],
            weekdaysAbbrev: [ "S", "M", "T", "W", "T", "F", "S" ]
        },
        events: [],
        onSelect: null,
        onOpen: null,
        onClose: null,
        onDraw: null
    };
    var Datepicker = function(_Component15) {
        _inherits(Datepicker, _Component15);
        function Datepicker(el, options) {
            var _this53;
            _classCallCheck(this, Datepicker);
            _this53 = _possibleConstructorReturn(this, _getPrototypeOf(Datepicker).call(this, Datepicker, el, options));
            _this53.el.M_Datepicker = _assertThisInitialized(_this53);
            _this53.options = $.extend({}, Datepicker.defaults, options);
            if (!!options && options.hasOwnProperty("i18n") && _typeof(options.i18n) === "object") {
                _this53.options.i18n = $.extend({}, Datepicker.defaults.i18n, options.i18n);
            }
            if (_this53.options.minDate) _this53.options.minDate.setHours(0, 0, 0, 0);
            if (_this53.options.maxDate) _this53.options.maxDate.setHours(0, 0, 0, 0);
            _this53.id = M.guid();
            _this53._setupVariables();
            _this53._insertHTMLIntoDOM();
            _this53._setupModal();
            _this53._setupEventHandlers();
            if (!_this53.options.defaultDate) {
                _this53.options.defaultDate = new Date(Date.parse(_this53.el.value));
            }
            var defDate = _this53.options.defaultDate;
            if (Datepicker._isDate(defDate)) {
                if (_this53.options.setDefaultDate) {
                    _this53.setDate(defDate, true);
                    _this53.setInputValue();
                } else {
                    _this53.gotoDate(defDate);
                }
            } else {
                _this53.gotoDate(new Date());
            }
            _this53.isOpen = false;
            return _this53;
        }
        _createClass(Datepicker, [ {
            key: "destroy",
            value: function destroy() {
                this._removeEventHandlers();
                this.modal.destroy();
                $(this.modalEl).remove();
                this.destroySelects();
                this.el.M_Datepicker = undefined;
            }
        }, {
            key: "destroySelects",
            value: function destroySelects() {
                var oldYearSelect = this.calendarEl.querySelector(".orig-select-year");
                if (oldYearSelect) {
                    M.FormSelect.getInstance(oldYearSelect).destroy();
                }
                var oldMonthSelect = this.calendarEl.querySelector(".orig-select-month");
                if (oldMonthSelect) {
                    M.FormSelect.getInstance(oldMonthSelect).destroy();
                }
            }
        }, {
            key: "_insertHTMLIntoDOM",
            value: function _insertHTMLIntoDOM() {
                if (this.options.showClearBtn) {
                    $(this.clearBtn).css({
                        visibility: ""
                    });
                    this.clearBtn.innerHTML = this.options.i18n.clear;
                }
                this.doneBtn.innerHTML = this.options.i18n.done;
                this.cancelBtn.innerHTML = this.options.i18n.cancel;
                if (this.options.container) {
                    this.$modalEl.appendTo(this.options.container);
                } else {
                    this.$modalEl.insertBefore(this.el);
                }
            }
        }, {
            key: "_setupModal",
            value: function _setupModal() {
                var _this54 = this;
                this.modalEl.id = "modal-" + this.id;
                this.modal = M.Modal.init(this.modalEl, {
                    onCloseEnd: function onCloseEnd() {
                        _this54.isOpen = false;
                    }
                });
            }
        }, {
            key: "toString",
            value: function toString(format) {
                var _this55 = this;
                format = format || this.options.format;
                if (!Datepicker._isDate(this.date)) {
                    return "";
                }
                var formatArray = format.split(/(d{1,4}|m{1,4}|y{4}|yy|!.)/g);
                var formattedDate = formatArray.map(function(label) {
                    if (_this55.formats[label]) {
                        return _this55.formats[label]();
                    }
                    return label;
                }).join("");
                return formattedDate;
            }
        }, {
            key: "setDate",
            value: function setDate(date, preventOnSelect) {
                if (!date) {
                    this.date = null;
                    this._renderDateDisplay();
                    return this.draw();
                }
                if (typeof date === "string") {
                    date = new Date(Date.parse(date));
                }
                if (!Datepicker._isDate(date)) {
                    return;
                }
                var min = this.options.minDate, max = this.options.maxDate;
                if (Datepicker._isDate(min) && date < min) {
                    date = min;
                } else if (Datepicker._isDate(max) && date > max) {
                    date = max;
                }
                this.date = new Date(date.getTime());
                this._renderDateDisplay();
                Datepicker._setToStartOfDay(this.date);
                this.gotoDate(this.date);
                if (!preventOnSelect && typeof this.options.onSelect === "function") {
                    this.options.onSelect.call(this, this.date);
                }
            }
        }, {
            key: "setInputValue",
            value: function setInputValue() {
                this.el.value = this.toString();
                this.$el.trigger("change", {
                    firedBy: this
                });
            }
        }, {
            key: "_renderDateDisplay",
            value: function _renderDateDisplay() {
                var displayDate = Datepicker._isDate(this.date) ? this.date : new Date();
                var i18n = this.options.i18n;
                var day = i18n.weekdaysShort[displayDate.getDay()];
                var month = i18n.monthsShort[displayDate.getMonth()];
                var date = displayDate.getDate();
                this.yearTextEl.innerHTML = displayDate.getFullYear();
                this.dateTextEl.innerHTML = "".concat(day, ", ").concat(month, " ").concat(date);
            }
        }, {
            key: "gotoDate",
            value: function gotoDate(date) {
                var newCalendar = true;
                if (!Datepicker._isDate(date)) {
                    return;
                }
                if (this.calendars) {
                    var firstVisibleDate = new Date(this.calendars[0].year, this.calendars[0].month, 1), lastVisibleDate = new Date(this.calendars[this.calendars.length - 1].year, this.calendars[this.calendars.length - 1].month, 1), visibleDate = date.getTime();
                    lastVisibleDate.setMonth(lastVisibleDate.getMonth() + 1);
                    lastVisibleDate.setDate(lastVisibleDate.getDate() - 1);
                    newCalendar = visibleDate < firstVisibleDate.getTime() || lastVisibleDate.getTime() < visibleDate;
                }
                if (newCalendar) {
                    this.calendars = [ {
                        month: date.getMonth(),
                        year: date.getFullYear()
                    } ];
                }
                this.adjustCalendars();
            }
        }, {
            key: "adjustCalendars",
            value: function adjustCalendars() {
                this.calendars[0] = this.adjustCalendar(this.calendars[0]);
                this.draw();
            }
        }, {
            key: "adjustCalendar",
            value: function adjustCalendar(calendar) {
                if (calendar.month < 0) {
                    calendar.year -= Math.ceil(Math.abs(calendar.month) / 12);
                    calendar.month += 12;
                }
                if (calendar.month > 11) {
                    calendar.year += Math.floor(Math.abs(calendar.month) / 12);
                    calendar.month -= 12;
                }
                return calendar;
            }
        }, {
            key: "nextMonth",
            value: function nextMonth() {
                this.calendars[0].month++;
                this.adjustCalendars();
            }
        }, {
            key: "prevMonth",
            value: function prevMonth() {
                this.calendars[0].month--;
                this.adjustCalendars();
            }
        }, {
            key: "render",
            value: function render(year, month, randId) {
                var opts = this.options, now = new Date(), days = Datepicker._getDaysInMonth(year, month), before = new Date(year, month, 1).getDay(), data = [], row = [];
                Datepicker._setToStartOfDay(now);
                if (opts.firstDay > 0) {
                    before -= opts.firstDay;
                    if (before < 0) {
                        before += 7;
                    }
                }
                var previousMonth = month === 0 ? 11 : month - 1, nextMonth = month === 11 ? 0 : month + 1, yearOfPreviousMonth = month === 0 ? year - 1 : year, yearOfNextMonth = month === 11 ? year + 1 : year, daysInPreviousMonth = Datepicker._getDaysInMonth(yearOfPreviousMonth, previousMonth);
                var cells = days + before, after = cells;
                while (after > 7) {
                    after -= 7;
                }
                cells += 7 - after;
                var isWeekSelected = false;
                for (var i = 0, r = 0; i < cells; i++) {
                    var day = new Date(year, month, 1 + (i - before)), isSelected = Datepicker._isDate(this.date) ? Datepicker._compareDates(day, this.date) : false, isToday = Datepicker._compareDates(day, now), hasEvent = opts.events.indexOf(day.toDateString()) !== -1 ? true : false, isEmpty = i < before || i >= days + before, dayNumber = 1 + (i - before), monthNumber = month, yearNumber = year, isStartRange = opts.startRange && Datepicker._compareDates(opts.startRange, day), isEndRange = opts.endRange && Datepicker._compareDates(opts.endRange, day), isInRange = opts.startRange && opts.endRange && opts.startRange < day && day < opts.endRange, isDisabled = opts.minDate && day < opts.minDate || opts.maxDate && day > opts.maxDate || opts.disableWeekends && Datepicker._isWeekend(day) || opts.disableDayFn && opts.disableDayFn(day);
                    if (isEmpty) {
                        if (i < before) {
                            dayNumber = daysInPreviousMonth + dayNumber;
                            monthNumber = previousMonth;
                            yearNumber = yearOfPreviousMonth;
                        } else {
                            dayNumber = dayNumber - days;
                            monthNumber = nextMonth;
                            yearNumber = yearOfNextMonth;
                        }
                    }
                    var dayConfig = {
                        day: dayNumber,
                        month: monthNumber,
                        year: yearNumber,
                        hasEvent: hasEvent,
                        isSelected: isSelected,
                        isToday: isToday,
                        isDisabled: isDisabled,
                        isEmpty: isEmpty,
                        isStartRange: isStartRange,
                        isEndRange: isEndRange,
                        isInRange: isInRange,
                        showDaysInNextAndPreviousMonths: opts.showDaysInNextAndPreviousMonths
                    };
                    row.push(this.renderDay(dayConfig));
                    if (++r === 7) {
                        data.push(this.renderRow(row, opts.isRTL, isWeekSelected));
                        row = [];
                        r = 0;
                        isWeekSelected = false;
                    }
                }
                return this.renderTable(opts, data, randId);
            }
        }, {
            key: "renderDay",
            value: function renderDay(opts) {
                var arr = [];
                var ariaSelected = "false";
                if (opts.isEmpty) {
                    if (opts.showDaysInNextAndPreviousMonths) {
                        arr.push("is-outside-current-month");
                        arr.push("is-selection-disabled");
                    } else {
                        return '<td class="is-empty"></td>';
                    }
                }
                if (opts.isDisabled) {
                    arr.push("is-disabled");
                }
                if (opts.isToday) {
                    arr.push("is-today");
                }
                if (opts.isSelected) {
                    arr.push("is-selected");
                    ariaSelected = "true";
                }
                if (opts.hasEvent) {
                    arr.push("has-event");
                }
                if (opts.isInRange) {
                    arr.push("is-inrange");
                }
                if (opts.isStartRange) {
                    arr.push("is-startrange");
                }
                if (opts.isEndRange) {
                    arr.push("is-endrange");
                }
                return '<td data-day="'.concat(opts.day, '" class="').concat(arr.join(" "), '" aria-selected="').concat(ariaSelected, '">') + '<button class="datepicker-day-button" type="button" data-year="'.concat(opts.year, '" data-month="').concat(opts.month, '" data-day="').concat(opts.day, '">').concat(opts.day, "</button>") + "</td>";
            }
        }, {
            key: "renderRow",
            value: function renderRow(days, isRTL, isRowSelected) {
                return '<tr class="datepicker-row' + (isRowSelected ? " is-selected" : "") + '">' + (isRTL ? days.reverse() : days).join("") + "</tr>";
            }
        }, {
            key: "renderTable",
            value: function renderTable(opts, data, randId) {
                return '<div class="datepicker-table-wrapper"><table cellpadding="0" cellspacing="0" class="datepicker-table" role="grid" aria-labelledby="' + randId + '">' + this.renderHead(opts) + this.renderBody(data) + "</table></div>";
            }
        }, {
            key: "renderHead",
            value: function renderHead(opts) {
                var i, arr = [];
                for (i = 0; i < 7; i++) {
                    arr.push('<th scope="col"><abbr title="'.concat(this.renderDayName(opts, i), '">').concat(this.renderDayName(opts, i, true), "</abbr></th>"));
                }
                return "<thead><tr>" + (opts.isRTL ? arr.reverse() : arr).join("") + "</tr></thead>";
            }
        }, {
            key: "renderBody",
            value: function renderBody(rows) {
                return "<tbody>" + rows.join("") + "</tbody>";
            }
        }, {
            key: "renderTitle",
            value: function renderTitle(instance, c, year, month, refYear, randId) {
                var i, j, arr, opts = this.options, isMinYear = year === opts.minYear, isMaxYear = year === opts.maxYear, html = '<div id="' + randId + '" class="datepicker-controls" role="heading" aria-live="assertive">', monthHtml, yearHtml, prev = true, next = true;
                for (arr = [], i = 0; i < 12; i++) {
                    arr.push('<option value="' + (year === refYear ? i - c : 12 + i - c) + '"' + (i === month ? ' selected="selected"' : "") + (isMinYear && i < opts.minMonth || isMaxYear && i > opts.maxMonth ? 'disabled="disabled"' : "") + ">" + opts.i18n.months[i] + "</option>");
                }
                monthHtml = '<select class="datepicker-select orig-select-month" tabindex="-1">' + arr.join("") + "</select>";
                if ($.isArray(opts.yearRange)) {
                    i = opts.yearRange[0];
                    j = opts.yearRange[1] + 1;
                } else {
                    i = year - opts.yearRange;
                    j = 1 + year + opts.yearRange;
                }
                for (arr = []; i < j && i <= opts.maxYear; i++) {
                    if (i >= opts.minYear) {
                        arr.push('<option value="'.concat(i, '" ').concat(i === year ? 'selected="selected"' : "", ">").concat(i, "</option>"));
                    }
                }
                yearHtml = '<select class="datepicker-select orig-select-year" tabindex="-1">'.concat(arr.join(""), "</select>");
                var leftArrow = '<svg fill="#000000" height="24" viewBox="0 0 24 24" width="24" xmlns="http://www.w3.org/2000/svg"><path d="M15.41 16.09l-4.58-4.59 4.58-4.59L14 5.5l-6 6 6 6z"/><path d="M0-.5h24v24H0z" fill="none"/></svg>';
                html += '<button class="month-prev'.concat(prev ? "" : " is-disabled", '" type="button">').concat(leftArrow, "</button>");
                html += '<div class="selects-container">';
                if (opts.showMonthAfterYear) {
                    html += yearHtml + monthHtml;
                } else {
                    html += monthHtml + yearHtml;
                }
                html += "</div>";
                if (isMinYear && (month === 0 || opts.minMonth >= month)) {
                    prev = false;
                }
                if (isMaxYear && (month === 11 || opts.maxMonth <= month)) {
                    next = false;
                }
                var rightArrow = '<svg fill="#000000" height="24" viewBox="0 0 24 24" width="24" xmlns="http://www.w3.org/2000/svg"><path d="M8.59 16.34l4.58-4.59-4.58-4.59L10 5.75l6 6-6 6z"/><path d="M0-.25h24v24H0z" fill="none"/></svg>';
                html += '<button class="month-next'.concat(next ? "" : " is-disabled", '" type="button">').concat(rightArrow, "</button>");
                return html += "</div>";
            }
        }, {
            key: "draw",
            value: function draw(force) {
                if (!this.isOpen && !force) {
                    return;
                }
                var opts = this.options, minYear = opts.minYear, maxYear = opts.maxYear, minMonth = opts.minMonth, maxMonth = opts.maxMonth, html = "", randId;
                if (this._y <= minYear) {
                    this._y = minYear;
                    if (!isNaN(minMonth) && this._m < minMonth) {
                        this._m = minMonth;
                    }
                }
                if (this._y >= maxYear) {
                    this._y = maxYear;
                    if (!isNaN(maxMonth) && this._m > maxMonth) {
                        this._m = maxMonth;
                    }
                }
                randId = "datepicker-title-" + Math.random().toString(36).replace(/[^a-z]+/g, "").substr(0, 2);
                for (var c = 0; c < 1; c++) {
                    this._renderDateDisplay();
                    html += this.renderTitle(this, c, this.calendars[c].year, this.calendars[c].month, this.calendars[0].year, randId) + this.render(this.calendars[c].year, this.calendars[c].month, randId);
                }
                this.destroySelects();
                this.calendarEl.innerHTML = html;
                var yearSelect = this.calendarEl.querySelector(".orig-select-year");
                var monthSelect = this.calendarEl.querySelector(".orig-select-month");
                M.FormSelect.init(yearSelect, {
                    classes: "select-year",
                    dropdownOptions: {
                        container: document.body,
                        constrainWidth: false
                    }
                });
                M.FormSelect.init(monthSelect, {
                    classes: "select-month",
                    dropdownOptions: {
                        container: document.body,
                        constrainWidth: false
                    }
                });
                yearSelect.addEventListener("change", this._handleYearChange.bind(this));
                monthSelect.addEventListener("change", this._handleMonthChange.bind(this));
                if (typeof this.options.onDraw === "function") {
                    this.options.onDraw(this);
                }
            }
        }, {
            key: "_setupEventHandlers",
            value: function _setupEventHandlers() {
                this._handleInputKeydownBound = this._handleInputKeydown.bind(this);
                this._handleInputClickBound = this._handleInputClick.bind(this);
                this._handleInputChangeBound = this._handleInputChange.bind(this);
                this._handleCalendarClickBound = this._handleCalendarClick.bind(this);
                this._finishSelectionBound = this._finishSelection.bind(this);
                this._handleMonthChange = this._handleMonthChange.bind(this);
                this._closeBound = this.close.bind(this);
                this.el.addEventListener("click", this._handleInputClickBound);
                this.el.addEventListener("keydown", this._handleInputKeydownBound);
                this.el.addEventListener("change", this._handleInputChangeBound);
                this.calendarEl.addEventListener("click", this._handleCalendarClickBound);
                this.doneBtn.addEventListener("click", this._finishSelectionBound);
                this.cancelBtn.addEventListener("click", this._closeBound);
                if (this.options.showClearBtn) {
                    this._handleClearClickBound = this._handleClearClick.bind(this);
                    this.clearBtn.addEventListener("click", this._handleClearClickBound);
                }
            }
        }, {
            key: "_setupVariables",
            value: function _setupVariables() {
                var _this56 = this;
                this.$modalEl = $(Datepicker._template);
                this.modalEl = this.$modalEl[0];
                this.calendarEl = this.modalEl.querySelector(".datepicker-calendar");
                this.yearTextEl = this.modalEl.querySelector(".year-text");
                this.dateTextEl = this.modalEl.querySelector(".date-text");
                if (this.options.showClearBtn) {
                    this.clearBtn = this.modalEl.querySelector(".datepicker-clear");
                }
                this.doneBtn = this.modalEl.querySelector(".datepicker-done");
                this.cancelBtn = this.modalEl.querySelector(".datepicker-cancel");
                this.formats = {
                    d: function d() {
                        return _this56.date.getDate();
                    },
                    dd: function dd() {
                        var d = _this56.date.getDate();
                        return (d < 10 ? "0" : "") + d;
                    },
                    ddd: function ddd() {
                        return _this56.options.i18n.weekdaysShort[_this56.date.getDay()];
                    },
                    dddd: function dddd() {
                        return _this56.options.i18n.weekdays[_this56.date.getDay()];
                    },
                    m: function m() {
                        return _this56.date.getMonth() + 1;
                    },
                    mm: function mm() {
                        var m = _this56.date.getMonth() + 1;
                        return (m < 10 ? "0" : "") + m;
                    },
                    mmm: function mmm() {
                        return _this56.options.i18n.monthsShort[_this56.date.getMonth()];
                    },
                    mmmm: function mmmm() {
                        return _this56.options.i18n.months[_this56.date.getMonth()];
                    },
                    yy: function yy() {
                        return ("" + _this56.date.getFullYear()).slice(2);
                    },
                    yyyy: function yyyy() {
                        return _this56.date.getFullYear();
                    }
                };
            }
        }, {
            key: "_removeEventHandlers",
            value: function _removeEventHandlers() {
                this.el.removeEventListener("click", this._handleInputClickBound);
                this.el.removeEventListener("keydown", this._handleInputKeydownBound);
                this.el.removeEventListener("change", this._handleInputChangeBound);
                this.calendarEl.removeEventListener("click", this._handleCalendarClickBound);
            }
        }, {
            key: "_handleInputClick",
            value: function _handleInputClick() {
                this.open();
            }
        }, {
            key: "_handleInputKeydown",
            value: function _handleInputKeydown(e) {
                if (e.which === M.keys.ENTER) {
                    e.preventDefault();
                    this.open();
                }
            }
        }, {
            key: "_handleCalendarClick",
            value: function _handleCalendarClick(e) {
                if (!this.isOpen) {
                    return;
                }
                var $target = $(e.target);
                if (!$target.hasClass("is-disabled")) {
                    if ($target.hasClass("datepicker-day-button") && !$target.hasClass("is-empty") && !$target.parent().hasClass("is-disabled")) {
                        this.setDate(new Date(e.target.getAttribute("data-year"), e.target.getAttribute("data-month"), e.target.getAttribute("data-day")));
                        if (this.options.autoClose) {
                            this._finishSelection();
                        }
                    } else if ($target.closest(".month-prev").length) {
                        this.prevMonth();
                    } else if ($target.closest(".month-next").length) {
                        this.nextMonth();
                    }
                }
            }
        }, {
            key: "_handleClearClick",
            value: function _handleClearClick() {
                this.date = null;
                this.setInputValue();
                this.close();
            }
        }, {
            key: "_handleMonthChange",
            value: function _handleMonthChange(e) {
                this.gotoMonth(e.target.value);
            }
        }, {
            key: "_handleYearChange",
            value: function _handleYearChange(e) {
                this.gotoYear(e.target.value);
            }
        }, {
            key: "gotoMonth",
            value: function gotoMonth(month) {
                if (!isNaN(month)) {
                    this.calendars[0].month = parseInt(month, 10);
                    this.adjustCalendars();
                }
            }
        }, {
            key: "gotoYear",
            value: function gotoYear(year) {
                if (!isNaN(year)) {
                    this.calendars[0].year = parseInt(year, 10);
                    this.adjustCalendars();
                }
            }
        }, {
            key: "_handleInputChange",
            value: function _handleInputChange(e) {
                var date;
                if (e.firedBy === this) {
                    return;
                }
                if (this.options.parse) {
                    date = this.options.parse(this.el.value, this.options.format);
                } else {
                    date = new Date(Date.parse(this.el.value));
                }
                if (Datepicker._isDate(date)) {
                    this.setDate(date);
                }
            }
        }, {
            key: "renderDayName",
            value: function renderDayName(opts, day, abbr) {
                day += opts.firstDay;
                while (day >= 7) {
                    day -= 7;
                }
                return abbr ? opts.i18n.weekdaysAbbrev[day] : opts.i18n.weekdays[day];
            }
        }, {
            key: "_finishSelection",
            value: function _finishSelection() {
                this.setInputValue();
                this.close();
            }
        }, {
            key: "open",
            value: function open() {
                if (this.isOpen) {
                    return;
                }
                this.isOpen = true;
                if (typeof this.options.onOpen === "function") {
                    this.options.onOpen.call(this);
                }
                this.draw();
                this.modal.open();
                return this;
            }
        }, {
            key: "close",
            value: function close() {
                if (!this.isOpen) {
                    return;
                }
                this.isOpen = false;
                if (typeof this.options.onClose === "function") {
                    this.options.onClose.call(this);
                }
                this.modal.close();
                return this;
            }
        } ], [ {
            key: "init",
            value: function init(els, options) {
                return _get(_getPrototypeOf(Datepicker), "init", this).call(this, this, els, options);
            }
        }, {
            key: "_isDate",
            value: function _isDate(obj) {
                return /Date/.test(Object.prototype.toString.call(obj)) && !isNaN(obj.getTime());
            }
        }, {
            key: "_isWeekend",
            value: function _isWeekend(date) {
                var day = date.getDay();
                return day === 0 || day === 6;
            }
        }, {
            key: "_setToStartOfDay",
            value: function _setToStartOfDay(date) {
                if (Datepicker._isDate(date)) date.setHours(0, 0, 0, 0);
            }
        }, {
            key: "_getDaysInMonth",
            value: function _getDaysInMonth(year, month) {
                return [ 31, Datepicker._isLeapYear(year) ? 29 : 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31 ][month];
            }
        }, {
            key: "_isLeapYear",
            value: function _isLeapYear(year) {
                return year % 4 === 0 && year % 100 !== 0 || year % 400 === 0;
            }
        }, {
            key: "_compareDates",
            value: function _compareDates(a, b) {
                return a.getTime() === b.getTime();
            }
        }, {
            key: "_setToStartOfDay",
            value: function _setToStartOfDay(date) {
                if (Datepicker._isDate(date)) date.setHours(0, 0, 0, 0);
            }
        }, {
            key: "getInstance",
            value: function getInstance(el) {
                var domElem = !!el.jquery ? el[0] : el;
                return domElem.M_Datepicker;
            }
        }, {
            key: "defaults",
            get: function get() {
                return _defaults;
            }
        } ]);
        return Datepicker;
    }(Component);
    Datepicker._template = [ '<div class= "modal datepicker-modal">', '<div class="modal-content datepicker-container">', '<div class="datepicker-date-display">', '<span class="year-text"></span>', '<span class="date-text"></span>', "</div>", '<div class="datepicker-calendar-container">', '<div class="datepicker-calendar"></div>', '<div class="datepicker-footer">', '<button class="btn-flat datepicker-clear waves-effect" style="visibility: hidden;" type="button"></button>', '<div class="confirmation-btns">', '<button class="btn-flat datepicker-cancel waves-effect" type="button"></button>', '<button class="btn-flat datepicker-done waves-effect" type="button"></button>', "</div>", "</div>", "</div>", "</div>", "</div>" ].join("");
    M.Datepicker = Datepicker;
    if (M.jQueryLoaded) {
        M.initializeJqueryWrapper(Datepicker, "datepicker", "M_Datepicker");
    }
})(cash);

(function($) {
    "use strict";
    var _defaults = {
        dialRadius: 135,
        outerRadius: 105,
        innerRadius: 70,
        tickRadius: 20,
        duration: 350,
        container: null,
        defaultTime: "now",
        fromNow: 0,
        showClearBtn: false,
        i18n: {
            cancel: "Cancel",
            clear: "Clear",
            done: "Ok"
        },
        autoClose: false,
        twelveHour: true,
        vibrate: true,
        onOpenStart: null,
        onOpenEnd: null,
        onCloseStart: null,
        onCloseEnd: null,
        onSelect: null
    };
    var Timepicker = function(_Component16) {
        _inherits(Timepicker, _Component16);
        function Timepicker(el, options) {
            var _this57;
            _classCallCheck(this, Timepicker);
            _this57 = _possibleConstructorReturn(this, _getPrototypeOf(Timepicker).call(this, Timepicker, el, options));
            _this57.el.M_Timepicker = _assertThisInitialized(_this57);
            _this57.options = $.extend({}, Timepicker.defaults, options);
            _this57.id = M.guid();
            _this57._insertHTMLIntoDOM();
            _this57._setupModal();
            _this57._setupVariables();
            _this57._setupEventHandlers();
            _this57._clockSetup();
            _this57._pickerSetup();
            return _this57;
        }
        _createClass(Timepicker, [ {
            key: "destroy",
            value: function destroy() {
                this._removeEventHandlers();
                this.modal.destroy();
                $(this.modalEl).remove();
                this.el.M_Timepicker = undefined;
            }
        }, {
            key: "_setupEventHandlers",
            value: function _setupEventHandlers() {
                this._handleInputKeydownBound = this._handleInputKeydown.bind(this);
                this._handleInputClickBound = this._handleInputClick.bind(this);
                this._handleClockClickStartBound = this._handleClockClickStart.bind(this);
                this._handleDocumentClickMoveBound = this._handleDocumentClickMove.bind(this);
                this._handleDocumentClickEndBound = this._handleDocumentClickEnd.bind(this);
                this.el.addEventListener("click", this._handleInputClickBound);
                this.el.addEventListener("keydown", this._handleInputKeydownBound);
                this.plate.addEventListener("mousedown", this._handleClockClickStartBound);
                this.plate.addEventListener("touchstart", this._handleClockClickStartBound);
                $(this.spanHours).on("click", this.showView.bind(this, "hours"));
                $(this.spanMinutes).on("click", this.showView.bind(this, "minutes"));
            }
        }, {
            key: "_removeEventHandlers",
            value: function _removeEventHandlers() {
                this.el.removeEventListener("click", this._handleInputClickBound);
                this.el.removeEventListener("keydown", this._handleInputKeydownBound);
            }
        }, {
            key: "_handleInputClick",
            value: function _handleInputClick() {
                this.open();
            }
        }, {
            key: "_handleInputKeydown",
            value: function _handleInputKeydown(e) {
                if (e.which === M.keys.ENTER) {
                    e.preventDefault();
                    this.open();
                }
            }
        }, {
            key: "_handleClockClickStart",
            value: function _handleClockClickStart(e) {
                e.preventDefault();
                var clockPlateBR = this.plate.getBoundingClientRect();
                var offset = {
                    x: clockPlateBR.left,
                    y: clockPlateBR.top
                };
                this.x0 = offset.x + this.options.dialRadius;
                this.y0 = offset.y + this.options.dialRadius;
                this.moved = false;
                var clickPos = Timepicker._Pos(e);
                this.dx = clickPos.x - this.x0;
                this.dy = clickPos.y - this.y0;
                this.setHand(this.dx, this.dy, false);
                document.addEventListener("mousemove", this._handleDocumentClickMoveBound);
                document.addEventListener("touchmove", this._handleDocumentClickMoveBound);
                document.addEventListener("mouseup", this._handleDocumentClickEndBound);
                document.addEventListener("touchend", this._handleDocumentClickEndBound);
            }
        }, {
            key: "_handleDocumentClickMove",
            value: function _handleDocumentClickMove(e) {
                e.preventDefault();
                var clickPos = Timepicker._Pos(e);
                var x = clickPos.x - this.x0;
                var y = clickPos.y - this.y0;
                this.moved = true;
                this.setHand(x, y, false, true);
            }
        }, {
            key: "_handleDocumentClickEnd",
            value: function _handleDocumentClickEnd(e) {
                var _this58 = this;
                e.preventDefault();
                document.removeEventListener("mouseup", this._handleDocumentClickEndBound);
                document.removeEventListener("touchend", this._handleDocumentClickEndBound);
                var clickPos = Timepicker._Pos(e);
                var x = clickPos.x - this.x0;
                var y = clickPos.y - this.y0;
                if (this.moved && x === this.dx && y === this.dy) {
                    this.setHand(x, y);
                }
                if (this.currentView === "hours") {
                    this.showView("minutes", this.options.duration / 2);
                } else if (this.options.autoClose) {
                    $(this.minutesView).addClass("timepicker-dial-out");
                    setTimeout(function() {
                        _this58.done();
                    }, this.options.duration / 2);
                }
                if (typeof this.options.onSelect === "function") {
                    this.options.onSelect.call(this, this.hours, this.minutes);
                }
                document.removeEventListener("mousemove", this._handleDocumentClickMoveBound);
                document.removeEventListener("touchmove", this._handleDocumentClickMoveBound);
            }
        }, {
            key: "_insertHTMLIntoDOM",
            value: function _insertHTMLIntoDOM() {
                this.$modalEl = $(Timepicker._template);
                this.modalEl = this.$modalEl[0];
                this.modalEl.id = "modal-" + this.id;
                var containerEl = document.querySelector(this.options.container);
                if (this.options.container && !!containerEl) {
                    this.$modalEl.appendTo(containerEl);
                } else {
                    this.$modalEl.insertBefore(this.el);
                }
            }
        }, {
            key: "_setupModal",
            value: function _setupModal() {
                var _this59 = this;
                this.modal = M.Modal.init(this.modalEl, {
                    onOpenStart: this.options.onOpenStart,
                    onOpenEnd: this.options.onOpenEnd,
                    onCloseStart: this.options.onCloseStart,
                    onCloseEnd: function onCloseEnd() {
                        if (typeof _this59.options.onCloseEnd === "function") {
                            _this59.options.onCloseEnd.call(_this59);
                        }
                        _this59.isOpen = false;
                    }
                });
            }
        }, {
            key: "_setupVariables",
            value: function _setupVariables() {
                this.currentView = "hours";
                this.vibrate = navigator.vibrate ? "vibrate" : navigator.webkitVibrate ? "webkitVibrate" : null;
                this._canvas = this.modalEl.querySelector(".timepicker-canvas");
                this.plate = this.modalEl.querySelector(".timepicker-plate");
                this.hoursView = this.modalEl.querySelector(".timepicker-hours");
                this.minutesView = this.modalEl.querySelector(".timepicker-minutes");
                this.spanHours = this.modalEl.querySelector(".timepicker-span-hours");
                this.spanMinutes = this.modalEl.querySelector(".timepicker-span-minutes");
                this.spanAmPm = this.modalEl.querySelector(".timepicker-span-am-pm");
                this.footer = this.modalEl.querySelector(".timepicker-footer");
                this.amOrPm = "PM";
            }
        }, {
            key: "_pickerSetup",
            value: function _pickerSetup() {
                var $clearBtn = $('<button class="btn-flat timepicker-clear waves-effect" style="visibility: hidden;" type="button" tabindex="'.concat(this.options.twelveHour ? "3" : "1", '">').concat(this.options.i18n.clear, "</button>")).appendTo(this.footer).on("click", this.clear.bind(this));
                if (this.options.showClearBtn) {
                    $clearBtn.css({
                        visibility: ""
                    });
                }
                var confirmationBtnsContainer = $('<div class="confirmation-btns"></div>');
                $('<button class="btn-flat timepicker-close waves-effect" type="button" tabindex="' + (this.options.twelveHour ? "3" : "1") + '">' + this.options.i18n.cancel + "</button>").appendTo(confirmationBtnsContainer).on("click", this.close.bind(this));
                $('<button class="btn-flat timepicker-close waves-effect" type="button" tabindex="' + (this.options.twelveHour ? "3" : "1") + '">' + this.options.i18n.done + "</button>").appendTo(confirmationBtnsContainer).on("click", this.done.bind(this));
                confirmationBtnsContainer.appendTo(this.footer);
            }
        }, {
            key: "_clockSetup",
            value: function _clockSetup() {
                if (this.options.twelveHour) {
                    this.$amBtn = $('<div class="am-btn">AM</div>');
                    this.$pmBtn = $('<div class="pm-btn">PM</div>');
                    this.$amBtn.on("click", this._handleAmPmClick.bind(this)).appendTo(this.spanAmPm);
                    this.$pmBtn.on("click", this._handleAmPmClick.bind(this)).appendTo(this.spanAmPm);
                }
                this._buildHoursView();
                this._buildMinutesView();
                this._buildSVGClock();
            }
        }, {
            key: "_buildSVGClock",
            value: function _buildSVGClock() {
                var dialRadius = this.options.dialRadius;
                var tickRadius = this.options.tickRadius;
                var diameter = dialRadius * 2;
                var svg = Timepicker._createSVGEl("svg");
                svg.setAttribute("class", "timepicker-svg");
                svg.setAttribute("width", diameter);
                svg.setAttribute("height", diameter);
                var g = Timepicker._createSVGEl("g");
                g.setAttribute("transform", "translate(" + dialRadius + "," + dialRadius + ")");
                var bearing = Timepicker._createSVGEl("circle");
                bearing.setAttribute("class", "timepicker-canvas-bearing");
                bearing.setAttribute("cx", 0);
                bearing.setAttribute("cy", 0);
                bearing.setAttribute("r", 4);
                var hand = Timepicker._createSVGEl("line");
                hand.setAttribute("x1", 0);
                hand.setAttribute("y1", 0);
                var bg = Timepicker._createSVGEl("circle");
                bg.setAttribute("class", "timepicker-canvas-bg");
                bg.setAttribute("r", tickRadius);
                g.appendChild(hand);
                g.appendChild(bg);
                g.appendChild(bearing);
                svg.appendChild(g);
                this._canvas.appendChild(svg);
                this.hand = hand;
                this.bg = bg;
                this.bearing = bearing;
                this.g = g;
            }
        }, {
            key: "_buildHoursView",
            value: function _buildHoursView() {
                var $tick = $('<div class="timepicker-tick"></div>');
                if (this.options.twelveHour) {
                    for (var i = 1; i < 13; i += 1) {
                        var tick = $tick.clone();
                        var radian = i / 6 * Math.PI;
                        var radius = this.options.outerRadius;
                        tick.css({
                            left: this.options.dialRadius + Math.sin(radian) * radius - this.options.tickRadius + "px",
                            top: this.options.dialRadius - Math.cos(radian) * radius - this.options.tickRadius + "px"
                        });
                        tick.html(i === 0 ? "00" : i);
                        this.hoursView.appendChild(tick[0]);
                    }
                } else {
                    for (var _i2 = 0; _i2 < 24; _i2 += 1) {
                        var _tick = $tick.clone();
                        var _radian = _i2 / 6 * Math.PI;
                        var inner = _i2 > 0 && _i2 < 13;
                        var _radius = inner ? this.options.innerRadius : this.options.outerRadius;
                        _tick.css({
                            left: this.options.dialRadius + Math.sin(_radian) * _radius - this.options.tickRadius + "px",
                            top: this.options.dialRadius - Math.cos(_radian) * _radius - this.options.tickRadius + "px"
                        });
                        _tick.html(_i2 === 0 ? "00" : _i2);
                        this.hoursView.appendChild(_tick[0]);
                    }
                }
            }
        }, {
            key: "_buildMinutesView",
            value: function _buildMinutesView() {
                var $tick = $('<div class="timepicker-tick"></div>');
                for (var i = 0; i < 60; i += 5) {
                    var tick = $tick.clone();
                    var radian = i / 30 * Math.PI;
                    tick.css({
                        left: this.options.dialRadius + Math.sin(radian) * this.options.outerRadius - this.options.tickRadius + "px",
                        top: this.options.dialRadius - Math.cos(radian) * this.options.outerRadius - this.options.tickRadius + "px"
                    });
                    tick.html(Timepicker._addLeadingZero(i));
                    this.minutesView.appendChild(tick[0]);
                }
            }
        }, {
            key: "_handleAmPmClick",
            value: function _handleAmPmClick(e) {
                var $btnClicked = $(e.target);
                this.amOrPm = $btnClicked.hasClass("am-btn") ? "AM" : "PM";
                this._updateAmPmView();
            }
        }, {
            key: "_updateAmPmView",
            value: function _updateAmPmView() {
                if (this.options.twelveHour) {
                    this.$amBtn.toggleClass("text-primary", this.amOrPm === "AM");
                    this.$pmBtn.toggleClass("text-primary", this.amOrPm === "PM");
                }
            }
        }, {
            key: "_updateTimeFromInput",
            value: function _updateTimeFromInput() {
                var value = ((this.el.value || this.options.defaultTime || "") + "").split(":");
                if (this.options.twelveHour && !(typeof value[1] === "undefined")) {
                    if (value[1].toUpperCase().indexOf("AM") > 0) {
                        this.amOrPm = "AM";
                    } else {
                        this.amOrPm = "PM";
                    }
                    value[1] = value[1].replace("AM", "").replace("PM", "");
                }
                if (value[0] === "now") {
                    var now = new Date(+new Date() + this.options.fromNow);
                    value = [ now.getHours(), now.getMinutes() ];
                    if (this.options.twelveHour) {
                        this.amOrPm = value[0] >= 12 && value[0] < 24 ? "PM" : "AM";
                    }
                }
                this.hours = +value[0] || 0;
                this.minutes = +value[1] || 0;
                this.spanHours.innerHTML = this.hours;
                this.spanMinutes.innerHTML = Timepicker._addLeadingZero(this.minutes);
                this._updateAmPmView();
            }
        }, {
            key: "showView",
            value: function showView(view, delay) {
                if (view === "minutes" && $(this.hoursView).css("visibility") === "visible") {}
                var isHours = view === "hours", nextView = isHours ? this.hoursView : this.minutesView, hideView = isHours ? this.minutesView : this.hoursView;
                this.currentView = view;
                $(this.spanHours).toggleClass("text-primary", isHours);
                $(this.spanMinutes).toggleClass("text-primary", !isHours);
                hideView.classList.add("timepicker-dial-out");
                $(nextView).css("visibility", "visible").removeClass("timepicker-dial-out");
                this.resetClock(delay);
                clearTimeout(this.toggleViewTimer);
                this.toggleViewTimer = setTimeout(function() {
                    $(hideView).css("visibility", "hidden");
                }, this.options.duration);
            }
        }, {
            key: "resetClock",
            value: function resetClock(delay) {
                var view = this.currentView, value = this[view], isHours = view === "hours", unit = Math.PI / (isHours ? 6 : 30), radian = value * unit, radius = isHours && value > 0 && value < 13 ? this.options.innerRadius : this.options.outerRadius, x = Math.sin(radian) * radius, y = -Math.cos(radian) * radius, self = this;
                if (delay) {
                    $(this.canvas).addClass("timepicker-canvas-out");
                    setTimeout(function() {
                        $(self.canvas).removeClass("timepicker-canvas-out");
                        self.setHand(x, y);
                    }, delay);
                } else {
                    this.setHand(x, y);
                }
            }
        }, {
            key: "setHand",
            value: function setHand(x, y, roundBy5) {
                var _this60 = this;
                var radian = Math.atan2(x, -y), isHours = this.currentView === "hours", unit = Math.PI / (isHours || roundBy5 ? 6 : 30), z = Math.sqrt(x * x + y * y), inner = isHours && z < (this.options.outerRadius + this.options.innerRadius) / 2, radius = inner ? this.options.innerRadius : this.options.outerRadius;
                if (this.options.twelveHour) {
                    radius = this.options.outerRadius;
                }
                if (radian < 0) {
                    radian = Math.PI * 2 + radian;
                }
                var value = Math.round(radian / unit);
                radian = value * unit;
                if (this.options.twelveHour) {
                    if (isHours) {
                        if (value === 0) value = 12;
                    } else {
                        if (roundBy5) value *= 5;
                        if (value === 60) value = 0;
                    }
                } else {
                    if (isHours) {
                        if (value === 12) {
                            value = 0;
                        }
                        value = inner ? value === 0 ? 12 : value : value === 0 ? 0 : value + 12;
                    } else {
                        if (roundBy5) {
                            value *= 5;
                        }
                        if (value === 60) {
                            value = 0;
                        }
                    }
                }
                if (this[this.currentView] !== value) {
                    if (this.vibrate && this.options.vibrate) {
                        if (!this.vibrateTimer) {
                            navigator[this.vibrate](10);
                            this.vibrateTimer = setTimeout(function() {
                                _this60.vibrateTimer = null;
                            }, 100);
                        }
                    }
                }
                this[this.currentView] = value;
                if (isHours) {
                    this["spanHours"].innerHTML = value;
                } else {
                    this["spanMinutes"].innerHTML = Timepicker._addLeadingZero(value);
                }
                var cx1 = Math.sin(radian) * (radius - this.options.tickRadius), cy1 = -Math.cos(radian) * (radius - this.options.tickRadius), cx2 = Math.sin(radian) * radius, cy2 = -Math.cos(radian) * radius;
                this.hand.setAttribute("x2", cx1);
                this.hand.setAttribute("y2", cy1);
                this.bg.setAttribute("cx", cx2);
                this.bg.setAttribute("cy", cy2);
            }
        }, {
            key: "open",
            value: function open() {
                if (this.isOpen) {
                    return;
                }
                this.isOpen = true;
                this._updateTimeFromInput();
                this.showView("hours");
                this.modal.open();
            }
        }, {
            key: "close",
            value: function close() {
                if (!this.isOpen) {
                    return;
                }
                this.isOpen = false;
                this.modal.close();
            }
        }, {
            key: "done",
            value: function done(e, clearValue) {
                var last = this.el.value;
                var value = clearValue ? "" : Timepicker._addLeadingZero(this.hours) + ":" + Timepicker._addLeadingZero(this.minutes);
                this.time = value;
                if (!clearValue && this.options.twelveHour) {
                    value = "".concat(value, " ").concat(this.amOrPm);
                }
                this.el.value = value;
                if (value !== last) {
                    this.$el.trigger("change");
                }
                this.close();
                this.el.focus();
            }
        }, {
            key: "clear",
            value: function clear() {
                this.done(null, true);
            }
        } ], [ {
            key: "init",
            value: function init(els, options) {
                return _get(_getPrototypeOf(Timepicker), "init", this).call(this, this, els, options);
            }
        }, {
            key: "_addLeadingZero",
            value: function _addLeadingZero(num) {
                return (num < 10 ? "0" : "") + num;
            }
        }, {
            key: "_createSVGEl",
            value: function _createSVGEl(name) {
                var svgNS = "http://www.w3.org/2000/svg";
                return document.createElementNS(svgNS, name);
            }
        }, {
            key: "_Pos",
            value: function _Pos(e) {
                if (e.targetTouches && e.targetTouches.length >= 1) {
                    return {
                        x: e.targetTouches[0].clientX,
                        y: e.targetTouches[0].clientY
                    };
                }
                return {
                    x: e.clientX,
                    y: e.clientY
                };
            }
        }, {
            key: "getInstance",
            value: function getInstance(el) {
                var domElem = !!el.jquery ? el[0] : el;
                return domElem.M_Timepicker;
            }
        }, {
            key: "defaults",
            get: function get() {
                return _defaults;
            }
        } ]);
        return Timepicker;
    }(Component);
    Timepicker._template = [ '<div class= "modal timepicker-modal">', '<div class="modal-content timepicker-container">', '<div class="timepicker-digital-display">', '<div class="timepicker-text-container">', '<div class="timepicker-display-column">', '<span class="timepicker-span-hours text-primary"></span>', ":", '<span class="timepicker-span-minutes"></span>', "</div>", '<div class="timepicker-display-column timepicker-display-am-pm">', '<div class="timepicker-span-am-pm"></div>', "</div>", "</div>", "</div>", '<div class="timepicker-analog-display">', '<div class="timepicker-plate">', '<div class="timepicker-canvas"></div>', '<div class="timepicker-dial timepicker-hours"></div>', '<div class="timepicker-dial timepicker-minutes timepicker-dial-out"></div>', "</div>", '<div class="timepicker-footer"></div>', "</div>", "</div>", "</div>" ].join("");
    M.Timepicker = Timepicker;
    if (M.jQueryLoaded) {
        M.initializeJqueryWrapper(Timepicker, "timepicker", "M_Timepicker");
    }
})(cash);

(function($) {
    "use strict";
    var _defaults = {};
    var CharacterCounter = function(_Component17) {
        _inherits(CharacterCounter, _Component17);
        function CharacterCounter(el, options) {
            var _this61;
            _classCallCheck(this, CharacterCounter);
            _this61 = _possibleConstructorReturn(this, _getPrototypeOf(CharacterCounter).call(this, CharacterCounter, el, options));
            _this61.el.M_CharacterCounter = _assertThisInitialized(_this61);
            _this61.options = $.extend({}, CharacterCounter.defaults, options);
            _this61.isInvalid = false;
            _this61.isValidLength = false;
            _this61._setupCounter();
            _this61._setupEventHandlers();
            return _this61;
        }
        _createClass(CharacterCounter, [ {
            key: "destroy",
            value: function destroy() {
                this._removeEventHandlers();
                this.el.CharacterCounter = undefined;
                this._removeCounter();
            }
        }, {
            key: "_setupEventHandlers",
            value: function _setupEventHandlers() {
                this._handleUpdateCounterBound = this.updateCounter.bind(this);
                this.el.addEventListener("focus", this._handleUpdateCounterBound, true);
                this.el.addEventListener("input", this._handleUpdateCounterBound, true);
            }
        }, {
            key: "_removeEventHandlers",
            value: function _removeEventHandlers() {
                this.el.removeEventListener("focus", this._handleUpdateCounterBound, true);
                this.el.removeEventListener("input", this._handleUpdateCounterBound, true);
            }
        }, {
            key: "_setupCounter",
            value: function _setupCounter() {
                this.counterEl = document.createElement("span");
                $(this.counterEl).addClass("character-counter").css({
                    float: "right",
                    "font-size": "12px",
                    height: 1
                });
                this.$el.parent().append(this.counterEl);
            }
        }, {
            key: "_removeCounter",
            value: function _removeCounter() {
                $(this.counterEl).remove();
            }
        }, {
            key: "updateCounter",
            value: function updateCounter() {
                var maxLength = +this.$el.attr("data-length"), actualLength = this.el.value.length;
                this.isValidLength = actualLength <= maxLength;
                var counterString = actualLength;
                if (maxLength) {
                    counterString += "/" + maxLength;
                    this._validateInput();
                }
                $(this.counterEl).html(counterString);
            }
        }, {
            key: "_validateInput",
            value: function _validateInput() {
                if (this.isValidLength && this.isInvalid) {
                    this.isInvalid = false;
                    this.$el.removeClass("invalid");
                } else if (!this.isValidLength && !this.isInvalid) {
                    this.isInvalid = true;
                    this.$el.removeClass("valid");
                    this.$el.addClass("invalid");
                }
            }
        } ], [ {
            key: "init",
            value: function init(els, options) {
                return _get(_getPrototypeOf(CharacterCounter), "init", this).call(this, this, els, options);
            }
        }, {
            key: "getInstance",
            value: function getInstance(el) {
                var domElem = !!el.jquery ? el[0] : el;
                return domElem.M_CharacterCounter;
            }
        }, {
            key: "defaults",
            get: function get() {
                return _defaults;
            }
        } ]);
        return CharacterCounter;
    }(Component);
    M.CharacterCounter = CharacterCounter;
    if (M.jQueryLoaded) {
        M.initializeJqueryWrapper(CharacterCounter, "characterCounter", "M_CharacterCounter");
    }
})(cash);

(function($) {
    "use strict";
    var _defaults = {
        duration: 200,
        dist: -100,
        shift: 0,
        padding: 0,
        numVisible: 5,
        fullWidth: false,
        indicators: false,
        noWrap: false,
        onCycleTo: null
    };
    var Carousel = function(_Component18) {
        _inherits(Carousel, _Component18);
        function Carousel(el, options) {
            var _this62;
            _classCallCheck(this, Carousel);
            _this62 = _possibleConstructorReturn(this, _getPrototypeOf(Carousel).call(this, Carousel, el, options));
            _this62.el.M_Carousel = _assertThisInitialized(_this62);
            _this62.options = $.extend({}, Carousel.defaults, options);
            _this62.hasMultipleSlides = _this62.$el.find(".carousel-item").length > 1;
            _this62.showIndicators = _this62.options.indicators && _this62.hasMultipleSlides;
            _this62.noWrap = _this62.options.noWrap || !_this62.hasMultipleSlides;
            _this62.pressed = false;
            _this62.dragged = false;
            _this62.offset = _this62.target = 0;
            _this62.images = [];
            _this62.itemWidth = _this62.$el.find(".carousel-item").first().innerWidth();
            _this62.itemHeight = _this62.$el.find(".carousel-item").first().innerHeight();
            _this62.dim = _this62.itemWidth * 2 + _this62.options.padding || 1;
            _this62._autoScrollBound = _this62._autoScroll.bind(_assertThisInitialized(_this62));
            _this62._trackBound = _this62._track.bind(_assertThisInitialized(_this62));
            if (_this62.options.fullWidth) {
                _this62.options.dist = 0;
                _this62._setCarouselHeight();
                if (_this62.showIndicators) {
                    _this62.$el.find(".carousel-fixed-item").addClass("with-indicators");
                }
            }
            _this62.$indicators = $('<ul class="indicators"></ul>');
            _this62.$el.find(".carousel-item").each(function(el, i) {
                _this62.images.push(el);
                if (_this62.showIndicators) {
                    var $indicator = $('<li class="indicator-item"></li>');
                    if (i === 0) {
                        $indicator[0].classList.add("active");
                    }
                    _this62.$indicators.append($indicator);
                }
            });
            if (_this62.showIndicators) {
                _this62.$el.append(_this62.$indicators);
            }
            _this62.count = _this62.images.length;
            _this62.options.numVisible = Math.min(_this62.count, _this62.options.numVisible);
            _this62.xform = "transform";
            [ "webkit", "Moz", "O", "ms" ].every(function(prefix) {
                var e = prefix + "Transform";
                if (typeof document.body.style[e] !== "undefined") {
                    _this62.xform = e;
                    return false;
                }
                return true;
            });
            _this62._setupEventHandlers();
            _this62._scroll(_this62.offset);
            return _this62;
        }
        _createClass(Carousel, [ {
            key: "destroy",
            value: function destroy() {
                this._removeEventHandlers();
                this.el.M_Carousel = undefined;
            }
        }, {
            key: "_setupEventHandlers",
            value: function _setupEventHandlers() {
                var _this63 = this;
                this._handleCarouselTapBound = this._handleCarouselTap.bind(this);
                this._handleCarouselDragBound = this._handleCarouselDrag.bind(this);
                this._handleCarouselReleaseBound = this._handleCarouselRelease.bind(this);
                this._handleCarouselClickBound = this._handleCarouselClick.bind(this);
                if (typeof window.ontouchstart !== "undefined") {
                    this.el.addEventListener("touchstart", this._handleCarouselTapBound);
                    this.el.addEventListener("touchmove", this._handleCarouselDragBound);
                    this.el.addEventListener("touchend", this._handleCarouselReleaseBound);
                }
                this.el.addEventListener("mousedown", this._handleCarouselTapBound);
                this.el.addEventListener("mousemove", this._handleCarouselDragBound);
                this.el.addEventListener("mouseup", this._handleCarouselReleaseBound);
                this.el.addEventListener("mouseleave", this._handleCarouselReleaseBound);
                this.el.addEventListener("click", this._handleCarouselClickBound);
                if (this.showIndicators && this.$indicators) {
                    this._handleIndicatorClickBound = this._handleIndicatorClick.bind(this);
                    this.$indicators.find(".indicator-item").each(function(el, i) {
                        el.addEventListener("click", _this63._handleIndicatorClickBound);
                    });
                }
                var throttledResize = M.throttle(this._handleResize, 200);
                this._handleThrottledResizeBound = throttledResize.bind(this);
                window.addEventListener("resize", this._handleThrottledResizeBound);
            }
        }, {
            key: "_removeEventHandlers",
            value: function _removeEventHandlers() {
                var _this64 = this;
                if (typeof window.ontouchstart !== "undefined") {
                    this.el.removeEventListener("touchstart", this._handleCarouselTapBound);
                    this.el.removeEventListener("touchmove", this._handleCarouselDragBound);
                    this.el.removeEventListener("touchend", this._handleCarouselReleaseBound);
                }
                this.el.removeEventListener("mousedown", this._handleCarouselTapBound);
                this.el.removeEventListener("mousemove", this._handleCarouselDragBound);
                this.el.removeEventListener("mouseup", this._handleCarouselReleaseBound);
                this.el.removeEventListener("mouseleave", this._handleCarouselReleaseBound);
                this.el.removeEventListener("click", this._handleCarouselClickBound);
                if (this.showIndicators && this.$indicators) {
                    this.$indicators.find(".indicator-item").each(function(el, i) {
                        el.removeEventListener("click", _this64._handleIndicatorClickBound);
                    });
                }
                window.removeEventListener("resize", this._handleThrottledResizeBound);
            }
        }, {
            key: "_handleCarouselTap",
            value: function _handleCarouselTap(e) {
                if (e.type === "mousedown" && $(e.target).is("img")) {
                    e.preventDefault();
                }
                this.pressed = true;
                this.dragged = false;
                this.verticalDragged = false;
                this.reference = this._xpos(e);
                this.referenceY = this._ypos(e);
                this.velocity = this.amplitude = 0;
                this.frame = this.offset;
                this.timestamp = Date.now();
                clearInterval(this.ticker);
                this.ticker = setInterval(this._trackBound, 100);
            }
        }, {
            key: "_handleCarouselDrag",
            value: function _handleCarouselDrag(e) {
                var x, y, delta, deltaY;
                if (this.pressed) {
                    x = this._xpos(e);
                    y = this._ypos(e);
                    delta = this.reference - x;
                    deltaY = Math.abs(this.referenceY - y);
                    if (deltaY < 30 && !this.verticalDragged) {
                        if (delta > 2 || delta < -2) {
                            this.dragged = true;
                            this.reference = x;
                            this._scroll(this.offset + delta);
                        }
                    } else if (this.dragged) {
                        e.preventDefault();
                        e.stopPropagation();
                        return false;
                    } else {
                        this.verticalDragged = true;
                    }
                }
                if (this.dragged) {
                    e.preventDefault();
                    e.stopPropagation();
                    return false;
                }
            }
        }, {
            key: "_handleCarouselRelease",
            value: function _handleCarouselRelease(e) {
                if (this.pressed) {
                    this.pressed = false;
                } else {
                    return;
                }
                clearInterval(this.ticker);
                this.target = this.offset;
                if (this.velocity > 10 || this.velocity < -10) {
                    this.amplitude = .9 * this.velocity;
                    this.target = this.offset + this.amplitude;
                }
                this.target = Math.round(this.target / this.dim) * this.dim;
                if (this.noWrap) {
                    if (this.target >= this.dim * (this.count - 1)) {
                        this.target = this.dim * (this.count - 1);
                    } else if (this.target < 0) {
                        this.target = 0;
                    }
                }
                this.amplitude = this.target - this.offset;
                this.timestamp = Date.now();
                requestAnimationFrame(this._autoScrollBound);
                if (this.dragged) {
                    e.preventDefault();
                    e.stopPropagation();
                }
                return false;
            }
        }, {
            key: "_handleCarouselClick",
            value: function _handleCarouselClick(e) {
                if (this.dragged) {
                    e.preventDefault();
                    e.stopPropagation();
                    return false;
                } else if (!this.options.fullWidth) {
                    var clickedIndex = $(e.target).closest(".carousel-item").index();
                    var diff = this._wrap(this.center) - clickedIndex;
                    if (diff !== 0) {
                        e.preventDefault();
                        e.stopPropagation();
                    }
                    this._cycleTo(clickedIndex);
                }
            }
        }, {
            key: "_handleIndicatorClick",
            value: function _handleIndicatorClick(e) {
                e.stopPropagation();
                var indicator = $(e.target).closest(".indicator-item");
                if (indicator.length) {
                    this._cycleTo(indicator.index());
                }
            }
        }, {
            key: "_handleResize",
            value: function _handleResize(e) {
                if (this.options.fullWidth) {
                    this.itemWidth = this.$el.find(".carousel-item").first().innerWidth();
                    this.imageHeight = this.$el.find(".carousel-item.active").height();
                    this.dim = this.itemWidth * 2 + this.options.padding;
                    this.offset = this.center * 2 * this.itemWidth;
                    this.target = this.offset;
                    this._setCarouselHeight(true);
                } else {
                    this._scroll();
                }
            }
        }, {
            key: "_setCarouselHeight",
            value: function _setCarouselHeight(imageOnly) {
                var _this65 = this;
                var firstSlide = this.$el.find(".carousel-item.active").length ? this.$el.find(".carousel-item.active").first() : this.$el.find(".carousel-item").first();
                var firstImage = firstSlide.find("img").first();
                if (firstImage.length) {
                    if (firstImage[0].complete) {
                        var imageHeight = firstImage.height();
                        if (imageHeight > 0) {
                            this.$el.css("height", imageHeight + "px");
                        } else {
                            var naturalWidth = firstImage[0].naturalWidth;
                            var naturalHeight = firstImage[0].naturalHeight;
                            var adjustedHeight = this.$el.width() / naturalWidth * naturalHeight;
                            this.$el.css("height", adjustedHeight + "px");
                        }
                    } else {
                        firstImage.one("load", function(el, i) {
                            _this65.$el.css("height", el.offsetHeight + "px");
                        });
                    }
                } else if (!imageOnly) {
                    var slideHeight = firstSlide.height();
                    this.$el.css("height", slideHeight + "px");
                }
            }
        }, {
            key: "_xpos",
            value: function _xpos(e) {
                if (e.targetTouches && e.targetTouches.length >= 1) {
                    return e.targetTouches[0].clientX;
                }
                return e.clientX;
            }
        }, {
            key: "_ypos",
            value: function _ypos(e) {
                if (e.targetTouches && e.targetTouches.length >= 1) {
                    return e.targetTouches[0].clientY;
                }
                return e.clientY;
            }
        }, {
            key: "_wrap",
            value: function _wrap(x) {
                return x >= this.count ? x % this.count : x < 0 ? this._wrap(this.count + x % this.count) : x;
            }
        }, {
            key: "_track",
            value: function _track() {
                var now, elapsed, delta, v;
                now = Date.now();
                elapsed = now - this.timestamp;
                this.timestamp = now;
                delta = this.offset - this.frame;
                this.frame = this.offset;
                v = 1e3 * delta / (1 + elapsed);
                this.velocity = .8 * v + .2 * this.velocity;
            }
        }, {
            key: "_autoScroll",
            value: function _autoScroll() {
                var elapsed, delta;
                if (this.amplitude) {
                    elapsed = Date.now() - this.timestamp;
                    delta = this.amplitude * Math.exp(-elapsed / this.options.duration);
                    if (delta > 2 || delta < -2) {
                        this._scroll(this.target - delta);
                        requestAnimationFrame(this._autoScrollBound);
                    } else {
                        this._scroll(this.target);
                    }
                }
            }
        }, {
            key: "_scroll",
            value: function _scroll(x) {
                var _this66 = this;
                if (!this.$el.hasClass("scrolling")) {
                    this.el.classList.add("scrolling");
                }
                if (this.scrollingTimeout != null) {
                    window.clearTimeout(this.scrollingTimeout);
                }
                this.scrollingTimeout = window.setTimeout(function() {
                    _this66.$el.removeClass("scrolling");
                }, this.options.duration);
                var i, half, delta, dir, tween, el, alignment, zTranslation, tweenedOpacity, centerTweenedOpacity;
                var lastCenter = this.center;
                var numVisibleOffset = 1 / this.options.numVisible;
                this.offset = typeof x === "number" ? x : this.offset;
                this.center = Math.floor((this.offset + this.dim / 2) / this.dim);
                delta = this.offset - this.center * this.dim;
                dir = delta < 0 ? 1 : -1;
                tween = -dir * delta * 2 / this.dim;
                half = this.count >> 1;
                if (this.options.fullWidth) {
                    alignment = "translateX(0)";
                    centerTweenedOpacity = 1;
                } else {
                    alignment = "translateX(" + (this.el.clientWidth - this.itemWidth) / 2 + "px) ";
                    alignment += "translateY(" + (this.el.clientHeight - this.itemHeight) / 2 + "px)";
                    centerTweenedOpacity = 1 - numVisibleOffset * tween;
                }
                if (this.showIndicators) {
                    var diff = this.center % this.count;
                    var activeIndicator = this.$indicators.find(".indicator-item.active");
                    if (activeIndicator.index() !== diff) {
                        activeIndicator.removeClass("active");
                        this.$indicators.find(".indicator-item").eq(diff)[0].classList.add("active");
                    }
                }
                if (!this.noWrap || this.center >= 0 && this.center < this.count) {
                    el = this.images[this._wrap(this.center)];
                    if (!$(el).hasClass("active")) {
                        this.$el.find(".carousel-item").removeClass("active");
                        el.classList.add("active");
                    }
                    var transformString = "".concat(alignment, " translateX(").concat(-delta / 2, "px) translateX(").concat(dir * this.options.shift * tween * i, "px) translateZ(").concat(this.options.dist * tween, "px)");
                    this._updateItemStyle(el, centerTweenedOpacity, 0, transformString);
                }
                for (i = 1; i <= half; ++i) {
                    if (this.options.fullWidth) {
                        zTranslation = this.options.dist;
                        tweenedOpacity = i === half && delta < 0 ? 1 - tween : 1;
                    } else {
                        zTranslation = this.options.dist * (i * 2 + tween * dir);
                        tweenedOpacity = 1 - numVisibleOffset * (i * 2 + tween * dir);
                    }
                    if (!this.noWrap || this.center + i < this.count) {
                        el = this.images[this._wrap(this.center + i)];
                        var _transformString = "".concat(alignment, " translateX(").concat(this.options.shift + (this.dim * i - delta) / 2, "px) translateZ(").concat(zTranslation, "px)");
                        this._updateItemStyle(el, tweenedOpacity, -i, _transformString);
                    }
                    if (this.options.fullWidth) {
                        zTranslation = this.options.dist;
                        tweenedOpacity = i === half && delta > 0 ? 1 - tween : 1;
                    } else {
                        zTranslation = this.options.dist * (i * 2 - tween * dir);
                        tweenedOpacity = 1 - numVisibleOffset * (i * 2 - tween * dir);
                    }
                    if (!this.noWrap || this.center - i >= 0) {
                        el = this.images[this._wrap(this.center - i)];
                        var _transformString2 = "".concat(alignment, " translateX(").concat(-this.options.shift + (-this.dim * i - delta) / 2, "px) translateZ(").concat(zTranslation, "px)");
                        this._updateItemStyle(el, tweenedOpacity, -i, _transformString2);
                    }
                }
                if (!this.noWrap || this.center >= 0 && this.center < this.count) {
                    el = this.images[this._wrap(this.center)];
                    var _transformString3 = "".concat(alignment, " translateX(").concat(-delta / 2, "px) translateX(").concat(dir * this.options.shift * tween, "px) translateZ(").concat(this.options.dist * tween, "px)");
                    this._updateItemStyle(el, centerTweenedOpacity, 0, _transformString3);
                }
                var $currItem = this.$el.find(".carousel-item").eq(this._wrap(this.center));
                if (lastCenter !== this.center && typeof this.options.onCycleTo === "function") {
                    this.options.onCycleTo.call(this, $currItem[0], this.dragged);
                }
                if (typeof this.oneTimeCallback === "function") {
                    this.oneTimeCallback.call(this, $currItem[0], this.dragged);
                    this.oneTimeCallback = null;
                }
            }
        }, {
            key: "_updateItemStyle",
            value: function _updateItemStyle(el, opacity, zIndex, transform) {
                el.style[this.xform] = transform;
                el.style.zIndex = zIndex;
                el.style.opacity = opacity;
                el.style.visibility = "visible";
            }
        }, {
            key: "_cycleTo",
            value: function _cycleTo(n, callback) {
                var diff = this.center % this.count - n;
                if (!this.noWrap) {
                    if (diff < 0) {
                        if (Math.abs(diff + this.count) < Math.abs(diff)) {
                            diff += this.count;
                        }
                    } else if (diff > 0) {
                        if (Math.abs(diff - this.count) < diff) {
                            diff -= this.count;
                        }
                    }
                }
                this.target = this.dim * Math.round(this.offset / this.dim);
                if (diff < 0) {
                    this.target += this.dim * Math.abs(diff);
                } else if (diff > 0) {
                    this.target -= this.dim * diff;
                }
                if (typeof callback === "function") {
                    this.oneTimeCallback = callback;
                }
                if (this.offset !== this.target) {
                    this.amplitude = this.target - this.offset;
                    this.timestamp = Date.now();
                    requestAnimationFrame(this._autoScrollBound);
                }
            }
        }, {
            key: "next",
            value: function next(n) {
                if (n === undefined || isNaN(n)) {
                    n = 1;
                }
                var index = this.center + n;
                if (index >= this.count || index < 0) {
                    if (this.noWrap) {
                        return;
                    }
                    index = this._wrap(index);
                }
                this._cycleTo(index);
            }
        }, {
            key: "prev",
            value: function prev(n) {
                if (n === undefined || isNaN(n)) {
                    n = 1;
                }
                var index = this.center - n;
                if (index >= this.count || index < 0) {
                    if (this.noWrap) {
                        return;
                    }
                    index = this._wrap(index);
                }
                this._cycleTo(index);
            }
        }, {
            key: "set",
            value: function set(n, callback) {
                if (n === undefined || isNaN(n)) {
                    n = 0;
                }
                if (n > this.count || n < 0) {
                    if (this.noWrap) {
                        return;
                    }
                    n = this._wrap(n);
                }
                this._cycleTo(n, callback);
            }
        } ], [ {
            key: "init",
            value: function init(els, options) {
                return _get(_getPrototypeOf(Carousel), "init", this).call(this, this, els, options);
            }
        }, {
            key: "getInstance",
            value: function getInstance(el) {
                var domElem = !!el.jquery ? el[0] : el;
                return domElem.M_Carousel;
            }
        }, {
            key: "defaults",
            get: function get() {
                return _defaults;
            }
        } ]);
        return Carousel;
    }(Component);
    M.Carousel = Carousel;
    if (M.jQueryLoaded) {
        M.initializeJqueryWrapper(Carousel, "carousel", "M_Carousel");
    }
})(cash);

(function($) {
    "use strict";
    var _defaults = {
        onOpen: undefined,
        onClose: undefined
    };
    var TapTarget = function(_Component19) {
        _inherits(TapTarget, _Component19);
        function TapTarget(el, options) {
            var _this67;
            _classCallCheck(this, TapTarget);
            _this67 = _possibleConstructorReturn(this, _getPrototypeOf(TapTarget).call(this, TapTarget, el, options));
            _this67.el.M_TapTarget = _assertThisInitialized(_this67);
            _this67.options = $.extend({}, TapTarget.defaults, options);
            _this67.isOpen = false;
            _this67.$origin = $("#" + _this67.$el.attr("data-target"));
            _this67._setup();
            _this67._calculatePositioning();
            _this67._setupEventHandlers();
            return _this67;
        }
        _createClass(TapTarget, [ {
            key: "destroy",
            value: function destroy() {
                this._removeEventHandlers();
                this.el.TapTarget = undefined;
            }
        }, {
            key: "_setupEventHandlers",
            value: function _setupEventHandlers() {
                this._handleDocumentClickBound = this._handleDocumentClick.bind(this);
                this._handleTargetClickBound = this._handleTargetClick.bind(this);
                this._handleOriginClickBound = this._handleOriginClick.bind(this);
                this.el.addEventListener("click", this._handleTargetClickBound);
                this.originEl.addEventListener("click", this._handleOriginClickBound);
                var throttledResize = M.throttle(this._handleResize, 200);
                this._handleThrottledResizeBound = throttledResize.bind(this);
                window.addEventListener("resize", this._handleThrottledResizeBound);
            }
        }, {
            key: "_removeEventHandlers",
            value: function _removeEventHandlers() {
                this.el.removeEventListener("click", this._handleTargetClickBound);
                this.originEl.removeEventListener("click", this._handleOriginClickBound);
                window.removeEventListener("resize", this._handleThrottledResizeBound);
            }
        }, {
            key: "_handleTargetClick",
            value: function _handleTargetClick(e) {
                this.open();
            }
        }, {
            key: "_handleOriginClick",
            value: function _handleOriginClick(e) {
                this.close();
            }
        }, {
            key: "_handleResize",
            value: function _handleResize(e) {
                this._calculatePositioning();
            }
        }, {
            key: "_handleDocumentClick",
            value: function _handleDocumentClick(e) {
                if (!$(e.target).closest(".tap-target-wrapper").length) {
                    this.close();
                    e.preventDefault();
                    e.stopPropagation();
                }
            }
        }, {
            key: "_setup",
            value: function _setup() {
                this.wrapper = this.$el.parent()[0];
                this.waveEl = $(this.wrapper).find(".tap-target-wave")[0];
                this.originEl = $(this.wrapper).find(".tap-target-origin")[0];
                this.contentEl = this.$el.find(".tap-target-content")[0];
                if (!$(this.wrapper).hasClass(".tap-target-wrapper")) {
                    this.wrapper = document.createElement("div");
                    this.wrapper.classList.add("tap-target-wrapper");
                    this.$el.before($(this.wrapper));
                    this.wrapper.append(this.el);
                }
                if (!this.contentEl) {
                    this.contentEl = document.createElement("div");
                    this.contentEl.classList.add("tap-target-content");
                    this.$el.append(this.contentEl);
                }
                if (!this.waveEl) {
                    this.waveEl = document.createElement("div");
                    this.waveEl.classList.add("tap-target-wave");
                    if (!this.originEl) {
                        this.originEl = this.$origin.clone(true, true);
                        this.originEl.addClass("tap-target-origin");
                        this.originEl.removeAttr("id");
                        this.originEl.removeAttr("style");
                        this.originEl = this.originEl[0];
                        this.waveEl.append(this.originEl);
                    }
                    this.wrapper.append(this.waveEl);
                }
            }
        }, {
            key: "_calculatePositioning",
            value: function _calculatePositioning() {
                var isFixed = this.$origin.css("position") === "fixed";
                if (!isFixed) {
                    var parents = this.$origin.parents();
                    for (var i = 0; i < parents.length; i++) {
                        isFixed = $(parents[i]).css("position") == "fixed";
                        if (isFixed) {
                            break;
                        }
                    }
                }
                var originWidth = this.$origin.outerWidth();
                var originHeight = this.$origin.outerHeight();
                var originTop = isFixed ? this.$origin.offset().top - M.getDocumentScrollTop() : this.$origin.offset().top;
                var originLeft = isFixed ? this.$origin.offset().left - M.getDocumentScrollLeft() : this.$origin.offset().left;
                var windowWidth = window.innerWidth;
                var windowHeight = window.innerHeight;
                var centerX = windowWidth / 2;
                var centerY = windowHeight / 2;
                var isLeft = originLeft <= centerX;
                var isRight = originLeft > centerX;
                var isTop = originTop <= centerY;
                var isBottom = originTop > centerY;
                var isCenterX = originLeft >= windowWidth * .25 && originLeft <= windowWidth * .75;
                var tapTargetWidth = this.$el.outerWidth();
                var tapTargetHeight = this.$el.outerHeight();
                var tapTargetTop = originTop + originHeight / 2 - tapTargetHeight / 2;
                var tapTargetLeft = originLeft + originWidth / 2 - tapTargetWidth / 2;
                var tapTargetPosition = isFixed ? "fixed" : "absolute";
                var tapTargetTextWidth = isCenterX ? tapTargetWidth : tapTargetWidth / 2 + originWidth;
                var tapTargetTextHeight = tapTargetHeight / 2;
                var tapTargetTextTop = isTop ? tapTargetHeight / 2 : 0;
                var tapTargetTextBottom = 0;
                var tapTargetTextLeft = isLeft && !isCenterX ? tapTargetWidth / 2 - originWidth : 0;
                var tapTargetTextRight = 0;
                var tapTargetTextPadding = originWidth;
                var tapTargetTextAlign = isBottom ? "bottom" : "top";
                var tapTargetWaveWidth = originWidth > originHeight ? originWidth * 2 : originWidth * 2;
                var tapTargetWaveHeight = tapTargetWaveWidth;
                var tapTargetWaveTop = tapTargetHeight / 2 - tapTargetWaveHeight / 2;
                var tapTargetWaveLeft = tapTargetWidth / 2 - tapTargetWaveWidth / 2;
                var tapTargetWrapperCssObj = {};
                tapTargetWrapperCssObj.top = isTop ? tapTargetTop + "px" : "";
                tapTargetWrapperCssObj.right = isRight ? windowWidth - tapTargetLeft - tapTargetWidth + "px" : "";
                tapTargetWrapperCssObj.bottom = isBottom ? windowHeight - tapTargetTop - tapTargetHeight + "px" : "";
                tapTargetWrapperCssObj.left = isLeft ? tapTargetLeft + "px" : "";
                tapTargetWrapperCssObj.position = tapTargetPosition;
                $(this.wrapper).css(tapTargetWrapperCssObj);
                $(this.contentEl).css({
                    width: tapTargetTextWidth + "px",
                    height: tapTargetTextHeight + "px",
                    top: tapTargetTextTop + "px",
                    right: tapTargetTextRight + "px",
                    bottom: tapTargetTextBottom + "px",
                    left: tapTargetTextLeft + "px",
                    padding: tapTargetTextPadding + "px",
                    verticalAlign: tapTargetTextAlign
                });
                $(this.waveEl).css({
                    top: tapTargetWaveTop + "px",
                    left: tapTargetWaveLeft + "px",
                    width: tapTargetWaveWidth + "px",
                    height: tapTargetWaveHeight + "px"
                });
            }
        }, {
            key: "open",
            value: function open() {
                if (this.isOpen) {
                    return;
                }
                if (typeof this.options.onOpen === "function") {
                    this.options.onOpen.call(this, this.$origin[0]);
                }
                this.isOpen = true;
                this.wrapper.classList.add("open");
                document.body.addEventListener("click", this._handleDocumentClickBound, true);
                document.body.addEventListener("touchend", this._handleDocumentClickBound);
            }
        }, {
            key: "close",
            value: function close() {
                if (!this.isOpen) {
                    return;
                }
                if (typeof this.options.onClose === "function") {
                    this.options.onClose.call(this, this.$origin[0]);
                }
                this.isOpen = false;
                this.wrapper.classList.remove("open");
                document.body.removeEventListener("click", this._handleDocumentClickBound, true);
                document.body.removeEventListener("touchend", this._handleDocumentClickBound);
            }
        } ], [ {
            key: "init",
            value: function init(els, options) {
                return _get(_getPrototypeOf(TapTarget), "init", this).call(this, this, els, options);
            }
        }, {
            key: "getInstance",
            value: function getInstance(el) {
                var domElem = !!el.jquery ? el[0] : el;
                return domElem.M_TapTarget;
            }
        }, {
            key: "defaults",
            get: function get() {
                return _defaults;
            }
        } ]);
        return TapTarget;
    }(Component);
    M.TapTarget = TapTarget;
    if (M.jQueryLoaded) {
        M.initializeJqueryWrapper(TapTarget, "tapTarget", "M_TapTarget");
    }
})(cash);

(function($) {
    "use strict";
    var _defaults = {
        classes: "",
        dropdownOptions: {}
    };
    var FormSelect = function(_Component20) {
        _inherits(FormSelect, _Component20);
        function FormSelect(el, options) {
            var _this68;
            _classCallCheck(this, FormSelect);
            _this68 = _possibleConstructorReturn(this, _getPrototypeOf(FormSelect).call(this, FormSelect, el, options));
            if (_this68.$el.hasClass("browser-default")) {
                return _possibleConstructorReturn(_this68);
            }
            _this68.el.M_FormSelect = _assertThisInitialized(_this68);
            _this68.options = $.extend({}, FormSelect.defaults, options);
            _this68.isMultiple = _this68.$el.prop("multiple");
            _this68.el.tabIndex = -1;
            _this68._keysSelected = {};
            _this68._valueDict = {};
            _this68._setupDropdown();
            _this68._setupEventHandlers();
            return _this68;
        }
        _createClass(FormSelect, [ {
            key: "destroy",
            value: function destroy() {
                this._removeEventHandlers();
                this._removeDropdown();
                this.el.M_FormSelect = undefined;
            }
        }, {
            key: "_setupEventHandlers",
            value: function _setupEventHandlers() {
                var _this69 = this;
                this._handleSelectChangeBound = this._handleSelectChange.bind(this);
                this._handleOptionClickBound = this._handleOptionClick.bind(this);
                this._handleInputClickBound = this._handleInputClick.bind(this);
                $(this.dropdownOptions).find("li:not(.optgroup)").each(function(el) {
                    el.addEventListener("click", _this69._handleOptionClickBound);
                });
                this.el.addEventListener("change", this._handleSelectChangeBound);
                this.input.addEventListener("click", this._handleInputClickBound);
            }
        }, {
            key: "_removeEventHandlers",
            value: function _removeEventHandlers() {
                var _this70 = this;
                $(this.dropdownOptions).find("li:not(.optgroup)").each(function(el) {
                    el.removeEventListener("click", _this70._handleOptionClickBound);
                });
                this.el.removeEventListener("change", this._handleSelectChangeBound);
                this.input.removeEventListener("click", this._handleInputClickBound);
            }
        }, {
            key: "_handleSelectChange",
            value: function _handleSelectChange(e) {
                this._setValueToInput();
            }
        }, {
            key: "_handleOptionClick",
            value: function _handleOptionClick(e) {
                e.preventDefault();
                var option = $(e.target).closest("li")[0];
                var key = option.id;
                if (!$(option).hasClass("disabled") && !$(option).hasClass("optgroup") && key.length) {
                    var selected = true;
                    if (this.isMultiple) {
                        var placeholderOption = $(this.dropdownOptions).find("li.disabled.selected");
                        if (placeholderOption.length) {
                            placeholderOption.removeClass("selected");
                            placeholderOption.find('input[type="checkbox"]').prop("checked", false);
                            this._toggleEntryFromArray(placeholderOption[0].id);
                        }
                        selected = this._toggleEntryFromArray(key);
                    } else {
                        $(this.dropdownOptions).find("li").removeClass("selected");
                        $(option).toggleClass("selected", selected);
                    }
                    var prevSelected = $(this._valueDict[key].el).prop("selected");
                    if (prevSelected !== selected) {
                        $(this._valueDict[key].el).prop("selected", selected);
                        this.$el.trigger("change");
                    }
                }
                e.stopPropagation();
            }
        }, {
            key: "_handleInputClick",
            value: function _handleInputClick() {
                if (this.dropdown && this.dropdown.isOpen) {
                    this._setValueToInput();
                    this._setSelectedStates();
                }
            }
        }, {
            key: "_setupDropdown",
            value: function _setupDropdown() {
                var _this71 = this;
                this.wrapper = document.createElement("div");
                $(this.wrapper).addClass("select-wrapper " + this.options.classes);
                this.$el.before($(this.wrapper));
                this.wrapper.appendChild(this.el);
                if (this.el.disabled) {
                    this.wrapper.classList.add("disabled");
                }
                this.$selectOptions = this.$el.children("option, optgroup");
                this.dropdownOptions = document.createElement("ul");
                this.dropdownOptions.id = "select-options-".concat(M.guid());
                $(this.dropdownOptions).addClass("dropdown-content select-dropdown " + (this.isMultiple ? "multiple-select-dropdown" : ""));
                if (this.$selectOptions.length) {
                    this.$selectOptions.each(function(el) {
                        if ($(el).is("option")) {
                            var optionEl;
                            if (_this71.isMultiple) {
                                optionEl = _this71._appendOptionWithIcon(_this71.$el, el, "multiple");
                            } else {
                                optionEl = _this71._appendOptionWithIcon(_this71.$el, el);
                            }
                            _this71._addOptionToValueDict(el, optionEl);
                        } else if ($(el).is("optgroup")) {
                            var selectOptions = $(el).children("option");
                            $(_this71.dropdownOptions).append($('<li class="optgroup"><span>' + el.getAttribute("label") + "</span></li>")[0]);
                            selectOptions.each(function(el) {
                                var optionEl = _this71._appendOptionWithIcon(_this71.$el, el, "optgroup-option");
                                _this71._addOptionToValueDict(el, optionEl);
                            });
                        }
                    });
                }
                this.$el.after(this.dropdownOptions);
                this.input = document.createElement("input");
                $(this.input).addClass("select-dropdown dropdown-trigger");
                this.input.setAttribute("type", "text");
                this.input.setAttribute("readonly", "true");
                this.input.setAttribute("data-target", this.dropdownOptions.id);
                if (this.el.disabled) {
                    $(this.input).prop("disabled", "true");
                }
                this.$el.before(this.input);
                this._setValueToInput();
                var dropdownIcon = $('<svg class="caret" height="24" viewBox="0 0 24 24" width="24" xmlns="http://www.w3.org/2000/svg"><path d="M7 10l5 5 5-5z"/><path d="M0 0h24v24H0z" fill="none"/></svg>');
                this.$el.before(dropdownIcon[0]);
                if (!this.el.disabled) {
                    var dropdownOptions = $.extend({}, this.options.dropdownOptions);
                    dropdownOptions.onOpenEnd = function(el) {
                        var selectedOption = $(_this71.dropdownOptions).find(".selected").first();
                        if (selectedOption.length) {
                            M.keyDown = true;
                            _this71.dropdown.focusedIndex = selectedOption.index();
                            _this71.dropdown._focusFocusedItem();
                            M.keyDown = false;
                            if (_this71.dropdown.isScrollable) {
                                var scrollOffset = selectedOption[0].getBoundingClientRect().top - _this71.dropdownOptions.getBoundingClientRect().top;
                                scrollOffset -= _this71.dropdownOptions.clientHeight / 2;
                                _this71.dropdownOptions.scrollTop = scrollOffset;
                            }
                        }
                    };
                    if (this.isMultiple) {
                        dropdownOptions.closeOnClick = false;
                    }
                    this.dropdown = M.Dropdown.init(this.input, dropdownOptions);
                }
                this._setSelectedStates();
            }
        }, {
            key: "_addOptionToValueDict",
            value: function _addOptionToValueDict(el, optionEl) {
                var index = Object.keys(this._valueDict).length;
                var key = this.dropdownOptions.id + index;
                var obj = {};
                optionEl.id = key;
                obj.el = el;
                obj.optionEl = optionEl;
                this._valueDict[key] = obj;
            }
        }, {
            key: "_removeDropdown",
            value: function _removeDropdown() {
                $(this.wrapper).find(".caret").remove();
                $(this.input).remove();
                $(this.dropdownOptions).remove();
                $(this.wrapper).before(this.$el);
                $(this.wrapper).remove();
            }
        }, {
            key: "_appendOptionWithIcon",
            value: function _appendOptionWithIcon(select, option, type) {
                var disabledClass = option.disabled ? "disabled " : "";
                var optgroupClass = type === "optgroup-option" ? "optgroup-option " : "";
                var multipleCheckbox = this.isMultiple ? '<label><input type="checkbox"'.concat(disabledClass, '"/><span>').concat(option.innerHTML, "</span></label>") : option.innerHTML;
                var liEl = $("<li></li>");
                var spanEl = $("<span></span>");
                spanEl.html(multipleCheckbox);
                liEl.addClass("".concat(disabledClass, " ").concat(optgroupClass));
                liEl.append(spanEl);
                var iconUrl = option.getAttribute("data-icon");
                if (!!iconUrl) {
                    var imgEl = $('<img alt="" src="'.concat(iconUrl, '">'));
                    liEl.prepend(imgEl);
                }
                $(this.dropdownOptions).append(liEl[0]);
                return liEl[0];
            }
        }, {
            key: "_toggleEntryFromArray",
            value: function _toggleEntryFromArray(key) {
                var notAdded = !this._keysSelected.hasOwnProperty(key);
                var $optionLi = $(this._valueDict[key].optionEl);
                if (notAdded) {
                    this._keysSelected[key] = true;
                } else {
                    delete this._keysSelected[key];
                }
                $optionLi.toggleClass("selected", notAdded);
                $optionLi.find('input[type="checkbox"]').prop("checked", notAdded);
                $optionLi.prop("selected", notAdded);
                return notAdded;
            }
        }, {
            key: "_setValueToInput",
            value: function _setValueToInput() {
                var values = [];
                var options = this.$el.find("option");
                options.each(function(el) {
                    if ($(el).prop("selected")) {
                        var text = $(el).text();
                        values.push(text);
                    }
                });
                if (!values.length) {
                    var firstDisabled = this.$el.find("option:disabled").eq(0);
                    if (firstDisabled.length && firstDisabled[0].value === "") {
                        values.push(firstDisabled.text());
                    }
                }
                this.input.value = values.join(", ");
            }
        }, {
            key: "_setSelectedStates",
            value: function _setSelectedStates() {
                this._keysSelected = {};
                for (var key in this._valueDict) {
                    var option = this._valueDict[key];
                    var optionIsSelected = $(option.el).prop("selected");
                    $(option.optionEl).find('input[type="checkbox"]').prop("checked", optionIsSelected);
                    if (optionIsSelected) {
                        this._activateOption($(this.dropdownOptions), $(option.optionEl));
                        this._keysSelected[key] = true;
                    } else {
                        $(option.optionEl).removeClass("selected");
                    }
                }
            }
        }, {
            key: "_activateOption",
            value: function _activateOption(collection, newOption) {
                if (newOption) {
                    if (!this.isMultiple) {
                        collection.find("li.selected").removeClass("selected");
                    }
                    var option = $(newOption);
                    option.addClass("selected");
                }
            }
        }, {
            key: "getSelectedValues",
            value: function getSelectedValues() {
                var selectedValues = [];
                for (var key in this._keysSelected) {
                    selectedValues.push(this._valueDict[key].el.value);
                }
                return selectedValues;
            }
        } ], [ {
            key: "init",
            value: function init(els, options) {
                return _get(_getPrototypeOf(FormSelect), "init", this).call(this, this, els, options);
            }
        }, {
            key: "getInstance",
            value: function getInstance(el) {
                var domElem = !!el.jquery ? el[0] : el;
                return domElem.M_FormSelect;
            }
        }, {
            key: "defaults",
            get: function get() {
                return _defaults;
            }
        } ]);
        return FormSelect;
    }(Component);
    M.FormSelect = FormSelect;
    if (M.jQueryLoaded) {
        M.initializeJqueryWrapper(FormSelect, "formSelect", "M_FormSelect");
    }
})(cash);

(function($, anim) {
    "use strict";
    var _defaults = {};
    var Range = function(_Component21) {
        _inherits(Range, _Component21);
        function Range(el, options) {
            var _this72;
            _classCallCheck(this, Range);
            _this72 = _possibleConstructorReturn(this, _getPrototypeOf(Range).call(this, Range, el, options));
            _this72.el.M_Range = _assertThisInitialized(_this72);
            _this72.options = $.extend({}, Range.defaults, options);
            _this72._mousedown = false;
            _this72._setupThumb();
            _this72._setupEventHandlers();
            return _this72;
        }
        _createClass(Range, [ {
            key: "destroy",
            value: function destroy() {
                this._removeEventHandlers();
                this._removeThumb();
                this.el.M_Range = undefined;
            }
        }, {
            key: "_setupEventHandlers",
            value: function _setupEventHandlers() {
                this._handleRangeChangeBound = this._handleRangeChange.bind(this);
                this._handleRangeMousedownTouchstartBound = this._handleRangeMousedownTouchstart.bind(this);
                this._handleRangeInputMousemoveTouchmoveBound = this._handleRangeInputMousemoveTouchmove.bind(this);
                this._handleRangeMouseupTouchendBound = this._handleRangeMouseupTouchend.bind(this);
                this._handleRangeBlurMouseoutTouchleaveBound = this._handleRangeBlurMouseoutTouchleave.bind(this);
                this.el.addEventListener("change", this._handleRangeChangeBound);
                this.el.addEventListener("mousedown", this._handleRangeMousedownTouchstartBound);
                this.el.addEventListener("touchstart", this._handleRangeMousedownTouchstartBound);
                this.el.addEventListener("input", this._handleRangeInputMousemoveTouchmoveBound);
                this.el.addEventListener("mousemove", this._handleRangeInputMousemoveTouchmoveBound);
                this.el.addEventListener("touchmove", this._handleRangeInputMousemoveTouchmoveBound);
                this.el.addEventListener("mouseup", this._handleRangeMouseupTouchendBound);
                this.el.addEventListener("touchend", this._handleRangeMouseupTouchendBound);
                this.el.addEventListener("blur", this._handleRangeBlurMouseoutTouchleaveBound);
                this.el.addEventListener("mouseout", this._handleRangeBlurMouseoutTouchleaveBound);
                this.el.addEventListener("touchleave", this._handleRangeBlurMouseoutTouchleaveBound);
            }
        }, {
            key: "_removeEventHandlers",
            value: function _removeEventHandlers() {
                this.el.removeEventListener("change", this._handleRangeChangeBound);
                this.el.removeEventListener("mousedown", this._handleRangeMousedownTouchstartBound);
                this.el.removeEventListener("touchstart", this._handleRangeMousedownTouchstartBound);
                this.el.removeEventListener("input", this._handleRangeInputMousemoveTouchmoveBound);
                this.el.removeEventListener("mousemove", this._handleRangeInputMousemoveTouchmoveBound);
                this.el.removeEventListener("touchmove", this._handleRangeInputMousemoveTouchmoveBound);
                this.el.removeEventListener("mouseup", this._handleRangeMouseupTouchendBound);
                this.el.removeEventListener("touchend", this._handleRangeMouseupTouchendBound);
                this.el.removeEventListener("blur", this._handleRangeBlurMouseoutTouchleaveBound);
                this.el.removeEventListener("mouseout", this._handleRangeBlurMouseoutTouchleaveBound);
                this.el.removeEventListener("touchleave", this._handleRangeBlurMouseoutTouchleaveBound);
            }
        }, {
            key: "_handleRangeChange",
            value: function _handleRangeChange() {
                $(this.value).html(this.$el.val());
                if (!$(this.thumb).hasClass("active")) {
                    this._showRangeBubble();
                }
                var offsetLeft = this._calcRangeOffset();
                $(this.thumb).addClass("active").css("left", offsetLeft + "px");
            }
        }, {
            key: "_handleRangeMousedownTouchstart",
            value: function _handleRangeMousedownTouchstart(e) {
                $(this.value).html(this.$el.val());
                this._mousedown = true;
                this.$el.addClass("active");
                if (!$(this.thumb).hasClass("active")) {
                    this._showRangeBubble();
                }
                if (e.type !== "input") {
                    var offsetLeft = this._calcRangeOffset();
                    $(this.thumb).addClass("active").css("left", offsetLeft + "px");
                }
            }
        }, {
            key: "_handleRangeInputMousemoveTouchmove",
            value: function _handleRangeInputMousemoveTouchmove() {
                if (this._mousedown) {
                    if (!$(this.thumb).hasClass("active")) {
                        this._showRangeBubble();
                    }
                    var offsetLeft = this._calcRangeOffset();
                    $(this.thumb).addClass("active").css("left", offsetLeft + "px");
                    $(this.value).html(this.$el.val());
                }
            }
        }, {
            key: "_handleRangeMouseupTouchend",
            value: function _handleRangeMouseupTouchend() {
                this._mousedown = false;
                this.$el.removeClass("active");
            }
        }, {
            key: "_handleRangeBlurMouseoutTouchleave",
            value: function _handleRangeBlurMouseoutTouchleave() {
                if (!this._mousedown) {
                    var paddingLeft = parseInt(this.$el.css("padding-left"));
                    var marginLeft = 7 + paddingLeft + "px";
                    if ($(this.thumb).hasClass("active")) {
                        anim.remove(this.thumb);
                        anim({
                            targets: this.thumb,
                            height: 0,
                            width: 0,
                            top: 10,
                            easing: "easeOutQuad",
                            marginLeft: marginLeft,
                            duration: 100
                        });
                    }
                    $(this.thumb).removeClass("active");
                }
            }
        }, {
            key: "_setupThumb",
            value: function _setupThumb() {
                this.thumb = document.createElement("span");
                this.value = document.createElement("span");
                $(this.thumb).addClass("thumb");
                $(this.value).addClass("value");
                $(this.thumb).append(this.value);
                this.$el.after(this.thumb);
            }
        }, {
            key: "_removeThumb",
            value: function _removeThumb() {
                $(this.thumb).remove();
            }
        }, {
            key: "_showRangeBubble",
            value: function _showRangeBubble() {
                var paddingLeft = parseInt($(this.thumb).parent().css("padding-left"));
                var marginLeft = -7 + paddingLeft + "px";
                anim.remove(this.thumb);
                anim({
                    targets: this.thumb,
                    height: 30,
                    width: 30,
                    top: -30,
                    marginLeft: marginLeft,
                    duration: 300,
                    easing: "easeOutQuint"
                });
            }
        }, {
            key: "_calcRangeOffset",
            value: function _calcRangeOffset() {
                var width = this.$el.width() - 15;
                var max = parseFloat(this.$el.attr("max")) || 100;
                var min = parseFloat(this.$el.attr("min")) || 0;
                var percent = (parseFloat(this.$el.val()) - min) / (max - min);
                return percent * width;
            }
        } ], [ {
            key: "init",
            value: function init(els, options) {
                return _get(_getPrototypeOf(Range), "init", this).call(this, this, els, options);
            }
        }, {
            key: "getInstance",
            value: function getInstance(el) {
                var domElem = !!el.jquery ? el[0] : el;
                return domElem.M_Range;
            }
        }, {
            key: "defaults",
            get: function get() {
                return _defaults;
            }
        } ]);
        return Range;
    }(Component);
    M.Range = Range;
    if (M.jQueryLoaded) {
        M.initializeJqueryWrapper(Range, "range", "M_Range");
    }
    Range.init($("input[type=range]"));
})(cash, M.anime);