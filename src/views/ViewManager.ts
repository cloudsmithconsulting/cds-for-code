import * as vscode from 'vscode';
import * as cs from '../cs';
import IContributor from '../core/CommandBuilder';
import connectionView from "./cs.cds.views.connectionEditor";

export default class ViewManager implements IContributor {
	contribute(context: vscode.ExtensionContext, config?:vscode.WorkspaceConfiguration) {
        context.subscriptions.push(
            vscode.commands.registerCommand(cs.cds.deployment.connectToCds, connectionView.bind(this)),
            vscode.commands.registerCommand(cs.cds.controls.cdsExplorer.editConnection, connectionView.bind(this))
        );
    }
}