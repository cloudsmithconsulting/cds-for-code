---
id: "_repositories_dataapirepository_.dataapirepository"
title: "DataApiRepository"
sidebar_label: "DataApiRepository"
---

[cds-for-code](../index.md) › [Globals](../globals.md) › ["repositories/DataApiRepository"](../modules/_repositories_dataapirepository_.md) › [DataApiRepository](_repositories_dataapirepository_.dataapirepository.md)

## Hierarchy

* [CdsRepository](_api_cdsrepository_.cdsrepository.md)

  ↳ **DataApiRepository**

## Index

### Constructors

* [constructor](_repositories_dataapirepository_.dataapirepository.md#constructor)

### Properties

* [webapi](_repositories_dataapirepository_.dataapirepository.md#protected-webapi)

### Accessors

* [config](_repositories_dataapirepository_.dataapirepository.md#config)

### Methods

* [createImportJob](_repositories_dataapirepository_.dataapirepository.md#createimportjob)
* [getLookupValues](_repositories_dataapirepository_.dataapirepository.md#getlookupvalues)
* [getPartyListMembers](_repositories_dataapirepository_.dataapirepository.md#getpartylistmembers)
* [getSampleCustomers](_repositories_dataapirepository_.dataapirepository.md#getsamplecustomers)
* [getSystemUsers](_repositories_dataapirepository_.dataapirepository.md#getsystemusers)
* [importRecordsFromImportJob](_repositories_dataapirepository_.dataapirepository.md#importrecordsfromimportjob)
* [parseImportJob](_repositories_dataapirepository_.dataapirepository.md#parseimportjob)
* [transformImportJob](_repositories_dataapirepository_.dataapirepository.md#transformimportjob)

## Constructors

###  constructor

\+ **new DataApiRepository**(`config`: [Config](../interfaces/_api_cds_webapi_cdswebapi_.cdswebapi.config.md)): *[DataApiRepository](_repositories_dataapirepository_.dataapirepository.md)*

*Inherited from [CdsRepository](_api_cdsrepository_.cdsrepository.md).[constructor](_api_cdsrepository_.cdsrepository.md#constructor)*

Defined in src/api/CdsRepository.ts:3

**Parameters:**

Name | Type |
------ | ------ |
`config` | [Config](../interfaces/_api_cds_webapi_cdswebapi_.cdswebapi.config.md) |

**Returns:** *[DataApiRepository](_repositories_dataapirepository_.dataapirepository.md)*

## Properties

### `Protected` webapi

• **webapi**: *[WebApiClient](_api_cds_webapi_cdswebapi_.cdswebapi.webapiclient.md)*

*Inherited from [CdsRepository](_api_cdsrepository_.cdsrepository.md).[webapi](_api_cdsrepository_.cdsrepository.md#protected-webapi)*

Defined in src/api/CdsRepository.ts:8

## Accessors

###  config

• **get config**(): *[Config](../interfaces/_api_cds_webapi_cdswebapi_.cdswebapi.config.md)*

*Inherited from [CdsRepository](_api_cdsrepository_.cdsrepository.md).[config](_api_cdsrepository_.cdsrepository.md#config)*

Defined in src/api/CdsRepository.ts:10

**Returns:** *[Config](../interfaces/_api_cds_webapi_cdswebapi_.cdswebapi.config.md)*

## Methods

###  createImportJob

▸ **createImportJob**(`importJob`: any, `importFile`: any): *Promise‹string›*

Defined in src/repositories/DataApiRepository.ts:101

**Parameters:**

Name | Type |
------ | ------ |
`importJob` | any |
`importFile` | any |

**Returns:** *Promise‹string›*

___

###  getLookupValues

▸ **getLookupValues**(`collection`: string, `count`: number): *Promise‹any[]›*

Defined in src/repositories/DataApiRepository.ts:10

**Parameters:**

Name | Type | Default |
------ | ------ | ------ |
`collection` | string | - |
`count` | number | 25 |

**Returns:** *Promise‹any[]›*

___

###  getPartyListMembers

▸ **getPartyListMembers**(`count`: number): *Promise‹any[]›*

Defined in src/repositories/DataApiRepository.ts:30

**Parameters:**

Name | Type | Default |
------ | ------ | ------ |
`count` | number | 25 |

**Returns:** *Promise‹any[]›*

___

###  getSampleCustomers

▸ **getSampleCustomers**(`count`: number): *Promise‹any[]›*

Defined in src/repositories/DataApiRepository.ts:79

**Parameters:**

Name | Type | Default |
------ | ------ | ------ |
`count` | number | 25 |

**Returns:** *Promise‹any[]›*

___

###  getSystemUsers

▸ **getSystemUsers**(`count`: number): *Promise‹any[]›*

Defined in src/repositories/DataApiRepository.ts:58

**Parameters:**

Name | Type | Default |
------ | ------ | ------ |
`count` | number | 25 |

**Returns:** *Promise‹any[]›*

___

###  importRecordsFromImportJob

▸ **importRecordsFromImportJob**(`importId`: string, `timeout`: number): *Promise‹any›*

Defined in src/repositories/DataApiRepository.ts:140

**Parameters:**

Name | Type | Default |
------ | ------ | ------ |
`importId` | string | - |
`timeout` | number | defaultTimeout |

**Returns:** *Promise‹any›*

___

###  parseImportJob

▸ **parseImportJob**(`importId`: string, `timeout`: number): *Promise‹any›*

Defined in src/repositories/DataApiRepository.ts:112

**Parameters:**

Name | Type | Default |
------ | ------ | ------ |
`importId` | string | - |
`timeout` | number | defaultTimeout |

**Returns:** *Promise‹any›*

___

###  transformImportJob

▸ **transformImportJob**(`importId`: string, `timeout`: number): *Promise‹any›*

Defined in src/repositories/DataApiRepository.ts:126

**Parameters:**

Name | Type | Default |
------ | ------ | ------ |
`importId` | string | - |
`timeout` | number | defaultTimeout |

**Returns:** *Promise‹any›*
