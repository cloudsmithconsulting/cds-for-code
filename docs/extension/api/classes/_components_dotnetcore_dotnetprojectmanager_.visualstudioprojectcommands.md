---
id: "_components_dotnetcore_dotnetprojectmanager_.visualstudioprojectcommands"
title: "VisualStudioProjectCommands"
sidebar_label: "VisualStudioProjectCommands"
---

[cds-for-code](../index.md) › [Globals](../globals.md) › ["components/DotNetCore/DotNetProjectManager"](../modules/_components_dotnetcore_dotnetprojectmanager_.md) › [VisualStudioProjectCommands](_components_dotnetcore_dotnetprojectmanager_.visualstudioprojectcommands.md)

## Hierarchy

* **VisualStudioProjectCommands**

## Index

### Properties

* [projectFileTypes](_components_dotnetcore_dotnetprojectmanager_.visualstudioprojectcommands.md#static-projectfiletypes)

### Methods

* [buildAndRunDynamicsPackage](_components_dotnetcore_dotnetprojectmanager_.visualstudioprojectcommands.md#static-buildandrundynamicspackage)
* [buildDynamicsPackageFromFileExplorer](_components_dotnetcore_dotnetprojectmanager_.visualstudioprojectcommands.md#static-builddynamicspackagefromfileexplorer)
* [dotNetBuild](_components_dotnetcore_dotnetprojectmanager_.visualstudioprojectcommands.md#static-dotnetbuild)
* [dotNetBuildFromExplorer](_components_dotnetcore_dotnetprojectmanager_.visualstudioprojectcommands.md#static-dotnetbuildfromexplorer)
* [dotNetTest](_components_dotnetcore_dotnetprojectmanager_.visualstudioprojectcommands.md#static-dotnettest)
* [dotNetTestFromFileExplorer](_components_dotnetcore_dotnetprojectmanager_.visualstudioprojectcommands.md#static-dotnettestfromfileexplorer)
* [fileIsProject](_components_dotnetcore_dotnetprojectmanager_.visualstudioprojectcommands.md#static-fileisproject)
* [runDynamicsPackageFromFileExplorer](_components_dotnetcore_dotnetprojectmanager_.visualstudioprojectcommands.md#static-rundynamicspackagefromfileexplorer)
* [updateVersionNumber](_components_dotnetcore_dotnetprojectmanager_.visualstudioprojectcommands.md#static-updateversionnumber)

## Properties

### `Static` projectFileTypes

▪ **projectFileTypes**: *string[]* = [".csproj", ".vbproj"]

Defined in src/components/DotNetCore/DotNetProjectManager.ts:47

## Methods

### `Static` buildAndRunDynamicsPackage

▸ **buildAndRunDynamicsPackage**(`file?`: Uri, `runPackage?`: boolean): *Promise‹any›*

Defined in src/components/DotNetCore/DotNetProjectManager.ts:33

**Parameters:**

Name | Type |
------ | ------ |
`file?` | Uri |
`runPackage?` | boolean |

**Returns:** *Promise‹any›*

___

### `Static` buildDynamicsPackageFromFileExplorer

▸ **buildDynamicsPackageFromFileExplorer**(`file?`: Uri): *Promise‹unknown›*

Defined in src/components/DotNetCore/DotNetProjectManager.ts:38

**Parameters:**

Name | Type |
------ | ------ |
`file?` | Uri |

**Returns:** *Promise‹unknown›*

___

### `Static` dotNetBuild

▸ **dotNetBuild**(`file?`: Uri, `updateVersionBuild`: boolean, `logFile?`: string): *Promise‹any›*

Defined in src/components/DotNetCore/DotNetProjectManager.ts:18

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

Defined in src/components/DotNetCore/DotNetProjectManager.ts:13

**Parameters:**

Name | Type |
------ | ------ |
`file?` | Uri |

**Returns:** *Promise‹unknown›*

___

### `Static` dotNetTest

▸ **dotNetTest**(`file?`: Uri, `logFile?`: string): *Promise‹any›*

Defined in src/components/DotNetCore/DotNetProjectManager.ts:28

**Parameters:**

Name | Type |
------ | ------ |
`file?` | Uri |
`logFile?` | string |

**Returns:** *Promise‹any›*

___

### `Static` dotNetTestFromFileExplorer

▸ **dotNetTestFromFileExplorer**(`file?`: Uri): *Promise‹unknown›*

Defined in src/components/DotNetCore/DotNetProjectManager.ts:23

**Parameters:**

Name | Type |
------ | ------ |
`file?` | Uri |

**Returns:** *Promise‹unknown›*

___

### `Static` fileIsProject

▸ **fileIsProject**(`file`: Uri): *boolean*

Defined in src/components/DotNetCore/DotNetProjectManager.ts:49

**Parameters:**

Name | Type |
------ | ------ |
`file` | Uri |

**Returns:** *boolean*

___

### `Static` runDynamicsPackageFromFileExplorer

▸ **runDynamicsPackageFromFileExplorer**(`file?`: Uri): *Promise‹unknown›*

Defined in src/components/DotNetCore/DotNetProjectManager.ts:43

**Parameters:**

Name | Type |
------ | ------ |
`file?` | Uri |

**Returns:** *Promise‹unknown›*

___

### `Static` updateVersionNumber

▸ **updateVersionNumber**(`file`: Uri, `increment`: function): *Promise‹void›*

Defined in src/components/DotNetCore/DotNetProjectManager.ts:59

**Parameters:**

▪ **file**: *Uri*

▪ **increment**: *function*

▸ (`build`: string): *string*

**Parameters:**

Name | Type |
------ | ------ |
`build` | string |

**Returns:** *Promise‹void›*
