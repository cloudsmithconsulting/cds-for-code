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
import EnumParser from "../helpers/EnumParser";

/**
 * This command can be invoked by the Explorer file viewer and creates or updates a web resource in Dynamics
 * @export run command function
 * @param {vscode.Uri} [defaultUri] that invoked the command
 * @returns void
 */
export default async function run(config?:DynamicsWebApi.Config, solution?:any, webResource?:any, fileUri?:vscode.Uri) {
    fileUri = fileUri || vscode.Uri.file(await QuickPicker.pickWorkspaceFile(undefined, "Choose the web resource file to deploy", undefined, true, EnumParser.getNames(DynamicsWebApi.WebResourceFileType)));
    if (!fileUri) { return; }

    webResource = webResource || await vscode.commands.executeCommand(cs.dynamics.deployment.createWebResource, config, webResource, fileUri);
    if (!webResource) { return; }
}