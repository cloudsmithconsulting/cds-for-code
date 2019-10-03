import * as vscode from 'vscode';
import * as path from 'path';

export default class DynamicsTreeView {
    public static wireUpCommands(context: vscode.ExtensionContext) {
        // register the provider and connect it to the treeview window
        const treeProvider = new DynamicsServerTreeProvider(vscode.workspace.rootPath || '');
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

class DynamicsServerTreeProvider implements vscode.TreeDataProvider<ConnectionEntry> {

	private _onDidChangeTreeData: vscode.EventEmitter<ConnectionEntry | undefined> = new vscode.EventEmitter<ConnectionEntry | undefined>();
	readonly onDidChangeTreeData: vscode.Event<ConnectionEntry | undefined> = this._onDidChangeTreeData.event;

	constructor(private workspaceRoot: string) {
	}

	refresh(): void {
		this._onDidChangeTreeData.fire();
	}

	getTreeItem(element: ConnectionEntry): vscode.TreeItem {
		return element;
	}

	getChildren(element?: ConnectionEntry): Thenable<ConnectionEntry[]> {
		if (!this.workspaceRoot) {
			vscode.window.showInformationMessage('No dependency in empty workspace');
			return Promise.resolve([]);
		}
		return Promise.resolve(this.sampleData());
	}

	sampleData(): ConnectionEntry[] {
		return [
			new ConnectionEntry('Connection 1', vscode.TreeItemCollapsibleState.None, {
                command: 'cloudSmith.clickEntry',
                title: 'Hello!',
                arguments: ['Connection 1']
            }),
			new ConnectionEntry('Connection 2', vscode.TreeItemCollapsibleState.None, {
                command: 'cloudSmith.clickEntry',
                title: 'Hello!',
                arguments: ['Connection 2']
            }),
            new ConnectionEntry('Connection 3', vscode.TreeItemCollapsibleState.None, {
                command: 'cloudSmith.clickEntry',
                title: 'Hello!',
                arguments: ['Connection 3']
            }),
            new ConnectionEntry('Connection 4', vscode.TreeItemCollapsibleState.None, {
                command: 'cloudSmith.clickEntry',
                title: 'Hello!',
                arguments: ['Connection 4']
            }),
            new ConnectionEntry('Connection 5', vscode.TreeItemCollapsibleState.None, {
                command: 'cloudSmith.clickEntry',
                title: 'Hello!',
                arguments: ['Connection 5']
            })
		];
	}
}

class ConnectionEntry extends vscode.TreeItem {

	constructor(
        public readonly label: string,
		public readonly collapsibleState: vscode.TreeItemCollapsibleState,
		public readonly command?: vscode.Command
	) {
		super(label, collapsibleState);
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

	contextValue = 'dependency';

}