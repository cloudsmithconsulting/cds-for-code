---
id: "_core_webui_webviewbridge_.webviewbridge"
title: "WebviewBridge"
sidebar_label: "WebviewBridge"
---

[cds-for-code](../index.md) › [Globals](../globals.md) › ["core/webui/WebviewBridge"](../modules/_core_webui_webviewbridge_.md) › [WebviewBridge](_core_webui_webviewbridge_.webviewbridge.md)

## Hierarchy

* **WebviewBridge**

  ↳ [LocalBridge](_core_webui_localbridge_browser_.localbridge.md)

  ↳ [LocalBridge](_core_webui_localbridge_.localbridge.md)

  ↳ [WebSocketBridge](_core_webui_websocketbridge_.websocketbridge.md)

  ↳ [WebSocketBridge](_core_webui_websocketbridge_browser_.websocketbridge.md)

## Implements

* [IWebviewBridge](../interfaces/_core_webui_webviewbridge_.iwebviewbridge.md)

## Index

### Constructors

* [constructor](_core_webui_webviewbridge_.webviewbridge.md#constructor)

### Properties

* [functions](_core_webui_webviewbridge_.webviewbridge.md#protected-functions)
* [promises](_core_webui_webviewbridge_.webviewbridge.md#protected-promises)
* [timeout](_core_webui_webviewbridge_.webviewbridge.md#protected-timeout)

### Methods

* [add](_core_webui_webviewbridge_.webviewbridge.md#add)
* [handleRequest](_core_webui_webviewbridge_.webviewbridge.md#handlerequest)
* [handleResponse](_core_webui_webviewbridge_.webviewbridge.md#handleresponse)
* [invoke](_core_webui_webviewbridge_.webviewbridge.md#invoke)
* [locals](_core_webui_webviewbridge_.webviewbridge.md#locals)
* [remote](_core_webui_webviewbridge_.webviewbridge.md#remote)
* [remove](_core_webui_webviewbridge_.webviewbridge.md#remove)
* [request](_core_webui_webviewbridge_.webviewbridge.md#abstract-request)
* [respond](_core_webui_webviewbridge_.webviewbridge.md#abstract-respond)
* [setTimeout](_core_webui_webviewbridge_.webviewbridge.md#settimeout)

## Constructors

###  constructor

\+ **new WebviewBridge**(): *[WebviewBridge](_core_webui_webviewbridge_.webviewbridge.md)*

Defined in src/core/webui/WebviewBridge.ts:29

**Returns:** *[WebviewBridge](_core_webui_webviewbridge_.webviewbridge.md)*

## Properties

### `Protected` functions

• **functions**: *Map‹string, [IFunctionReference](../interfaces/_core_webui_webviewbridge_.ifunctionreference.md)›*

Defined in src/core/webui/WebviewBridge.ts:27

___

### `Protected` promises

• **promises**: *Map‹string, [IPromiseInfo](../interfaces/_core_types_promiseinfo_.ipromiseinfo.md)‹any››*

Defined in src/core/webui/WebviewBridge.ts:26

___

### `Protected` timeout

• **timeout**: *number* = 3600000

Defined in src/core/webui/WebviewBridge.ts:29

## Methods

###  add

▸ **add**(`method`: [IFunctionReference](../interfaces/_core_webui_webviewbridge_.ifunctionreference.md)): *void*

*Implementation of [IWebviewBridge](../interfaces/_core_webui_webviewbridge_.iwebviewbridge.md)*

Defined in src/core/webui/WebviewBridge.ts:41

**Parameters:**

Name | Type |
------ | ------ |
`method` | [IFunctionReference](../interfaces/_core_webui_webviewbridge_.ifunctionreference.md) |

**Returns:** *void*

___

###  handleRequest

▸ **handleRequest**(`message`: any): *Promise‹void›*

*Implementation of [IWebviewBridge](../interfaces/_core_webui_webviewbridge_.iwebviewbridge.md)*

Defined in src/core/webui/WebviewBridge.ts:83

**Parameters:**

Name | Type |
------ | ------ |
`message` | any |

**Returns:** *Promise‹void›*

___

###  handleResponse

▸ **handleResponse**(`message`: any): *void*

*Implementation of [IWebviewBridge](../interfaces/_core_webui_webviewbridge_.iwebviewbridge.md)*

Defined in src/core/webui/WebviewBridge.ts:69

**Parameters:**

Name | Type |
------ | ------ |
`message` | any |

**Returns:** *void*

___

###  invoke

▸ **invoke**(`method`: string, `params?`: any[]): *Promise‹any›*

Defined in src/core/webui/WebviewBridge.ts:57

**Parameters:**

Name | Type |
------ | ------ |
`method` | string |
`params?` | any[] |

**Returns:** *Promise‹any›*

___

###  locals

▸ **locals**(): *string[]*

*Implementation of [IWebviewBridge](../interfaces/_core_webui_webviewbridge_.iwebviewbridge.md)*

Defined in src/core/webui/WebviewBridge.ts:49

**Returns:** *string[]*

___

###  remote

▸ **remote**(): *Promise‹string[]›*

*Implementation of [IWebviewBridge](../interfaces/_core_webui_webviewbridge_.iwebviewbridge.md)*

Defined in src/core/webui/WebviewBridge.ts:53

**Returns:** *Promise‹string[]›*

___

###  remove

▸ **remove**(`method`: [IFunctionReference](../interfaces/_core_webui_webviewbridge_.ifunctionreference.md)): *void*

*Implementation of [IWebviewBridge](../interfaces/_core_webui_webviewbridge_.iwebviewbridge.md)*

Defined in src/core/webui/WebviewBridge.ts:45

**Parameters:**

Name | Type |
------ | ------ |
`method` | [IFunctionReference](../interfaces/_core_webui_webviewbridge_.ifunctionreference.md) |

**Returns:** *void*

___

### `Abstract` request

▸ **request**(`guid`: string, `method`: string, `params?`: any[]): *void*

*Implementation of [IWebviewBridge](../interfaces/_core_webui_webviewbridge_.iwebviewbridge.md)*

Defined in src/core/webui/WebviewBridge.ts:24

**Parameters:**

Name | Type |
------ | ------ |
`guid` | string |
`method` | string |
`params?` | any[] |

**Returns:** *void*

___

### `Abstract` respond

▸ **respond**(`guid`: string, `response`: any, `success?`: boolean): *void*

*Implementation of [IWebviewBridge](../interfaces/_core_webui_webviewbridge_.iwebviewbridge.md)*

Defined in src/core/webui/WebviewBridge.ts:25

**Parameters:**

Name | Type |
------ | ------ |
`guid` | string |
`response` | any |
`success?` | boolean |

**Returns:** *void*

___

###  setTimeout

▸ **setTimeout**(`timeout`: number): *void*

*Implementation of [IWebviewBridge](../interfaces/_core_webui_webviewbridge_.iwebviewbridge.md)*

Defined in src/core/webui/WebviewBridge.ts:37

**Parameters:**

Name | Type |
------ | ------ |
`timeout` | number |

**Returns:** *void*
