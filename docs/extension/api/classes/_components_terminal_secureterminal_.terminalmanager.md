---
id: "_components_terminal_secureterminal_.terminalmanager"
title: "TerminalManager"
sidebar_label: "TerminalManager"
---

[cds-for-code](../index.md) › [Globals](../globals.md) › ["components/Terminal/SecureTerminal"](../modules/_components_terminal_secureterminal_.md) › [TerminalManager](_components_terminal_secureterminal_.terminalmanager.md)

## Hierarchy

* **TerminalManager**

## Index

### Properties

* [terminals](_components_terminal_secureterminal_.terminalmanager.md#static-private-terminals)

### Methods

* [activate](_components_terminal_secureterminal_.terminalmanager.md#static-activate)
* [clearTerminal](_components_terminal_secureterminal_.terminalmanager.md#static-clearterminal)
* [showTerminal](_components_terminal_secureterminal_.terminalmanager.md#static-showterminal)

## Properties

### `Static` `Private` terminals

▪ **terminals**: *[Dictionary](_core_types_dictionary_.dictionary.md)‹string, [Terminal](_components_terminal_secureterminal_.terminal.md)›* = new Dictionary<string, Terminal>()

Defined in src/components/Terminal/SecureTerminal.ts:772

## Methods

### `Static` activate

▸ **activate**(`context`: [ExtensionContext](_core_extensioncontext_.extensioncontext.md)): *Promise‹void›*

Defined in src/components/Terminal/SecureTerminal.ts:775

**Parameters:**

Name | Type |
------ | ------ |
`context` | [ExtensionContext](_core_extensioncontext_.extensioncontext.md) |

**Returns:** *Promise‹void›*

___

### `Static` clearTerminal

▸ **clearTerminal**(`terminal`: [Terminal](_components_terminal_secureterminal_.terminal.md)): *Promise‹void›*

Defined in src/components/Terminal/SecureTerminal.ts:812

**Parameters:**

Name | Type |
------ | ------ |
`terminal` | [Terminal](_components_terminal_secureterminal_.terminal.md) |

**Returns:** *Promise‹void›*

___

### `Static` showTerminal

▸ **showTerminal**(`folder`: string, `name?`: string, `preserveFocus`: boolean): *Promise‹[Terminal](_components_terminal_secureterminal_.terminal.md)›*

Defined in src/components/Terminal/SecureTerminal.ts:784

**Parameters:**

Name | Type | Default |
------ | ------ | ------ |
`folder` | string | - |
`name?` | string | - |
`preserveFocus` | boolean | false |

**Returns:** *Promise‹[Terminal](_components_terminal_secureterminal_.terminal.md)›*
