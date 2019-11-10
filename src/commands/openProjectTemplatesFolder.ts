import vscode = require("vscode");
import * as fs from "../helpers/FileSystem";
import TemplatesManager from "../projectTemplatesPlugin";
import ExtensionConfiguration from "../config/ExtensionConfiguration";
import * as cs from "../cs";

/**
 * Main command to create a file from a template.
 * This command can be invoked by the Command Palette or in a folder context menu on the explorer view.
 * @export
 * @param {TemplatesManager} templatesManager
 * @param {*} args
 * @returns
 */
export default async function run(templateManager: TemplatesManager, args: any) {
	// load latest configuration
	ExtensionConfiguration.updateConfiguration(cs.dynamics.configuration.templates._namespace);

	// create template directory
	await templateManager.createTemplatesDirIfNotExists();

	// open template directory
	fs.openFolderInExplorer(await templateManager.getTemplatesDir());
}