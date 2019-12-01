import * as http from 'http';
import * as https from 'https';
import * as httpntlm from "httpntlm";
import * as url from 'url';
import * as Security from '../../../core/security/Types';
import GlobalStateCredentialStore from '../../../core/security/GlobalStateCredentialStore';
import oDataResponse from './helpers/oDataResponse';

export type ResponseHandler = (request: any, response: any, responseParams: any, successCallback: any, errorCallback: any) => void;

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
    
    let protocolRequest: (protocol: any, options: any, responseDelegate:ResponseHandler) => void;

    if (useWindowsAuth) {
        // NTLM works a little different from other request types.
        const internalCredentials = Security.WindowsCredential.from(options.credentials);
        let decrypted = internalCredentials.decrypt<Security.WindowsCredential>(GlobalStateCredentialStore.Instance, options.id) || internalCredentials;

        // HttpNtlm does it's own path parsing.
        internalOptions.url = parsedUrl.href;
        internalOptions.username = decrypted.username;
        internalOptions.password = decrypted.password;
        internalOptions.domain = decrypted.domain;

        if (data) {
            internalOptions.body = data;
        }

        protocolRequest = (protocol:any, options:any, responseDelegate:ResponseHandler) => protocol[options.method.toLowerCase()](
            options, 
            (error, response) => {
                if (error) {
                    responseParams.length = 0;
                    errorCallback(error);
                } else {
                    responseDelegate(response.body, response, responseParams, successCallback, errorCallback);
                }
            });
    } else {
        protocolRequest = (protocol:any, options:any, responseDelegate:ResponseHandler) => protocol.request(
            options, 
            (response) => {
                let rawData = '';

                response.setEncoding('utf8');
                
                response.on('data', (chunk) => {
                    rawData += chunk;
                }); 

                response.on('end', () => {
                    responseDelegate(rawData, response, responseParams, successCallback, errorCallback);
                });

                responseParams.length = 0;
            });
    }

    let request: any;

    try {
        request = protocolRequest(protocolInterface, internalOptions, oDataResponse.bind(this)); 
    } catch (error) {
        errorCallback(error);
        return;
    }

    // NTLM just performs fire and forget, invoking callback when complete, others get these events.
    if (request) {
        if (internalOptions.timeout) {
            global.setTimeout(() => request ? request.abort() : undefined, internalOptions.timeout);
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
}