import * as cs from "../cs";
import * as vscode from 'vscode';
import * as path from 'path';
import * as FileSystem from "../helpers/FileSystem";
import { DynamicsWebApi } from "../api/Types";
import QuickPicker from "../helpers/QuickPicker";
import ApiRepository from "../repositories/apiRepository";
import Utilities from "../helpers/Utilities";
import { SolutionWorkspaceMapping } from "../config/SolutionMap";
import SolutionFile from "../dynamics/SolutionFile";

/**
 * This command can be invoked by the by either the file explorer view or the Dynamics TreeView
 * and can compare two copies of a web resource.
 * @export run command function
 * @param {vscode.Uri} [defaultUri] that invoked the command
 * @returns void
 */
export default async function run(config?:DynamicsWebApi.Config, solution?:any, webResource?:any, fileUri?:vscode.Uri) {
    let fsPath:string;
    let map:SolutionWorkspaceMapping;
    let folder:string;
    let workspaceRoot:string;

    workspaceRoot = vscode.workspace && vscode.workspace.workspaceFolders && vscode.workspace.workspaceFolders.length > 0 ? vscode.workspace.workspaceFolders[0].uri.fsPath : undefined;

    config = config || await QuickPicker.pickDynamicsOrganization(this.context, "Choose a Dynamics 365 Organization", true);
    if (!config) { return; }

    if (fileUri && fileUri.fsPath) {
        fsPath = fileUri.fsPath;

        if (path.extname(fsPath) === "") {
            folder = fsPath;
        } else {
            folder = path.dirname(fsPath);
        }

        map = this.getSolutionMapping(fsPath, config.orgId);
    }

    let content: string;

    if (fsPath && fsPath !== folder && FileSystem.exists(fsPath)) {
        content = Utilities.BytesToBase64(FileSystem.readFileSync(fsPath));
    } else {
        content = "";
    }

    const api = new ApiRepository(config);

    if (webResource) {
        webResource.content = content;
    } else {
        webResource = (await this.getWebResourceDetails(fsPath)) || { webresourceid: Utilities.NewGuid() };
    }

    let defaultName:string = "";
    let defaultType:number = DynamicsWebApi.CodeMappings.getWebResourceTypeCode(this.getWebResourceType(path.extname(fsPath)));

    if (folder) {
        defaultName = map ? folder.replace(map.getPath(DynamicsWebApi.SolutionComponent.WebResource), "").replace(map.path, "") : workspaceRoot ? folder.replace(workspaceRoot, "") : "";
        defaultName = defaultName.replace(/\\/, "/");

        if (!defaultName.endsWith("/")) {
            defaultName += "/";
        }

        if (defaultName.startsWith("/")) {
            defaultName = defaultName.substring(1);
        }
    }

    if (fsPath !== folder) {
        defaultName += path.basename(fsPath);
    }

    webResource.name = webResource.name || await QuickPicker.ask("What is the name (including path and extension) of your web resource?", defaultName, defaultName);

    if (webResource.name && (<string>webResource.name).indexOf(".") > -1) {
        defaultType = defaultType || this.getWebResourceType(path.extname(webResource.name));
    }

    webResource.displayname = webResource.displayname || await QuickPicker.ask("What is the display name for this web resource?");
    webResource.languagecode = webResource.languagecode || parseInt(await QuickPicker.ask("What is the language code for this web resource?", undefined, "1033"));
    webResource.description = webResource.description || await QuickPicker.ask("Describe this web resource");
    webResource.webresourcetype = webResource.webresourcetype || defaultType || DynamicsWebApi.CodeMappings.getWebResourceTypeCode(await QuickPicker.pickEnum<DynamicsWebApi.WebResourceFileType>(DynamicsWebApi.WebResourceFileType, "What type of web resource is this?"));
    webResource.isenabledformobileclient = webResource.isenabledformobileclient || await QuickPicker.pickBoolean("Enable this web resource for mobile use?", "Yes", "No");
    webResource.isavailableformobileoffline = webResource.isavailableformobileoffline || (webResource.isenabledformobileclient && await QuickPicker.pickBoolean("Enable this web resource for mobile offline use?", "Yes", "No"));
    webResource.introducedversion = webResource.inintroducedversion || "1.0";
    webResource.iscustomizable = webResource.iscustomizable || { Value: true };
    webResource.canbedeleted = webResource.canbedeleted || { Value: true };
    webResource.ishidden = webResource.ishidden || { Value: false };

    if (!fsPath) {
        fsPath = await QuickPicker.pickWorkspaceFolder(undefined, "Where would you like to save this web resource?");
        if (!fsPath) { return; }

        folder = path.extname(fsPath) !== "" ? path.dirname(fsPath) : fsPath;
    }

    if (fsPath) {
        if (map) {
            fsPath = map.getPath(DynamicsWebApi.SolutionComponent.WebResource, webResource);
        } else {
            fsPath = fsPath === folder ? path.join(fsPath, webResource.name.replace(defaultName, "")) : fsPath;
        }

        // Re-normalize the path in case the web resource name has path directives in it.
        folder = path.extname(fsPath) !== "" ? path.dirname(fsPath) : fsPath;

        if (!FileSystem.exists(fsPath)) {
            FileSystem.makeFolderSync(folder);
            FileSystem.writeFileSync(fsPath, content);
        }
    }

    // Double check as we have calculated a path now, is there a map?
    if (!map) { map = this.getSolutionMapping(fsPath, config.orgId); }

    if (!map || !map.solutionId) {
        solution = solution || await QuickPicker.pickDynamicsSolution(config, "Would you like to add this web resource to a solution?");
        map = this.getSolutionMapping(undefined, config.orgId, solution.solutionid);
    } else {
        solution = solution || await api.retrieveSolution(map.solutionId);
    }

    if (solution && map) {
        await this.writeDataXmlFile(map, webResource, fsPath);
    } else {
        await api.upsertWebResource(webResource)
            .then(response => {
                webResource = response;
            })
            .then(async () => {
                if (solution) {
                    await api.addSolutionComponent(solution, webResource.webresourceid, DynamicsWebApi.SolutionComponent.WebResource, true, false);
                }
            }).then(() => QuickPicker.inform(`The web resource '${webResource.name}' was created.`))
            .catch(error => QuickPicker.error(`There was an error when saving the web resource.  The error returned was: ${error.toString()}`, undefined, "Try Again", () => vscode.commands.executeCommand(cs.dynamics.deployment.createWebResource, config, undefined, fileUri)));
    }

    return webResource;
}