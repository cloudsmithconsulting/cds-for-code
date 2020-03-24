---
id: "_views_cs_cds_views_newworkspaceview_.newworkspaceview"
title: "NewWorkspaceView"
sidebar_label: "NewWorkspaceView"
---

[cds-for-code](../index.md) › [Globals](../globals.md) › ["views/cs.cds.views.newWorkspaceView"](../modules/_views_cs_cds_views_newworkspaceview_.md) › [NewWorkspaceView](_views_cs_cds_views_newworkspaceview_.newworkspaceview.md)

## Hierarchy

* [View](_core_webui_view_.view.md)

  ↳ **NewWorkspaceView**

## Index

### Constructors

* [constructor](_views_cs_cds_views_newworkspaceview_.newworkspaceview.md#constructor)

### Properties

* [disposables](_views_cs_cds_views_newworkspaceview_.newworkspaceview.md#protected-disposables)
* [onDidClose](_views_cs_cds_views_newworkspaceview_.newworkspaceview.md#ondidclose)
* [onDidReceiveMessage](_views_cs_cds_views_newworkspaceview_.newworkspaceview.md#ondidreceivemessage)
* [onReady](_views_cs_cds_views_newworkspaceview_.newworkspaceview.md#onready)
* [options](_views_cs_cds_views_newworkspaceview_.newworkspaceview.md#options)
* [renderer](_views_cs_cds_views_newworkspaceview_.newworkspaceview.md#protected-renderer)
* [openViews](_views_cs_cds_views_newworkspaceview_.newworkspaceview.md#static-openviews)

### Accessors

* [commands](_views_cs_cds_views_newworkspaceview_.newworkspaceview.md#commands)
* [cspSource](_views_cs_cds_views_newworkspaceview_.newworkspaceview.md#cspsource)

### Methods

* [asWebviewUri](_views_cs_cds_views_newworkspaceview_.newworkspaceview.md#aswebviewuri)
* [construct](_views_cs_cds_views_newworkspaceview_.newworkspaceview.md#construct)
* [dispose](_views_cs_cds_views_newworkspaceview_.newworkspaceview.md#dispose)
* [postMessage](_views_cs_cds_views_newworkspaceview_.newworkspaceview.md#postmessage)
* [setInitialState](_views_cs_cds_views_newworkspaceview_.newworkspaceview.md#setinitialstate)
* [show](_views_cs_cds_views_newworkspaceview_.newworkspaceview.md#static-show)

## Constructors

###  constructor

\+ **new NewWorkspaceView**(`panel`: WebviewPanel, `options`: [IViewOptions](../interfaces/_core_webui_view_.iviewoptions.md)): *[NewWorkspaceView](_views_cs_cds_views_newworkspaceview_.newworkspaceview.md)*

*Inherited from [View](_core_webui_view_.view.md).[constructor](_core_webui_view_.view.md#constructor)*

Defined in src/core/webui/View.ts:105

**Parameters:**

Name | Type |
------ | ------ |
`panel` | WebviewPanel |
`options` | [IViewOptions](../interfaces/_core_webui_view_.iviewoptions.md) |

**Returns:** *[NewWorkspaceView](_views_cs_cds_views_newworkspaceview_.newworkspaceview.md)*

## Properties

### `Protected` disposables

• **disposables**: *Disposable[]* = []

*Inherited from [View](_core_webui_view_.view.md).[disposables](_core_webui_view_.view.md#protected-disposables)*

Defined in src/core/webui/View.ts:91

___

###  onDidClose

• **onDidClose**: *Event‹[View](_core_webui_view_.view.md)›* = this._onDidClose.event

*Inherited from [View](_core_webui_view_.view.md).[onDidClose](_core_webui_view_.view.md#ondidclose)*

Defined in src/core/webui/View.ts:103

___

###  onDidReceiveMessage

• **onDidReceiveMessage**: *Event‹any›* = this._onDidReceiveMessage.event

*Inherited from [View](_core_webui_view_.view.md).[onDidReceiveMessage](_core_webui_view_.view.md#ondidreceivemessage)*

Defined in src/core/webui/View.ts:104

___

###  onReady

• **onReady**: *Event‹[View](_core_webui_view_.view.md)›* = this._onReady.event

*Inherited from [View](_core_webui_view_.view.md).[onReady](_core_webui_view_.view.md#onready)*

Defined in src/core/webui/View.ts:105

___

###  options

• **options**: *[IViewOptions](../interfaces/_core_webui_view_.iviewoptions.md)*

*Inherited from [View](_core_webui_view_.view.md).[options](_core_webui_view_.view.md#options)*

Defined in src/core/webui/View.ts:89

___

### `Protected` renderer

• **renderer**: *[ViewRenderer](_core_webui_viewrenderer_.viewrenderer.md)*

*Inherited from [View](_core_webui_view_.view.md).[renderer](_core_webui_view_.view.md#protected-renderer)*

Defined in src/core/webui/View.ts:92

___

### `Static` openViews

▪ **openViews**: *object*

*Inherited from [View](_core_webui_view_.view.md).[openViews](_core_webui_view_.view.md#static-openviews)*

Defined in src/core/webui/View.ts:30

Track the currently panel. Only allow a single panel to exist at a time.

#### Type declaration:

* \[ **key**: *string*\]: [View](_core_webui_view_.view.md)

## Accessors

###  commands

• **get commands**(): *[Dictionary](_core_types_dictionary_.dictionary.md)‹string, Function›*

*Overrides [View](_core_webui_view_.view.md).[commands](_core_webui_view_.view.md#commands)*

Defined in src/views/cs.cds.views.newWorkspaceView.ts:53

**Returns:** *[Dictionary](_core_types_dictionary_.dictionary.md)‹string, Function›*

___

###  cspSource

• **get cspSource**(): *string*

*Inherited from [View](_core_webui_view_.view.md).[cspSource](_core_webui_view_.view.md#cspsource)*

Defined in src/core/webui/View.ts:148

**Returns:** *string*

## Methods

###  asWebviewUri

▸ **asWebviewUri**(`localResource`: Uri): *Uri*

*Inherited from [View](_core_webui_view_.view.md).[asWebviewUri](_core_webui_view_.view.md#aswebviewuri)*

Defined in src/core/webui/View.ts:144

**Parameters:**

Name | Type |
------ | ------ |
`localResource` | Uri |

**Returns:** *Uri*

___

###  construct

▸ **construct**(`viewRenderer`: [ViewRenderer](_core_webui_viewrenderer_.viewrenderer.md)): *string*

*Overrides [View](_core_webui_view_.view.md).[construct](_core_webui_view_.view.md#abstract-construct)*

Defined in src/views/cs.cds.views.newWorkspaceView.ts:38

**Parameters:**

Name | Type |
------ | ------ |
`viewRenderer` | [ViewRenderer](_core_webui_viewrenderer_.viewrenderer.md) |

**Returns:** *string*

___

###  dispose

▸ **dispose**(): *void*

*Inherited from [View](_core_webui_view_.view.md).[dispose](_core_webui_view_.view.md#dispose)*

Defined in src/core/webui/View.ts:152

**Returns:** *void*

___

###  postMessage

▸ **postMessage**(`message`: any): *Thenable‹boolean›*

*Inherited from [View](_core_webui_view_.view.md).[postMessage](_core_webui_view_.view.md#postmessage)*

Defined in src/core/webui/View.ts:169

**Parameters:**

Name | Type |
------ | ------ |
`message` | any |

**Returns:** *Thenable‹boolean›*

___

###  setInitialState

▸ **setInitialState**(): *void*

Defined in src/views/cs.cds.views.newWorkspaceView.ts:60

**Returns:** *void*

___

### `Static` show

▸ **show**<**T**>(`constructor`: [ViewConstructor](../modules/_core_webui_view_.md#viewconstructor)‹T›, `options`: [IViewOptions](../interfaces/_core_webui_view_.iviewoptions.md)): *T*

*Inherited from [View](_core_webui_view_.view.md).[show](_core_webui_view_.view.md#static-show)*

Defined in src/core/webui/View.ts:32

**Type parameters:**

▪ **T**: *[View](_core_webui_view_.view.md)*

**Parameters:**

Name | Type |
------ | ------ |
`constructor` | [ViewConstructor](../modules/_core_webui_view_.md#viewconstructor)‹T› |
`options` | [IViewOptions](../interfaces/_core_webui_view_.iviewoptions.md) |

**Returns:** *T*
