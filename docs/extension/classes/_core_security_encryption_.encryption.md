---
id: "_core_security_encryption_.encryption"
title: "Encryption"
sidebar_label: "Encryption"
---

[cds-for-code](../index.md) › [Globals](../globals.md) › ["core/security/Encryption"](../modules/_core_security_encryption_.md) › [Encryption](_core_security_encryption_.encryption.md)

## Hierarchy

* **Encryption**

## Index

### Properties

* [machine](_core_security_encryption_.encryption.md#static-machine)
* [process](_core_security_encryption_.encryption.md#static-process)

### Methods

* [createSecureItem](_core_security_encryption_.encryption.md#static-createsecureitem)
* [decrypt](_core_security_encryption_.encryption.md#static-decrypt)
* [encrypt](_core_security_encryption_.encryption.md#static-encrypt)
* [isSecurable](_core_security_encryption_.encryption.md#static-issecurable)
* [local](_core_security_encryption_.encryption.md#static-local)
* [salt](_core_security_encryption_.encryption.md#static-salt)

## Properties

### `Static` machine

▪ **machine**: *[ICryptography](../interfaces/_core_security_types_.icryptography.md)* = MachineCryptography.Instance

Defined in src/core/security/Encryption.ts:180

Offers machine-level encryption/decryption methods for export.  You cannot
decrypt values encrypted this way on other machines.

**`static`** 

**`type`** {ICryptography}

**`memberof`** Encryption

___

### `Static` process

▪ **process**: *[ICryptography](../interfaces/_core_security_types_.icryptography.md)* = ProcessCryptography.Instance

Defined in src/core/security/Encryption.ts:181

## Methods

### `Static` createSecureItem

▸ **createSecureItem**(`iv`: [Securable](../modules/_core_security_types_.md#securable), `data`: [Securable](../modules/_core_security_types_.md#securable), `preferredOutput?`: [SecureOutput](../enums/_core_security_types_.secureoutput.md)): *[SecureItem](_core_security_types_.secureitem.md)*

Defined in src/core/security/Encryption.ts:187

**Parameters:**

Name | Type |
------ | ------ |
`iv` | [Securable](../modules/_core_security_types_.md#securable) |
`data` | [Securable](../modules/_core_security_types_.md#securable) |
`preferredOutput?` | [SecureOutput](../enums/_core_security_types_.secureoutput.md) |

**Returns:** *[SecureItem](_core_security_types_.secureitem.md)*

___

### `Static` decrypt

▸ **decrypt**(`item`: [ISecureItem](../interfaces/_core_security_types_.isecureitem.md), `store`: [ICryptography](../interfaces/_core_security_types_.icryptography.md), `preferredOutput?`: [SecureOutput](../enums/_core_security_types_.secureoutput.md)): *[Securable](../modules/_core_security_types_.md#securable) | null*

Defined in src/core/security/Encryption.ts:195

**Parameters:**

Name | Type |
------ | ------ |
`item` | [ISecureItem](../interfaces/_core_security_types_.isecureitem.md) |
`store` | [ICryptography](../interfaces/_core_security_types_.icryptography.md) |
`preferredOutput?` | [SecureOutput](../enums/_core_security_types_.secureoutput.md) |

**Returns:** *[Securable](../modules/_core_security_types_.md#securable) | null*

___

### `Static` encrypt

▸ **encrypt**(`item`: [Securable](../modules/_core_security_types_.md#securable), `store`: [ICryptography](../interfaces/_core_security_types_.icryptography.md)): *[SecureItem](_core_security_types_.secureitem.md) | null*

Defined in src/core/security/Encryption.ts:199

**Parameters:**

Name | Type |
------ | ------ |
`item` | [Securable](../modules/_core_security_types_.md#securable) |
`store` | [ICryptography](../interfaces/_core_security_types_.icryptography.md) |

**Returns:** *[SecureItem](_core_security_types_.secureitem.md) | null*

___

### `Static` isSecurable

▸ **isSecurable**(`item`: any): *boolean*

Defined in src/core/security/Encryption.ts:191

**Parameters:**

Name | Type |
------ | ------ |
`item` | any |

**Returns:** *boolean*

___

### `Static` local

▸ **local**(`key?`: [Securable](../modules/_core_security_types_.md#securable)): *[ICryptography](../interfaces/_core_security_types_.icryptography.md)*

Defined in src/core/security/Encryption.ts:183

**Parameters:**

Name | Type |
------ | ------ |
`key?` | [Securable](../modules/_core_security_types_.md#securable) |

**Returns:** *[ICryptography](../interfaces/_core_security_types_.icryptography.md)*

___

### `Static` salt

▸ **salt**(`passphrase`: [Securable](../modules/_core_security_types_.md#securable), `byteLength`: number, `iterations`: number): *Promise‹[Securable](../modules/_core_security_types_.md#securable) | null›*

Defined in src/core/security/Encryption.ts:203

**Parameters:**

Name | Type | Default |
------ | ------ | ------ |
`passphrase` | [Securable](../modules/_core_security_types_.md#securable) | - |
`byteLength` | number | 32 |
`iterations` | number | 150 |

**Returns:** *Promise‹[Securable](../modules/_core_security_types_.md#securable) | null›*
