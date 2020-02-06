---
id: "_core_utilities_.objectutility"
title: "ObjectUtility"
sidebar_label: "ObjectUtility"
---

[cds-for-code](../index.md) › [Globals](../globals.md) › ["core/Utilities"](../modules/_core_utilities_.md) › [ObjectUtility](_core_utilities_.objectutility.md)

## Hierarchy

* **ObjectUtility**

## Index

### Methods

* [asQuerystring](_core_utilities_.objectutility.md#asquerystring)
* [clone](_core_utilities_.objectutility.md#clone)
* [createInstance](_core_utilities_.objectutility.md#createinstance)
* [isNull](_core_utilities_.objectutility.md#isnull)
* [isNullOrEmpty](_core_utilities_.objectutility.md#isnullorempty)
* [isObject](_core_utilities_.objectutility.md#isobject)

## Methods

###  asQuerystring

▸ **asQuerystring**(`source`: any): *string*

Defined in src/core/Utilities.ts:40

**Parameters:**

Name | Type |
------ | ------ |
`source` | any |

**Returns:** *string*

___

###  clone

▸ **clone**<**T**>(`source`: T, `target?`: any, `excludeProperties?`: string[]): *T*

Defined in src/core/Utilities.ts:41

**Type parameters:**

▪ **T**

**Parameters:**

Name | Type |
------ | ------ |
`source` | T |
`target?` | any |
`excludeProperties?` | string[] |

**Returns:** *T*

___

###  createInstance

▸ **createInstance**<**T**>(`context`: Object, `name`: string, ...`args`: any[]): *T*

Defined in src/core/Utilities.ts:42

**Type parameters:**

▪ **T**

**Parameters:**

Name | Type |
------ | ------ |
`context` | Object |
`name` | string |
`...args` | any[] |

**Returns:** *T*

___

###  isNull

▸ **isNull**(`source`: any): *boolean*

Defined in src/core/Utilities.ts:38

**Parameters:**

Name | Type |
------ | ------ |
`source` | any |

**Returns:** *boolean*

___

###  isNullOrEmpty

▸ **isNullOrEmpty**(`source`: any): *boolean*

Defined in src/core/Utilities.ts:37

**Parameters:**

Name | Type |
------ | ------ |
`source` | any |

**Returns:** *boolean*

___

###  isObject

▸ **isObject**(`source`: any): *boolean*

Defined in src/core/Utilities.ts:39

**Parameters:**

Name | Type |
------ | ------ |
`source` | any |

**Returns:** *boolean*
