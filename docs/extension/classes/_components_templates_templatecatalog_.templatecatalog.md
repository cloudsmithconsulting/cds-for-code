---
id: "_components_templates_templatecatalog_.templatecatalog"
title: "TemplateCatalog"
sidebar_label: "TemplateCatalog"
---

[cds-for-code](../index.md) › [Globals](../globals.md) › ["components/Templates/TemplateCatalog"](../modules/_components_templates_templatecatalog_.md) › [TemplateCatalog](_components_templates_templatecatalog_.templatecatalog.md)

## Hierarchy

* **TemplateCatalog**

## Index

### Constructors

* [constructor](_components_templates_templatecatalog_.templatecatalog.md#constructor)

### Properties

* [items](_components_templates_templatecatalog_.templatecatalog.md#items)

### Methods

* [add](_components_templates_templatecatalog_.templatecatalog.md#add)
* [load](_components_templates_templatecatalog_.templatecatalog.md#load)
* [query](_components_templates_templatecatalog_.templatecatalog.md#query)
* [queryByCategory](_components_templates_templatecatalog_.templatecatalog.md#querybycategory)
* [queryByPublisher](_components_templates_templatecatalog_.templatecatalog.md#querybypublisher)
* [queryByType](_components_templates_templatecatalog_.templatecatalog.md#querybytype)
* [queryCategoriesByType](_components_templates_templatecatalog_.templatecatalog.md#querycategoriesbytype)
* [queryPublishersByType](_components_templates_templatecatalog_.templatecatalog.md#querypublishersbytype)
* [remove](_components_templates_templatecatalog_.templatecatalog.md#remove)
* [save](_components_templates_templatecatalog_.templatecatalog.md#save)
* [from](_components_templates_templatecatalog_.templatecatalog.md#static-from)
* [read](_components_templates_templatecatalog_.templatecatalog.md#static-read)
* [write](_components_templates_templatecatalog_.templatecatalog.md#static-write)

## Constructors

###  constructor

\+ **new TemplateCatalog**(`catalog?`: [TemplateCatalog](_components_templates_templatecatalog_.templatecatalog.md)): *[TemplateCatalog](_components_templates_templatecatalog_.templatecatalog.md)*

Defined in src/components/Templates/TemplateCatalog.ts:9

**Parameters:**

Name | Type |
------ | ------ |
`catalog?` | [TemplateCatalog](_components_templates_templatecatalog_.templatecatalog.md) |

**Returns:** *[TemplateCatalog](_components_templates_templatecatalog_.templatecatalog.md)*

## Properties

###  items

• **items**: *[TemplateItem](_components_templates_types_.templateitem.md)[]*

Defined in src/components/Templates/TemplateCatalog.ts:23

## Methods

###  add

▸ **add**(...`items`: [TemplateItem](_components_templates_types_.templateitem.md)[]): *[TemplateCatalog](_components_templates_templatecatalog_.templatecatalog.md)*

Defined in src/components/Templates/TemplateCatalog.ts:25

**Parameters:**

Name | Type |
------ | ------ |
`...items` | [TemplateItem](_components_templates_types_.templateitem.md)[] |

**Returns:** *[TemplateCatalog](_components_templates_templatecatalog_.templatecatalog.md)*

___

###  load

▸ **load**(`filename?`: string): *Promise‹[TemplateCatalog](_components_templates_templatecatalog_.templatecatalog.md)›*

Defined in src/components/Templates/TemplateCatalog.ts:74

**Parameters:**

Name | Type |
------ | ------ |
`filename?` | string |

**Returns:** *Promise‹[TemplateCatalog](_components_templates_templatecatalog_.templatecatalog.md)›*

___

###  query

▸ **query**<**T**>(`query`: function): *T[]*

Defined in src/components/Templates/TemplateCatalog.ts:70

**Type parameters:**

▪ **T**

**Parameters:**

▪ **query**: *function*

▸ (`queryable`: Enumerator‹[TemplateItem](_components_templates_types_.templateitem.md)›): *Enumerator‹T›*

**Parameters:**

Name | Type |
------ | ------ |
`queryable` | Enumerator‹[TemplateItem](_components_templates_types_.templateitem.md)› |

**Returns:** *T[]*

___

###  queryByCategory

▸ **queryByCategory**(`type?`: [TemplateType](../enums/_components_templates_types_.templatetype.md), `category?`: string): *[TemplateItem](_components_templates_types_.templateitem.md)[]*

Defined in src/components/Templates/TemplateCatalog.ts:53

**Parameters:**

Name | Type |
------ | ------ |
`type?` | [TemplateType](../enums/_components_templates_types_.templatetype.md) |
`category?` | string |

**Returns:** *[TemplateItem](_components_templates_types_.templateitem.md)[]*

___

###  queryByPublisher

▸ **queryByPublisher**(`type?`: [TemplateType](../enums/_components_templates_types_.templatetype.md), `publisher?`: string): *[TemplateItem](_components_templates_types_.templateitem.md)[]*

Defined in src/components/Templates/TemplateCatalog.ts:59

**Parameters:**

Name | Type |
------ | ------ |
`type?` | [TemplateType](../enums/_components_templates_types_.templatetype.md) |
`publisher?` | string |

**Returns:** *[TemplateItem](_components_templates_types_.templateitem.md)[]*

___

###  queryByType

▸ **queryByType**(`type?`: [TemplateType](../enums/_components_templates_types_.templatetype.md)): *[TemplateItem](_components_templates_types_.templateitem.md)[]*

Defined in src/components/Templates/TemplateCatalog.ts:65

**Parameters:**

Name | Type |
------ | ------ |
`type?` | [TemplateType](../enums/_components_templates_types_.templatetype.md) |

**Returns:** *[TemplateItem](_components_templates_types_.templateitem.md)[]*

___

###  queryCategoriesByType

▸ **queryCategoriesByType**(`type?`: [TemplateType](../enums/_components_templates_types_.templatetype.md)): *string[]*

Defined in src/components/Templates/TemplateCatalog.ts:37

**Parameters:**

Name | Type |
------ | ------ |
`type?` | [TemplateType](../enums/_components_templates_types_.templatetype.md) |

**Returns:** *string[]*

___

###  queryPublishersByType

▸ **queryPublishersByType**(`type?`: [TemplateType](../enums/_components_templates_types_.templatetype.md)): *string[]*

Defined in src/components/Templates/TemplateCatalog.ts:45

**Parameters:**

Name | Type |
------ | ------ |
`type?` | [TemplateType](../enums/_components_templates_types_.templatetype.md) |

**Returns:** *string[]*

___

###  remove

▸ **remove**(`item`: [TemplateItem](_components_templates_types_.templateitem.md)): *[TemplateCatalog](_components_templates_templatecatalog_.templatecatalog.md)*

Defined in src/components/Templates/TemplateCatalog.ts:31

**Parameters:**

Name | Type |
------ | ------ |
`item` | [TemplateItem](_components_templates_types_.templateitem.md) |

**Returns:** *[TemplateCatalog](_components_templates_templatecatalog_.templatecatalog.md)*

___

###  save

▸ **save**(`filename?`: string): *Promise‹[TemplateCatalog](_components_templates_templatecatalog_.templatecatalog.md)›*

Defined in src/components/Templates/TemplateCatalog.ts:78

**Parameters:**

Name | Type |
------ | ------ |
`filename?` | string |

**Returns:** *Promise‹[TemplateCatalog](_components_templates_templatecatalog_.templatecatalog.md)›*

___

### `Static` from

▸ **from**(`catalog`: [TemplateCatalog](_components_templates_templatecatalog_.templatecatalog.md)): *[TemplateCatalog](_components_templates_templatecatalog_.templatecatalog.md)*

Defined in src/components/Templates/TemplateCatalog.ts:19

**Parameters:**

Name | Type |
------ | ------ |
`catalog` | [TemplateCatalog](_components_templates_templatecatalog_.templatecatalog.md) |

**Returns:** *[TemplateCatalog](_components_templates_templatecatalog_.templatecatalog.md)*

___

### `Static` read

▸ **read**(`filename`: string): *Promise‹[TemplateCatalog](_components_templates_templatecatalog_.templatecatalog.md)›*

Defined in src/components/Templates/TemplateCatalog.ts:82

**Parameters:**

Name | Type | Default |
------ | ------ | ------ |
`filename` | string | "catalog.json" |

**Returns:** *Promise‹[TemplateCatalog](_components_templates_templatecatalog_.templatecatalog.md)›*

___

### `Static` write

▸ **write**(`catalog`: [TemplateCatalog](_components_templates_templatecatalog_.templatecatalog.md), `filename`: string): *Promise‹[TemplateCatalog](_components_templates_templatecatalog_.templatecatalog.md)›*

Defined in src/components/Templates/TemplateCatalog.ts:101

**Parameters:**

Name | Type | Default |
------ | ------ | ------ |
`catalog` | [TemplateCatalog](_components_templates_templatecatalog_.templatecatalog.md) | - |
`filename` | string | "catalog.json" |

**Returns:** *Promise‹[TemplateCatalog](_components_templates_templatecatalog_.templatecatalog.md)›*
