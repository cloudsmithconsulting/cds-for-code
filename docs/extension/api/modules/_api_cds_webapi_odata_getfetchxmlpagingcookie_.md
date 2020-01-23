---
id: "_api_cds_webapi_odata_getfetchxmlpagingcookie_"
title: "api/cds-webapi/odata/getFetchXmlPagingCookie"
sidebar_label: "api/cds-webapi/odata/getFetchXmlPagingCookie"
---

[cds-for-code](../index.md) › [Globals](../globals.md) › ["api/cds-webapi/odata/getFetchXmlPagingCookie"](_api_cds_webapi_odata_getfetchxmlpagingcookie_.md)

## Index

### Functions

* [getFetchXmlPagingCookie](_api_cds_webapi_odata_getfetchxmlpagingcookie_.md#getfetchxmlpagingcookie)

## Functions

###  getFetchXmlPagingCookie

▸ **getFetchXmlPagingCookie**(`pageCookies`: string, `currentPageNumber`: number): *object*

Defined in src/api/cds-webapi/odata/getFetchXmlPagingCookie.ts:8

Parses a paging cookie returned in response

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`pageCookies` | string | Page cookies returned in @Microsoft.Dynamics.CRM.fetchxmlpagingcookie. |
`currentPageNumber` | number | A current page number. Fix empty paging-cookie for complex fetch xmls. |

**Returns:** *object*

* **cookie**: *string*

* **nextPage**: *number*

* **page**: *number*
