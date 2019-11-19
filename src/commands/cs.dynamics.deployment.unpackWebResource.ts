import * as cs from "../cs";
import * as vscode from 'vscode';
import * as path from 'path';
import * as FileSystem from "../helpers/FileSystem";
import { DynamicsWebApi } from "../api/Types";
import QuickPicker from "../helpers/QuickPicker";
import WebResourceManager from "../controls/WebResources/WebResourceManager";
import ApiRepository from "../repositories/apiRepository";
import Utilities from "../helpers/Utilities";
import SolutionMap, { SolutionWorkspaceMapping } from "../config/SolutionMap";
import TemplateManager from "../controls/Templates/TemplateManager";
import Dictionary from "../helpers/Dictionary";

/**
 * This command can be invoked by the Dynamics Explorer tree view and creates or updates a web resource in the local workspace.
 * @export run command function
 * @param {DynamicsWebApi.Config} [config] The configuration to use when retreiving a web resource
 * @param {string} [webResourceId] The web resource object as retrieved by WebApi.
 * @param {vscode.Uri} [fileUri] The Uri of the file to save the web resource as.
 * @returns void
 */
export default async function run(config?:DynamicsWebApi.Config, webResource?:any, fileUri?: vscode.Uri) {
    config = config || await QuickPicker.pickDynamicsOrganization(this.context, "Choose a Dynamics 365 Organization", true);
    if (!config) { return; }

    let fsPath:string;

    if (fileUri && fileUri.fsPath) {
        fsPath = fileUri.fsPath;
    }

    const solutionMap = SolutionMap.loadFromWorkspace(this.context);
    let map:SolutionWorkspaceMapping;

    if (fsPath && FileSystem.exists(fsPath)) {
        const mappings = solutionMap.getByPathOrParent(fsPath);
        
        map = mappings.length > 0 ? mappings[0] : undefined;
    }

    webResource = webResource || await QuickPicker.pickDynamicsSolutionComponent(config, map ? map.solutionId : undefined, DynamicsWebApi.SolutionComponent.WebResource, "Choose a web resource to export").then(r => r ? r.component : undefined);
    if (!webResource) { return; }

    fsPath = fsPath || await QuickPicker.pickWorkspaceFolder(undefined, "Choose a location where the web resource will be downloaded");

    const api = new ApiRepository(config);

    if (!webResource.content && webResource.webresourceid) {
        // We only got the stub (reference), time to look up the rest.
        webResource = await api.retrieveWebResource(webResource.webresourceid);
    }

    if (path.extname(fsPath) === "") {
        fsPath = path.join(fsPath, webResource.name);
    }

    FileSystem.writeFileSync(fsPath, Utilities.Base64ToBytes(webResource.content));

    if (!map && fsPath && FileSystem.exists(fsPath)) {
        const mappings = solutionMap.getByPathOrParent(fsPath);

        map = mappings.length > 0 ? mappings[0] : undefined;
    }

    if (map) {
        const dataFile = fsPath + ".data.xml";

        if (!FileSystem.exists(dataFile)) {
            TemplateManager.getSystemTemplate("solution.webresource.xml")
                .then(async t => FileSystem.writeFileSync(dataFile, await t.apply(undefined, { webresource: webResource })));
        }
    }
}