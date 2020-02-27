---
id: "_api_cds_webapi_cdswebapi_.cdswebapi"
title: "CdsWebApi"
sidebar_label: "CdsWebApi"
---

[cds-for-code](../index.md) › [Globals](../globals.md) › ["api/cds-webapi/CdsWebApi"](_api_cds_webapi_cdswebapi_.md) › [CdsWebApi](_api_cds_webapi_cdswebapi_.cdswebapi.md)

## Index

### Enumerations

* [ConfigType](../enums/_api_cds_webapi_cdswebapi_.cdswebapi.configtype.md)

### Classes

* [WebApiClient](../classes/_api_cds_webapi_cdswebapi_.cdswebapi.webapiclient.md)

### Interfaces

* [CRUDRequest](../interfaces/_api_cds_webapi_cdswebapi_.cdswebapi.crudrequest.md)
* [Config](../interfaces/_api_cds_webapi_cdswebapi_.cdswebapi.config.md)
* [CreateRequest](../interfaces/_api_cds_webapi_cdswebapi_.cdswebapi.createrequest.md)
* [DeleteRequest](../interfaces/_api_cds_webapi_cdswebapi_.cdswebapi.deleterequest.md)
* [Expand](../interfaces/_api_cds_webapi_cdswebapi_.cdswebapi.expand.md)
* [OnTokenAcquiredCallback](../interfaces/_api_cds_webapi_cdswebapi_.cdswebapi.ontokenacquiredcallback.md)
* [Request](../interfaces/_api_cds_webapi_cdswebapi_.cdswebapi.request.md)
* [RequestError](../interfaces/_api_cds_webapi_cdswebapi_.cdswebapi.requesterror.md)
* [RetrieveMultipleRequest](../interfaces/_api_cds_webapi_cdswebapi_.cdswebapi.retrievemultiplerequest.md)
* [RetrieveRequest](../interfaces/_api_cds_webapi_cdswebapi_.cdswebapi.retrieverequest.md)
* [UpdateRequest](../interfaces/_api_cds_webapi_cdswebapi_.cdswebapi.updaterequest.md)
* [UpdateRequestBase](../interfaces/_api_cds_webapi_cdswebapi_.cdswebapi.updaterequestbase.md)
* [UpsertRequest](../interfaces/_api_cds_webapi_cdswebapi_.cdswebapi.upsertrequest.md)
* [Utility](../interfaces/_api_cds_webapi_cdswebapi_.cdswebapi.utility.md)

### Type aliases

* [UserRequest](_api_cds_webapi_cdswebapi_.cdswebapi.md#userrequest)

## Type aliases

###  UserRequest

Ƭ **UserRequest**: *[CreateRequest](../interfaces/_api_cds_webapi_cdswebapi_.cdswebapi.createrequest.md) | [UpdateRequest](../interfaces/_api_cds_webapi_cdswebapi_.cdswebapi.updaterequest.md) | [UpsertRequest](../interfaces/_api_cds_webapi_cdswebapi_.cdswebapi.upsertrequest.md) | [DeleteRequest](../interfaces/_api_cds_webapi_cdswebapi_.cdswebapi.deleterequest.md) | [RetrieveMultipleRequest](../interfaces/_api_cds_webapi_cdswebapi_.cdswebapi.retrievemultiplerequest.md) | [RetrieveRequest](../interfaces/_api_cds_webapi_cdswebapi_.cdswebapi.retrieverequest.md)*

Defined in src/api/cds-webapi/CdsWebApi.ts:51

Dynamics Web Api Request

**`typedef`** {Object} UserRequest

**`property`** {boolean} async - XHR requests only! Indicates whether the requests should be made synchronously or asynchronously. Default value is 'true' (asynchronously).

**`property`** {string} collection - The name of the Entity Collection or Entity Logical name.

**`property`** {string} id - A String representing the Primary Key (GUID) of the record.

**`property`** {Array} select - An Array (of Strings) representing the $select OData System Query Option to control which attributes will be returned.

**`property`** {Array} expand - An array of Expand Objects (described below the table) representing the $expand OData System Query Option value to control which related records are also returned.

**`property`** {string} key - A String representing collection record's Primary Key (GUID) or Alternate Key(s).

**`property`** {string} filter - Use the $filter system query option to set criteria for which entities will be returned.

**`property`** {number} maxPageSize - Sets the odata.maxpagesize preference value to request the number of entities returned in the response.

**`property`** {boolean} count - Boolean that sets the $count system query option with a value of true to include a count of entities that match the filter criteria up to 5000 (per page). Do not use $top with $count!

**`property`** {number} top - Limit the number of results returned by using the $top system query option. Do not use $top with $count!

**`property`** {Array} orderBy - An Array (of Strings) representing the order in which items are returned using the $orderby system query option. Use the asc or desc suffix to specify ascending or descending order respectively. The default is ascending if the suffix isn't applied.

**`property`** {string} includeAnnotations - Sets Prefer header with value "odata.include-annotations=" and the specified annotation. Annotations provide additional information about lookups, options sets and other complex attribute types.

**`property`** {string} ifmatch - Sets If-Match header value that enables to use conditional retrieval or optimistic concurrency in applicable requests.

**`property`** {string} ifnonematch - Sets If-None-Match header value that enables to use conditional retrieval in applicable requests.

**`property`** {boolean} returnRepresentation - Sets Prefer header request with value "return=representation". Use this property to return just created or updated entity in a single request.

**`property`** {Object} entity - A JavaScript object with properties corresponding to the logical name of entity attributes (exceptions are lookups and single-valued navigation properties).

**`property`** {string} impersonate - Impersonates the user. A String representing the GUID value for the Dynamics 365 system user id.

**`property`** {string} navigationProperty - A String representing the name of a single-valued navigation property. Useful when needed to retrieve information about a related record in a single request.

**`property`** {string} navigationPropertyKey - v.1.4.3+ A String representing navigation property's Primary Key (GUID) or Alternate Key(s). (For example, to retrieve Attribute Metadata).

**`property`** {string} metadataAttributeType - v.1.4.3+ Casts the AttributeMetadata to a specific type. (Used in requests to Attribute Metadata).

**`property`** {boolean} noCache - If set to 'true', DynamicsWebApi adds a request header 'Cache-Control: no-cache'. Default value is 'false'.

**`property`** {string} savedQuery - A String representing the GUID value of the saved query.

**`property`** {string} userQuery - A String representing the GUID value of the user query.

**`property`** {boolean} mergeLabels - If set to 'true', DynamicsWebApi adds a request header 'MSCRM.MergeLabels: true'. Default value is 'false'.

**`property`** {boolean} isBatch - If set to 'true', DynamicsWebApi treats a request as a part of a batch request. Call ExecuteBatch to execute all requests in a batch. Default value is 'false'.

**`property`** {string} contentId - BATCH REQUESTS ONLY! Sets Content-ID header or references request in a Change Set.

**`property`** {boolean} trackChanges - Preference header 'odata.track-changes' is used to request that a delta link be returned which can subsequently be used to retrieve entity changes.

**`property`** {string} deltaLink - Delta link can be used to retrieve entity changes. Important! Change Tracking must be enabled for the entity.
