[cds-for-code](../README.md) › [Globals](../globals.md) › ["commands/cs.cds.deployment.createWebResource"](_commands_cs_cds_deployment_createwebresource_.md)

# External module: "commands/cs.cds.deployment.createWebResource"

## Index

### Functions

* [run](_commands_cs_cds_deployment_createwebresource_.md#run)

## Functions

###  run

▸ **run**(`config?`: [Config](../interfaces/_api_cds_webapi_cdswebapi_.cdswebapi.config.md), `solutionId?`: string, `webResource?`: any, `fileUri?`: Uri, `defaultName`: string, `inform`: boolean): *Promise‹object›*

Defined in src/commands/cs.cds.deployment.createWebResource.ts:22

This command can be invoked by the by either the file explorer view or the Dynamics TreeView
and can compare two copies of a web resource.

**`export`** run command function

**Parameters:**

Name | Type | Default |
------ | ------ | ------ |
`config?` | [Config](../interfaces/_api_cds_webapi_cdswebapi_.cdswebapi.config.md) | - |
`solutionId?` | string | - |
`webResource?` | any | - |
`fileUri?` | Uri | - |
`defaultName` | string | "" |
`inform` | boolean | true |

**Returns:** *Promise‹object›*

void
