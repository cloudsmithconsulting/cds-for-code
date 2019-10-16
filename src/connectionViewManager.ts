import * as vscode from 'vscode';
import DiscoveryRepository from './discoveryRepository';
import { View } from './view';
import * as cs from './cs';

export default class ConnectionViewManager {
	public static wireUpCommands(context: vscode.ExtensionContext) {
        context.subscriptions.push(

            vscode.commands.registerCommand(cs.dynamics.controls.treeView.addEntry, async () => { // Match name of command to package.json command
                // Run command code
                //const viewFileUri = vscode.Uri.file(`${context.extensionPath}/resources/webViews/connectionView.html`);
                ConnectionView.createOrShow<ConnectionView>(ConnectionView, {
                    extensionPath: context.extensionPath,
                    viewTitle: 'New Connection - Dynamics 365 CE',
                    viewType: cs.dynamics.views.connectionView
                });
            }) // <-- no semi-colon, comma starts next command registration
        );
    }
}

class ConnectionView extends View {
    public getHtmlForWebview(): string {
        const scriptUri = this.getFileUri('resources', 'scripts', 'connectionView.js');
        const cssUri = this.getFileUri('resources', 'styles', 'webviewStyles.css');
        const imgUri = this.getFileUri('resources', 'images', 'cloudsmith-logo-only-50px.png');
        const nonce = this.getNonce();
/*
        public getHtmlForWebView(options: ViewOptions): string
        {
            options.addStylesheet('resources', 'style.css')

            return ``;
        }
*/
        return `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <!--
    Use a content security policy to only allow loading images from https or from our extension directory,
    and only allow scripts that have a specific nonce.
    -->
    <meta http-equiv="Content-Security-Policy" content="default-src 'none'; img-src ${this._panel.webview.cspSource} https:; script-src 'nonce-${nonce}'; style-src 'nonce-${nonce}';">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <link rel="stylesheet" type="text/css" href="${cssUri}" nonce="${nonce}">
    <title>${this._viewOptions.viewTitle}</title>
</head>
<body>
    <div class="container">
        <img class="branding" src="${imgUri}" />
        
        <h1>
            ${this._viewOptions.viewTitle}
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
    </div>
    <script nonce="${nonce}" src="${scriptUri}"></script>
</body>
</html>`;
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
                this._panel.webview.postMessage({ command: 'connectionError', message: err.message });
            });
    }
}