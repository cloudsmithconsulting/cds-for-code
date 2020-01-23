---
id: "_api_cds_webapi_fetchquery_.query"
title: "Query"
sidebar_label: "Query"
---

[cds-for-code](../index.md) › [Globals](../globals.md) › ["api/cds-webapi/FetchQuery"](../modules/_api_cds_webapi_fetchquery_.md) › [Query](_api_cds_webapi_fetchquery_.query.md)

## Hierarchy

* **Query**

## Implemented by

* [FetchQueryProvider](../classes/_api_cds_webapi_fetchquery_.fetchqueryprovider.md)

## Indexable

* \[ **key**: *string*\]: any

## Index

### Properties

* [query](_api_cds_webapi_fetchquery_.query.md#query)

### Methods

* [alias](_api_cds_webapi_fetchquery_.query.md#alias)
* [join](_api_cds_webapi_fetchquery_.query.md#join)
* [orderBy](_api_cds_webapi_fetchquery_.query.md#orderby)
* [path](_api_cds_webapi_fetchquery_.query.md#path)
* [select](_api_cds_webapi_fetchquery_.query.md#select)
* [where](_api_cds_webapi_fetchquery_.query.md#where)
* [whereAny](_api_cds_webapi_fetchquery_.query.md#whereany)

## Properties

###  query

• **query**: *[FetchQuery](_api_cds_webapi_fetchquery_.fetchquery.md)*

Defined in src/api/cds-webapi/FetchQuery.ts:37

## Methods

###  alias

▸ **alias**(`attributeName`: string, `alias`: string): *[Query](_api_cds_webapi_fetchquery_.query.md)*

Defined in src/api/cds-webapi/FetchQuery.ts:30

**Parameters:**

Name | Type |
------ | ------ |
`attributeName` | string |
`alias` | string |

**Returns:** *[Query](_api_cds_webapi_fetchquery_.query.md)*

___

###  join

▸ **join**(`entityName`: string, `fromAttribute`: string, `toAttribute?`: string, `alias?`: string, `isOuterJoin?`: boolean): *[Query](_api_cds_webapi_fetchquery_.query.md)*

Defined in src/api/cds-webapi/FetchQuery.ts:36

**Parameters:**

Name | Type |
------ | ------ |
`entityName` | string |
`fromAttribute` | string |
`toAttribute?` | string |
`alias?` | string |
`isOuterJoin?` | boolean |

**Returns:** *[Query](_api_cds_webapi_fetchquery_.query.md)*

___

###  orderBy

▸ **orderBy**(`attributeName`: string, `isDescendingOrder?`: boolean): *[Query](_api_cds_webapi_fetchquery_.query.md)*

Defined in src/api/cds-webapi/FetchQuery.ts:35

**Parameters:**

Name | Type |
------ | ------ |
`attributeName` | string |
`isDescendingOrder?` | boolean |

**Returns:** *[Query](_api_cds_webapi_fetchquery_.query.md)*

___

###  path

▸ **path**(`entityPath`: string): *[Query](_api_cds_webapi_fetchquery_.query.md)*

Defined in src/api/cds-webapi/FetchQuery.ts:31

**Parameters:**

Name | Type |
------ | ------ |
`entityPath` | string |

**Returns:** *[Query](_api_cds_webapi_fetchquery_.query.md)*

___

###  select

▸ **select**(...`attributeNames`: string[]): *[Query](_api_cds_webapi_fetchquery_.query.md)*

Defined in src/api/cds-webapi/FetchQuery.ts:32

**Parameters:**

Name | Type |
------ | ------ |
`...attributeNames` | string[] |

**Returns:** *[Query](_api_cds_webapi_fetchquery_.query.md)*

___

###  where

▸ **where**(`attributeName`: string, `operator`: [QueryOperatorParam](../modules/_api_cds_webapi_fetchquery_.md#queryoperatorparam), ...`values`: any[]): *[Query](_api_cds_webapi_fetchquery_.query.md)*

Defined in src/api/cds-webapi/FetchQuery.ts:33

**Parameters:**

Name | Type |
------ | ------ |
`attributeName` | string |
`operator` | [QueryOperatorParam](../modules/_api_cds_webapi_fetchquery_.md#queryoperatorparam) |
`...values` | any[] |

**Returns:** *[Query](_api_cds_webapi_fetchquery_.query.md)*

___

###  whereAny

▸ **whereAny**(`any`: function): *[Query](_api_cds_webapi_fetchquery_.query.md)*

Defined in src/api/cds-webapi/FetchQuery.ts:34

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

**Returns:** *[Query](_api_cds_webapi_fetchquery_.query.md)*
