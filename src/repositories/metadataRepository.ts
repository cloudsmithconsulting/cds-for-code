import { DynamicsWebApiClient } from "../api/DynamicsWebApi";
import { DynamicsWebApi } from '../api/Types';
import { TS } from 'typescript-linq/TS';
import ApiHelper from "../helpers/ApiHelper";

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
            .then(entitiesResponse => ApiHelper.filterSolutionComponents(this.webapi, entitiesResponse, solutionId, DynamicsWebApi.SolutionComponent.Entity, e => e["MetadataId"]))
            .then(response => response.orderBy(e => e["LogicalName"]).toArray());
    }

    public retrieveAttributes(entityKey:string) : Promise<any[]>
    {
        return this.webapi.retrieveAttributes(entityKey, undefined, undefined, 'AttributeOf eq null')
            .then(response => new TS.Linq.Enumerator(response.value).orderBy(a => a["LogicalName"]).toArray());
    }

    public retrieveOptionSets(solutionId?:string): Promise<any[]>
    {
        return this.webapi.retrieveGlobalOptionSets()
            .then(optionSetResponse => ApiHelper.filterSolutionComponents(this.webapi, optionSetResponse, solutionId, DynamicsWebApi.SolutionComponent.OptionSet, o => o["MetadataId"]))
            .then(response => response.orderBy(o => o["LogicalName"]).toArray());
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