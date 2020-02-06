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
* [editCrmSvcUtilConfigToFile](_components_codegeneration_codegenerationmanager_.codegenerationmanager.md#editcrmsvcutilconfigtofile)
* [generateEntities](_components_codegeneration_codegenerationmanager_.codegenerationmanager.md#generateentities)
* [generateEntityCodeToFile](_components_codegeneration_codegenerationmanager_.codegenerationmanager.md#generateentitycodetofile)
* [generateEntityCodeToFolder](_components_codegeneration_codegenerationmanager_.codegenerationmanager.md#generateentitycodetofolder)
* [generateEntityCodeUsingConfig](_components_codegeneration_codegenerationmanager_.codegenerationmanager.md#generateentitycodeusingconfig)
* [parseXml](_components_codegeneration_codegenerationmanager_.codegenerationmanager.md#parsexml)
* [saveConfig](_components_codegeneration_codegenerationmanager_.codegenerationmanager.md#saveconfig)
* [saveCrmSvcUtilConfig](_components_codegeneration_codegenerationmanager_.codegenerationmanager.md#savecrmsvcutilconfig)

## Methods

###  createCrmSvcUtilConfig

▸ **createCrmSvcUtilConfig**(`config?`: [Config](../interfaces/_api_cds_webapi_cdswebapi_.cdswebapi.config.md), `file?`: Uri): *Promise‹void›*

Defined in src/components/CodeGeneration/CodeGenerationManager.ts:47

**Parameters:**

Name | Type |
------ | ------ |
`config?` | [Config](../interfaces/_api_cds_webapi_cdswebapi_.cdswebapi.config.md) |
`file?` | Uri |

**Returns:** *Promise‹void›*

___

###  createCrmSvcUtilConfigFromConfig

▸ **createCrmSvcUtilConfigFromConfig**(`config?`: [Config](../interfaces/_api_cds_webapi_cdswebapi_.cdswebapi.config.md)): *Promise‹unknown›*

Defined in src/components/CodeGeneration/CodeGenerationManager.ts:37

**Parameters:**

Name | Type |
------ | ------ |
`config?` | [Config](../interfaces/_api_cds_webapi_cdswebapi_.cdswebapi.config.md) |

**Returns:** *Promise‹unknown›*

___

###  createCrmSvcUtilConfigToFile

▸ **createCrmSvcUtilConfigToFile**(`defaultUri?`: Uri): *Promise‹unknown›*

Defined in src/components/CodeGeneration/CodeGenerationManager.ts:27

**Parameters:**

Name | Type |
------ | ------ |
`defaultUri?` | Uri |

**Returns:** *Promise‹unknown›*

___

###  editCrmSvcUtilConfigToFile

▸ **editCrmSvcUtilConfigToFile**(`defaultUri?`: Uri): *Promise‹unknown›*

Defined in src/components/CodeGeneration/CodeGenerationManager.ts:32

**Parameters:**

Name | Type |
------ | ------ |
`defaultUri?` | Uri |

**Returns:** *Promise‹unknown›*

___

###  generateEntities

▸ **generateEntities**(`config?`: [Config](../interfaces/_api_cds_webapi_cdswebapi_.cdswebapi.config.md), `folder?`: string, `outputFileName?`: string, `namespace?`: string, `configFile?`: Uri): *Promise‹void›*

Defined in src/components/CodeGeneration/CodeGenerationManager.ts:42

**Parameters:**

Name | Type |
------ | ------ |
`config?` | [Config](../interfaces/_api_cds_webapi_cdswebapi_.cdswebapi.config.md) |
`folder?` | string |
`outputFileName?` | string |
`namespace?` | string |
`configFile?` | Uri |

**Returns:** *Promise‹void›*

___

###  generateEntityCodeToFile

▸ **generateEntityCodeToFile**(`file?`: Uri): *Promise‹unknown›*

Defined in src/components/CodeGeneration/CodeGenerationManager.ts:12

**Parameters:**

Name | Type |
------ | ------ |
`file?` | Uri |

**Returns:** *Promise‹unknown›*

___

###  generateEntityCodeToFolder

▸ **generateEntityCodeToFolder**(`folder?`: Uri): *Promise‹unknown›*

Defined in src/components/CodeGeneration/CodeGenerationManager.ts:22

**Parameters:**

Name | Type |
------ | ------ |
`folder?` | Uri |

**Returns:** *Promise‹unknown›*

___

###  generateEntityCodeUsingConfig

▸ **generateEntityCodeUsingConfig**(`configFile?`: Uri): *Promise‹unknown›*

Defined in src/components/CodeGeneration/CodeGenerationManager.ts:17

**Parameters:**

Name | Type |
------ | ------ |
`configFile?` | Uri |

**Returns:** *Promise‹unknown›*

___

###  parseXml

▸ **parseXml**(`xml`: any): *any*

Defined in src/components/CodeGeneration/CodeGenerationManager.ts:56

**Parameters:**

Name | Type |
------ | ------ |
`xml` | any |

**Returns:** *any*

___

###  saveConfig

▸ **saveConfig**(`config`: any, `xml`: any): *any*

Defined in src/components/CodeGeneration/CodeGenerationManager.ts:171

**Parameters:**

Name | Type |
------ | ------ |
`config` | any |
`xml` | any |

**Returns:** *any*

___

###  saveCrmSvcUtilConfig

▸ **saveCrmSvcUtilConfig**(`config`: any, `file?`: Uri): *Promise‹void›*

Defined in src/components/CodeGeneration/CodeGenerationManager.ts:52

**Parameters:**

Name | Type |
------ | ------ |
`config` | any |
`file?` | Uri |

**Returns:** *Promise‹void›*
