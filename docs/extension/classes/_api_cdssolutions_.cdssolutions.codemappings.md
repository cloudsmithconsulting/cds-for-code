[cds-for-code](../README.md) › [Globals](../globals.md) › ["api/CdsSolutions"](../modules/_api_cdssolutions_.md) › [CdsSolutions](../modules/_api_cdssolutions_.cdssolutions.md) › [CodeMappings](_api_cdssolutions_.cdssolutions.codemappings.md)

# Class: CodeMappings

## Hierarchy

* **CodeMappings**

## Index

### Properties

* [DynamicsForms](_api_cdssolutions_.cdssolutions.codemappings.md#static-dynamicsforms)
* [InteractiveDashboardLayouts](_api_cdssolutions_.cdssolutions.codemappings.md#static-interactivedashboardlayouts)
* [ProcessTypes](_api_cdssolutions_.cdssolutions.codemappings.md#static-processtypes)
* [SolutionComponents](_api_cdssolutions_.cdssolutions.codemappings.md#static-solutioncomponents)
* [WebResources](_api_cdssolutions_.cdssolutions.codemappings.md#static-webresources)

### Methods

* [getDynamicsFormCode](_api_cdssolutions_.cdssolutions.codemappings.md#static-getdynamicsformcode)
* [getInteractiveDashboardLayout](_api_cdssolutions_.cdssolutions.codemappings.md#static-getinteractivedashboardlayout)
* [getProcessTypeCode](_api_cdssolutions_.cdssolutions.codemappings.md#static-getprocesstypecode)
* [getSolutionComponentCode](_api_cdssolutions_.cdssolutions.codemappings.md#static-getsolutioncomponentcode)
* [getWebResourceTypeCode](_api_cdssolutions_.cdssolutions.codemappings.md#static-getwebresourcetypecode)

## Properties

### `Static` DynamicsForms

▪ **DynamicsForms**: *[Dictionary](_core_types_dictionary_.dictionary.md)‹[DynamicsForm](../enums/_api_cdssolutions_.cdssolutions.dynamicsform.md), number›* = new Dictionary<DynamicsForm, number>([
            { value: 0, key: DynamicsForm.Dashboard },
            { value: 1, key: DynamicsForm.AppointmentBook },
            { value: 2, key: DynamicsForm.Main },
            { value: 3, key: DynamicsForm.MiniCampaignBO },
            { value: 4, key: DynamicsForm.Preview },
            { value: 5, key: DynamicsForm.MobileExpress },
            { value: 6, key: DynamicsForm.QuickView },
            { value: 7, key: DynamicsForm.QuickCreate },
            { value: 8, key: DynamicsForm.Dialog },
            { value: 9, key: DynamicsForm.TaskFlow },
            { value: 10, key: DynamicsForm.InteractionCentricDashboard },
            { value: 11, key: DynamicsForm.ActionCard },
            { value: 12, key: DynamicsForm.MainInteractive },
            { value: 100, key: DynamicsForm.Other },
            { value: 101, key: DynamicsForm.MainBackup },
            { value: 102, key: DynamicsForm.AppointmentBookBackup },
            { value: 103, key: DynamicsForm.PowerBIDashboard }
        ])

Defined in src/api/CdsSolutions.ts:169

___

### `Static` InteractiveDashboardLayouts

▪ **InteractiveDashboardLayouts**: *[Dictionary](_core_types_dictionary_.dictionary.md)‹[InteractiveDashboardLayout](../enums/_api_cdssolutions_.cdssolutions.interactivedashboardlayout.md), number›* = new Dictionary<InteractiveDashboardLayout, number>([
            { value: 7, key: InteractiveDashboardLayout._4ColumnOverview },
            { value: 8, key: InteractiveDashboardLayout._3ColumnOverview },
            { value: 9, key: InteractiveDashboardLayout._2ColumnOverview },
            { value: 10, key: InteractiveDashboardLayout._3ColumnOverviewVariableWidth }
        ])

Defined in src/api/CdsSolutions.ts:162

___

### `Static` ProcessTypes

▪ **ProcessTypes**: *[Dictionary](_core_types_dictionary_.dictionary.md)‹[ProcessType](../enums/_api_cdssolutions_.cdssolutions.processtype.md), number›* = new Dictionary<ProcessType, number>([
            { value: 0, key: ProcessType.Workflow },
            { value: 1, key: ProcessType.Dialog },
            { value: 2, key: ProcessType.BusinessRule },
            { value: 3, key: ProcessType.Action },
            { value: 4, key: ProcessType.BusinessProcessFlow },
            { value: 5, key: ProcessType.Flow }
        ])

Defined in src/api/CdsSolutions.ts:189

___

### `Static` SolutionComponents

▪ **SolutionComponents**: *[Dictionary](_core_types_dictionary_.dictionary.md)‹[SolutionComponent](../enums/_api_cdssolutions_.cdssolutions.solutioncomponent.md), number›* = new Dictionary<SolutionComponent, number>([
            { value: 1, key: SolutionComponent.Entity }, 
            { value: 2, key: SolutionComponent.Attribute }, 
            { value: 3, key: SolutionComponent.Relationship }, 
            { value: 4, key: SolutionComponent.AttributePicklistValue }, 
            { value: 5, key: SolutionComponent.AttributeLookupValue }, 
            { value: 6, key: SolutionComponent.ViewAttribute }, 
            { value: 7, key: SolutionComponent.LocalizedLabel }, 
            { value: 8, key: SolutionComponent.RelationshipExtraCondition }, 
            { value: 9, key: SolutionComponent.OptionSet }, 
            { value: 10, key: SolutionComponent.EntityRelationship }, 
            { value: 11, key: SolutionComponent.EntityRelationshipRole }, 
            { value: 12, key: SolutionComponent.EntityRelationshipRelationships }, 
            { value: 13, key: SolutionComponent.ManagedProperty }, 
            { value: 14, key: SolutionComponent.EntityKey }, 
            { value: 16, key: SolutionComponent.Privilege }, 
            { value: 17, key: SolutionComponent.PrivilegeObjectTypeCode }, 
            { value: 18, key: SolutionComponent.Index }, 
            { value: 20, key: SolutionComponent.Role }, 
            { value: 21, key: SolutionComponent.RolePrivilege }, 
            { value: 22, key: SolutionComponent.DisplayString }, 
            { value: 23, key: SolutionComponent.DisplayStringMap }, 
            { value: 24, key: SolutionComponent.Form }, 
            { value: 25, key: SolutionComponent.Organization }, 
            { value: 26, key: SolutionComponent.SavedQuery }, 
            { value: 29, key: SolutionComponent.Workflow }, 
            { value: 31, key: SolutionComponent.Report }, 
            { value: 32, key: SolutionComponent.ReportEntity }, 
            { value: 33, key: SolutionComponent.ReportCategory }, 
            { value: 34, key: SolutionComponent.ReportVisibility }, 
            { value: 35, key: SolutionComponent.Attachment }, 
            { value: 36, key: SolutionComponent.EmailTemplate }, 
            { value: 37, key: SolutionComponent.ContractTemplate }, 
            { value: 38, key: SolutionComponent.KBArticleTemplate }, 
            { value: 39, key: SolutionComponent.MailMergeTemplate }, 
            { value: 44, key: SolutionComponent.DuplicateRule }, 
            { value: 45, key: SolutionComponent.DuplicateRuleCondition }, 
            { value: 46, key: SolutionComponent.EntityMap }, 
            { value: 47, key: SolutionComponent.AttributeMap }, 
            { value: 48, key: SolutionComponent.RibbonCommand }, 
            { value: 49, key: SolutionComponent.RibbonContextGroup }, 
            { value: 50, key: SolutionComponent.RibbonCustomization }, 
            { value: 52, key: SolutionComponent.RibbonRule }, 
            { value: 53, key: SolutionComponent.RibbonTabToCommandMap }, 
            { value: 55, key: SolutionComponent.RibbonDiff }, 
            { value: 59, key: SolutionComponent.SavedQueryVisualization }, 
            { value: 60, key: SolutionComponent.SystemForm }, 
            { value: 61, key: SolutionComponent.WebResource }, 
            { value: 62, key: SolutionComponent.SiteMap }, 
            { value: 63, key: SolutionComponent.ConnectionRole }, 
            { value: 64, key: SolutionComponent.ComplexControl }, 
            { value: 65, key: SolutionComponent.HierarchyRule }, 
            { value: 66, key: SolutionComponent.CustomControl }, 
            { value: 68, key: SolutionComponent.CustomControlDefaultConfig }, 
            { value: 70, key: SolutionComponent.FieldSecurityProfile }, 
            { value: 71, key: SolutionComponent.FieldPermission }, 
            { value: 80, key: SolutionComponent.ModelApp },             // Undocumented 
            { value: 90, key: SolutionComponent.PluginType }, 
            { value: 91, key: SolutionComponent.PluginAssembly }, 
            { value: 92, key: SolutionComponent.SdkMessageProcessingStep }, 
            { value: 93, key: SolutionComponent.SdkMessageProcessingStepImage }, 
            { value: 95, key: SolutionComponent.ServiceEndpoint }, 
            { value: 150, key: SolutionComponent.RoutingRule }, 
            { value: 151, key: SolutionComponent.RoutingRuleItem }, 
            { value: 152, key: SolutionComponent.SLA }, 
            { value: 153, key: SolutionComponent.SLAItem }, 
            { value: 154, key: SolutionComponent.ConvertRule }, 
            { value: 155, key: SolutionComponent.ConvertRuleItem }, 
            { value: 161, key: SolutionComponent.MobileOfflineProfile }, 
            { value: 162, key: SolutionComponent.MobileOfflineProfileItem }, 
            { value: 165, key: SolutionComponent.SimilarityRule }, 
            { value: 166, key: SolutionComponent.DataSourceMapping }, 
            { value: 201, key: SolutionComponent.SdkMessage }, 
            { value: 202, key: SolutionComponent.SdkMessageFilter }, 
            { value: 203, key: SolutionComponent.SdkMessagePair }, 
            { value: 204, key: SolutionComponent.SdkMessageRequest }, 
            { value: 205, key: SolutionComponent.SdkMessageRequestField }, 
            { value: 206, key: SolutionComponent.SdkMessageResponse }, 
            { value: 207, key: SolutionComponent.SdkMessageResponseField }, 
            { value: 208, key: SolutionComponent.ImportMap }, 
            { value: 210, key: SolutionComponent.WebWizard }, 
            { value: 300, key: SolutionComponent.CanvasApp }
        ])

Defined in src/api/CdsSolutions.ts:198

___

### `Static` WebResources

▪ **WebResources**: *[Dictionary](_core_types_dictionary_.dictionary.md)‹[WebResourceFileType](../enums/_api_cdssolutions_.cdssolutions.webresourcefiletype.md), number›* = new Dictionary<WebResourceFileType, number>([
            { value: 1, key: WebResourceFileType.Html },
            { value: 2, key: WebResourceFileType.Css },
            { value: 3, key: WebResourceFileType.JScript },
            { value: 3, key: WebResourceFileType.Json },
            { value: 4, key: WebResourceFileType.Data },
            { value: 5, key: WebResourceFileType.Png },
            { value: 6, key: WebResourceFileType.Jpeg },
            { value: 7, key: WebResourceFileType.Gif },
            { value: 8, key: WebResourceFileType.Silverlight },
            { value: 9, key: WebResourceFileType.Xsl },
            { value: 10, key: WebResourceFileType.Icon },
            { value: 11, key: WebResourceFileType.Vector },
            { value: 12, key: WebResourceFileType.String }
        ])

Defined in src/api/CdsSolutions.ts:282

## Methods

### `Static` getDynamicsFormCode

▸ **getDynamicsFormCode**(`form?`: [DynamicsForm](../enums/_api_cdssolutions_.cdssolutions.dynamicsform.md)): *number*

Defined in src/api/CdsSolutions.ts:142

**Parameters:**

Name | Type |
------ | ------ |
`form?` | [DynamicsForm](../enums/_api_cdssolutions_.cdssolutions.dynamicsform.md) |

**Returns:** *number*

___

### `Static` getInteractiveDashboardLayout

▸ **getInteractiveDashboardLayout**(`layout?`: [InteractiveDashboardLayout](../enums/_api_cdssolutions_.cdssolutions.interactivedashboardlayout.md)): *number*

Defined in src/api/CdsSolutions.ts:146

**Parameters:**

Name | Type |
------ | ------ |
`layout?` | [InteractiveDashboardLayout](../enums/_api_cdssolutions_.cdssolutions.interactivedashboardlayout.md) |

**Returns:** *number*

___

### `Static` getProcessTypeCode

▸ **getProcessTypeCode**(`processType?`: [ProcessType](../enums/_api_cdssolutions_.cdssolutions.processtype.md)): *number*

Defined in src/api/CdsSolutions.ts:150

**Parameters:**

Name | Type |
------ | ------ |
`processType?` | [ProcessType](../enums/_api_cdssolutions_.cdssolutions.processtype.md) |

**Returns:** *number*

___

### `Static` getSolutionComponentCode

▸ **getSolutionComponentCode**(`componentType?`: [SolutionComponent](../enums/_api_cdssolutions_.cdssolutions.solutioncomponent.md)): *number*

Defined in src/api/CdsSolutions.ts:154

**Parameters:**

Name | Type |
------ | ------ |
`componentType?` | [SolutionComponent](../enums/_api_cdssolutions_.cdssolutions.solutioncomponent.md) |

**Returns:** *number*

___

### `Static` getWebResourceTypeCode

▸ **getWebResourceTypeCode**(`webResourceType?`: [WebResourceFileType](../enums/_api_cdssolutions_.cdssolutions.webresourcefiletype.md)): *number*

Defined in src/api/CdsSolutions.ts:158

**Parameters:**

Name | Type |
------ | ------ |
`webResourceType?` | [WebResourceFileType](../enums/_api_cdssolutions_.cdssolutions.webresourcefiletype.md) |

**Returns:** *number*
