---
id: "_api_cds_webapi_cdswebapi_.cdswebapi.crudrequest"
title: "CRUDRequest"
sidebar_label: "CRUDRequest"
---

[cds-for-code](../index.md) › [Globals](../globals.md) › ["api/cds-webapi/CdsWebApi"](../modules/_api_cds_webapi_cdswebapi_.md) › [CdsWebApi](../modules/_api_cds_webapi_cdswebapi_.cdswebapi.md) › [CRUDRequest](_api_cds_webapi_cdswebapi_.cdswebapi.crudrequest.md)

## Hierarchy

* [Request](_api_cds_webapi_cdswebapi_.cdswebapi.request.md)

  ↳ **CRUDRequest**

  ↳ [CreateRequest](_api_cds_webapi_cdswebapi_.cdswebapi.createrequest.md)

  ↳ [UpdateRequestBase](_api_cds_webapi_cdswebapi_.cdswebapi.updaterequestbase.md)

  ↳ [DeleteRequest](_api_cds_webapi_cdswebapi_.cdswebapi.deleterequest.md)

  ↳ [RetrieveRequest](_api_cds_webapi_cdswebapi_.cdswebapi.retrieverequest.md)

## Index

### Properties

* [async](_api_cds_webapi_cdswebapi_.cdswebapi.crudrequest.md#optional-async)
* [collection](_api_cds_webapi_cdswebapi_.cdswebapi.crudrequest.md#optional-collection)
* [id](_api_cds_webapi_cdswebapi_.cdswebapi.crudrequest.md#optional-id)
* [impersonate](_api_cds_webapi_cdswebapi_.cdswebapi.crudrequest.md#optional-impersonate)
* [key](_api_cds_webapi_cdswebapi_.cdswebapi.crudrequest.md#optional-key)
* [noCache](_api_cds_webapi_cdswebapi_.cdswebapi.crudrequest.md#optional-nocache)
* [token](_api_cds_webapi_cdswebapi_.cdswebapi.crudrequest.md#optional-token)

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

### `Optional` id

• **id**? : *string*

Defined in src/api/cds-webapi/CdsWebApi.ts:81

DEPRECATED Use "key" instead. A String representing the Primary Key(GUID) of the record.

___

### `Optional` impersonate

• **impersonate**? : *string*

*Inherited from [Request](_api_cds_webapi_cdswebapi_.cdswebapi.request.md).[impersonate](_api_cds_webapi_cdswebapi_.cdswebapi.request.md#optional-impersonate)*

Defined in src/api/cds-webapi/CdsWebApi.ts:72

Impersonates the user.A String representing the GUID value for the Dynamics 365 system user id.

___

### `Optional` key

• **key**? : *string*

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
