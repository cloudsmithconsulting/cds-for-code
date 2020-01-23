[cds-for-code](../README.md) › [Globals](../globals.md) › ["core/Extension"](../modules/_core_extension_.md) › [IExtensionEventWrapper](_core_extension_.iextensioneventwrapper.md)

# Interface: IExtensionEventWrapper

## Hierarchy

* **IExtensionEventWrapper**

## Implemented by

* [ExtensionEventWrapper](../classes/_core_extension_.extensioneventwrapper.md)

## Index

### Properties

* [description](_core_extension_.iextensioneventwrapper.md#description)
* [id](_core_extension_.iextensioneventwrapper.md#id)
* [options](_core_extension_.iextensioneventwrapper.md#options)

### Methods

* [onActivate](_core_extension_.iextensioneventwrapper.md#onactivate)
* [onDeactivate](_core_extension_.iextensioneventwrapper.md#ondeactivate)

## Properties

###  description

• **description**: *string*

Defined in src/core/Extension.ts:9

___

###  id

• **id**: *string*

Defined in src/core/Extension.ts:8

___

###  options

• **options**: *[IExtensionEventInvocationOptions](_core_extension_.iextensioneventinvocationoptions.md)*

Defined in src/core/Extension.ts:10

## Methods

###  onActivate

▸ **onActivate**(`context`: ExtensionContext, `config?`: WorkspaceConfiguration): *any*

Defined in src/core/Extension.ts:12

**Parameters:**

Name | Type |
------ | ------ |
`context` | ExtensionContext |
`config?` | WorkspaceConfiguration |

**Returns:** *any*

___

###  onDeactivate

▸ **onDeactivate**(`context`: ExtensionContext, `config?`: WorkspaceConfiguration): *any*

Defined in src/core/Extension.ts:13

**Parameters:**

Name | Type |
------ | ------ |
`context` | ExtensionContext |
`config?` | WorkspaceConfiguration |

**Returns:** *any*
