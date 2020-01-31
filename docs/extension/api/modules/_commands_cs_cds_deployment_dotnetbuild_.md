---
id: "_commands_cs_cds_deployment_dotnetbuild_"
title: "commands/cs.cds.deployment.dotNetBuild"
sidebar_label: "commands/cs.cds.deployment.dotNetBuild"
---

[cds-for-code](../index.md) › [Globals](../globals.md) › ["commands/cs.cds.deployment.dotNetBuild"](_commands_cs_cds_deployment_dotnetbuild_.md)

## Index

### Functions

* [incrementBuild](_commands_cs_cds_deployment_dotnetbuild_.md#const-incrementbuild)
* [run](_commands_cs_cds_deployment_dotnetbuild_.md#run)

## Functions

### `Const` incrementBuild

▸ **incrementBuild**(`build`: string): *string*

Defined in src/commands/cs.cds.deployment.dotNetBuild.ts:18

This command can be invoked by the Explorer file viewer and builds a .Net Core project

**Parameters:**

Name | Type |
------ | ------ |
`build` | string |

**Returns:** *string*

void

___

###  run

▸ **run**(`this`: [VisualStudioProjectCommands](../classes/_components_dotnetcore_dotnetprojectmanager_.visualstudioprojectcommands.md), `file?`: Uri, `updateVersionBuild`: boolean, `logFile?`: string): *Promise‹any›*

Defined in src/commands/cs.cds.deployment.dotNetBuild.ts:32

**Parameters:**

Name | Type | Default |
------ | ------ | ------ |
`this` | [VisualStudioProjectCommands](../classes/_components_dotnetcore_dotnetprojectmanager_.visualstudioprojectcommands.md) | - |
`file?` | Uri | - |
`updateVersionBuild` | boolean | true |
`logFile?` | string | - |

**Returns:** *Promise‹any›*
