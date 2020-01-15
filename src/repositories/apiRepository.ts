import * as vscode from 'vscode';
import * as path from 'path';
import * as cs from '../cs';
import { CdsWebApi } from '../api/cds-webapi/CdsWebApi';
import { CdsSolutions } from '../api/CdsSolutions';
import { Utilities } from '../core/Utilities';
import { TS } from "typescript-linq";
import ApiHelper from "./ApiHelper";
import ExtensionConfiguration from '../core/ExtensionConfiguration';
import { CWA } from '../api/cds-webapi/CWA';
import Dictionary from '../core/types/Dictionary';

export default class ApiRepository {
    constructor (config: CdsWebApi.Config) {
        this.webapi = new CdsWebApi.WebApiClient(config);
    }

    private webapi: CdsWebApi.WebApiClient;

    get config(): CdsWebApi.Config {
        return this.webapi ? this.webapi.config : null;
    }

    static readonly defaultSelections = new Dictionary<string, string[]>([
        { key: 'appmodules', value: [ 'appmoduleid', 'uniquename', 'name', 'appmoduleversion', 'ismanaged', 'solutionid', 'url', 'webresourceid', 'welcomepageid' ] },
        { key: 'solutions', value: [ 'solutionid', 'uniquename', 'friendlyname', 'version', 'ismanaged', 'isvisible' ] },
        { key: 'workflows', value: [ 'workflowid', 'componentstate', 'category', 'type', 'solutionid', 'primaryentity', 'name', 'description' ] },
        { key: 'pluginassemblies', value: [ 'pluginassemblyid', 'name', 'version', 'publickeytoken', 'ishidden' ] },
        { key: 'webresources', value: [ 'webresourceid', 'name', 'displayname', 'webresourcetype', 'iscustomizable' ] },
        { key: 'pluginassemblies', value: [ 'name', 'publickeytoken' ] },
        { key: 'plugintypes', value: [ 'plugintypeid', 'name', 'friendlyname', 'assemblyname', 'typename', 'solutionid', '_pluginassemblyid_value' ] },
        { key: 'sdkmessages', value: [ 'sdkmessageid', 'name', 'autotransact', 'availability', 'categoryname', 'isactive', 'isprivate', 'isreadonly', 'template', 'workflowsdkstepenabled' ] },
        { key: 'sdkmessagefilters', value: [ 'sdkmessagefilterid', '_sdkmessageid_value', 'primaryobjecttypecode', 'secondaryobjecttypecode' ] },
        { key: 'systemusers', value: [ 'systemuserid', 'fullname', 'isdisabled' ] },
        { key: 'solutioncomponents', value: [ 'solutioncomponentid', 'componenttype', 'objectid' ] }
    ]);

    publishXml(xml:string) : Promise<any> {
        return this.webapi.executeUnboundAction("PublishXml", { ParameterXml: xml });
    }

    publishAllXml() : Promise<any> {
        return this.webapi.executeUnboundAction("PublishAllXml");
    }

    async whoAmI() : Promise<any> {
        return await this.webapi.executeUnboundFunction('WhoAmI');
    }

    retrieveSolution(solutionId:string) : Promise<any[]> {
        return this.webapi.retrieveRequest({ collection: "solutions", id: solutionId });
    }

    async retrieveBuiltInSolution(builtInType: "System" | "Active" | "Default", select: string[] = ApiRepository.defaultSelections["solutions"]): Promise<any> {
        const request:CdsWebApi.RetrieveMultipleRequest = {
            collection: "solutions",
            filter: `uniquename eq '${builtInType}'`,
            select: select,
            orderBy: ["uniquename"]
        };

        return this.webapi.retrieveAllRequest(request)
            .then(response => response.value && response.value.length > 0 ? response.value[0] : null);
    }

    async retrieveApplications(solutionId?: string, select: string[] = ApiRepository.defaultSelections["appmodules"]) : Promise<any[]> {
        const request:CdsWebApi.RetrieveMultipleRequest = {
            collection: "appmodules",
            select: select,
            filter: '',
            orderBy: ["name"]
        };

        if (solutionId && Utilities.Guid.isGuid(solutionId)) { 
            const components = (await ApiHelper.getSolutionComponents(this.webapi, solutionId, CdsSolutions.SolutionComponent.ModelApp)).map(c => `'${c["objectid"]}'`).join(",");

            if (!Utilities.$Object.isNullOrEmpty(components)) {
                if (!Utilities.$Object.isNullOrEmpty(request.filter)) {
                    request.filter += " and";
                }

                request.filter += ` Microsoft.Dynamics.CRM.In(PropertyName='appmoduleid',PropertyValues=[${components}])`;
                request.filter = request.filter.trim();
            } else {
                return Promise.resolve([]);
            }
        }

        return this.webapi.retrieveAllRequest(request)
            .then(response => response.value);
    }

    retrieveSolutions(select: string[] = ApiRepository.defaultSelections["solutions"]) : Promise<any[]> {
        const showDefaultSolution: boolean = ExtensionConfiguration.getConfigurationValue<boolean>(cs.cds.configuration.explorer.showDefaultSolution);
        const request:CdsWebApi.RetrieveMultipleRequest = {
            collection: "solutions",
            filter: "isvisible eq true",
            select: select,
            orderBy: ["uniquename"]
        };

        if (!showDefaultSolution) {
            request.filter += " and uniquename ne 'Default'";
        }

        return this.webapi.retrieveAllRequest(request)
            .then(response => response.value);
    }

    async retrieveProcesses(entityName?: string, solutionId?: string, select: string[] = ApiRepository.defaultSelections["workflows"]) : Promise<any[]> {
        // documentation of the attributes for workflow: https://docs.microsoft.com/en-us/dynamics365/customer-engagement/web-api/workflow?view=dynamics-ce-odata-9        
        const request:CdsWebApi.RetrieveMultipleRequest = {
            collection: "workflows",
            select: select,
            filter: `componentstate ne 2 and componentstate ne 3 and type eq 1`,
            orderBy: ["name"]
        };

        if (entityName) { 
            request.filter += ` and primaryentity eq '${entityName}'`;
        }

        if (solutionId && Utilities.Guid.isGuid(solutionId)) { 
            const components = (await ApiHelper.getSolutionComponents(this.webapi, solutionId, CdsSolutions.SolutionComponent.Workflow)).map(c => `'${c["objectid"]}'`).join(",");

            if (!Utilities.$Object.isNullOrEmpty(components)) {
                if (!Utilities.$Object.isNullOrEmpty(request.filter)) {
                    request.filter += " and";
                }

                request.filter += ` Microsoft.Dynamics.CRM.In(PropertyName='workflowid',PropertyValues=[${components}])`;
                request.filter = request.filter.trim();
            } else {
                return Promise.resolve([]);
            }
        }

        return this.webapi.retrieveAllRequest(request)
            .then(response => response.value);
    }

    async retrieveProcessTemplates(processType: CdsSolutions.ProcessType, entityName: string, solutionId?: string, select: string[] = ApiRepository.defaultSelections["workflows"]) : Promise<any[]> {
        // documentation of the attributes for workflow: https://docs.microsoft.com/en-us/dynamics365/customer-engagement/web-api/workflow?view=dynamics-ce-odata-9        
        const request:CdsWebApi.RetrieveMultipleRequest = {
            collection: "workflows",
            select: select,
            filter: `componentstate eq 0 and type eq 3 and category eq ${CdsSolutions.CodeMappings.getProcessTypeCode(processType)}`,
            orderBy: ["name"]
        };

        if (entityName) {
            request.filter += `and primaryentity eq '${entityName}'`;
        }

        if (solutionId && Utilities.Guid.isGuid(solutionId)) { 
            const components = (await ApiHelper.getSolutionComponents(this.webapi, solutionId, CdsSolutions.SolutionComponent.Workflow)).map(c => `'${c["objectid"]}'`).join(",");

            if (!Utilities.$Object.isNullOrEmpty(components)) {
                if (!Utilities.$Object.isNullOrEmpty(request.filter)) {
                    request.filter += " and";
                }

                request.filter += ` Microsoft.Dynamics.CRM.In(PropertyName='workflowid',PropertyValues=[${components}])`;
                request.filter = request.filter.trim();
            } else {
                return Promise.resolve([]);
            }
        }

        return this.webapi.retrieveAllRequest(request)
            .then(response => response.value);
    }

    async retrieveWebResourceFolders(solutionId?:string, folder?:string, customizableOnly:boolean = true) : Promise<string[]> {
        const request:CdsWebApi.RetrieveMultipleRequest = {
            collection: "webresourceset",
            filter: "contains(name, '/')",
            select: ['webresourceid', "name", "iscustomizable"],
            orderBy: ["name"]
        };

        if (folder) {
            folder = Utilities.String.withTrailingSlash(folder);
            request.filter = `startswith(name,'${folder}')`;
        }

        if (customizableOnly) {
            request.filter += " and iscustomizable/Value eq true";
        }

        if (solutionId && Utilities.Guid.isGuid(solutionId)) { 
            const components = (await ApiHelper.getSolutionComponents(this.webapi, solutionId, CdsSolutions.SolutionComponent.WebResource)).map(c => `'${c["objectid"]}'`).join(",");

            if (!Utilities.$Object.isNullOrEmpty(components)) {
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

    async retrieveWebResources(solutionId?: string, folder?: string, customizableOnly: boolean = true, select: string[] = ApiRepository.defaultSelections["webresources"]) : Promise<any[]> {
        const selectAll:boolean = folder && folder === "*";
        const request:CdsWebApi.RetrieveMultipleRequest = {
            collection: "webresourceset",
            select: select,
            filter: !selectAll ? "(not contains(name, '/'))" : "",
            orderBy: ["name"]
        };

        folder = !selectAll ? folder : undefined;

        let depth: number = 0;

        if (folder) {
            folder = Utilities.String.withTrailingSlash(folder);
            request.filter = `startswith(name,'${folder}')`;
            depth = folder.split("/").length - 1;
        }

        if (customizableOnly) {
            if (!Utilities.$Object.isNullOrEmpty(request.filter)) {
                request.filter += " and";
            }

            request.filter += " iscustomizable/Value eq true";
        }

        if (solutionId && Utilities.Guid.isGuid(solutionId)) { 
            const components = (await ApiHelper.getSolutionComponents(this.webapi, solutionId, CdsSolutions.SolutionComponent.WebResource)).map(c => `'${c["objectid"]}'`).join(",");

            if (!Utilities.$Object.isNullOrEmpty(components)) {
                if (!Utilities.$Object.isNullOrEmpty(request.filter)) {
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

    createProcess(workflow: any): Promise<any> {
        return this.webapi.create(workflow, "workflows");
    }

    createProcessFromTemplate(processTemplateId:string, name: string) {
        const request = {
            WorkflowName: name
        };
        return this.webapi.executeBoundAction(processTemplateId, "workflows", "Microsoft.Dynamics.CRM.CreateWorkflowFromTemplate", request);
    }

    async upsertWebResource(webResource:any): Promise<any> {
        let forceCreate:boolean = false;

        if (webResource && webResource.webresourceid) {
            const newWebResource = await this.retrieveWebResource(webResource.webresourceid);

            forceCreate = !newWebResource;
        }

        if (webResource && !forceCreate) {
            return this.webapi.update(webResource.webresourceid, "webresourceset", webResource, CWA.Prefer.ReturnRepresentation);
        } else {
            return this.webapi.create(webResource, "webresourceset", CWA.Prefer.ReturnRepresentation);
        }
    }

    retrievePluginAssemblies(solutionId?: string, select: string[] = ApiRepository.defaultSelections["pluginassemblies"]) : Promise<any[]> {
        const request:CdsWebApi.RetrieveMultipleRequest = {
            collection: "pluginassemblies",
            select: select,
            orderBy: ["name"]
        };

        return this.webapi.retrieveAllRequest(request)
            .then(pluginResponse => ApiHelper.filterSolutionComponents(this.webapi, pluginResponse, solutionId, CdsSolutions.SolutionComponent.PluginAssembly, w => w["pluginassemblyid"]))
            .then(response => response ? response
                .where(p => !p["ishidden"] || p["ishidden"].Value === false)
                .toArray() : []);
    }

    retrievePluginTypes(pluginAssemblyId: string, select: string[] = ApiRepository.defaultSelections["pluginassemblies"]) {
        const request:CdsWebApi.RetrieveRequest = {
            collection: "pluginassemblies",
            id: pluginAssemblyId,
            select: select
        };

        return this.webapi.retrieveRequest(request)
            .then(response => {
                return this.webapi.retrieveAllRequest({
                    collection: "plugintypes",
                    filter: `assemblyname eq '${response.name}'${response.publickeytoken ? " and publickeytoken eq '" + response.publickeytoken + "'" : ""}`,
                    select: ApiRepository.defaultSelections["plugintypes"]
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
        return this.webapi.retrieveEntities([ "MetadataId", "LogicalName", "ObjectTypeCode" ])
            .then(response => response.value ? new TS.Linq.Enumerator(response.value).orderBy(e => e["LogicalName"]).toArray() : []);
    }

    // Lookup "Message" in plugin registration
    retrieveSdkMessages(select: string[] = ApiRepository.defaultSelections["sdkmessages"]) {
        const request:CdsWebApi.RetrieveMultipleRequest = {
            collection: "sdkmessages",
            select: select,
        };

        return this.webapi.retrieveAllRequest(request)
            .then(response => response.value ? new TS.Linq.Enumerator(response.value).orderBy(e => e["name"]).toArray() : []);
    }

    retrieveSdkMessageFilters(select: string[] = ApiRepository.defaultSelections["sdkmessagefilters"]) {
        const request: CdsWebApi.RetrieveMultipleRequest = {
            collection: "sdkmessagefilters",
            select: select
        };

        return this.webapi.retrieveAllRequest(request)
            .then(response => response.value ? new TS.Linq.Enumerator(response.value).orderBy(e => e["primaryobjecttypecode"]).toArray() : []);
    }

    retrieveSdkMessageDetails(sdkMessageId:string) {
        const request:CdsWebApi.RetrieveRequest = {
            collection: "sdkmessages",
            id: sdkMessageId
        };

        return this.webapi.retrieveRequest(request);
    }

    retrievePluginStep(sdkmessageprocessingstepid:string) {
        const request:CdsWebApi.RetrieveRequest = {
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
        //TODO: evaluate if the select property can be set on sdkmessageprocessingsteps to avoid select *
        const request:CdsWebApi.RetrieveMultipleRequest = {
            collection: "sdkmessageprocessingsteps",
            expand: [ { property: "sdkmessageid" } ],
            filter: `plugintypeid/plugintypeid eq ${pluginTypeId}`,
        };

        return this.webapi.retrieveRequest(request)
            .then(response => {
                return response && response.value ? response.value : null;
            })
            .then(async response => {
                if (response) { 
                    await response.forEach(async r => {
                        // here we are getting some basic stuff the api would normally expand
                        // but since we're in a collection we have to do it manually
                        //r.sdkmessagefilterid = await this.webapi.retrieve(r._sdkmessagefilterid_value, "sdkmessagefilters");
                        r.eventhandler_plugintype = await this.webapi.retrieve(r._eventhandler_value, "plugintypes", ["plugintypeid", "_pluginassemblyid_value", "name"]);
                        //r.sdkmessageprocessingstepsecureconfigid = await this.webapi.retrieve(r._sdkmessageprocessingstepsecureconfigid_value, "sdkmessageprocessingstepsecureconfigs");
                     });
                }

                 return response;
            });
    }

    retrievePluginStepImages(pluginStepId:string) {
        //TODO: evaluate if the expand property can get a filtered select list, this is doing a select * on sdkmessageprocessingstepimage
        const request:CdsWebApi.RetrieveRequest = {
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

    retrieveSystemUsers(select: string[] = ApiRepository.defaultSelections["systemusers"]) {
        const request: CdsWebApi.RetrieveMultipleRequest = {
            collection: "systemusers",
            select: select,
            filter: "fullname ne 'INTEGRATION'",
            orderBy: [ "fullname" ]
        };

        return this.webapi.retrieveAllRequest(request)
            .then(response => response.value || []);
    }

    uploadPluginAssembly(assemblyUri:vscode.Uri, pluginAssemblyId?:string, isSandboxed: boolean = true): Thenable<any> {
        const fs = vscode.workspace.fs;
        let fileContents;

        return fs.stat(assemblyUri)
            .then(stat => {
                return fs.readFile(assemblyUri); 
            }).then(contents => {
                fileContents = Utilities.Encoding.bytesToBase64(contents);

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
                pluginassembly.isolationmode = isSandboxed ? 2 : 1;

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
                .then(configid => {
                    // after create, associate it to the plugin step
                    const sdkmessageprocessingstepid = step.sdkmessageprocessingstepid;
                    // create a smaller step message to associate the record back to the step
                    step = {
                        sdkmessageprocessingstepid,
                        "sdkmessageprocessingstepsecureconfigid@odata.bind": `sdkmessageprocessingstepsecureconfigs(${configid})`
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
            }).then(async (result) => {
                await secureConfigCreate(result, step);
                return step;
            });
        } else {
            delete step.sdkmessageprocessingstepid;
            return this.webapi.createRequest({
                collection: "sdkmessageprocessingsteps",
                entity: step
            }).then(async (result) => {
                step.sdkmessageprocessingstepid = result;
                await secureConfigCreate(result, step);
                return step;
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
            })
            .then(() => stepImage);
        } else {
            if (stepImage.sdkmessageprocessingstepimageid === null) {
                delete stepImage.sdkmessageprocessingstepimageid;
            }
            return this.webapi.createRequest({
                collection: "sdkmessageprocessingstepimages",
                entity: stepImage
            })
            .then((result) => {
                stepImage.sdkmessageprocessingstepimageid = result;
                return stepImage;
            });
        }
    }

    addSolutionComponent(solution: any, componentId: string, componentType: CdsSolutions.SolutionComponent, addRequiredComponents: boolean = false, doNotIncludeSubcomponents: boolean = true, componentSettings?: string): Promise<any> {
        // This action allows you to call it on components that are already added, no need for a check.
        const parameters:any = { 
            ComponentId: componentId,
            ComponentType: CdsSolutions.CodeMappings.getSolutionComponentCode(componentType),
            SolutionUniqueName: solution.uniquename,  
            AddRequiredComponents: addRequiredComponents,
            DoNotIncludeSubcomponents: doNotIncludeSubcomponents,
            IncludedComponentSettingsValues: componentSettings || null
        };

        return this.webapi.executeUnboundAction("AddSolutionComponent", parameters);
    }

    getSolutionComponent(componentId: string, componentType: CdsSolutions.SolutionComponent, select: string[] = ApiRepository.defaultSelections["solutioncomponents"]): Promise<any> {
        const solutionQuery:CdsWebApi.RetrieveMultipleRequest = {
            collection: "solutioncomponents",
            select: select,
            filter: `componenttype eq ${CdsSolutions.CodeMappings.getSolutionComponentCode(componentType)} and objectid eq ${componentId}`
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

    removeSolutionComponent(solution:any, componentId:string, componentType:CdsSolutions.SolutionComponent): Promise<any> {
        return this.getSolutionComponent(componentId, componentType)
            .then(solutionComponent => {
                if (!solutionComponent) { return; }

                //TODO: write microsoft about this very messed up API scheme... pass in a "solutioncomponent" object with an id of the child object, not the record???
                const returnObject = { 
                    SolutionComponent: {
                        "solutioncomponentid": solutionComponent.objectid,
                        "@odata.type":"Microsoft.Dynamics.CRM.solutioncomponent"},
                    ComponentType: CdsSolutions.CodeMappings.getSolutionComponentCode(componentType),
                    SolutionUniqueName: solution.uniquename
                };

                return returnObject;
            })
            .then(params => this.webapi.executeUnboundAction("RemoveSolutionComponent", params));
    }
}