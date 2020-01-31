---
id: "_commands_cs_cds_deployment_exportsolution_"
title: "commands/cs.cds.deployment.exportSolution"
sidebar_label: "commands/cs.cds.deployment.exportSolution"
---

[cds-for-code](../index.md) › [Globals](../globals.md) › ["commands/cs.cds.deployment.exportSolution"](_commands_cs_cds_deployment_exportsolution_.md)

## Index

### Type aliases

* [ExportSolutionOptions](_commands_cs_cds_deployment_exportsolution_.md#exportsolutionoptions)

### Functions

* [pickExportOptions](_commands_cs_cds_deployment_exportsolution_.md#pickexportoptions)
* [run](_commands_cs_cds_deployment_exportsolution_.md#run)

## Type aliases

###  ExportSolutionOptions

Ƭ **ExportSolutionOptions**: *object*

Defined in src/commands/cs.cds.deployment.exportSolution.ts:12

#### Type declaration:

* **ExportAutoNumberingSettings**? : *boolean*

* **ExportCalendarSettings**? : *boolean*

* **ExportCustomizationSettings**? : *boolean*

* **ExportEmailTrackingSettings**? : *boolean*

* **ExportExternalApplications**? : *boolean*

* **ExportGeneralSettings**? : *boolean*

* **ExportIsvConfig**? : *boolean*

* **ExportMarketingSettings**? : *boolean*

* **ExportOutlookSynchronizationSettings**? : *boolean*

* **ExportRelationshipRoles**? : *boolean*

* **ExportSales**? : *boolean*

* **Managed**: *boolean*

* **SolutionName**: *string*

* **TargetVersion**? : *string*

## Functions

###  pickExportOptions

▸ **pickExportOptions**(`options`: [ExportSolutionOptions](_commands_cs_cds_deployment_exportsolution_.md#exportsolutionoptions)): *Promise‹[ExportSolutionOptions](_commands_cs_cds_deployment_exportsolution_.md#exportsolutionoptions)›*

Defined in src/commands/cs.cds.deployment.exportSolution.ts:81

**Parameters:**

Name | Type |
------ | ------ |
`options` | [ExportSolutionOptions](_commands_cs_cds_deployment_exportsolution_.md#exportsolutionoptions) |

**Returns:** *Promise‹[ExportSolutionOptions](_commands_cs_cds_deployment_exportsolution_.md#exportsolutionoptions)›*

___

###  run

▸ **run**(`this`: [SolutionManager](../classes/_components_solutions_solutionmanager_.solutionmanager.md), `config?`: [Config](../interfaces/_api_cds_webapi_cdswebapi_.cdswebapi.config.md), `solution?`: any, `solutionFile?`: Uri, `options?`: [ExportSolutionOptions](_commands_cs_cds_deployment_exportsolution_.md#exportsolutionoptions), `inform`: boolean): *Promise‹Uri‹››*

Defined in src/commands/cs.cds.deployment.exportSolution.ts:36

This command can be invoked by the by either the file explorer view or the Dynamics TreeView
and can compare two copies of a web resource.

**`export`** run command function

**Parameters:**

Name | Type | Default |
------ | ------ | ------ |
`this` | [SolutionManager](../classes/_components_solutions_solutionmanager_.solutionmanager.md) | - |
`config?` | [Config](../interfaces/_api_cds_webapi_cdswebapi_.cdswebapi.config.md) | - |
`solution?` | any | - |
`solutionFile?` | Uri | - |
`options?` | [ExportSolutionOptions](_commands_cs_cds_deployment_exportsolution_.md#exportsolutionoptions) | - |
`inform` | boolean | true |

**Returns:** *Promise‹Uri‹››*

void
