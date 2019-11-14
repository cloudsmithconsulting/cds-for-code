import vscode = require("vscode");
import TemplateManager from "../controls/Templates/TemplateManager";
import ExtensionConfiguration from "../config/ExtensionConfiguration";
import * as cs from "../cs";
import QuickPicker from "../helpers/QuickPicker";

/**
 * Main command to create a new project from a template.
 * This command can be invoked by the Command Palette or in a folder context menu on the explorer view.
 * @export
 * @param {TemplateManager} templateManager
 * @param {*} args
 */
export default async function run(templateManager: TemplateManager, defaultPath?: vscode.Uri) {

    // get workspace folder
    let folder = await QuickPicker.pickWorkspaceFolder(defaultPath, "Choose a workspace folder where templated files go", undefined, true);

    if (!folder) {
        vscode.window.showErrorMessage("You must select a workspace before you can create a project");

        return;
    }

    // load latest configuration
    ExtensionConfiguration.updateConfiguration(cs.dynamics.configuration.templates._namespace);

    // create project
    templateManager.createFromFilesystem(folder).then(
        (template) => {
            if (template) {
                QuickPicker.inform(`Created project from template '${template.displayName}'`);
            }
        },
        (reason: any) => {
            QuickPicker.error(`Failed to create project from the template in '${folder}': ${reason}`);
        }
    );
}