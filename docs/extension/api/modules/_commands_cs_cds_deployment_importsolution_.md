---
id: "_commands_cs_cds_deployment_importsolution_"
title: "commands/cs.cds.deployment.importSolution"
sidebar_label: "commands/cs.cds.deployment.importSolution"
---

[cds-for-code](../index.md) › [Globals](../globals.md) › ["commands/cs.cds.deployment.importSolution"](_commands_cs_cds_deployment_importsolution_.md)

## Index

### Type aliases

* [ImportSolutionOptions](_commands_cs_cds_deployment_importsolution_.md#importsolutionoptions)

### Functions

* [run](_commands_cs_cds_deployment_importsolution_.md#run)

## Type aliases

###  ImportSolutionOptions

Ƭ **ImportSolutionOptions**: *object*

Defined in src/commands/cs.cds.deployment.importSolution.ts:11

#### Type declaration:

* **ConvertToManaged**? : *boolean*

* **HoldingSolution**? : *boolean*

* **OverwriteUnmanagedCustomizations**: *boolean*

* **PublishWorkflows**: *boolean*

* **SkipProductUpdateDependencies**? : *boolean*

## Functions

###  run

▸ **run**(`this`: [SolutionManager](../classes/_components_solutions_solutionmanager_.solutionmanager.md), `config?`: [Config](../interfaces/_api_cds_webapi_cdswebapi_.cdswebapi.config.md), `solutionFile?`: Uri, `options?`: [ImportSolutionOptions](_commands_cs_cds_deployment_importsolution_.md#importsolutionoptions), `inform`: boolean): *Promise‹any›*

Defined in src/commands/cs.cds.deployment.importSolution.ts:26

This command can be invoked by the by either the file explorer view or the Dynamics TreeView
and can compare two copies of a web resource.

**`export`** run command function

**Parameters:**

Name | Type | Default |
------ | ------ | ------ |
`this` | [SolutionManager](../classes/_components_solutions_solutionmanager_.solutionmanager.md) | - |
`config?` | [Config](../interfaces/_api_cds_webapi_cdswebapi_.cdswebapi.config.md) | - |
`solutionFile?` | Uri | - |
`options?` | [ImportSolutionOptions](_commands_cs_cds_deployment_importsolution_.md#importsolutionoptions) | - |
`inform` | boolean | true |

**Returns:** *Promise‹any›*

void
