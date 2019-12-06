import * as vscode from 'vscode';
import { View, ViewRenderer } from '../core/webui/View';
import * as cs from '../cs';
import IContributor from '../core/CommandBuilder';
import ExtensionConfiguration from '../core/ExtensionConfiguration';
import DiscoveryRepository from '../repositories/discoveryRepository';

export default class NewWorkspaceViewManager implements IContributor {
    private static _initialized:boolean = false;

    showWelcomeExperience() {
        if (!NewWorkspaceViewManager._initialized) {
            const showWelcome:boolean = ExtensionConfiguration.getConfigurationValue(cs.dynamics.configuration.explorer.showWelcomeExperience);

            if (showWelcome) {
                vscode.commands.executeCommand(cs.dynamics.controls.newWorkspace.open);
            }

            NewWorkspaceViewManager._initialized = true;
        }
    }

	contribute(context: vscode.ExtensionContext, config?:vscode.WorkspaceConfiguration) {
        let view;

        context.subscriptions.push(
            vscode.commands.registerCommand(cs.dynamics.controls.newWorkspace.open, (showLoadingMessage:boolean = false) => { // Match name of command to package.json command
                // Run command code
                //const viewFileUri = vscode.Uri.file(`${context.extensionPath}/resources/webViews/connectionView.html`);
                view = View.show(NewWorkspaceView, {
                    extensionPath: context.extensionPath,
                    iconPath: './resources/images/cloudsmith-logo-only-50px.png',
                    viewTitle: 'Welcome to Dynamics 365 for Code',
                    viewType: cs.dynamics.views.newWorkspaceView,
                    preserveFocus: true
                });

                view.postMessage("load", {
                    showWelcomeExperience: ExtensionConfiguration.getConfigurationValue(cs.dynamics.configuration.explorer.showWelcomeExperience),
                    connections: DiscoveryRepository.getOrgConnections(context)
                });

                return view;
            }) // <-- no semi-colon, comma starts next command registration
            , vscode.commands.registerCommand(cs.dynamics.controls.newWorkspace.showLoadingMessage, async () => {
                if (!view) {
                    view = await vscode.commands.executeCommand(cs.dynamics.controls.newWorkspace.open, true);                    
                } else {
                    view.postMessage("showLoadingMessage");
                }
            })
            , vscode.commands.registerCommand(cs.dynamics.controls.newWorkspace.hideLoadingMessage, async () => {
                if (!view) {
                    view = await vscode.commands.executeCommand(cs.dynamics.controls.newWorkspace.open, false);
                } else {
                    view.postMessage("hideLoadingMessage");
                }
            })
        );

        this.showWelcomeExperience();
    }
}

class NewWorkspaceView extends View {
    construct(viewRenderer: ViewRenderer): string {
        // add script and css assets
        viewRenderer.addScript('materialize.js');
        viewRenderer.addScript('new-workspace.js');

        viewRenderer.addStyleSheet("materialize.vscode.css");
        viewRenderer.addStyleSheet('webviewStyles.css');

        // add image assets
        viewRenderer.addImage('cloudsmith-logo-only-50px.png');

        // return rendered html
        return viewRenderer.renderFile('new-workspace.html');
    }    
    
    onDidReceiveMessage(instance: NewWorkspaceView, message: any): vscode.Event<any> {
        switch (message.command) {
            case 'updateWelcomeExperienceConfig':
                ExtensionConfiguration.setConfigurationValue(cs.dynamics.configuration.explorer.showWelcomeExperience, message.value);
                return;
            case 'openConnectionView':
                vscode.commands.executeCommand(cs.dynamics.controls.dynamicsTreeView.editConnection);
                return;
        }
    }

    postMessage(command:string, parameters?: any) {
        if (command) {
            this.panel.webview.postMessage({ command, parameters });
        }
    }
}