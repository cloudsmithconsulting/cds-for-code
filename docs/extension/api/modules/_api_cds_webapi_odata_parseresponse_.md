---
id: "_api_cds_webapi_odata_parseresponse_"
title: "api/cds-webapi/odata/parseResponse"
sidebar_label: "api/cds-webapi/odata/parseResponse"
---

[cds-for-code](../index.md) › [Globals](../globals.md) › ["api/cds-webapi/odata/parseResponse"](_api_cds_webapi_odata_parseresponse_.md)

## Index

### Functions

* [getFormattedKeyValue](_api_cds_webapi_odata_parseresponse_.md#getformattedkeyvalue)
* [parseBatchResponse](_api_cds_webapi_odata_parseresponse_.md#parsebatchresponse)
* [parseData](_api_cds_webapi_odata_parseresponse_.md#parsedata)
* [parseResponse](_api_cds_webapi_odata_parseresponse_.md#parseresponse)

## Functions

###  getFormattedKeyValue

▸ **getFormattedKeyValue**(`keyName`: string, `value`: any): *any[]*

Defined in src/api/cds-webapi/odata/parseResponse.ts:11

**Parameters:**

Name | Type |
------ | ------ |
`keyName` | string |
`value` | any |

**Returns:** *any[]*

___

###  parseBatchResponse

▸ **parseBatchResponse**(`response`: string, `parseParams?`: any[], `requestNumber?`: number): *any[]*

Defined in src/api/cds-webapi/odata/parseResponse.ts:121

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`response` | string | response that needs to be parsed |
`parseParams?` | any[] | parameters for parsing the response |
`requestNumber?` | number | - |

**Returns:** *any[]*

parsed batch response

___

###  parseData

▸ **parseData**(`object`: any, `parseParams?`: any): *any*

Defined in src/api/cds-webapi/odata/parseResponse.ts:52

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`object` | any | parsed JSON object |
`parseParams?` | any | parameters for parsing the response |

**Returns:** *any*

parsed batch response

___

###  parseResponse

▸ **parseResponse**(`response`: string, `responseHeaders`: any, `parseParams?`: any[]): *any*

Defined in src/api/cds-webapi/odata/parseResponse.ts:205

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`response` | string | response that needs to be parsed |
`responseHeaders` | any | response headers |
`parseParams?` | any[] | parameters for parsing the response |

**Returns:** *any*

parsed response
