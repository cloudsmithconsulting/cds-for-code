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
* [checkVersion](_components_webdownloaders_scriptdownloader_.scriptdownloader.md#static-checkversion)
* [downloadScript](_components_webdownloaders_scriptdownloader_.scriptdownloader.md#static-private-downloadscript)
* [downloadZip](_components_webdownloaders_scriptdownloader_.scriptdownloader.md#static-downloadzip)
* [installCdsSdk](_components_webdownloaders_scriptdownloader_.scriptdownloader.md#static-installcdssdk)
* [runScriptCheck](_components_webdownloaders_scriptdownloader_.scriptdownloader.md#static-runscriptcheck)

## Methods

###  activate

▸ **activate**(`context`: ExtensionContext, `config?`: WorkspaceConfiguration): *Promise‹void›*

Defined in src/components/WebDownloaders/ScriptDownloader.ts:19

**Parameters:**

Name | Type |
------ | ------ |
`context` | ExtensionContext |
`config?` | WorkspaceConfiguration |

**Returns:** *Promise‹void›*

___

### `Static` checkVersion

▸ **checkVersion**(`remoteFilePath`: string, `channel`: string): *Promise‹number›*

Defined in src/components/WebDownloaders/ScriptDownloader.ts:201

**Parameters:**

Name | Type |
------ | ------ |
`remoteFilePath` | string |
`channel` | string |

**Returns:** *Promise‹number›*

___

### `Static` `Private` downloadScript

▸ **downloadScript**(`remoteFilePath`: string, `localFilePath`: string): *Promise‹string›*

Defined in src/components/WebDownloaders/ScriptDownloader.ts:159

**Parameters:**

Name | Type |
------ | ------ |
`remoteFilePath` | string |
`localFilePath` | string |

**Returns:** *Promise‹string›*

___

### `Static` downloadZip

▸ **downloadZip**(`remoteFilePath`: string, `localFilePath`: string): *Promise‹string›*

Defined in src/components/WebDownloaders/ScriptDownloader.ts:180

**Parameters:**

Name | Type |
------ | ------ |
`remoteFilePath` | string |
`localFilePath` | string |

**Returns:** *Promise‹string›*

___

### `Static` installCdsSdk

▸ **installCdsSdk**(): *Promise‹[TerminalCommand](_components_terminal_secureterminal_.terminalcommand.md)›*

Defined in src/components/WebDownloaders/ScriptDownloader.ts:217

**Returns:** *Promise‹[TerminalCommand](_components_terminal_secureterminal_.terminalcommand.md)›*

___

### `Static` runScriptCheck

▸ **runScriptCheck**(): *Promise‹void›*

Defined in src/components/WebDownloaders/ScriptDownloader.ts:24

**Returns:** *Promise‹void›*
