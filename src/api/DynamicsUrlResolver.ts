import * as vscode from 'vscode';
import Utilities from '../helpers/Utilities';
import { DynamicsWebApi } from './Types';

export default class DynamicsUrlResolver
{
    public static parseFormType(formType:number): DynamicsWebApi.DynamicsForm
    {
        return DynamicsWebApi.CodeMappings.DynamicsForms[formType];
    }

    public static parseProcessType(processType:number): DynamicsWebApi.ProcessType
    {
        return DynamicsWebApi.CodeMappings.ProcessTypes[processType];
    }

    public static parseSolutionComponent(solutionComponent:number): DynamicsWebApi.SolutionComponent
    {
        return DynamicsWebApi.CodeMappings.SolutionComponents[solutionComponent];
    }

    public static getManageSolutionUri(config:DynamicsWebApi.Config, solutionId?:string):vscode.Uri
    {
        let uriString:string = `${Utilities.EnforceTrailingSlash(config.webApiUrl)}tools/solution/edit.aspx?`;
        
        return this.parseUriString(uriString, solutionId);
    }

    public static getManageEntityUri(config:DynamicsWebApi.Config, entityId:string, solutionId?:string):vscode.Uri
    {
        let uriString:string = `${Utilities.EnforceTrailingSlash(config.webApiUrl)}tools/systemcustomization/entities/manageentity.aspx?`;

        if (entityId) {
            uriString += `id=%7B${Utilities.TrimGuid(entityId)}%7D`;
        }

        return this.parseUriString(uriString, solutionId);
    }

    public static getManageAttributeUri(config:DynamicsWebApi.Config, entityId:string, attributeId?:string, solutionId?:string):vscode.Uri
    {
        let uriString:string = `${Utilities.EnforceTrailingSlash(config.webApiUrl)}tools/systemcustomization/attributes/manageAttribute.aspx?entityId=%7B${Utilities.TrimGuid(entityId)}%7D`;

        if (attributeId) {
            uriString += `&attributeId=${Utilities.TrimGuid(attributeId)}`;
        }

        return this.parseUriString(uriString, solutionId);
    }

    public static getManageEntityFormUri(config:DynamicsWebApi.Config, entityTypeCode:string, formType:DynamicsWebApi.DynamicsForm, formId?:string, solutionId?:string):vscode.Uri
    {
        let uriString:string = `${Utilities.EnforceTrailingSlash(config.webApiUrl)}main.aspx?etc=${entityTypeCode}&extraqs=formtype%3d${formType.toString()}%26`;
        
        if (formId) {
            uriString += `formId%3d${Utilities.TrimGuid(formId).toUpperCase()}%26`;
        }

        uriString += `action%3d-1&pagetype=formeditor`;
        
        console.log(uriString);

        return this.parseUriString(uriString, solutionId);
    }

    public static getManageEntityViewUri(config:DynamicsWebApi.Config, entityId:string, viewId?:string, solutionId?:string):vscode.Uri
    {
        let uriString:string = `${Utilities.EnforceTrailingSlash(config.webApiUrl)}tools/vieweditor/viewManager.aspx?entityId=%7B${Utilities.TrimGuid(entityId)}%7D`;

        if (viewId) {
            uriString += `&id=%7B${Utilities.TrimGuid(viewId)}%7D`;
        }

        return this.parseUriString(uriString, solutionId);
    }

    public static getManageBusinessProcessUri(config:DynamicsWebApi.Config, processType:DynamicsWebApi.ProcessType, processId?:string, solutionId?:string):vscode.Uri
    {
        let uriString:string;
        let uri:vscode.Uri;

        switch (processType)
        {
            case DynamicsWebApi.ProcessType.BusinessProcessFlow:
                uriString = `${Utilities.EnforceTrailingSlash(config.webApiUrl)}Tools/ProcessControl/UnifiedProcessDesigner.aspx?`;

                if (processId) {
                    uriString += `id=%7b${processId}%7d`;                    
                }

                uri = this.parseUriString(uriString);
                break;
            case DynamicsWebApi.ProcessType.Action:
            case DynamicsWebApi.ProcessType.Workflow:
                uriString = `${Utilities.EnforceTrailingSlash(config.webApiUrl)}sfa/workflow/edit.aspx?`;

                if (processId) {
                    uriString += `id=%7b${processId}%7d`;                    
                }

                uri = this.parseUriString(uriString, solutionId);
                break;
        }

        return uri;
    }

    private static parseUriString(uriString:string, solutionId?:string):vscode.Uri
    {
        if (solutionId)
        {
            if (!uriString.endsWith("?")) {
                uriString += "&";             
            }

            uriString += `appSolutionId=%7B${Utilities.TrimGuid(solutionId)}%7D`;
        }

        return vscode.Uri.parse(uriString);
    }
}