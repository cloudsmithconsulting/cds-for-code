---
id: "_core_webui_view_.view"
title: "View"
sidebar_label: "View"
---

[cds-for-code](../index.md) › [Globals](../globals.md) › ["core/webui/View"](../modules/_core_webui_view_.md) › [View](_core_webui_view_.view.md)

## Hierarchy

* **View**

  ↳ [CdsConnectionEditor](_views_cs_cds_views_connectioneditor_.cdsconnectioneditor.md)

  ↳ [PluginStepEditor](_views_cs_cds_views_pluginstepeditor_.pluginstepeditor.md)

  ↳ [PluginStepImageEditor](_views_cs_cds_views_pluginstepimageeditor_.pluginstepimageeditor.md)

  ↳ [JsonObjectView](_views_cs_cds_views_jsoninspectorview_.jsonobjectview.md)

  ↳ [NewWorkspaceView](_views_cs_cds_views_newworkspaceview_.newworkspaceview.md)

  ↳ [SvcUtilConfigView](_views_cs_cds_views_svcutilconfigview_.svcutilconfigview.md)

## Index

### Constructors

* [constructor](_core_webui_view_.view.md#constructor)

### Properties

* [_onDidClose](_core_webui_view_.view.md#private-_ondidclose)
* [_onDidReceiveMessage](_core_webui_view_.view.md#private-_ondidreceivemessage)
* [_onReady](_core_webui_view_.view.md#private-_onready)
* [disposables](_core_webui_view_.view.md#protected-disposables)
* [onDidClose](_core_webui_view_.view.md#ondidclose)
* [onDidReceiveMessage](_core_webui_view_.view.md#ondidreceivemessage)
* [onReady](_core_webui_view_.view.md#onready)
* [options](_core_webui_view_.view.md#options)
* [panel](_core_webui_view_.view.md#private-panel)
* [renderer](_core_webui_view_.view.md#protected-renderer)
* [openViews](_core_webui_view_.view.md#static-openviews)

### Accessors

* [commands](_core_webui_view_.view.md#commands)
* [cspSource](_core_webui_view_.view.md#cspsource)

### Methods

* [asWebviewUri](_core_webui_view_.view.md#aswebviewuri)
* [construct](_core_webui_view_.view.md#abstract-construct)
* [dispose](_core_webui_view_.view.md#dispose)
* [postMessage](_core_webui_view_.view.md#postmessage)
* [processSystemMessages](_core_webui_view_.view.md#private-processsystemmessages)
* [update](_core_webui_view_.view.md#private-update)
* [show](_core_webui_view_.view.md#static-show)

## Constructors

###  constructor

\+ **new View**(`panel`: WebviewPanel, `options`: [IViewOptions](../interfaces/_core_webui_view_.iviewoptions.md)): *[View](_core_webui_view_.view.md)*

Defined in src/core/webui/View.ts:105

**Parameters:**

Name | Type |
------ | ------ |
`panel` | WebviewPanel |
`options` | [IViewOptions](../interfaces/_core_webui_view_.iviewoptions.md) |

**Returns:** *[View](_core_webui_view_.view.md)*

## Properties

### `Private` _onDidClose

• **_onDidClose**: *EventEmitter‹[View](_core_webui_view_.view.md)›* = new vscode.EventEmitter()

Defined in src/core/webui/View.ts:99

___

### `Private` _onDidReceiveMessage

• **_onDidReceiveMessage**: *EventEmitter‹any›* = new vscode.EventEmitter()

Defined in src/core/webui/View.ts:100

___

### `Private` _onReady

• **_onReady**: *EventEmitter‹[View](_core_webui_view_.view.md)›* = new vscode.EventEmitter()

Defined in src/core/webui/View.ts:101

___

### `Protected` disposables

• **disposables**: *Disposable[]* = []

Defined in src/core/webui/View.ts:91

___

###  onDidClose

• **onDidClose**: *Event‹[View](_core_webui_view_.view.md)›* = this._onDidClose.event

Defined in src/core/webui/View.ts:103

___

###  onDidReceiveMessage

• **onDidReceiveMessage**: *Event‹any›* = this._onDidReceiveMessage.event

Defined in src/core/webui/View.ts:104

___

###  onReady

• **onReady**: *Event‹[View](_core_webui_view_.view.md)›* = this._onReady.event

Defined in src/core/webui/View.ts:105

___

###  options

• **options**: *[IViewOptions](../interfaces/_core_webui_view_.iviewoptions.md)*

Defined in src/core/webui/View.ts:89

___

### `Private` panel

• **panel**: *WebviewPanel*

Defined in src/core/webui/View.ts:97

___

### `Protected` renderer

• **renderer**: *[ViewRenderer](_core_webui_viewrenderer_.viewrenderer.md)*

Defined in src/core/webui/View.ts:92

___

### `Static` openViews

▪ **openViews**: *object*

Defined in src/core/webui/View.ts:30

Track the currently panel. Only allow a single panel to exist at a time.

#### Type declaration:

* \[ **key**: *string*\]: [View](_core_webui_view_.view.md)

## Accessors

###  commands

• **get commands**(): *[Dictionary](_core_types_dictionary_.dictionary.md)‹string, Function›*

Defined in src/core/webui/View.ts:95

**Returns:** *[Dictionary](_core_types_dictionary_.dictionary.md)‹string, Function›*

___

###  cspSource

• **get cspSource**(): *string*

Defined in src/core/webui/View.ts:148

**Returns:** *string*

## Methods

###  asWebviewUri

▸ **asWebviewUri**(`localResource`: Uri): *Uri*

Defined in src/core/webui/View.ts:144

**Parameters:**

Name | Type |
------ | ------ |
`localResource` | Uri |

**Returns:** *Uri*

___

### `Abstract` construct

▸ **construct**(`renderer`: [ViewRenderer](_core_webui_viewrenderer_.viewrenderer.md)): *string*

Defined in src/core/webui/View.ts:94

**Parameters:**

Name | Type |
------ | ------ |
`renderer` | [ViewRenderer](_core_webui_viewrenderer_.viewrenderer.md) |

**Returns:** *string*

___

###  dispose

▸ **dispose**(): *void*

Defined in src/core/webui/View.ts:152

**Returns:** *void*

___

###  postMessage

▸ **postMessage**(`message`: any): *Thenable‹boolean›*

Defined in src/core/webui/View.ts:169

**Parameters:**

Name | Type |
------ | ------ |
`message` | any |

**Returns:** *Thenable‹boolean›*

___

### `Private` processSystemMessages

▸ **processSystemMessages**(`message`: any): *boolean*

Defined in src/core/webui/View.ts:173

**Parameters:**

Name | Type |
------ | ------ |
`message` | any |

**Returns:** *boolean*

___

### `Private` update

▸ **update**(): *void*

Defined in src/core/webui/View.ts:198

**Returns:** *void*

___

### `Static` show

▸ **show**<**T**>(`constructor`: [ViewConstructor](../modules/_core_webui_view_.md#viewconstructor)‹T›, `options`: [IViewOptions](../interfaces/_core_webui_view_.iviewoptions.md)): *T*

Defined in src/core/webui/View.ts:32

**Type parameters:**

▪ **T**: *[View](_core_webui_view_.view.md)*

**Parameters:**

Name | Type |
------ | ------ |
`constructor` | [ViewConstructor](../modules/_core_webui_view_.md#viewconstructor)‹T› |
`options` | [IViewOptions](../interfaces/_core_webui_view_.iviewoptions.md) |

**Returns:** *T*
