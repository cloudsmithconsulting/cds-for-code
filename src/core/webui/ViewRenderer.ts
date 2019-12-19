import * as vscode from 'vscode';
import * as FileSystem from '../io/FileSystem';
import * as path from 'path';
import * as _ from 'lodash';
import Dictionary from '../types/Dictionary';
import { View } from './View';
import ExtensionContext from '../ExtensionContext';
import Quickly from '../Quickly';
import opn from 'opn';

export class ViewRenderer {
	private readonly view: View;
	private _images: Dictionary<string, vscode.Uri> = new Dictionary();
	private _scripts: Dictionary<string, vscode.Uri> = new Dictionary();
    private _styleSheets: Dictionary<string, vscode.Uri> = new Dictionary();
    
	readonly nonce: string;
    
    constructor(view: View) {
		this.nonce = this.getNonce();
		this.view = view;
	}
    
    addImage(imageName: string) {
		this._images.add(imageName, this.getFileUri('resources', 'images', imageName));
	}
    
    addScript(scriptName: string) {
		this._scripts.add(scriptName, this.getFileUri('resources', 'scripts', scriptName));
	}
    
    private insertScriptAt(index: number, scriptName: string) {
		this._scripts.insert(0, scriptName, this.getFileUri('resources', 'scripts', scriptName));
	}
    
    addFrameworkScript(scriptName: string) {
		this._scripts.add(scriptName, this.getFileUri('node_modules', scriptName));
	}

	insertFrameworkScript(scriptName: string) {
		this._scripts.insert(0, scriptName, this.getFileUri('node_modules', scriptName));
	}

    addFrameworkStylesheet(cssName: string) {
		this._styleSheets.add(cssName, this.getFileUri('node_modules', cssName));
	}

	insertFrameworkStylesheet(cssName: string) {
		this._styleSheets.insert(0, cssName, this.getFileUri('node_modules', cssName));
	}

    addStyleSheet(styleSheetName: string) {
		this._styleSheets.add(styleSheetName, this.getFileUri('resources', 'styles', styleSheetName));
	}
	
    private getFileUri(...paths: string[]): vscode.Uri {
		const pathOnDisk = vscode.Uri.file(path.join(ExtensionContext.Instance.extensionPath, ...paths));
		return this.view.asWebviewUri(pathOnDisk);
	}
    
    getImageUri(imageName: string): vscode.Uri {
		return this._images.get(imageName);
	}
    
    private getNonce(): string {
		let result = '';
		const possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    
        for (let i = 0; i < 32; i++) {
			result += possible.charAt(Math.floor(Math.random() * possible.length));
		}
    
        return result;
	}
    
    renderFile(webviewFileName: string, useCsp?: boolean): string {
		const pathOnDisk = path.join(ExtensionContext.Instance.extensionPath, 'resources', 'webviews', webviewFileName);
		const fileHtml = FileSystem.readFileSync(pathOnDisk).toString();
    
		_.templateSettings.interpolate = /#{([\s\S]+?)}/g;
    
		const compiled = _.template(fileHtml);
		const viewModel = {
			viewTitle: this.view.options.title,
			images: {}
		};
	
		if (this._images && this._images.length > 0) {
			Object.keys(this._images).forEach(key => {
				//viewModel.images.push(this._images[key]);
				(<any>viewModel.images)[key] = this._images.get(key);
			});
		}
    
        return this.render(compiled(viewModel), useCsp);
	}
    
    render(htmlParial: string, useCsp?: boolean): string {
		// add some default scripts
		this.insertScriptAt(0, 'main.js');
		this.insertScriptAt(0, "cs.vscode.webviews.js");
    
        // these are framework scripts hosted out of node_modules
		this.insertFrameworkScript('lodash/lodash.min.js');
		this.insertFrameworkScript('@iconify/iconify/dist/iconify.min.js');
		this.insertFrameworkScript('mustache/mustache.min.js');
		this.insertFrameworkScript('jquery/dist/jquery.min.js');
    
        let cssHtml: string = '';
		let scriptHtml: string = '';
	
		if (this._styleSheets.values && this._styleSheets.values.length > 0) {
			this._styleSheets.values.forEach(uri => {
				cssHtml += `<link rel="stylesheet" type="text/css" href="${uri}" />`;
			});
		}

		if (this._scripts.values && this._scripts.values.length > 0) {
			this._scripts.values.forEach(uri => {
				scriptHtml += `<script src="${uri}"></script>`;
			});
		}

		useCsp = typeof useCsp !== "undefined" ? useCsp : typeof this.view.options.useCsp !== "undefined" ? this.view.options.useCsp : true;

		if (!useCsp) {
			Quickly.warn("This web view does not use a content security policy.  Be careful when entering sensitive information into this form.", undefined, "Learn More", () => opn('https://developer.mozilla.org/en-US/docs/Web/HTTP/CSP'));
		}

		const cspDeclaration = useCsp ? `<meta http-equiv="Content-Security-Policy" 
		content="default-src 'none'; 
		img-src ${this.view.cspSource} https:; 
		style-src 'self' 'unsafe-inline' ${this.view.cspSource}; 
		script-src 'unsafe-inline' 'unsafe-eval' ${this.view.cspSource} https://api.iconify.design;">` : "";

        return `<!DOCTYPE html>
<html lang="en">
<head>
	<meta charset="UTF-8">
	<!--
	Use a content security policy to only allow loading images from https or from our extension directory,
	and only allow scripts that have a specific nonce.
	-->
	${cspDeclaration}
	<meta name="viewport" content="width=device-width, initial-scale=1.0">
	${cssHtml}
	<title>${this.view.options.title}</title>
</head>
<body>
	<div class="main-container">
		${htmlParial}
	</div>
	${scriptHtml}
</body>
</html>`;
	}
}