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
* [applyTemplate](_components_templates_templatemanager_.templatemanager.md#static-applytemplate)
* [createItemTemplate](_components_templates_templatemanager_.templatemanager.md#static-createitemtemplate)
* [createProjectTemplate](_components_templates_templatemanager_.templatemanager.md#static-createprojecttemplate)
* [createTemplatesDirIfNotExists](_components_templates_templatemanager_.templatemanager.md#static-private-createtemplatesdirifnotexists)
* [defaultResolver](_components_templates_templatemanager_.templatemanager.md#static-private-defaultresolver)
* [exportTemplate](_components_templates_templatemanager_.templatemanager.md#static-exporttemplate)
* [getDefaultTemplatesFolder](_components_templates_templatemanager_.templatemanager.md#static-getdefaulttemplatesfolder)
* [getPlaceholders](_components_templates_templatemanager_.templatemanager.md#static-private-getplaceholders)
* [getSystemTemplate](_components_templates_templatemanager_.templatemanager.md#static-getsystemtemplate)
* [getSystemTemplates](_components_templates_templatemanager_.templatemanager.md#static-getsystemtemplates)
* [getTemplateCatalog](_components_templates_templatemanager_.templatemanager.md#static-gettemplatecatalog)
* [getTemplateFolder](_components_templates_templatemanager_.templatemanager.md#static-gettemplatefolder)
* [getTemplateFolderItems](_components_templates_templatemanager_.templatemanager.md#static-private-gettemplatefolderitems)
* [getTemplates](_components_templates_templatemanager_.templatemanager.md#static-gettemplates)
* [getTemplatesFolder](_components_templates_templatemanager_.templatemanager.md#static-gettemplatesfolder)
* [importTemplate](_components_templates_templatemanager_.templatemanager.md#static-importtemplate)
* [mergePlaceholders](_components_templates_templatemanager_.templatemanager.md#static-private-mergeplaceholders)
* [openTemplateFolder](_components_templates_templatemanager_.templatemanager.md#static-opentemplatefolder)
* [openTemplateFolderInExplorer](_components_templates_templatemanager_.templatemanager.md#static-opentemplatefolderinexplorer)
* [resolvePlaceholders](_components_templates_templatemanager_.templatemanager.md#static-private-resolveplaceholders)
* [saveItemTemplate](_components_templates_templatemanager_.templatemanager.md#static-saveitemtemplate)
* [saveProjectTemplate](_components_templates_templatemanager_.templatemanager.md#static-saveprojecttemplate)

## Constructors

###  constructor

\+ **new TemplateManager**(`context`: ExtensionContext): *[TemplateManager](_components_templates_templatemanager_.templatemanager.md)*

Defined in src/components/Templates/TemplateManager.ts:33

**Parameters:**

Name | Type |
------ | ------ |
`context` | ExtensionContext |

**Returns:** *[TemplateManager](_components_templates_templatemanager_.templatemanager.md)*

## Properties

### `Static` `Private` _systemTemplates

▪ **_systemTemplates**: *[TemplateItem](_components_templates_types_.templateitem.md)[]*

Defined in src/components/Templates/TemplateManager.ts:498

## Methods

###  createFromFilesystem

▸ **createFromFilesystem**(`fsPath`: string, `type`: [TemplateType](../enums/_components_templates_types_.templatetype.md), `template?`: [TemplateItem](_components_templates_types_.templateitem.md)): *Promise‹[TemplateItem](_components_templates_types_.templateitem.md)‹››*

Defined in src/components/Templates/TemplateManager.ts:122

Populates a workspace folder with the contents of a template

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`fsPath` | string | current workspace folder to populate  |
`type` | [TemplateType](../enums/_components_templates_types_.templatetype.md) | - |
`template?` | [TemplateItem](_components_templates_types_.templateitem.md) | - |

**Returns:** *Promise‹[TemplateItem](_components_templates_types_.templateitem.md)‹››*

___

###  createTemplate

▸ **createTemplate**(`destinationUri?`: Uri, `type?`: [TemplateType](../enums/_components_templates_types_.templatetype.md), `template?`: [TemplateItem](_components_templates_types_.templateitem.md)): *Promise‹void›*

Defined in src/components/Templates/TemplateManager.ts:59

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

Defined in src/components/Templates/TemplateManager.ts:271

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

Defined in src/components/Templates/TemplateManager.ts:64

**Parameters:**

Name | Type |
------ | ------ |
`template` | [TemplateItem](_components_templates_types_.templateitem.md) |

**Returns:** *Promise‹void›*

___

###  editTemplateCatalog

▸ **editTemplateCatalog**(`configFile?`: Uri): *Promise‹any›*

Defined in src/components/Templates/TemplateManager.ts:69

**Parameters:**

Name | Type |
------ | ------ |
`configFile?` | Uri |

**Returns:** *Promise‹any›*

___

###  exportTemplate

▸ **exportTemplate**(`template`: [TemplateItem](_components_templates_types_.templateitem.md), `destinationUri`: Uri): *Promise‹void›*

Defined in src/components/Templates/TemplateManager.ts:74

**Parameters:**

Name | Type |
------ | ------ |
`template` | [TemplateItem](_components_templates_types_.templateitem.md) |
`destinationUri` | Uri |

**Returns:** *Promise‹void›*

___

###  getTemplates

▸ **getTemplates**(): *Promise‹[TemplateItem](_components_templates_types_.templateitem.md)[]›*

Defined in src/components/Templates/TemplateManager.ts:93

**Returns:** *Promise‹[TemplateItem](_components_templates_types_.templateitem.md)[]›*

___

###  importTemplate

▸ **importTemplate**(`sourceUri`: Uri): *Promise‹void›*

Defined in src/components/Templates/TemplateManager.ts:79

**Parameters:**

Name | Type |
------ | ------ |
`sourceUri` | Uri |

**Returns:** *Promise‹void›*

___

###  saveTemplate

▸ **saveTemplate**(`templateUri`: Uri, `type`: [TemplateType](../enums/_components_templates_types_.templatetype.md)): *Promise‹any›*

Defined in src/components/Templates/TemplateManager.ts:89

**Parameters:**

Name | Type |
------ | ------ |
`templateUri` | Uri |
`type` | [TemplateType](../enums/_components_templates_types_.templatetype.md) |

**Returns:** *Promise‹any›*

___

###  saveToFilesystem

▸ **saveToFilesystem**(`fsPath`: string, `type`: [TemplateType](../enums/_components_templates_types_.templatetype.md)): *Promise‹[TemplateItem](_components_templates_types_.templateitem.md)›*

Defined in src/components/Templates/TemplateManager.ts:383

Saves a workspace as a new template

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`fsPath` | string | absolute path of workspace folder/item |
`type` | [TemplateType](../enums/_components_templates_types_.templatetype.md) | the type of template to store. |

**Returns:** *Promise‹[TemplateItem](_components_templates_types_.templateitem.md)›*

name of template

___

### `Static` applyTemplate

▸ **applyTemplate**(`template`: [TemplateItem](_components_templates_types_.templateitem.md), `data`: string | Buffer, `placeholders?`: [Dictionary](_core_types_dictionary_.dictionary.md)‹string, string›, `object?`: any): *Promise‹string | Buffer›*

Defined in src/components/Templates/TemplateManager.ts:97

**Parameters:**

Name | Type |
------ | ------ |
`template` | [TemplateItem](_components_templates_types_.templateitem.md) |
`data` | string &#124; Buffer |
`placeholders?` | [Dictionary](_core_types_dictionary_.dictionary.md)‹string, string› |
`object?` | any |

**Returns:** *Promise‹string | Buffer›*

___

### `Static` createItemTemplate

▸ **createItemTemplate**(`uri?`: Uri): *Promise‹unknown›*

Defined in src/components/Templates/TemplateManager.ts:39

**Parameters:**

Name | Type |
------ | ------ |
`uri?` | Uri |

**Returns:** *Promise‹unknown›*

___

### `Static` createProjectTemplate

▸ **createProjectTemplate**(`uri?`: Uri): *Promise‹unknown›*

Defined in src/components/Templates/TemplateManager.ts:44

**Parameters:**

Name | Type |
------ | ------ |
`uri?` | Uri |

**Returns:** *Promise‹unknown›*

___

### `Static` `Private` createTemplatesDirIfNotExists

▸ **createTemplatesDirIfNotExists**(): *Promise‹void›*

Defined in src/components/Templates/TemplateManager.ts:649

Creates the templates directory if it does not exists

**`throws`** Error

**Returns:** *Promise‹void›*

___

### `Static` `Private` defaultResolver

▸ **defaultResolver**(`data`: string | Buffer, `placeholderRegExp`: RegExp, `template?`: [TemplateItem](_components_templates_types_.templateitem.md), `defaultPlaceholders?`: [Dictionary](_core_types_dictionary_.dictionary.md)‹string, string›): *Promise‹string | Buffer›*

Defined in src/components/Templates/TemplateManager.ts:796

**Parameters:**

Name | Type |
------ | ------ |
`data` | string &#124; Buffer |
`placeholderRegExp` | RegExp |
`template?` | [TemplateItem](_components_templates_types_.templateitem.md) |
`defaultPlaceholders?` | [Dictionary](_core_types_dictionary_.dictionary.md)‹string, string› |

**Returns:** *Promise‹string | Buffer›*

___

### `Static` exportTemplate

▸ **exportTemplate**(`template`: [TemplateItem](_components_templates_types_.templateitem.md), `archive`: string, `systemTemplate`: boolean): *Promise‹void›*

Defined in src/components/Templates/TemplateManager.ts:324

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

Defined in src/components/Templates/TemplateManager.ts:578

Returns the default templates location, which is based on the global storage-path directory.

**Parameters:**

Name | Type | Default |
------ | ------ | ------ |
`systemTemplates` | boolean | false |

**Returns:** *string*

default template directory

___

### `Static` `Private` getPlaceholders

▸ **getPlaceholders**(`fsItem`: string, `placeholderRegExp`: string, `isFolder`: boolean): *string[]*

Defined in src/components/Templates/TemplateManager.ts:668

**Parameters:**

Name | Type |
------ | ------ |
`fsItem` | string |
`placeholderRegExp` | string |
`isFolder` | boolean |

**Returns:** *string[]*

___

### `Static` getSystemTemplate

▸ **getSystemTemplate**(`name`: string): *Promise‹[TemplateItem](_components_templates_types_.templateitem.md)›*

Defined in src/components/Templates/TemplateManager.ts:508

**Parameters:**

Name | Type |
------ | ------ |
`name` | string |

**Returns:** *Promise‹[TemplateItem](_components_templates_types_.templateitem.md)›*

___

### `Static` getSystemTemplates

▸ **getSystemTemplates**(): *Promise‹[TemplateItem](_components_templates_types_.templateitem.md)[]›*

Defined in src/components/Templates/TemplateManager.ts:500

**Returns:** *Promise‹[TemplateItem](_components_templates_types_.templateitem.md)[]›*

___

### `Static` getTemplateCatalog

▸ **getTemplateCatalog**(`filename?`: string, `getSystemCatalog`: boolean): *Promise‹[TemplateCatalog](_components_templates_templatecatalog_.templatecatalog.md)›*

Defined in src/components/Templates/TemplateManager.ts:471

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

Defined in src/components/Templates/TemplateManager.ts:308

**Parameters:**

Name | Type | Default |
------ | ------ | ------ |
`template` | [TemplateItem](_components_templates_types_.templateitem.md) | - |
`systemTemplate` | boolean | false |

**Returns:** *Promise‹string›*

___

### `Static` `Private` getTemplateFolderItems

▸ **getTemplateFolderItems**(`folder?`: string): *Promise‹[TemplateFilesystemItem](_components_templates_templatemanager_.templatefilesystemitem.md)[]›*

Defined in src/components/Templates/TemplateManager.ts:618

Returns a list of available project templates by reading the Templates Directory.

**Parameters:**

Name | Type |
------ | ------ |
`folder?` | string |

**Returns:** *Promise‹[TemplateFilesystemItem](_components_templates_templatemanager_.templatefilesystemitem.md)[]›*

list of templates found

___

### `Static` getTemplates

▸ **getTemplates**(`folder`: string, `mergeWith?`: [TemplateItem](_components_templates_types_.templateitem.md)[], `exclusions?`: string[]): *Promise‹[TemplateItem](_components_templates_types_.templateitem.md)[]›*

Defined in src/components/Templates/TemplateManager.ts:513

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

Defined in src/components/Templates/TemplateManager.ts:558

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

Defined in src/components/Templates/TemplateManager.ts:332

**Parameters:**

Name | Type | Default |
------ | ------ | ------ |
`archive` | string | - |
`systemTemplate` | boolean | false |

**Returns:** *Promise‹[TemplateItem](_components_templates_types_.templateitem.md)›*

___

### `Static` `Private` mergePlaceholders

▸ **mergePlaceholders**(`source`: [TemplatePlaceholder](_components_templates_types_.templateplaceholder.md)[], `merge`: [TemplatePlaceholder](_components_templates_types_.templateplaceholder.md)[]): *[TemplatePlaceholder](_components_templates_types_.templateplaceholder.md)‹›[]*

Defined in src/components/Templates/TemplateManager.ts:740

**Parameters:**

Name | Type |
------ | ------ |
`source` | [TemplatePlaceholder](_components_templates_types_.templateplaceholder.md)[] |
`merge` | [TemplatePlaceholder](_components_templates_types_.templateplaceholder.md)[] |

**Returns:** *[TemplatePlaceholder](_components_templates_types_.templateplaceholder.md)‹›[]*

___

### `Static` openTemplateFolder

▸ **openTemplateFolder**(`template`: [TemplateItem](_components_templates_types_.templateitem.md)): *Promise‹void›*

Defined in src/components/Templates/TemplateManager.ts:84

**Parameters:**

Name | Type |
------ | ------ |
`template` | [TemplateItem](_components_templates_types_.templateitem.md) |

**Returns:** *Promise‹void›*

___

### `Static` openTemplateFolderInExplorer

▸ **openTemplateFolderInExplorer**(`template`: [TemplateItem](_components_templates_types_.templateitem.md), `systemTemplate`: boolean): *Promise‹void›*

Defined in src/components/Templates/TemplateManager.ts:373

**Parameters:**

Name | Type | Default |
------ | ------ | ------ |
`template` | [TemplateItem](_components_templates_types_.templateitem.md) | - |
`systemTemplate` | boolean | false |

**Returns:** *Promise‹void›*

___

### `Static` `Private` resolvePlaceholders

▸ **resolvePlaceholders**(`data`: string | Buffer, `placeholderRegExp`: string, `placeholders`: [Dictionary](_core_types_dictionary_.dictionary.md)‹string, string›, `templateInfo`: [TemplateItem](_components_templates_types_.templateitem.md), `resolvers?`: function[]): *Promise‹string | Buffer›*

Defined in src/components/Templates/TemplateManager.ts:772

Replaces any placeholders found within the input data.  Will use a
dictionary of values from the user's workspace settings, or will prompt
if value is not known.

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`data` | string &#124; Buffer | input data |
`placeholderRegExp` | string | regular expression to use for detecting                           placeholders.  The first capture group is used                           as the key. |
`placeholders` | [Dictionary](_core_types_dictionary_.dictionary.md)‹string, string› | dictionary of placeholder key-value pairs |
`templateInfo` | [TemplateItem](_components_templates_types_.templateitem.md) | - |
`resolvers?` | function[] | - |

**Returns:** *Promise‹string | Buffer›*

the (potentially) modified data, with the same type as the input data

___

### `Static` saveItemTemplate

▸ **saveItemTemplate**(`uri?`: Uri): *Promise‹unknown›*

Defined in src/components/Templates/TemplateManager.ts:49

**Parameters:**

Name | Type |
------ | ------ |
`uri?` | Uri |

**Returns:** *Promise‹unknown›*

___

### `Static` saveProjectTemplate

▸ **saveProjectTemplate**(`uri?`: Uri): *Promise‹unknown›*

Defined in src/components/Templates/TemplateManager.ts:54

**Parameters:**

Name | Type |
------ | ------ |
`uri?` | Uri |

**Returns:** *Promise‹unknown›*
