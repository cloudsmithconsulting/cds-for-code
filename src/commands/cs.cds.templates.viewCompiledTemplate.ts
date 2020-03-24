import vscode = require("vscode");
import Quickly from "../core/Quickly";
import TemplateManager from "../components/Templates/TemplateManager";
import { TemplateItem } from "../components/Templates/Types";
import logger from "../core/framework/Logger";

/**
 * Command exports a template from your workspace into a .zip archive for re-import later.
 * This command can be invoked by the Command Palette or in a folder context menu on the template view.
 *
 * @export command module
 * @this TemplateManager instance that manages this command.
 * @param {vscode.Uri} [destinationUri] supplied by vscode's contribution on file/explorer.
 * @returns void
 */
export default async function run(this: TemplateManager, template: TemplateItem): Promise<void> {
    template = template || await Quickly.pickTemplate("Please select the template that you wish to view compiled");
    if (!template) {
        logger.warn("Template not chosen, command cancelled");
        return; 
    }
    
    const analysis = await TemplateManager.getTemplateAnalysis(template);
    for (const file of analysis.files) {
        const fn = file.templateFn.toString();
        await Quickly.openContent(fn, "javascript");
    }
}