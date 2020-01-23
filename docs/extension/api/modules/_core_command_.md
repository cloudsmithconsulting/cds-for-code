---
id: "_core_command_"
title: "core/Command"
sidebar_label: "core/Command"
---

[cds-for-code](../index.md) › [Globals](../globals.md) › ["core/Command"](_core_command_.md)

## Index

### Classes

* [CommandWrapper](../classes/_core_command_.commandwrapper.md)
* [DefaultCommandInvocationOptions](../classes/_core_command_.defaultcommandinvocationoptions.md)
* [DefaultCommandWrapper](../classes/_core_command_.defaultcommandwrapper.md)

### Interfaces

* [ICommandInvocationOptions](../interfaces/_core_command_.icommandinvocationoptions.md)
* [ICommandWrapper](../interfaces/_core_command_.icommandwrapper.md)

### Variables

* [moment](_core_command_.md#moment)

### Functions

* [command](_core_command_.md#command)

## Variables

###  moment

• **moment**: *[moment](_core_framework_telemetry_.md#moment)*

Defined in src/core/Command.ts:7

## Functions

###  command

▸ **command**<**T**>(`id`: string, `description`: string, `options?`: [ICommandInvocationOptions](../interfaces/_core_command_.icommandinvocationoptions.md), `wrapper`: [CommandWrapper](../classes/_core_command_.commandwrapper.md)‹T›): *(Anonymous function)*

Defined in src/core/Command.ts:81

**Type parameters:**

▪ **T**

**Parameters:**

Name | Type | Default |
------ | ------ | ------ |
`id` | string | - |
`description` | string | - |
`options?` | [ICommandInvocationOptions](../interfaces/_core_command_.icommandinvocationoptions.md) | - |
`wrapper` | [CommandWrapper](../classes/_core_command_.commandwrapper.md)‹T› | new DefaultCommandWrapper<T>(id, description, options) |

**Returns:** *(Anonymous function)*
