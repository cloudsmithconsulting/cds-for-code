---
id: "_views_cs_cds_viewcontainers_cdsexplorer_.cdstreeentry"
title: "CdsTreeEntry"
sidebar_label: "CdsTreeEntry"
---

[cds-for-code](../index.md) › [Globals](../globals.md) › ["views/cs.cds.viewContainers.cdsExplorer"](../modules/_views_cs_cds_viewcontainers_cdsexplorer_.md) › [CdsTreeEntry](_views_cs_cds_viewcontainers_cdsexplorer_.cdstreeentry.md)

Represents an entry that is dispalbed in the CdsexplorerView

**`class`** CdsTreeEntry

**`extends`** {vscode.TreeItem}

## Hierarchy

* TreeItem

  ↳ **CdsTreeEntry**

## Index

### Constructors

* [constructor](_views_cs_cds_viewcontainers_cdsexplorer_.cdstreeentry.md#constructor)

### Properties

* [collapsibleState](_views_cs_cds_viewcontainers_cdsexplorer_.cdstreeentry.md#optional-collapsiblestate)
* [command](_views_cs_cds_viewcontainers_cdsexplorer_.cdstreeentry.md#optional-command)
* [configId](_views_cs_cds_viewcontainers_cdsexplorer_.cdstreeentry.md#configid)
* [context](_views_cs_cds_viewcontainers_cdsexplorer_.cdstreeentry.md#optional-context)
* [contextValue](_views_cs_cds_viewcontainers_cdsexplorer_.cdstreeentry.md#optional-contextvalue)
* [iconPath](_views_cs_cds_viewcontainers_cdsexplorer_.cdstreeentry.md#optional-iconpath)
* [id](_views_cs_cds_viewcontainers_cdsexplorer_.cdstreeentry.md#id)
* [itemType](_views_cs_cds_viewcontainers_cdsexplorer_.cdstreeentry.md#itemtype)
* [label](_views_cs_cds_viewcontainers_cdsexplorer_.cdstreeentry.md#optional-label)
* [resourceUri](_views_cs_cds_viewcontainers_cdsexplorer_.cdstreeentry.md#optional-resourceuri)
* [subtext](_views_cs_cds_viewcontainers_cdsexplorer_.cdstreeentry.md#optional-subtext)
* [canAddEntryTypes](_views_cs_cds_viewcontainers_cdsexplorer_.cdstreeentry.md#static-private-canaddentrytypes)
* [canAddToSolutionEntryTypes](_views_cs_cds_viewcontainers_cdsexplorer_.cdstreeentry.md#static-private-canaddtosolutionentrytypes)
* [canCreateCrmSvcUtilConfigTypes](_views_cs_cds_viewcontainers_cdsexplorer_.cdstreeentry.md#static-private-cancreatecrmsvcutilconfigtypes)
* [canDeleteEntryTypes](_views_cs_cds_viewcontainers_cdsexplorer_.cdstreeentry.md#static-private-candeleteentrytypes)
* [canEditEntryTypes](_views_cs_cds_viewcontainers_cdsexplorer_.cdstreeentry.md#static-private-caneditentrytypes)
* [canExportSolutionTypes](_views_cs_cds_viewcontainers_cdsexplorer_.cdstreeentry.md#static-private-canexportsolutiontypes)
* [canInsertDataTypes](_views_cs_cds_viewcontainers_cdsexplorer_.cdstreeentry.md#static-private-caninsertdatatypes)
* [canInspectEntryTypes](_views_cs_cds_viewcontainers_cdsexplorer_.cdstreeentry.md#static-private-caninspectentrytypes)
* [canMoveSolutionEntryTypes](_views_cs_cds_viewcontainers_cdsexplorer_.cdstreeentry.md#static-private-canmovesolutionentrytypes)
* [canOpenInAppEntryTypes](_views_cs_cds_viewcontainers_cdsexplorer_.cdstreeentry.md#static-private-canopeninappentrytypes)
* [canOpenInBrowserEntryTypes](_views_cs_cds_viewcontainers_cdsexplorer_.cdstreeentry.md#static-private-canopeninbrowserentrytypes)
* [canOpenInEditorEntryTypes](_views_cs_cds_viewcontainers_cdsexplorer_.cdstreeentry.md#static-private-canopenineditorentrytypes)
* [canRefreshEntryTypes](_views_cs_cds_viewcontainers_cdsexplorer_.cdstreeentry.md#static-private-canrefreshentrytypes)
* [canRemoveFromSolutionEntryTypes](_views_cs_cds_viewcontainers_cdsexplorer_.cdstreeentry.md#static-private-canremovefromsolutionentrytypes)
* [canUnpackSolutionEntryTypes](_views_cs_cds_viewcontainers_cdsexplorer_.cdstreeentry.md#static-private-canunpacksolutionentrytypes)

### Accessors

* [capabilities](_views_cs_cds_viewcontainers_cdsexplorer_.cdstreeentry.md#capabilities)
* [config](_views_cs_cds_viewcontainers_cdsexplorer_.cdstreeentry.md#config)
* [description](_views_cs_cds_viewcontainers_cdsexplorer_.cdstreeentry.md#description)
* [folder](_views_cs_cds_viewcontainers_cdsexplorer_.cdstreeentry.md#folder)
* [parent](_views_cs_cds_viewcontainers_cdsexplorer_.cdstreeentry.md#parent)
* [solution](_views_cs_cds_viewcontainers_cdsexplorer_.cdstreeentry.md#solution)
* [solutionId](_views_cs_cds_viewcontainers_cdsexplorer_.cdstreeentry.md#solutionid)
* [solutionIdPath](_views_cs_cds_viewcontainers_cdsexplorer_.cdstreeentry.md#solutionidpath)
* [solutionMapping](_views_cs_cds_viewcontainers_cdsexplorer_.cdstreeentry.md#solutionmapping)
* [tooltip](_views_cs_cds_viewcontainers_cdsexplorer_.cdstreeentry.md#tooltip)

### Methods

* [addCapability](_views_cs_cds_viewcontainers_cdsexplorer_.cdstreeentry.md#private-addcapability)
* [createChildItem](_views_cs_cds_viewcontainers_cdsexplorer_.cdstreeentry.md#createchilditem)

## Constructors

###  constructor

\+ **new CdsTreeEntry**(`parentItem`: [CdsTreeEntry](_views_cs_cds_viewcontainers_cdsexplorer_.cdstreeentry.md), `itemType`: [CdsExplorerEntryType](../modules/_views_cs_cds_viewcontainers_cdsexplorer_.md#cdsexplorerentrytype), `id`: string, `label`: string, `subtext?`: string, `collapsibleState`: TreeItemCollapsibleState, `context?`: any): *[CdsTreeEntry](_views_cs_cds_viewcontainers_cdsexplorer_.cdstreeentry.md)*

*Overrides void*

Defined in src/views/cs.cds.viewContainers.cdsExplorer.ts:1031

Creates an instance of CdsTreeEntry.

**`memberof`** CdsTreeEntry

**Parameters:**

Name | Type | Default | Description |
------ | ------ | ------ | ------ |
`parentItem` | [CdsTreeEntry](_views_cs_cds_viewcontainers_cdsexplorer_.cdstreeentry.md) | - | The parent item (if any) the contains the tree view entry.  Only is null on root entries. |
`itemType` | [CdsExplorerEntryType](../modules/_views_cs_cds_viewcontainers_cdsexplorer_.md#cdsexplorerentrytype) | - | The item type |
`id` | string | - | The identifier of the item (can be segmented by "/") |
`label` | string | - | A descriptive label that shows next to the icon for the item |
`subtext?` | string | - | - |
`collapsibleState` | TreeItemCollapsibleState | vscode.TreeItemCollapsibleState.None | - |
`context?` | any | - | - |

**Returns:** *[CdsTreeEntry](_views_cs_cds_viewcontainers_cdsexplorer_.cdstreeentry.md)*

## Properties

### `Optional` collapsibleState

• **collapsibleState**? : *TreeItemCollapsibleState*

*Inherited from [CdsTreeEntry](_views_cs_cds_viewcontainers_cdsexplorer_.cdstreeentry.md).[collapsibleState](_views_cs_cds_viewcontainers_cdsexplorer_.cdstreeentry.md#optional-collapsiblestate)*

Defined in node_modules/@types/vscode/index.d.ts:7408

[TreeItemCollapsibleState](#TreeItemCollapsibleState) of the tree item.

___

### `Optional` command

• **command**? : *Command*

*Inherited from [CdsTreeEntry](_views_cs_cds_viewcontainers_cdsexplorer_.cdstreeentry.md).[command](_views_cs_cds_viewcontainers_cdsexplorer_.cdstreeentry.md#optional-command)*

Defined in node_modules/@types/vscode/index.d.ts:7403

The [command](#Command) that should be executed when the tree item is selected.

___

###  configId

• **configId**: *string*

Defined in src/views/cs.cds.viewContainers.cdsExplorer.ts:1096

Represents the identifier for the connection that created the tree entry.  This can be used
to lookup the configuration for the connection from the CdsExplorerView.connections property.

**`type`** {string} identifier of the connection used

**`memberof`** CdsTreeEntry

___

### `Optional` context

• **context**? : *any*

Defined in src/views/cs.cds.viewContainers.cdsExplorer.ts:1051

___

### `Optional` contextValue

• **contextValue**? : *string*

*Inherited from [CdsTreeEntry](_views_cs_cds_viewcontainers_cdsexplorer_.cdstreeentry.md).[contextValue](_views_cs_cds_viewcontainers_cdsexplorer_.cdstreeentry.md#optional-contextvalue)*

Defined in node_modules/@types/vscode/index.d.ts:7428

Context value of the tree item. This can be used to contribute item specific actions in the tree.
For example, a tree item is given a context value as `folder`. When contributing actions to `view/item/context`
using `menus` extension point, you can specify context value for key `viewItem` in `when` expression like `viewItem == folder`.
```
	"contributes": {
		"menus": {
			"view/item/context": [
				{
					"command": "extension.deleteFolder",
					"when": "viewItem == folder"
				}
			]
		}
	}
```
This will show action `extension.deleteFolder` only for items with `contextValue` is `folder`.

___

### `Optional` iconPath

• **iconPath**? : *string | Uri | object | ThemeIcon*

*Inherited from [CdsTreeEntry](_views_cs_cds_viewcontainers_cdsexplorer_.cdstreeentry.md).[iconPath](_views_cs_cds_viewcontainers_cdsexplorer_.cdstreeentry.md#optional-iconpath)*

Defined in node_modules/@types/vscode/index.d.ts:7379

The icon path or [ThemeIcon](#ThemeIcon) for the tree item.
When `falsy`, [Folder Theme Icon](#ThemeIcon.Folder) is assigned, if item is collapsible otherwise [File Theme Icon](#ThemeIcon.File).
When a [ThemeIcon](#ThemeIcon) is specified, icon is derived from the current file icon theme for the specified theme icon using [resourceUri](#TreeItem.resourceUri) (if provided).

___

###  id

• **id**: *string*

*Overrides void*

Defined in src/views/cs.cds.viewContainers.cdsExplorer.ts:1047

The identifier of the item (can be segmented by "/")

___

###  itemType

• **itemType**: *[CdsExplorerEntryType](../modules/_views_cs_cds_viewcontainers_cdsexplorer_.md#cdsexplorerentrytype)*

Defined in src/views/cs.cds.viewContainers.cdsExplorer.ts:1046

The item type

___

### `Optional` label

• **label**? : *string*

*Inherited from [CdsTreeEntry](_views_cs_cds_viewcontainers_cdsexplorer_.cdstreeentry.md).[label](_views_cs_cds_viewcontainers_cdsexplorer_.cdstreeentry.md#optional-label)*

Defined in node_modules/@types/vscode/index.d.ts:7365

A human-readable string describing this item. When `falsy`, it is derived from [resourceUri](#TreeItem.resourceUri).

___

### `Optional` resourceUri

• **resourceUri**? : *Uri*

*Inherited from [CdsTreeEntry](_views_cs_cds_viewcontainers_cdsexplorer_.cdstreeentry.md).[resourceUri](_views_cs_cds_viewcontainers_cdsexplorer_.cdstreeentry.md#optional-resourceuri)*

Defined in node_modules/@types/vscode/index.d.ts:7393

The [uri](#Uri) of the resource representing this item.

Will be used to derive the [label](#TreeItem.label), when it is not provided.
Will be used to derive the icon from current icon theme, when [iconPath](#TreeItem.iconPath) has [ThemeIcon](#ThemeIcon) value.

___

### `Optional` subtext

• **subtext**? : *string*

Defined in src/views/cs.cds.viewContainers.cdsExplorer.ts:1049

___

### `Static` `Private` canAddEntryTypes

▪ **canAddEntryTypes**: *[CdsExplorerEntryType](../modules/_views_cs_cds_viewcontainers_cdsexplorer_.md#cdsexplorerentrytype)[]* = [ "Applications", "Solutions", "Plugins", "Entities", "OptionSets", "WebResources", "Processes", "Attributes", "Forms", "Views", "Charts", "Dashboards", "Keys", "Relationships", "Entries", "PluginType", "PluginStep" ]

Defined in src/views/cs.cds.viewContainers.cdsExplorer.ts:1018

___

### `Static` `Private` canAddToSolutionEntryTypes

▪ **canAddToSolutionEntryTypes**: *[CdsExplorerEntryType](../modules/_views_cs_cds_viewcontainers_cdsexplorer_.md#cdsexplorerentrytype)[]* = [ "Plugin", "Entity", "OptionSet", "WebResource", "Process", "Form", "View", "Chart", "Dashboard" ]

Defined in src/views/cs.cds.viewContainers.cdsExplorer.ts:1030

___

### `Static` `Private` canCreateCrmSvcUtilConfigTypes

▪ **canCreateCrmSvcUtilConfigTypes**: *[CdsExplorerEntryType](../modules/_views_cs_cds_viewcontainers_cdsexplorer_.md#cdsexplorerentrytype)[]* = [ "Entities" ]

Defined in src/views/cs.cds.viewContainers.cdsExplorer.ts:1019

___

### `Static` `Private` canDeleteEntryTypes

▪ **canDeleteEntryTypes**: *[CdsExplorerEntryType](../modules/_views_cs_cds_viewcontainers_cdsexplorer_.md#cdsexplorerentrytype)[]* = [ "Connection", "PluginStep", "PluginStepImage" ]

Defined in src/views/cs.cds.viewContainers.cdsExplorer.ts:1021

___

### `Static` `Private` canEditEntryTypes

▪ **canEditEntryTypes**: *[CdsExplorerEntryType](../modules/_views_cs_cds_viewcontainers_cdsexplorer_.md#cdsexplorerentrytype)[]* = [ "Connection", "Application", "Solution", "Entity", "OptionSet", "WebResource", "Process", "Attribute", "Form", "View", "Chart", "Dashboard", "Key", "OneToManyRelationship", "ManyToOneRelationship", "ManyToManyRelationship", "Entry", "PluginStep", "PluginStepImage" ]

Defined in src/views/cs.cds.viewContainers.cdsExplorer.ts:1020

___

### `Static` `Private` canExportSolutionTypes

▪ **canExportSolutionTypes**: *[CdsExplorerEntryType](../modules/_views_cs_cds_viewcontainers_cdsexplorer_.md#cdsexplorerentrytype)[]* = [ "Solution" ]

Defined in src/views/cs.cds.viewContainers.cdsExplorer.ts:1022

___

### `Static` `Private` canInsertDataTypes

▪ **canInsertDataTypes**: *[CdsExplorerEntryType](../modules/_views_cs_cds_viewcontainers_cdsexplorer_.md#cdsexplorerentrytype)[]* = [ "Entity" ]

Defined in src/views/cs.cds.viewContainers.cdsExplorer.ts:1023

___

### `Static` `Private` canInspectEntryTypes

▪ **canInspectEntryTypes**: *[CdsExplorerEntryType](../modules/_views_cs_cds_viewcontainers_cdsexplorer_.md#cdsexplorerentrytype)[]* = [ "Solution", "Entity", "OptionSet", "WebResource", "Process", "Attribute", "Form", "View", "Chart", "Dashboard", "Key", "OneToManyRelationship", "ManyToOneRelationship", "ManyToManyRelationship", "Entry", "PluginStep" ]

Defined in src/views/cs.cds.viewContainers.cdsExplorer.ts:1024

___

### `Static` `Private` canMoveSolutionEntryTypes

▪ **canMoveSolutionEntryTypes**: *[CdsExplorerEntryType](../modules/_views_cs_cds_viewcontainers_cdsexplorer_.md#cdsexplorerentrytype)[]* = [ "Solution" ]

Defined in src/views/cs.cds.viewContainers.cdsExplorer.ts:1026

___

### `Static` `Private` canOpenInAppEntryTypes

▪ **canOpenInAppEntryTypes**: *[CdsExplorerEntryType](../modules/_views_cs_cds_viewcontainers_cdsexplorer_.md#cdsexplorerentrytype)[]* = [ "View", "Entity", "Dashboard" ]

Defined in src/views/cs.cds.viewContainers.cdsExplorer.ts:1027

___

### `Static` `Private` canOpenInBrowserEntryTypes

▪ **canOpenInBrowserEntryTypes**: *[CdsExplorerEntryType](../modules/_views_cs_cds_viewcontainers_cdsexplorer_.md#cdsexplorerentrytype)[]* = [ "Application", "Form", "View", "Entity", "Dashboard" ]

Defined in src/views/cs.cds.viewContainers.cdsExplorer.ts:1028

___

### `Static` `Private` canOpenInEditorEntryTypes

▪ **canOpenInEditorEntryTypes**: *[CdsExplorerEntryType](../modules/_views_cs_cds_viewcontainers_cdsexplorer_.md#cdsexplorerentrytype)[]* = [ "Form", "View", "Chart", "Dashboard" ]

Defined in src/views/cs.cds.viewContainers.cdsExplorer.ts:1029

___

### `Static` `Private` canRefreshEntryTypes

▪ **canRefreshEntryTypes**: *[CdsExplorerEntryType](../modules/_views_cs_cds_viewcontainers_cdsexplorer_.md#cdsexplorerentrytype)[]* = [ "Solutions", "Solution", "Plugins", "Entities", "Entity", "OptionSets", "OptionSet", "WebResources", "Folder", "Processes", "Attributes", "Forms", "Views", "Charts", "Dashboards", "Keys", "Relationships", "Entries" ]

Defined in src/views/cs.cds.viewContainers.cdsExplorer.ts:1017

___

### `Static` `Private` canRemoveFromSolutionEntryTypes

▪ **canRemoveFromSolutionEntryTypes**: *[CdsExplorerEntryType](../modules/_views_cs_cds_viewcontainers_cdsexplorer_.md#cdsexplorerentrytype)[]* = [ "Plugin", "Entity", "OptionSet", "WebResource", "Process", "Form", "View", "Chart", "Dashboard" ]

Defined in src/views/cs.cds.viewContainers.cdsExplorer.ts:1031

___

### `Static` `Private` canUnpackSolutionEntryTypes

▪ **canUnpackSolutionEntryTypes**: *[CdsExplorerEntryType](../modules/_views_cs_cds_viewcontainers_cdsexplorer_.md#cdsexplorerentrytype)[]* = [ "Solution" ]

Defined in src/views/cs.cds.viewContainers.cdsExplorer.ts:1025

## Accessors

###  capabilities

• **get capabilities**(): *string[]*

Defined in src/views/cs.cds.viewContainers.cdsExplorer.ts:1294

Gets an array of the capabilities of this tree item.  Used in conjunction with the "when" clause from package.json
to indicate which icons/commands are available for a given tree item.

**`readonly`** 

**`type`** {string[]}

**`memberof`** CdsTreeEntry

**Returns:** *string[]*

___

###  config

• **get config**(): *[Config](../interfaces/_api_cds_webapi_cdswebapi_.cdswebapi.config.md)*

Defined in src/views/cs.cds.viewContainers.cdsExplorer.ts:1128

Gets a reference to the configuration used to create the tree entry.  This is the object
returned when using the configId.

**`readonly`** 

**`type`** {CdsWebApi.Config}

**`memberof`** CdsTreeEntry

**Returns:** *[Config](../interfaces/_api_cds_webapi_cdswebapi_.cdswebapi.config.md)*

___

###  description

• **get description**(): *string*

*Overrides void*

Defined in src/views/cs.cds.viewContainers.cdsExplorer.ts:1116

Gets the description (subtext) on the tree entry.

**`readonly`** 

**`type`** {string}

**`memberof`** CdsTreeEntry

**Returns:** *string*

___

###  folder

• **get folder**(): *string*

Defined in src/views/cs.cds.viewContainers.cdsExplorer.ts:1185

Gets the folder associated with the tree item, if applicable.  Used when nesting
resources by folder.

**`readonly`** 

**`type`** {string}

**`memberof`** CdsTreeEntry

**Returns:** *string*

___

###  parent

• **get parent**(): *[CdsTreeEntry](_views_cs_cds_viewcontainers_cdsexplorer_.cdstreeentry.md) | undefined*

Defined in src/views/cs.cds.viewContainers.cdsExplorer.ts:1162

Gets the parent tree item (if any).

**`readonly`** 

**`type`** {CdsTreeEntry}

**`memberof`** CdsTreeEntry

**Returns:** *[CdsTreeEntry](_views_cs_cds_viewcontainers_cdsexplorer_.cdstreeentry.md) | undefined*

___

###  solution

• **get solution**(): *any*

Defined in src/views/cs.cds.viewContainers.cdsExplorer.ts:1224

Gets the solution associated with the tree item, if applicable.

**`readonly`** 

**`type`** {*}

**`memberof`** CdsTreeEntry

**Returns:** *any*

___

###  solutionId

• **get solutionId**(): *string*

Defined in src/views/cs.cds.viewContainers.cdsExplorer.ts:1204

Gets the solution ID associated with the tree item, if applicable.

**`readonly`** 

**`type`** {string}

**`memberof`** CdsTreeEntry

**Returns:** *string*

___

###  solutionIdPath

• **get solutionIdPath**(): *string*

Defined in src/views/cs.cds.viewContainers.cdsExplorer.ts:1251

Gets the solution path segment of the tree item's identifier.

**`readonly`** 

**`type`** {string}

**`memberof`** CdsTreeEntry

**Returns:** *string*

___

###  solutionMapping

• **get solutionMapping**(): *[SolutionWorkspaceMapping](_components_solutions_solutionworkspacemapping_.solutionworkspacemapping.md)*

Defined in src/views/cs.cds.viewContainers.cdsExplorer.ts:1272

Gets the mapping of the current solution for the currently loaded workspace, if applicable.

**`readonly`** 

**`type`** {SolutionWorkspaceMapping}

**`memberof`** CdsTreeEntry

**Returns:** *[SolutionWorkspaceMapping](_components_solutions_solutionworkspacemapping_.solutionworkspacemapping.md)*

___

###  tooltip

• **get tooltip**(): *string*

*Overrides void*

Defined in src/views/cs.cds.viewContainers.cdsExplorer.ts:1105

Gets the tooltip text on the tree entry.

**`readonly`** 

**`type`** {string}

**`memberof`** CdsTreeEntry

**Returns:** *string*

## Methods

### `Private` addCapability

▸ **addCapability**(`returnList`: string[], `capabilityName`: string, `constrain`: [CdsExplorerEntryType](../modules/_views_cs_cds_viewcontainers_cdsexplorer_.md#cdsexplorerentrytype)[], `additionalCheck?`: function): *void*

Defined in src/views/cs.cds.viewContainers.cdsExplorer.ts:1332

**Parameters:**

▪ **returnList**: *string[]*

▪ **capabilityName**: *string*

▪ **constrain**: *[CdsExplorerEntryType](../modules/_views_cs_cds_viewcontainers_cdsexplorer_.md#cdsexplorerentrytype)[]*

▪`Optional`  **additionalCheck**: *function*

▸ (): *boolean*

**Returns:** *void*

___

###  createChildItem

▸ **createChildItem**(`itemType`: [CdsExplorerEntryType](../modules/_views_cs_cds_viewcontainers_cdsexplorer_.md#cdsexplorerentrytype), `id`: string, `label`: string, `subtext?`: string, `collapsibleState`: TreeItemCollapsibleState, `context?`: any): *[CdsTreeEntry](_views_cs_cds_viewcontainers_cdsexplorer_.cdstreeentry.md)*

Defined in src/views/cs.cds.viewContainers.cdsExplorer.ts:1328

Creates a child item underneath the current tree entry with the specified properties.

**`memberof`** CdsTreeEntry

**Parameters:**

Name | Type | Default | Description |
------ | ------ | ------ | ------ |
`itemType` | [CdsExplorerEntryType](../modules/_views_cs_cds_viewcontainers_cdsexplorer_.md#cdsexplorerentrytype) | - | The type of node to create |
`id` | string | - | The sub-identifier of the node, the parent identifier will automatically be prefixed. |
`label` | string | - | The label to display on the new tree item. |
`subtext?` | string | - | - |
`collapsibleState` | TreeItemCollapsibleState | vscode.TreeItemCollapsibleState.None | - |
`context?` | any | - | - |

**Returns:** *[CdsTreeEntry](_views_cs_cds_viewcontainers_cdsexplorer_.cdstreeentry.md)*
