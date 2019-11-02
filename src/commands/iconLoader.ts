import * as vscode from 'vscode';
import * as fs from 'fs';
import * as path from 'path';
import * as cs from '../cs';
import fetch from 'node-fetch';
import IWireUpCommands from '../wireUpCommand';
import Utilities from '../helpers/Utilities';
import Dictionary from '../helpers/Dictionary';
import * as FileSystem from '../helpers/FileSystem';

export default class IconLoader implements IWireUpCommands {
    public wireUpCommands(context: vscode.ExtensionContext, config?:vscode.WorkspaceConfiguration) {
		//GlobalState.Instance(context).PowerShellScriptVersion = null;

		// do this immediately
        IconLoader.downloadIconTheme(context);

        // now wire a command into the context
        context.subscriptions.push(
            vscode.commands.registerCommand(cs.dynamics.extension.downloadRequiredIcons, () => { // Downloads scripts from the Internet.
                return IconLoader.downloadIconTheme(context, config);
            })
        );
    }

    private static downloadIconTheme(context: vscode.ExtensionContext, config?:vscode.WorkspaceConfiguration) {
		// get local storage folder
		const folder = path.join(context.extensionPath, "/resources/icons/");
		
		return ExtensionIconTheme.defaultTheme.download(folder);
	}
}

export class ExtensionIconTheme {
	public static readonly defaultTheme:ExtensionIconTheme = new ExtensionIconTheme(
		cs.dynamics.configuration.iconThemes.default, new Dictionary<ExtensionIcon, string>([
			{ key: "Connection", value: 'uil-cloud-data-connection' },
			{ key: "Organization", value: 'jam-building-f' },
			{ key: "Entities", value: "mdi-folder-outline" },
			{ key: "Attributes", value: "mdi-folder-outline" },
			{ key: "Views", value: "mdi-folder-outline" },
			{ key: "Forms", value: "mdi-folder-outline" },
			{ key: "Option Sets", value: "mdi-folder-outline" },
			{ key: "Processes", value: "mdi-folder-outline" },
			{ key: "Web Resources", value: "mdi-folder-outline" },
			{ key: "Plugins", value: "mdi-folder-outline" },
			{ key: "Solutions", value: "mdi-folder-outline" },
			{ key: "Folder", value: "mdi-folder-outline" },
			{ key: "Entity", value: 'fe-table'},
			{ key: "Attribute", value: 'whh-twocolumnsrightalt'},
			{ key: "View", value: "ic-baseline-pageview" },
			{ key: "Form", value: "dashicons-format-aside"},
			{ key: "Option Set", value: "ion-options-outline"},
			{ key: "Process", value: "vaadin-file-process" },
			{ key: "Web Resource", value: "fa-file-code-o" },
			{ key: "Plugin", value: "mdi-codepen" },
			{ key: "PluginStep", value: "uil-processor" },
			{ key: "PluginStepImage", value: "ic-baseline-image-search" },
			{ key: "PluginType", value: "fe-prototype" },
			{ key: "Solution", value: "ic-round-border-all" },
			{ key: "Add", value: "ic-baseline-add" },
			{ key: "Edit", value: "ic-twotone-edit" },
			{ key: "Refresh", value: "ic-round-refresh" },
			{ key: "Delete", value: "ic-twotone-delete" }, 
			{ key: "Save", value: "ic-twotone-save-alt" },
			{ key: "Cancel", value: "ic-twotone-cancel" },
		]), "black", "white");

	constructor(name:string, mappings:Dictionary<ExtensionIcon, string>, lightColor?:string, darkColor?:string) {
		this.name = name;
		this.mappings = mappings;
		this.lightColor = lightColor;
		this.darkColor = darkColor;
	}

	get icons():IconOptions[] {
		return ExtensionIconTheme.getIcons(this.mappings, this.lightColor, this.darkColor);
	}

	name:string;
	lightColor:string;
	darkColor:string;
	mappings:Dictionary<ExtensionIcon, string>;

	//TODO: remove dependence on fetch.
	download(folder: string): string {
		const destination = path.join(folder, this.name.replace(`${cs.dynamics.configuration.iconThemes._namespace}.`, ''));

		this.icons.forEach(icon => {
			const localPath = path.join(destination, icon.mappedOutputFile);

			FileSystem.MakeFolderSync(path.dirname(localPath));

			if (fs.existsSync(localPath)) { return; }

			return fetch(icon.url, {
				method: 'get',
				headers: {
					'Accepts': icon.mimeType
				}
			})
			.then(res => res.text())
			.then(body => {
				fs.writeFileSync(localPath, body);
	
				return localPath;
			})
			.catch(err => {
				console.error(err);
	
				return "";
			});
		});

		return destination;
	}
	
	private static getIcons(mappings:Dictionary<ExtensionIcon, string>, lightColor?:string, darkColor?:string): IconOptions[] {
		const returnObject:IconOptions[] = [];
		
		if (mappings) {
			for (let i = 0; i < mappings.keys.length; i++) {
				if (!lightColor && !darkColor) {
					returnObject.push(new IconOptions(mappings.values[i], undefined, undefined, undefined, undefined, undefined, mappings.keys[i]));
				}

				if (lightColor) {
					returnObject.push(new IconOptions(mappings.values[i], lightColor, "light", undefined, undefined, undefined, mappings.keys[i]));
				}

				if (darkColor) {
					returnObject.push(new IconOptions(mappings.values[i], darkColor, "dark", undefined, undefined, undefined, mappings.keys[i]));
				}
			}
		}

		return returnObject;
	}
}

export type ExtensionIcon =
	'Connection' |
	'Organization' |
	'Entities' |
	'Entity' |
	'Attributes' |
	'Attribute' |
	'Views' |
	'View' |
	'Forms' |
	'Form' |
	'Option Sets' |
	'Option Set' |
	'Processes' |
	'Process' |
	'Web Resources' |
	'Folder' |
	'Web Resource' |
	'Plugins' |
	'Plugin' |
	'PluginStep' | 
	'PluginStepImage' |
	'PluginType' |
	'Solutions' |
	'Solution' |
	'Add' |
	'Edit' |
	'Delete' |
	'Refresh' |
	'Save' |
	'Cancel';

export enum ScriptedIconFormat {
	svg = ".svg",
	js = ".js",
	json = ".json"
}

export class IconOptions {
	private _color:string;
	public height?:number;
	public width?:number;
	public name:string;
	public format:ScriptedIconFormat;
	public annotation:string;
	public extensionIcon:ExtensionIcon;

	constructor(name:string, color?:string, annotation?:string, height:number = 0, width:number = 0, format:ScriptedIconFormat = ScriptedIconFormat.svg, extensionIcon?:ExtensionIcon) {
		this.name = name;
		this.color = color;
		this.annotation = annotation;
		this.height = height;
		this.width = width;
		this.format = format;
		this.extensionIcon = extensionIcon;
	}

	get color(): string { return this._color; }
	set color(value:string) {
		if (value) { this._color = this.isColorCode(value) ? encodeURIComponent(value) : value; }
	}

	get url(): string {
		return `https://api.iconify.design/${this.name}${this.format.toString()}?${this.toQueryObject()}`;
	}	

	get mappedOutputFile(): string {
		return `${this.extensionIcon.replace(" ", "")}${this.annotation ? "." + this.annotation : ""}${this.format.toString()}`;
	}

	get outputfile(): string {
		return `${this.name.replace(":", "-")}${this.annotation ? "." + this.annotation : ""}${this.format.toString()}`;
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
		return value && value.match('^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$') !== null; 
	}

	private toQueryObject(): any {
		const querystring:any = { };

		if (!Utilities.IsNullOrEmpty(this._color)) { querystring["color"] = this._color; }
		if (this.height > 0) { querystring["height"] = this.height; }
		if (this.width > 0) { querystring["width"] = this.height; }

		return Utilities.ObjectToQuerystring(querystring);
	}
}