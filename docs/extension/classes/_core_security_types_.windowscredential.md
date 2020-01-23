---
id: "_core_security_types_.windowscredential"
title: "WindowsCredential"
sidebar_label: "WindowsCredential"
---

[cds-for-code](../index.md) › [Globals](../globals.md) › ["core/security/Types"](../modules/_core_security_types_.md) › [WindowsCredential](_core_security_types_.windowscredential.md)

## Hierarchy

* [Credential](_core_security_types_.credential.md)

  ↳ **WindowsCredential**

## Implements

* [ICredential](../interfaces/_core_security_types_.icredential.md)

## Index

### Constructors

* [constructor](_core_security_types_.windowscredential.md#constructor)

### Properties

* [domain](_core_security_types_.windowscredential.md#domain)
* [password](_core_security_types_.windowscredential.md#password)
* [storeKey](_core_security_types_.windowscredential.md#optional-storekey)
* [username](_core_security_types_.windowscredential.md#username)

### Accessors

* [isSecure](_core_security_types_.windowscredential.md#issecure)
* [Empty](_core_security_types_.windowscredential.md#static-empty)

### Methods

* [decrypt](_core_security_types_.windowscredential.md#decrypt)
* [store](_core_security_types_.windowscredential.md#store)
* [toString](_core_security_types_.windowscredential.md#tostring)
* [from](_core_security_types_.windowscredential.md#static-from)
* [isAzureAdClientCredential](_core_security_types_.windowscredential.md#static-isazureadclientcredential)
* [isAzureAdUserCredential](_core_security_types_.windowscredential.md#static-isazureadusercredential)
* [isCdsOnlineUserCredential](_core_security_types_.windowscredential.md#static-iscdsonlineusercredential)
* [isCredential](_core_security_types_.windowscredential.md#static-iscredential)
* [isOauthCredential](_core_security_types_.windowscredential.md#static-isoauthcredential)
* [isSecureCredential](_core_security_types_.windowscredential.md#static-issecurecredential)
* [isWindowsCredential](_core_security_types_.windowscredential.md#static-iswindowscredential)
* [needsToken](_core_security_types_.windowscredential.md#static-needstoken)
* [requireToken](_core_security_types_.windowscredential.md#static-requiretoken)
* [retreive](_core_security_types_.windowscredential.md#static-retreive)
* [setToken](_core_security_types_.windowscredential.md#static-settoken)

## Constructors

###  constructor

\+ **new WindowsCredential**(`domain`: [Securable](../modules/_core_security_types_.md#securable), `username`: [SecureItem](_core_security_types_.secureitem.md) | [Securable](../modules/_core_security_types_.md#securable), `password`: [SecureItem](_core_security_types_.secureitem.md) | [Securable](../modules/_core_security_types_.md#securable)): *[WindowsCredential](_core_security_types_.windowscredential.md)*

*Overrides [Credential](_core_security_types_.credential.md).[constructor](_core_security_types_.credential.md#protected-constructor)*

Defined in src/core/security/Types.ts:356

**Parameters:**

Name | Type |
------ | ------ |
`domain` | [Securable](../modules/_core_security_types_.md#securable) |
`username` | [SecureItem](_core_security_types_.secureitem.md) &#124; [Securable](../modules/_core_security_types_.md#securable) |
`password` | [SecureItem](_core_security_types_.secureitem.md) &#124; [Securable](../modules/_core_security_types_.md#securable) |

**Returns:** *[WindowsCredential](_core_security_types_.windowscredential.md)*

## Properties

###  domain

• **domain**: *[Securable](../modules/_core_security_types_.md#securable)*

Defined in src/core/security/Types.ts:357

___

###  password

• **password**: *[ISecureItem](../interfaces/_core_security_types_.isecureitem.md) | [Securable](../modules/_core_security_types_.md#securable)*

*Implementation of [ICredential](../interfaces/_core_security_types_.icredential.md).[password](../interfaces/_core_security_types_.icredential.md#password)*

*Inherited from [Credential](_core_security_types_.credential.md).[password](_core_security_types_.credential.md#password)*

Defined in src/core/security/Types.ts:235

___

### `Optional` storeKey

• **storeKey**? : *string*

*Implementation of [ICredential](../interfaces/_core_security_types_.icredential.md).[storeKey](../interfaces/_core_security_types_.icredential.md#optional-storekey)*

*Inherited from [Credential](_core_security_types_.credential.md).[storeKey](_core_security_types_.credential.md#optional-storekey)*

Defined in src/core/security/Types.ts:236

___

###  username

• **username**: *[ISecureItem](../interfaces/_core_security_types_.isecureitem.md) | [Securable](../modules/_core_security_types_.md#securable)*

*Implementation of [ICredential](../interfaces/_core_security_types_.icredential.md).[username](../interfaces/_core_security_types_.icredential.md#username)*

*Inherited from [Credential](_core_security_types_.credential.md).[username](_core_security_types_.credential.md#username)*

Defined in src/core/security/Types.ts:234

## Accessors

###  isSecure

• **get isSecure**(): *boolean*

*Inherited from [Credential](_core_security_types_.credential.md).[isSecure](_core_security_types_.credential.md#issecure)*

Defined in src/core/security/Types.ts:329

**Returns:** *boolean*

___

### `Static` Empty

• **get Empty**(): *[Credential](_core_security_types_.credential.md)*

*Inherited from [Credential](_core_security_types_.credential.md).[Empty](_core_security_types_.credential.md#static-empty)*

Defined in src/core/security/Types.ts:239

**Returns:** *[Credential](_core_security_types_.credential.md)*

## Methods

###  decrypt

▸ **decrypt**<**T**>(`store`: [ICredentialStore](../interfaces/_core_security_types_.icredentialstore.md), `key`: string, `preferredOutput?`: [SecureOutput](../enums/_core_security_types_.secureoutput.md), `keepEncrypted?`: string[]): *T | null*

*Implementation of [ICredential](../interfaces/_core_security_types_.icredential.md)*

*Inherited from [Credential](_core_security_types_.credential.md).[decrypt](_core_security_types_.credential.md#decrypt)*

Defined in src/core/security/Types.ts:333

**Type parameters:**

▪ **T**: *[ICredential](../interfaces/_core_security_types_.icredential.md)*

**Parameters:**

Name | Type |
------ | ------ |
`store` | [ICredentialStore](../interfaces/_core_security_types_.icredentialstore.md) |
`key` | string |
`preferredOutput?` | [SecureOutput](../enums/_core_security_types_.secureoutput.md) |
`keepEncrypted?` | string[] |

**Returns:** *T | null*

___

###  store

▸ **store**(`store`: [ICredentialStore](../interfaces/_core_security_types_.icredentialstore.md)): *string | null*

*Implementation of [ICredential](../interfaces/_core_security_types_.icredential.md)*

*Inherited from [Credential](_core_security_types_.credential.md).[store](_core_security_types_.credential.md#store)*

Defined in src/core/security/Types.ts:345

**Parameters:**

Name | Type |
------ | ------ |
`store` | [ICredentialStore](../interfaces/_core_security_types_.icredentialstore.md) |

**Returns:** *string | null*

___

###  toString

▸ **toString**(): *string*

*Implementation of [ICredential](../interfaces/_core_security_types_.icredential.md)*

*Overrides [Credential](_core_security_types_.credential.md).[toString](_core_security_types_.credential.md#tostring)*

Defined in src/core/security/Types.ts:361

**Returns:** *string*

___

### `Static` from

▸ **from**<**T**>(`value`: any, `key?`: string): *T*

*Inherited from [Credential](_core_security_types_.credential.md).[from](_core_security_types_.credential.md#static-from)*

Defined in src/core/security/Types.ts:243

**Type parameters:**

▪ **T**: *[ICredential](../interfaces/_core_security_types_.icredential.md)*

**Parameters:**

Name | Type |
------ | ------ |
`value` | any |
`key?` | string |

**Returns:** *T*

___

### `Static` isAzureAdClientCredential

▸ **isAzureAdClientCredential**(`value`: [ICredential](../interfaces/_core_security_types_.icredential.md)): *boolean*

*Inherited from [Credential](_core_security_types_.credential.md).[isAzureAdClientCredential](_core_security_types_.credential.md#static-isazureadclientcredential)*

Defined in src/core/security/Types.ts:293

**Parameters:**

Name | Type |
------ | ------ |
`value` | [ICredential](../interfaces/_core_security_types_.icredential.md) |

**Returns:** *boolean*

___

### `Static` isAzureAdUserCredential

▸ **isAzureAdUserCredential**(`value`: [ICredential](../interfaces/_core_security_types_.icredential.md)): *boolean*

*Inherited from [Credential](_core_security_types_.credential.md).[isAzureAdUserCredential](_core_security_types_.credential.md#static-isazureadusercredential)*

Defined in src/core/security/Types.ts:297

**Parameters:**

Name | Type |
------ | ------ |
`value` | [ICredential](../interfaces/_core_security_types_.icredential.md) |

**Returns:** *boolean*

___

### `Static` isCdsOnlineUserCredential

▸ **isCdsOnlineUserCredential**(`value`: [ICredential](../interfaces/_core_security_types_.icredential.md)): *boolean*

*Inherited from [Credential](_core_security_types_.credential.md).[isCdsOnlineUserCredential](_core_security_types_.credential.md#static-iscdsonlineusercredential)*

Defined in src/core/security/Types.ts:301

**Parameters:**

Name | Type |
------ | ------ |
`value` | [ICredential](../interfaces/_core_security_types_.icredential.md) |

**Returns:** *boolean*

___

### `Static` isCredential

▸ **isCredential**(`value`: any): *boolean*

*Inherited from [Credential](_core_security_types_.credential.md).[isCredential](_core_security_types_.credential.md#static-iscredential)*

Defined in src/core/security/Types.ts:281

**Parameters:**

Name | Type |
------ | ------ |
`value` | any |

**Returns:** *boolean*

___

### `Static` isOauthCredential

▸ **isOauthCredential**(`value`: [ICredential](../interfaces/_core_security_types_.icredential.md)): *boolean*

*Inherited from [Credential](_core_security_types_.credential.md).[isOauthCredential](_core_security_types_.credential.md#static-isoauthcredential)*

Defined in src/core/security/Types.ts:289

**Parameters:**

Name | Type |
------ | ------ |
`value` | [ICredential](../interfaces/_core_security_types_.icredential.md) |

**Returns:** *boolean*

___

### `Static` isSecureCredential

▸ **isSecureCredential**<**T**>(`credential`: T): *boolean*

*Inherited from [Credential](_core_security_types_.credential.md).[isSecureCredential](_core_security_types_.credential.md#static-issecurecredential)*

Defined in src/core/security/Types.ts:325

**Type parameters:**

▪ **T**: *[ICredential](../interfaces/_core_security_types_.icredential.md)*

**Parameters:**

Name | Type |
------ | ------ |
`credential` | T |

**Returns:** *boolean*

___

### `Static` isWindowsCredential

▸ **isWindowsCredential**(`value`: [ICredential](../interfaces/_core_security_types_.icredential.md)): *boolean*

*Inherited from [Credential](_core_security_types_.credential.md).[isWindowsCredential](_core_security_types_.credential.md#static-iswindowscredential)*

Defined in src/core/security/Types.ts:285

**Parameters:**

Name | Type |
------ | ------ |
`value` | [ICredential](../interfaces/_core_security_types_.icredential.md) |

**Returns:** *boolean*

___

### `Static` needsToken

▸ **needsToken**(`value`: [ICredential](../interfaces/_core_security_types_.icredential.md)): *boolean*

*Inherited from [Credential](_core_security_types_.credential.md).[needsToken](_core_security_types_.credential.md#static-needstoken)*

Defined in src/core/security/Types.ts:305

**Parameters:**

Name | Type |
------ | ------ |
`value` | [ICredential](../interfaces/_core_security_types_.icredential.md) |

**Returns:** *boolean*

___

### `Static` requireToken

▸ **requireToken**(`value`: [ICredential](../interfaces/_core_security_types_.icredential.md)): *boolean*

*Inherited from [Credential](_core_security_types_.credential.md).[requireToken](_core_security_types_.credential.md#static-requiretoken)*

Defined in src/core/security/Types.ts:309

**Parameters:**

Name | Type |
------ | ------ |
`value` | [ICredential](../interfaces/_core_security_types_.icredential.md) |

**Returns:** *boolean*

___

### `Static` retreive

▸ **retreive**<**T**>(`store`: [ICredentialStore](../interfaces/_core_security_types_.icredentialstore.md), `key`: string): *T | null*

*Inherited from [Credential](_core_security_types_.credential.md).[retreive](_core_security_types_.credential.md#static-retreive)*

Defined in src/core/security/Types.ts:313

**Type parameters:**

▪ **T**: *[ICredential](../interfaces/_core_security_types_.icredential.md)*

**Parameters:**

Name | Type |
------ | ------ |
`store` | [ICredentialStore](../interfaces/_core_security_types_.icredentialstore.md) |
`key` | string |

**Returns:** *T | null*

___

### `Static` setToken

▸ **setToken**(`value`: [ICredential](../interfaces/_core_security_types_.icredential.md), `token`: string): *void*

*Inherited from [Credential](_core_security_types_.credential.md).[setToken](_core_security_types_.credential.md#static-settoken)*

Defined in src/core/security/Types.ts:319

**Parameters:**

Name | Type |
------ | ------ |
`value` | [ICredential](../interfaces/_core_security_types_.icredential.md) |
`token` | string |

**Returns:** *void*
