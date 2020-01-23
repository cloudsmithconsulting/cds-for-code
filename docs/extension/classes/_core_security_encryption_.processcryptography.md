[cds-for-code](../README.md) › [Globals](../globals.md) › ["core/security/Encryption"](../modules/_core_security_encryption_.md) › [ProcessCryptography](_core_security_encryption_.processcryptography.md)

# Class: ProcessCryptography

Represents a cryptography API that can secure items inside a given process.  The
encrypted values cannot be decrypted outside the current application/process.

**`export`** 

**`class`** MachineCryptography

## Hierarchy

* **ProcessCryptography**

## Implements

* [ICryptography](../interfaces/_core_security_types_.icryptography.md)

## Index

### Constructors

* [constructor](_core_security_encryption_.processcryptography.md#private-constructor)

### Properties

* [symetricCrypto](_core_security_encryption_.processcryptography.md#private-symetriccrypto)
* [_instance](_core_security_encryption_.processcryptography.md#static-private-_instance)

### Accessors

* [Instance](_core_security_encryption_.processcryptography.md#static-instance)

### Methods

* [decrypt](_core_security_encryption_.processcryptography.md#decrypt)
* [encrypt](_core_security_encryption_.processcryptography.md#encrypt)

## Constructors

### `Private` constructor

\+ **new ProcessCryptography**(): *[ProcessCryptography](_core_security_encryption_.processcryptography.md)*

Defined in src/core/security/Encryption.ts:138

**Returns:** *[ProcessCryptography](_core_security_encryption_.processcryptography.md)*

## Properties

### `Private` symetricCrypto

• **symetricCrypto**: *[SymetricCryptography](_core_security_encryption_.symetriccryptography.md)*

Defined in src/core/security/Encryption.ts:138

___

### `Static` `Private` _instance

▪ **_instance**: *[ProcessCryptography](_core_security_encryption_.processcryptography.md)*

Defined in src/core/security/Encryption.ts:130

## Accessors

### `Static` Instance

• **get Instance**(): *[ProcessCryptography](_core_security_encryption_.processcryptography.md)*

Defined in src/core/security/Encryption.ts:132

**Returns:** *[ProcessCryptography](_core_security_encryption_.processcryptography.md)*

## Methods

###  decrypt

▸ **decrypt**(`value`: [SecureItem](_core_security_types_.secureitem.md), `preferredOutput`: [SecureOutput](../enums/_core_security_types_.secureoutput.md)): *[Securable](../modules/_core_security_types_.md#securable) | null*

*Implementation of [ICryptography](../interfaces/_core_security_types_.icryptography.md)*

Defined in src/core/security/Encryption.ts:148

**Parameters:**

Name | Type | Default |
------ | ------ | ------ |
`value` | [SecureItem](_core_security_types_.secureitem.md) | - |
`preferredOutput` | [SecureOutput](../enums/_core_security_types_.secureoutput.md) | SecureOutput.Buffer |

**Returns:** *[Securable](../modules/_core_security_types_.md#securable) | null*

___

###  encrypt

▸ **encrypt**(`value`: [Securable](../modules/_core_security_types_.md#securable)): *[SecureItem](_core_security_types_.secureitem.md) | null*

*Implementation of [ICryptography](../interfaces/_core_security_types_.icryptography.md)*

Defined in src/core/security/Encryption.ts:144

**Parameters:**

Name | Type |
------ | ------ |
`value` | [Securable](../modules/_core_security_types_.md#securable) |

**Returns:** *[SecureItem](_core_security_types_.secureitem.md) | null*
