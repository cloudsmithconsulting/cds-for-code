import * as vscode from 'vscode';
import * as path from 'path';
import * as _ from 'lodash';
import * as WebSocket from "ws";
import WebviewBridge from './WebviewBridge';
import { LocalBridge } from './LocalBridge';
import { WebSocketBridge } from './WebSocketBridge';
import { ViewRenderer } from './ViewRenderer';
import ExtensionContext from '../ExtensionContext';
import Dictionary from '../types/Dictionary';

export enum BridgeCommunicationMethod {
	None,
	Ipc,
	WebSockets
}

export interface IViewOptions {
	preserveFocus?: boolean;
	title: string;
	type: string;
	icon?: string;
	alwaysNew?: boolean;
	bridge?: BridgeCommunicationMethod;
	channel?: WebSocket;
	onReady?: (view: any) => void;
}

export type ViewConstructor<T extends View> = new (panel: vscode.WebviewPanel, options: IViewOptions) => T;

export abstract class View {
    /**
	 * Track the currently panel. Only allow a single panel to exist at a time.
	 */
	static openViews: { [key: string]: View } = {};

	static show<T extends View>(constructor: ViewConstructor<T>, options: IViewOptions): T {
		const column = vscode.window.activeTextEditor
			? vscode.window.activeTextEditor.viewColumn
			: undefined;

		// If we already have a panel, show it.
		if (Object.keys(this.openViews).length > 0) {
			if (View.openViews[options.type]) {
				const result = View.openViews[options.type];
				result.panel.reveal(column);

				return <T>result;
			}
		}

		const panel = vscode.window.createWebviewPanel(
			options.type,
			options.title,
			{ viewColumn: column || vscode.ViewColumn.One, preserveFocus: options.preserveFocus || true },
			{
				// How dare you.  You know what you did.
				retainContextWhenHidden: true,

				// Enable javascript in the webview
				enableScripts: true,

				// And restrict the webview to only loading content from our extension's `resources` directory, or the extension itself, or node_modules.				
				localResourceRoots: [
					vscode.Uri.file(path.join(ExtensionContext.Instance.extensionPath, 'resources')),
					vscode.Uri.file(path.join(ExtensionContext.Instance.extensionPath, 'node_modules'))
				]
			}
		);

		// do some icon path fixing here
		let iconPath = options.icon;
		if (iconPath && iconPath.startsWith('./')) {
			iconPath = iconPath.substr(2);
		}
		else if (iconPath && iconPath.startsWith('/')) {
			iconPath = iconPath.substr(1);
		}

		const arrIconPath = iconPath ? iconPath.split('/') : [];
		panel.iconPath = vscode.Uri.file(path.join(ExtensionContext.Instance.extensionPath, ...arrIconPath));

		// Render the view now.
		const result: T = new constructor(panel, options);

		// cache this
		if (typeof options.alwaysNew !== 'undefined' && !options.alwaysNew) {
			View.openViews[options.type] = result;
		}

		return result;
	}

	readonly bridge: WebviewBridge | undefined;
	readonly options: IViewOptions;

	protected disposables: vscode.Disposable[] = [];
	protected readonly renderer: ViewRenderer;

	abstract construct(renderer: ViewRenderer): string;
	abstract get commands(): Dictionary<string, Function>;

	private readonly panel: vscode.WebviewPanel;

	private _onDidClose: vscode.EventEmitter<View> = new vscode.EventEmitter();
	private _onDidReceiveMessage: vscode.EventEmitter<any> = new vscode.EventEmitter();
	private _onReady: vscode.EventEmitter<View> = new vscode.EventEmitter();

	onDidClose: vscode.Event<View> = this._onDidClose.event;
	onDidReceiveMessage: vscode.Event<any> = this._onDidReceiveMessage.event;
	onReady: vscode.Event<View> = this._onReady.event;

	constructor(panel: vscode.WebviewPanel, options: IViewOptions) {
		this.options = options;
		this.panel = panel;
		this.renderer = new ViewRenderer(this);

		if (this.options.bridge && this.options.bridge === BridgeCommunicationMethod.Ipc) {
			this.bridge = new LocalBridge(this.panel.webview);
		} else if (this.options.bridge && this.options.bridge === BridgeCommunicationMethod.WebSockets && this.options.channel) {
			this.bridge = new WebSocketBridge(this.options.channel);
		}

		// Set the webview's initial html content
		this.update();

		// Listen for when the panel is disposed
		// This happens when the user closes the panel or when the panel is closed programatically
		this.panel.onDidDispose(() => this.dispose(), null, this.disposables);

		// Update the content based on view changes
		this.panel.onDidChangeViewState(e => {
				if (this.panel.visible) {
					this.update();
				}
			},
			null,
			this.disposables
		);

		// Handle messages from the webview
		this.panel.webview.onDidReceiveMessage(m => {
			if (m && this.processSystemMessages(m)) {
				return;
			}

			if (m && m.command && typeof m.command === 'string' && this.commands && this.commands.containsKey(m.command)) {
				this.commands[m.command](m);
			}

			// give the message to the event handler
			this.onDidReceiveMessage(m);
		});
	}

	asWebviewUri(localResource: vscode.Uri): vscode.Uri {
		return this.panel.webview.asWebviewUri(localResource);
	}

	get cspSource(): string {
		return this.panel.webview.cspSource;
	}

	dispose() {
		delete View.openViews[this.options.type];

		while (this.disposables.length) {
			const x = this.disposables.pop();
			
			if (x) {
				x.dispose();
			}
		}

		// Clean up our resources
		if (this.panel) {
			this.panel.dispose();
		}
	}

	postMessage(message:any): Thenable<boolean> {
		return this.panel.webview.postMessage(message);
	}

	private processSystemMessages(message: any): boolean {
		if (message.command && message.command.toString().indexOf(":") > -1) {
			const pairs = message.command.toLowerCase().split(":");

			if (pairs[0] === "system") {
				switch (pairs[1]) {
					case "closewindow":
						this.dispose();
						break;
					case "ready":
						if (this.options && this.options.onReady) {
							this.options.onReady(this);
						}

						this._onReady.fire(this);
						break;
				}

				return true;
			}

			return false;
		}
	}

	private update() {
		this.panel.title = this.options.title;
		this.panel.webview.html = this.construct(this.renderer);
	}
}