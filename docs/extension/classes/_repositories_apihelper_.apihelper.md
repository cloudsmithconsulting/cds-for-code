---
id: "_repositories_apihelper_.apihelper"
title: "ApiHelper"
sidebar_label: "ApiHelper"
---

[cds-for-code](../index.md) › [Globals](../globals.md) › ["repositories/ApiHelper"](../modules/_repositories_apihelper_.md) › [ApiHelper](_repositories_apihelper_.apihelper.md)

## Hierarchy

* **ApiHelper**

## Index

### Methods

* [filterSolutionComponents](_repositories_apihelper_.apihelper.md#static-filtersolutioncomponents)
* [getSolutionComponents](_repositories_apihelper_.apihelper.md#static-getsolutioncomponents)
* [getSolutionComponentsRaw](_repositories_apihelper_.apihelper.md#static-private-getsolutioncomponentsraw)
* [isOuterJoin](_repositories_apihelper_.apihelper.md#static-isouterjoin)

## Methods

### `Static` filterSolutionComponents

▸ **filterSolutionComponents**(`api`: [WebApiClient](_api_cds_webapi_cdswebapi_.cdswebapi.webapiclient.md), `response`: any, `solutionId?`: string, `componentType?`: [SolutionComponent](../enums/_api_cdssolutions_.cdssolutions.solutioncomponent.md) | [SolutionComponent](../enums/_api_cdssolutions_.cdssolutions.solutioncomponent.md)[], `keySelector?`: function): *Promise‹Enumerator‹any››*

Defined in src/repositories/ApiHelper.ts:43

**Parameters:**

▪ **api**: *[WebApiClient](_api_cds_webapi_cdswebapi_.cdswebapi.webapiclient.md)*

▪ **response**: *any*

▪`Optional`  **solutionId**: *string*

▪`Optional`  **componentType**: *[SolutionComponent](../enums/_api_cdssolutions_.cdssolutions.solutioncomponent.md) | [SolutionComponent](../enums/_api_cdssolutions_.cdssolutions.solutioncomponent.md)[]*

▪`Optional`  **keySelector**: *function*

▸ (`item`: unknown): *any*

**Parameters:**

Name | Type |
------ | ------ |
`item` | unknown |

**Returns:** *Promise‹Enumerator‹any››*

___

### `Static` getSolutionComponents

▸ **getSolutionComponents**(`api`: [WebApiClient](_api_cds_webapi_cdswebapi_.cdswebapi.webapiclient.md), `solutionId?`: string, `componentType?`: [SolutionComponent](../enums/_api_cdssolutions_.cdssolutions.solutioncomponent.md) | [SolutionComponent](../enums/_api_cdssolutions_.cdssolutions.solutioncomponent.md)[]): *Promise‹any[]›*

Defined in src/repositories/ApiHelper.ts:32

**Parameters:**

Name | Type |
------ | ------ |
`api` | [WebApiClient](_api_cds_webapi_cdswebapi_.cdswebapi.webapiclient.md) |
`solutionId?` | string |
`componentType?` | [SolutionComponent](../enums/_api_cdssolutions_.cdssolutions.solutioncomponent.md) &#124; [SolutionComponent](../enums/_api_cdssolutions_.cdssolutions.solutioncomponent.md)[] |

**Returns:** *Promise‹any[]›*

___

### `Static` `Private` getSolutionComponentsRaw

▸ **getSolutionComponentsRaw**(`api`: [WebApiClient](_api_cds_webapi_cdswebapi_.cdswebapi.webapiclient.md), `solutionId?`: string, `componentType?`: [SolutionComponent](../enums/_api_cdssolutions_.cdssolutions.solutioncomponent.md) | [SolutionComponent](../enums/_api_cdssolutions_.cdssolutions.solutioncomponent.md)[]): *Promise‹any›*

Defined in src/repositories/ApiHelper.ts:69

**Parameters:**

Name | Type |
------ | ------ |
`api` | [WebApiClient](_api_cds_webapi_cdswebapi_.cdswebapi.webapiclient.md) |
`solutionId?` | string |
`componentType?` | [SolutionComponent](../enums/_api_cdssolutions_.cdssolutions.solutioncomponent.md) &#124; [SolutionComponent](../enums/_api_cdssolutions_.cdssolutions.solutioncomponent.md)[] |

**Returns:** *Promise‹any›*

___

### `Static` isOuterJoin

▸ **isOuterJoin**(`componentType`: [SolutionComponent](../enums/_api_cdssolutions_.cdssolutions.solutioncomponent.md) | [SolutionComponent](../enums/_api_cdssolutions_.cdssolutions.solutioncomponent.md)[]): *boolean*

Defined in src/repositories/ApiHelper.ts:6

**Parameters:**

Name | Type |
------ | ------ |
`componentType` | [SolutionComponent](../enums/_api_cdssolutions_.cdssolutions.solutioncomponent.md) &#124; [SolutionComponent](../enums/_api_cdssolutions_.cdssolutions.solutioncomponent.md)[] |

**Returns:** *boolean*
