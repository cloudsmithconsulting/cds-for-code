---
id: "_core_security_types_.icryptography"
title: "ICryptography"
sidebar_label: "ICryptography"
---

[cds-for-code](../index.md) › [Globals](../globals.md) › ["core/security/Types"](../modules/_core_security_types_.md) › [ICryptography](_core_security_types_.icryptography.md)

Represents an type that can perform symetric encryption/decryption.

**`export`** ICryptography

**`interface`** ICryptography

## Hierarchy

* **ICryptography**

## Implemented by

* [LocalCryptography](../classes/_core_security_encryption_.localcryptography.md)
* [MachineCryptography](../classes/_core_security_encryption_.machinecryptography.md)
* [ProcessCryptography](../classes/_core_security_encryption_.processcryptography.md)

## Index

### Methods

* [decrypt](_core_security_types_.icryptography.md#decrypt)
* [encrypt](_core_security_types_.icryptography.md#encrypt)

## Methods

###  decrypt

▸ **decrypt**(`value`: [SecureItem](../classes/_core_security_types_.secureitem.md), `preferredOutput?`: [SecureOutput](../enums/_core_security_types_.secureoutput.md)): *[Securable](../modules/_core_security_types_.md#securable) | null*

Defined in src/core/security/Types.ts:29

**Parameters:**

Name | Type |
------ | ------ |
`value` | [SecureItem](../classes/_core_security_types_.secureitem.md) |
`preferredOutput?` | [SecureOutput](../enums/_core_security_types_.secureoutput.md) |

**Returns:** *[Securable](../modules/_core_security_types_.md#securable) | null*

___

###  encrypt

▸ **encrypt**(`value`: [Securable](../modules/_core_security_types_.md#securable)): *[SecureItem](../classes/_core_security_types_.secureitem.md) | null*

Defined in src/core/security/Types.ts:28

**Parameters:**

Name | Type |
------ | ------ |
`value` | [Securable](../modules/_core_security_types_.md#securable) |

**Returns:** *[SecureItem](../classes/_core_security_types_.secureitem.md) | null*
