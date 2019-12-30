import * as vscode from 'vscode';
import * as path from 'path';
import * as cs from '../../cs';
import IContributor from '../../core/CommandBuilder';
import ExtensionContext from '../../core/ExtensionContext';
import downloadRequiredIcons from "../../commands/cs.cds.extension.downloadRequiredIcons";
import { ExtensionIconThemes } from './Types';

export default class IconLoader implements IContributor {
    contribute(context: vscode.ExtensionContext, config?:vscode.WorkspaceConfiguration) {
		//GlobalState.Instance(context).PowerShellScriptVersion = null;

		// do this immediately
        IconLoader.downloadIconTheme(context);

        // now wire a command into the context
        context.subscriptions.push(
            vscode.commands.registerCommand(cs.cds.extension.downloadRequiredIcons, downloadRequiredIcons.bind(this))
        );
    }

    static downloadIconTheme(context?: vscode.ExtensionContext) {
		// get local storage folder
		const folder = path.join((context || ExtensionContext.Instance).extensionPath, "/resources/icons/");
		
		return ExtensionIconThemes.default.downloadIcons(folder);
	}
}