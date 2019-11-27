import * as cs from "../cs";
import * as vscode from 'vscode';

/**
 * This command can be invoked by the Explorer file viewer and builds and registers a plugin (.dll) file 
 * to a registered CDS endpoint.
 * @export run command function
 * @param {vscode.Uri} [file] that invoked the command
 * @returns void
 */
export default async function run(file?:vscode.Uri) {
	return await vscode.commands.executeCommand(cs.dynamics.deployment.registerPluginAssembly, undefined, undefined, file);
}