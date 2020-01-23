---
id: "_core_command_.defaultcommandwrapper"
title: "DefaultCommandWrapper"
sidebar_label: "DefaultCommandWrapper"
---

[cds-for-code](../index.md) › [Globals](../globals.md) › ["core/Command"](../modules/_core_command_.md) › [DefaultCommandWrapper](_core_command_.defaultcommandwrapper.md)

## Type parameters

▪ **T**

## Hierarchy

* [CommandWrapper](_core_command_.commandwrapper.md)‹T›

  ↳ **DefaultCommandWrapper**

## Implements

* [ICommandWrapper](../interfaces/_core_command_.icommandwrapper.md)‹T›

## Index

### Constructors

* [constructor](_core_command_.defaultcommandwrapper.md#constructor)

### Properties

* [description](_core_command_.defaultcommandwrapper.md#description)
* [endTime](_core_command_.defaultcommandwrapper.md#endtime)
* [id](_core_command_.defaultcommandwrapper.md#id)
* [invocationId](_core_command_.defaultcommandwrapper.md#invocationid)
* [options](_core_command_.defaultcommandwrapper.md#options)
* [startTime](_core_command_.defaultcommandwrapper.md#starttime)

### Methods

* [onCommandCompleted](_core_command_.defaultcommandwrapper.md#oncommandcompleted)
* [onCommandError](_core_command_.defaultcommandwrapper.md#oncommanderror)
* [onCommandInvoked](_core_command_.defaultcommandwrapper.md#oncommandinvoked)

## Constructors

###  constructor

\+ **new DefaultCommandWrapper**(`id`: string, `description`: string, `options`: [ICommandInvocationOptions](../interfaces/_core_command_.icommandinvocationoptions.md)): *[DefaultCommandWrapper](_core_command_.defaultcommandwrapper.md)*

*Inherited from [CommandWrapper](_core_command_.commandwrapper.md).[constructor](_core_command_.commandwrapper.md#constructor)*

Defined in src/core/Command.ts:29

**Parameters:**

Name | Type | Default |
------ | ------ | ------ |
`id` | string | - |
`description` | string | - |
`options` | [ICommandInvocationOptions](../interfaces/_core_command_.icommandinvocationoptions.md) | new DefaultCommandInvocationOptions() |

**Returns:** *[DefaultCommandWrapper](_core_command_.defaultcommandwrapper.md)*

## Properties

###  description

• **description**: *string*

*Inherited from [CommandWrapper](_core_command_.commandwrapper.md).[description](_core_command_.commandwrapper.md#description)*

Defined in src/core/Command.ts:32

___

###  endTime

• **endTime**: *number*

*Inherited from [CommandWrapper](_core_command_.commandwrapper.md).[endTime](_core_command_.commandwrapper.md#endtime)*

Defined in src/core/Command.ts:41

___

###  id

• **id**: *string*

*Implementation of [ICommandWrapper](../interfaces/_core_command_.icommandwrapper.md).[id](../interfaces/_core_command_.icommandwrapper.md#id)*

*Inherited from [CommandWrapper](_core_command_.commandwrapper.md).[id](_core_command_.commandwrapper.md#id)*

Defined in src/core/Command.ts:31

___

###  invocationId

• **invocationId**: *string*

*Inherited from [CommandWrapper](_core_command_.commandwrapper.md).[invocationId](_core_command_.commandwrapper.md#invocationid)*

Defined in src/core/Command.ts:39

___

###  options

• **options**: *[ICommandInvocationOptions](../interfaces/_core_command_.icommandinvocationoptions.md)*

*Inherited from [CommandWrapper](_core_command_.commandwrapper.md).[options](_core_command_.commandwrapper.md#options)*

Defined in src/core/Command.ts:33

___

###  startTime

• **startTime**: *number*

*Inherited from [CommandWrapper](_core_command_.commandwrapper.md).[startTime](_core_command_.commandwrapper.md#starttime)*

Defined in src/core/Command.ts:40

## Methods

###  onCommandCompleted

▸ **onCommandCompleted**(`result`: T): *T*

*Implementation of [ICommandWrapper](../interfaces/_core_command_.icommandwrapper.md)*

*Overrides [CommandWrapper](_core_command_.commandwrapper.md).[onCommandCompleted](_core_command_.commandwrapper.md#abstract-oncommandcompleted)*

Defined in src/core/Command.ts:68

**Parameters:**

Name | Type |
------ | ------ |
`result` | T |

**Returns:** *T*

___

###  onCommandError

▸ **onCommandError**(`error`: [Error](_core_security_authentication_.authenticationerror.md#static-error)): *void*

*Implementation of [ICommandWrapper](../interfaces/_core_command_.icommandwrapper.md)*

*Overrides [CommandWrapper](_core_command_.commandwrapper.md).[onCommandError](_core_command_.commandwrapper.md#abstract-oncommanderror)*

Defined in src/core/Command.ts:58

**Parameters:**

Name | Type |
------ | ------ |
`error` | [Error](_core_security_authentication_.authenticationerror.md#static-error) |

**Returns:** *void*

___

###  onCommandInvoked

▸ **onCommandInvoked**(...`args`: any[]): *void*

*Implementation of [ICommandWrapper](../interfaces/_core_command_.icommandwrapper.md)*

*Overrides [CommandWrapper](_core_command_.commandwrapper.md).[onCommandInvoked](_core_command_.commandwrapper.md#abstract-oncommandinvoked)*

Defined in src/core/Command.ts:49

**Parameters:**

Name | Type |
------ | ------ |
`...args` | any[] |

**Returns:** *void*
