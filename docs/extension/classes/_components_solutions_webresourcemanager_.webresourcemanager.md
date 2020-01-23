---
id: "_components_solutions_webresourcemanager_.webresourcemanager"
title: "WebResourceManager"
sidebar_label: "WebResourceManager"
---

[cds-for-code](../index.md) › [Globals](../globals.md) › ["components/Solutions/WebResourceManager"](../modules/_components_solutions_webresourcemanager_.md) › [WebResourceManager](_components_solutions_webresourcemanager_.webresourcemanager.md)

## Hierarchy

* **WebResourceManager**

## Index

### Methods

* [compareWebResource](_components_solutions_webresourcemanager_.webresourcemanager.md#comparewebresource)
* [createWebResource](_components_solutions_webresourcemanager_.webresourcemanager.md#createwebresource)
* [getSolutionMapping](_components_solutions_webresourcemanager_.webresourcemanager.md#getsolutionmapping)
* [getWebResourceDetails](_components_solutions_webresourcemanager_.webresourcemanager.md#getwebresourcedetails)
* [getWebResourceType](_components_solutions_webresourcemanager_.webresourcemanager.md#getwebresourcetype)
* [packWebResource](_components_solutions_webresourcemanager_.webresourcemanager.md#packwebresource)
* [unpackWebResource](_components_solutions_webresourcemanager_.webresourcemanager.md#unpackwebresource)
* [upsertWebResource](_components_solutions_webresourcemanager_.webresourcemanager.md#upsertwebresource)
* [writeDataXmlFile](_components_solutions_webresourcemanager_.webresourcemanager.md#writedataxmlfile)
* [createWebResourceFromUri](_components_solutions_webresourcemanager_.webresourcemanager.md#static-createwebresourcefromuri)
* [packWebResourceFromUri](_components_solutions_webresourcemanager_.webresourcemanager.md#static-packwebresourcefromuri)

## Methods

###  compareWebResource

▸ **compareWebResource**(`defaultUri?`: Uri): *Promise‹void›*

Defined in src/components/Solutions/WebResourceManager.ts:50

**Parameters:**

Name | Type |
------ | ------ |
`defaultUri?` | Uri |

**Returns:** *Promise‹void›*

___

###  createWebResource

▸ **createWebResource**(`config?`: [Config](../interfaces/_api_cds_webapi_cdswebapi_.cdswebapi.config.md), `solutionId?`: string, `webResource?`: any, `fileUri?`: Uri, `defaultName`: string, `inform`: boolean): *Promise‹any›*

Defined in src/components/Solutions/WebResourceManager.ts:45

**Parameters:**

Name | Type | Default |
------ | ------ | ------ |
`config?` | [Config](../interfaces/_api_cds_webapi_cdswebapi_.cdswebapi.config.md) | - |
`solutionId?` | string | - |
`webResource?` | any | - |
`fileUri?` | Uri | - |
`defaultName` | string | "" |
`inform` | boolean | true |

**Returns:** *Promise‹any›*

___

###  getSolutionMapping

▸ **getSolutionMapping**(`fsPath?`: string, `orgId?`: string, `solutionId?`: string): *Promise‹[SolutionWorkspaceMapping](_components_solutions_solutionworkspacemapping_.solutionworkspacemapping.md)›*

Defined in src/components/Solutions/WebResourceManager.ts:64

**Parameters:**

Name | Type |
------ | ------ |
`fsPath?` | string |
`orgId?` | string |
`solutionId?` | string |

**Returns:** *Promise‹[SolutionWorkspaceMapping](_components_solutions_solutionworkspacemapping_.solutionworkspacemapping.md)›*

___

###  getWebResourceDetails

▸ **getWebResourceDetails**(`fsPath`: string | undefined): *Promise‹any›*

Defined in src/components/Solutions/WebResourceManager.ts:90

**Parameters:**

Name | Type |
------ | ------ |
`fsPath` | string &#124; undefined |

**Returns:** *Promise‹any›*

___

###  getWebResourceType

▸ **getWebResourceType**(`extension`: string): *number | undefined*

Defined in src/components/Solutions/WebResourceManager.ts:77

**Parameters:**

Name | Type |
------ | ------ |
`extension` | string |

**Returns:** *number | undefined*

___

###  packWebResource

▸ **packWebResource**(`config?`: [Config](../interfaces/_api_cds_webapi_cdswebapi_.cdswebapi.config.md), `solution?`: any, `webResource?`: any, `fileUri?`: Uri, `inform`: boolean): *Promise‹void›*

Defined in src/components/Solutions/WebResourceManager.ts:55

**Parameters:**

Name | Type | Default |
------ | ------ | ------ |
`config?` | [Config](../interfaces/_api_cds_webapi_cdswebapi_.cdswebapi.config.md) | - |
`solution?` | any | - |
`webResource?` | any | - |
`fileUri?` | Uri | - |
`inform` | boolean | true |

**Returns:** *Promise‹void›*

___

###  unpackWebResource

▸ **unpackWebResource**(`config?`: [Config](../interfaces/_api_cds_webapi_cdswebapi_.cdswebapi.config.md), `webResource?`: any, `fileUri?`: Uri, `autoOpen`: boolean): *Promise‹void›*

Defined in src/components/Solutions/WebResourceManager.ts:60

**Parameters:**

Name | Type | Default |
------ | ------ | ------ |
`config?` | [Config](../interfaces/_api_cds_webapi_cdswebapi_.cdswebapi.config.md) | - |
`webResource?` | any | - |
`fileUri?` | Uri | - |
`autoOpen` | boolean | false |

**Returns:** *Promise‹void›*

___

###  upsertWebResource

▸ **upsertWebResource**(`config`: [Config](../interfaces/_api_cds_webapi_cdswebapi_.cdswebapi.config.md), `webResource`: any, `solution?`: any): *Promise‹any›*

Defined in src/components/Solutions/WebResourceManager.ts:118

**Parameters:**

Name | Type |
------ | ------ |
`config` | [Config](../interfaces/_api_cds_webapi_cdswebapi_.cdswebapi.config.md) |
`webResource` | any |
`solution?` | any |

**Returns:** *Promise‹any›*

___

###  writeDataXmlFile

▸ **writeDataXmlFile**(`map`: [SolutionWorkspaceMapping](_components_solutions_solutionworkspacemapping_.solutionworkspacemapping.md), `webResource`: any, `fsPath`: string, `updateCustomizationsFile`: boolean): *Promise‹void›*

Defined in src/components/Solutions/WebResourceManager.ts:140

**Parameters:**

Name | Type |
------ | ------ |
`map` | [SolutionWorkspaceMapping](_components_solutions_solutionworkspacemapping_.solutionworkspacemapping.md) |
`webResource` | any |
`fsPath` | string |
`updateCustomizationsFile` | boolean |

**Returns:** *Promise‹void›*

___

### `Static` createWebResourceFromUri

▸ **createWebResourceFromUri**(`uri?`: Uri): *Promise‹any›*

Defined in src/components/Solutions/WebResourceManager.ts:27

**Parameters:**

Name | Type |
------ | ------ |
`uri?` | Uri |

**Returns:** *Promise‹any›*

___

### `Static` packWebResourceFromUri

▸ **packWebResourceFromUri**(`uri?`: Uri): *Promise‹any›*

Defined in src/components/Solutions/WebResourceManager.ts:36

**Parameters:**

Name | Type |
------ | ------ |
`uri?` | Uri |

**Returns:** *Promise‹any›*
