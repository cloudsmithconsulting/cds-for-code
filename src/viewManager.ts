import * as vscode from 'vscode';
import * as path from 'path';

export interface IViewOptions {
	extensionPath: string;
	viewTitle: string;
	viewType: string;
}

export abstract class ViewManager {
    /**
	 * Track the currently panel. Only allow a single panel to exist at a time.
	 */
	public static openPanels: ViewManager[] = new Array();

	public static createOrShow<T extends ViewManager>(
		c: new(viewOptions: IViewOptions, panel: vscode.WebviewPanel) => T, 
		viewOptions: IViewOptions): T {
		
			const column = vscode.window.activeTextEditor
			? vscode.window.activeTextEditor.viewColumn
			: undefined;

		// If we already have a panel, show it.
		const panelIndex =
			this.openPanels.findIndex(p => p._panel.title === viewOptions.viewTitle);

		if (panelIndex >= 0) {
			this.openPanels[panelIndex]._panel.reveal(column);
			return;
		}

		const extensionPath = viewOptions.extensionPath;

		// Otherwise, create a new panel.
		const panel = vscode.window.createWebviewPanel(
			viewOptions.viewType,
			viewOptions.viewTitle,
			column || vscode.ViewColumn.One,
			{
				// Enable javascript in the webview
				enableScripts: true,

				// And restrict the webview to only loading content from our extension's `resources` directory.
				localResourceRoots: [vscode.Uri.file(path.join(extensionPath, 'resources'))]
			}
		);

		const result: T = new c(viewOptions, panel);
		ViewManager.openPanels.push(
			result
		);

		return result;
	}

	public static getNonce(): string {
		let result = '';
		const possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
		for (let i = 0; i < 32; i++) {
			result += possible.charAt(Math.floor(Math.random() * possible.length));
		}
		return result;
	}

	protected readonly _viewOptions: IViewOptions;
	protected readonly _panel: vscode.WebviewPanel;
	protected _disposables: vscode.Disposable[] = [];
	protected readonly _extensionPath: string;

	abstract getHtmlForWebview(webview: vscode.Webview): string;

	abstract onDidReceiveMessage(instance: ViewManager, message: any): vscode.Event<any>;

	public constructor(viewOptions: IViewOptions, panel: vscode.WebviewPanel) {
		this._viewOptions = viewOptions;
		this._extensionPath = viewOptions.extensionPath;
		this._panel = panel;

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
		this._panel.webview.onDidReceiveMessage(m => this.onDidReceiveMessage(this, m));
	}

	public dispose() {
		// If we already have a panel, removie it from the open panels
		const panelIndex =
			ViewManager.openPanels.findIndex(
				p => p._panel.title === this._viewOptions.viewTitle
			);
		
		if (panelIndex >= 0) {
			ViewManager.openPanels.slice(panelIndex, 1);
		}

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
		this._panel.title = this._viewOptions.viewTitle;
		this._panel.webview.html = this.getHtmlForWebview(webview);
	}
}