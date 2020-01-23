---
id: "_core_io_filemanager_.workspacefilesystemwatcher"
title: "WorkspaceFileSystemWatcher"
sidebar_label: "WorkspaceFileSystemWatcher"
---

[cds-for-code](../index.md) › [Globals](../globals.md) › ["core/io/FileManager"](../modules/_core_io_filemanager_.md) › [WorkspaceFileSystemWatcher](_core_io_filemanager_.workspacefilesystemwatcher.md)

## Hierarchy

* **WorkspaceFileSystemWatcher**

## Index

### Constructors

* [constructor](_core_io_filemanager_.workspacefilesystemwatcher.md#private-constructor)

### Properties

* [_changes](_core_io_filemanager_.workspacefilesystemwatcher.md#private-_changes)
* [_timeout](_core_io_filemanager_.workspacefilesystemwatcher.md#private-_timeout)
* [_watchers](_core_io_filemanager_.workspacefilesystemwatcher.md#private-_watchers)
* [_workspaceWatchers](_core_io_filemanager_.workspacefilesystemwatcher.md#private-_workspacewatchers)
* [watcherLatency](_core_io_filemanager_.workspacefilesystemwatcher.md#watcherlatency)
* [_instance](_core_io_filemanager_.workspacefilesystemwatcher.md#static-private-_instance)

### Accessors

* [watchers](_core_io_filemanager_.workspacefilesystemwatcher.md#watchers)
* [Instance](_core_io_filemanager_.workspacefilesystemwatcher.md#static-instance)

### Methods

* [closeWorkspace](_core_io_filemanager_.workspacefilesystemwatcher.md#closeworkspace)
* [flushChanges](_core_io_filemanager_.workspacefilesystemwatcher.md#private-flushchanges)
* [nameOf](_core_io_filemanager_.workspacefilesystemwatcher.md#nameof)
* [named](_core_io_filemanager_.workspacefilesystemwatcher.md#named)
* [observe](_core_io_filemanager_.workspacefilesystemwatcher.md#observe)
* [openWorkspace](_core_io_filemanager_.workspacefilesystemwatcher.md#openworkspace)
* [stopWatching](_core_io_filemanager_.workspacefilesystemwatcher.md#stopwatching)
* [watch](_core_io_filemanager_.workspacefilesystemwatcher.md#watch)

## Constructors

### `Private` constructor

\+ **new WorkspaceFileSystemWatcher**(): *[WorkspaceFileSystemWatcher](_core_io_filemanager_.workspacefilesystemwatcher.md)*

Defined in src/core/io/FileManager.ts:109

**Returns:** *[WorkspaceFileSystemWatcher](_core_io_filemanager_.workspacefilesystemwatcher.md)*

## Properties

### `Private` _changes

• **_changes**: *[FileWatcherChange](_core_io_filemanager_.filewatcherchange.md)[]*

Defined in src/core/io/FileManager.ts:117

___

### `Private` _timeout

• **_timeout**: *Timeout*

Defined in src/core/io/FileManager.ts:118

___

### `Private` _watchers

• **_watchers**: *[Dictionary](_core_types_dictionary_.dictionary.md)‹string, [FileWatcherDeclaration](_core_io_filemanager_.filewatcherdeclaration.md)›*

Defined in src/core/io/FileManager.ts:119

___

### `Private` _workspaceWatchers

• **_workspaceWatchers**: *[Dictionary](_core_types_dictionary_.dictionary.md)‹string, [FileWatcherDeclaration](_core_io_filemanager_.filewatcherdeclaration.md)›*

Defined in src/core/io/FileManager.ts:120

___

###  watcherLatency

• **watcherLatency**: *number* = 400

Defined in src/core/io/FileManager.ts:122

___

### `Static` `Private` _instance

▪ **_instance**: *[WorkspaceFileSystemWatcher](_core_io_filemanager_.workspacefilesystemwatcher.md)*

Defined in src/core/io/FileManager.ts:103

## Accessors

###  watchers

• **get watchers**(): *[Dictionary](_core_types_dictionary_.dictionary.md)‹string, [FileWatcherDeclaration](_core_io_filemanager_.filewatcherdeclaration.md)›*

Defined in src/core/io/FileManager.ts:124

**Returns:** *[Dictionary](_core_types_dictionary_.dictionary.md)‹string, [FileWatcherDeclaration](_core_io_filemanager_.filewatcherdeclaration.md)›*

___

### `Static` Instance

• **get Instance**(): *[WorkspaceFileSystemWatcher](_core_io_filemanager_.workspacefilesystemwatcher.md)*

Defined in src/core/io/FileManager.ts:105

**Returns:** *[WorkspaceFileSystemWatcher](_core_io_filemanager_.workspacefilesystemwatcher.md)*

## Methods

###  closeWorkspace

▸ **closeWorkspace**(`value`: WorkspaceFolder): *void*

Defined in src/core/io/FileManager.ts:161

**Parameters:**

Name | Type |
------ | ------ |
`value` | WorkspaceFolder |

**Returns:** *void*

___

### `Private` flushChanges

▸ **flushChanges**(): *void*

Defined in src/core/io/FileManager.ts:185

**Returns:** *void*

___

###  nameOf

▸ **nameOf**(`value`: [FileWatcherDeclaration](_core_io_filemanager_.filewatcherdeclaration.md)): *string*

Defined in src/core/io/FileManager.ts:132

**Parameters:**

Name | Type |
------ | ------ |
`value` | [FileWatcherDeclaration](_core_io_filemanager_.filewatcherdeclaration.md) |

**Returns:** *string*

___

###  named

▸ **named**(`value`: string): *[FileWatcherDeclaration](_core_io_filemanager_.filewatcherdeclaration.md)*

Defined in src/core/io/FileManager.ts:128

**Parameters:**

Name | Type |
------ | ------ |
`value` | string |

**Returns:** *[FileWatcherDeclaration](_core_io_filemanager_.filewatcherdeclaration.md)*

___

###  observe

▸ **observe**(`value`: [FileWatcherChange](_core_io_filemanager_.filewatcherchange.md)): *void*

Defined in src/core/io/FileManager.ts:136

**Parameters:**

Name | Type |
------ | ------ |
`value` | [FileWatcherChange](_core_io_filemanager_.filewatcherchange.md) |

**Returns:** *void*

___

###  openWorkspace

▸ **openWorkspace**(`value`: WorkspaceFolder): *[FileWatcherDeclaration](_core_io_filemanager_.filewatcherdeclaration.md)*

Defined in src/core/io/FileManager.ts:146

**Parameters:**

Name | Type |
------ | ------ |
`value` | WorkspaceFolder |

**Returns:** *[FileWatcherDeclaration](_core_io_filemanager_.filewatcherdeclaration.md)*

___

###  stopWatching

▸ **stopWatching**(`name`: string): *void*

Defined in src/core/io/FileManager.ts:178

**Parameters:**

Name | Type |
------ | ------ |
`name` | string |

**Returns:** *void*

___

###  watch

▸ **watch**(`name`: string, `pattern`: vscode.GlobPattern, ...`events`: [ChangeEvent](../modules/_core_io_filemanager_.md#changeevent)[]): *[FileWatcherDeclaration](_core_io_filemanager_.filewatcherdeclaration.md)*

Defined in src/core/io/FileManager.ts:170

**Parameters:**

Name | Type |
------ | ------ |
`name` | string |
`pattern` | vscode.GlobPattern |
`...events` | [ChangeEvent](../modules/_core_io_filemanager_.md#changeevent)[] |

**Returns:** *[FileWatcherDeclaration](_core_io_filemanager_.filewatcherdeclaration.md)*
