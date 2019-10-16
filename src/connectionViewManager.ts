import * as vscode from 'vscode';
import * as path from 'path';
import DiscoveryRepository from './discoveryRepository';
import { View, ViewRenderer } from './view';
import * as cs from './cs';

export default class ConnectionViewManager {
	public static wireUpCommands(context: vscode.ExtensionContext) {
        context.subscriptions.push(

            vscode.commands.registerCommand(cs.dynamics.controls.treeView.addEntry, async () => { // Match name of command to package.json command
                // Run command code
                //const viewFileUri = vscode.Uri.file(`${context.extensionPath}/resources/webViews/connectionView.html`);
                ConnectionView.createOrShow<ConnectionView>(ConnectionView, {
                    extensionPath: context.extensionPath,
                    iconPath: vscode.Uri.file(path.join(context.extensionPath, 'resources', 'images', 'cloudsmith-logo-only-50px.png')),
                    viewTitle: 'New Connection - Dynamics 365 CE',
                    viewType: cs.dynamics.views.connectionView
                });
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
        return viewRenderer.renderHtml(`
<img class="branding" src="${viewRenderer.getImageUri('cloudsmith-logo-only-50px.png')}" alt="CloudSmith Conulting" />

<h1>
    ${this.viewOptions.viewTitle}
</h1>

<blockquote class="panel_error" id="errorPanel" hidden>
    <div class="panel__text">
        <h4>Oops! Slight problem</h4>
        <span id="errorMessage">lalksdjflaksdjfloasjdflkaj</span>
    </div>
</blockquote>

<div class="field">
    <label class="field__label" for="WebApiVersion">
        Web API Version
    </label>
    <select id="WebApiVersion" name="WebApiVersion" class="field__input">
        <option>v8.0</option>
        <option>v8.1</option>
        <option>v8.2</option>
        <option>v9.0</option>
        <option>v9.1</option>
        
    </select>
</div>
<div class="field">
    <label class="field__label" for="authType">
        Auth Type
    </label>
    <select id="AuthType" name="AuthType" class="field__input">
        <option value="2">OAuth</option>
        <option value="1">Windows</option>
    </select>
</div>
<div class="field">
    <label class="field__label" for="ServerUrl">
        Server URL
    </label>
    <input type="text" class="field__input" id="ServerUrl" name="ServerUrl" />
</div>
<div class="field">
    <label class="field__label" for="Domain">
        Domain
    </label>
    <input type="text" class="field__input" id="Domain" name="Domain" />
</div>
<div class="field">
    <label class="field__label" for="Username">
        Username
    </label>
    <input type="text" class="field__input" id="Username" name="Username" />
</div>
<div class="field">
    <label class="field__label" for="Password">
        Password
    </label>
    <input type="password" class="field__input" id="Password" name="Password" />
</div>
<div class="field">
    <button id="submitButton" class="button button--primary">Add Connection</button>
</div>
        `);
    }    
    
    public onDidReceiveMessage(instance: ConnectionView, message: any): vscode.Event<any> {
        switch (message.command) {
            case 'createConnection':
                instance.testConnection(message.settings);
                return;
        }
    }

    private testConnection(config: DynamicsWebApi.Config) {
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