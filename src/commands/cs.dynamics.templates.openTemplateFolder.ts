import { TemplateItem } from "../components/Templates/Types";
import TemplateManager from "../components/Templates/TemplateManager";

/**
 * This command can be invoked by the Command Palette or by the template tree view and reveals 
 * a template's folder in explorer.
 * @export run command function
 * @this TemplateManager instance that manages this command.
 * @param {TemplateItem} [template] supplied by the template tree view
 * @returns void
 */
export default async function run(template: TemplateItem) {
	await TemplateManager.openTemplateFolderInExplorer(template);
}