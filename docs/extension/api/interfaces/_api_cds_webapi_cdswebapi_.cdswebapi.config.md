---
id: "_api_cds_webapi_cdswebapi_.cdswebapi.config"
title: "Config"
sidebar_label: "Config"
---

[cds-for-code](../index.md) › [Globals](../globals.md) › ["api/cds-webapi/CdsWebApi"](../modules/_api_cds_webapi_cdswebapi_.md) › [CdsWebApi](../modules/_api_cds_webapi_cdswebapi_.cdswebapi.md) › [Config](_api_cds_webapi_cdswebapi_.cdswebapi.config.md)

Configuration object for DynamicsWebApi

**`typedef`** {object} DWAConfig

**`property`** {string} webApiUrl - A String representing the GUID value for the Dynamics 365 system user id. Impersonates the user.

**`property`** {string} webApiVersion - The version of Web API to use, for example: "8.1"

**`property`** {string} impersonate - A String representing a URL to Web API (webApiVersion not required if webApiUrl specified) [not used inside of CRM]

**`property`** {Function} onTokenRefresh - A function that is called when a security token needs to be refreshed.

**`property`** {string} includeAnnotations - Sets Prefer header with value "odata.include-annotations=" and the specified annotation. Annotations provide additional information about lookups, options sets and other complex attribute types.

**`property`** {string} maxPageSize - Sets the odata.maxpagesize preference value to request the number of entities returned in the response.

**`property`** {boolean} returnRepresentation - Sets Prefer header request with value "return=representation". Use this property to return just created or updated entity in a single request.

**`property`** {boolean} useEntityNames - Indicates whether to use Entity Logical Names instead of Collection Logical Names.

## Hierarchy

* **Config**

## Index

### Properties

* [appUrl](_api_cds_webapi_cdswebapi_.cdswebapi.config.md#optional-appurl)
* [credentials](_api_cds_webapi_cdswebapi_.cdswebapi.config.md#credentials)
* [discoveryUrl](_api_cds_webapi_cdswebapi_.cdswebapi.config.md#optional-discoveryurl)
* [environmentId](_api_cds_webapi_cdswebapi_.cdswebapi.config.md#optional-environmentid)
* [id](_api_cds_webapi_cdswebapi_.cdswebapi.config.md#id)
* [impersonate](_api_cds_webapi_cdswebapi_.cdswebapi.config.md#optional-impersonate)
* [includeAnnotations](_api_cds_webapi_cdswebapi_.cdswebapi.config.md#optional-includeannotations)
* [maxPageSize](_api_cds_webapi_cdswebapi_.cdswebapi.config.md#optional-maxpagesize)
* [name](_api_cds_webapi_cdswebapi_.cdswebapi.config.md#name)
* [onTokenRefresh](_api_cds_webapi_cdswebapi_.cdswebapi.config.md#optional-ontokenrefresh)
* [orgId](_api_cds_webapi_cdswebapi_.cdswebapi.config.md#optional-orgid)
* [orgName](_api_cds_webapi_cdswebapi_.cdswebapi.config.md#optional-orgname)
* [returnRepresentation](_api_cds_webapi_cdswebapi_.cdswebapi.config.md#optional-returnrepresentation)
* [timeout](_api_cds_webapi_cdswebapi_.cdswebapi.config.md#optional-timeout)
* [type](_api_cds_webapi_cdswebapi_.cdswebapi.config.md#type)
* [useEntityNames](_api_cds_webapi_cdswebapi_.cdswebapi.config.md#optional-useentitynames)
* [webApiUrl](_api_cds_webapi_cdswebapi_.cdswebapi.config.md#optional-webapiurl)
* [webApiVersion](_api_cds_webapi_cdswebapi_.cdswebapi.config.md#optional-webapiversion)

## Properties

### `Optional` appUrl

• **appUrl**? : *string*

Defined in src/api/cds-webapi/CdsWebApi.ts:218

A string representing the Url to use when attempting a web operation against this org

___

###  credentials

• **credentials**: *[ICredential](_core_security_types_.icredential.md)*

Defined in src/api/cds-webapi/CdsWebApi.ts:226

The credentials to use when connecting to the API endpoint

___

### `Optional` discoveryUrl

• **discoveryUrl**? : *string*

Defined in src/api/cds-webapi/CdsWebApi.ts:222

A string representation of a URL that can discovery this instance.

___

### `Optional` environmentId

• **environmentId**? : *string*

Defined in src/api/cds-webapi/CdsWebApi.ts:230

The CDS Environment ID of the organization

___

###  id

• **id**: *string*

Defined in src/api/cds-webapi/CdsWebApi.ts:212

the unique ID of the configuration

___

### `Optional` impersonate

• **impersonate**? : *string*

Defined in src/api/cds-webapi/CdsWebApi.ts:234

A String representing a URL to Web API(webApiVersion not required if webApiUrl specified)[not used inside of CRM]

___

### `Optional` includeAnnotations

• **includeAnnotations**? : *string*

Defined in src/api/cds-webapi/CdsWebApi.ts:238

Sets Prefer header with value "odata.include-annotations=" and the specified annotation.Annotations provide additional information about lookups, options sets and other complex attribute types.

___

### `Optional` maxPageSize

• **maxPageSize**? : *string*

Defined in src/api/cds-webapi/CdsWebApi.ts:240

Sets the odata.maxpagesize preference value to request the number of entities returned in the response.

___

###  name

• **name**: *string*

Defined in src/api/cds-webapi/CdsWebApi.ts:214

The name of the connection

___

### `Optional` onTokenRefresh

• **onTokenRefresh**? : *function*

Defined in src/api/cds-webapi/CdsWebApi.ts:236

A function that is called when a security token needs to be refreshed.

#### Type declaration:

▸ (`callback`: [OnTokenAcquiredCallback](_api_cds_webapi_cdswebapi_.cdswebapi.ontokenacquiredcallback.md)): *void*

**Parameters:**

Name | Type |
------ | ------ |
`callback` | [OnTokenAcquiredCallback](_api_cds_webapi_cdswebapi_.cdswebapi.ontokenacquiredcallback.md) |

___

### `Optional` orgId

• **orgId**? : *string*

Defined in src/api/cds-webapi/CdsWebApi.ts:228

The ID of the organization

___

### `Optional` orgName

• **orgName**? : *string*

Defined in src/api/cds-webapi/CdsWebApi.ts:232

The name of the organization

___

### `Optional` returnRepresentation

• **returnRepresentation**? : *boolean*

Defined in src/api/cds-webapi/CdsWebApi.ts:242

Sets Prefer header request with value "return=representation".Use this property to return just created or updated entity in a single request.

___

### `Optional` timeout

• **timeout**? : *number*

Defined in src/api/cds-webapi/CdsWebApi.ts:246

Sets a number of milliseconds before a request times out

___

###  type

• **type**: *[ConfigType](../enums/_api_cds_webapi_cdswebapi_.cdswebapi.configtype.md)*

Defined in src/api/cds-webapi/CdsWebApi.ts:216

The type of connection/configuration this relates to

___

### `Optional` useEntityNames

• **useEntityNames**? : *boolean*

Defined in src/api/cds-webapi/CdsWebApi.ts:244

Indicates whether to use Entity Logical Names instead of Collection Logical Names.

___

### `Optional` webApiUrl

• **webApiUrl**? : *string*

Defined in src/api/cds-webapi/CdsWebApi.ts:220

A String representing the URL prefix to use when attempting a web API operation against this org

___

### `Optional` webApiVersion

• **webApiVersion**? : *string*

Defined in src/api/cds-webapi/CdsWebApi.ts:224

The version of Web API to use, for example: "8.1"
