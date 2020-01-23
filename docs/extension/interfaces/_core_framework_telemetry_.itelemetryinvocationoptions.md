[cds-for-code](../README.md) › [Globals](../globals.md) › ["core/framework/Telemetry"](../modules/_core_framework_telemetry_.md) › [ITelemetryInvocationOptions](_core_framework_telemetry_.itelemetryinvocationoptions.md)

# Interface: ITelemetryInvocationOptions

## Hierarchy

* **ITelemetryInvocationOptions**

## Implemented by

* [TelemetryInvocationOptions](../classes/_core_framework_telemetry_.telemetryinvocationoptions.md)

## Index

### Properties

* [logger](_core_framework_telemetry_.itelemetryinvocationoptions.md#optional-logger)
* [onEnd](_core_framework_telemetry_.itelemetryinvocationoptions.md#optional-onend)
* [onStart](_core_framework_telemetry_.itelemetryinvocationoptions.md#optional-onstart)

## Properties

### `Optional` logger

• **logger**? : *[ExtensionLogger](../classes/_core_framework_logger_.extensionlogger.md)*

Defined in src/core/framework/Telemetry.ts:198

___

### `Optional` onEnd

• **onEnd**? : *function*

Defined in src/core/framework/Telemetry.ts:200

#### Type declaration:

▸ (`logger`: [ExtensionLogger](../classes/_core_framework_logger_.extensionlogger.md), `context`: [TelemetryContext](../classes/_core_framework_telemetry_.telemetrycontext.md), ...`args`: any[]): *void*

**Parameters:**

Name | Type |
------ | ------ |
`logger` | [ExtensionLogger](../classes/_core_framework_logger_.extensionlogger.md) |
`context` | [TelemetryContext](../classes/_core_framework_telemetry_.telemetrycontext.md) |
`...args` | any[] |

___

### `Optional` onStart

• **onStart**? : *function*

Defined in src/core/framework/Telemetry.ts:199

#### Type declaration:

▸ (`logger`: [ExtensionLogger](../classes/_core_framework_logger_.extensionlogger.md), ...`args`: any[]): *void*

**Parameters:**

Name | Type |
------ | ------ |
`logger` | [ExtensionLogger](../classes/_core_framework_logger_.extensionlogger.md) |
`...args` | any[] |
