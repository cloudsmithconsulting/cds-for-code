import * as cs from "../cs";
import * as vscode from 'vscode';
import * as path from 'path';
import * as FileSystem from "../helpers/FileSystem";
import { DynamicsWebApi } from "../api/Types";
import QuickPicker from "../helpers/QuickPicker";
import WebResourceManager from "../controls/WebResources/WebResourceManager";
import ApiRepository from "../repositories/apiRepository";
import Utilities from "../helpers/Utilities";
import SolutionMap from "../controls/SolutionMap/SolutionMap";
import { SolutionWorkspaceMapping } from "../controls/SolutionMap/SolutionWorkspaceMapping";
import TemplateManager from "../controls/Templates/TemplateManager";
import Dictionary from "../helpers/Dictionary";
import EnumParser from "../helpers/EnumParser";

/**
 * This command can be invoked by the Explorer file viewer and creates or updates a web resource in Dynamics
 * @export run command function
 * @param {vscode.Uri} [defaultUri] that invoked the command
 * @returns void
 */
export default async function run(config?:DynamicsWebApi.Config, solution?:any, webResource?:any, fileUri?:vscode.Uri, inform:boolean = true) {
    fileUri = fileUri || vscode.Uri.file(await QuickPicker.pickWorkspaceFile(undefined, "Choose the web resource file to deploy", undefined, true, EnumParser.getNames(DynamicsWebApi.WebResourceFileType)));
    if (!fileUri) { return; }

    // Trim off these files as we don't want to deploy them.
    if (fileUri.path.endsWith(".data.xml")) {
        fileUri = fileUri.with({ path: fileUri.path.substr(0, fileUri.path.length - 9)});
    }
    
    config = config || await QuickPicker.pickDynamicsOrganization(this.context, "Choose a Dynamics 365 Organization", true);
    if (!config) { return; }

    const map = this.getSolutionMapping(fileUri.fsPath, config.orgId);
    const api = new ApiRepository(config);

    if (map && map.solutionId && !solution) {
        solution = await api.retrieveSolution(map.solutionId);
    }

    solution = solution || await QuickPicker.pickDynamicsSolution(config, "Would you like to deply this web resource into a solution?");

    if (!webResource) {
        const result:any = await vscode.commands.executeCommand(cs.dynamics.deployment.createWebResource, config, solution ? solution.solutionid : undefined, webResource, fileUri, undefined, false);

        webResource = result.webResource;
        if (!webResource) { return; }
    }

    try {
        const result = await this.upsertWebResource(config, webResource, solution);

        if (inform) {
            await QuickPicker.inform(`The web resource '${webResource.name}' was saved to the Dynamics server.`);
        }

        return { webResource: result || webResource, fsPath: fileUri.fsPath };
    } catch (error) {
        await QuickPicker.error(`There was an error when saving the web resource.  The error returned was: ${error && error.message ? error.message : error.toString() }`, undefined, "Try Again", () => vscode.commands.executeCommand(cs.dynamics.deployment.packWebResource, config, solution, webResource, fileUri));
    }
}