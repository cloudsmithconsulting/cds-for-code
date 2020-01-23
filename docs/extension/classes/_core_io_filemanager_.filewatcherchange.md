---
id: "_core_io_filemanager_.filewatcherchange"
title: "FileWatcherChange"
sidebar_label: "FileWatcherChange"
---

[cds-for-code](../index.md) › [Globals](../globals.md) › ["core/io/FileManager"](../modules/_core_io_filemanager_.md) › [FileWatcherChange](_core_io_filemanager_.filewatcherchange.md)

## Hierarchy

* **FileWatcherChange**

## Index

### Constructors

* [constructor](_core_io_filemanager_.filewatcherchange.md#constructor)

### Properties

* [event](_core_io_filemanager_.filewatcherchange.md#event)
* [pattern](_core_io_filemanager_.filewatcherchange.md#pattern)
* [rule](_core_io_filemanager_.filewatcherchange.md#rule)
* [source](_core_io_filemanager_.filewatcherchange.md#source)
* [sourceUri](_core_io_filemanager_.filewatcherchange.md#sourceuri)
* [targetUri](_core_io_filemanager_.filewatcherchange.md#targeturi)

## Constructors

###  constructor

\+ **new FileWatcherChange**(`rule?`: string, `pattern?`: vscode.GlobPattern, `source?`: [FileWatcherDeclaration](_core_io_filemanager_.filewatcherdeclaration.md), `event?`: [ChangeEvent](../modules/_core_io_filemanager_.md#changeevent), `sourceUri?`: Uri, `targetUri?`: Uri): *[FileWatcherChange](_core_io_filemanager_.filewatcherchange.md)*

Defined in src/core/io/FileManager.ts:247

**Parameters:**

Name | Type |
------ | ------ |
`rule?` | string |
`pattern?` | vscode.GlobPattern |
`source?` | [FileWatcherDeclaration](_core_io_filemanager_.filewatcherdeclaration.md) |
`event?` | [ChangeEvent](../modules/_core_io_filemanager_.md#changeevent) |
`sourceUri?` | Uri |
`targetUri?` | Uri |

**Returns:** *[FileWatcherChange](_core_io_filemanager_.filewatcherchange.md)*

## Properties

###  event

• **event**: *[ChangeEvent](../modules/_core_io_filemanager_.md#changeevent)*

Defined in src/core/io/FileManager.ts:260

___

###  pattern

• **pattern**: *vscode.GlobPattern*

Defined in src/core/io/FileManager.ts:258

___

###  rule

• **rule**: *string*

Defined in src/core/io/FileManager.ts:257

___

###  source

• **source**: *[FileWatcherDeclaration](_core_io_filemanager_.filewatcherdeclaration.md)*

Defined in src/core/io/FileManager.ts:259

___

###  sourceUri

• **sourceUri**: *Uri*

Defined in src/core/io/FileManager.ts:261

___

###  targetUri

• **targetUri**: *Uri*

Defined in src/core/io/FileManager.ts:262
