---
id: "_core_extensioncontext_.extensioncontext"
title: "ExtensionContext"
sidebar_label: "ExtensionContext"
---

[cds-for-code](../index.md) › [Globals](../globals.md) › ["core/ExtensionContext"](../modules/_core_extensioncontext_.md) › [ExtensionContext](_core_extensioncontext_.extensioncontext.md)

## Hierarchy

* **ExtensionContext**

## Index

### Constructors

* [constructor](_core_extensioncontext_.extensioncontext.md#constructor)

### Properties

* [_disposables](_core_extensioncontext_.extensioncontext.md#static-private-_disposables)
* [_instance](_core_extensioncontext_.extensioncontext.md#static-private-_instance)
* [_onActivate](_core_extensioncontext_.extensioncontext.md#static-private-_onactivate)
* [_onDeactivate](_core_extensioncontext_.extensioncontext.md#static-private-_ondeactivate)

### Accessors

* [Instance](_core_extensioncontext_.extensioncontext.md#static-instance)
* [isDebugging](_core_extensioncontext_.extensioncontext.md#static-isdebugging)

### Methods

* [activate](_core_extensioncontext_.extensioncontext.md#activate)
* [deactivate](_core_extensioncontext_.extensioncontext.md#deactivate)
* [registerActivateFunction](_core_extensioncontext_.extensioncontext.md#static-registeractivatefunction)
* [registerCommand](_core_extensioncontext_.extensioncontext.md#static-registercommand)
* [registerDeactivateFunction](_core_extensioncontext_.extensioncontext.md#static-registerdeactivatefunction)
* [subscribe](_core_extensioncontext_.extensioncontext.md#static-subscribe)

## Constructors

###  constructor

\+ **new ExtensionContext**(`context`: ExtensionContext): *[ExtensionContext](_core_extensioncontext_.extensioncontext.md)*

Defined in src/core/ExtensionContext.ts:4

**Parameters:**

Name | Type |
------ | ------ |
`context` | ExtensionContext |

**Returns:** *[ExtensionContext](_core_extensioncontext_.extensioncontext.md)*

## Properties

### `Static` `Private` _disposables

▪ **_disposables**: *Disposable[]* = []

Defined in src/core/ExtensionContext.ts:14

___

### `Static` `Private` _instance

▪ **_instance**: *ExtensionContext*

Defined in src/core/ExtensionContext.ts:13

___

### `Static` `Private` _onActivate

▪ **_onActivate**: *[Dictionary](_core_types_dictionary_.dictionary.md)‹string, any[]›* = new Dictionary<string, any[]>()

Defined in src/core/ExtensionContext.ts:11

___

### `Static` `Private` _onDeactivate

▪ **_onDeactivate**: *[Dictionary](_core_types_dictionary_.dictionary.md)‹string, any[]›* = new Dictionary<string, any[]>()

Defined in src/core/ExtensionContext.ts:12

## Accessors

### `Static` Instance

• **get Instance**(): *ExtensionContext*

Defined in src/core/ExtensionContext.ts:16

**Returns:** *ExtensionContext*

___

### `Static` isDebugging

• **get isDebugging**(): *boolean*

Defined in src/core/ExtensionContext.ts:66

**Returns:** *boolean*

## Methods

###  activate

▸ **activate**(`id?`: string, `config?`: WorkspaceConfiguration): *Promise‹void›*

Defined in src/core/ExtensionContext.ts:50

**Parameters:**

Name | Type |
------ | ------ |
`id?` | string |
`config?` | WorkspaceConfiguration |

**Returns:** *Promise‹void›*

___

###  deactivate

▸ **deactivate**(`id?`: string, `config?`: WorkspaceConfiguration): *Promise‹void›*

Defined in src/core/ExtensionContext.ts:58

**Parameters:**

Name | Type |
------ | ------ |
`id?` | string |
`config?` | WorkspaceConfiguration |

**Returns:** *Promise‹void›*

___

### `Static` registerActivateFunction

▸ **registerActivateFunction**(`id`: string, `event`: any): *void*

Defined in src/core/ExtensionContext.ts:34

**Parameters:**

Name | Type |
------ | ------ |
`id` | string |
`event` | any |

**Returns:** *void*

___

### `Static` registerCommand

▸ **registerCommand**(`command`: string, `callback`: function, `thisArg?`: any): *void*

Defined in src/core/ExtensionContext.ts:28

**Parameters:**

▪ **command**: *string*

▪ **callback**: *function*

▸ (...`args`: any[]): *any*

**Parameters:**

Name | Type |
------ | ------ |
`...args` | any[] |

▪`Optional`  **thisArg**: *any*

**Returns:** *void*

___

### `Static` registerDeactivateFunction

▸ **registerDeactivateFunction**(`id`: string, `event`: any): *void*

Defined in src/core/ExtensionContext.ts:42

**Parameters:**

Name | Type |
------ | ------ |
`id` | string |
`event` | any |

**Returns:** *void*

___

### `Static` subscribe

▸ **subscribe**(`item`: Disposable): *void*

Defined in src/core/ExtensionContext.ts:20

**Parameters:**

Name | Type |
------ | ------ |
`item` | Disposable |

**Returns:** *void*
