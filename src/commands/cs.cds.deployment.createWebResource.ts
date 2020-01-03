import * as cs from "../cs";
import * as vscode from 'vscode';
import * as path from 'path';
import * as FileSystem from "../core/io/FileSystem";
import { CdsWebApi } from "../api/cds-webapi/CdsWebApi";
import { CdsSolutions } from "../api/CdsSolutions";
import Quickly from "../core/Quickly";
import ApiRepository from "../repositories/apiRepository";
import { Utilities } from "../core/Utilities";
import SolutionWorkspaceMapping from "../components/Solutions/SolutionWorkspaceMapping";
import ExtensionContext from "../core/ExtensionContext";
import DiscoveryRepository from "../repositories/discoveryRepository";
import logger from "../core/Logger";

/**
 * This command can be invoked by the by either the file explorer view or the Dynamics TreeView
 * and can compare two copies of a web resource.
 * @export run command function
 * @param {vscode.Uri} [defaultUri] that invoked the command
 * @returns void
 */
export default async function run(config?:CdsWebApi.Config, solutionId?:string, webResource?:any, fileUri?:vscode.Uri, defaultName:string = "", inform:boolean = true) {
    let fsPath:string;
    let map:SolutionWorkspaceMapping;
    let folder:string;
    let workspaceRoot:string;

    workspaceRoot = vscode.workspace && vscode.workspace.workspaceFolders && vscode.workspace.workspaceFolders.length > 0 ? vscode.workspace.workspaceFolders[0].uri.fsPath : undefined;

    if (fileUri && fileUri.fsPath) {
        fsPath = fileUri.fsPath;

        if (path.extname(fsPath) === "") {
            folder = fsPath;
        } else {
            folder = path.dirname(fsPath);
        }

        map = await this.getSolutionMapping(fsPath, config ? config.orgId : undefined);
    } else if (config.orgId && solutionId) {
        map = await this.getSolutionMapping(undefined, config.orgId, solutionId);
    }

    if (map && !config) {
        const connections = await DiscoveryRepository.getOrgConnections(ExtensionContext.Instance);

        config = connections.find(c => c.orgId === map.organizationId);
    }

    config = config || await Quickly.pickCdsOrganization(ExtensionContext.Instance, "Choose a CDS Organization", true);
	if (!config) { 
		logger.warn("Configuration not chosen, command cancelled");
		return; 
	}

    let content: string;

    if (fsPath && fsPath !== folder && FileSystem.exists(fsPath)) {
        content = Utilities.Encoding.bytesToBase64(FileSystem.readFileSync(fsPath));
    } else {
        content = "";
    }

    const api = new ApiRepository(config);

    webResource = webResource || (await this.getWebResourceDetails(fsPath)) || { webresourceid: Utilities.Guid.newGuid() };

    if (webResource) {
        webResource.content = content;
    } 
    
    let defaultType:number = fsPath && path.extname(fsPath) !== "" ? CdsSolutions.CodeMappings.getWebResourceTypeCode(this.getWebResourceType(path.extname(fsPath))) : undefined;

    if (folder && defaultName === "") {
        defaultName = map ? folder.replace(map.getPath(CdsSolutions.SolutionComponent.WebResource), "").replace(map.path, "") : workspaceRoot ? folder.replace(workspaceRoot, "") : "";
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

    webResource.name = webResource.name || await Quickly.ask("What is the name (including path and extension) of your web resource?", defaultName, defaultName);
    logger.info(`Web Resource Name: ${webResource.name}`);

    if (webResource.name && (<string>webResource.name).indexOf(".") > -1) {
        defaultType = defaultType || this.getWebResourceType(path.extname(webResource.name));
    }

    if (!webResource.name) {
        return;
    }

    webResource.displayname = webResource.displayname || await Quickly.ask("What is the display name for this web resource?");
    webResource.webresourcetype = webResource.webresourcetype || defaultType || CdsSolutions.CodeMappings.getWebResourceTypeCode(await Quickly.pickEnum<CdsSolutions.WebResourceFileType>(CdsSolutions.WebResourceFileType, "What type of web resource is this?"));
    webResource.description = webResource.description || await Quickly.ask("Describe this web resource");
    webResource.isenabledformobileclient = webResource.isenabledformobileclient || await Quickly.pickBoolean("Enable this web resource for mobile use?", "Yes", "No");
    webResource.isavailableformobileoffline = webResource.isavailableformobileoffline || (webResource.isenabledformobileclient && await Quickly.pickBoolean("Enable this web resource for mobile offline use?", "Yes", "No"));
    webResource.introducedversion = webResource.inintroducedversion || "1.0";
    webResource.iscustomizable = webResource.iscustomizable || { Value: true };
    webResource.canbedeleted = webResource.canbedeleted || { Value: true };
    webResource.ishidden = webResource.ishidden || { Value: false };

    if (!fsPath) {
        fsPath = await Quickly.pickWorkspaceFolder(map && map.path ? vscode.Uri.file(map.path) : undefined, "Where would you like to save this web resource?");
        if (!fsPath) { 
            logger.warn("Filesystem path not chosen, command cancelled");
            return; 
        }

        folder = path.extname(fsPath) !== "" ? path.dirname(fsPath) : fsPath;
    }

    if (fsPath) {
        if (map) {
            fsPath = map.getPath(CdsSolutions.SolutionComponent.WebResource, webResource);
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
    if (!map) { map = await this.getSolutionMapping(fsPath, config.orgId); }

    let solution;

    if ((!map || !map.solutionId) && !solutionId) {
        solution = await Quickly.pickCdsSolution(config, "Would you like to add this web resource to a solution?");
        map = await this.getSolutionMapping(undefined, config.orgId, solution.solutionid);
    } else {
        solution = await api.retrieveSolution(solutionId || map.solutionId);
    }

    try {
        if (solution && map) {
            logger.info(`Web Resource: ${webResource.name} is mapped to solution ${solution.uniquename}`);

            // We are pretty sure adding root nodes to customizations.xml is only required in 9.1+
            const version = config.webApiVersion.split(".");
            const minimumVersionToEditCustomizationFiles = 9.1;
            const providedVersion = parseFloat(version[0] + "." + version[1]);

            await this.writeDataXmlFile(map, webResource, fsPath, providedVersion >= minimumVersionToEditCustomizationFiles);

            if (inform) {
                await Quickly.inform(`The web resource '${webResource.name}' was saved to the local workspace.`);
            }
        } else {
            logger.info(`Web Resource: ${webResource.name} is not mapped to a solution.  Creating on server.`);

            webResource = await this.upsertWebResource(config, webResource, solution);

            if (inform) {
                await Quickly.inform(`The web resource '${webResource.name}' was saved to the Dynamics server.`);
            }
        }

        return { webResource, fsPath };
    } catch (error) {
        logger.error(`Error saving web resource: ${error.message}`);
        
        await Quickly.error(`There was an error when saving the web resource.  The error returned was: ${error.toString()}`, undefined, "Try Again", () => vscode.commands.executeCommand(cs.cds.deployment.createWebResource, config, undefined, fileUri));
    }
}