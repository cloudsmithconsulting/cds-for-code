import * as vscode from 'vscode';
import * as path from 'path';
import { ConnectionOptions } from './Dynamics/DynamicsRequest';
import DiscoveryRepository from './discoveryRepository';

export default class ConnectionView {
	public static wireUpCommands(context: vscode.ExtensionContext) {
        context.subscriptions.push(

            vscode.commands.registerCommand('cloudSmith.addEntry', async () => { // Match name of command to package.json command
                // Run command code
                //const viewFileUri = vscode.Uri.file(`${context.extensionPath}/resources/webViews/connectionView.html`);
                ConnectionViewManager.createOrShow(context.extensionPath);
            }) // <-- no semi-colon, comma starts next command registration
        );
    }
}

class ConnectionViewManager {
	/**
	 * Track the currently panel. Only allow a single panel to exist at a time.
	 */
	public static currentPanel: ConnectionViewManager | undefined;

    public static readonly viewType = 'connectionView';
    public static readonly viewTitle = 'CloudSmith - Dynamics 365 Connection';

	private readonly _panel: vscode.WebviewPanel;
	private readonly _extensionPath: string;
	private _disposables: vscode.Disposable[] = [];

	public static createOrShow(extensionPath: string) {
		const column = vscode.window.activeTextEditor
			? vscode.window.activeTextEditor.viewColumn
			: undefined;

		// If we already have a panel, show it.
		if (ConnectionViewManager.currentPanel) {
			ConnectionViewManager.currentPanel._panel.reveal(column);
			return;
		}

		// Otherwise, create a new panel.
		const panel = vscode.window.createWebviewPanel(
			ConnectionViewManager.viewType,
			ConnectionViewManager.viewTitle,
			column || vscode.ViewColumn.One,
			{
				// Enable javascript in the webview
				enableScripts: true,

				// And restrict the webview to only loading content from our extension's `resources` directory.
				localResourceRoots: [vscode.Uri.file(path.join(extensionPath, 'resources'))]
			}
		);

		ConnectionViewManager.currentPanel = new ConnectionViewManager(panel, extensionPath);
	}

	public static revive(panel: vscode.WebviewPanel, extensionPath: string) {
		ConnectionViewManager.currentPanel = new ConnectionViewManager(panel, extensionPath);
    }
    
    private testConnection(connection: ConnectionOptions) {
        const api = new DiscoveryRepository(connection);
        // try a discovery request
        api.retrieveOrganizations()
            .then(() => {
                // success, add it to connection window
                vscode.commands.executeCommand('cloudSmith.addDynamicsConnection', connection)
                .then(() => {
                    this._panel.dispose();
                });
            })
            .catch(err => {
                this._panel.webview.postMessage({ command: 'connectionError', message: err.message });
            });
    }

	private constructor(panel: vscode.WebviewPanel, extensionPath: string) {
		this._panel = panel;
		this._extensionPath = extensionPath;

		// Set the webview's initial html content
		this._update();

		// Listen for when the panel is disposed
		// This happens when the user closes the panel or when the panel is closed programatically
		this._panel.onDidDispose(() => this.dispose(), null, this._disposables);

		// Update the content based on view changes
		this._panel.onDidChangeViewState(
			e => {
				if (this._panel.visible) {
					this._update();
				}
			},
			null,
			this._disposables
		);

		// Handle messages from the webview
		this._panel.webview.onDidReceiveMessage(
			message => {
				switch (message.command) {
					case 'createConnection':
                        this.testConnection(message.settings);
						return;
				}
			},
			null,
			this._disposables
		);
	}

	public dispose() {
		ConnectionViewManager.currentPanel = undefined;

		// Clean up our resources
		this._panel.dispose();

		while (this._disposables.length) {
			const x = this._disposables.pop();
			if (x) {
				x.dispose();
			}
		}
	}

	private _update() {
        const webview = this._panel.webview;
        this._panel.title = ConnectionViewManager.viewTitle;
	    this._panel.webview.html = this._getHtmlForWebview(webview);
	}

	private _getHtmlForWebview(webview: vscode.Webview) {
        // Local path to main script run in the webview
		const scriptPathOnDisk = vscode.Uri.file(
			path.join(this._extensionPath, 'resources', 'webViewClient.js')
        );
        
		// The uri we use to load this script in the webview
        const scriptUri = webview.asWebviewUri(scriptPathOnDisk);

        const cssPathOnDisk = vscode.Uri.file(
			path.join(this._extensionPath, 'resources', 'style.css')
        );
        
		// The uri we use to load this script in the webview
        const cssUri = webview.asWebviewUri(cssPathOnDisk);
        // Use a nonce to whitelist which scripts can be run
        const nonce = getNonce();

        return `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <!--
    Use a content security policy to only allow loading images from https or from our extension directory,
    and only allow scripts that have a specific nonce.
    -->
    <meta http-equiv="Content-Security-Policy" content="default-src 'none'; img-src ${webview.cspSource} https:; script-src 'nonce-${nonce}'; style-src 'nonce-${nonce}';">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <link rel="stylesheet" type="text/css" href="${cssUri}" nonce="${nonce}">
    <title>CloudSmith - Dynamics 365 Connection</title>
</head>
<body>
    <div class="container">
        <h1>Connect to Dynamics 365</h1>

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
                <option>v9.1</option>
                <option>v8.2</option>
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
            <label class="field__label" for="Workstation">
                Workstation
            </label>
            <input type="text" class="field__input" id="Workstation" name="Workstation" />
        </div>
        <div class="field">
            <label class="field__label" for="AccessToken">
                Access Token
            </label>
            <input type="text" class="field__input" id="AccessToken" name="AccessToken" />
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
}

function getNonce() {
	let text = '';
	const possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
	for (let i = 0; i < 32; i++) {
		text += possible.charAt(Math.floor(Math.random() * possible.length));
	}
	return text;
}