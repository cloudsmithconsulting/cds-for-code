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
import { TemplateType } from "../components/Templates/Types";
import Dictionary from '../core/types/Dictionary';

export default class TemplateExplorer implements vscode.TreeDataProvider<TemplateExplorerEntry> {
	private _onDidChangeTreeData: vscode.EventEmitter<TemplateExplorerEntry | undefined> = new vscode.EventEmitter<TemplateExplorerEntry | undefined>();
    readonly onDidChangeTreeData: vscode.Event<TemplateExplorerEntry | undefined> = this._onDidChangeTreeData.event;

    private static instance: TemplateExplorer;

	private constructor() { }

    static get Instance(): TemplateExplorer {
        if (!TemplateExplorer.instance) {
            TemplateExplorer.instance = new TemplateExplorer();
        }

        return TemplateExplorer.instance;
    }

    private static readonly parsers = new Dictionary<TemplateExplorerEntryType, (item: any, element?: TemplateExplorerEntry, ...rest: any[]) => TemplateExplorerEntry>([
        { key: "Folder", value: (folder, element) => element.createChildItem("Folder", folder, folder, folder, vscode.TreeItemCollapsibleState.Collapsed, folder) },
        { key: "ProjectTemplate", value: (item, element) => element.createChildItem("ProjectTemplate", item.name, item.displayName, item.description, vscode.TreeItemCollapsibleState.None, item) },
        { key: "ItemTemplate", value: (item, element) => element.createChildItem("ItemTemplate", item.name, item.displayName, item.description, vscode.TreeItemCollapsibleState.None, item) }
    ]);

    @extensionActivate(cs.cds.extension.productId)
    async activate(context: vscode.ExtensionContext) {
        ExtensionConfiguration.notify(cs.cds.configuration.templates._namespace, change => {
            this.refresh();
        });

        ExtensionContext.subscribe(vscode.window.registerTreeDataProvider(cs.cds.viewContainers.templateExplorer, TemplateExplorer.Instance));
    }

    @command(cs.cds.controls.templateExplorer.addEntry, "Add")
    async add(item?: TemplateExplorerEntry): Promise<void> {
        return await vscode.commands.executeCommand(cs.cds.templates.saveTemplate, undefined, item ? item.context : undefined)
            .then(() => this.refresh(item));
    }

    @command(cs.cds.controls.templateExplorer.clickEntry, "Click")
    async click(item?: TemplateExplorerEntry) {
        if (item.collapsibleState === vscode.TreeItemCollapsibleState.Collapsed) {
            await this.refresh(item);
            item.collapsibleState = vscode.TreeItemCollapsibleState.Expanded;
        }            
    }

    @command(cs.cds.controls.templateExplorer.createInWorkspace, "Create in Workspace")
    async createFromTemplate(item?: TemplateExplorerEntry) {
        return await vscode.commands.executeCommand(cs.cds.templates.createFromTemplate, undefined, undefined, item.context);
    }

    @command(cs.cds.controls.templateExplorer.deleteEntry, "Delete")
    async delete(item?: TemplateExplorerEntry) {
        return await vscode.commands.executeCommand(cs.cds.templates.deleteTemplate, item.context)
            .then(() => this.refresh(item.parent));
    }

    @command(cs.cds.controls.templateExplorer.editEntry, "Edit")
    async edit(item?: TemplateExplorerEntry): Promise<void> {
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
    async export(item?: TemplateExplorerEntry): Promise<void> {
        return await vscode.commands.executeCommand(cs.cds.templates.exportTemplate, item && item.context ? item.context : undefined)
            .then(() => this.refresh(item));
    }

    getTreeItem(element: TemplateExplorerEntry): vscode.TreeItem {
		return element;
	}

	async getChildren(element?: TemplateExplorerEntry): Promise<TemplateExplorerEntry[]> {
        let returnValue:TemplateExplorerEntry[];

        if (element && element.itemType) {
            const commandPrefix:string = Utilities.String.noSlashes(element.id);
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
                                    .map(i => TemplateExplorer.parsers["Folder"](i, element));
                                break;
                            case "Category":
                                returnValue = catalog.queryCategoriesByType(templateTypeFilter)
                                    .map(i => TemplateExplorer.parsers["Folder"](i, element));
                                break;
                            default:
                                returnValue = catalog.queryByType(templateTypeFilter)
                                    .map(i => TemplateExplorer.parsers[i.type === TemplateType.ProjectTemplate ? "ProjectTemplate" : "ItemTemplate"](i, element));
                                break;
                        }
                    } else if (commandPrefix.startsWith("/ProjectTemplates") || commandPrefix.startsWith("/ItemTemplates")) {
                        if (templateGroupFilter) {
                            switch (grouping) {
                                case "Publisher":
                                    returnValue = catalog.queryByPublisher(templateTypeFilter, templateGroupFilter)
                                        .map(i => TemplateExplorer.parsers[i.type === TemplateType.ProjectTemplate ? "ProjectTemplate" : "ItemTemplate"](i, element));
                                    break;
                                case "Category":
                                    returnValue = catalog.queryByCategory(templateTypeFilter, templateGroupFilter)
                                        .map(i => TemplateExplorer.parsers[i.type === TemplateType.ProjectTemplate ? "ProjectTemplate" : "ItemTemplate"](i, element));
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
    async import(item?: TemplateExplorerEntry): Promise<void> {
        return await vscode.commands.executeCommand(cs.cds.templates.importTemplate, undefined)
            .then(() => this.refresh());
    }

    @command(cs.cds.controls.templateExplorer.openEntry, "Open")
    async open(item?: TemplateExplorerEntry): Promise<void> {
        await TemplateManager.openTemplateFolderInExplorer(item.context);
    }

    @command(cs.cds.controls.templateExplorer.refreshEntry, "Refresh")
    refresh(item?:TemplateExplorerEntry): void {
        if (TemplateExplorer.instance) {
            TemplateExplorer.instance._onDidChangeTreeData.fire(item);
        }
    }

	private getRootEntries(): TemplateExplorerEntry[] {
        return [
            new TemplateExplorerEntry(undefined, "Folder", "/ProjectTemplates", "Project Templates", undefined, vscode.TreeItemCollapsibleState.Collapsed, TemplateType.ProjectTemplate),
            new TemplateExplorerEntry(undefined, "Folder", "/ItemTemplates", "Item Templates", undefined, vscode.TreeItemCollapsibleState.Collapsed, TemplateType.ItemTemplate),
        ];
    }
}

export class TreeEntryCache {
    private static _instance:TreeEntryCache;

    private _items:TemplateExplorerEntry[] = [];

    private constructor() { 
    }

    static get Instance(): TreeEntryCache {
        if (!this._instance) {
            this._instance = new TreeEntryCache();
        }

        return this._instance;
    }

   
    AddEntry(entry:TemplateExplorerEntry): void {
        this._items.push(entry);
    }

    Clear(): void {
        this._items = [];
    }

    get Items(): TS.Linq.Enumerator<TemplateExplorerEntry> {
        return new TS.Linq.Enumerator(this._items);
    }

    Under(path:string): TS.Linq.Enumerator<TemplateExplorerEntry> {
        return this.Items.where(item => item.id.startsWith(path));
    }
}

export class TemplateExplorerEntry extends vscode.TreeItem {
    private static readonly canRefreshEntryTypes:TemplateExplorerEntryType[] = [ "Folder" ];
    private static readonly canAddEntryTypes:TemplateExplorerEntryType[] = [ "Folder" ];
    private static readonly canImportEntryTypes:TemplateExplorerEntryType[] = [ "Folder" ];
    private static readonly canEditEntryTypes:TemplateExplorerEntryType[] = [ "ProjectTemplate", "ItemTemplate" ];
    private static readonly canDeleteEntryTypes:TemplateExplorerEntryType[] = [ "ProjectTemplate", "ItemTemplate" ];
    private static readonly canOpenEntryTypes:TemplateExplorerEntryType[] = [ "ProjectTemplate", "ItemTemplate" ];
    private static readonly canCreateInWorkspaceTypes:TemplateExplorerEntryType[] = [ "ProjectTemplate", "ItemTemplate" ];
    private static readonly canExportEntryTypes:TemplateExplorerEntryType[] = [ "ProjectTemplate", "ItemTemplate" ];

    constructor(
        parentItem: TemplateExplorerEntry,
        public readonly itemType: TemplateExplorerEntryType,
        readonly id: string,
        public label: string,
        public readonly subtext?: string,
        public collapsibleState: vscode.TreeItemCollapsibleState = vscode.TreeItemCollapsibleState.None,
        public readonly context?: any
	) {
        super(label, collapsibleState);
        
        const resolver = ExtensionIconThemes.selected.resolve("~/Resources/icons/", itemType);

        if (resolver) {
            this.iconPath = resolver.iconPath;
        }

        if (id) {
            if (parentItem) {
                id = `${Utilities.String.noTrailingSlash(parentItem.id)}/${id}`;
            } 

            // We can't have duplicate ids in the treeview.
            const count = TreeEntryCache.Instance.Items.count(t => t.id === id || t.id && t.id.startsWith(id + "_"));
            
            if (count > 0) {
                id += `_${count}`;
            }

            this.command = { command: cs.cds.controls.templateExplorer.clickEntry, title: this.subtext || this.label, arguments: [ this ] };
            this.id = id;
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

    get parent(): TemplateExplorerEntry {
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
        
        this.addCapability(returnValue, "canRefreshItem", TemplateExplorerEntry.canRefreshEntryTypes);
        this.addCapability(returnValue, "canAddItem", TemplateExplorerEntry.canAddEntryTypes);
        this.addCapability(returnValue, "canEditItem", TemplateExplorerEntry.canEditEntryTypes);
        this.addCapability(returnValue, "canDeleteItem", TemplateExplorerEntry.canDeleteEntryTypes);
        this.addCapability(returnValue, "canOpenItem", TemplateExplorerEntry.canOpenEntryTypes);
        this.addCapability(returnValue, "canCreateInWorkspace", TemplateExplorerEntry.canCreateInWorkspaceTypes);
        this.addCapability(returnValue, "canImportItem", TemplateExplorerEntry.canImportEntryTypes);
        this.addCapability(returnValue, "canExportItem", TemplateExplorerEntry.canExportEntryTypes);

        return returnValue;
    }

    /**
     * Creates a child item underneath the current tree entry with the specified properties.
     *
     * @param {TemplateExplorerEntryType} itemType The type of node to create
     * @param {string} id The sub-identifier of the node, the parent identifier will automatically be prefixed.
     * @param {string} label The label to display on the new tree item.
     * @param {string} [subtext] The subtext (description) to display on the new tree item.
     * @param {vscode.TreeItemCollapsibleState} [collapsibleState=vscode.TreeItemCollapsibleState.None] The current collapsible state of the child item, defaults to none.
     * @param {*} [context] A context object (if any) to associate with the new tree item.
     * @returns {TemplateExplorerEntry}
     * @memberof TreeEntry
     */
    createChildItem(itemType: TemplateExplorerEntryType, id: string, label: string, subtext?: string, collapsibleState: vscode.TreeItemCollapsibleState = vscode.TreeItemCollapsibleState.None, context?: any): TemplateExplorerEntry {
        return new TemplateExplorerEntry(this, itemType, id, label, subtext, collapsibleState, context);
    }

    private addCapability(returnList:string[], capabilityName:string, constrain:TemplateExplorerEntryType[], additionalCheck?:() => boolean): void {
        if (constrain.indexOf(this.itemType) !== -1 && (!additionalCheck || additionalCheck())) {
            returnList.push(capabilityName);
        }
    }
}

export type TemplateExplorerEntryType = 
    "ProjectTemplate" | 
    "ItemTemplate" |
    "Folder";