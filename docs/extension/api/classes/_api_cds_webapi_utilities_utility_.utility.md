---
id: "_api_cds_webapi_utilities_utility_.utility"
title: "Utility"
sidebar_label: "Utility"
---

[cds-for-code](../index.md) › [Globals](../globals.md) › ["api/cds-webapi/utilities/Utility"](../modules/_api_cds_webapi_utilities_utility_.md) › [Utility](_api_cds_webapi_utilities_utility_.utility.md)

## Hierarchy

* **Utility**

## Index

### Properties

* [buildFunctionParameters](_api_cds_webapi_utilities_utility_.utility.md#static-buildfunctionparameters)
* [convertToReferenceObject](_api_cds_webapi_utilities_utility_.utility.md#static-converttoreferenceobject)
* [getFetchXmlPagingCookie](_api_cds_webapi_utilities_utility_.utility.md#static-getfetchxmlpagingcookie)

### Methods

* [crmHostSuffix](_api_cds_webapi_utilities_utility_.utility.md#static-crmhostsuffix)
* [generateUUID](_api_cds_webapi_utilities_utility_.utility.md#static-generateuuid)
* [getClientUrl](_api_cds_webapi_utilities_utility_.utility.md#static-getclienturl)
* [getXrmContext](_api_cds_webapi_utilities_utility_.utility.md#static-getxrmcontext)
* [getXrmInternal](_api_cds_webapi_utilities_utility_.utility.md#static-getxrminternal)
* [getXrmUtility](_api_cds_webapi_utilities_utility_.utility.md#static-getxrmutility)
* [initDiscoveryApiUrl](_api_cds_webapi_utilities_utility_.utility.md#static-initdiscoveryapiurl)
* [initWebApiUrl](_api_cds_webapi_utilities_utility_.utility.md#static-initwebapiurl)
* [isNull](_api_cds_webapi_utilities_utility_.utility.md#static-isnull)

## Properties

### `Static` buildFunctionParameters

▪ **buildFunctionParameters**: *function* = buildFunctionParameters.bind(Utility)

Defined in src/api/cds-webapi/utilities/Utility.ts:15

Builds parametes for a funciton. Returns '()' (if no parameters) or '([params])?[query]'

**`param`** Function's input parameters. Example: { param1: "test", param2: 3 }.

**`returns`** 

#### Type declaration:

▸ (`parameters`: any): *string*

**Parameters:**

Name | Type |
------ | ------ |
`parameters` | any |

___

### `Static` convertToReferenceObject

▪ **convertToReferenceObject**: *function* = convertToReferenceObject.bind(Utility)

Defined in src/api/cds-webapi/utilities/Utility.ts:32

Converts a response to a reference object

**`param`** Response object

**`returns`** 

#### Type declaration:

▸ (`responseData`: Object): *[ReferenceObject](../interfaces/_api_cds_webapi_odata_converttoreferenceobject_.referenceobject.md)*

**Parameters:**

Name | Type |
------ | ------ |
`responseData` | Object |

___

### `Static` getFetchXmlPagingCookie

▪ **getFetchXmlPagingCookie**: *function* = getFetchXmlPagingCookie.bind(Utility)

Defined in src/api/cds-webapi/utilities/Utility.ts:24

Parses a paging cookie returned in response

**`param`** Page cookies returned in @Microsoft.Dynamics.CRM.fetchxmlpagingcookie.

**`param`** A current page number. Fix empty paging-cookie for complex fetch xmls.

**`returns`** 

#### Type declaration:

▸ (`pageCookies`: string, `currentPageNumber`: number): *object*

**Parameters:**

Name | Type |
------ | ------ |
`pageCookies` | string |
`currentPageNumber` | number |

* **cookie**: *string*

* **nextPage**: *number*

* **page**: *number*

## Methods

### `Static` crmHostSuffix

▸ **crmHostSuffix**(`url`: string): *string*

Defined in src/api/cds-webapi/utilities/Utility.ts:97

**Parameters:**

Name | Type |
------ | ------ |
`url` | string |

**Returns:** *string*

___

### `Static` generateUUID

▸ **generateUUID**(): *string*

Defined in src/api/cds-webapi/utilities/Utility.ts:41

**Returns:** *string*

___

### `Static` getClientUrl

▸ **getClientUrl**(): *string*

Defined in src/api/cds-webapi/utilities/Utility.ts:62

**Returns:** *string*

___

### `Static` getXrmContext

▸ **getXrmContext**(): *GlobalContext*

Defined in src/api/cds-webapi/utilities/Utility.ts:43

**Returns:** *GlobalContext*

___

### `Static` getXrmInternal

▸ **getXrmInternal**(): *any*

Defined in src/api/cds-webapi/utilities/Utility.ts:109

**Returns:** *any*

___

### `Static` getXrmUtility

▸ **getXrmUtility**(): *Utility | undefined*

Defined in src/api/cds-webapi/utilities/Utility.ts:114

**Returns:** *Utility | undefined*

___

### `Static` initDiscoveryApiUrl

▸ **initDiscoveryApiUrl**(`prefix`: string, `version`: string, `configType?`: [ConfigType](../enums/_api_cds_webapi_cdswebapi_.cdswebapi.configtype.md)): *string*

Defined in src/api/cds-webapi/utilities/Utility.ts:83

**Parameters:**

Name | Type | Default |
------ | ------ | ------ |
`prefix` | string | this.getClientUrl() |
`version` | string | "8.2" |
`configType?` | [ConfigType](../enums/_api_cds_webapi_cdswebapi_.cdswebapi.configtype.md) | - |

**Returns:** *string*

___

### `Static` initWebApiUrl

▸ **initWebApiUrl**(`prefix`: string, `version`: string): *string*

Defined in src/api/cds-webapi/utilities/Utility.ts:73

**Parameters:**

Name | Type | Default |
------ | ------ | ------ |
`prefix` | string | this.getClientUrl() |
`version` | string | "8.2" |

**Returns:** *string*

___

### `Static` isNull

▸ **isNull**(`value`: any): *boolean*

Defined in src/api/cds-webapi/utilities/Utility.ts:39

Checks whether the value is JS Null.

**Parameters:**

Name | Type |
------ | ------ |
`value` | any |

**Returns:** *boolean*
