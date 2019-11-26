import vscode = require("vscode");
import ExtensionConfiguration from "../core/ExtensionConfiguration";
import * as cs from "../cs";
import QuickPicker from "../core/QuickPicker";
import { TemplateItem, TemplateType } from "../components/Templates/Types";
import * as FileSystem from "../core/io/FileSystem";
import * as p from 'path';

/**
 * Command creates a folder or item in your workspace and restores a template from the catalog to it.
 * This command can be invoked by the Command Palette or in a folder context menu on the explorer view.
 *
 * @export command module
 * @this TemplateManager instance that manages this command.
 * @param {vscode.Uri} [destinationUri] supplied by vscode's contribution on file/explorer.
 * @returns void
 */
export default async function run(destinationUri?: vscode.Uri, type?:TemplateType, template?:TemplateItem): Promise<void> {
	let path:string;

    if (template && !type) {
        type = template.type;
    }

    type = type || await QuickPicker.pickEnum<TemplateType>(TemplateType, "What kind of template would you like to create?");
    if (!type) { return; }

    if (!destinationUri || !destinationUri.fsPath || !FileSystem.exists(destinationUri.fsPath)) {
        switch (type) {
            case TemplateType.ProjectTemplate:
                path = await QuickPicker.pickWorkspaceFolder(destinationUri, "Select the template folder");
                break;
            case TemplateType.ItemTemplate:
                const fileItem = await QuickPicker.pickWorkspaceAny(destinationUri, "Select the template item");
                path = fileItem.fsPath;

                if (fileItem.itemType === vscode.FileType.Directory) {
                    const filename = await QuickPicker.ask("What would you like to call the file that is created?");
                    if (!filename) { return; }

                    path = p.join(path, filename);
                } else {
                    path = fileItem.fsPath;
                }

                break;
        }
    } else {
        path = destinationUri.fsPath;
    }

    if (!path) {
        QuickPicker.error("You must select a workspace and folder before you can create a templated project or item", false, "Try Again", () => { vscode.commands.executeCommand(cs.dynamics.templates.createFromTemplate, destinationUri, type); }, "Cancel");

        return;
    }

    // load latest configuration
    ExtensionConfiguration.updateConfiguration(cs.dynamics.configuration.templates._namespace);

    // create project
    this.createFromFilesystem(path, type, template).then(
        (template) => {
            if (template) {
                QuickPicker.inform(`Created ${template.type === TemplateType.ProjectTemplate ? "project" : "item"} from template '${template.displayName}'`);
            }
        },
        (reason: any) => {
            QuickPicker.error(`Failed to create items from the template in '${path}': ${reason}`, false, "Try Again", () => { this.run(destinationUri); }, "Cancel");
        }
    );
}