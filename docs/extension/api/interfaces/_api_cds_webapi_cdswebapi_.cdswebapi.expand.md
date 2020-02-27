---
id: "_api_cds_webapi_cdswebapi_.cdswebapi.expand"
title: "Expand"
sidebar_label: "Expand"
---

[cds-for-code](../index.md) › [Globals](../globals.md) › ["api/cds-webapi/CdsWebApi"](../modules/_api_cds_webapi_cdswebapi_.md) › [CdsWebApi](../modules/_api_cds_webapi_cdswebapi_.cdswebapi.md) › [Expand](_api_cds_webapi_cdswebapi_.cdswebapi.expand.md)

## Hierarchy

* **Expand**

## Index

### Properties

* [filter](_api_cds_webapi_cdswebapi_.cdswebapi.expand.md#optional-filter)
* [orderBy](_api_cds_webapi_cdswebapi_.cdswebapi.expand.md#optional-orderby)
* [property](_api_cds_webapi_cdswebapi_.cdswebapi.expand.md#optional-property)
* [select](_api_cds_webapi_cdswebapi_.cdswebapi.expand.md#optional-select)
* [top](_api_cds_webapi_cdswebapi_.cdswebapi.expand.md#optional-top)

## Properties

### `Optional` filter

• **filter**? : *string*

Defined in src/api/cds-webapi/CdsWebApi.ts:57

Use the $filter system query option to set criteria for which entities will be returned.

___

### `Optional` orderBy

• **orderBy**? : *string[]*

Defined in src/api/cds-webapi/CdsWebApi.ts:61

An Array(of Strings) representing the order in which items are returned using the $orderby system query option.Use the asc or desc suffix to specify ascending or descending order respectively.The default is ascending if the suffix isn't applied.

___

### `Optional` property

• **property**? : *string*

Defined in src/api/cds-webapi/CdsWebApi.ts:63

A name of a single-valued navigation property which needs to be expanded.

___

### `Optional` select

• **select**? : *string[]*

Defined in src/api/cds-webapi/CdsWebApi.ts:55

An Array(of Strings) representing the $select OData System Query Option to control which attributes will be returned.

___

### `Optional` top

• **top**? : *number*

Defined in src/api/cds-webapi/CdsWebApi.ts:59

Limit the number of results returned by using the $top system query option.Do not use $top with $count!
