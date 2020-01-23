---
id: "_api_cdsconnectionstring_.cdsconnectionstring"
title: "CdsConnectionString"
sidebar_label: "CdsConnectionString"
---

[cds-for-code](../index.md) › [Globals](../globals.md) › ["api/CdsConnectionString"](../modules/_api_cdsconnectionstring_.md) › [CdsConnectionString](_api_cdsconnectionstring_.cdsconnectionstring.md)

## Hierarchy

* **CdsConnectionString**

## Index

### Constructors

* [constructor](_api_cdsconnectionstring_.cdsconnectionstring.md#constructor)

### Properties

* [clientId](_api_cdsconnectionstring_.cdsconnectionstring.md#optional-clientid)
* [domain](_api_cdsconnectionstring_.cdsconnectionstring.md#optional-domain)
* [homeRealm](_api_cdsconnectionstring_.cdsconnectionstring.md#optional-homerealm)
* [password](_api_cdsconnectionstring_.cdsconnectionstring.md#optional-password)
* [redirectUri](_api_cdsconnectionstring_.cdsconnectionstring.md#optional-redirecturi)
* [requireNewInstance](_api_cdsconnectionstring_.cdsconnectionstring.md#optional-requirenewinstance)
* [tokenCacheStorePath](_api_cdsconnectionstring_.cdsconnectionstring.md#optional-tokencachestorepath)
* [type](_api_cdsconnectionstring_.cdsconnectionstring.md#type)
* [uri](_api_cdsconnectionstring_.cdsconnectionstring.md#uri)
* [username](_api_cdsconnectionstring_.cdsconnectionstring.md#optional-username)

### Methods

* [toConfig](_api_cdsconnectionstring_.cdsconnectionstring.md#toconfig)
* [toString](_api_cdsconnectionstring_.cdsconnectionstring.md#tostring)
* [from](_api_cdsconnectionstring_.cdsconnectionstring.md#static-from)

## Constructors

###  constructor

\+ **new CdsConnectionString**(`connectionString?`: string | undefined): *[CdsConnectionString](_api_cdsconnectionstring_.cdsconnectionstring.md)*

Defined in src/api/CdsConnectionString.ts:5

**Parameters:**

Name | Type |
------ | ------ |
`connectionString?` | string &#124; undefined |

**Returns:** *[CdsConnectionString](_api_cdsconnectionstring_.cdsconnectionstring.md)*

## Properties

### `Optional` clientId

• **clientId**? : *string*

Defined in src/api/CdsConnectionString.ts:19

___

### `Optional` domain

• **domain**? : *string*

Defined in src/api/CdsConnectionString.ts:14

___

### `Optional` homeRealm

• **homeRealm**? : *Uri*

Defined in src/api/CdsConnectionString.ts:17

___

### `Optional` password

• **password**? : *string*

Defined in src/api/CdsConnectionString.ts:16

___

### `Optional` redirectUri

• **redirectUri**? : *Uri*

Defined in src/api/CdsConnectionString.ts:20

___

### `Optional` requireNewInstance

• **requireNewInstance**? : *boolean*

Defined in src/api/CdsConnectionString.ts:18

___

### `Optional` tokenCacheStorePath

• **tokenCacheStorePath**? : *string*

Defined in src/api/CdsConnectionString.ts:21

___

###  type

• **type**: *[ConfigType](../enums/_api_cds_webapi_cdswebapi_.cdswebapi.configtype.md)*

Defined in src/api/CdsConnectionString.ts:12

___

###  uri

• **uri**: *Uri*

Defined in src/api/CdsConnectionString.ts:13

___

### `Optional` username

• **username**? : *string*

Defined in src/api/CdsConnectionString.ts:15

## Methods

###  toConfig

▸ **toConfig**(): *[Config](../interfaces/_api_cds_webapi_cdswebapi_.cdswebapi.config.md)*

Defined in src/api/CdsConnectionString.ts:189

**Returns:** *[Config](../interfaces/_api_cds_webapi_cdswebapi_.cdswebapi.config.md)*

___

###  toString

▸ **toString**(): *string*

Defined in src/api/CdsConnectionString.ts:130

**Returns:** *string*

___

### `Static` from

▸ **from**(`connectionString`: string, `into?`: [CdsConnectionString](_api_cdsconnectionstring_.cdsconnectionstring.md)): *[CdsConnectionString](_api_cdsconnectionstring_.cdsconnectionstring.md)*

Defined in src/api/CdsConnectionString.ts:23

**Parameters:**

Name | Type |
------ | ------ |
`connectionString` | string |
`into?` | [CdsConnectionString](_api_cdsconnectionstring_.cdsconnectionstring.md) |

**Returns:** *[CdsConnectionString](_api_cdsconnectionstring_.cdsconnectionstring.md)*
