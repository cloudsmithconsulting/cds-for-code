import { DynamicsWebApiClient } from "../api/DynamicsWebApi";
import { DynamicsWebApi } from '../api/Types';
import Utilities from '../helpers/Utilities';
import ApiHelper from "../helpers/ApiHelper";
import * as vscode from 'vscode';
import * as path from 'path';
import { TS } from "typescript-linq";

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
        const request:DynamicsWebApi.RetrieveMultipleRequest = {
            collection: "solutions",
            filter: "isvisible eq true",
            orderBy: ["uniquename"]
        };

        return this.webapi.retrieveAllRequest(request)
            .then(response => response.value);
    }

    public retrieveProcesses(entityName?:string, solutionId?:string) : Promise<any[]> {
        // documentation of the attributes for workflow: https://docs.microsoft.com/en-us/dynamics365/customer-engagement/web-api/workflow?view=dynamics-ce-odata-9        
        const request:DynamicsWebApi.RetrieveMultipleRequest = {
            collection: "workflows",
            filter: `componentstate ne 2 and componentstate ne 3 and type eq 1`,
            orderBy: ["name"]
        };

        if (solutionId) {
            request.filter += ` and solutionid eq ${solutionId}`;
        }

        if (entityName) { 
            request.filter += ` and primaryentity eq '${entityName}'`;
        }

        return this.webapi.retrieveAllRequest(request)
            .then(response => response.value);
    }

    public retrieveWebResourceFolders(solutionId?:string, folder?:string) : Promise<string[]> {
        const request:DynamicsWebApi.RetrieveMultipleRequest = {
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
            .then(response => { console.log(response); return response; })
            .then(webResourceFolderResponse => ApiHelper.filterSolutionComponents(this.webapi, webResourceFolderResponse, solutionId, DynamicsWebApi.SolutionComponent.WebResource, w => w["webresourceid"]))
            .then(response => { console.log(response); return response; })
            .then(response => response
                .select(w => w["name"].replace(folder || '', ''))
                .where(n => n.split("/").length > 1)
                .select(n => n.split("/")[0])
                .distinct()
                .toArray());
        }

    public retrieveWebResources(solutionId?:string, folder?:string) : Promise<any[]> {
        const request:DynamicsWebApi.RetrieveMultipleRequest = {
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
            .then(response => {
                return response
                    .where(w => (w["name"] === folder || w["name"].split("/").length === depth + 1))
                    .toArray();
            });
    }

    public retrievePluginAssemblies(solutionId?:string) : Promise<any[]> {
        const request:DynamicsWebApi.RetrieveMultipleRequest = {
            collection: "pluginassemblies",
            orderBy: ["name"]
        };

        return this.webapi.retrieveAllRequest(request)
            .then(pluginResponse => ApiHelper.filterSolutionComponents(this.webapi, pluginResponse, solutionId, DynamicsWebApi.SolutionComponent.PluginAssembly, w => w["pluginassemblyid"]))
            .then(response => response ? response
                .where(p => p["ishidden"].Value === false)
                .toArray() : []);
    }

    public retrievePluginTypes(pluginAssemblyId:string) {
        const request:DynamicsWebApi.RetrieveRequest = {
            collection: "pluginassemblies",
            id: pluginAssemblyId,
            select: ['name', 'publickeytoken']
        };

        return this.webapi.retrieveRequest(request)
            .then(response => {
                return this.webapi.retrieveAllRequest({
                    collection: "plugintypes",
                    filter: `assemblyname eq '${response.name}'${response.publickeytoken ? " and publickeytoken eq '" + response.publickeytoken + "'" : ""}`
                }).then(response => response.value);
            });
    }

    public upsertPluginType(pluginAssemblyId:string, typeName:string, name:string = typeName, friendlyName:string = typeName, description?:string) {        
        return this.webapi.retrieveMultipleRequest({
            collection: "plugintypes",
            select: ["plugintypeid"],
            filter: `_pluginassemblyid_value eq ${pluginAssemblyId} and typename eq '${typeName}'`
        }).then(response => {
            let updateObject:any = {};

            if (response && response.value && response.value.length > 0) {
                updateObject = response.value[0];
            }

            updateObject["pluginassemblyid@odata.bind"] = "pluginassemblies(" + pluginAssemblyId + ")";
            updateObject.typename = typeName;
            updateObject.name = name;
            updateObject.friendlyname = friendlyName;
            updateObject.description = description;

            if (response.value && response.value.length > 0) {
                this.webapi.update(updateObject.plugintypeid, "plugintypes", updateObject);
            } else {
                this.webapi.create(updateObject, "plugintypes");
            }
        });        
    }

    // Gets a list of entities and their IDs
    public retrieveEntityTypeCodes() : Promise<any[]>
    {
        let entitiesQuery:DynamicsWebApi.RetrieveMultipleRequest = {
            select: [ "MetadataId", "LogicalName", "ObjectTypeCode" ]
        };

        return this.webapi.retrieveEntitiesRequest(entitiesQuery)
            .then(response => response.value ? new TS.Linq.Enumerator(response.value).orderBy(e => e["LogicalName"]).toArray() : []);
    }

    // Lookup "Message" in plugin registration
    public retrieveSdkMessages() {
        const request:DynamicsWebApi.RetrieveMultipleRequest = {
            collection: "sdkmessages",
            select: ["sdkmessageid", "name", "autotransact", "availability", "categoryname", "isactive", "ismanaged", "isprivate", "isreadonly", "template", "workflowsdkstepenabled"]
        };

        return this.webapi.retrieveAllRequest(request)
            .then(response => response.value);
    }

    public retrieveSdkMessageDetails(sdkMessageId:string) {
        const request:DynamicsWebApi.RetrieveRequest = {
            collection: "sdkmessages",
            id: sdkMessageId,
            expand: [ { property: "sdkmessageid_sdkmessagefilter", select: [ "sdkmessagefilterid", "primaryobjecttypecode", "secondaryobjecttypecode" ] } ]
        };

        return this.webapi.retrieveRequest(request);
    }
    
    public retrievePluginSteps(pluginTypeId:string) {
        const request:DynamicsWebApi.RetrieveMultipleRequest = {
            collection: "sdkmessageprocessingsteps",
            expand: [ { property: "sdkmessageid" } ],
            filter: `plugintypeid/plugintypeid eq ${pluginTypeId}`,
        };

        return this.webapi.retrieveRequest(request)
            .then(response => {
                return response && response.value ? response.value : null;
            }).then(async response => {

                await response.forEach(r => {
                    r.sdkmessageid.filters = this.webapi.retrieveMultiple("sdkmessagefilters", [], `_sdkmessageid_value eq ${r.sdkmessageid}`)
                        .then(r => new TS.Linq.Enumerator(r.value).toArray());
                 });

                 return response;
            });
    }

    public retrievePluginStepImages(pluginStepId:string) {
        const request:DynamicsWebApi.RetrieveRequest = {
            collection: "sdkmessageprocessingsteps",
            id: pluginStepId,
            select: [],
            expand: [ { property: "sdkmessageprocessingstepid_sdkmessageprocessingstepimage"} ]
        };

        return this.webapi.retrieveRequest(request)
            .then(response => {
                return response && response.sdkmessageprocessingstepid_sdkmessageprocessingstepimage && response.sdkmessageprocessingstepid_sdkmessageprocessingstepimage.length > 0 ? response.sdkmessageprocessingstepid_sdkmessageprocessingstepimage : null;
            });
    }

    public uploadPluginAssembly(assemblyUri:vscode.Uri, pluginAssemblyId?:string): Thenable<any> {
        const fs = vscode.workspace.fs;
        let fileContents;

        return fs.stat(assemblyUri)
            .then(stat => {
                return fs.readFile(assemblyUri); 
            }).then(contents => {
                fileContents = Utilities.BytesToBase64(contents);

                return fileContents;
            }).then(contents => {
                if (pluginAssemblyId) {
                    return this.webapi.retrieveRequest({ 
                        collection: "pluginassemblies",
                        id: pluginAssemblyId,
                        select: ['pluginassemblyid', 'content', 'culture', 'description', 'name']
                    }).then(response => response.value)
                    .catch(error => console.error(error));
                } else {
                    const name = path.parse(assemblyUri.fsPath).name;

                    return this.webapi.retrieveMultipleRequest({ 
                        collection: "pluginassemblies",
                        filter: `name eq '${name}'`,
                        select: ['pluginassemblyid', 'content', 'culture', 'description', 'name']
                    }).then(response => response.value && response.value.length > 0 ? response.value[0] : {
                        name: path.parse(assemblyUri.fsPath).name
                    })
                    .catch(error => console.error(error));                }
            }).then(pluginassembly => { 
                pluginAssemblyId = pluginassembly.pluginassemblyid;
                pluginassembly.content = fileContents; 
                
                return pluginassembly; 
            }).then(pluginAssembly => {
                if (!pluginAssemblyId) {
                    return this.webapi.create(pluginAssembly, "pluginassemblies")
                        .then(assemblyId => pluginAssemblyId)
                        .catch(error => console.error(error));
                } else { 
                    return this.webapi.update(pluginAssemblyId, "pluginassemblies", pluginAssembly)
                        .then(assemblyId => pluginAssemblyId)
                        .catch(error => console.error(error));
                }
            });
    }

    public addSolutionComponent(solution:any, componentId:string, componentType:DynamicsWebApi.SolutionComponent, addRequiredComponents:boolean = false, doNotIncludeSubcomponents:boolean = true, componentSettings?:string): Promise<any> {
        const actionParams = { 
            ComponentId: componentId,
            ComponentType: DynamicsWebApi.CodeMappings.getSolutionComponentCode(componentType),
            SolutionUniqueName: solution.uniquename,  
            AddRequiredComponents: addRequiredComponents,
            DoNotIncludeSubcomponents: doNotIncludeSubcomponents,
            IncludedComponentSettingsValues: componentSettings || null
        };

        return this.webapi.executeUnboundAction("AddSolutionComponent", actionParams)
            .then(response => response.value || null);
    }

    public getSolutionComponent(componentId:string, componentType:DynamicsWebApi.SolutionComponent): Promise<any> {
        const solutionQuery:DynamicsWebApi.RetrieveMultipleRequest = {
            collection: "solutioncomponents",
            filter: `componenttype eq ${DynamicsWebApi.CodeMappings.getSolutionComponentCode(componentType)} and objectid eq ${componentId}`
        };    

        return this.webapi.retrieveMultipleRequest(solutionQuery)
            .then(response => response.value && response.value.length > 0 ? response.value[0] : null);
    }

    public removeSolutionComponent(solution:any, componentId:string, componentType:DynamicsWebApi.SolutionComponent): Promise<any> {
        return this.getSolutionComponent(componentId, componentType)
            .then(solutionComponent => {
                if (!solutionComponent) { return; }

                //TODO: write microsoft about this very messed up API scheme... pass in a "solutioncomponent" object with an id of the child object, not the record???
                const returnObject = { 
                    SolutionComponent: {
                        "solutioncomponentid": solutionComponent.objectid,
                        "@odata.type":"Microsoft.Dynamics.CRM.solutioncomponent"},
                    ComponentType: DynamicsWebApi.CodeMappings.getSolutionComponentCode(componentType),
                    SolutionUniqueName: solution.uniquename
                };

                return returnObject;
            })
            .then(params => this.webapi.executeUnboundAction("RemoveSolutionComponent", params))
            .catch(error => console.error(error))
            .then(response => response.value || null);
    }
}