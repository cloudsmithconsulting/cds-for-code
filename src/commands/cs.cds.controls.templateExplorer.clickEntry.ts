import * as TemplateTreeView from "../views/TemplateExplorer";
import * as vscode from 'vscode';

/**
 * This command can be invoked by the Template Tree View and clicks an item to the TreeView
 * @export run command function
 * @this TemplateTreeView instance that manages this command.
 * @param {TemplateTreeView.TreeEntry} [item] that invoked the command.
 * @returns void
 */
export default async function run(item?: TemplateTreeView.TreeEntry) {
	if (item.collapsibleState === vscode.TreeItemCollapsibleState.Collapsed) {
		item.collapsibleState = vscode.TreeItemCollapsibleState.Expanded;
	}
}