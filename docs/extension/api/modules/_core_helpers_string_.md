---
id: "_core_helpers_string_"
title: "core/helpers/String"
sidebar_label: "core/helpers/String"
---

[cds-for-code](../index.md) › [Globals](../globals.md) › ["core/helpers/String"](_core_helpers_string_.md)

## Index

### Functions

* [dateAsFilename](_core_helpers_string_.md#dateasfilename)
* [isIsoDateString](_core_helpers_string_.md#isisodatestring)
* [noSlashes](_core_helpers_string_.md#noslashes)
* [noTrailingSlash](_core_helpers_string_.md#notrailingslash)
* [parseUtcDate](_core_helpers_string_.md#parseutcdate)
* [plural](_core_helpers_string_.md#plural)
* [powerShellSafe](_core_helpers_string_.md#powershellsafe)
* [withTrailingSlash](_core_helpers_string_.md#withtrailingslash)

## Functions

###  dateAsFilename

▸ **dateAsFilename**(): *string*

Defined in src/core/helpers/String.ts:21

**Returns:** *string*

___

###  isIsoDateString

▸ **isIsoDateString**(`date`: string): *boolean*

Defined in src/core/helpers/String.ts:17

**Parameters:**

Name | Type |
------ | ------ |
`date` | string |

**Returns:** *boolean*

___

###  noSlashes

▸ **noSlashes**(`string`: string): *string*

Defined in src/core/helpers/String.ts:41

**Parameters:**

Name | Type |
------ | ------ |
`string` | string |

**Returns:** *string*

___

###  noTrailingSlash

▸ **noTrailingSlash**(`string`: string): *string*

Defined in src/core/helpers/String.ts:33

**Parameters:**

Name | Type |
------ | ------ |
`string` | string |

**Returns:** *string*

___

###  parseUtcDate

▸ **parseUtcDate**(`date`: string): *Date*

Defined in src/core/helpers/String.ts:3

**Parameters:**

Name | Type |
------ | ------ |
`date` | string |

**Returns:** *Date*

___

###  plural

▸ **plural**(`value`: string): *string*

Defined in src/core/helpers/String.ts:53

**Parameters:**

Name | Type |
------ | ------ |
`value` | string |

**Returns:** *string*

___

###  powerShellSafe

▸ **powerShellSafe**(`value`: string, `delimiter`: string): *string*

Defined in src/core/helpers/String.ts:45

**Parameters:**

Name | Type |
------ | ------ |
`value` | string |
`delimiter` | string |

**Returns:** *string*

___

###  withTrailingSlash

▸ **withTrailingSlash**(`path`: string | undefined): *string*

Defined in src/core/helpers/String.ts:25

**Parameters:**

Name | Type |
------ | ------ |
`path` | string &#124; undefined |

**Returns:** *string*
