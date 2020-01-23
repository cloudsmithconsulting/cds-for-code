---
id: "_components_codegeneration_codegenerationmanager_.codegenerationmanager"
title: "CodeGenerationManager"
sidebar_label: "CodeGenerationManager"
---

[cds-for-code](../index.md) › [Globals](../globals.md) › ["components/CodeGeneration/CodeGenerationManager"](../modules/_components_codegeneration_codegenerationmanager_.md) › [CodeGenerationManager](_components_codegeneration_codegenerationmanager_.codegenerationmanager.md)

## Hierarchy

* **CodeGenerationManager**

## Index

### Methods

* [generateEntities](_components_codegeneration_codegenerationmanager_.codegenerationmanager.md#static-generateentities)
* [generateEntityCodeToFile](_components_codegeneration_codegenerationmanager_.codegenerationmanager.md#static-generateentitycodetofile)
* [generateEntityCodeToFolder](_components_codegeneration_codegenerationmanager_.codegenerationmanager.md#static-generateentitycodetofolder)

## Methods

### `Static` generateEntities

▸ **generateEntities**(`config?`: [Config](../interfaces/_api_cds_webapi_cdswebapi_.cdswebapi.config.md), `folder?`: string, `outputFileName?`: string, `namespace?`: string): *Promise‹void›*

Defined in src/components/CodeGeneration/CodeGenerationManager.ts:20

**Parameters:**

Name | Type |
------ | ------ |
`config?` | [Config](../interfaces/_api_cds_webapi_cdswebapi_.cdswebapi.config.md) |
`folder?` | string |
`outputFileName?` | string |
`namespace?` | string |

**Returns:** *Promise‹void›*

___

### `Static` generateEntityCodeToFile

▸ **generateEntityCodeToFile**(`file?`: Uri): *Promise‹unknown›*

Defined in src/components/CodeGeneration/CodeGenerationManager.ts:10

**Parameters:**

Name | Type |
------ | ------ |
`file?` | Uri |

**Returns:** *Promise‹unknown›*

___

### `Static` generateEntityCodeToFolder

▸ **generateEntityCodeToFolder**(`folder?`: Uri): *Promise‹unknown›*

Defined in src/components/CodeGeneration/CodeGenerationManager.ts:15

**Parameters:**

Name | Type |
------ | ------ |
`folder?` | Uri |

**Returns:** *Promise‹unknown›*
