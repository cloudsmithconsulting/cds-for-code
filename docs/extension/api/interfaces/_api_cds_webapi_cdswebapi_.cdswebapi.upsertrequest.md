---
id: "_api_cds_webapi_cdswebapi_.cdswebapi.upsertrequest"
title: "UpsertRequest"
sidebar_label: "UpsertRequest"
---

[cds-for-code](../index.md) › [Globals](../globals.md) › ["api/cds-webapi/CdsWebApi"](../modules/_api_cds_webapi_cdswebapi_.md) › [CdsWebApi](../modules/_api_cds_webapi_cdswebapi_.cdswebapi.md) › [UpsertRequest](_api_cds_webapi_cdswebapi_.cdswebapi.upsertrequest.md)

## Hierarchy

  ↳ [UpdateRequestBase](_api_cds_webapi_cdswebapi_.cdswebapi.updaterequestbase.md)

  ↳ **UpsertRequest**

## Index

### Properties

* [async](_api_cds_webapi_cdswebapi_.cdswebapi.upsertrequest.md#optional-async)
* [collection](_api_cds_webapi_cdswebapi_.cdswebapi.upsertrequest.md#optional-collection)
* [contentId](_api_cds_webapi_cdswebapi_.cdswebapi.upsertrequest.md#optional-contentid)
* [duplicateDetection](_api_cds_webapi_cdswebapi_.cdswebapi.upsertrequest.md#optional-duplicatedetection)
* [entity](_api_cds_webapi_cdswebapi_.cdswebapi.upsertrequest.md#optional-entity)
* [expand](_api_cds_webapi_cdswebapi_.cdswebapi.upsertrequest.md#optional-expand)
* [id](_api_cds_webapi_cdswebapi_.cdswebapi.upsertrequest.md#optional-id)
* [ifmatch](_api_cds_webapi_cdswebapi_.cdswebapi.upsertrequest.md#optional-ifmatch)
* [ifnonematch](_api_cds_webapi_cdswebapi_.cdswebapi.upsertrequest.md#optional-ifnonematch)
* [impersonate](_api_cds_webapi_cdswebapi_.cdswebapi.upsertrequest.md#optional-impersonate)
* [includeAnnotations](_api_cds_webapi_cdswebapi_.cdswebapi.upsertrequest.md#optional-includeannotations)
* [key](_api_cds_webapi_cdswebapi_.cdswebapi.upsertrequest.md#optional-key)
* [metadataAttributeType](_api_cds_webapi_cdswebapi_.cdswebapi.upsertrequest.md#optional-metadataattributetype)
* [navigationProperty](_api_cds_webapi_cdswebapi_.cdswebapi.upsertrequest.md#optional-navigationproperty)
* [navigationPropertyKey](_api_cds_webapi_cdswebapi_.cdswebapi.upsertrequest.md#optional-navigationpropertykey)
* [noCache](_api_cds_webapi_cdswebapi_.cdswebapi.upsertrequest.md#optional-nocache)
* [returnRepresentation](_api_cds_webapi_cdswebapi_.cdswebapi.upsertrequest.md#optional-returnrepresentation)
* [select](_api_cds_webapi_cdswebapi_.cdswebapi.upsertrequest.md#optional-select)
* [token](_api_cds_webapi_cdswebapi_.cdswebapi.upsertrequest.md#optional-token)

## Properties

### `Optional` async

• **async**? : *boolean*

*Inherited from [Request](_api_cds_webapi_cdswebapi_.cdswebapi.request.md).[async](_api_cds_webapi_cdswebapi_.cdswebapi.request.md#optional-async)*

Defined in src/api/cds-webapi/CdsWebApi.ts:68

XHR requests only! Indicates whether the requests should be made synchronously or asynchronously.Default value is 'true'(asynchronously).

___

### `Optional` collection

• **collection**? : *string*

*Inherited from [Request](_api_cds_webapi_cdswebapi_.cdswebapi.request.md).[collection](_api_cds_webapi_cdswebapi_.cdswebapi.request.md#optional-collection)*

Defined in src/api/cds-webapi/CdsWebApi.ts:70

The name of the Entity Collection or Entity Logical name.

___

### `Optional` contentId

• **contentId**? : *string*

*Inherited from [UpdateRequestBase](_api_cds_webapi_cdswebapi_.cdswebapi.updaterequestbase.md).[contentId](_api_cds_webapi_cdswebapi_.cdswebapi.updaterequestbase.md#optional-contentid)*

Defined in src/api/cds-webapi/CdsWebApi.ts:121

BATCH REQUESTS ONLY! Sets Content-ID header or references request in a Change Set.

___

### `Optional` duplicateDetection

• **duplicateDetection**? : *boolean*

*Inherited from [UpdateRequestBase](_api_cds_webapi_cdswebapi_.cdswebapi.updaterequestbase.md).[duplicateDetection](_api_cds_webapi_cdswebapi_.cdswebapi.updaterequestbase.md#optional-duplicatedetection)*

Defined in src/api/cds-webapi/CdsWebApi.ts:107

v.1.3.4+ Web API v9+ only! Boolean that enables duplicate detection.

___

### `Optional` entity

• **entity**? : *any*

*Inherited from [UpdateRequestBase](_api_cds_webapi_cdswebapi_.cdswebapi.updaterequestbase.md).[entity](_api_cds_webapi_cdswebapi_.cdswebapi.updaterequestbase.md#optional-entity)*

Defined in src/api/cds-webapi/CdsWebApi.ts:109

A JavaScript object with properties corresponding to the logical name of entity attributes(exceptions are lookups and single-valued navigation properties).

___

### `Optional` expand

• **expand**? : *[Expand](_api_cds_webapi_cdswebapi_.cdswebapi.expand.md)[]*

*Inherited from [UpdateRequestBase](_api_cds_webapi_cdswebapi_.cdswebapi.updaterequestbase.md).[expand](_api_cds_webapi_cdswebapi_.cdswebapi.updaterequestbase.md#optional-expand)*

Defined in src/api/cds-webapi/CdsWebApi.ts:111

An array of Expand Objects(described below the table) representing the $expand OData System Query Option value to control which related records are also returned.

___

### `Optional` id

• **id**? : *string*

*Inherited from [CRUDRequest](_api_cds_webapi_cdswebapi_.cdswebapi.crudrequest.md).[id](_api_cds_webapi_cdswebapi_.cdswebapi.crudrequest.md#optional-id)*

Defined in src/api/cds-webapi/CdsWebApi.ts:81

DEPRECATED Use "key" instead. A String representing the Primary Key(GUID) of the record.

___

### `Optional` ifmatch

• **ifmatch**? : *string*

*Inherited from [UpdateRequestBase](_api_cds_webapi_cdswebapi_.cdswebapi.updaterequestbase.md).[ifmatch](_api_cds_webapi_cdswebapi_.cdswebapi.updaterequestbase.md#optional-ifmatch)*

Defined in src/api/cds-webapi/CdsWebApi.ts:113

Sets If-Match header value that enables to use conditional retrieval or optimistic concurrency in applicable requests.

___

### `Optional` ifnonematch

• **ifnonematch**? : *string*

Defined in src/api/cds-webapi/CdsWebApi.ts:131

Sets If-None-Match header value that enables to use conditional retrieval in applicable requests.

___

### `Optional` impersonate

• **impersonate**? : *string*

*Inherited from [Request](_api_cds_webapi_cdswebapi_.cdswebapi.request.md).[impersonate](_api_cds_webapi_cdswebapi_.cdswebapi.request.md#optional-impersonate)*

Defined in src/api/cds-webapi/CdsWebApi.ts:72

Impersonates the user.A String representing the GUID value for the Dynamics 365 system user id.

___

### `Optional` includeAnnotations

• **includeAnnotations**? : *string*

*Inherited from [UpdateRequestBase](_api_cds_webapi_cdswebapi_.cdswebapi.updaterequestbase.md).[includeAnnotations](_api_cds_webapi_cdswebapi_.cdswebapi.updaterequestbase.md#optional-includeannotations)*

Defined in src/api/cds-webapi/CdsWebApi.ts:115

Sets Prefer header with value "odata.include-annotations=" and the specified annotation.Annotations provide additional information about lookups, options sets and other complex attribute types.

___

### `Optional` key

• **key**? : *string*

*Inherited from [CRUDRequest](_api_cds_webapi_cdswebapi_.cdswebapi.crudrequest.md).[key](_api_cds_webapi_cdswebapi_.cdswebapi.crudrequest.md#optional-key)*

Defined in src/api/cds-webapi/CdsWebApi.ts:83

A String representing collection record's Primary Key (GUID) or Alternate Key(s).

___

### `Optional` metadataAttributeType

• **metadataAttributeType**? : *string*

Defined in src/api/cds-webapi/CdsWebApi.ts:133

v.1.4.3 + Casts the AttributeMetadata to a specific type. (Used in requests to Attribute Metadata).

___

### `Optional` navigationProperty

• **navigationProperty**? : *string*

Defined in src/api/cds-webapi/CdsWebApi.ts:135

A String representing the name of a single - valued navigation property.Useful when needed to retrieve information about a related record in a single request.

___

### `Optional` navigationPropertyKey

• **navigationPropertyKey**? : *string*

Defined in src/api/cds-webapi/CdsWebApi.ts:137

v.1.4.3 + A String representing navigation property's Primary Key (GUID) or Alternate Key(s). (For example, to retrieve Attribute Metadata).

___

### `Optional` noCache

• **noCache**? : *boolean*

*Inherited from [Request](_api_cds_webapi_cdswebapi_.cdswebapi.request.md).[noCache](_api_cds_webapi_cdswebapi_.cdswebapi.request.md#optional-nocache)*

Defined in src/api/cds-webapi/CdsWebApi.ts:74

If set to 'true', DynamicsWebApi adds a request header 'Cache-Control: no-cache'.Default value is 'false'.

___

### `Optional` returnRepresentation

• **returnRepresentation**? : *boolean*

*Inherited from [UpdateRequestBase](_api_cds_webapi_cdswebapi_.cdswebapi.updaterequestbase.md).[returnRepresentation](_api_cds_webapi_cdswebapi_.cdswebapi.updaterequestbase.md#optional-returnrepresentation)*

Defined in src/api/cds-webapi/CdsWebApi.ts:117

Sets Prefer header request with value "return=representation".Use this property to return just created or updated entity in a single request.

___

### `Optional` select

• **select**? : *string[]*

*Inherited from [UpdateRequestBase](_api_cds_webapi_cdswebapi_.cdswebapi.updaterequestbase.md).[select](_api_cds_webapi_cdswebapi_.cdswebapi.updaterequestbase.md#optional-select)*

Defined in src/api/cds-webapi/CdsWebApi.ts:119

An Array(of Strings) representing the $select OData System Query Option to control which attributes will be returned.

___

### `Optional` token

• **token**? : *string*

*Inherited from [Request](_api_cds_webapi_cdswebapi_.cdswebapi.request.md).[token](_api_cds_webapi_cdswebapi_.cdswebapi.request.md#optional-token)*

Defined in src/api/cds-webapi/CdsWebApi.ts:76

Authorization Token. If set, onTokenRefresh will not be called.
