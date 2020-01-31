import * as FileSystem from "../core/io/FileSystem";
import * as vscode from 'vscode';
import * as path from 'path';
import TemplateManager from "../components/Templates/TemplateManager";
import Quickly from "../core/Quickly";

/**
 * Main command to edit the template catalog.
 * This command can be invoked by the Command Palette or in the template treeview
 * @export run command function
 * @this TemplateManager instance that manages this command.
 * @returns void
 */
export default async function run(this: TemplateManager, configFile?:vscode.Uri) {
	let file;

	if (configFile && configFile.fsPath && FileSystem.exists(configFile.fsPath)) {
		file = configFile.fsPath;
	} else {
		// Force a load on the template catalog, which will init catalog.json if it doens't exist.
		await TemplateManager.getTemplateCatalog();

		file = path.join((await TemplateManager.getTemplatesFolder()), "catalog.json");
	}

	Quickly.openFile(file);
}