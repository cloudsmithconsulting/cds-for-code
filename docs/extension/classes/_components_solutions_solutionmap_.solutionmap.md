[cds-for-code](../README.md) › [Globals](../globals.md) › ["components/Solutions/SolutionMap"](../modules/_components_solutions_solutionmap_.md) › [SolutionMap](_components_solutions_solutionmap_.solutionmap.md)

# Class: SolutionMap

## Hierarchy

* **SolutionMap**

## Index

### Constructors

* [constructor](_components_solutions_solutionmap_.solutionmap.md#constructor)

### Properties

* [mappings](_components_solutions_solutionmap_.solutionmap.md#mappings)

### Methods

* [activate](_components_solutions_solutionmap_.solutionmap.md#activate)
* [clear](_components_solutions_solutionmap_.solutionmap.md#clear)
* [getByPath](_components_solutions_solutionmap_.solutionmap.md#getbypath)
* [getByPathOrParent](_components_solutions_solutionmap_.solutionmap.md#getbypathorparent)
* [getBySolutionId](_components_solutions_solutionmap_.solutionmap.md#getbysolutionid)
* [hasPathMap](_components_solutions_solutionmap_.solutionmap.md#haspathmap)
* [hasSolutionMap](_components_solutions_solutionmap_.solutionmap.md#hassolutionmap)
* [load](_components_solutions_solutionmap_.solutionmap.md#load)
* [map](_components_solutions_solutionmap_.solutionmap.md#map)
* [monitorMappedFolders](_components_solutions_solutionmap_.solutionmap.md#private-monitormappedfolders)
* [save](_components_solutions_solutionmap_.solutionmap.md#save)
* [saveToWorkspace](_components_solutions_solutionmap_.solutionmap.md#savetoworkspace)
* [unmap](_components_solutions_solutionmap_.solutionmap.md#unmap)
* [unmonitorMappedFolders](_components_solutions_solutionmap_.solutionmap.md#private-unmonitormappedfolders)
* [from](_components_solutions_solutionmap_.solutionmap.md#static-from)
* [loadFromWorkspace](_components_solutions_solutionmap_.solutionmap.md#static-loadfromworkspace)
* [mapWorkspacePath](_components_solutions_solutionmap_.solutionmap.md#static-mapworkspacepath)
* [patternName](_components_solutions_solutionmap_.solutionmap.md#static-private-patternname)
* [read](_components_solutions_solutionmap_.solutionmap.md#static-read)
* [removeSolutionMapping](_components_solutions_solutionmap_.solutionmap.md#static-removesolutionmapping)
* [updateSolutionMapping](_components_solutions_solutionmap_.solutionmap.md#static-updatesolutionmapping)
* [write](_components_solutions_solutionmap_.solutionmap.md#static-write)

## Constructors

###  constructor

\+ **new SolutionMap**(`map?`: [SolutionMap](_components_solutions_solutionmap_.solutionmap.md)): *[SolutionMap](_components_solutions_solutionmap_.solutionmap.md)*

Defined in src/components/Solutions/SolutionMap.ts:17

**Parameters:**

Name | Type |
------ | ------ |
`map?` | [SolutionMap](_components_solutions_solutionmap_.solutionmap.md) |

**Returns:** *[SolutionMap](_components_solutions_solutionmap_.solutionmap.md)*

## Properties

###  mappings

• **mappings**: *[SolutionWorkspaceMapping](_components_solutions_solutionworkspacemapping_.solutionworkspacemapping.md)[]*

Defined in src/components/Solutions/SolutionMap.ts:49

## Methods

###  activate

▸ **activate**(`context`: ExtensionContext, `config?`: WorkspaceConfiguration): *void*

Defined in src/components/Solutions/SolutionMap.ts:31

**Parameters:**

Name | Type |
------ | ------ |
`context` | ExtensionContext |
`config?` | WorkspaceConfiguration |

**Returns:** *void*

___

###  clear

▸ **clear**(): *[SolutionMap](_components_solutions_solutionmap_.solutionmap.md)*

Defined in src/components/Solutions/SolutionMap.ts:153

**Returns:** *[SolutionMap](_components_solutions_solutionmap_.solutionmap.md)*

___

###  getByPath

▸ **getByPath**(`fsPath`: string, `organizationId?`: string): *[SolutionWorkspaceMapping](_components_solutions_solutionworkspacemapping_.solutionworkspacemapping.md)[]*

Defined in src/components/Solutions/SolutionMap.ts:98

**Parameters:**

Name | Type |
------ | ------ |
`fsPath` | string |
`organizationId?` | string |

**Returns:** *[SolutionWorkspaceMapping](_components_solutions_solutionworkspacemapping_.solutionworkspacemapping.md)[]*

___

###  getByPathOrParent

▸ **getByPathOrParent**(`fsPath`: string, `organizationId?`: string): *[SolutionWorkspaceMapping](_components_solutions_solutionworkspacemapping_.solutionworkspacemapping.md)[]*

Defined in src/components/Solutions/SolutionMap.ts:109

**Parameters:**

Name | Type |
------ | ------ |
`fsPath` | string |
`organizationId?` | string |

**Returns:** *[SolutionWorkspaceMapping](_components_solutions_solutionworkspacemapping_.solutionworkspacemapping.md)[]*

___

###  getBySolutionId

▸ **getBySolutionId**(`solutionId`: string, `organizationId?`: string): *[SolutionWorkspaceMapping](_components_solutions_solutionworkspacemapping_.solutionworkspacemapping.md)[]*

Defined in src/components/Solutions/SolutionMap.ts:125

**Parameters:**

Name | Type |
------ | ------ |
`solutionId` | string |
`organizationId?` | string |

**Returns:** *[SolutionWorkspaceMapping](_components_solutions_solutionworkspacemapping_.solutionworkspacemapping.md)[]*

___

###  hasPathMap

▸ **hasPathMap**(`path`: string, `organizationId?`: string): *boolean*

Defined in src/components/Solutions/SolutionMap.ts:90

**Parameters:**

Name | Type |
------ | ------ |
`path` | string |
`organizationId?` | string |

**Returns:** *boolean*

___

###  hasSolutionMap

▸ **hasSolutionMap**(`solutionId`: string, `organizationId?`: string): *boolean*

Defined in src/components/Solutions/SolutionMap.ts:94

**Parameters:**

Name | Type |
------ | ------ |
`solutionId` | string |
`organizationId?` | string |

**Returns:** *boolean*

___

###  load

▸ **load**(`filename?`: string): *Promise‹[SolutionMap](_components_solutions_solutionmap_.solutionmap.md)›*

Defined in src/components/Solutions/SolutionMap.ts:135

**Parameters:**

Name | Type |
------ | ------ |
`filename?` | string |

**Returns:** *Promise‹[SolutionMap](_components_solutions_solutionmap_.solutionmap.md)›*

___

###  map

▸ **map**(`organizationId`: string, `solutionId`: string, `path`: string): *[SolutionMap](_components_solutions_solutionmap_.solutionmap.md)*

Defined in src/components/Solutions/SolutionMap.ts:51

**Parameters:**

Name | Type |
------ | ------ |
`organizationId` | string |
`solutionId` | string |
`path` | string |

**Returns:** *[SolutionMap](_components_solutions_solutionmap_.solutionmap.md)*

___

### `Private` monitorMappedFolders

▸ **monitorMappedFolders**(`mapping?`: [SolutionWorkspaceMapping](_components_solutions_solutionworkspacemapping_.solutionworkspacemapping.md)): *void*

Defined in src/components/Solutions/SolutionMap.ts:248

**Parameters:**

Name | Type |
------ | ------ |
`mapping?` | [SolutionWorkspaceMapping](_components_solutions_solutionworkspacemapping_.solutionworkspacemapping.md) |

**Returns:** *void*

___

###  save

▸ **save**(`filename?`: string): *Promise‹[SolutionMap](_components_solutions_solutionmap_.solutionmap.md)›*

Defined in src/components/Solutions/SolutionMap.ts:139

**Parameters:**

Name | Type |
------ | ------ |
`filename?` | string |

**Returns:** *Promise‹[SolutionMap](_components_solutions_solutionmap_.solutionmap.md)›*

___

###  saveToWorkspace

▸ **saveToWorkspace**(`context?`: ExtensionContext): *Promise‹[SolutionMap](_components_solutions_solutionmap_.solutionmap.md)›*

Defined in src/components/Solutions/SolutionMap.ts:143

**Parameters:**

Name | Type |
------ | ------ |
`context?` | ExtensionContext |

**Returns:** *Promise‹[SolutionMap](_components_solutions_solutionmap_.solutionmap.md)›*

___

###  unmap

▸ **unmap**(`organizationId?`: string, `solutionId?`: string, `path?`: string): *boolean*

Defined in src/components/Solutions/SolutionMap.ts:71

**Parameters:**

Name | Type |
------ | ------ |
`organizationId?` | string |
`solutionId?` | string |
`path?` | string |

**Returns:** *boolean*

___

### `Private` unmonitorMappedFolders

▸ **unmonitorMappedFolders**(`mapping?`: [SolutionWorkspaceMapping](_components_solutions_solutionworkspacemapping_.solutionworkspacemapping.md)): *void*

Defined in src/components/Solutions/SolutionMap.ts:287

**Parameters:**

Name | Type |
------ | ------ |
`mapping?` | [SolutionWorkspaceMapping](_components_solutions_solutionworkspacemapping_.solutionworkspacemapping.md) |

**Returns:** *void*

___

### `Static` from

▸ **from**(`map`: [SolutionMap](_components_solutions_solutionmap_.solutionmap.md)): *[SolutionMap](_components_solutions_solutionmap_.solutionmap.md)*

Defined in src/components/Solutions/SolutionMap.ts:131

**Parameters:**

Name | Type |
------ | ------ |
`map` | [SolutionMap](_components_solutions_solutionmap_.solutionmap.md) |

**Returns:** *[SolutionMap](_components_solutions_solutionmap_.solutionmap.md)*

___

### `Static` loadFromWorkspace

▸ **loadFromWorkspace**(`context?`: ExtensionContext, `forceWorkspaceOpen`: boolean): *Promise‹[SolutionMap](_components_solutions_solutionmap_.solutionmap.md)›*

Defined in src/components/Solutions/SolutionMap.ts:160

**Parameters:**

Name | Type | Default |
------ | ------ | ------ |
`context?` | ExtensionContext | - |
`forceWorkspaceOpen` | boolean | true |

**Returns:** *Promise‹[SolutionMap](_components_solutions_solutionmap_.solutionmap.md)›*

___

### `Static` mapWorkspacePath

▸ **mapWorkspacePath**(`solutionPath`: string, `component?`: [SolutionComponent](../enums/_api_cdssolutions_.cdssolutions.solutioncomponent.md), `item?`: any): *string*

Defined in src/components/Solutions/SolutionMap.ts:174

**Parameters:**

Name | Type |
------ | ------ |
`solutionPath` | string |
`component?` | [SolutionComponent](../enums/_api_cdssolutions_.cdssolutions.solutioncomponent.md) |
`item?` | any |

**Returns:** *string*

___

### `Static` `Private` patternName

▸ **patternName**(`pattern`: vscode.GlobPattern): *string*

Defined in src/components/Solutions/SolutionMap.ts:299

**Parameters:**

Name | Type |
------ | ------ |
`pattern` | vscode.GlobPattern |

**Returns:** *string*

___

### `Static` read

▸ **read**(`filename`: string, `forceWorkspaceOpen`: boolean): *Promise‹[SolutionMap](_components_solutions_solutionmap_.solutionmap.md)›*

Defined in src/components/Solutions/SolutionMap.ts:199

**Parameters:**

Name | Type | Default |
------ | ------ | ------ |
`filename` | string | ".cds/solutionMap.json" |
`forceWorkspaceOpen` | boolean | true |

**Returns:** *Promise‹[SolutionMap](_components_solutions_solutionmap_.solutionmap.md)›*

___

### `Static` removeSolutionMapping

▸ **removeSolutionMapping**(`item?`: [SolutionWorkspaceMapping](_components_solutions_solutionworkspacemapping_.solutionworkspacemapping.md)): *Promise‹boolean›*

Defined in src/components/Solutions/SolutionMap.ts:40

**Parameters:**

Name | Type |
------ | ------ |
`item?` | [SolutionWorkspaceMapping](_components_solutions_solutionworkspacemapping_.solutionworkspacemapping.md) |

**Returns:** *Promise‹boolean›*

___

### `Static` updateSolutionMapping

▸ **updateSolutionMapping**(`item?`: [SolutionWorkspaceMapping](_components_solutions_solutionworkspacemapping_.solutionworkspacemapping.md), `config?`: [Config](../interfaces/_api_cds_webapi_cdswebapi_.cdswebapi.config.md), `folder?`: string): *Promise‹[SolutionWorkspaceMapping](_components_solutions_solutionworkspacemapping_.solutionworkspacemapping.md)[]›*

Defined in src/components/Solutions/SolutionMap.ts:45

**Parameters:**

Name | Type |
------ | ------ |
`item?` | [SolutionWorkspaceMapping](_components_solutions_solutionworkspacemapping_.solutionworkspacemapping.md) |
`config?` | [Config](../interfaces/_api_cds_webapi_cdswebapi_.cdswebapi.config.md) |
`folder?` | string |

**Returns:** *Promise‹[SolutionWorkspaceMapping](_components_solutions_solutionworkspacemapping_.solutionworkspacemapping.md)[]›*

___

### `Static` write

▸ **write**(`map`: [SolutionMap](_components_solutions_solutionmap_.solutionmap.md), `filename`: string): *Promise‹[SolutionMap](_components_solutions_solutionmap_.solutionmap.md)›*

Defined in src/components/Solutions/SolutionMap.ts:227

**Parameters:**

Name | Type | Default |
------ | ------ | ------ |
`map` | [SolutionMap](_components_solutions_solutionmap_.solutionmap.md) | - |
`filename` | string | ".cds/solutionMap.json" |

**Returns:** *Promise‹[SolutionMap](_components_solutions_solutionmap_.solutionmap.md)›*
