import vscode = require("vscode");
import ExtensionConfiguration from "../config/ExtensionConfiguration";
import * as cs from "../cs";
import QuickPicker from "../helpers/QuickPicker";

/**
 * This command saves a folder or item as a template.
 * This command can be invoked by the Command Palette or in a folder context menu on the explorer view.
 * 
 * @export run command function
 * @this TemplateManager instance that manages this command.
 * @param {vscode.Uri} [defaultUri] supplied by vscode's contribution on file/explorer.
 * @returns void
 */
export default async function run(defaultUri?: vscode.Uri) {
    // get workspace folder
    let folder = defaultUri ? defaultUri.fsPath : await QuickPicker.pickWorkspaceFolder(defaultUri, "Choose a workspace folder containing project template files", undefined, true);

    if (!folder) {
        QuickPicker.error("You must select a workspace and folder before you can save a project template", false, "Try Again", () => { this.run(defaultUri); }, "Cancel");

        return;
    }
	
	// load latest configuration
	ExtensionConfiguration.updateConfiguration(cs.dynamics.configuration.templates._namespace);

	// save template to file system (will save to catalog)
    this.saveToFilesystem(folder).then(
        (template) => {
            if (template) {
                QuickPicker.inform(`Created template from folder '${template}'`);
            }
        },
        (reason: any) => {
            QuickPicker.error(`Failed to save a template from the contents of '${folder}': ${reason}`, false, "Try Again", () => { this.run(defaultUri); }, "Cancel");
        }
	);   
}