import * as cs from "../cs";
import * as TemplateTreeView from "../views/TemplateTreeView";
import * as vscode from 'vscode';
/**
 * This command can be invoked by the Template Tree View and edits an item to the TreeView
 * @export run command function
 * @this TemplateTreeView instance that manages this command.
 * @param {TemplateTreeView.TreeEntry} [item] that invoked the command.
 * @returns void
 */
export default async function run(item?: TemplateTreeView.TreeEntry) {
	vscode.commands.executeCommand(cs.dynamics.templates.editTemplateCatalog);
}