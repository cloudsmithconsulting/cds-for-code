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
* [insertFakeData](_components_datageneration_datagenerationmanager_.datagenerationmanager.md#insertfakedata)

## Methods

###  getFaker

▸ **getFaker**(`config?`: [Config](../interfaces/_api_cds_webapi_cdswebapi_.cdswebapi.config.md), `entity?`: any, `selectedAttributes?`: string[]): *Promise‹any›*

Defined in src/components/DataGeneration/DataGenerationManager.ts:9

**Parameters:**

Name | Type |
------ | ------ |
`config?` | [Config](../interfaces/_api_cds_webapi_cdswebapi_.cdswebapi.config.md) |
`entity?` | any |
`selectedAttributes?` | string[] |

**Returns:** *Promise‹any›*

___

###  insertFakeData

▸ **insertFakeData**(`config?`: [Config](../interfaces/_api_cds_webapi_cdswebapi_.cdswebapi.config.md), `entity?`: any, `selectedAttributes?`: string[], `count`: number): *Promise‹string[]›*

Defined in src/components/DataGeneration/DataGenerationManager.ts:14

**Parameters:**

Name | Type | Default |
------ | ------ | ------ |
`config?` | [Config](../interfaces/_api_cds_webapi_cdswebapi_.cdswebapi.config.md) | - |
`entity?` | any | - |
`selectedAttributes?` | string[] | - |
`count` | number | 25 |

**Returns:** *Promise‹string[]›*
