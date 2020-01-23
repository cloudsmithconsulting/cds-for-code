[cds-for-code](../README.md) › [Globals](../globals.md) › ["components/Templates/Types"](../modules/_components_templates_types_.md) › [TemplateItem](_components_templates_types_.templateitem.md)

# Class: TemplateItem

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
* [placeholders](_components_templates_types_.templateitem.md#optional-placeholders)
* [publisher](_components_templates_types_.templateitem.md#optional-publisher)
* [type](_components_templates_types_.templateitem.md#optional-type)

### Methods

* [apply](_components_templates_types_.templateitem.md#apply)
* [load](_components_templates_types_.templateitem.md#load)
* [save](_components_templates_types_.templateitem.md#save)
* [from](_components_templates_types_.templateitem.md#static-from)
* [read](_components_templates_types_.templateitem.md#static-read)
* [write](_components_templates_types_.templateitem.md#static-write)

## Constructors

###  constructor

\+ **new TemplateItem**(`type?`: [TemplateType](../enums/_components_templates_types_.templatetype.md), `name?`: string, `displayName?`: string, `description?`: string, `publisher?`: string, `location?`: string, `outputPath?`: string, `categories?`: string[], `placeholders?`: [TemplatePlaceholder](_components_templates_types_.templateplaceholder.md)[], `directives?`: [TemplateDirective](_components_templates_types_.templatedirective.md)[]): *[TemplateItem](_components_templates_types_.templateitem.md)*

Defined in src/components/Templates/Types.ts:7

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
`placeholders?` | [TemplatePlaceholder](_components_templates_types_.templateplaceholder.md)[] |
`directives?` | [TemplateDirective](_components_templates_types_.templatedirective.md)[] |

**Returns:** *[TemplateItem](_components_templates_types_.templateitem.md)*

## Properties

### `Optional` categories

• **categories**? : *string[]*

Defined in src/components/Templates/Types.ts:16

___

### `Optional` description

• **description**? : *string*

Defined in src/components/Templates/Types.ts:12

___

### `Optional` directives

• **directives**? : *[TemplateDirective](_components_templates_types_.templatedirective.md)[]*

Defined in src/components/Templates/Types.ts:18

___

### `Optional` displayName

• **displayName**? : *string*

Defined in src/components/Templates/Types.ts:11

___

### `Optional` location

• **location**? : *string*

Defined in src/components/Templates/Types.ts:14

___

### `Optional` name

• **name**? : *string*

Defined in src/components/Templates/Types.ts:10

___

### `Optional` outputPath

• **outputPath**? : *string*

Defined in src/components/Templates/Types.ts:15

___

### `Optional` placeholders

• **placeholders**? : *[TemplatePlaceholder](_components_templates_types_.templateplaceholder.md)[]*

Defined in src/components/Templates/Types.ts:17

___

### `Optional` publisher

• **publisher**? : *string*

Defined in src/components/Templates/Types.ts:13

___

### `Optional` type

• **type**? : *[TemplateType](../enums/_components_templates_types_.templatetype.md)*

Defined in src/components/Templates/Types.ts:9

## Methods

###  apply

▸ **apply**(`placeholders`: [Dictionary](_core_types_dictionary_.dictionary.md)‹string, string›, `object?`: any): *Promise‹string | Buffer›*

Defined in src/components/Templates/Types.ts:38

**Parameters:**

Name | Type |
------ | ------ |
`placeholders` | [Dictionary](_core_types_dictionary_.dictionary.md)‹string, string› |
`object?` | any |

**Returns:** *Promise‹string | Buffer›*

___

###  load

▸ **load**(`filename?`: string): *Promise‹[TemplateItem](_components_templates_types_.templateitem.md)›*

Defined in src/components/Templates/Types.ts:58

**Parameters:**

Name | Type |
------ | ------ |
`filename?` | string |

**Returns:** *Promise‹[TemplateItem](_components_templates_types_.templateitem.md)›*

___

###  save

▸ **save**(`filename?`: string): *Promise‹[TemplateItem](_components_templates_types_.templateitem.md)›*

Defined in src/components/Templates/Types.ts:62

**Parameters:**

Name | Type |
------ | ------ |
`filename?` | string |

**Returns:** *Promise‹[TemplateItem](_components_templates_types_.templateitem.md)›*

___

### `Static` from

▸ **from**(`from`: [TemplateItem](_components_templates_types_.templateitem.md)): *[TemplateItem](_components_templates_types_.templateitem.md)*

Defined in src/components/Templates/Types.ts:24

**Parameters:**

Name | Type |
------ | ------ |
`from` | [TemplateItem](_components_templates_types_.templateitem.md) |

**Returns:** *[TemplateItem](_components_templates_types_.templateitem.md)*

___

### `Static` read

▸ **read**(`filename`: string): *Promise‹[TemplateItem](_components_templates_types_.templateitem.md)›*

Defined in src/components/Templates/Types.ts:66

**Parameters:**

Name | Type | Default |
------ | ------ | ------ |
`filename` | string | "template.json" |

**Returns:** *Promise‹[TemplateItem](_components_templates_types_.templateitem.md)›*

___

### `Static` write

▸ **write**(`template`: [TemplateItem](_components_templates_types_.templateitem.md), `filename`: string): *Promise‹[TemplateItem](_components_templates_types_.templateitem.md)›*

Defined in src/components/Templates/Types.ts:85

**Parameters:**

Name | Type | Default |
------ | ------ | ------ |
`template` | [TemplateItem](_components_templates_types_.templateitem.md) | - |
`filename` | string | "template.json" |

**Returns:** *Promise‹[TemplateItem](_components_templates_types_.templateitem.md)›*
