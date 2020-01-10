import * as vscode from 'vscode';
import * as path from 'path';
import * as cs from '../../cs';
import ExtensionContext from '../../core/ExtensionContext';
import { ExtensionIconThemes } from './Types';
import command from '../../core/Command';
import { extensionActivate } from '../../core/Extension';

export default class IconLoader {
	@extensionActivate(cs.cds.extension.productId)
    async activate(context: vscode.ExtensionContext, config?:vscode.WorkspaceConfiguration) {
        await IconLoader.downloadIconTheme(context);
    }

    @command(cs.cds.extension.downloadRequiredIcons, "Download required icons")
    static async downloadIconTheme(context?: vscode.ExtensionContext) {
		// get local storage folder
		const folder = path.join((context || ExtensionContext.Instance).extensionPath, "/resources/icons/");
		
		return await ExtensionIconThemes.default.downloadIcons(folder);
	}
}