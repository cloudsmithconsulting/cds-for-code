"use strict";

import { ICredential } from "../../core/security/Types";

import Utility from './utilities/Utility';
import ErrorHelper from './helpers/ErrorHelper';
import * as Request from './requests/sendRequest';
import { Query } from "./FetchQuery";
import FetchQueryResolver from "./FetchQueryResolver";

//string es6 polyfill
if (!String.prototype.endsWith || !String.prototype.startsWith) {
    require("./polyfills/string-es6");
}

export namespace DynamicsWebApi {
    /**
     * Dynamics Web Api Request
     * @typedef {Object} UserRequest
     * @property {boolean} async - XHR requests only! Indicates whether the requests should be made synchronously or asynchronously. Default value is 'true' (asynchronously).
     * @property {string} collection - The name of the Entity Collection or Entity Logical name.
     * @property {string} id - A String representing the Primary Key (GUID) of the record.
     * @property {Array} select - An Array (of Strings) representing the $select OData System Query Option to control which attributes will be returned.
     * @property {Array} expand - An array of Expand Objects (described below the table) representing the $expand OData System Query Option value to control which related records are also returned.
     * @property {string} key - A String representing collection record's Primary Key (GUID) or Alternate Key(s).
     * @property {string} filter - Use the $filter system query option to set criteria for which entities will be returned.
     * @property {number} maxPageSize - Sets the odata.maxpagesize preference value to request the number of entities returned in the response.
     * @property {boolean} count - Boolean that sets the $count system query option with a value of true to include a count of entities that match the filter criteria up to 5000 (per page). Do not use $top with $count!
     * @property {number} top - Limit the number of results returned by using the $top system query option. Do not use $top with $count!
     * @property {Array} orderBy - An Array (of Strings) representing the order in which items are returned using the $orderby system query option. Use the asc or desc suffix to specify ascending or descending order respectively. The default is ascending if the suffix isn't applied.
     * @property {string} includeAnnotations - Sets Prefer header with value "odata.include-annotations=" and the specified annotation. Annotations provide additional information about lookups, options sets and other complex attribute types.
     * @property {string} ifmatch - Sets If-Match header value that enables to use conditional retrieval or optimistic concurrency in applicable requests.
     * @property {string} ifnonematch - Sets If-None-Match header value that enables to use conditional retrieval in applicable requests.
     * @property {boolean} returnRepresentation - Sets Prefer header request with value "return=representation". Use this property to return just created or updated entity in a single request.
     * @property {Object} entity - A JavaScript object with properties corresponding to the logical name of entity attributes (exceptions are lookups and single-valued navigation properties).
     * @property {string} impersonate - Impersonates the user. A String representing the GUID value for the Dynamics 365 system user id.
     * @property {string} navigationProperty - A String representing the name of a single-valued navigation property. Useful when needed to retrieve information about a related record in a single request.
     * @property {string} navigationPropertyKey - v.1.4.3+ A String representing navigation property's Primary Key (GUID) or Alternate Key(s). (For example, to retrieve Attribute Metadata).
     * @property {string} metadataAttributeType - v.1.4.3+ Casts the AttributeMetadata to a specific type. (Used in requests to Attribute Metadata).
     * @property {boolean} noCache - If set to 'true', DynamicsWebApi adds a request header 'Cache-Control: no-cache'. Default value is 'false'.
     * @property {string} savedQuery - A String representing the GUID value of the saved query.
     * @property {string} userQuery - A String representing the GUID value of the user query.
     * @property {boolean} mergeLabels - If set to 'true', DynamicsWebApi adds a request header 'MSCRM.MergeLabels: true'. Default value is 'false'.
     * @property {boolean} isBatch - If set to 'true', DynamicsWebApi treats a request as a part of a batch request. Call ExecuteBatch to execute all requests in a batch. Default value is 'false'.
     * @property {string} contentId - BATCH REQUESTS ONLY! Sets Content-ID header or references request in a Change Set.
     * @property {boolean} trackChanges - Preference header 'odata.track-changes' is used to request that a delta link be returned which can subsequently be used to retrieve entity changes.
     * @property {string} deltaLink - Delta link can be used to retrieve entity changes. Important! Change Tracking must be enabled for the entity.
     */
    export type UserRequest = CreateRequest | UpdateRequest | UpsertRequest | DeleteRequest | RetrieveMultipleRequest | RetrieveRequest;

    export interface Expand {
        /**An Array(of Strings) representing the $select OData System Query Option to control which attributes will be returned. */
        select?: string[];
        /**Use the $filter system query option to set criteria for which entities will be returned. */
        filter?: string;
        /**Limit the number of results returned by using the $top system query option.Do not use $top with $count! */
        top?: number;
        /**An Array(of Strings) representing the order in which items are returned using the $orderby system query option.Use the asc or desc suffix to specify ascending or descending order respectively.The default is ascending if the suffix isn't applied. */
        orderBy?: string[];
        /**A name of a single-valued navigation property which needs to be expanded. */
        property?: string;
    }

    export interface Request {
        /**XHR requests only! Indicates whether the requests should be made synchronously or asynchronously.Default value is 'true'(asynchronously). */
        async?: boolean;
        /**The name of the Entity Collection or Entity Logical name. */
        collection?: string;
        /**Impersonates the user.A String representing the GUID value for the Dynamics 365 system user id. */
        impersonate?: string;
        /** If set to 'true', DynamicsWebApi adds a request header 'Cache-Control: no-cache'.Default value is 'false'. */
        noCache?: boolean;
        /** Authorization Token. If set, onTokenRefresh will not be called. */
        token?: string;
    }

    export interface CRUDRequest extends Request {
        /** DEPRECATED Use "key" instead. A String representing the Primary Key(GUID) of the record. */
        id?: string;
        /**A String representing collection record's Primary Key (GUID) or Alternate Key(s). */
        key?: string;
    }

    export interface CreateRequest extends CRUDRequest {
        /**v.1.3.4+ Web API v9+ only! Boolean that enables duplicate detection. */
        duplicateDetection?: boolean;
        /**A JavaScript object with properties corresponding to the logical name of entity attributes(exceptions are lookups and single-valued navigation properties). */
        entity?: any;
        /**An array of Expand Objects(described below the table) representing the $expand OData System Query Option value to control which related records are also returned. */
        expand?: Expand[];
        /**Sets Prefer header with value "odata.include-annotations=" and the specified annotation.Annotations provide additional information about lookups, options sets and other complex attribute types. */
        includeAnnotations?: string;
        /**A String representing the name of a single - valued navigation property.Useful when needed to retrieve information about a related record in a single request. */
        navigationProperty?: string;
        /**v.1.4.3 + A String representing navigation property's Primary Key (GUID) or Alternate Key(s). (For example, to retrieve Attribute Metadata). */
        navigationPropertyKey?: string;
        /**Sets Prefer header request with value "return=representation".Use this property to return just created or updated entity in a single request. */
        returnRepresentation?: boolean;
        /**BATCH REQUESTS ONLY! Sets Content-ID header or references request in a Change Set. */
        contentId?: string;
    }

    export interface UpdateRequestBase extends CRUDRequest {
        /**v.1.3.4+ Web API v9+ only! Boolean that enables duplicate detection. */
        duplicateDetection?: boolean;
        /**A JavaScript object with properties corresponding to the logical name of entity attributes(exceptions are lookups and single-valued navigation properties). */
        entity?: any;
        /**An array of Expand Objects(described below the table) representing the $expand OData System Query Option value to control which related records are also returned. */
        expand?: Expand[];
        /**Sets If-Match header value that enables to use conditional retrieval or optimistic concurrency in applicable requests.*/
        ifmatch?: string;
        /**Sets Prefer header with value "odata.include-annotations=" and the specified annotation.Annotations provide additional information about lookups, options sets and other complex attribute types. */
        includeAnnotations?: string;
        /**Sets Prefer header request with value "return=representation".Use this property to return just created or updated entity in a single request. */
        returnRepresentation?: boolean;
        /**An Array(of Strings) representing the $select OData System Query Option to control which attributes will be returned. */
        select?: string[];
        /**BATCH REQUESTS ONLY! Sets Content-ID header or references request in a Change Set. */
        contentId?: string;
    }

    export interface UpdateRequest extends UpdateRequestBase {
        /**If set to 'true', DynamicsWebApi adds a request header 'MSCRM.MergeLabels: true'. Default value is 'false' */
        mergeLabels?: boolean;
    }

    export interface UpsertRequest extends UpdateRequestBase {
        /**Sets If-None-Match header value that enables to use conditional retrieval in applicable requests. */
        ifnonematch?: string;
        /**v.1.4.3 + Casts the AttributeMetadata to a specific type. (Used in requests to Attribute Metadata). */
        metadataAttributeType?: string;
        /**A String representing the name of a single - valued navigation property.Useful when needed to retrieve information about a related record in a single request. */
        navigationProperty?: string;
        /**v.1.4.3 + A String representing navigation property's Primary Key (GUID) or Alternate Key(s). (For example, to retrieve Attribute Metadata). */
        navigationPropertyKey?: string;
    }

    export interface DeleteRequest extends CRUDRequest {
        /**Sets If-Match header value that enables to use conditional retrieval or optimistic concurrency in applicable requests.*/
        ifmatch?: string;
        /**BATCH REQUESTS ONLY! Sets Content-ID header or references request in a Change Set. */
        contentId?: string;
    }

    export interface RetrieveRequest extends CRUDRequest {
        /**An array of Expand Objects(described below the table) representing the $expand OData System Query Option value to control which related records are also returned. */
        expand?: Expand[];
        /**Use the $filter system query option to set criteria for which entities will be returned. */
        filter?: string;
        /**Sets If-Match header value that enables to use conditional retrieval or optimistic concurrency in applicable requests.*/
        ifmatch?: string;
        /**Sets If-None-Match header value that enables to use conditional retrieval in applicable requests. */
        ifnonematch?: string;
        /**Sets Prefer header with value "odata.include-annotations=" and the specified annotation.Annotations provide additional information about lookups, options sets and other complex attribute types. */
        includeAnnotations?: string;
        /**v.1.4.3 + Casts the AttributeMetadata to a specific type. (Used in requests to Attribute Metadata). */
        metadataAttributeType?: string;
        /**A String representing the name of a single - valued navigation property.Useful when needed to retrieve information about a related record in a single request. */
        navigationProperty?: string;
        /**v.1.4.3 + A String representing navigation property's Primary Key (GUID) or Alternate Key(s). (For example, to retrieve Attribute Metadata). */
        navigationPropertyKey?: string;
        /**A String representing the GUID value of the saved query. */
        savedQuery?: string;
        /**An Array(of Strings) representing the $select OData System Query Option to control which attributes will be returned. */
        select?: string[];
        /**A String representing the GUID value of the user query. */
        userQuery?: string;
    }

    export interface RetrieveMultipleRequest extends Request {
        /**An array of Expand Objects(described below the table) representing the $expand OData System Query Option value to control which related records are also returned. */
        expand?: Expand[];
        /**Boolean that sets the $count system query option with a value of true to include a count of entities that match the filter criteria up to 5000(per page).Do not use $top with $count! */
        count?: boolean;
        /**Use the $filter system query option to set criteria for which entities will be returned. */
        filter?: string;
        /**Sets Prefer header with value "odata.include-annotations=" and the specified annotation.Annotations provide additional information about lookups, options sets and other complex attribute types. */
        includeAnnotations?: string;
        /**Sets the odata.maxpagesize preference value to request the number of entities returned in the response. */
        maxPageSize?: number;
        /**An Array(of string) representing the order in which items are returned using the $orderby system query option.Use the asc or desc suffix to specify ascending or descending order respectively.The default is ascending if the suffix isn't applied. */
        orderBy?: string[];
        /**An Array(of Strings) representing the $select OData System Query Option to control which attributes will be returned. */
        select?: string[];
        /**Limit the number of results returned by using the $top system query option.Do not use $top with $count! */
        top?: number;
        /**Sets Prefer header with value 'odata.track-changes' to request that a delta link be returned which can subsequently be used to retrieve entity changes. */
        trackChanges?: boolean;
    }

    export enum ConfigType { 
        OnPremises = 0,
        Online = 1,
        AzureAdAuth = 2,
        IFD = 3
    }

    /**
     * Configuration object for DynamicsWebApi
     * @typedef {object} DWAConfig
     * @property {string} webApiUrl - A String representing the GUID value for the Dynamics 365 system user id. Impersonates the user.
     * @property {string} webApiVersion - The version of Web API to use, for example: "8.1"
     * @property {string} impersonate - A String representing a URL to Web API (webApiVersion not required if webApiUrl specified) [not used inside of CRM]
     * @property {Function} onTokenRefresh - A function that is called when a security token needs to be refreshed.
     * @property {string} includeAnnotations - Sets Prefer header with value "odata.include-annotations=" and the specified annotation. Annotations provide additional information about lookups, options sets and other complex attribute types.
     * @property {string} maxPageSize - Sets the odata.maxpagesize preference value to request the number of entities returned in the response.
     * @property {boolean} returnRepresentation - Sets Prefer header request with value "return=representation". Use this property to return just created or updated entity in a single request.
     * @property {boolean} useEntityNames - Indicates whether to use Entity Logical Names instead of Collection Logical Names.
    */
    export interface Config {
        /** the unique ID of the configuration */
        id: string; 
        /** The name of the connection */
        name: string;
        /** The type of connection/configuration this relates to */
        type: ConfigType;
        /**A String representing the GUID value for the Dynamics 365 system user id.Impersonates the user. */
        webApiUrl?: string;
        /**The version of Web API to use, for example: "8.1" */
        webApiVersion?: string;
        /** The credentials to use when connecting to the API endpoint */
        credentials: ICredential;
        /**The ID of the organization */
        orgId?: string;
        /**The name of the organization */
        orgName?: string;
        /**A String representing a URL to Web API(webApiVersion not required if webApiUrl specified)[not used inside of CRM] */
        impersonate?: string;
        /**A function that is called when a security token needs to be refreshed. */
        onTokenRefresh?: (callback: OnTokenAcquiredCallback) => void;
        /**Sets Prefer header with value "odata.include-annotations=" and the specified annotation.Annotations provide additional information about lookups, options sets and other complex attribute types.*/
        includeAnnotations?: string;
        /**Sets the odata.maxpagesize preference value to request the number of entities returned in the response. */
        maxPageSize?: string;
        /**Sets Prefer header request with value "return=representation".Use this property to return just created or updated entity in a single request.*/
        returnRepresentation?: boolean;
        /**Indicates whether to use Entity Logical Names instead of Collection Logical Names.*/
        useEntityNames?: boolean;
        /**Sets a number of milliseconds before a request times out */
        timeout?: number;
    }

    /** Callback with an acquired token called by DynamicsWebApi; "token" argument can be a string or an object with a property {accessToken: <token>}  */
    export interface OnTokenAcquiredCallback {
        (token: any): void;
    }

    export interface RequestError extends Error {
        /**This code is not related to the http status code and is frequently empty */
        code?: string;
        /**A message describing the error */
        message: string;
        /**HTTP status code */
        status?: number;
        /**HTTP status text. Frequently empty */
        statusText?: string;
        /**Details about an error */
        innererror?: {
            /**A message describing the error, this is frequently the same as the outer message */
            message?: string;
            /**Microsoft.Crm.CrmHttpException */
            type?: string;
            /**Details from the server about where the error occurred */
            stacktrace?: string;
        };
    }

    export interface Utility {
        /**
         * Searches for a collection name by provided entity name in a cached entity metadata.
         * The returned collection name can be null.
         *
         * @param {string} entityName - entity name
         * @returns {string} a collection name
         */
        getCollectionName: string;
    }

    export class WebApiClient {
        private _internalConfig: DynamicsWebApi.Config;
        private _isBatch: boolean;

        /**
         * Constructor.
         * @constructor
         * @param {DWAConfig} [config] - configuration object
         * @example
         *var dynamicsWebApi = new DynamicsWebApi();
        * @example
        *var dynamicsWebApi = new DynamicsWebApi({ webApiVersion: '9.0' });
        * @example
        *var dynamicsWebApi = new DynamicsWebApi({
        *    webApiUrl: 'https:/myorg.api.crm.dynamics.com/api/data/v9.0/',
        *    includeAnnotations: 'OData.Community.Display.V1.FormattedValue'
        *});
        */
        constructor(readonly config?: DynamicsWebApi.Config) {
            this._internalConfig = {
                id: Utility.generateUUID(),
                webApiVersion: "8.0",
                type: null,
                name: null,
                webApiUrl: null,
                credentials: null,
                impersonate: null,
                onTokenRefresh: null,
                includeAnnotations: null,
                maxPageSize: null,
                returnRepresentation: null
            };

            this._isBatch = false;

            if (!config) {
                config = this._internalConfig;
            } else {
                this.setConfig(config);
            }
        }

        /**
         * Sets DynamicsWebApi configuration parameters.
         *
         * @param config - configuration object
         * @example
            dynamicsWebApi.setConfig({ webApiVersion: '9.0' });
         */
        setConfig(config: DynamicsWebApi.Config): void {
            if (config.webApiVersion) {
                ErrorHelper.stringParameterCheck(config.webApiVersion, "DynamicsWebApi.setConfig", "config.webApiVersion");
                this._internalConfig.webApiVersion = config.webApiVersion;
            }

            if (config.webApiUrl) {
                ErrorHelper.stringParameterCheck(config.webApiUrl, "DynamicsWebApi.setConfig", "config.webApiUrl");
                this._internalConfig.webApiUrl = config.webApiUrl;
            } else {
                this._internalConfig.webApiUrl = Utility.initWebApiUrl(this._internalConfig.webApiVersion);
            }

            if (config.credentials) {
                this._internalConfig.credentials = config.credentials;
            }

            if (config.name) {
                this._internalConfig.name = config.name;
            }

            if (config.type) {
                this._internalConfig.type = config.type;
            }

            if (config.impersonate) {
                this._internalConfig.impersonate = ErrorHelper.guidParameterCheck(config.impersonate, "DynamicsWebApi.setConfig", "config.impersonate");
            }

            if (config.onTokenRefresh) {
                ErrorHelper.callbackParameterCheck(config.onTokenRefresh, "DynamicsWebApi.setConfig", "config.onTokenRefresh");
                this._internalConfig.onTokenRefresh = config.onTokenRefresh;
            }

            if (config.includeAnnotations) {
                ErrorHelper.stringParameterCheck(config.includeAnnotations, "DynamicsWebApi.setConfig", "config.includeAnnotations");
                this._internalConfig.includeAnnotations = config.includeAnnotations;
            }

            if (config.timeout) {
                ErrorHelper.numberParameterCheck(config.timeout, "DynamicsWebApi.setConfig", "config.timeout");
                this._internalConfig.timeout = config.timeout;
            }

            if (config.maxPageSize) {
                ErrorHelper.numberParameterCheck(config.maxPageSize, "DynamicsWebApi.setConfig", "config.maxPageSize");
                this._internalConfig.maxPageSize = config.maxPageSize;
            }

            if (config.returnRepresentation) {
                ErrorHelper.boolParameterCheck(config.returnRepresentation, "DynamicsWebApi.setConfig", "config.returnRepresentation");
                this._internalConfig.returnRepresentation = config.returnRepresentation;
            }

            if (config.useEntityNames) {
                ErrorHelper.boolParameterCheck(config.useEntityNames, 'DynamicsWebApi.setConfig', 'config.useEntityNames');
                this._internalConfig.useEntityNames = config.useEntityNames;
            }
        }

        /**
         * Sends an asynchronous request to the discovery service looking for CRM instances.
         *
         * @param request - An Array representing the CollectionName Query Option to control which attributes will be returned.
         * @example
         *  dynamicsWebApi.discover().then(function (orgs) {
         *  }.catch(function (error) {
         *  });
        */
        discover(): Promise<any> {
            return this._makeDiscoveryRequest({ collection: 'Instances' })
                .then(response => {
                     return response.data; 
                });
        }

        /**
         * Sends an asynchronous request to create a new record.
         *
         * @param request - An object that represents all possible options for a current request.
         * @example
            *var lead = {
            *    subject: "Test WebAPI",
            *    firstname: "Test",
            *    lastname: "WebAPI",
            *    jobtitle: "Title"
            *};
            *
            *var request = {
            *    entity: lead,
            *    collection: "leads",
            *    returnRepresentation: true
            *}
            *
            *dynamicsWebApi.createRequest(request).then(function (response) {
            *}.catch(function (error) {
            *});
         */
        createRequest(request: DynamicsWebApi.CreateRequest): Promise<any> {
            ErrorHelper.parameterCheck(request, 'DynamicsWebApi.create', 'request');

            return this._makeRequest('POST', request, 'create')
                .then(function (response) {
                    return response.data;
                });
        }

        /**
         * Sends an asynchronous request to create a new record.
         *
         * @param object - A JavaScript object valid for create operations.
         * @param collection - The name of the Entity Collection or Entity Logical name.
         * @param prefer - Sets a Prefer header value. For example: ['retrun=representation', 'odata.include-annotations="*"'].
         * @param select - An Array representing the $select Query Option to control which attributes will be returned.
         * @example
            *var lead = {
            *    subject: "Test WebAPI",
            *    firstname: "Test",
            *    lastname: "WebAPI",
            *    jobtitle: "Title"
            *};
            *
            *dynamicsWebApi.create(lead, "leads").then(function (id) {
            *}.catch(function (error) {
            *});
         */
        create(object: Object, collection: string, prefer?: string | string[], select?: string[]): Promise<any> {
            ErrorHelper.parameterCheck(object, "DynamicsWebApi.create", "object");
            ErrorHelper.stringParameterCheck(collection, "DynamicsWebApi.create", "collection");

            if (prefer) {
                ErrorHelper.stringOrArrayParameterCheck(prefer, "DynamicsWebApi.create", "prefer");
            }

            if (select) {
                ErrorHelper.arrayParameterCheck(select, "DynamicsWebApi.create", "select");
            }

            const request = {
                collection: collection,
                select: select,
                prefer: prefer,
                entity: object
            };

            return this.createRequest(request);
        }

        /**
         * Sends an asynchronous request to update a record.
         *
         * @param request - An object that represents all possible options for a current request.
         */
        updateRequest(request: DynamicsWebApi.UpdateRequest): Promise<any> {
            ErrorHelper.parameterCheck(request, "DynamicsWebApi.update", "request");

            if (request.ifmatch === null) {
                request.ifmatch = '*'; //to prevent upsert
            }

            //Metadata definitions, cannot be updated using "PATCH" method
            const method = /EntityDefinitions|RelationshipDefinitions|GlobalOptionSetDefinitions/.test(request.collection)
                ? 'PUT' : 'PATCH';

            //copy locally
            const ifmatch = request.ifmatch;

            return this._makeRequest(method, request, 'update', { valueIfEmpty: true })
                .then(response => {
                    return response.data;
                }).catch(error => {
                    if (ifmatch && error.status === 412) {
                        //precondition failed - not updated
                        return false;
                    }
                    //rethrow error otherwise
                    throw error;
                });
        }

        /**
         * Sends an asynchronous request to update a record.
         *
         * @param key - A String representing the GUID value or Alternate Key(s) for the record to update.
         * @param collection - The name of the Entity Collection or Entity Logical name.
         * @param object - A JavaScript object valid for update operations.
         * @param prefer - If set to "return=representation" the function will return an updated object
         * @param select - An Array representing the $select Query Option to control which attributes will be returned.
         */
        update(key: string, collection: string, object: Object, prefer?: string | string[], select?: string[]): Promise<any> {
            ErrorHelper.stringParameterCheck(key, "DynamicsWebApi.update", "key");
            key = ErrorHelper.keyParameterCheck(key, "DynamicsWebApi.update", "key");
            ErrorHelper.parameterCheck(object, "DynamicsWebApi.update", "object");
            ErrorHelper.stringParameterCheck(collection, "DynamicsWebApi.update", "collection");

            if (prefer) {
                ErrorHelper.stringOrArrayParameterCheck(prefer, "DynamicsWebApi.update", "prefer");
            }

            if (select) {
                ErrorHelper.arrayParameterCheck(select, "DynamicsWebApi.update", "select");
            }

            const request = {
                collection: collection,
                key: key,
                select: select,
                prefer: prefer,
                entity: object
            };

            return this.updateRequest(request);
        }

        /**
         * Sends an asynchronous request to update a single value in the record.
         *
         * @param key - A String representing the GUID value or Alternate Key(s) for the record to update.
         * @param collection - The name of the Entity Collection or Entity Logical name.
         * @param keyValuePair - keyValuePair object with a logical name of the field as a key and a value to update with. Example: {subject: "Update Record"}
         * @param prefer - If set to "return=representation" the function will return an updated object
         * @param select - An Array representing the $select Query Option to control which attributes will be returned.
         */
        updateSingleProperty(key: string, collection: string, keyValuePair: Object, prefer?: string | string[], select?: string[]): Promise<any> {
            ErrorHelper.stringParameterCheck(key, "DynamicsWebApi.updateSingleProperty", "key");
            key = ErrorHelper.keyParameterCheck(key, "DynamicsWebApi.updateSingleProperty", "key");
            ErrorHelper.parameterCheck(keyValuePair, "DynamicsWebApi.updateSingleProperty", "keyValuePair");
            ErrorHelper.stringParameterCheck(collection, "DynamicsWebApi.updateSingleProperty", "collection");

            const field = Object.keys(keyValuePair)[0];
            const fieldValue = keyValuePair[field];

            if (prefer) {
                ErrorHelper.stringOrArrayParameterCheck(prefer, "DynamicsWebApi.updateSingleProperty", "prefer");
            }

            if (select) {
                ErrorHelper.arrayParameterCheck(select, "DynamicsWebApi.updateSingleProperty", "select");
            }

            const request = {
                collection: collection,
                key: key,
                select: select,
                prefer: prefer,
                navigationProperty: field,
                data: { value: fieldValue }
            };

            return this._makeRequest('PUT', request, 'updateSingleProperty')
                .then(response => {
                    return response.data;
                });
        }

        /**
         * Sends an asynchronous request to delete a record.
         *
         * @param request - An object that represents all possible options for a current request.
         */
        deleteRequest(request: DynamicsWebApi.DeleteRequest): Promise<any> {
            ErrorHelper.parameterCheck(request, 'DynamicsWebApi.delete', 'request');

            //copy locally
            const ifmatch = request.ifmatch;

            return this._makeRequest('DELETE', request, 'delete', { valueIfEmpty: true })
                .then(response => {
                    return response.data;
                }).catch(error => {
                    if (ifmatch && error.status === 412) {
                        //precondition failed - not deleted
                        return false;
                    }
                    else {
                        //rethrow error otherwise
                        throw error;
                    }
                });
        }

        /**
         * Sends an asynchronous request to delete a record.
         *
         * @param key - A String representing the GUID value or Alternate Key(s) for the record to delete.
         * @param collection - The name of the Entity Collection or Entity Logical name.
         * @param propertyName - The name of the property which needs to be emptied. Instead of removing a whole record only the specified property will be cleared.
         */
        deleteRecord(key: string, collection: string, propertyName?: string): Promise<any> {
            ErrorHelper.stringParameterCheck(collection, 'DynamicsWebApi.deleteRecord', 'collection');

            if (propertyName !== null) {
                ErrorHelper.stringParameterCheck(propertyName, 'DynamicsWebApi.deleteRecord', 'propertyName');
            }

            var request = {
                navigationProperty: propertyName,
                collection: collection,
                key: key
            };

            return this._makeRequest('DELETE', request, 'deleteRecord');
        }

        /**
         * Sends an asynchronous request to retrieve a record.
         *
         * @param request - An object that represents all possible options for a current request.
         */
        retrieveRequest(request: DynamicsWebApi.RetrieveRequest): Promise<any> {
            ErrorHelper.parameterCheck(request, 'DynamicsWebApi.retrieve', 'request');

            //copy locally
            const isRef = request.select !== null && request.select.length === 1 && request.select[0].endsWith("/$ref");

            return this._makeRequest('GET', request, 'retrieve', { isRef: isRef }).then(response => response.data);
        }

        /**
         * Sends an asynchronous request to retrieve a record.
         *
         * @param key - A String representing the GUID value or Alternate Key(s) for the record to retrieve.
         * @param collection - The name of the Entity Collection or Entity Logical name.
         * @param select - An Array representing the $select Query Option to control which attributes will be returned.
         * @param expand - A String or Array of Expand Objects representing the $expand Query Option value to control which related records need to be returned.
         */
        retrieve(key: string, collection: string, select?: string[], expand?: DynamicsWebApi.Expand[]): Promise<any> {
            ErrorHelper.stringParameterCheck(key, "DynamicsWebApi.retrieve", "key");
            key = ErrorHelper.keyParameterCheck(key, "DynamicsWebApi.retrieve", "key");
            ErrorHelper.stringParameterCheck(collection, "DynamicsWebApi.retrieve", "collection");

            if (select && select.length) {
                ErrorHelper.arrayParameterCheck(select, "DynamicsWebApi.retrieve", "select");
            }

            if (expand && expand.length) {
                ErrorHelper.stringOrArrayParameterCheck(expand, "DynamicsWebApi.retrieve", "expand");
            }

            const request = {
                collection: collection,
                key: key,
                select: select,
                expand: expand
            };

            return this.retrieveRequest(request);
        }

        /**
         * Sends an asynchronous request to upsert a record.
         *
         * @param request - An object that represents all possible options for a current request.
         */
        upsertRequest(request: DynamicsWebApi.UpsertRequest): Promise<any> {
            ErrorHelper.parameterCheck(request, "DynamicsWebApi.upsert", "request");

            //copy locally
            const ifnonematch = request.ifnonematch;
            const ifmatch = request.ifmatch;

            return this._makeRequest("PATCH", request, 'upsert')
                .then(response => {
                    return response.data;
                }).catch(error => {
                    if (ifnonematch && error.status === 412) {
                        //if prevent update
                        return;
                    }
                    else if (ifmatch && error.status === 404) {
                        //if prevent create
                        return;
                    }

                    //rethrow error otherwise
                    throw error;
                });
        }

        /**
         * Sends an asynchronous request to upsert a record.
         *
         * @param key - A String representing the GUID value or Alternate Key(s) for the record to upsert.
         * @param collection - The name of the Entity Collection or Entity Logical name.
         * @param object - A JavaScript object valid for update operations.
         * @param prefer - If set to "return=representation" the function will return an updated object
         * @param select - An Array representing the $select Query Option to control which attributes will be returned.
         */
        upsert(key: string, collection: string, object: Object, prefer?: string | string[], select?: string[]): Promise<any> {
            ErrorHelper.stringParameterCheck(key, "DynamicsWebApi.upsert", "key");
            key = ErrorHelper.keyParameterCheck(key, "DynamicsWebApi.upsert", "key");

            ErrorHelper.parameterCheck(object, "DynamicsWebApi.upsert", "object");
            ErrorHelper.stringParameterCheck(collection, "DynamicsWebApi.upsert", "collection");

            if (prefer) {
                ErrorHelper.stringOrArrayParameterCheck(prefer, "DynamicsWebApi.upsert", "prefer");
            }

            if (select) {
                ErrorHelper.arrayParameterCheck(select, "DynamicsWebApi.upsert", "select");
            }

            const request = {
                collection: collection,
                key: key,
                select: select,
                prefer: prefer,
                entity: object
            };

            return this.upsertRequest(request);
        }

        /**
         * Sends an asynchronous request to count records. IMPORTANT! The count value does not represent the total number of entities in the system. It is limited by the maximum number of entities that can be returned. Returns: Number
         *
         * @param collection - The name of the Entity Collection or Entity Logical name.
         * @param filter - Use the $filter system query option to set criteria for which entities will be returned.
         */
        count(collection: string, filter?: string): Promise<any> {
            let request: any = {
                collection: collection
            };

            if (filter === null || (filter !== null && !filter.length)) {
                request.navigationProperty = '$count';
            }
            else {
                request.filter = filter;
                request.count = true;
            }

            //if filter has not been specified then simplify the request
            return this._makeRequest('GET', request, 'count', { toCount: request.count })
                .then(response => {
                    return response.data;
                });
        }

        /**
         * Sends an asynchronous request to count records. Returns: Number
         *
         * @param collection - The name of the Entity Collection or Entity Logical name.
         * @param filter - Use the $filter system query option to set criteria for which entities will be returned.
         * @param select - An Array representing the $select Query Option to control which attributes will be returned.
         */
        countAll(collection: string, filter?: string, select?: string[]): Promise<any> {
            ErrorHelper.batchIncompatible('DynamicsWebApi.countAll', this._isBatch);

            return this.retrieveAllRequest({
                collection: collection,
                filter: filter,
                select: select
            }).then(response => {
                return response
                    ? (response.value ? response.value.length : 0)
                    : 0;
            });
        }

        /**
         * Sends an asynchronous request to retrieve records.
         *
         * @param collection - The name of the Entity Collection or Entity Logical name.
         * @param select - Use the $select system query option to limit the properties returned.
         * @param filter - Use the $filter system query option to set criteria for which entities will be returned.
         * @param oDataLink - Use this parameter to pass @odata.nextLink or @odata.deltaLink to return a necessary response. Pass null to retrieveMultipleOptions.
         */
        retrieveMultiple(collection: string, select?: string[], filter?: string, oDataLink?: string): Promise<any> {
            return this.retrieveMultipleRequest({
                collection: collection,
                select: select,
                filter: filter
            }, oDataLink);
        }

        /**
        * Sends an asynchronous request to retrieve all records.
        *
        * @param collection - The name of the Entity Collection or Entity Logical name.
        * @param select - Use the $select system query option to limit the properties returned.
        * @param filter - Use the $filter system query option to set criteria for which entities will be returned.
        */
        retrieveAll(collection: string, select?: string[], filter?: string): Promise<any> {
            ErrorHelper.batchIncompatible('DynamicsWebApi.retrieveAll', this._isBatch);

            return this.retrieveAllRequest({
                collection: collection,
                select: select,
                filter: filter
            });
        }

        /**
         * Sends an asynchronous request to retrieve records.
         *
         * @param request - An object that represents all possible options for a current request.
         * @param oDataLink - Use this parameter to pass @odata.nextLink or @odata.deltaLink to return a necessary response. Pass null to retrieveMultipleOptions
         */
        retrieveMultipleRequest(request: DynamicsWebApi.RetrieveMultipleRequest, oDataLink?: string): Promise<any> {
            return this._retrieveMultipleRequest(request, oDataLink);
        }

        /**
         * Sends an asynchronous request to retrieve all records.
         *
         * @param request - An object that represents all possible options for a current request.
         */
        retrieveAllRequest(request: DynamicsWebApi.RetrieveMultipleRequest): Promise<any> {
            return this._retrieveAllRequest(request);
        }

        /**
         * Sends an asynchronous request to count records. Returns: DWA.Types.FetchXmlResponse
         *
         * @param collection - The name of the Entity Collection or Entity Logical name.
         * @param fetchXml - FetchXML is a proprietary query language that provides capabilities to perform aggregation.
         * @param includeAnnotations - Use this parameter to include annotations to a result. For example: * or Microsoft.Dynamics.CRM.fetchxmlpagingcookie
         * @param pageNumber - Page number.
         * @param pagingCookie - Paging cookie. For retrieving the first page, pagingCookie should be null.
         * @param impersonateUserId - A String representing the GUID value for the Dynamics 365 system user id. Impersonates the user.
         */
        executeFetchXml(collection: string, fetchXml: string, includeAnnotations?: string, pageNumber?: number, pagingCookie?: string, impersonateUserId?: string): Promise<any> {
            return this._executeFetchXml(collection, fetchXml, includeAnnotations, pageNumber, pagingCookie, impersonateUserId);
        }

        /**
         * Sends an asynchronous request to count records. Returns: DWA.Types.FetchXmlResponse
         *
         * @param query - A FetchXml Query that contains the request
         * @param includeAnnotations - Use this parameter to include annotations to a result. For example: * or Microsoft.Dynamics.CRM.fetchxmlpagingcookie
         * @param pageNumber - Page number.
         * @param pagingCookie - Paging cookie. For retrieving the first page, pagingCookie should be null.
         * @param impersonateUserId - A String representing the GUID value for the Dynamics 365 system user id. Impersonates the user.
         */
        fetch(query: Query, includeAnnotations?: string, pageNumber?: number, pagingCookie?: string, impersonateUserId?: string): Promise<any> {
            return this.executeFetchXml(query.Query.EntityPath, FetchQueryResolver.ResolveQuery(query), includeAnnotations, pageNumber, pagingCookie, impersonateUserId);
        }

        /**
         * Sends an asynchronous request to execute FetchXml to retrieve all records.
         *
         * @param collection - The name of the Entity Collection or Entity Logical name.
         * @param fetchXml - FetchXML is a proprietary query language that provides capabilities to perform aggregation.
         * @param includeAnnotations - Use this parameter to include annotations to a result. For example: * or Microsoft.Dynamics.CRM.fetchxmlpagingcookie
         * @param impersonateUserId - A String representing the GUID value for the Dynamics 365 system user id. Impersonates the user.
         */
        executeFetchXmlAll(collection: string, fetchXml: string, includeAnnotations?: string, impersonateUserId?: string): Promise<any> {
            return this._executeFetchXmlAll(collection, fetchXml, includeAnnotations, impersonateUserId);
        }

        /**
         * Sends an asynchronous request to execute FetchXml to retrieve all records.
         *
         * @param query - A FetchXml Query that contains the request
         * @param includeAnnotations - Use this parameter to include annotations to a result. For example: * or Microsoft.Dynamics.CRM.fetchxmlpagingcookie
         * @param impersonateUserId - A String representing the GUID value for the Dynamics 365 system user id. Impersonates the user.
         */
        fetchAll(query: Query, includeAnnotations?: string, impersonateUserId?: string): Promise<any> {
            return this.executeFetchXmlAll(query.Query.EntityPath, FetchQueryResolver.ResolveQuery(query), includeAnnotations, impersonateUserId);
        }

        /**
         * Associate for a collection-valued navigation property. (1:N or N:N)
         *
         * @param collection - Primary Entity Collection name or Entity Name.
         * @param primaryKey - Primary entity record id.
         * @param relationshipName - Relationship name.
         * @param relatedCollection - Related Entity Collection name or Entity Name.
         * @param relatedKey - Related entity record id.
         * @param impersonateUserId - A String representing the GUID value for the Dynamics 365 system user id. Impersonates the user.
         */
        associate(collection: string, primaryKey: string, relationshipName: string, relatedCollection: string, relatedKey: string, impersonateUserId?: string): Promise<any> {
            ErrorHelper.stringParameterCheck(relatedCollection, "DynamicsWebApi.associate", "relatedcollection");
            ErrorHelper.stringParameterCheck(relationshipName, "DynamicsWebApi.associate", "relationshipName");
            primaryKey = ErrorHelper.keyParameterCheck(primaryKey, "DynamicsWebApi.associate", "primaryKey");
            relatedKey = ErrorHelper.keyParameterCheck(relatedKey, "DynamicsWebApi.associate", "relatedKey");

            const request = {
                _additionalUrl: relationshipName + '/$ref',
                collection: collection,
                key: primaryKey,
                impersonate: impersonateUserId,
                data: { "@odata.id": relatedCollection + "(" + relatedKey + ")" }
            };

            return this._makeRequest("POST", request, 'associate');
        }

        /**
         * Disassociate for a collection-valued navigation property.
         *
         * @param collection - Primary Entity Collection name or Entity Name.
         * @param primaryKey - Primary entity record id.
         * @param relationshipName - Relationship name.
         * @param relatedKey - Related entity record id.
         * @param impersonateUserId - A String representing the GUID value for the Dynamics 365 system user id. Impersonates the user.
         */
        disassociate(collection: string, primaryKey: string, relationshipName: string, relatedKey: string, impersonateUserId?: string): Promise<any> {
            ErrorHelper.stringParameterCheck(relationshipName, "DynamicsWebApi.disassociate", "relationshipName");
            relatedKey = ErrorHelper.keyParameterCheck(relatedKey, "DynamicsWebApi.disassociate", "relatedId");

            const request = {
                _additionalUrl: relationshipName + '(' + relatedKey + ')/$ref',
                collection: collection,
                key: primaryKey,
                impersonate: impersonateUserId
            };

            return this._makeRequest("DELETE", request, 'disassociate');
        }

        /**
        * Associate for a single-valued navigation property. (1:N)
        *
        * @param collection - The name of the Entity Collection or Entity Logical name.
        * @param key - Entity record Id that contains an attribute.
        * @param singleValuedNavigationPropertyName - Single-valued navigation property name (usually it's a Schema Name of the lookup attribute).
        * @param relatedCollection - Related collection name that the lookup (attribute) points to.
        * @param relatedKey - Related entity record id that needs to be associated.
        * @param impersonateUserId - A String representing the GUID value for the Dynamics 365 system user id. Impersonates the user.
        */
        associateSingleValued(collection: string, key: string, singleValuedNavigationPropertyName: string, relatedCollection: string, relatedKey: string, impersonateUserId?: string): Promise<any> {
            relatedKey = ErrorHelper.keyParameterCheck(relatedKey, "DynamicsWebApi.associateSingleValued", "relatedKey");
            ErrorHelper.stringParameterCheck(singleValuedNavigationPropertyName, "DynamicsWebApi.associateSingleValued", "singleValuedNavigationPropertyName");
            ErrorHelper.stringParameterCheck(relatedCollection, "DynamicsWebApi.associateSingleValued", "relatedcollection");

            const request = {
                _additionalUrl: singleValuedNavigationPropertyName + '/$ref',
                collection: collection,
                key: key,
                impersonate: impersonateUserId,
                data: { "@odata.id": relatedCollection + "(" + relatedKey + ")" }
            };

            return this._makeRequest("PUT", request, 'associateSingleValued');
        }

        /**
         * Removes a reference to an entity for a single-valued navigation property. (1:N)
         *
         * @param collection - The name of the Entity Collection or Entity Logical name.
         * @param key - Entity record Id that contains an attribute.
         * @param singleValuedNavigationPropertyName - Single-valued navigation property name (usually it's a Schema Name of the lookup attribute).
         * @param impersonateUserId - A String representing the GUID value for the Dynamics 365 system user id. Impersonates the user.
         */
        disassociateSingleValued(collection: string, key: string, singleValuedNavigationPropertyName: string, impersonateUserId?: string): Promise<any> {
            ErrorHelper.stringParameterCheck(singleValuedNavigationPropertyName, "DynamicsWebApi.disassociateSingleValued", "singleValuedNavigationPropertyName");

            const request = {
                _additionalUrl: singleValuedNavigationPropertyName + "/$ref",
                key: key,
                collection: collection,
                impersonate: impersonateUserId
            };

            return this._makeRequest("DELETE", request, 'disassociateSingleValued');
        }

        /**
         * Executes an unbound function (not bound to a particular entity record)
         *
         * @param functionName - The name of the function.
         * @param parameters - Function's input parameters. Example: { param1: "test", param2: 3 }.
         * @param impersonateUserId - A String representing the GUID value for the Dynamics 365 system user id. Impersonates the user.
         */
        executeUnboundFunction(functionName: string, parameters?: any, impersonateUserId?: string): Promise<any> {
            return this._executeFunction(functionName, parameters, null, null, impersonateUserId, true);
        }

        /**
         * Executes a bound function
         *
         * @param id - A String representing the GUID value for the record.
         * @param collection - The name of the Entity Collection or Entity Logical name.
         * @param functionName - The name of the function.
         * @param parameters - Function's input parameters. Example: { param1: "test", param2: 3 }.
         * @param impersonateUserId - A String representing the GUID value for the Dynamics 365 system user id. Impersonates the user.
         */
        executeBoundFunction(id: string, collection: string, functionName: string, parameters?: any, impersonateUserId?: string): Promise<any> {
            return this._executeFunction(functionName, parameters, collection, id, impersonateUserId);
        }

        /**
         * Executes an unbound Web API action (not bound to a particular entity record)
         *
         * @param actionName - The name of the Web API action.
         * @param requestObject - Action request body object.
         * @param impersonateUserId - A String representing the GUID value for the Dynamics 365 system user id. Impersonates the user.
         */
        executeUnboundAction(actionName: string, requestObject?: any, impersonateUserId?: string): Promise<any> {
            return this._executeAction(actionName, requestObject, null, null, impersonateUserId, true);
        }

        /**
         * Executes a bound Web API action (bound to a particular entity record)
         *
         * @param id - A String representing the GUID value for the record (pass "null" for an optional parameter)
         * @param collection - The name of the Entity Collection or Entity Logical name.
         * @param actionName - The name of the Web API action.
         * @param requestObject - Action request body object.
         * @param impersonateUserId - A String representing the GUID value for the Dynamics 365 system user id. Impersonates the user.
         */
        executeBoundAction(id: string, collection: string, actionName: string, requestObject?: any, impersonateUserId?: string): Promise<any> {
            return this._executeAction(actionName, requestObject, collection, id, impersonateUserId);
        }

        /**
         * Sends an asynchronous request to create an entity definition.
         *
         * @param entityDefinition - Entity Definition.
         */
        createEntity(entityDefinition: any): Promise<any> {
            ErrorHelper.parameterCheck(entityDefinition, 'DynamicsWebApi.createEntity', 'entityDefinition');

            const request = {
                collection: 'EntityDefinitions',
                entity: entityDefinition
            };

            return this.createRequest(request);
        }

        /**
         * Sends an asynchronous request to update an entity definition.
         *
         * @param entityDefinition - Entity Definition.
         * @param mergeLabels - Sets MSCRM.MergeLabels header that controls whether to overwrite the existing labels or merge your new label with any existing language labels. Default value is false.
         */
        updateEntity(entityDefinition: any, mergeLabels?: boolean): Promise<any> {
            ErrorHelper.parameterCheck(entityDefinition, 'DynamicsWebApi.updateEntity', 'entityDefinition');
            ErrorHelper.guidParameterCheck(entityDefinition.MetadataId, 'DynamicsWebApi.updateEntity', 'entityDefinition.MetadataId');

            const request = {
                collection: 'EntityDefinitions',
                mergeLabels: mergeLabels,
                key: entityDefinition.MetadataId,
                entity: entityDefinition
            };

            return this.updateRequest(request);
        }

        /**
         * Sends an asynchronous request to retrieve a specific entity definition.
         *
         * @param entityKey - The Entity MetadataId or Alternate Key (such as LogicalName).
         * @param select - Use the $select system query option to limit the properties returned.
         * @param expand - A String or Array of Expand Objects representing the $expand Query Option value to control which related records need to be returned.
         */
        retrieveEntity(entityKey: string, select?: string[], expand?: DynamicsWebApi.Expand[]): Promise<any> {
            ErrorHelper.keyParameterCheck(entityKey, 'DynamicsWebApi.retrieveEntity', 'entityKey');

            const request = {
                collection: 'EntityDefinitions',
                key: entityKey,
                select: select,
                expand: expand
            };

            return this.retrieveRequest(request);
        }

        /**
         * Sends an asynchronous request to retrieve entity definitions.
         *
         * @param select - Use the $select system query option to limit the properties returned.
         * @param filter - Use the $filter system query option to set criteria for which entity definitions will be returned.
         */
        retrieveEntities(select?: string[], filter?: string): Promise<any> {
            const request = {
                collection: 'EntityDefinitions',
                select: select,
                filter: filter
            };

            return this.retrieveRequest(request);
        }

        /**
         * Sends an asynchronous request to create an attribute.
         *
         * @param entityKey - The Entity MetadataId or Alternate Key (such as LogicalName).
         * @param attributeDefinition - Object that describes the attribute.
         */
        createAttribute(entityKey: string, attributeDefinition: any): Promise<any> {
            ErrorHelper.keyParameterCheck(entityKey, 'DynamicsWebApi.createAttribute', 'entityKey');
            ErrorHelper.parameterCheck(attributeDefinition, 'DynamicsWebApi.createAttribute', 'attributeDefinition');

            const request = {
                collection: 'EntityDefinitions',
                key: entityKey,
                entity: attributeDefinition,
                navigationProperty: 'Attributes'
            };

            return this.createRequest(request);
        }

        /**
         * Sends an asynchronous request to update an attribute.
         *
         * @param entityKey - The Entity MetadataId or Alternate Key (such as LogicalName).
         * @param attributeDefinition - Object that describes the attribute.
         * @param attributeType - Use this parameter to cast the Attribute to a specific type.
         * @param mergeLabels - Sets MSCRM.MergeLabels header that controls whether to overwrite the existing labels or merge your new label with any existing language labels. Default value is false.
         */
        updateAttribute(entityKey: string, attributeDefinition: any, attributeType?: string, mergeLabels?: boolean): Promise<any> {
            ErrorHelper.keyParameterCheck(entityKey, 'DynamicsWebApi.updateAttribute', 'entityKey');
            ErrorHelper.parameterCheck(attributeDefinition, 'DynamicsWebApi.updateAttribute', 'attributeDefinition');
            ErrorHelper.guidParameterCheck(attributeDefinition.MetadataId, 'DynamicsWebApi.updateAttribute', 'attributeDefinition.MetadataId');

            if (attributeType) {
                ErrorHelper.stringParameterCheck(attributeType, 'DynamicsWebApi.updateAttribute', 'attributeType');
            }

            const request = {
                collection: 'EntityDefinitions',
                key: entityKey,
                entity: attributeDefinition,
                navigationProperty: 'Attributes',
                navigationPropertyKey: attributeDefinition.MetadataId,
                mergeLabels: mergeLabels,
                metadataAttributeType: attributeType
            };

            return this.updateRequest(request);
        }

        /**
         * Sends an asynchronous request to retrieve attribute metadata for a specified entity definition.
         *
         * @param entityKey - The Entity MetadataId or Alternate Key (such as LogicalName).
         * @param attributeType - Use this parameter to cast the Attributes to a specific type.
         * @param select - Use the $select system query option to limit the properties returned.
         * @param filter - Use the $filter system query option to set criteria for which attribute definitions will be returned.
         * @param expand - A String or Array of Expand Objects representing the $expand Query Option value to control which related records need to be returned.
         */
        retrieveAttributes(entityKey: string, attributeType?: string, select?: string[], filter?: string, expand?: DynamicsWebApi.Expand[]): Promise<any> {
            ErrorHelper.keyParameterCheck(entityKey, 'DynamicsWebApi.retrieveAttributes', 'entityKey');

            if (attributeType) {
                ErrorHelper.stringParameterCheck(attributeType, 'DynamicsWebApi.retrieveAttributes', 'attributeType');
            }

            const request = {
                collection: 'EntityDefinitions',
                key: entityKey,
                navigationProperty: 'Attributes',
                select: select,
                filter: filter,
                expand: expand,
                metadataAttributeType: attributeType
            };

            return this.retrieveRequest(request);
        }

        /**
         * Sends an asynchronous request to retrieve a specific attribute metadata for a specified entity definition.
         *
         * @param entityKey - The Entity MetadataId or Alternate Key (such as LogicalName).
         * @param attributeKey - The Attribute Metadata id.
         * @param attributeType - Use this parameter to cast the Attribute to a specific type.
         * @param select - Use the $select system query option to limit the properties returned.
         * @param expand - A String or Array of Expand Objects representing the $expand Query Option value to control which related records need to be returned.
         */
        retrieveAttribute(entityKey: string, attributeKey: string, attributeType?: string, select?: string[], expand?: DynamicsWebApi.Expand[]): Promise<any> {
            ErrorHelper.keyParameterCheck(entityKey, 'DynamicsWebApi.retrieveAttribute', 'entityKey');
            ErrorHelper.keyParameterCheck(attributeKey, 'DynamicsWebApi.retrieveAttribute', 'attributeKey');

            if (attributeType) {
                ErrorHelper.stringParameterCheck(attributeType, 'DynamicsWebApi.retrieveAttribute', 'attributeType');
            }

            const request = {
                collection: 'EntityDefinitions',
                key: entityKey,
                navigationProperty: 'Attributes',
                select: select,
                expand: expand,
                metadataAttributeType: attributeType,
                navigationPropertyKey: attributeKey
            };

            return this.retrieveRequest(request);
        }

        /**
         * Sends an asynchronous request to create a relationship definition.
         *
         * @param relationshipDefinition - Relationship Definition.
         */
        createRelationship(relationshipDefinition: any): Promise<any> {
            ErrorHelper.parameterCheck(relationshipDefinition, 'DynamicsWebApi.createRelationship', 'relationshipDefinition');

            const request = {
                collection: 'RelationshipDefinitions',
                entity: relationshipDefinition
            };

            return this.createRequest(request);
        }

        /**
         * Sends an asynchronous request to update a relationship definition.
         *
         * @param relationshipDefinition - Relationship Definition.
         * @param relationshipType - Use this parameter to cast the Relationship to a specific type.
         * @param mergeLabels - Sets MSCRM.MergeLabels header that controls whether to overwrite the existing labels or merge your new label with any existing language labels. Default value is false.
         */
        updateRelationship(relationshipDefinition: any, relationshipType?: string, mergeLabels?: boolean): Promise<any> {
            ErrorHelper.parameterCheck(relationshipDefinition, 'DynamicsWebApi.updateRelationship', 'relationshipDefinition');
            ErrorHelper.guidParameterCheck(relationshipDefinition.MetadataId, 'DynamicsWebApi.updateRelationship', 'relationshipDefinition.MetadataId');

            const request = {
                collection: 'RelationshipDefinitions',
                mergeLabels: mergeLabels,
                key: relationshipDefinition.MetadataId,
                entity: relationshipDefinition,
                navigationProperty: relationshipType
            };

            return this.updateRequest(request);
        }

        /**
         * Sends an asynchronous request to delete a relationship definition.
         *
         * @param metadataId - A String representing the GUID value.
         */
        deleteRelationship(metadataId: string): Promise<any> {
            ErrorHelper.keyParameterCheck(metadataId, 'DynamicsWebApi.deleteRelationship', 'metadataId');

            const request = {
                collection: 'RelationshipDefinitions',
                key: metadataId
            };

            return this.deleteRequest(request);
        }

        /**
         * Sends an asynchronous request to retrieve relationship definitions.
         *
         * @param relationshipType - Use this parameter to cast a Relationship to a specific type: 1:M or M:M.
         * @param select - Use the $select system query option to limit the properties returned.
         * @param filter - Use the $filter system query option to set criteria for which relationships will be returned.
         */
        retrieveRelationships(relationshipType?: string, select?: string[], filter?: string): Promise<any> {
            const request = {
                collection: 'RelationshipDefinitions',
                navigationProperty: relationshipType,
                select: select,
                filter: filter
            };

            return this.retrieveMultipleRequest(request);
        }

        /**
         * Sends an asynchronous request to retrieve a specific relationship definition.
         *
         * @param metadataId - String representing the Metadata Id GUID.
         * @param relationshipType - Use this parameter to cast a Relationship to a specific type: 1:M or M:M.
         * @param select - Use the $select system query option to limit the properties returned.
         */
        retrieveRelationship(metadataId: string, relationshipType?: string, select?: string[]): Promise<any> {
            ErrorHelper.keyParameterCheck(metadataId, 'DynamicsWebApi.retrieveRelationship', 'metadataId');

            const request = {
                collection: 'RelationshipDefinitions',
                navigationProperty: relationshipType,
                key: metadataId,
                select: select
            };

            return this.retrieveRequest(request);
        }

        /**
         * Sends an asynchronous request to create a Global Option Set definition
         *
         * @param globalOptionSetDefinition - Global Option Set Definition.
         */
        createGlobalOptionSet(globalOptionSetDefinition: any): Promise<any> {
            ErrorHelper.parameterCheck(globalOptionSetDefinition, 'DynamicsWebApi.createGlobalOptionSet', 'globalOptionSetDefinition');

            const request = {
                collection: 'GlobalOptionSetDefinitions',
                entity: globalOptionSetDefinition
            };

            return this.createRequest(request);
        }

        /**
         * Sends an asynchronous request to update a Global Option Set.
         *
         * @param globalOptionSetDefinition - Global Option Set Definition.
         * @param mergeLabels - Sets MSCRM.MergeLabels header that controls whether to overwrite the existing labels or merge your new label with any existing language labels. Default value is false.
         */
        updateGlobalOptionSet(globalOptionSetDefinition: any, mergeLabels?: boolean): Promise<any> {
            ErrorHelper.parameterCheck(globalOptionSetDefinition, 'DynamicsWebApi.updateGlobalOptionSet', 'globalOptionSetDefinition');
            ErrorHelper.guidParameterCheck(globalOptionSetDefinition.MetadataId, 'DynamicsWebApi.updateGlobalOptionSet', 'globalOptionSetDefinition.MetadataId');

            const request = {
                collection: 'GlobalOptionSetDefinitions',
                mergeLabels: mergeLabels,
                key: globalOptionSetDefinition.MetadataId,
                entity: globalOptionSetDefinition
            };

            return this.updateRequest(request);
        }

        /**
         * Sends an asynchronous request to delete a Global Option Set.
         *
         * @param globalOptionSetKey - A String representing the GUID value or Alternate Key (such as Name).
         */
        deleteGlobalOptionSet(globalOptionSetKey: string): Promise<any> {
            ErrorHelper.keyParameterCheck(globalOptionSetKey, 'DynamicsWebApi.deleteGlobalOptionSet', 'globalOptionSetKey');

            const request = {
                collection: 'GlobalOptionSetDefinitions',
                key: globalOptionSetKey
            };

            return this.deleteRequest(request);
        }

        /**
         * Sends an asynchronous request to retrieve Global Option Set definitions.
         *
         * @param globalOptionSetKey - The Global Option Set MetadataID or Alternate Key (such as Name).
         * @param castType - Use this parameter to cast a Global Option Set to a specific type.
         * @param select - Use the $select system query option to limit the properties returned
         */
        retrieveGlobalOptionSet(globalOptionSetKey: string, castType?: string, select?: string[]): Promise<any> {
            ErrorHelper.keyParameterCheck(globalOptionSetKey, 'DynamicsWebApi.retrieveGlobalOptionSet', 'globalOptionSetKey');

            const request = {
                collection: 'GlobalOptionSetDefinitions',
                key: globalOptionSetKey,
                navigationProperty: castType,
                select: select
            };

            return this.retrieveRequest(request);
        }

        /**
         * Sends an asynchronous request to retrieve Global Option Set definitions.
         *
         * @param castType - Use this parameter to cast a Global Option Set to a specific type.
         * @param select - Use the $select system query option to limit the properties returned
         */
        retrieveGlobalOptionSets(castType?: string, select?: string[]): Promise<any> {
            const request = {
                collection: 'GlobalOptionSetDefinitions',
                navigationProperty: castType,
                select: select
            };

            return this.retrieveMultipleRequest(request);
        }

        /**
         * Starts a batch request.
         *
         */
        startBatch(): void {
            this._isBatch = true;
        }

        /**
         * Executes a batch request. Please call DynamicsWebApi.startBatch() first to start a batch request.
         */
        executeBatch(): Promise<any[]> {
            ErrorHelper.batchNotStarted(this._isBatch);

            this._isBatch = false;

            return this._makeRequest('POST', { collection: '$batch' }, 'executeBatch')
                .then(response => {
                    return response.data;
                });
        }

        /**
         * Creates a new instance of DynamicsWebApi
         *
         * @param config - configuration object.
         */
        static from(config?: DynamicsWebApi.Config): WebApiClient {
            return new WebApiClient(config);
        }

        private _executeAction(actionName: string, requestObject: any, collection?: string, id?: string, impersonateUserId?: string, isUnbound: boolean = false) {
            ErrorHelper.stringParameterCheck(actionName, "DynamicsWebApi.executeAction", "actionName");

            const request = {
                _additionalUrl: actionName,
                _unboundRequest: isUnbound,
                collection: collection,
                key: id,
                impersonate: impersonateUserId,
                data: requestObject
            };

            return this._makeRequest("POST", request, 'executeAction')
                .then(response => {
                    return response.data;
                });
        }

        private _executeFetchXml(collection: string, fetchXml: string, includeAnnotations?: string, pageNumber?: number, pagingCookie?: string, impersonateUserId?: string): Promise<any> {
            ErrorHelper.stringParameterCheck(fetchXml, "DynamicsWebApi.executeFetchXml", "fetchXml");
            pageNumber = pageNumber || 1;

            ErrorHelper.numberParameterCheck(pageNumber, "DynamicsWebApi.executeFetchXml", "pageNumber");
            let replacementString = '$1 page="' + pageNumber + '"';

            if (pagingCookie !== null) {
                ErrorHelper.stringParameterCheck(pagingCookie, "DynamicsWebApi.executeFetchXml", "pagingCookie");
                replacementString += ' paging-cookie="' + pagingCookie + '"';
            }

            //add page number and paging cookie to fetch xml
            fetchXml = fetchXml.replace(/^(<fetch)/, replacementString);

            const request = {
                collection: collection,
                includeAnnotations: includeAnnotations,
                impersonate: impersonateUserId,
                fetchXml: fetchXml
            };

            return this._makeRequest("GET", request, 'executeFetchXml', { pageNumber: pageNumber })
                .then(response => {
                    return response.data;
                });
        }

        private _executeFetchXmlAll(collection: string, fetchXml: string, includeAnnotations?: string, impersonateUserId?: string): Promise<any> {
            ErrorHelper.batchIncompatible('DynamicsWebApi.executeFetchXmlAll', this._isBatch);

            const executeFetchXmlRecursive = (collection: string, fetchXml: string, includeAnnotations: string, pageNumber: number, pagingCookie: string, impersonateUserId?: string, records?: any[]): Promise<any> => {
                records = records || [];

                return this._executeFetchXml(collection, fetchXml, includeAnnotations, pageNumber, pagingCookie, impersonateUserId)
                    .then(response => {
                        records = records.concat(response.value);

                        if (response.PagingInfo) {
                            return executeFetchXmlRecursive(collection, fetchXml, includeAnnotations, response.PagingInfo.nextPage, response.PagingInfo.cookie, impersonateUserId, records);
                        }

                        return { value: records };
                    });
            };

            return executeFetchXmlRecursive(collection, fetchXml, includeAnnotations, null, null, impersonateUserId);
        }

        private _executeFunction(functionName: string, parameters: any, collection?: string, id?: string, impersonateUserId?: string, isUnbound: boolean = false) {
            ErrorHelper.stringParameterCheck(functionName, "DynamicsWebApi.executeFunction", "functionName");

            const request = {
                _additionalUrl: functionName + Utility.buildFunctionParameters(parameters),
                _unboundRequest: isUnbound,
                key: id,
                collection: collection,
                impersonate: impersonateUserId
            };

            return this._makeRequest("GET", request, 'executeFunction').then(response => {
                return response.data;
            });
        }

        private _makeDiscoveryRequest(request: any): Promise<any> {
            return new Promise((resolve, reject) => {
                Request.makeDiscoveryRequest(request, this._internalConfig, resolve, reject);
            });
        }

        private _makeRequest(method: string, request: any, functionName: string, responseParams?: any): Promise<any> {
            request.isBatch = this._isBatch;

            return new Promise((resolve, reject) => {
                Request.makeRequest(method, request, functionName, this._internalConfig, responseParams, resolve, reject);
            });
        }

        private _retrieveMultipleRequest(request: any, oDataLink: string): Promise<any> {
            if (oDataLink) {
                ErrorHelper.stringParameterCheck(oDataLink, 'DynamicsWebApi.retrieveMultiple', 'nextPageLink');
                request.url = oDataLink;
            }

            return this._makeRequest("GET", request, 'retrieveMultiple')
                .then(response => {
                    return response.data;
                });
        }

        private _retrieveAllRequest(request: any, oDataLink?: string, records?: any[]): Promise<any> {
            records = records || [];

            return this._retrieveMultipleRequest(request, oDataLink)
                .then(response => {
                    records = records.concat(response.value);

                    const pageLink = response.oDataNextLink;

                    if (pageLink) {
                        return this._retrieveAllRequest(request, pageLink, records);
                    }

                    let result: any = { value: records };

                    if (response.oDataDeltaLink) {
                        result["@odata.deltaLink"] = response.oDataDeltaLink;
                        result.oDataDeltaLink = response.oDataDeltaLink;
                    }

                    return result;
                });
        }
    }
}