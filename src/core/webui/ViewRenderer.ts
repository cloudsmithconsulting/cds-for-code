import * as vscode from 'vscode';
import * as FileSystem from '../io/FileSystem';
import * as path from 'path';
import * as _ from 'lodash';
import Dictionary from '../types/Dictionary';
import { View, BridgeCommunicationMethod } from './View';

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
    
    private addFrameworkScript(scriptName: string) {
		this._scripts.insert(0, scriptName, this.getFileUri('node_modules', scriptName));
	}
    
    private addFrameworkStylesheet(cssName: string) {
		this._styleSheets.insert(0, cssName, this.getFileUri('node_modules', cssName));
	}
    
    addStyleSheet(styleSheetName: string) {
		this._styleSheets.add(styleSheetName, this.getFileUri('resources', 'styles', styleSheetName));
	}
	
    private getFileUri(...paths: string[]): vscode.Uri {
		const pathOnDisk = vscode.Uri.file(path.join(this.view.extensionPath, ...paths));
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
    
    renderFile(webviewFileName: string): string {
		// get the file path
		const pathOnDisk = path.join(this.view.extensionPath, 'resources', 'webviews', webviewFileName);
    
        // read file contents from disk
		const fileHtml = FileSystem.readFileSync(pathOnDisk).toString();
    
        // use custom delimiter #{ }
		_.templateSettings.interpolate = /#{([\s\S]+?)}/g;
    
        // compile the template
		const compiled = _.template(fileHtml);
    
        // create a base viewModel
		const viewModel = {
			viewTitle: this.view.options.title,
			images: {}
		};
    
        // add images to viewModel
		Object.keys(this._images).forEach(key => {
			//viewModel.images.push(this._images[key]);
			(<any>viewModel.images)[key] = this._images.get(key);
		});
    
        const result = compiled(viewModel);
    
        // return output
		return this.render(result);
	}
    
    render(htmlParial: string): string {
		// add some default scripts
		this.insertScriptAt(0, 'main.js');
		this.insertScriptAt(0, "cs.vscode.webviews.js");
    
        // these are framework scripts hosted out of node_modules
		this.addFrameworkScript('lodash/lodash.min.js');
		this.addFrameworkScript('@iconify/iconify/dist/iconify.min.js');
		this.addFrameworkScript('mustache/mustache.min.js');
		this.addFrameworkScript('jquery/dist/jquery.min.js');
    
        let cssHtml: string = '';
		let scriptHtml: string = '';
		let bridgeHtml: string = '';
    
        this._styleSheets.values.forEach(uri => {
			cssHtml += `<link rel="stylesheet" type="text/css" href="${uri}" />`;
		});
    
        this._scripts.values.forEach(uri => {
			scriptHtml += `<script src="${uri}"></script>`;
		});
    
        return `<!DOCTYPE html>
<html lang="en">
<head>
	<meta charset="UTF-8">
	<!--
	Use a content security policy to only allow loading images from https or from our extension directory,
	and only allow scripts that have a specific nonce.
	-->
	<meta http-equiv="Content-Security-Policy" 
		content="default-src 'none'; 
		img-src ${this.view.cspSource} https:; 
		style-src 'self' 'unsafe-inline' ${this.view.cspSource}; 
		script-src 'unsafe-inline' ${this.view.cspSource} https://api.iconify.design;">
	<meta name="viewport" content="width=device-width, initial-scale=1.0">
	${cssHtml}
	<title>${this.view.options.title}</title>
</head>
<body>
	<div class="container">
		${htmlParial}
	</div>
	${bridgeHtml}
	${scriptHtml}
</body>
</html>`;
	}
}