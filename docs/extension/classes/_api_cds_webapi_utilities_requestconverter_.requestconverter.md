---
id: "_api_cds_webapi_utilities_requestconverter_.requestconverter"
title: "RequestConverter"
sidebar_label: "RequestConverter"
---

[cds-for-code](../index.md) › [Globals](../globals.md) › ["api/cds-webapi/utilities/RequestConverter"](../modules/_api_cds_webapi_utilities_requestconverter_.md) › [RequestConverter](_api_cds_webapi_utilities_requestconverter_.requestconverter.md)

## Hierarchy

* **RequestConverter**

## Index

### Methods

* [convertRequest](_api_cds_webapi_utilities_requestconverter_.requestconverter.md#static-convertrequest)
* [convertRequestOptions](_api_cds_webapi_utilities_requestconverter_.requestconverter.md#static-convertrequestoptions)

## Methods

### `Static` convertRequest

▸ **convertRequest**(`request`: any, `functionName`: string, `config`: any): *[ConvertedRequest](../interfaces/_api_cds_webapi_utilities_requestconverter_.convertedrequest.md)*

Defined in src/api/cds-webapi/utilities/RequestConverter.ts:224

Converts a request object to URL link

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`request` | any | Request object |
`functionName` | string | - |
`config` | any | - |

**Returns:** *[ConvertedRequest](../interfaces/_api_cds_webapi_utilities_requestconverter_.convertedrequest.md)*

Converted request

___

### `Static` convertRequestOptions

▸ **convertRequestOptions**(`request`: any, `functionName`: string, `url`: string, `joinSymbol`: string, `config?`: any): *[ConvertedRequestOptions](../interfaces/_api_cds_webapi_utilities_requestconverter_.convertedrequestoptions.md)*

Defined in src/api/cds-webapi/utilities/RequestConverter.ts:39

Converts optional parameters of the request to URL. If expand parameter exists this function is called recursively.

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`request` | any | Request object |
`functionName` | string | Name of the function that converts a request (for Error Handling) |
`url` | string | URL beginning (with required parameters) |
`joinSymbol` | string | - |
`config?` | any | - |

**Returns:** *[ConvertedRequestOptions](../interfaces/_api_cds_webapi_utilities_requestconverter_.convertedrequestoptions.md)*

Additional options in request
