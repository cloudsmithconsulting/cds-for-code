import * as vscode from 'vscode';
import { TS } from 'typescript-linq/TS';
import * as cs from '../cs';
import IWireUpCommands from '../wireUpCommand';
import { DynamicsWebApi } from '../api/Types';
import { ExtensionIconThemes } from '../commands/iconLoader';
import Utilities from '../helpers/Utilities';

export default class TemplateTreeView implements IWireUpCommands {
    public static Instance:TemplateTreeViewProvider;

    public wireUpCommands(context: vscode.ExtensionContext, config?: vscode.WorkspaceConfiguration) {
        const isNew = !TemplateTreeView.Instance;        
        const treeProvider = isNew ? new TemplateTreeViewProvider(context) : TemplateTreeView.Instance;

        if (isNew) {
            TemplateTreeView.Instance = treeProvider;
            vscode.window.registerTreeDataProvider(cs.dynamics.viewContainers.templateExplorer, treeProvider);        
        }
        
        // setup commands
        context.subscriptions.push(
            vscode.commands.registerCommand(cs.dynamics.controls.templateTreeView.refreshEntry, (item?: TreeEntry) => {
                treeProvider.refresh(item);
            })
        );
    }
}

class TemplateTreeViewProvider implements vscode.TreeDataProvider<TreeEntry> {
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
        if (element && element.itemType) {
            const commandPrefix:string = Utilities.RemoveTrailingSlash(((element.command && element.command.arguments) || '').toString());

            switch (element.itemType) {
                case "Folder":
                    return;
            }
        }

        return Promise.resolve(this.getRootEntries());
    }

    public refresh(item?:TreeEntry): void {
        this._onDidChangeTreeData.fire(item);
    }

	private getRootEntries(): TreeEntry[] {
        const result: TreeEntry[] = [];
        
        result.push(new TreeEntry(
            "Project Templates", 
            "Folder", 
            vscode.TreeItemCollapsibleState.Collapsed, 
            undefined,
            {
                command: cs.dynamics.controls.templateTreeView.clickEntry,
                title: "Project Templates",
                arguments: ["/ProjectTemplates"]
            },
            undefined
        ));

        result.push(new TreeEntry(
            "Item Templates", 
            "Folder", 
            vscode.TreeItemCollapsibleState.Collapsed, 
            undefined,
            {
                command: cs.dynamics.controls.templateTreeView.clickEntry,
                title: "Item Templates",
                arguments: ["/ItemTemplates"]
            },
            undefined
        ));

        return result;
    }
}

class TreeEntryCache {
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

class TreeEntry extends vscode.TreeItem {
    private static readonly canRefreshEntryTypes:EntryType[] = [ "Folder" ];
    private static readonly canAddEntryTypes:EntryType[] = [ "ProjectTemplate", "ItemTemplate" ];
    private static readonly canEditEntryTypes:EntryType[] = [ "ProjectTemplate", "ItemTemplate" ];
    private static readonly canDeleteEntryTypes:EntryType[] = [ "ProjectTemplate", "ItemTemplate" ];

    constructor(
        label: string,
        readonly itemType: EntryType,
        collapsibleState: vscode.TreeItemCollapsibleState,
        readonly subtext?: string,
        readonly command?: vscode.Command,
        readonly context?: any
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

    get folder(): string {
        if (this.itemType === "Folder" && this.id && this.context && this.context.innerType) {
            var index = this.id.lastIndexOf(`${this.context.innerType.toString()}/`);

            return this.id.substring(index + this.context.innerType.toString().length + 1);
        } else if (this.parent && this.parent.itemType === "Folder" && this.parent.id) {
            return this.parent.folder;
        }

        return '';
    }

    get capabilities(): string[] {
        const returnValue = [];
        
        this.addCapability(returnValue, "canRefreshItem", TreeEntry.canRefreshEntryTypes);
        this.addCapability(returnValue, "canAddItem", TreeEntry.canAddEntryTypes);
        this.addCapability(returnValue, "canEditItem", TreeEntry.canEditEntryTypes);
        this.addCapability(returnValue, "canDeleteItem", TreeEntry.canDeleteEntryTypes);

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