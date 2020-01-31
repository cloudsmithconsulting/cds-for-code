---
id: "_repositories_apirepository_.apirepository"
title: "ApiRepository"
sidebar_label: "ApiRepository"
---

[cds-for-code](../index.md) › [Globals](../globals.md) › ["repositories/apiRepository"](../modules/_repositories_apirepository_.md) › [ApiRepository](_repositories_apirepository_.apirepository.md)

## Hierarchy

* **ApiRepository**

## Index

### Constructors

* [constructor](_repositories_apirepository_.apirepository.md#constructor)

### Properties

* [webapi](_repositories_apirepository_.apirepository.md#private-webapi)
* [defaultSelections](_repositories_apirepository_.apirepository.md#static-defaultselections)

### Accessors

* [config](_repositories_apirepository_.apirepository.md#config)

### Methods

* [addSolutionComponent](_repositories_apirepository_.apirepository.md#addsolutioncomponent)
* [createProcess](_repositories_apirepository_.apirepository.md#createprocess)
* [createProcessFromTemplate](_repositories_apirepository_.apirepository.md#createprocessfromtemplate)
* [exportSolution](_repositories_apirepository_.apirepository.md#exportsolution)
* [getSolutionComponent](_repositories_apirepository_.apirepository.md#getsolutioncomponent)
* [getSolutionImportStatus](_repositories_apirepository_.apirepository.md#getsolutionimportstatus)
* [importSolution](_repositories_apirepository_.apirepository.md#importsolution)
* [publishAllXml](_repositories_apirepository_.apirepository.md#publishallxml)
* [publishXml](_repositories_apirepository_.apirepository.md#publishxml)
* [removePluginStep](_repositories_apirepository_.apirepository.md#removepluginstep)
* [removePluginStepImage](_repositories_apirepository_.apirepository.md#removepluginstepimage)
* [removeSolutionComponent](_repositories_apirepository_.apirepository.md#removesolutioncomponent)
* [retrieveApplications](_repositories_apirepository_.apirepository.md#retrieveapplications)
* [retrieveBuiltInSolution](_repositories_apirepository_.apirepository.md#retrievebuiltinsolution)
* [retrieveEntityTypeCodes](_repositories_apirepository_.apirepository.md#retrieveentitytypecodes)
* [retrievePluginAssemblies](_repositories_apirepository_.apirepository.md#retrievepluginassemblies)
* [retrievePluginStep](_repositories_apirepository_.apirepository.md#retrievepluginstep)
* [retrievePluginStepImages](_repositories_apirepository_.apirepository.md#retrievepluginstepimages)
* [retrievePluginSteps](_repositories_apirepository_.apirepository.md#retrievepluginsteps)
* [retrievePluginTypes](_repositories_apirepository_.apirepository.md#retrieveplugintypes)
* [retrieveProcessTemplates](_repositories_apirepository_.apirepository.md#retrieveprocesstemplates)
* [retrieveProcesses](_repositories_apirepository_.apirepository.md#retrieveprocesses)
* [retrieveSdkMessageDetails](_repositories_apirepository_.apirepository.md#retrievesdkmessagedetails)
* [retrieveSdkMessageFilters](_repositories_apirepository_.apirepository.md#retrievesdkmessagefilters)
* [retrieveSdkMessages](_repositories_apirepository_.apirepository.md#retrievesdkmessages)
* [retrieveSolution](_repositories_apirepository_.apirepository.md#retrievesolution)
* [retrieveSolutions](_repositories_apirepository_.apirepository.md#retrievesolutions)
* [retrieveSystemUsers](_repositories_apirepository_.apirepository.md#retrievesystemusers)
* [retrieveWebResource](_repositories_apirepository_.apirepository.md#retrievewebresource)
* [retrieveWebResourceFolders](_repositories_apirepository_.apirepository.md#retrievewebresourcefolders)
* [retrieveWebResources](_repositories_apirepository_.apirepository.md#retrievewebresources)
* [uploadPluginAssembly](_repositories_apirepository_.apirepository.md#uploadpluginassembly)
* [upsertPluginStep](_repositories_apirepository_.apirepository.md#upsertpluginstep)
* [upsertPluginStepImage](_repositories_apirepository_.apirepository.md#upsertpluginstepimage)
* [upsertPluginType](_repositories_apirepository_.apirepository.md#upsertplugintype)
* [upsertWebResource](_repositories_apirepository_.apirepository.md#upsertwebresource)
* [whoAmI](_repositories_apirepository_.apirepository.md#whoami)

## Constructors

###  constructor

\+ **new ApiRepository**(`config`: [Config](../interfaces/_api_cds_webapi_cdswebapi_.cdswebapi.config.md)): *[ApiRepository](_repositories_apirepository_.apirepository.md)*

Defined in src/repositories/apiRepository.ts:15

**Parameters:**

Name | Type |
------ | ------ |
`config` | [Config](../interfaces/_api_cds_webapi_cdswebapi_.cdswebapi.config.md) |

**Returns:** *[ApiRepository](_repositories_apirepository_.apirepository.md)*

## Properties

### `Private` webapi

• **webapi**: *[WebApiClient](_api_cds_webapi_cdswebapi_.cdswebapi.webapiclient.md)*

Defined in src/repositories/apiRepository.ts:20

___

### `Static` defaultSelections

▪ **defaultSelections**: *[Dictionary](_core_types_dictionary_.dictionary.md)‹string, string[]›* = new Dictionary<string, string[]>([
        { key: 'appmodules', value: [ 'appmoduleid', 'uniquename', 'name', 'appmoduleversion', 'ismanaged', 'solutionid', 'url', 'webresourceid', 'welcomepageid' ] },
        { key: 'solutions', value: [ 'solutionid', 'uniquename', 'friendlyname', 'version', 'ismanaged', 'isvisible' ] },
        { key: 'workflows', value: [ 'workflowid', 'componentstate', 'category', 'type', 'solutionid', 'primaryentity', 'name', 'description' ] },
        { key: 'pluginassemblies', value: [ 'pluginassemblyid', 'name', 'version', 'publickeytoken', 'ishidden' ] },
        { key: 'webresources', value: [ 'webresourceid', 'name', 'displayname', 'webresourcetype', 'iscustomizable' ] },
        { key: 'pluginassemblies', value: [ 'name', 'version', 'publickeytoken' ] },
        { key: 'plugintypes', value: [ 'plugintypeid', 'name', 'friendlyname', 'assemblyname', 'typename', 'solutionid', '_pluginassemblyid_value' ] },
        { key: 'sdkmessages', value: [ 'sdkmessageid', 'name', 'autotransact', 'availability', 'categoryname', 'isactive', 'isprivate', 'isreadonly', 'template', 'workflowsdkstepenabled' ] },
        { key: 'sdkmessagefilters', value: [ 'sdkmessagefilterid', '_sdkmessageid_value', 'primaryobjecttypecode', 'secondaryobjecttypecode' ] },
        { key: 'systemusers', value: [ 'systemuserid', 'fullname', 'isdisabled' ] },
        { key: 'solutioncomponents', value: [ 'solutioncomponentid', 'componenttype', 'objectid' ] }
    ])

Defined in src/repositories/apiRepository.ts:26

## Accessors

###  config

• **get config**(): *[Config](../interfaces/_api_cds_webapi_cdswebapi_.cdswebapi.config.md)*

Defined in src/repositories/apiRepository.ts:22

**Returns:** *[Config](../interfaces/_api_cds_webapi_cdswebapi_.cdswebapi.config.md)*

## Methods

###  addSolutionComponent

▸ **addSolutionComponent**(`solution`: any, `componentId`: string, `componentType`: [SolutionComponent](../enums/_api_cdssolutions_.cdssolutions.solutioncomponent.md), `addRequiredComponents`: boolean, `doNotIncludeSubcomponents`: boolean, `componentSettings?`: string): *Promise‹any›*

Defined in src/repositories/apiRepository.ts:614

**Parameters:**

Name | Type | Default |
------ | ------ | ------ |
`solution` | any | - |
`componentId` | string | - |
`componentType` | [SolutionComponent](../enums/_api_cdssolutions_.cdssolutions.solutioncomponent.md) | - |
`addRequiredComponents` | boolean | false |
`doNotIncludeSubcomponents` | boolean | true |
`componentSettings?` | string | - |

**Returns:** *Promise‹any›*

___

###  createProcess

▸ **createProcess**(`workflow`: any): *Promise‹any›*

Defined in src/repositories/apiRepository.ts:279

**Parameters:**

Name | Type |
------ | ------ |
`workflow` | any |

**Returns:** *Promise‹any›*

___

###  createProcessFromTemplate

▸ **createProcessFromTemplate**(`processTemplateId`: string, `name`: string): *Promise‹any›*

Defined in src/repositories/apiRepository.ts:283

**Parameters:**

Name | Type |
------ | ------ |
`processTemplateId` | string |
`name` | string |

**Returns:** *Promise‹any›*

___

###  exportSolution

▸ **exportSolution**(`options`: [ExportSolutionOptions](../modules/_commands_cs_cds_deployment_exportsolution_.md#exportsolutionoptions)): *Promise‹Buffer›*

Defined in src/repositories/apiRepository.ts:701

**Parameters:**

Name | Type |
------ | ------ |
`options` | [ExportSolutionOptions](../modules/_commands_cs_cds_deployment_exportsolution_.md#exportsolutionoptions) |

**Returns:** *Promise‹Buffer›*

___

###  getSolutionComponent

▸ **getSolutionComponent**(`componentId`: string, `componentType`: [SolutionComponent](../enums/_api_cdssolutions_.cdssolutions.solutioncomponent.md), `select`: string[]): *Promise‹any›*

Defined in src/repositories/apiRepository.ts:628

**Parameters:**

Name | Type | Default |
------ | ------ | ------ |
`componentId` | string | - |
`componentType` | [SolutionComponent](../enums/_api_cdssolutions_.cdssolutions.solutioncomponent.md) | - |
`select` | string[] | ApiRepository.defaultSelections["solutioncomponents"] |

**Returns:** *Promise‹any›*

___

###  getSolutionImportStatus

▸ **getSolutionImportStatus**(`importJobId`: string): *Promise‹any›*

Defined in src/repositories/apiRepository.ts:697

**Parameters:**

Name | Type |
------ | ------ |
`importJobId` | string |

**Returns:** *Promise‹any›*

___

###  importSolution

▸ **importSolution**(`customizations`: Buffer, `options`: [ImportSolutionOptions](../modules/_commands_cs_cds_deployment_importsolution_.md#importsolutionoptions)): *Promise‹string›*

Defined in src/repositories/apiRepository.ts:681

**Parameters:**

Name | Type |
------ | ------ |
`customizations` | Buffer |
`options` | [ImportSolutionOptions](../modules/_commands_cs_cds_deployment_importsolution_.md#importsolutionoptions) |

**Returns:** *Promise‹string›*

___

###  publishAllXml

▸ **publishAllXml**(): *Promise‹any›*

Defined in src/repositories/apiRepository.ts:44

**Returns:** *Promise‹any›*

___

###  publishXml

▸ **publishXml**(`xml`: string): *Promise‹any›*

Defined in src/repositories/apiRepository.ts:40

**Parameters:**

Name | Type |
------ | ------ |
`xml` | string |

**Returns:** *Promise‹any›*

___

###  removePluginStep

▸ **removePluginStep**(`step`: any): *Promise‹boolean›*

Defined in src/repositories/apiRepository.ts:639

**Parameters:**

Name | Type |
------ | ------ |
`step` | any |

**Returns:** *Promise‹boolean›*

___

###  removePluginStepImage

▸ **removePluginStepImage**(`stepImage`: any): *Promise‹any›*

Defined in src/repositories/apiRepository.ts:655

**Parameters:**

Name | Type |
------ | ------ |
`stepImage` | any |

**Returns:** *Promise‹any›*

___

###  removeSolutionComponent

▸ **removeSolutionComponent**(`solution`: any, `componentId`: string, `componentType`: [SolutionComponent](../enums/_api_cdssolutions_.cdssolutions.solutioncomponent.md)): *Promise‹any›*

Defined in src/repositories/apiRepository.ts:662

**Parameters:**

Name | Type |
------ | ------ |
`solution` | any |
`componentId` | string |
`componentType` | [SolutionComponent](../enums/_api_cdssolutions_.cdssolutions.solutioncomponent.md) |

**Returns:** *Promise‹any›*

___

###  retrieveApplications

▸ **retrieveApplications**(`solutionId?`: string, `select`: string[]): *Promise‹any[]›*

Defined in src/repositories/apiRepository.ts:72

**Parameters:**

Name | Type | Default |
------ | ------ | ------ |
`solutionId?` | string | - |
`select` | string[] | ApiRepository.defaultSelections["appmodules"] |

**Returns:** *Promise‹any[]›*

___

###  retrieveBuiltInSolution

▸ **retrieveBuiltInSolution**(`builtInType`: "System" | "Active" | "Default", `select`: string[]): *Promise‹any›*

Defined in src/repositories/apiRepository.ts:60

**Parameters:**

Name | Type | Default |
------ | ------ | ------ |
`builtInType` | "System" &#124; "Active" &#124; "Default" | - |
`select` | string[] | ApiRepository.defaultSelections["solutions"] |

**Returns:** *Promise‹any›*

___

###  retrieveEntityTypeCodes

▸ **retrieveEntityTypeCodes**(): *Promise‹any[]›*

Defined in src/repositories/apiRepository.ts:364

**Returns:** *Promise‹any[]›*

___

###  retrievePluginAssemblies

▸ **retrievePluginAssemblies**(`solutionId?`: string, `select`: string[]): *Promise‹any[]›*

Defined in src/repositories/apiRepository.ts:306

**Parameters:**

Name | Type | Default |
------ | ------ | ------ |
`solutionId?` | string | - |
`select` | string[] | ApiRepository.defaultSelections["pluginassemblies"] |

**Returns:** *Promise‹any[]›*

___

###  retrievePluginStep

▸ **retrievePluginStep**(`sdkmessageprocessingstepid`: string): *Promise‹any›*

Defined in src/repositories/apiRepository.ts:399

**Parameters:**

Name | Type |
------ | ------ |
`sdkmessageprocessingstepid` | string |

**Returns:** *Promise‹any›*

___

###  retrievePluginStepImages

▸ **retrievePluginStepImages**(`pluginStepId`: string): *Promise‹any›*

Defined in src/repositories/apiRepository.ts:442

**Parameters:**

Name | Type |
------ | ------ |
`pluginStepId` | string |

**Returns:** *Promise‹any›*

___

###  retrievePluginSteps

▸ **retrievePluginSteps**(`pluginTypeId`: string): *Promise‹any›*

Defined in src/repositories/apiRepository.ts:415

**Parameters:**

Name | Type |
------ | ------ |
`pluginTypeId` | string |

**Returns:** *Promise‹any›*

___

###  retrievePluginTypes

▸ **retrievePluginTypes**(`pluginAssemblyId`: string, `select`: string[]): *Promise‹any›*

Defined in src/repositories/apiRepository.ts:320

**Parameters:**

Name | Type | Default |
------ | ------ | ------ |
`pluginAssemblyId` | string | - |
`select` | string[] | ApiRepository.defaultSelections["pluginassemblies"] |

**Returns:** *Promise‹any›*

___

###  retrieveProcessTemplates

▸ **retrieveProcessTemplates**(`processType`: [ProcessType](../enums/_api_cdssolutions_.cdssolutions.processtype.md), `entityName`: string, `solutionId?`: string, `select`: string[]): *Promise‹any[]›*

Defined in src/repositories/apiRepository.ts:148

**Parameters:**

Name | Type | Default |
------ | ------ | ------ |
`processType` | [ProcessType](../enums/_api_cdssolutions_.cdssolutions.processtype.md) | - |
`entityName` | string | - |
`solutionId?` | string | - |
`select` | string[] | ApiRepository.defaultSelections["workflows"] |

**Returns:** *Promise‹any[]›*

___

###  retrieveProcesses

▸ **retrieveProcesses**(`entityName?`: string, `solutionId?`: string, `select`: string[]): *Promise‹any[]›*

Defined in src/repositories/apiRepository.ts:116

**Parameters:**

Name | Type | Default |
------ | ------ | ------ |
`entityName?` | string | - |
`solutionId?` | string | - |
`select` | string[] | ApiRepository.defaultSelections["workflows"] |

**Returns:** *Promise‹any[]›*

___

###  retrieveSdkMessageDetails

▸ **retrieveSdkMessageDetails**(`sdkMessageId`: string): *Promise‹any›*

Defined in src/repositories/apiRepository.ts:390

**Parameters:**

Name | Type |
------ | ------ |
`sdkMessageId` | string |

**Returns:** *Promise‹any›*

___

###  retrieveSdkMessageFilters

▸ **retrieveSdkMessageFilters**(`select`: string[]): *Promise‹unknown[]›*

Defined in src/repositories/apiRepository.ts:380

**Parameters:**

Name | Type | Default |
------ | ------ | ------ |
`select` | string[] | ApiRepository.defaultSelections["sdkmessagefilters"] |

**Returns:** *Promise‹unknown[]›*

___

###  retrieveSdkMessages

▸ **retrieveSdkMessages**(`select`: string[]): *Promise‹unknown[]›*

Defined in src/repositories/apiRepository.ts:370

**Parameters:**

Name | Type | Default |
------ | ------ | ------ |
`select` | string[] | ApiRepository.defaultSelections["sdkmessages"] |

**Returns:** *Promise‹unknown[]›*

___

###  retrieveSolution

▸ **retrieveSolution**(`solutionId`: string): *Promise‹any›*

Defined in src/repositories/apiRepository.ts:52

**Parameters:**

Name | Type |
------ | ------ |
`solutionId` | string |

**Returns:** *Promise‹any›*

___

###  retrieveSolutions

▸ **retrieveSolutions**(`select`: string[]): *Promise‹any[]›*

Defined in src/repositories/apiRepository.ts:99

**Parameters:**

Name | Type | Default |
------ | ------ | ------ |
`select` | string[] | ApiRepository.defaultSelections["solutions"] |

**Returns:** *Promise‹any[]›*

___

###  retrieveSystemUsers

▸ **retrieveSystemUsers**(`select`: string[]): *Promise‹any›*

Defined in src/repositories/apiRepository.ts:457

**Parameters:**

Name | Type | Default |
------ | ------ | ------ |
`select` | string[] | ApiRepository.defaultSelections["systemusers"] |

**Returns:** *Promise‹any›*

___

###  retrieveWebResource

▸ **retrieveWebResource**(`webResourceId`: string, `throwIfEmpty`: boolean): *Promise‹any›*

Defined in src/repositories/apiRepository.ts:270

**Parameters:**

Name | Type | Default |
------ | ------ | ------ |
`webResourceId` | string | - |
`throwIfEmpty` | boolean | true |

**Returns:** *Promise‹any›*

___

###  retrieveWebResourceFolders

▸ **retrieveWebResourceFolders**(`solutionId?`: string, `folder?`: string, `customizableOnly`: boolean): *Promise‹string[]›*

Defined in src/repositories/apiRepository.ts:180

**Parameters:**

Name | Type | Default |
------ | ------ | ------ |
`solutionId?` | string | - |
`folder?` | string | - |
`customizableOnly` | boolean | true |

**Returns:** *Promise‹string[]›*

___

###  retrieveWebResources

▸ **retrieveWebResources**(`solutionId?`: string, `folder?`: string, `customizableOnly`: boolean, `select`: string[]): *Promise‹any[]›*

Defined in src/repositories/apiRepository.ts:216

**Parameters:**

Name | Type | Default |
------ | ------ | ------ |
`solutionId?` | string | - |
`folder?` | string | - |
`customizableOnly` | boolean | true |
`select` | string[] | ApiRepository.defaultSelections["webresources"] |

**Returns:** *Promise‹any[]›*

___

###  uploadPluginAssembly

▸ **uploadPluginAssembly**(`assemblyUri`: Uri, `pluginAssemblyId?`: string, `isSandboxed`: boolean): *Thenable‹any›*

Defined in src/repositories/apiRepository.ts:469

**Parameters:**

Name | Type | Default |
------ | ------ | ------ |
`assemblyUri` | Uri | - |
`pluginAssemblyId?` | string | - |
`isSandboxed` | boolean | true |

**Returns:** *Thenable‹any›*

___

###  upsertPluginStep

▸ **upsertPluginStep**(`step`: any): *Promise‹any›*

Defined in src/repositories/apiRepository.ts:517

**Parameters:**

Name | Type |
------ | ------ |
`step` | any |

**Returns:** *Promise‹any›*

___

###  upsertPluginStepImage

▸ **upsertPluginStepImage**(`stepImage`: any): *Promise‹any›*

Defined in src/repositories/apiRepository.ts:586

**Parameters:**

Name | Type |
------ | ------ |
`stepImage` | any |

**Returns:** *Promise‹any›*

___

###  upsertPluginType

▸ **upsertPluginType**(`pluginAssemblyId`: string, `typeName`: string, `name`: string, `friendlyName`: string, `description?`: string): *Promise‹void›*

Defined in src/repositories/apiRepository.ts:337

**Parameters:**

Name | Type | Default |
------ | ------ | ------ |
`pluginAssemblyId` | string | - |
`typeName` | string | - |
`name` | string | typeName |
`friendlyName` | string | typeName |
`description?` | string | - |

**Returns:** *Promise‹void›*

___

###  upsertWebResource

▸ **upsertWebResource**(`webResource`: any): *Promise‹any›*

Defined in src/repositories/apiRepository.ts:290

**Parameters:**

Name | Type |
------ | ------ |
`webResource` | any |

**Returns:** *Promise‹any›*

___

###  whoAmI

▸ **whoAmI**(): *Promise‹any›*

Defined in src/repositories/apiRepository.ts:48

**Returns:** *Promise‹any›*
