import Utility from '../utilities/Utility';
import Authentication from "../../../core/security/Authentication";
import RequestConverter from '../utilities/RequestConverter';
import BatchConverter from '../utilities/BatchConverter';
import xhrRequest from "../../../core/http/xhrRequest";
import nodeJsRequest from "../../../core/http/nodeJsRequest";
import odataResponseNodeJs from "./odataResponse.nodejs";
import odataResponseXhr from "./odataResponse.xhr";
import { DynamicsWebApi } from "../DynamicsWebApi";
import { Credential, OAuthCredential } from '../../../core/security/Types';

let _entityNames;

/**
 * Searches for a collection name by provided entity name in a cached entity metadata.
 * The returned collection name can be null.
 *
 * @param {string} entityName - entity name
 * @returns {string} - a collection name
 */
export function findCollectionName(entityName: string): string {
    const xrmInternal = Utility.getXrmInternal();

    if (!Utility.isNull(xrmInternal) && typeof xrmInternal.getEntitySetName === "function") {
        return xrmInternal.getEntitySetName(entityName) || entityName;
    }

    let collectionName = null;

    if (!Utility.isNull(_entityNames)) {
        collectionName = _entityNames[entityName];

        if (Utility.isNull(collectionName)) {
            for (let key in _entityNames) {
                if (_entityNames[key] === entityName) {
                    return entityName;
                }
            }
        }
    }

    return collectionName;
}

function setStandardHeaders(additionalHeaders: { [key: string]: string; }): { [key: string]: string } {
    additionalHeaders["Accept"] = "application/json";
    additionalHeaders["OData-MaxVersion"] = "4.0";
    additionalHeaders["OData-Version"] = "4.0";
    additionalHeaders['Content-Type'] = 'application/json; charset=utf-8';

    return additionalHeaders;
}

function stringifyData(data: any, config: any) {
    let stringifiedData;

    if (data) {
        stringifiedData = JSON.stringify(data, (key: string, value: any) => {
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
                            const collectionName = findCollectionName(valueParts[1]);

                            if (!Utility.isNull(collectionName)) {
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

let batchRequestCollection = [];
let responseParseParams = [];

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
 * @param {boolean} [isDiscovery] - Indicates whether the request should be a discovery request.
 */
export function sendRequest(method: string, path: string, config: DynamicsWebApi.Config, data: any, additionalHeaders: { [key: string]: string }, responseParams: any, successCallback: (response:any) => void, errorCallback: (error:any) => void, isBatch: boolean, isAsync: boolean, isDiscovery?: boolean): void {
    additionalHeaders = additionalHeaders || {};
    responseParams = responseParams || {};
    isDiscovery = isDiscovery || path === "Instances";

    //add response parameters to parse
    responseParseParams.push(responseParams);

    //stringify passed data
    let stringifiedData = stringifyData(data, config);

    if (isBatch) {
        batchRequestCollection.push({
            method: method, path: path, config: config, data: stringifiedData, headers: additionalHeaders
        });

        return;
    }

    if (path === '$batch') {
        const batchResult = BatchConverter.convertToBatch(batchRequestCollection);

        stringifiedData = batchResult.body;

        //clear an array of requests
        batchRequestCollection.length = 0;

        additionalHeaders = setStandardHeaders(additionalHeaders);
        additionalHeaders['Content-Type'] = 'multipart/mixed;boundary=' + batchResult.boundary;
    }
    else {
        additionalHeaders = setStandardHeaders(additionalHeaders);
    }

    responseParams.convertedToBatch = false;

    //if the URL contains more characters than max possible limit, convert the request to a batch request
    if (path.length > 2000) {
        const batchBoundary = 'dwa_batch_' + Utility.generateUUID();

        let batchBody = [];
        batchBody.push('--' + batchBoundary);
        batchBody.push('Content-Type: application/http');
        batchBody.push('Content-Transfer-Encoding: binary\n');
        batchBody.push(method + ' ' + config.webApiUrl + path + ' HTTP/1.1');

        for (var key in additionalHeaders) {
            if (key === 'Authorization') {
                continue;
            }

            batchBody.push(key + ': ' + additionalHeaders[key]);

            //authorization header is an exception. bug #27
            delete additionalHeaders[key];
        }

        batchBody.push('\n--' + batchBoundary + '--');

        stringifiedData = batchBody.join('\n');

        additionalHeaders = setStandardHeaders(additionalHeaders);
        additionalHeaders['Content-Type'] = 'multipart/mixed;boundary=' + batchBoundary;
        path = '$batch';
        method = 'POST';

        responseParams.convertedToBatch = true;
    }

    if (config.impersonate && !additionalHeaders['MSCRMCallerID']) {
        additionalHeaders['MSCRMCallerID'] = config.impersonate;
    }

    let executeRequest;
    let responseHandler;

    /* develblock:start */
    if (typeof XMLHttpRequest !== 'undefined') {
        /* develblock:end */
        executeRequest = xhrRequest;
        responseHandler = odataResponseXhr.bind(this);
        /* develblock:start */
    }
    else if (typeof process !== 'undefined') {
        executeRequest = nodeJsRequest;
        responseHandler = odataResponseNodeJs.bind(this);
    }
    /* develblock:end */

    const sendInternalRequest = (token?:string | any) => {
        if (token) {
            if (!additionalHeaders) {
                additionalHeaders = {};
            }
            additionalHeaders['Authorization'] = 'Bearer ' +
                (token.hasOwnProperty('accessToken') ?
                    token.accessToken :
                    token.toString());
        }

        executeRequest({
            credentials: config.credentials,
            method: method,
            connectionId: config.id,
            uri: (isDiscovery ? config.discoveryUrl : config.webApiUrl) + path,
            data: stringifiedData,
            additionalHeaders: additionalHeaders,
            responseParams: responseParseParams,
            responseHandler: responseHandler,
            successCallback: successCallback,
            errorCallback: errorCallback,
            isAsync: isAsync,
            timeout: config.timeout
        });
    };

    //call a token refresh callback only if it is set and there is no "Authorization" header set yet
    if (config.credentials && Credential.requireToken(config.credentials) && typeof config.onTokenRefresh !== 'undefined' && (!additionalHeaders || (additionalHeaders && !additionalHeaders['Authorization']))) {
        // Attempt authentication this way.
        if (((config.id && config.credentials && config.credentials.isSecure) || config.credentials) && config.type !== DynamicsWebApi.ConfigType.OnPremises) {
            Authentication(config.id, config.credentials, isDiscovery ? `https://disco.${Utility.crmHostSuffix(config.webApiUrl)}/` : undefined)
                .then(auth => {
                    if (!auth.success) {
                        config.onTokenRefresh(sendInternalRequest);
                    } else {
                        sendInternalRequest(auth.response);
                    }
                });
        }
    }
    else {
        sendInternalRequest();
    }
}

function _getEntityNames(entityName: string, config: DynamicsWebApi.Config, successCallback?:(value?:any) => any, errorCallback?:(reason?:any) => any) {
    const xrmUtility = Utility.getXrmUtility();

    //try using Xrm.Utility.getEntityMetadata first (because D365 caches metadata)
    if (!Utility.isNull(xrmUtility) && typeof xrmUtility.getEntityMetadata === "function") {
        xrmUtility.getEntityMetadata(entityName).then(response => {
            if (successCallback) { successCallback(response.EntitySetName); }
        }, errorCallback);
    }
    else {
        //make a web api call for Node.js apps
        const resolve = result => {
            _entityNames = {};

            for (var i = 0; i < result.data.value.length; i++) {
                _entityNames[result.data.value[i].LogicalName] = result.data.value[i].EntitySetName;
            }

            if (successCallback) {
                successCallback(findCollectionName(entityName));
            }
        };

        const reject = error => {
            if (errorCallback) {
                errorCallback({ message: 'Unable to fetch EntityDefinitions. Error: ' + error.message });
            }
        };

        const request = RequestConverter.convertRequest({
            collection: 'EntityDefinitions',
            select: ['EntitySetName', 'LogicalName'],
            noCache: true
        }, 'retrieveMultiple', config);

        sendRequest('GET', request.url, config, null, request.headers, null, resolve, reject, false, request.async);
    }
}

function _isEntityNameException(entityName: string) {
    var exceptions = [
        'EntityDefinitions', '$metadata', 'RelationshipDefinitions',
        'GlobalOptionSetDefinitions', 'ManagedPropertyDefinitions'];

    return exceptions.indexOf(entityName) > -1;
}

function _getCollectionName(entityName: string, config: DynamicsWebApi.Config, resolve?:(value?:any) => any, reject?:(reason?:any) => any) {
    if (_isEntityNameException(entityName) || Utility.isNull(entityName)) {
        resolve(entityName);
        return;
    }

    entityName = entityName.toLowerCase();

    if (!config.useEntityNames) {
        resolve(entityName);
        return;
    }

    try {
        var collectionName = findCollectionName(entityName);

        if (Utility.isNull(collectionName)) {
            _getEntityNames(entityName, config, resolve, reject);
        }
        else {
            resolve(collectionName);
        }
    }
    catch (error) {
        reject({ message: 'Unable to fetch Collection Names. Error: ' + error.message });
    }
}

export function makeDiscoveryRequest(request:any, config:DynamicsWebApi.Config, resolve?:(value?:any) => any, reject?:(reason?:any) => any): void {
    return sendRequest("GET", `${request ? request.collection : "Instances"}`, config, null, null, null, resolve, reject, request ? request.isBatch : false, true);
}

export function makeRequest(method: string, request: any, functionName: string, config: any, responseParams?: any, resolve?:(value?:any) => any, reject?:(reason?:any) => any): void {
    const successCallback = (collectionName: string) => {
        request.collection = collectionName;
        
        const result = RequestConverter.convertRequest(request, functionName, config);

        return sendRequest(method, result.url, config, request.data || request.entity, result.headers, responseParams, resolve, reject, request.isBatch, result.async);
    };

    return _getCollectionName(request.collection, config, successCallback, reject);
}