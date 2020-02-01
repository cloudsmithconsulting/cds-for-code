---
id: "_views_cs_cds_viewcontainers_templateexplorer_.templateexplorer"
title: "TemplateExplorer"
sidebar_label: "TemplateExplorer"
---

[cds-for-code](../index.md) › [Globals](../globals.md) › ["views/cs.cds.viewContainers.templateExplorer"](../modules/_views_cs_cds_viewcontainers_templateexplorer_.md) › [TemplateExplorer](_views_cs_cds_viewcontainers_templateexplorer_.templateexplorer.md)

## Hierarchy

* **TemplateExplorer**

## Implements

* TreeDataProvider‹[TemplateExplorerEntry](_views_cs_cds_viewcontainers_templateexplorer_.templateexplorerentry.md)›

## Index

### Constructors

* [constructor](_views_cs_cds_viewcontainers_templateexplorer_.templateexplorer.md#private-constructor)

### Properties

* [_onDidChangeTreeData](_views_cs_cds_viewcontainers_templateexplorer_.templateexplorer.md#private-_ondidchangetreedata)
* [onDidChangeTreeData](_views_cs_cds_viewcontainers_templateexplorer_.templateexplorer.md#ondidchangetreedata)
* [instance](_views_cs_cds_viewcontainers_templateexplorer_.templateexplorer.md#static-private-instance)
* [parsers](_views_cs_cds_viewcontainers_templateexplorer_.templateexplorer.md#static-private-parsers)

### Accessors

* [Instance](_views_cs_cds_viewcontainers_templateexplorer_.templateexplorer.md#static-instance)

### Methods

* [activate](_views_cs_cds_viewcontainers_templateexplorer_.templateexplorer.md#activate)
* [add](_views_cs_cds_viewcontainers_templateexplorer_.templateexplorer.md#add)
* [click](_views_cs_cds_viewcontainers_templateexplorer_.templateexplorer.md#click)
* [createFromTemplate](_views_cs_cds_viewcontainers_templateexplorer_.templateexplorer.md#createfromtemplate)
* [delete](_views_cs_cds_viewcontainers_templateexplorer_.templateexplorer.md#delete)
* [edit](_views_cs_cds_viewcontainers_templateexplorer_.templateexplorer.md#edit)
* [export](_views_cs_cds_viewcontainers_templateexplorer_.templateexplorer.md#export)
* [getChildren](_views_cs_cds_viewcontainers_templateexplorer_.templateexplorer.md#getchildren)
* [getRootEntries](_views_cs_cds_viewcontainers_templateexplorer_.templateexplorer.md#private-getrootentries)
* [getTreeItem](_views_cs_cds_viewcontainers_templateexplorer_.templateexplorer.md#gettreeitem)
* [import](_views_cs_cds_viewcontainers_templateexplorer_.templateexplorer.md#import)
* [open](_views_cs_cds_viewcontainers_templateexplorer_.templateexplorer.md#open)
* [refresh](_views_cs_cds_viewcontainers_templateexplorer_.templateexplorer.md#refresh)

## Constructors

### `Private` constructor

\+ **new TemplateExplorer**(): *[TemplateExplorer](_views_cs_cds_viewcontainers_templateexplorer_.templateexplorer.md)*

Defined in src/views/cs.cds.viewContainers.templateExplorer.ts:21

**Returns:** *[TemplateExplorer](_views_cs_cds_viewcontainers_templateexplorer_.templateexplorer.md)*

## Properties

### `Private` _onDidChangeTreeData

• **_onDidChangeTreeData**: *EventEmitter‹[TemplateExplorerEntry](_views_cs_cds_viewcontainers_templateexplorer_.templateexplorerentry.md) | undefined›* = new vscode.EventEmitter<TemplateExplorerEntry | undefined>()

Defined in src/views/cs.cds.viewContainers.templateExplorer.ts:18

___

###  onDidChangeTreeData

• **onDidChangeTreeData**: *Event‹[TemplateExplorerEntry](_views_cs_cds_viewcontainers_templateexplorer_.templateexplorerentry.md) | undefined›* = this._onDidChangeTreeData.event

Defined in src/views/cs.cds.viewContainers.templateExplorer.ts:19

___

### `Static` `Private` instance

▪ **instance**: *[TemplateExplorer](_views_cs_cds_viewcontainers_templateexplorer_.templateexplorer.md)*

Defined in src/views/cs.cds.viewContainers.templateExplorer.ts:21

___

### `Static` `Private` parsers

▪ **parsers**: *[Dictionary](_core_types_dictionary_.dictionary.md)‹"Folder" | "ProjectTemplate" | "ItemTemplate", function›* = new Dictionary<TemplateExplorerEntryType, (item: any, element?: TemplateExplorerEntry, ...rest: any[]) => TemplateExplorerEntry>([
        { key: "Folder", value: (folder, element) => element.createChildItem("Folder", folder, folder, folder, vscode.TreeItemCollapsibleState.Collapsed, undefined) },
        { key: "ProjectTemplate", value: (item, element) => element.createChildItem("ProjectTemplate", item.name, item.displayName, item.description, vscode.TreeItemCollapsibleState.None, item) },
        { key: "ItemTemplate", value: (item, element) => element.createChildItem("ItemTemplate", item.name, item.displayName, item.description, vscode.TreeItemCollapsibleState.None, item) }
    ])

Defined in src/views/cs.cds.viewContainers.templateExplorer.ts:33

## Accessors

### `Static` Instance

• **get Instance**(): *[TemplateExplorer](_views_cs_cds_viewcontainers_templateexplorer_.templateexplorer.md)*

Defined in src/views/cs.cds.viewContainers.templateExplorer.ts:25

**Returns:** *[TemplateExplorer](_views_cs_cds_viewcontainers_templateexplorer_.templateexplorer.md)*

## Methods

###  activate

▸ **activate**(`context`: ExtensionContext): *Promise‹void›*

Defined in src/views/cs.cds.viewContainers.templateExplorer.ts:40

**Parameters:**

Name | Type |
------ | ------ |
`context` | ExtensionContext |

**Returns:** *Promise‹void›*

___

###  add

▸ **add**(`item?`: [TemplateExplorerEntry](_views_cs_cds_viewcontainers_templateexplorer_.templateexplorerentry.md)): *Promise‹void›*

Defined in src/views/cs.cds.viewContainers.templateExplorer.ts:49

**Parameters:**

Name | Type |
------ | ------ |
`item?` | [TemplateExplorerEntry](_views_cs_cds_viewcontainers_templateexplorer_.templateexplorerentry.md) |

**Returns:** *Promise‹void›*

___

###  click

▸ **click**(`item?`: [TemplateExplorerEntry](_views_cs_cds_viewcontainers_templateexplorer_.templateexplorerentry.md)): *Promise‹void›*

Defined in src/views/cs.cds.viewContainers.templateExplorer.ts:55

**Parameters:**

Name | Type |
------ | ------ |
`item?` | [TemplateExplorerEntry](_views_cs_cds_viewcontainers_templateexplorer_.templateexplorerentry.md) |

**Returns:** *Promise‹void›*

___

###  createFromTemplate

▸ **createFromTemplate**(`item?`: [TemplateExplorerEntry](_views_cs_cds_viewcontainers_templateexplorer_.templateexplorerentry.md)): *Promise‹unknown›*

Defined in src/views/cs.cds.viewContainers.templateExplorer.ts:63

**Parameters:**

Name | Type |
------ | ------ |
`item?` | [TemplateExplorerEntry](_views_cs_cds_viewcontainers_templateexplorer_.templateexplorerentry.md) |

**Returns:** *Promise‹unknown›*

___

###  delete

▸ **delete**(`item?`: [TemplateExplorerEntry](_views_cs_cds_viewcontainers_templateexplorer_.templateexplorerentry.md)): *Promise‹void›*

Defined in src/views/cs.cds.viewContainers.templateExplorer.ts:68

**Parameters:**

Name | Type |
------ | ------ |
`item?` | [TemplateExplorerEntry](_views_cs_cds_viewcontainers_templateexplorer_.templateexplorerentry.md) |

**Returns:** *Promise‹void›*

___

###  edit

▸ **edit**(`item?`: [TemplateExplorerEntry](_views_cs_cds_viewcontainers_templateexplorer_.templateexplorerentry.md)): *Promise‹void›*

Defined in src/views/cs.cds.viewContainers.templateExplorer.ts:74

**Parameters:**

Name | Type |
------ | ------ |
`item?` | [TemplateExplorerEntry](_views_cs_cds_viewcontainers_templateexplorer_.templateexplorerentry.md) |

**Returns:** *Promise‹void›*

___

###  export

▸ **export**(`item?`: [TemplateExplorerEntry](_views_cs_cds_viewcontainers_templateexplorer_.templateexplorerentry.md)): *Promise‹void›*

Defined in src/views/cs.cds.viewContainers.templateExplorer.ts:107

**Parameters:**

Name | Type |
------ | ------ |
`item?` | [TemplateExplorerEntry](_views_cs_cds_viewcontainers_templateexplorer_.templateexplorerentry.md) |

**Returns:** *Promise‹void›*

___

###  getChildren

▸ **getChildren**(`element?`: [TemplateExplorerEntry](_views_cs_cds_viewcontainers_templateexplorer_.templateexplorerentry.md)): *Promise‹[TemplateExplorerEntry](_views_cs_cds_viewcontainers_templateexplorer_.templateexplorerentry.md)[]›*

Defined in src/views/cs.cds.viewContainers.templateExplorer.ts:116

**Parameters:**

Name | Type |
------ | ------ |
`element?` | [TemplateExplorerEntry](_views_cs_cds_viewcontainers_templateexplorer_.templateexplorerentry.md) |

**Returns:** *Promise‹[TemplateExplorerEntry](_views_cs_cds_viewcontainers_templateexplorer_.templateexplorerentry.md)[]›*

___

### `Private` getRootEntries

▸ **getRootEntries**(): *[TemplateExplorerEntry](_views_cs_cds_viewcontainers_templateexplorer_.templateexplorerentry.md)[]*

Defined in src/views/cs.cds.viewContainers.templateExplorer.ts:190

**Returns:** *[TemplateExplorerEntry](_views_cs_cds_viewcontainers_templateexplorer_.templateexplorerentry.md)[]*

___

###  getTreeItem

▸ **getTreeItem**(`element`: [TemplateExplorerEntry](_views_cs_cds_viewcontainers_templateexplorer_.templateexplorerentry.md)): *TreeItem*

Defined in src/views/cs.cds.viewContainers.templateExplorer.ts:112

**Parameters:**

Name | Type |
------ | ------ |
`element` | [TemplateExplorerEntry](_views_cs_cds_viewcontainers_templateexplorer_.templateexplorerentry.md) |

**Returns:** *TreeItem*

___

###  import

▸ **import**(`item?`: [TemplateExplorerEntry](_views_cs_cds_viewcontainers_templateexplorer_.templateexplorerentry.md)): *Promise‹void›*

Defined in src/views/cs.cds.viewContainers.templateExplorer.ts:169

**Parameters:**

Name | Type |
------ | ------ |
`item?` | [TemplateExplorerEntry](_views_cs_cds_viewcontainers_templateexplorer_.templateexplorerentry.md) |

**Returns:** *Promise‹void›*

___

###  open

▸ **open**(`item?`: [TemplateExplorerEntry](_views_cs_cds_viewcontainers_templateexplorer_.templateexplorerentry.md)): *Promise‹void›*

Defined in src/views/cs.cds.viewContainers.templateExplorer.ts:175

**Parameters:**

Name | Type |
------ | ------ |
`item?` | [TemplateExplorerEntry](_views_cs_cds_viewcontainers_templateexplorer_.templateexplorerentry.md) |

**Returns:** *Promise‹void›*

___

###  refresh

▸ **refresh**(`item?`: [TemplateExplorerEntry](_views_cs_cds_viewcontainers_templateexplorer_.templateexplorerentry.md)): *void*

Defined in src/views/cs.cds.viewContainers.templateExplorer.ts:180

**Parameters:**

Name | Type |
------ | ------ |
`item?` | [TemplateExplorerEntry](_views_cs_cds_viewcontainers_templateexplorer_.templateexplorerentry.md) |

**Returns:** *void*
