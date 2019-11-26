import ExtensionConfiguration from "../core/ExtensionConfiguration";
import * as cs from "../cs";
import * as TemplateTreeView from "../views/TemplateTreeView";
/**
 * This command can be invoked by the Template Tree View and refreshes an item (or the entire treeview)
 * @export run command function
 * @this TemplateTreeView instance that manages this command.
 * @param {TemplateTreeView.TreeEntry} [item] that invoked the command.
 * @returns void
 */
export default async function run(item?: TemplateTreeView.TreeEntry) {
	this.refresh(item);
}