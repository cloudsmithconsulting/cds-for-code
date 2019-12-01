import * as vscode from 'vscode';
import DiscoveryRepository from '../repositories/discoveryRepository';
import { View, ViewRenderer } from '../core/types/View';
import * as cs from '../cs';
import IContributor from '../core/CommandBuilder';
import { DynamicsWebApi } from '../api/cds-webapi/DynamicsWebApi';

export default class ConnectionViewManager implements IContributor {
	contribute(context: vscode.ExtensionContext, config?:vscode.WorkspaceConfiguration) {
        context.subscriptions.push(

            vscode.commands.registerCommand(cs.dynamics.controls.dynamicsTreeView.editConnection, async (config?: DynamicsWebApi.Config) => { // Match name of command to package.json command
                // Run command code
                //const viewFileUri = vscode.Uri.file(`${context.extensionPath}/resources/webViews/connectionView.html`);
                const view = ConnectionView.createOrShow<ConnectionView>(ConnectionView, {
                    extensionPath: context.extensionPath,
                    iconPath: './resources/images/cloudsmith-logo-only-50px.png',
                    viewTitle: (config && config.name) ? `Edit Connection - ${config.name}` : 'New Connection - Dynamics 365 CE',
                    viewType: cs.dynamics.views.connectionView
                });

                // only do this if we are editing
                if (config && config.id) {
                    view.setInitialState(config);
                }
            }) // <-- no semi-colon, comma starts next command registration
        );
    }
}

class ConnectionView extends View {
    getHtmlForWebview(viewRenderer: ViewRenderer): string {
        // add script and css assets
        viewRenderer.addScript('connectionView.js');
        viewRenderer.addStyleSheet('webviewStyles.css');

        // add image assets
        viewRenderer.addImage('cloudsmith-logo-only-50px.png');

        // return rendered html
        return viewRenderer.renderPartialFile('connection.html');
    } 
    
    private save(config: DynamicsWebApi.Config) {
        // set a timeout if it doesn't exist
        config.timeout = config.timeout || (1000 * 3); // 3 seconds
        // construct the api repo
        const api = new DiscoveryRepository(config);
        
        // try a discovery request
        api.retrieveOrganizations()
            .then(() => {
                // success, add it to connection window
                vscode.commands.executeCommand(cs.dynamics.controls.dynamicsTreeView.addConnection, config)
                .then(() => {
                    this.dispose();
                });
            })
            .catch(err => {
                this.panel.webview.postMessage({ command: 'error', message: err.message });
                console.log(err);
            });
    }
    
    onDidReceiveMessage(instance: ConnectionView, message: any): vscode.Event<any> {
        switch (message.command) {
            case 'save':
                instance.save(message.settings);
                return;
        }
    }

    setInitialState(config?: DynamicsWebApi.Config) {
        if (config) {
            this.panel.webview.postMessage({ command: 'load', message: config });
        }
    }
}