[cds-for-code](../README.md) › [Globals](../globals.md) › ["core/types/PromiseInfo"](../modules/_core_types_promiseinfo_.md) › [IPromiseInfo](_core_types_promiseinfo_.ipromiseinfo.md)

# Interface: IPromiseInfo <**T**>

## Type parameters

▪ **T**

## Hierarchy

* **IPromiseInfo**

## Implemented by

* [PromiseInfo](../classes/_core_types_promiseinfo_.promiseinfo.md)

## Index

### Properties

* [reject](_core_types_promiseinfo_.ipromiseinfo.md#reject)
* [resolve](_core_types_promiseinfo_.ipromiseinfo.md#resolve)

## Properties

###  reject

• **reject**: *function*

Defined in src/core/types/PromiseInfo.ts:3

#### Type declaration:

▸ (`reason?`: any): *void*

**Parameters:**

Name | Type |
------ | ------ |
`reason?` | any |

___

###  resolve

• **resolve**: *function*

Defined in src/core/types/PromiseInfo.ts:2

#### Type declaration:

▸ (`value?`: T | PromiseLike‹T›): *void*

**Parameters:**

Name | Type |
------ | ------ |
`value?` | T &#124; PromiseLike‹T› |
