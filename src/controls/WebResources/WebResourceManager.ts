import * as vscode from 'vscode';
import * as cs from '../../cs';
import * as FileSystem from "../../helpers/FileSystem";
import * as path from 'path';
import { DynamicsWebApi } from "../../api/Types";
import IWireUpCommands from '../../wireUpCommand';
import Utilities from '../../helpers/Utilities';
import SolutionMap, { SolutionWorkspaceMapping } from "../../config/SolutionMap";
import TemplateManager from "../../controls/Templates/TemplateManager";
import ApiRepository from '../../repositories/apiRepository';
import EnumParser from '../../helpers/EnumParser';
import XmlParser from '../../helpers/XmlParser';

import createWebResourceExplorer from "../../commands/cs.dynamics.controls.explorer.createWebResource";
import packWebResourceExplorer from "../../commands/cs.dynamics.controls.explorer.packWebResource";
import createWebResource from "../../commands/cs.dynamics.deployment.createWebResource";
import compareWebResource from "../../commands/cs.dynamics.deployment.compareWebResource";
import packWebResource from "../../commands/cs.dynamics.deployment.packWebResource";
import unpackWebResource from "../../commands/cs.dynamics.deployment.unpackWebResource";
import SolutionFile from '../../dynamics/SolutionFile';
import QuickPicker from '../../helpers/QuickPicker';

export default class WebResourceManager implements IWireUpCommands {
    /**
     * local copy of workspace configuration to maintain consistency between calls
     */
    private static context: vscode.ExtensionContext;

    constructor(context: vscode.ExtensionContext) {
        WebResourceManager.context = context;
    }

    get context():vscode.ExtensionContext { return WebResourceManager.context; }

    wireUpCommands(context: vscode.ExtensionContext, config?: vscode.WorkspaceConfiguration): void {
        // now wire a command into the context
        context.subscriptions.push(
            vscode.commands.registerCommand(cs.dynamics.controls.explorer.craeteWebResource, createWebResourceExplorer.bind(this)),
            vscode.commands.registerCommand(cs.dynamics.controls.explorer.packWebResource, packWebResourceExplorer.bind(this)),
            vscode.commands.registerCommand(cs.dynamics.deployment.createWebResource, createWebResource.bind(this)),
            vscode.commands.registerCommand(cs.dynamics.deployment.compareWebResource, compareWebResource.bind(this)),
            vscode.commands.registerCommand(cs.dynamics.deployment.packWebResource, packWebResource.bind(this)),
            vscode.commands.registerCommand(cs.dynamics.deployment.unpackWebResource, unpackWebResource.bind(this))
        );
    }

    getSolutionMapping(fsPath?:string, orgId?:string, solutionId?:string): SolutionWorkspaceMapping {
        const solutionMap = SolutionMap.loadFromWorkspace(this.context);
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
        
        const webResourceType = EnumParser.getValues<DynamicsWebApi.WebResourceFileType>(DynamicsWebApi.WebResourceFileType).find(e => e.toString() === extension);

        return webResourceType ? DynamicsWebApi.CodeMappings.getWebResourceTypeCode(webResourceType) : undefined;
    }

    async getWebResourceDetails(fsPath:string | undefined): Promise<any> {
        if (!fsPath) { return; }

        const dataFile = fsPath + ".data.xml";
        
        if (FileSystem.exists(dataFile)) {
            const xmlObject = await XmlParser.parseFile(dataFile);

            if (xmlObject && xmlObject.WebResource) {
                return {
                    webresourceid: xmlObject.WebResource.WebResourceId && xmlObject.WebResource.WebResourceId.length > 0 ? Utilities.TrimGuid(xmlObject.WebResource.WebResourceId[0]) : undefined,
                    name: xmlObject.WebResource.Name && xmlObject.WebResource.Name.length > 0 ? xmlObject.WebResource.Name[0] : undefined,
                    displayname: xmlObject.WebResource.DisplayName && xmlObject.WebResource.DisplayName.length > 0 ? xmlObject.WebResource.DisplayName[0] : undefined,
                    description: xmlObject.WebResource.Description && xmlObject.WebResource.Description.length > 0 ? xmlObject.WebResource.Description[0] : undefined,
                    languagecode: xmlObject.WebResource.LanguageCode && xmlObject.WebResource.LanguageCode.length > 0 ? xmlObject.WebResource.LanguageCode[0] : undefined,
                    webresourcetype: xmlObject.WebResource.WebResourceType && xmlObject.WebResource.WebResourceType.length > 0 && Number.isInteger(xmlObject.WebResource.WebResourceType[0]) ? parseInt(xmlObject.WebResource.WebResourceType[0]) : undefined,
                    introducedversion: xmlObject.WebResource.IntroducedVersion && xmlObject.WebResource.IntroducedVersion.length > 0 ? xmlObject.WebResource.IntroducedVersion[0] : undefined,
                    isenabledformobileclient: xmlObject.WebResource.IsEnabledForMobileClient && xmlObject.WebResource.IsEnabledForMobileClient.length > 0 ? xmlObject.WebResource.IsEnabledForMobileClient[0] === "1" : undefined,
                    isavailableformobileoffline: xmlObject.WebResource.IsAvailableForMobileOffline && xmlObject.WebResource.IsAvailableForMobileOffline.length > 0 ? xmlObject.WebResource.IsAvailableForMobileOffline[0] === "1" : undefined
                };
            }
        }

        return undefined;
    }

    async upsertWebResource(config:DynamicsWebApi.Config, webResource:any, solution?:any): Promise<any> {
        const api = new ApiRepository(config);

        return api.upsertWebResource(webResource)
            .then(response => {
                webResource = response;
            })
            .then(async () => {
                if (solution) {
                    await api.addSolutionComponent(solution, webResource.webresourceid, DynamicsWebApi.SolutionComponent.WebResource, true, false);
                }               

                return webResource;
            }).then(async () => {
                if (await QuickPicker.pickBoolean("Would you like to publish the web resource?", "Yes", "No")) {
                    await vscode.commands.executeCommand(cs.dynamics.deployment.publishCustomizations, config, [ { type: DynamicsWebApi.SolutionComponent.WebResource, id: webResource.webresourceid }]);
                }
            }).then(() => {
                return webResource;
            });        
    }

    async writeDataXmlFile(map:SolutionWorkspaceMapping, webResource:any, fsPath:string) {
        const dataFile = fsPath + ".data.xml";
        const resolver = (webResource) => {
            const parts = path.relative(map.path, fsPath).split(".").join("").split("\\");

            parts[0] = `/${parts[0]}/`;
            parts.push(Utilities.TrimGuid(webResource.webresourceid));

            return parts.join("");
        };

        if (!FileSystem.exists(dataFile)) {
            await TemplateManager.getSystemTemplate("solution.webresource.xml")
                .then(async template => FileSystem.writeFileSync(dataFile, await template.apply(undefined, { webresource: webResource, resolver: { resolvefilename: resolver } })));
        }       

        // Edit the solution.xml file and add the component there, too.
        const solutionFile = await SolutionFile.from(SolutionWorkspaceMapping.mapWorkspacePath(map.path));

        await solutionFile.addComponent(DynamicsWebApi.SolutionComponent.WebResource, undefined, webResource.name, 0).then(() => {
            solutionFile.save(SolutionWorkspaceMapping.mapWorkspacePath(map.path));
        });
    }
}
