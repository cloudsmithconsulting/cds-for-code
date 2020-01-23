---
id: "_core_framework_logger_.extensionlogger"
title: "ExtensionLogger"
sidebar_label: "ExtensionLogger"
---

[cds-for-code](../index.md) › [Globals](../globals.md) › ["core/framework/Logger"](../modules/_core_framework_logger_.md) › [ExtensionLogger](_core_framework_logger_.extensionlogger.md)

## Hierarchy

* **ExtensionLogger**

## Index

### Constructors

* [constructor](_core_framework_logger_.extensionlogger.md#private-constructor)

### Properties

* [logger](_core_framework_logger_.extensionlogger.md#private-logger)
* [outputChannel](_core_framework_logger_.extensionlogger.md#private-outputchannel)
* [writableStream](_core_framework_logger_.extensionlogger.md#private-writablestream)
* [_instance](_core_framework_logger_.extensionlogger.md#static-private-_instance)

### Accessors

* [Instance](_core_framework_logger_.extensionlogger.md#static-instance)

### Methods

* [assert](_core_framework_logger_.extensionlogger.md#assert)
* [clear](_core_framework_logger_.extensionlogger.md#clear)
* [count](_core_framework_logger_.extensionlogger.md#count)
* [countReset](_core_framework_logger_.extensionlogger.md#countreset)
* [debug](_core_framework_logger_.extensionlogger.md#debug)
* [dispose](_core_framework_logger_.extensionlogger.md#dispose)
* [error](_core_framework_logger_.extensionlogger.md#error)
* [formatMessage](_core_framework_logger_.extensionlogger.md#private-formatmessage)
* [group](_core_framework_logger_.extensionlogger.md#group)
* [groupEnd](_core_framework_logger_.extensionlogger.md#groupend)
* [info](_core_framework_logger_.extensionlogger.md#info)
* [log](_core_framework_logger_.extensionlogger.md#log)
* [table](_core_framework_logger_.extensionlogger.md#table)
* [time](_core_framework_logger_.extensionlogger.md#time)
* [timeEnd](_core_framework_logger_.extensionlogger.md#timeend)
* [timeLog](_core_framework_logger_.extensionlogger.md#timelog)
* [trace](_core_framework_logger_.extensionlogger.md#trace)
* [warn](_core_framework_logger_.extensionlogger.md#warn)
* [create](_core_framework_logger_.extensionlogger.md#static-create)
* [remove](_core_framework_logger_.extensionlogger.md#static-remove)

## Constructors

### `Private` constructor

\+ **new ExtensionLogger**(`channelName`: string): *[ExtensionLogger](_core_framework_logger_.extensionlogger.md)*

Defined in src/core/framework/Logger.ts:40

**Parameters:**

Name | Type |
------ | ------ |
`channelName` | string |

**Returns:** *[ExtensionLogger](_core_framework_logger_.extensionlogger.md)*

## Properties

### `Private` logger

• **logger**: *[Logger](../modules/_core_framework_logger_.md#logger)*

Defined in src/core/framework/Logger.ts:40

___

### `Private` outputChannel

• **outputChannel**: *OutputChannel*

Defined in src/core/framework/Logger.ts:38

___

### `Private` writableStream

• **writableStream**: *Writable*

Defined in src/core/framework/Logger.ts:39

___

### `Static` `Private` _instance

▪ **_instance**: *[Dictionary](_core_types_dictionary_.dictionary.md)‹string, [ExtensionLogger](_core_framework_logger_.extensionlogger.md)›*

Defined in src/core/framework/Logger.ts:11

## Accessors

### `Static` Instance

• **get Instance**(): *[Dictionary](_core_types_dictionary_.dictionary.md)‹string, [ExtensionLogger](_core_framework_logger_.extensionlogger.md)›*

Defined in src/core/framework/Logger.ts:13

**Returns:** *[Dictionary](_core_types_dictionary_.dictionary.md)‹string, [ExtensionLogger](_core_framework_logger_.extensionlogger.md)›*

## Methods

###  assert

▸ **assert**(`value`: any, `message?`: string, ...`optionalParams`: any[]): *void*

Defined in src/core/framework/Logger.ts:85

A simple assertion test that verifies whether `value` is truthy.
If it is not, an `AssertionError` is thrown.
If provided, the error `message` is formatted using `util.format()` and used as the error message.

**Parameters:**

Name | Type |
------ | ------ |
`value` | any |
`message?` | string |
`...optionalParams` | any[] |

**Returns:** *void*

___

###  clear

▸ **clear**(): *void*

Defined in src/core/framework/Logger.ts:92

Clears the current output window.

**Returns:** *void*

___

###  count

▸ **count**(`label?`: string): *void*

Defined in src/core/framework/Logger.ts:99

Maintains an internal counter specific to `label` and outputs to `stdout` the number of times `console.count()` has been called with the given `label`.

**Parameters:**

Name | Type |
------ | ------ |
`label?` | string |

**Returns:** *void*

___

###  countReset

▸ **countReset**(`label?`: string): *void*

Defined in src/core/framework/Logger.ts:106

Resets the internal counter specific to `label`.

**Parameters:**

Name | Type |
------ | ------ |
`label?` | string |

**Returns:** *void*

___

###  debug

▸ **debug**(`message?`: any, ...`optionalParams`: any[]): *void*

Defined in src/core/framework/Logger.ts:113

The `console.debug()` function is an alias for {@link console.log()}.

**Parameters:**

Name | Type |
------ | ------ |
`message?` | any |
`...optionalParams` | any[] |

**Returns:** *void*

___

###  dispose

▸ **dispose**(): *void*

Defined in src/core/framework/Logger.ts:62

**Returns:** *void*

___

###  error

▸ **error**(`message?`: any, ...`optionalParams`: any[]): *void*

Defined in src/core/framework/Logger.ts:120

Prints to `stderr` with newline.

**Parameters:**

Name | Type |
------ | ------ |
`message?` | any |
`...optionalParams` | any[] |

**Returns:** *void*

___

### `Private` formatMessage

▸ **formatMessage**(`message?`: string): *string | undefined*

Defined in src/core/framework/Logger.ts:72

**Parameters:**

Name | Type |
------ | ------ |
`message?` | string |

**Returns:** *string | undefined*

___

###  group

▸ **group**(...`label`: any[]): *void*

Defined in src/core/framework/Logger.ts:128

Increases indentation of subsequent lines by two spaces.
If one or more `label`s are provided, those are printed first without the additional indentation.

**Parameters:**

Name | Type |
------ | ------ |
`...label` | any[] |

**Returns:** *void*

___

###  groupEnd

▸ **groupEnd**(): *void*

Defined in src/core/framework/Logger.ts:135

Decreases indentation of subsequent lines by two spaces.

**Returns:** *void*

___

###  info

▸ **info**(`message?`: any, ...`optionalParams`: any[]): *void*

Defined in src/core/framework/Logger.ts:142

The {@link console.info()} function is an alias for {@link console.log()}.

**Parameters:**

Name | Type |
------ | ------ |
`message?` | any |
`...optionalParams` | any[] |

**Returns:** *void*

___

###  log

▸ **log**(`message?`: any, ...`optionalParams`: any[]): *void*

Defined in src/core/framework/Logger.ts:149

Prints to `stdout` with newline.

**Parameters:**

Name | Type |
------ | ------ |
`message?` | any |
`...optionalParams` | any[] |

**Returns:** *void*

___

###  table

▸ **table**(`tabularData`: any, `properties?`: string[]): *void*

Defined in src/core/framework/Logger.ts:157

This method does not display anything unless used in the inspector.
 Prints to `stdout` the array `array` formatted as a table.

**Parameters:**

Name | Type |
------ | ------ |
`tabularData` | any |
`properties?` | string[] |

**Returns:** *void*

___

###  time

▸ **time**(`label?`: string): *void*

Defined in src/core/framework/Logger.ts:164

Starts a timer that can be used to compute the duration of an operation. Timers are identified by a unique `label`.

**Parameters:**

Name | Type |
------ | ------ |
`label?` | string |

**Returns:** *void*

___

###  timeEnd

▸ **timeEnd**(`label?`: string): *void*

Defined in src/core/framework/Logger.ts:171

Stops a timer that was previously started by calling {@link ExtensionLogger.time()} and prints the result to `stdout`.

**Parameters:**

Name | Type |
------ | ------ |
`label?` | string |

**Returns:** *void*

___

###  timeLog

▸ **timeLog**(`label?`: string, ...`data`: any[]): *void*

Defined in src/core/framework/Logger.ts:178

For a timer that was previously started by calling {@link ExtensionLogger.time()}, prints the elapsed time and other `data` arguments to `stdout`.

**Parameters:**

Name | Type |
------ | ------ |
`label?` | string |
`...data` | any[] |

**Returns:** *void*

___

###  trace

▸ **trace**(`message?`: any, ...`optionalParams`: any[]): *void*

Defined in src/core/framework/Logger.ts:185

Prints to `stderr` the string 'Trace :', followed by the {@link util.format()} formatted message and stack trace to the current position in the code.

**Parameters:**

Name | Type |
------ | ------ |
`message?` | any |
`...optionalParams` | any[] |

**Returns:** *void*

___

###  warn

▸ **warn**(`message?`: any, ...`optionalParams`: any[]): *void*

Defined in src/core/framework/Logger.ts:192

The {@link console.warn()} function is an alias for {@link console.error()}.

**Parameters:**

Name | Type |
------ | ------ |
`message?` | any |
`...optionalParams` | any[] |

**Returns:** *void*

___

### `Static` create

▸ **create**(`key`: string, `channelName`: string): *void*

Defined in src/core/framework/Logger.ts:22

**Parameters:**

Name | Type |
------ | ------ |
`key` | string |
`channelName` | string |

**Returns:** *void*

___

### `Static` remove

▸ **remove**(`key`: string): *void*

Defined in src/core/framework/Logger.ts:31

**Parameters:**

Name | Type |
------ | ------ |
`key` | string |

**Returns:** *void*
