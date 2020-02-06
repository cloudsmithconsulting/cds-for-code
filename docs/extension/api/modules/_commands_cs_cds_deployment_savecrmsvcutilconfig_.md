---
id: "_commands_cs_cds_deployment_savecrmsvcutilconfig_"
title: "commands/cs.cds.deployment.saveCrmSvcUtilConfig"
sidebar_label: "commands/cs.cds.deployment.saveCrmSvcUtilConfig"
---

[cds-for-code](../index.md) › [Globals](../globals.md) › ["commands/cs.cds.deployment.saveCrmSvcUtilConfig"](_commands_cs_cds_deployment_savecrmsvcutilconfig_.md)

## Index

### Functions

* [run](_commands_cs_cds_deployment_savecrmsvcutilconfig_.md#run)

## Functions

###  run

▸ **run**(`this`: [CodeGenerationManager](../classes/_components_codegeneration_codegenerationmanager_.codegenerationmanager.md), `config`: any, `defaultUri?`: Uri): *Promise‹void›*

Defined in src/commands/cs.cds.deployment.saveCrmSvcUtilConfig.ts:22

This command can be invoked by the CDS for Code CodeGenerationManager or another extension
and can write a CrmSvcUtil.exe.config file to a specified location.

**`export`** run command function, this is the default binding that will be invoked with the command.

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`this` | [CodeGenerationManager](../classes/_components_codegeneration_codegenerationmanager_.codegenerationmanager.md) | is a manager that handles code generation tasks (helpers) |
`config` | any | - |
`defaultUri?` | Uri | - |

**Returns:** *Promise‹void›*

void
