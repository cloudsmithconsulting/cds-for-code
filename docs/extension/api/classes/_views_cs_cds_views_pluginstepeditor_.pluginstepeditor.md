---
id: "_views_cs_cds_views_pluginstepeditor_.pluginstepeditor"
title: "PluginStepEditor"
sidebar_label: "PluginStepEditor"
---

[cds-for-code](../index.md) › [Globals](../globals.md) › ["views/cs.cds.views.pluginStepEditor"](../modules/_views_cs_cds_views_pluginstepeditor_.md) › [PluginStepEditor](_views_cs_cds_views_pluginstepeditor_.pluginstepeditor.md)

## Hierarchy

* [View](_core_webui_view_.view.md)

  ↳ **PluginStepEditor**

## Index

### Constructors

* [constructor](_views_cs_cds_views_pluginstepeditor_.pluginstepeditor.md#constructor)

### Properties

* [config](_views_cs_cds_views_pluginstepeditor_.pluginstepeditor.md#private-config)
* [disposables](_views_cs_cds_views_pluginstepeditor_.pluginstepeditor.md#protected-disposables)
* [onDidClose](_views_cs_cds_views_pluginstepeditor_.pluginstepeditor.md#ondidclose)
* [onDidReceiveMessage](_views_cs_cds_views_pluginstepeditor_.pluginstepeditor.md#ondidreceivemessage)
* [onReady](_views_cs_cds_views_pluginstepeditor_.pluginstepeditor.md#onready)
* [options](_views_cs_cds_views_pluginstepeditor_.pluginstepeditor.md#options)
* [renderer](_views_cs_cds_views_pluginstepeditor_.pluginstepeditor.md#protected-renderer)
* [openViews](_views_cs_cds_views_pluginstepeditor_.pluginstepeditor.md#static-openviews)

### Accessors

* [commands](_views_cs_cds_views_pluginstepeditor_.pluginstepeditor.md#commands)
* [cspSource](_views_cs_cds_views_pluginstepeditor_.pluginstepeditor.md#cspsource)

### Methods

* [asWebviewUri](_views_cs_cds_views_pluginstepeditor_.pluginstepeditor.md#aswebviewuri)
* [construct](_views_cs_cds_views_pluginstepeditor_.pluginstepeditor.md#construct)
* [dispose](_views_cs_cds_views_pluginstepeditor_.pluginstepeditor.md#dispose)
* [postMessage](_views_cs_cds_views_pluginstepeditor_.pluginstepeditor.md#postmessage)
* [retrieveAttributes](_views_cs_cds_views_pluginstepeditor_.pluginstepeditor.md#private-retrieveattributes)
* [save](_views_cs_cds_views_pluginstepeditor_.pluginstepeditor.md#private-save)
* [setInitialState](_views_cs_cds_views_pluginstepeditor_.pluginstepeditor.md#setinitialstate)
* [show](_views_cs_cds_views_pluginstepeditor_.pluginstepeditor.md#static-show)

## Constructors

###  constructor

\+ **new PluginStepEditor**(`panel`: WebviewPanel, `options`: [IViewOptions](../interfaces/_core_webui_view_.iviewoptions.md)): *[PluginStepEditor](_views_cs_cds_views_pluginstepeditor_.pluginstepeditor.md)*

*Inherited from [View](_core_webui_view_.view.md).[constructor](_core_webui_view_.view.md#constructor)*

Defined in src/core/webui/View.ts:105

**Parameters:**

Name | Type |
------ | ------ |
`panel` | WebviewPanel |
`options` | [IViewOptions](../interfaces/_core_webui_view_.iviewoptions.md) |

**Returns:** *[PluginStepEditor](_views_cs_cds_views_pluginstepeditor_.pluginstepeditor.md)*

## Properties

### `Private` config

• **config**: *[Config](../interfaces/_api_cds_webapi_cdswebapi_.cdswebapi.config.md)*

Defined in src/views/cs.cds.views.pluginStepEditor.ts:25

___

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

Defined in src/views/cs.cds.views.pluginStepEditor.ts:42

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

Defined in src/views/cs.cds.views.pluginStepEditor.ts:27

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

### `Private` retrieveAttributes

▸ **retrieveAttributes**(`logicalName`: string): *Promise‹void›*

Defined in src/views/cs.cds.views.pluginStepEditor.ts:49

**Parameters:**

Name | Type |
------ | ------ |
`logicalName` | string |

**Returns:** *Promise‹void›*

___

### `Private` save

▸ **save**(`step`: any): *void*

Defined in src/views/cs.cds.views.pluginStepEditor.ts:57

**Parameters:**

Name | Type |
------ | ------ |
`step` | any |

**Returns:** *void*

___

###  setInitialState

▸ **setInitialState**(`pluginAssemblyId`: string, `config?`: [Config](../interfaces/_api_cds_webapi_cdswebapi_.cdswebapi.config.md), `step?`: any): *Promise‹void›*

Defined in src/views/cs.cds.views.pluginStepEditor.ts:70

**Parameters:**

Name | Type |
------ | ------ |
`pluginAssemblyId` | string |
`config?` | [Config](../interfaces/_api_cds_webapi_cdswebapi_.cdswebapi.config.md) |
`step?` | any |

**Returns:** *Promise‹void›*

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
