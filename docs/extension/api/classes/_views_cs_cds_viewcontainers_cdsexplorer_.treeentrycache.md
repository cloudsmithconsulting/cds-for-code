---
id: "_views_cs_cds_viewcontainers_cdsexplorer_.treeentrycache"
title: "TreeEntryCache"
sidebar_label: "TreeEntryCache"
---

[cds-for-code](../index.md) › [Globals](../globals.md) › ["views/cs.cds.viewContainers.cdsExplorer"](../modules/_views_cs_cds_viewcontainers_cdsexplorer_.md) › [TreeEntryCache](_views_cs_cds_viewcontainers_cdsexplorer_.treeentrycache.md)

## Hierarchy

* **TreeEntryCache**

## Index

### Constructors

* [constructor](_views_cs_cds_viewcontainers_cdsexplorer_.treeentrycache.md#private-constructor)

### Properties

* [_items](_views_cs_cds_viewcontainers_cdsexplorer_.treeentrycache.md#private-_items)
* [solutionMap](_views_cs_cds_viewcontainers_cdsexplorer_.treeentrycache.md#solutionmap)
* [_instance](_views_cs_cds_viewcontainers_cdsexplorer_.treeentrycache.md#static-private-_instance)

### Accessors

* [items](_views_cs_cds_viewcontainers_cdsexplorer_.treeentrycache.md#items)
* [Instance](_views_cs_cds_viewcontainers_cdsexplorer_.treeentrycache.md#static-instance)

### Methods

* [add](_views_cs_cds_viewcontainers_cdsexplorer_.treeentrycache.md#add)
* [clear](_views_cs_cds_viewcontainers_cdsexplorer_.treeentrycache.md#clear)
* [clearMap](_views_cs_cds_viewcontainers_cdsexplorer_.treeentrycache.md#clearmap)
* [remove](_views_cs_cds_viewcontainers_cdsexplorer_.treeentrycache.md#remove)
* [under](_views_cs_cds_viewcontainers_cdsexplorer_.treeentrycache.md#under)

## Constructors

### `Private` constructor

\+ **new TreeEntryCache**(): *[TreeEntryCache](_views_cs_cds_viewcontainers_cdsexplorer_.treeentrycache.md)*

Defined in src/views/cs.cds.viewContainers.cdsExplorer.ts:970

**Returns:** *[TreeEntryCache](_views_cs_cds_viewcontainers_cdsexplorer_.treeentrycache.md)*

## Properties

### `Private` _items

• **_items**: *[CdsTreeEntry](_views_cs_cds_viewcontainers_cdsexplorer_.cdstreeentry.md)[]* = []

Defined in src/views/cs.cds.viewContainers.cdsExplorer.ts:970

___

###  solutionMap

• **solutionMap**: *[SolutionMap](_components_solutions_solutionmap_.solutionmap.md)*

Defined in src/views/cs.cds.viewContainers.cdsExplorer.ts:1004

___

### `Static` `Private` _instance

▪ **_instance**: *[TreeEntryCache](_views_cs_cds_viewcontainers_cdsexplorer_.treeentrycache.md)*

Defined in src/views/cs.cds.viewContainers.cdsExplorer.ts:968

## Accessors

###  items

• **get items**(): *Enumerator‹[CdsTreeEntry](_views_cs_cds_viewcontainers_cdsexplorer_.cdstreeentry.md)›*

Defined in src/views/cs.cds.viewContainers.cdsExplorer.ts:1000

**Returns:** *Enumerator‹[CdsTreeEntry](_views_cs_cds_viewcontainers_cdsexplorer_.cdstreeentry.md)›*

___

### `Static` Instance

• **get Instance**(): *[TreeEntryCache](_views_cs_cds_viewcontainers_cdsexplorer_.treeentrycache.md)*

Defined in src/views/cs.cds.viewContainers.cdsExplorer.ts:980

**Returns:** *[TreeEntryCache](_views_cs_cds_viewcontainers_cdsexplorer_.treeentrycache.md)*

## Methods

###  add

▸ **add**(`entry`: [CdsTreeEntry](_views_cs_cds_viewcontainers_cdsexplorer_.cdstreeentry.md)): *void*

Defined in src/views/cs.cds.viewContainers.cdsExplorer.ts:988

**Parameters:**

Name | Type |
------ | ------ |
`entry` | [CdsTreeEntry](_views_cs_cds_viewcontainers_cdsexplorer_.cdstreeentry.md) |

**Returns:** *void*

___

###  clear

▸ **clear**(): *void*

Defined in src/views/cs.cds.viewContainers.cdsExplorer.ts:992

**Returns:** *void*

___

###  clearMap

▸ **clearMap**(): *void*

Defined in src/views/cs.cds.viewContainers.cdsExplorer.ts:996

**Returns:** *void*

___

###  remove

▸ **remove**(`path?`: string): *void*

Defined in src/views/cs.cds.viewContainers.cdsExplorer.ts:1006

**Parameters:**

Name | Type |
------ | ------ |
`path?` | string |

**Returns:** *void*

___

###  under

▸ **under**(`path`: string): *Enumerator‹[CdsTreeEntry](_views_cs_cds_viewcontainers_cdsexplorer_.cdstreeentry.md)›*

Defined in src/views/cs.cds.viewContainers.cdsExplorer.ts:1016

**Parameters:**

Name | Type |
------ | ------ |
`path` | string |

**Returns:** *Enumerator‹[CdsTreeEntry](_views_cs_cds_viewcontainers_cdsexplorer_.cdstreeentry.md)›*
