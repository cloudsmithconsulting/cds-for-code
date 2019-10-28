import * as vscode from "vscode";
import * as cs from '../cs';
import DiscoveryRepository from "../repositories/discoveryRepository";
import { TS } from 'typescript-linq';
import ApiRepository from "../repositories/apiRepository";
import MetadataRepository from "../repositories/metadataRepository";
import { DynamicsWebApi } from "../api/Types";
import Utilities from "./Utilities";

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
     * @param args 
     */
    public static async pickWorkspacePath(args?: any, placeHolder?: string, ignoreFocusOut: boolean = true) : Promise<string> {
        let workspace : string = "";

        // check arguments
        if (args && args.fsPath) {
            workspace = args.fsPath;
        } else if (vscode.workspace.workspaceFolders) {
            // single or multi-root
            if (vscode.workspace.workspaceFolders.length === 1) {
                workspace = vscode.workspace.workspaceFolders[0].uri.fsPath;
            } else if (vscode.workspace.workspaceFolders.length > 1) {
                // choose workspace
                let ws = await vscode.window.showWorkspaceFolderPick({ placeHolder, ignoreFocusOut });

                if (ws) {
                    workspace = ws.uri.fsPath;
                }
            }
        }

        return workspace;
    }

    public static async pickAnyFolder(defaultUri?:vscode.Uri, canSelectMany: boolean = false, openLabel?: string, filters?: { [name: string]: string[] }) : Promise<string | string[]> {
        return vscode.window
            .showOpenDialog({canSelectFolders: true, canSelectFiles: false, canSelectMany, openLabel, defaultUri, filters })
            .then(pathUris => (pathUris && pathUris.length > 0) ? pathUris.length === 1 ? pathUris[0].fsPath : pathUris.map(p => p.fsPath) : '');
    }

    public static async pickAnyFile(defaultUri?:vscode.Uri, canSelectMany: boolean = false, openLabel?: string, filters?: { [name: string]: string[] }) : Promise<string | string[]> {
        return vscode.window
            .showOpenDialog({canSelectFolders: false, canSelectFiles: true, canSelectMany, openLabel, defaultUri, filters })
            .then(pathUris => (pathUris && pathUris.length > 0) ? pathUris.length === 1 ? pathUris[0].fsPath : pathUris.map(p => p.fsPath) : '');
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
            .then(options => vscode.window.showQuickPick(options, { placeHolder, ignoreFocusOut, canPickMany: false }))
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
                    .then(plugins => plugins.forEach(p => options.push(new QuickPickOption(p["name"], undefined, undefined, p["pluginassemblyid"]))));

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