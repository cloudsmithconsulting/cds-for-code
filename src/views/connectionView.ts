import * as vscode from 'vscode';
import DiscoveryRepository from '../repositories/discoveryRepository';
import { View, ViewRenderer } from '../view';
import * as cs from '../cs';
import IWireUpCommands from '../wireUpCommand';
import { DynamicsWebApi } from '../api/Types';

export default class ConnectionViewManager implements IWireUpCommands {
	public wireUpCommands(context: vscode.ExtensionContext, config?:vscode.WorkspaceConfiguration) {
        context.subscriptions.push(

            vscode.commands.registerCommand(cs.dynamics.controls.treeView.openConnection, async (config?: DynamicsWebApi.Config) => { // Match name of command to package.json command
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
    public getHtmlForWebview(viewRenderer: ViewRenderer): string {
        // add script and css assets
        viewRenderer.addScript('connectionView.js');
        viewRenderer.addStyleSheet('webviewStyles.css');

        // add image assets
        viewRenderer.addImage('cloudsmith-logo-only-50px.png');

        // return rendered html
        return viewRenderer.renderPartialFile('connection.html');

//         return viewRenderer.renderHtml(`
// <img class="branding" src="${viewRenderer.getImageUri('cloudsmith-logo-only-50px.png')}" alt="CloudSmith Conulting" />

// <h1 id="title">
//     ${this.viewOptions.viewTitle}
// </h1>

// <blockquote class="panel_error" id="errorPanel" hidden>
//     <div class="panel__text">
//         <h4>Oops! Slight problem</h4>
//         <span id="errorMessage"></span>
//     </div>
// </blockquote>

// <input type="hidden" id="Id" name="Id" value="" />

// <div class="field field--checkbox">
//     <label class="field__label" for="AuthType1">
//         Windows
//     </label>
//     <input type="radio" class="field__input" id="AuthType1" name="AuthType" value="1" />
//     <label class="field__label" for="AuthType2">
//         OAuth
//     </label>
//     <input type="radio" class="field__input" id="AuthType2" name="AuthType" value="2" checked="checked" />
// </div>
// <div class="field">
//     <label class="field__label" for="WebApiVersion">
//         Web API Version
//     </label>
//     <select id="WebApiVersion" name="WebApiVersion" class="field__input">
//         <option>v8.0</option>
//         <option>v8.1</option>
//         <option>v8.2</option>
//         <option>v9.0</option>
//         <option>v9.1</option>
//     </select>
// </div>
// <div class="field">
//     <label class="field__label" for="Name">
//         Friendly Name
//     </label>
//     <input type="text" class="field__input" id="Name" name="Name" />
// </div>
// <div class="field">
//     <label class="field__label" for="ServerUrl">
//         Server URL
//     </label>
//     <input type="text" class="field__input" id="ServerUrl" name="ServerUrl" />
// </div>
// <div class="field">
//     <label class="field__label" for="Domain">
//         Domain
//     </label>
//     <input type="text" class="field__input" id="Domain" name="Domain" />
// </div>
// <div id="accessTokenField" class="field">
//     <label class="field__label" for="AccessToken">
//         Access Token
//     </label>
//     <input type="text" class="field__input" id="AccessToken" name="AccessToken" />
// </div>
// <div class="field">
//     <label class="field__label" for="Username">
//         Username
//     </label>
//     <input type="text" class="field__input" id="Username" name="Username" />
// </div>
// <div class="field">
//     <label class="field__label" for="Password">
//         Password
//     </label>
//     <input type="password" class="field__input" id="Password" name="Password" />
// </div>
// <div class="field">
//     <button id="submitButton" class="button button--primary">Add Connection</button>
// </div>
//         `);
    }    
    
    public onDidReceiveMessage(instance: ConnectionView, message: any): vscode.Event<any> {
        switch (message.command) {
            case 'createConnection':
                instance.testConnection(message.settings);
                return;
        }
    }

    public setInitialState(config?: DynamicsWebApi.Config) {
        if (config) {
            this.panel.webview.postMessage({ command: 'connectionEdit', message: config });
        }
    }

    private testConnection(config: DynamicsWebApi.Config) {
        // first clean up the config, if we have an access token get rid of username and password
        if (config.accessToken && config.accessToken.length > 0) {
            config.username = null;
            config.password = null;
        }
        
        const api = new DiscoveryRepository(config);
        
        // try a discovery request
        api.retrieveOrganizations()
            .then(() => {
                // success, add it to connection window
                vscode.commands.executeCommand(cs.dynamics.controls.treeView.addConnection, config)
                .then(() => {
                    this.dispose();
                });
            })
            .catch(err => {
                this.panel.webview.postMessage({ command: 'connectionError', message: err.message });
            });
    }
}