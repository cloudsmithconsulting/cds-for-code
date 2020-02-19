---
id: "_components_templates_types_.templateitem"
title: "TemplateItem"
sidebar_label: "TemplateItem"
---

[cds-for-code](../index.md) › [Globals](../globals.md) › ["components/Templates/Types"](../modules/_components_templates_types_.md) › [TemplateItem](_components_templates_types_.templateitem.md)

## Hierarchy

* **TemplateItem**

## Index

### Constructors

* [constructor](_components_templates_types_.templateitem.md#constructor)

### Properties

* [categories](_components_templates_types_.templateitem.md#optional-categories)
* [description](_components_templates_types_.templateitem.md#optional-description)
* [directives](_components_templates_types_.templateitem.md#optional-directives)
* [displayName](_components_templates_types_.templateitem.md#optional-displayname)
* [location](_components_templates_types_.templateitem.md#optional-location)
* [name](_components_templates_types_.templateitem.md#optional-name)
* [outputPath](_components_templates_types_.templateitem.md#optional-outputpath)
* [publisher](_components_templates_types_.templateitem.md#optional-publisher)
* [type](_components_templates_types_.templateitem.md#optional-type)

### Methods

* [apply](_components_templates_types_.templateitem.md#apply)
* [from](_components_templates_types_.templateitem.md#static-from)
* [merge](_components_templates_types_.templateitem.md#static-merge)

## Constructors

###  constructor

\+ **new TemplateItem**(`type?`: [TemplateType](../enums/_components_templates_types_.templatetype.md), `name?`: string, `displayName?`: string, `description?`: string, `publisher?`: string, `location?`: string, `outputPath?`: string, `categories?`: string[], `directives?`: [TemplateDirective](_components_templates_types_.templatedirective.md)[]): *[TemplateItem](_components_templates_types_.templateitem.md)*

Defined in src/components/Templates/Types.ts:5

**Parameters:**

Name | Type |
------ | ------ |
`type?` | [TemplateType](../enums/_components_templates_types_.templatetype.md) |
`name?` | string |
`displayName?` | string |
`description?` | string |
`publisher?` | string |
`location?` | string |
`outputPath?` | string |
`categories?` | string[] |
`directives?` | [TemplateDirective](_components_templates_types_.templatedirective.md)[] |

**Returns:** *[TemplateItem](_components_templates_types_.templateitem.md)*

## Properties

### `Optional` categories

• **categories**? : *string[]*

Defined in src/components/Templates/Types.ts:14

___

### `Optional` description

• **description**? : *string*

Defined in src/components/Templates/Types.ts:10

___

### `Optional` directives

• **directives**? : *[TemplateDirective](_components_templates_types_.templatedirective.md)[]*

Defined in src/components/Templates/Types.ts:15

___

### `Optional` displayName

• **displayName**? : *string*

Defined in src/components/Templates/Types.ts:9

___

### `Optional` location

• **location**? : *string*

Defined in src/components/Templates/Types.ts:12

___

### `Optional` name

• **name**? : *string*

Defined in src/components/Templates/Types.ts:8

___

### `Optional` outputPath

• **outputPath**? : *string*

Defined in src/components/Templates/Types.ts:13

___

### `Optional` publisher

• **publisher**? : *string*

Defined in src/components/Templates/Types.ts:11

___

### `Optional` type

• **type**? : *[TemplateType](../enums/_components_templates_types_.templatetype.md)*

Defined in src/components/Templates/Types.ts:7

## Methods

###  apply

▸ **apply**(`outputPath`: string, ...`object`: any): *Promise‹void›*

Defined in src/components/Templates/Types.ts:62

**Parameters:**

Name | Type |
------ | ------ |
`outputPath` | string |
`...object` | any |

**Returns:** *Promise‹void›*

___

### `Static` from

▸ **from**(`from`: [TemplateItem](_components_templates_types_.templateitem.md)): *[TemplateItem](_components_templates_types_.templateitem.md)*

Defined in src/components/Templates/Types.ts:20

**Parameters:**

Name | Type |
------ | ------ |
`from` | [TemplateItem](_components_templates_types_.templateitem.md) |

**Returns:** *[TemplateItem](_components_templates_types_.templateitem.md)*

___

### `Static` merge

▸ **merge**(`to`: [TemplateItem](_components_templates_types_.templateitem.md), `from`: [TemplateItem](_components_templates_types_.templateitem.md)): *[TemplateItem](_components_templates_types_.templateitem.md)*

Defined in src/components/Templates/Types.ts:33

**Parameters:**

Name | Type |
------ | ------ |
`to` | [TemplateItem](_components_templates_types_.templateitem.md) |
`from` | [TemplateItem](_components_templates_types_.templateitem.md) |

**Returns:** *[TemplateItem](_components_templates_types_.templateitem.md)*
