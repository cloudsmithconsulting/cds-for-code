import ExtensionConfiguration from "../core/ExtensionConfiguration";
import * as cs from "../cs";
import Quickly from "../core/Quickly";
import { TemplateItem } from "../components/Templates/Types";
import logger from "../core/framework/Logger";
import TemplateManager from "../components/Templates/TemplateManager";

/**
 * Main command to delete an existing template.
 * This command can be invoked by the Command Palette or in a folder context menu on the explorer view.
 * @export run command function
 * @this TemplateManager instance that manages this command.
 * @param {TemplateItem} [template] supplied by the template tree view
 * @returns void
 */
export default async function run(this: TemplateManager, template: TemplateItem) {
    // load latest configuration
    ExtensionConfiguration.updateConfiguration(cs.cds.configuration.templates._namespace);

    template = template || await Quickly.pickTemplate("Choose the template you would like to delete");

    // no template chosen, simply exit
    if (!template || !template.location) {
        logger.warn(`Command: ${cs.cds.templates.deleteTemplate} Location of template not specified, command cancelled`);
        return;
    } 

    // delete template
    await this.deleteFromFilesystem(template)
        .then(deleted => { 
            if (deleted) {
                logger.info(`Command: ${cs.cds.templates.deleteTemplate} Template ${template.name} deleted`);
                Quickly.inform(`Template '${template.name}' was removed from the library.`);
            } 
        }, async (reason) => {             
            await Quickly.error(`Failed to delete the contents of '${template.location}': ${reason}`, false, "Try Again", () => { this.deleteTemplate(template); }, "Cancel");
        }
    );
    
}