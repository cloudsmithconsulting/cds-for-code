---
id: "_core_command_.icommandwrapper"
title: "ICommandWrapper"
sidebar_label: "ICommandWrapper"
---

[cds-for-code](../index.md) › [Globals](../globals.md) › ["core/Command"](../modules/_core_command_.md) › [ICommandWrapper](_core_command_.icommandwrapper.md)

## Type parameters

▪ **T**

## Hierarchy

* **ICommandWrapper**

## Implemented by

* [CommandWrapper](../classes/_core_command_.commandwrapper.md)
* [DefaultCommandWrapper](../classes/_core_command_.defaultcommandwrapper.md)

## Index

### Properties

* [id](_core_command_.icommandwrapper.md#id)

### Methods

* [onCommandCompleted](_core_command_.icommandwrapper.md#oncommandcompleted)
* [onCommandError](_core_command_.icommandwrapper.md#oncommanderror)
* [onCommandInvoked](_core_command_.icommandwrapper.md#oncommandinvoked)

## Properties

###  id

• **id**: *string*

Defined in src/core/Command.ts:10

## Methods

###  onCommandCompleted

▸ **onCommandCompleted**(`result`: T): *T*

Defined in src/core/Command.ts:14

**Parameters:**

Name | Type |
------ | ------ |
`result` | T |

**Returns:** *T*

___

###  onCommandError

▸ **onCommandError**(`error`: [Error](../classes/_core_security_authentication_.authenticationerror.md#static-error)): *void*

Defined in src/core/Command.ts:13

**Parameters:**

Name | Type |
------ | ------ |
`error` | [Error](../classes/_core_security_authentication_.authenticationerror.md#static-error) |

**Returns:** *void*

___

###  onCommandInvoked

▸ **onCommandInvoked**(...`args`: any[]): *void*

Defined in src/core/Command.ts:12

**Parameters:**

Name | Type |
------ | ------ |
`...args` | any[] |

**Returns:** *void*
