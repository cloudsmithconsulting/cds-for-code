import { DynamicsWebApi } from '../api/cds-webapi/DynamicsWebApi';
import { TS } from 'typescript-linq/TS';
import ApiHelper from "./ApiHelper";
import { CdsSolutions } from '../api/CdsSolutions';

export default class MetadataRepository
{
    constructor (config:DynamicsWebApi.Config) {
        this.webapi = new DynamicsWebApi.WebApiClient(config);
    }

    private webapi: DynamicsWebApi.WebApiClient;

    get config(): DynamicsWebApi.Config {
        return this.webapi ? this.webapi.config : null;
    }

    retrieveEntities(solutionId?:string) : Promise<any[]> {
        return this.webapi.retrieveEntities(undefined, "IsIntersect eq false")
            .then(entitiesResponse => ApiHelper.filterSolutionComponents(this.webapi, entitiesResponse, solutionId, CdsSolutions.SolutionComponent.Entity, e => e["MetadataId"]))
            .then(response => response ? response.orderBy(e => e["LogicalName"]).toArray() : []);
    }

    retrieveAttributes(entityKey:string) : Promise<any[]> {
        return this.webapi.retrieveAttributes(entityKey, undefined, undefined, 'AttributeOf eq null')
            .then(response => new TS.Linq.Enumerator(response.value).orderBy(a => a["LogicalName"]).toArray());
    }

    retrieveOptionSets(solutionId?:string): Promise<any[]> {
        return this.webapi.retrieveGlobalOptionSets()
            .then(optionSetResponse => ApiHelper.filterSolutionComponents(this.webapi, optionSetResponse, solutionId, CdsSolutions.SolutionComponent.OptionSet, o => o["MetadataId"]))
            .then(response => response.orderBy(o => o["Name"]).toArray());
    }

    retrieveForms(entityLogicalName:string, solutionId?:string) : Promise<any[]> {
        let request:DynamicsWebApi.RetrieveMultipleRequest = {
            collection: "systemforms",
            filter: `objecttypecode eq '${entityLogicalName}' and type ne 10 and formactivationstate eq 1`,  
            orderBy: ["name"]
        };

        return this.webapi.retrieveRequest(request)
            .then(systemFormResponse => ApiHelper.filterSolutionComponents(this.webapi, systemFormResponse, solutionId, CdsSolutions.SolutionComponent.Form, f => f["formid"]))
            .then(response => response.toArray());
    }

    retrieveDashboards(entityLogicalName:string, solutionId?:string) : Promise<any[]> {
        let request:DynamicsWebApi.RetrieveMultipleRequest = {
            collection: "systemforms",
            filter: `objecttypecode eq '${entityLogicalName}' and type eq 10 and formactivationstate eq 1`,  
            orderBy: ["name"]
        };

        return this.webapi.retrieveRequest(request)
            .then(systemFormResponse => ApiHelper.filterSolutionComponents(this.webapi, systemFormResponse, solutionId, CdsSolutions.SolutionComponent.SystemForm, f => f["formid"]))
            .then(response => response.toArray());
    }

    retrieveViews(entityLogicalName:string, solutionId?:string) : Promise<any[]> {
        let request:DynamicsWebApi.RetrieveMultipleRequest = {
            collection: "savedqueries",
            filter: `returnedtypecode eq '${entityLogicalName}' and statecode eq 0`,
            orderBy: ["name"]
        };

        return this.webapi.retrieveRequest(request)
            .then(savedQueryResponse => ApiHelper.filterSolutionComponents(this.webapi, savedQueryResponse, solutionId, CdsSolutions.SolutionComponent.SavedQuery, q => q["savedqueryid"]))
            .then(response => response.toArray());
    }

    retrieveCharts(entityLogicalName:string, solutionId?:string) : Promise<any[]> {
        let request:DynamicsWebApi.RetrieveMultipleRequest = {
            collection: "savedqueryvisualizations",
            filter: `primaryentitytypecode eq '${entityLogicalName}'`,
            orderBy: ["name"]
        };

        return this.webapi.retrieveRequest(request)
            .then(savedQueryResponse => ApiHelper.filterSolutionComponents(this.webapi, savedQueryResponse, solutionId, CdsSolutions.SolutionComponent.SavedQueryVisualization, q => q["savedqueryvisualizationid"]))
            .then(response => response.toArray());
    }

    retrieveKeys(entityKey:string) : Promise<any[]> {
        return this.webapi.retrieveEntity(entityKey, ["MetadataId"], [ { property: "Keys" } ])
            .then(response => response.Keys);
    }

    retrieveRelationships(entityKey:string) : Promise<{ oneToMany:any[], manyToOne:any[], manyToMany:any[] }> {
        return this.webapi.retrieveEntity(entityKey, ["MetadataId"], [ { property: "OneToManyRelationships" }, { property: "ManyToOneRelationships" }, { property: "ManyToManyRelationships" } ])
            .then(response => response ? { oneToMany: response.OneToManyRelationships, manyToOne: response.ManyToOneRelationships, manyToMany: response.ManyToManyRelationships } : null);
    }
}