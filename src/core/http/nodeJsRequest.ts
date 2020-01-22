import * as http from 'http';
import * as https from 'https';
import * as httpntlm from "httpntlm";
import * as url from 'url';
import * as Security from '../security/Types';
import * as cs from '../../cs';
import defaultResponseHandler from "./defaultResponseHandler.nodejs";
import GlobalStateCredentialStore from '../security/GlobalStateCredentialStore';
import logger from '../framework/Logger';
import Telemetry from '../framework/Telemetry';
import { Utilities } from '../Utilities';
import moment = require('moment');

export type ResponseHandler = (request: any, data: any, response: any, responseParams: any, successCallback: (response:any) => void, errorCallback: (error:any) => void) => void;

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
    const responseHandler: ResponseHandler = options.responseHandler || defaultResponseHandler.bind(this);
    const useWindowsAuth = options.credentials && Security.Credential.isWindowsCredential(options.credentials);
    const authRetry: () => boolean = options.authRetry;
    
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
    let internalOptions: any = {
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
        const proxyUrl = url.parse(process.env.http_proxy);
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
    
    let executeHttpRequest: (protocol: any, options: any, responseDelegate: ResponseHandler) => void;

    // NTLM works a little different from other request types, we must auth here so that we're doing so for each connection (vs. request authentication)
    if (useWindowsAuth) {
        const internalCredentials = Security.Credential.from<Security.WindowsCredential>(options.credentials, options.connectionId);
        let decrypted = internalCredentials.decrypt<Security.WindowsCredential>(GlobalStateCredentialStore.Instance, options.connectionId) || internalCredentials;

        // HttpNtlm does it's own path parsing.
        internalOptions.url = parsedUrl.href;
        internalOptions.username = decrypted.username;
        internalOptions.password = decrypted.password;
        internalOptions.domain = decrypted.domain;

        if (data) {
            internalOptions.body = data;
        }

        executeHttpRequest = (protocol:any, options:any, responseDelegate: ResponseHandler) => protocol[options.method.toLowerCase()](
            options, 
            (error, response) => {
                requestEndTime = moment.now();

                if (error) {
                    responseParams.length = 0;

                    logger.error(`HTTP error: ${internalOptions.method.toUpperCase()} ${internalOptions.url} (out: ${data ? data.length : 0}b, time: ${requestEndTime - requestStartTime}ms, error: ${(error.message || error).toString()})`);
                    Telemetry.Instance.error(error, {
                        requestId,
                        method: internalOptions.method,
                        host: internalOptions.hostname,
                        port: internalOptions.port,
                        url: internalOptions.url,
                        username: internalOptions.username,
                        statusCode: "-1"
                    }, {
                        executionTime: requestEndTime - requestStartTime,
                        requestBytes: data.length,
                        responseBytes: 0
                    });

                    errorCallback(error);
                } else {
                    if (response.statusCode === 401) {
                        Telemetry.Instance.sendTelemetry(cs.cds.telemetryEvents.loginFailure, { 
                            resource: parsedUrl.href, 
                            username: internalOptions.username,
                            errorMessage: response.body, 
                            errorType: 'authentication_failure', 
                            errorStatus: '401' });
                    } else {
                        logger.log(`HTTP ${response.statusCode} received: ${internalOptions.method} ${internalOptions.url} (out: ${data ? data.length : 0}b, in: ${response && response.body ? response.body.length : 0}b, time: ${requestEndTime - requestStartTime}ms)`);

                        Telemetry.Instance.sendTelemetry(cs.cds.telemetryEvents.httpRequest, {
                            requestId,
                            method: internalOptions.method,
                            host: internalOptions.hostname,
                            port: internalOptions.port,
                            url: internalOptions.url,
                            username: internalOptions.username,
                            statusCode: response.statusCode
                        }, {
                            executionTime: requestEndTime - requestStartTime,
                            requestBytes: data ? data.length : 0,
                            responseBytes: response && response.body ? response.body.length : 0
                        });
                    }

                    if (responseDelegate) {
                        responseDelegate(parsedUrl.href, response.body, response, responseParams, successCallback, errorCallback);
                    }
                }
            });
    } else {
        executeHttpRequest = (protocol:any, options:any, responseDelegate: ResponseHandler) => protocol.request(
            options, 
            (response) => {
                let rawData = '';

                response.setEncoding('utf8');
                response.on('data', (chunk: any) => {
                    rawData += chunk;
                }); 
                response.on('end', () => {
                    requestEndTime = moment.now();

                    if (response.statusCode === 401 && authRetry()) {
                        logger.log("Auth: HTTP 401 received");
                    } else if (responseDelegate) {
                        logger.log(`HTTP ${response.statusCode} received: ${internalOptions.method.toUpperCase()} ${parsedUrl.href} (out: ${data ? data.length : 0}b, in: ${rawData ? rawData.length : 0}b, time: ${requestEndTime - requestStartTime}ms)`);

                        Telemetry.Instance.sendTelemetry(cs.cds.telemetryEvents.httpRequest, {
                            requestId,
                            method: internalOptions.method,
                            host: internalOptions.hostname,
                            port: internalOptions.port,
                            url: parsedUrl.href,
                            username: headers["authorization"],
                            statusCode: response.statusCode
                        }, {
                            executionTime: requestEndTime - requestStartTime,
                            requestBytes: data ? data.length : 0,
                            responseBytes: rawData ? rawData.length : 0
                        });

                        responseDelegate(parsedUrl.href, rawData, response, responseParams, successCallback, errorCallback);
                    }
                });

                responseParams.length = 0;
            });
    }

    const requestId = Utilities.Guid.newGuid();
    const requestStartTime = moment.now();
    let requestEndTime;

    let request: any = executeHttpRequest(
        protocolInterface, 
        internalOptions, 
        responseHandler.bind(this));

    // NTLM library just performs fire and forget, invoking callback when complete, others get these events.
    if (request) {
        if (internalOptions.timeout) {
            global.setTimeout(() => request ? request.abort() : undefined, internalOptions.timeout);
        }

        request.on('error', (error) => {
            responseParams.length = 0;
            requestEndTime = moment.now();

            logger.error(`HTTP error: ${internalOptions.method} ${parsedUrl.href} (request: ${data ? data.length : 0}b, time: ${requestEndTime - requestStartTime}ms, error: ${(error.message || error).toString()})`);
            Telemetry.Instance.error(error, {
                requestId,
                method: internalOptions.method,
                host: internalOptions.hostname,
                port: internalOptions.port,
                url: internalOptions.url,
                username: internalOptions.username
            }, {
                executionTime: requestEndTime - requestStartTime,
                requestBytes: data.length
            });

            errorCallback(error);
        });
    
        if (data) {
            request.write(data);
        }

        request.end();
    }
}