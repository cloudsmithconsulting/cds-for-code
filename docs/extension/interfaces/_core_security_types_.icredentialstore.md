[cds-for-code](../README.md) › [Globals](../globals.md) › ["core/security/Types"](../modules/_core_security_types_.md) › [ICredentialStore](_core_security_types_.icredentialstore.md)

# Interface: ICredentialStore

## Hierarchy

* **ICredentialStore**

## Implemented by

* [CredentialStore](../classes/_core_security_types_.credentialstore.md)
* [GlobalStateCredentialStore](../classes/_core_security_globalstatecredentialstore_.globalstatecredentialstore.md)

## Index

### Properties

* [cryptography](_core_security_types_.icredentialstore.md#cryptography)

### Methods

* [decrypt](_core_security_types_.icredentialstore.md#decrypt)
* [delete](_core_security_types_.icredentialstore.md#delete)
* [retreive](_core_security_types_.icredentialstore.md#retreive)
* [secure](_core_security_types_.icredentialstore.md#secure)
* [store](_core_security_types_.icredentialstore.md#store)

## Properties

###  cryptography

• **cryptography**: *[ICryptography](_core_security_types_.icryptography.md)*

Defined in src/core/security/Types.ts:71

## Methods

###  decrypt

▸ **decrypt**<**T**>(`key`: string, `credential?`: T | undefined, `preferredOutput?`: [SecureOutput](../enums/_core_security_types_.secureoutput.md), `keepEncrypted?`: string[]): *T | null*

Defined in src/core/security/Types.ts:73

**Type parameters:**

▪ **T**: *[ICredential](_core_security_types_.icredential.md)*

**Parameters:**

Name | Type |
------ | ------ |
`key` | string |
`credential?` | T &#124; undefined |
`preferredOutput?` | [SecureOutput](../enums/_core_security_types_.secureoutput.md) |
`keepEncrypted?` | string[] |

**Returns:** *T | null*

___

###  delete

▸ **delete**(`key`: string): *void*

Defined in src/core/security/Types.ts:74

**Parameters:**

Name | Type |
------ | ------ |
`key` | string |

**Returns:** *void*

___

###  retreive

▸ **retreive**<**T**>(`key`: string, `credential?`: T | undefined): *T | null*

Defined in src/core/security/Types.ts:75

**Type parameters:**

▪ **T**: *[ICredential](_core_security_types_.icredential.md)*

**Parameters:**

Name | Type |
------ | ------ |
`key` | string |
`credential?` | T &#124; undefined |

**Returns:** *T | null*

___

###  secure

▸ **secure**(`securable`: [Securable](../modules/_core_security_types_.md#securable)): *[SecureItem](../classes/_core_security_types_.secureitem.md) | null*

Defined in src/core/security/Types.ts:76

**Parameters:**

Name | Type |
------ | ------ |
`securable` | [Securable](../modules/_core_security_types_.md#securable) |

**Returns:** *[SecureItem](../classes/_core_security_types_.secureitem.md) | null*

___

###  store

▸ **store**<**T**>(`credential`: T, `key?`: string, `keepDecrypted?`: string[]): *string | null*

Defined in src/core/security/Types.ts:77

**Type parameters:**

▪ **T**: *[ICredential](_core_security_types_.icredential.md)*

**Parameters:**

Name | Type |
------ | ------ |
`credential` | T |
`key?` | string |
`keepDecrypted?` | string[] |

**Returns:** *string | null*
