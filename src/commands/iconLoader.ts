import * as vscode from 'vscode';
import * as fs from 'fs';
import * as path from 'path';
import * as cs from '../cs';
import fetch from 'node-fetch';
import IWireUpCommands from '../wireUpCommand';
import Utilities from '../helpers/Utilities';
import { SSL_OP_CIPHER_SERVER_PREFERENCE } from 'constants';

enum ScriptedIconFormat {
	svg = ".svg",
	js = ".js",
	json = ".json"
}

class IconOptions {
	private _color:string;
	public height?:number;
	public width?:number;
	public name:string;
	public format:ScriptedIconFormat;
	public annotation:string;

	constructor(name:string, color?:string, annotation?:string, height:number = 0, width:number = 0, format:ScriptedIconFormat = ScriptedIconFormat.svg) {
		this.name = name;
		this.color = color;
		this.annotation = annotation;
		this.height = height;
		this.width = width;
		this.format = format;
	}

	get color(): string { return this._color; }
	set color(value:string) {
		if (value) { this._color = this.isColorCode(value) ? encodeURIComponent(value) : value; }
	}

	get url(): string {
		return `https://api.iconify.design/${this.name}${this.format.toString()}?${this.toQueryObject()}`;
	}	

	get outputfile(): string {
		return `${this.name}${this.annotation ? "." + this.annotation : ""}${this.format.toString()}`;
	}

	get mimeType(): string { 
		switch (this.format) {
			case ScriptedIconFormat.svg:
				return 'image/svg+xml';
			case ScriptedIconFormat.js:
				return 'application/javascript';
			case ScriptedIconFormat.json:
				return 'application/json';
		}

		return null;
	}

	private isColorCode(value:string):boolean {
		return value.match('^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$').length > 0;
	}

	private toQueryObject(): any {
		const querystring:any = { };

		if (!Utilities.IsNullOrEmpty(this._color)) { querystring["color"] = this._color; }
		if (this.height > 0) { querystring["height"] = this.height; }
		if (this.width > 0) { querystring["width"] = this.height; }

		return Utilities.ObjectToQuerystring(querystring);
	}
}

export default class IconLoader implements IWireUpCommands {
    public wireUpCommands(context: vscode.ExtensionContext, config?:vscode.WorkspaceConfiguration) {
		//GlobalState.Instance(context).PowerShellScriptVersion = null;

		// do this immediately
        IconLoader.runIconCheck(context);

        // now wire a command into the context
        context.subscriptions.push(
            vscode.commands.registerCommand(cs.dynamics.extension.downloadRequiredIcons, () => { // Downloads scripts from the Internet.
                IconLoader.runIconCheck(context, config);
            })
        );
    }

    private static runIconCheck(context: vscode.ExtensionContext, config?:vscode.WorkspaceConfiguration) {
		// get local storage folder
		const folder = path.join(context.globalStoragePath, "/icons/");
		
		// Checks to see if folder exist
		if (!fs.existsSync(folder)) {
			console.log(`[CloudSmith] Creating folder '${folder}' as it does not exist.`);
			fs.mkdirSync(folder);
		}

		// Array that stores script names
		const iconsToFetch:IconOptions[] = [
			new IconOptions("mdi-pencil-circle", "#C0C0C0", "dark"),
			new IconOptions("mdi-pencil-circle", "#303030", "light")
		];

		iconsToFetch.forEach(icon => {
			const localPath = path.join(folder, icon.outputfile);

			if (!fs.existsSync(localPath)) {
				IconLoader.downloadIcon(icon, localPath)
					.then(localPath => { vscode.window.showInformationMessage(`${icon.outputfile} downloaded`); return localPath; });
			}
		});
	}
			
	//TODO: remove dependence on fetch.
    private static downloadIcon(icon: IconOptions, localFilePath: string): Promise<string> {
        return fetch(icon.url, {
            method: 'get',
            headers: {
                'Accepts': icon.mimeType
			}
        })
		.then(res => res.text())
		.then(body => {
			fs.writeFileSync(localFilePath, body);

			return localFilePath;
        })
        .catch(err => {
			console.error(err);

			return "";
		});
	}
}