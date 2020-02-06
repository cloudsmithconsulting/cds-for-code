---
id: "_core_webui_viewrenderer_.viewrenderer"
title: "ViewRenderer"
sidebar_label: "ViewRenderer"
---

[cds-for-code](../index.md) › [Globals](../globals.md) › ["core/webui/ViewRenderer"](../modules/_core_webui_viewrenderer_.md) › [ViewRenderer](_core_webui_viewrenderer_.viewrenderer.md)

## Hierarchy

* **ViewRenderer**

## Index

### Constructors

* [constructor](_core_webui_viewrenderer_.viewrenderer.md#constructor)

### Properties

* [_images](_core_webui_viewrenderer_.viewrenderer.md#private-_images)
* [_scripts](_core_webui_viewrenderer_.viewrenderer.md#private-_scripts)
* [_styleSheets](_core_webui_viewrenderer_.viewrenderer.md#private-_stylesheets)
* [nonce](_core_webui_viewrenderer_.viewrenderer.md#nonce)
* [view](_core_webui_viewrenderer_.viewrenderer.md#private-view)

### Methods

* [addFrameworkScript](_core_webui_viewrenderer_.viewrenderer.md#addframeworkscript)
* [addFrameworkStylesheet](_core_webui_viewrenderer_.viewrenderer.md#addframeworkstylesheet)
* [addImage](_core_webui_viewrenderer_.viewrenderer.md#addimage)
* [addScript](_core_webui_viewrenderer_.viewrenderer.md#addscript)
* [addStyleSheet](_core_webui_viewrenderer_.viewrenderer.md#addstylesheet)
* [getFileUri](_core_webui_viewrenderer_.viewrenderer.md#private-getfileuri)
* [getImageUri](_core_webui_viewrenderer_.viewrenderer.md#getimageuri)
* [getNonce](_core_webui_viewrenderer_.viewrenderer.md#private-getnonce)
* [insertFrameworkScript](_core_webui_viewrenderer_.viewrenderer.md#insertframeworkscript)
* [insertFrameworkStylesheet](_core_webui_viewrenderer_.viewrenderer.md#insertframeworkstylesheet)
* [insertScriptAt](_core_webui_viewrenderer_.viewrenderer.md#private-insertscriptat)
* [render](_core_webui_viewrenderer_.viewrenderer.md#render)
* [renderFile](_core_webui_viewrenderer_.viewrenderer.md#renderfile)

## Constructors

###  constructor

\+ **new ViewRenderer**(`view`: [View](_core_webui_view_.view.md)): *[ViewRenderer](_core_webui_viewrenderer_.viewrenderer.md)*

Defined in src/core/webui/ViewRenderer.ts:17

**Parameters:**

Name | Type |
------ | ------ |
`view` | [View](_core_webui_view_.view.md) |

**Returns:** *[ViewRenderer](_core_webui_viewrenderer_.viewrenderer.md)*

## Properties

### `Private` _images

• **_images**: *[Dictionary](_core_types_dictionary_.dictionary.md)‹string, Uri›* = new Dictionary()

Defined in src/core/webui/ViewRenderer.ts:13

___

### `Private` _scripts

• **_scripts**: *[Dictionary](_core_types_dictionary_.dictionary.md)‹string, Uri›* = new Dictionary()

Defined in src/core/webui/ViewRenderer.ts:14

___

### `Private` _styleSheets

• **_styleSheets**: *[Dictionary](_core_types_dictionary_.dictionary.md)‹string, Uri›* = new Dictionary()

Defined in src/core/webui/ViewRenderer.ts:15

___

###  nonce

• **nonce**: *string*

Defined in src/core/webui/ViewRenderer.ts:17

___

### `Private` view

• **view**: *[View](_core_webui_view_.view.md)*

Defined in src/core/webui/ViewRenderer.ts:12

## Methods

###  addFrameworkScript

▸ **addFrameworkScript**(`scriptName`: string): *void*

Defined in src/core/webui/ViewRenderer.ts:36

**Parameters:**

Name | Type |
------ | ------ |
`scriptName` | string |

**Returns:** *void*

___

###  addFrameworkStylesheet

▸ **addFrameworkStylesheet**(`cssName`: string): *void*

Defined in src/core/webui/ViewRenderer.ts:44

**Parameters:**

Name | Type |
------ | ------ |
`cssName` | string |

**Returns:** *void*

___

###  addImage

▸ **addImage**(`imageName`: string): *void*

Defined in src/core/webui/ViewRenderer.ts:24

**Parameters:**

Name | Type |
------ | ------ |
`imageName` | string |

**Returns:** *void*

___

###  addScript

▸ **addScript**(`scriptName`: string): *void*

Defined in src/core/webui/ViewRenderer.ts:28

**Parameters:**

Name | Type |
------ | ------ |
`scriptName` | string |

**Returns:** *void*

___

###  addStyleSheet

▸ **addStyleSheet**(`styleSheetName`: string): *void*

Defined in src/core/webui/ViewRenderer.ts:52

**Parameters:**

Name | Type |
------ | ------ |
`styleSheetName` | string |

**Returns:** *void*

___

### `Private` getFileUri

▸ **getFileUri**(...`paths`: string[]): *Uri*

Defined in src/core/webui/ViewRenderer.ts:56

**Parameters:**

Name | Type |
------ | ------ |
`...paths` | string[] |

**Returns:** *Uri*

___

###  getImageUri

▸ **getImageUri**(`imageName`: string): *Uri*

Defined in src/core/webui/ViewRenderer.ts:61

**Parameters:**

Name | Type |
------ | ------ |
`imageName` | string |

**Returns:** *Uri*

___

### `Private` getNonce

▸ **getNonce**(): *string*

Defined in src/core/webui/ViewRenderer.ts:65

**Returns:** *string*

___

###  insertFrameworkScript

▸ **insertFrameworkScript**(`scriptName`: string): *void*

Defined in src/core/webui/ViewRenderer.ts:40

**Parameters:**

Name | Type |
------ | ------ |
`scriptName` | string |

**Returns:** *void*

___

###  insertFrameworkStylesheet

▸ **insertFrameworkStylesheet**(`cssName`: string): *void*

Defined in src/core/webui/ViewRenderer.ts:48

**Parameters:**

Name | Type |
------ | ------ |
`cssName` | string |

**Returns:** *void*

___

### `Private` insertScriptAt

▸ **insertScriptAt**(`index`: number, `scriptName`: string): *void*

Defined in src/core/webui/ViewRenderer.ts:32

**Parameters:**

Name | Type |
------ | ------ |
`index` | number |
`scriptName` | string |

**Returns:** *void*

___

###  render

▸ **render**(`htmlParial`: string, `useCsp?`: boolean): *string*

Defined in src/core/webui/ViewRenderer.ts:96

**Parameters:**

Name | Type |
------ | ------ |
`htmlParial` | string |
`useCsp?` | boolean |

**Returns:** *string*

___

###  renderFile

▸ **renderFile**(`webviewFileName`: string, `useCsp?`: boolean): *string*

Defined in src/core/webui/ViewRenderer.ts:76

**Parameters:**

Name | Type |
------ | ------ |
`webviewFileName` | string |
`useCsp?` | boolean |

**Returns:** *string*
