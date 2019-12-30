import * as cs from "../cs";
import * as vscode from 'vscode';

/**
 * This command can be invoked by the Dynamics Tree View and unpacks a solution into a 
 * location in the local workspace.
 * @export run command function
 * @param {vscode.Uri} [file] that invoked the command
 * @returns void
 */
export default async function run(item:any) {
	vscode.commands.executeCommand(cs.cds.powerShell.unpackSolution, item.config, undefined, item.context);
}