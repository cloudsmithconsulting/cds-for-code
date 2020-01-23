[cds-for-code](../README.md) › [Globals](../globals.md) › ["core/types/PromiseInfo"](../modules/_core_types_promiseinfo_.md) › [PromiseInfo](_core_types_promiseinfo_.promiseinfo.md)

# Class: PromiseInfo <**T**>

## Type parameters

▪ **T**

## Hierarchy

* **PromiseInfo**

## Implements

* [IPromiseInfo](../interfaces/_core_types_promiseinfo_.ipromiseinfo.md)‹T›

## Index

### Constructors

* [constructor](_core_types_promiseinfo_.promiseinfo.md#constructor)

### Properties

* [reject](_core_types_promiseinfo_.promiseinfo.md#reject)
* [resolve](_core_types_promiseinfo_.promiseinfo.md#resolve)

## Constructors

###  constructor

\+ **new PromiseInfo**(`resolve`: function, `reject`: function): *[PromiseInfo](_core_types_promiseinfo_.promiseinfo.md)*

Defined in src/core/types/PromiseInfo.ts:8

**Parameters:**

▪ **resolve**: *function*

▸ (`value?`: T | PromiseLike‹T›): *void*

**Parameters:**

Name | Type |
------ | ------ |
`value?` | T &#124; PromiseLike‹T› |

▪ **reject**: *function*

▸ (`reason?`: any): *void*

**Parameters:**

Name | Type |
------ | ------ |
`reason?` | any |

**Returns:** *[PromiseInfo](_core_types_promiseinfo_.promiseinfo.md)*

## Properties

###  reject

• **reject**: *function*

*Implementation of [IPromiseInfo](../interfaces/_core_types_promiseinfo_.ipromiseinfo.md).[reject](../interfaces/_core_types_promiseinfo_.ipromiseinfo.md#reject)*

Defined in src/core/types/PromiseInfo.ts:8

#### Type declaration:

▸ (`reason?`: any): *void*

**Parameters:**

Name | Type |
------ | ------ |
`reason?` | any |

___

###  resolve

• **resolve**: *function*

*Implementation of [IPromiseInfo](../interfaces/_core_types_promiseinfo_.ipromiseinfo.md).[resolve](../interfaces/_core_types_promiseinfo_.ipromiseinfo.md#resolve)*

Defined in src/core/types/PromiseInfo.ts:7

#### Type declaration:

▸ (`value?`: T | PromiseLike‹T›): *void*

**Parameters:**

Name | Type |
------ | ------ |
`value?` | T &#124; PromiseLike‹T› |
