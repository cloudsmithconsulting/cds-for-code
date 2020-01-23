[cds-for-code](../README.md) › [Globals](../globals.md) › ["components/Solutions/SolutionWorkspaceMapping"](../modules/_components_solutions_solutionworkspacemapping_.md) › [SolutionWorkspaceMapping](_components_solutions_solutionworkspacemapping_.solutionworkspacemapping.md)

# Class: SolutionWorkspaceMapping

## Hierarchy

* **SolutionWorkspaceMapping**

## Index

### Constructors

* [constructor](_components_solutions_solutionworkspacemapping_.solutionworkspacemapping.md#constructor)

### Properties

* [organizationId](_components_solutions_solutionworkspacemapping_.solutionworkspacemapping.md#organizationid)
* [path](_components_solutions_solutionworkspacemapping_.solutionworkspacemapping.md#path)
* [solutionId](_components_solutions_solutionworkspacemapping_.solutionworkspacemapping.md#solutionid)

### Methods

* [getPath](_components_solutions_solutionworkspacemapping_.solutionworkspacemapping.md#getpath)
* [getSolutionWatcherPattern](_components_solutions_solutionworkspacemapping_.solutionworkspacemapping.md#static-getsolutionwatcherpattern)
* [getWebResourceWatcherPattern](_components_solutions_solutionworkspacemapping_.solutionworkspacemapping.md#static-getwebresourcewatcherpattern)

## Constructors

###  constructor

\+ **new SolutionWorkspaceMapping**(`organizationId?`: string, `solutionId?`: string, `path?`: string): *[SolutionWorkspaceMapping](_components_solutions_solutionworkspacemapping_.solutionworkspacemapping.md)*

Defined in src/components/Solutions/SolutionWorkspaceMapping.ts:6

**Parameters:**

Name | Type |
------ | ------ |
`organizationId?` | string |
`solutionId?` | string |
`path?` | string |

**Returns:** *[SolutionWorkspaceMapping](_components_solutions_solutionworkspacemapping_.solutionworkspacemapping.md)*

## Properties

###  organizationId

• **organizationId**: *string*

Defined in src/components/Solutions/SolutionWorkspaceMapping.ts:14

___

###  path

• **path**: *string*

Defined in src/components/Solutions/SolutionWorkspaceMapping.ts:15

___

###  solutionId

• **solutionId**: *string*

Defined in src/components/Solutions/SolutionWorkspaceMapping.ts:13

## Methods

###  getPath

▸ **getPath**(`component?`: [SolutionComponent](../enums/_api_cdssolutions_.cdssolutions.solutioncomponent.md), `item?`: any): *string*

Defined in src/components/Solutions/SolutionWorkspaceMapping.ts:17

**Parameters:**

Name | Type |
------ | ------ |
`component?` | [SolutionComponent](../enums/_api_cdssolutions_.cdssolutions.solutioncomponent.md) |
`item?` | any |

**Returns:** *string*

___

### `Static` getSolutionWatcherPattern

▸ **getSolutionWatcherPattern**(`mapping`: [SolutionWorkspaceMapping](_components_solutions_solutionworkspacemapping_.solutionworkspacemapping.md)): *vscode.GlobPattern*

Defined in src/components/Solutions/SolutionWorkspaceMapping.ts:21

**Parameters:**

Name | Type |
------ | ------ |
`mapping` | [SolutionWorkspaceMapping](_components_solutions_solutionworkspacemapping_.solutionworkspacemapping.md) |

**Returns:** *vscode.GlobPattern*

___

### `Static` getWebResourceWatcherPattern

▸ **getWebResourceWatcherPattern**(`mapping`: [SolutionWorkspaceMapping](_components_solutions_solutionworkspacemapping_.solutionworkspacemapping.md)): *vscode.GlobPattern*

Defined in src/components/Solutions/SolutionWorkspaceMapping.ts:25

**Parameters:**

Name | Type |
------ | ------ |
`mapping` | [SolutionWorkspaceMapping](_components_solutions_solutionworkspacemapping_.solutionworkspacemapping.md) |

**Returns:** *vscode.GlobPattern*
