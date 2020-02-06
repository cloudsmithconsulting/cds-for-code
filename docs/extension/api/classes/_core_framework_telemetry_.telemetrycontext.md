---
id: "_core_framework_telemetry_.telemetrycontext"
title: "TelemetryContext"
sidebar_label: "TelemetryContext"
---

[cds-for-code](../index.md) › [Globals](../globals.md) › ["core/framework/Telemetry"](../modules/_core_framework_telemetry_.md) › [TelemetryContext](_core_framework_telemetry_.telemetrycontext.md)

## Hierarchy

* **TelemetryContext**

## Index

### Constructors

* [constructor](_core_framework_telemetry_.telemetrycontext.md#private-constructor)

### Properties

* [event](_core_framework_telemetry_.telemetrycontext.md#event)
* [inputs](_core_framework_telemetry_.telemetrycontext.md#inputs)
* [instanceId](_core_framework_telemetry_.telemetrycontext.md#instanceid)
* [key](_core_framework_telemetry_.telemetrycontext.md#key)
* [measurements](_core_framework_telemetry_.telemetrycontext.md#measurements)
* [properties](_core_framework_telemetry_.telemetrycontext.md#properties)
* [definitions](_core_framework_telemetry_.telemetrycontext.md#static-private-definitions)
* [preserves](_core_framework_telemetry_.telemetrycontext.md#static-private-preserves)

### Methods

* [dispose](_core_framework_telemetry_.telemetrycontext.md#dispose)
* [error](_core_framework_telemetry_.telemetrycontext.md#error)
* [input](_core_framework_telemetry_.telemetrycontext.md#input)
* [mark](_core_framework_telemetry_.telemetrycontext.md#mark)
* [prepareForSend](_core_framework_telemetry_.telemetrycontext.md#private-prepareforsend)
* [property](_core_framework_telemetry_.telemetrycontext.md#property)
* [sendTelemetry](_core_framework_telemetry_.telemetrycontext.md#sendtelemetry)
* [from](_core_framework_telemetry_.telemetrycontext.md#static-from)
* [get](_core_framework_telemetry_.telemetrycontext.md#static-get)

## Constructors

### `Private` constructor

\+ **new TelemetryContext**(`definition`: [TelemetryDefinition](../modules/_core_framework_telemetry_.md#telemetrydefinition)): *[TelemetryContext](_core_framework_telemetry_.telemetrycontext.md)*

Defined in src/core/framework/Telemetry.ts:79

**Parameters:**

Name | Type |
------ | ------ |
`definition` | [TelemetryDefinition](../modules/_core_framework_telemetry_.md#telemetrydefinition) |

**Returns:** *[TelemetryContext](_core_framework_telemetry_.telemetrycontext.md)*

## Properties

###  event

• **event**: *string*

Defined in src/core/framework/Telemetry.ts:71

___

###  inputs

• **inputs**: *[Dictionary](_core_types_dictionary_.dictionary.md)‹string, number›*

Defined in src/core/framework/Telemetry.ts:74

___

###  instanceId

• **instanceId**: *string*

Defined in src/core/framework/Telemetry.ts:72

___

###  key

• **key**: *string*

Defined in src/core/framework/Telemetry.ts:73

___

###  measurements

• **measurements**: *object*

Defined in src/core/framework/Telemetry.ts:76

#### Type declaration:

* \[ **key**: *string*\]: number

___

###  properties

• **properties**: *object*

Defined in src/core/framework/Telemetry.ts:75

#### Type declaration:

* \[ **key**: *string*\]: string

___

### `Static` `Private` definitions

▪ **definitions**: *[Dictionary](_core_types_dictionary_.dictionary.md)‹string, object›* = new Dictionary<string, TelemetryDefinition>()

Defined in src/core/framework/Telemetry.ts:78

___

### `Static` `Private` preserves

▪ **preserves**: *[Dictionary](_core_types_dictionary_.dictionary.md)‹string, object›* = new Dictionary<string, { inputKeys: string[], propertyKeys: string[] }>()

Defined in src/core/framework/Telemetry.ts:79

## Methods

###  dispose

▸ **dispose**(): *void*

Defined in src/core/framework/Telemetry.ts:163

**Returns:** *void*

___

###  error

▸ **error**(`error`: [Error](_core_security_authentication_.authenticationerror.md#static-error)): *[TelemetryContext](_core_framework_telemetry_.telemetrycontext.md)*

Defined in src/core/framework/Telemetry.ts:109

**Parameters:**

Name | Type |
------ | ------ |
`error` | [Error](_core_security_authentication_.authenticationerror.md#static-error) |

**Returns:** *[TelemetryContext](_core_framework_telemetry_.telemetrycontext.md)*

___

###  input

▸ **input**(`key`: string, `value`: number): *[TelemetryContext](_core_framework_telemetry_.telemetrycontext.md)*

Defined in src/core/framework/Telemetry.ts:117

**Parameters:**

Name | Type |
------ | ------ |
`key` | string |
`value` | number |

**Returns:** *[TelemetryContext](_core_framework_telemetry_.telemetrycontext.md)*

___

###  mark

▸ **mark**(`key`: string): *[TelemetryContext](_core_framework_telemetry_.telemetrycontext.md)*

Defined in src/core/framework/Telemetry.ts:137

**Parameters:**

Name | Type |
------ | ------ |
`key` | string |

**Returns:** *[TelemetryContext](_core_framework_telemetry_.telemetrycontext.md)*

___

### `Private` prepareForSend

▸ **prepareForSend**(): *void*

Defined in src/core/framework/Telemetry.ts:184

**Returns:** *void*

___

###  property

▸ **property**(`key`: string, `value`: string): *[TelemetryContext](_core_framework_telemetry_.telemetrycontext.md)*

Defined in src/core/framework/Telemetry.ts:143

**Parameters:**

Name | Type |
------ | ------ |
`key` | string |
`value` | string |

**Returns:** *[TelemetryContext](_core_framework_telemetry_.telemetrycontext.md)*

___

###  sendTelemetry

▸ **sendTelemetry**(): *[TelemetryContext](_core_framework_telemetry_.telemetrycontext.md)*

Defined in src/core/framework/Telemetry.ts:155

**Returns:** *[TelemetryContext](_core_framework_telemetry_.telemetrycontext.md)*

___

### `Static` from

▸ **from**(`definition`: [TelemetryDefinition](../modules/_core_framework_telemetry_.md#telemetrydefinition)): *[TelemetryContext](_core_framework_telemetry_.telemetrycontext.md)*

Defined in src/core/framework/Telemetry.ts:99

**Parameters:**

Name | Type |
------ | ------ |
`definition` | [TelemetryDefinition](../modules/_core_framework_telemetry_.md#telemetrydefinition) |

**Returns:** *[TelemetryContext](_core_framework_telemetry_.telemetrycontext.md)*

___

### `Static` get

▸ **get**(`key`: string): *[TelemetryContext](_core_framework_telemetry_.telemetrycontext.md)*

Defined in src/core/framework/Telemetry.ts:105

**Parameters:**

Name | Type |
------ | ------ |
`key` | string |

**Returns:** *[TelemetryContext](_core_framework_telemetry_.telemetrycontext.md)*
