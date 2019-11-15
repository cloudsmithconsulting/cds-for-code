import * as FileSystem from "../helpers/FileSystem";
import * as vscode from 'vscode';
import * as path from 'path';
import TemplateManager from "../controls/Templates/TemplateManager";

/**
 * Main command to edit the template catalog.
 * This command can be invoked by the Command Palette or in the template treeview
 * @export run command function
 * @this TemplateManager instance that manages this command.
 * @returns void
 */
export default async function run(configFile?:vscode.Uri) {
	let file;

	if (configFile && configFile.fsPath && FileSystem.exists(configFile.fsPath)) {
		file = configFile.fsPath;
	} else {
		// Force a load on the template catalog, which will init catalog.json if it doens't exist.
		await TemplateManager.getTemplateCatalog();

		file = path.join((await TemplateManager.getTemplatesFolder()), "catalog.json");
	}

	vscode.workspace.openTextDocument(file).then(d => vscode.window.showTextDocument(d));
}