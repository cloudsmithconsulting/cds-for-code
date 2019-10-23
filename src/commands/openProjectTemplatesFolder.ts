import vscode = require("vscode");
import filemanager = require("../helpers/FileManager");
import TemplatesManager from "../projectTemplatesPlugin";
import ExtensionConfiguration from "../helpers/ExtensionConfiguration";
import * as cs from "../cs";

/**
 * Main command to create a file from a template.
 * This command can be invoked by the Command Palette or in a folder context menu on the explorer view.
 * @export
 * @param {TemplatesManager} templatesManager
 * @param {*} args
 * @returns
 */
export async function run(templateManager: TemplatesManager, args: any) {
	// load latest configuration
	ExtensionConfiguration.updateConfiguration(cs.dynamics.configuration.templates._namespace);

	// create template directory
	await templateManager.createTemplatesDirIfNotExists();

	// open template directory
	filemanager.openFolderInExplorer(await templateManager.getTemplatesDir());
}