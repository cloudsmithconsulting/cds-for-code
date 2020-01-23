---
id: "_core_types_dictionary_.dictionary"
title: "Dictionary"
sidebar_label: "Dictionary"
---

[cds-for-code](../index.md) › [Globals](../globals.md) › ["core/types/Dictionary"](../modules/_core_types_dictionary_.md) › [Dictionary](_core_types_dictionary_.dictionary.md)

## Type parameters

▪ **TKey**

▪ **T**

## Hierarchy

* **Dictionary**

## Implements

* [IDictionary](../interfaces/_core_types_dictionary_.idictionary.md)‹TKey, T›

## Index

### Constructors

* [constructor](_core_types_dictionary_.dictionary.md#constructor)

### Properties

* [_keys](_core_types_dictionary_.dictionary.md#private-_keys)
* [_values](_core_types_dictionary_.dictionary.md#private-_values)

### Accessors

* [keys](_core_types_dictionary_.dictionary.md#keys)
* [length](_core_types_dictionary_.dictionary.md#length)
* [values](_core_types_dictionary_.dictionary.md#values)

### Methods

* [add](_core_types_dictionary_.dictionary.md#add)
* [containsKey](_core_types_dictionary_.dictionary.md#containskey)
* [forEach](_core_types_dictionary_.dictionary.md#foreach)
* [get](_core_types_dictionary_.dictionary.md#get)
* [getKey](_core_types_dictionary_.dictionary.md#getkey)
* [insert](_core_types_dictionary_.dictionary.md#insert)
* [map](_core_types_dictionary_.dictionary.md#map)
* [remove](_core_types_dictionary_.dictionary.md#remove)
* [set](_core_types_dictionary_.dictionary.md#set)
* [toLookup](_core_types_dictionary_.dictionary.md#tolookup)
* [parse](_core_types_dictionary_.dictionary.md#static-parse)

## Constructors

###  constructor

\+ **new Dictionary**(`init?`: object[]): *[Dictionary](_core_types_dictionary_.dictionary.md)*

Defined in src/core/types/Dictionary.ts:19

**Parameters:**

Name | Type |
------ | ------ |
`init?` | object[] |

**Returns:** *[Dictionary](_core_types_dictionary_.dictionary.md)*

## Properties

### `Private` _keys

• **_keys**: *TKey[]* = []

Defined in src/core/types/Dictionary.ts:14

___

### `Private` _values

• **_values**: *T[]* = []

Defined in src/core/types/Dictionary.ts:15

## Accessors

###  keys

• **get keys**(): *TKey[]*

Defined in src/core/types/Dictionary.ts:66

**Returns:** *TKey[]*

___

###  length

• **get length**(): *number*

Defined in src/core/types/Dictionary.ts:70

**Returns:** *number*

___

###  values

• **get values**(): *T[]*

Defined in src/core/types/Dictionary.ts:74

**Returns:** *T[]*

## Methods

###  add

▸ **add**(`key`: TKey, `value`: T): *void*

*Implementation of [IDictionary](../interfaces/_core_types_dictionary_.idictionary.md)*

Defined in src/core/types/Dictionary.ts:29

**Parameters:**

Name | Type |
------ | ------ |
`key` | TKey |
`value` | T |

**Returns:** *void*

___

###  containsKey

▸ **containsKey**(`key`: TKey): *boolean*

*Implementation of [IDictionary](../interfaces/_core_types_dictionary_.idictionary.md)*

Defined in src/core/types/Dictionary.ts:78

**Parameters:**

Name | Type |
------ | ------ |
`key` | TKey |

**Returns:** *boolean*

___

###  forEach

▸ **forEach**(`apply`: function): *void*

Defined in src/core/types/Dictionary.ts:86

**Parameters:**

▪ **apply**: *function*

▸ (`key`: TKey, `value`: T): *void*

**Parameters:**

Name | Type |
------ | ------ |
`key` | TKey |
`value` | T |

**Returns:** *void*

___

###  get

▸ **get**(`key`: TKey): *T*

*Implementation of [IDictionary](../interfaces/_core_types_dictionary_.idictionary.md)*

Defined in src/core/types/Dictionary.ts:52

**Parameters:**

Name | Type |
------ | ------ |
`key` | TKey |

**Returns:** *T*

___

###  getKey

▸ **getKey**(`value`: T): *TKey | undefined*

*Implementation of [IDictionary](../interfaces/_core_types_dictionary_.idictionary.md)*

Defined in src/core/types/Dictionary.ts:56

**Parameters:**

Name | Type |
------ | ------ |
`value` | T |

**Returns:** *TKey | undefined*

___

###  insert

▸ **insert**(`index`: number, `key`: TKey, `value`: T): *void*

*Implementation of [IDictionary](../interfaces/_core_types_dictionary_.idictionary.md)*

Defined in src/core/types/Dictionary.ts:36

**Parameters:**

Name | Type |
------ | ------ |
`index` | number |
`key` | TKey |
`value` | T |

**Returns:** *void*

___

###  map

▸ **map**(`apply`: function): *object*

Defined in src/core/types/Dictionary.ts:90

**Parameters:**

▪ **apply**: *function*

▸ (`key`: TKey, `value`: T): *any*

**Parameters:**

Name | Type |
------ | ------ |
`key` | TKey |
`value` | T |

**Returns:** *object*

* \[ **key**: *string*\]: any

___

###  remove

▸ **remove**(`key`: TKey): *void*

*Implementation of [IDictionary](../interfaces/_core_types_dictionary_.idictionary.md)*

Defined in src/core/types/Dictionary.ts:43

**Parameters:**

Name | Type |
------ | ------ |
`key` | TKey |

**Returns:** *void*

___

###  set

▸ **set**(`key`: TKey, `value`: T): *void*

Defined in src/core/types/Dictionary.ts:100

**Parameters:**

Name | Type |
------ | ------ |
`key` | TKey |
`value` | T |

**Returns:** *void*

___

###  toLookup

▸ **toLookup**(): *[IDictionary](../interfaces/_core_types_dictionary_.idictionary.md)‹TKey, T›*

Defined in src/core/types/Dictionary.ts:108

**Returns:** *[IDictionary](../interfaces/_core_types_dictionary_.idictionary.md)‹TKey, T›*

___

### `Static` parse

▸ **parse**<**TKey**, **T**>(`init?`: object[]): *[Dictionary](_core_types_dictionary_.dictionary.md)‹TKey, T›*

Defined in src/core/types/Dictionary.ts:17

**Type parameters:**

▪ **TKey**

▪ **T**

**Parameters:**

Name | Type |
------ | ------ |
`init?` | object[] |

**Returns:** *[Dictionary](_core_types_dictionary_.dictionary.md)‹TKey, T›*
