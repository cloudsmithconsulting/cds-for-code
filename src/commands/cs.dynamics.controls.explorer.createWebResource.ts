import * as cs from "../cs";
import * as vscode from 'vscode';

/**
 * This command can be invoked by the Explorer file viewer and creates a new web resource
 * @export run command function
 * @param {vscode.Uri} [defaultUri] that invoked the command
 * @returns void
 */
export default async function run(defaultUri?: vscode.Uri) {
	return await vscode.commands.executeCommand(cs.dynamics.deployment.createWebResource, undefined, undefined, defaultUri);
}