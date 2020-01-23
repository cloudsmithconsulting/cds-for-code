[cds-for-code](../README.md) › [Globals](../globals.md) › ["core/framework/Telemetry"](../modules/_core_framework_telemetry_.md) › [TelemetryContext](_core_framework_telemetry_.telemetrycontext.md)

# Class: TelemetryContext

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

Defined in src/core/framework/Telemetry.ts:63

**Parameters:**

Name | Type |
------ | ------ |
`definition` | [TelemetryDefinition](../modules/_core_framework_telemetry_.md#telemetrydefinition) |

**Returns:** *[TelemetryContext](_core_framework_telemetry_.telemetrycontext.md)*

## Properties

###  event

• **event**: *string*

Defined in src/core/framework/Telemetry.ts:55

___

###  inputs

• **inputs**: *[Dictionary](_core_types_dictionary_.dictionary.md)‹string, number›*

Defined in src/core/framework/Telemetry.ts:58

___

###  instanceId

• **instanceId**: *string*

Defined in src/core/framework/Telemetry.ts:56

___

###  key

• **key**: *string*

Defined in src/core/framework/Telemetry.ts:57

___

###  measurements

• **measurements**: *object*

Defined in src/core/framework/Telemetry.ts:60

#### Type declaration:

* \[ **key**: *string*\]: number

___

###  properties

• **properties**: *object*

Defined in src/core/framework/Telemetry.ts:59

#### Type declaration:

* \[ **key**: *string*\]: string

___

### `Static` `Private` definitions

▪ **definitions**: *[Dictionary](_core_types_dictionary_.dictionary.md)‹string, object›* = new Dictionary<string, TelemetryDefinition>()

Defined in src/core/framework/Telemetry.ts:62

___

### `Static` `Private` preserves

▪ **preserves**: *[Dictionary](_core_types_dictionary_.dictionary.md)‹string, object›* = new Dictionary<string, { inputKeys: string[], propertyKeys: string[] }>()

Defined in src/core/framework/Telemetry.ts:63

## Methods

###  dispose

▸ **dispose**(): *void*

Defined in src/core/framework/Telemetry.ts:147

**Returns:** *void*

___

###  error

▸ **error**(`error`: [Error](_core_security_authentication_.authenticationerror.md#static-error)): *[TelemetryContext](_core_framework_telemetry_.telemetrycontext.md)*

Defined in src/core/framework/Telemetry.ts:93

**Parameters:**

Name | Type |
------ | ------ |
`error` | [Error](_core_security_authentication_.authenticationerror.md#static-error) |

**Returns:** *[TelemetryContext](_core_framework_telemetry_.telemetrycontext.md)*

___

###  input

▸ **input**(`key`: string, `value`: number): *[TelemetryContext](_core_framework_telemetry_.telemetrycontext.md)*

Defined in src/core/framework/Telemetry.ts:101

**Parameters:**

Name | Type |
------ | ------ |
`key` | string |
`value` | number |

**Returns:** *[TelemetryContext](_core_framework_telemetry_.telemetrycontext.md)*

___

###  mark

▸ **mark**(`key`: string): *[TelemetryContext](_core_framework_telemetry_.telemetrycontext.md)*

Defined in src/core/framework/Telemetry.ts:121

**Parameters:**

Name | Type |
------ | ------ |
`key` | string |

**Returns:** *[TelemetryContext](_core_framework_telemetry_.telemetrycontext.md)*

___

### `Private` prepareForSend

▸ **prepareForSend**(): *void*

Defined in src/core/framework/Telemetry.ts:168

**Returns:** *void*

___

###  property

▸ **property**(`key`: string, `value`: string): *[TelemetryContext](_core_framework_telemetry_.telemetrycontext.md)*

Defined in src/core/framework/Telemetry.ts:127

**Parameters:**

Name | Type |
------ | ------ |
`key` | string |
`value` | string |

**Returns:** *[TelemetryContext](_core_framework_telemetry_.telemetrycontext.md)*

___

###  sendTelemetry

▸ **sendTelemetry**(): *[TelemetryContext](_core_framework_telemetry_.telemetrycontext.md)*

Defined in src/core/framework/Telemetry.ts:139

**Returns:** *[TelemetryContext](_core_framework_telemetry_.telemetrycontext.md)*

___

### `Static` from

▸ **from**(`definition`: [TelemetryDefinition](../modules/_core_framework_telemetry_.md#telemetrydefinition)): *[TelemetryContext](_core_framework_telemetry_.telemetrycontext.md)*

Defined in src/core/framework/Telemetry.ts:83

**Parameters:**

Name | Type |
------ | ------ |
`definition` | [TelemetryDefinition](../modules/_core_framework_telemetry_.md#telemetrydefinition) |

**Returns:** *[TelemetryContext](_core_framework_telemetry_.telemetrycontext.md)*

___

### `Static` get

▸ **get**(`key`: string): *[TelemetryContext](_core_framework_telemetry_.telemetrycontext.md)*

Defined in src/core/framework/Telemetry.ts:89

**Parameters:**

Name | Type |
------ | ------ |
`key` | string |

**Returns:** *[TelemetryContext](_core_framework_telemetry_.telemetrycontext.md)*
