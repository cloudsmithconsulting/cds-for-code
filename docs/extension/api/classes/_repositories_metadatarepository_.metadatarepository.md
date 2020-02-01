---
id: "_repositories_metadatarepository_.metadatarepository"
title: "MetadataRepository"
sidebar_label: "MetadataRepository"
---

[cds-for-code](../index.md) › [Globals](../globals.md) › ["repositories/metadataRepository"](../modules/_repositories_metadatarepository_.md) › [MetadataRepository](_repositories_metadatarepository_.metadatarepository.md)

## Hierarchy

* **MetadataRepository**

## Index

### Constructors

* [constructor](_repositories_metadatarepository_.metadatarepository.md#constructor)

### Properties

* [webapi](_repositories_metadatarepository_.metadatarepository.md#private-webapi)
* [defaultSelections](_repositories_metadatarepository_.metadatarepository.md#static-defaultselections)

### Accessors

* [config](_repositories_metadatarepository_.metadatarepository.md#config)

### Methods

* [retrieveAttributes](_repositories_metadatarepository_.metadatarepository.md#retrieveattributes)
* [retrieveCharts](_repositories_metadatarepository_.metadatarepository.md#retrievecharts)
* [retrieveDashboards](_repositories_metadatarepository_.metadatarepository.md#retrievedashboards)
* [retrieveEntities](_repositories_metadatarepository_.metadatarepository.md#retrieveentities)
* [retrieveEntityByKey](_repositories_metadatarepository_.metadatarepository.md#retrieveentitybykey)
* [retrieveEntityByLogicalName](_repositories_metadatarepository_.metadatarepository.md#retrieveentitybylogicalname)
* [retrieveEntityMetadataId](_repositories_metadatarepository_.metadatarepository.md#retrieveentitymetadataid)
* [retrieveForms](_repositories_metadatarepository_.metadatarepository.md#retrieveforms)
* [retrieveKeys](_repositories_metadatarepository_.metadatarepository.md#retrievekeys)
* [retrieveOptionSets](_repositories_metadatarepository_.metadatarepository.md#retrieveoptionsets)
* [retrieveRelationships](_repositories_metadatarepository_.metadatarepository.md#retrieverelationships)
* [retrieveViews](_repositories_metadatarepository_.metadatarepository.md#retrieveviews)

## Constructors

###  constructor

\+ **new MetadataRepository**(`config`: [Config](../interfaces/_api_cds_webapi_cdswebapi_.cdswebapi.config.md)): *[MetadataRepository](_repositories_metadatarepository_.metadatarepository.md)*

Defined in src/repositories/metadataRepository.ts:7

**Parameters:**

Name | Type |
------ | ------ |
`config` | [Config](../interfaces/_api_cds_webapi_cdswebapi_.cdswebapi.config.md) |

**Returns:** *[MetadataRepository](_repositories_metadatarepository_.metadatarepository.md)*

## Properties

### `Private` webapi

• **webapi**: *[WebApiClient](_api_cds_webapi_cdswebapi_.cdswebapi.webapiclient.md)*

Defined in src/repositories/metadataRepository.ts:12

___

### `Static` defaultSelections

▪ **defaultSelections**: *[Dictionary](_core_types_dictionary_.dictionary.md)‹string, string[]›* = new Dictionary<string, string[]>([
        { key: 'EntityDefinitions', value: [ 'MetadataId', 'LogicalName', 'DisplayName', 'IsIntersect', 'PrimaryIdAttribute', 'PrimaryNameAttribute' ] },
        { key: 'AttributeDefinitions', value: [ 'MetadataId', 'LogicalName', 'DisplayName', 'AttributeOf', 'AttributeType', 'AttributeTypeName' ] },
        { key: 'systemforms', value: [ 'formid', 'objecttypecode', 'type', 'formactivationstate', 'name', 'description' ] },
        { key: 'savedqueries', value: [ 'savedqueryid', 'returnedtypecode', 'statecode', 'name', 'description' ] },
        { key: 'savedqueryvisualizations', value: [ 'savedqueryvisualizationid', 'primaryentitytypecode', 'name', 'description' ] },
    ])

Defined in src/repositories/metadataRepository.ts:18

## Accessors

###  config

• **get config**(): *[Config](../interfaces/_api_cds_webapi_cdswebapi_.cdswebapi.config.md)*

Defined in src/repositories/metadataRepository.ts:14

**Returns:** *[Config](../interfaces/_api_cds_webapi_cdswebapi_.cdswebapi.config.md)*

## Methods

###  retrieveAttributes

▸ **retrieveAttributes**(`entityKey`: string, `select`: string[]): *Promise‹any[]›*

Defined in src/repositories/metadataRepository.ts:45

**Parameters:**

Name | Type | Default |
------ | ------ | ------ |
`entityKey` | string | - |
`select` | string[] | MetadataRepository.defaultSelections["AttributeDefinitions"] |

**Returns:** *Promise‹any[]›*

___

###  retrieveCharts

▸ **retrieveCharts**(`entityLogicalName`: string, `solutionId?`: string, `select`: string[]): *Promise‹any[]›*

Defined in src/repositories/metadataRepository.ts:95

**Parameters:**

Name | Type | Default |
------ | ------ | ------ |
`entityLogicalName` | string | - |
`solutionId?` | string | - |
`select` | string[] | MetadataRepository.defaultSelections["savedqueryvisualizations"] |

**Returns:** *Promise‹any[]›*

___

###  retrieveDashboards

▸ **retrieveDashboards**(`entityLogicalName`: string, `solutionId?`: string, `select`: string[]): *Promise‹any[]›*

Defined in src/repositories/metadataRepository.ts:69

**Parameters:**

Name | Type | Default |
------ | ------ | ------ |
`entityLogicalName` | string | - |
`solutionId?` | string | - |
`select` | string[] | MetadataRepository.defaultSelections["systemforms"] |

**Returns:** *Promise‹any[]›*

___

###  retrieveEntities

▸ **retrieveEntities**(`solutionId?`: string, `select`: string[]): *Promise‹any[]›*

Defined in src/repositories/metadataRepository.ts:39

**Parameters:**

Name | Type | Default |
------ | ------ | ------ |
`solutionId?` | string | - |
`select` | string[] | MetadataRepository.defaultSelections["EntityDefinitions"] |

**Returns:** *Promise‹any[]›*

___

###  retrieveEntityByKey

▸ **retrieveEntityByKey**(`entityKey`: string, `select`: string[]): *Promise‹any›*

Defined in src/repositories/metadataRepository.ts:31

**Parameters:**

Name | Type | Default |
------ | ------ | ------ |
`entityKey` | string | - |
`select` | string[] | MetadataRepository.defaultSelections["EntityDefinitions"] |

**Returns:** *Promise‹any›*

___

###  retrieveEntityByLogicalName

▸ **retrieveEntityByLogicalName**(`logicalName`: string, `select`: string[]): *Promise‹any›*

Defined in src/repositories/metadataRepository.ts:35

**Parameters:**

Name | Type | Default |
------ | ------ | ------ |
`logicalName` | string | - |
`select` | string[] | MetadataRepository.defaultSelections["EntityDefinitions"] |

**Returns:** *Promise‹any›*

___

###  retrieveEntityMetadataId

▸ **retrieveEntityMetadataId**(`logicalName`: string): *Promise‹string›*

Defined in src/repositories/metadataRepository.ts:26

**Parameters:**

Name | Type |
------ | ------ |
`logicalName` | string |

**Returns:** *Promise‹string›*

___

###  retrieveForms

▸ **retrieveForms**(`entityLogicalName`: string, `solutionId?`: string, `select`: string[]): *Promise‹any[]›*

Defined in src/repositories/metadataRepository.ts:56

**Parameters:**

Name | Type | Default |
------ | ------ | ------ |
`entityLogicalName` | string | - |
`solutionId?` | string | - |
`select` | string[] | MetadataRepository.defaultSelections["systemforms"] |

**Returns:** *Promise‹any[]›*

___

###  retrieveKeys

▸ **retrieveKeys**(`entityKey`: string): *Promise‹any[]›*

Defined in src/repositories/metadataRepository.ts:108

**Parameters:**

Name | Type |
------ | ------ |
`entityKey` | string |

**Returns:** *Promise‹any[]›*

___

###  retrieveOptionSets

▸ **retrieveOptionSets**(`solutionId?`: string, `select?`: string[]): *Promise‹any[]›*

Defined in src/repositories/metadataRepository.ts:50

**Parameters:**

Name | Type |
------ | ------ |
`solutionId?` | string |
`select?` | string[] |

**Returns:** *Promise‹any[]›*

___

###  retrieveRelationships

▸ **retrieveRelationships**(`entityKey`: string): *Promise‹object›*

Defined in src/repositories/metadataRepository.ts:113

**Parameters:**

Name | Type |
------ | ------ |
`entityKey` | string |

**Returns:** *Promise‹object›*

___

###  retrieveViews

▸ **retrieveViews**(`entityLogicalName`: string, `solutionId?`: string, `select`: string[]): *Promise‹any[]›*

Defined in src/repositories/metadataRepository.ts:82

**Parameters:**

Name | Type | Default |
------ | ------ | ------ |
`entityLogicalName` | string | - |
`solutionId?` | string | - |
`select` | string[] | MetadataRepository.defaultSelections["savedqueries"] |

**Returns:** *Promise‹any[]›*
