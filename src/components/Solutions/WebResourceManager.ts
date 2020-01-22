import * as vscode from 'vscode';
import * as cs from '../../cs';
import * as FileSystem from "../../core/io/FileSystem";
import * as path from 'path';
import { CdsWebApi } from "../../api/cds-webapi/CdsWebApi";
import IContributor from '../../core/CommandBuilder';
import { Utilities } from '../../core/Utilities';
import SolutionMap from "./SolutionMap";
import SolutionWorkspaceMapping from "./SolutionWorkspaceMapping";
import TemplateManager from "../Templates/TemplateManager";
import ApiRepository from '../../repositories/apiRepository';
import EnumParser from '../../core/framework/EnumParser';
import Xml from '../../core/io/Xml';

import createWebResource from "../../commands/cs.cds.deployment.createWebResource";
import compareWebResource from "../../commands/cs.cds.deployment.compareWebResource";
import packWebResource from "../../commands/cs.cds.deployment.packWebResource";
import unpackWebResource from "../../commands/cs.cds.deployment.unpackWebResource";
import SolutionFile from '../SolutionXml/SolutionFile';
import Quickly from '../../core/Quickly';
import { CdsSolutions } from '../../api/CdsSolutions';
import CustomizationsFile from '../SolutionXml/CustomizationsFile';
import command from '../../core/Command';

export default class WebResourceManager {
    @command(cs.cds.controls.explorer.craeteWebResource, "Create web resource from existing file")
    static async createWebResourceFromUri(uri?: vscode.Uri) {
        const returnObject:any = (await vscode.commands.executeCommand(cs.cds.deployment.createWebResource, undefined, undefined, undefined, uri));

        await Quickly.openFile(returnObject.fsPath);
    
        return returnObject;    
    }

    @command(cs.cds.controls.explorer.packWebResource, "Pack web resource from existing file")
    static async packWebResourceFromUri(uri?: vscode.Uri) {
        const returnObject:any = (await vscode.commands.executeCommand(cs.cds.deployment.packWebResource, undefined, undefined, undefined, uri));
        
        await Quickly.openFile(returnObject.fsPath);
    
        return returnObject;
    }

    @command(cs.cds.deployment.createWebResource, "Create web resource")
    async createWebResource(config?:CdsWebApi.Config, solutionId?:string, webResource?:any, fileUri?:vscode.Uri, defaultName:string = "", inform:boolean = true) {
       return await createWebResource.apply(this, [config, solutionId, webResource, fileUri, defaultName, inform]);
    }

    @command(cs.cds.deployment.compareWebResource, "Compare web resource")
    async compareWebResource(defaultUri?: vscode.Uri) {
        compareWebResource.apply(this, [defaultUri]);
    }

    @command(cs.cds.deployment.packWebResource, "Pack web resource")
    async packWebResource(config?:CdsWebApi.Config, solution?:any, webResource?:any, fileUri?:vscode.Uri, inform:boolean = true) {
        packWebResource.apply(this, [config, solution, webResource, fileUri, inform]);
    }

    @command(cs.cds.deployment.unpackWebResource, "Unpack web resource")
    async unpackWebResource(config?:CdsWebApi.Config, webResource?:any, fileUri?: vscode.Uri, autoOpen:boolean = false) {
        unpackWebResource.apply(this, [config, webResource, fileUri, autoOpen]);
    }

    async getSolutionMapping(fsPath?:string, orgId?:string, solutionId?:string): Promise<SolutionWorkspaceMapping> {
        const solutionMap = await SolutionMap.loadFromWorkspace();
        let mappings;

        if (fsPath && FileSystem.exists(fsPath)) {
            mappings = solutionMap.getByPathOrParent(fsPath, orgId);
        } else if (solutionId) {
            mappings = solutionMap.getBySolutionId(solutionId, orgId);
        }

        return mappings && mappings.length > 0 ? mappings[0] : undefined;
    }

    getWebResourceType(extension:string): number | undefined {
        if (!extension || extension === "") {
            return undefined;
        }
        
        if (!extension.startsWith(".")) { extension = "." + extension; }
        
        const webResourceType = EnumParser.getValues<CdsSolutions.WebResourceFileType>(CdsSolutions.WebResourceFileType).find(e => e.toString() === extension);

        const result = webResourceType ? CdsSolutions.CodeMappings.getWebResourceTypeCode(<CdsSolutions.WebResourceFileType>webResourceType) : undefined;
        return result;
    }

    async getWebResourceDetails(fsPath:string | undefined): Promise<any> {
        if (!fsPath) { return; }

        const dataFile = fsPath + ".data.xml";
        
        if (FileSystem.exists(dataFile)) {
            const xmlObject = await Xml.parseFile(dataFile);

            if (xmlObject && xmlObject.WebResource) {
                const result = {
                    webresourceid: xmlObject.WebResource.WebResourceId && xmlObject.WebResource.WebResourceId.length > 0 ? Utilities.Guid.trimGuid(xmlObject.WebResource.WebResourceId[0]) : undefined,
                    name: xmlObject.WebResource.Name && xmlObject.WebResource.Name.length > 0 ? xmlObject.WebResource.Name[0] : undefined,
                    displayname: xmlObject.WebResource.DisplayName && xmlObject.WebResource.DisplayName.length > 0 ? xmlObject.WebResource.DisplayName[0] : undefined,
                    description: xmlObject.WebResource.Description && xmlObject.WebResource.Description.length > 0 ? xmlObject.WebResource.Description[0] : undefined,
                    languagecode: xmlObject.WebResource.LanguageCode && xmlObject.WebResource.LanguageCode.length > 0 ? xmlObject.WebResource.LanguageCode[0] : undefined,
                    webresourcetype: xmlObject.WebResource.WebResourceType && xmlObject.WebResource.WebResourceType.length > 0 && !isNaN(parseInt(xmlObject.WebResource.WebResourceType[0])) ? parseInt(xmlObject.WebResource.WebResourceType[0]) : undefined,
                    introducedversion: xmlObject.WebResource.IntroducedVersion && xmlObject.WebResource.IntroducedVersion.length > 0 ? xmlObject.WebResource.IntroducedVersion[0] : undefined,
                    isenabledformobileclient: xmlObject.WebResource.IsEnabledForMobileClient && xmlObject.WebResource.IsEnabledForMobileClient.length > 0 ? xmlObject.WebResource.IsEnabledForMobileClient[0] === "1" : undefined,
                    isavailableformobileoffline: xmlObject.WebResource.IsAvailableForMobileOffline && xmlObject.WebResource.IsAvailableForMobileOffline.length > 0 ? xmlObject.WebResource.IsAvailableForMobileOffline[0] === "1" : undefined
                };

                return result;
            }
        }

        return undefined;
    }

    async upsertWebResource(config:CdsWebApi.Config, webResource:any, solution?:any): Promise<any> {
        const api = new ApiRepository(config);

        return api.upsertWebResource(webResource)
            .then(response => {
                webResource = response;
            })
            .then(async () => {
                if (solution) {
                    await api.addSolutionComponent(solution, webResource.webresourceid, CdsSolutions.SolutionComponent.WebResource, true, false);
                }               

                return webResource;
            }).then(async () => {
                if (await Quickly.pickBoolean("Would you like to publish the web resource?", "Yes", "No")) {
                    await vscode.commands.executeCommand(cs.cds.deployment.publishCustomizations, config, [ { type: CdsSolutions.SolutionComponent.WebResource, id: webResource.webresourceid }]);
                }
            }).then(() => {
                return webResource;
            });        
    }

    async writeDataXmlFile(map:SolutionWorkspaceMapping, webResource:any, fsPath:string, updateCustomizationsFile: boolean) {
        const dataFile = fsPath + ".data.xml";
        const resolver = (webResource) => {
            const parts = path.relative(map.path, fsPath).split(".").join("").split("\\");

            parts[0] = `/${parts[0]}/`;
            parts.push(Utilities.Guid.trimGuid(webResource.webresourceid));

            return parts.join("");
        };

        if (!FileSystem.exists(dataFile)) {
            await TemplateManager.getSystemTemplate("solution.webresource.xml")
                .then(async template => FileSystem.writeFileSync(dataFile, await template.apply(undefined, { webresource: webResource, resolver: { resolvefilename: resolver } })));
        }       

        // Edit the solution.xml file and add the component there, too.
        const solutionFile = await SolutionFile.from(SolutionMap.mapWorkspacePath(map.path));

        await solutionFile.addComponent(CdsSolutions.SolutionComponent.WebResource, undefined, webResource.name, 0);
        await solutionFile.save(SolutionMap.mapWorkspacePath(map.path));
        
        if (updateCustomizationsFile) {
            // Edit the customizations.xml file and add the component type there, too.
            const customizationsFileLocation = path.join(path.dirname(SolutionMap.mapWorkspacePath(map.path)), "Customizations.xml");
            const customizationsFile = await CustomizationsFile.from(customizationsFileLocation);

            await customizationsFile.addElement("WebResources");
            await customizationsFile.save(customizationsFileLocation);
        }
    }
}
