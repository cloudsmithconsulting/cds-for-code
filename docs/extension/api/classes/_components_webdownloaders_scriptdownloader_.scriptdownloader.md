---
id: "_components_webdownloaders_scriptdownloader_.scriptdownloader"
title: "ScriptDownloader"
sidebar_label: "ScriptDownloader"
---

[cds-for-code](../index.md) › [Globals](../globals.md) › ["components/WebDownloaders/ScriptDownloader"](../modules/_components_webdownloaders_scriptdownloader_.md) › [ScriptDownloader](_components_webdownloaders_scriptdownloader_.scriptdownloader.md)

## Hierarchy

* **ScriptDownloader**

## Index

### Methods

* [activate](_components_webdownloaders_scriptdownloader_.scriptdownloader.md#activate)
* [installCdsSdk](_components_webdownloaders_scriptdownloader_.scriptdownloader.md#static-installcdssdk)
* [runScriptCheck](_components_webdownloaders_scriptdownloader_.scriptdownloader.md#static-runscriptcheck)
* [unzipDownload](_components_webdownloaders_scriptdownloader_.scriptdownloader.md#static-private-unzipdownload)

## Methods

###  activate

▸ **activate**(`context`: ExtensionContext, `config?`: WorkspaceConfiguration): *Promise‹void›*

Defined in src/components/WebDownloaders/ScriptDownloader.ts:21

**Parameters:**

Name | Type |
------ | ------ |
`context` | ExtensionContext |
`config?` | WorkspaceConfiguration |

**Returns:** *Promise‹void›*

___

### `Static` installCdsSdk

▸ **installCdsSdk**(): *Promise‹[TerminalCommand](_components_terminal_secureterminal_.terminalcommand.md)›*

Defined in src/components/WebDownloaders/ScriptDownloader.ts:148

**Returns:** *Promise‹[TerminalCommand](_components_terminal_secureterminal_.terminalcommand.md)›*

___

### `Static` runScriptCheck

▸ **runScriptCheck**(): *Promise‹void›*

Defined in src/components/WebDownloaders/ScriptDownloader.ts:26

**Returns:** *Promise‹void›*

___

### `Static` `Private` unzipDownload

▸ **unzipDownload**(`options`: any): *Promise‹void›*

Defined in src/components/WebDownloaders/ScriptDownloader.ts:164

**Parameters:**

Name | Type |
------ | ------ |
`options` | any |

**Returns:** *Promise‹void›*
