---
id: "_api_cds_webapi_cdswebapi_.cdswebapi.deleterequest"
title: "DeleteRequest"
sidebar_label: "DeleteRequest"
---

[cds-for-code](../index.md) › [Globals](../globals.md) › ["api/cds-webapi/CdsWebApi"](../modules/_api_cds_webapi_cdswebapi_.md) › [CdsWebApi](../modules/_api_cds_webapi_cdswebapi_.cdswebapi.md) › [DeleteRequest](_api_cds_webapi_cdswebapi_.cdswebapi.deleterequest.md)

## Hierarchy

  ↳ [CRUDRequest](_api_cds_webapi_cdswebapi_.cdswebapi.crudrequest.md)

  ↳ **DeleteRequest**

## Index

### Properties

* [async](_api_cds_webapi_cdswebapi_.cdswebapi.deleterequest.md#optional-async)
* [collection](_api_cds_webapi_cdswebapi_.cdswebapi.deleterequest.md#optional-collection)
* [contentId](_api_cds_webapi_cdswebapi_.cdswebapi.deleterequest.md#optional-contentid)
* [id](_api_cds_webapi_cdswebapi_.cdswebapi.deleterequest.md#optional-id)
* [ifmatch](_api_cds_webapi_cdswebapi_.cdswebapi.deleterequest.md#optional-ifmatch)
* [impersonate](_api_cds_webapi_cdswebapi_.cdswebapi.deleterequest.md#optional-impersonate)
* [key](_api_cds_webapi_cdswebapi_.cdswebapi.deleterequest.md#optional-key)
* [noCache](_api_cds_webapi_cdswebapi_.cdswebapi.deleterequest.md#optional-nocache)
* [token](_api_cds_webapi_cdswebapi_.cdswebapi.deleterequest.md#optional-token)

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

Defined in src/api/cds-webapi/CdsWebApi.ts:144

BATCH REQUESTS ONLY! Sets Content-ID header or references request in a Change Set.

___

### `Optional` id

• **id**? : *string*

*Inherited from [CRUDRequest](_api_cds_webapi_cdswebapi_.cdswebapi.crudrequest.md).[id](_api_cds_webapi_cdswebapi_.cdswebapi.crudrequest.md#optional-id)*

Defined in src/api/cds-webapi/CdsWebApi.ts:81

DEPRECATED Use "key" instead. A String representing the Primary Key(GUID) of the record.

___

### `Optional` ifmatch

• **ifmatch**? : *string*

Defined in src/api/cds-webapi/CdsWebApi.ts:142

Sets If-Match header value that enables to use conditional retrieval or optimistic concurrency in applicable requests.

___

### `Optional` impersonate

• **impersonate**? : *string*

*Inherited from [Request](_api_cds_webapi_cdswebapi_.cdswebapi.request.md).[impersonate](_api_cds_webapi_cdswebapi_.cdswebapi.request.md#optional-impersonate)*

Defined in src/api/cds-webapi/CdsWebApi.ts:72

Impersonates the user.A String representing the GUID value for the Dynamics 365 system user id.

___

### `Optional` key

• **key**? : *string*

*Inherited from [CRUDRequest](_api_cds_webapi_cdswebapi_.cdswebapi.crudrequest.md).[key](_api_cds_webapi_cdswebapi_.cdswebapi.crudrequest.md#optional-key)*

Defined in src/api/cds-webapi/CdsWebApi.ts:83

A String representing collection record's Primary Key (GUID) or Alternate Key(s).

___

### `Optional` noCache

• **noCache**? : *boolean*

*Inherited from [Request](_api_cds_webapi_cdswebapi_.cdswebapi.request.md).[noCache](_api_cds_webapi_cdswebapi_.cdswebapi.request.md#optional-nocache)*

Defined in src/api/cds-webapi/CdsWebApi.ts:74

If set to 'true', DynamicsWebApi adds a request header 'Cache-Control: no-cache'.Default value is 'false'.

___

### `Optional` token

• **token**? : *string*

*Inherited from [Request](_api_cds_webapi_cdswebapi_.cdswebapi.request.md).[token](_api_cds_webapi_cdswebapi_.cdswebapi.request.md#optional-token)*

Defined in src/api/cds-webapi/CdsWebApi.ts:76

Authorization Token. If set, onTokenRefresh will not be called.
