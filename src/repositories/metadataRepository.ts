import * as vscode from 'vscode';
import { DynamicsWebApiClient } from "../api/DynamicsWebApi";
import { TS } from 'typescript-linq/TS';

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
            
                        let components = new TS.Linq.Enumerator(solution.solution_solutioncomponent);
                        let filteredList = components
                            .join(new TS.Linq.Enumerator(entitiesResponse.value), c => c["objectid"], e => e["MetadataId"], (c, e) => e)
                            .orderBy(e => e["LogicalName"])
                            .toArray();
            
                        return filteredList;
                    });           
                } else {
                    return new TS.Linq.Enumerator(entitiesResponse.value).orderBy(e => e["LogicalName"]).toArray();
                }
            }
        );   
    }

    public retrieveAttributes(entityKey:string) : Promise<any[]>
    {
        return this.webapi.retrieveAttributes(entityKey, undefined, undefined, 'AttributeOf eq null')
            .then(response => new TS.Linq.Enumerator(response.value).orderBy(a => a["LogicalName"]).toArray());
    }

    public retrieveForms(entityLogicalName:string) : Promise<any[]>
    {
        let request:DynamicsWebApi.RetrieveMultipleRequest = {
            collection: "systemforms",
            filter: `objecttypecode eq '${entityLogicalName}' and formactivationstate eq 1`,
            orderBy: ["name"]
        };

        return this.webapi.retrieveRequest(request)
            .then(response => response.value);
    }

    public retrieveViews(entityLogicalName:number) : Promise<any[]>
    {
        let request:DynamicsWebApi.RetrieveMultipleRequest = {
            collection: "savedqueries",
            filter: `returnedtypecode eq '${entityLogicalName}' and statecode eq 0`,
            orderBy: ["name"]
        };

        return this.webapi.retrieveRequest(request)
            .then(response => response.value);
    }
}