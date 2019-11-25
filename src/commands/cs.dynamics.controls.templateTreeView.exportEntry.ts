import * as cs from "../cs";
import * as TemplateTreeView from "../views/TemplateTreeView";
import * as vscode from 'vscode';

/**
 * This command can be invoked by the Template Tree View and exports a template
 * @export run command function
 * @this TemplateTreeView instance that manages this command.
 * @param {TemplateTreeView.TreeEntry} [item] that invoked the command.
 * @returns void
 */
export default async function run(item?: TemplateTreeView.TreeEntry) {
	return vscode.commands.executeCommand(cs.dynamics.templates.exportTemplate, item && item.context ? item.context : undefined).then(
		() => vscode.commands.executeCommand(cs.dynamics.controls.templateTreeView.refreshEntry, item)
	);
}