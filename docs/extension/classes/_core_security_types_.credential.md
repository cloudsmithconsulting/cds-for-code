[cds-for-code](../README.md) › [Globals](../globals.md) › ["core/security/Types"](../modules/_core_security_types_.md) › [Credential](_core_security_types_.credential.md)

# Class: Credential

## Hierarchy

* **Credential**

  ↳ [WindowsCredential](_core_security_types_.windowscredential.md)

  ↳ [OAuthCredential](_core_security_types_.oauthcredential.md)

## Implements

* [ICredential](../interfaces/_core_security_types_.icredential.md)

## Index

### Constructors

* [constructor](_core_security_types_.credential.md#protected-constructor)

### Properties

* [password](_core_security_types_.credential.md#password)
* [storeKey](_core_security_types_.credential.md#optional-storekey)
* [username](_core_security_types_.credential.md#username)

### Accessors

* [isSecure](_core_security_types_.credential.md#issecure)
* [Empty](_core_security_types_.credential.md#static-empty)

### Methods

* [decrypt](_core_security_types_.credential.md#decrypt)
* [store](_core_security_types_.credential.md#store)
* [toString](_core_security_types_.credential.md#tostring)
* [from](_core_security_types_.credential.md#static-from)
* [isAzureAdClientCredential](_core_security_types_.credential.md#static-isazureadclientcredential)
* [isAzureAdUserCredential](_core_security_types_.credential.md#static-isazureadusercredential)
* [isCdsOnlineUserCredential](_core_security_types_.credential.md#static-iscdsonlineusercredential)
* [isCredential](_core_security_types_.credential.md#static-iscredential)
* [isOauthCredential](_core_security_types_.credential.md#static-isoauthcredential)
* [isSecureCredential](_core_security_types_.credential.md#static-issecurecredential)
* [isWindowsCredential](_core_security_types_.credential.md#static-iswindowscredential)
* [needsToken](_core_security_types_.credential.md#static-needstoken)
* [requireToken](_core_security_types_.credential.md#static-requiretoken)
* [retreive](_core_security_types_.credential.md#static-retreive)
* [setToken](_core_security_types_.credential.md#static-settoken)

## Constructors

### `Protected` constructor

\+ **new Credential**(`username`: [ISecureItem](../interfaces/_core_security_types_.isecureitem.md) | [Securable](../modules/_core_security_types_.md#securable), `password`: [ISecureItem](../interfaces/_core_security_types_.isecureitem.md) | [Securable](../modules/_core_security_types_.md#securable), `storeKey?`: string): *[Credential](_core_security_types_.credential.md)*

Defined in src/core/security/Types.ts:232

**Parameters:**

Name | Type |
------ | ------ |
`username` | [ISecureItem](../interfaces/_core_security_types_.isecureitem.md) &#124; [Securable](../modules/_core_security_types_.md#securable) |
`password` | [ISecureItem](../interfaces/_core_security_types_.isecureitem.md) &#124; [Securable](../modules/_core_security_types_.md#securable) |
`storeKey?` | string |

**Returns:** *[Credential](_core_security_types_.credential.md)*

## Properties

###  password

• **password**: *[ISecureItem](../interfaces/_core_security_types_.isecureitem.md) | [Securable](../modules/_core_security_types_.md#securable)*

*Implementation of [ICredential](../interfaces/_core_security_types_.icredential.md).[password](../interfaces/_core_security_types_.icredential.md#password)*

Defined in src/core/security/Types.ts:235

___

### `Optional` storeKey

• **storeKey**? : *string*

*Implementation of [ICredential](../interfaces/_core_security_types_.icredential.md).[storeKey](../interfaces/_core_security_types_.icredential.md#optional-storekey)*

Defined in src/core/security/Types.ts:236

___

###  username

• **username**: *[ISecureItem](../interfaces/_core_security_types_.isecureitem.md) | [Securable](../modules/_core_security_types_.md#securable)*

*Implementation of [ICredential](../interfaces/_core_security_types_.icredential.md).[username](../interfaces/_core_security_types_.icredential.md#username)*

Defined in src/core/security/Types.ts:234

## Accessors

###  isSecure

• **get isSecure**(): *boolean*

Defined in src/core/security/Types.ts:329

**Returns:** *boolean*

___

### `Static` Empty

• **get Empty**(): *[Credential](_core_security_types_.credential.md)*

Defined in src/core/security/Types.ts:239

**Returns:** *[Credential](_core_security_types_.credential.md)*

## Methods

###  decrypt

▸ **decrypt**<**T**>(`store`: [ICredentialStore](../interfaces/_core_security_types_.icredentialstore.md), `key`: string, `preferredOutput?`: [SecureOutput](../enums/_core_security_types_.secureoutput.md), `keepEncrypted?`: string[]): *T | null*

*Implementation of [ICredential](../interfaces/_core_security_types_.icredential.md)*

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

Defined in src/core/security/Types.ts:351

**Returns:** *string*

___

### `Static` from

▸ **from**<**T**>(`value`: any, `key?`: string): *T*

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

Defined in src/core/security/Types.ts:293

**Parameters:**

Name | Type |
------ | ------ |
`value` | [ICredential](../interfaces/_core_security_types_.icredential.md) |

**Returns:** *boolean*

___

### `Static` isAzureAdUserCredential

▸ **isAzureAdUserCredential**(`value`: [ICredential](../interfaces/_core_security_types_.icredential.md)): *boolean*

Defined in src/core/security/Types.ts:297

**Parameters:**

Name | Type |
------ | ------ |
`value` | [ICredential](../interfaces/_core_security_types_.icredential.md) |

**Returns:** *boolean*

___

### `Static` isCdsOnlineUserCredential

▸ **isCdsOnlineUserCredential**(`value`: [ICredential](../interfaces/_core_security_types_.icredential.md)): *boolean*

Defined in src/core/security/Types.ts:301

**Parameters:**

Name | Type |
------ | ------ |
`value` | [ICredential](../interfaces/_core_security_types_.icredential.md) |

**Returns:** *boolean*

___

### `Static` isCredential

▸ **isCredential**(`value`: any): *boolean*

Defined in src/core/security/Types.ts:281

**Parameters:**

Name | Type |
------ | ------ |
`value` | any |

**Returns:** *boolean*

___

### `Static` isOauthCredential

▸ **isOauthCredential**(`value`: [ICredential](../interfaces/_core_security_types_.icredential.md)): *boolean*

Defined in src/core/security/Types.ts:289

**Parameters:**

Name | Type |
------ | ------ |
`value` | [ICredential](../interfaces/_core_security_types_.icredential.md) |

**Returns:** *boolean*

___

### `Static` isSecureCredential

▸ **isSecureCredential**<**T**>(`credential`: T): *boolean*

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

Defined in src/core/security/Types.ts:285

**Parameters:**

Name | Type |
------ | ------ |
`value` | [ICredential](../interfaces/_core_security_types_.icredential.md) |

**Returns:** *boolean*

___

### `Static` needsToken

▸ **needsToken**(`value`: [ICredential](../interfaces/_core_security_types_.icredential.md)): *boolean*

Defined in src/core/security/Types.ts:305

**Parameters:**

Name | Type |
------ | ------ |
`value` | [ICredential](../interfaces/_core_security_types_.icredential.md) |

**Returns:** *boolean*

___

### `Static` requireToken

▸ **requireToken**(`value`: [ICredential](../interfaces/_core_security_types_.icredential.md)): *boolean*

Defined in src/core/security/Types.ts:309

**Parameters:**

Name | Type |
------ | ------ |
`value` | [ICredential](../interfaces/_core_security_types_.icredential.md) |

**Returns:** *boolean*

___

### `Static` retreive

▸ **retreive**<**T**>(`store`: [ICredentialStore](../interfaces/_core_security_types_.icredentialstore.md), `key`: string): *T | null*

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

Defined in src/core/security/Types.ts:319

**Parameters:**

Name | Type |
------ | ------ |
`value` | [ICredential](../interfaces/_core_security_types_.icredential.md) |
`token` | string |

**Returns:** *void*
