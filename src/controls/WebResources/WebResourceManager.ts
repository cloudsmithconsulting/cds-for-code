import * as vscode from 'vscode';
import * as cs from '../../cs';
import * as FileSystem from "../../helpers/FileSystem";
import * as path from 'path';
import { DynamicsWebApi } from "../../api/Types";
import { TS } from 'typescript-linq/TS';
import ExtensionConfiguration from '../../config/ExtensionConfiguration';
import IWireUpCommands from '../../wireUpCommand';
import QuickPicker from '../../helpers/QuickPicker';
import Dictionary from '../../helpers/Dictionary';
import Utilities from '../../helpers/Utilities';
import SolutionMap, { SolutionWorkspaceMapping } from "../../config/SolutionMap";
import TemplateManager from "../../controls/Templates/TemplateManager";
import ApiRepository from '../../repositories/apiRepository';
import EnumParser from '../../helpers/EnumParser';
import XmlParser from '../../helpers/XmlParser';

import createWebResource from "../../commands/cs.dynamics.deployment.createWebResource";
import compareWebResource from "../../commands/cs.dynamics.deployment.compareWebResource";
import packWebResource from "../../commands/cs.dynamics.deployment.packWebResource";
import unpackWebResource from "../../commands/cs.dynamics.deployment.unpackWebResource";

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
            vscode.commands.registerCommand(cs.dynamics.deployment.createWebResource, createWebResource.bind(this)),
            vscode.commands.registerCommand(cs.dynamics.deployment.compareWebResource, compareWebResource.bind(this)),
            vscode.commands.registerCommand(cs.dynamics.deployment.packWebResource, packWebResource.bind(this)),
            vscode.commands.registerCommand(cs.dynamics.deployment.unpackWebResource, unpackWebResource.bind(this))
        );
    }

    getSolutionMapping(fsPath:string, orgId?:string): SolutionWorkspaceMapping {
        const solutionMap = SolutionMap.loadFromWorkspace(this.context);
        let map:SolutionWorkspaceMapping;
    
        if (fsPath && FileSystem.exists(fsPath)) {
            const mappings = solutionMap.getByPathOrParent(fsPath, orgId);
            
            map = mappings.length > 0 ? mappings[0] : undefined;
        }

        return map;
    }

    getWebResourceType(extension:string): number {
        if (!extension.startsWith(".")) { extension = "." + extension; }
        
        const webResourceType = EnumParser.getValues<DynamicsWebApi.WebResourceFileType>(DynamicsWebApi.WebResourceFileType).find(e => e.toString() === extension);

        return DynamicsWebApi.CodeMappings.getWebResourceTypeCode(webResourceType);
    }

    async getWebResourceDetails(fsPath:string | undefined): Promise<any> {
        if (!fsPath) { return; }

        const dataFile = fsPath + ".data.xml";
        
        if (FileSystem.exists(dataFile)) {
            const xmlObject = await XmlParser.parseFile(dataFile);

            if (xmlObject && xmlObject.WebResource) {
                return {
                    webresourceid: xmlObject.WebResource.WebResourceId,
                    name: xmlObject.WebResource.Name,
                    displayName: xmlObject.WebResource.DisplayName,
                    description: xmlObject.WebResource.Description,
                    type: xmlObject.WebResource.WebResourceType,
                    introducedversion: xmlObject.WebResource.IntroducedVersion,
                    isenabledformobileclient: xmlObject.WebResource.IsEnabledForMobileClient,
                    isavailableformobileoffline: xmlObject.WebResource.IsAvailableForMobileOffline
                };
            }
        }

        return undefined;
    }

    async writeDataXmlFile(config:DynamicsWebApi.Config, map:SolutionWorkspaceMapping, webResource:any, fsPath:string) {
        const api = new ApiRepository(config);

        // Get the solution and add this web resource as a component.
        await api.retrieveSolution(map.solutionId)
            .then(solution => api.addSolutionComponent(solution, webResource.webresourceid, DynamicsWebApi.SolutionComponent.WebResource, true, false));

        const dataFile = fsPath + ".data.xml";
        const resolver = (webResource) => {
            const parts = path.relative(map.path, fsPath).split(".").join("").split("\\");

            parts[0] = `/${parts[0]}/`;
            parts.push(Utilities.TrimGuid(webResource.webresourceid));

            return parts.join("");
        };

        if (!FileSystem.exists(dataFile)) {
            await TemplateManager.getSystemTemplate("solution.webresource.xml")
                .then(async t => FileSystem.writeFileSync(dataFile, await t.apply(undefined, { webresource: webResource, resolver: { resolvefilename: resolver } })));
        }        
    }
}
