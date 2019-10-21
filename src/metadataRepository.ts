import * as vscode from 'vscode';
import { DynamicsWebApiClient } from "./DynamicsWebApi/DynamicsWebApi";
import * as TS from 'typescript-linq/TS';
import { filter } from 'minimatch';

export default class MetadataRepository
{
    private config:DynamicsWebApi.Config;

    public constructor (config:DynamicsWebApi.Config)
    {
        this.config = config;
        this.webapi = new DynamicsWebApiClient(this.config);
    }

    private webapi: DynamicsWebApiClient;

    public async retrieveEntities(solutionId?:string) : Promise<any[]>
    {
        let solutionQuery:DynamicsWebApi.RetrieveRequest;
        let solution:any;
        let entitiesQuery:DynamicsWebApi.RetrieveMultipleRequest = {
            filter: "IsIntersect eq false"
        };

        if (solutionId)
        {
            solutionQuery = {
                collection: "solutions",
                id: solutionId,
                expand: [ { property: "solution_solutioncomponent", filter: "componenttype eq 1" } ]
            };    

            solution = await this.webapi.retrieveRequest(solutionQuery);

            if (!solution || !solution.solution_solutioncomponent || solution.solution_solutioncomponent.length === 0)
            {
                return null;
            }

            let entities = await this.webapi.retrieveEntitiesRequest(entitiesQuery);
            let components = new TS.TS.Linq.Enumerator(solution.solution_solutioncomponent);
            let filteredList = components.join(new TS.TS.Linq.Enumerator(entities.value), c => c["objectid"], e => e["MetadataId"], (c, e) => e).toArray();

            return filteredList;
        }
        else
        {
            //TODO: Fix this so that it cross references with the solutioncomponents query above.
            return this.webapi.retrieveEntitiesRequest(entitiesQuery)
                .then(response => 
                    //new TS.TS.Linq.Enumerator(response.value).where(e => e["IsIntersect"] === false).orderBy(e => e["LogicalName"]).toArray()
                    new TS.TS.Linq.Enumerator(response.value).orderBy(e => e["LogicalName"]).toArray()
                );   
        }
    }
}