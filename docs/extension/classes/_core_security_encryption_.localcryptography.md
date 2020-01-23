[cds-for-code](../README.md) › [Globals](../globals.md) › ["core/security/Encryption"](../modules/_core_security_encryption_.md) › [LocalCryptography](_core_security_encryption_.localcryptography.md)

# Class: LocalCryptography

## Hierarchy

* **LocalCryptography**

## Implements

* [ICryptography](../interfaces/_core_security_types_.icryptography.md)

## Index

### Constructors

* [constructor](_core_security_encryption_.localcryptography.md#constructor)

### Properties

* [key](_core_security_encryption_.localcryptography.md#key)
* [symetricCrypto](_core_security_encryption_.localcryptography.md#private-symetriccrypto)

### Methods

* [decrypt](_core_security_encryption_.localcryptography.md#decrypt)
* [encrypt](_core_security_encryption_.localcryptography.md#encrypt)

## Constructors

###  constructor

\+ **new LocalCryptography**(`key?`: [Securable](../modules/_core_security_types_.md#securable)): *[LocalCryptography](_core_security_encryption_.localcryptography.md)*

Defined in src/core/security/Encryption.ts:155

**Parameters:**

Name | Type |
------ | ------ |
`key?` | [Securable](../modules/_core_security_types_.md#securable) |

**Returns:** *[LocalCryptography](_core_security_encryption_.localcryptography.md)*

## Properties

###  key

• **key**: *[Securable](../modules/_core_security_types_.md#securable) | undefined*

Defined in src/core/security/Encryption.ts:155

___

### `Private` symetricCrypto

• **symetricCrypto**: *[SymetricCryptography](_core_security_encryption_.symetriccryptography.md)*

Defined in src/core/security/Encryption.ts:154

## Methods

###  decrypt

▸ **decrypt**(`value`: [SecureItem](_core_security_types_.secureitem.md), `preferredOutput`: [SecureOutput](../enums/_core_security_types_.secureoutput.md)): *[Securable](../modules/_core_security_types_.md#securable) | null*

*Implementation of [ICryptography](../interfaces/_core_security_types_.icryptography.md)*

Defined in src/core/security/Encryption.ts:166

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

Defined in src/core/security/Encryption.ts:162

**Parameters:**

Name | Type |
------ | ------ |
`value` | [Securable](../modules/_core_security_types_.md#securable) |

**Returns:** *[SecureItem](_core_security_types_.secureitem.md) | null*
