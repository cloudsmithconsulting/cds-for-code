---
id: "_core_security_encryption_.symetriccryptography"
title: "SymetricCryptography"
sidebar_label: "SymetricCryptography"
---

[cds-for-code](../index.md) › [Globals](../globals.md) › ["core/security/Encryption"](../modules/_core_security_encryption_.md) › [SymetricCryptography](_core_security_encryption_.symetriccryptography.md)

Abstraction for handling symetric cryptography using algorithms like AES, 3DES, etc.

**`class`** SymetricCryptography

## Hierarchy

* **SymetricCryptography**

## Index

### Constructors

* [constructor](_core_security_encryption_.symetriccryptography.md#constructor)

### Properties

* [iv](_core_security_encryption_.symetriccryptography.md#private-iv)
* [key](_core_security_encryption_.symetriccryptography.md#private-key)
* [defaultAlgorithm](_core_security_encryption_.symetriccryptography.md#static-private-defaultalgorithm)

### Methods

* [decrypt](_core_security_encryption_.symetriccryptography.md#decrypt)
* [encrypt](_core_security_encryption_.symetriccryptography.md#encrypt)

## Constructors

###  constructor

\+ **new SymetricCryptography**(`key?`: [Securable](../modules/_core_security_types_.md#securable), `iv?`: [Securable](../modules/_core_security_types_.md#securable)): *[SymetricCryptography](_core_security_encryption_.symetriccryptography.md)*

Defined in src/core/security/Encryption.ts:11

Creates a new instance of cryptography capabiltiies.

**`memberof`** SymetricCryptography

**Parameters:**

Name | Type |
------ | ------ |
`key?` | [Securable](../modules/_core_security_types_.md#securable) |
`iv?` | [Securable](../modules/_core_security_types_.md#securable) |

**Returns:** *[SymetricCryptography](_core_security_encryption_.symetriccryptography.md)*

## Properties

### `Private` iv

• **iv**: *[Securable](../modules/_core_security_types_.md#securable)*

Defined in src/core/security/Encryption.ts:25

___

### `Private` key

• **key**: *[Securable](../modules/_core_security_types_.md#securable)*

Defined in src/core/security/Encryption.ts:24

___

### `Static` `Private` defaultAlgorithm

▪ **defaultAlgorithm**: *string* = "aes-256-cbc"

Defined in src/core/security/Encryption.ts:23

## Methods

###  decrypt

▸ **decrypt**(`value`: [SecureItem](_core_security_types_.secureitem.md), `algorithm`: string, `key?`: [Securable](../modules/_core_security_types_.md#securable), `preferredOutput`: [SecureOutput](../enums/_core_security_types_.secureoutput.md)): *Buffer | null*

Defined in src/core/security/Encryption.ts:60

**Parameters:**

Name | Type | Default |
------ | ------ | ------ |
`value` | [SecureItem](_core_security_types_.secureitem.md) | - |
`algorithm` | string | SymetricCryptography.defaultAlgorithm |
`key?` | [Securable](../modules/_core_security_types_.md#securable) | - |
`preferredOutput` | [SecureOutput](../enums/_core_security_types_.secureoutput.md) | SecureOutput.Buffer |

**Returns:** *Buffer | null*

___

###  encrypt

▸ **encrypt**(`value`: [Securable](../modules/_core_security_types_.md#securable), `algorithm`: string, `key?`: [Securable](../modules/_core_security_types_.md#securable), `iv?`: [Securable](../modules/_core_security_types_.md#securable)): *[SecureItem](_core_security_types_.secureitem.md) | null*

Defined in src/core/security/Encryption.ts:27

**Parameters:**

Name | Type | Default |
------ | ------ | ------ |
`value` | [Securable](../modules/_core_security_types_.md#securable) | - |
`algorithm` | string | SymetricCryptography.defaultAlgorithm |
`key?` | [Securable](../modules/_core_security_types_.md#securable) | - |
`iv?` | [Securable](../modules/_core_security_types_.md#securable) | - |

**Returns:** *[SecureItem](_core_security_types_.secureitem.md) | null*
