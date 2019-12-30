import * as cs from "../cs";
import * as vscode from 'vscode';

/**
 * This command can be invoked by the Explorer file viewer and unpacks a solution into a folder
 * @export run command function
 * @param {vscode.Uri} [file] that invoked the command
 * @returns void
 */
export default async function run(folder?:vscode.Uri) {
	vscode.commands.executeCommand(cs.cds.powerShell.unpackSolution, undefined, folder.fsPath);
}