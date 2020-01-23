---
id: "_commands_cs_cds_powershell_generateentities_"
title: "commands/cs.cds.powerShell.generateEntities"
sidebar_label: "commands/cs.cds.powerShell.generateEntities"
---

[cds-for-code](../index.md) › [Globals](../globals.md) › ["commands/cs.cds.powerShell.generateEntities"](_commands_cs_cds_powershell_generateentities_.md)

## Index

### Functions

* [run](_commands_cs_cds_powershell_generateentities_.md#run)

## Functions

###  run

▸ **run**(`config?`: [Config](../interfaces/_api_cds_webapi_cdswebapi_.cdswebapi.config.md) | string, `folder?`: string, `outputFileName?`: string, `namespace?`: string): *Promise‹[TerminalCommand](../classes/_components_terminal_secureterminal_.terminalcommand.md)‹››*

Defined in src/commands/cs.cds.powerShell.generateEntities.ts:25

This command can be invoked by the Command Pallette or external sources and generates .Net code
using CrmSvcUtil.exe (included with the Dynamics365 SDK)

**`export`** run command function

**Parameters:**

Name | Type |
------ | ------ |
`config?` | [Config](../interfaces/_api_cds_webapi_cdswebapi_.cdswebapi.config.md) &#124; string |
`folder?` | string |
`outputFileName?` | string |
`namespace?` | string |

**Returns:** *Promise‹[TerminalCommand](../classes/_components_terminal_secureterminal_.terminalcommand.md)‹››*

Promise with output from terminal command running CrmSvcUtil.exe
