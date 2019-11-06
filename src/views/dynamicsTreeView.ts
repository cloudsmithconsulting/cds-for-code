import * as vscode from 'vscode';
import { TS } from 'typescript-linq/TS';
import DiscoveryRepository from '../repositories/discoveryRepository';
import ApiRepository from '../repositories/apiRepository';
import Utilities from '../helpers/Utilities';
import MetadataRepository from '../repositories/metadataRepository';
import * as cs from '../cs';
import IWireUpCommands from '../wireUpCommand';
import DynamicsUrlResolver from '../api/DynamicsUrlResolver';
import ExtensionConfiguration from '../config/ExtensionConfiguration';
import { DynamicsWebApi } from '../api/Types';
import { ExtensionIconThemes } from '../commands/iconLoader';
import QuickPicker from '../helpers/QuickPicker';

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
            })
            , vscode.commands.registerCommand(cs.dynamics.controls.treeView.addConnection, (config: DynamicsWebApi.Config) => {
                treeProvider.addConnection(config);
            })
            , vscode.commands.registerCommand(cs.dynamics.controls.treeView.clickEntry, (label?: string) => { // Match name of command to package.json command
                vscode.window.showInformationMessage(`Clicked ${label || ''}`);
            }) 
            , vscode.commands.registerCommand(cs.dynamics.controls.treeView.deleteEntry, (item: TreeEntry) => { // Match name of command to package.json command
               treeProvider.removeConnection(item.config);
            }) 
            , vscode.commands.registerCommand(cs.dynamics.controls.treeView.inspectEntry, (item: TreeEntry) => { // Match name of command to package.json command
                vscode.commands.executeCommand(cs.dynamics.controls.jsonInspector.inspect, item.context);
            }) 
            , vscode.commands.registerCommand(cs.dynamics.controls.treeView.addEntryToSolution, (item: TreeEntry) => { // Match name of command to package.json command
                if (item.solutionId) {
                    vscode.window.showInformationMessage(`The component ${item.label} is already a part of a solution.`);

                    return;
                }

                let componentId:string;
                let componentType:DynamicsWebApi.SolutionComponent;

                switch (item.itemType) {
                    case "Plugin":
                        componentType = DynamicsWebApi.SolutionComponent.PluginAssembly;
                        componentId = item.context.pluginassemblyid;

                        break;
                    case "WebResource":
                        componentType = DynamicsWebApi.SolutionComponent.WebResource;
                        componentId = item.context.webresourceid;

                        break;
                    case "Process":
                        componentType = DynamicsWebApi.SolutionComponent.Workflow;
                        componentId = item.context.workflowid;

                        break;
                    case "Entity":
                        componentType = DynamicsWebApi.SolutionComponent.Entity;
                        componentId = item.context.MetadataId;

                        break;
                    case "OptionSet":
                        componentType = DynamicsWebApi.SolutionComponent.OptionSet;
                        componentId = item.context.MetadataId;

                        break;
                    }

                    if (componentId && componentType) {
                        return vscode.commands.executeCommand(cs.dynamics.deployment.addSolutionComponent, item.config, undefined, componentId, componentType)
                            .then(response => {
                                const solutionPath = item.id.split("/").slice(0, 4);
                                solutionPath.push("Solutions");
                                solutionPath.push((<any>response).solutionid);

                                treeProvider.refreshSolution(solutionPath.join("/")); 
                            });
                    }

            }) 
            , vscode.commands.registerCommand(cs.dynamics.controls.treeView.removeEntryFromSolution, (item: TreeEntry) => { // Match name of command to package.json command
                if (!item.solutionId) {
                    vscode.window.showInformationMessage(`The component ${item.label} is not part of a solution.`);

                    return;
                }

                let componentId:string;
                let componentType:DynamicsWebApi.SolutionComponent;

                switch (item.itemType) {
                    case "Plugin":
                        componentType = DynamicsWebApi.SolutionComponent.PluginAssembly;
                        componentId = item.context.pluginassemblyid;

                        break;
                    case "WebResource":
                        componentType = DynamicsWebApi.SolutionComponent.WebResource;
                        componentId = item.context.webresourceid;

                        break;
                    case "Process":
                        componentType = DynamicsWebApi.SolutionComponent.Workflow;
                        componentId = item.context.workflowid;

                        break;
                    case "Entity":
                        componentType = DynamicsWebApi.SolutionComponent.Entity;
                        componentId = item.context.MetadataId;

                        break;
                    case "OptionSet":
                        componentType = DynamicsWebApi.SolutionComponent.OptionSet;
                        componentId = item.context.MetadataId;

                        break;
                }

                if (!Utilities.IsNullOrEmpty(item.solutionPath)) {
                    const solutions = TreeEntryCache.Instance.Items.where(i => i.id === item.solutionPath).toArray();
                    
                    if (solutions && solutions.length > 0 && componentId && componentType) {
                        return vscode.commands.executeCommand(cs.dynamics.deployment.removeSolutionComponent, item.config, solutions[0].context, componentId, componentType)
                            .then(response => treeProvider.refreshSolution(item.solutionPath));
                    }
                 }
            }) 
            , vscode.commands.registerCommand(cs.dynamics.controls.treeView.addEntry, async (item: TreeEntry) => { // Match name of command to package.json command
                if (!item) {
                    vscode.commands.executeCommand(cs.dynamics.controls.treeView.editConnection);

                    return;
                }

                let retryFunction = () => vscode.commands.executeCommand(cs.dynamics.controls.treeView.addEntry, item);

                switch (item.itemType)
                {
                    case "Solutions":
                        Utilities.OpenWindow(DynamicsUrlResolver.getManageSolutionUri(item.config), retryFunction);
                        break;
                    case "Entities":
                        Utilities.OpenWindow(DynamicsUrlResolver.getManageEntityUri(item.config, undefined, item.solutionId), retryFunction);
                        break;
                    case "Attributes":
                        Utilities.OpenWindow(DynamicsUrlResolver.getManageAttributeUri(item.config, item.context.MetadataId, undefined, item.solutionId), retryFunction);
                        break;       
                    case "OptionSets":
                        Utilities.OpenWindow(DynamicsUrlResolver.getManageOptionSetUri(item.config, item.parent && item.parent.context ? item.parent.context.MetadataId : undefined, item.parent && item.parent.context ? item.parent.context.ObjectTypeCode : undefined, undefined, item.solutionId), retryFunction);
                        break;
                    case "Processes":                 
                        let processType = await QuickPicker.pickEnum(DynamicsWebApi.ProcessType);

                        if (processType) {
                            Utilities.OpenWindow(DynamicsUrlResolver.getManageBusinessProcessUri(item.config, processType, item.parent && item.parent.context && item.parent.context.ObjectTypeCode ? item.parent.context.ObjectTypeCode : undefined, item.solutionId), retryFunction);
                        }
                        
                        break;
                    case "Keys":
                        Utilities.OpenWindow(DynamicsUrlResolver.getManageEntityKeyUrl(item.config, item.context.MetadataId, undefined, item.solutionId), retryFunction);
                        break;
                    case "Relationships":
                        Utilities.OpenWindow(DynamicsUrlResolver.getManageEntityRelationshipUrl(item.config, item.context.MetadataId, undefined, item.solutionId), retryFunction);
                        break;
                    case "Forms":   
                        let formType = await QuickPicker.pickEnum(DynamicsWebApi.DynamicsForm);

                        if (formType) {
                            Utilities.OpenWindow(DynamicsUrlResolver.getManageEntityFormUri(item.config, item.context.ObjectTypeCode, formType, undefined, item.solutionId), retryFunction);
                        }

                        break;
                    case "Dashboards":
                        let layoutType = await QuickPicker.pickEnum(DynamicsWebApi.InteractiveDashboardLayout);

                        if (layoutType) {
                            Utilities.OpenWindow(DynamicsUrlResolver.getManageEntityDashboardUri(item.config, item.context.ObjectTypeCode, layoutType, "1030", undefined, item.solutionId), retryFunction);
                        }

                        break;
                    case "Views":
                        Utilities.OpenWindow(DynamicsUrlResolver.getManageEntityViewUri(item.config, item.context.MetadataId, item.context.ObjectTypeCode, undefined, item.solutionId), retryFunction);
                        break;
                    case "Charts":
                        Utilities.OpenWindow(DynamicsUrlResolver.getManageEntityChartUrl(item.config, item.context.ObjectTypeCode, undefined, item.solutionId), retryFunction);
                        break;
                    case "WebResources":
                        Utilities.OpenWindow(DynamicsUrlResolver.getManageWebResourceUri(item.config, undefined, item.solutionId), retryFunction);
                        break;
                    case "PluginType":
                        vscode.commands.executeCommand(cs.dynamics.controls.pluginStep.open, {});
                        break;
                }
            })   
            , vscode.commands.registerCommand(cs.dynamics.controls.treeView.editEntry, async (item: TreeEntry) => { // Match name of command to package.json command
                let retryFunction = () => vscode.commands.executeCommand(cs.dynamics.controls.treeView.editEntry, item);

                switch (item.itemType)
                {
                    case "Connection":
                        vscode.commands.executeCommand(cs.dynamics.controls.treeView.editConnection, item.config);
                        break;
                    case "Solution":
                        Utilities.OpenWindow(DynamicsUrlResolver.getManageSolutionUri(item.config, item.context.solutionid), retryFunction);
                        break;
                    case "Entity":
                        Utilities.OpenWindow(DynamicsUrlResolver.getManageEntityUri(item.config, item.context.MetadataId, item.solutionId), retryFunction);
                        break;
                    case "Attribute":
                        Utilities.OpenWindow(DynamicsUrlResolver.getManageAttributeUri(item.config, item.parent.context.MetadataId, item.context.MetadataId, item.solutionId), retryFunction);
                        break;
                    case "OptionSet":
                        Utilities.OpenWindow(DynamicsUrlResolver.getManageOptionSetUri(item.config, item.parent && item.parent.context ? item.parent.context.MetadataId : undefined, item.parent && item.parent.context ? item.parent.context.ObjectTypeCode : undefined, item.context.MetadataId, item.solutionId), retryFunction);
                        break;
                    case "Process":
                        Utilities.OpenWindow(DynamicsUrlResolver.getManageBusinessProcessUri(item.config, DynamicsUrlResolver.parseProcessType(item.context.category), item.parent && item.parent.context && item.parent.context.ObjectTypeCode ? item.parent.context.ObjectTypeCode : undefined, item.context.workflowid, item.solutionId), retryFunction);
                        break;
                    case "Key":
                        Utilities.OpenWindow(DynamicsUrlResolver.getManageEntityKeyUrl(item.config, item.parent.context.MetadataId, item.context.MetadataId, item.solutionId), retryFunction);
                        break;
                    case "OneToManyRelationship":
                    case "ManyToOneRelationship":
                    case "ManyToManyRelationship":
                        Utilities.OpenWindow(DynamicsUrlResolver.getManageEntityRelationshipUrl(item.config, item.parent.context.MetadataId, item.context.MetadataId, item.solutionId), retryFunction);
                        break;
                    case "Form":
                        Utilities.OpenWindow(DynamicsUrlResolver.getManageEntityFormUri(item.config, item.parent.context.ObjectTypeCode, DynamicsUrlResolver.parseFormType(item.context.type), item.context.formid, item.solutionId), retryFunction);
                        break;
                    case "Dashboard":
                        Utilities.OpenWindow(DynamicsUrlResolver.getManageEntityDashboardUri(item.config, undefined, undefined, "1032", item.context.formid, item.solutionId), retryFunction);
                        break;
                    case "View":
                        Utilities.OpenWindow(DynamicsUrlResolver.getManageEntityViewUri(item.config, item.parent.context.MetadataId, item.parent.context.ObjectTypeCode, item.context.savedqueryid, item.solutionId), retryFunction);
                        break;     
                    case "Chart":
                        Utilities.OpenWindow(DynamicsUrlResolver.getManageEntityChartUrl(item.config, item.parent.context.ObjectTypeCode, item.context.savedqueryvisualizationid, item.solutionId), retryFunction);
                        break;     
                    case "WebResources":
                        Utilities.OpenWindow(DynamicsUrlResolver.getManageWebResourceUri(item.config, item.context.webresourceid, item.solutionId), retryFunction);
                        break;
                    case "PluginStep":
                        vscode.commands.executeCommand(cs.dynamics.controls.pluginStep.open, item.context);
                        break;
                }
           }) 
           , vscode.commands.registerCommand(cs.dynamics.controls.treeView.openInBrowser, async (item: TreeEntry) => {
                let retryFunction = () => vscode.commands.executeCommand(cs.dynamics.controls.treeView.openInBrowser, item);

                switch (item.itemType) {
                    case "Entity":
                        Utilities.OpenWindow(DynamicsUrlResolver.getOpenEntityFormUri(item.config, item.context.LogicalName), retryFunction);
                        break;
                    case "Form":
                    case "Dashboard":
                        Utilities.OpenWindow(DynamicsUrlResolver.getOpenEntityFormUri(item.config, item.parent.context.LogicalName, item.context.formid), retryFunction);
                        break;
                    case "View":
                        Utilities.OpenWindow(DynamicsUrlResolver.getOpenEntityViewUri(item.config, item.parent.context.LogicalName, item.context.savedqueryid), retryFunction);
                        break;
                }
           })
           , vscode.commands.registerCommand(cs.dynamics.controls.treeView.openInEditor, async (item: TreeEntry) => {
                switch (item.itemType) {
                    case "Form":
                    case "Dashboard":
                        vscode.workspace.openTextDocument({ language:"xml", content:item.context.formxml })
                            .then(d => vscode.window.showTextDocument(d));
                        break;
                    case "View":
                        vscode.workspace.openTextDocument({ language:"xml", content:item.context.layoutxml })
                            .then(d => vscode.window.showTextDocument(d));
                        break;
                    case "Chart":
                        vscode.workspace.openTextDocument({ language:"xml", content:item.context.presentationdescription })
                            .then(d => vscode.window.showTextDocument(d));
                        break;
                }
           })
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

	public async getChildren(element?: TreeEntry): Promise<TreeEntry[]> {
        if (element) {
            const commandPrefix:string = Utilities.RemoveTrailingSlash(((element.command && element.command.arguments) || '').toString());

            switch (element.itemType) {
                case "Connection":
                    return this.getConnectionDetails(element, commandPrefix);
                case "Organization":
                    return Promise.resolve(this.getSolutionLevelDetails(element, commandPrefix, element.context));
                case "Solutions":
                    return this.getSolutionDetails(element, commandPrefix);
                case "Solution":
                    return Promise.resolve(this.getSolutionLevelDetails(element, commandPrefix, element.context));
                case "Processes":
                    return this.getProcessDetails(element, commandPrefix, element.context);
                case "Plugins":
                    return this.getPluginDetails(element, commandPrefix, element.context);
                case "Entities":
                    return this.getEntityDetails(element, commandPrefix, element.context);
                case "OptionSets":
                    return this.getOptionSetDetails(element, commandPrefix, element.context);
                case "WebResources":
                    var folders = await this.getWebResourcesFolderDetails(element, commandPrefix, (element.context && element.context.innerContext ? element.context.innerContext : element.context));
                    var items = await this.getWebResourcesDetails(element, commandPrefix, (element.context && element.context.innerContext ? element.context.innerContext : element.context));

                    if (items && folders) { items.forEach(i => folders.push(i)); }

                    return folders && folders.length > 0 ? folders : items;
                case "Folder":
                    switch (element.context.innerType) {
                        case "WebResources":
                            var innerFolders = await this.getWebResourcesFolderDetails(element, commandPrefix, (element.context && element.context.innerContext ? element.context.innerContext : element.context), element.folder);
                            var innerItems = await this.getWebResourcesDetails(element, commandPrefix, (element.context && element.context.innerContext ? element.context.innerContext : element.context), element.folder);
        
                            if (innerItems && innerFolders) { innerItems.forEach(i => innerFolders.push(i)); }
        
                            return innerFolders && innerFolders.length > 0 ? innerFolders : innerItems;
                    }
                case "Plugin":
                    return this.getPluginTypeDetails(element, commandPrefix, element.context);
                case "PluginType":
                    return this.getPluginStepDetails(element, commandPrefix, element.context);
                case "PluginStep":
                    return this.getPluginStepImageDetails(element, commandPrefix, element.context);
                case "Entity":
                    return Promise.resolve(this.getEntityLevelDetails(element, commandPrefix, element.context));
                case "Keys":
                    return this.getEntityKeyDetails(element, commandPrefix, element.context);
                case "Attributes":
                    return this.getEntityAttributeDetails(element, commandPrefix, element.context);
                case "Views":
                    return this.getEntityViewDetails(element, commandPrefix, element.solutionId, element.context);
                case "Charts":
                    return this.getEntityChartDetails(element, commandPrefix, element.solutionId, element.context);
                case "Forms":
                    return this.getEntityFormDetails(element, commandPrefix, element.solutionId, element.context);
                case "Dashboards":
                    return this.getEntityDashboardDetails(element, commandPrefix, element.solutionId, element.context);
                case "Relationships":
                    return this.getEntityRelationshipDetails(element, commandPrefix, element.context);
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

    public refreshSolution(solutionPath?:string): void {
        if (solutionPath) {
            TreeEntryCache.Instance.Items
                .where(i => i.id === solutionPath)
                .forEach(i => this._onDidChangeTreeData.fire(i));
        }
    }

	private getConnectionEntries(): TreeEntry[] {
        const result: TreeEntry[] = [];
        
        this._connections.forEach(connection => {
            const displayName = (connection.name)
                ? connection.name
                : connection.webApiUrl.replace("http://", "").replace("https://", "");

            result.push(new TreeEntry(
                displayName, 
                "Connection", 
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
                "Organization",
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

    private getSolutionLevelDetails(element: TreeEntry, commandPrefix?:string, context?:any) : TreeEntry[] {
        let returnObject = [];
        const showDefaultSolution = ExtensionConfiguration.getConfigurationValue<boolean>(cs.dynamics.configuration.explorer.showDefaultSolution);
        
        if (element.itemType === "Solution" || showDefaultSolution) {
            returnObject.push(new TreeEntry(
                'Entities',
                "Entities",
                vscode.TreeItemCollapsibleState.Collapsed, 
                null,
                {
                    command: cs.dynamics.controls.treeView.clickEntry,
                    title: 'Entities',
                    arguments: [`${commandPrefix || ''}/Entities`]
                },
                element.config,
                element.itemType === "Solution" ? element.context : undefined
            ));

            returnObject.push(new TreeEntry(
                'Option Sets',
                "OptionSets",
                vscode.TreeItemCollapsibleState.Collapsed, 
                null,
                {
                    command: cs.dynamics.controls.treeView.clickEntry,
                    title: 'OptionSets',
                    arguments: [`${commandPrefix || ''}/OptionSets`]
                },
                element.config,
                element.itemType === "Solution" ? element.context : undefined
            ));

            returnObject.push(new TreeEntry(
                'Processes',
                "Processes",
                vscode.TreeItemCollapsibleState.Collapsed, 
                null,
                {
                    command: cs.dynamics.controls.treeView.clickEntry,
                    title: 'Processes',
                    arguments: [`${commandPrefix || ''}/Processes`]
                },
                element.config,
                element.itemType === "Solution" ? element.context : undefined
            ));

            returnObject.push(new TreeEntry(
                'Web Resources',
                "WebResources",
                vscode.TreeItemCollapsibleState.Collapsed, 
                null,
                {
                    command: cs.dynamics.controls.treeView.clickEntry,
                    title: 'Web Resources',
                    arguments: [`${commandPrefix || ''}/WebResources`]
                },
                element.config,
                element.itemType === "Solution" ? element.context : undefined
            ));

            returnObject.push(new TreeEntry(
                'Plugins',
                "Plugins",
                vscode.TreeItemCollapsibleState.Collapsed, 
                null,
                {
                    command: cs.dynamics.controls.treeView.clickEntry,
                    title: 'Plugins',
                    arguments: [`${commandPrefix || ''}/Plugins`]
                },
                element.config,
                element.itemType === "Solution" ? element.context : undefined
            ));
        }

        if (element.itemType !== "Solution")
        {
            returnObject.push(
                new TreeEntry(
                    'Solutions',
                    "Solutions",
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

    private getEntityLevelDetails(element: TreeEntry, commandPrefix?:string, context?:any) : TreeEntry[] {
        let returnObject = [];

        returnObject.push(new TreeEntry(
            'Keys',
            "Keys",
            vscode.TreeItemCollapsibleState.Collapsed, 
            null,
            {
                command: cs.dynamics.controls.treeView.clickEntry,
                title: 'Keys',
                arguments: [`${commandPrefix || ''}/Keys`]
            },
            element.config,
            element.itemType === "Entity" ? element.context : undefined
        ));

        returnObject.push(new TreeEntry(
            'Attributes',
            "Attributes",
            vscode.TreeItemCollapsibleState.Collapsed, 
            null,
            {
                command: cs.dynamics.controls.treeView.clickEntry,
                title: 'Attributes',
                arguments: [`${commandPrefix || ''}/Attributes`]
            },
            element.config,
            element.itemType === "Entity" ? element.context : undefined
        ));

        returnObject.push(new TreeEntry(
            'Relationships',
            "Relationships",
            vscode.TreeItemCollapsibleState.Collapsed, 
            null,
            {
                command: cs.dynamics.controls.treeView.clickEntry,
                title: 'Relationships',
                arguments: [`${commandPrefix || ''}/Relationships`]
            },
            element.config,
            element.itemType === "Entity" ? element.context : undefined
        ));

        returnObject.push(new TreeEntry(
            'Views',
            "Views",
            vscode.TreeItemCollapsibleState.Collapsed, 
            null,
            {
                command: cs.dynamics.controls.treeView.clickEntry,
                title: 'Views',
                arguments: [`${commandPrefix || ''}/Views`]
            },
            element.config,
            element.itemType === "Entity" ? element.context : undefined
        ));

        returnObject.push(new TreeEntry(
            'Charts',
            "Charts",
            vscode.TreeItemCollapsibleState.Collapsed, 
            null,
            {
                command: cs.dynamics.controls.treeView.clickEntry,
                title: 'Charts',
                arguments: [`${commandPrefix || ''}/Charts`]
            },
            element.config,
            element.itemType === "Entity" ? element.context : undefined
        ));

        returnObject.push(new TreeEntry(
            'Forms',
            "Forms",
            vscode.TreeItemCollapsibleState.Collapsed, 
            null,
            {
                command: cs.dynamics.controls.treeView.clickEntry,
                title: 'Forms',
                arguments: [`${commandPrefix || ''}/Forms`]
            },
            element.config,
            element.itemType === "Entity" ? element.context : undefined
        ));

        returnObject.push(new TreeEntry(
            'Dashboards',
            "Dashboards",
            vscode.TreeItemCollapsibleState.Collapsed, 
            null,
            {
                command: cs.dynamics.controls.treeView.clickEntry,
                title: 'Dashboards',
                arguments: [`${commandPrefix || ''}/Dashboards`]
            },
            element.config,
            element.itemType === "Entity" ? element.context : undefined
        ));

        returnObject.push(new TreeEntry(
            'Processes',
            "Processes",
            vscode.TreeItemCollapsibleState.Collapsed, 
            null,
            {
                command: cs.dynamics.controls.treeView.clickEntry,
                title: 'Processes',
                arguments: [`${commandPrefix || ''}/Processes`]
            },
            element.config,
            element.itemType === "Entity" ? element.context : undefined
        ));

        return returnObject;
    }

    private getSolutionDetails(element: TreeEntry, commandPrefix?:string): Promise<TreeEntry[]> {
		const api = new ApiRepository(element.config);
        const returnValue = this.createTreeEntries(
            api.retrieveSolutions(), 
            solution => new TreeEntry(
                solution.friendlyname, 
                "Solution",
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
                "Plugin",
                vscode.TreeItemCollapsibleState.Collapsed,
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

    private getPluginTypeDetails(element: TreeEntry, commandPrefix?: string, plugin?: any): Thenable<TreeEntry[]> {
		const api = new ApiRepository(element.config);
        const returnValue = this.createTreeEntries(
            api.retrievePluginTypes(plugin.pluginassemblyid), 
            pluginType => new TreeEntry(
                pluginType.friendlyname, 
                "PluginType",
                vscode.TreeItemCollapsibleState.Collapsed,
                pluginType.name.replace(plugin.name + ".", ''),
                {
                    command: cs.dynamics.controls.treeView.clickEntry,
                    title: pluginType.friendlyname,
                    arguments: [`${commandPrefix || ''}/${pluginType.name}`]
                },
                element.config,
                pluginType),
            `An error occurred while retrieving plug-in types from ${element.config.webApiUrl}`,
            () => this.getPluginTypeDetails(element, commandPrefix, plugin));

        return returnValue;
    }

    private getPluginStepDetails(element: TreeEntry, commandPrefix?: string, pluginType?: any): Thenable<TreeEntry[]> {
		const api = new ApiRepository(element.config);
        const returnValue = this.createTreeEntries(
            api.retrievePluginSteps(pluginType.plugintypeid), 
            pluginStep => new TreeEntry(
                pluginStep.name.replace(pluginType.name + ": ", ''), 
                "PluginStep",
                vscode.TreeItemCollapsibleState.Collapsed,
                pluginStep.description,
                {
                    command: cs.dynamics.controls.treeView.clickEntry,
                    title: pluginStep.name,
                    arguments: [`${commandPrefix || ''}/${pluginStep.name}`]
                },
                element.config,
                pluginStep),
            `An error occurred while retrieving plug-in steps from ${element.config.webApiUrl}`,
            () => this.getPluginStepDetails(element, commandPrefix, pluginType));

        return returnValue;
    }

    private getPluginStepImageDetails(element: TreeEntry, commandPrefix?: string, pluginStep?: any): Thenable<TreeEntry[]> {
		const api = new ApiRepository(element.config);
        const returnValue = this.createTreeEntries(
            api.retrievePluginStepImages(pluginStep.sdkmessageprocessingstepid), 
            pluginImage => new TreeEntry(
                pluginImage.name, 
                "PluginStepImage",
                vscode.TreeItemCollapsibleState.None,
                pluginImage.description,
                {
                    command: cs.dynamics.controls.treeView.clickEntry,
                    title: pluginImage.name,
                    arguments: [`${commandPrefix || ''}/${pluginImage.name}`]
                },
                element.config,
                pluginImage),
            `An error occurred while retrieving plug-in step images from ${element.config.webApiUrl}`,
            () => this.getPluginStepImageDetails(element, commandPrefix, pluginStep));

        return returnValue;
    }

    private getWebResourcesFolderDetails(element: TreeEntry, commandPrefix?: string, solution?: any, folder?: string): Thenable<TreeEntry[]> {
        const api = new ApiRepository(element.config);
        const returnValue = this.createTreeEntries(
            api.retrieveWebResourceFolders(solution ? solution.solutionid : undefined, folder),
            container => new TreeEntry(
                container, 
                "Folder",
                vscode.TreeItemCollapsibleState.Collapsed,
                '', 
                {
                    command: cs.dynamics.controls.treeView.clickEntry,
                    title: container,
                    arguments: [`${commandPrefix || ''}/${container}`]
                },
                element.config,
                { innerType: "WebResources", innerContext: (element.context && element.context.innerContext ? element.context.innerContext : element.context) }),
            `An error occurred while retrieving web resources from ${element.config.webApiUrl}`, 
            () => this.getWebResourcesFolderDetails(element, commandPrefix, solution, folder));

        return returnValue;
    }

    private getWebResourcesDetails(element: TreeEntry, commandPrefix?: string, solution?: any, folder?: string): Thenable<TreeEntry[]> {
        const api = new ApiRepository(element.config);
        const returnValue = this.createTreeEntries(
            api.retrieveWebResources(solution ? solution.solutionid : undefined, folder), 
            webresource => new TreeEntry(
                webresource.name, 
                "WebResource",
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
            () => this.getWebResourcesDetails(element, commandPrefix, solution, folder))
            .then(results => { 
                if (folder) {
                    results.forEach(r => r.label = r.label.replace(Utilities.EnforceTrailingSlash(r.folder), '')); 
                }
            
                return results; 
            });

        return returnValue;
    }

    private getProcessDetails(element: TreeEntry, commandPrefix?: string, context?: any): Thenable<TreeEntry[]> {
		const api = new ApiRepository(element.config);
        const returnValue = this.createTreeEntries(
            api.retrieveProcesses(context && context.LogicalName ? context.LogicalName : undefined, element.solutionId), 
            process => new TreeEntry(
                process.name, 
                "Process",
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
            () => this.getProcessDetails(element, commandPrefix, context));

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
                    "OptionSet",
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
                    "Entity",
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
                    "Attribute",
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

    private getEntityViewDetails(element: TreeEntry, commandPrefix?: string, solutionId?:string, entity?:any): Thenable<TreeEntry[]> {
        const api = new MetadataRepository(element.config);
        const returnValue = this.createTreeEntries(
            api.retrieveViews(entity.LogicalName, solutionId), 
            query => new TreeEntry(
                query.name,
                "View",
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

    private getEntityChartDetails(element: TreeEntry, commandPrefix?: string, solutionId?:string, entity?:any): Thenable<TreeEntry[]> {
        const api = new MetadataRepository(element.config);
        const returnValue = this.createTreeEntries(
            api.retrieveCharts(entity.LogicalName, solutionId), 
            queryvisualization => new TreeEntry(
                queryvisualization.name,
                "Chart",
                vscode.TreeItemCollapsibleState.None,
                queryvisualization.description, 
                {
                    command: cs.dynamics.controls.treeView.clickEntry,
                    title: queryvisualization.name,
                    arguments: [`${commandPrefix || ''}/${queryvisualization.savedqueryvisualizationid}`]
                },
                element.config,
                queryvisualization),
            `An error occurred while retrieving charts from ${element.config.webApiUrl}`,
            () => this.getEntityChartDetails(element, commandPrefix, entity));
            
        return returnValue;
    }

    private getEntityFormDetails(element: TreeEntry, commandPrefix?: string, solutionId?:string, entity?:any): Thenable<TreeEntry[]> {
        const api = new MetadataRepository(element.config);
        const returnValue = this.createTreeEntries(
            api.retrieveForms(entity.LogicalName, solutionId), 
            form => new TreeEntry(
                form.name,
                "Form",
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

    private getEntityDashboardDetails(element: TreeEntry, commandPrefix?: string, solutionId?:string, entity?:any): Thenable<TreeEntry[]> {
        const api = new MetadataRepository(element.config);
        const returnValue = this.createTreeEntries(
            api.retrieveDashboards(entity.LogicalName, solutionId), 
            dashboard => new TreeEntry(
                dashboard.name,
                "Dashboard",
                vscode.TreeItemCollapsibleState.None,
                dashboard.description, 
                {
                    command: cs.dynamics.controls.treeView.clickEntry,
                    title: dashboard.name,
                    arguments: [`${commandPrefix || ''}/${dashboard.formid}`]
                },
                element.config,
                dashboard),
            `An error occurred while retrieving dashboards from ${element.config.webApiUrl}`,
            () => this.getEntityDashboardDetails(element, commandPrefix, entity));

        return returnValue;
    }

    private getEntityKeyDetails(element: TreeEntry, commandPrefix?: string, entity?:any): Thenable<TreeEntry[]> {
        const api = new MetadataRepository(element.config);
        const returnValue = this.createTreeEntries(
            api.retrieveKeys(entity.MetadataId), 
            key => {
                let displayName = key.DisplayName && key.DisplayName.LocalizedLabels && key.DisplayName.LocalizedLabels.length > 0 ? key.DisplayName.LocalizedLabels[0].Label : "";

                return new TreeEntry(
                    displayName,
                    "Key",
                    vscode.TreeItemCollapsibleState.None,
                    key.LogicalName, 
                    {
                        command: cs.dynamics.controls.treeView.clickEntry,
                        title: key.name,
                        arguments: [`${commandPrefix || ''}/${key.savedqueryvisualizationid}`]
                    },
                    element.config,
                    key); 
            },
            `An error occurred while retrieving key definitions from ${element.config.webApiUrl}`,
            () => this.getEntityKeyDetails(element, commandPrefix, entity));
            
        return returnValue;
    }

    private getEntityRelationshipDetails(element: TreeEntry, commandPrefix?:string, entity?:any): Thenable<TreeEntry[]> {
        const api = new MetadataRepository(element.config);

        return api.retrieveRelationships(entity.MetadataId)
            .then(returnValue => {
                const result : TreeEntry[] = new Array();

                if (returnValue && returnValue.oneToMany && returnValue.oneToMany.length > 0) {
                    returnValue.oneToMany.forEach(r => {
                        result.push(new TreeEntry(
                            r.SchemaName,
                            'OneToManyRelationship',
                            vscode.TreeItemCollapsibleState.None,
                            r.RelationshipType, 
                            {
                                command: cs.dynamics.controls.treeView.clickEntry,
                                title: r.SchemaName,
                                arguments: [`${commandPrefix || ''}/${r.SchemaName}`]
                            },
                            element.config,
                            r));
                    });
                }

                if (returnValue && returnValue.manyToOne && returnValue.manyToOne.length > 0) {
                    returnValue.manyToOne.forEach(r => {
                        result.push(new TreeEntry(
                            r.SchemaName,
                            'ManyToOneRelationship',
                            vscode.TreeItemCollapsibleState.None,
                            r.RelationshipType, 
                            {
                                command: cs.dynamics.controls.treeView.clickEntry,
                                title: r.SchemaName,
                                arguments: [`${commandPrefix || ''}/${r.SchemaName}`]
                            },
                            element.config,
                            r));
                    });
                }

                if (returnValue && returnValue.manyToOne && returnValue.manyToOne.length > 0) {
                    returnValue.manyToMany.forEach(r => {
                        result.push(new TreeEntry(
                            r.SchemaName,
                            'ManyToManyRelationship',
                            vscode.TreeItemCollapsibleState.None,
                            r.RelationshipType, 
                            {
                                command: cs.dynamics.controls.treeView.clickEntry,
                                title: r.SchemaName,
                                arguments: [`${commandPrefix || ''}/${r.SchemaName}`]
                            },
                            element.config,
                            r));
                    });
                }

                return new TS.Linq.Enumerator(result).orderBy(r => r.label).toArray();
            }).catch(error => {
                Utilities.RetryWithMessage(`An error occurred while retrieving relationships from ${element.config.webApiUrl}`, () => this.getEntityRelationshipDetails(element, commandPrefix, entity));

                return null;
            });
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

class TreeEntry extends vscode.TreeItem {
    private static readonly canRefreshEntryTypes:EntryType[] = [ "Solutions", "Plugins", "Entities", "OptionSets", "WebResources", "Processes", "Plugins", "Attributes", "Forms", "Views", "Charts", "Dashboards", "Keys", "Relationships", "Entries" ];
    private static readonly canAddEntryTypes:EntryType[] = [ "Solutions", "Plugins", "Entities", "OptionSets", "WebResources", "Processes", "Attributes", "Forms", "Views", "Charts", "Dashboards", "Keys", "Relationships", "Entries", "PluginType" ];
    private static readonly canEditEntryTypes:EntryType[] = [ "Connection", "Solution", "Entity", "OptionSet", "WebResource", "Process", "Attribute", "Form", "View", "Chart", "Dashboard", "Key", "OneToManyRelationship", "ManyToOneRelationship", "ManyToManyRelationship", "Entry", "PluginStep" ];
    private static readonly canDeleteEntryTypes:EntryType[] = [ "Connection" ];
    private static readonly canInspectEntryTypes:EntryType[] = [ "Connection", "Solution", "Entity", "OptionSet", "WebResource", "Process", "Attribute", "Form", "View", "Chart", "Dashboard", "Key", "OneToManyRelationship", "ManyToOneRelationship", "ManyToManyRelationship", "Entry", "PluginStep" ];
    private static readonly canUnpackSolutionEntryTypes:EntryType[] = [ "Solution" ];
    private static readonly canOpenInBrowserEntryTypes:EntryType[] = [ "Form", "View", "Entity", "Dashboard" ];
    private static readonly canOpenInEditorEntryTypes:EntryType[] = [ "Form", "View", "Chart", "Dashboard" ];
    private static readonly canAddToSolutionEntryTypes:EntryType[] = [ "Plugin", "Entity", "OptionSet", "WebResource", "Process", "Form", "View", "Chart", "Dashboard" ];
    private static readonly canRemoveFromSolutionEntryTypes:EntryType[] = [ "Plugin", "Entity", "OptionSet", "WebResource", "Process", "Form", "View", "Chart", "Dashboard" ];

    constructor(
        public label: string,
        public readonly itemType: EntryType,
        public collapsibleState: vscode.TreeItemCollapsibleState,
        public readonly subtext?: string,
        public readonly command?: vscode.Command,
        public readonly config?: DynamicsWebApi.Config,
        public readonly context?: any
	) {
        super(label, collapsibleState);
        
        const resolver = ExtensionIconThemes.selected.resolve("../../../Resources/icons/", itemType);

        if (resolver) {
            this.iconPath = resolver.iconPath;
        }

        if (command && command.arguments && command.arguments.length > 0) {
            this.id = command.arguments[0].toString();
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

    get solutionPath(): string { 
        if (this.id)
        {
            const split = this.id.split("/");
            const index = split.indexOf("Solutions");
            
            if (index >= 0) {
                return split.slice(0, index + 2).join("/");
            }        
        }
       
        return undefined;        
    }

    get capabilities(): string[] {
        const returnValue = [];
        
        this.addCapability(returnValue, "canRefreshItem", TreeEntry.canRefreshEntryTypes);
        this.addCapability(returnValue, "canAddItem", TreeEntry.canAddEntryTypes);
        this.addCapability(returnValue, "canEditItem", TreeEntry.canEditEntryTypes);
        this.addCapability(returnValue, "canDeleteItem", TreeEntry.canDeleteEntryTypes);
        this.addCapability(returnValue, "canInspectItem", TreeEntry.canInspectEntryTypes);
        this.addCapability(returnValue, "canUnpackSolution", TreeEntry.canUnpackSolutionEntryTypes);
        this.addCapability(returnValue, "canAddToSolution", TreeEntry.canAddToSolutionEntryTypes, () => !this.solutionId);
        this.addCapability(returnValue, "canRemoveFromSolution", TreeEntry.canRemoveFromSolutionEntryTypes, () => this.solutionId);
        this.addCapability(returnValue, "canOpenInBrowser", TreeEntry.canOpenInBrowserEntryTypes);
        this.addCapability(returnValue, "canOpenInEditor", TreeEntry.canOpenInEditorEntryTypes);

        return returnValue;
    }

    private addCapability(returnList:string[], capabilityName:string, constrain:EntryType[], additionalCheck?:() => boolean): void {
        if (constrain.indexOf(this.itemType) !== -1 && (!additionalCheck || additionalCheck())) {
            returnList.push(capabilityName);
        }
    }
}

export type EntryType = 
    "Connection" | 
    "Organization" |
    "Entities" |
    "OptionSets" |
    "WebResources" |
    "Plugins" |
    "Processes" |
    "Solutions" |
    "Entity" |
    "OptionSet" |
    "WebResource" |
    "Plugin" |
    "PluginType" |
    "PluginStep" |
    "PluginStepImage" |
    "Process" |
    "Solution" |
    "Attributes" |
    "Views" |
    "Charts" |
    "Dashboards" |
    "Keys" |
    "Relationships" |
    "Forms" |
    "Attribute" |
    "View" |
    "Chart" |
    "Dashboard" |
    "Key" |
    "OneToManyRelationship" |
    "ManyToOneRelationship" |
    "ManyToManyRelationship" |
    "Form" |
    "Entry" |
    "Entries" |
    "Folder";