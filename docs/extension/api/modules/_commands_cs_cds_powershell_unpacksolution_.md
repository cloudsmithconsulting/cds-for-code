---
id: "_commands_cs_cds_powershell_unpacksolution_"
title: "commands/cs.cds.powerShell.unpackSolution"
sidebar_label: "commands/cs.cds.powerShell.unpackSolution"
---

[cds-for-code](../index.md) › [Globals](../globals.md) › ["commands/cs.cds.powerShell.unpackSolution"](_commands_cs_cds_powershell_unpacksolution_.md)

## Index

### Functions

* [run](_commands_cs_cds_powershell_unpacksolution_.md#run)

## Functions

###  run

▸ **run**(`this`: [SolutionManager](../classes/_components_solutions_solutionmanager_.solutionmanager.md), `config?`: [Config](../interfaces/_api_cds_webapi_cdswebapi_.cdswebapi.config.md), `folder?`: string, `solution?`: any, `toolsPath?`: string, `logFile?`: string, `mappingFile?`: string, `templateResourceCode?`: string, `includeResourceFiles?`: boolean, `allowDelete`: boolean): *Promise‹[TerminalCommand](../classes/_components_terminal_secureterminal_.terminalcommand.md)‹››*

Defined in src/commands/cs.cds.powerShell.unpackSolution.ts:23

This command can be invoked by the Command Palette and packs a solution.

**`export`** run command function

**Parameters:**

Name | Type | Default |
------ | ------ | ------ |
`this` | [SolutionManager](../classes/_components_solutions_solutionmanager_.solutionmanager.md) | - |
`config?` | [Config](../interfaces/_api_cds_webapi_cdswebapi_.cdswebapi.config.md) | - |
`folder?` | string | - |
`solution?` | any | - |
`toolsPath?` | string | - |
`logFile?` | string | - |
`mappingFile?` | string | - |
`templateResourceCode?` | string | - |
`includeResourceFiles?` | boolean | - |
`allowDelete` | boolean | true |

**Returns:** *Promise‹[TerminalCommand](../classes/_components_terminal_secureterminal_.terminalcommand.md)‹››*

void
