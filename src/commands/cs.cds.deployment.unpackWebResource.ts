import * as vscode from 'vscode';
import * as path from 'path';
import * as FileSystem from "../core/io/FileSystem";
import { DynamicsWebApi } from "../api/cds-webapi/DynamicsWebApi";
import { CdsSolutions } from '../api/CdsSolutions';
import Quickly from "../core/Quickly";
import ApiRepository from "../repositories/apiRepository";
import { Utilities } from "../core/Utilities";
import SolutionWorkspaceMapping from "../components/Solutions/SolutionWorkspaceMapping";
import ExtensionContext from '../core/ExtensionContext';
import logger from '../core/Logger';

/**
 * This command can be invoked by the Dynamics Explorer tree view and creates or updates a web resource in the local workspace.
 * @export run command function
 * @param {DynamicsWebApi.Config} [config] The configuration to use when retreiving a web resource
 * @param {string} [webResourceId] The web resource object as retrieved by WebApi.
 * @param {vscode.Uri} [fileUri] The Uri of the file to save the web resource as.
 * @returns void
 */
export default async function run(config?:DynamicsWebApi.Config, webResource?:any, fileUri?: vscode.Uri, autoOpen:boolean = false) {
    config = config || await Quickly.pickCdsOrganization(ExtensionContext.Instance, "Choose a Dynamics 365 Organization", true);
    if (!config) { 
        logger.warn("Configuration not chosen, command cancelled");

        return; 
    }

    let fsPath:string;

    if (fileUri && fileUri.fsPath) {
        fsPath = fileUri.fsPath;
    }

    let map:SolutionWorkspaceMapping = this.getSolutionMapping(fsPath, config.orgId);

    webResource = webResource || await Quickly.pickCdsSolutionComponent(config, map ? map.solutionId : undefined, CdsSolutions.SolutionComponent.WebResource, "Choose a web resource to export").then(r => r ? r.component : undefined);
    if (!webResource) {
        logger.warn("Web Resource not chosen, command cancelled");
        return; 
    }

    // If we do have a map, enforce that we put files where we are supposed to, regardless of user preference.
    if (map && !fsPath) { 
        fsPath = map.getPath(CdsSolutions.SolutionComponent.WebResource, webResource);
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
        fsPath = map.getPath(CdsSolutions.SolutionComponent.WebResource, webResource);
    }

    FileSystem.makeFolderSync(path.dirname(fsPath));
    FileSystem.writeFileSync(fsPath, Utilities.Encoding.base64ToBytes(webResource.content));

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