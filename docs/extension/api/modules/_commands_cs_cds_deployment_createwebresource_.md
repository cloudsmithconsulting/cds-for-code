---
id: "_commands_cs_cds_deployment_createwebresource_"
title: "commands/cs.cds.deployment.createWebResource"
sidebar_label: "commands/cs.cds.deployment.createWebResource"
---

[cds-for-code](../index.md) › [Globals](../globals.md) › ["commands/cs.cds.deployment.createWebResource"](_commands_cs_cds_deployment_createwebresource_.md)

## Index

### Functions

* [run](_commands_cs_cds_deployment_createwebresource_.md#run)

## Functions

###  run

▸ **run**(`this`: [WebResourceManager](../classes/_components_solutions_webresourcemanager_.webresourcemanager.md), `config?`: [Config](../interfaces/_api_cds_webapi_cdswebapi_.cdswebapi.config.md), `solutionId?`: string, `webResource?`: any, `fileUri?`: Uri, `defaultName`: string, `inform`: boolean): *Promise‹object›*

Defined in src/commands/cs.cds.deployment.createWebResource.ts:23

This command can be invoked by the by either the file explorer view or the Dynamics TreeView
and can compare two copies of a web resource.

**`export`** run command function

**Parameters:**

Name | Type | Default |
------ | ------ | ------ |
`this` | [WebResourceManager](../classes/_components_solutions_webresourcemanager_.webresourcemanager.md) | - |
`config?` | [Config](../interfaces/_api_cds_webapi_cdswebapi_.cdswebapi.config.md) | - |
`solutionId?` | string | - |
`webResource?` | any | - |
`fileUri?` | Uri | - |
`defaultName` | string | "" |
`inform` | boolean | true |

**Returns:** *Promise‹object›*

void
