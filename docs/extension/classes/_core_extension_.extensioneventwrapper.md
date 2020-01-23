[cds-for-code](../README.md) › [Globals](../globals.md) › ["core/Extension"](../modules/_core_extension_.md) › [ExtensionEventWrapper](_core_extension_.extensioneventwrapper.md)

# Class: ExtensionEventWrapper

## Hierarchy

* **ExtensionEventWrapper**

## Implements

* [IExtensionEventWrapper](../interfaces/_core_extension_.iextensioneventwrapper.md)

## Index

### Constructors

* [constructor](_core_extension_.extensioneventwrapper.md#constructor)

### Properties

* [description](_core_extension_.extensioneventwrapper.md#description)
* [id](_core_extension_.extensioneventwrapper.md#id)
* [options](_core_extension_.extensioneventwrapper.md#options)
* [_hasActivated](_core_extension_.extensioneventwrapper.md#static-private-_hasactivated)
* [_hasDeactivated](_core_extension_.extensioneventwrapper.md#static-private-_hasdeactivated)

### Methods

* [onActivate](_core_extension_.extensioneventwrapper.md#onactivate)
* [onDeactivate](_core_extension_.extensioneventwrapper.md#ondeactivate)

## Constructors

###  constructor

\+ **new ExtensionEventWrapper**(`id`: string, `options`: [IExtensionEventInvocationOptions](../interfaces/_core_extension_.iextensioneventinvocationoptions.md)): *[ExtensionEventWrapper](_core_extension_.extensioneventwrapper.md)*

Defined in src/core/Extension.ts:46

**Parameters:**

Name | Type | Default |
------ | ------ | ------ |
`id` | string | - |
`options` | [IExtensionEventInvocationOptions](../interfaces/_core_extension_.iextensioneventinvocationoptions.md) | new DefaultExtensionEventInvocationOptions() |

**Returns:** *[ExtensionEventWrapper](_core_extension_.extensioneventwrapper.md)*

## Properties

###  description

• **description**: *string*

*Implementation of [IExtensionEventWrapper](../interfaces/_core_extension_.iextensioneventwrapper.md).[description](../interfaces/_core_extension_.iextensioneventwrapper.md#description)*

Defined in src/core/Extension.ts:43

___

###  id

• **id**: *string*

*Implementation of [IExtensionEventWrapper](../interfaces/_core_extension_.iextensioneventwrapper.md).[id](../interfaces/_core_extension_.iextensioneventwrapper.md#id)*

Defined in src/core/Extension.ts:49

___

###  options

• **options**: *[IExtensionEventInvocationOptions](../interfaces/_core_extension_.iextensioneventinvocationoptions.md)*

*Implementation of [IExtensionEventWrapper](../interfaces/_core_extension_.iextensioneventwrapper.md).[options](../interfaces/_core_extension_.iextensioneventwrapper.md#options)*

Defined in src/core/Extension.ts:50

___

### `Static` `Private` _hasActivated

▪ **_hasActivated**: *boolean* = false

Defined in src/core/Extension.ts:45

___

### `Static` `Private` _hasDeactivated

▪ **_hasDeactivated**: *boolean* = false

Defined in src/core/Extension.ts:46

## Methods

###  onActivate

▸ **onActivate**(): *void*

Defined in src/core/Extension.ts:25

**Returns:** *void*

___

###  onDeactivate

▸ **onDeactivate**(): *void*

Defined in src/core/Extension.ts:34

**Returns:** *void*
