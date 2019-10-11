import * as vscode from 'vscode';
import * as path from 'path';
import { ConnectionOptions, AuthenticationType } from './Dynamics/DynamicsRequest';
import DiscoveryRepository from './discoveryRepository';
import ApiRepository from './apiRepository';
import { Utilities } from './Utilities';

export default class DynamicsTreeView {
    public static wireUpCommands(context: vscode.ExtensionContext) {
        // register the provider and connect it to the treeview window
        const treeProvider = new DynamicsServerTreeProvider({
            authType: AuthenticationType.Windows,
            domain: "CONTOSO",
            username: "Administrator",
            password: "p@ssw0rd",
            serverUrl: "http://win-oi4mlu9323r/",
            webApiVersion: "v9.0" 
        });

        vscode.window.registerTreeDataProvider('dynamicsConnectionsView', treeProvider);
        
        // setup commands
        context.subscriptions.push(
            vscode.commands.registerCommand('cloudSmith.refreshEntry', () => treeProvider.refresh()) // <-- no semi-colon, comma starts next command registration

            , vscode.commands.registerCommand('cloudSmith.clickEntry', (name?:string) => { // Match name of command to package.json command
                // Run command code
                vscode.window.showInformationMessage(`Clicked ${name || ''}`);
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
    private _connections: ConnectionOptions[] = [];

	constructor(...options: ConnectionOptions[]) {
        this.addConnection(...options);
    }
    
    private addConnection(...options: ConnectionOptions[]): void {
        options.forEach(o => {
            this._connections.push(o); 
        });
    }

	refresh(): void {
		this._onDidChangeTreeData.fire();
	}

	getTreeItem(element: TreeEntry): vscode.TreeItem {

		return element;
	}

	getChildren(element?: TreeEntry): Thenable<TreeEntry[]> {
        if (element) {
            const commandPrefix:string = Utilities.RemoveTrailingSlash(((element.command && element.command.arguments) || '').toString());

            switch (element.itemType) {
                case EntryType.Connection:
                    return this.getConnectionDetails(element, commandPrefix);
                case EntryType.Organization:
                    return Promise.resolve(this.getOrganizationDetails(element, commandPrefix));
                case EntryType.Solutions:
                    return this.getSolutionDetails(element, commandPrefix);
            }
            return; //return nothing if type falls through
        }

        return Promise.resolve(this.getConnections());
    }

	getConnections(): TreeEntry[] {

        const result: TreeEntry[] = [];
        
        this._connections.forEach(connection => {
            result.push(new TreeEntry(
                connection.serverUrl, 
                EntryType.Connection, 
                vscode.TreeItemCollapsibleState.Collapsed, 
                connection.domain,
                {
                    command: 'cloudSmith.clickEntry',
                    title: connection.serverUrl,
                    arguments: [connection.serverUrl.replace("http://", "").replace("https://", "")]
                },
                connection
            ));
        });

        return result;
    }
    
    getConnectionDetails(element: TreeEntry, commandPrefix?:string): Promise<TreeEntry[]> {
        const connection = element.context;
		const api = new DiscoveryRepository(connection);
        
        return api.retrieveOrganizations()
            .then(orgs => {
                const result : TreeEntry[] = new Array();
                for (let i = 0; i < orgs.length; i++) {
                    const org = orgs[i];

                    const versionSplit = org.Version.split('.');
                    const version = `v${versionSplit[0]}.${versionSplit[1]}`;
                    
                    const orgConnection = new ConnectionOptions();
                    orgConnection.authType = connection.authType;
                    orgConnection.domain = connection.domain;
                    orgConnection.username = connection.username;
                    orgConnection.password = connection.password;
                    orgConnection.workstation = connection.workstation;
                    orgConnection.serverUrl = org.ApiUrl;
                    orgConnection.webApiVersion = version;

                    result.push(
                        new TreeEntry(
                            org.FriendlyName, 
                            EntryType.Organization,
                            vscode.TreeItemCollapsibleState.Collapsed,
                            org.Version, 
                            {
                                command: 'cloudSmith.clickEntry',
                                title: org.FriendlyName,
                                arguments: [`${commandPrefix || ''}/${org.Id}`]
                            },
                            orgConnection)
                    );
                }
                return result;
            })
            .catch(err => {
                throw err;
            });
    }

    getSolutionDetails(element: TreeEntry, commandPrefix?:string): Promise<TreeEntry[]> {
        const connection = element.context;
		const api = new ApiRepository(connection);
        
        return api.retrieveSolutions()
            .then(solutions => {
                const result : TreeEntry[] = new Array();
                for (let i = 0; i < solutions.length; i++) {
                    const solution: any = solutions[i];
                    result.push(
                        new TreeEntry(
                            solution.friendlyname, 
                            EntryType.Entry,
                            vscode.TreeItemCollapsibleState.None,
                            `v${solution.version} ${solution.ismanaged_formatted}`, 
                            {
                                command: 'cloudSmith.clickEntry',
                                title: solution.friendlyname,
                                arguments: [`${commandPrefix || ''}/${solution.solutionid}`]
                            },
                            solution)
                    );
                }
                return result;
            });
    }

    getOrganizationDetails(element: TreeEntry, commandPrefix?:string) : TreeEntry[] {
        return [
            new TreeEntry(
                'Entities',
                EntryType.Entities,
                vscode.TreeItemCollapsibleState.Collapsed, 
                null,
                {
                    command: 'cloudSmith.clickEntry',
                    title: 'Entities',
                    arguments: [`${commandPrefix || ''}/Entities`]
                },
                element.context
            ),
            new TreeEntry(
                'Plugins',
                EntryType.Plugins,
                vscode.TreeItemCollapsibleState.Collapsed, 
                null,
                {
                    command: 'cloudSmith.clickEntry',
                    title: 'Plugins',
                    arguments: [`${commandPrefix || ''}/Plugins`]
                },
                element.context
            ),
            new TreeEntry(
                'Solutions',
                EntryType.Solutions,
                vscode.TreeItemCollapsibleState.Collapsed, 
                null,
                {
                    command: 'cloudSmith.clickEntry',
                    title: 'Solutions',
                    arguments: [`${commandPrefix || ''}/Solutions`]
                },
                element.context
            )
        ];
    }
}

class TreeEntry extends vscode.TreeItem {

	constructor(
        public readonly label: string,
        public readonly itemType: EntryType,
        public readonly collapsibleState: vscode.TreeItemCollapsibleState,
        public readonly subtext?: string,
        public readonly command?: vscode.Command,
        public readonly context?: any
	) {
        super(label, collapsibleState);
        this.contextValue = itemType.toString();

        switch (itemType) {
            case EntryType.Connection:
                    this.iconPath = {
                        light: path.join(__filename, '..', '..', 'resources', 'light', 'server.svg'),
                        dark: path.join(__filename, '..', '..', 'resources', 'dark', 'server.svg')
                    };
                break;
            case EntryType.Organization:
                  this.iconPath = {
                        light: path.join(__filename, '..', '..', 'resources', 'light', 'dependency.svg'),
                        dark: path.join(__filename, '..', '..', 'resources', 'dark', 'dependency.svg')
                    };
                break;
            case EntryType.Entities:
                    this.iconPath = {
                        light: path.join(__filename, '..', '..', 'resources', 'light', 'object-ungroup.svg'),
                        dark: path.join(__filename, '..', '..', 'resources', 'dark', 'object-ungroup.svg')
                    };
                break;
            case EntryType.Plugins:
                  this.iconPath = {
                        light: path.join(__filename, '..', '..', 'resources', 'light', 'plug.svg'),
                        dark: path.join(__filename, '..', '..', 'resources', 'dark', 'plug.svg')
                    };
                break;
            case EntryType.Solutions:
                  this.iconPath = {
                        light: path.join(__filename, '..', '..', 'resources', 'light', 'puzzle-piece.svg'),
                        dark: path.join(__filename, '..', '..', 'resources', 'dark', 'puzzle-piece.svg')
                    };
                break;
        }
	}

	get tooltip(): string {
		return `${this.label}`;
	}

	get description(): string {
		return this.subtext || this.itemType.toString(); 
	}
}

enum EntryType {
    Connection = "Connection",
    Organization = "Organization",
    Entities = "Entities",
    Plugins = "Plugins",
    Solutions = "Solutions",
    Entry = "Entry"
}