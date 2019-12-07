(function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){

},{}],2:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.newGuid = newGuid;
exports.isGuid = isGuid;
exports.trimGuid = trimGuid;

var _perf_hooks = require("perf_hooks");

function newGuid() {
  var d = new Date().getTime();

  if (typeof _perf_hooks.performance !== 'undefined' && typeof _perf_hooks.performance.now === 'function') {
    d += _perf_hooks.performance.now();
  }

  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
    var r = (d + Math.random() * 16) % 16 | 0;
    d = Math.floor(d / 16);
    return (c === 'x' ? r : r & 0x3 | 0x8).toString(16);
  });
}

function isGuid(parameter) {
  try {
    var matches = /[0-9A-F]{8}[-]?([0-9A-F]{4}[-]?){3}[0-9A-F]{12}/i.exec(parameter);
    var match = matches && matches.length > 0 ? matches[0] : undefined;
    return !(typeof match === "undefined" || match === null);
  } catch (error) {
    return false;
  }
}

function trimGuid(id) {
  return (id || '').replace(/{|}/g, '');
}

},{"perf_hooks":1}],3:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var PromiseInfo = function PromiseInfo(resolve, reject) {
  _classCallCheck(this, PromiseInfo);

  this.resolve = resolve;
  this.reject = reject;
};

exports["default"] = PromiseInfo;

},{}],4:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.LocalBridge = void 0;

var _WebviewBridge2 = _interopRequireDefault(require("./WebviewBridge"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } return _assertThisInitialized(self); }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

var LocalBridge =
/*#__PURE__*/
function (_WebviewBridge) {
  _inherits(LocalBridge, _WebviewBridge);

  function LocalBridge(window, vscode) {
    var _this;

    _classCallCheck(this, LocalBridge);

    _this = _possibleConstructorReturn(this, _getPrototypeOf(LocalBridge).call(this));
    _this.window = window;
    _this.vscode = vscode;

    _this.window.addEventListener("message", function (event) {
      var message = event.data;

      switch (message.command) {
        case "WebViewBridge:response":
          _this.handleResponse(message);

          break;

        case "WebViewBridge:request":
          _this.handleRequest(message);

          break;
      }
    });

    return _this;
  }

  _createClass(LocalBridge, [{
    key: "request",
    value: function request(guid, method, params) {
      var _this2 = this;

      setTimeout(function () {
        var promiseCallbacks = _this2.promises.get(guid);

        if (promiseCallbacks) {
          promiseCallbacks.reject("Request timed out");

          _this2.promises["delete"](guid);
        }
      }, this.timeout);
      this.vscode.postMessage({
        command: "WebViewBridge:request",
        id: guid,
        method: method,
        params: params
      });
    }
  }, {
    key: "respond",
    value: function respond(guid, response) {
      var success = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : true;
      this.vscode.postMessage({
        command: "WebViewBridge:response",
        id: guid,
        response: response,
        success: success
      });
    }
  }]);

  return LocalBridge;
}(_WebviewBridge2["default"]);

exports.LocalBridge = LocalBridge;

},{"./WebviewBridge":6}],5:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.WebSocketBridge = void 0;

var _WebviewBridge2 = _interopRequireDefault(require("./WebviewBridge"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } return _assertThisInitialized(self); }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

var WebSocketBridge =
/*#__PURE__*/
function (_WebviewBridge) {
  _inherits(WebSocketBridge, _WebviewBridge);

  function WebSocketBridge(ws) {
    var _this;

    _classCallCheck(this, WebSocketBridge);

    _this = _possibleConstructorReturn(this, _getPrototypeOf(WebSocketBridge).call(this));
    _this.ws = ws;

    _this.ws.addEventListener("message", function (event) {
      var message = JSON.parse(event.data);

      switch (message.command) {
        case "WebViewBridge:response":
          _this.handleResponse(message);

          break;

        case "WebViewBridge:request":
          _this.handleRequest(message);

          break;
      }
    });

    return _this;
  }

  _createClass(WebSocketBridge, [{
    key: "request",
    value: function request(guid, method, params) {
      var _this2 = this;

      setTimeout(function () {
        var promiseCallbacks = _this2.promises.get(guid);

        if (promiseCallbacks) {
          promiseCallbacks.reject("Request timed out");

          _this2.promises["delete"](guid);
        }
      }, this.timeout);
      var requestBody = {
        command: "WebViewBridge:request",
        id: guid,
        method: method,
        params: params
      };
      this.ws.send(JSON.stringify(requestBody));
    }
  }, {
    key: "respond",
    value: function respond(guid, response) {
      var success = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : true;
      var responseBody = {
        command: "WebViewBridge:response",
        id: guid,
        response: response,
        success: success
      };
      this.ws.send(JSON.stringify(responseBody));
    }
  }]);

  return WebSocketBridge;
}(_WebviewBridge2["default"]);

exports.WebSocketBridge = WebSocketBridge;

},{"./WebviewBridge":6}],6:[function(require,module,exports){
"use strict";

function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _PromiseInfo = _interopRequireDefault(require("../types/PromiseInfo"));

var Guid = _interopRequireWildcard(require("../helpers/Guid"));

function _getRequireWildcardCache() { if (typeof WeakMap !== "function") return null; var cache = new WeakMap(); _getRequireWildcardCache = function _getRequireWildcardCache() { return cache; }; return cache; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } if (obj === null || _typeof(obj) !== "object" && typeof obj !== "function") { return { "default": obj }; } var cache = _getRequireWildcardCache(); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj["default"] = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

var __awaiter = void 0 && (void 0).__awaiter || function (thisArg, _arguments, P, generator) {
  function adopt(value) {
    return value instanceof P ? value : new P(function (resolve) {
      resolve(value);
    });
  }

  return new (P || (P = Promise))(function (resolve, reject) {
    function fulfilled(value) {
      try {
        step(generator.next(value));
      } catch (e) {
        reject(e);
      }
    }

    function rejected(value) {
      try {
        step(generator["throw"](value));
      } catch (e) {
        reject(e);
      }
    }

    function step(result) {
      result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected);
    }

    step((generator = generator.apply(thisArg, _arguments || [])).next());
  });
};

var WebviewBridge =
/*#__PURE__*/
function () {
  function WebviewBridge() {
    _classCallCheck(this, WebviewBridge);

    this.timeout = 3600000;
    this.promises = new Map();
    this.functions = new Map();
    this.add({
      func: this.locals,
      thisArg: this,
      name: "WebViewBridge:list"
    });
  }

  _createClass(WebviewBridge, [{
    key: "setTimeout",
    value: function setTimeout(timeout) {
      this.timeout = timeout;
    }
  }, {
    key: "add",
    value: function add(method) {
      this.functions.set(method.name ? method.name : method.func.name, method);
    }
  }, {
    key: "remove",
    value: function remove(method) {
      this.functions["delete"](method.name ? method.name : method.func.name);
    }
  }, {
    key: "locals",
    value: function locals() {
      return Array.from(this.functions.keys());
    }
  }, {
    key: "remote",
    value: function remote() {
      return this.invoke("WebViewBridge:list");
    }
  }, {
    key: "invoke",
    value: function invoke(method, params) {
      var _this = this;

      var id = Guid.newGuid();
      var promise = new Promise(function (resolve, reject) {
        _this.promises.set(id, new _PromiseInfo["default"](resolve, reject));
      });
      this.request(id, method, params);
      return promise;
    }
  }, {
    key: "handleResponse",
    value: function handleResponse(message) {
      var promiseCallbacks = this.promises.get(message.id);

      if (promiseCallbacks) {
        if (message.success) {
          promiseCallbacks.resolve(message.response);
        } else {
          promiseCallbacks.reject(message.response);
        }

        this.promises["delete"](message.id);
      }
    }
  }, {
    key: "handleRequest",
    value: function handleRequest(message) {
      return __awaiter(this, void 0, void 0,
      /*#__PURE__*/
      regeneratorRuntime.mark(function _callee() {
        var method, func, thisArg, response;
        return regeneratorRuntime.wrap(function _callee$(_context) {
          while (1) {
            switch (_context.prev = _context.next) {
              case 0:
                method = this.functions.get(message.method);

                if (!method) {
                  _context.next = 16;
                  break;
                }

                func = method.func;
                thisArg = method.thisArg;
                _context.prev = 4;
                response = func.apply(thisArg, message.params);

                if (!(typeof response.then === "function")) {
                  _context.next = 10;
                  break;
                }

                _context.next = 9;
                return response;

              case 9:
                response = _context.sent;

              case 10:
                this.respond(message.id, response);
                _context.next = 16;
                break;

              case 13:
                _context.prev = 13;
                _context.t0 = _context["catch"](4);
                this.respond(message.id, _context.t0, false);

              case 16:
              case "end":
                return _context.stop();
            }
          }
        }, _callee, this, [[4, 13]]);
      }));
    }
  }]);

  return WebviewBridge;
}();

exports["default"] = WebviewBridge;

},{"../helpers/Guid":2,"../types/PromiseInfo":3}]},{},[2,3,4,5,6])
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJub2RlX21vZHVsZXMvYnJvd3NlcmlmeS9saWIvX2VtcHR5LmpzIiwib3V0L3RlbXAvYnJvd3Nlci9oZWxwZXJzL0d1aWQuanMiLCJvdXQvdGVtcC9icm93c2VyL3R5cGVzL1Byb21pc2VJbmZvLmpzIiwib3V0L3RlbXAvYnJvd3Nlci93ZWJ1aS9Mb2NhbEJyaWRnZS5icm93c2VyLmpzIiwib3V0L3RlbXAvYnJvd3Nlci93ZWJ1aS9XZWJTb2NrZXRCcmlkZ2UuYnJvd3Nlci5qcyIsIm91dC90ZW1wL2Jyb3dzZXIvd2VidWkvV2Vidmlld0JyaWRnZS5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTtBQ0FBOztBQ0FBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUN0Q0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2pCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3BHQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDckdBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBIiwiZmlsZSI6ImdlbmVyYXRlZC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzQ29udGVudCI6WyIoZnVuY3Rpb24oKXtmdW5jdGlvbiByKGUsbix0KXtmdW5jdGlvbiBvKGksZil7aWYoIW5baV0pe2lmKCFlW2ldKXt2YXIgYz1cImZ1bmN0aW9uXCI9PXR5cGVvZiByZXF1aXJlJiZyZXF1aXJlO2lmKCFmJiZjKXJldHVybiBjKGksITApO2lmKHUpcmV0dXJuIHUoaSwhMCk7dmFyIGE9bmV3IEVycm9yKFwiQ2Fubm90IGZpbmQgbW9kdWxlICdcIitpK1wiJ1wiKTt0aHJvdyBhLmNvZGU9XCJNT0RVTEVfTk9UX0ZPVU5EXCIsYX12YXIgcD1uW2ldPXtleHBvcnRzOnt9fTtlW2ldWzBdLmNhbGwocC5leHBvcnRzLGZ1bmN0aW9uKHIpe3ZhciBuPWVbaV1bMV1bcl07cmV0dXJuIG8obnx8cil9LHAscC5leHBvcnRzLHIsZSxuLHQpfXJldHVybiBuW2ldLmV4cG9ydHN9Zm9yKHZhciB1PVwiZnVuY3Rpb25cIj09dHlwZW9mIHJlcXVpcmUmJnJlcXVpcmUsaT0wO2k8dC5sZW5ndGg7aSsrKW8odFtpXSk7cmV0dXJuIG99cmV0dXJuIHJ9KSgpIiwiIiwiXCJ1c2Ugc3RyaWN0XCI7XG5cbk9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBcIl9fZXNNb2R1bGVcIiwge1xuICB2YWx1ZTogdHJ1ZVxufSk7XG5leHBvcnRzLm5ld0d1aWQgPSBuZXdHdWlkO1xuZXhwb3J0cy5pc0d1aWQgPSBpc0d1aWQ7XG5leHBvcnRzLnRyaW1HdWlkID0gdHJpbUd1aWQ7XG5cbnZhciBfcGVyZl9ob29rcyA9IHJlcXVpcmUoXCJwZXJmX2hvb2tzXCIpO1xuXG5mdW5jdGlvbiBuZXdHdWlkKCkge1xuICB2YXIgZCA9IG5ldyBEYXRlKCkuZ2V0VGltZSgpO1xuXG4gIGlmICh0eXBlb2YgX3BlcmZfaG9va3MucGVyZm9ybWFuY2UgIT09ICd1bmRlZmluZWQnICYmIHR5cGVvZiBfcGVyZl9ob29rcy5wZXJmb3JtYW5jZS5ub3cgPT09ICdmdW5jdGlvbicpIHtcbiAgICBkICs9IF9wZXJmX2hvb2tzLnBlcmZvcm1hbmNlLm5vdygpO1xuICB9XG5cbiAgcmV0dXJuICd4eHh4eHh4eC14eHh4LTR4eHgteXh4eC14eHh4eHh4eHh4eHgnLnJlcGxhY2UoL1t4eV0vZywgZnVuY3Rpb24gKGMpIHtcbiAgICB2YXIgciA9IChkICsgTWF0aC5yYW5kb20oKSAqIDE2KSAlIDE2IHwgMDtcbiAgICBkID0gTWF0aC5mbG9vcihkIC8gMTYpO1xuICAgIHJldHVybiAoYyA9PT0gJ3gnID8gciA6IHIgJiAweDMgfCAweDgpLnRvU3RyaW5nKDE2KTtcbiAgfSk7XG59XG5cbmZ1bmN0aW9uIGlzR3VpZChwYXJhbWV0ZXIpIHtcbiAgdHJ5IHtcbiAgICB2YXIgbWF0Y2hlcyA9IC9bMC05QS1GXXs4fVstXT8oWzAtOUEtRl17NH1bLV0/KXszfVswLTlBLUZdezEyfS9pLmV4ZWMocGFyYW1ldGVyKTtcbiAgICB2YXIgbWF0Y2ggPSBtYXRjaGVzICYmIG1hdGNoZXMubGVuZ3RoID4gMCA/IG1hdGNoZXNbMF0gOiB1bmRlZmluZWQ7XG4gICAgcmV0dXJuICEodHlwZW9mIG1hdGNoID09PSBcInVuZGVmaW5lZFwiIHx8IG1hdGNoID09PSBudWxsKTtcbiAgfSBjYXRjaCAoZXJyb3IpIHtcbiAgICByZXR1cm4gZmFsc2U7XG4gIH1cbn1cblxuZnVuY3Rpb24gdHJpbUd1aWQoaWQpIHtcbiAgcmV0dXJuIChpZCB8fCAnJykucmVwbGFjZSgve3x9L2csICcnKTtcbn1cbi8vIyBzb3VyY2VNYXBwaW5nVVJMPWRhdGE6YXBwbGljYXRpb24vanNvbjtjaGFyc2V0PXV0Zi04O2Jhc2U2NCxleUoyWlhKemFXOXVJam96TENKemIzVnlZMlZ6SWpwYklpNHVMeTR1THk0dUx5NHVMM055WXk5amIzSmxMMmhsYkhCbGNuTXZSM1ZwWkM1MGN5SmRMQ0p1WVcxbGN5STZXMTBzSW0xaGNIQnBibWR6SWpvaU96czdPenM3T3pzN1FVRkJRVHM3UVVGSFRTeFRRVUZWTEU5QlFWWXNSMEZCYVVJN1FVRkRia0lzVFVGQlNTeERRVUZETEVkQlFVY3NTVUZCU1N4SlFVRktMRWRCUVZjc1QwRkJXQ3hGUVVGU096dEJRVVZCTEUxQlFVa3NUMEZCVHl4MVFrRkJVQ3hMUVVGMVFpeFhRVUYyUWl4SlFVRnpReXhQUVVGUExIZENRVUZaTEVkQlFXNUNMRXRCUVRKQ0xGVkJRWEpGTEVWQlFXbEdPMEZCUXpkRkxFbEJRVUVzUTBGQlF5eEpRVUZKTEhkQ1FVRlpMRWRCUVZvc1JVRkJURHRCUVVOSU96dEJRVVZFTEZOQlFVOHNkVU5CUVhWRExFOUJRWFpETEVOQlFTdERMRTlCUVM5RExFVkJRWGRFTEZWQlFWVXNRMEZCVml4RlFVRlhPMEZCUTNSRkxGRkJRVWtzUTBGQlF5eEhRVUZITEVOQlFVTXNRMEZCUXl4SFFVRkhMRWxCUVVrc1EwRkJReXhOUVVGTUxFdEJRV2RDTEVWQlFYSkNMRWxCUVRKQ0xFVkJRVE5DTEVkQlFXZERMRU5CUVhoRE8wRkJSVUVzU1VGQlFTeERRVUZETEVkQlFVY3NTVUZCU1N4RFFVRkRMRXRCUVV3c1EwRkJWeXhEUVVGRExFZEJRVWNzUlVGQlppeERRVUZLTzBGQlJVRXNWMEZCVHl4RFFVRkRMRU5CUVVNc1MwRkJTeXhIUVVGT0xFZEJRVmtzUTBGQldpeEhRVUZwUWl4RFFVRkRMRWRCUVVjc1IwRkJTaXhIUVVGVkxFZEJRVFZDTEVWQlFXdERMRkZCUVd4RExFTkJRVEpETEVWQlFUTkRMRU5CUVZBN1FVRkRTQ3hIUVU1TkxFTkJRVkE3UVVGUFNEczdRVUZGU3l4VFFVRlZMRTFCUVZZc1EwRkJhVUlzVTBGQmFrSXNSVUZCYVVNN1FVRkRia01zVFVGQlNUdEJRVU5CTEZGQlFVMHNUMEZCVHl4SFFVRkhMRzFFUVVGdFJDeEpRVUZ1UkN4RFFVRjNSQ3hUUVVGNFJDeERRVUZvUWp0QlFVTkJMRkZCUVUwc1MwRkJTeXhIUVVGSExFOUJRVThzU1VGQlNTeFBRVUZQTEVOQlFVTXNUVUZCVWl4SFFVRnBRaXhEUVVFMVFpeEhRVUZuUXl4UFFVRlBMRU5CUVVNc1EwRkJSQ3hEUVVGMlF5eEhRVUUyUXl4VFFVRXpSRHRCUVVWQkxGZEJRVThzUlVGQlJTeFBRVUZQTEV0QlFWQXNTMEZCYVVJc1YwRkJha0lzU1VGQlowTXNTMEZCU3l4TFFVRkxMRWxCUVRWRExFTkJRVkE3UVVGRFNDeEhRVXhFTEVOQlRVRXNUMEZCVHl4TFFVRlFMRVZCUVdNN1FVRkRWaXhYUVVGUExFdEJRVkE3UVVGRFNEdEJRVU5LT3p0QlFVVkxMRk5CUVZVc1VVRkJWaXhEUVVGdFFpeEZRVUZ1UWl4RlFVRTJRanRCUVVNdlFpeFRRVUZQTEVOQlFVTXNSVUZCUlN4SlFVRkpMRVZCUVZBc1JVRkJWeXhQUVVGWUxFTkJRVzFDTEUxQlFXNUNMRVZCUVRKQ0xFVkJRVE5DTEVOQlFWQTdRVUZEU0NJc0luTnZkWEpqWlZKdmIzUWlPaUlpZlE9PSIsIlwidXNlIHN0cmljdFwiO1xuXG5PYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgXCJfX2VzTW9kdWxlXCIsIHtcbiAgdmFsdWU6IHRydWVcbn0pO1xuZXhwb3J0c1tcImRlZmF1bHRcIl0gPSB2b2lkIDA7XG5cbmZ1bmN0aW9uIF9jbGFzc0NhbGxDaGVjayhpbnN0YW5jZSwgQ29uc3RydWN0b3IpIHsgaWYgKCEoaW5zdGFuY2UgaW5zdGFuY2VvZiBDb25zdHJ1Y3RvcikpIHsgdGhyb3cgbmV3IFR5cGVFcnJvcihcIkNhbm5vdCBjYWxsIGEgY2xhc3MgYXMgYSBmdW5jdGlvblwiKTsgfSB9XG5cbnZhciBQcm9taXNlSW5mbyA9IGZ1bmN0aW9uIFByb21pc2VJbmZvKHJlc29sdmUsIHJlamVjdCkge1xuICBfY2xhc3NDYWxsQ2hlY2sodGhpcywgUHJvbWlzZUluZm8pO1xuXG4gIHRoaXMucmVzb2x2ZSA9IHJlc29sdmU7XG4gIHRoaXMucmVqZWN0ID0gcmVqZWN0O1xufTtcblxuZXhwb3J0c1tcImRlZmF1bHRcIl0gPSBQcm9taXNlSW5mbztcbi8vIyBzb3VyY2VNYXBwaW5nVVJMPWRhdGE6YXBwbGljYXRpb24vanNvbjtjaGFyc2V0PXV0Zi04O2Jhc2U2NCxleUoyWlhKemFXOXVJam96TENKemIzVnlZMlZ6SWpwYklpNHVMeTR1THk0dUx5NHVMM055WXk5amIzSmxMM1I1Y0dWekwxQnliMjFwYzJWSmJtWnZMblJ6SWwwc0ltNWhiV1Z6SWpwYlhTd2liV0Z3Y0dsdVozTWlPaUk3T3pzN096czdPenRKUVV0eFFpeFhMRWRCU1hCQ0xIRkNRVUZaTEU5QlFWb3NSVUZCTWtRc1RVRkJNMFFzUlVGQmVVWTdRVUZCUVRzN1FVRkRlRVlzVDBGQlN5eFBRVUZNTEVkQlFXVXNUMEZCWmp0QlFVTkJMRTlCUVVzc1RVRkJUQ3hIUVVGakxFMUJRV1E3UVVGRFFTeERJaXdpYzI5MWNtTmxVbTl2ZENJNklpSjkiLCJcInVzZSBzdHJpY3RcIjtcblxuT2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFwiX19lc01vZHVsZVwiLCB7XG4gIHZhbHVlOiB0cnVlXG59KTtcbmV4cG9ydHMuTG9jYWxCcmlkZ2UgPSB2b2lkIDA7XG5cbnZhciBfV2Vidmlld0JyaWRnZTIgPSBfaW50ZXJvcFJlcXVpcmVEZWZhdWx0KHJlcXVpcmUoXCIuL1dlYnZpZXdCcmlkZ2VcIikpO1xuXG5mdW5jdGlvbiBfaW50ZXJvcFJlcXVpcmVEZWZhdWx0KG9iaikgeyByZXR1cm4gb2JqICYmIG9iai5fX2VzTW9kdWxlID8gb2JqIDogeyBcImRlZmF1bHRcIjogb2JqIH07IH1cblxuZnVuY3Rpb24gX3R5cGVvZihvYmopIHsgaWYgKHR5cGVvZiBTeW1ib2wgPT09IFwiZnVuY3Rpb25cIiAmJiB0eXBlb2YgU3ltYm9sLml0ZXJhdG9yID09PSBcInN5bWJvbFwiKSB7IF90eXBlb2YgPSBmdW5jdGlvbiBfdHlwZW9mKG9iaikgeyByZXR1cm4gdHlwZW9mIG9iajsgfTsgfSBlbHNlIHsgX3R5cGVvZiA9IGZ1bmN0aW9uIF90eXBlb2Yob2JqKSB7IHJldHVybiBvYmogJiYgdHlwZW9mIFN5bWJvbCA9PT0gXCJmdW5jdGlvblwiICYmIG9iai5jb25zdHJ1Y3RvciA9PT0gU3ltYm9sICYmIG9iaiAhPT0gU3ltYm9sLnByb3RvdHlwZSA/IFwic3ltYm9sXCIgOiB0eXBlb2Ygb2JqOyB9OyB9IHJldHVybiBfdHlwZW9mKG9iaik7IH1cblxuZnVuY3Rpb24gX2NsYXNzQ2FsbENoZWNrKGluc3RhbmNlLCBDb25zdHJ1Y3RvcikgeyBpZiAoIShpbnN0YW5jZSBpbnN0YW5jZW9mIENvbnN0cnVjdG9yKSkgeyB0aHJvdyBuZXcgVHlwZUVycm9yKFwiQ2Fubm90IGNhbGwgYSBjbGFzcyBhcyBhIGZ1bmN0aW9uXCIpOyB9IH1cblxuZnVuY3Rpb24gX2RlZmluZVByb3BlcnRpZXModGFyZ2V0LCBwcm9wcykgeyBmb3IgKHZhciBpID0gMDsgaSA8IHByb3BzLmxlbmd0aDsgaSsrKSB7IHZhciBkZXNjcmlwdG9yID0gcHJvcHNbaV07IGRlc2NyaXB0b3IuZW51bWVyYWJsZSA9IGRlc2NyaXB0b3IuZW51bWVyYWJsZSB8fCBmYWxzZTsgZGVzY3JpcHRvci5jb25maWd1cmFibGUgPSB0cnVlOyBpZiAoXCJ2YWx1ZVwiIGluIGRlc2NyaXB0b3IpIGRlc2NyaXB0b3Iud3JpdGFibGUgPSB0cnVlOyBPYmplY3QuZGVmaW5lUHJvcGVydHkodGFyZ2V0LCBkZXNjcmlwdG9yLmtleSwgZGVzY3JpcHRvcik7IH0gfVxuXG5mdW5jdGlvbiBfY3JlYXRlQ2xhc3MoQ29uc3RydWN0b3IsIHByb3RvUHJvcHMsIHN0YXRpY1Byb3BzKSB7IGlmIChwcm90b1Byb3BzKSBfZGVmaW5lUHJvcGVydGllcyhDb25zdHJ1Y3Rvci5wcm90b3R5cGUsIHByb3RvUHJvcHMpOyBpZiAoc3RhdGljUHJvcHMpIF9kZWZpbmVQcm9wZXJ0aWVzKENvbnN0cnVjdG9yLCBzdGF0aWNQcm9wcyk7IHJldHVybiBDb25zdHJ1Y3RvcjsgfVxuXG5mdW5jdGlvbiBfcG9zc2libGVDb25zdHJ1Y3RvclJldHVybihzZWxmLCBjYWxsKSB7IGlmIChjYWxsICYmIChfdHlwZW9mKGNhbGwpID09PSBcIm9iamVjdFwiIHx8IHR5cGVvZiBjYWxsID09PSBcImZ1bmN0aW9uXCIpKSB7IHJldHVybiBjYWxsOyB9IHJldHVybiBfYXNzZXJ0VGhpc0luaXRpYWxpemVkKHNlbGYpOyB9XG5cbmZ1bmN0aW9uIF9hc3NlcnRUaGlzSW5pdGlhbGl6ZWQoc2VsZikgeyBpZiAoc2VsZiA9PT0gdm9pZCAwKSB7IHRocm93IG5ldyBSZWZlcmVuY2VFcnJvcihcInRoaXMgaGFzbid0IGJlZW4gaW5pdGlhbGlzZWQgLSBzdXBlcigpIGhhc24ndCBiZWVuIGNhbGxlZFwiKTsgfSByZXR1cm4gc2VsZjsgfVxuXG5mdW5jdGlvbiBfZ2V0UHJvdG90eXBlT2YobykgeyBfZ2V0UHJvdG90eXBlT2YgPSBPYmplY3Quc2V0UHJvdG90eXBlT2YgPyBPYmplY3QuZ2V0UHJvdG90eXBlT2YgOiBmdW5jdGlvbiBfZ2V0UHJvdG90eXBlT2YobykgeyByZXR1cm4gby5fX3Byb3RvX18gfHwgT2JqZWN0LmdldFByb3RvdHlwZU9mKG8pOyB9OyByZXR1cm4gX2dldFByb3RvdHlwZU9mKG8pOyB9XG5cbmZ1bmN0aW9uIF9pbmhlcml0cyhzdWJDbGFzcywgc3VwZXJDbGFzcykgeyBpZiAodHlwZW9mIHN1cGVyQ2xhc3MgIT09IFwiZnVuY3Rpb25cIiAmJiBzdXBlckNsYXNzICE9PSBudWxsKSB7IHRocm93IG5ldyBUeXBlRXJyb3IoXCJTdXBlciBleHByZXNzaW9uIG11c3QgZWl0aGVyIGJlIG51bGwgb3IgYSBmdW5jdGlvblwiKTsgfSBzdWJDbGFzcy5wcm90b3R5cGUgPSBPYmplY3QuY3JlYXRlKHN1cGVyQ2xhc3MgJiYgc3VwZXJDbGFzcy5wcm90b3R5cGUsIHsgY29uc3RydWN0b3I6IHsgdmFsdWU6IHN1YkNsYXNzLCB3cml0YWJsZTogdHJ1ZSwgY29uZmlndXJhYmxlOiB0cnVlIH0gfSk7IGlmIChzdXBlckNsYXNzKSBfc2V0UHJvdG90eXBlT2Yoc3ViQ2xhc3MsIHN1cGVyQ2xhc3MpOyB9XG5cbmZ1bmN0aW9uIF9zZXRQcm90b3R5cGVPZihvLCBwKSB7IF9zZXRQcm90b3R5cGVPZiA9IE9iamVjdC5zZXRQcm90b3R5cGVPZiB8fCBmdW5jdGlvbiBfc2V0UHJvdG90eXBlT2YobywgcCkgeyBvLl9fcHJvdG9fXyA9IHA7IHJldHVybiBvOyB9OyByZXR1cm4gX3NldFByb3RvdHlwZU9mKG8sIHApOyB9XG5cbnZhciBMb2NhbEJyaWRnZSA9XG4vKiNfX1BVUkVfXyovXG5mdW5jdGlvbiAoX1dlYnZpZXdCcmlkZ2UpIHtcbiAgX2luaGVyaXRzKExvY2FsQnJpZGdlLCBfV2Vidmlld0JyaWRnZSk7XG5cbiAgZnVuY3Rpb24gTG9jYWxCcmlkZ2Uod2luZG93LCB2c2NvZGUpIHtcbiAgICB2YXIgX3RoaXM7XG5cbiAgICBfY2xhc3NDYWxsQ2hlY2sodGhpcywgTG9jYWxCcmlkZ2UpO1xuXG4gICAgX3RoaXMgPSBfcG9zc2libGVDb25zdHJ1Y3RvclJldHVybih0aGlzLCBfZ2V0UHJvdG90eXBlT2YoTG9jYWxCcmlkZ2UpLmNhbGwodGhpcykpO1xuICAgIF90aGlzLndpbmRvdyA9IHdpbmRvdztcbiAgICBfdGhpcy52c2NvZGUgPSB2c2NvZGU7XG5cbiAgICBfdGhpcy53aW5kb3cuYWRkRXZlbnRMaXN0ZW5lcihcIm1lc3NhZ2VcIiwgZnVuY3Rpb24gKGV2ZW50KSB7XG4gICAgICB2YXIgbWVzc2FnZSA9IGV2ZW50LmRhdGE7XG5cbiAgICAgIHN3aXRjaCAobWVzc2FnZS5jb21tYW5kKSB7XG4gICAgICAgIGNhc2UgXCJXZWJWaWV3QnJpZGdlOnJlc3BvbnNlXCI6XG4gICAgICAgICAgX3RoaXMuaGFuZGxlUmVzcG9uc2UobWVzc2FnZSk7XG5cbiAgICAgICAgICBicmVhaztcblxuICAgICAgICBjYXNlIFwiV2ViVmlld0JyaWRnZTpyZXF1ZXN0XCI6XG4gICAgICAgICAgX3RoaXMuaGFuZGxlUmVxdWVzdChtZXNzYWdlKTtcblxuICAgICAgICAgIGJyZWFrO1xuICAgICAgfVxuICAgIH0pO1xuXG4gICAgcmV0dXJuIF90aGlzO1xuICB9XG5cbiAgX2NyZWF0ZUNsYXNzKExvY2FsQnJpZGdlLCBbe1xuICAgIGtleTogXCJyZXF1ZXN0XCIsXG4gICAgdmFsdWU6IGZ1bmN0aW9uIHJlcXVlc3QoZ3VpZCwgbWV0aG9kLCBwYXJhbXMpIHtcbiAgICAgIHZhciBfdGhpczIgPSB0aGlzO1xuXG4gICAgICBzZXRUaW1lb3V0KGZ1bmN0aW9uICgpIHtcbiAgICAgICAgdmFyIHByb21pc2VDYWxsYmFja3MgPSBfdGhpczIucHJvbWlzZXMuZ2V0KGd1aWQpO1xuXG4gICAgICAgIGlmIChwcm9taXNlQ2FsbGJhY2tzKSB7XG4gICAgICAgICAgcHJvbWlzZUNhbGxiYWNrcy5yZWplY3QoXCJSZXF1ZXN0IHRpbWVkIG91dFwiKTtcblxuICAgICAgICAgIF90aGlzMi5wcm9taXNlc1tcImRlbGV0ZVwiXShndWlkKTtcbiAgICAgICAgfVxuICAgICAgfSwgdGhpcy50aW1lb3V0KTtcbiAgICAgIHRoaXMudnNjb2RlLnBvc3RNZXNzYWdlKHtcbiAgICAgICAgY29tbWFuZDogXCJXZWJWaWV3QnJpZGdlOnJlcXVlc3RcIixcbiAgICAgICAgaWQ6IGd1aWQsXG4gICAgICAgIG1ldGhvZDogbWV0aG9kLFxuICAgICAgICBwYXJhbXM6IHBhcmFtc1xuICAgICAgfSk7XG4gICAgfVxuICB9LCB7XG4gICAga2V5OiBcInJlc3BvbmRcIixcbiAgICB2YWx1ZTogZnVuY3Rpb24gcmVzcG9uZChndWlkLCByZXNwb25zZSkge1xuICAgICAgdmFyIHN1Y2Nlc3MgPSBhcmd1bWVudHMubGVuZ3RoID4gMiAmJiBhcmd1bWVudHNbMl0gIT09IHVuZGVmaW5lZCA/IGFyZ3VtZW50c1syXSA6IHRydWU7XG4gICAgICB0aGlzLnZzY29kZS5wb3N0TWVzc2FnZSh7XG4gICAgICAgIGNvbW1hbmQ6IFwiV2ViVmlld0JyaWRnZTpyZXNwb25zZVwiLFxuICAgICAgICBpZDogZ3VpZCxcbiAgICAgICAgcmVzcG9uc2U6IHJlc3BvbnNlLFxuICAgICAgICBzdWNjZXNzOiBzdWNjZXNzXG4gICAgICB9KTtcbiAgICB9XG4gIH1dKTtcblxuICByZXR1cm4gTG9jYWxCcmlkZ2U7XG59KF9XZWJ2aWV3QnJpZGdlMltcImRlZmF1bHRcIl0pO1xuXG5leHBvcnRzLkxvY2FsQnJpZGdlID0gTG9jYWxCcmlkZ2U7XG4vLyMgc291cmNlTWFwcGluZ1VSTD1kYXRhOmFwcGxpY2F0aW9uL2pzb247Y2hhcnNldD11dGYtODtiYXNlNjQsZXlKMlpYSnphVzl1SWpvekxDSnpiM1Z5WTJWeklqcGJJaTR1THk0dUx5NHVMeTR1TDNOeVl5OWpiM0psTDNkbFluVnBMMHh2WTJGc1FuSnBaR2RsTG1KeWIzZHpaWEl1ZEhNaVhTd2libUZ0WlhNaU9sdGRMQ0p0WVhCd2FXNW5jeUk2SWpzN096czdPenRCUVVGQk96czdPenM3T3pzN096czdPenM3T3pzN096czdPMGxCU1dFc1Z6czdPenM3UVVGSlZDeDFRa0ZCV1N4TlFVRmFMRVZCUVhsQ0xFMUJRWHBDTEVWQlFYZERPMEZCUVVFN08wRkJRVUU3TzBGQlEzQkRPMEZCUTBFc1ZVRkJTeXhOUVVGTUxFZEJRV01zVFVGQlpEdEJRVU5CTEZWQlFVc3NUVUZCVEN4SFFVRmpMRTFCUVdRN08wRkJRMEVzVlVGQlN5eE5RVUZNTEVOQlFWa3NaMEpCUVZvc1EwRkJOa0lzVTBGQk4wSXNSVUZCZDBNc1ZVRkJReXhMUVVGRUxFVkJRV1U3UVVGRGJrUXNWVUZCVFN4UFFVRlBMRWRCUVVjc1MwRkJTeXhEUVVGRExFbEJRWFJDT3p0QlFVTkJMR05CUVZFc1QwRkJUeXhEUVVGRExFOUJRV2hDTzBGQlEwa3NZVUZCU3l4M1FrRkJURHRCUVVOSkxHZENRVUZMTEdOQlFVd3NRMEZCYjBJc1QwRkJjRUk3TzBGQlEwRTdPMEZCUTBvc1lVRkJTeXgxUWtGQlREdEJRVU5KTEdkQ1FVRkxMR0ZCUVV3c1EwRkJiVUlzVDBGQmJrSTdPMEZCUTBFN1FVRk9VanRCUVZGSUxFdEJWa1E3TzBGQlNtOURPMEZCWlhaRE96czdPelJDUVVWUExFa3NSVUZCWXl4TkxFVkJRV2RDTEUwc1JVRkJZenRCUVVGQk96dEJRVVZvUkN4TlFVRkJMRlZCUVZVc1EwRkJReXhaUVVGTE8wRkJRMW9zV1VGQlRTeG5Ra0ZCWjBJc1IwRkJhME1zVFVGQlNTeERRVUZETEZGQlFVd3NRMEZCWXl4SFFVRmtMRU5CUVd0Q0xFbEJRV3hDTEVOQlFYaEVPenRCUVVOQkxGbEJRVWtzWjBKQlFVb3NSVUZCYzBJN1FVRkRiRUlzVlVGQlFTeG5Ra0ZCWjBJc1EwRkJReXhOUVVGcVFpeERRVUYzUWl4dFFrRkJlRUk3TzBGQlEwRXNWVUZCUVN4TlFVRkpMRU5CUVVNc1VVRkJUQ3hYUVVGeFFpeEpRVUZ5UWp0QlFVTklPMEZCUTBvc1QwRk9VeXhGUVUxUUxFdEJRVXNzVDBGT1JTeERRVUZXTzBGQlUwRXNWMEZCU3l4TlFVRk1MRU5CUVZrc1YwRkJXaXhEUVVGM1FqdEJRVU53UWl4UlFVRkJMRTlCUVU4c1JVRkJSU3gxUWtGRVZ6dEJRVVZ3UWl4UlFVRkJMRVZCUVVVc1JVRkJSU3hKUVVablFqdEJRVWR3UWl4UlFVRkJMRTFCUVUwc1JVRkJSU3hOUVVoWk8wRkJTWEJDTEZGQlFVRXNUVUZCVFN4RlFVRkZPMEZCU2xrc1QwRkJlRUk3UVVGTlNEczdPelJDUVVWUExFa3NSVUZCWXl4UkxFVkJRWE5ETzBGQlFVRXNWVUZCZGtJc1QwRkJkVUlzZFVWQlFVb3NTVUZCU1R0QlFVTjRSQ3hYUVVGTExFMUJRVXdzUTBGQldTeFhRVUZhTEVOQlFYZENPMEZCUTNCQ0xGRkJRVUVzVDBGQlR5eEZRVUZGTEhkQ1FVUlhPMEZCUlhCQ0xGRkJRVUVzUlVGQlJTeEZRVUZGTEVsQlJtZENPMEZCUjNCQ0xGRkJRVUVzVVVGQlVTeEZRVUZGTEZGQlNGVTdRVUZKY0VJc1VVRkJRU3hQUVVGUExFVkJRVVU3UVVGS1Z5eFBRVUY0UWp0QlFVMUlPenM3TzBWQkwwTTBRaXd3UWlJc0luTnZkWEpqWlZKdmIzUWlPaUlpZlE9PSIsIlwidXNlIHN0cmljdFwiO1xuXG5PYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgXCJfX2VzTW9kdWxlXCIsIHtcbiAgdmFsdWU6IHRydWVcbn0pO1xuZXhwb3J0cy5XZWJTb2NrZXRCcmlkZ2UgPSB2b2lkIDA7XG5cbnZhciBfV2Vidmlld0JyaWRnZTIgPSBfaW50ZXJvcFJlcXVpcmVEZWZhdWx0KHJlcXVpcmUoXCIuL1dlYnZpZXdCcmlkZ2VcIikpO1xuXG5mdW5jdGlvbiBfaW50ZXJvcFJlcXVpcmVEZWZhdWx0KG9iaikgeyByZXR1cm4gb2JqICYmIG9iai5fX2VzTW9kdWxlID8gb2JqIDogeyBcImRlZmF1bHRcIjogb2JqIH07IH1cblxuZnVuY3Rpb24gX3R5cGVvZihvYmopIHsgaWYgKHR5cGVvZiBTeW1ib2wgPT09IFwiZnVuY3Rpb25cIiAmJiB0eXBlb2YgU3ltYm9sLml0ZXJhdG9yID09PSBcInN5bWJvbFwiKSB7IF90eXBlb2YgPSBmdW5jdGlvbiBfdHlwZW9mKG9iaikgeyByZXR1cm4gdHlwZW9mIG9iajsgfTsgfSBlbHNlIHsgX3R5cGVvZiA9IGZ1bmN0aW9uIF90eXBlb2Yob2JqKSB7IHJldHVybiBvYmogJiYgdHlwZW9mIFN5bWJvbCA9PT0gXCJmdW5jdGlvblwiICYmIG9iai5jb25zdHJ1Y3RvciA9PT0gU3ltYm9sICYmIG9iaiAhPT0gU3ltYm9sLnByb3RvdHlwZSA/IFwic3ltYm9sXCIgOiB0eXBlb2Ygb2JqOyB9OyB9IHJldHVybiBfdHlwZW9mKG9iaik7IH1cblxuZnVuY3Rpb24gX2NsYXNzQ2FsbENoZWNrKGluc3RhbmNlLCBDb25zdHJ1Y3RvcikgeyBpZiAoIShpbnN0YW5jZSBpbnN0YW5jZW9mIENvbnN0cnVjdG9yKSkgeyB0aHJvdyBuZXcgVHlwZUVycm9yKFwiQ2Fubm90IGNhbGwgYSBjbGFzcyBhcyBhIGZ1bmN0aW9uXCIpOyB9IH1cblxuZnVuY3Rpb24gX2RlZmluZVByb3BlcnRpZXModGFyZ2V0LCBwcm9wcykgeyBmb3IgKHZhciBpID0gMDsgaSA8IHByb3BzLmxlbmd0aDsgaSsrKSB7IHZhciBkZXNjcmlwdG9yID0gcHJvcHNbaV07IGRlc2NyaXB0b3IuZW51bWVyYWJsZSA9IGRlc2NyaXB0b3IuZW51bWVyYWJsZSB8fCBmYWxzZTsgZGVzY3JpcHRvci5jb25maWd1cmFibGUgPSB0cnVlOyBpZiAoXCJ2YWx1ZVwiIGluIGRlc2NyaXB0b3IpIGRlc2NyaXB0b3Iud3JpdGFibGUgPSB0cnVlOyBPYmplY3QuZGVmaW5lUHJvcGVydHkodGFyZ2V0LCBkZXNjcmlwdG9yLmtleSwgZGVzY3JpcHRvcik7IH0gfVxuXG5mdW5jdGlvbiBfY3JlYXRlQ2xhc3MoQ29uc3RydWN0b3IsIHByb3RvUHJvcHMsIHN0YXRpY1Byb3BzKSB7IGlmIChwcm90b1Byb3BzKSBfZGVmaW5lUHJvcGVydGllcyhDb25zdHJ1Y3Rvci5wcm90b3R5cGUsIHByb3RvUHJvcHMpOyBpZiAoc3RhdGljUHJvcHMpIF9kZWZpbmVQcm9wZXJ0aWVzKENvbnN0cnVjdG9yLCBzdGF0aWNQcm9wcyk7IHJldHVybiBDb25zdHJ1Y3RvcjsgfVxuXG5mdW5jdGlvbiBfcG9zc2libGVDb25zdHJ1Y3RvclJldHVybihzZWxmLCBjYWxsKSB7IGlmIChjYWxsICYmIChfdHlwZW9mKGNhbGwpID09PSBcIm9iamVjdFwiIHx8IHR5cGVvZiBjYWxsID09PSBcImZ1bmN0aW9uXCIpKSB7IHJldHVybiBjYWxsOyB9IHJldHVybiBfYXNzZXJ0VGhpc0luaXRpYWxpemVkKHNlbGYpOyB9XG5cbmZ1bmN0aW9uIF9hc3NlcnRUaGlzSW5pdGlhbGl6ZWQoc2VsZikgeyBpZiAoc2VsZiA9PT0gdm9pZCAwKSB7IHRocm93IG5ldyBSZWZlcmVuY2VFcnJvcihcInRoaXMgaGFzbid0IGJlZW4gaW5pdGlhbGlzZWQgLSBzdXBlcigpIGhhc24ndCBiZWVuIGNhbGxlZFwiKTsgfSByZXR1cm4gc2VsZjsgfVxuXG5mdW5jdGlvbiBfZ2V0UHJvdG90eXBlT2YobykgeyBfZ2V0UHJvdG90eXBlT2YgPSBPYmplY3Quc2V0UHJvdG90eXBlT2YgPyBPYmplY3QuZ2V0UHJvdG90eXBlT2YgOiBmdW5jdGlvbiBfZ2V0UHJvdG90eXBlT2YobykgeyByZXR1cm4gby5fX3Byb3RvX18gfHwgT2JqZWN0LmdldFByb3RvdHlwZU9mKG8pOyB9OyByZXR1cm4gX2dldFByb3RvdHlwZU9mKG8pOyB9XG5cbmZ1bmN0aW9uIF9pbmhlcml0cyhzdWJDbGFzcywgc3VwZXJDbGFzcykgeyBpZiAodHlwZW9mIHN1cGVyQ2xhc3MgIT09IFwiZnVuY3Rpb25cIiAmJiBzdXBlckNsYXNzICE9PSBudWxsKSB7IHRocm93IG5ldyBUeXBlRXJyb3IoXCJTdXBlciBleHByZXNzaW9uIG11c3QgZWl0aGVyIGJlIG51bGwgb3IgYSBmdW5jdGlvblwiKTsgfSBzdWJDbGFzcy5wcm90b3R5cGUgPSBPYmplY3QuY3JlYXRlKHN1cGVyQ2xhc3MgJiYgc3VwZXJDbGFzcy5wcm90b3R5cGUsIHsgY29uc3RydWN0b3I6IHsgdmFsdWU6IHN1YkNsYXNzLCB3cml0YWJsZTogdHJ1ZSwgY29uZmlndXJhYmxlOiB0cnVlIH0gfSk7IGlmIChzdXBlckNsYXNzKSBfc2V0UHJvdG90eXBlT2Yoc3ViQ2xhc3MsIHN1cGVyQ2xhc3MpOyB9XG5cbmZ1bmN0aW9uIF9zZXRQcm90b3R5cGVPZihvLCBwKSB7IF9zZXRQcm90b3R5cGVPZiA9IE9iamVjdC5zZXRQcm90b3R5cGVPZiB8fCBmdW5jdGlvbiBfc2V0UHJvdG90eXBlT2YobywgcCkgeyBvLl9fcHJvdG9fXyA9IHA7IHJldHVybiBvOyB9OyByZXR1cm4gX3NldFByb3RvdHlwZU9mKG8sIHApOyB9XG5cbnZhciBXZWJTb2NrZXRCcmlkZ2UgPVxuLyojX19QVVJFX18qL1xuZnVuY3Rpb24gKF9XZWJ2aWV3QnJpZGdlKSB7XG4gIF9pbmhlcml0cyhXZWJTb2NrZXRCcmlkZ2UsIF9XZWJ2aWV3QnJpZGdlKTtcblxuICBmdW5jdGlvbiBXZWJTb2NrZXRCcmlkZ2Uod3MpIHtcbiAgICB2YXIgX3RoaXM7XG5cbiAgICBfY2xhc3NDYWxsQ2hlY2sodGhpcywgV2ViU29ja2V0QnJpZGdlKTtcblxuICAgIF90aGlzID0gX3Bvc3NpYmxlQ29uc3RydWN0b3JSZXR1cm4odGhpcywgX2dldFByb3RvdHlwZU9mKFdlYlNvY2tldEJyaWRnZSkuY2FsbCh0aGlzKSk7XG4gICAgX3RoaXMud3MgPSB3cztcblxuICAgIF90aGlzLndzLmFkZEV2ZW50TGlzdGVuZXIoXCJtZXNzYWdlXCIsIGZ1bmN0aW9uIChldmVudCkge1xuICAgICAgdmFyIG1lc3NhZ2UgPSBKU09OLnBhcnNlKGV2ZW50LmRhdGEpO1xuXG4gICAgICBzd2l0Y2ggKG1lc3NhZ2UuY29tbWFuZCkge1xuICAgICAgICBjYXNlIFwiV2ViVmlld0JyaWRnZTpyZXNwb25zZVwiOlxuICAgICAgICAgIF90aGlzLmhhbmRsZVJlc3BvbnNlKG1lc3NhZ2UpO1xuXG4gICAgICAgICAgYnJlYWs7XG5cbiAgICAgICAgY2FzZSBcIldlYlZpZXdCcmlkZ2U6cmVxdWVzdFwiOlxuICAgICAgICAgIF90aGlzLmhhbmRsZVJlcXVlc3QobWVzc2FnZSk7XG5cbiAgICAgICAgICBicmVhaztcbiAgICAgIH1cbiAgICB9KTtcblxuICAgIHJldHVybiBfdGhpcztcbiAgfVxuXG4gIF9jcmVhdGVDbGFzcyhXZWJTb2NrZXRCcmlkZ2UsIFt7XG4gICAga2V5OiBcInJlcXVlc3RcIixcbiAgICB2YWx1ZTogZnVuY3Rpb24gcmVxdWVzdChndWlkLCBtZXRob2QsIHBhcmFtcykge1xuICAgICAgdmFyIF90aGlzMiA9IHRoaXM7XG5cbiAgICAgIHNldFRpbWVvdXQoZnVuY3Rpb24gKCkge1xuICAgICAgICB2YXIgcHJvbWlzZUNhbGxiYWNrcyA9IF90aGlzMi5wcm9taXNlcy5nZXQoZ3VpZCk7XG5cbiAgICAgICAgaWYgKHByb21pc2VDYWxsYmFja3MpIHtcbiAgICAgICAgICBwcm9taXNlQ2FsbGJhY2tzLnJlamVjdChcIlJlcXVlc3QgdGltZWQgb3V0XCIpO1xuXG4gICAgICAgICAgX3RoaXMyLnByb21pc2VzW1wiZGVsZXRlXCJdKGd1aWQpO1xuICAgICAgICB9XG4gICAgICB9LCB0aGlzLnRpbWVvdXQpO1xuICAgICAgdmFyIHJlcXVlc3RCb2R5ID0ge1xuICAgICAgICBjb21tYW5kOiBcIldlYlZpZXdCcmlkZ2U6cmVxdWVzdFwiLFxuICAgICAgICBpZDogZ3VpZCxcbiAgICAgICAgbWV0aG9kOiBtZXRob2QsXG4gICAgICAgIHBhcmFtczogcGFyYW1zXG4gICAgICB9O1xuICAgICAgdGhpcy53cy5zZW5kKEpTT04uc3RyaW5naWZ5KHJlcXVlc3RCb2R5KSk7XG4gICAgfVxuICB9LCB7XG4gICAga2V5OiBcInJlc3BvbmRcIixcbiAgICB2YWx1ZTogZnVuY3Rpb24gcmVzcG9uZChndWlkLCByZXNwb25zZSkge1xuICAgICAgdmFyIHN1Y2Nlc3MgPSBhcmd1bWVudHMubGVuZ3RoID4gMiAmJiBhcmd1bWVudHNbMl0gIT09IHVuZGVmaW5lZCA/IGFyZ3VtZW50c1syXSA6IHRydWU7XG4gICAgICB2YXIgcmVzcG9uc2VCb2R5ID0ge1xuICAgICAgICBjb21tYW5kOiBcIldlYlZpZXdCcmlkZ2U6cmVzcG9uc2VcIixcbiAgICAgICAgaWQ6IGd1aWQsXG4gICAgICAgIHJlc3BvbnNlOiByZXNwb25zZSxcbiAgICAgICAgc3VjY2Vzczogc3VjY2Vzc1xuICAgICAgfTtcbiAgICAgIHRoaXMud3Muc2VuZChKU09OLnN0cmluZ2lmeShyZXNwb25zZUJvZHkpKTtcbiAgICB9XG4gIH1dKTtcblxuICByZXR1cm4gV2ViU29ja2V0QnJpZGdlO1xufShfV2Vidmlld0JyaWRnZTJbXCJkZWZhdWx0XCJdKTtcblxuZXhwb3J0cy5XZWJTb2NrZXRCcmlkZ2UgPSBXZWJTb2NrZXRCcmlkZ2U7XG4vLyMgc291cmNlTWFwcGluZ1VSTD1kYXRhOmFwcGxpY2F0aW9uL2pzb247Y2hhcnNldD11dGYtODtiYXNlNjQsZXlKMlpYSnphVzl1SWpvekxDSnpiM1Z5WTJWeklqcGJJaTR1THk0dUx5NHVMeTR1TDNOeVl5OWpiM0psTDNkbFluVnBMMWRsWWxOdlkydGxkRUp5YVdSblpTNWljbTkzYzJWeUxuUnpJbDBzSW01aGJXVnpJanBiWFN3aWJXRndjR2x1WjNNaU9pSTdPenM3T3pzN1FVRkJRVHM3T3pzN096czdPenM3T3pzN096czdPenM3T3p0SlFVbGhMR1U3T3pzN08wRkJSMVFzTWtKQlFWa3NSVUZCV2l4RlFVRjVRanRCUVVGQk96dEJRVUZCT3p0QlFVTnlRanRCUVVOQkxGVkJRVXNzUlVGQlRDeEhRVUZWTEVWQlFWWTdPMEZCUTBFc1ZVRkJTeXhGUVVGTUxFTkJRVkVzWjBKQlFWSXNRMEZCZVVJc1UwRkJla0lzUlVGQmIwTXNWVUZCUXl4TFFVRkVMRVZCUVZVN1FVRkRNVU1zVlVGQlRTeFBRVUZQTEVkQlFWRXNTVUZCU1N4RFFVRkRMRXRCUVV3c1EwRkJWeXhMUVVGTExFTkJRVU1zU1VGQmFrSXNRMEZCY2tJN08wRkJRMEVzWTBGQlVTeFBRVUZQTEVOQlFVTXNUMEZCYUVJN1FVRkRTU3hoUVVGTExIZENRVUZNTzBGQlEwa3NaMEpCUVVzc1kwRkJUQ3hEUVVGdlFpeFBRVUZ3UWpzN1FVRkRRVHM3UVVGRFNpeGhRVUZMTEhWQ1FVRk1PMEZCUTBrc1owSkJRVXNzWVVGQlRDeERRVUZ0UWl4UFFVRnVRanM3UVVGRFFUdEJRVTVTTzBGQlVVZ3NTMEZXUkRzN1FVRkljVUk3UVVGamVFSTdPenM3TkVKQlJVOHNTU3hGUVVGakxFMHNSVUZCWjBJc1RTeEZRVUZqTzBGQlFVRTdPMEZCUldoRUxFMUJRVUVzVlVGQlZTeERRVUZETEZsQlFVczdRVUZEV2l4WlFVRk5MR2RDUVVGblFpeEhRVUZyUXl4TlFVRkpMRU5CUVVNc1VVRkJUQ3hEUVVGakxFZEJRV1FzUTBGQmEwSXNTVUZCYkVJc1EwRkJlRVE3TzBGQlEwRXNXVUZCU1N4blFrRkJTaXhGUVVGelFqdEJRVU5zUWl4VlFVRkJMR2RDUVVGblFpeERRVUZETEUxQlFXcENMRU5CUVhkQ0xHMUNRVUY0UWpzN1FVRkRRU3hWUVVGQkxFMUJRVWtzUTBGQlF5eFJRVUZNTEZkQlFYRkNMRWxCUVhKQ08wRkJRMGc3UVVGRFNpeFBRVTVUTEVWQlRWQXNTMEZCU3l4UFFVNUZMRU5CUVZZN1FVRlRRU3hWUVVGTkxGZEJRVmNzUjBGQlVUdEJRVU55UWl4UlFVRkJMRTlCUVU4c1JVRkJSU3gxUWtGRVdUdEJRVVZ5UWl4UlFVRkJMRVZCUVVVc1JVRkJSU3hKUVVacFFqdEJRVWR5UWl4UlFVRkJMRTFCUVUwc1JVRkJSU3hOUVVoaE8wRkJTWEpDTEZGQlFVRXNUVUZCVFN4RlFVRkZPMEZCU21Fc1QwRkJla0k3UVVGUFFTeFhRVUZMTEVWQlFVd3NRMEZCVVN4SlFVRlNMRU5CUVdFc1NVRkJTU3hEUVVGRExGTkJRVXdzUTBGQlpTeFhRVUZtTEVOQlFXSTdRVUZEU0RzN096UkNRVVZQTEVrc1JVRkJZeXhSTEVWQlFYTkRPMEZCUVVFc1ZVRkJka0lzVDBGQmRVSXNkVVZCUVVvc1NVRkJTVHRCUVVONFJDeFZRVUZOTEZsQlFWa3NSMEZCVVR0QlFVTjBRaXhSUVVGQkxFOUJRVThzUlVGQlJTeDNRa0ZFWVR0QlFVVjBRaXhSUVVGQkxFVkJRVVVzUlVGQlJTeEpRVVpyUWp0QlFVZDBRaXhSUVVGQkxGRkJRVkVzUlVGQlJTeFJRVWhaTzBGQlNYUkNMRkZCUVVFc1QwRkJUeXhGUVVGRk8wRkJTbUVzVDBGQk1VSTdRVUZQUVN4WFFVRkxMRVZCUVV3c1EwRkJVU3hKUVVGU0xFTkJRV0VzU1VGQlNTeERRVUZETEZOQlFVd3NRMEZCWlN4WlFVRm1MRU5CUVdJN1FVRkRTRHM3T3p0RlFXcEVaME1zTUVJaUxDSnpiM1Z5WTJWU2IyOTBJam9pSW4wPSIsIlwidXNlIHN0cmljdFwiO1xuXG5mdW5jdGlvbiBfdHlwZW9mKG9iaikgeyBpZiAodHlwZW9mIFN5bWJvbCA9PT0gXCJmdW5jdGlvblwiICYmIHR5cGVvZiBTeW1ib2wuaXRlcmF0b3IgPT09IFwic3ltYm9sXCIpIHsgX3R5cGVvZiA9IGZ1bmN0aW9uIF90eXBlb2Yob2JqKSB7IHJldHVybiB0eXBlb2Ygb2JqOyB9OyB9IGVsc2UgeyBfdHlwZW9mID0gZnVuY3Rpb24gX3R5cGVvZihvYmopIHsgcmV0dXJuIG9iaiAmJiB0eXBlb2YgU3ltYm9sID09PSBcImZ1bmN0aW9uXCIgJiYgb2JqLmNvbnN0cnVjdG9yID09PSBTeW1ib2wgJiYgb2JqICE9PSBTeW1ib2wucHJvdG90eXBlID8gXCJzeW1ib2xcIiA6IHR5cGVvZiBvYmo7IH07IH0gcmV0dXJuIF90eXBlb2Yob2JqKTsgfVxuXG5PYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgXCJfX2VzTW9kdWxlXCIsIHtcbiAgdmFsdWU6IHRydWVcbn0pO1xuZXhwb3J0c1tcImRlZmF1bHRcIl0gPSB2b2lkIDA7XG5cbnZhciBfUHJvbWlzZUluZm8gPSBfaW50ZXJvcFJlcXVpcmVEZWZhdWx0KHJlcXVpcmUoXCIuLi90eXBlcy9Qcm9taXNlSW5mb1wiKSk7XG5cbnZhciBHdWlkID0gX2ludGVyb3BSZXF1aXJlV2lsZGNhcmQocmVxdWlyZShcIi4uL2hlbHBlcnMvR3VpZFwiKSk7XG5cbmZ1bmN0aW9uIF9nZXRSZXF1aXJlV2lsZGNhcmRDYWNoZSgpIHsgaWYgKHR5cGVvZiBXZWFrTWFwICE9PSBcImZ1bmN0aW9uXCIpIHJldHVybiBudWxsOyB2YXIgY2FjaGUgPSBuZXcgV2Vha01hcCgpOyBfZ2V0UmVxdWlyZVdpbGRjYXJkQ2FjaGUgPSBmdW5jdGlvbiBfZ2V0UmVxdWlyZVdpbGRjYXJkQ2FjaGUoKSB7IHJldHVybiBjYWNoZTsgfTsgcmV0dXJuIGNhY2hlOyB9XG5cbmZ1bmN0aW9uIF9pbnRlcm9wUmVxdWlyZVdpbGRjYXJkKG9iaikgeyBpZiAob2JqICYmIG9iai5fX2VzTW9kdWxlKSB7IHJldHVybiBvYmo7IH0gaWYgKG9iaiA9PT0gbnVsbCB8fCBfdHlwZW9mKG9iaikgIT09IFwib2JqZWN0XCIgJiYgdHlwZW9mIG9iaiAhPT0gXCJmdW5jdGlvblwiKSB7IHJldHVybiB7IFwiZGVmYXVsdFwiOiBvYmogfTsgfSB2YXIgY2FjaGUgPSBfZ2V0UmVxdWlyZVdpbGRjYXJkQ2FjaGUoKTsgaWYgKGNhY2hlICYmIGNhY2hlLmhhcyhvYmopKSB7IHJldHVybiBjYWNoZS5nZXQob2JqKTsgfSB2YXIgbmV3T2JqID0ge307IHZhciBoYXNQcm9wZXJ0eURlc2NyaXB0b3IgPSBPYmplY3QuZGVmaW5lUHJvcGVydHkgJiYgT2JqZWN0LmdldE93blByb3BlcnR5RGVzY3JpcHRvcjsgZm9yICh2YXIga2V5IGluIG9iaikgeyBpZiAoT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eS5jYWxsKG9iaiwga2V5KSkgeyB2YXIgZGVzYyA9IGhhc1Byb3BlcnR5RGVzY3JpcHRvciA/IE9iamVjdC5nZXRPd25Qcm9wZXJ0eURlc2NyaXB0b3Iob2JqLCBrZXkpIDogbnVsbDsgaWYgKGRlc2MgJiYgKGRlc2MuZ2V0IHx8IGRlc2Muc2V0KSkgeyBPYmplY3QuZGVmaW5lUHJvcGVydHkobmV3T2JqLCBrZXksIGRlc2MpOyB9IGVsc2UgeyBuZXdPYmpba2V5XSA9IG9ialtrZXldOyB9IH0gfSBuZXdPYmpbXCJkZWZhdWx0XCJdID0gb2JqOyBpZiAoY2FjaGUpIHsgY2FjaGUuc2V0KG9iaiwgbmV3T2JqKTsgfSByZXR1cm4gbmV3T2JqOyB9XG5cbmZ1bmN0aW9uIF9pbnRlcm9wUmVxdWlyZURlZmF1bHQob2JqKSB7IHJldHVybiBvYmogJiYgb2JqLl9fZXNNb2R1bGUgPyBvYmogOiB7IFwiZGVmYXVsdFwiOiBvYmogfTsgfVxuXG5mdW5jdGlvbiBfY2xhc3NDYWxsQ2hlY2soaW5zdGFuY2UsIENvbnN0cnVjdG9yKSB7IGlmICghKGluc3RhbmNlIGluc3RhbmNlb2YgQ29uc3RydWN0b3IpKSB7IHRocm93IG5ldyBUeXBlRXJyb3IoXCJDYW5ub3QgY2FsbCBhIGNsYXNzIGFzIGEgZnVuY3Rpb25cIik7IH0gfVxuXG5mdW5jdGlvbiBfZGVmaW5lUHJvcGVydGllcyh0YXJnZXQsIHByb3BzKSB7IGZvciAodmFyIGkgPSAwOyBpIDwgcHJvcHMubGVuZ3RoOyBpKyspIHsgdmFyIGRlc2NyaXB0b3IgPSBwcm9wc1tpXTsgZGVzY3JpcHRvci5lbnVtZXJhYmxlID0gZGVzY3JpcHRvci5lbnVtZXJhYmxlIHx8IGZhbHNlOyBkZXNjcmlwdG9yLmNvbmZpZ3VyYWJsZSA9IHRydWU7IGlmIChcInZhbHVlXCIgaW4gZGVzY3JpcHRvcikgZGVzY3JpcHRvci53cml0YWJsZSA9IHRydWU7IE9iamVjdC5kZWZpbmVQcm9wZXJ0eSh0YXJnZXQsIGRlc2NyaXB0b3Iua2V5LCBkZXNjcmlwdG9yKTsgfSB9XG5cbmZ1bmN0aW9uIF9jcmVhdGVDbGFzcyhDb25zdHJ1Y3RvciwgcHJvdG9Qcm9wcywgc3RhdGljUHJvcHMpIHsgaWYgKHByb3RvUHJvcHMpIF9kZWZpbmVQcm9wZXJ0aWVzKENvbnN0cnVjdG9yLnByb3RvdHlwZSwgcHJvdG9Qcm9wcyk7IGlmIChzdGF0aWNQcm9wcykgX2RlZmluZVByb3BlcnRpZXMoQ29uc3RydWN0b3IsIHN0YXRpY1Byb3BzKTsgcmV0dXJuIENvbnN0cnVjdG9yOyB9XG5cbnZhciBfX2F3YWl0ZXIgPSB2b2lkIDAgJiYgKHZvaWQgMCkuX19hd2FpdGVyIHx8IGZ1bmN0aW9uICh0aGlzQXJnLCBfYXJndW1lbnRzLCBQLCBnZW5lcmF0b3IpIHtcbiAgZnVuY3Rpb24gYWRvcHQodmFsdWUpIHtcbiAgICByZXR1cm4gdmFsdWUgaW5zdGFuY2VvZiBQID8gdmFsdWUgOiBuZXcgUChmdW5jdGlvbiAocmVzb2x2ZSkge1xuICAgICAgcmVzb2x2ZSh2YWx1ZSk7XG4gICAgfSk7XG4gIH1cblxuICByZXR1cm4gbmV3IChQIHx8IChQID0gUHJvbWlzZSkpKGZ1bmN0aW9uIChyZXNvbHZlLCByZWplY3QpIHtcbiAgICBmdW5jdGlvbiBmdWxmaWxsZWQodmFsdWUpIHtcbiAgICAgIHRyeSB7XG4gICAgICAgIHN0ZXAoZ2VuZXJhdG9yLm5leHQodmFsdWUpKTtcbiAgICAgIH0gY2F0Y2ggKGUpIHtcbiAgICAgICAgcmVqZWN0KGUpO1xuICAgICAgfVxuICAgIH1cblxuICAgIGZ1bmN0aW9uIHJlamVjdGVkKHZhbHVlKSB7XG4gICAgICB0cnkge1xuICAgICAgICBzdGVwKGdlbmVyYXRvcltcInRocm93XCJdKHZhbHVlKSk7XG4gICAgICB9IGNhdGNoIChlKSB7XG4gICAgICAgIHJlamVjdChlKTtcbiAgICAgIH1cbiAgICB9XG5cbiAgICBmdW5jdGlvbiBzdGVwKHJlc3VsdCkge1xuICAgICAgcmVzdWx0LmRvbmUgPyByZXNvbHZlKHJlc3VsdC52YWx1ZSkgOiBhZG9wdChyZXN1bHQudmFsdWUpLnRoZW4oZnVsZmlsbGVkLCByZWplY3RlZCk7XG4gICAgfVxuXG4gICAgc3RlcCgoZ2VuZXJhdG9yID0gZ2VuZXJhdG9yLmFwcGx5KHRoaXNBcmcsIF9hcmd1bWVudHMgfHwgW10pKS5uZXh0KCkpO1xuICB9KTtcbn07XG5cbnZhciBXZWJ2aWV3QnJpZGdlID1cbi8qI19fUFVSRV9fKi9cbmZ1bmN0aW9uICgpIHtcbiAgZnVuY3Rpb24gV2Vidmlld0JyaWRnZSgpIHtcbiAgICBfY2xhc3NDYWxsQ2hlY2sodGhpcywgV2Vidmlld0JyaWRnZSk7XG5cbiAgICB0aGlzLnRpbWVvdXQgPSAzNjAwMDAwO1xuICAgIHRoaXMucHJvbWlzZXMgPSBuZXcgTWFwKCk7XG4gICAgdGhpcy5mdW5jdGlvbnMgPSBuZXcgTWFwKCk7XG4gICAgdGhpcy5hZGQoe1xuICAgICAgZnVuYzogdGhpcy5sb2NhbHMsXG4gICAgICB0aGlzQXJnOiB0aGlzLFxuICAgICAgbmFtZTogXCJXZWJWaWV3QnJpZGdlOmxpc3RcIlxuICAgIH0pO1xuICB9XG5cbiAgX2NyZWF0ZUNsYXNzKFdlYnZpZXdCcmlkZ2UsIFt7XG4gICAga2V5OiBcInNldFRpbWVvdXRcIixcbiAgICB2YWx1ZTogZnVuY3Rpb24gc2V0VGltZW91dCh0aW1lb3V0KSB7XG4gICAgICB0aGlzLnRpbWVvdXQgPSB0aW1lb3V0O1xuICAgIH1cbiAgfSwge1xuICAgIGtleTogXCJhZGRcIixcbiAgICB2YWx1ZTogZnVuY3Rpb24gYWRkKG1ldGhvZCkge1xuICAgICAgdGhpcy5mdW5jdGlvbnMuc2V0KG1ldGhvZC5uYW1lID8gbWV0aG9kLm5hbWUgOiBtZXRob2QuZnVuYy5uYW1lLCBtZXRob2QpO1xuICAgIH1cbiAgfSwge1xuICAgIGtleTogXCJyZW1vdmVcIixcbiAgICB2YWx1ZTogZnVuY3Rpb24gcmVtb3ZlKG1ldGhvZCkge1xuICAgICAgdGhpcy5mdW5jdGlvbnNbXCJkZWxldGVcIl0obWV0aG9kLm5hbWUgPyBtZXRob2QubmFtZSA6IG1ldGhvZC5mdW5jLm5hbWUpO1xuICAgIH1cbiAgfSwge1xuICAgIGtleTogXCJsb2NhbHNcIixcbiAgICB2YWx1ZTogZnVuY3Rpb24gbG9jYWxzKCkge1xuICAgICAgcmV0dXJuIEFycmF5LmZyb20odGhpcy5mdW5jdGlvbnMua2V5cygpKTtcbiAgICB9XG4gIH0sIHtcbiAgICBrZXk6IFwicmVtb3RlXCIsXG4gICAgdmFsdWU6IGZ1bmN0aW9uIHJlbW90ZSgpIHtcbiAgICAgIHJldHVybiB0aGlzLmludm9rZShcIldlYlZpZXdCcmlkZ2U6bGlzdFwiKTtcbiAgICB9XG4gIH0sIHtcbiAgICBrZXk6IFwiaW52b2tlXCIsXG4gICAgdmFsdWU6IGZ1bmN0aW9uIGludm9rZShtZXRob2QsIHBhcmFtcykge1xuICAgICAgdmFyIF90aGlzID0gdGhpcztcblxuICAgICAgdmFyIGlkID0gR3VpZC5uZXdHdWlkKCk7XG4gICAgICB2YXIgcHJvbWlzZSA9IG5ldyBQcm9taXNlKGZ1bmN0aW9uIChyZXNvbHZlLCByZWplY3QpIHtcbiAgICAgICAgX3RoaXMucHJvbWlzZXMuc2V0KGlkLCBuZXcgX1Byb21pc2VJbmZvW1wiZGVmYXVsdFwiXShyZXNvbHZlLCByZWplY3QpKTtcbiAgICAgIH0pO1xuICAgICAgdGhpcy5yZXF1ZXN0KGlkLCBtZXRob2QsIHBhcmFtcyk7XG4gICAgICByZXR1cm4gcHJvbWlzZTtcbiAgICB9XG4gIH0sIHtcbiAgICBrZXk6IFwiaGFuZGxlUmVzcG9uc2VcIixcbiAgICB2YWx1ZTogZnVuY3Rpb24gaGFuZGxlUmVzcG9uc2UobWVzc2FnZSkge1xuICAgICAgdmFyIHByb21pc2VDYWxsYmFja3MgPSB0aGlzLnByb21pc2VzLmdldChtZXNzYWdlLmlkKTtcblxuICAgICAgaWYgKHByb21pc2VDYWxsYmFja3MpIHtcbiAgICAgICAgaWYgKG1lc3NhZ2Uuc3VjY2Vzcykge1xuICAgICAgICAgIHByb21pc2VDYWxsYmFja3MucmVzb2x2ZShtZXNzYWdlLnJlc3BvbnNlKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICBwcm9taXNlQ2FsbGJhY2tzLnJlamVjdChtZXNzYWdlLnJlc3BvbnNlKTtcbiAgICAgICAgfVxuXG4gICAgICAgIHRoaXMucHJvbWlzZXNbXCJkZWxldGVcIl0obWVzc2FnZS5pZCk7XG4gICAgICB9XG4gICAgfVxuICB9LCB7XG4gICAga2V5OiBcImhhbmRsZVJlcXVlc3RcIixcbiAgICB2YWx1ZTogZnVuY3Rpb24gaGFuZGxlUmVxdWVzdChtZXNzYWdlKSB7XG4gICAgICByZXR1cm4gX19hd2FpdGVyKHRoaXMsIHZvaWQgMCwgdm9pZCAwLFxuICAgICAgLyojX19QVVJFX18qL1xuICAgICAgcmVnZW5lcmF0b3JSdW50aW1lLm1hcmsoZnVuY3Rpb24gX2NhbGxlZSgpIHtcbiAgICAgICAgdmFyIG1ldGhvZCwgZnVuYywgdGhpc0FyZywgcmVzcG9uc2U7XG4gICAgICAgIHJldHVybiByZWdlbmVyYXRvclJ1bnRpbWUud3JhcChmdW5jdGlvbiBfY2FsbGVlJChfY29udGV4dCkge1xuICAgICAgICAgIHdoaWxlICgxKSB7XG4gICAgICAgICAgICBzd2l0Y2ggKF9jb250ZXh0LnByZXYgPSBfY29udGV4dC5uZXh0KSB7XG4gICAgICAgICAgICAgIGNhc2UgMDpcbiAgICAgICAgICAgICAgICBtZXRob2QgPSB0aGlzLmZ1bmN0aW9ucy5nZXQobWVzc2FnZS5tZXRob2QpO1xuXG4gICAgICAgICAgICAgICAgaWYgKCFtZXRob2QpIHtcbiAgICAgICAgICAgICAgICAgIF9jb250ZXh0Lm5leHQgPSAxNjtcbiAgICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgIGZ1bmMgPSBtZXRob2QuZnVuYztcbiAgICAgICAgICAgICAgICB0aGlzQXJnID0gbWV0aG9kLnRoaXNBcmc7XG4gICAgICAgICAgICAgICAgX2NvbnRleHQucHJldiA9IDQ7XG4gICAgICAgICAgICAgICAgcmVzcG9uc2UgPSBmdW5jLmFwcGx5KHRoaXNBcmcsIG1lc3NhZ2UucGFyYW1zKTtcblxuICAgICAgICAgICAgICAgIGlmICghKHR5cGVvZiByZXNwb25zZS50aGVuID09PSBcImZ1bmN0aW9uXCIpKSB7XG4gICAgICAgICAgICAgICAgICBfY29udGV4dC5uZXh0ID0gMTA7XG4gICAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICBfY29udGV4dC5uZXh0ID0gOTtcbiAgICAgICAgICAgICAgICByZXR1cm4gcmVzcG9uc2U7XG5cbiAgICAgICAgICAgICAgY2FzZSA5OlxuICAgICAgICAgICAgICAgIHJlc3BvbnNlID0gX2NvbnRleHQuc2VudDtcblxuICAgICAgICAgICAgICBjYXNlIDEwOlxuICAgICAgICAgICAgICAgIHRoaXMucmVzcG9uZChtZXNzYWdlLmlkLCByZXNwb25zZSk7XG4gICAgICAgICAgICAgICAgX2NvbnRleHQubmV4dCA9IDE2O1xuICAgICAgICAgICAgICAgIGJyZWFrO1xuXG4gICAgICAgICAgICAgIGNhc2UgMTM6XG4gICAgICAgICAgICAgICAgX2NvbnRleHQucHJldiA9IDEzO1xuICAgICAgICAgICAgICAgIF9jb250ZXh0LnQwID0gX2NvbnRleHRbXCJjYXRjaFwiXSg0KTtcbiAgICAgICAgICAgICAgICB0aGlzLnJlc3BvbmQobWVzc2FnZS5pZCwgX2NvbnRleHQudDAsIGZhbHNlKTtcblxuICAgICAgICAgICAgICBjYXNlIDE2OlxuICAgICAgICAgICAgICBjYXNlIFwiZW5kXCI6XG4gICAgICAgICAgICAgICAgcmV0dXJuIF9jb250ZXh0LnN0b3AoKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9XG4gICAgICAgIH0sIF9jYWxsZWUsIHRoaXMsIFtbNCwgMTNdXSk7XG4gICAgICB9KSk7XG4gICAgfVxuICB9XSk7XG5cbiAgcmV0dXJuIFdlYnZpZXdCcmlkZ2U7XG59KCk7XG5cbmV4cG9ydHNbXCJkZWZhdWx0XCJdID0gV2Vidmlld0JyaWRnZTtcbi8vIyBzb3VyY2VNYXBwaW5nVVJMPWRhdGE6YXBwbGljYXRpb24vanNvbjtjaGFyc2V0PXV0Zi04O2Jhc2U2NCxleUoyWlhKemFXOXVJam96TENKemIzVnlZMlZ6SWpwYklpNHVMeTR1THk0dUx5NHVMM055WXk5amIzSmxMM2RsWW5WcEwxZGxZblpwWlhkQ2NtbGtaMlV1ZEhNaVhTd2libUZ0WlhNaU9sdGRMQ0p0WVhCd2FXNW5jeUk2SWpzN096czdPenM3TzBGQlFVRTdPMEZCUTBFN096czdPenM3T3pzN096czdPenM3T3pzN096czdPenM3T3pzN096czdPenM3T3pzN096czdPenM3T3pzN1NVRnhRamhDTEdFN096dEJRVkV4UWl3eVFrRkJRVHRCUVVGQk96dEJRVVpWTEZOQlFVRXNUMEZCUVN4SFFVRnJRaXhQUVVGc1FqdEJRVWRPTEZOQlFVc3NVVUZCVEN4SFFVRm5RaXhKUVVGSkxFZEJRVW9zUlVGQmFFSTdRVUZEUVN4VFFVRkxMRk5CUVV3c1IwRkJhVUlzU1VGQlNTeEhRVUZLTEVWQlFXcENPMEZCUTBFc1UwRkJTeXhIUVVGTUxFTkJRVk03UVVGQlJTeE5RVUZCTEVsQlFVa3NSVUZCUlN4TFFVRkxMRTFCUVdJN1FVRkJjVUlzVFVGQlFTeFBRVUZQTEVWQlFVVXNTVUZCT1VJN1FVRkJiME1zVFVGQlFTeEpRVUZKTEVWQlFVVTdRVUZCTVVNc1MwRkJWRHRCUVVOSU96czdPeXRDUVVWVkxFOHNSVUZCWlR0QlFVTjBRaXhYUVVGTExFOUJRVXdzUjBGQlpTeFBRVUZtTzBGQlEwZzdPenQzUWtGRlJ5eE5MRVZCUVRCQ08wRkJRekZDTEZkQlFVc3NVMEZCVEN4RFFVRmxMRWRCUVdZc1EwRkJiMElzVFVGQlRTeERRVUZETEVsQlFWQXNSMEZCWXl4TlFVRk5MRU5CUVVNc1NVRkJja0lzUjBGQk5FSXNUVUZCVFN4RFFVRkRMRWxCUVZBc1EwRkJXU3hKUVVFMVJDeEZRVUZ0UlN4TlFVRnVSVHRCUVVOSU96czdNa0pCUlUwc1RTeEZRVUV3UWp0QlFVTTNRaXhYUVVGTExGTkJRVXdzVjBGQmRVSXNUVUZCVFN4RFFVRkRMRWxCUVZBc1IwRkJZeXhOUVVGTkxFTkJRVU1zU1VGQmNrSXNSMEZCTkVJc1RVRkJUU3hEUVVGRExFbEJRVkFzUTBGQldTeEpRVUV2UkR0QlFVTklPenM3TmtKQlJVczdRVUZEUml4aFFVRlBMRXRCUVVzc1EwRkJReXhKUVVGT0xFTkJRVmNzUzBGQlN5eFRRVUZNTEVOQlFXVXNTVUZCWml4RlFVRllMRU5CUVZBN1FVRkRTRHM3T3paQ1FVVkxPMEZCUTBZc1lVRkJUeXhMUVVGTExFMUJRVXdzUTBGQldTeHZRa0ZCV2l4RFFVRlFPMEZCUTBnN096c3lRa0ZGVFN4TkxFVkJRV2RDTEUwc1JVRkJZenRCUVVGQk96dEJRVVZxUXl4VlFVRk5MRVZCUVVVc1IwRkJSeXhKUVVGSkxFTkJRVU1zVDBGQlRDeEZRVUZZTzBGQlJVRXNWVUZCVFN4UFFVRlBMRWRCUVVjc1NVRkJTU3hQUVVGS0xFTkJRVmtzVlVGQlF5eFBRVUZFTEVWQlFWVXNUVUZCVml4RlFVRnZRanRCUVVNMVF5eFJRVUZCTEV0QlFVa3NRMEZCUXl4UlFVRk1MRU5CUVdNc1IwRkJaQ3hEUVVGclFpeEZRVUZzUWl4RlFVRnpRaXhKUVVGSkxIVkNRVUZLTEVOQlFXZENMRTlCUVdoQ0xFVkJRWGxDTEUxQlFYcENMRU5CUVhSQ08wRkJRMGdzVDBGR1pTeERRVUZvUWp0QlFVbEJMRmRCUVVzc1QwRkJUQ3hEUVVGaExFVkJRV0lzUlVGQmFVSXNUVUZCYWtJc1JVRkJlVUlzVFVGQmVrSTdRVUZEUVN4aFFVRlBMRTlCUVZBN1FVRkRTRHM3TzIxRFFVVmpMRThzUlVGQldUdEJRVU4yUWl4VlFVRk5MR2RDUVVGblFpeEhRVUZyUXl4TFFVRkxMRkZCUVV3c1EwRkJZeXhIUVVGa0xFTkJRV3RDTEU5QlFVOHNRMEZCUXl4RlFVRXhRaXhEUVVGNFJEczdRVUZGUVN4VlFVRkpMR2RDUVVGS0xFVkJRWE5DTzBGQlEyeENMRmxCUVVrc1QwRkJUeXhEUVVGRExFOUJRVm9zUlVGQmNVSTdRVUZEYWtJc1ZVRkJRU3huUWtGQlowSXNRMEZCUXl4UFFVRnFRaXhEUVVGNVFpeFBRVUZQTEVOQlFVTXNVVUZCYWtNN1FVRkRTQ3hUUVVaRUxFMUJSVTg3UVVGRFNDeFZRVUZCTEdkQ1FVRm5RaXhEUVVGRExFMUJRV3BDTEVOQlFYZENMRTlCUVU4c1EwRkJReXhSUVVGb1F6dEJRVU5JT3p0QlFVVkVMR0ZCUVVzc1VVRkJUQ3hYUVVGeFFpeFBRVUZQTEVOQlFVTXNSVUZCTjBJN1FVRkRTRHRCUVVOS096czdhME5CUlcxQ0xFOHNSVUZCV1RzN096czdPenM3TzBGQlEzUkNMR2RDUVVGQkxFMHNSMEZCZVVNc1MwRkJTeXhUUVVGTUxFTkJRV1VzUjBGQlppeERRVUZ0UWl4UFFVRlBMRU5CUVVNc1RVRkJNMElzUXpzN2NVSkJSVE5ETEUwN096czdPMEZCUTAwc1owSkJRVUVzU1N4SFFVRnBRaXhOUVVGTkxFTkJRVU1zU1R0QlFVTjRRaXhuUWtGQlFTeFBMRWRCUVdVc1RVRkJUU3hEUVVGRExFODdPMEZCUjNCQ0xHZENRVUZCTEZFc1IwRkJaMElzU1VGQlNTeERRVUZETEV0QlFVd3NRMEZCVnl4UFFVRllMRVZCUVc5Q0xFOUJRVThzUTBGQlF5eE5RVUUxUWl4RE96dHpRa0ZGYUVJc1QwRkJUeXhSUVVGUkxFTkJRVU1zU1VGQmFFSXNTMEZCZVVJc1ZUczdPenM3TzBGQlEyUXNkVUpCUVUwc1VVRkJUanM3TzBGQlFWZ3NaMEpCUVVFc1VUczdPMEZCUjBvc2NVSkJRVXNzVDBGQlRDeERRVUZoTEU5QlFVOHNRMEZCUXl4RlFVRnlRaXhGUVVGNVFpeFJRVUY2UWpzN096czdPenRCUVVWQkxIRkNRVUZMTEU5QlFVd3NRMEZCWVN4UFFVRlBMRU5CUVVNc1JVRkJja0lzWlVGQk9FSXNTMEZCT1VJN096czdPenM3T3p0QlFVZFlJaXdpYzI5MWNtTmxVbTl2ZENJNklpSjkiXX0=
