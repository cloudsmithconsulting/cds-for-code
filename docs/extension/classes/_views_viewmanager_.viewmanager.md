[cds-for-code](../README.md) › [Globals](../globals.md) › ["views/ViewManager"](../modules/_views_viewmanager_.md) › [ViewManager](_views_viewmanager_.viewmanager.md)

# Class: ViewManager

## Hierarchy

* **ViewManager**

## Index

### Methods

* [editConnection](_views_viewmanager_.viewmanager.md#editconnection)
* [openConnection](_views_viewmanager_.viewmanager.md#openconnection)
* [openJsonInspector](_views_viewmanager_.viewmanager.md#openjsoninspector)
* [openNewWorkspaceWelcome](_views_viewmanager_.viewmanager.md#opennewworkspacewelcome)
* [openPluginStep](_views_viewmanager_.viewmanager.md#openpluginstep)
* [openPluginStepImage](_views_viewmanager_.viewmanager.md#openpluginstepimage)
* [openSvcUtilConfiguration](_views_viewmanager_.viewmanager.md#opensvcutilconfiguration)

## Methods

###  editConnection

▸ **editConnection**(`config`: [Config](../interfaces/_api_cds_webapi_cdswebapi_.cdswebapi.config.md)): *Promise‹[View](_core_webui_view_.view.md)›*

Defined in src/views/ViewManager.ts:22

**Parameters:**

Name | Type |
------ | ------ |
`config` | [Config](../interfaces/_api_cds_webapi_cdswebapi_.cdswebapi.config.md) |

**Returns:** *Promise‹[View](_core_webui_view_.view.md)›*

___

###  openConnection

▸ **openConnection**(): *Promise‹[View](_core_webui_view_.view.md)›*

Defined in src/views/ViewManager.ts:17

**Returns:** *Promise‹[View](_core_webui_view_.view.md)›*

___

###  openJsonInspector

▸ **openJsonInspector**(`item`: any): *Promise‹any›*

Defined in src/views/ViewManager.ts:37

**Parameters:**

Name | Type |
------ | ------ |
`item` | any |

**Returns:** *Promise‹any›*

___

###  openNewWorkspaceWelcome

▸ **openNewWorkspaceWelcome**(`config?`: [Config](../interfaces/_api_cds_webapi_cdswebapi_.cdswebapi.config.md)): *Promise‹[View](_core_webui_view_.view.md)›*

Defined in src/views/ViewManager.ts:42

**Parameters:**

Name | Type |
------ | ------ |
`config?` | [Config](../interfaces/_api_cds_webapi_cdswebapi_.cdswebapi.config.md) |

**Returns:** *Promise‹[View](_core_webui_view_.view.md)›*

___

###  openPluginStep

▸ **openPluginStep**(`context`: ExtensionContext, `pluginAssemblyId`: string, `config?`: [Config](../interfaces/_api_cds_webapi_cdswebapi_.cdswebapi.config.md), `step?`: any): *Promise‹[View](_core_webui_view_.view.md)›*

Defined in src/views/ViewManager.ts:27

**Parameters:**

Name | Type |
------ | ------ |
`context` | ExtensionContext |
`pluginAssemblyId` | string |
`config?` | [Config](../interfaces/_api_cds_webapi_cdswebapi_.cdswebapi.config.md) |
`step?` | any |

**Returns:** *Promise‹[View](_core_webui_view_.view.md)›*

___

###  openPluginStepImage

▸ **openPluginStepImage**(`context`: ExtensionContext, `sdkmessageprocessingstepid`: string, `pluginStepImage`: any, `config?`: [Config](../interfaces/_api_cds_webapi_cdswebapi_.cdswebapi.config.md)): *Promise‹[View](_core_webui_view_.view.md)›*

Defined in src/views/ViewManager.ts:32

**Parameters:**

Name | Type |
------ | ------ |
`context` | ExtensionContext |
`sdkmessageprocessingstepid` | string |
`pluginStepImage` | any |
`config?` | [Config](../interfaces/_api_cds_webapi_cdswebapi_.cdswebapi.config.md) |

**Returns:** *Promise‹[View](_core_webui_view_.view.md)›*

___

###  openSvcUtilConfiguration

▸ **openSvcUtilConfiguration**(`config?`: [Config](../interfaces/_api_cds_webapi_cdswebapi_.cdswebapi.config.md)): *Promise‹[View](_core_webui_view_.view.md)›*

Defined in src/views/ViewManager.ts:47

**Parameters:**

Name | Type |
------ | ------ |
`config?` | [Config](../interfaces/_api_cds_webapi_cdswebapi_.cdswebapi.config.md) |

**Returns:** *Promise‹[View](_core_webui_view_.view.md)›*
