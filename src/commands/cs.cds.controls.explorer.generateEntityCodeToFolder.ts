import * as cs from "../cs";
import * as vscode from 'vscode';

/**
 * This command can be invoked by the Explorer file viewer and generates entity code to a given folder (target)
 * @export run command function
 * @param {vscode.Uri} [file] that invoked the command
 * @returns void
 */
export default async function run(folder?:vscode.Uri) {
	return await vscode.commands.executeCommand(cs.cds.powerShell.generateEntities, undefined, folder.fsPath, undefined, undefined);
}