import vscode = require("vscode");
import TemplateManager, { TemplateType } from "../controls/Templates/TemplateManager";
import ExtensionConfiguration from "../config/ExtensionConfiguration";
import * as cs from "../cs";
import QuickPicker from "..//helpers/QuickPicker";

/**
 * Main command to delete an existing template.
 * This command can be invoked by the Command Palette or in a folder context menu on the explorer view.
 * @export
 * @param {TemplateManager} templateManager
 * @param {*} args
 */
export default async function run(templateManager: TemplateManager, args: any) {
    // load latest configuration
    ExtensionConfiguration.updateConfiguration(cs.dynamics.configuration.templates._namespace);

    // choose a template then delete
    QuickPicker.pickTemplate("Choose the template you would like to delete").then( 
        template => {
            // no template chosen, simply exit
            if (!template) {
                return;
            }

            // delete template
            templateManager.deleteFromFilesystem(template.location)
                .then(deleted => { 
                    if (deleted) {
                        QuickPicker.inform(`Template '${template.name}' was removed from the library.`);
                    } 
                }, (reason) => { 
                    QuickPicker.error(`There was an error deleting the template '${template.name}': ${reason}`);
                }
            );
        }
    );
    
}