[cds-for-code](../README.md) › [Globals](../globals.md) › ["core/framework/Telemetry"](../modules/_core_framework_telemetry_.md) › [TelemetryInvocationOptions](_core_framework_telemetry_.telemetryinvocationoptions.md)

# Class: TelemetryInvocationOptions

## Hierarchy

* **TelemetryInvocationOptions**

## Implements

* [ITelemetryInvocationOptions](../interfaces/_core_framework_telemetry_.itelemetryinvocationoptions.md)

## Index

### Constructors

* [constructor](_core_framework_telemetry_.telemetryinvocationoptions.md#constructor)

### Properties

* [logger](_core_framework_telemetry_.telemetryinvocationoptions.md#logger)
* [onEnd](_core_framework_telemetry_.telemetryinvocationoptions.md#optional-onend)
* [onStart](_core_framework_telemetry_.telemetryinvocationoptions.md#optional-onstart)

## Constructors

###  constructor

\+ **new TelemetryInvocationOptions**(`options?`: [ITelemetryInvocationOptions](../interfaces/_core_framework_telemetry_.itelemetryinvocationoptions.md)): *[TelemetryInvocationOptions](_core_framework_telemetry_.telemetryinvocationoptions.md)*

Defined in src/core/framework/Telemetry.ts:203

**Parameters:**

Name | Type |
------ | ------ |
`options?` | [ITelemetryInvocationOptions](../interfaces/_core_framework_telemetry_.itelemetryinvocationoptions.md) |

**Returns:** *[TelemetryInvocationOptions](_core_framework_telemetry_.telemetryinvocationoptions.md)*

## Properties

###  logger

• **logger**: *[ExtensionLogger](_core_framework_logger_.extensionlogger.md)* = Logger

*Implementation of [ITelemetryInvocationOptions](../interfaces/_core_framework_telemetry_.itelemetryinvocationoptions.md).[logger](../interfaces/_core_framework_telemetry_.itelemetryinvocationoptions.md#optional-logger)*

Defined in src/core/framework/Telemetry.ts:213

___

### `Optional` onEnd

• **onEnd**? : *function*

*Implementation of [ITelemetryInvocationOptions](../interfaces/_core_framework_telemetry_.itelemetryinvocationoptions.md).[onEnd](../interfaces/_core_framework_telemetry_.itelemetryinvocationoptions.md#optional-onend)*

Defined in src/core/framework/Telemetry.ts:215

#### Type declaration:

▸ (`logger`: [ExtensionLogger](_core_framework_logger_.extensionlogger.md), `context`: [TelemetryContext](_core_framework_telemetry_.telemetrycontext.md), ...`args`: any[]): *void*

**Parameters:**

Name | Type |
------ | ------ |
`logger` | [ExtensionLogger](_core_framework_logger_.extensionlogger.md) |
`context` | [TelemetryContext](_core_framework_telemetry_.telemetrycontext.md) |
`...args` | any[] |

___

### `Optional` onStart

• **onStart**? : *function*

*Implementation of [ITelemetryInvocationOptions](../interfaces/_core_framework_telemetry_.itelemetryinvocationoptions.md).[onStart](../interfaces/_core_framework_telemetry_.itelemetryinvocationoptions.md#optional-onstart)*

Defined in src/core/framework/Telemetry.ts:214

#### Type declaration:

▸ (`logger`: [ExtensionLogger](_core_framework_logger_.extensionlogger.md), ...`args`: any[]): *void*

**Parameters:**

Name | Type |
------ | ------ |
`logger` | [ExtensionLogger](_core_framework_logger_.extensionlogger.md) |
`...args` | any[] |
