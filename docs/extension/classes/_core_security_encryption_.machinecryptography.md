---
id: "_core_security_encryption_.machinecryptography"
title: "MachineCryptography"
sidebar_label: "MachineCryptography"
---

[cds-for-code](../index.md) › [Globals](../globals.md) › ["core/security/Encryption"](../modules/_core_security_encryption_.md) › [MachineCryptography](_core_security_encryption_.machinecryptography.md)

Represents a cryptography API that can secure items on a given computer.  The
encrypted values cannot be decrypted on other machines.

**`export`** 

**`class`** MachineCryptography

## Hierarchy

* **MachineCryptography**

## Implements

* [ICryptography](../interfaces/_core_security_types_.icryptography.md)

## Index

### Constructors

* [constructor](_core_security_encryption_.machinecryptography.md#private-constructor)

### Properties

* [symetricCrypto](_core_security_encryption_.machinecryptography.md#private-symetriccrypto)
* [_instance](_core_security_encryption_.machinecryptography.md#static-private-_instance)

### Accessors

* [Instance](_core_security_encryption_.machinecryptography.md#static-instance)

### Methods

* [decrypt](_core_security_encryption_.machinecryptography.md#decrypt)
* [encrypt](_core_security_encryption_.machinecryptography.md#encrypt)

## Constructors

### `Private` constructor

\+ **new MachineCryptography**(): *[MachineCryptography](_core_security_encryption_.machinecryptography.md)*

Defined in src/core/security/Encryption.ts:106

**Returns:** *[MachineCryptography](_core_security_encryption_.machinecryptography.md)*

## Properties

### `Private` symetricCrypto

• **symetricCrypto**: *[SymetricCryptography](_core_security_encryption_.symetriccryptography.md)*

Defined in src/core/security/Encryption.ts:106

___

### `Static` `Private` _instance

▪ **_instance**: *[MachineCryptography](_core_security_encryption_.machinecryptography.md)*

Defined in src/core/security/Encryption.ts:98

## Accessors

### `Static` Instance

• **get Instance**(): *[MachineCryptography](_core_security_encryption_.machinecryptography.md)*

Defined in src/core/security/Encryption.ts:100

**Returns:** *[MachineCryptography](_core_security_encryption_.machinecryptography.md)*

## Methods

###  decrypt

▸ **decrypt**(`value`: [SecureItem](_core_security_types_.secureitem.md), `preferredOutput?`: [SecureOutput](../enums/_core_security_types_.secureoutput.md)): *[Securable](../modules/_core_security_types_.md#securable) | null*

*Implementation of [ICryptography](../interfaces/_core_security_types_.icryptography.md)*

Defined in src/core/security/Encryption.ts:117

**Parameters:**

Name | Type |
------ | ------ |
`value` | [SecureItem](_core_security_types_.secureitem.md) |
`preferredOutput?` | [SecureOutput](../enums/_core_security_types_.secureoutput.md) |

**Returns:** *[Securable](../modules/_core_security_types_.md#securable) | null*

___

###  encrypt

▸ **encrypt**(`value`: [Securable](../modules/_core_security_types_.md#securable)): *[SecureItem](_core_security_types_.secureitem.md) | null*

*Implementation of [ICryptography](../interfaces/_core_security_types_.icryptography.md)*

Defined in src/core/security/Encryption.ts:113

**Parameters:**

Name | Type |
------ | ------ |
`value` | [Securable](../modules/_core_security_types_.md#securable) |

**Returns:** *[SecureItem](_core_security_types_.secureitem.md) | null*
