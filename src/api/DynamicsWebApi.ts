import { Utilities } from "../helpers/Utilities";
import { WebApiRequest } from "./WebApiRequest";
import fetchQuery, {  Query } from "./FetchQuery";
import { FetchQueryResolver } from "./FetchQueryResolver";

// Dynamics Web API
// Original Project: https://github.com/AleksandrRogov/DynamicsWebApi/

export class DynamicsWebApiClient {
    private _internalConfig:DynamicsWebApi.Config;
    private _isBatch:boolean;
    private _webApiRequest:WebApiRequest;

    /**
     * DynamicsWebApi constructor
     * @param config - DynamicsWebApi configuration
     */
    constructor(config?: DynamicsWebApi.Config)
    {
        this._webApiRequest = new WebApiRequest();
        this._internalConfig = {
            webApiVersion: "v8.0",
            webApiUrl: null,
            impersonate: null,
            onTokenRefresh: null,
            includeAnnotations: null,
            maxPageSize: null,
            returnRepresentation: null
        };
    
        this._isBatch = false;
    
        if (!config) {
            config = this._internalConfig;
        }

        this.setConfig(config);
    }
    /**
     * Sets DynamicsWebApi configuration parameters.
     *
     * @param config - configuration object
     * @example
        dynamicsWebApi.setConfig({ webApiVersion: '9.0' });
     */
    public setConfig(config: DynamicsWebApi.Config): void
    {
        if (config.username) {
            this._internalConfig.username = config.username;
        }

        if (config.password) {
            this._internalConfig.password = config.password;
        }

        if (config.domain) {
            this._internalConfig.domain = config.domain;
        }

        if (config.workstation) {
            this._internalConfig.workstation = config.workstation;
        }

        if (config.webApiVersion) {
            this._internalConfig.webApiVersion = config.webApiVersion;
        }

        if (config.webApiUrl) {
            this._internalConfig.webApiUrl = config.webApiUrl;
        } else {
            this._internalConfig.webApiUrl = Utilities.InitWebApiUrl(this._internalConfig.webApiVersion);
        }

        if (config.impersonate && Utilities.IsGuid(config.impersonate)) {
            this._internalConfig.impersonate = config.impersonate;
        }

        if (config.onTokenRefresh) {
            this._internalConfig.onTokenRefresh = config.onTokenRefresh;
        }

        if (config.includeAnnotations) {
            this._internalConfig.includeAnnotations = config.includeAnnotations;
        }

        if (config.timeout) {
            this._internalConfig.timeout = config.timeout;
        }

        if (config.maxPageSize) {
            this._internalConfig.maxPageSize = config.maxPageSize;
        }

        if (config.returnRepresentation) {
            this._internalConfig.returnRepresentation = config.returnRepresentation;
        }

        if (config.useEntityNames) {
            this._internalConfig.useEntityNames = config.useEntityNames;
        }
    }

    //TODO: update types.
    private _makeRequest(method:string, request:any, responseParams?:any) : Promise<any> {
        request.isBatch = this._isBatch;

        return new Promise((resolve, reject) => {
            this._webApiRequest.makeRequest(method, request, this._internalConfig, responseParams, resolve, reject);
        });
    }

    private _makeDiscoveryRequest(request:any) : Promise<any>
    {
        return new Promise((resolve, reject) => {
            this._webApiRequest.makeDiscoveryRequest(request, this._internalConfig, resolve, reject);
        });
    }

    private _retrieveAllRequest(request:any, nextPageLink?:string, records?:any[]) {
        records = records || [];

        return this
            .retrieveMultipleRequest(request, nextPageLink)
            .then(response => {
                records = records.concat(response.value);

                if (response.oDataNextLink) {
                    return this._retrieveAllRequest(request, response.oDataNextLink, records);
                }

                return { value: records };
            });
    }

    private  _executeFetchXmlAll(collection:string, fetchXml:string, includeAnnotations?:string, pageNumber?:number, pagingCookie?:string, impersonateUserId?:string, records?:any) {
        records = records || [];

        return this.executeFetchXml(collection, fetchXml, includeAnnotations, pageNumber, pagingCookie, impersonateUserId)
            .then(response => {
                records = records.concat(response.value);

                if (response.PagingInfo) {
                    return this._executeFetchXmlAll(collection, fetchXml, includeAnnotations, response.PagingInfo.nextPage, response.PagingInfo.cookie, impersonateUserId, records);
                }

                return { value: records };
            });
    }

    private _executeFunction(functionName:string, parameters:any, collection:string, id:string, impersonateUserId?:string, isUnbound?:boolean) {
        var request = {
            _additionalUrl: functionName + Utilities.BuildFunctionParameters(parameters),
            _unboundRequest: isUnbound,
            key: id,
            collection: collection,
            impersonate: impersonateUserId
        };

        return this._makeRequest("GET", request)
            .then(response => { return response.data; });
    }

    private _executeAction(actionName:string, requestObject:any, collection:string, id:string, impersonateUserId?:string, isUnbound?:boolean) {
        var request = {
            _additionalUrl: actionName,
            _unboundRequest: isUnbound,
            collection: collection,
            key: id,
            impersonate: impersonateUserId,
            data: requestObject
        };

        return this._makeRequest("POST", request)
            .then(response => { return response.data; });
    }

    /**
     * Sends an asynchronous request to the discovery service looking for CRM instances.
     *
     * @param request - An Array representing the CollectionName Query Option to control which attributes will be returned.
     * @example
        *dynamicsWebApi.discover().then(function (orgs) {
        *}.catch(function (error) {
        *});
     */
    public discover() : Promise<any>
    {
        return this._makeDiscoveryRequest({ collection: 'Instances'})
            .then(response => { return response.data; });
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
    public createRequest(request: DynamicsWebApi.CreateRequest): Promise<any>
    {
        return this._makeRequest('POST', request)
            .then(response => { return response.data; });
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
    public create(object: Object, collection: string, prefer?: string | string[], select?: string[]): Promise<any>
    {
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
    public updateRequest(request: DynamicsWebApi.UpdateRequest): Promise<any>
    {
        if (request.ifmatch === null) {
            request.ifmatch = '*'; //to prevent upsert
        }

        //Metadata definitions, cannot be updated using "PATCH" method
        const method = /EntityDefinitions|RelationshipDefinitions|GlobalOptionSetDefinitions/.test(request.collection)
            ? 'PUT' : 'PATCH';

        //copy locally
        const ifmatch = request.ifmatch;

        return this._makeRequest(method, request, { valueIfEmpty: true })
            .then(response => { return response.data; })
            .catch(error => {
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
    public update(key: string, collection: string, object: Object, prefer?: string | string[], select?: string[]): Promise<any>
    {
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
    public updateSingleProperty(key: string, collection: string, keyValuePair: Object, prefer?: string | string[], select?: string[]): Promise<any>
    {
        const field = Object.keys(keyValuePair)[0];
        const fieldValue = keyValuePair[field];
        const request = {
            collection: collection,
            key: key,
            select: select,
            prefer: prefer,
            navigationProperty: field,
            data: { value: fieldValue }
        };

        return this._makeRequest('PUT', request)
            .then(response => { return response.data; });
    }

    /**
     * Sends an asynchronous request to delete a record.
     *
     * @param request - An object that represents all possible options for a current request.
     */
    public deleteRequest(request: DynamicsWebApi.DeleteRequest): Promise<any>
    {
        //copy locally
        const ifmatch = request.ifmatch;

        return this._makeRequest('DELETE', request, { valueIfEmpty: true })
            .then(response => { return response.data; })
            .catch(error => {
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
    public deleteRecord(key: string, collection: string, propertyName?: string): Promise<any>
    {
        const request = {
            navigationProperty: propertyName,
            collection: collection,
            key: key
        };

        return this._makeRequest('DELETE', request)
            .then(() => { return; });
    }

    /**
     * Sends an asynchronous request to retrieve a record.
     *
     * @param request - An object that represents all possible options for a current request.
     */
    public retrieveRequest(request: DynamicsWebApi.RetrieveRequest): Promise<any>
    {
        //copy locally
        const isRef = request.select && request.select !== null && request.select.length === 1 && request.select[0].endsWith("/$ref");
        
        return this._makeRequest('GET', request, { isRef: isRef })
            .then(response => { return response.data; });
    }

    /**
     * Sends an asynchronous request to retrieve a record.
     *
     * @param key - A String representing the GUID value or Alternate Key(s) for the record to retrieve.
     * @param collection - The name of the Entity Collection or Entity Logical name.
     * @param select - An Array representing the $select Query Option to control which attributes will be returned.
     * @param expand - A String or Array of Expand Objects representing the $expand Query Option value to control which related records need to be returned.
     */
    public retrieve(key: string, collection: string, select?: string[], expand?: DynamicsWebApi.Expand[]): Promise<any>
    {
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
    public upsertRequest(request: DynamicsWebApi.UpsertRequest): Promise<any>
    {
        //copy locally
        const ifnonematch = request.ifnonematch;
        const ifmatch = request.ifmatch;

        return this._makeRequest("PATCH", request)
            .then(response => { return response.data; })
            .catch(error => {
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
    public upsert(key: string, collection: string, object: Object, prefer?: string | string[], select?: string[]): Promise<any>
    {
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
    public count(collection: string, filter?: string): Promise<any>
    {
        const hasFilter = ((!filter || filter === null) || (filter !== null && !filter.length));
        const request = {
            collection: collection,
            navigationProperty: hasFilter ? '$count' : undefined,
            filter: hasFilter ? filter : undefined,
            count: hasFilter ? true : false
        };

        //if filter has not been specified then simplify the request
        return this._makeRequest('GET', request, { toCount: request.count })
            .then(response => { return response.data; });
    }

    /**
     * Sends an asynchronous request to count records. Returns: Number
     *
     * @param collection - The name of the Entity Collection or Entity Logical name.
     * @param filter - Use the $filter system query option to set criteria for which entities will be returned.
     * @param select - An Array representing the $select Query Option to control which attributes will be returned.
     */
    public countAll(collection: string, filter?: string, select?: string[]): Promise<any>
    {
        return this._retrieveAllRequest({
            collection: collection,
            filter: filter,
            select: select
        })
            .then(response => { return response ? (response.value ? response.value.length : 0) : 0; });
    }

    /**
     * Sends an asynchronous request to retrieve records.
     *
     * @param collection - The name of the Entity Collection or Entity Logical name.
     * @param select] - Use the $select system query option to limit the properties returned.
     * @param filter - Use the $filter system query option to set criteria for which entities will be returned.
     * @param nextPageLink - Use the value of the @odata.nextLink property with a new GET request to return the next page of data. Pass null to retrieveMultipleOptions.
     */
    public retrieveMultiple(collection: string, select?: string[], filter?: string, nextPageLink?: string): Promise<any>
    {
        return this.retrieveMultipleRequest({
            collection: collection,
            select: select,
            filter: filter
        }, nextPageLink);
    }

    /**
    * Sends an asynchronous request to retrieve all records.
    *
    * @param collection - The name of the Entity Collection or Entity Logical name.
    * @param select - Use the $select system query option to limit the properties returned.
    * @param filter - Use the $filter system query option to set criteria for which entities will be returned.
    */
    public retrieveAll(collection: string, select?: string[], filter?: string): Promise<any>
    {
        return this._retrieveAllRequest({
            collection: collection,
            select: select,
            filter: filter
        });
    }

    /**
     * Sends an asynchronous request to retrieve records.
     *
     * @param request - An object that represents all possible options for a current request.
     * @param nextPageLink - Use the value of the @odata.nextLink property with a new GET request to return the next page of data. Pass null to retrieveMultipleOptions.
     */
    public retrieveMultipleRequest(request: DynamicsWebApi.RetrieveMultipleRequest, nextPageLink?:string): Promise<any>
    {
        if (nextPageLink) {
            request.url = nextPageLink;
        }

        return this._makeRequest("GET", request)
            .then(response => { return response.data; });
    }

    /**
     * Sends an asynchronous request to retrieve all records.
     *
     * @param request - An object that represents all possible options for a current request.
     */
    public  retrieveAllRequest(request: DynamicsWebApi.RetrieveMultipleRequest): Promise<any>
    {
        return this._retrieveAllRequest(request, undefined, undefined);
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
    public executeFetchXml(collection: string, fetchXml: string, includeAnnotations?: string, pageNumber?: number, pagingCookie?: string, impersonateUserId?: string): Promise<any>
    {
        pageNumber = pageNumber || 1;

        let replacementString = '$1 page="' + pageNumber + '"';

        if (pagingCookie !== null) {
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

        return this._makeRequest("GET", request, { pageNumber: pageNumber })
            .then(response => { return response.data; });
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
    public fetch(query: Query, includeAnnotations?: string, pageNumber?: number, pagingCookie?: string, impersonateUserId?: string): Promise<any>
    {
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
    public executeFetchXmlAll(collection: string, fetchXml: string, includeAnnotations?: string, impersonateUserId?: string): Promise<any>
    {
        return this._executeFetchXmlAll(collection, fetchXml, includeAnnotations, undefined, undefined, impersonateUserId);
    }

    /**
     * Sends an asynchronous request to execute FetchXml to retrieve all records.
     *
     * @param collection - The name of the Entity Collection or Entity Logical name.
     * @param fetchXml - FetchXML is a proprietary query language that provides capabilities to perform aggregation.
     * @param includeAnnotations - Use this parameter to include annotations to a result. For example: * or Microsoft.Dynamics.CRM.fetchxmlpagingcookie
     * @param impersonateUserId - A String representing the GUID value for the Dynamics 365 system user id. Impersonates the user.
     */
    public fetchAll(query: Query, includeAnnotations?: string, impersonateUserId?: string): Promise<any>
    {
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
    public associate(collection: string, primaryKey: string, relationshipName: string, relatedCollection: string, relatedKey: string, impersonateUserId?: string): Promise<void>
    {
        const request = {
            _additionalUrl: relationshipName + '/$ref',
            collection: collection,
            key: primaryKey,
            impersonate: impersonateUserId,
            data: { "@odata.id": relatedCollection + "(" + relatedKey + ")" }
        };

        return this._makeRequest("POST", request)
            .then(() => { return; });
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
    public disassociate(collection: string, primaryKey: string, relationshipName: string, relatedKey: string, impersonateUserId?: string): Promise<void>
    {
        const request = {
            _additionalUrl: relationshipName + '(' + relatedKey + ')/$ref',
            collection: collection,
            key: primaryKey,
            impersonate: impersonateUserId
        };

        return this._makeRequest("DELETE", request)
            .then(() => { return; });
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
    public associateSingleValued(collection: string, key: string, singleValuedNavigationPropertyName: string, relatedCollection: string, relatedKey: string, impersonateUserId?: string): Promise<void>
    {
        const request = {
            _additionalUrl: singleValuedNavigationPropertyName + '/$ref',
            collection: collection,
            key: key,
            impersonate: impersonateUserId,
            data: { "@odata.id": relatedCollection + "(" + relatedKey + ")" }
        };

        return this._makeRequest("PUT", request)
            .then(() => { return; });
    }

    /**
     * Removes a reference to an entity for a single-valued navigation property. (1:N)
     *
     * @param collection - The name of the Entity Collection or Entity Logical name.
     * @param key - Entity record Id that contains an attribute.
     * @param singleValuedNavigationPropertyName - Single-valued navigation property name (usually it's a Schema Name of the lookup attribute).
     * @param impersonateUserId - A String representing the GUID value for the Dynamics 365 system user id. Impersonates the user.
     */
    public disassociateSingleValued(collection: string, key: string, singleValuedNavigationPropertyName: string, impersonateUserId?: string): Promise<void>
    {
        const request = {
            _additionalUrl: singleValuedNavigationPropertyName + "/$ref",
            key: key,
            collection: collection,
            impersonate: impersonateUserId
        };

        return this._makeRequest("DELETE", request)
            .then(() => { return; });
    }

    /**
     * Executes an unbound function (not bound to a particular entity record)
     *
     * @param functionName - The name of the function.
     * @param parameters - Function's input parameters. Example: { param1: "test", param2: 3 }.
     * @param impersonateUserId - A String representing the GUID value for the Dynamics 365 system user id. Impersonates the user.
     */
    public executeUnboundFunction(functionName: string, parameters?: Object, impersonateUserId?: string): Promise<any>
    {
        return this._executeFunction(functionName, parameters, undefined, undefined, impersonateUserId, true);
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
    public executeBoundFunction(id: string, collection: string, functionName: string, parameters?: Object, impersonateUserId?: string): Promise<any>
    {
        return this._executeFunction(functionName, parameters, collection, id, impersonateUserId);
    }

    /**
     * Executes an unbound Web API action (not bound to a particular entity record)
     *
     * @param actionName - The name of the Web API action.
     * @param requestObject - Action request body object.
     * @param impersonateUserId - A String representing the GUID value for the Dynamics 365 system user id. Impersonates the user.
     */
    public executeUnboundAction(actionName: string, requestObject?: Object, impersonateUserId?: string): Promise<any>
    {
        return this._executeAction(actionName, requestObject, undefined, undefined, impersonateUserId, true);
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
    public executeBoundAction(id: string, collection: string, actionName: string, requestObject?: Object, impersonateUserId?: string): Promise<any>
    {
        return this._executeAction(actionName, requestObject, collection, id, impersonateUserId);
    }

    /**
     * Sends an asynchronous request to create an entity definition.
     *
     * @param entityDefinition - Entity Definition.
     */
    public createEntity(entityDefinition: any): Promise<any>
    {
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
    public updateEntity(entityDefinition: any, mergeLabels?: boolean): Promise<any>
    {
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
    public retrieveEntity(entityKey: string, select?: string[], expand?: DynamicsWebApi.Expand[]): Promise<any>
    {
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
    public retrieveEntities(select?: string[], filter?: string): Promise<any>
    {
        const request = {
            collection: 'EntityDefinitions',
            select: select,
            filter: filter
        };

        return this.retrieveRequest(request);
    }

        /**
     * Sends an asynchronous request to retrieve entity definitions.
     *
     * @param select - Use the $select system query option to limit the properties returned.
     * @param filter - Use the $filter system query option to set criteria for which entity definitions will be returned.
     */
    public retrieveEntitiesRequest(request: DynamicsWebApi.RetrieveMultipleRequest): Promise<any>
    {
        if (request)
        {
            request.collection = "EntityDefinitions";
        }
        else
        {
            request = {
                collection: "EntityDefinitions"
            };
        }

        return this.retrieveRequest(request);
    }

    /**
     * Sends an asynchronous request to create an attribute.
     *
     * @param entityKey - The Entity MetadataId or Alternate Key (such as LogicalName).
     * @param attributeDefinition - Object that describes the attribute.
     */
    public createAttribute(entityKey: string, attributeDefinition: Object): Promise<any>
    {
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
    public updateAttribute(entityKey: string, attributeDefinition:any, attributeType?: string, mergeLabels?: boolean): Promise<any>
    {
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
    public retrieveAttributes(entityKey: string, attributeType?: string, select?: string[], filter?: string, expand?: DynamicsWebApi.Expand[]): Promise<any>
    {
        var request = {
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
    public retrieveAttribute(entityKey: string, attributeKey: string, attributeType?: string, select?: string[], expand?: DynamicsWebApi.Expand[]): Promise<any>
    {
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
    public createRelationship(relationshipDefinition: any): Promise<any>
    {
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
    public updateRelationship(relationshipDefinition: any, relationshipType?: string, mergeLabels?: boolean): Promise<any>
    {
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
    public deleteRelationship(metadataId: string): Promise<any>
    {
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
    public retrieveRelationships(relationshipType?: string, select?: string[], filter?: string): Promise<any>
    {
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
    public retrieveRelationship(metadataId: string, relationshipType?: string, select?: string[]): Promise<any>
    {
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
    public createGlobalOptionSet(globalOptionSetDefinition: Object): Promise<any>
    {
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
    public updateGlobalOptionSet(globalOptionSetDefinition: any, mergeLabels?: boolean): Promise<any>
    {
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
    public deleteGlobalOptionSet(globalOptionSetKey: string): Promise<any>
    {
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
    public retrieveGlobalOptionSet(globalOptionSetKey: string, castType?: string, select?: string[]): Promise<any>
    {
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
    public retrieveGlobalOptionSets(castType?: string, select?: string[]): Promise<any>
    {
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
    public startBatch(): void
    {
        this._isBatch = true;
    }

    /**
     * Executes a batch request. Please call DynamicsWebApi.startBatch() first to start a batch request.
     */
    public executeBatch(): Promise<any[]>
    {
        this._isBatch = false;

        return this._makeRequest('POST', { collection: '$batch' })
            .then(response => { return response.data; });
    }

    /**
     * Creates a new instance of DynamicsWebApi
     *
     * @param config - configuration object.
     */
    public static initializeInstance(config?: DynamicsWebApi.Config): DynamicsWebApiClient
    {
        return new DynamicsWebApiClient(config);
    }
}