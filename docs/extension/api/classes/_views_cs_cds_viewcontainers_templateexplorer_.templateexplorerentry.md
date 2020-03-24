---
id: "_views_cs_cds_viewcontainers_templateexplorer_.templateexplorerentry"
title: "TemplateExplorerEntry"
sidebar_label: "TemplateExplorerEntry"
---

[cds-for-code](../index.md) › [Globals](../globals.md) › ["views/cs.cds.viewContainers.templateExplorer"](../modules/_views_cs_cds_viewcontainers_templateexplorer_.md) › [TemplateExplorerEntry](_views_cs_cds_viewcontainers_templateexplorer_.templateexplorerentry.md)

## Hierarchy

* TreeItem

  ↳ **TemplateExplorerEntry**

## Index

### Constructors

* [constructor](_views_cs_cds_viewcontainers_templateexplorer_.templateexplorerentry.md#constructor)

### Properties

* [collapsibleState](_views_cs_cds_viewcontainers_templateexplorer_.templateexplorerentry.md#optional-collapsiblestate)
* [command](_views_cs_cds_viewcontainers_templateexplorer_.templateexplorerentry.md#optional-command)
* [context](_views_cs_cds_viewcontainers_templateexplorer_.templateexplorerentry.md#optional-context)
* [contextValue](_views_cs_cds_viewcontainers_templateexplorer_.templateexplorerentry.md#optional-contextvalue)
* [iconPath](_views_cs_cds_viewcontainers_templateexplorer_.templateexplorerentry.md#optional-iconpath)
* [id](_views_cs_cds_viewcontainers_templateexplorer_.templateexplorerentry.md#id)
* [itemType](_views_cs_cds_viewcontainers_templateexplorer_.templateexplorerentry.md#itemtype)
* [label](_views_cs_cds_viewcontainers_templateexplorer_.templateexplorerentry.md#optional-label)
* [resourceUri](_views_cs_cds_viewcontainers_templateexplorer_.templateexplorerentry.md#optional-resourceuri)
* [subtext](_views_cs_cds_viewcontainers_templateexplorer_.templateexplorerentry.md#optional-subtext)
* [canAddEntryTypes](_views_cs_cds_viewcontainers_templateexplorer_.templateexplorerentry.md#static-private-canaddentrytypes)
* [canCreateInWorkspaceTypes](_views_cs_cds_viewcontainers_templateexplorer_.templateexplorerentry.md#static-private-cancreateinworkspacetypes)
* [canDeleteEntryTypes](_views_cs_cds_viewcontainers_templateexplorer_.templateexplorerentry.md#static-private-candeleteentrytypes)
* [canEditEntryTypes](_views_cs_cds_viewcontainers_templateexplorer_.templateexplorerentry.md#static-private-caneditentrytypes)
* [canExportEntryTypes](_views_cs_cds_viewcontainers_templateexplorer_.templateexplorerentry.md#static-private-canexportentrytypes)
* [canImportEntryTypes](_views_cs_cds_viewcontainers_templateexplorer_.templateexplorerentry.md#static-private-canimportentrytypes)
* [canOpenEntryTypes](_views_cs_cds_viewcontainers_templateexplorer_.templateexplorerentry.md#static-private-canopenentrytypes)
* [canRefreshEntryTypes](_views_cs_cds_viewcontainers_templateexplorer_.templateexplorerentry.md#static-private-canrefreshentrytypes)
* [canViewCompiledTypes](_views_cs_cds_viewcontainers_templateexplorer_.templateexplorerentry.md#static-private-canviewcompiledtypes)

### Accessors

* [capabilities](_views_cs_cds_viewcontainers_templateexplorer_.templateexplorerentry.md#capabilities)
* [description](_views_cs_cds_viewcontainers_templateexplorer_.templateexplorerentry.md#description)
* [parent](_views_cs_cds_viewcontainers_templateexplorer_.templateexplorerentry.md#parent)
* [tooltip](_views_cs_cds_viewcontainers_templateexplorer_.templateexplorerentry.md#tooltip)

### Methods

* [addCapability](_views_cs_cds_viewcontainers_templateexplorer_.templateexplorerentry.md#private-addcapability)
* [createChildItem](_views_cs_cds_viewcontainers_templateexplorer_.templateexplorerentry.md#createchilditem)

## Constructors

###  constructor

\+ **new TemplateExplorerEntry**(`parentItem`: [TemplateExplorerEntry](_views_cs_cds_viewcontainers_templateexplorer_.templateexplorerentry.md), `itemType`: [TemplateExplorerEntryType](../modules/_views_cs_cds_viewcontainers_templateexplorer_.md#templateexplorerentrytype), `id`: string, `label`: string, `subtext?`: string, `collapsibleState`: TreeItemCollapsibleState, `context?`: any): *[TemplateExplorerEntry](_views_cs_cds_viewcontainers_templateexplorer_.templateexplorerentry.md)*

*Overrides void*

Defined in src/views/cs.cds.viewContainers.templateExplorer.ts:244

**Parameters:**

Name | Type | Default |
------ | ------ | ------ |
`parentItem` | [TemplateExplorerEntry](_views_cs_cds_viewcontainers_templateexplorer_.templateexplorerentry.md) | - |
`itemType` | [TemplateExplorerEntryType](../modules/_views_cs_cds_viewcontainers_templateexplorer_.md#templateexplorerentrytype) | - |
`id` | string | - |
`label` | string | - |
`subtext?` | string | - |
`collapsibleState` | TreeItemCollapsibleState | vscode.TreeItemCollapsibleState.None |
`context?` | any | - |

**Returns:** *[TemplateExplorerEntry](_views_cs_cds_viewcontainers_templateexplorer_.templateexplorerentry.md)*

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

### `Optional` context

• **context**? : *any*

Defined in src/views/cs.cds.viewContainers.templateExplorer.ts:254

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

Defined in src/views/cs.cds.viewContainers.templateExplorer.ts:250

___

###  itemType

• **itemType**: *[TemplateExplorerEntryType](../modules/_views_cs_cds_viewcontainers_templateexplorer_.md#templateexplorerentrytype)*

Defined in src/views/cs.cds.viewContainers.templateExplorer.ts:249

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

Defined in src/views/cs.cds.viewContainers.templateExplorer.ts:252

___

### `Static` `Private` canAddEntryTypes

▪ **canAddEntryTypes**: *[TemplateExplorerEntryType](../modules/_views_cs_cds_viewcontainers_templateexplorer_.md#templateexplorerentrytype)[]* = [ "Folder" ]

Defined in src/views/cs.cds.viewContainers.templateExplorer.ts:237

___

### `Static` `Private` canCreateInWorkspaceTypes

▪ **canCreateInWorkspaceTypes**: *[TemplateExplorerEntryType](../modules/_views_cs_cds_viewcontainers_templateexplorer_.md#templateexplorerentrytype)[]* = [ "ProjectTemplate", "ItemTemplate" ]

Defined in src/views/cs.cds.viewContainers.templateExplorer.ts:242

___

### `Static` `Private` canDeleteEntryTypes

▪ **canDeleteEntryTypes**: *[TemplateExplorerEntryType](../modules/_views_cs_cds_viewcontainers_templateexplorer_.md#templateexplorerentrytype)[]* = [ "ProjectTemplate", "ItemTemplate" ]

Defined in src/views/cs.cds.viewContainers.templateExplorer.ts:240

___

### `Static` `Private` canEditEntryTypes

▪ **canEditEntryTypes**: *[TemplateExplorerEntryType](../modules/_views_cs_cds_viewcontainers_templateexplorer_.md#templateexplorerentrytype)[]* = [ "ProjectTemplate", "ItemTemplate" ]

Defined in src/views/cs.cds.viewContainers.templateExplorer.ts:239

___

### `Static` `Private` canExportEntryTypes

▪ **canExportEntryTypes**: *[TemplateExplorerEntryType](../modules/_views_cs_cds_viewcontainers_templateexplorer_.md#templateexplorerentrytype)[]* = [ "ProjectTemplate", "ItemTemplate" ]

Defined in src/views/cs.cds.viewContainers.templateExplorer.ts:243

___

### `Static` `Private` canImportEntryTypes

▪ **canImportEntryTypes**: *[TemplateExplorerEntryType](../modules/_views_cs_cds_viewcontainers_templateexplorer_.md#templateexplorerentrytype)[]* = [ "Folder" ]

Defined in src/views/cs.cds.viewContainers.templateExplorer.ts:238

___

### `Static` `Private` canOpenEntryTypes

▪ **canOpenEntryTypes**: *[TemplateExplorerEntryType](../modules/_views_cs_cds_viewcontainers_templateexplorer_.md#templateexplorerentrytype)[]* = [ "ProjectTemplate", "ItemTemplate" ]

Defined in src/views/cs.cds.viewContainers.templateExplorer.ts:241

___

### `Static` `Private` canRefreshEntryTypes

▪ **canRefreshEntryTypes**: *[TemplateExplorerEntryType](../modules/_views_cs_cds_viewcontainers_templateexplorer_.md#templateexplorerentrytype)[]* = [ "Folder" ]

Defined in src/views/cs.cds.viewContainers.templateExplorer.ts:236

___

### `Static` `Private` canViewCompiledTypes

▪ **canViewCompiledTypes**: *[TemplateExplorerEntryType](../modules/_views_cs_cds_viewcontainers_templateexplorer_.md#templateexplorerentrytype)[]* = [ "ProjectTemplate", "ItemTemplate" ]

Defined in src/views/cs.cds.viewContainers.templateExplorer.ts:244

## Accessors

###  capabilities

• **get capabilities**(): *string[]*

Defined in src/views/cs.cds.viewContainers.templateExplorer.ts:308

**Returns:** *string[]*

___

###  description

• **get description**(): *string*

*Overrides void*

Defined in src/views/cs.cds.viewContainers.templateExplorer.ts:289

**Returns:** *string*

___

###  parent

• **get parent**(): *[TemplateExplorerEntry](_views_cs_cds_viewcontainers_templateexplorer_.templateexplorerentry.md)*

Defined in src/views/cs.cds.viewContainers.templateExplorer.ts:293

**Returns:** *[TemplateExplorerEntry](_views_cs_cds_viewcontainers_templateexplorer_.templateexplorerentry.md)*

___

###  tooltip

• **get tooltip**(): *string*

*Overrides void*

Defined in src/views/cs.cds.viewContainers.templateExplorer.ts:285

**Returns:** *string*

## Methods

### `Private` addCapability

▸ **addCapability**(`returnList`: string[], `capabilityName`: string, `constrain`: [TemplateExplorerEntryType](../modules/_views_cs_cds_viewcontainers_templateexplorer_.md#templateexplorerentrytype)[], `additionalCheck?`: function): *void*

Defined in src/views/cs.cds.viewContainers.templateExplorer.ts:340

**Parameters:**

▪ **returnList**: *string[]*

▪ **capabilityName**: *string*

▪ **constrain**: *[TemplateExplorerEntryType](../modules/_views_cs_cds_viewcontainers_templateexplorer_.md#templateexplorerentrytype)[]*

▪`Optional`  **additionalCheck**: *function*

▸ (): *boolean*

**Returns:** *void*

___

###  createChildItem

▸ **createChildItem**(`itemType`: [TemplateExplorerEntryType](../modules/_views_cs_cds_viewcontainers_templateexplorer_.md#templateexplorerentrytype), `id`: string, `label`: string, `subtext?`: string, `collapsibleState`: TreeItemCollapsibleState, `context?`: any): *[TemplateExplorerEntry](_views_cs_cds_viewcontainers_templateexplorer_.templateexplorerentry.md)*

Defined in src/views/cs.cds.viewContainers.templateExplorer.ts:336

Creates a child item underneath the current tree entry with the specified properties.

**`memberof`** TreeEntry

**Parameters:**

Name | Type | Default | Description |
------ | ------ | ------ | ------ |
`itemType` | [TemplateExplorerEntryType](../modules/_views_cs_cds_viewcontainers_templateexplorer_.md#templateexplorerentrytype) | - | The type of node to create |
`id` | string | - | The sub-identifier of the node, the parent identifier will automatically be prefixed. |
`label` | string | - | The label to display on the new tree item. |
`subtext?` | string | - | - |
`collapsibleState` | TreeItemCollapsibleState | vscode.TreeItemCollapsibleState.None | - |
`context?` | any | - | - |

**Returns:** *[TemplateExplorerEntry](_views_cs_cds_viewcontainers_templateexplorer_.templateexplorerentry.md)*
