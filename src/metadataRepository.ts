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

    public retrieveEntities(solutionId?:string) : Promise<any[]>
    {
        let entitiesQuery:DynamicsWebApi.RetrieveMultipleRequest = {
            filter: "IsIntersect eq false"
        };

        return this.webapi.retrieveEntitiesRequest(entitiesQuery)
            .then(entitiesResponse => {
                if (solutionId) {
                    let solutionQuery:DynamicsWebApi.RetrieveRequest = {
                        collection: "solutions",
                        id: solutionId,
                        expand: [ { property: "solution_solutioncomponent", filter: "componenttype eq 1" } ]
                    };    
                    
                    return this.webapi.retrieveRequest(solutionQuery).then(solution => {
                        if (!solution || !solution.solution_solutioncomponent || solution.solution_solutioncomponent.length === 0)
                        {
                            return null;
                        }
            
                        let components = new TS.TS.Linq.Enumerator(solution.solution_solutioncomponent);
                        let filteredList = components
                            .join(new TS.TS.Linq.Enumerator(entitiesResponse.value), c => c["objectid"], e => e["MetadataId"], (c, e) => e)
                            .orderBy(e => e["LogicalName"])
                            .toArray();
            
                        return filteredList;
                    });           
                } else {
                    return new TS.TS.Linq.Enumerator(entitiesResponse.value).orderBy(e => e["LogicalName"]).toArray();
                }
            }
        );   
    }
}