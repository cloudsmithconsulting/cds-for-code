---
id: "_components_templates_templateresolver_.templateresolver"
title: "TemplateResolver"
sidebar_label: "TemplateResolver"
---

[cds-for-code](../index.md) › [Globals](../globals.md) › ["components/Templates/TemplateResolver"](../modules/_components_templates_templateresolver_.md) › [TemplateResolver](_components_templates_templateresolver_.templateresolver.md)

## Hierarchy

* **TemplateResolver**

## Index

### Properties

* [fileNameRegex](_components_templates_templateresolver_.templateresolver.md#static-private-filenameregex)

### Methods

* [analyzeTemplate](_components_templates_templateresolver_.templateresolver.md#static-analyzetemplate)
* [executeTemplate](_components_templates_templateresolver_.templateresolver.md#static-executetemplate)
* [resolveInteractives](_components_templates_templateresolver_.templateresolver.md#static-resolveinteractives)

### Object literals

* [dotSettings](_components_templates_templateresolver_.templateresolver.md#static-private-dotsettings)

## Properties

### `Static` `Private` fileNameRegex

▪ **fileNameRegex**: *RegExp‹›* = /\$\{([\s\S]+?)\}/g

Defined in src/components/Templates/TemplateResolver.ts:11

## Methods

### `Static` analyzeTemplate

▸ **analyzeTemplate**(`template`: [TemplateItem](_components_templates_types_.templateitem.md), `outputPath?`: string): *Promise‹[TemplateAnalysis](_components_templates_types_.templateanalysis.md)›*

Defined in src/components/Templates/TemplateResolver.ts:55

**Parameters:**

Name | Type |
------ | ------ |
`template` | [TemplateItem](_components_templates_types_.templateitem.md) |
`outputPath?` | string |

**Returns:** *Promise‹[TemplateAnalysis](_components_templates_types_.templateanalysis.md)›*

___

### `Static` executeTemplate

▸ **executeTemplate**(`template`: [TemplateItem](_components_templates_types_.templateitem.md), `outputPath`: string, ...`object`: any): *Promise‹void›*

Defined in src/components/Templates/TemplateResolver.ts:28

**Parameters:**

Name | Type |
------ | ------ |
`template` | [TemplateItem](_components_templates_types_.templateitem.md) |
`outputPath` | string |
`...object` | any |

**Returns:** *Promise‹void›*

___

### `Static` resolveInteractives

▸ **resolveInteractives**(`templateAnalysis`: [TemplateAnalysis](_components_templates_types_.templateanalysis.md)): *Promise‹[TemplateContext](_components_templates_types_.templatecontext.md)›*

Defined in src/components/Templates/TemplateResolver.ts:150

**Parameters:**

Name | Type |
------ | ------ |
`templateAnalysis` | [TemplateAnalysis](_components_templates_types_.templateanalysis.md) |

**Returns:** *Promise‹[TemplateContext](_components_templates_types_.templatecontext.md)›*

## Object literals

### `Static` `Private` dotSettings

### ▪ **dotSettings**: *object*

Defined in src/components/Templates/TemplateResolver.ts:12

###  append

• **append**: *true* = true

Defined in src/components/Templates/TemplateResolver.ts:24

###  conditional

• **conditional**: *RegExp‹›* = /\{\{\?(\?)?\s*([\s\S]*?)\s*\}\}\n?/g

Defined in src/components/Templates/TemplateResolver.ts:20

###  define

• **define**: *RegExp‹›* = /.*?\{\{##\s*([\w\.$]+)\s*(\:|=)([\s\S]+?)#\}\}\n?/g

Defined in src/components/Templates/TemplateResolver.ts:18

###  defineParams

• **defineParams**: *RegExp‹›* = /^\s*([\w$]+):([\s\S]+)/

Defined in src/components/Templates/TemplateResolver.ts:19

###  encode

• **encode**: *RegExp‹›* = /\{\{!([\s\S]+?)\}\}\n?/g

Defined in src/components/Templates/TemplateResolver.ts:15

###  evaluate

• **evaluate**: *RegExp‹›* = /\{\{([\s\S]+?)\}\}\n?/g

Defined in src/components/Templates/TemplateResolver.ts:13

###  interpolate

• **interpolate**: *RegExp‹›* = /\{\{=([\s\S]+?)\}\}/g

Defined in src/components/Templates/TemplateResolver.ts:14

###  iterate

• **iterate**: *RegExp‹›* = /\{\{~\s*(?:\}\}|([\s\S]+?)\s*\:\s*([\w$]+)\s*(?:\:\s*([\w$]+))?\s*\}\})\n?/g

Defined in src/components/Templates/TemplateResolver.ts:21

###  selfcontained

• **selfcontained**: *false* = false

Defined in src/components/Templates/TemplateResolver.ts:25

###  strip

• **strip**: *false* = false

Defined in src/components/Templates/TemplateResolver.ts:23

###  use

• **use**: *RegExp‹›* = /.*?\{\{#([\s\S]+?)\}\}\n?/g

Defined in src/components/Templates/TemplateResolver.ts:16

###  useParams

• **useParams**: *RegExp‹›* = /(^|[^\w$])def(?:\.|\[[\'\"])([\w$\.]+)(?:[\'\"]\])?\s*\:\s*([\w$\.]+|\"[^\"]+\"|\'[^\']+\'|\{[^\}]+\})/g

Defined in src/components/Templates/TemplateResolver.ts:17

###  varname

• **varname**: *string* = "$"

Defined in src/components/Templates/TemplateResolver.ts:22
