---
id: "_core_utilities_.asyncutility"
title: "AsyncUtility"
sidebar_label: "AsyncUtility"
---

[cds-for-code](../index.md) › [Globals](../globals.md) › ["core/Utilities"](../modules/_core_utilities_.md) › [AsyncUtility](_core_utilities_.asyncutility.md)

## Hierarchy

* **AsyncUtility**

## Index

### Methods

* [forEach](_core_utilities_.asyncutility.md#foreach)
* [sleep](_core_utilities_.asyncutility.md#sleep)

## Methods

###  forEach

▸ **forEach**<**T**>(`array`: T[], `callback`: function): *any*

Defined in src/core/Utilities.ts:12

**Type parameters:**

▪ **T**

**Parameters:**

▪ **array**: *T[]*

▪ **callback**: *function*

▸ (`item`: T, `index?`: number, `array?`: T[]): *Promise‹void›*

**Parameters:**

Name | Type |
------ | ------ |
`item` | T |
`index?` | number |
`array?` | T[] |

**Returns:** *any*

___

###  sleep

▸ **sleep**(`timeout`: number): *Promise‹void›*

Defined in src/core/Utilities.ts:13

**Parameters:**

Name | Type |
------ | ------ |
`timeout` | number |

**Returns:** *Promise‹void›*
