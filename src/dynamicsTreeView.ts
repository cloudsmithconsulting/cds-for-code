import * as vscode from 'vscode';
import * as path from 'path';

export default class DynamicsTreeView {
    public static wireUpCommands(context: vscode.ExtensionContext) {
        // register the provider and connect it to the treeview window
        const treeProvider = new DynamicsServerTreeProvider();
        vscode.window.registerTreeDataProvider('dynamicsConnectionsView', treeProvider);
        
        // setup commands
        context.subscriptions.push(
            vscode.commands.registerCommand('cloudSmith.refreshEntry', () => treeProvider.refresh()) // <-- no semi-colon, comma starts next command registration

            , vscode.commands.registerCommand('cloudSmith.clickEntry', (name) => { // Match name of command to package.json command
                // Run command code
                vscode.window.showInformationMessage(
                    `cloudSmith.clickEntry ${name || ''}`
                );
            }) // <-- no semi-colon, comma starts next command registration
            
            , vscode.commands.registerCommand('cloudSmith.deleteEntry', () => { // Match name of command to package.json command
                // Run command code
                vscode.window.showInformationMessage(
                    'cloudSmith.deleteEntry'
                );
            }) // <-- no semi-colon, comma starts next command registration
    
            , vscode.commands.registerCommand('cloudSmith.editEntry', () => { // Match name of command to package.json command
                // Run command code
                vscode.window.showInformationMessage(
                    'cloudSmith.editEntry'
                );
            }) // <-- no semi-colon, comma starts next command registration
        );
    }
}

class DynamicsServerTreeProvider implements vscode.TreeDataProvider<TreeEntry> {

	private _onDidChangeTreeData: vscode.EventEmitter<TreeEntry | undefined> = new vscode.EventEmitter<TreeEntry | undefined>();
	readonly onDidChangeTreeData: vscode.Event<TreeEntry | undefined> = this._onDidChangeTreeData.event;

	constructor() {
	}

	refresh(): void {
		this._onDidChangeTreeData.fire();
	}

	getTreeItem(element: TreeEntry): vscode.TreeItem {
		return element;
	}

	getChildren(element?: TreeEntry): Thenable<TreeEntry[]> {
        if (element && element !== undefined) {
            switch (element.itemType) {
                case "connection":
                    return Promise.resolve(this.getConnectionDetails());
                case "entitycontainer":
                    return Promise.resolve(this.getEntities());
            }
        }

        return Promise.resolve(this.getConnections());
	}

	getConnections(): TreeEntry[] {
		return [
			new TreeEntry('Connection 1', 'connection', vscode.TreeItemCollapsibleState.Collapsed, {
                command: 'cloudSmith.clickEntry',
                title: 'Hello!',
                arguments: ['Connection 1']
            }),
			new TreeEntry('Connection 2', 'connection', vscode.TreeItemCollapsibleState.None, {
                command: 'cloudSmith.clickEntry',
                title: 'Hello!',
                arguments: ['Connection 2']
            }),
            new TreeEntry('Connection 3', 'connection', vscode.TreeItemCollapsibleState.None, {
                command: 'cloudSmith.clickEntry',
                title: 'Hello!',
                arguments: ['Connection 3']
            }),
            new TreeEntry('Connection 4', 'connection', vscode.TreeItemCollapsibleState.Collapsed, {
                command: 'cloudSmith.clickEntry',
                title: 'Hello!',
                arguments: ['Connection 4']
            }),
            new TreeEntry('Connection 5', 'connection', vscode.TreeItemCollapsibleState.None, {
                command: 'cloudSmith.clickEntry',
                title: 'Hello!',
                arguments: ['Connection 5']
            })
		];
    }
    
    getConnectionDetails(): TreeEntry[] {
		return [
			new TreeEntry('Entities', 'entitycontainer', vscode.TreeItemCollapsibleState.Collapsed, {
                command: 'cloudSmith.clickEntry',
                title: 'Hello!',
                arguments: ['Entities']
            }),
			new TreeEntry('Plugins', 'serveritem', vscode.TreeItemCollapsibleState.None, {
                command: 'cloudSmith.clickEntry',
                title: 'Hello!',
                arguments: ['Plugins']
            })
		];
    }
    
    getEntities(): TreeEntry[] {
		return [
			new TreeEntry('Account', 'enitity', vscode.TreeItemCollapsibleState.None, {
                command: 'cloudSmith.clickEntry',
                title: 'Hello!',
                arguments: ['Account']
            }),
            new TreeEntry('Contact', 'enitity', vscode.TreeItemCollapsibleState.None, {
                command: 'cloudSmith.clickEntry',
                title: 'Hello!',
                arguments: ['Contact']
            }),
            new TreeEntry('Lead', 'enitity', vscode.TreeItemCollapsibleState.None, {
                command: 'cloudSmith.clickEntry',
                title: 'Hello!',
                arguments: ['Lead']
            })
		];
	}
}

class TreeEntry extends vscode.TreeItem {

	constructor(
        public readonly label: string,
        public readonly itemType: string,
		public readonly collapsibleState: vscode.TreeItemCollapsibleState,
		public readonly command?: vscode.Command
	) {
        super(label, collapsibleState);
        this.contextValue = itemType;
	}

	get tooltip(): string {
		return `${this.label}`;
	}

	get description(): string {
		return 'Some description';
	}

	iconPath = {
		light: path.join(__filename, '..', '..', 'resources', 'light', 'dependency.svg'),
		dark: path.join(__filename, '..', '..', 'resources', 'dark', 'dependency.svg')
	};
}