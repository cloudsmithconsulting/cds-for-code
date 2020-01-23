---
id: "_components_solutionxml_customizationsfile_.customizationsfile"
title: "CustomizationsFile"
sidebar_label: "CustomizationsFile"
---

[cds-for-code](../index.md) › [Globals](../globals.md) › ["components/SolutionXml/CustomizationsFile"](../modules/_components_solutionxml_customizationsfile_.md) › [CustomizationsFile](_components_solutionxml_customizationsfile_.customizationsfile.md)

## Hierarchy

* **CustomizationsFile**

## Index

### Constructors

* [constructor](_components_solutionxml_customizationsfile_.customizationsfile.md#private-constructor)

### Properties

* [_data](_components_solutionxml_customizationsfile_.customizationsfile.md#private-_data)
* [_file](_components_solutionxml_customizationsfile_.customizationsfile.md#private-_file)
* [_xml](_components_solutionxml_customizationsfile_.customizationsfile.md#private-_xml)

### Accessors

* [data](_components_solutionxml_customizationsfile_.customizationsfile.md#data)
* [file](_components_solutionxml_customizationsfile_.customizationsfile.md#file)
* [importExportXml](_components_solutionxml_customizationsfile_.customizationsfile.md#importexportxml)

### Methods

* [addElement](_components_solutionxml_customizationsfile_.customizationsfile.md#addelement)
* [removeElement](_components_solutionxml_customizationsfile_.customizationsfile.md#removeelement)
* [save](_components_solutionxml_customizationsfile_.customizationsfile.md#save)
* [toString](_components_solutionxml_customizationsfile_.customizationsfile.md#tostring)
* [from](_components_solutionxml_customizationsfile_.customizationsfile.md#static-from)
* [xml](_components_solutionxml_customizationsfile_.customizationsfile.md#static-xml)

## Constructors

### `Private` constructor

\+ **new CustomizationsFile**(`file?`: string, `xml?`: string): *[CustomizationsFile](_components_solutionxml_customizationsfile_.customizationsfile.md)*

Defined in src/components/SolutionXml/CustomizationsFile.ts:11

**Parameters:**

Name | Type |
------ | ------ |
`file?` | string |
`xml?` | string |

**Returns:** *[CustomizationsFile](_components_solutionxml_customizationsfile_.customizationsfile.md)*

## Properties

### `Private` _data

• **_data**: *any*

Defined in src/components/SolutionXml/CustomizationsFile.ts:11

___

### `Private` _file

• **_file**: *string*

Defined in src/components/SolutionXml/CustomizationsFile.ts:9

___

### `Private` _xml

• **_xml**: *string*

Defined in src/components/SolutionXml/CustomizationsFile.ts:10

## Accessors

###  data

• **get data**(): *Promise‹any›*

Defined in src/components/SolutionXml/CustomizationsFile.ts:28

**Returns:** *Promise‹any›*

___

###  file

• **get file**(): *string*

Defined in src/components/SolutionXml/CustomizationsFile.ts:7

**Returns:** *string*

___

###  importExportXml

• **get importExportXml**(): *Promise‹any[]›*

Defined in src/components/SolutionXml/CustomizationsFile.ts:42

**Returns:** *Promise‹any[]›*

## Methods

###  addElement

▸ **addElement**(`elementName`: string): *Promise‹void›*

Defined in src/components/SolutionXml/CustomizationsFile.ts:49

**Parameters:**

Name | Type |
------ | ------ |
`elementName` | string |

**Returns:** *Promise‹void›*

___

###  removeElement

▸ **removeElement**(`elementName`: string): *Promise‹void›*

Defined in src/components/SolutionXml/CustomizationsFile.ts:61

**Parameters:**

Name | Type |
------ | ------ |
`elementName` | string |

**Returns:** *Promise‹void›*

___

###  save

▸ **save**(`file?`: string): *Promise‹void›*

Defined in src/components/SolutionXml/CustomizationsFile.ts:21

**Parameters:**

Name | Type |
------ | ------ |
`file?` | string |

**Returns:** *Promise‹void›*

___

###  toString

▸ **toString**(): *string | undefined*

Defined in src/components/SolutionXml/CustomizationsFile.ts:40

**Returns:** *string | undefined*

___

### `Static` from

▸ **from**(`file?`: string): *Promise‹[CustomizationsFile](_components_solutionxml_customizationsfile_.customizationsfile.md)›*

Defined in src/components/SolutionXml/CustomizationsFile.ts:18

**Parameters:**

Name | Type |
------ | ------ |
`file?` | string |

**Returns:** *Promise‹[CustomizationsFile](_components_solutionxml_customizationsfile_.customizationsfile.md)›*

___

### `Static` xml

▸ **xml**(`input?`: string): *Promise‹[CustomizationsFile](_components_solutionxml_customizationsfile_.customizationsfile.md)›*

Defined in src/components/SolutionXml/CustomizationsFile.ts:19

**Parameters:**

Name | Type |
------ | ------ |
`input?` | string |

**Returns:** *Promise‹[CustomizationsFile](_components_solutionxml_customizationsfile_.customizationsfile.md)›*
