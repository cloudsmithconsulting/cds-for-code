[cds-for-code](../README.md) › [Globals](../globals.md) › ["core/security/Types"](../modules/_core_security_types_.md) › [CredentialStore](_core_security_types_.credentialstore.md)

# Class: CredentialStore

## Hierarchy

* **CredentialStore**

  ↳ [GlobalStateCredentialStore](_core_security_globalstatecredentialstore_.globalstatecredentialstore.md)

## Implements

* [ICredentialStore](../interfaces/_core_security_types_.icredentialstore.md)

## Index

### Accessors

* [cryptography](_core_security_types_.credentialstore.md#cryptography)

### Methods

* [decrypt](_core_security_types_.credentialstore.md#decrypt)
* [delete](_core_security_types_.credentialstore.md#delete)
* [onDelete](_core_security_types_.credentialstore.md#protected-abstract-ondelete)
* [onRetreive](_core_security_types_.credentialstore.md#protected-abstract-onretreive)
* [onStore](_core_security_types_.credentialstore.md#protected-abstract-onstore)
* [retreive](_core_security_types_.credentialstore.md#retreive)
* [secure](_core_security_types_.credentialstore.md#secure)
* [store](_core_security_types_.credentialstore.md#store)

## Accessors

###  cryptography

• **get cryptography**(): *[ICryptography](../interfaces/_core_security_types_.icryptography.md)*

Defined in src/core/security/Types.ts:129

**Returns:** *[ICryptography](../interfaces/_core_security_types_.icryptography.md)*

## Methods

###  decrypt

▸ **decrypt**<**T**>(`key`: string, `credential?`: T, `preferredOutput?`: [SecureOutput](../enums/_core_security_types_.secureoutput.md), `keepEncrypted?`: string[]): *T | null*

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

Defined in src/core/security/Types.ts:134

**Parameters:**

Name | Type |
------ | ------ |
`key` | string |

**Returns:** *void*

___

### `Protected` `Abstract` onDelete

▸ **onDelete**(`key`: string): *void*

Defined in src/core/security/Types.ts:132

**Parameters:**

Name | Type |
------ | ------ |
`key` | string |

**Returns:** *void*

___

### `Protected` `Abstract` onRetreive

▸ **onRetreive**(`key`: string): *any*

Defined in src/core/security/Types.ts:131

**Parameters:**

Name | Type |
------ | ------ |
`key` | string |

**Returns:** *any*

___

### `Protected` `Abstract` onStore

▸ **onStore**(`encrypted`: any, `key`: string): *void*

Defined in src/core/security/Types.ts:130

**Parameters:**

Name | Type |
------ | ------ |
`encrypted` | any |
`key` | string |

**Returns:** *void*

___

###  retreive

▸ **retreive**<**T**>(`key`: string, `credential?`: T): *T | null*

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
