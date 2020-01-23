---
id: "_core_io_filesystem_"
title: "core/io/FileSystem"
sidebar_label: "core/io/FileSystem"
---

[cds-for-code](../index.md) › [Globals](../globals.md) › ["core/io/FileSystem"](_core_io_filesystem_.md)

## Index

### Functions

* [_walk](_core_io_filesystem_.md#_walk)
* [copyFolder](_core_io_filesystem_.md#copyfolder)
* [copyItem](_core_io_filesystem_.md#copyitem)
* [copyItemSync](_core_io_filesystem_.md#copyitemsync)
* [deleteFolder](_core_io_filesystem_.md#deletefolder)
* [deleteItem](_core_io_filesystem_.md#deleteitem)
* [exists](_core_io_filesystem_.md#exists)
* [makeFolderSync](_core_io_filesystem_.md#makefoldersync)
* [openFolderInExplorer](_core_io_filesystem_.md#openfolderinexplorer)
* [readFileSync](_core_io_filesystem_.md#readfilesync)
* [recurse](_core_io_filesystem_.md#recurse)
* [stats](_core_io_filesystem_.md#stats)
* [unzip](_core_io_filesystem_.md#unzip)
* [walk](_core_io_filesystem_.md#walk)
* [walkSync](_core_io_filesystem_.md#walksync)
* [writeFileSync](_core_io_filesystem_.md#writefilesync)
* [zip](_core_io_filesystem_.md#zip)
* [zipFolder](_core_io_filesystem_.md#zipfolder)

## Functions

###  _walk

▸ **_walk**(`dir`: string, `predicate?`: function, `done?`: function): *Promise‹void›*

Defined in src/core/io/FileSystem.ts:155

**Parameters:**

▪ **dir**: *string*

▪`Optional`  **predicate**: *function*

▸ (`item`: string): *boolean*

**Parameters:**

Name | Type |
------ | ------ |
`item` | string |

▪`Optional`  **done**: *function*

▸ (`error`: any, `result`: any[] | null): *void*

**Parameters:**

Name | Type |
------ | ------ |
`error` | any |
`result` | any[] &#124; null |

**Returns:** *Promise‹void›*

___

###  copyFolder

▸ **copyFolder**(`source`: string, `destination`: string): *Promise‹boolean›*

Defined in src/core/io/FileSystem.ts:12

Recursively copy folder from src to dest

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`source` | string | source folder |
`destination` | string | destination folder  |

**Returns:** *Promise‹boolean›*

___

###  copyItem

▸ **copyItem**(`path`: string, `destination`: string): *Promise‹void›*

Defined in src/core/io/FileSystem.ts:60

**Parameters:**

Name | Type |
------ | ------ |
`path` | string |
`destination` | string |

**Returns:** *Promise‹void›*

___

###  copyItemSync

▸ **copyItemSync**(`path`: string, `destination`: string): *void*

Defined in src/core/io/FileSystem.ts:70

**Parameters:**

Name | Type |
------ | ------ |
`path` | string |
`destination` | string |

**Returns:** *void*

___

###  deleteFolder

▸ **deleteFolder**(`folder`: string): *Promise‹boolean›*

Defined in src/core/io/FileSystem.ts:207

Recursively delete a directory and all contained contents

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`folder` | string | directory to delete  |

**Returns:** *Promise‹boolean›*

___

###  deleteItem

▸ **deleteItem**(`path`: string): *Promise‹void›*

Defined in src/core/io/FileSystem.ts:191

**Parameters:**

Name | Type |
------ | ------ |
`path` | string |

**Returns:** *Promise‹void›*

___

###  exists

▸ **exists**(`path`: string): *boolean*

Defined in src/core/io/FileSystem.ts:74

**Parameters:**

Name | Type |
------ | ------ |
`path` | string |

**Returns:** *boolean*

___

###  makeFolderSync

▸ **makeFolderSync**(`destination`: string, `mode`: string | number | null | undefined): *boolean*

Defined in src/core/io/FileSystem.ts:260

Recursively make directories

**Parameters:**

Name | Type | Default |
------ | ------ | ------ |
`destination` | string | - |
`mode` | string &#124; number &#124; null &#124; undefined | undefined |

**Returns:** *boolean*

___

###  openFolderInExplorer

▸ **openFolderInExplorer**(`folder`: string): *void*

Defined in src/core/io/FileSystem.ts:367

Helper funcion to open a folder in the user's file manager

**`export`** 

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`folder` | string | folder to open  |

**Returns:** *void*

___

###  readFileSync

▸ **readFileSync**(`source`: string, `options?`: string | object): *any*

Defined in src/core/io/FileSystem.ts:288

**Parameters:**

Name | Type |
------ | ------ |
`source` | string |
`options?` | string &#124; object |

**Returns:** *any*

___

###  recurse

▸ **recurse**(`source`: string, `destination`: string, `func`: function): *Promise‹boolean›*

Defined in src/core/io/FileSystem.ts:126

Recursively apply a function on a pair of files or directories from source to dest.

**`throws`** Error if function fails

**Parameters:**

▪ **source**: *string*

source file or folder

▪ **destination**: *string*

destination file or folder

▪ **func**: *function*

function to apply between src and dest

▸ (`src`: string, `dest`: string): *Promise‹boolean›*

**Parameters:**

Name | Type |
------ | ------ |
`src` | string |
`dest` | string |

**Returns:** *Promise‹boolean›*

if recursion should continue

___

###  stats

▸ **stats**(`item`: string): *Stats | null*

Defined in src/core/io/FileSystem.ts:78

**Parameters:**

Name | Type |
------ | ------ |
`item` | string |

**Returns:** *Stats | null*

___

###  unzip

▸ **unzip**(`archive`: string, `destination`: string): *Promise‹number›*

Defined in src/core/io/FileSystem.ts:296

**Parameters:**

Name | Type |
------ | ------ |
`archive` | string |
`destination` | string |

**Returns:** *Promise‹number›*

___

###  walk

▸ **walk**(`item`: string, `predicate?`: function): *Promise‹any[] | null›*

Defined in src/core/io/FileSystem.ts:86

**Parameters:**

▪ **item**: *string*

▪`Optional`  **predicate**: *function*

▸ (`item`: string): *boolean*

**Parameters:**

Name | Type |
------ | ------ |
`item` | string |

**Returns:** *Promise‹any[] | null›*

___

###  walkSync

▸ **walkSync**(`item`: string): *string[]*

Defined in src/core/io/FileSystem.ts:98

**Parameters:**

Name | Type |
------ | ------ |
`item` | string |

**Returns:** *string[]*

___

###  writeFileSync

▸ **writeFileSync**(`destination`: string, `data`: any, `options?`: object | string | null): *void*

Defined in src/core/io/FileSystem.ts:292

**Parameters:**

Name | Type |
------ | ------ |
`destination` | string |
`data` | any |
`options?` | object &#124; string &#124; null |

**Returns:** *void*

___

###  zip

▸ **zip**(`out`: string, `items`: string[], `rootPath?`: string): *Promise‹void›*

Defined in src/core/io/FileSystem.ts:319

**Parameters:**

Name | Type |
------ | ------ |
`out` | string |
`items` | string[] |
`rootPath?` | string |

**Returns:** *Promise‹void›*

___

###  zipFolder

▸ **zipFolder**(`out`: string, `source`: string, `subfolderName`: string | false): *Promise‹void›*

Defined in src/core/io/FileSystem.ts:343

**Parameters:**

Name | Type | Default |
------ | ------ | ------ |
`out` | string | - |
`source` | string | - |
`subfolderName` | string &#124; false | false |

**Returns:** *Promise‹void›*
