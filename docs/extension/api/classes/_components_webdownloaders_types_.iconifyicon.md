---
id: "_components_webdownloaders_types_.iconifyicon"
title: "IconifyIcon"
sidebar_label: "IconifyIcon"
---

[cds-for-code](../index.md) › [Globals](../globals.md) › ["components/WebDownloaders/Types"](../modules/_components_webdownloaders_types_.md) › [IconifyIcon](_components_webdownloaders_types_.iconifyicon.md)

## Hierarchy

* **IconifyIcon**

## Index

### Constructors

* [constructor](_components_webdownloaders_types_.iconifyicon.md#constructor)

### Properties

* [_color](_components_webdownloaders_types_.iconifyicon.md#private-_color)
* [annotation](_components_webdownloaders_types_.iconifyicon.md#annotation)
* [extensionIcon](_components_webdownloaders_types_.iconifyicon.md#extensionicon)
* [format](_components_webdownloaders_types_.iconifyicon.md#format)
* [height](_components_webdownloaders_types_.iconifyicon.md#optional-height)
* [name](_components_webdownloaders_types_.iconifyicon.md#name)
* [width](_components_webdownloaders_types_.iconifyicon.md#optional-width)

### Accessors

* [color](_components_webdownloaders_types_.iconifyicon.md#color)
* [mappedOutputFile](_components_webdownloaders_types_.iconifyicon.md#mappedoutputfile)
* [mimeType](_components_webdownloaders_types_.iconifyicon.md#mimetype)
* [outputfile](_components_webdownloaders_types_.iconifyicon.md#outputfile)
* [url](_components_webdownloaders_types_.iconifyicon.md#url)

### Methods

* [isColorCode](_components_webdownloaders_types_.iconifyicon.md#private-iscolorcode)
* [toQueryObject](_components_webdownloaders_types_.iconifyicon.md#private-toqueryobject)

## Constructors

###  constructor

\+ **new IconifyIcon**(`name`: string, `color?`: string, `annotation?`: string, `height`: number, `width`: number, `format`: [ScriptedIconFormat](../enums/_components_webdownloaders_types_.scriptediconformat.md), `extensionIcon?`: [ExtensionIcon](../modules/_components_webdownloaders_types_.md#extensionicon)): *[IconifyIcon](_components_webdownloaders_types_.iconifyicon.md)*

Defined in src/components/WebDownloaders/Types.ts:210

**Parameters:**

Name | Type | Default |
------ | ------ | ------ |
`name` | string | - |
`color?` | string | - |
`annotation?` | string | - |
`height` | number | 0 |
`width` | number | 0 |
`format` | [ScriptedIconFormat](../enums/_components_webdownloaders_types_.scriptediconformat.md) | ScriptedIconFormat.svg |
`extensionIcon?` | [ExtensionIcon](../modules/_components_webdownloaders_types_.md#extensionicon) | - |

**Returns:** *[IconifyIcon](_components_webdownloaders_types_.iconifyicon.md)*

## Properties

### `Private` _color

• **_color**: *string*

Defined in src/components/WebDownloaders/Types.ts:203

___

###  annotation

• **annotation**: *string*

Defined in src/components/WebDownloaders/Types.ts:209

___

###  extensionIcon

• **extensionIcon**: *[ExtensionIcon](../modules/_components_webdownloaders_types_.md#extensionicon)*

Defined in src/components/WebDownloaders/Types.ts:210

___

###  format

• **format**: *[ScriptedIconFormat](../enums/_components_webdownloaders_types_.scriptediconformat.md)*

Defined in src/components/WebDownloaders/Types.ts:208

___

### `Optional` height

• **height**? : *number*

Defined in src/components/WebDownloaders/Types.ts:205

___

###  name

• **name**: *string*

Defined in src/components/WebDownloaders/Types.ts:207

___

### `Optional` width

• **width**? : *number*

Defined in src/components/WebDownloaders/Types.ts:206

## Accessors

###  color

• **get color**(): *string*

Defined in src/components/WebDownloaders/Types.ts:222

**Returns:** *string*

• **set color**(`value`: string): *void*

Defined in src/components/WebDownloaders/Types.ts:223

**Parameters:**

Name | Type |
------ | ------ |
`value` | string |

**Returns:** *void*

___

###  mappedOutputFile

• **get mappedOutputFile**(): *string*

Defined in src/components/WebDownloaders/Types.ts:233

**Returns:** *string*

___

###  mimeType

• **get mimeType**(): *string*

Defined in src/components/WebDownloaders/Types.ts:241

**Returns:** *string*

___

###  outputfile

• **get outputfile**(): *string*

Defined in src/components/WebDownloaders/Types.ts:237

**Returns:** *string*

___

###  url

• **get url**(): *string*

Defined in src/components/WebDownloaders/Types.ts:229

**Returns:** *string*

## Methods

### `Private` isColorCode

▸ **isColorCode**(`value`: string): *boolean*

Defined in src/components/WebDownloaders/Types.ts:252

**Parameters:**

Name | Type |
------ | ------ |
`value` | string |

**Returns:** *boolean*

___

### `Private` toQueryObject

▸ **toQueryObject**(): *any*

Defined in src/components/WebDownloaders/Types.ts:256

**Returns:** *any*
