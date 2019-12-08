import * as vscode from 'vscode';
import * as path from 'path';
import * as _ from 'lodash';
import * as WebSocket from "ws";
import WebviewBridge from './WebviewBridge';
import { LocalBridge } from './LocalBridge';
import { WebSocketBridge } from './WebSocketBridge';
import { ViewRenderer } from './ViewRenderer';

export enum BridgeCommunicationMethod {
	None,
	Ipc,
	WebSockets
}

export interface IViewOptions {
	preserveFocus?: boolean;
	extensionPath: string;
	viewTitle: string;
	viewType: string;
	iconPath?: string;
	bridgeType?: BridgeCommunicationMethod;
	bridgeChannel?: WebSocket;
}

export abstract class View {
    /**
	 * Track the currently panel. Only allow a single panel to exist at a time.
	 */
	static openViews: { [key: string]: View } = {};

	static show<T extends View>(
		viewInstance: new (viewOptions: IViewOptions, panel: vscode.WebviewPanel) => T,
		options: IViewOptions, alwaysNew?: boolean): T {

		const column = vscode.window.activeTextEditor
			? vscode.window.activeTextEditor.viewColumn
			: undefined;

		// If we already have a panel, show it.
		if (Object.keys(this.openViews).length > 0) {
			if (View.openViews[options.viewType]) {
				const result = View.openViews[options.viewType];
				result.panel.reveal(column);

				return <T>result;
			}
		}

		const extensionPath = options.extensionPath;

		// Otherwise, create a new panel.
		const panel = vscode.window.createWebviewPanel(
			options.viewType,
			options.viewTitle,
			{ viewColumn: column || vscode.ViewColumn.One, preserveFocus: options.preserveFocus || true },
			{
				// Required for our more complex views.
				retainContextWhenHidden: true,

				// Enable javascript in the webview
				enableScripts: true,

				// And restrict the webview to only loading content from our extension's `resources` directory, or the extension itself, or node_modules.				
				localResourceRoots: [
					vscode.Uri.file(path.join(extensionPath, 'resources')),
					//TODO: replace this with grunt task to copy files.
					vscode.Uri.file(path.join(extensionPath, 'out')),
					vscode.Uri.file(path.join(extensionPath, 'node_modules'))
				]
			}
		);

		// do some icon path fixing here
		let iconPath = options.iconPath;
		if (iconPath && iconPath.startsWith('./')) {
			iconPath = iconPath.substr(2);
		}
		else if (iconPath && iconPath.startsWith('/')) {
			iconPath = iconPath.substr(1);
		}

		const arrIconPath = iconPath ? iconPath.split('/') : [];
		panel.iconPath = vscode.Uri.file(path.join(extensionPath, ...arrIconPath));

		// Render the view now.
		const result: T = new viewInstance(options, panel);

		// cache this
		if (!alwaysNew) {
			View.openViews[options.viewType] = result;
		}

		return result;
	}

	readonly bridge: WebviewBridge | undefined;
	readonly extensionPath: string;
	readonly panel: vscode.WebviewPanel;
	readonly options: IViewOptions;

	protected _disposables: vscode.Disposable[] = [];
	protected readonly renderer: ViewRenderer;

	abstract construct(renderer: ViewRenderer): string;

	abstract onDidReceiveMessage(instance: View, message: any): vscode.Event<any>;

	constructor(viewOptions: IViewOptions, panel: vscode.WebviewPanel) {
		this.options = viewOptions;
		this.panel = panel;
		this.renderer = new ViewRenderer(this);
		this.extensionPath = viewOptions.extensionPath;

		if (this.options.bridgeType && this.options.bridgeType === BridgeCommunicationMethod.Ipc) {
			this.bridge = new LocalBridge(this.panel.webview);
		} else if (this.options.bridgeType && this.options.bridgeType === BridgeCommunicationMethod.WebSockets && this.options.bridgeChannel) {
			this.bridge = new WebSocketBridge(this.options.bridgeChannel);
		}

		// Set the webview's initial html content
		this.update();

		// Listen for when the panel is disposed
		// This happens when the user closes the panel or when the panel is closed programatically
		this.panel.onDidDispose(() => this.dispose(), null, this._disposables);

		// Update the content based on view changes
		this.panel.onDidChangeViewState(e => {
				if (this.panel.visible) {
					this.update();
				}
			},
			null,
			this._disposables
		);

		// Handle messages from the webview
		this.panel.webview.onDidReceiveMessage(m => {
			if (m && this.processSystemMessages(m)) {
				return;
			}

			// give the message to the event handler
			this.onDidReceiveMessage(this, m);
		});
	}

	dispose() {
		delete View.openViews[this.options.viewType];

		while (this._disposables.length) {
			const x = this._disposables.pop();
			if (x) {
				x.dispose();
			}
		}

		// Clean up our resources
		if (this.panel) {
			this.panel.dispose();
		}
	}

	private processSystemMessages(message: any): boolean {
		if (message.command && message.command.toString().indexOf(":") > -1) {
			const pairs = message.command.toLower().split(":");

			if (pairs[0] === "system") {
				switch (pairs[1]) {
					case "closeWindow":
						this.dispose();
						break;
				}

				return true;
			}

			return false;
		}
	}

	private update() {
		this.panel.title = this.options.viewTitle;
		this.panel.webview.html = this.construct(this.renderer);
	}
}