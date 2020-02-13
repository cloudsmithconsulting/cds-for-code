---
id: "_api_cds_webapi_odata_sendrequest_"
title: "api/cds-webapi/odata/sendRequest"
sidebar_label: "api/cds-webapi/odata/sendRequest"
---

[cds-for-code](../index.md) › [Globals](../globals.md) › ["api/cds-webapi/odata/sendRequest"](_api_cds_webapi_odata_sendrequest_.md)

## Index

### Variables

* [_entityNames](_api_cds_webapi_odata_sendrequest_.md#let-_entitynames)
* [batchRequestCollection](_api_cds_webapi_odata_sendrequest_.md#let-batchrequestcollection)
* [responseParseParams](_api_cds_webapi_odata_sendrequest_.md#let-responseparseparams)

### Functions

* [_getCollectionName](_api_cds_webapi_odata_sendrequest_.md#_getcollectionname)
* [_getEntityNames](_api_cds_webapi_odata_sendrequest_.md#_getentitynames)
* [_isEntityNameException](_api_cds_webapi_odata_sendrequest_.md#_isentitynameexception)
* [defaultAuthRetry](_api_cds_webapi_odata_sendrequest_.md#const-defaultauthretry)
* [findCollectionName](_api_cds_webapi_odata_sendrequest_.md#findcollectionname)
* [makeDiscoveryRequest](_api_cds_webapi_odata_sendrequest_.md#makediscoveryrequest)
* [makeRequest](_api_cds_webapi_odata_sendrequest_.md#makerequest)
* [sendRequest](_api_cds_webapi_odata_sendrequest_.md#sendrequest)
* [setStandardHeaders](_api_cds_webapi_odata_sendrequest_.md#setstandardheaders)
* [stringifyData](_api_cds_webapi_odata_sendrequest_.md#stringifydata)

## Variables

### `Let` _entityNames

• **_entityNames**: *any*

Defined in src/api/cds-webapi/odata/sendRequest.ts:16

___

### `Let` batchRequestCollection

• **batchRequestCollection**: *any[]* = []

Defined in src/api/cds-webapi/odata/sendRequest.ts:118

___

### `Let` responseParseParams

• **responseParseParams**: *any[]* = []

Defined in src/api/cds-webapi/odata/sendRequest.ts:119

## Functions

###  _getCollectionName

▸ **_getCollectionName**(`entityName`: string, `config`: [Config](../interfaces/_api_cds_webapi_cdswebapi_.cdswebapi.config.md), `resolve?`: function, `reject?`: function): *void*

Defined in src/api/cds-webapi/odata/sendRequest.ts:382

**Parameters:**

▪ **entityName**: *string*

▪ **config**: *[Config](../interfaces/_api_cds_webapi_cdswebapi_.cdswebapi.config.md)*

▪`Optional`  **resolve**: *function*

▸ (`value?`: any): *any*

**Parameters:**

Name | Type |
------ | ------ |
`value?` | any |

▪`Optional`  **reject**: *function*

▸ (`reason?`: any): *any*

**Parameters:**

Name | Type |
------ | ------ |
`reason?` | any |

**Returns:** *void*

___

###  _getEntityNames

▸ **_getEntityNames**(`entityName`: string, `config`: [Config](../interfaces/_api_cds_webapi_cdswebapi_.cdswebapi.config.md), `successCallback?`: function, `errorCallback?`: function): *void*

Defined in src/api/cds-webapi/odata/sendRequest.ts:323

**Parameters:**

▪ **entityName**: *string*

▪ **config**: *[Config](../interfaces/_api_cds_webapi_cdswebapi_.cdswebapi.config.md)*

▪`Optional`  **successCallback**: *function*

▸ (`value?`: any): *any*

**Parameters:**

Name | Type |
------ | ------ |
`value?` | any |

▪`Optional`  **errorCallback**: *function*

▸ (`reason?`: any): *any*

**Parameters:**

Name | Type |
------ | ------ |
`reason?` | any |

**Returns:** *void*

___

###  _isEntityNameException

▸ **_isEntityNameException**(`entityName`: string): *boolean*

Defined in src/api/cds-webapi/odata/sendRequest.ts:374

**Parameters:**

Name | Type |
------ | ------ |
`entityName` | string |

**Returns:** *boolean*

___

### `Const` defaultAuthRetry

▸ **defaultAuthRetry**(`config`: any): *boolean*

Defined in src/api/cds-webapi/odata/sendRequest.ts:18

**Parameters:**

Name | Type |
------ | ------ |
`config` | any |

**Returns:** *boolean*

___

###  findCollectionName

▸ **findCollectionName**(`entityName`: string): *string*

Defined in src/api/cds-webapi/odata/sendRequest.ts:27

Searches for a collection name by provided entity name in a cached entity metadata.
The returned collection name can be null.

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`entityName` | string | entity name |

**Returns:** *string*

- a collection name

___

###  makeDiscoveryRequest

▸ **makeDiscoveryRequest**(`request`: any, `config`: [Config](../interfaces/_api_cds_webapi_cdswebapi_.cdswebapi.config.md), `resolve?`: function, `reject?`: function): *void*

Defined in src/api/cds-webapi/odata/sendRequest.ts:410

**Parameters:**

▪ **request**: *any*

▪ **config**: *[Config](../interfaces/_api_cds_webapi_cdswebapi_.cdswebapi.config.md)*

▪`Optional`  **resolve**: *function*

▸ (`value?`: any): *any*

**Parameters:**

Name | Type |
------ | ------ |
`value?` | any |

▪`Optional`  **reject**: *function*

▸ (`reason?`: any): *any*

**Parameters:**

Name | Type |
------ | ------ |
`reason?` | any |

**Returns:** *void*

___

###  makeRequest

▸ **makeRequest**(`method`: string, `request`: any, `functionName`: string, `config`: any, `responseParams?`: any, `resolve?`: function, `reject?`: function): *void*

Defined in src/api/cds-webapi/odata/sendRequest.ts:430

**Parameters:**

▪ **method**: *string*

▪ **request**: *any*

▪ **functionName**: *string*

▪ **config**: *any*

▪`Optional`  **responseParams**: *any*

▪`Optional`  **resolve**: *function*

▸ (`value?`: any): *any*

**Parameters:**

Name | Type |
------ | ------ |
`value?` | any |

▪`Optional`  **reject**: *function*

▸ (`reason?`: any): *any*

**Parameters:**

Name | Type |
------ | ------ |
`reason?` | any |

**Returns:** *void*

___

###  sendRequest

▸ **sendRequest**(`method`: string, `path`: string, `config`: [Config](../interfaces/_api_cds_webapi_cdswebapi_.cdswebapi.config.md), `data`: any, `additionalHeaders`: object, `responseParams`: any, `successCallback`: function, `errorCallback`: function, `isBatch`: boolean, `isAsync`: boolean, `isDiscovery?`: boolean, `authRetry?`: function): *[Config](../interfaces/_api_cds_webapi_cdswebapi_.cdswebapi.config.md)*

Defined in src/api/cds-webapi/odata/sendRequest.ts:137

Sends a request to given URL with given parameters

**Parameters:**

▪ **method**: *string*

Method of the request.

▪ **path**: *string*

Request path.

▪ **config**: *[Config](../interfaces/_api_cds_webapi_cdswebapi_.cdswebapi.config.md)*

DynamicsWebApi config.

▪ **data**: *any*

▪ **additionalHeaders**: *object*

▪ **responseParams**: *any*

▪ **successCallback**: *function*

A callback called on success of the request.

▸ (`response`: any): *void*

**Parameters:**

Name | Type |
------ | ------ |
`response` | any |

▪ **errorCallback**: *function*

A callback called when a request failed.

▸ (`error`: any): *void*

**Parameters:**

Name | Type |
------ | ------ |
`error` | any |

▪ **isBatch**: *boolean*

▪ **isAsync**: *boolean*

▪`Optional`  **isDiscovery**: *boolean*

▪`Optional`  **authRetry**: *function*

▸ (`config`: [Config](../interfaces/_api_cds_webapi_cdswebapi_.cdswebapi.config.md)): *boolean*

**Parameters:**

Name | Type |
------ | ------ |
`config` | [Config](../interfaces/_api_cds_webapi_cdswebapi_.cdswebapi.config.md) |

**Returns:** *[Config](../interfaces/_api_cds_webapi_cdswebapi_.cdswebapi.config.md)*

___

###  setStandardHeaders

▸ **setStandardHeaders**(`additionalHeaders`: object): *object*

Defined in src/api/cds-webapi/odata/sendRequest.ts:51

**Parameters:**

Name | Type |
------ | ------ |
`additionalHeaders` | object |

**Returns:** *object*

* \[ **key**: *string*\]: string

___

###  stringifyData

▸ **stringifyData**(`data`: any, `config`: any): *any*

Defined in src/api/cds-webapi/odata/sendRequest.ts:60

**Parameters:**

Name | Type |
------ | ------ |
`data` | any |
`config` | any |

**Returns:** *any*
