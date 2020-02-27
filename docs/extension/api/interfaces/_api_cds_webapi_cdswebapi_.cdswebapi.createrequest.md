---
id: "_api_cds_webapi_cdswebapi_.cdswebapi.createrequest"
title: "CreateRequest"
sidebar_label: "CreateRequest"
---

[cds-for-code](../index.md) › [Globals](../globals.md) › ["api/cds-webapi/CdsWebApi"](../modules/_api_cds_webapi_cdswebapi_.md) › [CdsWebApi](../modules/_api_cds_webapi_cdswebapi_.cdswebapi.md) › [CreateRequest](_api_cds_webapi_cdswebapi_.cdswebapi.createrequest.md)

## Hierarchy

  ↳ [CRUDRequest](_api_cds_webapi_cdswebapi_.cdswebapi.crudrequest.md)

  ↳ **CreateRequest**

## Index

### Properties

* [async](_api_cds_webapi_cdswebapi_.cdswebapi.createrequest.md#optional-async)
* [collection](_api_cds_webapi_cdswebapi_.cdswebapi.createrequest.md#optional-collection)
* [contentId](_api_cds_webapi_cdswebapi_.cdswebapi.createrequest.md#optional-contentid)
* [duplicateDetection](_api_cds_webapi_cdswebapi_.cdswebapi.createrequest.md#optional-duplicatedetection)
* [entity](_api_cds_webapi_cdswebapi_.cdswebapi.createrequest.md#optional-entity)
* [expand](_api_cds_webapi_cdswebapi_.cdswebapi.createrequest.md#optional-expand)
* [id](_api_cds_webapi_cdswebapi_.cdswebapi.createrequest.md#optional-id)
* [impersonate](_api_cds_webapi_cdswebapi_.cdswebapi.createrequest.md#optional-impersonate)
* [includeAnnotations](_api_cds_webapi_cdswebapi_.cdswebapi.createrequest.md#optional-includeannotations)
* [key](_api_cds_webapi_cdswebapi_.cdswebapi.createrequest.md#optional-key)
* [navigationProperty](_api_cds_webapi_cdswebapi_.cdswebapi.createrequest.md#optional-navigationproperty)
* [navigationPropertyKey](_api_cds_webapi_cdswebapi_.cdswebapi.createrequest.md#optional-navigationpropertykey)
* [noCache](_api_cds_webapi_cdswebapi_.cdswebapi.createrequest.md#optional-nocache)
* [returnRepresentation](_api_cds_webapi_cdswebapi_.cdswebapi.createrequest.md#optional-returnrepresentation)
* [token](_api_cds_webapi_cdswebapi_.cdswebapi.createrequest.md#optional-token)

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

Defined in src/api/cds-webapi/CdsWebApi.ts:102

BATCH REQUESTS ONLY! Sets Content-ID header or references request in a Change Set.

___

### `Optional` duplicateDetection

• **duplicateDetection**? : *boolean*

Defined in src/api/cds-webapi/CdsWebApi.ts:88

v.1.3.4+ Web API v9+ only! Boolean that enables duplicate detection.

___

### `Optional` entity

• **entity**? : *any*

Defined in src/api/cds-webapi/CdsWebApi.ts:90

A JavaScript object with properties corresponding to the logical name of entity attributes(exceptions are lookups and single-valued navigation properties).

___

### `Optional` expand

• **expand**? : *[Expand](_api_cds_webapi_cdswebapi_.cdswebapi.expand.md)[]*

Defined in src/api/cds-webapi/CdsWebApi.ts:92

An array of Expand Objects(described below the table) representing the $expand OData System Query Option value to control which related records are also returned.

___

### `Optional` id

• **id**? : *string*

*Inherited from [CRUDRequest](_api_cds_webapi_cdswebapi_.cdswebapi.crudrequest.md).[id](_api_cds_webapi_cdswebapi_.cdswebapi.crudrequest.md#optional-id)*

Defined in src/api/cds-webapi/CdsWebApi.ts:81

DEPRECATED Use "key" instead. A String representing the Primary Key(GUID) of the record.

___

### `Optional` impersonate

• **impersonate**? : *string*

*Inherited from [Request](_api_cds_webapi_cdswebapi_.cdswebapi.request.md).[impersonate](_api_cds_webapi_cdswebapi_.cdswebapi.request.md#optional-impersonate)*

Defined in src/api/cds-webapi/CdsWebApi.ts:72

Impersonates the user.A String representing the GUID value for the Dynamics 365 system user id.

___

### `Optional` includeAnnotations

• **includeAnnotations**? : *string*

Defined in src/api/cds-webapi/CdsWebApi.ts:94

Sets Prefer header with value "odata.include-annotations=" and the specified annotation.Annotations provide additional information about lookups, options sets and other complex attribute types.

___

### `Optional` key

• **key**? : *string*

*Inherited from [CRUDRequest](_api_cds_webapi_cdswebapi_.cdswebapi.crudrequest.md).[key](_api_cds_webapi_cdswebapi_.cdswebapi.crudrequest.md#optional-key)*

Defined in src/api/cds-webapi/CdsWebApi.ts:83

A String representing collection record's Primary Key (GUID) or Alternate Key(s).

___

### `Optional` navigationProperty

• **navigationProperty**? : *string*

Defined in src/api/cds-webapi/CdsWebApi.ts:96

A String representing the name of a single - valued navigation property.Useful when needed to retrieve information about a related record in a single request.

___

### `Optional` navigationPropertyKey

• **navigationPropertyKey**? : *string*

Defined in src/api/cds-webapi/CdsWebApi.ts:98

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

Defined in src/api/cds-webapi/CdsWebApi.ts:100

Sets Prefer header request with value "return=representation".Use this property to return just created or updated entity in a single request.

___

### `Optional` token

• **token**? : *string*

*Inherited from [Request](_api_cds_webapi_cdswebapi_.cdswebapi.request.md).[token](_api_cds_webapi_cdswebapi_.cdswebapi.request.md#optional-token)*

Defined in src/api/cds-webapi/CdsWebApi.ts:76

Authorization Token. If set, onTokenRefresh will not be called.
