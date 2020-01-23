[cds-for-code](../README.md) › [Globals](../globals.md) › ["api/cds-webapi/CdsWebApi"](../modules/_api_cds_webapi_cdswebapi_.md) › [CdsWebApi](../modules/_api_cds_webapi_cdswebapi_.cdswebapi.md) › [UpdateRequest](_api_cds_webapi_cdswebapi_.cdswebapi.updaterequest.md)

# Interface: UpdateRequest

## Hierarchy

  ↳ [UpdateRequestBase](_api_cds_webapi_cdswebapi_.cdswebapi.updaterequestbase.md)

  ↳ **UpdateRequest**

## Index

### Properties

* [async](_api_cds_webapi_cdswebapi_.cdswebapi.updaterequest.md#optional-async)
* [collection](_api_cds_webapi_cdswebapi_.cdswebapi.updaterequest.md#optional-collection)
* [contentId](_api_cds_webapi_cdswebapi_.cdswebapi.updaterequest.md#optional-contentid)
* [duplicateDetection](_api_cds_webapi_cdswebapi_.cdswebapi.updaterequest.md#optional-duplicatedetection)
* [entity](_api_cds_webapi_cdswebapi_.cdswebapi.updaterequest.md#optional-entity)
* [expand](_api_cds_webapi_cdswebapi_.cdswebapi.updaterequest.md#optional-expand)
* [id](_api_cds_webapi_cdswebapi_.cdswebapi.updaterequest.md#optional-id)
* [ifmatch](_api_cds_webapi_cdswebapi_.cdswebapi.updaterequest.md#optional-ifmatch)
* [impersonate](_api_cds_webapi_cdswebapi_.cdswebapi.updaterequest.md#optional-impersonate)
* [includeAnnotations](_api_cds_webapi_cdswebapi_.cdswebapi.updaterequest.md#optional-includeannotations)
* [key](_api_cds_webapi_cdswebapi_.cdswebapi.updaterequest.md#optional-key)
* [mergeLabels](_api_cds_webapi_cdswebapi_.cdswebapi.updaterequest.md#optional-mergelabels)
* [noCache](_api_cds_webapi_cdswebapi_.cdswebapi.updaterequest.md#optional-nocache)
* [returnRepresentation](_api_cds_webapi_cdswebapi_.cdswebapi.updaterequest.md#optional-returnrepresentation)
* [select](_api_cds_webapi_cdswebapi_.cdswebapi.updaterequest.md#optional-select)
* [token](_api_cds_webapi_cdswebapi_.cdswebapi.updaterequest.md#optional-token)

## Properties

### `Optional` async

• **async**? : *boolean*

*Inherited from [Request](_api_cds_webapi_cdswebapi_.cdswebapi.request.md).[async](_api_cds_webapi_cdswebapi_.cdswebapi.request.md#optional-async)*

Defined in src/api/cds-webapi/CdsWebApi.ts:66

XHR requests only! Indicates whether the requests should be made synchronously or asynchronously.Default value is 'true'(asynchronously).

___

### `Optional` collection

• **collection**? : *string*

*Inherited from [Request](_api_cds_webapi_cdswebapi_.cdswebapi.request.md).[collection](_api_cds_webapi_cdswebapi_.cdswebapi.request.md#optional-collection)*

Defined in src/api/cds-webapi/CdsWebApi.ts:68

The name of the Entity Collection or Entity Logical name.

___

### `Optional` contentId

• **contentId**? : *string*

*Inherited from [UpdateRequestBase](_api_cds_webapi_cdswebapi_.cdswebapi.updaterequestbase.md).[contentId](_api_cds_webapi_cdswebapi_.cdswebapi.updaterequestbase.md#optional-contentid)*

Defined in src/api/cds-webapi/CdsWebApi.ts:119

BATCH REQUESTS ONLY! Sets Content-ID header or references request in a Change Set.

___

### `Optional` duplicateDetection

• **duplicateDetection**? : *boolean*

*Inherited from [UpdateRequestBase](_api_cds_webapi_cdswebapi_.cdswebapi.updaterequestbase.md).[duplicateDetection](_api_cds_webapi_cdswebapi_.cdswebapi.updaterequestbase.md#optional-duplicatedetection)*

Defined in src/api/cds-webapi/CdsWebApi.ts:105

v.1.3.4+ Web API v9+ only! Boolean that enables duplicate detection.

___

### `Optional` entity

• **entity**? : *any*

*Inherited from [UpdateRequestBase](_api_cds_webapi_cdswebapi_.cdswebapi.updaterequestbase.md).[entity](_api_cds_webapi_cdswebapi_.cdswebapi.updaterequestbase.md#optional-entity)*

Defined in src/api/cds-webapi/CdsWebApi.ts:107

A JavaScript object with properties corresponding to the logical name of entity attributes(exceptions are lookups and single-valued navigation properties).

___

### `Optional` expand

• **expand**? : *[Expand](_api_cds_webapi_cdswebapi_.cdswebapi.expand.md)[]*

*Inherited from [UpdateRequestBase](_api_cds_webapi_cdswebapi_.cdswebapi.updaterequestbase.md).[expand](_api_cds_webapi_cdswebapi_.cdswebapi.updaterequestbase.md#optional-expand)*

Defined in src/api/cds-webapi/CdsWebApi.ts:109

An array of Expand Objects(described below the table) representing the $expand OData System Query Option value to control which related records are also returned.

___

### `Optional` id

• **id**? : *string*

*Inherited from [CRUDRequest](_api_cds_webapi_cdswebapi_.cdswebapi.crudrequest.md).[id](_api_cds_webapi_cdswebapi_.cdswebapi.crudrequest.md#optional-id)*

Defined in src/api/cds-webapi/CdsWebApi.ts:79

DEPRECATED Use "key" instead. A String representing the Primary Key(GUID) of the record.

___

### `Optional` ifmatch

• **ifmatch**? : *string*

*Inherited from [UpdateRequestBase](_api_cds_webapi_cdswebapi_.cdswebapi.updaterequestbase.md).[ifmatch](_api_cds_webapi_cdswebapi_.cdswebapi.updaterequestbase.md#optional-ifmatch)*

Defined in src/api/cds-webapi/CdsWebApi.ts:111

Sets If-Match header value that enables to use conditional retrieval or optimistic concurrency in applicable requests.

___

### `Optional` impersonate

• **impersonate**? : *string*

*Inherited from [Request](_api_cds_webapi_cdswebapi_.cdswebapi.request.md).[impersonate](_api_cds_webapi_cdswebapi_.cdswebapi.request.md#optional-impersonate)*

Defined in src/api/cds-webapi/CdsWebApi.ts:70

Impersonates the user.A String representing the GUID value for the Dynamics 365 system user id.

___

### `Optional` includeAnnotations

• **includeAnnotations**? : *string*

*Inherited from [UpdateRequestBase](_api_cds_webapi_cdswebapi_.cdswebapi.updaterequestbase.md).[includeAnnotations](_api_cds_webapi_cdswebapi_.cdswebapi.updaterequestbase.md#optional-includeannotations)*

Defined in src/api/cds-webapi/CdsWebApi.ts:113

Sets Prefer header with value "odata.include-annotations=" and the specified annotation.Annotations provide additional information about lookups, options sets and other complex attribute types.

___

### `Optional` key

• **key**? : *string*

*Inherited from [CRUDRequest](_api_cds_webapi_cdswebapi_.cdswebapi.crudrequest.md).[key](_api_cds_webapi_cdswebapi_.cdswebapi.crudrequest.md#optional-key)*

Defined in src/api/cds-webapi/CdsWebApi.ts:81

A String representing collection record's Primary Key (GUID) or Alternate Key(s).

___

### `Optional` mergeLabels

• **mergeLabels**? : *boolean*

Defined in src/api/cds-webapi/CdsWebApi.ts:124

If set to 'true', DynamicsWebApi adds a request header 'MSCRM.MergeLabels: true'. Default value is 'false'

___

### `Optional` noCache

• **noCache**? : *boolean*

*Inherited from [Request](_api_cds_webapi_cdswebapi_.cdswebapi.request.md).[noCache](_api_cds_webapi_cdswebapi_.cdswebapi.request.md#optional-nocache)*

Defined in src/api/cds-webapi/CdsWebApi.ts:72

If set to 'true', DynamicsWebApi adds a request header 'Cache-Control: no-cache'.Default value is 'false'.

___

### `Optional` returnRepresentation

• **returnRepresentation**? : *boolean*

*Inherited from [UpdateRequestBase](_api_cds_webapi_cdswebapi_.cdswebapi.updaterequestbase.md).[returnRepresentation](_api_cds_webapi_cdswebapi_.cdswebapi.updaterequestbase.md#optional-returnrepresentation)*

Defined in src/api/cds-webapi/CdsWebApi.ts:115

Sets Prefer header request with value "return=representation".Use this property to return just created or updated entity in a single request.

___

### `Optional` select

• **select**? : *string[]*

*Inherited from [UpdateRequestBase](_api_cds_webapi_cdswebapi_.cdswebapi.updaterequestbase.md).[select](_api_cds_webapi_cdswebapi_.cdswebapi.updaterequestbase.md#optional-select)*

Defined in src/api/cds-webapi/CdsWebApi.ts:117

An Array(of Strings) representing the $select OData System Query Option to control which attributes will be returned.

___

### `Optional` token

• **token**? : *string*

*Inherited from [Request](_api_cds_webapi_cdswebapi_.cdswebapi.request.md).[token](_api_cds_webapi_cdswebapi_.cdswebapi.request.md#optional-token)*

Defined in src/api/cds-webapi/CdsWebApi.ts:74

Authorization Token. If set, onTokenRefresh will not be called.
