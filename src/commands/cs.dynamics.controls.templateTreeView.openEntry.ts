import * as TemplateTreeView from "../views/TemplateTreeView";
import TemplateManager from "../controls/Templates/TemplateManager";
/**
 * This command can be invoked by the Template Tree View and edits an item to the TreeView
 * @export run command function
 * @this TemplateTreeView instance that manages this command.
 * @param {TemplateTreeView.TreeEntry} [item] that invoked the command.
 * @returns void
 */
export default async function run(item?: TemplateTreeView.TreeEntry) {
	await TemplateManager.openTemplateFolderInExplorer(item.context);
}