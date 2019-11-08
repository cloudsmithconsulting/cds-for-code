import * as vscode from 'vscode';
import { View, ViewRenderer } from '../view';
import * as cs from '../cs';
import IWireUpCommands from '../wireUpCommand';
import ExtensionConfiguration from '../../out/config/ExtensionConfiguration';

export default class NewWorkspaceViewManager implements IWireUpCommands {
    private static _initialized:boolean = false;

    public showWelcomeExperience() {
        if (!NewWorkspaceViewManager._initialized) {
            const showWelcome:boolean = ExtensionConfiguration.getConfigurationValue(cs.dynamics.configuration.explorer.showWelcomeExperience);

            if (showWelcome) {
                vscode.commands.executeCommand(cs.dynamics.controls.newWorkspace.open);
            }

            NewWorkspaceViewManager._initialized = true;
        }
    }

	public wireUpCommands(context: vscode.ExtensionContext, config?:vscode.WorkspaceConfiguration) {
        context.subscriptions.push(
            vscode.commands.registerCommand(cs.dynamics.controls.newWorkspace.open, () => { // Match name of command to package.json command
                // Run command code
                //const viewFileUri = vscode.Uri.file(`${context.extensionPath}/resources/webViews/connectionView.html`);
                const view = View.createOrShow(NewWorkspaceView, {
                    extensionPath: context.extensionPath,
                    iconPath: './resources/images/cloudsmith-logo-only-50px.png',
                    viewTitle: 'Welcome to Dynamics 365 for Code',
                    viewType: cs.dynamics.views.newWorkspaceView
                });
            }) // <-- no semi-colon, comma starts next command registration
        );

        vscode.workspace.onDidChangeWorkspaceFolders(e => {
            if (e.added) { this.showWelcomeExperience(); }
        });

        this.showWelcomeExperience();
    }
}

class NewWorkspaceView extends View {
    public getHtmlForWebview(viewRenderer: ViewRenderer): string {
        // add script and css assets
        viewRenderer.addScript('new-workspace.js');
        viewRenderer.addScript('tabs.js');

        viewRenderer.addStyleSheet('webviewStyles.css');

        // add image assets
        viewRenderer.addImage('cloudsmith-logo-only-50px.png');

        // return rendered html
        return viewRenderer.renderPartialFile('new-workspace.html');
    }    
    
    public onDidReceiveMessage(instance: NewWorkspaceView, message: any): vscode.Event<any> {
        switch (message.command) {
            case 'openConnectionView':
                vscode.commands.executeCommand(cs.dynamics.controls.treeView.editConnection);
                return;
        }
    }

    public postMessage(command:string, message?: any) {
        if (command && message) {
            this.panel.webview.postMessage({ command, message });
        }
    }
}