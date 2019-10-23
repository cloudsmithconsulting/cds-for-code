import * as vscode from 'vscode';
import { Utilities } from '../helpers/Utilities';
import { Dictionary } from '../helpers/Dictionary';

export enum DynamicsForm
{
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

export enum ProcessType
{
    Workflow = "Workflow",
    Dialog = "Dialog",
    BusinessRule = "Business Rule",
    Action = "Action",
    BusinessProcessFlow = "Business Process Flow",
    Flow = "Flow"
}

export class DynamicsUrlResolver
{
    private static _formTypes = new Dictionary<number, DynamicsForm>([
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

    private static _processTypes = new Dictionary<number, ProcessType>([
        { key: 0, value: ProcessType.Workflow },
        { key: 1, value: ProcessType.Dialog },
        { key: 2, value: ProcessType.BusinessRule },
        { key: 3, value: ProcessType.Action },
        { key: 4, value: ProcessType.BusinessProcessFlow },
        { key: 5, value: ProcessType.Flow }
    ]);

    public static parseFormType(formType:number): DynamicsForm
    {
        return this._formTypes[formType];
    }

    public static parseProcessType(processType:number): ProcessType
    {
        return this._processTypes[processType];
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

    public static getManageEntityFormUri(config:DynamicsWebApi.Config, entityTypeCode:string, formType:DynamicsForm, formId?:string, solutionId?:string):vscode.Uri
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

    public static getManageBusinessProcessUri(config:DynamicsWebApi.Config, processType:ProcessType, processId?:string, solutionId?:string):vscode.Uri
    {
        let uriString:string;
        let uri:vscode.Uri;

        switch (processType)
        {
            case ProcessType.BusinessProcessFlow:
                uriString = `${Utilities.EnforceTrailingSlash(config.webApiUrl)}Tools/ProcessControl/UnifiedProcessDesigner.aspx?`;

                if (processId) {
                    uriString += `id=%7b${processId}%7d`;                    
                }

                uri = this.parseUriString(uriString);
                break;
            case ProcessType.Action:
            case ProcessType.Workflow:
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