import Dictionary from "../helpers/Dictionary";

export namespace DynamicsWebApi {
    export interface Expand {
        /**An Array(of Strings) representing the $select OData System Query Option to control which attributes will be returned. */
        select?: string[];
        /**Use the $filter system query option to set criteria for which entities will be returned. */
        filter?: string;
        /**Limit the number of results returned by using the $top system query option.Do not use $top with $count! */
        top?: number;
        /**An Array(of Strings) representing the order in which items are returned using the $orderby system query option.Use the asc or desc suffix to specify ascending or descending order respectively.The default is ascending if the suffix isn't applied. */
        orderBy?: string[];
        /**A name of a single-valued navigation property which needs to be expanded. */
        property?: string;
    }

    export interface Request {
        /**XHR requests only! Indicates whether the requests should be made synchronously or asynchronously.Default value is 'true'(asynchronously). */
        async?: boolean;
        /**The name of the Entity Collection or Entity Logical name. */
        collection?: string;
        /**Impersonates the user.A String representing the GUID value for the Dynamics 365 system user id. */
        impersonate?: string;
        /** If set to 'true', DynamicsWebApi adds a request header 'Cache-Control: no-cache'.Default value is 'false'. */
        noCache?: boolean;
        /** Authorization Token. If set, onTokenRefresh will not be called. */
        token?: string;
    }

    export interface CRUDRequest extends Request {
        /** DEPRECATED Use "key" instead. A String representing the Primary Key(GUID) of the record. */
        id?: string;
        /**A String representing collection record's Primary Key (GUID) or Alternate Key(s). */
        key?: string;
    }

    export interface CreateRequest extends CRUDRequest {
        /**v.1.3.4+ Web API v9+ only! Boolean that enables duplicate detection. */
        duplicateDetection?: boolean;
        /**A JavaScript object with properties corresponding to the logical name of entity attributes(exceptions are lookups and single-valued navigation properties). */
        entity?: any;
        /**An array of Expand Objects(described below the table) representing the $expand OData System Query Option value to control which related records are also returned. */
        expand?: Expand[];
        /**Sets Prefer header with value "odata.include-annotations=" and the specified annotation.Annotations provide additional information about lookups, options sets and other complex attribute types. */
        includeAnnotations?: string;
        /**A String representing the name of a single - valued navigation property.Useful when needed to retrieve information about a related record in a single request. */
        navigationProperty?: string;
        /**v.1.4.3 + A String representing navigation property's Primary Key (GUID) or Alternate Key(s). (For example, to retrieve Attribute Metadata). */
        navigationPropertyKey?: string;
        /**Sets Prefer header request with value "return=representation".Use this property to return just created or updated entity in a single request. */
        returnRepresentation?: boolean;
        /**BATCH REQUESTS ONLY! Sets Content-ID header or references request in a Change Set. */
        contentId?: string;
    }

    export interface UpdateRequestBase extends CRUDRequest {
        /**v.1.3.4+ Web API v9+ only! Boolean that enables duplicate detection. */
        duplicateDetection?: boolean;
        /**A JavaScript object with properties corresponding to the logical name of entity attributes(exceptions are lookups and single-valued navigation properties). */
        entity?: any;
        /**An array of Expand Objects(described below the table) representing the $expand OData System Query Option value to control which related records are also returned. */
        expand?: Expand[];
        /**Sets If-Match header value that enables to use conditional retrieval or optimistic concurrency in applicable requests.*/
        ifmatch?: string;
        /**Sets Prefer header with value "odata.include-annotations=" and the specified annotation.Annotations provide additional information about lookups, options sets and other complex attribute types. */
        includeAnnotations?: string;
        /**Sets Prefer header request with value "return=representation".Use this property to return just created or updated entity in a single request. */
        returnRepresentation?: boolean;
        /**An Array(of Strings) representing the $select OData System Query Option to control which attributes will be returned. */
        select?: string[];
        /**BATCH REQUESTS ONLY! Sets Content-ID header or references request in a Change Set. */
        contentId?: string;
    }

    export interface UpdateRequest extends UpdateRequestBase {
        /**If set to 'true', DynamicsWebApi adds a request header 'MSCRM.MergeLabels: true'. Default value is 'false' */
        mergeLabels?: boolean;
    }

    export interface UpsertRequest extends UpdateRequestBase {
        /**Sets If-None-Match header value that enables to use conditional retrieval in applicable requests. */
        ifnonematch?: string;
        /**v.1.4.3 + Casts the AttributeMetadata to a specific type. (Used in requests to Attribute Metadata). */
        metadataAttributeType?: string;
        /**A String representing the name of a single - valued navigation property.Useful when needed to retrieve information about a related record in a single request. */
        navigationProperty?: string;
        /**v.1.4.3 + A String representing navigation property's Primary Key (GUID) or Alternate Key(s). (For example, to retrieve Attribute Metadata). */
        navigationPropertyKey?: string;
    }

    export interface DeleteRequest extends CRUDRequest {
        /**Sets If-Match header value that enables to use conditional retrieval or optimistic concurrency in applicable requests.*/
        ifmatch?: string;
        /**BATCH REQUESTS ONLY! Sets Content-ID header or references request in a Change Set. */
        contentId?: string;
    }

    export interface RetrieveRequest extends CRUDRequest {
        /**An array of Expand Objects(described below the table) representing the $expand OData System Query Option value to control which related records are also returned. */
        expand?: Expand[];
        /**Use the $filter system query option to set criteria for which entities will be returned. */
        filter?: string;
        /**Sets If-Match header value that enables to use conditional retrieval or optimistic concurrency in applicable requests.*/
        ifmatch?: string;
        /**Sets If-None-Match header value that enables to use conditional retrieval in applicable requests. */
        ifnonematch?: string;
        /**Sets Prefer header with value "odata.include-annotations=" and the specified annotation.Annotations provide additional information about lookups, options sets and other complex attribute types. */
        includeAnnotations?: string;
        /**v.1.4.3 + Casts the AttributeMetadata to a specific type. (Used in requests to Attribute Metadata). */
        metadataAttributeType?: string;
        /**A String representing the name of a single - valued navigation property.Useful when needed to retrieve information about a related record in a single request. */
        navigationProperty?: string;
        /**v.1.4.3 + A String representing navigation property's Primary Key (GUID) or Alternate Key(s). (For example, to retrieve Attribute Metadata). */
        navigationPropertyKey?: string;
        /**A String representing the GUID value of the saved query. */
        savedQuery?: string;
        /**An Array(of Strings) representing the $select OData System Query Option to control which attributes will be returned. */
        select?: string[];
        /**A String representing the GUID value of the user query. */
        userQuery?: string;
    }

    export interface RetrieveMultipleRequest extends Request {
        /**An array of Expand Objects(described below the table) representing the $expand OData System Query Option value to control which related records are also returned. */
        expand?: Expand[];
        /**Boolean that sets the $count system query option with a value of true to include a count of entities that match the filter criteria up to 5000(per page).Do not use $top with $count! */
        count?: boolean;
        /**Use the $filter system query option to set criteria for which entities will be returned. */
        filter?: string;
        /**Sets Prefer header with value "odata.include-annotations=" and the specified annotation.Annotations provide additional information about lookups, options sets and other complex attribute types. */
        includeAnnotations?: string;
        /**Sets the odata.maxpagesize preference value to request the number of entities returned in the response. */
        maxPageSize?: number;
        /**An Array(of string) representing the order in which items are returned using the $orderby system query option.Use the asc or desc suffix to specify ascending or descending order respectively.The default is ascending if the suffix isn't applied. */
        orderBy?: string[];
        /**An Array(of Strings) representing the $select OData System Query Option to control which attributes will be returned. */
        select?: string[];
        /**Limit the number of results returned by using the $top system query option.Do not use $top with $count! */
        top?: number;
        /**Indicates the request to initiate when using paging link. */
        url?: string;
    }

    export interface Config {
        /**The id (id) to use when displaying the connection to Dynamics365 in the TreeView */
        id?: string;
        /**The friendly name (name) to use when displaying the connection to Dynamics365 in the TreeView */
        name?: string;
        /**The access token (accessToken) to use when connecting to Dynamics365 */
        accessToken?: string;
        /**The credentials (username) to use when connecting to Dynamics365 */
        username?: string;
        /**The credentials (password) to use when connecting to Dynamics365 */
        password?: string;
        /**The credentials (domain) to use when connecting to Dynamics365 */
        domain?: string;
        /**The credentials (workstation) to use when connecting to Dynamics365 */
        workstation?: string;
        /**A String representing a URL to Web API(webApiVersion not required if webApiUrl specified)[not used inside of CRM] */
        webApiUrl?: string;
        /**The version of Web API to use, for example: "8.1" */
        webApiVersion?: string;
        /**The ID of the organization */
        orgId?:string;
        /**The name of the organization */
        orgName?:string;
        /**A String representing the GUID value for the Dynamics 365 system user id.Impersonates the user. */
        impersonate?: string;
        /**A function that is called when a security token needs to be refreshed. */
        onTokenRefresh?: (callback: OnTokenAcquiredCallback) => void;
        /**Sets Prefer header with value "odata.include-annotations=" and the specified annotation.Annotations provide additional information about lookups, options sets and other complex attribute types.*/
        includeAnnotations?: string;
        /**Sets the odata.maxpagesize preference value to request the number of entities returned in the response. */
        maxPageSize?: string;
        /**Sets Prefer header request with value "return=representation".Use this property to return just created or updated entity in a single request.*/
        returnRepresentation?: boolean;
        /**Indicates whether to use Entity Logical Names instead of Collection Logical Names.*/
        useEntityNames?: boolean;
        /**Sets a number of milliseconds before a request times out */
        timeout?: number;
    }

    /** Callback with an acquired token called by DynamicsWebApi; "token" argument can be a string or an object with a property {accessToken: <token>}  */
    export interface OnTokenAcquiredCallback {
        (token: any): void;
    }

    export interface RequestError extends Error {
        /**This code is not related to the http status code and is frequently empty */
        code?: string;
        /**A message describing the error */
        message: string;
        /**HTTP status code */
        status?: number;
        /**HTTP status text. Frequently empty */
        statusText?: string;
        /**Details about an error */
        innererror?: {
            /**A message describing the error, this is frequently the same as the outer message */
            message?: string;
            /**Microsoft.Crm.CrmHttpException */
            type?: string;
            /**Details from the server about where the error occurred */
            stacktrace?: string;
        };
    }

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

    export class CodeMappings {
        public static getDynamicsFormCode(form: DynamicsForm): number {
            return this.DynamicsForms.getKey(form);
        }

        public static getInteractiveDashboardLayout(layout: InteractiveDashboardLayout) {
            return this.InteractiveDashboardLayouts.getKey(layout);
        }

        public static getProcessTypeCode(processType: ProcessType): number {
            return this.ProcessTypes.getKey(processType);
        }

        public static getSolutionComponentCode(componentType: SolutionComponent): number {
            return this.SolutionComponents.getKey(componentType);
        }

        public static InteractiveDashboardLayouts = new Dictionary<number, InteractiveDashboardLayout>([
            { key: 7, value: InteractiveDashboardLayout._4ColumnOverview },
            { key: 8, value: InteractiveDashboardLayout._3ColumnOverview },
            { key: 9, value: InteractiveDashboardLayout._2ColumnOverview },
            { key: 10, value: InteractiveDashboardLayout._3ColumnOverviewVariableWidth }
        ]);

        public static DynamicsForms = new Dictionary<number, DynamicsForm>([
            { key: 0, value: DynamicsForm.Dashboard },
            { key: 1, value: DynamicsForm.AppointmentBook },
            { key: 2, value: DynamicsForm.Main },
            { key: 3, value: DynamicsForm.MiniCampaignBO },
            { key: 4, value: DynamicsForm.Preview },
            { key: 5, value: DynamicsForm.MobileExpress },
            { key: 6, value: DynamicsForm.QuickView },
            { key: 7, value: DynamicsForm.QuickCreate },
            { key: 8, value: DynamicsForm.Dialog },
            { key: 9, value: DynamicsForm.TaskFlow },
            { key: 10, value: DynamicsForm.InteractionCentricDashboard },
            { key: 11, value: DynamicsForm.ActionCard },
            { key: 12, value: DynamicsForm.MainInteractive },
            { key: 100, value: DynamicsForm.Other },
            { key: 101, value: DynamicsForm.MainBackup },
            { key: 102, value: DynamicsForm.AppointmentBookBackup },
            { key: 103, value: DynamicsForm.PowerBIDashboard }
        ]);

        public static ProcessTypes = new Dictionary<number, ProcessType>([
            { key: 0, value: ProcessType.Workflow },
            { key: 1, value: ProcessType.Dialog },
            { key: 2, value: ProcessType.BusinessRule },
            { key: 3, value: ProcessType.Action },
            { key: 4, value: ProcessType.BusinessProcessFlow },
            { key: 5, value: ProcessType.Flow }
        ]);   
        
        public static SolutionComponents = new Dictionary<number, SolutionComponent>([
            { key: 1, value: SolutionComponent.Entity }, 
            { key: 2, value: SolutionComponent.Attribute }, 
            { key: 3, value: SolutionComponent.Relationship }, 
            { key: 4, value: SolutionComponent.AttributePicklistValue }, 
            { key: 5, value: SolutionComponent.AttributeLookupValue }, 
            { key: 6, value: SolutionComponent.ViewAttribute }, 
            { key: 7, value: SolutionComponent.LocalizedLabel }, 
            { key: 8, value: SolutionComponent.RelationshipExtraCondition }, 
            { key: 9, value: SolutionComponent.OptionSet }, 
            { key: 10, value: SolutionComponent.EntityRelationship }, 
            { key: 11, value: SolutionComponent.EntityRelationshipRole }, 
            { key: 12, value: SolutionComponent.EntityRelationshipRelationships }, 
            { key: 13, value: SolutionComponent.ManagedProperty }, 
            { key: 14, value: SolutionComponent.EntityKey }, 
            { key: 16, value: SolutionComponent.Privilege }, 
            { key: 17, value: SolutionComponent.PrivilegeObjectTypeCode }, 
            { key: 18, value: SolutionComponent.Index }, 
            { key: 20, value: SolutionComponent.Role }, 
            { key: 21, value: SolutionComponent.RolePrivilege }, 
            { key: 22, value: SolutionComponent.DisplayString }, 
            { key: 23, value: SolutionComponent.DisplayStringMap }, 
            { key: 24, value: SolutionComponent.Form }, 
            { key: 25, value: SolutionComponent.Organization }, 
            { key: 26, value: SolutionComponent.SavedQuery }, 
            { key: 29, value: SolutionComponent.Workflow }, 
            { key: 31, value: SolutionComponent.Report }, 
            { key: 32, value: SolutionComponent.ReportEntity }, 
            { key: 33, value: SolutionComponent.ReportCategory }, 
            { key: 34, value: SolutionComponent.ReportVisibility }, 
            { key: 35, value: SolutionComponent.Attachment }, 
            { key: 36, value: SolutionComponent.EmailTemplate }, 
            { key: 37, value: SolutionComponent.ContractTemplate }, 
            { key: 38, value: SolutionComponent.KBArticleTemplate }, 
            { key: 39, value: SolutionComponent.MailMergeTemplate }, 
            { key: 44, value: SolutionComponent.DuplicateRule }, 
            { key: 45, value: SolutionComponent.DuplicateRuleCondition }, 
            { key: 46, value: SolutionComponent.EntityMap }, 
            { key: 47, value: SolutionComponent.AttributeMap }, 
            { key: 48, value: SolutionComponent.RibbonCommand }, 
            { key: 49, value: SolutionComponent.RibbonContextGroup }, 
            { key: 50, value: SolutionComponent.RibbonCustomization }, 
            { key: 52, value: SolutionComponent.RibbonRule }, 
            { key: 53, value: SolutionComponent.RibbonTabToCommandMap }, 
            { key: 55, value: SolutionComponent.RibbonDiff }, 
            { key: 59, value: SolutionComponent.SavedQueryVisualization }, 
            { key: 60, value: SolutionComponent.SystemForm }, 
            { key: 61, value: SolutionComponent.WebResource }, 
            { key: 62, value: SolutionComponent.SiteMap }, 
            { key: 63, value: SolutionComponent.ConnectionRole }, 
            { key: 64, value: SolutionComponent.ComplexControl }, 
            { key: 65, value: SolutionComponent.HierarchyRule }, 
            { key: 66, value: SolutionComponent.CustomControl }, 
            { key: 68, value: SolutionComponent.CustomControlDefaultConfig }, 
            { key: 70, value: SolutionComponent.FieldSecurityProfile }, 
            { key: 71, value: SolutionComponent.FieldPermission }, 
            { key: 90, value: SolutionComponent.PluginType }, 
            { key: 91, value: SolutionComponent.PluginAssembly }, 
            { key: 92, value: SolutionComponent.SdkMessageProcessingStep }, 
            { key: 93, value: SolutionComponent.SdkMessageProcessingStepImage }, 
            { key: 95, value: SolutionComponent.ServiceEndpoint }, 
            { key: 150, value: SolutionComponent.RoutingRule }, 
            { key: 151, value: SolutionComponent.RoutingRuleItem }, 
            { key: 152, value: SolutionComponent.SLA }, 
            { key: 153, value: SolutionComponent.SLAItem }, 
            { key: 154, value: SolutionComponent.ConvertRule }, 
            { key: 155, value: SolutionComponent.ConvertRuleItem }, 
            { key: 161, value: SolutionComponent.MobileOfflineProfile }, 
            { key: 162, value: SolutionComponent.MobileOfflineProfileItem }, 
            { key: 165, value: SolutionComponent.SimilarityRule }, 
            { key: 166, value: SolutionComponent.DataSourceMapping }, 
            { key: 201, value: SolutionComponent.SdkMessage }, 
            { key: 202, value: SolutionComponent.SdkMessageFilter }, 
            { key: 203, value: SolutionComponent.SdkMessagePair }, 
            { key: 204, value: SolutionComponent.SdkMessageRequest }, 
            { key: 205, value: SolutionComponent.SdkMessageRequestField }, 
            { key: 206, value: SolutionComponent.SdkMessageResponse }, 
            { key: 207, value: SolutionComponent.SdkMessageResponseField }, 
            { key: 208, value: SolutionComponent.ImportMap }, 
            { key: 210, value: SolutionComponent.WebWizard }, 
            { key: 300, value: SolutionComponent.CanvasApp }
        ]);
    }
}