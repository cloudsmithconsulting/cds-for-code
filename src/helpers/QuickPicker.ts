import * as vscode from "vscode";
import * as cs from '../cs';
import * as path from 'path';
import DiscoveryRepository from "../repositories/discoveryRepository";
import { TS } from 'typescript-linq';
import ApiRepository from "../repositories/apiRepository";
import MetadataRepository from "../repositories/metadataRepository";
import { DynamicsWebApi } from "../api/Types";
import Utilities from "./Utilities";
import Dictionary from "./Dictionary";

export default class QuickPicker {
    /**
     * shows an input box with a question and returns a response
     * @param prompt prompt to display when asking
     * @param placeHolder text to display when nothing was chosen
     * @param value pre-selected value, if any
     * @param ignoreFocusOut boolean indicating if the input box should be closed if it loses focus
     */
    public static async ask(prompt: string, placeHolder?:string, value?: string, ignoreFocusOut: boolean = true): Promise<string> {
        return vscode.window
            .showInputBox({ prompt, placeHolder, value, ignoreFocusOut })
            .then(chosen => chosen);
    }

    /**
	 * shows a QuickPick-Panel in the VS Code Window
	 * @param placeHolder text to display when nothing was chosen
	 * @param options options to choose from
	 */
	public static async pick(placeHolder: string, ...options: QuickPickOption[]): Promise<QuickPickOption> {
		return await vscode.window.showQuickPick(options, { placeHolder, ignoreFocusOut: true, canPickMany: false });
	}    

    /**
	 * shows a QuickPick-Panel in the VS Code Window
	 * @param placeHolder text to display when nothing was chosen
	 * @param options options to choose from
	 */
	public static async pickAny(placeHolder: string, ...options: QuickPickOption[]): Promise<QuickPickOption[]> {
		return await vscode.window.showQuickPick(options, { placeHolder, ignoreFocusOut: true, canPickMany: true });
	}    

        /**
	 * shows a QuickPick-Panel in the VS Code Window
	 * @param placeHolder text to display when nothing was chosen
	 * @param options options to choose from
	 */
	public static async pickBoolean(placeHolder: string, trueValue:string = "True", falseValue:string = "False"): Promise<boolean> {
        return await vscode.window.showQuickPick([new QuickPickOption(trueValue, undefined), new QuickPickOption(falseValue, undefined)], { placeHolder, ignoreFocusOut: true, canPickMany: false })
            .then(value => value.label === trueValue ? true : value.label === falseValue ? false : null);
	}    

    /**
     * Selects a workspace folder.  If args contains an fsPath, then it uses
     * that.  Otherwise, for single root workspaces it will select the root directory,
     * or for multi-root will present a chooser to select a workspace.
     * @param defaultUri 
     */
    public static async pickWorkspaceRoot(defaultUri?: any, placeHolder?: string, ignoreFocusOut: boolean = true) : Promise<vscode.Uri> {
        let workspace: vscode.Uri;

        // check arguments
        if (defaultUri && defaultUri.fsPath) {
            workspace = defaultUri;
        } else if (vscode.workspace.workspaceFolders) {
            // single or multi-root
            if (vscode.workspace.workspaceFolders.length === 1) {
                workspace = vscode.workspace.workspaceFolders[0].uri;
            } else if (vscode.workspace.workspaceFolders.length > 1) {
                // choose workspace
                let ws = await vscode.window.showWorkspaceFolderPick({ placeHolder, ignoreFocusOut });

                if (ws) {
                    workspace = ws.uri;
                }
            }
        }

        return workspace;
    }

    /**
     * Selects a file within a workspace folder.  If args contains an fsPath, then it uses
     * that.  Otherwise, for single root workspaces it will select the root directory,
     * or for multi-root will present a chooser to select a workspace.
     * @param defaultUri 
     */
    public static async pickWorkspaceFile(defaultUri?:vscode.Uri, placeHolder?:string, ignoreFocusOut:boolean = true, canAddNewItem:boolean = false): Promise<string> {
        return this.pickWorkspaceFileOrfolder(defaultUri, placeHolder, ignoreFocusOut, true, false, canAddNewItem);
    }

    public static async pickWorkspaceFolder(defaultUri?:vscode.Uri, placeHolder?:string, ignoreFocusOut:boolean = true, canAddNewItem:boolean = false): Promise<string> {
        return this.pickWorkspaceFileOrfolder(defaultUri, placeHolder, ignoreFocusOut, false, true, canAddNewItem);
    }

    private static async pickWorkspaceFileOrfolder(defaultUri?:vscode.Uri, placeHolder?:string, ignoreFocusOut:boolean = true, canPickFiles:boolean = true, canPickFolders:boolean = true, canAddNewItem:boolean = false): Promise<string> {
        defaultUri = defaultUri || await this.pickWorkspaceRoot(undefined, placeHolder, ignoreFocusOut);
        if (!defaultUri) { return; }

        let choices:QuickPickOption[] = [];

        if (canAddNewItem) {
            choices.push(new QuickPickOption("+", undefined, `New ${canPickFiles && !canPickFolders ? "File" : canPickFolders && !canPickFiles ? "Folder" : "Item" }`, defaultUri));
        }

        if (canPickFolders) {
            choices.push(new QuickPickOption(".", undefined, "Use current folder", defaultUri));
        }

        if (!new TS.Linq.Enumerator(vscode.workspace.workspaceFolders).any(f => f.uri.fsPath === defaultUri.fsPath)) {
            choices.push(new QuickPickOption("..", undefined, "Use parent folder", defaultUri));
        }

        return await vscode.workspace.fs.readDirectory(defaultUri)
            .then(results => {
                results.forEach(r => {
                    if ((canPickFiles && r[1] === vscode.FileType.File) || (r[1] === vscode.FileType.Directory)) { 
                        choices.push(new QuickPickOption(r[0], undefined, undefined, r)); 
                    } 
                }); 

                return new TS.Linq.Enumerator(choices).orderBy(c => c.label.toLowerCase()).toArray();
            }).then(choices => {
                return this.pick(placeHolder, ...choices);
            }).then(async choice => {
                if (choice) {
                    let newUri;
                    if (choice.label === ".") {
                        return defaultUri.fsPath;
                    } else if (choice.label === "..") {
                        newUri = defaultUri.with({ path: defaultUri.path.substr(0, defaultUri.path.lastIndexOf("/")) });
                    } else if (choice.label === "+") {
                        const input = await QuickPicker.ask(`What is the name of the new ${canPickFiles && !canPickFolders ? "File" : canPickFolders && !canPickFiles ? "Folder" : "Item" }?`);

                        if (input) {
                            const newPath = defaultUri.path.endsWith("/") ? defaultUri.path + input : defaultUri.path + "/" + input;

                            newUri = defaultUri.with({ path: newPath });
                        }
                    } else {
                        newUri = defaultUri.with({ path: `${defaultUri.path.endsWith("/") ? defaultUri.path : defaultUri.path + "/" }${choice.label}` }); 
                    }

                    if (newUri) {
                        if (choice.context[1] === vscode.FileType.Directory || choice.label === "..") {
                            return this.pickWorkspaceFileOrfolder(newUri, placeHolder, ignoreFocusOut, canPickFiles, canPickFolders, canAddNewItem);
                        } else {
                            return newUri.fsPath;
                        }
                    }
                }

                return null;
            });
    }

    public static async pickAnyFolder(defaultUri?:vscode.Uri, canSelectMany: boolean = false, openLabel?: string, filters?: { [name: string]: string[] }) : Promise<vscode.Uri | vscode.Uri[]> {
        return vscode.window
            .showOpenDialog({canSelectFolders: true, canSelectFiles: false, canSelectMany, openLabel, defaultUri, filters })
            .then(pathUris => (pathUris && pathUris.length > 0) ? pathUris.length === 1 ? pathUris[0] : pathUris : null);
    }

    public static async pickAnyFile(defaultUri?:vscode.Uri, canSelectMany: boolean = false, openLabel?: string, filters?: { [name: string]: string[] }) : Promise<vscode.Uri | vscode.Uri[]> {
        return vscode.window
            .showOpenDialog({canSelectFolders: false, canSelectFiles: true, canSelectMany, openLabel, defaultUri, filters })
            .then(pathUris => (pathUris && pathUris.length > 0) ? pathUris.length === 1 ? pathUris[0] : pathUris : null);
    }

    public static async pickEnum<T>(enumObject:T, placeHolder?:string): Promise<any> {
        let enumOptions:QuickPickOption[] = [];

        for (let value in enumObject) {
            if (typeof enumObject[value] === 'number' || typeof enumObject[value] === 'string') {
                enumOptions.push(new QuickPickOption(value, undefined, undefined, enumObject[value]));
            }
        }

        return await this.pick(placeHolder, ...enumOptions)
            .then(p => p.context);
    }

    public static async pickDictionaryEntry<TKey, TItem>(dictionary:Dictionary<TKey, TItem>, placeHolder?:string): Promise<TItem> {
        if (dictionary && dictionary.keys.length > 0) {
            const options:QuickPickOption[] = [];
        
            dictionary.keys.forEach(k => options.push(new QuickPickOption(k.toString(), undefined, undefined, dictionary.get(k))));

            return await this.pick(placeHolder, ...options)
                .then(p => p.context);
        }
    }

    public static async pickDynamicsSolution(config:DynamicsWebApi.Config, placeHolder?:string, ignoreFocusOut:boolean = true) : Promise<any> {
        return new ApiRepository(config).retrieveSolutions()
            .then(solutions => new TS.Linq.Enumerator(solutions).select(solution => new QuickPickOption(solution.friendlyname, undefined, undefined, solution)).toArray())
            .then(options => vscode.window.showQuickPick(options, { placeHolder, ignoreFocusOut, canPickMany: false }))
            .then(chosen => chosen.context);
    }

    public static async pickDynamicsOrganization(context:vscode.ExtensionContext, placeHolder?:string, ignoreFocusOut: boolean = true) : Promise<DynamicsWebApi.Config> {
        return DiscoveryRepository.getOrgConnections(context)
            .then(orgs => new TS.Linq.Enumerator(orgs).select(org => new QuickPickOption(org.name, undefined, undefined, org)).toArray())
            .then(options => options && options.length === 1 ? options[0] : vscode.window.showQuickPick(options, { placeHolder, ignoreFocusOut, canPickMany: false }))
            .then(chosen => <DynamicsWebApi.Config>chosen.context);
    }

    public static async pickDynamicsSolutionComponentType(placeHolder?:string, choices?:DynamicsWebApi.SolutionComponent[]): Promise<DynamicsWebApi.SolutionComponent> {
        if (choices && choices.length > 0) {
            const options:QuickPickOption[] = [];
        
            choices.forEach(c => options.push(new QuickPickOption(Utilities.ToPlural(c.toString()), undefined, undefined, c)));

            return await this.pick(placeHolder, ...options)
                .then(p => p.context);
        }
    }

    public static async pickDynamicsSolutionComponent(config:DynamicsWebApi.Config, solution:any, componentType:DynamicsWebApi.SolutionComponent, placeHolder?:string): Promise<string> {
        const options:QuickPickOption[] = [];
        const metadataApi = new MetadataRepository(config);
        const api = new ApiRepository(config);

        switch (componentType) {
            case DynamicsWebApi.SolutionComponent.Entity:
                await metadataApi.retrieveEntities(solution && solution.solutionid ? solution.solutionid : undefined)                
                    .then(entities => entities.forEach(e => options.push(new QuickPickOption(e["LogicalName"], undefined, undefined, e["MetadataId"]))));

                break;
            case DynamicsWebApi.SolutionComponent.OptionSet:
                await metadataApi.retrieveOptionSets(solution && solution.solutionid ? solution.solutionid : undefined)                
                    .then(optionsets => optionsets.forEach(o => options.push(new QuickPickOption(o["Name"], undefined, undefined, o["MetadataId"]))));

                break;
            case DynamicsWebApi.SolutionComponent.PluginAssembly:
                await api.retrievePluginAssemblies(solution && solution.solutionid ? solution.solutionid : undefined)                
                    .then(plugins => plugins.forEach(p => options.push(new QuickPickOption(p["name"], undefined, undefined, p["pluginassemblyid"]))))
                    .catch(error => console.error(error));

                break;
            case DynamicsWebApi.SolutionComponent.WebResource:
                await api.retrieveWebResources(solution && solution.solutionid ? solution.solutionid : undefined)                
                    .then(webresources => webresources.forEach(w => options.push(new QuickPickOption(w["name"], undefined, undefined, w["webresourceid"]))));

                break;
            case DynamicsWebApi.SolutionComponent.Workflow:
                await api.retrieveProcesses(solution && solution.solutionid ? solution.solutionid : undefined)                
                    .then(processes => processes.forEach(p => options.push(new QuickPickOption(p["name"], undefined, undefined, p["workflowid"]))));

                break;
        }

        if (options && options.length > 0) {
            return await this.pick(placeHolder, ...options).then(p => p.context);
        }

        return null;
    }
}

export class QuickPickOption implements vscode.QuickPickItem {
	public label: string;
	public command: string;
	public description: string;
    public context: any;
    public detail: string;
    public picked?: boolean;
    public alwaysShow?: boolean;

	constructor(label: string, command: string, description: string='', context?: any) {
		this.label = label;
		this.command = command;
        this.description = description;
        this.context = context;
    }
    
    public invokeCommand<T>(...options:any[]): Thenable<T>
    {
        if (this.command) {
            return vscode.commands.executeCommand(this.command, options);
        }

        return null;
    }

	static cancel = new QuickPickOption('Cancel', cs.dynamics.controls.quickPicker.cancel, 'ESC');
	static quit = new QuickPickOption('Close Window', cs.dynamics.controls.quickPicker.quit);
}