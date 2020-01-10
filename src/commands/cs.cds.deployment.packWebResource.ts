import * as cs from "../cs";
import * as vscode from 'vscode';
import { CdsWebApi } from "../api/cds-webapi/CdsWebApi";
import { CdsSolutions } from "../api/CdsSolutions";
import Quickly from "../core/Quickly";
import ApiRepository from "../repositories/apiRepository";
import EnumParser from "../core/framework/EnumParser";
import ExtensionContext from "../core/ExtensionContext";
import logger from "../core/framework/Logger";

/**
 * This command can be invoked by the Explorer file viewer and creates or updates a web resource in Dynamics
 * @export run command function
 * @param {vscode.Uri} [defaultUri] that invoked the command
 * @returns void
 */
export default async function run(config?:CdsWebApi.Config, solution?:any, webResource?:any, fileUri?:vscode.Uri, inform:boolean = true) {
    fileUri = fileUri || vscode.Uri.file(await Quickly.pickWorkspaceFile(undefined, "Choose the web resource file to deploy", undefined, true, EnumParser.getNames(CdsSolutions.WebResourceFileType)));
    if (!fileUri) { 
        logger.warn("File not chosen, command cancelled");
        return; 
    }

    // Trim off these files as we don't want to deploy them.
    if (fileUri.path.endsWith(".data.xml")) {
        fileUri = fileUri.with({ path: fileUri.path.substr(0, fileUri.path.length - 9)});
    }
    
    config = config || await Quickly.pickCdsOrganization(ExtensionContext.Instance, "Choose a CDS Organization", true);
    if (!config) { 
        logger.warn("Configuration not chosen, command cancelled");
        return; 
    }

    const map = this.getSolutionMapping(fileUri.fsPath, config.orgId);
    const api = new ApiRepository(config);

    if (map && map.solutionId && !solution) {
        solution = await api.retrieveSolution(map.solutionId);
    }

    solution = solution || await Quickly.pickCdsSolution(config, "Would you like to deply this web resource into a solution?");

    if (!webResource) {
        const result:any = await vscode.commands.executeCommand(cs.cds.deployment.createWebResource, config, solution ? solution.solutionid : undefined, webResource, fileUri, undefined, false);

        webResource = result.webResource;
        if (!webResource) {
            logger.warn("Web Resource not chosen, command cancelled");
            return; 
        }
    }

    try {
        const result = await this.upsertWebResource(config, webResource, solution);

        if (inform) {
            await Quickly.inform(`The web resource '${webResource.name}' was saved to the Dynamics server.`);
        }

        return { webResource: result || webResource, fsPath: fileUri.fsPath };
    } catch (error) {
        logger.error(error.message);

        await Quickly.error(`There was an error when saving the web resource.  The error returned was: ${error && error.message ? error.message : error.toString() }`, undefined, "Try Again", () => vscode.commands.executeCommand(cs.cds.deployment.packWebResource, config, solution, webResource, fileUri));
    }
}