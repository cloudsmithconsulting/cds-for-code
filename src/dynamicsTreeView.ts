import * as vscode from 'vscode';
import * as path from 'path';
import DiscoveryRepository from './discoveryRepository';
import ApiRepository from './apiRepository';
import { Utilities } from './Utilities';
import MetadataRepository from './metadataRepository';

export default class DynamicsTreeView {
    public static wireUpCommands(context: vscode.ExtensionContext) {
        // register the provider and connect it to the treeview window
        const treeProvider = new DynamicsServerTreeProvider({
            domain: "CONTOSO",
            username: "Administrator",
            password: "p@ssw0rd",
            webApiUrl: "http://win-oi4mlu9323r/",
            webApiVersion: "v8.0" 
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
    private _connections: DynamicsWebApi.Config[] = [];

	constructor(...options: DynamicsWebApi.Config[]) {
        this.addConnection(...options);
    }
    
    private addConnection(...options: DynamicsWebApi.Config[]): void {
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
                case EntryType.Plugins:
                    return this.getPluginDetails(element, commandPrefix, undefined);
                case EntryType.Entities:
                    return this.getEntityDetails(element, commandPrefix, undefined);
            }
            return; //return nothing if type falls through
        }

        return Promise.resolve(this.getConnections());
    }
    
	getConnections(): TreeEntry[] {
        const result: TreeEntry[] = [];
        
        this._connections.forEach(connection => {
            const displayUrl = connection.webApiUrl.replace("http://", "").replace("https://", "");

            result.push(new TreeEntry(
                displayUrl, 
                EntryType.Connection, 
                vscode.TreeItemCollapsibleState.Collapsed, 
                connection.workstation || connection.domain,
                {
                    command: 'cloudSmith.clickEntry',
                    title: connection.webApiUrl,
                    arguments: [displayUrl]
                },
                connection                
            ));
        });

        return result;
    }
    
    private treeviewCommandError(errorMessage:string, retryFunction:any): void
    {
        vscode.window.showErrorMessage(errorMessage, "Try Again", "Close").then(selectedItem =>
            {
                switch (selectedItem)
                {
                    case "Try Again":
                        if (typeof retryFunction === "function")
                        {
                            retryFunction();
                        }

                        break;
                    case "Close":
                        break;
                }

                Promise.resolve(this);
            });
    }

    getConnectionDetails(element: TreeEntry, commandPrefix?:string): Promise<TreeEntry[]> {
        const connection = element.config;
		const api = new DiscoveryRepository(connection);
        
        return api.retrieveOrganizations()
            .then(orgs => {
                const result : TreeEntry[] = new Array();
                
                for (let i = 0; i < orgs.length; i++) {
                    const org = orgs[i];
                    const versionSplit = org.Version.split('.');

                    // Clone the current connection and override the endpoint and version.
                    const orgConnection = Utilities.Clone<DynamicsWebApi.Config>(connection);

                    orgConnection.webApiUrl = org.ApiUrl;
                    orgConnection.webApiVersion = `v${versionSplit[0]}.${versionSplit[1]}`;

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
                            orgConnection,
                            org)
                    );
                }
                return result;
            })
            .catch(err => {
                console.error(err);

                this.treeviewCommandError(`An error occurred while accessing organizations from ${connection.webApiUrl}`, () => this.getConnectionDetails(element, commandPrefix));

                throw err;
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
                element.config
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
                element.config
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
                element.config
            )
        ];
    }

    getSolutionDetails(element: TreeEntry, commandPrefix?:string): Promise<TreeEntry[]> {
		const api = new ApiRepository(element.config);
        
        return api.retrieveSolutions()
            .then(solutions => {
                const result : TreeEntry[] = new Array();
                for (let i = 0; i < solutions.length; i++) {
                    const solution: any = solutions[i];
                    result.push(
                        new TreeEntry(
                            solution.friendlyname, 
                            EntryType.Solution,
                            vscode.TreeItemCollapsibleState.None,
                            `v${solution.version} ${solution.ismanaged_formatted}`, 
                            {
                                command: 'cloudSmith.clickEntry',
                                title: solution.friendlyname,
                                arguments: [`${commandPrefix || ''}/${solution.solutionid}`]
                            },
                            element.config,
                            solution)
                    );
                }
                return result;
            })
            .catch(err => {
                console.error(err);

                this.treeviewCommandError(`An error occurred while retrieving solutions from ${element.config.webApiUrl}`, () => this.getSolutionDetails(element, commandPrefix));

                return null;
            });
    }

    getPluginDetails(element: TreeEntry, commandPrefix?: string, solutionId?: string): Thenable<TreeEntry[]> {
		const api = new ApiRepository(element.config);
        
        return api.retrievePluginAssemblies(solutionId)
            .then(plugins => {
                const result : TreeEntry[] = new Array();
                for (let i = 0; i < plugins.length; i++) {
                    const plugin: any = plugins[i];
                    result.push(
                        new TreeEntry(
                            plugin.name, 
                            EntryType.Plugin,
                            vscode.TreeItemCollapsibleState.None,
                            `v${plugin.version} (${plugin.publickeytoken})`, 
                            {
                                command: 'cloudSmith.clickEntry',
                                title: plugin.friendlyname,
                                arguments: [`${commandPrefix || ''}/${plugin.pluginassemblyid}`]
                            },
                            element.config,
                            plugin)
                    );
                }
                return result;
            })
            .catch(err => {
                console.error(err);

                this.treeviewCommandError(`An error occurred while retrieving plug-in assemblies from ${element.config.webApiUrl}`, () => this.getPluginDetails(element, commandPrefix, solutionId));

                return null;
            });
    }

    getEntityDetails(element: TreeEntry, commandPrefix?: string, solutionId?: string): Thenable<TreeEntry[]> {
		const api = new MetadataRepository(element.config);
        
        return api.retrieveEntities(solutionId)
            .then(entities => {
                const result : TreeEntry[] = new Array();
                
                for (let i = 0; i < entities.length; i++) {
                    const entity = entities[i];

                    result.push(
                        new TreeEntry(
                            entity.DisplayName, 
                            EntryType.Entity,
                            vscode.TreeItemCollapsibleState.None,
                            entity.LogicalName, 
                            {
                                command: 'cloudSmith.clickEntry',
                                title: entity.DisplayName,
                                arguments: [`${commandPrefix || ''}/${entity.LogicalName}`]
                            },
                            element.config,
                            entity)
                    );
                }
                return result;
            })
            .catch(err => {
                console.error(err);

                this.treeviewCommandError(`An error occurred while retrieving entities from ${element.config.webApiUrl}`, () => this.getEntityDetails(element, commandPrefix, solutionId));

                return null;
            });
    }
}

class TreeEntry extends vscode.TreeItem {

	constructor(
        public readonly label: string,
        public readonly itemType: EntryType,
        public readonly collapsibleState: vscode.TreeItemCollapsibleState,
        public readonly subtext?: string,
        public readonly command?: vscode.Command,
        public readonly config?: DynamicsWebApi.Config,
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
            case EntryType.Entity:
                    this.iconPath = {
                        light: path.join(__filename, '..', '..', 'resources', 'light', 'object-ungroup.svg'),
                        dark: path.join(__filename, '..', '..', 'resources', 'dark', 'object-ungroup.svg')
                    };
                break;
            case EntryType.Plugins:
            case EntryType.Plugin:
                  this.iconPath = {
                        light: path.join(__filename, '..', '..', 'resources', 'light', 'plug.svg'),
                        dark: path.join(__filename, '..', '..', 'resources', 'dark', 'plug.svg')
                    };
                break;
            case EntryType.Solutions:
            case EntryType.Solution:
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
    Entity = "Entity",
    Plugin = "Plugin",
    Solution = "Solution",
    Entry = "Entry"
}