import { DynamicsWebApiClient } from "../api/DynamicsWebApi";
import { DynamicsWebApi } from '../api/Types';
import { Utilities } from '../helpers/Utilities';
import ApiHelper from "../helpers/ApiHelper";

export default class ApiRepository
{
    private config:DynamicsWebApi.Config;

    public constructor (config:DynamicsWebApi.Config)
    {
        this.config = config;
        this.webapi = new DynamicsWebApiClient(this.config);
    }

    private webapi: DynamicsWebApiClient;

    public async whoAmI() : Promise<any>
    {
        return await this.webapi.executeUnboundFunction('WhoAmI');
    }

    public retrieveSolution(solutionId:string) : Promise<any[]> {
        return this.webapi.retrieveRequest({ collection: "solutions", id: solutionId })
            .then(response => response.value);
    }

    public retrieveSolutions() : Promise<any[]> {
        let request:DynamicsWebApi.RetrieveMultipleRequest = {
            collection: "solutions",
            filter: "isvisible eq true",
            orderBy: ["uniquename"]
        };

        return this.webapi.retrieveAllRequest(request)
            .then(response => response.value);
    }

    public retrieveProcesses(solutionId?:string) : Promise<any[]> {
        let request:DynamicsWebApi.RetrieveMultipleRequest = {
            collection: "workflows",
            filter: "componentstate ne 2 and componentstate ne 3 and type eq 1",
            orderBy: ["name"]
        };

        if (solutionId)
        {
            request.filter = ` and solutionid eq ${solutionId}`;
        }

        return this.webapi.retrieveAllRequest(request)
            .then(response => response.value);
    }

    public retrieveWebResourceFolders(solutionId?:string, folder?:string) : Promise<string[]> {
        let request:DynamicsWebApi.RetrieveMultipleRequest = {
            collection: "webresourceset",
            filter: "contains(name, '/')",
            select: ['webresourceid', "name"],
            orderBy: ["name"]
        };

        if (folder) {
            folder = Utilities.EnforceTrailingSlash(folder);
            request.filter = `startswith(name,'${folder}')`;
        }

        return this.webapi.retrieveAllRequest(request)
            .then(webResourceFolderResponse => ApiHelper.filterSolutionComponents(this.webapi, webResourceFolderResponse, solutionId, DynamicsWebApi.SolutionComponent.WebResource, w => w["webresourceid"]))
            .then(response => response
                .select(w => w["name"].replace(folder || '', ''))
                .where(n => n.split("/").length > 1)
                .select(n => n.split("/")[0])
                .distinct()
                .toArray());
        }

    public retrieveWebResources(solutionId?:string, folder?:string) : Promise<any[]> {
        let request:DynamicsWebApi.RetrieveMultipleRequest = {
            collection: "webresourceset",
            filter: "not contains(name, '/')",
            orderBy: ["displayname"]
        };

        let depth: number = 0;

        if (folder) {
            folder = Utilities.EnforceTrailingSlash(folder);
            request.filter = `startswith(name,'${folder}')`;
            depth = folder.split("/").length - 1;
        }

        return this.webapi.retrieveAllRequest(request)
            .then(webResourceResponse => ApiHelper.filterSolutionComponents(this.webapi, webResourceResponse, solutionId, DynamicsWebApi.SolutionComponent.WebResource, w => w["webresourceid"]))
            .then(response => response
                .where(w => w["name"].split("/").length === depth + 1)
                .toArray());
    }

    public retrievePluginAssemblies(solutionId?:string) : Promise<any[]> {
        let request:DynamicsWebApi.RetrieveMultipleRequest = {
            collection: "pluginassemblies",
            orderBy: ["name"]
        };

        return this.webapi.retrieveAllRequest(request)
            .then(pluginResponse => ApiHelper.filterSolutionComponents(this.webapi, pluginResponse, solutionId, DynamicsWebApi.SolutionComponent.PluginAssembly, w => w["pluginassemblyid"]))
            .then(response => response
                .where(p => p["ishidden"].Value === false)
                .toArray());
    }

    public addSolutionComponent(solution:any, componentId:string, componentType:DynamicsWebApi.SolutionComponent, addRequiredComponents:boolean = false, doNotIncludeSubcomponents:boolean = true, componentSettings?:string): Promise<any>
    {
        var actionParams = { 
            ComponentId: componentId,
            ComponentType: DynamicsWebApi.CodeMappings.getSolutionComponentCode(componentType),
            SolutionUniqueName: solution.uniquename,  
            AddRequiredComponents: addRequiredComponents,
            DoNotIncludeSubcomponents: doNotIncludeSubcomponents,
            IncludedComponentSettingsValues: componentSettings
        };

        return this.webapi.executeBoundAction(solution.solutionid, "solutions", "AddSolutionComponent", actionParams);
    }
}