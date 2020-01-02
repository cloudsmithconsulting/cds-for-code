import vscode = require("vscode");
import * as cs from "../cs";
import Quickly from "../core/Quickly";
import TemplateManager from "../components/Templates/TemplateManager";
import logger from "../core/Logger";

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
        const response = await Quickly.pickAnyFile(undefined, false, "Select template item", { "Zip Files": [ "*.zip" ]});
        if (!response) { 
            logger.warn("File not chosen, command cancelled");
            return; 
        }

        if (response instanceof Array && response.length > 0) {
            sourceUri = response[0];
        } else {
            sourceUri = <vscode.Uri>response;
        }
    } 

    TemplateManager.importTemplate(sourceUri.fsPath)
        .then(template => {
            logger.info(`Imported template ${template.name}`);
            Quickly.inform(`Imported template '${template.name}'`);
        }).catch(error => {
            Quickly.error(`Failed to import the template '${sourceUri.fsPath}': ${error}`, false, "Try Again", () => { vscode.commands.executeCommand(cs.cds.templates.importTemplate, sourceUri); }, "Cancel");
        });

}