[cds-for-code](../README.md) › [Globals](../globals.md) › ["core/io/FileManager"](../modules/_core_io_filemanager_.md) › [FileWatcherDeclaration](_core_io_filemanager_.filewatcherdeclaration.md)

# Class: FileWatcherDeclaration

## Hierarchy

* **FileWatcherDeclaration**

## Index

### Constructors

* [constructor](_core_io_filemanager_.filewatcherdeclaration.md#constructor)

### Properties

* [_actions](_core_io_filemanager_.filewatcherdeclaration.md#private-_actions)
* [_events](_core_io_filemanager_.filewatcherdeclaration.md#private-_events)
* [_fsWatcher](_core_io_filemanager_.filewatcherdeclaration.md#private-_fswatcher)
* [_handler](_core_io_filemanager_.filewatcherdeclaration.md#private-_handler)
* [_pattern](_core_io_filemanager_.filewatcherdeclaration.md#private-_pattern)
* [_watcher](_core_io_filemanager_.filewatcherdeclaration.md#private-_watcher)

### Accessors

* [events](_core_io_filemanager_.filewatcherdeclaration.md#events)
* [isWatching](_core_io_filemanager_.filewatcherdeclaration.md#iswatching)
* [pattern](_core_io_filemanager_.filewatcherdeclaration.md#pattern)

### Methods

* [catch](_core_io_filemanager_.filewatcherdeclaration.md#catch)
* [dispose](_core_io_filemanager_.filewatcherdeclaration.md#dispose)
* [invoke](_core_io_filemanager_.filewatcherdeclaration.md#invoke)
* [start](_core_io_filemanager_.filewatcherdeclaration.md#start)
* [stop](_core_io_filemanager_.filewatcherdeclaration.md#stop)
* [then](_core_io_filemanager_.filewatcherdeclaration.md#then)

## Constructors

###  constructor

\+ **new FileWatcherDeclaration**(`watcher`: [WorkspaceFileSystemWatcher](_core_io_filemanager_.workspacefilesystemwatcher.md), `pattern`: vscode.GlobPattern, ...`events`: [ChangeEvent](../modules/_core_io_filemanager_.md#changeevent)[]): *[FileWatcherDeclaration](_core_io_filemanager_.filewatcherdeclaration.md)*

Defined in src/core/io/FileManager.ts:23

**Parameters:**

Name | Type |
------ | ------ |
`watcher` | [WorkspaceFileSystemWatcher](_core_io_filemanager_.workspacefilesystemwatcher.md) |
`pattern` | vscode.GlobPattern |
`...events` | [ChangeEvent](../modules/_core_io_filemanager_.md#changeevent)[] |

**Returns:** *[FileWatcherDeclaration](_core_io_filemanager_.filewatcherdeclaration.md)*

## Properties

### `Private` _actions

• **_actions**: *function[]*

Defined in src/core/io/FileManager.ts:9

___

### `Private` _events

• **_events**: *[ChangeEvent](../modules/_core_io_filemanager_.md#changeevent)[]*

Defined in src/core/io/FileManager.ts:8

___

### `Private` _fsWatcher

• **_fsWatcher**: *FileSystemWatcher*

Defined in src/core/io/FileManager.ts:11

___

### `Private` _handler

• **_handler**: *function*

Defined in src/core/io/FileManager.ts:10

#### Type declaration:

▸ (`error`: any): *void*

**Parameters:**

Name | Type |
------ | ------ |
`error` | any |

___

### `Private` _pattern

• **_pattern**: *vscode.GlobPattern*

Defined in src/core/io/FileManager.ts:7

___

### `Private` _watcher

• **_watcher**: *[WorkspaceFileSystemWatcher](_core_io_filemanager_.workspacefilesystemwatcher.md)*

Defined in src/core/io/FileManager.ts:6

## Accessors

###  events

• **get events**(): *[ChangeEvent](../modules/_core_io_filemanager_.md#changeevent)[]*

Defined in src/core/io/FileManager.ts:17

**Returns:** *[ChangeEvent](../modules/_core_io_filemanager_.md#changeevent)[]*

___

###  isWatching

• **get isWatching**(): *boolean*

Defined in src/core/io/FileManager.ts:21

**Returns:** *boolean*

___

###  pattern

• **get pattern**(): *vscode.GlobPattern*

Defined in src/core/io/FileManager.ts:13

**Returns:** *vscode.GlobPattern*

## Methods

###  catch

▸ **catch**(`handler`: function): *[FileWatcherDeclaration](_core_io_filemanager_.filewatcherdeclaration.md)*

Defined in src/core/io/FileManager.ts:42

**Parameters:**

▪ **handler**: *function*

▸ (`error`: any): *void*

**Parameters:**

Name | Type |
------ | ------ |
`error` | any |

**Returns:** *[FileWatcherDeclaration](_core_io_filemanager_.filewatcherdeclaration.md)*

___

###  dispose

▸ **dispose**(): *void*

Defined in src/core/io/FileManager.ts:95

**Returns:** *void*

___

###  invoke

▸ **invoke**(`change`: [FileWatcherChange](_core_io_filemanager_.filewatcherchange.md)): *boolean*

Defined in src/core/io/FileManager.ts:73

**Parameters:**

Name | Type |
------ | ------ |
`change` | [FileWatcherChange](_core_io_filemanager_.filewatcherchange.md) |

**Returns:** *boolean*

___

###  start

▸ **start**(): *void*

Defined in src/core/io/FileManager.ts:48

**Returns:** *void*

___

###  stop

▸ **stop**(): *void*

Defined in src/core/io/FileManager.ts:68

**Returns:** *void*

___

###  then

▸ **then**(`action`: function): *[FileWatcherDeclaration](_core_io_filemanager_.filewatcherdeclaration.md)*

Defined in src/core/io/FileManager.ts:32

**Parameters:**

▪ **action**: *function*

▸ (`change`: [FileWatcherChange](_core_io_filemanager_.filewatcherchange.md)): *void*

**Parameters:**

Name | Type |
------ | ------ |
`change` | [FileWatcherChange](_core_io_filemanager_.filewatcherchange.md) |

**Returns:** *[FileWatcherDeclaration](_core_io_filemanager_.filewatcherdeclaration.md)*
