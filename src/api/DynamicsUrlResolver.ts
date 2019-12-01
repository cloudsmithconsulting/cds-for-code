import * as vscode from 'vscode';
import { Utilities } from '../core/Utilities';
import { CdsSolutions } from './CdsSolutions';
import { DynamicsWebApi } from './cds-webapi/DynamicsWebApi';

export default class DynamicsUrlResolver
{
    static parseFormType(formType:number): CdsSolutions.DynamicsForm {
        return CdsSolutions.CodeMappings.DynamicsForms[formType];
    }

    static parseProcessType(processType:number): CdsSolutions.ProcessType {
        return CdsSolutions.CodeMappings.ProcessTypes[processType];
    }

    static parseSolutionComponent(solutionComponent:number): CdsSolutions.SolutionComponent {
        return CdsSolutions.CodeMappings.SolutionComponents[solutionComponent];
    }

    static getManageSolutionUri(config:DynamicsWebApi.Config, solutionId?:string): string {
        let uriString:string = `${Utilities.String.withTrailingSlash(config.webApiUrl)}tools/solution/edit.aspx`;

        if (solutionId) {
            uriString += `?id=${DynamicsUrlResolver.crmGuid(solutionId)}`;
        }
        
        return uriString;
    }

    static getManageEntityUri(config:DynamicsWebApi.Config, entityId?:string, solutionId?:string): string {
        let uriString:string = `${Utilities.String.withTrailingSlash(config.webApiUrl)}tools/systemcustomization/entities/manageentity.aspx?`;

        if (entityId) {
            uriString += `id=${DynamicsUrlResolver.crmGuid(entityId)}`;
        }

        return this.addSolutionToUri(uriString, solutionId);
    }

    static getManageAttributeUri(config:DynamicsWebApi.Config, entityId:string, attributeId?:string, solutionId?:string): string {
        let uriString:string = `${Utilities.String.withTrailingSlash(config.webApiUrl)}tools/systemcustomization/attributes/manageAttribute.aspx?entityId=${DynamicsUrlResolver.crmGuid(entityId)}`;

        if (attributeId) {
            uriString += `&attributeId=${DynamicsUrlResolver.crmGuid(attributeId)}`;
        }

        return this.addSolutionToUri(uriString, solutionId);
    }

    static getOpenEntityUsingAppUrl(entityLogicalName:string, entityId?:string): string {
        let uriString:string = `ms-dynamicsxrm://?pagetype=${entityId ? "entity" : "create"}&etn=${entityLogicalName}`;

        if (entityId) {
            uriString += `&id=${Utilities.Guid.trimGuid(entityId)}`;
        }

        return uriString;
    }

    static getOpenEntityFormUri(config:DynamicsWebApi.Config, entityLogicalName:string, formId?:string, showNavigationBar:boolean = true, showCommandBar:boolean = true): string {
        let uriString:string = `${Utilities.String.withTrailingSlash(config.webApiUrl)}main.aspx?pagetype=entityrecord&etn=${entityLogicalName}`;

        if (!showNavigationBar) {
            uriString += "&navbar=off";
        }

        if (!showCommandBar) {
            uriString += "&cmdbar=false";
        }

        if (formId) {
            uriString += `&extraqs=formid%3D${DynamicsUrlResolver.crmGuid(formId)}`;
        } 

        return this.addSolutionToUri(uriString);
    }

    static getManageEntityFormUri(config:DynamicsWebApi.Config, entityTypeCode:string, formType:CdsSolutions.DynamicsForm = CdsSolutions.DynamicsForm.Main, formId?:string, solutionId?:string): string {
        let uriString:string = `${Utilities.String.withTrailingSlash(config.webApiUrl)}main.aspx?pagetype=formeditor&etc=${entityTypeCode}`;
        let options;

        // This one's fun, if you put the guid braces on it doesn't work :)
        if (formId) {
            options = { formtype: formType.toString(), formId: `${Utilities.Guid.trimGuid(formId)}`, action: -1 };
        } else {
            options = { formtype: formType, action: -1 };
        }

        uriString += `&extraqs=${DynamicsUrlResolver.escapeOptions(options)}`;

        return this.addSolutionToUri(uriString, solutionId);
    }

    static getOpenEntityViewUsingAppUrl(entityLogicalName:string, viewId?:string): string {
        let uriString:string = `ms-dynamicsxrm://?pagetype=view&etn=${entityLogicalName}`;

        if (viewId) {
            uriString += `&id=${Utilities.Guid.trimGuid(viewId)}`;
        }

        return uriString;
    }

    static getOpenEntityViewUri(config:DynamicsWebApi.Config, entityLogicalName:string, viewId:string, showNavigationBar:boolean = true, showCommandBar:boolean = true): string {
        let uriString:string = `${Utilities.String.withTrailingSlash(config.webApiUrl)}main.aspx?pagetype=entitylist&etn=${entityLogicalName}&viewid=${DynamicsUrlResolver.crmGuid(viewId)}&viewtype=1039`;

        if (!showNavigationBar) {
            uriString += "&navbar=off";
        }

        if (!showCommandBar) {
            uriString += "&cmdbar=false";
        }

        return this.addSolutionToUri(uriString);
    }

    static getManageEntityViewUri(config:DynamicsWebApi.Config, entityId:string, entityTypeCode?:string, viewId?:string, solutionId?:string): string {
        let uriString:string = `${Utilities.String.withTrailingSlash(config.webApiUrl)}tools/vieweditor/viewManager.aspx?entityId=${DynamicsUrlResolver.crmGuid(entityId)}`;

        if (viewId) {
            uriString += `&id=${DynamicsUrlResolver.crmGuid(viewId)}`;
        } else {
            uriString += `&mode=new&objectTypeCode=${entityTypeCode}`;
        }

        return this.addSolutionToUri(uriString, solutionId);
    }

    static getOpenEntityDashboardUsingAppUrl(dashboardId:string): string {
        let uriString:string = `ms-dynamicsxrm://?pagetype=dashboard&id=${Utilities.Guid.trimGuid(dashboardId)}`;

        return uriString;
    }

    static getManageEntityDashboardUri(config:DynamicsWebApi.Config, entityTypeCode?:string, layoutType?:CdsSolutions.InteractiveDashboardLayout, dashboardType?:string, dashboardId?:string, solutionId?:string): string {
        let uriString:string = `${Utilities.String.withTrailingSlash(config.webApiUrl)}main.aspx?pagetype=icdashboardeditor`;
        
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

        uriString += `&extraqs=${DynamicsUrlResolver.escapeOptions(options)}`;

        return this.addSolutionToUri(uriString, solutionId);
    }

    static getManageEntityChartUrl(config:DynamicsWebApi.Config, entityTypeCode?:string, chartId?:string, solutionId?:string): string {
        let uriString:string = `${Utilities.String.withTrailingSlash(config.webApiUrl)}main.aspx?pagetype=vizdesigner`;
        let options;

        if (chartId) {
            options = { etc: entityTypeCode, id: `${Utilities.Guid.trimGuid(chartId)}` };
        } else {
            options = { etc: entityTypeCode };
        }
        
        uriString += `&extraqs=${DynamicsUrlResolver.escapeOptions(options)}`;

        return this.addSolutionToUri(uriString, solutionId);
    }

    static getManageEntityKeyUrl(config:DynamicsWebApi.Config, entityId?:string, keyId?:string, solutionId?:string): string {
        let uriString:string = `${Utilities.String.withTrailingSlash(config.webApiUrl)}tools/systemcustomization/AlternateKeys/manageAlternateKeys.aspx?entityId=${DynamicsUrlResolver.crmGuid(entityId)}`;

        if (keyId) {
            uriString += `&entityKeyId=${DynamicsUrlResolver.crmGuid(keyId)}`;
        } 

        return this.addSolutionToUri(uriString, solutionId);
    }

    static getManageEntityRelationshipUrl(config:DynamicsWebApi.Config, entityId?:string, relationshipId?:string, solutionId?:string): string {
        let uriString:string = `${Utilities.String.withTrailingSlash(config.webApiUrl)}tools/systemcustomization/relationships/manageRelationship.aspx?entityId=${DynamicsUrlResolver.crmGuid(entityId)}`;

        if (relationshipId) {
            uriString += `&entityRelationshipId=${DynamicsUrlResolver.crmGuid(relationshipId)}`;
        } 

        uriString += "&entityRole=referenced";

        return this.addSolutionToUri(uriString, solutionId);
    }

    static getManageBusinessProcessUri(config:DynamicsWebApi.Config, processType:CdsSolutions.ProcessType, entityTypeCode?:number, processId?:string, solutionId?:string): string {
        let uriString:string;
        let uri: string;

        switch (processType)
        {
            case CdsSolutions.ProcessType.BusinessRule:
                uriString = `${Utilities.String.withTrailingSlash(config.webApiUrl)}tools/systemcustomization/businessrules/businessRulesDesigner.aspx?BRLaunchpoint=BRGrid&otc=${entityTypeCode}&templateId=0`;

                if (processId) {
                    uriString += `id=${DynamicsUrlResolver.crmGuid(processId)}`;  
                }

                uri = this.addSolutionToUri(uriString);
                break;
            case CdsSolutions.ProcessType.Flow:
                break;
            case CdsSolutions.ProcessType.BusinessProcessFlow:
                uriString = `${Utilities.String.withTrailingSlash(config.webApiUrl)}Tools/ProcessControl/UnifiedProcessDesigner.aspx?`;

                if (processId) {
                    uriString += `id=${DynamicsUrlResolver.crmGuid(processId)}`;  
                }

                uri = this.addSolutionToUri(uriString);
                break;
            case CdsSolutions.ProcessType.Dialog:
            case CdsSolutions.ProcessType.Action:
            case CdsSolutions.ProcessType.Workflow:
                uriString = `${Utilities.String.withTrailingSlash(config.webApiUrl)}sfa/workflow/edit.aspx?`;

                if (processId) {
                    uriString += `id=${DynamicsUrlResolver.crmGuid(processId)}`;  
                }

                uri = this.addSolutionToUri(uriString, solutionId);
                break;
        }

        return uri;
    }

    static getManageWebResourceUri(config:DynamicsWebApi.Config, webResourceId?:string, solutionId?:string): string {
        let uriString:string = `${Utilities.String.withTrailingSlash(config.webApiUrl)}main.aspx?etc=9333&pagetype=webresourceedit`;

        if (webResourceId) {
            uriString += `&id=${DynamicsUrlResolver.crmGuid(webResourceId)}`;
        }

        return this.addSolutionToUri(uriString, solutionId);
    }

    static getManageOptionSetUri(config:DynamicsWebApi.Config, entityId?:string, entityTypeCode?:string, optionSetId?:string, solutionId?:string): string {
        let uriString:string = `${Utilities.String.withTrailingSlash(config.webApiUrl)}tools/systemcustomization/optionset/optionset.aspx?`;

        if (entityId) {
            uriString += `&_CreateFromId=${DynamicsUrlResolver.crmGuid(entityId)}`;
        }

        if (entityTypeCode) {
            uriString += `&_CreateFromType=${entityTypeCode}`;
        }

        if (optionSetId) {
            uriString += `&id=${DynamicsUrlResolver.crmGuid(optionSetId)}`;
        }

        return this.addSolutionToUri(uriString, solutionId);
    }

    private static crmGuid(value:string): string {
        return `%7B${Utilities.Guid.trimGuid(value)}%7D`;
    }

    private static escapeOptions(options:any): string {
        let returnString = escape(Utilities.$Object.asQuerystring(options));
        returnString = returnString.replace("%257B", "%7B").replace("%257D", "%7D");

        return `${returnString}`;
    }

    private static addSolutionToUri(uriString:string, solutionId?:string): string {
        if (solutionId)
        {
            if (!uriString.endsWith("?")) {
                uriString += "&";             
            }

            uriString += `appSolutionId=${DynamicsUrlResolver.crmGuid(solutionId)}`;
        }

        return uriString;
    }
}
