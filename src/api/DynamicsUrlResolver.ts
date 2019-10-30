import * as vscode from 'vscode';
import Utilities from '../helpers/Utilities';
import { DynamicsWebApi } from './Types';
import { urlToOptions } from 'vscode-test/out/util';

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

    public static getManageEntityUri(config:DynamicsWebApi.Config, entityId?:string, solutionId?:string):vscode.Uri
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
        let uriString:string = `${Utilities.EnforceTrailingSlash(config.webApiUrl)}main.aspx?etc=${entityTypeCode}&extraqs=`;

        if (formId) {
            let options = { formtype: formType, formId: Utilities.TrimGuid(formId), action: -1 };

            uriString += encodeURIComponent(Utilities.ObjectToQuerystring(options));
        }

        uriString += "&pagetype=formeditor";

        return this.parseUriString(uriString, solutionId);
    }

    public static getManageEntityViewUri(config:DynamicsWebApi.Config, entityId:string, entityTypeCode?:string, viewId?:string, solutionId?:string):vscode.Uri
    {
        let uriString:string = `${Utilities.EnforceTrailingSlash(config.webApiUrl)}tools/vieweditor/viewManager.aspx?entityId=%7B${Utilities.TrimGuid(entityId)}%7D`;

        if (viewId) {
            uriString += `&id=%7B${Utilities.TrimGuid(viewId)}%7D`;
        } else {
            uriString += `&mode=new&objectTypeCode=${entityTypeCode}`;
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

    public static getManageWebResourceUri(config:DynamicsWebApi.Config, webResourceId?:string, solutionId?:string):vscode.Uri {
        let uriString:string = `${Utilities.EnforceTrailingSlash(config.webApiUrl)}main.aspx?etc=9333&pagetype=webresourceedit`;

        if (webResourceId) {
            uriString += `&id=%7B${Utilities.TrimGuid(webResourceId)}%7D`;
        }

        return this.parseUriString(uriString, solutionId);
    }

    public static getManageOptionSetUri(config:DynamicsWebApi.Config, entityId?:string, entityTypeCode?:string, optionSetId?:string, solutionId?:string): vscode.Uri {
        let uriString:string = `${Utilities.EnforceTrailingSlash(config.webApiUrl)}tools/systemcustomization/optionset/optionset.aspx?`;

        if (entityId) {
            uriString += `&_CreateFromId=%7b${Utilities.TrimGuid(entityId)}%7d`;
        }

        if (entityTypeCode) {
            uriString += `&_CreateFromType=${entityTypeCode}`;
        }

        if (optionSetId) {
            uriString += `&id=%7B${Utilities.TrimGuid(optionSetId)}%7D`;
        }

        return this.parseUriString(uriString, solutionId);
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