import ExtensionConfiguration from "../config/ExtensionConfiguration";
import * as cs from "../cs";
import { TemplateItem } from "../controls/Templates/TemplateManager";

/**
 * This command can be invoked by the Command Palette or by the template tree view and reveals 
 * a template's folder in explorer.
 * @export run command function
 * @this TemplateManager instance that manages this command.
 * @param {TemplateItem} [template] supplied by the template tree view
 * @returns void
 */
export default async function run(template: TemplateItem) {
	// load latest configuration
	ExtensionConfiguration.updateConfiguration(cs.dynamics.configuration.templates._namespace);

	// open template directory
	await this.openTemplateFolderInExplorer(template);
}