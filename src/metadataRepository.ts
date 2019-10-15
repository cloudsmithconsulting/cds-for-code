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

    public retrieveEntities(solutionId?:string) : Promise<any[]>
    {
        let componentsQuery:DynamicsWebApi.RetrieveMultipleRequest;

        if (solutionId)
        {
            componentsQuery = {
                collection: "solutioncomponents",
                filter: "componenttype -eq 1" + (solutionId ? ` and SolutionId eq "${solutionId}"` : ""),
                orderBy: ["uniquename"]
            };    
        }

        let entitiesQuery:DynamicsWebApi.RetrieveMultipleRequest = {
            orderBy: ["logicalName"]
        };
        
        //TODO: Fix this so that it cross references with the solutioncomponents query above.
        return this.webapi.retrieveEntitiesRequest(entitiesQuery)
            .then(response => response.value);
    }
}