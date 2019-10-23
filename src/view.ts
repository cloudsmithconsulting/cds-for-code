import * as vscode from 'vscode';
import * as fs from 'fs';
import * as path from 'path';
import * as _ from 'lodash';
import * as cs from './cs';
import ExtensionConfiguration from './helpers/ExtensionConfiguration';

export interface IViewOptions {
	extensionPath: string;
	viewTitle: string;
	viewType: string;
	iconPath?: string;
}

export class ViewRenderer {
	private readonly _view: View;
	private _images: { [key: string]: vscode.Uri } = {};
	private _scripts: { [key: string]: vscode.Uri } = {};
	private _styleSheets: { [key: string]: vscode.Uri } = {};

	public readonly nonce: string;

	constructor(view: View) {
		this.nonce = this.getNonce();
		this._view = view;
	}

	public addImage(imageName: string) {
		this._images[imageName] = this.getFileUri('resources', 'images', imageName);
	}

	public addScript(scriptName: string) {
		this._scripts[scriptName] = this.getFileUri('resources', 'scripts', scriptName);
	}

	public addStyleSheet(styleSheetName: string) {
		this._styleSheets[styleSheetName] = this.getFileUri('resources', 'styles', styleSheetName);
	}

	private getFileUri(...paths: string[]): vscode.Uri {
		const pathOnDisk = vscode.Uri.file(
			path.join(this._view.extensionPath, ...paths)
		);
		return this._view.panel.webview.asWebviewUri(pathOnDisk);
	}

	public getImageUri(imageName: string): vscode.Uri {
		return this._images[imageName];
	}

	private getNonce(): string {
		let result = '';
		const possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
		for (let i = 0; i < 32; i++) {
			result += possible.charAt(Math.floor(Math.random() * possible.length));
		}
		return result;
	}

	public renderPartialFile(webviewFileName: string) : string {
		// get the file path
		const pathOnDisk = path.join(this._view.extensionPath, 'resources', 'webviews', webviewFileName);
		// read file contents from disk
		const fileHtml = fs.readFileSync(pathOnDisk).toString();
		// use custom delimiter ${ }
		const regex = ExtensionConfiguration.getConfigurationValue<string>(cs.dynamics.configuration.templates.placeholderRegExp);
		_.templateSettings.interpolate = new RegExp(regex);
		// compile the template
		const compiled = _.template(fileHtml);
		// create a base viewModel
		const viewModel = {
			viewTitle: this._view.viewOptions.viewTitle,
			images: { }
		};
		// add images to viewModel
		Object.keys(this._images).forEach(key => {
			//viewModel.images.push(this._images[key]);
			viewModel.images[key] = this._images[key];
		});
		const result = compiled(viewModel);
		// return output
		return this.renderHtml(result);
	}

	public renderHtml(htmlParial: string): string {
		let cssHtml: string = '';
		Object.keys(this._styleSheets).forEach(key => {
			cssHtml += `<link rel="stylesheet" type="text/css" href="${this._styleSheets[key]}" nonce="${this.nonce}">`;
		});
		
		let scriptHtml: string = '';
		Object.keys(this._scripts).forEach(key => {
			scriptHtml += `<script src="${this._scripts[key]}" nonce="${this.nonce}"></script>`;
		});

		return `<!DOCTYPE html>
<html lang="en">
<head>
	<meta charset="UTF-8">
	<!--
	Use a content security policy to only allow loading images from https or from our extension directory,
	and only allow scripts that have a specific nonce.
	-->
	<meta http-equiv="Content-Security-Policy" content="default-src 'none'; img-src ${this._view.panel.webview.cspSource} https:; style-src ${this._view.panel.webview.cspSource}; script-src 'nonce-${this.nonce}';">
	<meta name="viewport" content="width=device-width, initial-scale=1.0">
	${cssHtml}
	<title>${this._view.viewOptions.viewTitle}</title>
</head>
<body>
	<div class="container">
		${htmlParial}
	</div>
	${scriptHtml}
</body>
</html>`;
	}
}

export abstract class View {
    /**
	 * Track the currently panel. Only allow a single panel to exist at a time.
	 */
	public static openPanels: { [key: string]: View } = {};

	public static createOrShow<T extends View>(
		c: new(viewOptions: IViewOptions, panel: vscode.WebviewPanel) => T, 
		viewOptions: IViewOptions): T {
		
		const column = vscode.window.activeTextEditor
			? vscode.window.activeTextEditor.viewColumn
			: undefined;

		// If we already have a panel, show it.
		if (Object.keys(this.openPanels).length > 0) {
			if (View.openPanels[viewOptions.viewType]) {
				const result = View.openPanels[viewOptions.viewType];
				result.panel.reveal(column);
				return <T>result;
			}
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

		// do some icon path fixing here
		let iconPath = viewOptions.iconPath;
		if (iconPath.startsWith('./')) {
			iconPath = iconPath.substr(2);
		}
		else if (iconPath.startsWith('/')) {
			iconPath = iconPath.substr(1);
		}
		const arrIconPath = iconPath.split('/');
		panel.iconPath = vscode.Uri.file(path.join(extensionPath, ...arrIconPath));

		const result: T = new c(viewOptions, panel);
		
		// cache this
		View.openPanels[viewOptions.viewType] = result;
		
		return result;
	}

	public readonly extensionPath: string;
	public readonly panel: vscode.WebviewPanel;
	public readonly viewOptions: IViewOptions;

	protected _disposables: vscode.Disposable[] = [];
	protected readonly _viewRenderer: ViewRenderer;

	abstract getHtmlForWebview(renderer: ViewRenderer): string;

	abstract onDidReceiveMessage(instance: View, message: any): vscode.Event<any>;

	public constructor(viewOptions: IViewOptions, panel: vscode.WebviewPanel) {
		this.viewOptions = viewOptions;
		this.panel = panel;
		this._viewRenderer = new ViewRenderer(this);
		this.extensionPath = viewOptions.extensionPath;

		// Set the webview's initial html content
		this._update();

		// Listen for when the panel is disposed
		// This happens when the user closes the panel or when the panel is closed programatically
		this.panel.onDidDispose(() => this.dispose(), null, this._disposables);

		// Update the content based on view changes
		this.panel.onDidChangeViewState(
			e => {
				if (this.panel.visible) {
					this._update();
				}
			},
			null,
			this._disposables
		);

		// Handle messages from the webview
		this.panel.webview.onDidReceiveMessage(m => this.onDidReceiveMessage(this, m));
	}

	public dispose() {
		// If we already have a panel, removie it from the open panels
		// const panelIndex =
		// 	View.openPanels.findIndex(
		// 		p => p.panel.title === this.viewOptions.viewTitle
		// 	);
		
		// if (panelIndex >= 0) {
		// 	View.openPanels.splice(panelIndex, 1);
		// }

		delete View.openPanels[this.viewOptions.viewType];

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

	private _update() {
		this.panel.title = this.viewOptions.viewTitle;
		this.panel.webview.html = this.getHtmlForWebview(this._viewRenderer);
	}
}