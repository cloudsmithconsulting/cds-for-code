---
id: "_core_security_globalstatecredentialstore_.globalstatecredentialstore"
title: "GlobalStateCredentialStore"
sidebar_label: "GlobalStateCredentialStore"
---

[cds-for-code](../index.md) › [Globals](../globals.md) › ["core/security/GlobalStateCredentialStore"](../modules/_core_security_globalstatecredentialstore_.md) › [GlobalStateCredentialStore](_core_security_globalstatecredentialstore_.globalstatecredentialstore.md)

## Hierarchy

* [CredentialStore](_core_security_types_.credentialstore.md)

  ↳ **GlobalStateCredentialStore**

## Implements

* [ICredentialStore](../interfaces/_core_security_types_.icredentialstore.md)

## Index

### Constructors

* [constructor](_core_security_globalstatecredentialstore_.globalstatecredentialstore.md#private-constructor)

### Properties

* [_instance](_core_security_globalstatecredentialstore_.globalstatecredentialstore.md#static-private-_instance)
* [keyPrefix](_core_security_globalstatecredentialstore_.globalstatecredentialstore.md#static-private-keyprefix)

### Accessors

* [cryptography](_core_security_globalstatecredentialstore_.globalstatecredentialstore.md#cryptography)
* [Instance](_core_security_globalstatecredentialstore_.globalstatecredentialstore.md#static-instance)

### Methods

* [decrypt](_core_security_globalstatecredentialstore_.globalstatecredentialstore.md#decrypt)
* [delete](_core_security_globalstatecredentialstore_.globalstatecredentialstore.md#delete)
* [editPassword](_core_security_globalstatecredentialstore_.globalstatecredentialstore.md#editpassword)
* [onDelete](_core_security_globalstatecredentialstore_.globalstatecredentialstore.md#protected-ondelete)
* [onRetreive](_core_security_globalstatecredentialstore_.globalstatecredentialstore.md#protected-onretreive)
* [onStore](_core_security_globalstatecredentialstore_.globalstatecredentialstore.md#protected-onstore)
* [retreive](_core_security_globalstatecredentialstore_.globalstatecredentialstore.md#retreive)
* [secure](_core_security_globalstatecredentialstore_.globalstatecredentialstore.md#secure)
* [store](_core_security_globalstatecredentialstore_.globalstatecredentialstore.md#store)

## Constructors

### `Private` constructor

\+ **new GlobalStateCredentialStore**(): *[GlobalStateCredentialStore](_core_security_globalstatecredentialstore_.globalstatecredentialstore.md)*

Defined in src/core/security/GlobalStateCredentialStore.ts:15

**Returns:** *[GlobalStateCredentialStore](_core_security_globalstatecredentialstore_.globalstatecredentialstore.md)*

## Properties

### `Static` `Private` _instance

▪ **_instance**: *[GlobalStateCredentialStore](_core_security_globalstatecredentialstore_.globalstatecredentialstore.md)*

Defined in src/core/security/GlobalStateCredentialStore.ts:6

___

### `Static` `Private` keyPrefix

▪ **keyPrefix**: *string* = "cs.credentialStore:"

Defined in src/core/security/GlobalStateCredentialStore.ts:7

## Accessors

###  cryptography

• **get cryptography**(): *[ICryptography](../interfaces/_core_security_types_.icryptography.md)*

*Overrides [CredentialStore](_core_security_types_.credentialstore.md).[cryptography](_core_security_types_.credentialstore.md#cryptography)*

Defined in src/core/security/GlobalStateCredentialStore.ts:19

**Returns:** *[ICryptography](../interfaces/_core_security_types_.icryptography.md)*

___

### `Static` Instance

• **get Instance**(): *[GlobalStateCredentialStore](_core_security_globalstatecredentialstore_.globalstatecredentialstore.md)*

Defined in src/core/security/GlobalStateCredentialStore.ts:9

**Returns:** *[GlobalStateCredentialStore](_core_security_globalstatecredentialstore_.globalstatecredentialstore.md)*

## Methods

###  decrypt

▸ **decrypt**<**T**>(`key`: string, `credential?`: T, `preferredOutput?`: [SecureOutput](../enums/_core_security_types_.secureoutput.md), `keepEncrypted?`: string[]): *T | null*

*Inherited from [GlobalStateCredentialStore](_core_security_globalstatecredentialstore_.globalstatecredentialstore.md).[decrypt](_core_security_globalstatecredentialstore_.globalstatecredentialstore.md#decrypt)*

Defined in src/core/security/Types.ts:142

**Type parameters:**

▪ **T**: *[ICredential](../interfaces/_core_security_types_.icredential.md)*

**Parameters:**

Name | Type |
------ | ------ |
`key` | string |
`credential?` | T |
`preferredOutput?` | [SecureOutput](../enums/_core_security_types_.secureoutput.md) |
`keepEncrypted?` | string[] |

**Returns:** *T | null*

___

###  delete

▸ **delete**(`key`: string): *void*

*Implementation of [ICredentialStore](../interfaces/_core_security_types_.icredentialstore.md)*

*Inherited from [GlobalStateCredentialStore](_core_security_globalstatecredentialstore_.globalstatecredentialstore.md).[delete](_core_security_globalstatecredentialstore_.globalstatecredentialstore.md#delete)*

Defined in src/core/security/Types.ts:134

**Parameters:**

Name | Type |
------ | ------ |
`key` | string |

**Returns:** *void*

___

###  editPassword

▸ **editPassword**(`key`: string, `password`: Security.Securable): *[ICredential](../interfaces/_core_security_types_.icredential.md)*

Defined in src/core/security/GlobalStateCredentialStore.ts:35

**Parameters:**

Name | Type |
------ | ------ |
`key` | string |
`password` | Security.Securable |

**Returns:** *[ICredential](../interfaces/_core_security_types_.icredential.md)*

___

### `Protected` onDelete

▸ **onDelete**(`key`: string): *void*

*Overrides [CredentialStore](_core_security_types_.credentialstore.md).[onDelete](_core_security_types_.credentialstore.md#protected-abstract-ondelete)*

Defined in src/core/security/GlobalStateCredentialStore.ts:23

**Parameters:**

Name | Type |
------ | ------ |
`key` | string |

**Returns:** *void*

___

### `Protected` onRetreive

▸ **onRetreive**(`key`: string): *any*

*Overrides [CredentialStore](_core_security_types_.credentialstore.md).[onRetreive](_core_security_types_.credentialstore.md#protected-abstract-onretreive)*

Defined in src/core/security/GlobalStateCredentialStore.ts:31

**Parameters:**

Name | Type |
------ | ------ |
`key` | string |

**Returns:** *any*

___

### `Protected` onStore

▸ **onStore**(`encrypted`: any, `key`: string): *void*

*Overrides [CredentialStore](_core_security_types_.credentialstore.md).[onStore](_core_security_types_.credentialstore.md#protected-abstract-onstore)*

Defined in src/core/security/GlobalStateCredentialStore.ts:27

**Parameters:**

Name | Type |
------ | ------ |
`encrypted` | any |
`key` | string |

**Returns:** *void*

___

###  retreive

▸ **retreive**<**T**>(`key`: string, `credential?`: T): *T | null*

*Inherited from [GlobalStateCredentialStore](_core_security_globalstatecredentialstore_.globalstatecredentialstore.md).[retreive](_core_security_globalstatecredentialstore_.globalstatecredentialstore.md#retreive)*

Defined in src/core/security/Types.ts:177

**Type parameters:**

▪ **T**: *[ICredential](../interfaces/_core_security_types_.icredential.md)*

**Parameters:**

Name | Type |
------ | ------ |
`key` | string |
`credential?` | T |

**Returns:** *T | null*

___

###  secure

▸ **secure**(`securable`: [Securable](../modules/_core_security_types_.md#securable)): *[SecureItem](_core_security_types_.secureitem.md) | null*

*Implementation of [ICredentialStore](../interfaces/_core_security_types_.icredentialstore.md)*

*Inherited from [GlobalStateCredentialStore](_core_security_globalstatecredentialstore_.globalstatecredentialstore.md).[secure](_core_security_globalstatecredentialstore_.globalstatecredentialstore.md#secure)*

Defined in src/core/security/Types.ts:197

**Parameters:**

Name | Type |
------ | ------ |
`securable` | [Securable](../modules/_core_security_types_.md#securable) |

**Returns:** *[SecureItem](_core_security_types_.secureitem.md) | null*

___

###  store

▸ **store**<**T**>(`credential`: T, `key?`: string, `keepDecrypted?`: string[]): *string*

*Implementation of [ICredentialStore](../interfaces/_core_security_types_.icredentialstore.md)*

*Inherited from [GlobalStateCredentialStore](_core_security_globalstatecredentialstore_.globalstatecredentialstore.md).[store](_core_security_globalstatecredentialstore_.globalstatecredentialstore.md#store)*

Defined in src/core/security/Types.ts:201

**Type parameters:**

▪ **T**: *[ICredential](../interfaces/_core_security_types_.icredential.md)*

**Parameters:**

Name | Type |
------ | ------ |
`credential` | T |
`key?` | string |
`keepDecrypted?` | string[] |

**Returns:** *string*
