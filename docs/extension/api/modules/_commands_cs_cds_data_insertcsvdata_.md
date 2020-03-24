---
id: "_commands_cs_cds_data_insertcsvdata_"
title: "commands/cs.cds.data.insertCsvData"
sidebar_label: "commands/cs.cds.data.insertCsvData"
---

[cds-for-code](../index.md) › [Globals](../globals.md) › ["commands/cs.cds.data.insertCsvData"](_commands_cs_cds_data_insertcsvdata_.md)

## Index

### Variables

* [fieldDelimiters](_commands_cs_cds_data_insertcsvdata_.md#const-fielddelimiters)
* [stringDelimiters](_commands_cs_cds_data_insertcsvdata_.md#const-stringdelimiters)

### Functions

* [getKey](_commands_cs_cds_data_insertcsvdata_.md#getkey)
* [run](_commands_cs_cds_data_insertcsvdata_.md#run)

## Variables

### `Const` fieldDelimiters

• **fieldDelimiters**: *Map‹number, string›* = new Map<number, string>([
	[ 2, `,` ],
	[ 3, `<tab>` ],
	[ 1, `:` ],
	[ 4, `;` ]
])

Defined in src/commands/cs.cds.data.insertCsvData.ts:13

___

### `Const` stringDelimiters

• **stringDelimiters**: *Map‹number, string›* = new Map<number, string>([
	[ 1, `"` ],
	[ 3, `'` ],
	[ 2, `<none>` ]
])

Defined in src/commands/cs.cds.data.insertCsvData.ts:20

## Functions

###  getKey

▸ **getKey**(`map`: Map‹unknown, unknown›, `val`: unknown): *unknown*

Defined in src/commands/cs.cds.data.insertCsvData.ts:26

**Parameters:**

Name | Type |
------ | ------ |
`map` | Map‹unknown, unknown› |
`val` | unknown |

**Returns:** *unknown*

___

###  run

▸ **run**(`this`: [DataGenerationManager](../classes/_components_datageneration_datagenerationmanager_.datagenerationmanager.md), `config?`: [Config](../interfaces/_api_cds_webapi_cdswebapi_.cdswebapi.config.md), `entity?`: any, `fileUri?`: Uri): *Promise‹string›*

Defined in src/commands/cs.cds.data.insertCsvData.ts:30

**Parameters:**

Name | Type |
------ | ------ |
`this` | [DataGenerationManager](../classes/_components_datageneration_datagenerationmanager_.datagenerationmanager.md) |
`config?` | [Config](../interfaces/_api_cds_webapi_cdswebapi_.cdswebapi.config.md) |
`entity?` | any |
`fileUri?` | Uri |

**Returns:** *Promise‹string›*
