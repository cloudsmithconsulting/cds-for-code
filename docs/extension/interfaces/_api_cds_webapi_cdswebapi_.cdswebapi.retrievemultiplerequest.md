[cds-for-code](../README.md) › [Globals](../globals.md) › ["api/cds-webapi/CdsWebApi"](../modules/_api_cds_webapi_cdswebapi_.md) › [CdsWebApi](../modules/_api_cds_webapi_cdswebapi_.cdswebapi.md) › [RetrieveMultipleRequest](_api_cds_webapi_cdswebapi_.cdswebapi.retrievemultiplerequest.md)

# Interface: RetrieveMultipleRequest

## Hierarchy

* [Request](_api_cds_webapi_cdswebapi_.cdswebapi.request.md)

  ↳ **RetrieveMultipleRequest**

## Index

### Properties

* [async](_api_cds_webapi_cdswebapi_.cdswebapi.retrievemultiplerequest.md#optional-async)
* [collection](_api_cds_webapi_cdswebapi_.cdswebapi.retrievemultiplerequest.md#optional-collection)
* [count](_api_cds_webapi_cdswebapi_.cdswebapi.retrievemultiplerequest.md#optional-count)
* [expand](_api_cds_webapi_cdswebapi_.cdswebapi.retrievemultiplerequest.md#optional-expand)
* [filter](_api_cds_webapi_cdswebapi_.cdswebapi.retrievemultiplerequest.md#optional-filter)
* [impersonate](_api_cds_webapi_cdswebapi_.cdswebapi.retrievemultiplerequest.md#optional-impersonate)
* [includeAnnotations](_api_cds_webapi_cdswebapi_.cdswebapi.retrievemultiplerequest.md#optional-includeannotations)
* [maxPageSize](_api_cds_webapi_cdswebapi_.cdswebapi.retrievemultiplerequest.md#optional-maxpagesize)
* [noCache](_api_cds_webapi_cdswebapi_.cdswebapi.retrievemultiplerequest.md#optional-nocache)
* [orderBy](_api_cds_webapi_cdswebapi_.cdswebapi.retrievemultiplerequest.md#optional-orderby)
* [select](_api_cds_webapi_cdswebapi_.cdswebapi.retrievemultiplerequest.md#optional-select)
* [token](_api_cds_webapi_cdswebapi_.cdswebapi.retrievemultiplerequest.md#optional-token)
* [top](_api_cds_webapi_cdswebapi_.cdswebapi.retrievemultiplerequest.md#optional-top)
* [trackChanges](_api_cds_webapi_cdswebapi_.cdswebapi.retrievemultiplerequest.md#optional-trackchanges)

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

### `Optional` count

• **count**? : *boolean*

Defined in src/api/cds-webapi/CdsWebApi.ts:174

Boolean that sets the $count system query option with a value of true to include a count of entities that match the filter criteria up to 5000(per page).Do not use $top with $count!

___

### `Optional` expand

• **expand**? : *[Expand](_api_cds_webapi_cdswebapi_.cdswebapi.expand.md)[]*

Defined in src/api/cds-webapi/CdsWebApi.ts:172

An array of Expand Objects(described below the table) representing the $expand OData System Query Option value to control which related records are also returned.

___

### `Optional` filter

• **filter**? : *string*

Defined in src/api/cds-webapi/CdsWebApi.ts:176

Use the $filter system query option to set criteria for which entities will be returned.

___

### `Optional` impersonate

• **impersonate**? : *string*

*Inherited from [Request](_api_cds_webapi_cdswebapi_.cdswebapi.request.md).[impersonate](_api_cds_webapi_cdswebapi_.cdswebapi.request.md#optional-impersonate)*

Defined in src/api/cds-webapi/CdsWebApi.ts:70

Impersonates the user.A String representing the GUID value for the Dynamics 365 system user id.

___

### `Optional` includeAnnotations

• **includeAnnotations**? : *string*

Defined in src/api/cds-webapi/CdsWebApi.ts:178

Sets Prefer header with value "odata.include-annotations=" and the specified annotation.Annotations provide additional information about lookups, options sets and other complex attribute types.

___

### `Optional` maxPageSize

• **maxPageSize**? : *number*

Defined in src/api/cds-webapi/CdsWebApi.ts:180

Sets the odata.maxpagesize preference value to request the number of entities returned in the response.

___

### `Optional` noCache

• **noCache**? : *boolean*

*Inherited from [Request](_api_cds_webapi_cdswebapi_.cdswebapi.request.md).[noCache](_api_cds_webapi_cdswebapi_.cdswebapi.request.md#optional-nocache)*

Defined in src/api/cds-webapi/CdsWebApi.ts:72

If set to 'true', DynamicsWebApi adds a request header 'Cache-Control: no-cache'.Default value is 'false'.

___

### `Optional` orderBy

• **orderBy**? : *string[]*

Defined in src/api/cds-webapi/CdsWebApi.ts:182

An Array(of string) representing the order in which items are returned using the $orderby system query option.Use the asc or desc suffix to specify ascending or descending order respectively.The default is ascending if the suffix isn't applied.

___

### `Optional` select

• **select**? : *string[]*

Defined in src/api/cds-webapi/CdsWebApi.ts:184

An Array(of Strings) representing the $select OData System Query Option to control which attributes will be returned.

___

### `Optional` token

• **token**? : *string*

*Inherited from [Request](_api_cds_webapi_cdswebapi_.cdswebapi.request.md).[token](_api_cds_webapi_cdswebapi_.cdswebapi.request.md#optional-token)*

Defined in src/api/cds-webapi/CdsWebApi.ts:74

Authorization Token. If set, onTokenRefresh will not be called.

___

### `Optional` top

• **top**? : *number*

Defined in src/api/cds-webapi/CdsWebApi.ts:186

Limit the number of results returned by using the $top system query option.Do not use $top with $count!

___

### `Optional` trackChanges

• **trackChanges**? : *boolean*

Defined in src/api/cds-webapi/CdsWebApi.ts:188

Sets Prefer header with value 'odata.track-changes' to request that a delta link be returned which can subsequently be used to retrieve entity changes.
