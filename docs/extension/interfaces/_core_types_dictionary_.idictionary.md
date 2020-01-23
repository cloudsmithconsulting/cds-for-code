[cds-for-code](../README.md) › [Globals](../globals.md) › ["core/types/Dictionary"](../modules/_core_types_dictionary_.md) › [IDictionary](_core_types_dictionary_.idictionary.md)

# Interface: IDictionary <**TKey, T**>

## Type parameters

▪ **TKey**

▪ **T**

## Hierarchy

* **IDictionary**

## Implemented by

* [Dictionary](../classes/_core_types_dictionary_.dictionary.md)

## Index

### Properties

* [keys](_core_types_dictionary_.idictionary.md#keys)
* [length](_core_types_dictionary_.idictionary.md#length)
* [values](_core_types_dictionary_.idictionary.md#values)

### Methods

* [add](_core_types_dictionary_.idictionary.md#add)
* [containsKey](_core_types_dictionary_.idictionary.md#containskey)
* [get](_core_types_dictionary_.idictionary.md#get)
* [getKey](_core_types_dictionary_.idictionary.md#getkey)
* [insert](_core_types_dictionary_.idictionary.md#insert)
* [remove](_core_types_dictionary_.idictionary.md#remove)

## Properties

###  keys

• **keys**: *TKey[]*

Defined in src/core/types/Dictionary.ts:7

___

###  length

• **length**: *number*

Defined in src/core/types/Dictionary.ts:8

___

###  values

• **values**: *T[]*

Defined in src/core/types/Dictionary.ts:10

## Methods

###  add

▸ **add**(`key`: TKey, `value`: T): *void*

Defined in src/core/types/Dictionary.ts:2

**Parameters:**

Name | Type |
------ | ------ |
`key` | TKey |
`value` | T |

**Returns:** *void*

___

###  containsKey

▸ **containsKey**(`key`: TKey): *boolean*

Defined in src/core/types/Dictionary.ts:4

**Parameters:**

Name | Type |
------ | ------ |
`key` | TKey |

**Returns:** *boolean*

___

###  get

▸ **get**(`key`: TKey): *T*

Defined in src/core/types/Dictionary.ts:5

**Parameters:**

Name | Type |
------ | ------ |
`key` | TKey |

**Returns:** *T*

___

###  getKey

▸ **getKey**(`value`: T): *TKey | undefined*

Defined in src/core/types/Dictionary.ts:6

**Parameters:**

Name | Type |
------ | ------ |
`value` | T |

**Returns:** *TKey | undefined*

___

###  insert

▸ **insert**(`index`: number, `key`: TKey, `value`: T): *void*

Defined in src/core/types/Dictionary.ts:3

**Parameters:**

Name | Type |
------ | ------ |
`index` | number |
`key` | TKey |
`value` | T |

**Returns:** *void*

___

###  remove

▸ **remove**(`key`: TKey): *void*

Defined in src/core/types/Dictionary.ts:9

**Parameters:**

Name | Type |
------ | ------ |
`key` | TKey |

**Returns:** *void*
