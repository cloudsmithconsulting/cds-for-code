import * as vscode from 'vscode';
import * as cs from '../cs';
import { TS } from 'typescript-linq/TS';
import IWireUpCommands from '../wireUpCommand';
import { ExtensionIconThemes } from '../commands/iconLoader';
import ExtensionConfiguration from '../config/ExtensionConfiguration';
import Utilities from '../helpers/Utilities';
import TemplateManager from '../controls/Templates/TemplateManager';
import { TemplateItem, TemplateType } from "../controls/Templates/Types";

import refreshEntry from '../commands/cs.dynamics.controls.templateTreeView.refreshEntry';
import addEntry from '../commands/cs.dynamics.controls.templateTreeView.addEntry';
import editEntry from '../commands/cs.dynamics.controls.templateTreeView.editEntry';
import deleteEntry from '../commands/cs.dynamics.controls.templateTreeView.deleteEntry';
import clickEntry from '../commands/cs.dynamics.controls.templateTreeView.clickEntry';
import createInWorkspace from '../commands/cs.dynamics.controls.templateTreeView.createInWorkspace';
import openEntry from '../commands/cs.dynamics.controls.templateTreeView.openEntry';

export default class TemplateTreeView implements IWireUpCommands {
    public static Instance:TemplateTreeViewProvider;

    public wireUpCommands(context: vscode.ExtensionContext, config?: vscode.WorkspaceConfiguration) {
        if (!TemplateTreeView.Instance) {
            TemplateTreeView.Instance = new TemplateTreeViewProvider(context);
            vscode.window.registerTreeDataProvider(cs.dynamics.viewContainers.templateExplorer, TemplateTreeView.Instance);
        }
        
        // setup commands
        context.subscriptions.push(
            vscode.commands.registerCommand(cs.dynamics.controls.templateTreeView.refreshEntry, refreshEntry.bind(TemplateTreeView.Instance)),
            vscode.commands.registerCommand(cs.dynamics.controls.templateTreeView.addEntry, addEntry.bind(TemplateTreeView.Instance)),
            vscode.commands.registerCommand(cs.dynamics.controls.templateTreeView.editEntry, editEntry.bind(TemplateTreeView.Instance)),
            vscode.commands.registerCommand(cs.dynamics.controls.templateTreeView.deleteEntry, deleteEntry.bind(TemplateTreeView.Instance)),
            vscode.commands.registerCommand(cs.dynamics.controls.templateTreeView.clickEntry, clickEntry.bind(TemplateTreeView.Instance)),
            vscode.commands.registerCommand(cs.dynamics.controls.templateTreeView.createInWorkspace, createInWorkspace.bind(TemplateTreeView.Instance)),
            vscode.commands.registerCommand(cs.dynamics.controls.templateTreeView.openEntry, openEntry.bind(TemplateTreeView.Instance))
        );
    }
}

export class TemplateTreeViewProvider implements vscode.TreeDataProvider<TreeEntry> {
	private _onDidChangeTreeData: vscode.EventEmitter<TreeEntry | undefined> = new vscode.EventEmitter<TreeEntry | undefined>();
    readonly onDidChangeTreeData: vscode.Event<TreeEntry | undefined> = this._onDidChangeTreeData.event;
    private _context: vscode.ExtensionContext;

	constructor(context: vscode.ExtensionContext) {
        this._context = context;
    }

    public getTreeItem(element: TreeEntry): vscode.TreeItem {
		return element;
	}

	public async getChildren(element?: TreeEntry): Promise<TreeEntry[]> {
        let returnValue:TreeEntry[];

        if (element && element.itemType) {
            const commandPrefix:string = Utilities.RemoveTrailingSlash(((element.command && element.command.arguments) || '').toString());
            const catalog = await TemplateManager.getTemplateCatalog();
            const grouping = ExtensionConfiguration.getConfigurationValue(cs.dynamics.configuration.templates.treeViewGroupPreference);

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

    public refresh(item?:TreeEntry): void {
        this._onDidChangeTreeData.fire(item);
    }

	private getRootEntries(): TreeEntry[] {
        ExtensionConfiguration.notify(cs.dynamics.configuration.templates._namespace, change => {
            this.refresh();
        });

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
    private static readonly canEditEntryTypes:EntryType[] = [ "ProjectTemplate", "ItemTemplate" ];
    private static readonly canDeleteEntryTypes:EntryType[] = [ "ProjectTemplate", "ItemTemplate" ];
    private static readonly canOpenEntryTypes:EntryType[] = [ "ProjectTemplate", "ItemTemplate" ];
    private static readonly canCreateInWorkspaceTypes:EntryType[] = [ "ProjectTemplate", "ItemTemplate" ];

    static parseFolder(name: string, displayName: string, commandPrefix: string, context?:any): TreeEntry {
        return new TreeEntry(
            displayName ? displayName : name, 
            "Folder",
            vscode.TreeItemCollapsibleState.Collapsed,
            undefined,
            {
                command: cs.dynamics.controls.templateTreeView.clickEntry,
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
                command: cs.dynamics.controls.templateTreeView.clickEntry,
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
        
        const resolver = ExtensionIconThemes.selected.resolve("../../../Resources/icons/", itemType);

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