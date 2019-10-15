import * as vscode from 'vscode';
import { DynamicsWebApi } from "./DynamicsWebApi/DynamicsWebApi";

export default class MetadataRepository
{
    public static wireUpCommands(context: vscode.ExtensionContext) {
        return;
    }

    private config:DynamicsWebApi.Config;

    public constructor (config:DynamicsWebApi.Config)
    {
        this.config = config;
        this.webapi = new DynamicsWebApi(config);
    }

    private webapi: DynamicsWebApi;

    public async retrieveEntities(solutionId?:string) : Promise<any[]>
    {
        let components:DynamicsWebApi.RetrieveMultipleRequest = {
            collection: "solutioncomponents",
            filter: "componenttype -eq 1" + (solutionId ? ` and SolutionId eq "${solutionId}"` : ""),
            orderBy: ["uniquename"]
        };

        //TODO: Fix this.
        return this.webapi.retrieveEntities();
    }
}