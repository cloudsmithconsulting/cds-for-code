import * as cs from "../cs";
import * as vscode from 'vscode';
import Quickly from "../core/Quickly";

/**
 * This command can be invoked by the Explorer file viewer and creates a new web resource
 * @export run command function
 * @param {vscode.Uri} [defaultUri] that invoked the command
 * @returns void
 */
export default async function run(defaultUri?: vscode.Uri) {
	const returnObject:any = (await vscode.commands.executeCommand(cs.cds.deployment.createWebResource, undefined, undefined, undefined, defaultUri));

	await Quickly.openFile(returnObject.fsPath);

	return returnObject;
}