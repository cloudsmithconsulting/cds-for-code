import ExtensionConfiguration from "../core/ExtensionConfiguration";
import * as cs from "../cs";
import Quickly from "../core/Quickly";
import { TemplateItem } from "../components/Templates/Types";

/**
 * Main command to delete an existing template.
 * This command can be invoked by the Command Palette or in a folder context menu on the explorer view.
 * @export run command function
 * @this TemplateManager instance that manages this command.
 * @param {TemplateItem} [template] supplied by the template tree view
 * @returns void
 */
export default async function run(template: TemplateItem) {
    // load latest configuration
    ExtensionConfiguration.updateConfiguration(cs.dynamics.configuration.templates._namespace);

    template = template || await Quickly.pickTemplate("Choose the template you would like to delete");

    // no template chosen, simply exit
    if (!template || !template.location) {
        return;
    } 

    // delete template
    this.deleteFromFilesystem(template)
        .then(deleted => { 
            if (deleted) {
                Quickly.inform(`Template '${template.name}' was removed from the library.`);
            } 
        }, (reason) => { 
            Quickly.error(`Failed to delete the contents of '${template.location}': ${reason}`, false, "Try Again", () => { this.run(template); }, "Cancel");
        }
    );
    
}