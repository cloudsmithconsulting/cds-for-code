import * as vscode from 'vscode';
import { Utilities } from '../Utilities';

export class DynamicsUrlResolver
{
    public static getSolutionUri(config:DynamicsWebApi.Config, solutionId?:string):vscode.Uri
    {
        let urlString:string = `${Utilities.EnforceTrailingSlash(config.webApiUrl)}tools/solution/edit.aspx`;
        
        if (solutionId)
        {
            urlString += `?id=%7B${Utilities.TrimGuid(solutionId)}%7D`;
        }

        return vscode.Uri.parse(urlString);
    }
}