---
id: "_repositories_discoveryrepository_.discoveryrepository"
title: "DiscoveryRepository"
sidebar_label: "DiscoveryRepository"
---

[cds-for-code](../index.md) › [Globals](../globals.md) › ["repositories/discoveryRepository"](../modules/_repositories_discoveryrepository_.md) › [DiscoveryRepository](_repositories_discoveryrepository_.discoveryrepository.md)

## Hierarchy

* **DiscoveryRepository**

## Index

### Constructors

* [constructor](_repositories_discoveryrepository_.discoveryrepository.md#constructor)

### Properties

* [webapi](_repositories_discoveryrepository_.discoveryrepository.md#private-webapi)

### Accessors

* [config](_repositories_discoveryrepository_.discoveryrepository.md#config)

### Methods

* [retrieveOrganizations](_repositories_discoveryrepository_.discoveryrepository.md#retrieveorganizations)
* [createOrganizationConnection](_repositories_discoveryrepository_.discoveryrepository.md#static-createorganizationconnection)
* [getConnections](_repositories_discoveryrepository_.discoveryrepository.md#static-getconnections)
* [getOrgConnections](_repositories_discoveryrepository_.discoveryrepository.md#static-getorgconnections)
* [saveConnections](_repositories_discoveryrepository_.discoveryrepository.md#static-saveconnections)

## Constructors

###  constructor

\+ **new DiscoveryRepository**(`config`: [Config](../interfaces/_api_cds_webapi_cdswebapi_.cdswebapi.config.md)): *[DiscoveryRepository](_repositories_discoveryrepository_.discoveryrepository.md)*

Defined in src/repositories/discoveryRepository.ts:9

**Parameters:**

Name | Type |
------ | ------ |
`config` | [Config](../interfaces/_api_cds_webapi_cdswebapi_.cdswebapi.config.md) |

**Returns:** *[DiscoveryRepository](_repositories_discoveryrepository_.discoveryrepository.md)*

## Properties

### `Private` webapi

• **webapi**: *[WebApiClient](_api_cds_webapi_cdswebapi_.cdswebapi.webapiclient.md)*

Defined in src/repositories/discoveryRepository.ts:14

## Accessors

###  config

• **get config**(): *[Config](../interfaces/_api_cds_webapi_cdswebapi_.cdswebapi.config.md)*

Defined in src/repositories/discoveryRepository.ts:16

**Returns:** *[Config](../interfaces/_api_cds_webapi_cdswebapi_.cdswebapi.config.md)*

## Methods

###  retrieveOrganizations

▸ **retrieveOrganizations**(`filter?`: string): *Promise‹any›*

Defined in src/repositories/discoveryRepository.ts:20

**Parameters:**

Name | Type |
------ | ------ |
`filter?` | string |

**Returns:** *Promise‹any›*

___

### `Static` createOrganizationConnection

▸ **createOrganizationConnection**(`org`: any, `connection`: [Config](../interfaces/_api_cds_webapi_cdswebapi_.cdswebapi.config.md)): *[Config](../interfaces/_api_cds_webapi_cdswebapi_.cdswebapi.config.md)*

Defined in src/repositories/discoveryRepository.ts:70

**Parameters:**

Name | Type |
------ | ------ |
`org` | any |
`connection` | [Config](../interfaces/_api_cds_webapi_cdswebapi_.cdswebapi.config.md) |

**Returns:** *[Config](../interfaces/_api_cds_webapi_cdswebapi_.cdswebapi.config.md)*

___

### `Static` getConnections

▸ **getConnections**(`context`: ExtensionContext): *[Config](../interfaces/_api_cds_webapi_cdswebapi_.cdswebapi.config.md)[]*

Defined in src/repositories/discoveryRepository.ts:34

**Parameters:**

Name | Type |
------ | ------ |
`context` | ExtensionContext |

**Returns:** *[Config](../interfaces/_api_cds_webapi_cdswebapi_.cdswebapi.config.md)[]*

___

### `Static` getOrgConnections

▸ **getOrgConnections**(`context`: ExtensionContext, `exactMatchesOnly`: boolean): *Promise‹[Config](../interfaces/_api_cds_webapi_cdswebapi_.cdswebapi.config.md)[]›*

Defined in src/repositories/discoveryRepository.ts:40

**Parameters:**

Name | Type | Default |
------ | ------ | ------ |
`context` | ExtensionContext | - |
`exactMatchesOnly` | boolean | false |

**Returns:** *Promise‹[Config](../interfaces/_api_cds_webapi_cdswebapi_.cdswebapi.config.md)[]›*

___

### `Static` saveConnections

▸ **saveConnections**(`context`: ExtensionContext, `connections`: [Config](../interfaces/_api_cds_webapi_cdswebapi_.cdswebapi.config.md)[]): *[Config](../interfaces/_api_cds_webapi_cdswebapi_.cdswebapi.config.md)[]*

Defined in src/repositories/discoveryRepository.ts:64

**Parameters:**

Name | Type |
------ | ------ |
`context` | ExtensionContext |
`connections` | [Config](../interfaces/_api_cds_webapi_cdswebapi_.cdswebapi.config.md)[] |

**Returns:** *[Config](../interfaces/_api_cds_webapi_cdswebapi_.cdswebapi.config.md)[]*
