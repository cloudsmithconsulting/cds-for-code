import * as path from 'path';
import * as cs from "../cs";
import * as vscode from 'vscode';

/**
 * This command can be invoked by the Explorer file viewer and generates entity code to a given file (target)
 * @export run command function
 * @param {vscode.Uri} [file] that invoked the command
 * @returns void
 */
export default async function run(file?:vscode.Uri) {
	return await vscode.commands.executeCommand(cs.cds.powerShell.generateEntities, undefined, path.dirname(file.fsPath), path.basename(file.fsPath), undefined);
}