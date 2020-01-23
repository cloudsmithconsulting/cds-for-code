---
id: "_components_webdownloaders_types_.extensionicontheme"
title: "ExtensionIconTheme"
sidebar_label: "ExtensionIconTheme"
---

[cds-for-code](../index.md) › [Globals](../globals.md) › ["components/WebDownloaders/Types"](../modules/_components_webdownloaders_types_.md) › [ExtensionIconTheme](_components_webdownloaders_types_.extensionicontheme.md)

## Hierarchy

* **ExtensionIconTheme**

## Index

### Constructors

* [constructor](_components_webdownloaders_types_.extensionicontheme.md#constructor)

### Properties

* [darkColor](_components_webdownloaders_types_.extensionicontheme.md#darkcolor)
* [lightColor](_components_webdownloaders_types_.extensionicontheme.md#lightcolor)
* [mappings](_components_webdownloaders_types_.extensionicontheme.md#mappings)
* [name](_components_webdownloaders_types_.extensionicontheme.md#name)

### Accessors

* [icons](_components_webdownloaders_types_.extensionicontheme.md#icons)

### Methods

* [downloadIcons](_components_webdownloaders_types_.extensionicontheme.md#downloadicons)
* [resolve](_components_webdownloaders_types_.extensionicontheme.md#resolve)
* [getIcons](_components_webdownloaders_types_.extensionicontheme.md#static-private-geticons)

## Constructors

###  constructor

\+ **new ExtensionIconTheme**(`name`: string, `mappings`: [Dictionary](_core_types_dictionary_.dictionary.md)‹[ExtensionIcon](../modules/_components_webdownloaders_types_.md#extensionicon), string›, `lightColor?`: string, `darkColor?`: string): *[ExtensionIconTheme](_components_webdownloaders_types_.extensionicontheme.md)*

Defined in src/components/WebDownloaders/Types.ts:64

**Parameters:**

Name | Type |
------ | ------ |
`name` | string |
`mappings` | [Dictionary](_core_types_dictionary_.dictionary.md)‹[ExtensionIcon](../modules/_components_webdownloaders_types_.md#extensionicon), string› |
`lightColor?` | string |
`darkColor?` | string |

**Returns:** *[ExtensionIconTheme](_components_webdownloaders_types_.extensionicontheme.md)*

## Properties

###  darkColor

• **darkColor**: *string*

Defined in src/components/WebDownloaders/Types.ts:78

___

###  lightColor

• **lightColor**: *string*

Defined in src/components/WebDownloaders/Types.ts:77

___

###  mappings

• **mappings**: *[Dictionary](_core_types_dictionary_.dictionary.md)‹[ExtensionIcon](../modules/_components_webdownloaders_types_.md#extensionicon), string›*

Defined in src/components/WebDownloaders/Types.ts:79

___

###  name

• **name**: *string*

Defined in src/components/WebDownloaders/Types.ts:76

## Accessors

###  icons

• **get icons**(): *Enumerator‹[IconifyIcon](_components_webdownloaders_types_.iconifyicon.md)›*

Defined in src/components/WebDownloaders/Types.ts:72

**Returns:** *Enumerator‹[IconifyIcon](_components_webdownloaders_types_.iconifyicon.md)›*

## Methods

###  downloadIcons

▸ **downloadIcons**(`folder`: string): *Promise‹string›*

Defined in src/components/WebDownloaders/Types.ts:94

**Parameters:**

Name | Type |
------ | ------ |
`folder` | string |

**Returns:** *Promise‹string›*

___

###  resolve

▸ **resolve**(`folder`: string, `icon`: [ExtensionIcon](../modules/_components_webdownloaders_types_.md#extensionicon)): *[IconResolver](_components_webdownloaders_types_.iconresolver.md)*

Defined in src/components/WebDownloaders/Types.ts:81

**Parameters:**

Name | Type |
------ | ------ |
`folder` | string |
`icon` | [ExtensionIcon](../modules/_components_webdownloaders_types_.md#extensionicon) |

**Returns:** *[IconResolver](_components_webdownloaders_types_.iconresolver.md)*

___

### `Static` `Private` getIcons

▸ **getIcons**(`mappings`: [Dictionary](_core_types_dictionary_.dictionary.md)‹[ExtensionIcon](../modules/_components_webdownloaders_types_.md#extensionicon), string›, `lightColor?`: string, `darkColor?`: string): *[IconifyIcon](_components_webdownloaders_types_.iconifyicon.md)[]*

Defined in src/components/WebDownloaders/Types.ts:126

**Parameters:**

Name | Type |
------ | ------ |
`mappings` | [Dictionary](_core_types_dictionary_.dictionary.md)‹[ExtensionIcon](../modules/_components_webdownloaders_types_.md#extensionicon), string› |
`lightColor?` | string |
`darkColor?` | string |

**Returns:** *[IconifyIcon](_components_webdownloaders_types_.iconifyicon.md)[]*
