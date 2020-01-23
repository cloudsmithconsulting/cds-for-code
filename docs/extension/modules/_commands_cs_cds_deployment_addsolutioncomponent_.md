---
id: "_commands_cs_cds_deployment_addsolutioncomponent_"
title: "commands/cs.cds.deployment.addSolutionComponent"
sidebar_label: "commands/cs.cds.deployment.addSolutionComponent"
---

[cds-for-code](../index.md) › [Globals](../globals.md) › ["commands/cs.cds.deployment.addSolutionComponent"](_commands_cs_cds_deployment_addsolutioncomponent_.md)

## Index

### Functions

* [run](_commands_cs_cds_deployment_addsolutioncomponent_.md#run)

## Functions

###  run

▸ **run**(`config?`: [Config](../interfaces/_api_cds_webapi_cdswebapi_.cdswebapi.config.md), `solution?`: any, `componentId?`: string, `componentType?`: [SolutionComponent](../enums/_api_cdssolutions_.cdssolutions.solutioncomponent.md), `addRequiredComponents?`: boolean, `doNotIncludeSubcomponents?`: boolean, `componentSettings?`: string): *Promise‹any›*

Defined in src/commands/cs.cds.deployment.addSolutionComponent.ts:17

This command can be invoked by the Command Palette or the Dynamics TreeView and adds a solution component to a solution.

**`export`** run command function

**Parameters:**

Name | Type |
------ | ------ |
`config?` | [Config](../interfaces/_api_cds_webapi_cdswebapi_.cdswebapi.config.md) |
`solution?` | any |
`componentId?` | string |
`componentType?` | [SolutionComponent](../enums/_api_cdssolutions_.cdssolutions.solutioncomponent.md) |
`addRequiredComponents?` | boolean |
`doNotIncludeSubcomponents?` | boolean |
`componentSettings?` | string |

**Returns:** *Promise‹any›*

void
