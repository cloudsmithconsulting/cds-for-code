---
id: "_api_cds_webapi_cdswebapi_.cdswebapi.retrieverequest"
title: "RetrieveRequest"
sidebar_label: "RetrieveRequest"
---

[cds-for-code](../index.md) › [Globals](../globals.md) › ["api/cds-webapi/CdsWebApi"](../modules/_api_cds_webapi_cdswebapi_.md) › [CdsWebApi](../modules/_api_cds_webapi_cdswebapi_.cdswebapi.md) › [RetrieveRequest](_api_cds_webapi_cdswebapi_.cdswebapi.retrieverequest.md)

## Hierarchy

  ↳ [CRUDRequest](_api_cds_webapi_cdswebapi_.cdswebapi.crudrequest.md)

  ↳ **RetrieveRequest**

## Index

### Properties

* [async](_api_cds_webapi_cdswebapi_.cdswebapi.retrieverequest.md#optional-async)
* [collection](_api_cds_webapi_cdswebapi_.cdswebapi.retrieverequest.md#optional-collection)
* [expand](_api_cds_webapi_cdswebapi_.cdswebapi.retrieverequest.md#optional-expand)
* [filter](_api_cds_webapi_cdswebapi_.cdswebapi.retrieverequest.md#optional-filter)
* [id](_api_cds_webapi_cdswebapi_.cdswebapi.retrieverequest.md#optional-id)
* [ifmatch](_api_cds_webapi_cdswebapi_.cdswebapi.retrieverequest.md#optional-ifmatch)
* [ifnonematch](_api_cds_webapi_cdswebapi_.cdswebapi.retrieverequest.md#optional-ifnonematch)
* [impersonate](_api_cds_webapi_cdswebapi_.cdswebapi.retrieverequest.md#optional-impersonate)
* [includeAnnotations](_api_cds_webapi_cdswebapi_.cdswebapi.retrieverequest.md#optional-includeannotations)
* [key](_api_cds_webapi_cdswebapi_.cdswebapi.retrieverequest.md#optional-key)
* [metadataAttributeType](_api_cds_webapi_cdswebapi_.cdswebapi.retrieverequest.md#optional-metadataattributetype)
* [navigationProperty](_api_cds_webapi_cdswebapi_.cdswebapi.retrieverequest.md#optional-navigationproperty)
* [navigationPropertyKey](_api_cds_webapi_cdswebapi_.cdswebapi.retrieverequest.md#optional-navigationpropertykey)
* [noCache](_api_cds_webapi_cdswebapi_.cdswebapi.retrieverequest.md#optional-nocache)
* [savedQuery](_api_cds_webapi_cdswebapi_.cdswebapi.retrieverequest.md#optional-savedquery)
* [select](_api_cds_webapi_cdswebapi_.cdswebapi.retrieverequest.md#optional-select)
* [token](_api_cds_webapi_cdswebapi_.cdswebapi.retrieverequest.md#optional-token)
* [userQuery](_api_cds_webapi_cdswebapi_.cdswebapi.retrieverequest.md#optional-userquery)

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

### `Optional` expand

• **expand**? : *[Expand](_api_cds_webapi_cdswebapi_.cdswebapi.expand.md)[]*

Defined in src/api/cds-webapi/CdsWebApi.ts:149

An array of Expand Objects(described below the table) representing the $expand OData System Query Option value to control which related records are also returned.

___

### `Optional` filter

• **filter**? : *string*

Defined in src/api/cds-webapi/CdsWebApi.ts:151

Use the $filter system query option to set criteria for which entities will be returned.

___

### `Optional` id

• **id**? : *string*

*Inherited from [CRUDRequest](_api_cds_webapi_cdswebapi_.cdswebapi.crudrequest.md).[id](_api_cds_webapi_cdswebapi_.cdswebapi.crudrequest.md#optional-id)*

Defined in src/api/cds-webapi/CdsWebApi.ts:81

DEPRECATED Use "key" instead. A String representing the Primary Key(GUID) of the record.

___

### `Optional` ifmatch

• **ifmatch**? : *string*

Defined in src/api/cds-webapi/CdsWebApi.ts:153

Sets If-Match header value that enables to use conditional retrieval or optimistic concurrency in applicable requests.

___

### `Optional` ifnonematch

• **ifnonematch**? : *string*

Defined in src/api/cds-webapi/CdsWebApi.ts:155

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

Defined in src/api/cds-webapi/CdsWebApi.ts:157

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

Defined in src/api/cds-webapi/CdsWebApi.ts:159

v.1.4.3 + Casts the AttributeMetadata to a specific type. (Used in requests to Attribute Metadata).

___

### `Optional` navigationProperty

• **navigationProperty**? : *string*

Defined in src/api/cds-webapi/CdsWebApi.ts:161

A String representing the name of a single - valued navigation property.Useful when needed to retrieve information about a related record in a single request.

___

### `Optional` navigationPropertyKey

• **navigationPropertyKey**? : *string*

Defined in src/api/cds-webapi/CdsWebApi.ts:163

v.1.4.3 + A String representing navigation property's Primary Key (GUID) or Alternate Key(s). (For example, to retrieve Attribute Metadata).

___

### `Optional` noCache

• **noCache**? : *boolean*

*Inherited from [Request](_api_cds_webapi_cdswebapi_.cdswebapi.request.md).[noCache](_api_cds_webapi_cdswebapi_.cdswebapi.request.md#optional-nocache)*

Defined in src/api/cds-webapi/CdsWebApi.ts:74

If set to 'true', DynamicsWebApi adds a request header 'Cache-Control: no-cache'.Default value is 'false'.

___

### `Optional` savedQuery

• **savedQuery**? : *string*

Defined in src/api/cds-webapi/CdsWebApi.ts:165

A String representing the GUID value of the saved query.

___

### `Optional` select

• **select**? : *string[]*

Defined in src/api/cds-webapi/CdsWebApi.ts:167

An Array(of Strings) representing the $select OData System Query Option to control which attributes will be returned.

___

### `Optional` token

• **token**? : *string*

*Inherited from [Request](_api_cds_webapi_cdswebapi_.cdswebapi.request.md).[token](_api_cds_webapi_cdswebapi_.cdswebapi.request.md#optional-token)*

Defined in src/api/cds-webapi/CdsWebApi.ts:76

Authorization Token. If set, onTokenRefresh will not be called.

___

### `Optional` userQuery

• **userQuery**? : *string*

Defined in src/api/cds-webapi/CdsWebApi.ts:169

A String representing the GUID value of the user query.
