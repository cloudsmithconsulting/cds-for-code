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
* [getFaker](_components_codegeneration_codegenerationmanager_.codegenerationmanager.md#getfaker)
* [parseXml](_components_codegeneration_codegenerationmanager_.codegenerationmanager.md#parsexml)
* [saveConfig](_components_codegeneration_codegenerationmanager_.codegenerationmanager.md#saveconfig)
* [saveCrmSvcUtilConfig](_components_codegeneration_codegenerationmanager_.codegenerationmanager.md#savecrmsvcutilconfig)

## Methods

###  createCrmSvcUtilConfig

▸ **createCrmSvcUtilConfig**(`config?`: [Config](../interfaces/_api_cds_webapi_cdswebapi_.cdswebapi.config.md), `file?`: Uri): *Promise‹any›*

Defined in src/components/CodeGeneration/CodeGenerationManager.ts:53

**Parameters:**

Name | Type |
------ | ------ |
`config?` | [Config](../interfaces/_api_cds_webapi_cdswebapi_.cdswebapi.config.md) |
`file?` | Uri |

**Returns:** *Promise‹any›*

___

###  createCrmSvcUtilConfigFromConfig

▸ **createCrmSvcUtilConfigFromConfig**(`config?`: [Config](../interfaces/_api_cds_webapi_cdswebapi_.cdswebapi.config.md)): *Promise‹unknown›*

Defined in src/components/CodeGeneration/CodeGenerationManager.ts:43

**Parameters:**

Name | Type |
------ | ------ |
`config?` | [Config](../interfaces/_api_cds_webapi_cdswebapi_.cdswebapi.config.md) |

**Returns:** *Promise‹unknown›*

___

###  createCrmSvcUtilConfigToFile

▸ **createCrmSvcUtilConfigToFile**(`defaultUri?`: Uri): *Promise‹unknown›*

Defined in src/components/CodeGeneration/CodeGenerationManager.ts:33

**Parameters:**

Name | Type |
------ | ------ |
`defaultUri?` | Uri |

**Returns:** *Promise‹unknown›*

___

###  editCrmSvcUtilConfigToFile

▸ **editCrmSvcUtilConfigToFile**(`defaultUri?`: Uri): *Promise‹unknown›*

Defined in src/components/CodeGeneration/CodeGenerationManager.ts:38

**Parameters:**

Name | Type |
------ | ------ |
`defaultUri?` | Uri |

**Returns:** *Promise‹unknown›*

___

###  generateEntities

▸ **generateEntities**(`config?`: [Config](../interfaces/_api_cds_webapi_cdswebapi_.cdswebapi.config.md), `folder?`: string, `outputFileName?`: string, `namespace?`: string, `configFile?`: Uri): *Promise‹any›*

Defined in src/components/CodeGeneration/CodeGenerationManager.ts:48

**Parameters:**

Name | Type |
------ | ------ |
`config?` | [Config](../interfaces/_api_cds_webapi_cdswebapi_.cdswebapi.config.md) |
`folder?` | string |
`outputFileName?` | string |
`namespace?` | string |
`configFile?` | Uri |

**Returns:** *Promise‹any›*

___

###  generateEntityCodeToFile

▸ **generateEntityCodeToFile**(`file?`: Uri): *Promise‹unknown›*

Defined in src/components/CodeGeneration/CodeGenerationManager.ts:18

**Parameters:**

Name | Type |
------ | ------ |
`file?` | Uri |

**Returns:** *Promise‹unknown›*

___

###  generateEntityCodeToFolder

▸ **generateEntityCodeToFolder**(`folder?`: Uri): *Promise‹unknown›*

Defined in src/components/CodeGeneration/CodeGenerationManager.ts:28

**Parameters:**

Name | Type |
------ | ------ |
`folder?` | Uri |

**Returns:** *Promise‹unknown›*

___

###  generateEntityCodeUsingConfig

▸ **generateEntityCodeUsingConfig**(`configFile?`: Uri): *Promise‹unknown›*

Defined in src/components/CodeGeneration/CodeGenerationManager.ts:23

**Parameters:**

Name | Type |
------ | ------ |
`configFile?` | Uri |

**Returns:** *Promise‹unknown›*

___

###  getFaker

▸ **getFaker**(`config?`: [Config](../interfaces/_api_cds_webapi_cdswebapi_.cdswebapi.config.md), `entity?`: any): *Promise‹any›*

Defined in src/components/CodeGeneration/CodeGenerationManager.ts:13

**Parameters:**

Name | Type |
------ | ------ |
`config?` | [Config](../interfaces/_api_cds_webapi_cdswebapi_.cdswebapi.config.md) |
`entity?` | any |

**Returns:** *Promise‹any›*

___

###  parseXml

▸ **parseXml**(`xml`: any): *any*

Defined in src/components/CodeGeneration/CodeGenerationManager.ts:62

**Parameters:**

Name | Type |
------ | ------ |
`xml` | any |

**Returns:** *any*

___

###  saveConfig

▸ **saveConfig**(`config`: any, `xml`: any): *any*

Defined in src/components/CodeGeneration/CodeGenerationManager.ts:177

**Parameters:**

Name | Type |
------ | ------ |
`config` | any |
`xml` | any |

**Returns:** *any*

___

###  saveCrmSvcUtilConfig

▸ **saveCrmSvcUtilConfig**(`config`: any, `file?`: Uri): *Promise‹any›*

Defined in src/components/CodeGeneration/CodeGenerationManager.ts:58

**Parameters:**

Name | Type |
------ | ------ |
`config` | any |
`file?` | Uri |

**Returns:** *Promise‹any›*
