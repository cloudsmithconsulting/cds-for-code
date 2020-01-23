---
id: "_core_security_types_.isecureitem"
title: "ISecureItem"
sidebar_label: "ISecureItem"
---

[cds-for-code](../index.md) › [Globals](../globals.md) › ["core/security/Types"](../modules/_core_security_types_.md) › [ISecureItem](_core_security_types_.isecureitem.md)

Represents an item that has been encrypted and can be decrypted by it's correspodnign
private key (or private key store)

**`export`** 

**`interface`** ISecureItem

## Hierarchy

* **ISecureItem**

## Implemented by

* [SecureItem](../classes/_core_security_types_.secureitem.md)

## Index

### Properties

* [buffer](_core_security_types_.isecureitem.md#buffer)
* [string](_core_security_types_.isecureitem.md#string)

### Methods

* [decrypt](_core_security_types_.isecureitem.md#decrypt)

## Properties

###  buffer

• **buffer**: *object*

Defined in src/core/security/Types.ts:40

#### Type declaration:

* **data**: *Buffer*

* **iv**: *Buffer*

___

###  string

• **string**: *object*

Defined in src/core/security/Types.ts:41

#### Type declaration:

* **data**: *string*

* **iv**: *string*

## Methods

###  decrypt

▸ **decrypt**(`decryptStore`: [ICryptography](_core_security_types_.icryptography.md), `preferredOutput?`: [SecureOutput](../enums/_core_security_types_.secureoutput.md)): *[Securable](../modules/_core_security_types_.md#securable) | null*

Defined in src/core/security/Types.ts:43

**Parameters:**

Name | Type |
------ | ------ |
`decryptStore` | [ICryptography](_core_security_types_.icryptography.md) |
`preferredOutput?` | [SecureOutput](../enums/_core_security_types_.secureoutput.md) |

**Returns:** *[Securable](../modules/_core_security_types_.md#securable) | null*
