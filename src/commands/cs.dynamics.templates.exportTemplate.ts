import vscode = require("vscode");
import ExtensionConfiguration from "../core/ExtensionConfiguration";
import * as cs from "../cs";
import QuickPicker from "../core/QuickPicker";
import { TemplateItem, TemplateType } from "../components/Templates/Types";
import * as FileSystem from "../core/io/FileSystem";
import * as p from 'path';
import TemplateManager from "../components/Templates/TemplateManager";

/**
 * Command exports a template from your workspace into a .zip archive for re-import later.
 * This command can be invoked by the Command Palette or in a folder context menu on the template view.
 *
 * @export command module
 * @this TemplateManager instance that manages this command.
 * @param {vscode.Uri} [destinationUri] supplied by vscode's contribution on file/explorer.
 * @returns void
 */
export default async function run(template: TemplateItem, destinationUri:vscode.Uri): Promise<void> {
    template = template || await QuickPicker.pickTemplate("Please select the template that you wish to export");
    if (!template) { return; }

    if (!destinationUri) {
        const response = await QuickPicker.pickAnyFolder(undefined, false, "Select export folder");
        if (!response) { return; }

        if (response instanceof Array && response.length > 0) {
            destinationUri = response[0];
        } else {
            destinationUri = <vscode.Uri>response;
        }
    } 

    TemplateManager.exportTemplate(template, p.join(destinationUri.fsPath, `${template.name}.zip`))
        .then(() => {
            QuickPicker.inform(`Exported template '${template.name}'`);
        }).catch(error => {
            QuickPicker.error(`Failed to export the template '${template.name}': ${error}`, false, "Try Again", () => { vscode.commands.executeCommand(cs.dynamics.templates.exportTemplate, template, destinationUri); }, "Cancel");
        });
}