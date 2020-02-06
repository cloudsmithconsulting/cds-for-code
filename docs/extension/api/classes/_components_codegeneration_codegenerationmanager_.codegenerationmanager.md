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

* [createCrmSvcUtilConfig](_components_codegeneration_codegenerationmanager_.codegenerationmanager.md#createcrmsvcutilconfig)
* [createCrmSvcUtilConfigFromConfig](_components_codegeneration_codegenerationmanager_.codegenerationmanager.md#createcrmsvcutilconfigfromconfig)
* [createCrmSvcUtilConfigToFile](_components_codegeneration_codegenerationmanager_.codegenerationmanager.md#createcrmsvcutilconfigtofile)
* [generateEntities](_components_codegeneration_codegenerationmanager_.codegenerationmanager.md#generateentities)
* [generateEntityCodeToFile](_components_codegeneration_codegenerationmanager_.codegenerationmanager.md#generateentitycodetofile)
* [generateEntityCodeToFolder](_components_codegeneration_codegenerationmanager_.codegenerationmanager.md#generateentitycodetofolder)
* [parseXml](_components_codegeneration_codegenerationmanager_.codegenerationmanager.md#parsexml)

## Methods

###  createCrmSvcUtilConfig

▸ **createCrmSvcUtilConfig**(`config?`: [Config](../interfaces/_api_cds_webapi_cdswebapi_.cdswebapi.config.md), `file?`: Uri): *Promise‹void›*

Defined in src/components/CodeGeneration/CodeGenerationManager.ts:36

**Parameters:**

Name | Type |
------ | ------ |
`config?` | [Config](../interfaces/_api_cds_webapi_cdswebapi_.cdswebapi.config.md) |
`file?` | Uri |

**Returns:** *Promise‹void›*

___

###  createCrmSvcUtilConfigFromConfig

▸ **createCrmSvcUtilConfigFromConfig**(`config?`: [Config](../interfaces/_api_cds_webapi_cdswebapi_.cdswebapi.config.md)): *Promise‹unknown›*

Defined in src/components/CodeGeneration/CodeGenerationManager.ts:26

**Parameters:**

Name | Type |
------ | ------ |
`config?` | [Config](../interfaces/_api_cds_webapi_cdswebapi_.cdswebapi.config.md) |

**Returns:** *Promise‹unknown›*

___

###  createCrmSvcUtilConfigToFile

▸ **createCrmSvcUtilConfigToFile**(`defaultUri?`: Uri): *Promise‹unknown›*

Defined in src/components/CodeGeneration/CodeGenerationManager.ts:21

**Parameters:**

Name | Type |
------ | ------ |
`defaultUri?` | Uri |

**Returns:** *Promise‹unknown›*

___

###  generateEntities

▸ **generateEntities**(`config?`: [Config](../interfaces/_api_cds_webapi_cdswebapi_.cdswebapi.config.md), `folder?`: string, `outputFileName?`: string, `namespace?`: string): *Promise‹void›*

Defined in src/components/CodeGeneration/CodeGenerationManager.ts:31

**Parameters:**

Name | Type |
------ | ------ |
`config?` | [Config](../interfaces/_api_cds_webapi_cdswebapi_.cdswebapi.config.md) |
`folder?` | string |
`outputFileName?` | string |
`namespace?` | string |

**Returns:** *Promise‹void›*

___

###  generateEntityCodeToFile

▸ **generateEntityCodeToFile**(`file?`: Uri): *Promise‹unknown›*

Defined in src/components/CodeGeneration/CodeGenerationManager.ts:11

**Parameters:**

Name | Type |
------ | ------ |
`file?` | Uri |

**Returns:** *Promise‹unknown›*

___

###  generateEntityCodeToFolder

▸ **generateEntityCodeToFolder**(`folder?`: Uri): *Promise‹unknown›*

Defined in src/components/CodeGeneration/CodeGenerationManager.ts:16

**Parameters:**

Name | Type |
------ | ------ |
`folder?` | Uri |

**Returns:** *Promise‹unknown›*

___

###  parseXml

▸ **parseXml**(`xml`: any): *any*

Defined in src/components/CodeGeneration/CodeGenerationManager.ts:40

**Parameters:**

Name | Type |
------ | ------ |
`xml` | any |

**Returns:** *any*
