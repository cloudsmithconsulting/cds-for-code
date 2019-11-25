import vscode = require("vscode");
import ExtensionConfiguration from "../config/ExtensionConfiguration";
import * as cs from "../cs";
import QuickPicker from "../helpers/QuickPicker";
import { TemplateType } from "../controls/Templates/Types";
import * as FileSystem from "../helpers/FileSystem";

/**
 * This command saves a folder or item as a template.
 * This command can be invoked by the Command Palette or in a folder context menu on the explorer view.
 * 
 * @export run command function
 * @this TemplateManager instance that manages this command.
 * @param {vscode.Uri} [templateUri] supplied by vscode's contribution on file/explorer.
 * @returns void
 */
export default async function run(templateUri: vscode.Uri, type:TemplateType) {
	let path:string;

    type = type || await QuickPicker.pickEnum<TemplateType>(TemplateType, "What kind of template would you like to create?");
    if (!type) { return; }

    if (!templateUri || !templateUri.fsPath || !FileSystem.exists(templateUri.fsPath)) {
        switch (type) {
            case TemplateType.ProjectTemplate:
                path = await QuickPicker.pickWorkspaceFolder(templateUri, "Select the template folder");
                break;
            case TemplateType.ItemTemplate:
                path = await QuickPicker.pickWorkspaceFile(templateUri, "Select the template item");
                break;
        }
    } else {
        path = templateUri.fsPath;
    }

    if (!path) {
        await QuickPicker.error("You must select a workspace and folder before you can save a project template", false, "Try Again", () => { vscode.commands.executeCommand(cs.dynamics.templates.saveTemplate, templateUri, type); }, "Cancel");

        return;
    }
	
	// load latest configuration
	ExtensionConfiguration.updateConfiguration(cs.dynamics.configuration.templates._namespace);

	// save template to file system (will save to catalog)
    this.saveToFilesystem(path, type).then(
        (template) => {
            if (template) {
                QuickPicker.inform(`Created template '${template.name}' from ${type === TemplateType.ItemTemplate ? "item" : "folder"}`);
            }
        },
        (reason: any) => {
            QuickPicker.error(`Failed to save a template from the contents of '${path}': ${reason}`, false, "Try Again", () => { vscode.commands.executeCommand(cs.dynamics.templates.saveTemplate, templateUri, type); }, "Cancel");
        }
	);   
}