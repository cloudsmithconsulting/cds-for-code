[cds-for-code](../README.md) › [Globals](../globals.md) › ["core/Quickly"](../modules/_core_quickly_.md) › [QuickPickOption](_core_quickly_.quickpickoption.md)

# Class: QuickPickOption

## Hierarchy

* **QuickPickOption**

## Implements

* QuickPickItem

## Index

### Constructors

* [constructor](_core_quickly_.quickpickoption.md#constructor)

### Properties

* [alwaysShow](_core_quickly_.quickpickoption.md#optional-alwaysshow)
* [command](_core_quickly_.quickpickoption.md#optional-command)
* [context](_core_quickly_.quickpickoption.md#optional-context)
* [description](_core_quickly_.quickpickoption.md#optional-description)
* [detail](_core_quickly_.quickpickoption.md#optional-detail)
* [label](_core_quickly_.quickpickoption.md#label)
* [picked](_core_quickly_.quickpickoption.md#optional-picked)
* [cancel](_core_quickly_.quickpickoption.md#static-cancel)
* [quit](_core_quickly_.quickpickoption.md#static-quit)

### Methods

* [invokeCommand](_core_quickly_.quickpickoption.md#invokecommand)

## Constructors

###  constructor

\+ **new QuickPickOption**(`label`: string, `command?`: string, `description?`: string, `context?`: any, `alwaysShow?`: boolean): *[QuickPickOption](_core_quickly_.quickpickoption.md)*

Defined in src/core/Quickly.ts:567

**Parameters:**

Name | Type |
------ | ------ |
`label` | string |
`command?` | string |
`description?` | string |
`context?` | any |
`alwaysShow?` | boolean |

**Returns:** *[QuickPickOption](_core_quickly_.quickpickoption.md)*

## Properties

### `Optional` alwaysShow

• **alwaysShow**? : *boolean*

Defined in src/core/Quickly.ts:582

___

### `Optional` command

• **command**? : *string*

Defined in src/core/Quickly.ts:577

___

### `Optional` context

• **context**? : *any*

Defined in src/core/Quickly.ts:579

___

### `Optional` description

• **description**? : *string*

Defined in src/core/Quickly.ts:578

___

### `Optional` detail

• **detail**? : *string*

Defined in src/core/Quickly.ts:580

___

###  label

• **label**: *string*

Defined in src/core/Quickly.ts:576

___

### `Optional` picked

• **picked**? : *boolean*

Defined in src/core/Quickly.ts:581

___

### `Static` cancel

▪ **cancel**: *[QuickPickOption](_core_quickly_.quickpickoption.md)‹›* = new QuickPickOption('Cancel', cs.cds.controls.quickPicker.cancel, 'ESC')

Defined in src/core/Quickly.ts:592

___

### `Static` quit

▪ **quit**: *[QuickPickOption](_core_quickly_.quickpickoption.md)‹›* = new QuickPickOption('Close Window', cs.cds.controls.quickPicker.quit)

Defined in src/core/Quickly.ts:593

## Methods

###  invokeCommand

▸ **invokeCommand**<**T**>(...`rest`: any[]): *Thenable‹T›*

Defined in src/core/Quickly.ts:584

**Type parameters:**

▪ **T**

**Parameters:**

Name | Type |
------ | ------ |
`...rest` | any[] |

**Returns:** *Thenable‹T›*
