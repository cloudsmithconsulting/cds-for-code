---
id: "_components_solutions_solutionmanager_.solutionmanager"
title: "SolutionManager"
sidebar_label: "SolutionManager"
---

[cds-for-code](../index.md) › [Globals](../globals.md) › ["components/Solutions/SolutionManager"](../modules/_components_solutions_solutionmanager_.md) › [SolutionManager](_components_solutions_solutionmanager_.solutionmanager.md)

## Hierarchy

* **SolutionManager**

## Index

### Methods

* [addSolutionComponent](_components_solutions_solutionmanager_.solutionmanager.md#static-addsolutioncomponent)
* [createProcess](_components_solutions_solutionmanager_.solutionmanager.md#static-createprocess)
* [exportSolution](_components_solutions_solutionmanager_.solutionmanager.md#static-exportsolution)
* [importSolution](_components_solutions_solutionmanager_.solutionmanager.md#static-importsolution)
* [importSolutionFromFile](_components_solutions_solutionmanager_.solutionmanager.md#static-importsolutionfromfile)
* [packSolution](_components_solutions_solutionmanager_.solutionmanager.md#static-packsolution)
* [packSolutionFromFolder](_components_solutions_solutionmanager_.solutionmanager.md#static-packsolutionfromfolder)
* [publishCustomizations](_components_solutions_solutionmanager_.solutionmanager.md#static-publishcustomizations)
* [registerPluginAssembly](_components_solutions_solutionmanager_.solutionmanager.md#static-registerpluginassembly)
* [registerPluginFile](_components_solutions_solutionmanager_.solutionmanager.md#static-registerpluginfile)
* [removeSolutionComponent](_components_solutions_solutionmanager_.solutionmanager.md#static-removesolutioncomponent)
* [unpackSolution](_components_solutions_solutionmanager_.solutionmanager.md#static-unpacksolution)
* [unpackSolutionFromTreeView](_components_solutions_solutionmanager_.solutionmanager.md#static-unpacksolutionfromtreeview)
* [unpackSolutionToFolder](_components_solutions_solutionmanager_.solutionmanager.md#static-unpacksolutiontofolder)

## Methods

### `Static` addSolutionComponent

▸ **addSolutionComponent**(`config?`: [Config](../interfaces/_api_cds_webapi_cdswebapi_.cdswebapi.config.md), `solution?`: any, `componentId?`: string, `componentType?`: [SolutionComponent](../enums/_api_cdssolutions_.cdssolutions.solutioncomponent.md), `addRequiredComponents?`: boolean, `doNotIncludeSubcomponents?`: boolean, `componentSettings?`: string): *Promise‹any›*

Defined in src/components/Solutions/SolutionManager.ts:23

**Parameters:**

Name | Type |
------ | ------ |
`config?` | [Config](../interfaces/_api_cds_webapi_cdswebapi_.cdswebapi.config.md) |
`solution?` | any |
`componentId?` | string |
`componentType?` | [SolutionComponent](../enums/_api_cdssolutions_.cdssolutions.solutioncomponent.md) |
`addRequiredComponents?` | boolean |
`doNotIncludeSubcomponents?` | boolean |
`componentSettings?` | string |

**Returns:** *Promise‹any›*

___

### `Static` createProcess

▸ **createProcess**(`config?`: [Config](../interfaces/_api_cds_webapi_cdswebapi_.cdswebapi.config.md), `solutionId?`: string): *Promise‹any›*

Defined in src/components/Solutions/SolutionManager.ts:18

**Parameters:**

Name | Type |
------ | ------ |
`config?` | [Config](../interfaces/_api_cds_webapi_cdswebapi_.cdswebapi.config.md) |
`solutionId?` | string |

**Returns:** *Promise‹any›*

___

### `Static` exportSolution

▸ **exportSolution**(`config?`: [Config](../interfaces/_api_cds_webapi_cdswebapi_.cdswebapi.config.md), `solution?`: any, `solutionFile?`: Uri, `options?`: [ExportSolutionOptions](../modules/_commands_cs_cds_deployment_exportsolution_.md#exportsolutionoptions), `inform`: boolean): *Promise‹void›*

Defined in src/components/Solutions/SolutionManager.ts:33

**Parameters:**

Name | Type | Default |
------ | ------ | ------ |
`config?` | [Config](../interfaces/_api_cds_webapi_cdswebapi_.cdswebapi.config.md) | - |
`solution?` | any | - |
`solutionFile?` | Uri | - |
`options?` | [ExportSolutionOptions](../modules/_commands_cs_cds_deployment_exportsolution_.md#exportsolutionoptions) | - |
`inform` | boolean | true |

**Returns:** *Promise‹void›*

___

### `Static` importSolution

▸ **importSolution**(`config?`: [Config](../interfaces/_api_cds_webapi_cdswebapi_.cdswebapi.config.md), `solutionFile?`: Uri, `options?`: [ImportSolutionOptions](../modules/_commands_cs_cds_deployment_importsolution_.md#importsolutionoptions), `inform`: boolean): *Promise‹void›*

Defined in src/components/Solutions/SolutionManager.ts:38

**Parameters:**

Name | Type | Default |
------ | ------ | ------ |
`config?` | [Config](../interfaces/_api_cds_webapi_cdswebapi_.cdswebapi.config.md) | - |
`solutionFile?` | Uri | - |
`options?` | [ImportSolutionOptions](../modules/_commands_cs_cds_deployment_importsolution_.md#importsolutionoptions) | - |
`inform` | boolean | true |

**Returns:** *Promise‹void›*

___

### `Static` importSolutionFromFile

▸ **importSolutionFromFile**(`solutionFile?`: Uri): *Promise‹void›*

Defined in src/components/Solutions/SolutionManager.ts:43

**Parameters:**

Name | Type |
------ | ------ |
`solutionFile?` | Uri |

**Returns:** *Promise‹void›*

___

### `Static` packSolution

▸ **packSolution**(`config?`: [Config](../interfaces/_api_cds_webapi_cdswebapi_.cdswebapi.config.md), `folder?`: string, `solution?`: any, `toolsPath?`: string, `logFile?`: string, `mappingFile?`: string, `includeResourceFiles?`: boolean, `solutionPath?`: string, `managed?`: boolean): *Promise‹any›*

Defined in src/components/Solutions/SolutionManager.ts:53

**Parameters:**

Name | Type |
------ | ------ |
`config?` | [Config](../interfaces/_api_cds_webapi_cdswebapi_.cdswebapi.config.md) |
`folder?` | string |
`solution?` | any |
`toolsPath?` | string |
`logFile?` | string |
`mappingFile?` | string |
`includeResourceFiles?` | boolean |
`solutionPath?` | string |
`managed?` | boolean |

**Returns:** *Promise‹any›*

___

### `Static` packSolutionFromFolder

▸ **packSolutionFromFolder**(`folder?`: Uri): *Promise‹unknown›*

Defined in src/components/Solutions/SolutionManager.ts:48

**Parameters:**

Name | Type |
------ | ------ |
`folder?` | Uri |

**Returns:** *Promise‹unknown›*

___

### `Static` publishCustomizations

▸ **publishCustomizations**(`config?`: [Config](../interfaces/_api_cds_webapi_cdswebapi_.cdswebapi.config.md), `components?`: object[]): *Promise‹any›*

Defined in src/components/Solutions/SolutionManager.ts:83

**Parameters:**

Name | Type |
------ | ------ |
`config?` | [Config](../interfaces/_api_cds_webapi_cdswebapi_.cdswebapi.config.md) |
`components?` | object[] |

**Returns:** *Promise‹any›*

___

### `Static` registerPluginAssembly

▸ **registerPluginAssembly**(`config?`: [Config](../interfaces/_api_cds_webapi_cdswebapi_.cdswebapi.config.md), `pluginAssembly?`: any, `file?`: Uri, `solution?`: any): *Promise‹any›*

Defined in src/components/Solutions/SolutionManager.ts:78

**Parameters:**

Name | Type |
------ | ------ |
`config?` | [Config](../interfaces/_api_cds_webapi_cdswebapi_.cdswebapi.config.md) |
`pluginAssembly?` | any |
`file?` | Uri |
`solution?` | any |

**Returns:** *Promise‹any›*

___

### `Static` registerPluginFile

▸ **registerPluginFile**(`file?`: Uri): *Promise‹unknown›*

Defined in src/components/Solutions/SolutionManager.ts:73

**Parameters:**

Name | Type |
------ | ------ |
`file?` | Uri |

**Returns:** *Promise‹unknown›*

___

### `Static` removeSolutionComponent

▸ **removeSolutionComponent**(`config?`: [Config](../interfaces/_api_cds_webapi_cdswebapi_.cdswebapi.config.md), `solution?`: any, `componentId?`: string, `componentType?`: [SolutionComponent](../enums/_api_cdssolutions_.cdssolutions.solutioncomponent.md)): *Promise‹any›*

Defined in src/components/Solutions/SolutionManager.ts:28

**Parameters:**

Name | Type |
------ | ------ |
`config?` | [Config](../interfaces/_api_cds_webapi_cdswebapi_.cdswebapi.config.md) |
`solution?` | any |
`componentId?` | string |
`componentType?` | [SolutionComponent](../enums/_api_cdssolutions_.cdssolutions.solutioncomponent.md) |

**Returns:** *Promise‹any›*

___

### `Static` unpackSolution

▸ **unpackSolution**(`config?`: [Config](../interfaces/_api_cds_webapi_cdswebapi_.cdswebapi.config.md), `folder?`: string, `solution?`: any, `toolsPath?`: string, `logFile?`: string, `mappingFile?`: string, `templateResourceCode?`: string, `includeResourceFiles?`: boolean, `allowDelete`: boolean): *Promise‹any›*

Defined in src/components/Solutions/SolutionManager.ts:68

**Parameters:**

Name | Type | Default |
------ | ------ | ------ |
`config?` | [Config](../interfaces/_api_cds_webapi_cdswebapi_.cdswebapi.config.md) | - |
`folder?` | string | - |
`solution?` | any | - |
`toolsPath?` | string | - |
`logFile?` | string | - |
`mappingFile?` | string | - |
`templateResourceCode?` | string | - |
`includeResourceFiles?` | boolean | - |
`allowDelete` | boolean | true |

**Returns:** *Promise‹any›*

___

### `Static` unpackSolutionFromTreeView

▸ **unpackSolutionFromTreeView**(`item`: any): *Promise‹unknown›*

Defined in src/components/Solutions/SolutionManager.ts:58

**Parameters:**

Name | Type |
------ | ------ |
`item` | any |

**Returns:** *Promise‹unknown›*

___

### `Static` unpackSolutionToFolder

▸ **unpackSolutionToFolder**(`folder?`: Uri): *Promise‹unknown›*

Defined in src/components/Solutions/SolutionManager.ts:63

**Parameters:**

Name | Type |
------ | ------ |
`folder?` | Uri |

**Returns:** *Promise‹unknown›*
