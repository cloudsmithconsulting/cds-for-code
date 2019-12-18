import { Utilities } from '../core/Utilities';
import { CdsSolutions } from './CdsSolutions';
import { DynamicsWebApi } from './cds-webapi/DynamicsWebApi';

/**
 * A class for resolving URLs to CDS
 *
 * @export
 * @class CdsUrlResolver
 */
export default class CdsUrlResolver {
    /**
     * Parses the form type
     *
     * @static
     * @param {number} formType
     * @returns {CdsSolutions.DynamicsForm}
     * @memberof CdsUrlResolver
     */
    static parseFormType(formType:number): CdsSolutions.DynamicsForm {
        return formType ? CdsSolutions.CodeMappings.DynamicsForms[formType] : undefined;
    }

    /**
     * Parses the process type
     *
     * @static
     * @param {number} processType
     * @returns {CdsSolutions.ProcessType}
     * @memberof CdsUrlResolver
     */
    static parseProcessType(processType:number): CdsSolutions.ProcessType {
        return processType ? CdsSolutions.CodeMappings.ProcessTypes[processType] : undefined;
    }

    /**
     * Parses the solution component
     *
     * @static
     * @param {number} solutionComponent
     * @returns {CdsSolutions.SolutionComponent}
     * @memberof CdsUrlResolver
     */
    static parseSolutionComponent(solutionComponent:number): CdsSolutions.SolutionComponent {
        return solutionComponent ? CdsSolutions.CodeMappings.SolutionComponents[solutionComponent] : undefined;
    }

    /**
     * Gets the URI to manage the solution
     *
     * @static
     * @param {DynamicsWebApi.Config} config
     * @param {string} [solutionId]
     * @returns {string}
     * @memberof CdsUrlResolver
     */
    static getManageSolutionUri(config:DynamicsWebApi.Config, solutionId?:string): string {
        let uriString:string = `${Utilities.String.withTrailingSlash(config.appUrl)}tools/solution/edit.aspx`;

        if (solutionId) {
            uriString += `?id=${CdsUrlResolver.crmGuid(solutionId)}`;
        }
        
        return uriString;
    }

    /**
     * Gets the URI to manage the entity
     *
     * @static
     * @param {DynamicsWebApi.Config} config
     * @param {string} [entityId]
     * @param {string} [solutionId]
     * @returns {string}
     * @memberof CdsUrlResolver
     */
    static getManageEntityUri(config:DynamicsWebApi.Config, entityId?:string, solutionId?:string): string {
        let uriString:string = `${Utilities.String.withTrailingSlash(config.appUrl)}tools/systemcustomization/entities/manageentity.aspx?`;

        if (entityId) {
            uriString += `id=${CdsUrlResolver.crmGuid(entityId)}`;
        }

        return this.addSolutionToUri(uriString, solutionId);
    }

    /**
     * Gets the URI to manage the attribute
     *
     * @static
     * @param {DynamicsWebApi.Config} config
     * @param {string} entityId
     * @param {string} [attributeId]
     * @param {string} [solutionId]
     * @returns {string}
     * @memberof CdsUrlResolver
     */
    static getManageAttributeUri(config:DynamicsWebApi.Config, entityId:string, attributeId?:string, solutionId?:string): string {
        let uriString:string = `${Utilities.String.withTrailingSlash(config.appUrl)}tools/systemcustomization/attributes/manageAttribute.aspx?entityId=${CdsUrlResolver.crmGuid(entityId)}`;

        if (attributeId) {
            uriString += `&attributeId=${CdsUrlResolver.crmGuid(attributeId)}`;
        }

        return this.addSolutionToUri(uriString, solutionId);
    }

    /**
     * Gets the URL for opening the entity in the dynamics client app
     *
     * @static
     * @param {string} entityLogicalName
     * @param {string} [entityId]
     * @returns {string}
     * @memberof CdsUrlResolver
     */
    static getOpenEntityUsingAppUrl(entityLogicalName:string, entityId?:string): string {
        let uriString:string = `ms-dynamicsxrm://?pagetype=${entityId ? "entity" : "create"}&etn=${entityLogicalName}`;

        if (entityId) {
            uriString += `&id=${Utilities.Guid.trimGuid(entityId)}`;
        }

        return uriString;
    }

    /**
     * Gets the URI for opening the entity form
     *
     * @static
     * @param {DynamicsWebApi.Config} config
     * @param {string} entityLogicalName
     * @param {string} [formId]
     * @param {boolean} [showNavigationBar=true]
     * @param {boolean} [showCommandBar=true]
     * @returns {string}
     * @memberof CdsUrlResolver
     */
    static getOpenEntityFormUri(config:DynamicsWebApi.Config, entityLogicalName:string, formId?:string, showNavigationBar:boolean = true, showCommandBar:boolean = true): string {
        let uriString:string = `${Utilities.String.withTrailingSlash(config.appUrl)}main.aspx?pagetype=entityrecord&etn=${entityLogicalName}`;

        if (!showNavigationBar) {
            uriString += "&navbar=off";
        }

        if (!showCommandBar) {
            uriString += "&cmdbar=false";
        }

        if (formId) {
            uriString += `&extraqs=formid%3D${CdsUrlResolver.crmGuid(formId)}`;
        } 

        return this.addSolutionToUri(uriString);
    }

    /**
     * Gets the URI for managing the entity form
     *
     * @static
     * @param {DynamicsWebApi.Config} config
     * @param {string} entityTypeCode
     * @param {CdsSolutions.DynamicsForm} [formType=CdsSolutions.DynamicsForm.Main]
     * @param {string} [formId]
     * @param {string} [solutionId]
     * @returns {string}
     * @memberof CdsUrlResolver
     */
    static getManageEntityFormUri(config:DynamicsWebApi.Config, entityTypeCode:string, formType:CdsSolutions.DynamicsForm = CdsSolutions.DynamicsForm.Main, formId?:string, solutionId?:string): string {
        let uriString:string = `${Utilities.String.withTrailingSlash(config.appUrl)}main.aspx?pagetype=formeditor&etc=${entityTypeCode}`;
        let options;

        // This one's fun, if you put the guid braces on it doesn't work :)
        if (formId) {
            options = { formtype: formType.toString(), formId: `${Utilities.Guid.trimGuid(formId)}`, action: -1 };
        } else {
            options = { formtype: formType, action: -1 };
        }

        uriString += `&extraqs=${CdsUrlResolver.escapeOptions(options)}`;

        return this.addSolutionToUri(uriString, solutionId);
    }

    /**
     * Gets the URL for opening an entity view in the dynamics client app
     *
     * @static
     * @param {string} entityLogicalName
     * @param {string} [viewId]
     * @returns {string}
     * @memberof CdsUrlResolver
     */
    static getOpenEntityViewUsingAppUrl(entityLogicalName:string, viewId?:string): string {
        let uriString:string = `ms-dynamicsxrm://?pagetype=view&etn=${entityLogicalName}`;

        if (viewId) {
            uriString += `&id=${Utilities.Guid.trimGuid(viewId)}`;
        }

        return uriString;
    }

    /**
     * Gets the URI for opening the entity view
     *
     * @static
     * @param {DynamicsWebApi.Config} config
     * @param {string} entityLogicalName
     * @param {string} viewId
     * @param {boolean} [showNavigationBar=true]
     * @param {boolean} [showCommandBar=true]
     * @returns {string}
     * @memberof CdsUrlResolver
     */
    static getOpenEntityViewUri(config:DynamicsWebApi.Config, entityLogicalName:string, viewId:string, showNavigationBar:boolean = true, showCommandBar:boolean = true): string {
        let uriString:string = `${Utilities.String.withTrailingSlash(config.appUrl)}main.aspx?pagetype=entitylist&etn=${entityLogicalName}&viewid=${CdsUrlResolver.crmGuid(viewId)}&viewtype=1039`;

        if (!showNavigationBar) {
            uriString += "&navbar=off";
        }

        if (!showCommandBar) {
            uriString += "&cmdbar=false";
        }

        return this.addSolutionToUri(uriString);
    }

    /**
     * Gets the URI for managing the entity view
     *
     * @static
     * @param {DynamicsWebApi.Config} config
     * @param {string} entityId
     * @param {string} [entityTypeCode]
     * @param {string} [viewId]
     * @param {string} [solutionId]
     * @returns {string}
     * @memberof CdsUrlResolver
     */
    static getManageEntityViewUri(config:DynamicsWebApi.Config, entityId:string, entityTypeCode?:string, viewId?:string, solutionId?:string): string {
        let uriString:string = `${Utilities.String.withTrailingSlash(config.appUrl)}tools/vieweditor/viewManager.aspx?entityId=${CdsUrlResolver.crmGuid(entityId)}`;

        if (viewId) {
            uriString += `&id=${CdsUrlResolver.crmGuid(viewId)}`;
        } else {
            uriString += `&mode=new&objectTypeCode=${entityTypeCode}`;
        }

        return this.addSolutionToUri(uriString, solutionId);
    }

    /**
     * Gets the URL for opening the entity dasboard in the dynamics client app
     *
     * @static
     * @param {string} dashboardId
     * @returns {string}
     * @memberof CdsUrlResolver
     */
    static getOpenEntityDashboardUsingAppUrl(dashboardId:string): string {
        let uriString:string = `ms-dynamicsxrm://?pagetype=dashboard&id=${Utilities.Guid.trimGuid(dashboardId)}`;

        return uriString;
    }

    /**
     * Gets the URI for managing the entity dashboard
     *
     * @static
     * @param {DynamicsWebApi.Config} config
     * @param {string} [entityTypeCode]
     * @param {CdsSolutions.InteractiveDashboardLayout} [layoutType]
     * @param {string} [dashboardType]
     * @param {string} [dashboardId]
     * @param {string} [solutionId]
     * @returns {string}
     * @memberof CdsUrlResolver
     */
    static getManageEntityDashboardUri(config:DynamicsWebApi.Config, entityTypeCode?:string, layoutType?:CdsSolutions.InteractiveDashboardLayout, dashboardType?:string, dashboardId?:string, solutionId?:string): string {
        let uriString:string = `${Utilities.String.withTrailingSlash(config.appUrl)}main.aspx?pagetype=icdashboardeditor`;
        
        if (entityTypeCode) {
            uriString += `&entitytypecode=${entityTypeCode}&isentitydashboard=1`;
        }

        let options = {};

        if (dashboardType) {
            options["dashboardType"] = dashboardType;
        }
        
        if (dashboardId) {
            options["formId"] = `{${Utilities.Guid.trimGuid(dashboardId)}}`;
        } 
        
        if (layoutType) {
            options["layout"] = CdsSolutions.CodeMappings.getInteractiveDashboardLayout(layoutType);
        }

        uriString += `&extraqs=${CdsUrlResolver.escapeOptions(options)}`;

        return this.addSolutionToUri(uriString, solutionId);
    }

    /**
     * Gets the URL for managing the entity chart
     *
     * @static
     * @param {DynamicsWebApi.Config} config
     * @param {string} [entityTypeCode]
     * @param {string} [chartId]
     * @param {string} [solutionId]
     * @returns {string}
     * @memberof CdsUrlResolver
     */
    static getManageEntityChartUrl(config:DynamicsWebApi.Config, entityTypeCode?:string, chartId?:string, solutionId?:string): string {
        let uriString:string = `${Utilities.String.withTrailingSlash(config.appUrl)}main.aspx?pagetype=vizdesigner`;
        let options;

        if (chartId) {
            options = { etc: entityTypeCode, id: `${Utilities.Guid.trimGuid(chartId)}` };
        } else {
            options = { etc: entityTypeCode };
        }
        
        uriString += `&extraqs=${CdsUrlResolver.escapeOptions(options)}`;

        return this.addSolutionToUri(uriString, solutionId);
    }

    /**
     * Gets the URL for managing the entity keys
     *
     * @static
     * @param {DynamicsWebApi.Config} config
     * @param {string} [entityId]
     * @param {string} [keyId]
     * @param {string} [solutionId]
     * @returns {string}
     * @memberof CdsUrlResolver
     */
    static getManageEntityKeyUrl(config:DynamicsWebApi.Config, entityId?:string, keyId?:string, solutionId?:string): string {
        let uriString:string = `${Utilities.String.withTrailingSlash(config.appUrl)}tools/systemcustomization/AlternateKeys/manageAlternateKeys.aspx?entityId=${CdsUrlResolver.crmGuid(entityId)}`;

        if (keyId) {
            uriString += `&entityKeyId=${CdsUrlResolver.crmGuid(keyId)}`;
        } 

        return this.addSolutionToUri(uriString, solutionId);
    }

    /**
     * Gets the URL for managing entity relationships
     *
     * @static
     * @param {DynamicsWebApi.Config} config
     * @param {string} [entityId]
     * @param {string} [relationshipId]
     * @param {string} [solutionId]
     * @returns {string}
     * @memberof CdsUrlResolver
     */
    static getManageEntityRelationshipUrl(config:DynamicsWebApi.Config, entityId?:string, relationshipId?:string, solutionId?:string): string {
        let uriString:string = `${Utilities.String.withTrailingSlash(config.appUrl)}tools/systemcustomization/relationships/manageRelationship.aspx?entityId=${CdsUrlResolver.crmGuid(entityId)}`;

        if (relationshipId) {
            uriString += `&entityRelationshipId=${CdsUrlResolver.crmGuid(relationshipId)}`;
        } 

        uriString += "&entityRole=referenced";

        return this.addSolutionToUri(uriString, solutionId);
    }

    /**
     * Gets the URI for managing business processes
     *
     * @static
     * @param {DynamicsWebApi.Config} config
     * @param {CdsSolutions.ProcessType} processType
     * @param {number} [entityTypeCode]
     * @param {string} [processId]
     * @param {string} [solutionId]
     * @returns {string}
     * @memberof CdsUrlResolver
     */
    static getManageBusinessProcessUri(config:DynamicsWebApi.Config, processType:CdsSolutions.ProcessType, entityTypeCode?:number, processId?:string, solutionId?:string): string {
        let uriString:string;
        let uri: string;

        switch (processType)
        {
            case CdsSolutions.ProcessType.BusinessRule:
                uriString = `${Utilities.String.withTrailingSlash(config.appUrl)}tools/systemcustomization/businessrules/businessRulesDesigner.aspx?BRLaunchpoint=BRGrid&otc=${entityTypeCode}&templateId=0`;

                if (processId) {
                    uriString += `id=${CdsUrlResolver.crmGuid(processId)}`;  
                }

                uri = this.addSolutionToUri(uriString);
                break;
            case CdsSolutions.ProcessType.Flow:
                break;
            case CdsSolutions.ProcessType.BusinessProcessFlow:
                uriString = `${Utilities.String.withTrailingSlash(config.appUrl)}Tools/ProcessControl/UnifiedProcessDesigner.aspx?`;

                if (processId) {
                    uriString += `id=${CdsUrlResolver.crmGuid(processId)}`;  
                }

                uri = this.addSolutionToUri(uriString);
                break;
            case CdsSolutions.ProcessType.Dialog:
            case CdsSolutions.ProcessType.Action:
            case CdsSolutions.ProcessType.Workflow:
                uriString = `${Utilities.String.withTrailingSlash(config.appUrl)}sfa/workflow/edit.aspx?`;

                if (processId) {
                    uriString += `id=${CdsUrlResolver.crmGuid(processId)}`;  
                }

                uri = this.addSolutionToUri(uriString, solutionId);
                break;
        }

        return uri;
    }

    /**
     * Gets the URI for managing the web resource
     *
     * @static
     * @param {DynamicsWebApi.Config} config
     * @param {string} [webResourceId]
     * @param {string} [solutionId]
     * @returns {string}
     * @memberof CdsUrlResolver
     */
    static getManageWebResourceUri(config:DynamicsWebApi.Config, webResourceId?:string, solutionId?:string): string {
        let uriString:string = `${Utilities.String.withTrailingSlash(config.appUrl)}main.aspx?etc=9333&pagetype=webresourceedit`;

        if (webResourceId) {
            uriString += `&id=${CdsUrlResolver.crmGuid(webResourceId)}`;
        }

        return this.addSolutionToUri(uriString, solutionId);
    }

    /**
     * Gets the URI for managing the option set
     *
     * @static
     * @param {DynamicsWebApi.Config} config
     * @param {string} [entityId]
     * @param {string} [entityTypeCode]
     * @param {string} [optionSetId]
     * @param {string} [solutionId]
     * @returns {string}
     * @memberof CdsUrlResolver
     */
    static getManageOptionSetUri(config:DynamicsWebApi.Config, entityId?:string, entityTypeCode?:string, optionSetId?:string, solutionId?:string): string {
        let uriString:string = `${Utilities.String.withTrailingSlash(config.appUrl)}tools/systemcustomization/optionset/optionset.aspx?`;

        if (entityId) {
            uriString += `&_CreateFromId=${CdsUrlResolver.crmGuid(entityId)}`;
        }

        if (entityTypeCode) {
            uriString += `&_CreateFromType=${entityTypeCode}`;
        }

        if (optionSetId) {
            uriString += `&id=${CdsUrlResolver.crmGuid(optionSetId)}`;
        }

        return this.addSolutionToUri(uriString, solutionId);
    }

    /**
     * URL encodes a GUID for passing to web URI
     *
     * @private
     * @static
     * @param {string} value
     * @returns {string}
     * @memberof CdsUrlResolver
     */
    private static crmGuid(value:string): string {
        return `%7B${Utilities.Guid.trimGuid(value)}%7D`;
    }

    /**
     * Escapes the options and returns a query string
     *
     * @private
     * @static
     * @param {*} options
     * @returns {string}
     * @memberof CdsUrlResolver
     */
    private static escapeOptions(options:any): string {
        let returnString = escape(Utilities.$Object.asQuerystring(options));
        returnString = returnString.replace("%257B", "%7B").replace("%257D", "%7D");

        return `${returnString}`;
    }

    /**
     * Adds the solution id to the URI
     *
     * @private
     * @static
     * @param {string} uriString
     * @param {string} [solutionId]
     * @returns {string}
     * @memberof CdsUrlResolver
     */
    private static addSolutionToUri(uriString:string, solutionId?:string): string {
        if (solutionId)
        {
            if (!uriString.endsWith("?")) {
                uriString += "&";             
            }

            uriString += `appSolutionId=${CdsUrlResolver.crmGuid(solutionId)}`;
        }

        return uriString;
    }
}
