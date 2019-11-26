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
 * @param {vscode.Uri} [sourceUri] supplied by vscode's contribution on file/explorer.
 * @returns void
 */
export default async function run(sourceUri:vscode.Uri): Promise<void> {
    if (!sourceUri) {
        const response = await QuickPicker.pickAnyFile(undefined, false, "Select template item", { "Zip Files": [ "*.zip" ]});
        if (!response) { return; }

        if (response instanceof Array && response.length > 0) {
            sourceUri = response[0];
        } else {
            sourceUri = <vscode.Uri>response;
        }
    } 

    TemplateManager.importTemplate(sourceUri.fsPath)
        .then(template => {
            QuickPicker.inform(`Imported template '${template.name}'`);
        }).catch(error => {
            QuickPicker.error(`Failed to import the template '${sourceUri.fsPath}': ${error}`, false, "Try Again", () => { vscode.commands.executeCommand(cs.dynamics.templates.importTemplate, sourceUri); }, "Cancel");
        });

}