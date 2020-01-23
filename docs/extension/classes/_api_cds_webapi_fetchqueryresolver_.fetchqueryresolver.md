[cds-for-code](../README.md) › [Globals](../globals.md) › ["api/cds-webapi/FetchQueryResolver"](../modules/_api_cds_webapi_fetchqueryresolver_.md) › [FetchQueryResolver](_api_cds_webapi_fetchqueryresolver_.fetchqueryresolver.md)

# Class: FetchQueryResolver

## Hierarchy

* **FetchQueryResolver**

## Implements

* [QueryResolver](../interfaces/_api_cds_webapi_fetchquery_.queryresolver.md)

## Index

### Methods

* [ResolveQuery](_api_cds_webapi_fetchqueryresolver_.fetchqueryresolver.md#resolvequery)
* [GetDataQueryXml](_api_cds_webapi_fetchqueryresolver_.fetchqueryresolver.md#static-getdataqueryxml)
* [ResolveQuery](_api_cds_webapi_fetchqueryresolver_.fetchqueryresolver.md#static-resolvequery)
* [encodeValue](_api_cds_webapi_fetchqueryresolver_.fetchqueryresolver.md#static-private-encodevalue)
* [formatXml](_api_cds_webapi_fetchqueryresolver_.fetchqueryresolver.md#static-private-formatxml)
* [getConditionXml](_api_cds_webapi_fetchqueryresolver_.fetchqueryresolver.md#static-private-getconditionxml)
* [getQueryXml](_api_cds_webapi_fetchqueryresolver_.fetchqueryresolver.md#static-private-getqueryxml)
* [xmlEncode](_api_cds_webapi_fetchqueryresolver_.fetchqueryresolver.md#static-private-xmlencode)

## Methods

###  ResolveQuery

▸ **ResolveQuery**(`query`: [Query](../interfaces/_api_cds_webapi_fetchquery_.query.md)): *string*

*Implementation of [QueryResolver](../interfaces/_api_cds_webapi_fetchquery_.queryresolver.md)*

Defined in src/api/cds-webapi/FetchQueryResolver.ts:4

**Parameters:**

Name | Type |
------ | ------ |
`query` | [Query](../interfaces/_api_cds_webapi_fetchquery_.query.md) |

**Returns:** *string*

___

### `Static` GetDataQueryXml

▸ **GetDataQueryXml**(`query`: [FetchQuery](../interfaces/_api_cds_webapi_fetchquery_.fetchquery.md), `maxRowCount`: number): *string*

Defined in src/api/cds-webapi/FetchQueryResolver.ts:19

**Parameters:**

Name | Type |
------ | ------ |
`query` | [FetchQuery](../interfaces/_api_cds_webapi_fetchquery_.fetchquery.md) |
`maxRowCount` | number |

**Returns:** *string*

___

### `Static` ResolveQuery

▸ **ResolveQuery**(`query`: [Query](../interfaces/_api_cds_webapi_fetchquery_.query.md), `maxRowCount`: number, `format`: boolean): *string*

Defined in src/api/cds-webapi/FetchQueryResolver.ts:8

**Parameters:**

Name | Type | Default |
------ | ------ | ------ |
`query` | [Query](../interfaces/_api_cds_webapi_fetchquery_.query.md) | - |
`maxRowCount` | number | 0 |
`format` | boolean | false |

**Returns:** *string*

___

### `Static` `Private` encodeValue

▸ **encodeValue**(`value`: any): *string*

Defined in src/api/cds-webapi/FetchQueryResolver.ts:142

**Parameters:**

Name | Type |
------ | ------ |
`value` | any |

**Returns:** *string*

___

### `Static` `Private` formatXml

▸ **formatXml**(`xmlString`: any): *string*

Defined in src/api/cds-webapi/FetchQueryResolver.ts:163

**Parameters:**

Name | Type |
------ | ------ |
`xmlString` | any |

**Returns:** *string*

___

### `Static` `Private` getConditionXml

▸ **getConditionXml**(`condition`: [FetchQueryCondition](../interfaces/_api_cds_webapi_fetchquery_.fetchquerycondition.md)): *string*

Defined in src/api/cds-webapi/FetchQueryResolver.ts:117

**Parameters:**

Name | Type |
------ | ------ |
`condition` | [FetchQueryCondition](../interfaces/_api_cds_webapi_fetchquery_.fetchquerycondition.md) |

**Returns:** *string*

___

### `Static` `Private` getQueryXml

▸ **getQueryXml**(`query`: [FetchQuery](../interfaces/_api_cds_webapi_fetchquery_.fetchquery.md)): *string*

Defined in src/api/cds-webapi/FetchQueryResolver.ts:37

**Parameters:**

Name | Type |
------ | ------ |
`query` | [FetchQuery](../interfaces/_api_cds_webapi_fetchquery_.fetchquery.md) |

**Returns:** *string*

___

### `Static` `Private` xmlEncode

▸ **xmlEncode**(`text`: any): *string*

Defined in src/api/cds-webapi/FetchQueryResolver.ts:152

**Parameters:**

Name | Type |
------ | ------ |
`text` | any |

**Returns:** *string*
