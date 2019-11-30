import * as cs from "../cs";
import * as vscode from 'vscode';
import * as path from 'path';
import * as FileSystem from "../core/io/FileSystem";
import { DynamicsWebApi } from "../http/Types";
import Quickly from "../core/Quickly";
import ApiRepository from "../repositories/apiRepository";
import { Utilities } from "../core/Utilities";
import { SolutionWorkspaceMapping } from "../components/Solutions/Types";

/**
 * This command can be invoked by the Dynamics Explorer tree view and creates or updates a web resource in the local workspace.
 * @export run command function
 * @param {DynamicsWebApi.Config} [config] The configuration to use when retreiving a web resource
 * @param {string} [webResourceId] The web resource object as retrieved by WebApi.
 * @param {vscode.Uri} [fileUri] The Uri of the file to save the web resource as.
 * @returns void
 */
export default async function run(config?:DynamicsWebApi.Config, webResource?:any, fileUri?: vscode.Uri, autoOpen:boolean = false) {
    config = config || await Quickly.pickCdsOrganization(this.context, "Choose a Dynamics 365 Organization", true);
    if (!config) { return; }

    let fsPath:string;

    if (fileUri && fileUri.fsPath) {
        fsPath = fileUri.fsPath;
    }

    let map:SolutionWorkspaceMapping = this.getSolutionMapping(fsPath, config.orgId);

    webResource = webResource || await Quickly.pickCdsSolutionComponent(config, map ? map.solutionId : undefined, DynamicsWebApi.SolutionComponent.WebResource, "Choose a web resource to export").then(r => r ? r.component : undefined);
    if (!webResource) { return; }

    // If we do have a map, enforce that we put files where we are supposed to, regardless of user preference.
    if (map && !fsPath) { 
        fsPath = map.getPath(DynamicsWebApi.SolutionComponent.WebResource, webResource);
    }
    
    fsPath = fsPath || await Quickly.pickWorkspaceFolder(undefined, "Choose a location where the web resource will be downloaded");

    const api = new ApiRepository(config);

    if (!webResource.content && webResource.webresourceid) {
        // We only got the stub (reference), time to look up the rest.
        webResource = await api.retrieveWebResource(webResource.webresourceid);
    }

    // If we specified a file path, join the name to it.
    if (path.extname(fsPath) === "") {
        fsPath = path.join(fsPath, webResource.name);
    }

    // If we don't have a map, attempt to reload it with the new path.
    if (!map && fsPath) {
        map = this.getSolutionMapping(fsPath, config.orgId);
    }

    // Check again :) If we do have a map, enforce that we put files where we are supposed to, regardless of user preference.
    if (map) { 
        fsPath = map.getPath(DynamicsWebApi.SolutionComponent.WebResource, webResource);
    }

    FileSystem.makeFolderSync(path.dirname(fsPath));
    FileSystem.writeFileSync(fsPath, Utilities.Encoding.Base64ToBytes(webResource.content));

    // If we're part of a solution, we need to write the data XML file so that solution packager can pick this up.
    if (map) {
        await this.writeDataXmlFile(config, map, webResource, fsPath);
    }

    if (!autoOpen) {
        Quickly.inform(`${webResource.name} is now synchronized with the filesystem.`, undefined, "Open in Editor", async () => {
            await Quickly.openFile(fsPath);
        });
    } else {
        await Quickly.openFile(fsPath);
    }
}