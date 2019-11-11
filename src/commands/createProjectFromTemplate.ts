import vscode = require("vscode");
import ProjectTemplatesPlugin from "../projectTemplatesPlugin";
import ExtensionConfiguration from "../config/ExtensionConfiguration";
import * as cs from "../cs";
import QuickPicker from "../helpers/QuickPicker";

/**
 * Main command to create a new project from a template.
 * This command can be invoked by the Command Palette or in a folder context menu on the explorer view.
 * @export
 * @param {ProjectTemplatesPlugin} templateManager
 * @param {*} args
 */
export default async function run(templateManager: ProjectTemplatesPlugin) {

    // get workspace folder
    let workspace = await QuickPicker.pickWorkspaceFolder(undefined, "Choose a workspace folder where templated files go");

    if (!workspace) {
        vscode.window.showErrorMessage("You must select a workspace before you can create a project");

        return;
    }

    // load latest configuration
    ExtensionConfiguration.updateConfiguration(cs.dynamics.configuration.templates._namespace);

    // create project
    templateManager.createFromTemplate(workspace).then(
        (template : string | undefined) => {
            if (template) {
                vscode.window.showInformationMessage("Created project from template '" + template + "'");
            }
        },
        (reason: any) => {
            vscode.window.showErrorMessage("Failed to create project from template: " + reason);
        }
    );
}