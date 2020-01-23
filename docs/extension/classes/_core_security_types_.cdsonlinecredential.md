[cds-for-code](../README.md) › [Globals](../globals.md) › ["core/security/Types"](../modules/_core_security_types_.md) › [CdsOnlineCredential](_core_security_types_.cdsonlinecredential.md)

# Class: CdsOnlineCredential

## Hierarchy

  ↳ [OAuthCredential](_core_security_types_.oauthcredential.md)

  ↳ **CdsOnlineCredential**

## Implements

* [ICredential](../interfaces/_core_security_types_.icredential.md)

## Index

### Constructors

* [constructor](_core_security_types_.cdsonlinecredential.md#constructor)

### Properties

* [accessToken](_core_security_types_.cdsonlinecredential.md#optional-accesstoken)
* [authority](_core_security_types_.cdsonlinecredential.md#authority)
* [clientId](_core_security_types_.cdsonlinecredential.md#clientid)
* [isMultiFactorAuthentication](_core_security_types_.cdsonlinecredential.md#ismultifactorauthentication)
* [onDidAuthenticate](_core_security_types_.cdsonlinecredential.md#ondidauthenticate)
* [onInteractiveLoginRequired](_core_security_types_.cdsonlinecredential.md#oninteractiveloginrequired)
* [password](_core_security_types_.cdsonlinecredential.md#password)
* [refreshToken](_core_security_types_.cdsonlinecredential.md#optional-refreshtoken)
* [resource](_core_security_types_.cdsonlinecredential.md#resource)
* [storeKey](_core_security_types_.cdsonlinecredential.md#optional-storekey)
* [tenant](_core_security_types_.cdsonlinecredential.md#tenant)
* [username](_core_security_types_.cdsonlinecredential.md#username)
* [defaultAuthority](_core_security_types_.cdsonlinecredential.md#static-defaultauthority)
* [defaultClientId](_core_security_types_.cdsonlinecredential.md#static-defaultclientid)
* [defaultResource](_core_security_types_.cdsonlinecredential.md#static-defaultresource)
* [defaultTenant](_core_security_types_.cdsonlinecredential.md#static-defaulttenant)
* [publicClientId](_core_security_types_.cdsonlinecredential.md#static-publicclientid)
* [publicTenant](_core_security_types_.cdsonlinecredential.md#static-publictenant)

### Accessors

* [isSecure](_core_security_types_.cdsonlinecredential.md#issecure)
* [Empty](_core_security_types_.cdsonlinecredential.md#static-empty)

### Methods

* [decrypt](_core_security_types_.cdsonlinecredential.md#decrypt)
* [onAuthenticate](_core_security_types_.cdsonlinecredential.md#onauthenticate)
* [onInteractiveLogin](_core_security_types_.cdsonlinecredential.md#oninteractivelogin)
* [store](_core_security_types_.cdsonlinecredential.md#store)
* [toString](_core_security_types_.cdsonlinecredential.md#tostring)
* [from](_core_security_types_.cdsonlinecredential.md#static-from)
* [isAzureAdClientCredential](_core_security_types_.cdsonlinecredential.md#static-isazureadclientcredential)
* [isAzureAdUserCredential](_core_security_types_.cdsonlinecredential.md#static-isazureadusercredential)
* [isCdsOnlineUserCredential](_core_security_types_.cdsonlinecredential.md#static-iscdsonlineusercredential)
* [isCredential](_core_security_types_.cdsonlinecredential.md#static-iscredential)
* [isOauthCredential](_core_security_types_.cdsonlinecredential.md#static-isoauthcredential)
* [isSecureCredential](_core_security_types_.cdsonlinecredential.md#static-issecurecredential)
* [isWindowsCredential](_core_security_types_.cdsonlinecredential.md#static-iswindowscredential)
* [needsToken](_core_security_types_.cdsonlinecredential.md#static-needstoken)
* [requireToken](_core_security_types_.cdsonlinecredential.md#static-requiretoken)
* [retreive](_core_security_types_.cdsonlinecredential.md#static-retreive)
* [setToken](_core_security_types_.cdsonlinecredential.md#static-settoken)

## Constructors

###  constructor

\+ **new CdsOnlineCredential**(`username`: [SecureItem](_core_security_types_.secureitem.md) | [Securable](../modules/_core_security_types_.md#securable), `password`: [SecureItem](_core_security_types_.secureitem.md) | [Securable](../modules/_core_security_types_.md#securable), `authority`: string, `tenant`: string, `clientId`: [SecureItem](_core_security_types_.secureitem.md) | [Securable](../modules/_core_security_types_.md#securable), `resource`: string, `refreshToken?`: [SecureItem](_core_security_types_.secureitem.md) | [Securable](../modules/_core_security_types_.md#securable), `accessToken?`: [SecureItem](_core_security_types_.secureitem.md) | [Securable](../modules/_core_security_types_.md#securable)): *[CdsOnlineCredential](_core_security_types_.cdsonlinecredential.md)*

*Overrides [OAuthCredential](_core_security_types_.oauthcredential.md).[constructor](_core_security_types_.oauthcredential.md#constructor)*

Defined in src/core/security/Types.ts:442

**Parameters:**

Name | Type | Default |
------ | ------ | ------ |
`username` | [SecureItem](_core_security_types_.secureitem.md) &#124; [Securable](../modules/_core_security_types_.md#securable) | - |
`password` | [SecureItem](_core_security_types_.secureitem.md) &#124; [Securable](../modules/_core_security_types_.md#securable) | - |
`authority` | string | CdsOnlineCredential.defaultAuthority |
`tenant` | string | CdsOnlineCredential.publicTenant |
`clientId` | [SecureItem](_core_security_types_.secureitem.md) &#124; [Securable](../modules/_core_security_types_.md#securable) | CdsOnlineCredential.publicClientId |
`resource` | string | CdsOnlineCredential.defaultResource |
`refreshToken?` | [SecureItem](_core_security_types_.secureitem.md) &#124; [Securable](../modules/_core_security_types_.md#securable) | - |
`accessToken?` | [SecureItem](_core_security_types_.secureitem.md) &#124; [Securable](../modules/_core_security_types_.md#securable) | - |

**Returns:** *[CdsOnlineCredential](_core_security_types_.cdsonlinecredential.md)*

## Properties

### `Optional` accessToken

• **accessToken**? : *[SecureItem](_core_security_types_.secureitem.md) | [Securable](../modules/_core_security_types_.md#securable)*

*Inherited from [OAuthCredential](_core_security_types_.oauthcredential.md).[accessToken](_core_security_types_.oauthcredential.md#optional-accesstoken)*

Defined in src/core/security/Types.ts:367

___

###  authority

• **authority**: *string*

Defined in src/core/security/Types.ts:447

___

###  clientId

• **clientId**: *[SecureItem](_core_security_types_.secureitem.md) | [Securable](../modules/_core_security_types_.md#securable)*

Defined in src/core/security/Types.ts:449

___

###  isMultiFactorAuthentication

• **isMultiFactorAuthentication**: *boolean*

*Inherited from [OAuthCredential](_core_security_types_.oauthcredential.md).[isMultiFactorAuthentication](_core_security_types_.oauthcredential.md#ismultifactorauthentication)*

Defined in src/core/security/Types.ts:371

___

###  onDidAuthenticate

• **onDidAuthenticate**: *Event‹[AuthenticationResult](../modules/_core_security_authentication_.md#authenticationresult)›* = this._onDidAuthenticate.event

*Inherited from [OAuthCredential](_core_security_types_.oauthcredential.md).[onDidAuthenticate](_core_security_types_.oauthcredential.md#ondidauthenticate)*

Defined in src/core/security/Types.ts:377

___

###  onInteractiveLoginRequired

• **onInteractiveLoginRequired**: *Event‹[AuthenticationResult](../modules/_core_security_authentication_.md#authenticationresult)›* = this._onInteractiveLoginRequired.event

*Inherited from [OAuthCredential](_core_security_types_.oauthcredential.md).[onInteractiveLoginRequired](_core_security_types_.oauthcredential.md#oninteractiveloginrequired)*

Defined in src/core/security/Types.ts:376

___

###  password

• **password**: *[ISecureItem](../interfaces/_core_security_types_.isecureitem.md) | [Securable](../modules/_core_security_types_.md#securable)*

*Implementation of [ICredential](../interfaces/_core_security_types_.icredential.md).[password](../interfaces/_core_security_types_.icredential.md#password)*

*Inherited from [Credential](_core_security_types_.credential.md).[password](_core_security_types_.credential.md#password)*

Defined in src/core/security/Types.ts:235

___

### `Optional` refreshToken

• **refreshToken**? : *[SecureItem](_core_security_types_.secureitem.md) | [Securable](../modules/_core_security_types_.md#securable)*

*Inherited from [OAuthCredential](_core_security_types_.oauthcredential.md).[refreshToken](_core_security_types_.oauthcredential.md#optional-refreshtoken)*

Defined in src/core/security/Types.ts:367

___

###  resource

• **resource**: *string*

Defined in src/core/security/Types.ts:450

___

### `Optional` storeKey

• **storeKey**? : *string*

*Implementation of [ICredential](../interfaces/_core_security_types_.icredential.md).[storeKey](../interfaces/_core_security_types_.icredential.md#optional-storekey)*

*Inherited from [Credential](_core_security_types_.credential.md).[storeKey](_core_security_types_.credential.md#optional-storekey)*

Defined in src/core/security/Types.ts:236

___

###  tenant

• **tenant**: *string*

Defined in src/core/security/Types.ts:448

___

###  username

• **username**: *[ISecureItem](../interfaces/_core_security_types_.isecureitem.md) | [Securable](../modules/_core_security_types_.md#securable)*

*Implementation of [ICredential](../interfaces/_core_security_types_.icredential.md).[username](../interfaces/_core_security_types_.icredential.md#username)*

*Inherited from [Credential](_core_security_types_.credential.md).[username](_core_security_types_.credential.md#username)*

Defined in src/core/security/Types.ts:234

___

### `Static` defaultAuthority

▪ **defaultAuthority**: *string* = "https://login.microsoftonline.com"

Defined in src/core/security/Types.ts:439

___

### `Static` defaultClientId

▪ **defaultClientId**: *string* = "38496a28-9c28-4ff8-8dac-ef2fe85f6275"

Defined in src/core/security/Types.ts:438

___

### `Static` defaultResource

▪ **defaultResource**: *string* = "https://disco.crm.dynamics.com/"

Defined in src/core/security/Types.ts:442

___

### `Static` defaultTenant

▪ **defaultTenant**: *string* = "common"

Defined in src/core/security/Types.ts:441

___

### `Static` publicClientId

▪ **publicClientId**: *string* = "51f81489-12ee-4a9e-aaae-a2591f45987d"

Defined in src/core/security/Types.ts:435

___

### `Static` publicTenant

▪ **publicTenant**: *string* = "common"

Defined in src/core/security/Types.ts:436

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

###  onAuthenticate

▸ **onAuthenticate**(`result`: [AuthenticationResult](../modules/_core_security_authentication_.md#authenticationresult)): *void*

*Inherited from [OAuthCredential](_core_security_types_.oauthcredential.md).[onAuthenticate](_core_security_types_.oauthcredential.md#onauthenticate)*

Defined in src/core/security/Types.ts:385

**Parameters:**

Name | Type |
------ | ------ |
`result` | [AuthenticationResult](../modules/_core_security_authentication_.md#authenticationresult) |

**Returns:** *void*

___

###  onInteractiveLogin

▸ **onInteractiveLogin**(`result`: [AuthenticationResult](../modules/_core_security_authentication_.md#authenticationresult)): *void*

*Inherited from [OAuthCredential](_core_security_types_.oauthcredential.md).[onInteractiveLogin](_core_security_types_.oauthcredential.md#oninteractivelogin)*

Defined in src/core/security/Types.ts:379

**Parameters:**

Name | Type |
------ | ------ |
`result` | [AuthenticationResult](../modules/_core_security_authentication_.md#authenticationresult) |

**Returns:** *void*

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

*Inherited from [Credential](_core_security_types_.credential.md).[toString](_core_security_types_.credential.md#tostring)*

Defined in src/core/security/Types.ts:351

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
