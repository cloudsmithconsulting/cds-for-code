import * as vscode from "vscode";
import * as cs from '../cs';
import DiscoveryRepository from "../repositories/discoveryRepository";
import { TS } from 'typescript-linq';
import ApiRepository from "../repositories/apiRepository";
import MetadataRepository from "../repositories/metadataRepository";
import { DynamicsWebApi } from "../webapi/Types";
import Utilities from "./Utilities";
import Dictionary from "./types/Dictionary";
import * as FileSystem from "./io/FileSystem";
import { Octicon } from "./types/Octicon";
import * as path from 'path';
import TemplateManager from "../components/Templates/TemplateManager";
import { TemplateItem, TemplateType } from "../components/Templates/Types";

export default class Quickly {
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
     * Quickly informs you of information and optionally gives you primary/secondary actions.
     *
     * @static
     * @param {string} message The message to inform
     * @param {boolean} [modal=false] Boolean indicating if the information should be displayed in a modal box.
     * @param {string} [primaryOption] Text to display in a button if the "primary" action is offered.
     * @param {() => void} [primaryAction] Action to perform if the "primary" action is selected.
     * @param {string} [secondaryOption] Text to display in a button if the "secondary" action is offered.
     * @param {() => void} [secondaryAction] Action to perform if the "secondary" action is selected or ESC is pressed
     * @returns {Promise<void>} empty promise
     * @memberof QuickPicker
     */
    public static async inform(message: string, modal:boolean = false, primaryOption?:string, primaryAction?:() => void, secondaryOption?:string, secondaryAction?:() => void): Promise<void> {
        let primary:vscode.MessageItem;
        let secondary:vscode.MessageItem;

        if (primaryOption) { primary = { title: primaryOption, isCloseAffordance: false }; }
        if (secondaryOption) { secondary = { title: secondaryOption, isCloseAffordance: true }; }

        await vscode.window.showInformationMessage(message, { modal }, primary, secondary)
            .then(response => { if (response && response.title === primaryOption) { if (primaryAction) { primaryAction(); } } return response; })
            .then(response => { if (response && response.title === secondaryOption) { if (secondaryAction) { secondaryAction(); } } return response; });
    }

    /**
     * Quickly warns you of information and optionally gives you primary/secondary actions.
     *
     * @static
     * @param {string} message The message to inform
     * @param {boolean} [modal=false] Boolean indicating if the information should be displayed in a modal box.
     * @param {string} [primaryOption] Text to display in a button if the "primary" action is offered.
     * @param {() => void} [primaryAction] Action to perform if the "primary" action is selected.
     * @param {string} [secondaryOption] Text to display in a button if the "secondary" action is offered.
     * @param {() => void} [secondaryAction] Action to perform if the "secondary" action is selected or ESC is pressed
     * @returns {Promise<void>} empty promise
     * @memberof QuickPicker
     */
    public static async warn(message: string, modal:boolean = false, primaryOption?:string, primaryAction?:() => void, secondaryOption?:string, secondaryAction?:() => void): Promise<void> {
        let primary:vscode.MessageItem;
        let secondary:vscode.MessageItem;

        if (primaryOption) { primary = { title: primaryOption, isCloseAffordance: false }; }
        if (secondaryOption) { secondary = { title: secondaryOption, isCloseAffordance: true }; }

        await vscode.window.showWarningMessage(message, { modal }, primary, secondary)
            .then(response => { if (response && response.title === primaryOption) { if (primaryAction) { primaryAction(); } } return response; })
            .then(response => { if (response && response.title === secondaryOption) { if (secondaryAction) { secondaryAction(); } } return response; });
    }

    /**
     * Quickly shows you error information.
     *
     * @static
     * @param {string} message The message to inform
     * @param {boolean} [modal=false] Boolean indicating if the information should be displayed in a modal box.
     * @param {string} [primaryOption] Text to display in a button if the "primary" action is offered.
     * @param {() => void} [primaryAction] Action to perform if the "primary" action is selected.
     * @param {string} [secondaryOption] Text to display in a button if the "secondary" action is offered.
     * @param {() => void} [secondaryAction] Action to perform if the "secondary" action is selected or ESC is pressed
     * @returns {Promise<void>} empty promise
     * @memberof QuickPicker
     */
    public static async error(message: string, modal:boolean = false, primaryOption?:string, primaryAction?:() => void, secondaryOption?:string, secondaryAction?:() => void): Promise<void> {
        let primary:vscode.MessageItem;
        let secondary:vscode.MessageItem;

        if (primaryOption) { primary = { title: primaryOption, isCloseAffordance: false }; }
        if (secondaryOption) { secondary = { title: secondaryOption, isCloseAffordance: true }; }

        await vscode.window.showErrorMessage(message, { modal }, primary, secondary)
            .then(response => { if (response && response.title === primaryOption) { if (primaryAction) { primaryAction(); } } return response; })
            .then(response => { if (response && response.title === secondaryOption) { if (secondaryAction) { secondaryAction(); } } return response; });
    }

    /**
	 * shows a QuickPick-Panel in the VS Code Window
	 * @param placeHolder text to display when nothing was chosen
	 * @param options options to choose from
	 */
	public static async pick(placeHolder: string, ...options: QuickPickOption[] | string[]): Promise<QuickPickOption> {
        if (options.length > 0) {
            let quickPickOptions:QuickPickOption[];

            if (options[0] instanceof QuickPickOption) {
                quickPickOptions = <QuickPickOption[]>options;
            } else {
                quickPickOptions = (<string[]>options).map(i => new QuickPickOption(i));
            }

            return await vscode.window.showQuickPick(quickPickOptions, { placeHolder, ignoreFocusOut: true, canPickMany: false });
        }

        return null;
	}    

    public static async pickOrNew(placeHolder:string, ...options: QuickPickOption[] | string[]): Promise<QuickPickOption> {
        if (options.length > 0) {
            let quickPickOptions:QuickPickOption[];

            if (!(options[0] instanceof QuickPickOption) || !(<QuickPickOption[]>options).find(i => i.label === `${Octicon.plus}`)) {
                quickPickOptions.push(new QuickPickOption(`${Octicon.plus}`, undefined, 'New Item', undefined, true));
            }

            if (options[0] instanceof QuickPickOption) {
                quickPickOptions = <QuickPickOption[]>options;
            } else {
                quickPickOptions = (<string[]>options).map(i => new QuickPickOption(i));
            }

            const option = await vscode.window.showQuickPick(quickPickOptions, { placeHolder, ignoreFocusOut: true, canPickMany: false });

            if (option && option.label === `${Octicon.plus}`) {
                const newItem = await Quickly.ask("What is the name of the new item?");

                if (newItem) {
                    quickPickOptions.push(new QuickPickOption(newItem));

                    return this.pickOrNew(placeHolder, ...quickPickOptions);
                }
            } else {
                return option;
            }
        }
    }

    /**
	 * shows a QuickPick-Panel in the VS Code Window
	 * @param placeHolder text to display when nothing was chosen
	 * @param options options to choose from
	 */
	public static async pickAny(placeHolder: string, ...options: QuickPickOption[] | string[]): Promise<QuickPickOption[]> {
        if (options.length > 0) {
            let quickPickOptions:QuickPickOption[];

            if (options[0] instanceof QuickPickOption) {
                quickPickOptions = <QuickPickOption[]>options;
            } else {
                quickPickOptions = (<string[]>options).map(i => new QuickPickOption(i));
            }

            return await vscode.window.showQuickPick(quickPickOptions, { placeHolder, ignoreFocusOut: true, canPickMany: true });
        }

        return null;
	}    

    public static async pickAnyOrNew(placeHolder:string, ...options: QuickPickOption[] | string[]): Promise<QuickPickOption[]> {
        if (options && options.length > 0) {
            let quickPickOptions:QuickPickOption[] = [];

            if (!(options[0] instanceof QuickPickOption) || !(<QuickPickOption[]>options).find(i => i.label === `${Octicon.plus}`)) {
                quickPickOptions.push(new QuickPickOption(`${Octicon.plus}`, undefined, 'New Item', undefined, true));
            }

            if (options[0] instanceof QuickPickOption) {
                quickPickOptions.push(...<QuickPickOption[]>options);
            } else {
                quickPickOptions.push(...(<string[]>options).map(i => new QuickPickOption(i)));
            }

            const option = await vscode.window.showQuickPick(quickPickOptions, { placeHolder, ignoreFocusOut: true, canPickMany: true });

            quickPickOptions.forEach(o => {
                if (o.label !== `${Octicon.plus}` && option.find(op => op.label === o.label)) {
                    o.picked = true;
                }
            });

            if (option && option.find(o => o.label === `${Octicon.plus}`)) {
                const newItem = await Quickly.ask("What is the name of the new item?");

                if (newItem) {
                    const newOption = new QuickPickOption(newItem);
                    newOption.picked = true;
                    quickPickOptions.push(newOption);

                    return this.pickAnyOrNew(placeHolder, ...quickPickOptions);
                }
            } else {
                return option;
            }
        }
    }

        /**
	 * shows a QuickPick-Panel in the VS Code Window
	 * @param placeHolder text to display when nothing was chosen
	 * @param options options to choose from
	 */
	public static async pickBoolean(placeHolder: string, trueValue:string = "True", falseValue:string = "False"): Promise<boolean> {
        return await vscode.window.showQuickPick([new QuickPickOption(`${Octicon.check} ${trueValue}`, undefined), new QuickPickOption(`${Octicon.x} ${falseValue}`, undefined)], { placeHolder, ignoreFocusOut: true, canPickMany: false })
            .then(value => value.label.startsWith(`${Octicon.check}`) ? true : value.label.startsWith(`${Octicon.x}`) ? false : null);
	}    

    public static async pickTemplate(placeHolder: string, templateType?:TemplateType, canAddNewItem:boolean = false): Promise<TemplateItem> {
        return await TemplateManager.getTemplateCatalog()
            .then(catalog => {
                let choices:QuickPickOption[] = [];

                if (canAddNewItem) {
                    choices.push(new QuickPickOption(`${Octicon.file_add}`, undefined, `New template`, undefined, true));
                }

                let items:TemplateItem[];

                if (templateType) {
                    items = catalog.query(c => c.where(i => i.type === templateType));
                } else {
                    items = catalog.items;
                }
                
                items.forEach(i => choices.push(new QuickPickOption(Utilities.IsNullOrEmpty(i.displayName) ? i.location : i.displayName, undefined, i.description, i))); 

                if (choices.length === 0) {
                    Quickly.warn(
                        "You do not have any templates configured.  Add some by using the Template Explorer.", 
                        undefined, 
                        "Add a template from workspace",
                        async () => vscode.commands.executeCommand(cs.dynamics.templates.saveTemplate, undefined, templateType),
                        "Open template folder", 
                        async () => FileSystem.openFolderInExplorer(await TemplateManager.getTemplatesFolder()));

                    return;
                }

                return choices;
            }).then(async items => {
                if (items && items.length > 0) {
                    return await this.pick(placeHolder, ...items);
                }
            }).then(async item => {
                if (item && item.context) {
                    return item.context;
                }
            
                return undefined;
            });
    }

    /**
     * Selects a workspace folder.  If args contains an fsPath, then it uses
     * that.  Otherwise, for single root workspaces it will select the root directory,
     * or for multi-root will present a chooser to select a workspace.
     * @param defaultUri 
     */
    public static async pickWorkspaceRoot(defaultUri?: vscode.Uri, placeHolder?: string, ignoreFocusOut: boolean = true) : Promise<vscode.Uri> {
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
        } else {
            Quickly.error("You must have at least one workspace folder open to perform this action", undefined, "Open Workspace Folder", () => vscode.commands.executeCommand("vscode.openFolder", undefined, false));
        }

        return workspace;
    }

    /**
     * Selects a file within a workspace folder.  If defaultUri contains a fsPath, then it uses
     * that as the root.  Otherwise, for single root workspaces it will select the root directory,
     * or for multi-root will present a chooser to select a workspace.
     * @param defaultUri The root path to use when selecting a file
     * @param placeHolder Placeholder text to render when asking the user to pick a file
     * @param ignoreFocusOut boolean indicating if the picker should maintain focus when the user clicks outside
     * @param canAddNewItem boolean indicating if the "Add new" option should be allowed
     * @param allowedFileTypes array of file type extensions that are allowed.
     */
    public static async pickWorkspaceFile(defaultUri?:vscode.Uri, placeHolder?:string, ignoreFocusOut:boolean = true, canAddNewItem:boolean = false, allowedFileTypes?:string[]): Promise<string> {
        return this.pickWorkspaceFsItem(defaultUri, placeHolder, ignoreFocusOut, true, false, false, canAddNewItem, allowedFileTypes)
            .then(r => r.fsPath);
    }

    public static async pickWorkspaceFolder(defaultUri?:vscode.Uri, placeHolder?:string, ignoreFocusOut:boolean = true, canAddNewItem:boolean = false): Promise<string> {
        return this.pickWorkspaceFsItem(defaultUri, placeHolder, ignoreFocusOut, false, true, false, canAddNewItem)
            .then(r => r.fsPath);
    }

    public static async pickWorkspaceAny(defaultUri?:vscode.Uri, placeHolder?:string, ignoreFocusOut:boolean = true, canAddNewItem:boolean = false, allowedFileTypes?:string[]): Promise<WorkspaceFileItem> {
        return this.pickWorkspaceFsItem(defaultUri, placeHolder, ignoreFocusOut, true, true, true, canAddNewItem, allowedFileTypes);
    }

    private static async pickWorkspaceFsItem(defaultUri?:vscode.Uri, placeHolder?:string, ignoreFocusOut:boolean = true, canPickFiles:boolean = true, canPickFolders:boolean = true, canPickLinks:boolean = true, canAddNewItem:boolean = false, allowedFileTypes?:string[]): Promise<WorkspaceFileItem> {
        defaultUri = defaultUri || await this.pickWorkspaceRoot(undefined, placeHolder, ignoreFocusOut);
        if (!defaultUri) { return; }

        let choices:QuickPickOption[] = [];

        if (canAddNewItem) {
            choices.push(new QuickPickOption(`${Octicon.file_directory_create}`, undefined, `New ${canPickFiles && !canPickFolders ? "File" : canPickFolders && !canPickFiles ? "Folder" : "Item" }`, defaultUri, true));
        }

        if (canPickFolders) {
            choices.push(new QuickPickOption(`${Octicon.file_symlink_directory} .`, undefined, defaultUri.fsPath, defaultUri, true));
        }

        if (!new TS.Linq.Enumerator(vscode.workspace.workspaceFolders).any(f => f.uri.fsPath === defaultUri.fsPath)) {
            const folderNoSlash = defaultUri.path.endsWith("/") ? defaultUri.path.substr(0, defaultUri.path.length - 1) : defaultUri.path;

            choices.push(new QuickPickOption(`${Octicon.file_symlink_directory} ..`, undefined, defaultUri.with({ path: folderNoSlash.substr(0, folderNoSlash.lastIndexOf("/")) }).fsPath, defaultUri, true));
        }

        return await vscode.workspace.fs.readDirectory(defaultUri)
            .then(results => {
                new TS.Linq.Enumerator(results).orderBy(r => r[0]).forEach(r => {
                    if ((canPickFiles && r[1] === vscode.FileType.File) || (r[1] === vscode.FileType.Directory) || (canPickLinks && r[1] === vscode.FileType.SymbolicLink)) { 
                        if (allowedFileTypes && allowedFileTypes.length > 0 && r[1] === vscode.FileType.File) {
                            if (!new TS.Linq.Enumerator(allowedFileTypes).any(a => r[0].endsWith(a))) {
                                return;
                            }
                        }

                        choices.push(new QuickPickOption(r[1] === vscode.FileType.SymbolicLink ? `${Octicon.file_symlink_file} ${r[0]}` : r[1] === vscode.FileType.Directory ? `${Octicon.file_directory} ${r[0]}` : `${Octicon.file} ${r[0]}`, undefined, undefined, r)); 
                    } 
                }); 

                return this.pick(placeHolder, ...choices);
            }).then(async choice => {
                if (choice) {
                    let newUri;
                    let itemType = choice.context[1];

                    if (!itemType && choice.context) {
                        const stat = FileSystem.stats(choice.context.fsPath);
                        itemType = stat.isDirectory() ? vscode.FileType.Directory : stat.isFile() ? vscode.FileType.File : stat.isSymbolicLink() ? vscode.FileType.SymbolicLink : vscode.FileType.Unknown;
                    }

                    if (choice.label === `${Octicon.file_symlink_directory} .`) {
                        return new WorkspaceFileItem(defaultUri.fsPath, itemType);
                    } else if (choice.label.startsWith(`${Octicon.file_symlink_file} `)) {
                        return new WorkspaceFileItem(choice.context[0], vscode.FileType.SymbolicLink);
                    } else if (choice.label === `${Octicon.file_symlink_directory} ..`) {
                        newUri = defaultUri.with({ path: defaultUri.path.substr(0, defaultUri.path.lastIndexOf("/")) });
                    } else if (choice.label === `${Octicon.file_directory_create}`) {
                        const input = await Quickly.ask(`What is the name of the new ${canPickFiles && !canPickFolders ? "File" : canPickFolders && !canPickFiles ? "Folder" : "Item" }?`);

                        if (input) {
                            const isFolder = canPickFolders && !canPickFiles ? true : input.endsWith("/") || input.endsWith("\\") ? true : false;
                            let newPath = defaultUri.path.endsWith("/") ? defaultUri.path + input : defaultUri.path + "/" + input;
                            
                            if (isFolder && !newPath.endsWith("/")) { newPath += "/"; }

                            newUri = defaultUri.with({ path: newPath });

                            if (isFolder) {
                                FileSystem.makeFolderSync(newUri.fsPath);
                            }

                            return this.pickWorkspaceFsItem(newUri, placeHolder, ignoreFocusOut, canPickFiles, canPickFolders, canPickLinks, canAddNewItem, allowedFileTypes);
                        }
                    } else {
                        newUri = defaultUri.with({ path: `${defaultUri.path.endsWith("/") ? defaultUri.path : defaultUri.path + "/" }${path.basename(choice.context[0])}` }); 
                    }

                    if (newUri) {
                        if (choice.context[1] === vscode.FileType.Directory || choice.label.startsWith(`${Octicon.file_symlink_directory} ..`)) {
                            return this.pickWorkspaceFsItem(newUri, placeHolder, ignoreFocusOut, canPickFiles, canPickFolders, canPickLinks, canAddNewItem, allowedFileTypes);
                        } else {
                            return new WorkspaceFileItem(newUri.fsPath, itemType);
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

    public static async pickEnum<T>(enumObject:any, placeHolder?:string): Promise<T> {
        let enumOptions:QuickPickOption[] = [];

        for (let value in enumObject) {
            if (typeof enumObject[value] === 'number' || typeof enumObject[value] === 'string') {
                enumOptions.push(new QuickPickOption(typeof enumObject[value] === 'string' ? enumObject[value].toString() : value, undefined, undefined, enumObject[value]));
            }
        }

        return await this.pick(placeHolder, ...enumOptions)
            .then(p => p.context as T);
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
            .then(solutions => new TS.Linq.Enumerator(solutions).select(solution => new QuickPickOption(`${Octicon.circuit_board} ${solution.friendlyname}`, undefined, undefined, solution)).toArray())
            .then(options => vscode.window.showQuickPick(options, { placeHolder, ignoreFocusOut, canPickMany: false }))
            .then(chosen => chosen.context);
    }

    public static async pickDynamicsOrganization(context:vscode.ExtensionContext, placeHolder?:string, ignoreFocusOut: boolean = true) : Promise<DynamicsWebApi.Config> {
        return DiscoveryRepository.getOrgConnections(context)
            .then(orgs => new TS.Linq.Enumerator(orgs).select(org => new QuickPickOption(`${Octicon.database} ${org.name}`, undefined, undefined, org)).toArray())
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

    public static async pickDynamicsSolutionComponent(config:DynamicsWebApi.Config, solution:any, componentType:DynamicsWebApi.SolutionComponent, placeHolder?:string): Promise<{ componentId:string, component:any }> {
        const options:QuickPickOption[] = [];
        const metadataApi = new MetadataRepository(config);
        const api = new ApiRepository(config);

        switch (componentType) {
            case DynamicsWebApi.SolutionComponent.Entity:
                await metadataApi.retrieveEntities(solution && solution.solutionid ? solution.solutionid : undefined)                
                    .then(entities => entities.forEach(e => options.push(new QuickPickOption(e["LogicalName"], undefined, undefined, { componentId: e["MetadataId"], component: e }))));

                break;
            case DynamicsWebApi.SolutionComponent.OptionSet:
                await metadataApi.retrieveOptionSets(solution && solution.solutionid ? solution.solutionid : undefined)                
                    .then(optionsets => optionsets.forEach(o => options.push(new QuickPickOption(o["Name"], undefined, undefined, { componentId: o["MetadataId"], component: o }))));

                break;
            case DynamicsWebApi.SolutionComponent.PluginAssembly:
                await api.retrievePluginAssemblies(solution && solution.solutionid ? solution.solutionid : undefined)                
                    .then(plugins => plugins.forEach(p => options.push(new QuickPickOption(p["name"], undefined, undefined, { componentId: p["pluginassemblyid"], component: p }))));

                break;
            case DynamicsWebApi.SolutionComponent.WebResource:
                await api.retrieveWebResources(solution && solution.solutionid ? solution.solutionid : undefined, "*")                
                    .then(webresources => webresources.forEach(w => options.push(new QuickPickOption(w["name"], undefined, undefined, { componentId: w["webresourceid"], component: w }))));

                break;
            case DynamicsWebApi.SolutionComponent.Workflow:
                await api.retrieveProcesses(solution && solution.solutionid ? solution.solutionid : undefined)                
                    .then(processes => processes.forEach(p => options.push(new QuickPickOption(p["name"], undefined, undefined, { componentId: p["workflowid"], component: p }))));

                break;
        }

        if (options && options.length > 0) {
            return await this.pick(placeHolder, ...options).then(p => p ? p.context : undefined);
        }

        return null;
    }

    public static async openFile(filename:string): Promise<void> {
        if (FileSystem.exists(filename)) {
            vscode.workspace.openTextDocument(filename).then(d => vscode.window.showTextDocument(d));
        }
    }

    public static async openContent(content:string | Buffer, language:string): Promise<void> {
        if (Buffer.isBuffer(content)) {
            content = content.toString();
        }

        vscode.workspace.openTextDocument({ language, content}).then(d => vscode.window.showTextDocument(d));
    }
}

export class QuickPickOption implements vscode.QuickPickItem {
	constructor(label: string, command?: string, description?: string, context?: any, alwaysShow?:boolean) {
		this.label = label;
		this.command = command;
        this.description = description;
        this.context = context;
        this.alwaysShow = alwaysShow;
    }
    
	label: string;
	command?: string;
	description?: string;
    context?: any;
    detail?: string;
    picked?: boolean;
    alwaysShow?: boolean;

    invokeCommand<T>(...rest:any[]): Thenable<T> {
        if (this.command) {
            return vscode.commands.executeCommand(this.command, rest);
        }

        return null;
    }

	static cancel = new QuickPickOption('Cancel', cs.dynamics.controls.quickPicker.cancel, 'ESC');
	static quit = new QuickPickOption('Close Window', cs.dynamics.controls.quickPicker.quit);
}

export class WorkspaceFileItem { 
    constructor(fsPath:string, itemType:vscode.FileType) {
        this.fsPath = fsPath;
        this.itemType = itemType;
    }

    fsPath: string;
    itemType: vscode.FileType;
}