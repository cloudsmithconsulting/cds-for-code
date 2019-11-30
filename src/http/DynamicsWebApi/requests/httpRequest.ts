import * as http from 'http';
import * as https from 'https';
import * as httpntlm from "httpntlm";
import * as url from 'url';
import parseResponse from './helpers/parseResponse';
import ErrorHelper from '../helpers/ErrorHelper';

/**
 * Sends a request to given URL with given parameters
 *
 */
export default function httpRequest(options: any) {
    const method = options.method ? options.method.toLowerCase() : "get";
    const uri = options.uri;
    const data = options.data;
    const additionalHeaders = options.additionalHeaders;
    const responseParams = options.responseParams;
    const successCallback = options.successCallback;
    const errorCallback = options.errorCallback;
    const timeout = options.timeout;
    const ntlmAuth = options.domain || options.workstation;

    let headers: http.IncomingHttpHeaders = {};

    if (data) {
        headers["Content-Type"] = additionalHeaders['Content-Type'];
        headers["Content-Length"] = data.length;

        delete additionalHeaders['Content-Type'];
    }

    //set additional headers
    for (var key in additionalHeaders) {
        headers[key] = additionalHeaders[key];
    }

    const parsedUrl = url.parse(uri);
    const protocol = parsedUrl.protocol.replace(':', '');
    let protocolInterface = ntlmAuth ? httpntlm : protocol === 'http' ? http : https;

    let internalOptions = {
        hostname: parsedUrl.hostname,
        port: parsedUrl.port,
        path: parsedUrl.path,
        method: method,
        timeout: timeout,
        headers: headers
    };

    if (process.env[`${protocol}_proxy`]) {
        /*
         * Proxied requests don't work with Node's https module so use http to
         * talk to the proxy server regardless of the endpoint protocol. This
         * is unsuitable for environments where requests are expected to be
         * using end-to-end TLS.
         */
        protocolInterface = http;
        var proxyUrl = url.parse(process.env.http_proxy);
        headers.host = parsedUrl.host;
        internalOptions = {
            hostname: proxyUrl.hostname,
            port: proxyUrl.port,
            path: parsedUrl.href,
            method: method,
            timeout: timeout,
            headers: headers
        };
    }

    let request:any = protocolInterface[method](internalOptions, (res) => {
        var rawData = '';
        res.setEncoding('utf8');
        res.on('data', function (chunk) {
            rawData += chunk;
        });
        res.on('end', function () {
            switch (res.statusCode) {
                case 200: // Success with content returned in response body.
                case 201: // Success with content returned in response body.
                case 204: // Success with no content returned in response body.
                case 304: {// Success with Not Modified
                    var responseData = parseResponse(rawData, res.headers, responseParams);

                    var response = {
                        data: responseData,
                        headers: res.headers,
                        status: res.statusCode
                    };

                    successCallback(response);
                    break;
                }
                default: // All other statuses are error cases.
                    var crmError;
                    try {
                        var errorParsed = parseResponse(rawData, res.headers, responseParams);

                        if (Array.isArray(errorParsed)) {
                            errorCallback(errorParsed);
                            break;
                        }

                        crmError = errorParsed.hasOwnProperty('error') && errorParsed.error
                            ? errorParsed.error
                            : { message: errorParsed.Message };

                    } catch (e) {
                        if (rawData.length > 0) {
                            crmError = { message: rawData };
                        }
                        else {
                            crmError = { message: "Unexpected Error" };
                        }
                    }

                    errorCallback(ErrorHelper.handleHttpError(crmError, { status: res.statusCode, statusText: request.statusText, statusMessage: res.statusMessage }));

                    break;
            }

            responseParams.length = 0;
        });
    });

    if (internalOptions.timeout) {
        request.setTimeout(internalOptions.timeout, () => {
            request.abort();
        });
    }

    request.on('error', (error) => {
        responseParams.length = 0;
        errorCallback(error);
    });

    if (data) {
        request.write(data);
    }

    request.end();
}