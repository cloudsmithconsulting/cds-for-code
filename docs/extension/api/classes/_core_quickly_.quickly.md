---
id: "_core_quickly_.quickly"
title: "Quickly"
sidebar_label: "Quickly"
---

[cds-for-code](../index.md) › [Globals](../globals.md) › ["core/Quickly"](../modules/_core_quickly_.md) › [Quickly](_core_quickly_.quickly.md)

## Hierarchy

* **Quickly**

## Index

### Methods

* [ask](_core_quickly_.quickly.md#static-ask)
* [askToRetry](_core_quickly_.quickly.md#static-asktoretry)
* [error](_core_quickly_.quickly.md#static-error)
* [inform](_core_quickly_.quickly.md#static-inform)
* [openContent](_core_quickly_.quickly.md#static-opencontent)
* [openFile](_core_quickly_.quickly.md#static-openfile)
* [password](_core_quickly_.quickly.md#static-password)
* [pick](_core_quickly_.quickly.md#static-pick)
* [pickAny](_core_quickly_.quickly.md#static-pickany)
* [pickAnyFile](_core_quickly_.quickly.md#static-pickanyfile)
* [pickAnyFolder](_core_quickly_.quickly.md#static-pickanyfolder)
* [pickAnyOrNew](_core_quickly_.quickly.md#static-pickanyornew)
* [pickBoolean](_core_quickly_.quickly.md#static-pickboolean)
* [pickCdsOrganization](_core_quickly_.quickly.md#static-pickcdsorganization)
* [pickCdsSolution](_core_quickly_.quickly.md#static-pickcdssolution)
* [pickCdsSolutionComponent](_core_quickly_.quickly.md#static-pickcdssolutioncomponent)
* [pickCdsSolutionComponentType](_core_quickly_.quickly.md#static-pickcdssolutioncomponenttype)
* [pickDictionaryEntry](_core_quickly_.quickly.md#static-pickdictionaryentry)
* [pickEnum](_core_quickly_.quickly.md#static-pickenum)
* [pickOrNew](_core_quickly_.quickly.md#static-pickornew)
* [pickTemplate](_core_quickly_.quickly.md#static-picktemplate)
* [pickWorkspaceAny](_core_quickly_.quickly.md#static-pickworkspaceany)
* [pickWorkspaceFile](_core_quickly_.quickly.md#static-pickworkspacefile)
* [pickWorkspaceFolder](_core_quickly_.quickly.md#static-pickworkspacefolder)
* [pickWorkspaceFsItem](_core_quickly_.quickly.md#static-private-pickworkspacefsitem)
* [pickWorkspaceRoot](_core_quickly_.quickly.md#static-pickworkspaceroot)
* [warn](_core_quickly_.quickly.md#static-warn)

## Methods

### `Static` ask

▸ **ask**(`prompt`: string, `placeHolder?`: string, `value?`: string, `ignoreFocusOut`: boolean): *Promise‹string›*

Defined in src/core/Quickly.ts:25

shows an input box with a question and returns a response

**Parameters:**

Name | Type | Default | Description |
------ | ------ | ------ | ------ |
`prompt` | string | - | prompt to display when asking |
`placeHolder?` | string | - | text to display when nothing was chosen |
`value?` | string | - | pre-selected value, if any |
`ignoreFocusOut` | boolean | true | boolean indicating if the input box should be closed if it loses focus  |

**Returns:** *Promise‹string›*

___

### `Static` askToRetry

▸ **askToRetry**(`errorMessage`: string, `retryFunction`: Function, `tryAgainMessage`: string, `closeMessage`: string, ...`parameters`: any): *Promise‹any›*

Defined in src/core/Quickly.ts:548

**Parameters:**

Name | Type | Default |
------ | ------ | ------ |
`errorMessage` | string | - |
`retryFunction` | Function | - |
`tryAgainMessage` | string | "Try Again" |
`closeMessage` | string | "Close" |
`...parameters` | any | - |

**Returns:** *Promise‹any›*

___

### `Static` error

▸ **error**(`message`: string, `modal`: boolean, `primaryOption?`: string, `primaryAction?`: function, `secondaryOption?`: string, `secondaryAction?`: function): *Promise‹void›*

Defined in src/core/Quickly.ts:107

Quickly shows you error information.

**`static`** 

**`memberof`** QuickPicker

**Parameters:**

▪ **message**: *string*

The message to inform

▪`Default value`  **modal**: *boolean*= false

▪`Optional`  **primaryOption**: *string*

▪`Optional`  **primaryAction**: *function*

▸ (): *void*

▪`Optional`  **secondaryOption**: *string*

▪`Optional`  **secondaryAction**: *function*

▸ (): *void*

**Returns:** *Promise‹void›*

empty promise

___

### `Static` inform

▸ **inform**(`message`: string, `modal`: boolean, `primaryOption?`: string, `primaryAction?`: function, `secondaryOption?`: string, `secondaryAction?`: function): *Promise‹void›*

Defined in src/core/Quickly.ts:57

Quickly informs you of information and optionally gives you primary/secondary actions.

**`static`** 

**`memberof`** QuickPicker

**Parameters:**

▪ **message**: *string*

The message to inform

▪`Default value`  **modal**: *boolean*= false

▪`Optional`  **primaryOption**: *string*

▪`Optional`  **primaryAction**: *function*

▸ (): *void*

▪`Optional`  **secondaryOption**: *string*

▪`Optional`  **secondaryAction**: *function*

▸ (): *void*

**Returns:** *Promise‹void›*

empty promise

___

### `Static` openContent

▸ **openContent**(`content`: string | Buffer, `language`: string): *Promise‹void›*

Defined in src/core/Quickly.ts:540

**Parameters:**

Name | Type |
------ | ------ |
`content` | string &#124; Buffer |
`language` | string |

**Returns:** *Promise‹void›*

___

### `Static` openFile

▸ **openFile**(`filename`: string): *Promise‹void›*

Defined in src/core/Quickly.ts:534

**Parameters:**

Name | Type |
------ | ------ |
`filename` | string |

**Returns:** *Promise‹void›*

___

### `Static` password

▸ **password**(`prompt`: string, `placeHolder?`: string, `value?`: string, `ignoreFocusOut`: boolean): *Promise‹string›*

Defined in src/core/Quickly.ts:38

shows an input box with a question and returns a response masked as a password

**Parameters:**

Name | Type | Default | Description |
------ | ------ | ------ | ------ |
`prompt` | string | - | prompt to display when asking |
`placeHolder?` | string | - | text to display when nothing was chosen |
`value?` | string | - | pre-selected value, if any |
`ignoreFocusOut` | boolean | true | boolean indicating if the input box should be closed if it loses focus  |

**Returns:** *Promise‹string›*

___

### `Static` pick

▸ **pick**(`placeHolder`: string, ...`options`: [QuickPickOption](_core_quickly_.quickpickoption.md)[] | string[]): *Promise‹[QuickPickOption](_core_quickly_.quickpickoption.md)›*

Defined in src/core/Quickly.ts:124

shows a QuickPick-Panel in the VS Code Window

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`placeHolder` | string | text to display when nothing was chosen |
`...options` | [QuickPickOption](_core_quickly_.quickpickoption.md)[] &#124; string[] | options to choose from  |

**Returns:** *Promise‹[QuickPickOption](_core_quickly_.quickpickoption.md)›*

___

### `Static` pickAny

▸ **pickAny**(`placeHolder`: string, ...`options`: [QuickPickOption](_core_quickly_.quickpickoption.md)[] | string[]): *Promise‹[QuickPickOption](_core_quickly_.quickpickoption.md)[]›*

Defined in src/core/Quickly.ts:175

shows a QuickPick-Panel in the VS Code Window

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`placeHolder` | string | text to display when nothing was chosen |
`...options` | [QuickPickOption](_core_quickly_.quickpickoption.md)[] &#124; string[] | options to choose from  |

**Returns:** *Promise‹[QuickPickOption](_core_quickly_.quickpickoption.md)[]›*

___

### `Static` pickAnyFile

▸ **pickAnyFile**(`defaultUri?`: Uri, `canSelectMany`: boolean, `openLabel?`: string, `filters?`: object): *Promise‹Uri | Uri[]›*

Defined in src/core/Quickly.ts:436

**Parameters:**

Name | Type | Default |
------ | ------ | ------ |
`defaultUri?` | Uri | - |
`canSelectMany` | boolean | false |
`openLabel?` | string | - |
`filters?` | object | - |

**Returns:** *Promise‹Uri | Uri[]›*

___

### `Static` pickAnyFolder

▸ **pickAnyFolder**(`defaultUri?`: Uri, `canSelectMany`: boolean, `openLabel?`: string, `filters?`: object): *Promise‹Uri | Uri[]›*

Defined in src/core/Quickly.ts:430

**Parameters:**

Name | Type | Default |
------ | ------ | ------ |
`defaultUri?` | Uri | - |
`canSelectMany` | boolean | false |
`openLabel?` | string | - |
`filters?` | object | - |

**Returns:** *Promise‹Uri | Uri[]›*

___

### `Static` pickAnyOrNew

▸ **pickAnyOrNew**(`placeHolder`: string, ...`options`: [QuickPickOption](_core_quickly_.quickpickoption.md)[] | string[]): *Promise‹[QuickPickOption](_core_quickly_.quickpickoption.md)[]›*

Defined in src/core/Quickly.ts:191

**Parameters:**

Name | Type |
------ | ------ |
`placeHolder` | string |
`...options` | [QuickPickOption](_core_quickly_.quickpickoption.md)[] &#124; string[] |

**Returns:** *Promise‹[QuickPickOption](_core_quickly_.quickpickoption.md)[]›*

___

### `Static` pickBoolean

▸ **pickBoolean**(`placeHolder`: string, `trueValue`: string, `falseValue`: string): *Promise‹boolean›*

Defined in src/core/Quickly.ts:236

shows a QuickPick-Panel in the VS Code Window

**Parameters:**

Name | Type | Default | Description |
------ | ------ | ------ | ------ |
`placeHolder` | string | - | text to display when nothing was chosen |
`trueValue` | string | "True" | - |
`falseValue` | string | "False" | - |

**Returns:** *Promise‹boolean›*

___

### `Static` pickCdsOrganization

▸ **pickCdsOrganization**(`context`: ExtensionContext, `placeHolder?`: string, `ignoreFocusOut`: boolean): *Promise‹[Config](../interfaces/_api_cds_webapi_cdswebapi_.cdswebapi.config.md)›*

Defined in src/core/Quickly.ts:476

**Parameters:**

Name | Type | Default |
------ | ------ | ------ |
`context` | ExtensionContext | - |
`placeHolder?` | string | - |
`ignoreFocusOut` | boolean | true |

**Returns:** *Promise‹[Config](../interfaces/_api_cds_webapi_cdswebapi_.cdswebapi.config.md)›*

___

### `Static` pickCdsSolution

▸ **pickCdsSolution**(`config`: [Config](../interfaces/_api_cds_webapi_cdswebapi_.cdswebapi.config.md), `placeHolder?`: string, `ignoreFocusOut`: boolean): *Promise‹any›*

Defined in src/core/Quickly.ts:469

**Parameters:**

Name | Type | Default |
------ | ------ | ------ |
`config` | [Config](../interfaces/_api_cds_webapi_cdswebapi_.cdswebapi.config.md) | - |
`placeHolder?` | string | - |
`ignoreFocusOut` | boolean | true |

**Returns:** *Promise‹any›*

___

### `Static` pickCdsSolutionComponent

▸ **pickCdsSolutionComponent**(`config`: [Config](../interfaces/_api_cds_webapi_cdswebapi_.cdswebapi.config.md), `solution`: any, `componentType`: [SolutionComponent](../enums/_api_cdssolutions_.cdssolutions.solutioncomponent.md), `filterExpression?`: string, `placeHolder?`: string): *Promise‹object›*

Defined in src/core/Quickly.ts:494

**Parameters:**

Name | Type |
------ | ------ |
`config` | [Config](../interfaces/_api_cds_webapi_cdswebapi_.cdswebapi.config.md) |
`solution` | any |
`componentType` | [SolutionComponent](../enums/_api_cdssolutions_.cdssolutions.solutioncomponent.md) |
`filterExpression?` | string |
`placeHolder?` | string |

**Returns:** *Promise‹object›*

___

### `Static` pickCdsSolutionComponentType

▸ **pickCdsSolutionComponentType**(`placeHolder?`: string, `choices?`: [SolutionComponent](../enums/_api_cdssolutions_.cdssolutions.solutioncomponent.md)[]): *Promise‹[SolutionComponent](../enums/_api_cdssolutions_.cdssolutions.solutioncomponent.md)›*

Defined in src/core/Quickly.ts:483

**Parameters:**

Name | Type |
------ | ------ |
`placeHolder?` | string |
`choices?` | [SolutionComponent](../enums/_api_cdssolutions_.cdssolutions.solutioncomponent.md)[] |

**Returns:** *Promise‹[SolutionComponent](../enums/_api_cdssolutions_.cdssolutions.solutioncomponent.md)›*

___

### `Static` pickDictionaryEntry

▸ **pickDictionaryEntry**<**TKey**, **TItem**>(`dictionary`: [Dictionary](_core_types_dictionary_.dictionary.md)‹TKey, TItem›, `placeHolder?`: string): *Promise‹TItem›*

Defined in src/core/Quickly.ts:458

**Type parameters:**

▪ **TKey**

▪ **TItem**

**Parameters:**

Name | Type |
------ | ------ |
`dictionary` | [Dictionary](_core_types_dictionary_.dictionary.md)‹TKey, TItem› |
`placeHolder?` | string |

**Returns:** *Promise‹TItem›*

___

### `Static` pickEnum

▸ **pickEnum**<**T**>(`enumObject`: any, `placeHolder?`: string, `excludeOptions?`: any[]): *Promise‹T›*

Defined in src/core/Quickly.ts:442

**Type parameters:**

▪ **T**

**Parameters:**

Name | Type |
------ | ------ |
`enumObject` | any |
`placeHolder?` | string |
`excludeOptions?` | any[] |

**Returns:** *Promise‹T›*

___

### `Static` pickOrNew

▸ **pickOrNew**(`placeHolder`: string, ...`options`: [QuickPickOption](_core_quickly_.quickpickoption.md)[] | string[]): *Promise‹[QuickPickOption](_core_quickly_.quickpickoption.md)›*

Defined in src/core/Quickly.ts:140

**Parameters:**

Name | Type |
------ | ------ |
`placeHolder` | string |
`...options` | [QuickPickOption](_core_quickly_.quickpickoption.md)[] &#124; string[] |

**Returns:** *Promise‹[QuickPickOption](_core_quickly_.quickpickoption.md)›*

___

### `Static` pickTemplate

▸ **pickTemplate**(`placeHolder`: string, `templateType?`: [TemplateType](../enums/_components_templates_types_.templatetype.md), `canAddNewItem`: boolean): *Promise‹[TemplateItem](_components_templates_types_.templateitem.md)›*

Defined in src/core/Quickly.ts:241

**Parameters:**

Name | Type | Default |
------ | ------ | ------ |
`placeHolder` | string | - |
`templateType?` | [TemplateType](../enums/_components_templates_types_.templatetype.md) | - |
`canAddNewItem` | boolean | false |

**Returns:** *Promise‹[TemplateItem](_components_templates_types_.templateitem.md)›*

___

### `Static` pickWorkspaceAny

▸ **pickWorkspaceAny**(`defaultUri?`: Uri, `placeHolder?`: string, `ignoreFocusOut`: boolean, `canAddNewItem`: boolean, `allowedFileTypes?`: string[]): *Promise‹[WorkspaceFileItem](_core_quickly_.workspacefileitem.md)›*

Defined in src/core/Quickly.ts:339

**Parameters:**

Name | Type | Default |
------ | ------ | ------ |
`defaultUri?` | Uri | - |
`placeHolder?` | string | - |
`ignoreFocusOut` | boolean | true |
`canAddNewItem` | boolean | false |
`allowedFileTypes?` | string[] | - |

**Returns:** *Promise‹[WorkspaceFileItem](_core_quickly_.workspacefileitem.md)›*

___

### `Static` pickWorkspaceFile

▸ **pickWorkspaceFile**(`defaultUri?`: Uri, `placeHolder?`: string, `ignoreFocusOut`: boolean, `canAddNewItem`: boolean, `allowedFileTypes?`: string[]): *Promise‹string›*

Defined in src/core/Quickly.ts:329

Selects a file within a workspace folder.  If defaultUri contains a fsPath, then it uses
that as the root.  Otherwise, for single root workspaces it will select the root directory,
or for multi-root will present a chooser to select a workspace.

**Parameters:**

Name | Type | Default | Description |
------ | ------ | ------ | ------ |
`defaultUri?` | Uri | - | The root path to use when selecting a file |
`placeHolder?` | string | - | Placeholder text to render when asking the user to pick a file |
`ignoreFocusOut` | boolean | true | boolean indicating if the picker should maintain focus when the user clicks outside |
`canAddNewItem` | boolean | false | boolean indicating if the "Add new" option should be allowed |
`allowedFileTypes?` | string[] | - | array of file type extensions that are allowed.  |

**Returns:** *Promise‹string›*

___

### `Static` pickWorkspaceFolder

▸ **pickWorkspaceFolder**(`defaultUri?`: Uri, `placeHolder?`: string, `ignoreFocusOut`: boolean, `canAddNewItem`: boolean): *Promise‹string›*

Defined in src/core/Quickly.ts:334

**Parameters:**

Name | Type | Default |
------ | ------ | ------ |
`defaultUri?` | Uri | - |
`placeHolder?` | string | - |
`ignoreFocusOut` | boolean | true |
`canAddNewItem` | boolean | false |

**Returns:** *Promise‹string›*

___

### `Static` `Private` pickWorkspaceFsItem

▸ **pickWorkspaceFsItem**(`defaultUri?`: Uri, `placeHolder?`: string, `ignoreFocusOut`: boolean, `canPickFiles`: boolean, `canPickFolders`: boolean, `canPickLinks`: boolean, `canAddNewItem`: boolean, `allowedFileTypes?`: string[]): *Promise‹[WorkspaceFileItem](_core_quickly_.workspacefileitem.md)›*

Defined in src/core/Quickly.ts:343

**Parameters:**

Name | Type | Default |
------ | ------ | ------ |
`defaultUri?` | Uri | - |
`placeHolder?` | string | - |
`ignoreFocusOut` | boolean | true |
`canPickFiles` | boolean | true |
`canPickFolders` | boolean | true |
`canPickLinks` | boolean | true |
`canAddNewItem` | boolean | false |
`allowedFileTypes?` | string[] | - |

**Returns:** *Promise‹[WorkspaceFileItem](_core_quickly_.workspacefileitem.md)›*

___

### `Static` pickWorkspaceRoot

▸ **pickWorkspaceRoot**(`defaultUri?`: Uri, `placeHolder?`: string, `ignoreFocusOut`: boolean): *Promise‹Uri›*

Defined in src/core/Quickly.ts:294

Selects a workspace folder.  If args contains an fsPath, then it uses
that.  Otherwise, for single root workspaces it will select the root directory,
or for multi-root will present a chooser to select a workspace.

**Parameters:**

Name | Type | Default | Description |
------ | ------ | ------ | ------ |
`defaultUri?` | Uri | - |   |
`placeHolder?` | string | - | - |
`ignoreFocusOut` | boolean | true | - |

**Returns:** *Promise‹Uri›*

___

### `Static` warn

▸ **warn**(`message`: string, `modal`: boolean, `primaryOption?`: string, `primaryAction?`: function, `secondaryOption?`: string, `secondaryAction?`: function): *Promise‹void›*

Defined in src/core/Quickly.ts:82

Quickly warns you of information and optionally gives you primary/secondary actions.

**`static`** 

**`memberof`** QuickPicker

**Parameters:**

▪ **message**: *string*

The message to inform

▪`Default value`  **modal**: *boolean*= false

▪`Optional`  **primaryOption**: *string*

▪`Optional`  **primaryAction**: *function*

▸ (): *void*

▪`Optional`  **secondaryOption**: *string*

▪`Optional`  **secondaryAction**: *function*

▸ (): *void*

**Returns:** *Promise‹void›*

empty promise
