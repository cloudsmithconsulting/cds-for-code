---
id: "_core_security_authentication_"
title: "core/security/Authentication"
sidebar_label: "core/security/Authentication"
---

[cds-for-code](../index.md) › [Globals](../globals.md) › ["core/security/Authentication"](_core_security_authentication_.md)

## Index

### Classes

* [AuthenticationError](../classes/_core_security_authentication_.authenticationerror.md)

### Type aliases

* [AuthenticationResult](_core_security_authentication_.md#authenticationresult)

### Functions

* [authenticate](_core_security_authentication_.md#authenticate)
* [decryptCredential](_core_security_authentication_.md#decryptcredential)
* [encryptCredential](_core_security_authentication_.md#encryptcredential)
* [performAdalAuthentication](_core_security_authentication_.md#performadalauthentication)
* [performAzureAdClientAuthenticate](_core_security_authentication_.md#performazureadclientauthenticate)
* [performAzureAdUserAuthenticate](_core_security_authentication_.md#performazureaduserauthenticate)
* [performCdsOnlineAuthenticate](_core_security_authentication_.md#performcdsonlineauthenticate)
* [performOAuthAuthenticate](_core_security_authentication_.md#performoauthauthenticate)
* [performWindowsAuthenticate](_core_security_authentication_.md#performwindowsauthenticate)

## Type aliases

###  AuthenticationResult

Ƭ **AuthenticationResult**: *object*

Defined in src/core/security/Authentication.ts:14

#### Type declaration:

* **credentials**? : *[ICredential](../interfaces/_core_security_types_.icredential.md)*

* **error**? : *[AuthenticationError](../classes/_core_security_authentication_.authenticationerror.md)*

* **isMFA**? : *boolean*

* **response**? : *any*

* **success**: *boolean*

## Functions

###  authenticate

▸ **authenticate**(`key`: string, `credential`: [ICredential](../interfaces/_core_security_types_.icredential.md), `resource?`: string, `options?`: any): *Promise‹[AuthenticationResult](_core_security_authentication_.md#authenticationresult)›*

Defined in src/core/security/Authentication.ts:28

**Parameters:**

Name | Type |
------ | ------ |
`key` | string |
`credential` | [ICredential](../interfaces/_core_security_types_.icredential.md) |
`resource?` | string |
`options?` | any |

**Returns:** *Promise‹[AuthenticationResult](_core_security_authentication_.md#authenticationresult)›*

___

###  decryptCredential

▸ **decryptCredential**<**T**>(`credential`: T, `storeKey`: string, `store?`: [CredentialStore](../classes/_core_security_types_.credentialstore.md)): *T*

Defined in src/core/security/Authentication.ts:47

**Type parameters:**

▪ **T**: *[ICredential](../interfaces/_core_security_types_.icredential.md)*

**Parameters:**

Name | Type |
------ | ------ |
`credential` | T |
`storeKey` | string |
`store?` | [CredentialStore](../classes/_core_security_types_.credentialstore.md) |

**Returns:** *T*

___

###  encryptCredential

▸ **encryptCredential**<**T**>(`credential`: T, `storeKey`: string, `keepDecrypted?`: string[], `store?`: [CredentialStore](../classes/_core_security_types_.credentialstore.md)): *string*

Defined in src/core/security/Authentication.ts:53

**Type parameters:**

▪ **T**: *[ICredential](../interfaces/_core_security_types_.icredential.md)*

**Parameters:**

Name | Type |
------ | ------ |
`credential` | T |
`storeKey` | string |
`keepDecrypted?` | string[] |
`store?` | [CredentialStore](../classes/_core_security_types_.credentialstore.md) |

**Returns:** *string*

___

###  performAdalAuthentication

▸ **performAdalAuthentication**(`authority`: string, `tenant`: string, `clientId`: string, `clientSecret`: string, `resource`: string, `context`: AuthenticationContext, `credential`: [OAuthCredential](../classes/_core_security_types_.oauthcredential.md), `decrypted`: [OAuthCredential](../classes/_core_security_types_.oauthcredential.md)): *Promise‹[AuthenticationResult](_core_security_authentication_.md#authenticationresult)›*

Defined in src/core/security/Authentication.ts:123

**Parameters:**

Name | Type |
------ | ------ |
`authority` | string |
`tenant` | string |
`clientId` | string |
`clientSecret` | string |
`resource` | string |
`context` | AuthenticationContext |
`credential` | [OAuthCredential](../classes/_core_security_types_.oauthcredential.md) |
`decrypted` | [OAuthCredential](../classes/_core_security_types_.oauthcredential.md) |

**Returns:** *Promise‹[AuthenticationResult](_core_security_authentication_.md#authenticationresult)›*

___

###  performAzureAdClientAuthenticate

▸ **performAzureAdClientAuthenticate**(`connectionId`: string, `credential`: [AzureAdClientCredential](../classes/_core_security_types_.azureadclientcredential.md), `resource?`: string, `options?`: any): *Promise‹[AuthenticationResult](_core_security_authentication_.md#authenticationresult)›*

Defined in src/core/security/Authentication.ts:75

**Parameters:**

Name | Type |
------ | ------ |
`connectionId` | string |
`credential` | [AzureAdClientCredential](../classes/_core_security_types_.azureadclientcredential.md) |
`resource?` | string |
`options?` | any |

**Returns:** *Promise‹[AuthenticationResult](_core_security_authentication_.md#authenticationresult)›*

___

###  performAzureAdUserAuthenticate

▸ **performAzureAdUserAuthenticate**(`connectionId`: string, `credential`: [AzureAdUserCredential](../classes/_core_security_types_.azureadusercredential.md), `resource?`: string, `options?`: any): *Promise‹[AuthenticationResult](_core_security_authentication_.md#authenticationresult)›*

Defined in src/core/security/Authentication.ts:89

**Parameters:**

Name | Type |
------ | ------ |
`connectionId` | string |
`credential` | [AzureAdUserCredential](../classes/_core_security_types_.azureadusercredential.md) |
`resource?` | string |
`options?` | any |

**Returns:** *Promise‹[AuthenticationResult](_core_security_authentication_.md#authenticationresult)›*

___

###  performCdsOnlineAuthenticate

▸ **performCdsOnlineAuthenticate**(`connectionId`: string, `credential`: [CdsOnlineCredential](../classes/_core_security_types_.cdsonlinecredential.md), `resource?`: string, `options?`: any): *Promise‹[AuthenticationResult](_core_security_authentication_.md#authenticationresult)›*

Defined in src/core/security/Authentication.ts:59

**Parameters:**

Name | Type |
------ | ------ |
`connectionId` | string |
`credential` | [CdsOnlineCredential](../classes/_core_security_types_.cdsonlinecredential.md) |
`resource?` | string |
`options?` | any |

**Returns:** *Promise‹[AuthenticationResult](_core_security_authentication_.md#authenticationresult)›*

___

###  performOAuthAuthenticate

▸ **performOAuthAuthenticate**(`connectionId`: string, `credential`: [OAuthCredential](../classes/_core_security_types_.oauthcredential.md), `resource?`: string, `options?`: any): *Promise‹[AuthenticationResult](_core_security_authentication_.md#authenticationresult)›*

Defined in src/core/security/Authentication.ts:109

**Parameters:**

Name | Type |
------ | ------ |
`connectionId` | string |
`credential` | [OAuthCredential](../classes/_core_security_types_.oauthcredential.md) |
`resource?` | string |
`options?` | any |

**Returns:** *Promise‹[AuthenticationResult](_core_security_authentication_.md#authenticationresult)›*

___

###  performWindowsAuthenticate

▸ **performWindowsAuthenticate**(`connectionId`: string, `credential`: [WindowsCredential](../classes/_core_security_types_.windowscredential.md)): *Promise‹[AuthenticationResult](_core_security_authentication_.md#authenticationresult)›*

Defined in src/core/security/Authentication.ts:103

**Parameters:**

Name | Type |
------ | ------ |
`connectionId` | string |
`credential` | [WindowsCredential](../classes/_core_security_types_.windowscredential.md) |

**Returns:** *Promise‹[AuthenticationResult](_core_security_authentication_.md#authenticationresult)›*
