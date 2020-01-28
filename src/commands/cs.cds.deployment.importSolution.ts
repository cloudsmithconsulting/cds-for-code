import * as cs from "../cs";
import * as vscode from 'vscode';
import { CdsWebApi } from "../api/cds-webapi/CdsWebApi";

/**
 * This command can be invoked by the by either the file explorer view or the Dynamics TreeView
 * and can compare two copies of a web resource.
 * @export run command function
 * @param {vscode.Uri} [defaultUri] that invoked the command
 * @returns void
 */
export default async function run(config?: CdsWebApi.Config, solutionFile?: vscode.Uri): Promise<string> {
    return "";
}