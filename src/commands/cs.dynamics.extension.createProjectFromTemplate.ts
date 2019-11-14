import vscode = require("vscode");
import ExtensionConfiguration from "../config/ExtensionConfiguration";
import * as cs from "../cs";
import QuickPicker from "../helpers/QuickPicker";

/**
 * Command creates a folder or item in your workspace and restores a template from the catalog to it.
 * This command can be invoked by the Command Palette or in a folder context menu on the explorer view.
 *
 * @export command module
 * @this TemplateManager instance that manages this command.
 * @param {vscode.Uri} [defaultUri] supplied by vscode's contribution on file/explorer.
 * @returns void
 */
export default async function run(defaultUri?: vscode.Uri): Promise<void> {
    // get workspace folder
    let folder = defaultUri ? defaultUri.fsPath : await QuickPicker.pickWorkspaceFolder(defaultUri, "Choose a workspace folder where templated files go", undefined, true);

    if (!folder) {
        QuickPicker.error("You must select a workspace and folder before you can create a project", false, "Try Again", () => { this.run(defaultUri); }, "Cancel");

        return;
    }

    // load latest configuration
    ExtensionConfiguration.updateConfiguration(cs.dynamics.configuration.templates._namespace);

    // create project
    this.createFromFilesystem(folder).then(
        (template) => {
            if (template) {
                QuickPicker.inform(`Created project from template '${template.displayName}'`);
            }
        },
        (reason: any) => {
            QuickPicker.error(`Failed to create project from the template in '${folder}': ${reason}`, false, "Try Again", () => { this.run(defaultUri); }, "Cancel");
        }
    );
}