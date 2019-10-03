import * as vscode from 'vscode';
import * as path from 'path';

/**
 * Manages connectionView webview panels
 */
export default class ConnectionView {
	/**
	 * Track the currently panel. Only allow a single panel to exist at a time.
	 */
	public static currentPanel: ConnectionView | undefined;

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
		if (ConnectionView.currentPanel) {
			ConnectionView.currentPanel._panel.reveal(column);
			return;
		}

		// Otherwise, create a new panel.
		const panel = vscode.window.createWebviewPanel(
			ConnectionView.viewType,
			ConnectionView.viewTitle,
			column || vscode.ViewColumn.One,
			{
				// Enable javascript in the webview
				enableScripts: true,

				// And restrict the webview to only loading content from our extension's `resources` directory.
				localResourceRoots: [vscode.Uri.file(path.join(extensionPath, 'resources'))]
			}
		);

		ConnectionView.currentPanel = new ConnectionView(panel, extensionPath);
	}

	public static revive(panel: vscode.WebviewPanel, extensionPath: string) {
		ConnectionView.currentPanel = new ConnectionView(panel, extensionPath);
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
					case 'alert':
						vscode.window.showErrorMessage(message.text);
						return;
				}
			},
			null,
			this._disposables
		);
	}

	// public doRefactor() {
	// 	// Send a message to the webview webview.
	// 	// You can send any JSON serializable data.
	// 	this._panel.webview.postMessage({ command: 'refactor' });
	// }

	public dispose() {
		ConnectionView.currentPanel = undefined;

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
        this._panel.title = ConnectionView.viewTitle;
	    this._panel.webview.html = this._getHtmlForWebview(webview);
	}

	private _getHtmlForWebview(webview: vscode.Webview) {
        // Local path to main script run in the webview
		const scriptPathOnDisk = vscode.Uri.file(
			path.join(this._extensionPath, 'resources', 'webViewClient.js')
        );
        
		// The uri we use to load this script in the webview
        const scriptUri = webview.asWebviewUri(scriptPathOnDisk);
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
    <meta http-equiv="Content-Security-Policy" content="default-src 'none'; img-src ${webview.cspSource} https:; script-src 'nonce-${nonce}';">
	<meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>CloudSmith - Dynamics 365 Connection</title>
</head>
<body>
    <h1>Connect to Dynamics 365</h1>
    <form>
        <table cellpadding="4" cellspacing="0">
            <tr>
                <td>
                    <label for="Server">
                        <strong>Server</strong>
                    </label>
                </td>
                <td>
                    <input type="text" id="Server" name="Server">
                </td>
            </tr>
            <tr>
                <td>
                    <label for="Port">
                        <strong>Port</strong>
                    </label>
                </td>
                <td>
                    <input type="text" id="Port" name="Port">
                </td>
            </tr>
            <tr>
                <td>
                    <label for="UseSsl">
                        <strong>Use SSL</strong>
                    </label>
                </td>
                <td>
                    <input type="checkbox" id="UseSsl" name="UseSsl" value="true">
                </td>
            </tr>
            <tr>
                <td>
                    <label for="Domain">
                        <strong>Domain</strong>
                    </label>
                </td>
                <td>
                    <input type="text" id="Domain" name="Domain">
                </td>
            </tr>
            <tr>
                <td>
                    <label for="Username">
                        <strong>Username</strong>
                    </label>
                </td>
                <td>
                    <input type="text" id="Username" name="Username">
                </td>
            </tr>
            <tr>
                <td>
                    <label for="Password">
                        <strong>Password</strong>
                    </label>
                </td>
                <td>
                    <input type="password" id="Password" name="Password">
                </td>
            </tr>
            <tr>
                <td colspan="2">
                    <button type="submit">Test Connection</button>
                </td>
            </tr>
        </table>
    </form>
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