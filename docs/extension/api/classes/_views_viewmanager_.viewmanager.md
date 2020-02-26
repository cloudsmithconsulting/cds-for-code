---
id: "_views_viewmanager_.viewmanager"
title: "ViewManager"
sidebar_label: "ViewManager"
---

[cds-for-code](../index.md) › [Globals](../globals.md) › ["views/ViewManager"](../modules/_views_viewmanager_.md) › [ViewManager](_views_viewmanager_.viewmanager.md)

## Hierarchy

* **ViewManager**

## Index

### Methods

* [editConnection](_views_viewmanager_.viewmanager.md#static-editconnection)
* [openConnection](_views_viewmanager_.viewmanager.md#static-openconnection)
* [openJsonInspector](_views_viewmanager_.viewmanager.md#static-openjsoninspector)
* [openNewWorkspaceWelcome](_views_viewmanager_.viewmanager.md#static-opennewworkspacewelcome)
* [openPluginStep](_views_viewmanager_.viewmanager.md#static-openpluginstep)
* [openPluginStepImage](_views_viewmanager_.viewmanager.md#static-openpluginstepimage)
* [openSvcUtilConfiguration](_views_viewmanager_.viewmanager.md#static-opensvcutilconfiguration)

## Methods

### `Static` editConnection

▸ **editConnection**(`config`: [Config](../interfaces/_api_cds_webapi_cdswebapi_.cdswebapi.config.md)): *Promise‹[View](_core_webui_view_.view.md)›*

Defined in src/views/ViewManager.ts:20

**Parameters:**

Name | Type |
------ | ------ |
`config` | [Config](../interfaces/_api_cds_webapi_cdswebapi_.cdswebapi.config.md) |

**Returns:** *Promise‹[View](_core_webui_view_.view.md)›*

___

### `Static` openConnection

▸ **openConnection**(): *Promise‹[View](_core_webui_view_.view.md)›*

Defined in src/views/ViewManager.ts:15

**Returns:** *Promise‹[View](_core_webui_view_.view.md)›*

___

### `Static` openJsonInspector

▸ **openJsonInspector**(`config`: [Config](../interfaces/_api_cds_webapi_cdswebapi_.cdswebapi.config.md), `itemType`: string, `item`: any): *Promise‹any›*

Defined in src/views/ViewManager.ts:35

**Parameters:**

Name | Type |
------ | ------ |
`config` | [Config](../interfaces/_api_cds_webapi_cdswebapi_.cdswebapi.config.md) |
`itemType` | string |
`item` | any |

**Returns:** *Promise‹any›*

___

### `Static` openNewWorkspaceWelcome

▸ **openNewWorkspaceWelcome**(`config?`: [Config](../interfaces/_api_cds_webapi_cdswebapi_.cdswebapi.config.md)): *Promise‹[View](_core_webui_view_.view.md)›*

Defined in src/views/ViewManager.ts:40

**Parameters:**

Name | Type |
------ | ------ |
`config?` | [Config](../interfaces/_api_cds_webapi_cdswebapi_.cdswebapi.config.md) |

**Returns:** *Promise‹[View](_core_webui_view_.view.md)›*

___

### `Static` openPluginStep

▸ **openPluginStep**(`pluginAssemblyId`: string, `step?`: any, `config?`: [Config](../interfaces/_api_cds_webapi_cdswebapi_.cdswebapi.config.md), `treeEntry?`: [CdsTreeEntry](_views_cs_cds_viewcontainers_cdsexplorer_.cdstreeentry.md)): *Promise‹[View](_core_webui_view_.view.md)›*

Defined in src/views/ViewManager.ts:25

**Parameters:**

Name | Type |
------ | ------ |
`pluginAssemblyId` | string |
`step?` | any |
`config?` | [Config](../interfaces/_api_cds_webapi_cdswebapi_.cdswebapi.config.md) |
`treeEntry?` | [CdsTreeEntry](_views_cs_cds_viewcontainers_cdsexplorer_.cdstreeentry.md) |

**Returns:** *Promise‹[View](_core_webui_view_.view.md)›*

___

### `Static` openPluginStepImage

▸ **openPluginStepImage**(`sdkmessageprocessingstepid`: string, `pluginStepImage?`: any, `config?`: [Config](../interfaces/_api_cds_webapi_cdswebapi_.cdswebapi.config.md), `treeEntry?`: [CdsTreeEntry](_views_cs_cds_viewcontainers_cdsexplorer_.cdstreeentry.md)): *Promise‹[View](_core_webui_view_.view.md)›*

Defined in src/views/ViewManager.ts:30

**Parameters:**

Name | Type |
------ | ------ |
`sdkmessageprocessingstepid` | string |
`pluginStepImage?` | any |
`config?` | [Config](../interfaces/_api_cds_webapi_cdswebapi_.cdswebapi.config.md) |
`treeEntry?` | [CdsTreeEntry](_views_cs_cds_viewcontainers_cdsexplorer_.cdstreeentry.md) |

**Returns:** *Promise‹[View](_core_webui_view_.view.md)›*

___

### `Static` openSvcUtilConfiguration

▸ **openSvcUtilConfiguration**(`config?`: [Config](../interfaces/_api_cds_webapi_cdswebapi_.cdswebapi.config.md), `viewModel?`: any): *Promise‹[View](_core_webui_view_.view.md)›*

Defined in src/views/ViewManager.ts:45

**Parameters:**

Name | Type |
------ | ------ |
`config?` | [Config](../interfaces/_api_cds_webapi_cdswebapi_.cdswebapi.config.md) |
`viewModel?` | any |

**Returns:** *Promise‹[View](_core_webui_view_.view.md)›*
