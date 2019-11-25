import vscode = require("vscode");
import ExtensionConfiguration from "../config/ExtensionConfiguration";
import * as cs from "../cs";
import QuickPicker from "../helpers/QuickPicker";
import { TemplateItem, TemplateType } from "../controls/Templates/Types";
import * as FileSystem from "../helpers/FileSystem";
import * as p from 'path';

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

}