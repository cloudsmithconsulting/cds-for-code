import Dictionary from "../core/types/Dictionary";

export namespace CdsSolutions {

    export enum InteractiveDashboardLayout {
        _4ColumnOverview = "4 Column Overview Dashboard",
        _3ColumnOverview = "3 Column Overview Dashboard",
        _3ColumnOverviewVariableWidth = "3 Column Overview Dashboard with variable-width charts",
        _2ColumnOverview = "2 Column Overview Dashboard"
    }

    export enum DynamicsForm {
        Dashboard = "dashboard",
        AppointmentBook = "appointmentbook",
        Main = "main",
        MiniCampaignBO = "minicampaignbo",
        Preview = "preview",
        MobileExpress = "mobile",
        QuickView = "quick",
        QuickCreate = "quickCreate",
        Dialog = "dialog",
        TaskFlow = "taskflow",
        InteractionCentricDashboard = "icdashboard",
        ActionCard = "card",
        MainInteractive = "maininteractive",
        Other = "other",
        MainBackup = "mainbackup",
        AppointmentBookBackup = "appointmentbookbackup",
        PowerBIDashboard = "powerbi"
    }
    
    export enum ProcessType {
        Workflow = "Workflow",
        Dialog = "Dialog",
        BusinessRule = "Business Rule",
        Action = "Action",
        BusinessProcessFlow = "Business Process Flow",
        Flow = "Flow"
    }
    
    export enum SolutionComponent {
        Entity = "Entity",
        Attribute = "Attribute",
        Relationship = "Relationship",
        AttributePicklistValue = "Attribute Picklist Value",
        AttributeLookupValue = "Attribute Lookup Value",
        ViewAttribute = "View Attribute",
        LocalizedLabel = "Localized Label",
        RelationshipExtraCondition = "Relationship Extra Condition",    
        OptionSet = "Option Set",
        EntityRelationship = "Entity Relationship",
        EntityRelationshipRole = "Entity Relationship Role",
        EntityRelationshipRelationships = "Entity Relationship Relationships",
        ManagedProperty = "Managed Property",
        EntityKey = "Entity Key",
        Privilege = "Privilege",
        PrivilegeObjectTypeCode = "Privilege Object Type Code",
        Index = "Index",
        Role = "Role",
        RolePrivilege = "Role Privilege",
        DisplayString = "Display String",
        DisplayStringMap = "Display String Map",
        Form = "Form",
        Organization = "Organization",
        SavedQuery = "Saved Query",
        Workflow = "Workflow",
        Report = "Report",
        ReportEntity = "Report Entity",
        ReportCategory = "Report Category",
        ReportVisibility = "Report Visibility",
        Attachment = "Attachment",
        EmailTemplate = "Email Template",
        ContractTemplate = "Contract Template",
        KBArticleTemplate = "KB Article Template",
        MailMergeTemplate = "Mail Merge Template",
        DuplicateRule = "Duplicate Rule",
        DuplicateRuleCondition = "Duplicate Rule Condition",
        EntityMap = "Entity Map",
        AttributeMap = "Attribute Map",
        RibbonCommand = "Ribbon Command",
        RibbonContextGroup = "Ribbon Context Group",
        RibbonCustomization = "Ribbon Customization",
        RibbonRule = "Ribbon Rule",
        RibbonTabToCommandMap = "Ribbon Tab To Command Map",
        RibbonDiff = "Ribbon Diff",
        SavedQueryVisualization = "Saved Query Visualization",
        SystemForm = "System Form",
        WebResource = "Web Resource",
        SiteMap = "Site Map",
        ConnectionRole = "Connection Role",
        ComplexControl = "Complex Control",
        HierarchyRule = "Hierarchy Rule",
        CustomControl = "Custom Control",
        CustomControlDefaultConfig = "Custom Control Default Config",
        FieldSecurityProfile = "Field Security Profile",
        FieldPermission = "Field Permission",
        ModelApp = "Model-driven App",
        PluginType = "Plugin Type",
        PluginAssembly = "Plugin Assembly",
        SdkMessageProcessingStep = "SDK Message Processing Step",
        SdkMessageProcessingStepImage = "SDK Message Processing Step Image",
        ServiceEndpoint = "Service Endpoint",
        RoutingRule = "Routing Rule",
        RoutingRuleItem = "Routing Rule Item",
        SLA = "SLA",
        SLAItem = "SLA Item",
        ConvertRule = "Convert Rule",
        ConvertRuleItem = "Convert Rule Item",
        MobileOfflineProfile = "Mobile Offline Profile",
        MobileOfflineProfileItem = "Mobile Offline Profile Item",
        SimilarityRule = "Similarity Rule",
        DataSourceMapping = "Data Source Mapping",
        SdkMessage = "SDK Message",
        SdkMessagePair = "SDK Message Pair",
        SdkMessageFilter = "SDK Message Filter",
        SdkMessageRequest = "SDK Message Request",
        SdkMessageRequestField = "SDK Message Request Field",
        SdkMessageResponse = "SDK Message Response",
        SdkMessageResponseField = "SDK Message Response FIeld",
        ImportMap = "Import Map",
        WebWizard = "Web Wizard",
        CanvasApp = "Canvas App"
    }

    export enum WebResourceFileType {
        Html = ".html",
        Css = ".css",
        JScript = ".js",
        Json = ".json",
        Data = ".xml",
        Png = ".png",
        Jpeg = ".jpg",
        Gif = ".gif",
        Silverlight = ".xap",
        Xsl = ".xsl",
        Icon = ".ico",
        Vector = ".svg",
        String = ".resx"
    }

    export class CodeMappings {
        static getDynamicsFormCode(form?: DynamicsForm): number {
            return form ? this.DynamicsForms.get(form) : undefined;
        }

        static getInteractiveDashboardLayout(layout?: InteractiveDashboardLayout): number {
            return layout ? this.InteractiveDashboardLayouts.get(layout) : undefined;
        }

        static getProcessTypeCode(processType?: ProcessType): number {
            return processType ? this.ProcessTypes.get(processType) : undefined;
        }

        static getSolutionComponentCode(componentType?: SolutionComponent): number {
            return componentType ? this.SolutionComponents.get(componentType) : undefined;
        }

        static getWebResourceTypeCode(webResourceType?: WebResourceFileType): number {            
            return webResourceType ? this.WebResources.get(webResourceType) : undefined;
        }

        static InteractiveDashboardLayouts = new Dictionary<InteractiveDashboardLayout, number>([
            { value: 7, key: InteractiveDashboardLayout._4ColumnOverview },
            { value: 8, key: InteractiveDashboardLayout._3ColumnOverview },
            { value: 9, key: InteractiveDashboardLayout._2ColumnOverview },
            { value: 10, key: InteractiveDashboardLayout._3ColumnOverviewVariableWidth }
        ]);

        static DynamicsForms = new Dictionary<DynamicsForm, number>([
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
        ]);

        static ProcessTypes = new Dictionary<ProcessType, number>([
            { value: 0, key: ProcessType.Workflow },
            { value: 1, key: ProcessType.Dialog },
            { value: 2, key: ProcessType.BusinessRule },
            { value: 3, key: ProcessType.Action },
            { value: 4, key: ProcessType.BusinessProcessFlow },
            { value: 5, key: ProcessType.Flow }
        ]);   
        
        static SolutionComponents = new Dictionary<SolutionComponent, number>([
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
        ]);

        static WebResources = new Dictionary<WebResourceFileType, number>([
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
        ]);
    
    }
}