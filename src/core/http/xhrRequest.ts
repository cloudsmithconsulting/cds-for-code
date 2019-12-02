import * as Parameters from '../helpers/Parameters';
import { ResponseHandler } from './nodeJsRequest';
import defaultResponseHandler from "./defaultResponseHandler.xhr";

if (!Array.isArray) {
    require("../polyfills/Array-es6");
}

/**
 * Uses XmlHttpRequest to send requests through the web browser.  
 * @export xhrRequest which takes a standard set of options when requesting data.
 * @param {*} options
 */
export default function xhrRequest(options: any) {
    const method = options.method;
    const uri = options.uri;
    const data = options.data;
    const additionalHeaders = options.additionalHeaders;
    const responseParams = options.responseParams;
    const responseHandler: ResponseHandler = options.responseHandler || defaultResponseHandler.bind(this);
    const successCallback = options.successCallback;
    const errorCallback = options.errorCallback;
    const isAsync = options.isAsync;

    let request = new XMLHttpRequest();
    request.open(method, uri, isAsync);

    //set additional headers
    for (var key in additionalHeaders) {
        request.setRequestHeader(key, additionalHeaders[key]);
    }

    request.onreadystatechange = function () {
        if (responseHandler) {
            responseHandler(request, request.readyState === 4 && request.responseText ? request.responseText : undefined, request.response, responseParams, successCallback, errorCallback);
        }
    };

    if (options.timeout) {
        request.timeout = options.timeout;
    }

    request.onerror = function () {
        errorCallback(Parameters.handleHttpError({
            status: request.status,
            statusText: request.statusText,
            message: request.responseText || "Network Error"
        }));
        responseParams.length = 0;
        request = null;
    };

    request.ontimeout = function () {
        errorCallback(Parameters.handleHttpError({
            status: request.status,
            statusText: request.statusText,
            message: request.responseText || "Request Timed Out"
        }));
        responseParams.length = 0;
        request = null;
    };

    data
        ? request.send(data)
        : request.send();
}