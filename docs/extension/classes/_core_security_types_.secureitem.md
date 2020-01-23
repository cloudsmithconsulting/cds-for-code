[cds-for-code](../README.md) › [Globals](../globals.md) › ["core/security/Types"](../modules/_core_security_types_.md) › [SecureItem](_core_security_types_.secureitem.md)

# Class: SecureItem

Represents a secure item (string or buffer) with the needed components
(minus key, of course) to decrypt them.

**`class`** SecureItem

## Hierarchy

* **SecureItem**

## Implements

* [ISecureItem](../interfaces/_core_security_types_.isecureitem.md)

## Index

### Constructors

* [constructor](_core_security_types_.secureitem.md#private-constructor)

### Properties

* [data](_core_security_types_.secureitem.md#data)
* [iv](_core_security_types_.secureitem.md#iv)
* [preferredOutput](_core_security_types_.secureitem.md#preferredoutput)

### Accessors

* [buffer](_core_security_types_.secureitem.md#buffer)
* [string](_core_security_types_.secureitem.md#string)

### Methods

* [decrypt](_core_security_types_.secureitem.md#decrypt)
* [asSecureItem](_core_security_types_.secureitem.md#static-assecureitem)
* [from](_core_security_types_.secureitem.md#static-from)
* [isSecure](_core_security_types_.secureitem.md#static-issecure)

## Constructors

### `Private` constructor

\+ **new SecureItem**(`iv`: [Securable](../modules/_core_security_types_.md#securable), `data`: [Securable](../modules/_core_security_types_.md#securable), `preferredOutput`: [SecureOutput](../enums/_core_security_types_.secureoutput.md)): *[SecureItem](_core_security_types_.secureitem.md)*

Defined in src/core/security/Types.ts:103

**Parameters:**

Name | Type |
------ | ------ |
`iv` | [Securable](../modules/_core_security_types_.md#securable) |
`data` | [Securable](../modules/_core_security_types_.md#securable) |
`preferredOutput` | [SecureOutput](../enums/_core_security_types_.secureoutput.md) |

**Returns:** *[SecureItem](_core_security_types_.secureitem.md)*

## Properties

###  data

• **data**: *[Securable](../modules/_core_security_types_.md#securable)*

Defined in src/core/security/Types.ts:105

___

###  iv

• **iv**: *[Securable](../modules/_core_security_types_.md#securable)*

Defined in src/core/security/Types.ts:105

___

###  preferredOutput

• **preferredOutput**: *[SecureOutput](../enums/_core_security_types_.secureoutput.md)*

Defined in src/core/security/Types.ts:105

## Accessors

###  buffer

• **get buffer**(): *object*

Defined in src/core/security/Types.ts:119

**Returns:** *object*

* **data**: *Buffer*

* **iv**: *Buffer*

___

###  string

• **get string**(): *object*

Defined in src/core/security/Types.ts:123

**Returns:** *object*

* **data**: *string*

* **iv**: *string*

## Methods

###  decrypt

▸ **decrypt**(`decryptStore`: [ICryptography](../interfaces/_core_security_types_.icryptography.md), `preferredOutput?`: [SecureOutput](../enums/_core_security_types_.secureoutput.md)): *[Securable](../modules/_core_security_types_.md#securable) | null | undefined*

*Implementation of [ISecureItem](../interfaces/_core_security_types_.isecureitem.md)*

Defined in src/core/security/Types.ts:115

**Parameters:**

Name | Type |
------ | ------ |
`decryptStore` | [ICryptography](../interfaces/_core_security_types_.icryptography.md) |
`preferredOutput?` | [SecureOutput](../enums/_core_security_types_.secureoutput.md) |

**Returns:** *[Securable](../modules/_core_security_types_.md#securable) | null | undefined*

___

### `Static` asSecureItem

▸ **asSecureItem**(`item`: any): *[SecureItem](_core_security_types_.secureitem.md) | undefined*

Defined in src/core/security/Types.ts:95

**Parameters:**

Name | Type |
------ | ------ |
`item` | any |

**Returns:** *[SecureItem](_core_security_types_.secureitem.md) | undefined*

___

### `Static` from

▸ **from**(`iv`: [Securable](../modules/_core_security_types_.md#securable), `data`: [Securable](../modules/_core_security_types_.md#securable), `preferredOutput`: [SecureOutput](../enums/_core_security_types_.secureoutput.md)): *[SecureItem](_core_security_types_.secureitem.md)*

Defined in src/core/security/Types.ts:87

**Parameters:**

Name | Type | Default |
------ | ------ | ------ |
`iv` | [Securable](../modules/_core_security_types_.md#securable) | - |
`data` | [Securable](../modules/_core_security_types_.md#securable) | - |
`preferredOutput` | [SecureOutput](../enums/_core_security_types_.secureoutput.md) | SecureOutput.Buffer |

**Returns:** *[SecureItem](_core_security_types_.secureitem.md)*

___

### `Static` isSecure

▸ **isSecure**(`item`: any): *any*

Defined in src/core/security/Types.ts:91

**Parameters:**

Name | Type |
------ | ------ |
`item` | any |

**Returns:** *any*
