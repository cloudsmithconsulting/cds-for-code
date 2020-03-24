---
id: "_components_datageneration_datagenerationmanager_.datagenerationmanager"
title: "DataGenerationManager"
sidebar_label: "DataGenerationManager"
---

[cds-for-code](../index.md) › [Globals](../globals.md) › ["components/DataGeneration/DataGenerationManager"](../modules/_components_datageneration_datagenerationmanager_.md) › [DataGenerationManager](_components_datageneration_datagenerationmanager_.datagenerationmanager.md)

## Hierarchy

* **DataGenerationManager**

## Index

### Methods

* [getFaker](_components_datageneration_datagenerationmanager_.datagenerationmanager.md#getfaker)
* [insertCsvData](_components_datageneration_datagenerationmanager_.datagenerationmanager.md#insertcsvdata)
* [insertFakeData](_components_datageneration_datagenerationmanager_.datagenerationmanager.md#insertfakedata)
* [importCsvFromFileExplorer](_components_datageneration_datagenerationmanager_.datagenerationmanager.md#static-importcsvfromfileexplorer)

## Methods

###  getFaker

▸ **getFaker**(`config?`: [Config](../interfaces/_api_cds_webapi_cdswebapi_.cdswebapi.config.md), `entity?`: any, `selectedAttributes?`: string[]): *Promise‹any›*

Defined in src/components/DataGeneration/DataGenerationManager.ts:12

**Parameters:**

Name | Type |
------ | ------ |
`config?` | [Config](../interfaces/_api_cds_webapi_cdswebapi_.cdswebapi.config.md) |
`entity?` | any |
`selectedAttributes?` | string[] |

**Returns:** *Promise‹any›*

___

###  insertCsvData

▸ **insertCsvData**(`config?`: [Config](../interfaces/_api_cds_webapi_cdswebapi_.cdswebapi.config.md), `entity?`: any, `file?`: Uri): *Promise‹any›*

Defined in src/components/DataGeneration/DataGenerationManager.ts:22

**Parameters:**

Name | Type |
------ | ------ |
`config?` | [Config](../interfaces/_api_cds_webapi_cdswebapi_.cdswebapi.config.md) |
`entity?` | any |
`file?` | Uri |

**Returns:** *Promise‹any›*

___

###  insertFakeData

▸ **insertFakeData**(`config?`: [Config](../interfaces/_api_cds_webapi_cdswebapi_.cdswebapi.config.md), `entity?`: any, `selectedAttributes?`: string[], `count`: number): *Promise‹string[]›*

Defined in src/components/DataGeneration/DataGenerationManager.ts:17

**Parameters:**

Name | Type | Default |
------ | ------ | ------ |
`config?` | [Config](../interfaces/_api_cds_webapi_cdswebapi_.cdswebapi.config.md) | - |
`entity?` | any | - |
`selectedAttributes?` | string[] | - |
`count` | number | 25 |

**Returns:** *Promise‹string[]›*

___

### `Static` importCsvFromFileExplorer

▸ **importCsvFromFileExplorer**(`file?`: Uri): *Promise‹unknown›*

Defined in src/components/DataGeneration/DataGenerationManager.ts:27

**Parameters:**

Name | Type |
------ | ------ |
`file?` | Uri |

**Returns:** *Promise‹unknown›*
