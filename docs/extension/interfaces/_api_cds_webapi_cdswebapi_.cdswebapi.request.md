[cds-for-code](../README.md) › [Globals](../globals.md) › ["api/cds-webapi/CdsWebApi"](../modules/_api_cds_webapi_cdswebapi_.md) › [CdsWebApi](../modules/_api_cds_webapi_cdswebapi_.cdswebapi.md) › [Request](_api_cds_webapi_cdswebapi_.cdswebapi.request.md)

# Interface: Request

## Hierarchy

* **Request**

  ↳ [CRUDRequest](_api_cds_webapi_cdswebapi_.cdswebapi.crudrequest.md)

  ↳ [RetrieveMultipleRequest](_api_cds_webapi_cdswebapi_.cdswebapi.retrievemultiplerequest.md)

## Index

### Properties

* [async](_api_cds_webapi_cdswebapi_.cdswebapi.request.md#optional-async)
* [collection](_api_cds_webapi_cdswebapi_.cdswebapi.request.md#optional-collection)
* [impersonate](_api_cds_webapi_cdswebapi_.cdswebapi.request.md#optional-impersonate)
* [noCache](_api_cds_webapi_cdswebapi_.cdswebapi.request.md#optional-nocache)
* [token](_api_cds_webapi_cdswebapi_.cdswebapi.request.md#optional-token)

## Properties

### `Optional` async

• **async**? : *boolean*

Defined in src/api/cds-webapi/CdsWebApi.ts:66

XHR requests only! Indicates whether the requests should be made synchronously or asynchronously.Default value is 'true'(asynchronously).

___

### `Optional` collection

• **collection**? : *string*

Defined in src/api/cds-webapi/CdsWebApi.ts:68

The name of the Entity Collection or Entity Logical name.

___

### `Optional` impersonate

• **impersonate**? : *string*

Defined in src/api/cds-webapi/CdsWebApi.ts:70

Impersonates the user.A String representing the GUID value for the Dynamics 365 system user id.

___

### `Optional` noCache

• **noCache**? : *boolean*

Defined in src/api/cds-webapi/CdsWebApi.ts:72

If set to 'true', DynamicsWebApi adds a request header 'Cache-Control: no-cache'.Default value is 'false'.

___

### `Optional` token

• **token**? : *string*

Defined in src/api/cds-webapi/CdsWebApi.ts:74

Authorization Token. If set, onTokenRefresh will not be called.
