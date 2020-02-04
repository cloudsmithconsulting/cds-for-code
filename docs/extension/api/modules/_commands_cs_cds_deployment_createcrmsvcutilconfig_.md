---
id: "_commands_cs_cds_deployment_createcrmsvcutilconfig_"
title: "commands/cs.cds.deployment.createCrmSvcUtilConfig"
sidebar_label: "commands/cs.cds.deployment.createCrmSvcUtilConfig"
---

[cds-for-code](../index.md) › [Globals](../globals.md) › ["commands/cs.cds.deployment.createCrmSvcUtilConfig"](_commands_cs_cds_deployment_createcrmsvcutilconfig_.md)

## Index

### Functions

* [run](_commands_cs_cds_deployment_createcrmsvcutilconfig_.md#run)

## Functions

###  run

▸ **run**(`this`: [CodeGenerationManager](../classes/_components_codegeneration_codegenerationmanager_.codegenerationmanager.md), `config?`: [Config](../interfaces/_api_cds_webapi_cdswebapi_.cdswebapi.config.md), `defaultUri?`: Uri): *Promise‹void›*

Defined in src/commands/cs.cds.deployment.createCrmSvcUtilConfig.ts:23

This command can be invoked by the by either the file explorer view or the CDS Explorer
and can create a blank crmsvcutil.exe.config file or open an existing one up in the editor.

**`export`** run command function, this is the default binding that will be invoked with the command.

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`this` | [CodeGenerationManager](../classes/_components_codegeneration_codegenerationmanager_.codegenerationmanager.md) | is a manager that handles code generation tasks (helpers) |
`config?` | [Config](../interfaces/_api_cds_webapi_cdswebapi_.cdswebapi.config.md) | - |
`defaultUri?` | Uri | - |

**Returns:** *Promise‹void›*

void
