[cds-for-code](../README.md) › [Globals](../globals.md) › ["api/cds-webapi/CdsWebApi"](../modules/_api_cds_webapi_cdswebapi_.md) › [CdsWebApi](../modules/_api_cds_webapi_cdswebapi_.cdswebapi.md) › [RequestError](_api_cds_webapi_cdswebapi_.cdswebapi.requesterror.md)

# Interface: RequestError

## Hierarchy

* [Error](../classes/_core_security_authentication_.authenticationerror.md#static-error)

  ↳ **RequestError**

## Index

### Properties

* [Error](_api_cds_webapi_cdswebapi_.cdswebapi.requesterror.md#error)
* [code](_api_cds_webapi_cdswebapi_.cdswebapi.requesterror.md#optional-code)
* [innererror](_api_cds_webapi_cdswebapi_.cdswebapi.requesterror.md#optional-innererror)
* [message](_api_cds_webapi_cdswebapi_.cdswebapi.requesterror.md#message)
* [name](_api_cds_webapi_cdswebapi_.cdswebapi.requesterror.md#name)
* [stack](_api_cds_webapi_cdswebapi_.cdswebapi.requesterror.md#optional-stack)
* [status](_api_cds_webapi_cdswebapi_.cdswebapi.requesterror.md#optional-status)
* [statusText](_api_cds_webapi_cdswebapi_.cdswebapi.requesterror.md#optional-statustext)

## Properties

###  Error

• **Error**: *ErrorConstructor*

Defined in node_modules/typescript/lib/lib.es5.d.ts:984

___

### `Optional` code

• **code**? : *string*

Defined in src/api/cds-webapi/CdsWebApi.ts:256

This code is not related to the http status code and is frequently empty

___

### `Optional` innererror

• **innererror**? : *object*

Defined in src/api/cds-webapi/CdsWebApi.ts:264

Details about an error

#### Type declaration:

* **message**? : *string*

* **stacktrace**? : *string*

* **type**? : *string*

___

###  message

• **message**: *string*

*Overrides [AuthenticationError](../classes/_core_security_authentication_.authenticationerror.md).[message](../classes/_core_security_authentication_.authenticationerror.md#message)*

Defined in src/api/cds-webapi/CdsWebApi.ts:258

A message describing the error

___

###  name

• **name**: *string*

*Inherited from [AuthenticationError](../classes/_core_security_authentication_.authenticationerror.md).[name](../classes/_core_security_authentication_.authenticationerror.md#name)*

Defined in node_modules/typescript/lib/lib.es5.d.ts:973

___

### `Optional` stack

• **stack**? : *string*

*Inherited from [AuthenticationError](../classes/_core_security_authentication_.authenticationerror.md).[stack](../classes/_core_security_authentication_.authenticationerror.md#optional-stack)*

*Overrides [AuthenticationError](../classes/_core_security_authentication_.authenticationerror.md).[stack](../classes/_core_security_authentication_.authenticationerror.md#optional-stack)*

Defined in node_modules/typescript/lib/lib.es5.d.ts:975

___

### `Optional` status

• **status**? : *number*

Defined in src/api/cds-webapi/CdsWebApi.ts:260

HTTP status code

___

### `Optional` statusText

• **statusText**? : *string*

Defined in src/api/cds-webapi/CdsWebApi.ts:262

HTTP status text. Frequently empty
