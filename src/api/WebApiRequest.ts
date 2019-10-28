import * as vscode from 'vscode';
import * as httpntlm from "httpntlm";
import * as http from 'http';
import * as https from 'https';
import ResponseUtilities from "./ResponseUtilities";
import RequestUtilities from "./RequestUtilities";
import RequestConverter from "./RequestConverter";
import Utilities from "../helpers/Utilities";
import { DynamicsWebApi } from './Types';

export default class WebApiRequest
{
    private _entityNames;

    private setStandardHeaders(additionalHeaders:any) {
        additionalHeaders["Accept"] = "application/json";
        additionalHeaders["OData-MaxVersion"] = "4.0";
        additionalHeaders["OData-Version"] = "4.0";
        additionalHeaders['Content-Type'] = 'application/json; charset=utf-8';
    
        return additionalHeaders;
    }
    
    private stringifyData(data:any, config:any):string {
        let stringifiedData: string;

        if (data) {
            stringifiedData = JSON.stringify(data, (key, value) => {
                /// <param name="key" type="String">Description</param>
                if (key.endsWith('@odata.bind') || key.endsWith('@odata.id')) {
                    if (typeof value === 'string' && !value.startsWith('$')) {
                        //remove brackets in guid
                        if (/\(\{[\w\d-]+\}\)/g.test(value)) {
                            value = value.replace(/(.+)\(\{([\w\d-]+)\}\)/g, '$1($2)');
                        }
    
                        if (config.useEntityNames) {
                            //replace entity name with collection name
                            const regularExpression = /([\w_]+)(\([\d\w-]+\))$/;
                            const valueParts = regularExpression.exec(value);

                            if (valueParts.length > 2) {
                                const collectionName = this._findCollectionName(valueParts[1]);
    
                                if (!Utilities.IsNull(collectionName)) {
                                    value = value.replace(regularExpression, collectionName + '$2');
                                }
                            }
                        }
    
                        if (!value.startsWith(config.webApiUrl)) {
                            //add full web api url if it's not set
                            if (key.endsWith('@odata.bind')) {
                                if (!value.startsWith('/')) {
                                    value = '/' + value;
                                }
                            }
                            else {
                                value = config.webApiUrl + value.replace(/^\//, '');
                            }
                        }
                    }
                }
                else
                    if (key.startsWith('oData') ||
                        key.endsWith('_Formatted') ||
                        key.endsWith('_NavigationProperty') ||
                        key.endsWith('_LogicalName')) {
                        value = undefined;
                    }
    
                return value;
            });
    
            stringifiedData = stringifiedData.replace(/[\u007F-\uFFFF]/g, function (chr) {
                return "\\u" + ("0000" + chr.charCodeAt(0).toString(16)).substr(-4);
            });
        }
    
        return stringifiedData;
    }
    
    private batchRequestCollection = [];
    private responseParseParams = [];
    
    /**
     * Sends a request to given URL with given parameters
     *
     * @param {string} method - Method of the request.
     * @param {string} path - Request path.
     * @param {Object} config - DynamicsWebApi config.
     * @param {Object} [data] - Data to send in the request.
     * @param {Object} [additionalHeaders] - Object with additional headers. IMPORTANT! This object does not contain default headers needed for every request.
     * @param {any} [responseParams] - parameters for parsing the response
     * @param {Function} successCallback - A callback called on success of the request.
     * @param {Function} errorCallback - A callback called when a request failed.
     * @param {boolean} [isBatch] - Indicates whether the request is a Batch request or not. Default: false
     * @param {boolean} [isAsync] - Indicates whether the request should be made synchronously or asynchronously.
     */
    public sendRequest(method:string, path:string, config:any, data?:any, additionalHeaders?:any, responseParams?:any, successCallback?:any, errorCallback?:any, isBatch?:boolean, isAsync?:boolean) {    
        additionalHeaders = additionalHeaders || {};
        responseParams = responseParams || {};
    
        //add response parameters to parse
        this.responseParseParams.push(responseParams);
    
        //stringify passed data
        let stringifiedData = this.stringifyData(data, config);
    
        if (isBatch) {
            this.batchRequestCollection.push({
                method: method, path: path, config: config, data: stringifiedData, headers: additionalHeaders
            });

            return;
        }
    
        if (path === '$batch') {
            let batchResult = RequestUtilities.convertToBatch(this.batchRequestCollection);
    
            stringifiedData = batchResult.body;
    
            //clear an array of requests
            this.batchRequestCollection.length = 0;
    
            additionalHeaders = this.setStandardHeaders(additionalHeaders);
            additionalHeaders['Content-Type'] = 'multipart/mixed;boundary=' + batchResult.boundary;
        }
        else {
            additionalHeaders = this.setStandardHeaders(additionalHeaders);
        }
    
        responseParams.convertedToBatch = false;
    
        //if the URL contains more characters than max possible limit, convert the request to a batch request
        if (path.length > 2000) {
            const batchBoundary = 'dwa_batch_' + Utilities.NewGuid();
    
            let batchBody = [];
            batchBody.push('--' + batchBoundary);
            batchBody.push('Content-Type: application/http');
            batchBody.push('Content-Transfer-Encoding: binary\n');
            batchBody.push(method + ' ' + config.webApiUrl + path + ' HTTP/1.1');
    
            for (const key in additionalHeaders) {
                if (key === 'Authorization') {
                    continue;
                }
    
                batchBody.push(key + ': ' + additionalHeaders[key]);
    
                //authorization header is an exception. bug #27
                delete additionalHeaders[key];
            }
    
            batchBody.push('\n--' + batchBoundary + '--');
    
            stringifiedData = batchBody.join('\n');
    
            additionalHeaders = this.setStandardHeaders(additionalHeaders);
            additionalHeaders['Content-Type'] = 'multipart/mixed;boundary=' + batchBoundary;
            path = '$batch';
            method = 'POST';
    
            responseParams.convertedToBatch = true;
        }
    
        if (config.impersonate && !additionalHeaders['MSCRMCallerID']) {
            additionalHeaders['MSCRMCallerID'] = config.impersonate;
        }
    
        const sendInternalRequest = (token) => {
            if (token) {
                if (!additionalHeaders) {
                    additionalHeaders = {};
                }
                additionalHeaders['Authorization'] = 'Bearer ' +
                    (token.hasOwnProperty('accessToken') ?
                        token.accessToken :
                        token);
            }
    
            this._executeRequest({
                config: config,
                method: method,
                uri: Utilities.EnforceTrailingSlash(config.webApiUrl) + path,
                data: stringifiedData,
                additionalHeaders: additionalHeaders,
                responseParams: this.responseParseParams,
                successCallback: successCallback,
                errorCallback: errorCallback,
                isAsync: isAsync,
                timeout: config.timeout
            });
        };
    
        //call a token refresh callback only if it is set and there is no "Authorization" header set yet
        if (config.onTokenRefresh && (!additionalHeaders || (additionalHeaders && !additionalHeaders['Authorization']))) {
            config.onTokenRefresh(sendInternalRequest);
        }
        else {
            sendInternalRequest(config.accessToken);
        }
    }
    
    private _getEntityNames(entityName, config, successCallback, errorCallback) {
        const resolve = function (result) {
            this._entityNames = {};

            for (let i = 0; i < result.data.value.length; i++) {
                this._entityNames[result.data.value[i].LogicalName] = result.data.value[i].LogicalCollectionName;
            }
    
            successCallback(this.findCollectionName(entityName));
        };
    
        const reject = error => {
            errorCallback({ message: 'Unable to fetch EntityDefinitions. Error: ' + error.message });
        };
    
        const request = RequestConverter.convertRequest({
            collection: 'EntityDefinitions',
            select: ['LogicalCollectionName', 'LogicalName'],
            noCache: true
        }, config);
    
        this.sendRequest('GET', request.url, config, null, request.headers, null, resolve, reject, false, request.async);
    }
    
    private _isEntityNameException(entityName) {
        const exceptions = [
            'EntityDefinitions', '$metadata', 'RelationshipDefinitions',
            'GlobalOptionSetDefinitions', 'ManagedPropertyDefinitions'];
    
        return exceptions.indexOf(entityName) > -1;
    }

    /**
     * Searches for a collection name by provided entity name in a cached entity metadata.
     * The returned collection name can be null.
     *
     * @param {string} entityName - entity name
     * @returns {string} - a collection name
     */
    private _findCollectionName(entityName:string) {
        let collectionName = null;

        if (!Utilities.IsNull(this._entityNames)) {
            collectionName = this._entityNames[entityName];

            if (Utilities.IsNull(collectionName)) {
                for (const key in this._entityNames) {
                    if (this._entityNames[key] === entityName) {
                        return entityName;
                    }
                }
            }
        }

        return collectionName;
    }

    private _getCollectionName(entityName, config, successCallback, errorCallback) {
        if (this._isEntityNameException(entityName) || Utilities.IsNull(entityName)) {
            successCallback(entityName);

            return;
        }
    
        entityName = entityName.toLowerCase();
    
        if (!config.useEntityNames) {
            successCallback(entityName);
            
            return;
        }
    
        try {
            const collectionName = this._findCollectionName(entityName);
    
            if (Utilities.IsNull(collectionName)) {
                this._getEntityNames(entityName, config, successCallback, errorCallback);
            }
            else {
                successCallback(collectionName);
            }
        }
        catch (error) {
            errorCallback({ message: 'Unable to fetch Collection Names. Error: ' + error.message });
        }
    }
    
    public makeDiscoveryRequest(request:any, config:DynamicsWebApi.Config, resolve:any, reject:any): any {
        this.sendRequest("GET", `api/discovery/v8.0/${!Utilities.IsNull(request) ? request.collection : "Instances"}`, config, null, null, null, resolve, reject, request ? request.isBatch : false, true);
    }

    public makeRequest(method:string, request:any, config:DynamicsWebApi.Config, responseParams:any, resolve:any, reject:any): any {
        const successCallback = (collectionName) => {
            request.collection = collectionName;

            const result = RequestConverter.convertRequest(request, config);

            this.sendRequest(method, result.url, config, request.data || request.entity, result.headers, responseParams, resolve, reject, request.isBatch, result.async);
        };

        this._getCollectionName(request.collection, config, successCallback, reject);
    }

    private _executeRequest (options) {
        const method = options.method;
        const uri = options.uri;
        const data = options.data;
        const additionalHeaders = options.additionalHeaders;
        const responseParams = options.responseParams;
        const successCallback = options.successCallback;
        const errorCallback = options.errorCallback;
        const timeout = options.timeout;
        const ntlmAuth = options.config && (!Utilities.IsNull(options.config.domain) || !Utilities.IsNull(options.config.workstation));

        let headers = {};
    
        if (data) {
            headers["Content-Type"] = additionalHeaders['Content-Type'];
            headers["Content-Length"] = data.length;
    
            delete additionalHeaders['Content-Type'];
        }
    
        //set additional headers
        for (const key in additionalHeaders) {
            headers[key] = additionalHeaders[key];
        }
    
        const parsedUrl = vscode.Uri.parse(uri);
        const protocol = parsedUrl.scheme.replace(':','');
        const handleResponse = this._handleResponse;

        let protocolInterface = ntlmAuth ? httpntlm : protocol === 'http' ? http : https;
        let internalOptions;

        if (protocolInterface === httpntlm)
        {
            console.log(`WebAPI: [${method}] ${uri} - (${headers ? Object.keys(headers).length : 0} headers / ${data ? data.length : 0} bytes)`);

            protocolInterface[method.toLowerCase()]({
                url: uri,
                username: options.config.username,
                password: options.config.password,
                workstation: options.config.workstation || '',
                domain: options.config.domain || '',
                body: data,
                headers: headers
            }, function (error, res){               
                console.log(`WebAPI: [${method}] ${uri}: return ${res.statusCode} - ${res.body.length} byte(s)`);

                if (error) 
                { 
                    responseParams.length = 0;
    
                    errorCallback(error);
                }
               
                handleResponse(res, responseParams, successCallback, errorCallback, res.body);
            });
        }
        else
        {
            internalOptions = {
                hostname: parsedUrl.authority,
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
                var proxyUrl = vscode.Uri.parse(process.env.http_proxy);
                headers['host'] = parsedUrl.authority;
                internalOptions = {
                    hostname: proxyUrl.authority,
                    path: parsedUrl.path,
                    method: method,
                    timeout: timeout,
                    headers: headers
                };
            }

            const request = protocolInterface.request(internalOptions, (res) => {
                let rawData = '';

                res.setEncoding('utf8');
                res.on('data', (chunk) => { rawData += chunk; });
                res.on('end', () => {
                    console.log(`WebAPI: [${method}] ${uri}: return ${res.statusCode} - ${rawData.length} byte(s)`);

                    handleResponse(res, responseParams, successCallback, errorCallback, rawData);
                });
            });
        
            if (internalOptions.timeout) {
                request.setTimeout(internalOptions.timeout, () => { request.abort(); });
            }
        
            request.on('error', (error) => {
                responseParams.length = 0;
    
                errorCallback(error);
            });
        
            console.log(`WebAPI: [${method}] ${uri} - (${headers ? Object.keys(headers).length : 0} headers / ${data ? data.length : 0} bytes)`);

            if (data) {
                request.write(data);
            }

            request.end();
        }
    }

    private _handleResponse(res:any, responseParams:any, successCallback: any, errorCallback: any, rawData: any): void
    {
            switch (res.statusCode) {
                case 200: // Success with content returned in response body.
                case 201: // Success with content returned in response body.
                case 204: // Success with no content returned in response body.
                case 304: {// Success with Not Modified
                    const responseData = ResponseUtilities.parseResponse(rawData, res.headers, responseParams);
                    const response = {
                        data: responseData,
                        headers: res.headers,
                        status: res.statusCode
                    };

                    successCallback(response);

                    break;
                }
                default: // All other statuses are error cases.
                    let crmError;

                    try {
                        const errorParsed = JSON.parse(rawData);

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
                    
                    let error;
                    error = {};

                    Object.keys(crmError).forEach(k => { error[k] = crmError[k]; });
                    error.status = res.statusCode;
                    errorCallback(error);
                    
                    break;
            }

            responseParams.length = 0;
    }
}
