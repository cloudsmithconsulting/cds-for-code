[cds-for-code](../README.md) › [Globals](../globals.md) › ["api/CdsUrlResolver"](../modules/_api_cdsurlresolver_.md) › [CdsUrlResolver](_api_cdsurlresolver_.cdsurlresolver.md)

# Class: CdsUrlResolver

A class for resolving URLs to CDS

**`export`** 

**`class`** CdsUrlResolver

## Hierarchy

* **CdsUrlResolver**

## Index

### Methods

* [addPowerAppsSource](_api_cdsurlresolver_.cdsurlresolver.md#static-private-addpowerappssource)
* [addSolutionToUri](_api_cdsurlresolver_.cdsurlresolver.md#static-private-addsolutiontouri)
* [crmGuid](_api_cdsurlresolver_.cdsurlresolver.md#static-private-crmguid)
* [escapeOptions](_api_cdsurlresolver_.cdsurlresolver.md#static-private-escapeoptions)
* [getAppBaseUrl](_api_cdsurlresolver_.cdsurlresolver.md#static-private-getappbaseurl)
* [getManageAppUri](_api_cdsurlresolver_.cdsurlresolver.md#static-getmanageappuri)
* [getManageAttributeUri](_api_cdsurlresolver_.cdsurlresolver.md#static-getmanageattributeuri)
* [getManageBusinessProcessUri](_api_cdsurlresolver_.cdsurlresolver.md#static-getmanagebusinessprocessuri)
* [getManageEntityChartUrl](_api_cdsurlresolver_.cdsurlresolver.md#static-getmanageentitycharturl)
* [getManageEntityDashboardUri](_api_cdsurlresolver_.cdsurlresolver.md#static-getmanageentitydashboarduri)
* [getManageEntityFormUri](_api_cdsurlresolver_.cdsurlresolver.md#static-getmanageentityformuri)
* [getManageEntityKeyUrl](_api_cdsurlresolver_.cdsurlresolver.md#static-getmanageentitykeyurl)
* [getManageEntityRelationshipUrl](_api_cdsurlresolver_.cdsurlresolver.md#static-getmanageentityrelationshipurl)
* [getManageEntityUri](_api_cdsurlresolver_.cdsurlresolver.md#static-getmanageentityuri)
* [getManageEntityViewUri](_api_cdsurlresolver_.cdsurlresolver.md#static-getmanageentityviewuri)
* [getManageOptionSetUri](_api_cdsurlresolver_.cdsurlresolver.md#static-getmanageoptionseturi)
* [getManageSolutionUri](_api_cdsurlresolver_.cdsurlresolver.md#static-getmanagesolutionuri)
* [getManageWebResourceUri](_api_cdsurlresolver_.cdsurlresolver.md#static-getmanagewebresourceuri)
* [getOpenAppUsingBrowserUri](_api_cdsurlresolver_.cdsurlresolver.md#static-getopenappusingbrowseruri)
* [getOpenEntityDashboardUsingAppUrl](_api_cdsurlresolver_.cdsurlresolver.md#static-getopenentitydashboardusingappurl)
* [getOpenEntityFormUri](_api_cdsurlresolver_.cdsurlresolver.md#static-getopenentityformuri)
* [getOpenEntityUsingAppUrl](_api_cdsurlresolver_.cdsurlresolver.md#static-getopenentityusingappurl)
* [getOpenEntityViewUri](_api_cdsurlresolver_.cdsurlresolver.md#static-getopenentityviewuri)
* [getOpenEntityViewUsingAppUrl](_api_cdsurlresolver_.cdsurlresolver.md#static-getopenentityviewusingappurl)
* [hasPowerAppsExperience](_api_cdsurlresolver_.cdsurlresolver.md#static-private-haspowerappsexperience)
* [parseFormType](_api_cdsurlresolver_.cdsurlresolver.md#static-parseformtype)
* [parseProcessType](_api_cdsurlresolver_.cdsurlresolver.md#static-parseprocesstype)
* [parseSolutionComponent](_api_cdsurlresolver_.cdsurlresolver.md#static-parsesolutioncomponent)

## Methods

### `Static` `Private` addPowerAppsSource

▸ **addPowerAppsSource**(`uriString`: string): *string*

Defined in src/api/CdsUrlResolver.ts:621

Adds the source query string parameter to a powerapps URI

**`static`** 

**`memberof`** CdsUrlResolvercds

**Parameters:**

Name | Type |
------ | ------ |
`uriString` | string |

**Returns:** *string*

___

### `Static` `Private` addSolutionToUri

▸ **addSolutionToUri**(`uriString`: string, `solutionId?`: string): *string*

Defined in src/api/CdsUrlResolver.ts:599

Adds the solution id to the URI

**`static`** 

**`memberof`** CdsUrlResolver

**Parameters:**

Name | Type |
------ | ------ |
`uriString` | string |
`solutionId?` | string |

**Returns:** *string*

___

### `Static` `Private` crmGuid

▸ **crmGuid**(`value`: string): *string*

Defined in src/api/CdsUrlResolver.ts:569

URL encodes a GUID for passing to web URI

**`static`** 

**`memberof`** CdsUrlResolver

**Parameters:**

Name | Type |
------ | ------ |
`value` | string |

**Returns:** *string*

___

### `Static` `Private` escapeOptions

▸ **escapeOptions**(`options`: any): *string*

Defined in src/api/CdsUrlResolver.ts:582

Escapes the options and returns a query string

**`static`** 

**`memberof`** CdsUrlResolver

**Parameters:**

Name | Type |
------ | ------ |
`options` | any |

**Returns:** *string*

___

### `Static` `Private` getAppBaseUrl

▸ **getAppBaseUrl**(`config`: [Config](../interfaces/_api_cds_webapi_cdswebapi_.cdswebapi.config.md)): *string*

Defined in src/api/CdsUrlResolver.ts:652

Gets the app base URL

**`static`** 

**`memberof`** CdsUrlResolver

**Parameters:**

Name | Type |
------ | ------ |
`config` | [Config](../interfaces/_api_cds_webapi_cdswebapi_.cdswebapi.config.md) |

**Returns:** *string*

___

### `Static` getManageAppUri

▸ **getManageAppUri**(`config`: [Config](../interfaces/_api_cds_webapi_cdswebapi_.cdswebapi.config.md), `app?`: any, `solution?`: any): *string*

Defined in src/api/CdsUrlResolver.ts:60

Gets the URI to manage a Model App

**`static`** 

**`memberof`** CdsUrlResolver

**Parameters:**

Name | Type |
------ | ------ |
`config` | [Config](../interfaces/_api_cds_webapi_cdswebapi_.cdswebapi.config.md) |
`app?` | any |
`solution?` | any |

**Returns:** *string*

___

### `Static` getManageAttributeUri

▸ **getManageAttributeUri**(`config`: [Config](../interfaces/_api_cds_webapi_cdswebapi_.cdswebapi.config.md), `entityId`: string, `attributeId?`: string, `solutionId?`: string): *string*

Defined in src/api/CdsUrlResolver.ts:163

Gets the URI to manage the attribute

**`static`** 

**`memberof`** CdsUrlResolver

**Parameters:**

Name | Type |
------ | ------ |
`config` | [Config](../interfaces/_api_cds_webapi_cdswebapi_.cdswebapi.config.md) |
`entityId` | string |
`attributeId?` | string |
`solutionId?` | string |

**Returns:** *string*

___

### `Static` getManageBusinessProcessUri

▸ **getManageBusinessProcessUri**(`config`: [Config](../interfaces/_api_cds_webapi_cdswebapi_.cdswebapi.config.md), `processType`: [ProcessType](../enums/_api_cdssolutions_.cdssolutions.processtype.md), `processId?`: string, `solutionId?`: string, `entityTypeCode?`: number): *string*

Defined in src/api/CdsUrlResolver.ts:468

Gets the URI for managing business processes

**`static`** 

**`memberof`** CdsUrlResolver

**Parameters:**

Name | Type |
------ | ------ |
`config` | [Config](../interfaces/_api_cds_webapi_cdswebapi_.cdswebapi.config.md) |
`processType` | [ProcessType](../enums/_api_cdssolutions_.cdssolutions.processtype.md) |
`processId?` | string |
`solutionId?` | string |
`entityTypeCode?` | number |

**Returns:** *string*

___

### `Static` getManageEntityChartUrl

▸ **getManageEntityChartUrl**(`config`: [Config](../interfaces/_api_cds_webapi_cdswebapi_.cdswebapi.config.md), `entityTypeCode?`: string, `chartId?`: string, `solutionId?`: string): *string*

Defined in src/api/CdsUrlResolver.ts:397

Gets the URL for managing the entity chart

**`static`** 

**`memberof`** CdsUrlResolver

**Parameters:**

Name | Type |
------ | ------ |
`config` | [Config](../interfaces/_api_cds_webapi_cdswebapi_.cdswebapi.config.md) |
`entityTypeCode?` | string |
`chartId?` | string |
`solutionId?` | string |

**Returns:** *string*

___

### `Static` getManageEntityDashboardUri

▸ **getManageEntityDashboardUri**(`config`: [Config](../interfaces/_api_cds_webapi_cdswebapi_.cdswebapi.config.md), `entityTypeCode?`: string, `layoutType?`: [InteractiveDashboardLayout](../enums/_api_cdssolutions_.cdssolutions.interactivedashboardlayout.md), `dashboardType?`: string, `dashboardId?`: string, `solutionId?`: string): *string*

Defined in src/api/CdsUrlResolver.ts:360

Gets the URI for managing the entity dashboard

**`static`** 

**`memberof`** CdsUrlResolver

**Parameters:**

Name | Type |
------ | ------ |
`config` | [Config](../interfaces/_api_cds_webapi_cdswebapi_.cdswebapi.config.md) |
`entityTypeCode?` | string |
`layoutType?` | [InteractiveDashboardLayout](../enums/_api_cdssolutions_.cdssolutions.interactivedashboardlayout.md) |
`dashboardType?` | string |
`dashboardId?` | string |
`solutionId?` | string |

**Returns:** *string*

___

### `Static` getManageEntityFormUri

▸ **getManageEntityFormUri**(`config`: [Config](../interfaces/_api_cds_webapi_cdswebapi_.cdswebapi.config.md), `entityTypeCode`: string, `formType`: [DynamicsForm](../enums/_api_cdssolutions_.cdssolutions.dynamicsform.md), `formId?`: string, `solutionId?`: string): *string*

Defined in src/api/CdsUrlResolver.ts:234

Gets the URI for managing the entity form

**`static`** 

**`memberof`** CdsUrlResolver

**Parameters:**

Name | Type | Default |
------ | ------ | ------ |
`config` | [Config](../interfaces/_api_cds_webapi_cdswebapi_.cdswebapi.config.md) | - |
`entityTypeCode` | string | - |
`formType` | [DynamicsForm](../enums/_api_cdssolutions_.cdssolutions.dynamicsform.md) | CdsSolutions.DynamicsForm.Main |
`formId?` | string | - |
`solutionId?` | string | - |

**Returns:** *string*

___

### `Static` getManageEntityKeyUrl

▸ **getManageEntityKeyUrl**(`config`: [Config](../interfaces/_api_cds_webapi_cdswebapi_.cdswebapi.config.md), `entityId?`: string, `keyId?`: string, `solutionId?`: string): *string*

Defined in src/api/CdsUrlResolver.ts:423

Gets the URL for managing the entity keys

**`static`** 

**`memberof`** CdsUrlResolver

**Parameters:**

Name | Type |
------ | ------ |
`config` | [Config](../interfaces/_api_cds_webapi_cdswebapi_.cdswebapi.config.md) |
`entityId?` | string |
`keyId?` | string |
`solutionId?` | string |

**Returns:** *string*

___

### `Static` getManageEntityRelationshipUrl

▸ **getManageEntityRelationshipUrl**(`config`: [Config](../interfaces/_api_cds_webapi_cdswebapi_.cdswebapi.config.md), `entityId?`: string, `relationshipId?`: string, `solutionId?`: string): *string*

Defined in src/api/CdsUrlResolver.ts:444

Gets the URL for managing entity relationships

**`static`** 

**`memberof`** CdsUrlResolver

**Parameters:**

Name | Type |
------ | ------ |
`config` | [Config](../interfaces/_api_cds_webapi_cdswebapi_.cdswebapi.config.md) |
`entityId?` | string |
`relationshipId?` | string |
`solutionId?` | string |

**Returns:** *string*

___

### `Static` getManageEntityUri

▸ **getManageEntityUri**(`config`: [Config](../interfaces/_api_cds_webapi_cdswebapi_.cdswebapi.config.md), `entity?`: any, `solution?`: any): *string*

Defined in src/api/CdsUrlResolver.ts:126

Gets the URI to manage the entity

**`static`** 

**`memberof`** CdsUrlResolver

**Parameters:**

Name | Type |
------ | ------ |
`config` | [Config](../interfaces/_api_cds_webapi_cdswebapi_.cdswebapi.config.md) |
`entity?` | any |
`solution?` | any |

**Returns:** *string*

___

### `Static` getManageEntityViewUri

▸ **getManageEntityViewUri**(`config`: [Config](../interfaces/_api_cds_webapi_cdswebapi_.cdswebapi.config.md), `entityId`: string, `entityTypeCode?`: string, `viewId?`: string, `solutionId?`: string): *string*

Defined in src/api/CdsUrlResolver.ts:307

Gets the URI for managing the entity view

**`static`** 

**`memberof`** CdsUrlResolver

**Parameters:**

Name | Type |
------ | ------ |
`config` | [Config](../interfaces/_api_cds_webapi_cdswebapi_.cdswebapi.config.md) |
`entityId` | string |
`entityTypeCode?` | string |
`viewId?` | string |
`solutionId?` | string |

**Returns:** *string*

___

### `Static` getManageOptionSetUri

▸ **getManageOptionSetUri**(`config`: [Config](../interfaces/_api_cds_webapi_cdswebapi_.cdswebapi.config.md), `entityId?`: string, `entityTypeCode?`: string, `optionSetId?`: string, `solutionId?`: string): *string*

Defined in src/api/CdsUrlResolver.ts:542

Gets the URI for managing the option set

**`static`** 

**`memberof`** CdsUrlResolver

**Parameters:**

Name | Type |
------ | ------ |
`config` | [Config](../interfaces/_api_cds_webapi_cdswebapi_.cdswebapi.config.md) |
`entityId?` | string |
`entityTypeCode?` | string |
`optionSetId?` | string |
`solutionId?` | string |

**Returns:** *string*

___

### `Static` getManageSolutionUri

▸ **getManageSolutionUri**(`config`: [Config](../interfaces/_api_cds_webapi_cdswebapi_.cdswebapi.config.md), `solution?`: any): *string*

Defined in src/api/CdsUrlResolver.ts:100

Gets the URI to manage the solution

**`static`** 

**`memberof`** CdsUrlResolver

**Parameters:**

Name | Type |
------ | ------ |
`config` | [Config](../interfaces/_api_cds_webapi_cdswebapi_.cdswebapi.config.md) |
`solution?` | any |

**Returns:** *string*

___

### `Static` getManageWebResourceUri

▸ **getManageWebResourceUri**(`config`: [Config](../interfaces/_api_cds_webapi_cdswebapi_.cdswebapi.config.md), `webResourceId?`: string, `solutionId?`: string): *string*

Defined in src/api/CdsUrlResolver.ts:520

Gets the URI for managing the web resource

**`static`** 

**`memberof`** CdsUrlResolver

**Parameters:**

Name | Type |
------ | ------ |
`config` | [Config](../interfaces/_api_cds_webapi_cdswebapi_.cdswebapi.config.md) |
`webResourceId?` | string |
`solutionId?` | string |

**Returns:** *string*

___

### `Static` getOpenAppUsingBrowserUri

▸ **getOpenAppUsingBrowserUri**(`config`: [Config](../interfaces/_api_cds_webapi_cdswebapi_.cdswebapi.config.md), `app`: any): *string*

Defined in src/api/CdsUrlResolver.ts:86

Gets the URI for opening the app in the user's browser

**`static`** 

**`memberof`** CdsUrlResolver

**Parameters:**

Name | Type |
------ | ------ |
`config` | [Config](../interfaces/_api_cds_webapi_cdswebapi_.cdswebapi.config.md) |
`app` | any |

**Returns:** *string*

___

### `Static` getOpenEntityDashboardUsingAppUrl

▸ **getOpenEntityDashboardUsingAppUrl**(`dashboardId`: string): *string*

Defined in src/api/CdsUrlResolver.ts:341

Gets the URL for opening the entity dasboard in the dynamics client app

**`static`** 

**`memberof`** CdsUrlResolver

**Parameters:**

Name | Type |
------ | ------ |
`dashboardId` | string |

**Returns:** *string*

___

### `Static` getOpenEntityFormUri

▸ **getOpenEntityFormUri**(`config`: [Config](../interfaces/_api_cds_webapi_cdswebapi_.cdswebapi.config.md), `entityLogicalName`: string, `formId?`: string, `showNavigationBar`: boolean, `showCommandBar`: boolean): *string*

Defined in src/api/CdsUrlResolver.ts:204

Gets the URI for opening the entity form

**`static`** 

**`memberof`** CdsUrlResolver

**Parameters:**

Name | Type | Default |
------ | ------ | ------ |
`config` | [Config](../interfaces/_api_cds_webapi_cdswebapi_.cdswebapi.config.md) | - |
`entityLogicalName` | string | - |
`formId?` | string | - |
`showNavigationBar` | boolean | true |
`showCommandBar` | boolean | true |

**Returns:** *string*

___

### `Static` getOpenEntityUsingAppUrl

▸ **getOpenEntityUsingAppUrl**(`entityLogicalName`: string, `entityId?`: string): *string*

Defined in src/api/CdsUrlResolver.ts:182

Gets the URL for opening the entity in the dynamics client app

**`static`** 

**`memberof`** CdsUrlResolver

**Parameters:**

Name | Type |
------ | ------ |
`entityLogicalName` | string |
`entityId?` | string |

**Returns:** *string*

___

### `Static` getOpenEntityViewUri

▸ **getOpenEntityViewUri**(`config`: [Config](../interfaces/_api_cds_webapi_cdswebapi_.cdswebapi.config.md), `entityLogicalName`: string, `viewId`: string, `showNavigationBar`: boolean, `showCommandBar`: boolean): *string*

Defined in src/api/CdsUrlResolver.ts:281

Gets the URI for opening the entity view

**`static`** 

**`memberof`** CdsUrlResolver

**Parameters:**

Name | Type | Default |
------ | ------ | ------ |
`config` | [Config](../interfaces/_api_cds_webapi_cdswebapi_.cdswebapi.config.md) | - |
`entityLogicalName` | string | - |
`viewId` | string | - |
`showNavigationBar` | boolean | true |
`showCommandBar` | boolean | true |

**Returns:** *string*

___

### `Static` getOpenEntityViewUsingAppUrl

▸ **getOpenEntityViewUsingAppUrl**(`entityLogicalName`: string, `viewId?`: string): *string*

Defined in src/api/CdsUrlResolver.ts:259

Gets the URL for opening an entity view in the dynamics client app

**`static`** 

**`memberof`** CdsUrlResolver

**Parameters:**

Name | Type |
------ | ------ |
`entityLogicalName` | string |
`viewId?` | string |

**Returns:** *string*

___

### `Static` `Private` hasPowerAppsExperience

▸ **hasPowerAppsExperience**(`config`: [Config](../interfaces/_api_cds_webapi_cdswebapi_.cdswebapi.config.md)): *boolean*

Defined in src/api/CdsUrlResolver.ts:638

Determines if the config supports the power apps experience

**`static`** 

**`memberof`** CdsUrlResolver

**Parameters:**

Name | Type |
------ | ------ |
`config` | [Config](../interfaces/_api_cds_webapi_cdswebapi_.cdswebapi.config.md) |

**Returns:** *boolean*

___

### `Static` parseFormType

▸ **parseFormType**(`formType`: number): *[DynamicsForm](../enums/_api_cdssolutions_.cdssolutions.dynamicsform.md)*

Defined in src/api/CdsUrlResolver.ts:22

Parses the form type

**`static`** 

**`memberof`** CdsUrlResolver

**Parameters:**

Name | Type |
------ | ------ |
`formType` | number |

**Returns:** *[DynamicsForm](../enums/_api_cdssolutions_.cdssolutions.dynamicsform.md)*

___

### `Static` parseProcessType

▸ **parseProcessType**(`processType`: number): *[ProcessType](../enums/_api_cdssolutions_.cdssolutions.processtype.md)*

Defined in src/api/CdsUrlResolver.ts:34

Parses the process type

**`static`** 

**`memberof`** CdsUrlResolver

**Parameters:**

Name | Type |
------ | ------ |
`processType` | number |

**Returns:** *[ProcessType](../enums/_api_cdssolutions_.cdssolutions.processtype.md)*

___

### `Static` parseSolutionComponent

▸ **parseSolutionComponent**(`solutionComponent`: number): *[SolutionComponent](../enums/_api_cdssolutions_.cdssolutions.solutioncomponent.md)*

Defined in src/api/CdsUrlResolver.ts:46

Parses the solution component

**`static`** 

**`memberof`** CdsUrlResolver

**Parameters:**

Name | Type |
------ | ------ |
`solutionComponent` | number |

**Returns:** *[SolutionComponent](../enums/_api_cdssolutions_.cdssolutions.solutioncomponent.md)*
