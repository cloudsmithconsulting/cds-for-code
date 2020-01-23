[cds-for-code](../README.md) › [Globals](../globals.md) › ["components/DotNetCore/DotNetProjectManager"](../modules/_components_dotnetcore_dotnetprojectmanager_.md) › [VisualStudioProjectCommands](_components_dotnetcore_dotnetprojectmanager_.visualstudioprojectcommands.md)

# Class: VisualStudioProjectCommands

## Hierarchy

* **VisualStudioProjectCommands**

## Index

### Properties

* [projectFileTypes](_components_dotnetcore_dotnetprojectmanager_.visualstudioprojectcommands.md#static-projectfiletypes)

### Methods

* [dotNetBuild](_components_dotnetcore_dotnetprojectmanager_.visualstudioprojectcommands.md#static-dotnetbuild)
* [dotNetBuildFromExplorer](_components_dotnetcore_dotnetprojectmanager_.visualstudioprojectcommands.md#static-dotnetbuildfromexplorer)
* [dotNetTest](_components_dotnetcore_dotnetprojectmanager_.visualstudioprojectcommands.md#static-dotnettest)
* [dotNetTestFromFileExplorer](_components_dotnetcore_dotnetprojectmanager_.visualstudioprojectcommands.md#static-dotnettestfromfileexplorer)
* [fileIsProject](_components_dotnetcore_dotnetprojectmanager_.visualstudioprojectcommands.md#static-fileisproject)
* [updateVersionNumber](_components_dotnetcore_dotnetprojectmanager_.visualstudioprojectcommands.md#static-updateversionnumber)

## Properties

### `Static` projectFileTypes

▪ **projectFileTypes**: *string[]* = [".csproj", ".vbproj"]

Defined in src/components/DotNetCore/DotNetProjectManager.ts:31

## Methods

### `Static` dotNetBuild

▸ **dotNetBuild**(`file?`: Uri, `updateVersionBuild`: boolean, `logFile?`: string): *Promise‹any›*

Defined in src/components/DotNetCore/DotNetProjectManager.ts:17

**Parameters:**

Name | Type | Default |
------ | ------ | ------ |
`file?` | Uri | - |
`updateVersionBuild` | boolean | true |
`logFile?` | string | - |

**Returns:** *Promise‹any›*

___

### `Static` dotNetBuildFromExplorer

▸ **dotNetBuildFromExplorer**(`file?`: Uri): *Promise‹unknown›*

Defined in src/components/DotNetCore/DotNetProjectManager.ts:12

**Parameters:**

Name | Type |
------ | ------ |
`file?` | Uri |

**Returns:** *Promise‹unknown›*

___

### `Static` dotNetTest

▸ **dotNetTest**(`file?`: Uri, `logFile?`: string): *Promise‹any›*

Defined in src/components/DotNetCore/DotNetProjectManager.ts:27

**Parameters:**

Name | Type |
------ | ------ |
`file?` | Uri |
`logFile?` | string |

**Returns:** *Promise‹any›*

___

### `Static` dotNetTestFromFileExplorer

▸ **dotNetTestFromFileExplorer**(`file?`: Uri): *Promise‹unknown›*

Defined in src/components/DotNetCore/DotNetProjectManager.ts:22

**Parameters:**

Name | Type |
------ | ------ |
`file?` | Uri |

**Returns:** *Promise‹unknown›*

___

### `Static` fileIsProject

▸ **fileIsProject**(`file`: Uri): *boolean*

Defined in src/components/DotNetCore/DotNetProjectManager.ts:33

**Parameters:**

Name | Type |
------ | ------ |
`file` | Uri |

**Returns:** *boolean*

___

### `Static` updateVersionNumber

▸ **updateVersionNumber**(`file`: Uri, `increment`: function): *Promise‹void›*

Defined in src/components/DotNetCore/DotNetProjectManager.ts:43

**Parameters:**

▪ **file**: *Uri*

▪ **increment**: *function*

▸ (`build`: string): *string*

**Parameters:**

Name | Type |
------ | ------ |
`build` | string |

**Returns:** *Promise‹void›*
