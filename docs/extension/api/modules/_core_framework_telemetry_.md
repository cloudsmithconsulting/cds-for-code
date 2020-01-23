---
id: "_core_framework_telemetry_"
title: "core/framework/Telemetry"
sidebar_label: "core/framework/Telemetry"
---

[cds-for-code](../index.md) › [Globals](../globals.md) › ["core/framework/Telemetry"](_core_framework_telemetry_.md)

## Index

### Classes

* [Telemetry](../classes/_core_framework_telemetry_.telemetry.md)
* [TelemetryContext](../classes/_core_framework_telemetry_.telemetrycontext.md)
* [TelemetryInvocationOptions](../classes/_core_framework_telemetry_.telemetryinvocationoptions.md)

### Interfaces

* [ITelemetryInvocationOptions](../interfaces/_core_framework_telemetry_.itelemetryinvocationoptions.md)

### Type aliases

* [TelemetryDefinition](_core_framework_telemetry_.md#telemetrydefinition)
* [TelemetryItem](_core_framework_telemetry_.md#telemetryitem)

### Variables

* [moment](_core_framework_telemetry_.md#moment)

### Functions

* [telemetry](_core_framework_telemetry_.md#telemetry)

## Type aliases

###  TelemetryDefinition

Ƭ **TelemetryDefinition**: *object*

Defined in src/core/framework/Telemetry.ts:184

#### Type declaration:

* **event**: *string*

* **inputs**? : *[TelemetryItem](_core_framework_telemetry_.md#telemetryitem)‹number›[]*

* **key**: *string*

* **measures**? : *[Dictionary](../classes/_core_types_dictionary_.dictionary.md)‹string, function›*

* **properties**? : *[Dictionary](../classes/_core_types_dictionary_.dictionary.md)‹string, function›*

___

###  TelemetryItem

Ƭ **TelemetryItem**: *object*

Defined in src/core/framework/Telemetry.ts:192

#### Type declaration:

* **key**: *string*

* **value**? : *T*

## Variables

###  moment

• **moment**: *[moment](_core_framework_telemetry_.md#moment)*

Defined in src/core/framework/Telemetry.ts:7

## Functions

###  telemetry

▸ **telemetry**(`definition`: [TelemetryDefinition](_core_framework_telemetry_.md#telemetrydefinition), `options`: [ITelemetryInvocationOptions](../interfaces/_core_framework_telemetry_.itelemetryinvocationoptions.md)): *(Anonymous function)*

Defined in src/core/framework/Telemetry.ts:218

**Parameters:**

Name | Type | Default |
------ | ------ | ------ |
`definition` | [TelemetryDefinition](_core_framework_telemetry_.md#telemetrydefinition) | - |
`options` | [ITelemetryInvocationOptions](../interfaces/_core_framework_telemetry_.itelemetryinvocationoptions.md) | new TelemetryInvocationOptions() |

**Returns:** *(Anonymous function)*
