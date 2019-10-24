import * as vscode from 'vscode';
import * as path from 'path';
import { TS } from 'typescript-linq/TS';
import DiscoveryRepository from '../repositories/discoveryRepository';
import ApiRepository from '../repositories/apiRepository';
import { Utilities } from '../helpers/Utilities';
import MetadataRepository from '../repositories/metadataRepository';
import * as cs from '../cs';
import { IWireUpCommands } from '../wireUpCommand';
import { DynamicsUrlResolver } from '../api/DynamicsUrlResolver';
import ExtensionConfiguration from '../helpers/ExtensionConfiguration';
import { IDictionary, Dictionary } from '../helpers/Dictionary';

export default class DynamicsTreeView implements IWireUpCommands {
    public static Instance:DynamicsServerTreeProvider;

    public wireUpCommands(context: vscode.ExtensionContext, config?: vscode.WorkspaceConfiguration) {
        const isNew = !DynamicsTreeView.Instance;        
        const treeProvider = isNew ? new DynamicsServerTreeProvider(context) : DynamicsTreeView.Instance;

        if (isNew) {
            DynamicsTreeView.Instance = treeProvider;
            vscode.window.registerTreeDataProvider(cs.dynamics.viewContainers.connections, treeProvider);        
        }
        
        // setup commands
        context.subscriptions.push(
            vscode.commands.registerCommand(cs.dynamics.controls.treeView.refreshEntry, (item?: TreeEntry) => {
                treeProvider.refresh(item);
            }) // <-- no semi-colon, comma starts next command registration
            , vscode.commands.registerCommand(cs.dynamics.controls.treeView.addConnection, (config: DynamicsWebApi.Config) => {
                // add the connection and refresh treeview
                treeProvider.addConnection(config);

                vscode.window.showInformationMessage(config.id ? `Updated Dynamics Connection: ${config.webApiUrl}` : `Added Dynamics Connection: ${config.webApiUrl}`);
            }) // <-- no semi-colon, comma starts next command registration
            , vscode.commands.registerCommand(cs.dynamics.controls.treeView.clickEntry, (label?: string) => { // Match name of command to package.json command
                // Run command code
                vscode.window.showInformationMessage(`Clicked ${label || ''}`);
            }) // <-- no semi-colon, comma starts next command registration
            , vscode.commands.registerCommand(cs.dynamics.controls.treeView.deleteEntry, (item: TreeEntry) => { // Match name of command to package.json command
                // Run command code
                treeProvider.removeConnection(item.config);

                vscode.window.showInformationMessage(`Delete Dynamics Connection: ${item.config.webApiUrl}`);
            }) // <-- no semi-colon, comma starts next command registration
            , vscode.commands.registerCommand(cs.dynamics.controls.treeView.inspectEntry, (item: TreeEntry) => { // Match name of command to package.json command
                vscode.commands.executeCommand(cs.dynamics.controls.jsonInspector.inspect, item.context);
            }) // <-- no semi-colon, comma starts next command registration
            , vscode.commands.registerCommand(cs.dynamics.controls.treeView.addEntry, (item: TreeEntry) => { // Match name of command to package.json command
                if (!item)
                {
                    vscode.commands.executeCommand(cs.dynamics.controls.treeView.openConnection);

                    return;
                }

                let retryFunction = () => vscode.commands.executeCommand(cs.dynamics.controls.treeView.addEntry, item);

                switch (item.itemType)
                {
                    case EntryType.Solutions:
                        Utilities.OpenWindow(DynamicsUrlResolver.getManageSolutionUri(item.config), retryFunction);
                        break;
                }
            })   
            , vscode.commands.registerCommand(cs.dynamics.controls.treeView.editEntry, (item: TreeEntry) => { // Match name of command to package.json command
                let retryFunction = () => vscode.commands.executeCommand(cs.dynamics.controls.treeView.editEntry, item);

                switch (item.itemType)
                {
                    case EntryType.Connection:
                        vscode.commands.executeCommand(cs.dynamics.controls.treeView.openConnection, item.config);
                        break;
                    case EntryType.Solution:
                        Utilities.OpenWindow(DynamicsUrlResolver.getManageSolutionUri(item.config, item.context.solutionid), retryFunction);
                        break;
                    case EntryType.Entity:
                        Utilities.OpenWindow(DynamicsUrlResolver.getManageEntityUri(item.config, item.context.MetadataId, item.solutionId), retryFunction);
                        break;
                    case EntryType.Process:
                        Utilities.OpenWindow(DynamicsUrlResolver.getManageBusinessProcessUri(item.config, DynamicsUrlResolver.parseProcessType(item.context.category), item.context.workflowid, item.solutionId), retryFunction);
                        break;
                    case EntryType.Attribute:
                        Utilities.OpenWindow(DynamicsUrlResolver.getManageAttributeUri(item.config, item.parent.context.MetadataId, item.context.MetadataId, item.solutionId), retryFunction);
                        break;
                    case EntryType.Form:
                        Utilities.OpenWindow(DynamicsUrlResolver.getManageEntityFormUri(item.config, item.parent.context.ObjectTypeCode, DynamicsUrlResolver.parseFormType(item.context.type), item.context.formid, item.solutionId || item.context.solutionid), retryFunction);
                        break;
                    case EntryType.View:
                        Utilities.OpenWindow(DynamicsUrlResolver.getManageEntityViewUri(item.config, item.parent.context.MetadataId, item.context.savedqueryid, item.solutionId), retryFunction);
                        break;                    
                }
           }) // <-- no semi-colon, comma starts next command registration
        );
    }
}

class DynamicsServerTreeProvider implements vscode.TreeDataProvider<TreeEntry> {

	private _onDidChangeTreeData: vscode.EventEmitter<TreeEntry | undefined> = new vscode.EventEmitter<TreeEntry | undefined>();
    readonly onDidChangeTreeData: vscode.Event<TreeEntry | undefined> = this._onDidChangeTreeData.event;
    private _connections: DynamicsWebApi.Config[] = [];
    private _context: vscode.ExtensionContext;

	constructor(context: vscode.ExtensionContext) {
        this._context = context;
        this._connections = DiscoveryRepository.getConnections(context);

        if (this._connections && this._connections.length > 0) {
            this.refresh();
        }
    }

    public getTreeItem(element: TreeEntry): vscode.TreeItem {
		return element;
	}

	public getChildren(element?: TreeEntry): Thenable<TreeEntry[]> {
        if (element) {
            const commandPrefix:string = Utilities.RemoveTrailingSlash(((element.command && element.command.arguments) || '').toString());

            switch (element.itemType) {
                case EntryType.Connection:
                    return this.getConnectionDetails(element, commandPrefix);
                case EntryType.Organization:
                    return Promise.resolve(this.getSolutionLevelDetails(element, commandPrefix));
                case EntryType.Solutions:
                    return this.getSolutionDetails(element, commandPrefix);
                case EntryType.Solution:
                    return Promise.resolve(this.getSolutionLevelDetails(element, commandPrefix));
                case EntryType.Processes:
                    return this.getProcessDetails(element, commandPrefix, element.context);
                case EntryType.Plugins:
                    return this.getPluginDetails(element, commandPrefix, element.context);
                case EntryType.Entities:
                    return this.getEntityDetails(element, commandPrefix, element.context);
                case EntryType.OptionSets:
                    return this.getOptionSetDetails(element, commandPrefix, element.context);
                case EntryType.WebResources:
                    return this.getWebResourcesDetails(element, commandPrefix, element.context);
                case EntryType.Entity:
                    return Promise.resolve(this.getEntityLevelDetails(element, commandPrefix));
                case EntryType.Attributes:
                    return this.getEntityAttributeDetails(element, commandPrefix, element.context);
                case EntryType.Views:
                    return this.getEntityViewDetails(element, commandPrefix, element.context);
                case EntryType.Forms:
                    return this.getEntityFormDetails(element, commandPrefix, element.context);
            }

            return; //return nothing if type falls through
        }

        return Promise.resolve(this.getConnectionEntries());
    }

    public addConnection(...options: DynamicsWebApi.Config[]): void {
        options.forEach(o => {
            // Make sure the connection has an id
            if (!o.id) {
                // give this an id
                o.id = Utilities.NewGuid();
                // add it to the list
                this._connections.push(o); 
            } else {
                const updateIndex = this._connections.findIndex(c => c.id === o.id);
                this._connections[updateIndex] = o;
            }
        });

        // save to state
        DiscoveryRepository.saveConnections(this._context, this._connections);

        // refresh the treeview
        this.refresh();
    }

    public getConnections():DynamicsWebApi.Config[]
    {
        return this._connections;
    }

    public removeConnection(connection: DynamicsWebApi.Config): void {
        const removeIndex = this._connections.findIndex(c => c.webApiUrl === connection.webApiUrl);
        
        if (removeIndex >= 0) {
            this._connections.splice(removeIndex, 1);
            DiscoveryRepository.saveConnections(this._context, this._connections);
            this.refresh();
        }
    }

    public refresh(item?:TreeEntry): void {
        this._onDidChangeTreeData.fire(item);
    }

	private getConnectionEntries(): TreeEntry[] {
        const result: TreeEntry[] = [];
        
        this._connections.forEach(connection => {
            const displayName = (connection.name)
                ? connection.name
                : connection.webApiUrl.replace("http://", "").replace("https://", "");

            result.push(new TreeEntry(
                displayName, 
                EntryType.Connection, 
                vscode.TreeItemCollapsibleState.Collapsed, 
                connection.workstation || connection.domain,
                {
                    command: cs.dynamics.controls.treeView.clickEntry,
                    title: connection.webApiUrl,
                    arguments: [connection.webApiUrl]
                },
                connection                
            ));
        });

        return result;
    }
    
    private getConnectionDetails(element: TreeEntry, commandPrefix?:string): Promise<TreeEntry[]> {
        const connection = element.config;
		const api = new DiscoveryRepository(connection);
        const returnValue = this.createTreeEntries(api.retrieveOrganizations(), 
            org =>  new TreeEntry(
                org.FriendlyName, 
                EntryType.Organization,
                vscode.TreeItemCollapsibleState.Collapsed,
                org.Version, 
                {
                    command: cs.dynamics.controls.treeView.clickEntry,
                    title: org.FriendlyName,
                    arguments: [`${commandPrefix || ''}/${org.Id}`]
                },
                DiscoveryRepository.createOrganizationConnection(org, connection),
                org),
            `An error occurred while accessing organizations from ${connection.webApiUrl}`, 
            () => this.getConnectionDetails(element, commandPrefix));

        return returnValue;
    }

    private getSolutionLevelDetails(element: TreeEntry, commandPrefix?:string) : TreeEntry[] {
        let returnObject = [];
        const showDefaultSolution = ExtensionConfiguration.getConfigurationValue<boolean>(cs.dynamics.configuration.explorer.showDefaultSolution);
        
        if (element.itemType === EntryType.Solution || showDefaultSolution) {
            returnObject.push(new TreeEntry(
                'Entities',
                EntryType.Entities,
                vscode.TreeItemCollapsibleState.Collapsed, 
                null,
                {
                    command: cs.dynamics.controls.treeView.clickEntry,
                    title: 'Entities',
                    arguments: [`${commandPrefix || ''}/Entities`]
                },
                element.config,
                element.itemType === EntryType.Solution ? element.context : undefined
            ));

            returnObject.push(new TreeEntry(
                'Option Sets',
                EntryType.OptionSets,
                vscode.TreeItemCollapsibleState.Collapsed, 
                null,
                {
                    command: cs.dynamics.controls.treeView.clickEntry,
                    title: 'OptionSets',
                    arguments: [`${commandPrefix || ''}/OptionSets`]
                },
                element.config,
                element.itemType === EntryType.Solution ? element.context : undefined
            ));

            returnObject.push(new TreeEntry(
                'Processes',
                EntryType.Processes,
                vscode.TreeItemCollapsibleState.Collapsed, 
                null,
                {
                    command: cs.dynamics.controls.treeView.clickEntry,
                    title: 'Processes',
                    arguments: [`${commandPrefix || ''}/Processes`]
                },
                element.config,
                element.itemType === EntryType.Solution ? element.context : undefined
            ));

            returnObject.push(new TreeEntry(
                'Web Resources',
                EntryType.WebResources,
                vscode.TreeItemCollapsibleState.Collapsed, 
                null,
                {
                    command: cs.dynamics.controls.treeView.clickEntry,
                    title: 'Web Resources',
                    arguments: [`${commandPrefix || ''}/WebResources`]
                },
                element.config,
                element.itemType === EntryType.Solution ? element.context : undefined
            ));

            returnObject.push(new TreeEntry(
                'Plugins',
                EntryType.Plugins,
                vscode.TreeItemCollapsibleState.Collapsed, 
                null,
                {
                    command: cs.dynamics.controls.treeView.clickEntry,
                    title: 'Plugins',
                    arguments: [`${commandPrefix || ''}/Plugins`]
                },
                element.config,
                element.itemType === EntryType.Solution ? element.context : undefined
            ));
        }

        if (element.itemType !== EntryType.Solution)
        {
            returnObject.push(
                new TreeEntry(
                    'Solutions',
                    EntryType.Solutions,
                    vscode.TreeItemCollapsibleState.Collapsed, 
                    null,
                    {
                        command: cs.dynamics.controls.treeView.clickEntry,
                        title: 'Solutions',
                        arguments: [`${commandPrefix || ''}/Solutions`]
                    },
                    element.config
                ));
        }

        return returnObject;
    }

    private getEntityLevelDetails(element: TreeEntry, commandPrefix?:string) : TreeEntry[] {
        let returnObject = [];
        
        returnObject.push(new TreeEntry(
            'Attributes',
            EntryType.Attributes,
            vscode.TreeItemCollapsibleState.Collapsed, 
            null,
            {
                command: cs.dynamics.controls.treeView.clickEntry,
                title: 'Attributes',
                arguments: [`${commandPrefix || ''}/Attributes`]
            },
            element.config,
            element.itemType === EntryType.Entity ? element.context : undefined
        ));

        returnObject.push(new TreeEntry(
            'Views',
            EntryType.Views,
            vscode.TreeItemCollapsibleState.Collapsed, 
            null,
            {
                command: cs.dynamics.controls.treeView.clickEntry,
                title: 'Views',
                arguments: [`${commandPrefix || ''}/Views`]
            },
            element.config,
            element.itemType === EntryType.Entity ? element.context : undefined
        ));

        returnObject.push(new TreeEntry(
            'Forms',
            EntryType.Forms,
            vscode.TreeItemCollapsibleState.Collapsed, 
            null,
            {
                command: cs.dynamics.controls.treeView.clickEntry,
                title: 'Forms',
                arguments: [`${commandPrefix || ''}/Forms`]
            },
            element.config,
            element.itemType === EntryType.Entity ? element.context : undefined
        ));

        return returnObject;
    }

    private getSolutionDetails(element: TreeEntry, commandPrefix?:string): Promise<TreeEntry[]> {
		const api = new ApiRepository(element.config);
        const returnValue = this.createTreeEntries(
            api.retrieveSolutions(), 
            solution => new TreeEntry(
                solution.friendlyname, 
                EntryType.Solution,
                vscode.TreeItemCollapsibleState.Collapsed,
                `v${solution.version} (${solution.ismanaged ? "Managed" :  "Unmanaged"})`, 
                {
                    command: cs.dynamics.controls.treeView.clickEntry,
                    title: solution.friendlyname,
                    arguments: [`${commandPrefix || ''}/${solution.solutionid}`]
                },
                element.config,
                solution),
            `An error occurred while retrieving solutions from ${element.config.webApiUrl}`, 
            () => this.getSolutionDetails(element, commandPrefix));

        return returnValue;
    }

    private getPluginDetails(element: TreeEntry, commandPrefix?: string, solution?: any): Thenable<TreeEntry[]> {
		const api = new ApiRepository(element.config);
        const returnValue = this.createTreeEntries(
            api.retrievePluginAssemblies(solution ? solution.solutionid : undefined), 
            plugin => new TreeEntry(
                plugin.name, 
                EntryType.Plugin,
                vscode.TreeItemCollapsibleState.None,
                `v${plugin.version} (${plugin.publickeytoken})`, 
                {
                    command: cs.dynamics.controls.treeView.clickEntry,
                    title: plugin.friendlyname,
                    arguments: [`${commandPrefix || ''}/${plugin.pluginassemblyid}`]
                },
                element.config,
                plugin),
            `An error occurred while retrieving plug-in assemblies from ${element.config.webApiUrl}`,
            () => this.getPluginDetails(element, commandPrefix, solution));

        return returnValue;
    }

    private getWebResourcesDetails(element: TreeEntry, commandPrefix?: string, solution?: any): Thenable<TreeEntry[]> {
		const api = new ApiRepository(element.config);
        const returnValue = this.createTreeEntries(
            api.retrieveWebResources(solution ? solution.solutionid : undefined), 
            webresource => new TreeEntry(
                webresource.name, 
                EntryType.WebResource,
                vscode.TreeItemCollapsibleState.None,
                webresource.displayname, 
                {
                    command: cs.dynamics.controls.treeView.clickEntry,
                    title: webresource.displayname,
                    arguments: [`${commandPrefix || ''}/${webresource.webresourceid}`]
                },
                element.config,
                webresource),
            `An error occurred while retrieving web resources from ${element.config.webApiUrl}`, 
            () => this.getWebResourcesDetails(element, commandPrefix, solution));

        return returnValue;
    }

    private getProcessDetails(element: TreeEntry, commandPrefix?: string, solution?: any): Thenable<TreeEntry[]> {
		const api = new ApiRepository(element.config);
        const returnValue = this.createTreeEntries(
            api.retrieveProcesses(solution ? solution.solutionid : undefined), 
            process => new TreeEntry(
                process.name, 
                EntryType.Process,
                vscode.TreeItemCollapsibleState.None,
                DynamicsUrlResolver.parseProcessType(process.category).toString(), 
                {
                    command: cs.dynamics.controls.treeView.clickEntry,
                    title: process.displayname,
                    arguments: [`${commandPrefix || ''}/${process.workflowid}`]
                },
                element.config,
                process),
            `An error occurred while retrieving business processes from ${element.config.webApiUrl}`,
            () => this.getProcessDetails(element, commandPrefix, solution));

        return returnValue;
    }

    private getOptionSetDetails(element: TreeEntry, commandPrefix?: string, solution?: any): Thenable<TreeEntry[]> {
		const api = new MetadataRepository(element.config);
        const returnValue = this.createTreeEntries(
            api.retrieveOptionSets(solution ? solution.solutionid : undefined), 
            optionSet => {
                let displayName = optionSet.DisplayName && optionSet.DisplayName.LocalizedLabels && optionSet.DisplayName.LocalizedLabels.length > 0 ? optionSet.DisplayName.LocalizedLabels[0].Label : "";

                return new TreeEntry(
                    displayName,
                    EntryType.OptionSet,
                    vscode.TreeItemCollapsibleState.Collapsed,
                    optionSet.Name, 
                    {
                        command: cs.dynamics.controls.treeView.clickEntry,
                        title: displayName,
                        arguments: [`${commandPrefix || ''}/${optionSet.Name}`]
                    },
                    element.config,
                    optionSet);
            },
            `An error occurred while retrieving option sets from ${element.config.webApiUrl}`,
            () => this.getOptionSetDetails(element, commandPrefix, solution));
    
        return returnValue;
    }

    private getEntityDetails(element: TreeEntry, commandPrefix?: string, solution?: any): Thenable<TreeEntry[]> {
		const api = new MetadataRepository(element.config);
        const returnValue = this.createTreeEntries(
            api.retrieveEntities(solution ? solution.solutionid : undefined), 
            entity => {
                let displayName = entity.DisplayName && entity.DisplayName.LocalizedLabels && entity.DisplayName.LocalizedLabels.length > 0 ? entity.DisplayName.LocalizedLabels[0].Label : "";

                return new TreeEntry(
                    displayName,
                    EntryType.Entity,
                    vscode.TreeItemCollapsibleState.Collapsed,
                    entity.LogicalName, 
                    {
                        command: cs.dynamics.controls.treeView.clickEntry,
                        title: displayName,
                        arguments: [`${commandPrefix || ''}/${entity.LogicalName}`]
                    },
                    element.config,
                    entity);
            },
            `An error occurred while retrieving entities from ${element.config.webApiUrl}`,
            () => this.getEntityDetails(element, commandPrefix, solution));
    
        return returnValue;
    }

    private getEntityAttributeDetails(element: TreeEntry, commandPrefix?: string, entity?:any): Thenable<TreeEntry[]> {
        const api = new MetadataRepository(element.config);
        const returnValue = this.createTreeEntries(
            api.retrieveAttributes(entity.MetadataId), 
            attribute => {
                let displayName = attribute.DisplayName && attribute.DisplayName.LocalizedLabels && attribute.DisplayName.LocalizedLabels.length > 0 ? attribute.DisplayName.LocalizedLabels[0].Label : "";

                return new TreeEntry(
                    displayName,
                    EntryType.Attribute,
                    vscode.TreeItemCollapsibleState.None,
                    attribute.LogicalName, 
                    {
                        command: cs.dynamics.controls.treeView.clickEntry,
                        title: displayName,
                        arguments: [`${commandPrefix || ''}/${attribute.LogicalName}`]
                    },
                    element.config,
                    attribute);
            },
            `An error occurred while retrieving attributes from ${element.config.webApiUrl}`,
            () => this.getEntityAttributeDetails(element, commandPrefix, entity));

        return returnValue;
    }

    private getEntityViewDetails(element: TreeEntry, commandPrefix?: string, entity?:any): Thenable<TreeEntry[]> {
        const api = new MetadataRepository(element.config);
        const returnValue = this.createTreeEntries(
            api.retrieveViews(entity.LogicalName), 
            query => new TreeEntry(
                query.name,
                EntryType.View,
                vscode.TreeItemCollapsibleState.None,
                query.description, 
                {
                    command: cs.dynamics.controls.treeView.clickEntry,
                    title: query.name,
                    arguments: [`${commandPrefix || ''}/${query.savedqueryid}`]
                },
                element.config,
                query),
            `An error occurred while retrieving views from ${element.config.webApiUrl}`,
            () => this.getEntityViewDetails(element, commandPrefix, entity));
            
        return returnValue;
    }

    private getEntityFormDetails(element: TreeEntry, commandPrefix?: string, entity?:any): Thenable<TreeEntry[]> {
        const api = new MetadataRepository(element.config);
        const returnValue = this.createTreeEntries(
            api.retrieveForms(entity.LogicalName), 
            form => new TreeEntry(
                form.name,
                EntryType.Form,
                vscode.TreeItemCollapsibleState.None,
                form.description, 
                {
                    command: cs.dynamics.controls.treeView.clickEntry,
                    title: form.name,
                    arguments: [`${commandPrefix || ''}/${form.formid}`]
                },
                element.config,
                form),
            `An error occurred while retrieving forms from ${element.config.webApiUrl}`,
            () => this.getEntityFormDetails(element, commandPrefix, entity));

        return returnValue;
    }

    private createTreeEntries(whenComplete: Promise<any[]>, parser: (item: any) => TreeEntry, errorMessage?:string, retryFunction?:any): Promise<TreeEntry[]>
    {
        return whenComplete
            .then(items => {
                const result : TreeEntry[] = new Array();

                if (!items)
                {
                    return;
                }

                for (let i = 0; i < items.length; i++) {
                    const item: any = items[i];

                    result.push(parser(item));
                }

                return result;
            })
            .catch(err => {
                console.error(err.innererror ? err.innererror : err);

                if (errorMessage && retryFunction)
                {
                    Utilities.RetryWithMessage(errorMessage, retryFunction);
                }

                return null;
            });
    }
}

class TreeEntryCache
{
    private static _instance:TreeEntryCache;
    private _items:TreeEntry[] = [];

    private constructor() { 
    }

    static get Instance(): TreeEntryCache
    {
        if (!this._instance) {
            this._instance = new TreeEntryCache();
        }

        return this._instance;
    }

    AddEntry(entry:TreeEntry): void
    {
        this._items.push(entry);
    }

    Clear(): void
    {
        this._items = [];
    }

    get Items(): TS.Linq.Enumerator<TreeEntry>
    {
        return new TS.Linq.Enumerator(this._items);
    }

    Under(path:string): TS.Linq.Enumerator<TreeEntry>
    {
        return this.Items.where(item => item.id.startsWith(path));
    }
}
class IconResolver
{
    public readonly iconPath: { light: string | vscode.Uri; dark: string | vscode.Uri } = null;

    constructor(
        public readonly lightPath: string,
        public readonly darkPath: string
    )
    {
        this.iconPath = {
            light: path.join(__filename, ...lightPath.split("/")),
            dark: path.join(__filename, ...darkPath.split("/"))
        };
    }

}

class TreeEntry extends vscode.TreeItem {
    private static _icons = new Dictionary<string, IconResolver>([
        { key: "Connection", value: new IconResolver("../../../resources/icons/light/server.svg", "../../../resources/icons/dark/server.svg") },
        { key: "Organization", value: new IconResolver("../../../resources/icons/light/dependency.svg", "../../../resources/icons/dark/dependency.svg") },
        { key: "Entities", value: new IconResolver("../../../resources/icons/light/object-ungroup.svg", "../../../resources/icons/dark/object-ungroup.svg") },
        { key: "Entity", value: new IconResolver("../../../resources/icons/light/object-ungroup.svg", "../../../resources/icons/dark/object-ungroup.svg") },
        { key: "Plugins", value: new IconResolver("../../../resources/icons/light/plug.svg", "../../../resources/icons/dark/plug.svg") },
        { key: "Plugin", value: new IconResolver("../../../resources/icons/light/plug.svg", "../../../resources/icons/dark/plug.svg") },
        { key: "Solutions", value: new IconResolver("../../../resources/icons/light/puzzle-piece.svg", "../../../resources/icons/dark/puzzle-piece.svg") },
        { key: "Solution", value: new IconResolver("../../../resources/icons/light/puzzle-piece.svg", "../../../resources/icons/dark/puzzle-piece.svg") },
    ]);

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
        
        if (TreeEntry._icons.containsKey(itemType.toString())) {
            this.iconPath = TreeEntry._icons[itemType.toString()].iconPath;
        }

        if (command && command.arguments && command.arguments.length > 0)
        {
            this.id = command.arguments[0].toString();
        }

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

    get solutionId(): string {
        if (this.id)
        {
            const split = this.id.split("/");
            const index = split.indexOf("Solutions");
            
            if (index >= 0) {
                return split[index + 1];
            }        
        }
       
        return undefined;
    }
}

enum EntryType {
    Connection = "Connection",
    Organization = "Organization",
    Entities = "Entities",
    OptionSets = "OptionSets",
    WebResources = "WebResources",
    Plugins = "Plugins",
    Processes = "Processes",
    Solutions = "Solutions",
    Entity = "Entity",
    OptionSet = "OptionSet",
    WebResource = "WebResource",
    Plugin = "Plugin",
    Process = "Process",
    Solution = "Solution",
    Attributes = "Attributes",
    Views = "Views",
    Forms = "Forms",
    Attribute = "Attribute",
    View = "View",
    Form = "Form",
    Entry = "Entry",
    Entries = "Entries"
}