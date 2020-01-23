[cds-for-code](../README.md) › [Globals](../globals.md) › ["views/cs.cds.views.connectionEditor"](../modules/_views_cs_cds_views_connectioneditor_.md) › [CdsConnectionEditor](_views_cs_cds_views_connectioneditor_.cdsconnectioneditor.md)

# Class: CdsConnectionEditor

## Hierarchy

* [View](_core_webui_view_.view.md)

  ↳ **CdsConnectionEditor**

## Index

### Constructors

* [constructor](_views_cs_cds_views_connectioneditor_.cdsconnectioneditor.md#constructor)

### Properties

* [bridge](_views_cs_cds_views_connectioneditor_.cdsconnectioneditor.md#bridge)
* [disposables](_views_cs_cds_views_connectioneditor_.cdsconnectioneditor.md#protected-disposables)
* [onDidClose](_views_cs_cds_views_connectioneditor_.cdsconnectioneditor.md#ondidclose)
* [onDidReceiveMessage](_views_cs_cds_views_connectioneditor_.cdsconnectioneditor.md#ondidreceivemessage)
* [onReady](_views_cs_cds_views_connectioneditor_.cdsconnectioneditor.md#onready)
* [options](_views_cs_cds_views_connectioneditor_.cdsconnectioneditor.md#options)
* [renderer](_views_cs_cds_views_connectioneditor_.cdsconnectioneditor.md#protected-renderer)
* [openViews](_views_cs_cds_views_connectioneditor_.cdsconnectioneditor.md#static-openviews)

### Accessors

* [commands](_views_cs_cds_views_connectioneditor_.cdsconnectioneditor.md#commands)
* [cspSource](_views_cs_cds_views_connectioneditor_.cdsconnectioneditor.md#cspsource)

### Methods

* [asWebviewUri](_views_cs_cds_views_connectioneditor_.cdsconnectioneditor.md#aswebviewuri)
* [construct](_views_cs_cds_views_connectioneditor_.cdsconnectioneditor.md#construct)
* [dispose](_views_cs_cds_views_connectioneditor_.cdsconnectioneditor.md#dispose)
* [editPassword](_views_cs_cds_views_connectioneditor_.cdsconnectioneditor.md#private-editpassword)
* [parseConnectionString](_views_cs_cds_views_connectioneditor_.cdsconnectioneditor.md#private-parseconnectionstring)
* [postMessage](_views_cs_cds_views_connectioneditor_.cdsconnectioneditor.md#postmessage)
* [save](_views_cs_cds_views_connectioneditor_.cdsconnectioneditor.md#private-save)
* [setInitialState](_views_cs_cds_views_connectioneditor_.cdsconnectioneditor.md#setinitialstate)
* [show](_views_cs_cds_views_connectioneditor_.cdsconnectioneditor.md#static-show)

## Constructors

###  constructor

\+ **new CdsConnectionEditor**(`panel`: WebviewPanel, `options`: [IViewOptions](../interfaces/_core_webui_view_.iviewoptions.md)): *[CdsConnectionEditor](_views_cs_cds_views_connectioneditor_.cdsconnectioneditor.md)*

*Inherited from [View](_core_webui_view_.view.md).[constructor](_core_webui_view_.view.md#constructor)*

Defined in src/core/webui/View.ts:112

**Parameters:**

Name | Type |
------ | ------ |
`panel` | WebviewPanel |
`options` | [IViewOptions](../interfaces/_core_webui_view_.iviewoptions.md) |

**Returns:** *[CdsConnectionEditor](_views_cs_cds_views_connectioneditor_.cdsconnectioneditor.md)*

## Properties

###  bridge

• **bridge**: *[WebviewBridge](_core_webui_webviewbridge_.webviewbridge.md) | undefined*

*Inherited from [View](_core_webui_view_.view.md).[bridge](_core_webui_view_.view.md#bridge)*

Defined in src/core/webui/View.ts:95

___

### `Protected` disposables

• **disposables**: *Disposable[]* = []

*Inherited from [View](_core_webui_view_.view.md).[disposables](_core_webui_view_.view.md#protected-disposables)*

Defined in src/core/webui/View.ts:98

___

###  onDidClose

• **onDidClose**: *Event‹[View](_core_webui_view_.view.md)›* = this._onDidClose.event

*Inherited from [View](_core_webui_view_.view.md).[onDidClose](_core_webui_view_.view.md#ondidclose)*

Defined in src/core/webui/View.ts:110

___

###  onDidReceiveMessage

• **onDidReceiveMessage**: *Event‹any›* = this._onDidReceiveMessage.event

*Inherited from [View](_core_webui_view_.view.md).[onDidReceiveMessage](_core_webui_view_.view.md#ondidreceivemessage)*

Defined in src/core/webui/View.ts:111

___

###  onReady

• **onReady**: *Event‹[View](_core_webui_view_.view.md)›* = this._onReady.event

*Inherited from [View](_core_webui_view_.view.md).[onReady](_core_webui_view_.view.md#onready)*

Defined in src/core/webui/View.ts:112

___

###  options

• **options**: *[IViewOptions](../interfaces/_core_webui_view_.iviewoptions.md)*

*Inherited from [View](_core_webui_view_.view.md).[options](_core_webui_view_.view.md#options)*

Defined in src/core/webui/View.ts:96

___

### `Protected` renderer

• **renderer**: *[ViewRenderer](_core_webui_viewrenderer_.viewrenderer.md)*

*Inherited from [View](_core_webui_view_.view.md).[renderer](_core_webui_view_.view.md#protected-renderer)*

Defined in src/core/webui/View.ts:99

___

### `Static` openViews

▪ **openViews**: *object*

*Inherited from [View](_core_webui_view_.view.md).[openViews](_core_webui_view_.view.md#static-openviews)*

Defined in src/core/webui/View.ts:36

Track the currently panel. Only allow a single panel to exist at a time.

#### Type declaration:

* \[ **key**: *string*\]: [View](_core_webui_view_.view.md)

## Accessors

###  commands

• **get commands**(): *[Dictionary](_core_types_dictionary_.dictionary.md)‹string, Function›*

*Overrides [View](_core_webui_view_.view.md).[commands](_core_webui_view_.view.md#commands)*

Defined in src/views/cs.cds.views.connectionEditor.ts:43

**Returns:** *[Dictionary](_core_types_dictionary_.dictionary.md)‹string, Function›*

___

###  cspSource

• **get cspSource**(): *string*

*Inherited from [View](_core_webui_view_.view.md).[cspSource](_core_webui_view_.view.md#cspsource)*

Defined in src/core/webui/View.ts:161

**Returns:** *string*

## Methods

###  asWebviewUri

▸ **asWebviewUri**(`localResource`: Uri): *Uri*

*Inherited from [View](_core_webui_view_.view.md).[asWebviewUri](_core_webui_view_.view.md#aswebviewuri)*

Defined in src/core/webui/View.ts:157

**Parameters:**

Name | Type |
------ | ------ |
`localResource` | Uri |

**Returns:** *Uri*

___

###  construct

▸ **construct**(`viewRenderer`: [ViewRenderer](_core_webui_viewrenderer_.viewrenderer.md)): *string*

*Overrides [View](_core_webui_view_.view.md).[construct](_core_webui_view_.view.md#abstract-construct)*

Defined in src/views/cs.cds.views.connectionEditor.ts:28

**Parameters:**

Name | Type |
------ | ------ |
`viewRenderer` | [ViewRenderer](_core_webui_viewrenderer_.viewrenderer.md) |

**Returns:** *string*

___

###  dispose

▸ **dispose**(): *void*

*Inherited from [View](_core_webui_view_.view.md).[dispose](_core_webui_view_.view.md#dispose)*

Defined in src/core/webui/View.ts:165

**Returns:** *void*

___

### `Private` editPassword

▸ **editPassword**(`config`: [Config](../interfaces/_api_cds_webapi_cdswebapi_.cdswebapi.config.md)): *Promise‹void›*

Defined in src/views/cs.cds.views.connectionEditor.ts:52

**Parameters:**

Name | Type |
------ | ------ |
`config` | [Config](../interfaces/_api_cds_webapi_cdswebapi_.cdswebapi.config.md) |

**Returns:** *Promise‹void›*

___

### `Private` parseConnectionString

▸ **parseConnectionString**(`connectionString`: string): *void*

Defined in src/views/cs.cds.views.connectionEditor.ts:65

**Parameters:**

Name | Type |
------ | ------ |
`connectionString` | string |

**Returns:** *void*

___

###  postMessage

▸ **postMessage**(`message`: any): *Thenable‹boolean›*

*Inherited from [View](_core_webui_view_.view.md).[postMessage](_core_webui_view_.view.md#postmessage)*

Defined in src/core/webui/View.ts:182

**Parameters:**

Name | Type |
------ | ------ |
`message` | any |

**Returns:** *Thenable‹boolean›*

___

### `Private` save

▸ **save**(`config`: [Config](../interfaces/_api_cds_webapi_cdswebapi_.cdswebapi.config.md), `discoverOnly`: boolean): *Promise‹void›*

Defined in src/views/cs.cds.views.connectionEditor.ts:76

**Parameters:**

Name | Type | Default |
------ | ------ | ------ |
`config` | [Config](../interfaces/_api_cds_webapi_cdswebapi_.cdswebapi.config.md) | - |
`discoverOnly` | boolean | false |

**Returns:** *Promise‹void›*

___

###  setInitialState

▸ **setInitialState**(`config?`: [Config](../interfaces/_api_cds_webapi_cdswebapi_.cdswebapi.config.md)): *void*

Defined in src/views/cs.cds.views.connectionEditor.ts:153

**Parameters:**

Name | Type |
------ | ------ |
`config?` | [Config](../interfaces/_api_cds_webapi_cdswebapi_.cdswebapi.config.md) |

**Returns:** *void*

___

### `Static` show

▸ **show**<**T**>(`constructor`: [ViewConstructor](../modules/_core_webui_view_.md#viewconstructor)‹T›, `options`: [IViewOptions](../interfaces/_core_webui_view_.iviewoptions.md)): *T*

*Inherited from [View](_core_webui_view_.view.md).[show](_core_webui_view_.view.md#static-show)*

Defined in src/core/webui/View.ts:38

**Type parameters:**

▪ **T**: *[View](_core_webui_view_.view.md)*

**Parameters:**

Name | Type |
------ | ------ |
`constructor` | [ViewConstructor](../modules/_core_webui_view_.md#viewconstructor)‹T› |
`options` | [IViewOptions](../interfaces/_core_webui_view_.iviewoptions.md) |

**Returns:** *T*
