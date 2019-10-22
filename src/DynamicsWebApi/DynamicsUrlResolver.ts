import * as vscode from 'vscode';
import { Utilities } from '../Utilities';

export enum DynamicsForm
{
    ActionCard = "card",
    Main = "main",
    QuickCreate = "quickCreate",
    QuickView = "quick"
}

export class DynamicsUrlResolver
{
    public static getManageSolutionUri(config:DynamicsWebApi.Config, solutionId?:string):vscode.Uri
    {
        let uriString:string = `${Utilities.EnforceTrailingSlash(config.webApiUrl)}tools/solution/edit.aspx`;
        
        if (solutionId)
        {
            uriString += `?id=%7B${Utilities.TrimGuid(solutionId)}%7D`;
        }

        return vscode.Uri.parse(uriString);
    }

    public static getManageEntityUri(config:DynamicsWebApi.Config, entityId:string, solutionId?:string):vscode.Uri
    {
        let uriString:string = `${Utilities.EnforceTrailingSlash(config.webApiUrl)}tools/systemcustomization/attributes/manageentity.aspx?id=%7B${Utilities.TrimGuid(entityId)}%7D`;

        return this.parseUriString(uriString, solutionId);
    }

    public static getManageAttributeUri(config:DynamicsWebApi.Config, entityId:string, attributeId:string, solutionId?:string):vscode.Uri
    {
        let uriString:string = `${Utilities.EnforceTrailingSlash(config.webApiUrl)}tools/systemcustomization/attributes/manageAttribute.aspx?entityId=%7B${Utilities.TrimGuid(entityId)}%7D&attributeId=${Utilities.TrimGuid(attributeId)}`;

        return this.parseUriString(uriString, solutionId);
    }

    public static getManageEntityFormUri(config:DynamicsWebApi.Config, entityTypeCode:string, formId:string, formType:DynamicsForm, solutionId?:string):vscode.Uri
    {
        let uriString:string = `${Utilities.EnforceTrailingSlash(config.webApiUrl)}main.aspx?etc=${entityTypeCode}&extraqs=formtype%3d${formType.toString()}%26formId%3d${Utilities.TrimGuid(formId)}%26action%3d-1&pagetype=formeditor`;

        return this.parseUriString(uriString, solutionId);
    }

    public static getManageEntityViewUri(config:DynamicsWebApi.Config, entityId:string, viewId:string, solutionId?:string):vscode.Uri
    {
        let uriString:string = `${Utilities.EnforceTrailingSlash(config.webApiUrl)}tools/vieweditor/viewManager.aspx?entityId=%7B${Utilities.TrimGuid(entityId)}%7D&id=%7B${Utilities.TrimGuid(viewId)}%7D`;

        return this.parseUriString(uriString, solutionId);
    }

    private static parseUriString(uriString:string, solutionId?:string):vscode.Uri
    {
        if (solutionId)
        {
            uriString += `&appSolutionId=%7B${Utilities.TrimGuid(solutionId)}%7D`;
        }

        return vscode.Uri.parse(uriString);
    }
}