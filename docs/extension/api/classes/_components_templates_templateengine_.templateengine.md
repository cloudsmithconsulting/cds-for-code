---
id: "_components_templates_templateengine_.templateengine"
title: "TemplateEngine"
sidebar_label: "TemplateEngine"
---

[cds-for-code](../index.md) › [Globals](../globals.md) › ["components/Templates/TemplateEngine"](../modules/_components_templates_templateengine_.md) › [TemplateEngine](_components_templates_templateengine_.templateengine.md)

## Hierarchy

* **TemplateEngine**

## Index

### Methods

* [applyTemplate](_components_templates_templateengine_.templateengine.md#static-applytemplate)
* [defaultResolver](_components_templates_templateengine_.templateengine.md#static-private-defaultresolver)
* [getPlaceholders](_components_templates_templateengine_.templateengine.md#static-getplaceholders)
* [mergePlaceholders](_components_templates_templateengine_.templateengine.md#static-mergeplaceholders)
* [resolvePlaceholders](_components_templates_templateengine_.templateengine.md#static-resolveplaceholders)

## Methods

### `Static` applyTemplate

▸ **applyTemplate**(`template`: [TemplateItem](_components_templates_types_.templateitem.md), `data`: string | Buffer, `placeholders?`: [Dictionary](_core_types_dictionary_.dictionary.md)‹string, string›, `object?`: any): *Promise‹string | Buffer›*

Defined in src/components/Templates/TemplateEngine.ts:15

**Parameters:**

Name | Type |
------ | ------ |
`template` | [TemplateItem](_components_templates_types_.templateitem.md) |
`data` | string &#124; Buffer |
`placeholders?` | [Dictionary](_core_types_dictionary_.dictionary.md)‹string, string› |
`object?` | any |

**Returns:** *Promise‹string | Buffer›*

___

### `Static` `Private` defaultResolver

▸ **defaultResolver**(`data`: string | Buffer, `placeholderRegExp`: RegExp, `template?`: [TemplateItem](_components_templates_types_.templateitem.md), `defaultPlaceholders?`: [Dictionary](_core_types_dictionary_.dictionary.md)‹string, string›): *Promise‹string | Buffer›*

Defined in src/components/Templates/TemplateEngine.ts:72

**Parameters:**

Name | Type |
------ | ------ |
`data` | string &#124; Buffer |
`placeholderRegExp` | RegExp |
`template?` | [TemplateItem](_components_templates_types_.templateitem.md) |
`defaultPlaceholders?` | [Dictionary](_core_types_dictionary_.dictionary.md)‹string, string› |

**Returns:** *Promise‹string | Buffer›*

___

### `Static` getPlaceholders

▸ **getPlaceholders**(`fsItem`: string, `placeholderRegExp`: string, `isFolder`: boolean): *string[]*

Defined in src/components/Templates/TemplateEngine.ts:157

**Parameters:**

Name | Type |
------ | ------ |
`fsItem` | string |
`placeholderRegExp` | string |
`isFolder` | boolean |

**Returns:** *string[]*

___

### `Static` mergePlaceholders

▸ **mergePlaceholders**(`source`: [TemplatePlaceholder](_components_templates_types_.templateplaceholder.md)[], `merge`: [TemplatePlaceholder](_components_templates_types_.templateplaceholder.md)[]): *[TemplatePlaceholder](_components_templates_types_.templateplaceholder.md)‹›[]*

Defined in src/components/Templates/TemplateEngine.ts:229

**Parameters:**

Name | Type |
------ | ------ |
`source` | [TemplatePlaceholder](_components_templates_types_.templateplaceholder.md)[] |
`merge` | [TemplatePlaceholder](_components_templates_types_.templateplaceholder.md)[] |

**Returns:** *[TemplatePlaceholder](_components_templates_types_.templateplaceholder.md)‹›[]*

___

### `Static` resolvePlaceholders

▸ **resolvePlaceholders**(`data`: string | Buffer, `placeholderRegExp`: string, `placeholders`: [Dictionary](_core_types_dictionary_.dictionary.md)‹string, string›, `templateInfo`: [TemplateItem](_components_templates_types_.templateitem.md), `resolvers?`: function[]): *Promise‹string | Buffer›*

Defined in src/components/Templates/TemplateEngine.ts:48

Replaces any placeholders found within the input data.  Will use a
dictionary of values from the user's workspace settings, or will prompt
if value is not known.

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`data` | string &#124; Buffer | input data |
`placeholderRegExp` | string | regular expression to use for detecting                           placeholders.  The first capture group is used                           as the key. |
`placeholders` | [Dictionary](_core_types_dictionary_.dictionary.md)‹string, string› | dictionary of placeholder key-value pairs |
`templateInfo` | [TemplateItem](_components_templates_types_.templateitem.md) | - |
`resolvers?` | function[] | - |

**Returns:** *Promise‹string | Buffer›*

the (potentially) modified data, with the same type as the input data
