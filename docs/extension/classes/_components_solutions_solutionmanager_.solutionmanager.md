[cds-for-code](../README.md) › [Globals](../globals.md) › ["components/Solutions/SolutionManager"](../modules/_components_solutions_solutionmanager_.md) › [SolutionManager](_components_solutions_solutionmanager_.solutionmanager.md)

# Class: SolutionManager

## Hierarchy

* **SolutionManager**

## Index

### Methods

* [addSolutionComponent](_components_solutions_solutionmanager_.solutionmanager.md#static-addsolutioncomponent)
* [createProcess](_components_solutions_solutionmanager_.solutionmanager.md#static-createprocess)
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

Defined in src/components/Solutions/SolutionManager.ts:21

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

Defined in src/components/Solutions/SolutionManager.ts:16

**Parameters:**

Name | Type |
------ | ------ |
`config?` | [Config](../interfaces/_api_cds_webapi_cdswebapi_.cdswebapi.config.md) |
`solutionId?` | string |

**Returns:** *Promise‹any›*

___

### `Static` packSolution

▸ **packSolution**(`config?`: [Config](../interfaces/_api_cds_webapi_cdswebapi_.cdswebapi.config.md), `folder?`: string, `solution?`: any, `toolsPath?`: string, `logFile?`: string, `mappingFile?`: string, `includeResourceFiles?`: boolean, `solutionPath?`: string, `managed?`: boolean): *Promise‹any›*

Defined in src/components/Solutions/SolutionManager.ts:36

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

Defined in src/components/Solutions/SolutionManager.ts:31

**Parameters:**

Name | Type |
------ | ------ |
`folder?` | Uri |

**Returns:** *Promise‹unknown›*

___

### `Static` publishCustomizations

▸ **publishCustomizations**(`config?`: [Config](../interfaces/_api_cds_webapi_cdswebapi_.cdswebapi.config.md), `components?`: object[]): *Promise‹any›*

Defined in src/components/Solutions/SolutionManager.ts:66

**Parameters:**

Name | Type |
------ | ------ |
`config?` | [Config](../interfaces/_api_cds_webapi_cdswebapi_.cdswebapi.config.md) |
`components?` | object[] |

**Returns:** *Promise‹any›*

___

### `Static` registerPluginAssembly

▸ **registerPluginAssembly**(`config?`: [Config](../interfaces/_api_cds_webapi_cdswebapi_.cdswebapi.config.md), `pluginAssembly?`: any, `file?`: Uri, `solution?`: any): *Promise‹any›*

Defined in src/components/Solutions/SolutionManager.ts:61

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

Defined in src/components/Solutions/SolutionManager.ts:56

**Parameters:**

Name | Type |
------ | ------ |
`file?` | Uri |

**Returns:** *Promise‹unknown›*

___

### `Static` removeSolutionComponent

▸ **removeSolutionComponent**(`config?`: [Config](../interfaces/_api_cds_webapi_cdswebapi_.cdswebapi.config.md), `solution?`: any, `componentId?`: string, `componentType?`: [SolutionComponent](../enums/_api_cdssolutions_.cdssolutions.solutioncomponent.md)): *Promise‹any›*

Defined in src/components/Solutions/SolutionManager.ts:26

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

Defined in src/components/Solutions/SolutionManager.ts:51

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

Defined in src/components/Solutions/SolutionManager.ts:41

**Parameters:**

Name | Type |
------ | ------ |
`item` | any |

**Returns:** *Promise‹unknown›*

___

### `Static` unpackSolutionToFolder

▸ **unpackSolutionToFolder**(`folder?`: Uri): *Promise‹unknown›*

Defined in src/components/Solutions/SolutionManager.ts:46

**Parameters:**

Name | Type |
------ | ------ |
`folder?` | Uri |

**Returns:** *Promise‹unknown›*
