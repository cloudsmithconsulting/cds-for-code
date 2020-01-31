---
id: "_core_framework_telemetry_.telemetry"
title: "Telemetry"
sidebar_label: "Telemetry"
---

[cds-for-code](../index.md) › [Globals](../globals.md) › ["core/framework/Telemetry"](../modules/_core_framework_telemetry_.md) › [Telemetry](_core_framework_telemetry_.telemetry.md)

## Hierarchy

* **Telemetry**

## Index

### Constructors

* [constructor](_core_framework_telemetry_.telemetry.md#private-constructor)

### Properties

* [reporter](_core_framework_telemetry_.telemetry.md#protected-reporter)
* [instance](_core_framework_telemetry_.telemetry.md#static-private-instance)

### Accessors

* [Instance](_core_framework_telemetry_.telemetry.md#static-instance)

### Methods

* [context](_core_framework_telemetry_.telemetry.md#context)
* [error](_core_framework_telemetry_.telemetry.md#error)
* [sendTelemetry](_core_framework_telemetry_.telemetry.md#sendtelemetry)
* [activate](_core_framework_telemetry_.telemetry.md#static-activate)
* [deactivate](_core_framework_telemetry_.telemetry.md#static-deactivate)

## Constructors

### `Private` constructor

\+ **new Telemetry**(): *[Telemetry](_core_framework_telemetry_.telemetry.md)*

Defined in src/core/framework/Telemetry.ts:22

**Returns:** *[Telemetry](_core_framework_telemetry_.telemetry.md)*

## Properties

### `Protected` reporter

• **reporter**: *TelemetryReporter*

Defined in src/core/framework/Telemetry.ts:22

___

### `Static` `Private` instance

▪ **instance**: *[Telemetry](_core_framework_telemetry_.telemetry.md)*

Defined in src/core/framework/Telemetry.ts:21

## Accessors

### `Static` Instance

• **get Instance**(): *[Telemetry](_core_framework_telemetry_.telemetry.md)*

Defined in src/core/framework/Telemetry.ts:13

**Returns:** *[Telemetry](_core_framework_telemetry_.telemetry.md)*

## Methods

###  context

▸ **context**(`key`: string): *[TelemetryContext](_core_framework_telemetry_.telemetrycontext.md)*

Defined in src/core/framework/Telemetry.ts:41

**Parameters:**

Name | Type |
------ | ------ |
`key` | string |

**Returns:** *[TelemetryContext](_core_framework_telemetry_.telemetrycontext.md)*

___

###  error

▸ **error**(`error`: [Error](_core_security_authentication_.authenticationerror.md#static-error), `properties?`: object, `measurements?`: object): *void*

Defined in src/core/framework/Telemetry.ts:45

**Parameters:**

Name | Type |
------ | ------ |
`error` | [Error](_core_security_authentication_.authenticationerror.md#static-error) |
`properties?` | object |
`measurements?` | object |

**Returns:** *void*

___

###  sendTelemetry

▸ **sendTelemetry**(`event`: string, `properties?`: object, `measurements?`: object): *void*

Defined in src/core/framework/Telemetry.ts:57

**Parameters:**

Name | Type |
------ | ------ |
`event` | string |
`properties?` | object |
`measurements?` | object |

**Returns:** *void*

___

### `Static` activate

▸ **activate**(`context`: ExtensionContext): *Promise‹void›*

Defined in src/core/framework/Telemetry.ts:31

**Parameters:**

Name | Type |
------ | ------ |
`context` | ExtensionContext |

**Returns:** *Promise‹void›*

___

### `Static` deactivate

▸ **deactivate**(): *Promise‹void›*

Defined in src/core/framework/Telemetry.ts:35

**Returns:** *Promise‹void›*
