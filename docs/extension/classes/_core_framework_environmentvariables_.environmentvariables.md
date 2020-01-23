[cds-for-code](../README.md) › [Globals](../globals.md) › ["core/framework/EnvironmentVariables"](../modules/_core_framework_environmentvariables_.md) › [EnvironmentVariables](_core_framework_environmentvariables_.environmentvariables.md)

# Class: EnvironmentVariables

## Hierarchy

* **EnvironmentVariables**

## Index

### Constructors

* [constructor](_core_framework_environmentvariables_.environmentvariables.md#constructor)

### Properties

* [_envVariables](_core_framework_environmentvariables_.environmentvariables.md#private-_envvariables)
* [VARIABLE_REGEXP](_core_framework_environmentvariables_.environmentvariables.md#static-variable_regexp)

### Methods

* [findVariables](_core_framework_environmentvariables_.environmentvariables.md#private-findvariables)
* [hasDriveLetter](_core_framework_environmentvariables_.environmentvariables.md#private-hasdriveletter)
* [normalizeDriveLetter](_core_framework_environmentvariables_.environmentvariables.md#private-normalizedriveletter)
* [resolve](_core_framework_environmentvariables_.environmentvariables.md#resolve)
* [resolveCommands](_core_framework_environmentvariables_.environmentvariables.md#private-resolvecommands)
* [resolveFromMap](_core_framework_environmentvariables_.environmentvariables.md#private-resolvefrommap)
* [sequence](_core_framework_environmentvariables_.environmentvariables.md#private-sequence)

## Constructors

###  constructor

\+ **new EnvironmentVariables**(`envVariables`: ProcessEnv): *[EnvironmentVariables](_core_framework_environmentvariables_.environmentvariables.md)*

Defined in src/core/framework/EnvironmentVariables.ts:21

**Parameters:**

Name | Type | Default |
------ | ------ | ------ |
`envVariables` | ProcessEnv | process.env |

**Returns:** *[EnvironmentVariables](_core_framework_environmentvariables_.environmentvariables.md)*

## Properties

### `Private` _envVariables

• **_envVariables**: *object*

Defined in src/core/framework/EnvironmentVariables.ts:21

#### Type declaration:

* \[ **key**: *string*\]: string

___

### `Static` VARIABLE_REGEXP

▪ **VARIABLE_REGEXP**: *RegExp‹›* = /\$\{(.*?)\}/g

Defined in src/core/framework/EnvironmentVariables.ts:19

## Methods

### `Private` findVariables

▸ **findVariables**(`cmdVar`: RegExp, `object`: any, `commands`: string[]): *void*

Defined in src/core/framework/EnvironmentVariables.ts:60

Finds all variables in object using cmdVar and pushes them into commands.

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`cmdVar` | RegExp | Regex to use for finding variables. |
`object` | any | object is searched for variables. |
`commands` | string[] | All found variables are returned in commands.  |

**Returns:** *void*

___

### `Private` hasDriveLetter

▸ **hasDriveLetter**(`path`: string): *boolean*

Defined in src/core/framework/EnvironmentVariables.ts:160

**Parameters:**

Name | Type |
------ | ------ |
`path` | string |

**Returns:** *boolean*

___

### `Private` normalizeDriveLetter

▸ **normalizeDriveLetter**(`path`: string): *string*

Defined in src/core/framework/EnvironmentVariables.ts:164

**Parameters:**

Name | Type |
------ | ------ |
`path` | string |

**Returns:** *string*

___

###  resolve

▸ **resolve**(`value`: string): *Promise‹string›*

Defined in src/core/framework/EnvironmentVariables.ts:172

**Parameters:**

Name | Type |
------ | ------ |
`value` | string |

**Returns:** *Promise‹string›*

___

### `Private` resolveCommands

▸ **resolveCommands**(`configuration`: any): *Promise‹object | undefined›*

Defined in src/core/framework/EnvironmentVariables.ts:128

**Parameters:**

Name | Type |
------ | ------ |
`configuration` | any |

**Returns:** *Promise‹object | undefined›*

___

### `Private` resolveFromMap

▸ **resolveFromMap**(`match`: string, `argument`: string, `commandValueMapping`: object, `prefix`: string): *string*

Defined in src/core/framework/EnvironmentVariables.ts:114

**Parameters:**

Name | Type |
------ | ------ |
`match` | string |
`argument` | string |
`commandValueMapping` | object |
`prefix` | string |

**Returns:** *string*

___

### `Private` sequence

▸ **sequence**<**T**>(`promiseFactories`: function[]): *Promise‹T[]›*

Defined in src/core/framework/EnvironmentVariables.ts:88

**Type parameters:**

▪ **T**

**Parameters:**

Name | Type |
------ | ------ |
`promiseFactories` | function[] |

**Returns:** *Promise‹T[]›*
