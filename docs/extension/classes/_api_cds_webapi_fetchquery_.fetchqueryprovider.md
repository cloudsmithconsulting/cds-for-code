[cds-for-code](../README.md) › [Globals](../globals.md) › ["api/cds-webapi/FetchQuery"](../modules/_api_cds_webapi_fetchquery_.md) › [FetchQueryProvider](_api_cds_webapi_fetchquery_.fetchqueryprovider.md)

# Class: FetchQueryProvider

## Hierarchy

* **FetchQueryProvider**

## Implements

* [Query](../interfaces/_api_cds_webapi_fetchquery_.query.md)

## Index

### Constructors

* [constructor](_api_cds_webapi_fetchquery_.fetchqueryprovider.md#constructor)

### Properties

* [entityName](_api_cds_webapi_fetchquery_.fetchqueryprovider.md#private-entityname)
* [query](_api_cds_webapi_fetchquery_.fetchqueryprovider.md#query)
* [rootQuery](_api_cds_webapi_fetchquery_.fetchqueryprovider.md#rootquery)

### Methods

* [alias](_api_cds_webapi_fetchquery_.fetchqueryprovider.md#alias)
* [flatten](_api_cds_webapi_fetchquery_.fetchqueryprovider.md#private-flatten)
* [join](_api_cds_webapi_fetchquery_.fetchqueryprovider.md#join)
* [orderBy](_api_cds_webapi_fetchquery_.fetchqueryprovider.md#orderby)
* [path](_api_cds_webapi_fetchquery_.fetchqueryprovider.md#path)
* [select](_api_cds_webapi_fetchquery_.fetchqueryprovider.md#select)
* [where](_api_cds_webapi_fetchquery_.fetchqueryprovider.md#where)
* [whereAny](_api_cds_webapi_fetchquery_.fetchqueryprovider.md#whereany)
* [Create](_api_cds_webapi_fetchquery_.fetchqueryprovider.md#static-create)

## Constructors

###  constructor

\+ **new FetchQueryProvider**(`entityName`: string): *[FetchQueryProvider](_api_cds_webapi_fetchquery_.fetchqueryprovider.md)*

Defined in src/api/cds-webapi/FetchQuery.ts:90

**Parameters:**

Name | Type |
------ | ------ |
`entityName` | string |

**Returns:** *[FetchQueryProvider](_api_cds_webapi_fetchquery_.fetchqueryprovider.md)*

## Properties

### `Private` entityName

• **entityName**: *string*

Defined in src/api/cds-webapi/FetchQuery.ts:92

___

###  query

• **query**: *[FetchQuery](../interfaces/_api_cds_webapi_fetchquery_.fetchquery.md)*

*Implementation of [Query](../interfaces/_api_cds_webapi_fetchquery_.query.md).[query](../interfaces/_api_cds_webapi_fetchquery_.query.md#query)*

Defined in src/api/cds-webapi/FetchQuery.ts:89

___

###  rootQuery

• **rootQuery**: *[Query](../interfaces/_api_cds_webapi_fetchquery_.query.md) | undefined*

Defined in src/api/cds-webapi/FetchQuery.ts:90

## Methods

###  alias

▸ **alias**(`attributeName`: string, `alias`: string): *[Query](../interfaces/_api_cds_webapi_fetchquery_.query.md)*

*Implementation of [Query](../interfaces/_api_cds_webapi_fetchquery_.query.md)*

Defined in src/api/cds-webapi/FetchQuery.ts:107

**Parameters:**

Name | Type |
------ | ------ |
`attributeName` | string |
`alias` | string |

**Returns:** *[Query](../interfaces/_api_cds_webapi_fetchquery_.query.md)*

___

### `Private` flatten

▸ **flatten**(`values`: any[]): *any[]*

Defined in src/api/cds-webapi/FetchQuery.ts:187

**Parameters:**

Name | Type |
------ | ------ |
`values` | any[] |

**Returns:** *any[]*

___

###  join

▸ **join**(`entityName`: string, `fromAttribute`: string, `toAttribute?`: string, `alias?`: string, `isOuterJoin?`: boolean): *[Query](../interfaces/_api_cds_webapi_fetchquery_.query.md)*

*Implementation of [Query](../interfaces/_api_cds_webapi_fetchquery_.query.md)*

Defined in src/api/cds-webapi/FetchQuery.ts:172

**Parameters:**

Name | Type |
------ | ------ |
`entityName` | string |
`fromAttribute` | string |
`toAttribute?` | string |
`alias?` | string |
`isOuterJoin?` | boolean |

**Returns:** *[Query](../interfaces/_api_cds_webapi_fetchquery_.query.md)*

___

###  orderBy

▸ **orderBy**(`attributeName`: string, `isDescendingOrder?`: boolean): *[Query](../interfaces/_api_cds_webapi_fetchquery_.query.md)*

*Implementation of [Query](../interfaces/_api_cds_webapi_fetchquery_.query.md)*

Defined in src/api/cds-webapi/FetchQuery.ts:161

**Parameters:**

Name | Type |
------ | ------ |
`attributeName` | string |
`isDescendingOrder?` | boolean |

**Returns:** *[Query](../interfaces/_api_cds_webapi_fetchquery_.query.md)*

___

###  path

▸ **path**(`entityPath`: string): *[Query](../interfaces/_api_cds_webapi_fetchquery_.query.md)*

*Implementation of [Query](../interfaces/_api_cds_webapi_fetchquery_.query.md)*

Defined in src/api/cds-webapi/FetchQuery.ts:113

**Parameters:**

Name | Type |
------ | ------ |
`entityPath` | string |

**Returns:** *[Query](../interfaces/_api_cds_webapi_fetchquery_.query.md)*

___

###  select

▸ **select**(...`attributeNames`: string[]): *[Query](../interfaces/_api_cds_webapi_fetchquery_.query.md)*

*Implementation of [Query](../interfaces/_api_cds_webapi_fetchquery_.query.md)*

Defined in src/api/cds-webapi/FetchQuery.ts:119

**Parameters:**

Name | Type |
------ | ------ |
`...attributeNames` | string[] |

**Returns:** *[Query](../interfaces/_api_cds_webapi_fetchquery_.query.md)*

___

###  where

▸ **where**(`attributeName`: string, `operator`: [QueryOperatorParam](../modules/_api_cds_webapi_fetchquery_.md#queryoperatorparam), ...`values`: any[]): *[Query](../interfaces/_api_cds_webapi_fetchquery_.query.md)*

*Implementation of [Query](../interfaces/_api_cds_webapi_fetchquery_.query.md)*

Defined in src/api/cds-webapi/FetchQuery.ts:135

**Parameters:**

Name | Type |
------ | ------ |
`attributeName` | string |
`operator` | [QueryOperatorParam](../modules/_api_cds_webapi_fetchquery_.md#queryoperatorparam) |
`...values` | any[] |

**Returns:** *[Query](../interfaces/_api_cds_webapi_fetchquery_.query.md)*

___

###  whereAny

▸ **whereAny**(`any`: function): *[Query](../interfaces/_api_cds_webapi_fetchquery_.query.md)*

Defined in src/api/cds-webapi/FetchQuery.ts:145

**Parameters:**

▪ **any**: *function*

▸ (`or`: function): *void*

**Parameters:**

▪ **or**: *function*

▸ (`attributeName`: string, `operator`: [QueryOperatorParam](../modules/_api_cds_webapi_fetchquery_.md#queryoperatorparam), ...`values`: any[]): *void*

**Parameters:**

Name | Type |
------ | ------ |
`attributeName` | string |
`operator` | [QueryOperatorParam](../modules/_api_cds_webapi_fetchquery_.md#queryoperatorparam) |
`...values` | any[] |

**Returns:** *[Query](../interfaces/_api_cds_webapi_fetchquery_.query.md)*

___

### `Static` Create

▸ **Create**(`entityName`: string, ...`attributeNames`: string[]): *[Query](../interfaces/_api_cds_webapi_fetchquery_.query.md)*

Defined in src/api/cds-webapi/FetchQuery.ts:103

**Parameters:**

Name | Type |
------ | ------ |
`entityName` | string |
`...attributeNames` | string[] |

**Returns:** *[Query](../interfaces/_api_cds_webapi_fetchquery_.query.md)*
