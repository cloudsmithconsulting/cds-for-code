import * as vscode from 'vscode';
import * as fs from 'fs';
import * as path from 'path';
import * as cs from '../cs';
import fetch from 'node-fetch';
import IWireUpCommands from '../wireUpCommand';
import Utilities from '../helpers/Utilities';
import Dictionary from '../helpers/Dictionary';
import * as FileSystem from '../helpers/FileSystem';
import * as DynamicsTreeView from '../views/DynamicsTreeView';
import { TS } from 'typescript-linq';
import { S_IROTH } from 'constants';
import ExtensionConfiguration from '../config/ExtensionConfiguration';

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
		
		return ExtensionIconTheme.defaultTheme.downloadIcons(folder);
	}
}

export type ExtensionIcon =
	DynamicsTreeView.EntryType |
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

export class IconResolver
{
    public readonly iconPath: { light: string | vscode.Uri; dark: string | vscode.Uri } = null;

    constructor(
        public readonly lightPath: string,
        public readonly darkPath: string
    )
    {
        this.iconPath = {
            light: path.join(__filename, ...lightPath.split("/")),
            dark: path.join(__filename, ...darkPath.split("/"))
        };
    }
}

export class IconifyIcon {
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

export class ExtensionIconTheme {
	public static readonly defaultTheme:ExtensionIconTheme = new ExtensionIconTheme(
		cs.dynamics.configuration.iconThemes.default, new Dictionary<ExtensionIcon, string>([
			{ key: "Connection", value: 'uil-cloud-data-connection' },
			{ key: "Organization", value: 'jam-building-f' },
			{ key: "Entities", value: "mdi-folder-outline" },
			{ key: "Attributes", value: "mdi-folder-outline" },
			{ key: "Views", value: "mdi-folder-outline" },
			{ key: "Forms", value: "mdi-folder-outline" },
			{ key: "OptionSets", value: "mdi-folder-outline" },
			{ key: "Processes", value: "mdi-folder-outline" },
			{ key: "WebResources", value: "mdi-folder-outline" },
			{ key: "Plugins", value: "mdi-folder-outline" },
			{ key: "Solutions", value: "mdi-folder-outline" },
			{ key: "Folder", value: "mdi-folder-outline" },
			{ key: "Entity", value: 'fe-table'},
			{ key: "Attribute", value: 'whh-twocolumnsrightalt'},
			{ key: "View", value: "ic-baseline-pageview" },
			{ key: "Form", value: "dashicons-format-aside"},
			{ key: "OptionSet", value: "ion-options-outline"},
			{ key: "Process", value: "vaadin-file-process" },
			{ key: "WebResource", value: "fa-file-code-o" },
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

	get icons():TS.Linq.Enumerator<IconifyIcon> {
		return new TS.Linq.Enumerator(ExtensionIconTheme.getIcons(this.mappings, this.lightColor, this.darkColor));
	}

	name:string;
	lightColor:string;
	darkColor:string;
	mappings:Dictionary<ExtensionIcon, string>;

	resolve(folder: string, icon:ExtensionIcon): IconResolver {
		const destination = path.join(folder, this.name.replace(`${cs.dynamics.configuration.iconThemes._namespace}.`, ''));
		const icons = this.icons.where(i => i.extensionIcon === icon);
		const lightIcon = icons.where(i => i.annotation === "light").first();
		const darkIcon = icons.where(i => i.annotation === "dark").first();
		const resolver = new IconResolver(path.join(destination, lightIcon.mappedOutputFile), path.join(destination, darkIcon.mappedOutputFile));

		return resolver;
	}

	//TODO: remove dependence on fetch.
	downloadIcons(folder: string): string {
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
	
	private static getIcons(mappings:Dictionary<ExtensionIcon, string>, lightColor?:string, darkColor?:string): IconifyIcon[] {
		const returnObject:IconifyIcon[] = [];
		
		if (mappings) {
			for (let i = 0; i < mappings.keys.length; i++) {
				if (!lightColor && !darkColor) {
					returnObject.push(new IconifyIcon(mappings.values[i], undefined, undefined, undefined, undefined, undefined, mappings.keys[i]));
				}

				if (lightColor) {
					returnObject.push(new IconifyIcon(mappings.values[i], lightColor, "light", undefined, undefined, undefined, mappings.keys[i]));
				}

				if (darkColor) {
					returnObject.push(new IconifyIcon(mappings.values[i], darkColor, "dark", undefined, undefined, undefined, mappings.keys[i]));
				}
			}
		}

		return returnObject;
	}
}

export class ExtensionIconThemes {
	private static _themes:ExtensionIconTheme[] = [ ExtensionIconTheme.defaultTheme ];

	static get default(): ExtensionIconTheme {
		return ExtensionIconTheme.defaultTheme;
	}

	static get selected(): ExtensionIconTheme {
		let configValue = ExtensionConfiguration.getConfigurationValueOrDefault(cs.dynamics.configuration.iconThemes.selectedTheme, cs.dynamics.configuration.iconThemes.default);

		if (!configValue.startsWith(cs.dynamics.configuration.iconThemes._namespace)) {
			configValue = cs.dynamics.configuration.iconThemes._namespace + "." + configValue;
		}

		return this.get(configValue);
	}

	static get(name:string) {
		return this._themes.find(t => t.name === name);
	}

	static register(theme:ExtensionIconTheme) {
		if (this._themes.indexOf(theme) === -1) {
			this._themes.push(theme);
		}
	}

	static unregister(theme:ExtensionIconTheme) {
		if (this._themes.indexOf(theme) !== -1) {
			this._themes.splice(this._themes.indexOf(theme), 1);
		}
	}
}