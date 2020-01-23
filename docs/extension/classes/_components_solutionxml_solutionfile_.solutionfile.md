---
id: "_components_solutionxml_solutionfile_.solutionfile"
title: "SolutionFile"
sidebar_label: "SolutionFile"
---

[cds-for-code](../index.md) › [Globals](../globals.md) › ["components/SolutionXml/SolutionFile"](../modules/_components_solutionxml_solutionfile_.md) › [SolutionFile](_components_solutionxml_solutionfile_.solutionfile.md)

## Hierarchy

* **SolutionFile**

## Index

### Constructors

* [constructor](_components_solutionxml_solutionfile_.solutionfile.md#private-constructor)

### Properties

* [_data](_components_solutionxml_solutionfile_.solutionfile.md#private-_data)
* [_file](_components_solutionxml_solutionfile_.solutionfile.md#private-_file)
* [_xml](_components_solutionxml_solutionfile_.solutionfile.md#private-_xml)

### Accessors

* [components](_components_solutionxml_solutionfile_.solutionfile.md#components)
* [data](_components_solutionxml_solutionfile_.solutionfile.md#data)
* [descriptions](_components_solutionxml_solutionfile_.solutionfile.md#descriptions)
* [file](_components_solutionxml_solutionfile_.solutionfile.md#file)
* [isManaged](_components_solutionxml_solutionfile_.solutionfile.md#ismanaged)
* [isValid](_components_solutionxml_solutionfile_.solutionfile.md#isvalid)
* [localizedNames](_components_solutionxml_solutionfile_.solutionfile.md#localizednames)
* [publisher](_components_solutionxml_solutionfile_.solutionfile.md#publisher)
* [solutionManifest](_components_solutionxml_solutionfile_.solutionfile.md#solutionmanifest)
* [solutionManifests](_components_solutionxml_solutionfile_.solutionfile.md#solutionmanifests)
* [uniqueName](_components_solutionxml_solutionfile_.solutionfile.md#uniquename)
* [version](_components_solutionxml_solutionfile_.solutionfile.md#version)

### Methods

* [addComponent](_components_solutionxml_solutionfile_.solutionfile.md#addcomponent)
* [removeComponent](_components_solutionxml_solutionfile_.solutionfile.md#removecomponent)
* [save](_components_solutionxml_solutionfile_.solutionfile.md#save)
* [toString](_components_solutionxml_solutionfile_.solutionfile.md#tostring)
* [from](_components_solutionxml_solutionfile_.solutionfile.md#static-from)
* [xml](_components_solutionxml_solutionfile_.solutionfile.md#static-xml)

## Constructors

### `Private` constructor

\+ **new SolutionFile**(`file?`: string, `xml?`: string): *[SolutionFile](_components_solutionxml_solutionfile_.solutionfile.md)*

Defined in src/components/SolutionXml/SolutionFile.ts:11

**Parameters:**

Name | Type |
------ | ------ |
`file?` | string |
`xml?` | string |

**Returns:** *[SolutionFile](_components_solutionxml_solutionfile_.solutionfile.md)*

## Properties

### `Private` _data

• **_data**: *any*

Defined in src/components/SolutionXml/SolutionFile.ts:11

___

### `Private` _file

• **_file**: *string*

Defined in src/components/SolutionXml/SolutionFile.ts:9

___

### `Private` _xml

• **_xml**: *string*

Defined in src/components/SolutionXml/SolutionFile.ts:10

## Accessors

###  components

• **get components**(): *Promise‹[SolutionFileComponentElement](_components_solutionxml_solutionfile_.solutionfilecomponentelement.md)[]›*

Defined in src/components/SolutionXml/SolutionFile.ts:82

**Returns:** *Promise‹[SolutionFileComponentElement](_components_solutionxml_solutionfile_.solutionfilecomponentelement.md)[]›*

___

###  data

• **get data**(): *Promise‹any›*

Defined in src/components/SolutionXml/SolutionFile.ts:28

**Returns:** *Promise‹any›*

___

###  descriptions

• **get descriptions**(): *Promise‹any[]›*

Defined in src/components/SolutionXml/SolutionFile.ts:66

**Returns:** *Promise‹any[]›*

___

###  file

• **get file**(): *string*

Defined in src/components/SolutionXml/SolutionFile.ts:7

**Returns:** *string*

___

###  isManaged

• **get isManaged**(): *Promise‹boolean›*

Defined in src/components/SolutionXml/SolutionFile.ts:74

**Returns:** *Promise‹boolean›*

___

###  isValid

• **get isValid**(): *Promise‹boolean›*

Defined in src/components/SolutionXml/SolutionFile.ts:54

**Returns:** *Promise‹boolean›*

___

###  localizedNames

• **get localizedNames**(): *Promise‹any[]›*

Defined in src/components/SolutionXml/SolutionFile.ts:62

**Returns:** *Promise‹any[]›*

___

###  publisher

• **get publisher**(): *Promise‹any›*

Defined in src/components/SolutionXml/SolutionFile.ts:78

**Returns:** *Promise‹any›*

___

###  solutionManifest

• **get solutionManifest**(): *Promise‹any›*

Defined in src/components/SolutionXml/SolutionFile.ts:50

**Returns:** *Promise‹any›*

___

###  solutionManifests

• **get solutionManifests**(): *Promise‹any[]›*

Defined in src/components/SolutionXml/SolutionFile.ts:42

**Returns:** *Promise‹any[]›*

___

###  uniqueName

• **get uniqueName**(): *Promise‹string›*

Defined in src/components/SolutionXml/SolutionFile.ts:58

**Returns:** *Promise‹string›*

___

###  version

• **get version**(): *Promise‹string›*

Defined in src/components/SolutionXml/SolutionFile.ts:70

**Returns:** *Promise‹string›*

## Methods

###  addComponent

▸ **addComponent**(`type`: [SolutionComponent](../enums/_api_cdssolutions_.cdssolutions.solutioncomponent.md) | number, `id?`: string, `schemaName?`: string, `behavior?`: number): *Promise‹void›*

Defined in src/components/SolutionXml/SolutionFile.ts:97

**Parameters:**

Name | Type |
------ | ------ |
`type` | [SolutionComponent](../enums/_api_cdssolutions_.cdssolutions.solutioncomponent.md) &#124; number |
`id?` | string |
`schemaName?` | string |
`behavior?` | number |

**Returns:** *Promise‹void›*

___

###  removeComponent

▸ **removeComponent**(`type`: [SolutionComponent](../enums/_api_cdssolutions_.cdssolutions.solutioncomponent.md) | number, `id?`: string, `schemaName?`: string): *Promise‹number›*

Defined in src/components/SolutionXml/SolutionFile.ts:121

**Parameters:**

Name | Type |
------ | ------ |
`type` | [SolutionComponent](../enums/_api_cdssolutions_.cdssolutions.solutioncomponent.md) &#124; number |
`id?` | string |
`schemaName?` | string |

**Returns:** *Promise‹number›*

___

###  save

▸ **save**(`file?`: string): *Promise‹void›*

Defined in src/components/SolutionXml/SolutionFile.ts:21

**Parameters:**

Name | Type |
------ | ------ |
`file?` | string |

**Returns:** *Promise‹void›*

___

###  toString

▸ **toString**(): *string | undefined*

Defined in src/components/SolutionXml/SolutionFile.ts:40

**Returns:** *string | undefined*

___

### `Static` from

▸ **from**(`file?`: string): *Promise‹[SolutionFile](_components_solutionxml_solutionfile_.solutionfile.md)›*

Defined in src/components/SolutionXml/SolutionFile.ts:18

**Parameters:**

Name | Type |
------ | ------ |
`file?` | string |

**Returns:** *Promise‹[SolutionFile](_components_solutionxml_solutionfile_.solutionfile.md)›*

___

### `Static` xml

▸ **xml**(`input?`: string): *Promise‹[SolutionFile](_components_solutionxml_solutionfile_.solutionfile.md)›*

Defined in src/components/SolutionXml/SolutionFile.ts:19

**Parameters:**

Name | Type |
------ | ------ |
`input?` | string |

**Returns:** *Promise‹[SolutionFile](_components_solutionxml_solutionfile_.solutionfile.md)›*
