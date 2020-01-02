import * as vscode from 'vscode';
import * as cs from '../cs';
import IContributor from '../core/CommandBuilder';
import connectionView from "./cs.dynamics.views.connectionEditor";
import pluginStepView from "./cs.dynamics.views.pluginStepEditor";
import pluginStepImageView from "./cs.dynamics.view.pluginStepImageEditor";

export default class ViewManager implements IContributor {
	contribute(context: vscode.ExtensionContext, config?:vscode.WorkspaceConfiguration) {
        context.subscriptions.push(
            vscode.commands.registerCommand(cs.dynamics.deployment.connectToCds, connectionView.bind(this)),
            vscode.commands.registerCommand(cs.dynamics.controls.dynamicsTreeView.editConnection, connectionView.bind(this)),
            vscode.commands.registerCommand(cs.dynamics.controls.pluginStep.open, pluginStepView.bind(this)),
            vscode.commands.registerCommand(cs.dynamics.controls.pluginStepImage.open, pluginStepImageView.bind(this))
        );
    }
}