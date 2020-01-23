[cds-for-code](../README.md) › [Globals](../globals.md) › ["core/http/nodeJsRequest"](_core_http_nodejsrequest_.md)

# External module: "core/http/nodeJsRequest"

## Index

### Type aliases

* [ResponseHandler](_core_http_nodejsrequest_.md#responsehandler)

### Variables

* [moment](_core_http_nodejsrequest_.md#moment)

### Functions

* [nodeJsRequest](_core_http_nodejsrequest_.md#nodejsrequest)

## Type aliases

###  ResponseHandler

Ƭ **ResponseHandler**: *function*

Defined in src/core/http/nodeJsRequest.ts:14

#### Type declaration:

▸ (`request`: any, `data`: any, `response`: any, `responseParams`: any, `successCallback`: function, `errorCallback`: function): *void*

**Parameters:**

▪ **request**: *any*

▪ **data**: *any*

▪ **response**: *any*

▪ **responseParams**: *any*

▪ **successCallback**: *function*

▸ (`response`: any): *void*

**Parameters:**

Name | Type |
------ | ------ |
`response` | any |

▪ **errorCallback**: *function*

▸ (`error`: any): *void*

**Parameters:**

Name | Type |
------ | ------ |
`error` | any |

## Variables

###  moment

• **moment**: *[moment](_core_framework_telemetry_.md#moment)*

Defined in src/core/http/nodeJsRequest.ts:12

## Functions

###  nodeJsRequest

▸ **nodeJsRequest**(`options`: any): *void*

Defined in src/core/http/nodeJsRequest.ts:20

Sends a request to given URL with given parameters

**Parameters:**

Name | Type |
------ | ------ |
`options` | any |

**Returns:** *void*
