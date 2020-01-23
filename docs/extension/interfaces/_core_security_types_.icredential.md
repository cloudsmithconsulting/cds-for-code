---
id: "_core_security_types_.icredential"
title: "ICredential"
sidebar_label: "ICredential"
---

[cds-for-code](../index.md) › [Globals](../globals.md) › ["core/security/Types"](../modules/_core_security_types_.md) › [ICredential](_core_security_types_.icredential.md)

Represents a set of credentials that can be encrypted and decrypted.

**`export`** 

**`interface`** ICredential

## Hierarchy

* **ICredential**

## Implemented by

* [AzureAdClientCredential](../classes/_core_security_types_.azureadclientcredential.md)
* [AzureAdUserCredential](../classes/_core_security_types_.azureadusercredential.md)
* [CdsOnlineCredential](../classes/_core_security_types_.cdsonlinecredential.md)
* [Credential](../classes/_core_security_types_.credential.md)
* [OAuthCredential](../classes/_core_security_types_.oauthcredential.md)
* [WindowsCredential](../classes/_core_security_types_.windowscredential.md)

## Index

### Properties

* [isSecure](_core_security_types_.icredential.md#issecure)
* [password](_core_security_types_.icredential.md#password)
* [storeKey](_core_security_types_.icredential.md#optional-storekey)
* [username](_core_security_types_.icredential.md#username)

### Methods

* [decrypt](_core_security_types_.icredential.md#decrypt)
* [store](_core_security_types_.icredential.md#store)
* [toString](_core_security_types_.icredential.md#tostring)

## Properties

###  isSecure

• **isSecure**: *boolean*

Defined in src/core/security/Types.ts:63

___

###  password

• **password**: *[Securable](../modules/_core_security_types_.md#securable) | [ISecureItem](_core_security_types_.isecureitem.md)*

Defined in src/core/security/Types.ts:61

___

### `Optional` storeKey

• **storeKey**? : *string*

Defined in src/core/security/Types.ts:58

Represents a public key that can be used to refer to this credential when in the credential store.

**`type`** {string}

**`memberof`** ICredential

___

###  username

• **username**: *[Securable](../modules/_core_security_types_.md#securable) | [ISecureItem](_core_security_types_.isecureitem.md)*

Defined in src/core/security/Types.ts:60

## Methods

###  decrypt

▸ **decrypt**<**T**>(`store`: [ICredentialStore](_core_security_types_.icredentialstore.md), `key`: string, `preferredOutput?`: [SecureOutput](../enums/_core_security_types_.secureoutput.md), `keepEncrypted?`: string[]): *T | null*

Defined in src/core/security/Types.ts:65

**Type parameters:**

▪ **T**: *[ICredential](_core_security_types_.icredential.md)*

**Parameters:**

Name | Type |
------ | ------ |
`store` | [ICredentialStore](_core_security_types_.icredentialstore.md) |
`key` | string |
`preferredOutput?` | [SecureOutput](../enums/_core_security_types_.secureoutput.md) |
`keepEncrypted?` | string[] |

**Returns:** *T | null*

___

###  store

▸ **store**(`store`: [ICredentialStore](_core_security_types_.icredentialstore.md)): *string | null*

Defined in src/core/security/Types.ts:66

**Parameters:**

Name | Type |
------ | ------ |
`store` | [ICredentialStore](_core_security_types_.icredentialstore.md) |

**Returns:** *string | null*

___

###  toString

▸ **toString**(): *string*

Defined in src/core/security/Types.ts:67

**Returns:** *string*
