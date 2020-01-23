---
id: "_api_cds_webapi_fetchquery_"
title: "api/cds-webapi/FetchQuery"
sidebar_label: "api/cds-webapi/FetchQuery"
---

[cds-for-code](../index.md) › [Globals](../globals.md) › ["api/cds-webapi/FetchQuery"](_api_cds_webapi_fetchquery_.md)

## Index

### Enumerations

* [FetchQueryOperator](../enums/_api_cds_webapi_fetchquery_.fetchqueryoperator.md)

### Classes

* [FetchQueryProvider](../classes/_api_cds_webapi_fetchquery_.fetchqueryprovider.md)

### Interfaces

* [FetchQuery](../interfaces/_api_cds_webapi_fetchquery_.fetchquery.md)
* [FetchQueryCondition](../interfaces/_api_cds_webapi_fetchquery_.fetchquerycondition.md)
* [FetchQueryJoin](../interfaces/_api_cds_webapi_fetchquery_.fetchqueryjoin.md)
* [Query](../interfaces/_api_cds_webapi_fetchquery_.query.md)
* [QueryResolver](../interfaces/_api_cds_webapi_fetchquery_.queryresolver.md)

### Type aliases

* [FetchQueryOperatorExpression](_api_cds_webapi_fetchquery_.md#fetchqueryoperatorexpression)
* [QueryOperatorParam](_api_cds_webapi_fetchquery_.md#queryoperatorparam)

### Functions

* [GetRootQuery](_api_cds_webapi_fetchquery_.md#getrootquery)
* [fetchQuery](_api_cds_webapi_fetchquery_.md#fetchquery)

## Type aliases

###  FetchQueryOperatorExpression

Ƭ **FetchQueryOperatorExpression**: *"like" | "not-like" | "begins-with" | "eq" | "neq" | "gt" | "lt" | "in" | "not-in" | "on-or-before" | "on-or-after" | "null" | "not-null" | "eq-userid" | "ne-userid" | "eq-userteams"*

Defined in src/api/cds-webapi/FetchQuery.ts:62

___

###  QueryOperatorParam

Ƭ **QueryOperatorParam**: *[FetchQueryOperator](../enums/_api_cds_webapi_fetchquery_.fetchqueryoperator.md) | [FetchQueryOperatorExpression](_api_cds_webapi_fetchquery_.md#fetchqueryoperatorexpression)*

Defined in src/api/cds-webapi/FetchQuery.ts:41

## Functions

###  GetRootQuery

▸ **GetRootQuery**(`query`: [Query](../interfaces/_api_cds_webapi_fetchquery_.query.md)): *[FetchQuery](../interfaces/_api_cds_webapi_fetchquery_.fetchquery.md)*

Defined in src/api/cds-webapi/FetchQuery.ts:84

**Parameters:**

Name | Type |
------ | ------ |
`query` | [Query](../interfaces/_api_cds_webapi_fetchquery_.query.md) |

**Returns:** *[FetchQuery](../interfaces/_api_cds_webapi_fetchquery_.fetchquery.md)*

___

###  fetchQuery

▸ **fetchQuery**(`entityName`: string, ...`attributeNames`: string[]): *[Query](../interfaces/_api_cds_webapi_fetchquery_.query.md)*

Defined in src/api/cds-webapi/FetchQuery.ts:80

**Parameters:**

Name | Type |
------ | ------ |
`entityName` | string |
`...attributeNames` | string[] |

**Returns:** *[Query](../interfaces/_api_cds_webapi_fetchquery_.query.md)*
