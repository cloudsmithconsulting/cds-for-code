import { CdsWebApi } from '../api/cds-webapi/CdsWebApi';
import { TS } from 'typescript-linq/TS';
import ApiHelper from "./ApiHelper";
import { CdsSolutions } from '../api/CdsSolutions';
import Dictionary from '../core/types/Dictionary';

export default class MetadataRepository {
    constructor (config:CdsWebApi.Config) {
        this.webapi = new CdsWebApi.WebApiClient(config);
    }

    private webapi: CdsWebApi.WebApiClient;

    get config(): CdsWebApi.Config {
        return this.webapi ? this.webapi.config : null;
    }

    static readonly defaultSelections = new Dictionary<string, string[]>([
        { key: 'EntityDefinitions', value: [ 'MetadataId', 'LogicalName', 'DisplayName', 'IsIntersect', 'PrimaryIdAttribute', 'PrimaryNameAttribute' ] },
        { key: 'AttributeDefinitions', value: [ 'MetadataId', 'LogicalName', 'DisplayName', 'AttributeOf', 'AttributeType', 'AttributeTypeName' ] },
        { key: 'systemforms', value: [ 'formid', 'objecttypecode', 'type', 'formactivationstate', 'name', 'description' ] },
        { key: 'savedqueries', value: [ 'savedqueryid', 'returnedtypecode', 'statecode', 'name', 'description' ] },
        { key: 'savedqueryvisualizations', value: [ 'savedqueryvisualizationid', 'primaryentitytypecode', 'name', 'description' ] },
    ]);

    retrieveEntityMetadataId(logicalName: string) : Promise<string> {
        return this.retrieveEntityByLogicalName(logicalName, ['MetadataId'])
            .then(response => (response) ? response.MetadataId : null);
    }

    retrieveEntityByKey(entityKey: string, select: string[] = MetadataRepository.defaultSelections["EntityDefinitions"]) : Promise<any> {
        return this.webapi.retrieveEntity(entityKey, select);
    }

    retrieveEntityByLogicalName(logicalName: string, select: string[] = MetadataRepository.defaultSelections["EntityDefinitions"]) : Promise<any> {
        return this.webapi.retrieveEntity(`LogicalName='${logicalName}'`, select);
    }

    retrieveEntities(solutionId?: string, select: string[] = MetadataRepository.defaultSelections["EntityDefinitions"]) : Promise<any[]> {
        return this.webapi.retrieveEntities(select, "IsIntersect eq false")
            .then(entitiesResponse => ApiHelper.filterSolutionComponents(this.webapi, entitiesResponse, solutionId, CdsSolutions.SolutionComponent.Entity, e => e["MetadataId"]))
            .then(response => response ? response.orderBy(e => e["LogicalName"]).toArray() : []);
    }

    retrieveAttributes(entityKey: string, select: string[] = MetadataRepository.defaultSelections["AttributeDefinitions"]) : Promise<any[]> {
        return this.webapi.retrieveAttributes(entityKey, undefined, select, 'AttributeOf eq null')
            .then(response => new TS.Linq.Enumerator(response.value).orderBy(a => a["LogicalName"]).toArray());
    }

    retrieveOptionSets(solutionId?: string, select?: string[]): Promise<any[]> {
        return this.webapi.retrieveGlobalOptionSets(undefined, select)
            .then(optionSetResponse => ApiHelper.filterSolutionComponents(this.webapi, optionSetResponse, solutionId, CdsSolutions.SolutionComponent.OptionSet, o => o["MetadataId"]))
            .then(response => response.orderBy(o => o["Name"]).toArray());
    }

    retrieveOptionSet(optionSetKey: string, select?: string[]): Promise<any> {
        return this.webapi.retrieveGlobalOptionSet(optionSetKey, undefined, select);
    }

    retrieveForms(entityLogicalName: string, solutionId?: string, select: string[] = MetadataRepository.defaultSelections["systemforms"]) : Promise<any[]> {
        let request:CdsWebApi.RetrieveMultipleRequest = {
            collection: "systemforms",
            select: select,
            filter: `objecttypecode eq '${entityLogicalName}' and type ne 10 and formactivationstate eq 1`,  
            orderBy: ["name"]
        };

        return this.webapi.retrieveRequest(request)
            .then(systemFormResponse => ApiHelper.filterSolutionComponents(this.webapi, systemFormResponse, solutionId, CdsSolutions.SolutionComponent.Form, f => f["formid"]))
            .then(response => response.toArray());
    }

    retrieveForm(formid: string, select?: string[]): Promise<any> {
        return this.webapi.retrieve(formid, "systemforms", select);
    }

    retrieveDashboards(entityLogicalName: string, solutionId?: string, select: string[] = MetadataRepository.defaultSelections["systemforms"]) : Promise<any[]> {
        let request:CdsWebApi.RetrieveMultipleRequest = {
            collection: "systemforms",
            select: select,
            filter: `objecttypecode eq '${entityLogicalName}' and type eq 10 and formactivationstate eq 1`,  
            orderBy: ["name"]
        };

        return this.webapi.retrieveRequest(request)
            .then(systemFormResponse => ApiHelper.filterSolutionComponents(this.webapi, systemFormResponse, solutionId, CdsSolutions.SolutionComponent.SystemForm, f => f["formid"]))
            .then(response => response.toArray());
    }

    retrieveViews(entityLogicalName: string, solutionId?: string, select: string[] = MetadataRepository.defaultSelections["savedqueries"]) : Promise<any[]> {
        let request:CdsWebApi.RetrieveMultipleRequest = {
            collection: "savedqueries",
            select: select,
            filter: `returnedtypecode eq '${entityLogicalName}' and statecode eq 0`,
            orderBy: ["name"]
        };

        return this.webapi.retrieveRequest(request)
            .then(savedQueryResponse => ApiHelper.filterSolutionComponents(this.webapi, savedQueryResponse, solutionId, CdsSolutions.SolutionComponent.SavedQuery, q => q["savedqueryid"]))
            .then(response => response.toArray());
    }

    retrieveView(savedqueryid: string, select?: string[]): Promise<any> {
        return this.webapi.retrieve(savedqueryid, "savedqueries", select);
    }

    retrieveCharts(entityLogicalName: string, solutionId?: string, select: string[] = MetadataRepository.defaultSelections["savedqueryvisualizations"]) : Promise<any[]> {
        let request:CdsWebApi.RetrieveMultipleRequest = {
            collection: "savedqueryvisualizations",
            select: select,
            filter: `primaryentitytypecode eq '${entityLogicalName}'`,
            orderBy: ["name"]
        };

        return this.webapi.retrieveRequest(request)
            .then(savedQueryResponse => ApiHelper.filterSolutionComponents(this.webapi, savedQueryResponse, solutionId, CdsSolutions.SolutionComponent.SavedQueryVisualization, q => q["savedqueryvisualizationid"]))
            .then(response => response.toArray());
    }

    retrieveChart(savedqueryvisualizationid: string, select?: string[]): Promise<any> {
        return this.webapi.retrieve(savedqueryvisualizationid, "savedqueryvisualizations", select);
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