import { DynamicsWebApiClient } from "../api/DynamicsWebApi";
import { DynamicsWebApi } from '../api/Types';
import Utilities from '../helpers/Utilities';
import ApiHelper from "../helpers/ApiHelper";
import * as vscode from 'vscode';
import * as path from 'path';
import { TS } from "typescript-linq";

export default class ApiRepository {
    private config:DynamicsWebApi.Config;

    constructor (config:DynamicsWebApi.Config) {
        this.config = config;
        this.webapi = new DynamicsWebApiClient(this.config);
    }

    private webapi: DynamicsWebApiClient;

    async whoAmI() : Promise<any> {
        return await this.webapi.executeUnboundFunction('WhoAmI');
    }

    retrieveSolution(solutionId:string) : Promise<any[]> {
        return this.webapi.retrieveRequest({ collection: "solutions", id: solutionId });
    }

    retrieveSolutions() : Promise<any[]> {
        const request:DynamicsWebApi.RetrieveMultipleRequest = {
            collection: "solutions",
            filter: "isvisible eq true",
            orderBy: ["uniquename"]
        };

        return this.webapi.retrieveAllRequest(request)
            .then(response => {
                return response.value;
            }).catch(error => {
                throw error;
            });
    }

    retrieveProcesses(entityName?:string, solutionId?:string) : Promise<any[]> {
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

    async retrieveWebResourceFolders(solutionId?:string, folder?:string, customizableOnly:boolean = true) : Promise<string[]> {
        const request:DynamicsWebApi.RetrieveMultipleRequest = {
            collection: "webresourceset",
            filter: "contains(name, '/')",
            select: ['webresourceid', "name", "iscustomizable"],
            orderBy: ["name"]
        };

        if (folder) {
            folder = Utilities.EnforceTrailingSlash(folder);
            request.filter = `startswith(name,'${folder}')`;
        }

        if (customizableOnly) {
            request.filter += " and iscustomizable/Value eq true";
        }

        if (solutionId && Utilities.IsGuid(solutionId)) { 
            const components = (await ApiHelper.getSolutionComponents(this.webapi, solutionId, DynamicsWebApi.SolutionComponent.WebResource)).map(c => `'${c["objectid"]}'`).join(",");

            if (!Utilities.IsNullOrEmpty(components)) {
                request.filter += ` and Microsoft.Dynamics.CRM.In(PropertyName='webresourceid',PropertyValues=[${components}])`;
            } else {
                return Promise.resolve([]);
            }
        }

        return this.webapi.retrieveAllRequest(request)
            .then(response => new TS.Linq.Enumerator(response.value)
                .select(w => w["name"].replace(folder || '', ''))
                .where(n => n.split("/").length > 1)
                .select(n => n.split("/")[0])
                .distinct()
                .toArray());
        }

    async retrieveWebResources(solutionId?:string, folder?:string, customizableOnly:boolean = true) : Promise<any[]> {
        const selectAll:boolean = folder && folder === "*";
        const request:DynamicsWebApi.RetrieveMultipleRequest = {
            collection: "webresourceset",
            select: ['webresourceid', "name", "displayname", "webresourcetype", "solutionid", "iscustomizable"],
            filter: !selectAll ? "(not contains(name, '/'))" : "",
            orderBy: ["name"]
        };

        folder = !selectAll ? folder : undefined;

        let depth: number = 0;

        if (folder) {
            folder = Utilities.EnforceTrailingSlash(folder);
            request.filter = `startswith(name,'${folder}')`;
            depth = folder.split("/").length - 1;
        }

        if (customizableOnly) {
            if (!Utilities.IsNullOrEmpty(request.filter)) {
                request.filter += " and";
            }

            request.filter += " iscustomizable/Value eq true";
        }

        if (solutionId && Utilities.IsGuid(solutionId)) { 
            const components = (await ApiHelper.getSolutionComponents(this.webapi, solutionId, DynamicsWebApi.SolutionComponent.WebResource)).map(c => `'${c["objectid"]}'`).join(",");

            if (!Utilities.IsNullOrEmpty(components)) {
                if (!Utilities.IsNullOrEmpty(request.filter)) {
                    request.filter += " and";
                }

                request.filter += ` Microsoft.Dynamics.CRM.In(PropertyName='webresourceid',PropertyValues=[${components}])`;
                request.filter = request.filter.trim();
            } else {
                return Promise.resolve([]);
            }
        }

        return this.webapi.retrieveAllRequest(request)
            .then(response => {
                let filteredResponse = new TS.Linq.Enumerator(response.value);

                if (!selectAll) {
                    filteredResponse = filteredResponse.where(w => (w["name"] === folder || w["name"].split("/").length === depth + 1));
                } 

                return filteredResponse.toArray();
            });
    }

    retrieveWebResource(webResourceId:string): Promise<any> {
        return this.webapi.retrieve(webResourceId, "webresourceset");
    }

    upsertWebResource(webResource:any): Promise<any> {
        if (webResource.webresourceid) {
            return this.webapi.update(webResource.webresourceid, "webresourceset", webResource, "return=representation");
        } else {
            return this.webapi.create(webResource, "webresourceset", "return=representation");
        }
    }

    retrievePluginAssemblies(solutionId?:string) : Promise<any[]> {
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

    retrievePluginTypes(pluginAssemblyId:string) {
        const request:DynamicsWebApi.RetrieveRequest = {
            collection: "pluginassemblies",
            id: pluginAssemblyId,
            select: ["name", "publickeytoken"]
        };

        return this.webapi.retrieveRequest(request)
            .then(response => {
                return this.webapi.retrieveAllRequest({
                    collection: "plugintypes",
                    filter: `assemblyname eq '${response.name}'${response.publickeytoken ? " and publickeytoken eq '" + response.publickeytoken + "'" : ""}`,
                    select: ["plugintypeid", "name", "friendlyname", "assemblyname", "typename", "solutionid", "_pluginassemblyid_value"]
                }).then(response => response.value);
            });
    }

    upsertPluginType(pluginAssemblyId:string, typeName:string, name:string = typeName, friendlyName:string = typeName, description?:string) {        
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
    retrieveEntityTypeCodes() : Promise<any[]> {
        let entitiesQuery:DynamicsWebApi.RetrieveMultipleRequest = {
            select: [ "MetadataId", "LogicalName", "ObjectTypeCode" ]
        };

        return this.webapi.retrieveEntitiesRequest(entitiesQuery)
            .then(response => response.value ? new TS.Linq.Enumerator(response.value).orderBy(e => e["LogicalName"]).toArray() : []);
    }

    // Lookup "Message" in plugin registration
    retrieveSdkMessages() {
        const request:DynamicsWebApi.RetrieveMultipleRequest = {
            collection: "sdkmessages",
            select: ["sdkmessageid", "name", "autotransact", "availability", "categoryname", "isactive", "isprivate", "isreadonly", "template", "workflowsdkstepenabled"],
        };

        return this.webapi.retrieveAllRequest(request)
            .then(response => response.value ? new TS.Linq.Enumerator(response.value).orderBy(e => e["name"]).toArray() : []);
    }

    retrieveSdkMessageFilters() {
        const request: DynamicsWebApi.RetrieveMultipleRequest = {
            collection: "sdkmessagefilters",
            select: [ "sdkmessagefilterid", "_sdkmessageid_value", "primaryobjecttypecode", "secondaryobjecttypecode" ]
        };

        return this.webapi.retrieveAllRequest(request)
            .then(response => response.value ? new TS.Linq.Enumerator(response.value).orderBy(e => e["primaryobjecttypecode"]).toArray() : []);
    }

    retrieveSdkMessageDetails(sdkMessageId:string) {
        const request:DynamicsWebApi.RetrieveRequest = {
            collection: "sdkmessages",
            id: sdkMessageId
        };

        return this.webapi.retrieveRequest(request);
    }

    retrievePluginStep(sdkmessageprocessingstepid:string) {
        const request:DynamicsWebApi.RetrieveRequest = {
            collection: "sdkmessageprocessingsteps",
            id: sdkmessageprocessingstepid,
            expand: [ 
                { property: "sdkmessageid", select: ["sdkmessageid", "name"] },
                { property: "sdkmessagefilterid", select: [ "sdkmessagefilterid", "_sdkmessageid_value", "primaryobjecttypecode", "secondaryobjecttypecode" ] },
                { property: "eventhandler_plugintype", select: ["plugintypeid", "_pluginassemblyid_value", "name"] },
                { property: "sdkmessageprocessingstepsecureconfigid", select: ["sdkmessageprocessingstepsecureconfigid", "secureconfig"] },
                { property: "impersonatinguserid", select: [ "systemuserid", "fullname", "isdisabled" ] }
            ]
        };

        return this.webapi.retrieveRequest(request);
    }
    
    retrievePluginSteps(pluginTypeId:string) {
        const request:DynamicsWebApi.RetrieveMultipleRequest = {
            collection: "sdkmessageprocessingsteps",
            expand: [ { property: "sdkmessageid" } ],
            filter: `plugintypeid/plugintypeid eq ${pluginTypeId}`,
        };

        return this.webapi.retrieveRequest(request)
            .then(response => {
                return response && response.value ? response.value : null;
            })
            .then(async response => {
                await response.forEach(async r => {
                    // here we are getting some basic stuff the api would normally expand
                    // but since we're in a collection we have to do it manually
                    //r.sdkmessagefilterid = await this.webapi.retrieve(r._sdkmessagefilterid_value, "sdkmessagefilters");
                    r.eventhandler_plugintype = await this.webapi.retrieve(r._eventhandler_value, "plugintypes", ["plugintypeid", "_pluginassemblyid_value", "name"]);
                    //r.sdkmessageprocessingstepsecureconfigid = await this.webapi.retrieve(r._sdkmessageprocessingstepsecureconfigid_value, "sdkmessageprocessingstepsecureconfigs");
                 });

                 return response;
            });
    }

    retrievePluginStepImages(pluginStepId:string) {
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

    retrieveSystemUsers() {
        const request: DynamicsWebApi.RetrieveMultipleRequest = {
            collection: "systemusers",
            select: [ "systemuserid", "fullname", "isdisabled" ],
            filter: "fullname ne 'INTEGRATION'",
            orderBy: [ "fullname" ]
        };

        return this.webapi.retrieveAllRequest(request)
            .then(response => response.value || []);
    }

    uploadPluginAssembly(assemblyUri:vscode.Uri, pluginAssemblyId?:string): Thenable<any> {
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
                        .then(assemblyId => assemblyId);
                } else { 
                    return this.webapi.update(pluginAssemblyId, "pluginassemblies", pluginAssembly)
                        .then(assemblyId => pluginAssemblyId);
                }
            });
    }

    async upsertPluginStep(step: any) {
        // see if we have a secure configration
        let secureConfig = null;
        if (step.sdkmessageprocessingstepsecureconfigid) {
            // transfer to a new object
            secureConfig = step.sdkmessageprocessingstepsecureconfigid;
            // delete from step, it will error in the update if not
            delete step.sdkmessageprocessingstepsecureconfigid;
        }

        // insert or update secure config
        if (secureConfig && secureConfig.sdkmessageprocessingstepsecureconfigid) {
            await this.webapi.updateRequest({
                id: secureConfig.sdkmessageprocessingstepsecureconfigid,
                collection: "sdkmessageprocessingstepsecureconfigs",
                entity: secureConfig
            });
        }

        const secureConfigCreate = async (result: any, step: any) => {
            // we only do this if it needs created
            if (secureConfig && !secureConfig.sdkmessageprocessingstepsecureconfigid) {
                await this.webapi.createRequest({
                    collection: "sdkmessageprocessingstepsecureconfigs",
                    entity: secureConfig
                })
                .then(result => {
                    // after create, associate it to the plugin step
                    const sdkmessageprocessingstepid = step.sdkmessageprocessingstepid;
                    // create a smaller step message to associate the record back to the step
                    step = {
                        sdkmessageprocessingstepid,
                        "sdkmessageprocessingstepsecureconfigid@odata.bind": `sdkmessageprocessingstepsecureconfigs(${result})`
                    };
                })
                .then(() => {
                    return this.webapi.updateRequest({
                        id: step.sdkmessageprocessingstepid,
                        collection: "sdkmessageprocessingsteps",
                        entity: step
                    });
                });
            }
            return result;
        };

        // see if we need to update or create the step
        if (step.sdkmessageprocessingstepid) {
            return this.webapi.updateRequest({
                id: step.sdkmessageprocessingstepid,
                collection: "sdkmessageprocessingsteps",
                entity: step
            }).then((result) => secureConfigCreate(result, step));
        } else {
            delete step.sdkmessageprocessingstepid;
            return this.webapi.createRequest({
                collection: "sdkmessageprocessingsteps",
                entity: step
            }).then((result) => {
                step.sdkmessageprocessingstepid = result;
                return secureConfigCreate(result, step);
            });
        }
    }

    async upsertPluginStepImage(stepImage: any) : Promise<any> {
        const stepId = stepImage.sdkmessageprocessingstepid;
        delete stepImage.sdkmessageprocessingstepid;
        stepImage["sdkmessageprocessingstepid@odata.bind"] = `sdkmessageprocessingsteps(${stepId})`;
        stepImage.messagepropertyname = 'Target';

        if (stepImage.sdkmessageprocessingstepimageid) {
            return this.webapi.updateRequest({
                id: stepImage.sdkmessageprocessingstepimageid,
                collection: "sdkmessageprocessingstepimages",
                entity: stepImage
            });
        } else {
            if (stepImage.sdkmessageprocessingstepimageid === null) {
                delete stepImage.sdkmessageprocessingstepimageid;
            }
            return this.webapi.createRequest({
                collection: "sdkmessageprocessingstepimages",
                entity: stepImage
            })
            .catch(err => console.error(err));
        }
    }

    addSolutionComponent(solution:any, componentId:string, componentType:DynamicsWebApi.SolutionComponent, addRequiredComponents:boolean = false, doNotIncludeSubcomponents:boolean = true, componentSettings?:string): Promise<any> {
        // This action allows you to call it on components that are already added, no need for a check.
        const parameters:any = { 
            ComponentId: componentId,
            ComponentType: DynamicsWebApi.CodeMappings.getSolutionComponentCode(componentType),
            SolutionUniqueName: solution.uniquename,  
            AddRequiredComponents: addRequiredComponents,
            DoNotIncludeSubcomponents: doNotIncludeSubcomponents,
            IncludedComponentSettingsValues: componentSettings || null
        };

        return this.webapi.executeUnboundAction("AddSolutionComponent", parameters);
    }

    getSolutionComponent(componentId:string, componentType:DynamicsWebApi.SolutionComponent): Promise<any> {
        const solutionQuery:DynamicsWebApi.RetrieveMultipleRequest = {
            collection: "solutioncomponents",
            filter: `componenttype eq ${DynamicsWebApi.CodeMappings.getSolutionComponentCode(componentType)} and objectid eq ${componentId}`
        };    

        return this.webapi.retrieveMultipleRequest(solutionQuery)
            .then(response => response.value && response.value.length > 0 ? response.value[0] : null);
    }

    async removePluginStep(step: any) : Promise<boolean> {
        await this.webapi.deleteRequest({
            id: step.sdkmessageprocessingstepid,
            collection: "sdkmessageprocessingsteps",
        });
        // delete the secure config if they have one
        if (step._sdkmessageprocessingstepsecureconfigid_value) {
            await this.webapi.deleteRequest({
                id: step._sdkmessageprocessingstepsecureconfigid_value,
                collection: "sdkmessageprocessingstepsecureconfigs",
            });
        }

        return true;
    }

    public removePluginStepImage(stepImage: any) : Promise<any> {
        return this.webapi.deleteRequest({
            id: stepImage.sdkmessageprocessingstepimageid,
            collection: "sdkmessageprocessingstepimages"
        });
    }

    removeSolutionComponent(solution:any, componentId:string, componentType:DynamicsWebApi.SolutionComponent): Promise<any> {
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
            .then(params => this.webapi.executeUnboundAction("RemoveSolutionComponent", params));
    }
}