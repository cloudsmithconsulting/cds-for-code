[cds-for-code](../README.md) › [Globals](../globals.md) › ["core/webui/WebviewBridge"](../modules/_core_webui_webviewbridge_.md) › [IWebviewBridge](_core_webui_webviewbridge_.iwebviewbridge.md)

# Interface: IWebviewBridge

## Hierarchy

* **IWebviewBridge**

## Implemented by

* [LocalBridge](../classes/_core_webui_localbridge_browser_.localbridge.md)
* [LocalBridge](../classes/_core_webui_localbridge_.localbridge.md)
* [WebSocketBridge](../classes/_core_webui_websocketbridge_.websocketbridge.md)
* [WebSocketBridge](../classes/_core_webui_websocketbridge_browser_.websocketbridge.md)
* [WebviewBridge](../classes/_core_webui_webviewbridge_.webviewbridge.md)

## Index

### Methods

* [add](_core_webui_webviewbridge_.iwebviewbridge.md#add)
* [handleRequest](_core_webui_webviewbridge_.iwebviewbridge.md#handlerequest)
* [handleResponse](_core_webui_webviewbridge_.iwebviewbridge.md#handleresponse)
* [invoke](_core_webui_webviewbridge_.iwebviewbridge.md#invoke)
* [locals](_core_webui_webviewbridge_.iwebviewbridge.md#locals)
* [remote](_core_webui_webviewbridge_.iwebviewbridge.md#remote)
* [remove](_core_webui_webviewbridge_.iwebviewbridge.md#remove)
* [request](_core_webui_webviewbridge_.iwebviewbridge.md#request)
* [respond](_core_webui_webviewbridge_.iwebviewbridge.md#respond)
* [setTimeout](_core_webui_webviewbridge_.iwebviewbridge.md#settimeout)

## Methods

###  add

▸ **add**(`method`: [IFunctionReference](_core_webui_webviewbridge_.ifunctionreference.md)): *void*

Defined in src/core/webui/WebviewBridge.ts:10

**Parameters:**

Name | Type |
------ | ------ |
`method` | [IFunctionReference](_core_webui_webviewbridge_.ifunctionreference.md) |

**Returns:** *void*

___

###  handleRequest

▸ **handleRequest**(`message`: any): *void*

Defined in src/core/webui/WebviewBridge.ts:9

**Parameters:**

Name | Type |
------ | ------ |
`message` | any |

**Returns:** *void*

___

###  handleResponse

▸ **handleResponse**(`message`: any): *void*

Defined in src/core/webui/WebviewBridge.ts:8

**Parameters:**

Name | Type |
------ | ------ |
`message` | any |

**Returns:** *void*

___

###  invoke

▸ **invoke**(`method`: string, `params?`: any): *Promise‹any›*

Defined in src/core/webui/WebviewBridge.ts:5

**Parameters:**

Name | Type |
------ | ------ |
`method` | string |
`params?` | any |

**Returns:** *Promise‹any›*

___

###  locals

▸ **locals**(): *string[]*

Defined in src/core/webui/WebviewBridge.ts:13

**Returns:** *string[]*

___

###  remote

▸ **remote**(): *Promise‹string[]›*

Defined in src/core/webui/WebviewBridge.ts:14

**Returns:** *Promise‹string[]›*

___

###  remove

▸ **remove**(`method`: [IFunctionReference](_core_webui_webviewbridge_.ifunctionreference.md)): *void*

Defined in src/core/webui/WebviewBridge.ts:11

**Parameters:**

Name | Type |
------ | ------ |
`method` | [IFunctionReference](_core_webui_webviewbridge_.ifunctionreference.md) |

**Returns:** *void*

___

###  request

▸ **request**(`guid`: string, `method`: string, `params?`: any[]): *void*

Defined in src/core/webui/WebviewBridge.ts:6

**Parameters:**

Name | Type |
------ | ------ |
`guid` | string |
`method` | string |
`params?` | any[] |

**Returns:** *void*

___

###  respond

▸ **respond**(`guid`: string, `response`: any, `success?`: boolean): *void*

Defined in src/core/webui/WebviewBridge.ts:7

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

Defined in src/core/webui/WebviewBridge.ts:12

**Parameters:**

Name | Type |
------ | ------ |
`timeout` | number |

**Returns:** *void*
