import * as vscode from 'vscode';
import { TS } from 'typescript-linq/TS';
import DiscoveryRepository from '../repositories/discoveryRepository';
import ApiRepository from '../repositories/apiRepository';
import { Utilities } from '../core/Utilities';
import MetadataRepository from '../repositories/metadataRepository';
import * as cs from '../cs';
import IContributor from '../core/CommandBuilder';
import CdsUrlResolver from '../api/CdsUrlResolver';
import ExtensionConfiguration from '../core/ExtensionConfiguration';
import { CdsWebApi } from '../api/cds-webapi/CdsWebApi';
import { ExtensionIconThemes } from "../components/WebDownloaders/Types";
import Quickly from '../core/Quickly';
import SolutionMap from '../components/Solutions/SolutionMap';
import SolutionWorkspaceMapping from "../components/Solutions/SolutionWorkspaceMapping";
import { CdsSolutions } from '../api/CdsSolutions';
import logger from '../core/Logger';
import command from '../core/Command';
import { extensionActivate } from '../core/ExtensionEvent';
import Dictionary from '../core/types/Dictionary';
import ExtensionContext from '../core/ExtensionContext';

export default class CdsExplorerView {
    private static treeProvider: CdsExplorerTreeProvider;

    @command(cs.cds.controls.cdsExplorer.refreshEntry, "Refresh")
    static async refreshEntry(item?: TreeEntry) {
        return await CdsExplorerView.treeProvider.refresh(item);
    }

    @command(cs.cds.controls.cdsExplorer.addConnection, "Add Connection")
    static async addConnection(config?: CdsWebApi.Config) {
        return await CdsExplorerView.treeProvider.addConnection(config);
    }

    @command(cs.cds.controls.cdsExplorer.clickEntry, "Click")
    static async clickEntry(item?: TreeEntry) {
        if (item.collapsibleState === vscode.TreeItemCollapsibleState.Collapsed) {
            item.collapsibleState = vscode.TreeItemCollapsibleState.Expanded;
            return await this.refreshEntry(item);
        }            
    }

    private static async runCommand(definitions: Dictionary<EntryType, (item?: TreeEntry) => Promise<void>>, item?: TreeEntry) {
        if (definitions.containsKey(item.itemType)) {
            return await definitions[item.itemType](item);
        }
    }

    private static deleteCommands = new Dictionary<EntryType, (item?: TreeEntry) => Promise<void>>([
        { key: "Connection", value: async (item) => CdsExplorerView.treeProvider.removeConnection(item.config) },
        { key: "PluginStep", value: async (item) => CdsExplorerView.treeProvider.removePluginStep(item.config, item.context).then(() => CdsExplorerView.treeProvider.refresh(item.parent)) },
        { key: "PluginStepImage", value: async (item) => CdsExplorerView.treeProvider.removePluginStepImage(item.config, item.context).then(() => CdsExplorerView.treeProvider.refresh(item.parent)) }
    ]);

    @command(cs.cds.controls.cdsExplorer.deleteEntry, "Delete")
    static async deleteEntry(item?: TreeEntry) {
        return this.runCommand(this.deleteCommands, item);
    }

    @command(cs.cds.controls.cdsExplorer.inspectEntry, "Inspect")
    static async inspectEntry(item?: TreeEntry) {
        return await vscode.commands.executeCommand(cs.cds.controls.jsonInspector.open, item.context);
    }

    @command(cs.cds.controls.cdsExplorer.moveSolution, "Move or re-map solution")
    static async moveSolution(item?: TreeEntry) {
        return await vscode.commands.executeCommand(cs.cds.deployment.updateSolutionMapping, item.solutionMapping, item.config)
            .then(result => TreeEntryCache.Instance.ClearMap());
    }

    private static solutionComponentMappings = new Dictionary<EntryType, { componentId: (item?: TreeEntry) => Promise<void>, componentType: CdsSolutions.SolutionComponent }>([
        { key: "Plugin", value: { componentId: (item) => item.context.pluginassemblyid, componentType: CdsSolutions.SolutionComponent.PluginAssembly }},
        { key: "WebResource", value: { componentId: (item) => item.context.webresourceid, componentType: CdsSolutions.SolutionComponent.WebResource }},
        { key: "Process", value: { componentId: (item) => item.context.workflowid, componentType: CdsSolutions.SolutionComponent.Workflow }},
        { key: "Entity", value: { componentId: (item) => item.context.MetadataId, componentType: CdsSolutions.SolutionComponent.Entity }},
        { key: "OptionSet", value: { componentId: (item) => item.context.MetadataId, componentType: CdsSolutions.SolutionComponent.OptionSet }}
    ]);

    @command(cs.cds.controls.cdsExplorer.addEntryToSolution, "Add to Solution")
    static async addEntryToSolution(item?: TreeEntry) {
        if (item.solutionId) {
            await vscode.window.showInformationMessage(`The component ${item.label} is already a part of a solution.`);

            return;
        }

        if (this.solutionComponentMappings.containsKey(item.itemType)) {
            const componentId = this.solutionComponentMappings[item.itemType].componentId(item);
            const componentType = this.solutionComponentMappings[item.itemType].componentType;

            return await vscode.commands.executeCommand(cs.cds.deployment.addSolutionComponent, item.config, undefined, componentId, componentType)
                .then(response => {
                    const solutionPath = item.id.split("/").slice(0, 4);
                    solutionPath.push("Solutions");
                    solutionPath.push((<any>response).solutionid);

                    CdsExplorerView.treeProvider.refreshSolution(solutionPath.join("/")); 
                });
        }
    }

    @command(cs.cds.controls.cdsExplorer.removeEntryFromSolution, "Remove from Solution")
    static async removeEntryFromSolution(item?: TreeEntry) {
        if (!item.solutionId) {
            await vscode.window.showInformationMessage(`The component ${item.label} is not part of a solution.`);

            return;
        }

        if (this.solutionComponentMappings.containsKey(item.itemType)) {
            const componentId = this.solutionComponentMappings[item.itemType].componentId(item);
            const componentType = this.solutionComponentMappings[item.itemType].componentType;

            if (!Utilities.$Object.isNullOrEmpty(item.solutionIdPath)) {
                const solutions = TreeEntryCache.Instance.Items.where(i => i.id === item.solutionIdPath).toArray();
                
                if (solutions && solutions.length > 0 && componentId && componentType) {
                    return await vscode.commands.executeCommand(cs.cds.deployment.removeSolutionComponent, item.config, solutions[0].context, componentId, componentType)
                        .then(response => CdsExplorerView.treeProvider.refreshSolution(item.solutionIdPath));
                }
            }
        }
    }

    private static addCommands = new Dictionary<EntryType, (item?: TreeEntry) => Promise<void>>([
        { key: "Solutions", value: async (item) => Utilities.Browser.openWindow(CdsUrlResolver.getManageSolutionUri(item.config)) },
        { key: "Entities", value: async (item) => Utilities.Browser.openWindow(CdsUrlResolver.getManageEntityUri(item.config, undefined, item.solution)) },
        { key: "Attributes", value: async (item) => Utilities.Browser.openWindow(CdsUrlResolver.getManageAttributeUri(item.config, item.context.MetadataId, undefined, item.solutionId)) },
        { key: "OptionSets", value: async (item) => Utilities.Browser.openWindow(CdsUrlResolver.getManageOptionSetUri(item.config, item.parent && item.parent.context ? item.parent.context.MetadataId : undefined, item.parent && item.parent.context ? item.parent.context.ObjectTypeCode : undefined, undefined, item.solutionId)) },
        { key: "Processes", value: async (item) => {
            const processType = await Quickly.pickEnum<CdsSolutions.ProcessType>(CdsSolutions.ProcessType);

            if (processType) {
                Utilities.Browser.openWindow(CdsUrlResolver.getManageBusinessProcessUri(item.config, processType, item.parent && item.parent.context && item.parent.context.ObjectTypeCode ? item.parent.context.ObjectTypeCode : undefined, item.solutionId));
            }            
        }},
        { key: "Keys", value: async (item) => Utilities.Browser.openWindow(CdsUrlResolver.getManageEntityKeyUrl(item.config, item.context.MetadataId, undefined, item.solutionId)) },
        { key: "Relationships", value: async (item) => Utilities.Browser.openWindow(CdsUrlResolver.getManageEntityRelationshipUrl(item.config, item.context.MetadataId, undefined, item.solutionId)) },
        { key: "Forms", value: async (item) => {
            const formType = await Quickly.pickEnum<CdsSolutions.DynamicsForm>(CdsSolutions.DynamicsForm);

            if (formType) {
                Utilities.Browser.openWindow(CdsUrlResolver.getManageEntityFormUri(item.config, item.context.ObjectTypeCode, formType, undefined, item.solutionId));
            }
        }},
        { key: "Dashboards", value: async (item) => {
            const layoutType = await Quickly.pickEnum<CdsSolutions.InteractiveDashboardLayout>(CdsSolutions.InteractiveDashboardLayout);

            if (layoutType) {
                Utilities.Browser.openWindow(CdsUrlResolver.getManageEntityDashboardUri(item.config, item.context.ObjectTypeCode, layoutType, "1030", undefined, item.solutionId));
            }
        }},
        { key: "Views", value: async (item) => Utilities.Browser.openWindow(CdsUrlResolver.getManageEntityViewUri(item.config, item.context.MetadataId, item.context.ObjectTypeCode, undefined, item.solutionId)) },
        { key: "Charts", value: async (item) => Utilities.Browser.openWindow(CdsUrlResolver.getManageEntityChartUrl(item.config, item.context.ObjectTypeCode, undefined, item.solutionId)) },
        { key: "WebResources", value: async (item) => {
            const hasWorkspace = vscode.workspace.workspaceFolders && vscode.workspace.workspaceFolders.length > 0;
        
            if (hasWorkspace) {
                await vscode.commands.executeCommand(cs.cds.deployment.createWebResource, item.config, item.solutionId, undefined, undefined, item.folder);
            } else {
                Utilities.Browser.openWindow(CdsUrlResolver.getManageWebResourceUri(item.config, undefined, item.solutionId));
            }
        }},
        { key: "PluginType", value: async (item) => await vscode.commands.executeCommand(cs.cds.controls.pluginStep.open, item.context._pluginassemblyid_value, item.config, undefined) },
        { key: "PluginStep", value: async (item) => await vscode.commands.executeCommand(cs.cds.controls.pluginStepImage.open, item.context._sdkmessageprocessingstepid_value, undefined, item.config) }
    ]);

    @command(cs.cds.controls.cdsExplorer.addEntry, "Add")
    static async addEntry(item?: TreeEntry): Promise<void> {
        if (!item) {
            await vscode.commands.executeCommand(cs.cds.controls.cdsExplorer.editConnection);
        } else {
            return this.runCommand(this.addCommands, item);
        }
    }

    private static editCommands = new Dictionary<EntryType, (item?: TreeEntry) => Promise<void>>([
        { key: "Connection", value: async (item) => await vscode.commands.executeCommand(cs.cds.controls.cdsExplorer.editConnection, item.config) },
        { key: "Solution", value: async (item) => Utilities.Browser.openWindow(CdsUrlResolver.getManageSolutionUri(item.config, item.context)) },
        { key: "Entity", value: async (item) => Utilities.Browser.openWindow(CdsUrlResolver.getManageEntityUri(item.config, item.context, item.solution)) },
        { key: "Attribute", value: async (item) => Utilities.Browser.openWindow(CdsUrlResolver.getManageAttributeUri(item.config, item.parent.context.MetadataId, item.context.MetadataId, item.solutionId)) },
        { key: "OptionSet", value: async (item) => Utilities.Browser.openWindow(CdsUrlResolver.getManageOptionSetUri(item.config, item.parent && item.parent.context ? item.parent.context.MetadataId : undefined, item.parent && item.parent.context ? item.parent.context.ObjectTypeCode : undefined, item.context.MetadataId, item.solutionId)) },
        { key: "Process", value: async (item) => Utilities.Browser.openWindow(CdsUrlResolver.getManageBusinessProcessUri(item.config, CdsUrlResolver.parseProcessType(item.context.category), item.context.workflowid, item.context.solutionid || undefined)) },
        { key: "Key", value: async (item) => Utilities.Browser.openWindow(CdsUrlResolver.getManageEntityKeyUrl(item.config, item.parent.context.MetadataId, item.context.MetadataId, item.solutionId)) },
        { key: "OneToManyRelationship", value: async (item) => Utilities.Browser.openWindow(CdsUrlResolver.getManageEntityRelationshipUrl(item.config, item.parent.context.MetadataId, item.context.MetadataId, item.solutionId)) },
        { key: "ManyToOneRelationship", value: async (item) => Utilities.Browser.openWindow(CdsUrlResolver.getManageEntityRelationshipUrl(item.config, item.parent.context.MetadataId, item.context.MetadataId, item.solutionId)) },
        { key: "ManyToManyRelationship", value: async (item) => Utilities.Browser.openWindow(CdsUrlResolver.getManageEntityRelationshipUrl(item.config, item.parent.context.MetadataId, item.context.MetadataId, item.solutionId)) },
        { key: "Form", value: async (item) => Utilities.Browser.openWindow(CdsUrlResolver.getManageEntityFormUri(item.config, item.parent.context.ObjectTypeCode, CdsUrlResolver.parseFormType(item.context.type), item.context.formid, item.solutionId)) },
        { key: "Dashboard", value: async (item) => Utilities.Browser.openWindow(CdsUrlResolver.getManageEntityDashboardUri(item.config, undefined, undefined, "1032", item.context.formid, item.solutionId)) },
        { key: "View", value: async (item) => Utilities.Browser.openWindow(CdsUrlResolver.getManageEntityViewUri(item.config, item.parent.context.MetadataId, item.parent.context.ObjectTypeCode, item.context.savedqueryid, item.solutionId)) },
        { key: "Chart", value: async (item) => Utilities.Browser.openWindow(CdsUrlResolver.getManageEntityChartUrl(item.config, item.parent.context.ObjectTypeCode, item.context.savedqueryvisualizationid, item.solutionId)) },
        { key: "WebResource", value: async (item) => {
            const hasWorkspace = vscode.workspace.workspaceFolders && vscode.workspace.workspaceFolders.length > 0;
        
            if (hasWorkspace) {
                await vscode.commands.executeCommand(cs.cds.deployment.unpackWebResource, item.config, item.context, undefined, true);
            } else {
                Utilities.Browser.openWindow(CdsUrlResolver.getManageWebResourceUri(item.config, item.context.webresourceid, item.solutionId));
            }
        }},
        { key: "PluginStep", value: async (item) => await vscode.commands.executeCommand(cs.cds.controls.pluginStep.open, item.context.eventhandler_plugintype._pluginassemblyid_value, item.config, item.context) },
        { key: "PluginStepImage", value: async (item) => await vscode.commands.executeCommand(cs.cds.controls.pluginStepImage.open, item.context._sdkmessageprocessingstepid_value, item.context, item.config) }
    ]);

    @command(cs.cds.controls.cdsExplorer.editEntry, "Edit")
    static async editEntry(item?: TreeEntry): Promise<void> {
        return this.runCommand(this.editCommands, item);
    }

    private static openInAppCommands = new Dictionary<EntryType, (item?: TreeEntry) => Promise<void>>([
        { key: "Entity", value: async (item) => Utilities.Browser.openWindow(CdsUrlResolver.getOpenEntityUsingAppUrl(item.context.LogicalName)) },
        { key: "Dashboard", value: async (item) => Utilities.Browser.openWindow(CdsUrlResolver.getOpenEntityDashboardUsingAppUrl(item.context.formid)) },
        { key: "View", value: async (item) => Utilities.Browser.openWindow(CdsUrlResolver.getOpenEntityViewUsingAppUrl(item.parent.context.LogicalName, item.context.savedqueryid)) },
    ]);

    @command(cs.cds.controls.cdsExplorer.openInApp, "Open in App")
    static async openInApp(item?: TreeEntry): Promise<void> {
        return this.runCommand(this.openInAppCommands, item);
    }

    private static openInBrowserCommands = new Dictionary<EntryType, (item?: TreeEntry) => Promise<void>>([
        { key: "Entity", value: async (item) => Utilities.Browser.openWindow(CdsUrlResolver.getOpenEntityFormUri(item.config, item.context.LogicalName)) },
        { key: "Form", value: async (item) => Utilities.Browser.openWindow(CdsUrlResolver.getOpenEntityFormUri(item.config, item.parent.context.LogicalName, item.context.formid)) },
        { key: "Dashboard", value: async (item) => Utilities.Browser.openWindow(CdsUrlResolver.getOpenEntityFormUri(item.config, item.parent.context.LogicalName, item.context.formid)) },
        { key: "View", value: async (item) => Utilities.Browser.openWindow(CdsUrlResolver.getOpenEntityViewUri(item.config, item.parent.context.LogicalName, item.context.savedqueryid)) },
    ]);

    @command(cs.cds.controls.cdsExplorer.openInBrowser, "Open in Browser")
    static async openInBrowser(item?: TreeEntry): Promise<void> {
        return this.runCommand(this.openInBrowserCommands, item);
    }

    private static openInEditorCommands = new Dictionary<EntryType, (item?: TreeEntry) => Promise<void>>([
        { key: "Form", value: async (item) => await vscode.workspace.openTextDocument({ language:"xml", content:item.context.formxml }).then(d => vscode.window.showTextDocument(d)).then(e => logger.log(`Form loaded in editor`)) },
        { key: "Dashboard", value: async (item) => await vscode.workspace.openTextDocument({ language:"xml", content:item.context.formxml }).then(d => vscode.window.showTextDocument(d)).then(e => logger.log(`Dashboard loaded in editor`)) },
        { key: "View", value: async (item) => await vscode.workspace.openTextDocument({ language:"xml", content:item.context.layoutxml }).then(d => vscode.window.showTextDocument(d)).then(e => logger.log(`View loaded in editor`)) },
        { key: "Chart", value: async (item) => await vscode.workspace.openTextDocument({ language:"xml", content:item.context.presentationdescription }).then(d => vscode.window.showTextDocument(d)).then(e => logger.log(`Chart loaded in editor`)) }
    ]);

    @command(cs.cds.controls.cdsExplorer.openInEditor, "Open in Editor")
    static async openInEditor(item?: TreeEntry): Promise<void> {
        return this.runCommand(this.openInEditorCommands, item);
    }

    @extensionActivate(cs.cds.extension.productId)
    async activate(context: vscode.ExtensionContext) {
        const isNew = !CdsExplorerView.treeProvider;        
        CdsExplorerView.treeProvider = isNew ? new CdsExplorerTreeProvider() : CdsExplorerView.treeProvider;

        if (isNew) {
            TreeEntryCache.Instance.SolutionMap = await SolutionMap.loadFromWorkspace(undefined, false);
    
            vscode.window.registerTreeDataProvider(cs.cds.viewContainers.cdsExplorer, CdsExplorerView.treeProvider);
        }
    }
}

class CdsExplorerTreeProvider implements vscode.TreeDataProvider<TreeEntry> {
	private _onDidChangeTreeData: vscode.EventEmitter<TreeEntry | undefined> = new vscode.EventEmitter<TreeEntry | undefined>();
    readonly onDidChangeTreeData: vscode.Event<TreeEntry | undefined> = this._onDidChangeTreeData.event;
    private _connections: CdsWebApi.Config[] = [];

	constructor() {
        this._connections = DiscoveryRepository.getConnections(ExtensionContext.Instance);

        if (this._connections && this._connections.length > 0) {
            this.refresh();
        }
    }

    getTreeItem(element: TreeEntry): vscode.TreeItem {
		return element;
	}

	async getChildren(element?: TreeEntry): Promise<TreeEntry[]> {
        if (element) {
            const commandPrefix:string = Utilities.String.noSlashes(((element.command && element.command.arguments) || '').toString());

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

    addConnection(...options: CdsWebApi.Config[]): void {
        const connections = this._connections || [];

        if (options && options.length > 0) {
            options.forEach(o => {
                // Make sure the connection has an id
                if (!o.id) {
                    // give this an id
                    o.id = Utilities.Guid.newGuid();
                    // add it to the list
                    connections.push(o); 
                } else {
                    const updateIndex = this._connections.findIndex(c => c.id === o.id);
                    connections[updateIndex] = o;
                }
            });
        }

        // save to state and assign to our local connections variable.
        this._connections = DiscoveryRepository.saveConnections(ExtensionContext.Instance, connections);

        // refresh the treeview
        this.refresh();
    }

    getConnections(): CdsWebApi.Config[] {
        return this._connections;
    }

    removeConnection(connection: CdsWebApi.Config): void { 
        const removeIndex = this._connections.findIndex(c => c.webApiUrl === connection.webApiUrl);
        
        if (removeIndex >= 0) {
            this._connections.splice(removeIndex, 1);
            DiscoveryRepository.saveConnections(ExtensionContext.Instance, this._connections);
            this.refresh();
        }
    }

    async removePluginStep(config: CdsWebApi.Config, step: any) {
        if (step && step.sdkmessageprocessingstepid) {
            const api = new ApiRepository(config);
            await api.removePluginStep(step);
        }
    }

    async removePluginStepImage (config: CdsWebApi.Config, stepImage: any) {
        if (stepImage && stepImage.sdkmessageprocessingstepimageid) {
            const api = new ApiRepository(config);
            await api.removePluginStepImage(stepImage);
        }
    }

    refresh(item?:TreeEntry): void {
        this._onDidChangeTreeData.fire(item);
    }

    refreshSolution(solutionPath?:string): void {
        if (solutionPath) {
            TreeEntryCache.Instance.Items
                .where(i => i.id === solutionPath)
                .forEach(i => this._onDidChangeTreeData.fire(i));
        }
    }

	private getConnectionEntries(): TreeEntry[] {
        const result: TreeEntry[] = [];
        
        if (this._connections) {
            this._connections.forEach(connection => {
                const displayName = (connection.name)
                    ? connection.name
                    : connection.webApiUrl.replace("http://", "").replace("https://", "");
    
                result.push(new TreeEntry(
                    displayName, 
                    "Connection", 
                    vscode.TreeItemCollapsibleState.Collapsed, 
                    connection.webApiUrl, 
                    {
                        command: cs.cds.controls.cdsExplorer.clickEntry,
                        title: connection.webApiUrl,
                        arguments: [connection.webApiUrl]
                    },
                    connection                
                ));
            });
        }

        return result;
    }
    
    private getConnectionDetails(element: TreeEntry, commandPrefix?:string): Promise<TreeEntry[]> {
        const connection = element.config;
        const api = new DiscoveryRepository(connection);
        
        let filter;

        if (connection.type === CdsWebApi.ConfigType.Online && connection.appUrl) {
            filter = `Url eq '${Utilities.String.noTrailingSlash(connection.appUrl)}'`;
        } else if (connection.type === CdsWebApi.ConfigType.Online && connection.webApiUrl) {
            filter = `ApiUrl eq '${Utilities.String.noTrailingSlash(connection.webApiUrl)}'`;
        }

        const returnValue = this.createTreeEntries(api.retrieveOrganizations(filter), 
            org =>  new TreeEntry(
                org.FriendlyName, 
                "Organization",
                vscode.TreeItemCollapsibleState.Collapsed,
                org.Version, 
                {
                    command: cs.cds.controls.cdsExplorer.clickEntry,
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
        const showDefaultSolution = ExtensionConfiguration.getConfigurationValue<boolean>(cs.cds.configuration.explorer.showDefaultSolution);
        
        if (element.itemType === "Solution" || showDefaultSolution) {
            returnObject.push(new TreeEntry(
                'Entities',
                "Entities",
                vscode.TreeItemCollapsibleState.Collapsed, 
                null,
                {
                    command: cs.cds.controls.cdsExplorer.clickEntry,
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
                    command: cs.cds.controls.cdsExplorer.clickEntry,
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
                    command: cs.cds.controls.cdsExplorer.clickEntry,
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
                    command: cs.cds.controls.cdsExplorer.clickEntry,
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
                    command: cs.cds.controls.cdsExplorer.clickEntry,
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
                        command: cs.cds.controls.cdsExplorer.clickEntry,
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
                command: cs.cds.controls.cdsExplorer.clickEntry,
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
                command: cs.cds.controls.cdsExplorer.clickEntry,
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
                command: cs.cds.controls.cdsExplorer.clickEntry,
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
                command: cs.cds.controls.cdsExplorer.clickEntry,
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
                command: cs.cds.controls.cdsExplorer.clickEntry,
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
                command: cs.cds.controls.cdsExplorer.clickEntry,
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
                command: cs.cds.controls.cdsExplorer.clickEntry,
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
                command: cs.cds.controls.cdsExplorer.clickEntry,
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
        logger.log(`cdsTreeView: Getting Solutions from ${element.config.webApiUrl}`);

        const returnValue = this.createTreeEntries(
            api.retrieveSolutions(), 
            solution => new TreeEntry(
                solution.friendlyname, 
                "Solution",
                vscode.TreeItemCollapsibleState.Collapsed,
                `v${solution.version} (${solution.ismanaged ? "Managed" :  "Unmanaged"})`, 
                {
                    command: cs.cds.controls.cdsExplorer.clickEntry,
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
                    command: cs.cds.controls.cdsExplorer.clickEntry,
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
                    command: cs.cds.controls.cdsExplorer.clickEntry,
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
                    command: cs.cds.controls.cdsExplorer.clickEntry,
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
                    command: cs.cds.controls.cdsExplorer.clickEntry,
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
                    command: cs.cds.controls.cdsExplorer.clickEntry,
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
                    command: cs.cds.controls.cdsExplorer.clickEntry,
                    title: webresource.displayname,
                    arguments: [`${commandPrefix || ''}/${webresource.webresourceid}`]
                },
                element.config,
                webresource),
            `An error occurred while retrieving web resources from ${element.config.webApiUrl}`, 
            () => this.getWebResourcesDetails(element, commandPrefix, solution, folder))
            .then(results => { 
                if (folder) {
                    if (results && results.length > 0) {
                        results.forEach(r => r.label = r.label.replace(Utilities.String.withTrailingSlash(r.folder), '')); 
                    }
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
                <string | undefined>CdsUrlResolver.parseProcessType(process.category), 
                {
                    command: cs.cds.controls.cdsExplorer.clickEntry,
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
                        command: cs.cds.controls.cdsExplorer.clickEntry,
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
                        command: cs.cds.controls.cdsExplorer.clickEntry,
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
                        command: cs.cds.controls.cdsExplorer.clickEntry,
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
                    command: cs.cds.controls.cdsExplorer.clickEntry,
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
                    command: cs.cds.controls.cdsExplorer.clickEntry,
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
                    command: cs.cds.controls.cdsExplorer.clickEntry,
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
                    command: cs.cds.controls.cdsExplorer.clickEntry,
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
                        command: cs.cds.controls.cdsExplorer.clickEntry,
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
                                command: cs.cds.controls.cdsExplorer.clickEntry,
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
                                command: cs.cds.controls.cdsExplorer.clickEntry,
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
                                command: cs.cds.controls.cdsExplorer.clickEntry,
                                title: r.SchemaName,
                                arguments: [`${commandPrefix || ''}/${r.SchemaName}`]
                            },
                            element.config,
                            r));
                    });
                }

                return new TS.Linq.Enumerator(result).orderBy(r => r.label).toArray();
            }).catch(error => {
                Quickly.askToRetry(`An error occurred while retrieving relationships from ${element.config.webApiUrl}`, () => this.getEntityRelationshipDetails(element, commandPrefix, entity));

                return null;
            });
    }

    private createTreeEntries(whenComplete: Promise<any[]>, parser: (item: any) => TreeEntry, errorMessage?:string, retryFunction?:any): Promise<TreeEntry[]> {
        return whenComplete
            .then(items => {
                logger.log(`createTreeEntries: items = ${items && items.length ? 'new Array(' + items.length + ')' : 'undefined' }`);

                const result : TreeEntry[] = new Array();

                if (!items)
                {
                    return;
                }

                for (let i = 0; i < items.length; i++) {
                    const item: any = items[i];
                    let treeItem;

                    try {
                        treeItem = parser(item);
                    } catch (error) {
                        Quickly.error(`There was an error parsing one of the tree entries: ${error && error.message ? error.message : error.toString() }`);
                    }

                    if (treeItem) {
                        result.push(treeItem);
                    }
                }

                logger.log(`createTreeEntries: result = ${result && result.length ? 'new Array(' + result.length + ')' : 'undefined' }`);

                return result;
            })
            .catch(err => {
                if (errorMessage && retryFunction) {
                    Quickly.askToRetry(errorMessage, retryFunction);
                }

                return null;
            });
    }
}

class TreeEntryCache {
    private static _instance:TreeEntryCache;

    private _items:TreeEntry[] = [];

    private constructor() { 
        this.SolutionMap = new SolutionMap();

        if (vscode.workspace.workspaceFolders && vscode.workspace.workspaceFolders.length > 0) {
            SolutionMap.loadFromWorkspace().then(map => this.SolutionMap = map || this.SolutionMap);
        }
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

    ClearMap(): void { 
        this.SolutionMap = null;
    }

    get Items(): TS.Linq.Enumerator<TreeEntry> {
        return new TS.Linq.Enumerator(this._items);
    }

    SolutionMap: SolutionMap;

    Under(path:string): TS.Linq.Enumerator<TreeEntry> {
        return this.Items.where(item => item.id.startsWith(path));
    }
}

class TreeEntry extends vscode.TreeItem {
    private static readonly canRefreshEntryTypes:EntryType[] = [ "Solutions", "Plugins", "Entities", "OptionSets", "WebResources", "Processes", "Attributes", "Forms", "Views", "Charts", "Dashboards", "Keys", "Relationships", "Entries" ];
    private static readonly canAddEntryTypes:EntryType[] = [ "Solutions", "Plugins", "Entities", "OptionSets", "WebResources", "Processes", "Attributes", "Forms", "Views", "Charts", "Dashboards", "Keys", "Relationships", "Entries", "PluginType", "PluginStep" ];
    private static readonly canEditEntryTypes:EntryType[] = [ "Connection", "Solution", "Entity", "OptionSet", "WebResource", "Process", "Attribute", "Form", "View", "Chart", "Dashboard", "Key", "OneToManyRelationship", "ManyToOneRelationship", "ManyToManyRelationship", "Entry", "PluginStep", "PluginStepImage" ];
    private static readonly canDeleteEntryTypes:EntryType[] = [ "Connection", "PluginStep", "PluginStepImage" ];
    private static readonly canInspectEntryTypes:EntryType[] = [ "Connection", "Solution", "Entity", "OptionSet", "WebResource", "Process", "Attribute", "Form", "View", "Chart", "Dashboard", "Key", "OneToManyRelationship", "ManyToOneRelationship", "ManyToManyRelationship", "Entry", "PluginStep" ];
    private static readonly canUnpackSolutionEntryTypes:EntryType[] = [ "Solution" ];
    private static readonly canMoveSolutionEntryTypes:EntryType[] = [ "Solution" ];
    private static readonly canOpenInAppEntryTypes:EntryType[] = [ "View", "Entity", "Dashboard" ];
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
        public readonly config?: CdsWebApi.Config,
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
       
        return null;
    }

    get solution(): any {
        let solution: any;

        if (this.id)
        {
            const split = this.id.split("/");
            const index = split.indexOf("Solutions");
            
            if (index >= 0) {
                const solutionTreeId = split.slice(0, index + 2).join('/');
                const solutionTreeEntry = TreeEntryCache.Instance.Items.where(i => i.id === solutionTreeId).toArray();
                if (solutionTreeEntry && solutionTreeEntry.length > 0) {
                    solution = solutionTreeEntry[0].context;
                }
            }        
        }

        return solution;
    }

    get solutionIdPath(): string { 
        if (this.id)
        {
            const split = this.id.split("/");
            const index = split.indexOf("Solutions");
            
            if (index >= 0) {
                return split.slice(0, index + 2).join("/");
            }        
        }
       
        return null;
    }

    get solutionMapping(): SolutionWorkspaceMapping {
        if (this.id && this.itemType === "Solution") {
            if (TreeEntryCache.Instance && TreeEntryCache.Instance.SolutionMap) {
                const maps = TreeEntryCache.Instance.SolutionMap.getBySolutionId(this.context.solutionid, this.config.orgId);

                if (maps && maps.length > 0) {
                    return maps[0];
                }            
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
        this.addCapability(returnValue, "canInspectItem", TreeEntry.canInspectEntryTypes);
        this.addCapability(returnValue, "canUnpackSolution", TreeEntry.canUnpackSolutionEntryTypes);
        this.addCapability(returnValue, "canAddToSolution", TreeEntry.canAddToSolutionEntryTypes, () => !this.solutionId);
        this.addCapability(returnValue, "canRemoveFromSolution", TreeEntry.canRemoveFromSolutionEntryTypes, () => !Utilities.$Object.isNullOrEmpty(this.solutionId));
        this.addCapability(returnValue, "canMoveSolution", TreeEntry.canMoveSolutionEntryTypes, () => this.solutionMapping && !Utilities.$Object.isNullOrEmpty(this.solutionMapping.path));
        this.addCapability(returnValue, "canOpenInApp", TreeEntry.canOpenInAppEntryTypes);
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