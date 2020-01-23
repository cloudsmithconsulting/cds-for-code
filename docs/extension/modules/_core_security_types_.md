[cds-for-code](../README.md) › [Globals](../globals.md) › ["core/security/Types"](_core_security_types_.md)

# External module: "core/security/Types"

## Index

### Enumerations

* [SecureOutput](../enums/_core_security_types_.secureoutput.md)

### Classes

* [AzureAdClientCredential](../classes/_core_security_types_.azureadclientcredential.md)
* [AzureAdUserCredential](../classes/_core_security_types_.azureadusercredential.md)
* [CdsOnlineCredential](../classes/_core_security_types_.cdsonlinecredential.md)
* [Credential](../classes/_core_security_types_.credential.md)
* [CredentialStore](../classes/_core_security_types_.credentialstore.md)
* [OAuthCredential](../classes/_core_security_types_.oauthcredential.md)
* [SecureItem](../classes/_core_security_types_.secureitem.md)
* [WindowsCredential](../classes/_core_security_types_.windowscredential.md)

### Interfaces

* [ICredential](../interfaces/_core_security_types_.icredential.md)
* [ICredentialStore](../interfaces/_core_security_types_.icredentialstore.md)
* [ICryptography](../interfaces/_core_security_types_.icryptography.md)
* [ISecureItem](../interfaces/_core_security_types_.isecureitem.md)

### Type aliases

* [Securable](_core_security_types_.md#securable)

### Variables

* [sensitiveKeys](_core_security_types_.md#const-sensitivekeys)

## Type aliases

###  Securable

Ƭ **Securable**: *Buffer | string | undefined*

Defined in src/core/security/Types.ts:10

**`type`** represents an item that can be secured.

## Variables

### `Const` sensitiveKeys

• **sensitiveKeys**: *string[]* = [ "credentials", "password", "refreshToken", "accessToken" ]

Defined in src/core/security/Types.ts:469
