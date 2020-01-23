---
id: "_core_command_.commandwrapper"
title: "CommandWrapper"
sidebar_label: "CommandWrapper"
---

[cds-for-code](../index.md) › [Globals](../globals.md) › ["core/Command"](../modules/_core_command_.md) › [CommandWrapper](_core_command_.commandwrapper.md)

## Type parameters

▪ **T**

## Hierarchy

* **CommandWrapper**

  ↳ [DefaultCommandWrapper](_core_command_.defaultcommandwrapper.md)

## Implements

* [ICommandWrapper](../interfaces/_core_command_.icommandwrapper.md)‹T›

## Index

### Constructors

* [constructor](_core_command_.commandwrapper.md#constructor)

### Properties

* [description](_core_command_.commandwrapper.md#description)
* [endTime](_core_command_.commandwrapper.md#endtime)
* [id](_core_command_.commandwrapper.md#id)
* [invocationId](_core_command_.commandwrapper.md#invocationid)
* [options](_core_command_.commandwrapper.md#options)
* [startTime](_core_command_.commandwrapper.md#starttime)

### Methods

* [onCommandCompleted](_core_command_.commandwrapper.md#abstract-oncommandcompleted)
* [onCommandError](_core_command_.commandwrapper.md#abstract-oncommanderror)
* [onCommandInvoked](_core_command_.commandwrapper.md#abstract-oncommandinvoked)

## Constructors

###  constructor

\+ **new CommandWrapper**(`id`: string, `description`: string, `options`: [ICommandInvocationOptions](../interfaces/_core_command_.icommandinvocationoptions.md)): *[CommandWrapper](_core_command_.commandwrapper.md)*

Defined in src/core/Command.ts:29

**Parameters:**

Name | Type | Default |
------ | ------ | ------ |
`id` | string | - |
`description` | string | - |
`options` | [ICommandInvocationOptions](../interfaces/_core_command_.icommandinvocationoptions.md) | new DefaultCommandInvocationOptions() |

**Returns:** *[CommandWrapper](_core_command_.commandwrapper.md)*

## Properties

###  description

• **description**: *string*

Defined in src/core/Command.ts:32

___

###  endTime

• **endTime**: *number*

Defined in src/core/Command.ts:41

___

###  id

• **id**: *string*

*Implementation of [ICommandWrapper](../interfaces/_core_command_.icommandwrapper.md).[id](../interfaces/_core_command_.icommandwrapper.md#id)*

Defined in src/core/Command.ts:31

___

###  invocationId

• **invocationId**: *string*

Defined in src/core/Command.ts:39

___

###  options

• **options**: *[ICommandInvocationOptions](../interfaces/_core_command_.icommandinvocationoptions.md)*

Defined in src/core/Command.ts:33

___

###  startTime

• **startTime**: *number*

Defined in src/core/Command.ts:40

## Methods

### `Abstract` onCommandCompleted

▸ **onCommandCompleted**(`result`: T): *T*

*Implementation of [ICommandWrapper](../interfaces/_core_command_.icommandwrapper.md)*

Defined in src/core/Command.ts:45

**Parameters:**

Name | Type |
------ | ------ |
`result` | T |

**Returns:** *T*

___

### `Abstract` onCommandError

▸ **onCommandError**(`error`: [Error](_core_security_authentication_.authenticationerror.md#static-error)): *void*

*Implementation of [ICommandWrapper](../interfaces/_core_command_.icommandwrapper.md)*

Defined in src/core/Command.ts:44

**Parameters:**

Name | Type |
------ | ------ |
`error` | [Error](_core_security_authentication_.authenticationerror.md#static-error) |

**Returns:** *void*

___

### `Abstract` onCommandInvoked

▸ **onCommandInvoked**(...`args`: any[]): *void*

*Implementation of [ICommandWrapper](../interfaces/_core_command_.icommandwrapper.md)*

Defined in src/core/Command.ts:43

**Parameters:**

Name | Type |
------ | ------ |
`...args` | any[] |

**Returns:** *void*
