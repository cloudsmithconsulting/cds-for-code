import * as cs from "../cs";
import * as vscode from 'vscode';
import * as path from 'path';
import * as FileSystem from "../helpers/FileSystem";
import { DynamicsWebApi } from "../api/Types";
import QuickPicker from "../helpers/QuickPicker";
import ApiRepository from "../repositories/apiRepository";
import Utilities from "../helpers/Utilities";
import { SolutionWorkspaceMapping } from "../config/SolutionMap";

/**
 * This command can be invoked by the by either the file explorer view or the Dynamics TreeView
 * and can compare two copies of a web resource.
 * @export run command function
 * @param {vscode.Uri} [defaultUri] that invoked the command
 * @returns void
 */
export default async function run(config?:DynamicsWebApi.Config, webResource?:any, fileUri?:vscode.Uri) {
    let fsPath:string;

    if (fileUri && fileUri.fsPath) {
        fsPath = fileUri.fsPath;
    }

    let content: string;

    if (fileUri && FileSystem.exists(fsPath)) {
        content = Utilities.BytesToBase64(FileSystem.readFileSync(fsPath));
    } else {
        content = Utilities.StringToBase64("");
    }

    config = config || await QuickPicker.pickDynamicsOrganization(this.context, "Choose a Dynamics 365 Organization", true);
    if (!config) { return; }

    const api = new ApiRepository(config);

    if (webResource) {
        webResource.content = content;
    } else {
        webResource = (await this.getWebResourceDetails(fsPath)) || {
            name: undefined,
            displayname: undefined,
            languagecode: undefined,
            description: undefined,
            content: content,
            webresourcetype: undefined,
            isenabledformobileclient: undefined,
            isavailableformobileoffline: undefined
        };
    }

    webResource.name = webResource.name || await QuickPicker.ask("What is the name (including path and extension) of your web resource?", undefined, fsPath ? path.basename(fsPath) : undefined);
    webResource.displayname = webResource.displayname || await QuickPicker.ask("What is the display name for this web resource?");
    webResource.languagecode = webResource.languagecode || parseInt(await QuickPicker.ask("What is the language code for this web resource?", undefined, "1033"));
    webResource.description = webResource.description || await QuickPicker.ask("Describe this web resource");
    webResource.webresourcetype = webResource.webresourcetype || (DynamicsWebApi.CodeMappings.getWebResourceTypeCode(fsPath ? this.getWebResourceType(path.extname(fsPath)) : await QuickPicker.pickEnum<DynamicsWebApi.WebResourceFileType>(DynamicsWebApi.WebResourceFileType, "What type of web resource is this?"))).toString();
    webResource.isenabledformobileclient = webResource.isenabledformobileclient || await QuickPicker.pickBoolean("Enable this web resource for mobile use?", "Yes", "No");
    webResource.isavailableformobileoffline = webResource.isavailableformobileoffline || (webResource.isenabledformobileclient && await QuickPicker.pickBoolean("Enable this web resource for mobile offline use?", "Yes", "No"));

    if (!fsPath) {
        fsPath = await QuickPicker.pickWorkspaceFolder(undefined, "Where would you like to save this web resource?");
    }

    if (fsPath) {
        fsPath = path.join(fsPath, webResource.name);

        if (!FileSystem.exists(fsPath)) {
            FileSystem.makeFolderSync(path.dirname(fsPath));
            FileSystem.writeFileSync(fsPath, content);
        }
    }

    // Now that we have a path, let's see if this is part of a solution.
    const map:SolutionWorkspaceMapping = this.getSolutionMapping(fsPath, config.orgId);
    let solution:any;

    if (!map || !map.solutionId) {
        solution = await QuickPicker.pickDynamicsSolution(config, "Would you like to add this web resource to a solution?");
    } else {
        solution = await api.retrieveSolution(map.solutionId);
    }
    
    await api.upsertWebResource(webResource)
        .then(response => {
            webResource = response;
        });
        //.then(() => QuickPicker.inform(`The web resource '${webResource.name}' was created.`))
        //.catch(error => QuickPicker.error(`There was an error when saving the web resource.  The error returned was: ${error.toString()}`, undefined, "Try Again", () => vscode.commands.executeCommand(cs.dynamics.deployment.createWebResource, config, undefined, fileUri)));
        
    if (solution) {
        await api.addSolutionComponent(solution, webResource.webresourceid, DynamicsWebApi.SolutionComponent.WebResource, true, false);

        if (fsPath) {
            const newPath = map.getPath(DynamicsWebApi.SolutionComponent.WebResource, webResource);

            await FileSystem.copyItem(fsPath, newPath);
            await FileSystem.deleteItem(fsPath);
            await this.writeDataXmlFile(config, map, webResource, newPath);
        }
    }
    
    return webResource;
}