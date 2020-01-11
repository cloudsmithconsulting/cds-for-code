import * as vscode from 'vscode';
import * as path from 'path';
import * as cs from '../cs';
import { TS } from 'typescript-linq/TS';

import command from '../core/Command';
import Quickly from '../core/Quickly';
import { Utilities } from '../core/Utilities';
import { extensionActivate } from '../core/Extension';
import ExtensionConfiguration from '../core/ExtensionConfiguration';
import ExtensionContext from '../core/ExtensionContext';
import { ExtensionIconThemes } from "../components/WebDownloaders/Types";
import TemplateManager from '../components/Templates/TemplateManager';
import { TemplateItem, TemplateType } from "../components/Templates/Types";


export default class TemplateExplorer implements vscode.TreeDataProvider<TreeEntry> {
	private _onDidChangeTreeData: vscode.EventEmitter<TreeEntry | undefined> = new vscode.EventEmitter<TreeEntry | undefined>();
    readonly onDidChangeTreeData: vscode.Event<TreeEntry | undefined> = this._onDidChangeTreeData.event;

    private static instance: TemplateExplorer;

	private constructor() {
        setTimeout(() => vscode.commands.executeCommand(cs.cds.controls.templateExplorer.refreshEntry), 50);
    }

    static get Instance(): TemplateExplorer {
        if (!TemplateExplorer.instance) {
            TemplateExplorer.instance = new TemplateExplorer();
        }

        return TemplateExplorer.instance;
    }

    @extensionActivate(cs.cds.extension.productId)
    async activate(context: vscode.ExtensionContext) {
        ExtensionConfiguration.notify(cs.cds.configuration.templates._namespace, change => {
            this.refresh();
        });

        ExtensionContext.subscribe(vscode.window.registerTreeDataProvider(cs.cds.viewContainers.templateExplorer, TemplateExplorer.Instance));
    }

    @command(cs.cds.controls.templateExplorer.addEntry, "Add")
    async add(item?: TreeEntry): Promise<void> {
        return await vscode.commands.executeCommand(cs.cds.templates.saveTemplate, undefined, item ? item.context : undefined)
            .then(() => this.refresh(item));
    }

    @command(cs.cds.controls.templateExplorer.clickEntry, "Click")
    async click(item?: TreeEntry) {
        if (item.collapsibleState === vscode.TreeItemCollapsibleState.Collapsed) {
            await this.refresh(item);
            item.collapsibleState = vscode.TreeItemCollapsibleState.Expanded;
        }            
    }

    @command(cs.cds.controls.templateExplorer.createInWorkspace, "Create in Workspace")
    async createFromTemplate(item?: TreeEntry) {
        return await vscode.commands.executeCommand(cs.cds.templates.createFromTemplate, undefined, undefined, item.context);
    }

    @command(cs.cds.controls.templateExplorer.deleteEntry, "Delete")
    async delete(item?: TreeEntry) {
        return await vscode.commands.executeCommand(cs.cds.templates.deleteTemplate, item.context)
            .then(() => this.refresh(item.parent));
    }

    @command(cs.cds.controls.templateExplorer.editEntry, "Edit")
    async edit(item?: TreeEntry): Promise<void> {
    	if (!item) {
            await vscode.commands.executeCommand(cs.cds.templates.editTemplateCatalog);
        } else if (item.context) {
            let file;
            let folder = await TemplateManager.getTemplatesFolder();
    
            if (item.context.type === TemplateType.ItemTemplate) {
                if (path.isAbsolute(item.context.location)) {
                    file = item.context.location;
                    folder = path.dirname(file);
                } else {
                    file = path.join(folder, item.context.location);
                }
    
                await Quickly.openFile(file);
            } else {
                if (path.isAbsolute(item.context.location)) {
                    folder = item.context.location;
                } else {
                    folder = path.join(folder, item.context.location);
                }
    
                const existingFolder = vscode.workspace.workspaceFolders.find(f => f.uri.fsPath === folder);
    
                if (!existingFolder && await Quickly.pickBoolean("Would you like to open this project template in a new workspace folder?", "Yes", "No")) {
                    vscode.workspace.updateWorkspaceFolders(0, 0, { uri: vscode.Uri.file(folder), name: item.context.name });
                }
            }
        }
    }

    @command(cs.cds.controls.templateExplorer.exportEntry, "Export")
    async export(item?: TreeEntry): Promise<void> {
        return await vscode.commands.executeCommand(cs.cds.templates.exportTemplate, item && item.context ? item.context : undefined)
            .then(() => this.refresh(item));
    }

    getTreeItem(element: TreeEntry): vscode.TreeItem {
		return element;
	}

	async getChildren(element?: TreeEntry): Promise<TreeEntry[]> {
        let returnValue:TreeEntry[];

        if (element && element.itemType) {
            const commandPrefix:string = Utilities.String.noSlashes(((element.command && element.command.arguments) || '').toString());
            const catalog = await TemplateManager.getTemplateCatalog();
            const grouping = ExtensionConfiguration.getConfigurationValue(cs.cds.configuration.templates.treeViewGroupPreference);

            switch (element.itemType) {
                case "Folder":
                    const templateTypeFilter = commandPrefix.indexOf("/ProjectTemplates") > -1 ? TemplateType.ProjectTemplate : commandPrefix.indexOf("/ItemTemplates") > -1 ? TemplateType.ItemTemplate : undefined;
                    const templateGroupFilter = commandPrefix.split("/").length >= 3 ? commandPrefix.split("/")[2] : undefined;

                    if (commandPrefix === "/ProjectTemplates" || commandPrefix === "/ItemTemplates") {
                        switch (grouping) {
                            case "Publisher":
                                 returnValue = catalog.queryPublishersByType(templateTypeFilter)
                                    .map(i => TreeEntry.parseFolder(i, undefined, commandPrefix, templateTypeFilter));
                                break;
                            case "Category":
                                returnValue = catalog.queryCategoriesByType(templateTypeFilter)
                                    .map(i => TreeEntry.parseFolder(i, undefined, commandPrefix, templateTypeFilter));
                                break;
                            default:
                                returnValue = catalog.queryByType(templateTypeFilter)
                                    .map(i => TreeEntry.parseTemplate(i, commandPrefix));
                                break;
                        }
                    } else if (commandPrefix.startsWith("/ProjectTemplates") || commandPrefix.startsWith("/ItemTemplates")) {
                        if (templateGroupFilter) {
                            switch (grouping) {
                                case "Publisher":
                                    returnValue = catalog.queryByPublisher(templateTypeFilter, templateGroupFilter)
                                        .map(i => TreeEntry.parseTemplate(i, commandPrefix));
                                    break;
                                case "Category":
                                    returnValue = catalog.queryByCategory(templateTypeFilter, templateGroupFilter)
                                        .map(i => TreeEntry.parseTemplate(i, commandPrefix));
                                    break;
                            }
                        }
                    }
            }
        }

        if (returnValue) {
            return Promise.resolve(returnValue);
        }

        return Promise.resolve(this.getRootEntries());
    }

    @command(cs.cds.controls.templateExplorer.importEntry, "Import")
    async import(item?: TreeEntry): Promise<void> {
        return await vscode.commands.executeCommand(cs.cds.templates.importTemplate, undefined)
            .then(() => this.refresh());
    }

    @command(cs.cds.controls.templateExplorer.openEntry, "Open")
    async open(item?: TreeEntry): Promise<void> {
        await TemplateManager.openTemplateFolderInExplorer(item.context);
    }

    @command(cs.cds.controls.templateExplorer.refreshEntry, "Refresh")
    async refresh(item?:TreeEntry): Promise<void> {
        this._onDidChangeTreeData.fire(item);
    }

	private getRootEntries(): TreeEntry[] {
        return [
            TreeEntry.parseFolder("ProjectTemplates", "Project Templates", "", TemplateType.ProjectTemplate), 
            TreeEntry.parseFolder("ItemTemplates", "Item Templates", "", TemplateType.ItemTemplate)
        ];
    }
}

export class TreeEntryCache {
    private static _instance:TreeEntryCache;

    private _items:TreeEntry[] = [];

    private constructor() { 
    }

    static get Instance(): TreeEntryCache {
        if (!this._instance) {
            this._instance = new TreeEntryCache();
        }

        return this._instance;
    }

   
    AddEntry(entry:TreeEntry): void {
        this._items.push(entry);
    }

    Clear(): void {
        this._items = [];
    }

    get Items(): TS.Linq.Enumerator<TreeEntry> {
        return new TS.Linq.Enumerator(this._items);
    }

    Under(path:string): TS.Linq.Enumerator<TreeEntry> {
        return this.Items.where(item => item.id.startsWith(path));
    }
}

export class TreeEntry extends vscode.TreeItem {
    private static readonly canRefreshEntryTypes:EntryType[] = [ "Folder" ];
    private static readonly canAddEntryTypes:EntryType[] = [ "Folder" ];
    private static readonly canImportEntryTypes:EntryType[] = [ "Folder" ];
    private static readonly canEditEntryTypes:EntryType[] = [ "ProjectTemplate", "ItemTemplate" ];
    private static readonly canDeleteEntryTypes:EntryType[] = [ "ProjectTemplate", "ItemTemplate" ];
    private static readonly canOpenEntryTypes:EntryType[] = [ "ProjectTemplate", "ItemTemplate" ];
    private static readonly canCreateInWorkspaceTypes:EntryType[] = [ "ProjectTemplate", "ItemTemplate" ];
    private static readonly canExportEntryTypes:EntryType[] = [ "ProjectTemplate", "ItemTemplate" ];

    static parseFolder(name: string, displayName: string | undefined, commandPrefix: string, context?:any): TreeEntry {
        return new TreeEntry(
            displayName ? displayName : name, 
            "Folder",
            vscode.TreeItemCollapsibleState.Collapsed,
            undefined,
            {
                command: cs.cds.controls.templateExplorer.clickEntry,
                title: name,
                arguments: [`${commandPrefix}/${name}`]
            },
            context
        );
    }

    static parseTemplate(item: TemplateItem, commandPrefix: string): TreeEntry {
        return new TreeEntry(
            item.displayName, 
            item.type === TemplateType.ProjectTemplate ? "ProjectTemplate" : item.type === TemplateType.ItemTemplate ? "ItemTemplate" : undefined,
            vscode.TreeItemCollapsibleState.None,
            item.description,
            {
                command: cs.cds.controls.templateExplorer.clickEntry,
                title: item.description,
                arguments: [`${commandPrefix}/${item.name}`]
            },
            item
        );
    }

    constructor(
        public label: string,
        public readonly itemType: EntryType,
        public collapsibleState: vscode.TreeItemCollapsibleState,
        public readonly subtext?: string,
        public readonly command?: vscode.Command,
        public readonly context?: any
	) {
        super(label, collapsibleState);
        
        const resolver = ExtensionIconThemes.selected.resolve("~/Resources/icons/", itemType);

        if (resolver) {
            this.iconPath = resolver.iconPath;
        }

        if (command && command.arguments && command.arguments.length > 0) {
            this.id = command.arguments[0].toString();

            // We can't have duplicate ids in the treeview.
            const count = TreeEntryCache.Instance.Items.count(t => t.id === this.id || t.id.startsWith(this.id + "_"));
            
            if (count > 0) {
                this.id += `_${count}`;
            }
        }

        this.contextValue = this.capabilities.join(",");

        TreeEntryCache.Instance.AddEntry(this);
    }

	get tooltip(): string {
		return `${this.label}`;
	}

	get description(): string {
		return this.subtext || this.itemType.toString(); 
    }

    get parent(): TreeEntry {
        if (this.id) {
            const split = this.id.split("/");            
            split.pop();

            if (split.length > 0) {
                const parentId = split.join("/");

                return TreeEntryCache.Instance.Items.first(i => i.id === parentId);
            }
        }

        return null;
    }

    get capabilities(): string[] {
        const returnValue = [];
        
        this.addCapability(returnValue, "canRefreshItem", TreeEntry.canRefreshEntryTypes);
        this.addCapability(returnValue, "canAddItem", TreeEntry.canAddEntryTypes);
        this.addCapability(returnValue, "canEditItem", TreeEntry.canEditEntryTypes);
        this.addCapability(returnValue, "canDeleteItem", TreeEntry.canDeleteEntryTypes);
        this.addCapability(returnValue, "canOpenItem", TreeEntry.canOpenEntryTypes);
        this.addCapability(returnValue, "canCreateInWorkspace", TreeEntry.canCreateInWorkspaceTypes);
        this.addCapability(returnValue, "canImportItem", TreeEntry.canImportEntryTypes);
        this.addCapability(returnValue, "canExportItem", TreeEntry.canExportEntryTypes);

        return returnValue;
    }

    private addCapability(returnList:string[], capabilityName:string, constrain:EntryType[], additionalCheck?:() => boolean): void {
        if (constrain.indexOf(this.itemType) !== -1 && (!additionalCheck || additionalCheck())) {
            returnList.push(capabilityName);
        }
    }
}

export type EntryType = 
    "ProjectTemplate" | 
    "ItemTemplate" |
    "Folder";