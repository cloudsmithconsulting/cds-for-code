(function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){

},{}],2:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const perf_hooks_1 = require("perf_hooks");
function newGuid() {
    var d = new Date().getTime();
    if (typeof perf_hooks_1.performance !== 'undefined' && typeof perf_hooks_1.performance.now === 'function') {
        d += perf_hooks_1.performance.now();
    }
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
        var r = (d + Math.random() * 16) % 16 | 0;
        d = Math.floor(d / 16);
        return (c === 'x' ? r : (r & 0x3 | 0x8)).toString(16);
    });
}
exports.newGuid = newGuid;
function isGuid(parameter) {
    try {
        const matches = /[0-9A-F]{8}[-]?([0-9A-F]{4}[-]?){3}[0-9A-F]{12}/i.exec(parameter);
        const match = matches && matches.length > 0 ? matches[0] : undefined;
        return !(typeof match === "undefined" || match === null);
    }
    catch (error) {
        return false;
    }
}
exports.isGuid = isGuid;
function trimGuid(id) {
    return (id || '').replace(/{|}/g, '');
}
exports.trimGuid = trimGuid;

},{"perf_hooks":1}],3:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class PromiseInfo {
    constructor(resolve, reject) {
        this.resolve = resolve;
        this.reject = reject;
    }
}
exports.default = PromiseInfo;

},{}],4:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const WebviewBridge_1 = require("./WebviewBridge");
class LocalBridge extends WebviewBridge_1.default {
    constructor(window, vscode) {
        super();
        this.window = window;
        this.vscode = vscode;
        this.window.addEventListener("message", (event) => {
            const message = event.data;
            switch (message.command) {
                case "WebViewBridge:response":
                    this.handleResponse(message);
                    break;
                case "WebViewBridge:request":
                    this.handleRequest(message);
                    break;
            }
        });
    }
    request(guid, method, params) {
        setTimeout(() => {
            const promiseCallbacks = this.promises.get(guid);
            if (promiseCallbacks) {
                promiseCallbacks.reject("Request timed out");
                this.promises.delete(guid);
            }
        }, this.timeout);
        this.vscode.postMessage({
            command: "WebViewBridge:request",
            id: guid,
            method: method,
            params: params
        });
    }
    respond(guid, response, success = true) {
        this.vscode.postMessage({
            command: "WebViewBridge:response",
            id: guid,
            response: response,
            success: success
        });
    }
}
exports.LocalBridge = LocalBridge;

},{"./WebviewBridge":6}],5:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const WebviewBridge_1 = require("./WebviewBridge");
class WebSocketBridge extends WebviewBridge_1.default {
    constructor(ws) {
        super();
        this.ws = ws;
        this.ws.addEventListener("message", (event) => {
            const message = JSON.parse(event.data);
            switch (message.command) {
                case "WebViewBridge:response":
                    this.handleResponse(message);
                    break;
                case "WebViewBridge:request":
                    this.handleRequest(message);
                    break;
            }
        });
    }
    request(guid, method, params) {
        setTimeout(() => {
            const promiseCallbacks = this.promises.get(guid);
            if (promiseCallbacks) {
                promiseCallbacks.reject("Request timed out");
                this.promises.delete(guid);
            }
        }, this.timeout);
        const requestBody = {
            command: "WebViewBridge:request",
            id: guid,
            method: method,
            params: params
        };
        this.ws.send(JSON.stringify(requestBody));
    }
    respond(guid, response, success = true) {
        const responseBody = {
            command: "WebViewBridge:response",
            id: guid,
            response: response,
            success: success
        };
        this.ws.send(JSON.stringify(responseBody));
    }
}
exports.WebSocketBridge = WebSocketBridge;

},{"./WebviewBridge":6}],6:[function(require,module,exports){
"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const PromiseInfo_1 = require("../types/PromiseInfo");
const Guid = require("../helpers/Guid");
class WebviewBridge {
    constructor() {
        this.timeout = 3600000;
        this.promises = new Map();
        this.functions = new Map();
        this.add({ func: this.locals, thisArg: this, name: "WebViewBridge:list" });
    }
    setTimeout(timeout) {
        this.timeout = timeout;
    }
    add(method) {
        this.functions.set((method.name ? method.name : method.func.name), method);
    }
    remove(method) {
        this.functions.delete((method.name ? method.name : method.func.name));
    }
    locals() {
        return Array.from(this.functions.keys());
    }
    remote() {
        return this.invoke("WebViewBridge:list");
    }
    invoke(method, params) {
        const id = Guid.newGuid();
        const promise = new Promise((resolve, reject) => {
            this.promises.set(id, new PromiseInfo_1.default(resolve, reject));
        });
        this.request(id, method, params);
        return promise;
    }
    handleResponse(message) {
        const promiseCallbacks = this.promises.get(message.id);
        if (promiseCallbacks) {
            if (message.success) {
                promiseCallbacks.resolve(message.response);
            }
            else {
                promiseCallbacks.reject(message.response);
            }
            this.promises.delete(message.id);
        }
    }
    handleRequest(message) {
        return __awaiter(this, void 0, void 0, function* () {
            const method = this.functions.get(message.method);
            if (method) {
                const func = method.func;
                const thisArg = method.thisArg;
                try {
                    let response = func.apply(thisArg, message.params);
                    if (typeof response.then === "function") {
                        response = yield response;
                    }
                    this.respond(message.id, response);
                }
                catch (err) {
                    this.respond(message.id, err, false);
                }
            }
        });
    }
}
exports.default = WebviewBridge;

},{"../helpers/Guid":2,"../types/PromiseInfo":3}]},{},[2,3,4,5,6])
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJub2RlX21vZHVsZXMvYnJvd3NlcmlmeS9saWIvX2VtcHR5LmpzIiwib3V0L3RlbXAvYnJvd3Nlci9oZWxwZXJzL0d1aWQuanMiLCJvdXQvdGVtcC9icm93c2VyL3R5cGVzL1Byb21pc2VJbmZvLmpzIiwib3V0L3RlbXAvYnJvd3Nlci93ZWJ1aS9Mb2NhbEJyaWRnZS5icm93c2VyLmpzIiwib3V0L3RlbXAvYnJvd3Nlci93ZWJ1aS9XZWJTb2NrZXRCcmlkZ2UuYnJvd3Nlci5qcyIsIm91dC90ZW1wL2Jyb3dzZXIvd2VidWkvV2Vidmlld0JyaWRnZS5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTtBQ0FBOztBQ0FBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzlCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNUQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUM3Q0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUM5Q0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSIsImZpbGUiOiJnZW5lcmF0ZWQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlc0NvbnRlbnQiOlsiKGZ1bmN0aW9uKCl7ZnVuY3Rpb24gcihlLG4sdCl7ZnVuY3Rpb24gbyhpLGYpe2lmKCFuW2ldKXtpZighZVtpXSl7dmFyIGM9XCJmdW5jdGlvblwiPT10eXBlb2YgcmVxdWlyZSYmcmVxdWlyZTtpZighZiYmYylyZXR1cm4gYyhpLCEwKTtpZih1KXJldHVybiB1KGksITApO3ZhciBhPW5ldyBFcnJvcihcIkNhbm5vdCBmaW5kIG1vZHVsZSAnXCIraStcIidcIik7dGhyb3cgYS5jb2RlPVwiTU9EVUxFX05PVF9GT1VORFwiLGF9dmFyIHA9bltpXT17ZXhwb3J0czp7fX07ZVtpXVswXS5jYWxsKHAuZXhwb3J0cyxmdW5jdGlvbihyKXt2YXIgbj1lW2ldWzFdW3JdO3JldHVybiBvKG58fHIpfSxwLHAuZXhwb3J0cyxyLGUsbix0KX1yZXR1cm4gbltpXS5leHBvcnRzfWZvcih2YXIgdT1cImZ1bmN0aW9uXCI9PXR5cGVvZiByZXF1aXJlJiZyZXF1aXJlLGk9MDtpPHQubGVuZ3RoO2krKylvKHRbaV0pO3JldHVybiBvfXJldHVybiByfSkoKSIsIiIsIlwidXNlIHN0cmljdFwiO1xyXG5PYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgXCJfX2VzTW9kdWxlXCIsIHsgdmFsdWU6IHRydWUgfSk7XHJcbmNvbnN0IHBlcmZfaG9va3NfMSA9IHJlcXVpcmUoXCJwZXJmX2hvb2tzXCIpO1xyXG5mdW5jdGlvbiBuZXdHdWlkKCkge1xyXG4gICAgdmFyIGQgPSBuZXcgRGF0ZSgpLmdldFRpbWUoKTtcclxuICAgIGlmICh0eXBlb2YgcGVyZl9ob29rc18xLnBlcmZvcm1hbmNlICE9PSAndW5kZWZpbmVkJyAmJiB0eXBlb2YgcGVyZl9ob29rc18xLnBlcmZvcm1hbmNlLm5vdyA9PT0gJ2Z1bmN0aW9uJykge1xyXG4gICAgICAgIGQgKz0gcGVyZl9ob29rc18xLnBlcmZvcm1hbmNlLm5vdygpO1xyXG4gICAgfVxyXG4gICAgcmV0dXJuICd4eHh4eHh4eC14eHh4LTR4eHgteXh4eC14eHh4eHh4eHh4eHgnLnJlcGxhY2UoL1t4eV0vZywgZnVuY3Rpb24gKGMpIHtcclxuICAgICAgICB2YXIgciA9IChkICsgTWF0aC5yYW5kb20oKSAqIDE2KSAlIDE2IHwgMDtcclxuICAgICAgICBkID0gTWF0aC5mbG9vcihkIC8gMTYpO1xyXG4gICAgICAgIHJldHVybiAoYyA9PT0gJ3gnID8gciA6IChyICYgMHgzIHwgMHg4KSkudG9TdHJpbmcoMTYpO1xyXG4gICAgfSk7XHJcbn1cclxuZXhwb3J0cy5uZXdHdWlkID0gbmV3R3VpZDtcclxuZnVuY3Rpb24gaXNHdWlkKHBhcmFtZXRlcikge1xyXG4gICAgdHJ5IHtcclxuICAgICAgICBjb25zdCBtYXRjaGVzID0gL1swLTlBLUZdezh9Wy1dPyhbMC05QS1GXXs0fVstXT8pezN9WzAtOUEtRl17MTJ9L2kuZXhlYyhwYXJhbWV0ZXIpO1xyXG4gICAgICAgIGNvbnN0IG1hdGNoID0gbWF0Y2hlcyAmJiBtYXRjaGVzLmxlbmd0aCA+IDAgPyBtYXRjaGVzWzBdIDogdW5kZWZpbmVkO1xyXG4gICAgICAgIHJldHVybiAhKHR5cGVvZiBtYXRjaCA9PT0gXCJ1bmRlZmluZWRcIiB8fCBtYXRjaCA9PT0gbnVsbCk7XHJcbiAgICB9XHJcbiAgICBjYXRjaCAoZXJyb3IpIHtcclxuICAgICAgICByZXR1cm4gZmFsc2U7XHJcbiAgICB9XHJcbn1cclxuZXhwb3J0cy5pc0d1aWQgPSBpc0d1aWQ7XHJcbmZ1bmN0aW9uIHRyaW1HdWlkKGlkKSB7XHJcbiAgICByZXR1cm4gKGlkIHx8ICcnKS5yZXBsYWNlKC97fH0vZywgJycpO1xyXG59XHJcbmV4cG9ydHMudHJpbUd1aWQgPSB0cmltR3VpZDtcclxuLy8jIHNvdXJjZU1hcHBpbmdVUkw9R3VpZC5qcy5tYXAiLCJcInVzZSBzdHJpY3RcIjtcclxuT2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFwiX19lc01vZHVsZVwiLCB7IHZhbHVlOiB0cnVlIH0pO1xyXG5jbGFzcyBQcm9taXNlSW5mbyB7XHJcbiAgICBjb25zdHJ1Y3RvcihyZXNvbHZlLCByZWplY3QpIHtcclxuICAgICAgICB0aGlzLnJlc29sdmUgPSByZXNvbHZlO1xyXG4gICAgICAgIHRoaXMucmVqZWN0ID0gcmVqZWN0O1xyXG4gICAgfVxyXG59XHJcbmV4cG9ydHMuZGVmYXVsdCA9IFByb21pc2VJbmZvO1xyXG4vLyMgc291cmNlTWFwcGluZ1VSTD1Qcm9taXNlSW5mby5qcy5tYXAiLCJcInVzZSBzdHJpY3RcIjtcclxuT2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFwiX19lc01vZHVsZVwiLCB7IHZhbHVlOiB0cnVlIH0pO1xyXG5jb25zdCBXZWJ2aWV3QnJpZGdlXzEgPSByZXF1aXJlKFwiLi9XZWJ2aWV3QnJpZGdlXCIpO1xyXG5jbGFzcyBMb2NhbEJyaWRnZSBleHRlbmRzIFdlYnZpZXdCcmlkZ2VfMS5kZWZhdWx0IHtcclxuICAgIGNvbnN0cnVjdG9yKHdpbmRvdywgdnNjb2RlKSB7XHJcbiAgICAgICAgc3VwZXIoKTtcclxuICAgICAgICB0aGlzLndpbmRvdyA9IHdpbmRvdztcclxuICAgICAgICB0aGlzLnZzY29kZSA9IHZzY29kZTtcclxuICAgICAgICB0aGlzLndpbmRvdy5hZGRFdmVudExpc3RlbmVyKFwibWVzc2FnZVwiLCAoZXZlbnQpID0+IHtcclxuICAgICAgICAgICAgY29uc3QgbWVzc2FnZSA9IGV2ZW50LmRhdGE7XHJcbiAgICAgICAgICAgIHN3aXRjaCAobWVzc2FnZS5jb21tYW5kKSB7XHJcbiAgICAgICAgICAgICAgICBjYXNlIFwiV2ViVmlld0JyaWRnZTpyZXNwb25zZVwiOlxyXG4gICAgICAgICAgICAgICAgICAgIHRoaXMuaGFuZGxlUmVzcG9uc2UobWVzc2FnZSk7XHJcbiAgICAgICAgICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgICAgICAgICBjYXNlIFwiV2ViVmlld0JyaWRnZTpyZXF1ZXN0XCI6XHJcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5oYW5kbGVSZXF1ZXN0KG1lc3NhZ2UpO1xyXG4gICAgICAgICAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfSk7XHJcbiAgICB9XHJcbiAgICByZXF1ZXN0KGd1aWQsIG1ldGhvZCwgcGFyYW1zKSB7XHJcbiAgICAgICAgc2V0VGltZW91dCgoKSA9PiB7XHJcbiAgICAgICAgICAgIGNvbnN0IHByb21pc2VDYWxsYmFja3MgPSB0aGlzLnByb21pc2VzLmdldChndWlkKTtcclxuICAgICAgICAgICAgaWYgKHByb21pc2VDYWxsYmFja3MpIHtcclxuICAgICAgICAgICAgICAgIHByb21pc2VDYWxsYmFja3MucmVqZWN0KFwiUmVxdWVzdCB0aW1lZCBvdXRcIik7XHJcbiAgICAgICAgICAgICAgICB0aGlzLnByb21pc2VzLmRlbGV0ZShndWlkKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH0sIHRoaXMudGltZW91dCk7XHJcbiAgICAgICAgdGhpcy52c2NvZGUucG9zdE1lc3NhZ2Uoe1xyXG4gICAgICAgICAgICBjb21tYW5kOiBcIldlYlZpZXdCcmlkZ2U6cmVxdWVzdFwiLFxyXG4gICAgICAgICAgICBpZDogZ3VpZCxcclxuICAgICAgICAgICAgbWV0aG9kOiBtZXRob2QsXHJcbiAgICAgICAgICAgIHBhcmFtczogcGFyYW1zXHJcbiAgICAgICAgfSk7XHJcbiAgICB9XHJcbiAgICByZXNwb25kKGd1aWQsIHJlc3BvbnNlLCBzdWNjZXNzID0gdHJ1ZSkge1xyXG4gICAgICAgIHRoaXMudnNjb2RlLnBvc3RNZXNzYWdlKHtcclxuICAgICAgICAgICAgY29tbWFuZDogXCJXZWJWaWV3QnJpZGdlOnJlc3BvbnNlXCIsXHJcbiAgICAgICAgICAgIGlkOiBndWlkLFxyXG4gICAgICAgICAgICByZXNwb25zZTogcmVzcG9uc2UsXHJcbiAgICAgICAgICAgIHN1Y2Nlc3M6IHN1Y2Nlc3NcclxuICAgICAgICB9KTtcclxuICAgIH1cclxufVxyXG5leHBvcnRzLkxvY2FsQnJpZGdlID0gTG9jYWxCcmlkZ2U7XHJcbi8vIyBzb3VyY2VNYXBwaW5nVVJMPUxvY2FsQnJpZGdlLmJyb3dzZXIuanMubWFwIiwiXCJ1c2Ugc3RyaWN0XCI7XHJcbk9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBcIl9fZXNNb2R1bGVcIiwgeyB2YWx1ZTogdHJ1ZSB9KTtcclxuY29uc3QgV2Vidmlld0JyaWRnZV8xID0gcmVxdWlyZShcIi4vV2Vidmlld0JyaWRnZVwiKTtcclxuY2xhc3MgV2ViU29ja2V0QnJpZGdlIGV4dGVuZHMgV2Vidmlld0JyaWRnZV8xLmRlZmF1bHQge1xyXG4gICAgY29uc3RydWN0b3Iod3MpIHtcclxuICAgICAgICBzdXBlcigpO1xyXG4gICAgICAgIHRoaXMud3MgPSB3cztcclxuICAgICAgICB0aGlzLndzLmFkZEV2ZW50TGlzdGVuZXIoXCJtZXNzYWdlXCIsIChldmVudCkgPT4ge1xyXG4gICAgICAgICAgICBjb25zdCBtZXNzYWdlID0gSlNPTi5wYXJzZShldmVudC5kYXRhKTtcclxuICAgICAgICAgICAgc3dpdGNoIChtZXNzYWdlLmNvbW1hbmQpIHtcclxuICAgICAgICAgICAgICAgIGNhc2UgXCJXZWJWaWV3QnJpZGdlOnJlc3BvbnNlXCI6XHJcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5oYW5kbGVSZXNwb25zZShtZXNzYWdlKTtcclxuICAgICAgICAgICAgICAgICAgICBicmVhaztcclxuICAgICAgICAgICAgICAgIGNhc2UgXCJXZWJWaWV3QnJpZGdlOnJlcXVlc3RcIjpcclxuICAgICAgICAgICAgICAgICAgICB0aGlzLmhhbmRsZVJlcXVlc3QobWVzc2FnZSk7XHJcbiAgICAgICAgICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9KTtcclxuICAgIH1cclxuICAgIHJlcXVlc3QoZ3VpZCwgbWV0aG9kLCBwYXJhbXMpIHtcclxuICAgICAgICBzZXRUaW1lb3V0KCgpID0+IHtcclxuICAgICAgICAgICAgY29uc3QgcHJvbWlzZUNhbGxiYWNrcyA9IHRoaXMucHJvbWlzZXMuZ2V0KGd1aWQpO1xyXG4gICAgICAgICAgICBpZiAocHJvbWlzZUNhbGxiYWNrcykge1xyXG4gICAgICAgICAgICAgICAgcHJvbWlzZUNhbGxiYWNrcy5yZWplY3QoXCJSZXF1ZXN0IHRpbWVkIG91dFwiKTtcclxuICAgICAgICAgICAgICAgIHRoaXMucHJvbWlzZXMuZGVsZXRlKGd1aWQpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfSwgdGhpcy50aW1lb3V0KTtcclxuICAgICAgICBjb25zdCByZXF1ZXN0Qm9keSA9IHtcclxuICAgICAgICAgICAgY29tbWFuZDogXCJXZWJWaWV3QnJpZGdlOnJlcXVlc3RcIixcclxuICAgICAgICAgICAgaWQ6IGd1aWQsXHJcbiAgICAgICAgICAgIG1ldGhvZDogbWV0aG9kLFxyXG4gICAgICAgICAgICBwYXJhbXM6IHBhcmFtc1xyXG4gICAgICAgIH07XHJcbiAgICAgICAgdGhpcy53cy5zZW5kKEpTT04uc3RyaW5naWZ5KHJlcXVlc3RCb2R5KSk7XHJcbiAgICB9XHJcbiAgICByZXNwb25kKGd1aWQsIHJlc3BvbnNlLCBzdWNjZXNzID0gdHJ1ZSkge1xyXG4gICAgICAgIGNvbnN0IHJlc3BvbnNlQm9keSA9IHtcclxuICAgICAgICAgICAgY29tbWFuZDogXCJXZWJWaWV3QnJpZGdlOnJlc3BvbnNlXCIsXHJcbiAgICAgICAgICAgIGlkOiBndWlkLFxyXG4gICAgICAgICAgICByZXNwb25zZTogcmVzcG9uc2UsXHJcbiAgICAgICAgICAgIHN1Y2Nlc3M6IHN1Y2Nlc3NcclxuICAgICAgICB9O1xyXG4gICAgICAgIHRoaXMud3Muc2VuZChKU09OLnN0cmluZ2lmeShyZXNwb25zZUJvZHkpKTtcclxuICAgIH1cclxufVxyXG5leHBvcnRzLldlYlNvY2tldEJyaWRnZSA9IFdlYlNvY2tldEJyaWRnZTtcclxuLy8jIHNvdXJjZU1hcHBpbmdVUkw9V2ViU29ja2V0QnJpZGdlLmJyb3dzZXIuanMubWFwIiwiXCJ1c2Ugc3RyaWN0XCI7XHJcbnZhciBfX2F3YWl0ZXIgPSAodGhpcyAmJiB0aGlzLl9fYXdhaXRlcikgfHwgZnVuY3Rpb24gKHRoaXNBcmcsIF9hcmd1bWVudHMsIFAsIGdlbmVyYXRvcikge1xyXG4gICAgZnVuY3Rpb24gYWRvcHQodmFsdWUpIHsgcmV0dXJuIHZhbHVlIGluc3RhbmNlb2YgUCA/IHZhbHVlIDogbmV3IFAoZnVuY3Rpb24gKHJlc29sdmUpIHsgcmVzb2x2ZSh2YWx1ZSk7IH0pOyB9XHJcbiAgICByZXR1cm4gbmV3IChQIHx8IChQID0gUHJvbWlzZSkpKGZ1bmN0aW9uIChyZXNvbHZlLCByZWplY3QpIHtcclxuICAgICAgICBmdW5jdGlvbiBmdWxmaWxsZWQodmFsdWUpIHsgdHJ5IHsgc3RlcChnZW5lcmF0b3IubmV4dCh2YWx1ZSkpOyB9IGNhdGNoIChlKSB7IHJlamVjdChlKTsgfSB9XHJcbiAgICAgICAgZnVuY3Rpb24gcmVqZWN0ZWQodmFsdWUpIHsgdHJ5IHsgc3RlcChnZW5lcmF0b3JbXCJ0aHJvd1wiXSh2YWx1ZSkpOyB9IGNhdGNoIChlKSB7IHJlamVjdChlKTsgfSB9XHJcbiAgICAgICAgZnVuY3Rpb24gc3RlcChyZXN1bHQpIHsgcmVzdWx0LmRvbmUgPyByZXNvbHZlKHJlc3VsdC52YWx1ZSkgOiBhZG9wdChyZXN1bHQudmFsdWUpLnRoZW4oZnVsZmlsbGVkLCByZWplY3RlZCk7IH1cclxuICAgICAgICBzdGVwKChnZW5lcmF0b3IgPSBnZW5lcmF0b3IuYXBwbHkodGhpc0FyZywgX2FyZ3VtZW50cyB8fCBbXSkpLm5leHQoKSk7XHJcbiAgICB9KTtcclxufTtcclxuT2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFwiX19lc01vZHVsZVwiLCB7IHZhbHVlOiB0cnVlIH0pO1xyXG5jb25zdCBQcm9taXNlSW5mb18xID0gcmVxdWlyZShcIi4uL3R5cGVzL1Byb21pc2VJbmZvXCIpO1xyXG5jb25zdCBHdWlkID0gcmVxdWlyZShcIi4uL2hlbHBlcnMvR3VpZFwiKTtcclxuY2xhc3MgV2Vidmlld0JyaWRnZSB7XHJcbiAgICBjb25zdHJ1Y3RvcigpIHtcclxuICAgICAgICB0aGlzLnRpbWVvdXQgPSAzNjAwMDAwO1xyXG4gICAgICAgIHRoaXMucHJvbWlzZXMgPSBuZXcgTWFwKCk7XHJcbiAgICAgICAgdGhpcy5mdW5jdGlvbnMgPSBuZXcgTWFwKCk7XHJcbiAgICAgICAgdGhpcy5hZGQoeyBmdW5jOiB0aGlzLmxvY2FscywgdGhpc0FyZzogdGhpcywgbmFtZTogXCJXZWJWaWV3QnJpZGdlOmxpc3RcIiB9KTtcclxuICAgIH1cclxuICAgIHNldFRpbWVvdXQodGltZW91dCkge1xyXG4gICAgICAgIHRoaXMudGltZW91dCA9IHRpbWVvdXQ7XHJcbiAgICB9XHJcbiAgICBhZGQobWV0aG9kKSB7XHJcbiAgICAgICAgdGhpcy5mdW5jdGlvbnMuc2V0KChtZXRob2QubmFtZSA/IG1ldGhvZC5uYW1lIDogbWV0aG9kLmZ1bmMubmFtZSksIG1ldGhvZCk7XHJcbiAgICB9XHJcbiAgICByZW1vdmUobWV0aG9kKSB7XHJcbiAgICAgICAgdGhpcy5mdW5jdGlvbnMuZGVsZXRlKChtZXRob2QubmFtZSA/IG1ldGhvZC5uYW1lIDogbWV0aG9kLmZ1bmMubmFtZSkpO1xyXG4gICAgfVxyXG4gICAgbG9jYWxzKCkge1xyXG4gICAgICAgIHJldHVybiBBcnJheS5mcm9tKHRoaXMuZnVuY3Rpb25zLmtleXMoKSk7XHJcbiAgICB9XHJcbiAgICByZW1vdGUoKSB7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMuaW52b2tlKFwiV2ViVmlld0JyaWRnZTpsaXN0XCIpO1xyXG4gICAgfVxyXG4gICAgaW52b2tlKG1ldGhvZCwgcGFyYW1zKSB7XHJcbiAgICAgICAgY29uc3QgaWQgPSBHdWlkLm5ld0d1aWQoKTtcclxuICAgICAgICBjb25zdCBwcm9taXNlID0gbmV3IFByb21pc2UoKHJlc29sdmUsIHJlamVjdCkgPT4ge1xyXG4gICAgICAgICAgICB0aGlzLnByb21pc2VzLnNldChpZCwgbmV3IFByb21pc2VJbmZvXzEuZGVmYXVsdChyZXNvbHZlLCByZWplY3QpKTtcclxuICAgICAgICB9KTtcclxuICAgICAgICB0aGlzLnJlcXVlc3QoaWQsIG1ldGhvZCwgcGFyYW1zKTtcclxuICAgICAgICByZXR1cm4gcHJvbWlzZTtcclxuICAgIH1cclxuICAgIGhhbmRsZVJlc3BvbnNlKG1lc3NhZ2UpIHtcclxuICAgICAgICBjb25zdCBwcm9taXNlQ2FsbGJhY2tzID0gdGhpcy5wcm9taXNlcy5nZXQobWVzc2FnZS5pZCk7XHJcbiAgICAgICAgaWYgKHByb21pc2VDYWxsYmFja3MpIHtcclxuICAgICAgICAgICAgaWYgKG1lc3NhZ2Uuc3VjY2Vzcykge1xyXG4gICAgICAgICAgICAgICAgcHJvbWlzZUNhbGxiYWNrcy5yZXNvbHZlKG1lc3NhZ2UucmVzcG9uc2UpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgcHJvbWlzZUNhbGxiYWNrcy5yZWplY3QobWVzc2FnZS5yZXNwb25zZSk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgdGhpcy5wcm9taXNlcy5kZWxldGUobWVzc2FnZS5pZCk7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG4gICAgaGFuZGxlUmVxdWVzdChtZXNzYWdlKSB7XHJcbiAgICAgICAgcmV0dXJuIF9fYXdhaXRlcih0aGlzLCB2b2lkIDAsIHZvaWQgMCwgZnVuY3Rpb24qICgpIHtcclxuICAgICAgICAgICAgY29uc3QgbWV0aG9kID0gdGhpcy5mdW5jdGlvbnMuZ2V0KG1lc3NhZ2UubWV0aG9kKTtcclxuICAgICAgICAgICAgaWYgKG1ldGhvZCkge1xyXG4gICAgICAgICAgICAgICAgY29uc3QgZnVuYyA9IG1ldGhvZC5mdW5jO1xyXG4gICAgICAgICAgICAgICAgY29uc3QgdGhpc0FyZyA9IG1ldGhvZC50aGlzQXJnO1xyXG4gICAgICAgICAgICAgICAgdHJ5IHtcclxuICAgICAgICAgICAgICAgICAgICBsZXQgcmVzcG9uc2UgPSBmdW5jLmFwcGx5KHRoaXNBcmcsIG1lc3NhZ2UucGFyYW1zKTtcclxuICAgICAgICAgICAgICAgICAgICBpZiAodHlwZW9mIHJlc3BvbnNlLnRoZW4gPT09IFwiZnVuY3Rpb25cIikge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICByZXNwb25zZSA9IHlpZWxkIHJlc3BvbnNlO1xyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICB0aGlzLnJlc3BvbmQobWVzc2FnZS5pZCwgcmVzcG9uc2UpO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgY2F0Y2ggKGVycikge1xyXG4gICAgICAgICAgICAgICAgICAgIHRoaXMucmVzcG9uZChtZXNzYWdlLmlkLCBlcnIsIGZhbHNlKTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH0pO1xyXG4gICAgfVxyXG59XHJcbmV4cG9ydHMuZGVmYXVsdCA9IFdlYnZpZXdCcmlkZ2U7XHJcbi8vIyBzb3VyY2VNYXBwaW5nVVJMPVdlYnZpZXdCcmlkZ2UuanMubWFwIl19
