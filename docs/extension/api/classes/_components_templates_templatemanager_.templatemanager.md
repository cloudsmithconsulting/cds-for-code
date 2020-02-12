---
id: "_components_templates_templatemanager_.templatemanager"
title: "TemplateManager"
sidebar_label: "TemplateManager"
---

[cds-for-code](../index.md) › [Globals](../globals.md) › ["components/Templates/TemplateManager"](../modules/_components_templates_templatemanager_.md) › [TemplateManager](_components_templates_templatemanager_.templatemanager.md)

Main class to handle the logic of the Project Templates

**`export`** 

**`class`** TemplateManager

## Hierarchy

* **TemplateManager**

## Index

### Constructors

* [constructor](_components_templates_templatemanager_.templatemanager.md#constructor)

### Properties

* [_systemTemplates](_components_templates_templatemanager_.templatemanager.md#static-private-_systemtemplates)

### Methods

* [createFromFilesystem](_components_templates_templatemanager_.templatemanager.md#createfromfilesystem)
* [createTemplate](_components_templates_templatemanager_.templatemanager.md#createtemplate)
* [deleteFromFilesystem](_components_templates_templatemanager_.templatemanager.md#deletefromfilesystem)
* [deleteTemplate](_components_templates_templatemanager_.templatemanager.md#deletetemplate)
* [editTemplateCatalog](_components_templates_templatemanager_.templatemanager.md#edittemplatecatalog)
* [exportTemplate](_components_templates_templatemanager_.templatemanager.md#exporttemplate)
* [getTemplates](_components_templates_templatemanager_.templatemanager.md#gettemplates)
* [importTemplate](_components_templates_templatemanager_.templatemanager.md#importtemplate)
* [saveTemplate](_components_templates_templatemanager_.templatemanager.md#savetemplate)
* [saveToFilesystem](_components_templates_templatemanager_.templatemanager.md#savetofilesystem)
* [createItemTemplate](_components_templates_templatemanager_.templatemanager.md#static-createitemtemplate)
* [createProjectTemplate](_components_templates_templatemanager_.templatemanager.md#static-createprojecttemplate)
* [createTemplatesDirIfNotExists](_components_templates_templatemanager_.templatemanager.md#static-private-createtemplatesdirifnotexists)
* [exportTemplate](_components_templates_templatemanager_.templatemanager.md#static-exporttemplate)
* [getDefaultTemplatesFolder](_components_templates_templatemanager_.templatemanager.md#static-getdefaulttemplatesfolder)
* [getSystemTemplate](_components_templates_templatemanager_.templatemanager.md#static-getsystemtemplate)
* [getSystemTemplates](_components_templates_templatemanager_.templatemanager.md#static-getsystemtemplates)
* [getTemplateCatalog](_components_templates_templatemanager_.templatemanager.md#static-gettemplatecatalog)
* [getTemplateFolder](_components_templates_templatemanager_.templatemanager.md#static-gettemplatefolder)
* [getTemplateFolderItems](_components_templates_templatemanager_.templatemanager.md#static-private-gettemplatefolderitems)
* [getTemplates](_components_templates_templatemanager_.templatemanager.md#static-gettemplates)
* [getTemplatesFolder](_components_templates_templatemanager_.templatemanager.md#static-gettemplatesfolder)
* [importTemplate](_components_templates_templatemanager_.templatemanager.md#static-importtemplate)
* [openTemplateFolder](_components_templates_templatemanager_.templatemanager.md#static-opentemplatefolder)
* [openTemplateFolderInExplorer](_components_templates_templatemanager_.templatemanager.md#static-opentemplatefolderinexplorer)
* [saveItemTemplate](_components_templates_templatemanager_.templatemanager.md#static-saveitemtemplate)
* [saveProjectTemplate](_components_templates_templatemanager_.templatemanager.md#static-saveprojecttemplate)

## Constructors

###  constructor

\+ **new TemplateManager**(`context`: ExtensionContext): *[TemplateManager](_components_templates_templatemanager_.templatemanager.md)*

Defined in src/components/Templates/TemplateManager.ts:31

**Parameters:**

Name | Type |
------ | ------ |
`context` | ExtensionContext |

**Returns:** *[TemplateManager](_components_templates_templatemanager_.templatemanager.md)*

## Properties

### `Static` `Private` _systemTemplates

▪ **_systemTemplates**: *[TemplateItem](_components_templates_types_.templateitem.md)[]*

Defined in src/components/Templates/TemplateManager.ts:344

## Methods

###  createFromFilesystem

▸ **createFromFilesystem**(`fsPath`: string, `type`: [TemplateType](../enums/_components_templates_types_.templatetype.md), `template?`: [TemplateItem](_components_templates_types_.templateitem.md)): *Promise‹[TemplateContext](_components_templates_types_.templatecontext.md)›*

Defined in src/components/Templates/TemplateManager.ts:99

Populates a workspace folder with the contents of a template

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`fsPath` | string | current workspace folder to populate  |
`type` | [TemplateType](../enums/_components_templates_types_.templatetype.md) | - |
`template?` | [TemplateItem](_components_templates_types_.templateitem.md) | - |

**Returns:** *Promise‹[TemplateContext](_components_templates_types_.templatecontext.md)›*

___

###  createTemplate

▸ **createTemplate**(`destinationUri?`: Uri, `type?`: [TemplateType](../enums/_components_templates_types_.templatetype.md), `template?`: [TemplateItem](_components_templates_types_.templateitem.md)): *Promise‹void›*

Defined in src/components/Templates/TemplateManager.ts:57

**Parameters:**

Name | Type |
------ | ------ |
`destinationUri?` | Uri |
`type?` | [TemplateType](../enums/_components_templates_types_.templatetype.md) |
`template?` | [TemplateItem](_components_templates_types_.templateitem.md) |

**Returns:** *Promise‹void›*

___

###  deleteFromFilesystem

▸ **deleteFromFilesystem**(`template`: [TemplateItem](_components_templates_types_.templateitem.md)): *Promise‹boolean›*

Defined in src/components/Templates/TemplateManager.ts:125

Deletes a template from the template root directory

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`template` | [TemplateItem](_components_templates_types_.templateitem.md) | name of template |

**Returns:** *Promise‹boolean›*

success or failure

___

###  deleteTemplate

▸ **deleteTemplate**(`template`: [TemplateItem](_components_templates_types_.templateitem.md)): *Promise‹void›*

Defined in src/components/Templates/TemplateManager.ts:62

**Parameters:**

Name | Type |
------ | ------ |
`template` | [TemplateItem](_components_templates_types_.templateitem.md) |

**Returns:** *Promise‹void›*

___

###  editTemplateCatalog

▸ **editTemplateCatalog**(`configFile?`: Uri): *Promise‹any›*

Defined in src/components/Templates/TemplateManager.ts:67

**Parameters:**

Name | Type |
------ | ------ |
`configFile?` | Uri |

**Returns:** *Promise‹any›*

___

###  exportTemplate

▸ **exportTemplate**(`template`: [TemplateItem](_components_templates_types_.templateitem.md), `destinationUri`: Uri): *Promise‹void›*

Defined in src/components/Templates/TemplateManager.ts:72

**Parameters:**

Name | Type |
------ | ------ |
`template` | [TemplateItem](_components_templates_types_.templateitem.md) |
`destinationUri` | Uri |

**Returns:** *Promise‹void›*

___

###  getTemplates

▸ **getTemplates**(): *Promise‹[TemplateItem](_components_templates_types_.templateitem.md)[]›*

Defined in src/components/Templates/TemplateManager.ts:91

**Returns:** *Promise‹[TemplateItem](_components_templates_types_.templateitem.md)[]›*

___

###  importTemplate

▸ **importTemplate**(`sourceUri`: Uri): *Promise‹void›*

Defined in src/components/Templates/TemplateManager.ts:77

**Parameters:**

Name | Type |
------ | ------ |
`sourceUri` | Uri |

**Returns:** *Promise‹void›*

___

###  saveTemplate

▸ **saveTemplate**(`templateUri`: Uri, `type`: [TemplateType](../enums/_components_templates_types_.templatetype.md)): *Promise‹any›*

Defined in src/components/Templates/TemplateManager.ts:87

**Parameters:**

Name | Type |
------ | ------ |
`templateUri` | Uri |
`type` | [TemplateType](../enums/_components_templates_types_.templatetype.md) |

**Returns:** *Promise‹any›*

___

###  saveToFilesystem

▸ **saveToFilesystem**(`fsPath`: string, `type`: [TemplateType](../enums/_components_templates_types_.templatetype.md)): *Promise‹[TemplateItem](_components_templates_types_.templateitem.md)›*

Defined in src/components/Templates/TemplateManager.ts:230

Saves a workspace as a new template

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`fsPath` | string | absolute path of workspace folder/item |
`type` | [TemplateType](../enums/_components_templates_types_.templatetype.md) | the type of template to store. |

**Returns:** *Promise‹[TemplateItem](_components_templates_types_.templateitem.md)›*

name of template

___

### `Static` createItemTemplate

▸ **createItemTemplate**(`uri?`: Uri): *Promise‹unknown›*

Defined in src/components/Templates/TemplateManager.ts:37

**Parameters:**

Name | Type |
------ | ------ |
`uri?` | Uri |

**Returns:** *Promise‹unknown›*

___

### `Static` createProjectTemplate

▸ **createProjectTemplate**(`uri?`: Uri): *Promise‹unknown›*

Defined in src/components/Templates/TemplateManager.ts:42

**Parameters:**

Name | Type |
------ | ------ |
`uri?` | Uri |

**Returns:** *Promise‹unknown›*

___

### `Static` `Private` createTemplatesDirIfNotExists

▸ **createTemplatesDirIfNotExists**(): *Promise‹void›*

Defined in src/components/Templates/TemplateManager.ts:493

Creates the templates directory if it does not exists

**`throws`** Error

**Returns:** *Promise‹void›*

___

### `Static` exportTemplate

▸ **exportTemplate**(`template`: [TemplateItem](_components_templates_types_.templateitem.md), `archive`: string, `systemTemplate`: boolean): *Promise‹void›*

Defined in src/components/Templates/TemplateManager.ts:171

**Parameters:**

Name | Type | Default |
------ | ------ | ------ |
`template` | [TemplateItem](_components_templates_types_.templateitem.md) | - |
`archive` | string | - |
`systemTemplate` | boolean | false |

**Returns:** *Promise‹void›*

___

### `Static` getDefaultTemplatesFolder

▸ **getDefaultTemplatesFolder**(`systemTemplates`: boolean): *string*

Defined in src/components/Templates/TemplateManager.ts:422

Returns the default templates location, which is based on the global storage-path directory.

**Parameters:**

Name | Type | Default |
------ | ------ | ------ |
`systemTemplates` | boolean | false |

**Returns:** *string*

default template directory

___

### `Static` getSystemTemplate

▸ **getSystemTemplate**(`name`: string): *Promise‹[TemplateItem](_components_templates_types_.templateitem.md)›*

Defined in src/components/Templates/TemplateManager.ts:354

**Parameters:**

Name | Type |
------ | ------ |
`name` | string |

**Returns:** *Promise‹[TemplateItem](_components_templates_types_.templateitem.md)›*

___

### `Static` getSystemTemplates

▸ **getSystemTemplates**(): *Promise‹[TemplateItem](_components_templates_types_.templateitem.md)[]›*

Defined in src/components/Templates/TemplateManager.ts:346

**Returns:** *Promise‹[TemplateItem](_components_templates_types_.templateitem.md)[]›*

___

### `Static` getTemplateCatalog

▸ **getTemplateCatalog**(`filename?`: string, `getSystemCatalog`: boolean): *Promise‹[TemplateCatalog](_components_templates_templatecatalog_.templatecatalog.md)›*

Defined in src/components/Templates/TemplateManager.ts:317

Gets a copy of the template catalog

**`static`** 

**`memberof`** TemplateManager

**Parameters:**

Name | Type | Default |
------ | ------ | ------ |
`filename?` | string | - |
`getSystemCatalog` | boolean | false |

**Returns:** *Promise‹[TemplateCatalog](_components_templates_templatecatalog_.templatecatalog.md)›*

___

### `Static` getTemplateFolder

▸ **getTemplateFolder**(`template`: [TemplateItem](_components_templates_types_.templateitem.md), `systemTemplate`: boolean): *Promise‹string›*

Defined in src/components/Templates/TemplateManager.ts:155

**Parameters:**

Name | Type | Default |
------ | ------ | ------ |
`template` | [TemplateItem](_components_templates_types_.templateitem.md) | - |
`systemTemplate` | boolean | false |

**Returns:** *Promise‹string›*

___

### `Static` `Private` getTemplateFolderItems

▸ **getTemplateFolderItems**(`folder?`: string): *Promise‹[TemplateFilesystemItem](_components_templates_types_.templatefilesystemitem.md)[]›*

Defined in src/components/Templates/TemplateManager.ts:462

Returns a list of available project templates by reading the Templates Directory.

**Parameters:**

Name | Type |
------ | ------ |
`folder?` | string |

**Returns:** *Promise‹[TemplateFilesystemItem](_components_templates_types_.templatefilesystemitem.md)[]›*

list of templates found

___

### `Static` getTemplates

▸ **getTemplates**(`folder`: string, `mergeWith?`: [TemplateItem](_components_templates_types_.templateitem.md)[], `exclusions?`: string[]): *Promise‹[TemplateItem](_components_templates_types_.templateitem.md)[]›*

Defined in src/components/Templates/TemplateManager.ts:359

**Parameters:**

Name | Type |
------ | ------ |
`folder` | string |
`mergeWith?` | [TemplateItem](_components_templates_types_.templateitem.md)[] |
`exclusions?` | string[] |

**Returns:** *Promise‹[TemplateItem](_components_templates_types_.templateitem.md)[]›*

___

### `Static` getTemplatesFolder

▸ **getTemplatesFolder**(`systemTemplates`: boolean): *Promise‹string›*

Defined in src/components/Templates/TemplateManager.ts:402

Returns the templates directory location.
If no user configuration is found, the extension will look for
templates in USER_DATA_DIR/Code/Templates.
Otherwise it will look for the path defined in the extension configuration.

**Parameters:**

Name | Type | Default |
------ | ------ | ------ |
`systemTemplates` | boolean | false |

**Returns:** *Promise‹string›*

the templates directory

___

### `Static` importTemplate

▸ **importTemplate**(`archive`: string, `systemTemplate`: boolean): *Promise‹[TemplateItem](_components_templates_types_.templateitem.md)›*

Defined in src/components/Templates/TemplateManager.ts:179

**Parameters:**

Name | Type | Default |
------ | ------ | ------ |
`archive` | string | - |
`systemTemplate` | boolean | false |

**Returns:** *Promise‹[TemplateItem](_components_templates_types_.templateitem.md)›*

___

### `Static` openTemplateFolder

▸ **openTemplateFolder**(`template`: [TemplateItem](_components_templates_types_.templateitem.md)): *Promise‹void›*

Defined in src/components/Templates/TemplateManager.ts:82

**Parameters:**

Name | Type |
------ | ------ |
`template` | [TemplateItem](_components_templates_types_.templateitem.md) |

**Returns:** *Promise‹void›*

___

### `Static` openTemplateFolderInExplorer

▸ **openTemplateFolderInExplorer**(`template`: [TemplateItem](_components_templates_types_.templateitem.md), `systemTemplate`: boolean): *Promise‹void›*

Defined in src/components/Templates/TemplateManager.ts:220

**Parameters:**

Name | Type | Default |
------ | ------ | ------ |
`template` | [TemplateItem](_components_templates_types_.templateitem.md) | - |
`systemTemplate` | boolean | false |

**Returns:** *Promise‹void›*

___

### `Static` saveItemTemplate

▸ **saveItemTemplate**(`uri?`: Uri): *Promise‹unknown›*

Defined in src/components/Templates/TemplateManager.ts:47

**Parameters:**

Name | Type |
------ | ------ |
`uri?` | Uri |

**Returns:** *Promise‹unknown›*

___

### `Static` saveProjectTemplate

▸ **saveProjectTemplate**(`uri?`: Uri): *Promise‹unknown›*

Defined in src/components/Templates/TemplateManager.ts:52

**Parameters:**

Name | Type |
------ | ------ |
`uri?` | Uri |

**Returns:** *Promise‹unknown›*
