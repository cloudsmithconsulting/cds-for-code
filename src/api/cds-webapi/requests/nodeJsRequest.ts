import * as http from 'http';
import * as https from 'https';
import * as httpntlm from "httpntlm";
import * as url from 'url';
import parseResponse from './helpers/parseResponse';
import ErrorHelper from '../helpers/ErrorHelper';
import * as Security from '../../../core/security/Types';
import GlobalStateCredentialStore from '../../../core/security/GlobalStateCredentialStore';

/**
 * Sends a request to given URL with given parameters
 *
 */
export default function nodeJsRequest(options: any) {
    const method = options.method ? options.method.toLowerCase() : "get";
    const uri = options.uri;
    const data = options.data;
    const additionalHeaders = options.additionalHeaders;
    const responseParams = options.responseParams;
    const successCallback = options.successCallback;
    const errorCallback = options.errorCallback;
    const timeout = options.timeout;
    const useWindowsAuth = options.credentials && Security.Credential.isWindowsCredential(options.credentials);

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
    let protocolInterface = useWindowsAuth ? httpntlm : protocol === 'http' ? http : https;

    let internalOptions:any = {
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
    
    if (useWindowsAuth) {
        const credential:Security.WindowsCredential = options.credentials;
        const decrypted = credential.decrypt<Security.WindowsCredential>(GlobalStateCredentialStore.Instance, options.id);

        internalOptions.username = decrypted.username;
        internalOptions.password = decrypted.password;
        internalOptions.domain = decrypted.domain;
    }

    let request:any = protocolInterface[method](internalOptions, (response) => {
        let rawData = '';

        response.setEncoding('utf8');
        response.on('data', (chunk) => {
            rawData += chunk;
        });        
        response.on('end', () => {
            switch (response.statusCode) {
                case 200: // Success with content returned in response body.
                case 201: // Success with content returned in response body.
                case 204: // Success with no content returned in response body.
                case 304: {// Success with Not Modified
                    var responseData = parseResponse(rawData, response.headers, responseParams);

                    var response = {
                        data: responseData,
                        headers: response.headers,
                        status: response.statusCode
                    };

                    successCallback(response);
                    break;
                }
                default: // All other statuses are error cases.
                    var internalError;
                    try {
                        var errorParsed = parseResponse(rawData, response.headers, responseParams);

                        if (Array.isArray(errorParsed)) {
                            errorCallback(errorParsed);
                            break;
                        }

                        internalError = errorParsed.hasOwnProperty('error') && errorParsed.error
                            ? errorParsed.error
                            : { message: errorParsed.Message };

                    } catch (e) {
                        if (rawData.length > 0) {
                            internalError = { message: rawData };
                        }
                        else {
                            internalError = { message: "Unexpected Error" };
                        }
                    }

                    errorCallback(ErrorHelper.handleHttpError(internalError, { status: response.statusCode, statusText: request.statusText, statusMessage: response.statusMessage }));

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