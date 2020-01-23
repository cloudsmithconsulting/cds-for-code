---
id: "_core_webui_websocketbridge_browser_.websocketbridge"
title: "WebSocketBridge"
sidebar_label: "WebSocketBridge"
---

[cds-for-code](../index.md) › [Globals](../globals.md) › ["core/webui/WebSocketBridge.browser"](../modules/_core_webui_websocketbridge_browser_.md) › [WebSocketBridge](_core_webui_websocketbridge_browser_.websocketbridge.md)

## Hierarchy

* [WebviewBridge](_core_webui_webviewbridge_.webviewbridge.md)

  ↳ **WebSocketBridge**

## Implements

* [IWebviewBridge](../interfaces/_core_webui_webviewbridge_.iwebviewbridge.md)

## Index

### Constructors

* [constructor](_core_webui_websocketbridge_browser_.websocketbridge.md#constructor)

### Properties

* [functions](_core_webui_websocketbridge_browser_.websocketbridge.md#protected-functions)
* [promises](_core_webui_websocketbridge_browser_.websocketbridge.md#protected-promises)
* [timeout](_core_webui_websocketbridge_browser_.websocketbridge.md#protected-timeout)
* [ws](_core_webui_websocketbridge_browser_.websocketbridge.md#ws)

### Methods

* [add](_core_webui_websocketbridge_browser_.websocketbridge.md#add)
* [handleRequest](_core_webui_websocketbridge_browser_.websocketbridge.md#handlerequest)
* [handleResponse](_core_webui_websocketbridge_browser_.websocketbridge.md#handleresponse)
* [invoke](_core_webui_websocketbridge_browser_.websocketbridge.md#invoke)
* [locals](_core_webui_websocketbridge_browser_.websocketbridge.md#locals)
* [remote](_core_webui_websocketbridge_browser_.websocketbridge.md#remote)
* [remove](_core_webui_websocketbridge_browser_.websocketbridge.md#remove)
* [request](_core_webui_websocketbridge_browser_.websocketbridge.md#request)
* [respond](_core_webui_websocketbridge_browser_.websocketbridge.md#respond)
* [setTimeout](_core_webui_websocketbridge_browser_.websocketbridge.md#settimeout)

## Constructors

###  constructor

\+ **new WebSocketBridge**(`ws`: WebSocket): *[WebSocketBridge](_core_webui_websocketbridge_browser_.websocketbridge.md)*

*Overrides [WebviewBridge](_core_webui_webviewbridge_.webviewbridge.md).[constructor](_core_webui_webviewbridge_.webviewbridge.md#constructor)*

Defined in src/core/webui/WebSocketBridge.browser.ts:6

**Parameters:**

Name | Type |
------ | ------ |
`ws` | WebSocket |

**Returns:** *[WebSocketBridge](_core_webui_websocketbridge_browser_.websocketbridge.md)*

## Properties

### `Protected` functions

• **functions**: *Map‹string, [IFunctionReference](../interfaces/_core_webui_webviewbridge_.ifunctionreference.md)›*

*Inherited from [WebviewBridge](_core_webui_webviewbridge_.webviewbridge.md).[functions](_core_webui_webviewbridge_.webviewbridge.md#protected-functions)*

Defined in src/core/webui/WebviewBridge.ts:27

___

### `Protected` promises

• **promises**: *Map‹string, [IPromiseInfo](../interfaces/_core_types_promiseinfo_.ipromiseinfo.md)‹any››*

*Inherited from [WebviewBridge](_core_webui_webviewbridge_.webviewbridge.md).[promises](_core_webui_webviewbridge_.webviewbridge.md#protected-promises)*

Defined in src/core/webui/WebviewBridge.ts:26

___

### `Protected` timeout

• **timeout**: *number* = 3600000

*Inherited from [WebviewBridge](_core_webui_webviewbridge_.webviewbridge.md).[timeout](_core_webui_webviewbridge_.webviewbridge.md#protected-timeout)*

Defined in src/core/webui/WebviewBridge.ts:29

___

###  ws

• **ws**: *WebSocket*

Defined in src/core/webui/WebSocketBridge.browser.ts:6

## Methods

###  add

▸ **add**(`method`: [IFunctionReference](../interfaces/_core_webui_webviewbridge_.ifunctionreference.md)): *void*

*Implementation of [IWebviewBridge](../interfaces/_core_webui_webviewbridge_.iwebviewbridge.md)*

*Inherited from [WebviewBridge](_core_webui_webviewbridge_.webviewbridge.md).[add](_core_webui_webviewbridge_.webviewbridge.md#add)*

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

*Inherited from [WebviewBridge](_core_webui_webviewbridge_.webviewbridge.md).[handleRequest](_core_webui_webviewbridge_.webviewbridge.md#handlerequest)*

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

*Inherited from [WebviewBridge](_core_webui_webviewbridge_.webviewbridge.md).[handleResponse](_core_webui_webviewbridge_.webviewbridge.md#handleresponse)*

Defined in src/core/webui/WebviewBridge.ts:69

**Parameters:**

Name | Type |
------ | ------ |
`message` | any |

**Returns:** *void*

___

###  invoke

▸ **invoke**(`method`: string, `params?`: any[]): *Promise‹any›*

*Inherited from [WebviewBridge](_core_webui_webviewbridge_.webviewbridge.md).[invoke](_core_webui_webviewbridge_.webviewbridge.md#invoke)*

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

*Inherited from [WebviewBridge](_core_webui_webviewbridge_.webviewbridge.md).[locals](_core_webui_webviewbridge_.webviewbridge.md#locals)*

Defined in src/core/webui/WebviewBridge.ts:49

**Returns:** *string[]*

___

###  remote

▸ **remote**(): *Promise‹string[]›*

*Implementation of [IWebviewBridge](../interfaces/_core_webui_webviewbridge_.iwebviewbridge.md)*

*Inherited from [WebviewBridge](_core_webui_webviewbridge_.webviewbridge.md).[remote](_core_webui_webviewbridge_.webviewbridge.md#remote)*

Defined in src/core/webui/WebviewBridge.ts:53

**Returns:** *Promise‹string[]›*

___

###  remove

▸ **remove**(`method`: [IFunctionReference](../interfaces/_core_webui_webviewbridge_.ifunctionreference.md)): *void*

*Implementation of [IWebviewBridge](../interfaces/_core_webui_webviewbridge_.iwebviewbridge.md)*

*Inherited from [WebviewBridge](_core_webui_webviewbridge_.webviewbridge.md).[remove](_core_webui_webviewbridge_.webviewbridge.md#remove)*

Defined in src/core/webui/WebviewBridge.ts:45

**Parameters:**

Name | Type |
------ | ------ |
`method` | [IFunctionReference](../interfaces/_core_webui_webviewbridge_.ifunctionreference.md) |

**Returns:** *void*

___

###  request

▸ **request**(`guid`: string, `method`: string, `params?`: any[]): *void*

*Implementation of [IWebviewBridge](../interfaces/_core_webui_webviewbridge_.iwebviewbridge.md)*

*Overrides [WebviewBridge](_core_webui_webviewbridge_.webviewbridge.md).[request](_core_webui_webviewbridge_.webviewbridge.md#abstract-request)*

Defined in src/core/webui/WebSocketBridge.browser.ts:24

**Parameters:**

Name | Type |
------ | ------ |
`guid` | string |
`method` | string |
`params?` | any[] |

**Returns:** *void*

___

###  respond

▸ **respond**(`guid`: string, `response`: any, `success`: boolean): *void*

*Implementation of [IWebviewBridge](../interfaces/_core_webui_webviewbridge_.iwebviewbridge.md)*

*Overrides [WebviewBridge](_core_webui_webviewbridge_.webviewbridge.md).[respond](_core_webui_webviewbridge_.webviewbridge.md#abstract-respond)*

Defined in src/core/webui/WebSocketBridge.browser.ts:45

**Parameters:**

Name | Type | Default |
------ | ------ | ------ |
`guid` | string | - |
`response` | any | - |
`success` | boolean | true |

**Returns:** *void*

___

###  setTimeout

▸ **setTimeout**(`timeout`: number): *void*

*Implementation of [IWebviewBridge](../interfaces/_core_webui_webviewbridge_.iwebviewbridge.md)*

*Inherited from [WebviewBridge](_core_webui_webviewbridge_.webviewbridge.md).[setTimeout](_core_webui_webviewbridge_.webviewbridge.md#settimeout)*

Defined in src/core/webui/WebviewBridge.ts:37

**Parameters:**

Name | Type |
------ | ------ |
`timeout` | number |

**Returns:** *void*
