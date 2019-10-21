import * as vscode from 'vscode';
import { DynamicsWebApiClient } from "./DynamicsWebApi/DynamicsWebApi";
import * as TS from 'typescript-linq/TS';

export default class MetadataRepository
{
    private config:DynamicsWebApi.Config;

    public constructor (config:DynamicsWebApi.Config)
    {
        this.config = config;
        this.webapi = new DynamicsWebApiClient(this.config);
    }

    private webapi: DynamicsWebApiClient;

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

        let entitiesQuery:DynamicsWebApi.RetrieveMultipleRequest;
        /*
        Looks like Microsoft didn't see fit to allow orderBy expressions on metadata queries.  Silly gooses!
        = {
            orderBy: ["logicalName"]
        };
        */
        
        //TODO: Fix this so that it cross references with the solutioncomponents query above.
        return this.webapi.retrieveEntitiesRequest(entitiesQuery)
            .then(response => 
                new TS.TS.Linq.Enumerator(response.value).where(e => e["IsIntersect"] === false).orderBy(e => e["LogicalName"]).toArray()
            );
    }
}