import * as cs from "../cs";
import * as TemplateTreeView from "../views/TemplateTreeView";
import * as vscode from 'vscode';
import { TemplateType } from "../controls/Templates/TemplateManager";
import TemplateManager from "../controls/Templates/TemplateManager";
import * as path from 'path';
import QuickPicker from "../helpers/QuickPicker";

/**
 * This command can be invoked by the Template Tree View and edits an item to the TreeView
 * @export run command function
 * @this TemplateTreeView instance that manages this command.
 * @param {TemplateTreeView.TreeEntry} [item] that invoked the command.
 * @returns void
 */
export default async function run(item?: TemplateTreeView.TreeEntry) {
	if (!item) {
		vscode.commands.executeCommand(cs.dynamics.templates.editTemplateCatalog);
	} else if (item.context) {
		let file;
		let folder = await TemplateManager.getTemplatesFolder();

		if (item.context.type === TemplateType.ItemTemplate) {
			if (path.isAbsolute(item.context.location)) {
				file = item.context.location;
				folder = path.dirname(file);
			} else {
				file = path.join(folder, item.context.location);
			}

			vscode.workspace.openTextDocument(file).then(d => vscode.window.showTextDocument(d));
		} else {
			if (path.isAbsolute(item.context.location)) {
				folder = item.context.location;
			} else {
				folder = path.join(folder, item.context.location);
			}

			if (vscode.workspace.workspaceFolders.length === 0 
				&& await QuickPicker.pickBoolean("Would you like to open this project template in a new workspace folder?", "Yes", "No")) {
				vscode.workspace.updateWorkspaceFolders(0, 0, { uri: vscode.Uri.file(folder), name: item.context.name });
			}
		}
	}
}