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
import { DynamicsWebApi } from '../api/cds-webapi/DynamicsWebApi';
import { ExtensionIconThemes } from "../components/WebDownloaders/Types";
import Quickly from '../core/Quickly';
import SolutionMap from '../components/Solutions/SolutionMap';
import SolutionWorkspaceMapping from "../components/Solutions/SolutionWorkspaceMapping";
import { CdsSolutions } from '../api/CdsSolutions';

export default class DynamicsTreeView implements IContributor {
    public static Instance:DynamicsServerTreeProvider;

    public contribute(context: vscode.ExtensionContext, config?: vscode.WorkspaceConfiguration) {
        const isNew = !DynamicsTreeView.Instance;        
        const treeProvider = isNew ? new DynamicsServerTreeProvider(context) : DynamicsTreeView.Instance;

        if (isNew) {
            TreeEntryCache.Context = context;
            DynamicsTreeView.Instance = treeProvider;
            vscode.window.registerTreeDataProvider(cs.dynamics.viewContainers.dynamicsExplorer, treeProvider);        
        }
        
        // setup commands
        context.subscriptions.push(
            vscode.commands.registerCommand(cs.dynamics.controls.dynamicsTreeView.refreshEntry, (item?: TreeEntry) => {
                treeProvider.refresh(item);
            })
            , vscode.commands.registerCommand(cs.dynamics.controls.dynamicsTreeView.addConnection, (config: DynamicsWebApi.Config) => {
                treeProvider.addConnection(config);
            })
            , vscode.commands.registerCommand(cs.dynamics.controls.dynamicsTreeView.clickEntry, (item?: TreeEntry) => { // Match name of command to package.json command
                if (item.collapsibleState === vscode.TreeItemCollapsibleState.Collapsed) {
                    item.collapsibleState = vscode.TreeItemCollapsibleState.Expanded;
                }            
            }) 
            , vscode.commands.registerCommand(cs.dynamics.controls.dynamicsTreeView.deleteEntry, (item: TreeEntry) => { // Match name of command to package.json command
                switch(item.itemType) {
                    case "Connection":
                        treeProvider.removeConnection(item.config);
                        break;
                    case "PluginStep":
                        treeProvider.removePluginStep(item.config, item.context).then(() => treeProvider.refresh(item.parent));
                        break;
                    case "PluginStepImage":
                        treeProvider.removePluginStepImage(item.config, item.context).then(() => treeProvider.refresh(item.parent));
                        break;
                }
            }) 
            , vscode.commands.registerCommand(cs.dynamics.controls.dynamicsTreeView.inspectEntry, (item: TreeEntry) => { // Match name of command to package.json command
                vscode.commands.executeCommand(cs.dynamics.controls.jsonInspector.inspect, item.context);
            }) 
            , vscode.commands.registerCommand(cs.dynamics.controls.dynamicsTreeView.moveSolution, (item: TreeEntry) => { // Match name of command to package.json command
                vscode.commands.executeCommand(cs.dynamics.deployment.updateSolutionMapping, item.solutionMapping, item.config)
                    .then(result => TreeEntryCache.Instance.ClearMap());
            }) 
            , vscode.commands.registerCommand(cs.dynamics.controls.dynamicsTreeView.addEntryToSolution, (item: TreeEntry) => { // Match name of command to package.json command
                if (item.solutionId) {
                    vscode.window.showInformationMessage(`The component ${item.label} is already a part of a solution.`);

                    return;
                }

                let componentId:string;
                let componentType:CdsSolutions.SolutionComponent;

                switch (item.itemType) {
                    case "Plugin":
                        componentType = CdsSolutions.SolutionComponent.PluginAssembly;
                        componentId = item.context.pluginassemblyid;

                        break;
                    case "WebResource":
                        componentType = CdsSolutions.SolutionComponent.WebResource;
                        componentId = item.context.webresourceid;

                        break;
                    case "Process":
                        componentType = CdsSolutions.SolutionComponent.Workflow;
                        componentId = item.context.workflowid;

                        break;
                    case "Entity":
                        componentType = CdsSolutions.SolutionComponent.Entity;
                        componentId = item.context.MetadataId;

                        break;
                    case "OptionSet":
                        componentType = CdsSolutions.SolutionComponent.OptionSet;
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
            , vscode.commands.registerCommand(cs.dynamics.controls.dynamicsTreeView.removeEntryFromSolution, (item: TreeEntry) => { // Match name of command to package.json command
                if (!item.solutionId) {
                    vscode.window.showInformationMessage(`The component ${item.label} is not part of a solution.`);

                    return;
                }

                let componentId:string;
                let componentType:CdsSolutions.SolutionComponent;

                switch (item.itemType) {
                    case "Plugin":
                        componentType = CdsSolutions.SolutionComponent.PluginAssembly;
                        componentId = item.context.pluginassemblyid;

                        break;
                    case "WebResource":
                        componentType = CdsSolutions.SolutionComponent.WebResource;
                        componentId = item.context.webresourceid;

                        break;
                    case "Process":
                        componentType = CdsSolutions.SolutionComponent.Workflow;
                        componentId = item.context.workflowid;

                        break;
                    case "Entity":
                        componentType = CdsSolutions.SolutionComponent.Entity;
                        componentId = item.context.MetadataId;

                        break;
                    case "OptionSet":
                        componentType = CdsSolutions.SolutionComponent.OptionSet;
                        componentId = item.context.MetadataId;

                        break;
                }

                if (!Utilities.$Object.isNullOrEmpty(item.solutionIdPath)) {
                    const solutions = TreeEntryCache.Instance.Items.where(i => i.id === item.solutionIdPath).toArray();
                    
                    if (solutions && solutions.length > 0 && componentId && componentType) {
                        return vscode.commands.executeCommand(cs.dynamics.deployment.removeSolutionComponent, item.config, solutions[0].context, componentId, componentType)
                            .then(response => treeProvider.refreshSolution(item.solutionIdPath));
                    }
                 }
            }) 
            , vscode.commands.registerCommand(cs.dynamics.controls.dynamicsTreeView.addEntry, async (item: TreeEntry) => { // Match name of command to package.json command
                if (!item) {
                    vscode.commands.executeCommand(cs.dynamics.controls.dynamicsTreeView.editConnection);
                    //vscode.commands.executeCommand(cs.dynamics.controls.newWorkspace.open);

                    return;
                }

                let retryFunction = () => vscode.commands.executeCommand(cs.dynamics.controls.dynamicsTreeView.addEntry, item);
                const hasWorkspace = vscode.workspace.workspaceFolders && vscode.workspace.workspaceFolders.length > 0;

                switch (item.itemType)
                {
                    case "Solutions":
                        Utilities.Browser.openWindow(CdsUrlResolver.getManageSolutionUri(item.config), retryFunction);
                        break;
                    case "Entities":
                        Utilities.Browser.openWindow(CdsUrlResolver.getManageEntityUri(item.config, undefined, item.solutionId), retryFunction);
                        break;
                    case "Attributes":
                        Utilities.Browser.openWindow(CdsUrlResolver.getManageAttributeUri(item.config, item.context.MetadataId, undefined, item.solutionId), retryFunction);
                        break;       
                    case "OptionSets":
                        Utilities.Browser.openWindow(CdsUrlResolver.getManageOptionSetUri(item.config, item.parent && item.parent.context ? item.parent.context.MetadataId : undefined, item.parent && item.parent.context ? item.parent.context.ObjectTypeCode : undefined, undefined, item.solutionId), retryFunction);
                        break;
                    case "Processes":                 
                        let processType = await Quickly.pickEnum<CdsSolutions.ProcessType>(CdsSolutions.ProcessType);

                        if (processType) {
                            Utilities.Browser.openWindow(CdsUrlResolver.getManageBusinessProcessUri(item.config, processType, item.parent && item.parent.context && item.parent.context.ObjectTypeCode ? item.parent.context.ObjectTypeCode : undefined, item.solutionId), retryFunction);
                        }
                        
                        break;
                    case "Keys":
                        Utilities.Browser.openWindow(CdsUrlResolver.getManageEntityKeyUrl(item.config, item.context.MetadataId, undefined, item.solutionId), retryFunction);
                        break;
                    case "Relationships":
                        Utilities.Browser.openWindow(CdsUrlResolver.getManageEntityRelationshipUrl(item.config, item.context.MetadataId, undefined, item.solutionId), retryFunction);
                        break;
                    case "Forms":   
                        let formType = await Quickly.pickEnum<CdsSolutions.DynamicsForm>(CdsSolutions.DynamicsForm);

                        if (formType) {
                            Utilities.Browser.openWindow(CdsUrlResolver.getManageEntityFormUri(item.config, item.context.ObjectTypeCode, formType, undefined, item.solutionId), retryFunction);
                        }

                        break;
                    case "Dashboards":
                        let layoutType = await Quickly.pickEnum<CdsSolutions.InteractiveDashboardLayout>(CdsSolutions.InteractiveDashboardLayout);

                        if (layoutType) {
                            Utilities.Browser.openWindow(CdsUrlResolver.getManageEntityDashboardUri(item.config, item.context.ObjectTypeCode, layoutType, "1030", undefined, item.solutionId), retryFunction);
                        }

                        break;
                    case "Views":
                        Utilities.Browser.openWindow(CdsUrlResolver.getManageEntityViewUri(item.config, item.context.MetadataId, item.context.ObjectTypeCode, undefined, item.solutionId), retryFunction);
                        break;
                    case "Charts":
                        Utilities.Browser.openWindow(CdsUrlResolver.getManageEntityChartUrl(item.config, item.context.ObjectTypeCode, undefined, item.solutionId), retryFunction);
                        break;
                    case "WebResources":
                        if (hasWorkspace) {
                            vscode.commands.executeCommand(cs.dynamics.deployment.createWebResource, item.config, item.solutionId, undefined, undefined, item.folder);
                        } else {
                            Utilities.Browser.openWindow(CdsUrlResolver.getManageWebResourceUri(item.config, undefined, item.solutionId), retryFunction);
                        }
                        break;
                    case "PluginType":
                        if (!item.context._pluginassemblyid_value) { return; }
                        vscode.commands.executeCommand(cs.dynamics.controls.pluginStep.open, item.context._pluginassemblyid_value);
                        break;
                    case "PluginStep":
                        vscode.commands.executeCommand(cs.dynamics.controls.pluginStepImage.open, item.context.sdkmessageprocessingstepid, null, item.config);
                        break;
                }
            })   
            , vscode.commands.registerCommand(cs.dynamics.controls.dynamicsTreeView.editEntry, async (item: TreeEntry) => { // Match name of command to package.json command
                let retryFunction = () => vscode.commands.executeCommand(cs.dynamics.controls.dynamicsTreeView.editEntry, item);
                const hasWorkspace = vscode.workspace.workspaceFolders && vscode.workspace.workspaceFolders.length > 0;

                switch (item.itemType)
                {
                    case "Connection":
                        vscode.commands.executeCommand(cs.dynamics.controls.dynamicsTreeView.editConnection, item.config);
                        break;
                    case "Solution":
                        Utilities.Browser.openWindow(CdsUrlResolver.getManageSolutionUri(item.config, item.context.solutionid), retryFunction);
                        break;
                    case "Entity":
                        Utilities.Browser.openWindow(CdsUrlResolver.getManageEntityUri(item.config, item.context.MetadataId, item.solutionId), retryFunction);
                        break;
                    case "Attribute":
                        Utilities.Browser.openWindow(CdsUrlResolver.getManageAttributeUri(item.config, item.parent.context.MetadataId, item.context.MetadataId, item.solutionId), retryFunction);
                        break;
                    case "OptionSet":
                        Utilities.Browser.openWindow(CdsUrlResolver.getManageOptionSetUri(item.config, item.parent && item.parent.context ? item.parent.context.MetadataId : undefined, item.parent && item.parent.context ? item.parent.context.ObjectTypeCode : undefined, item.context.MetadataId, item.solutionId), retryFunction);
                        break;
                    case "Process":
                        Utilities.Browser.openWindow(CdsUrlResolver.getManageBusinessProcessUri(item.config, CdsUrlResolver.parseProcessType(item.context.category), item.parent && item.parent.context && item.parent.context.ObjectTypeCode ? item.parent.context.ObjectTypeCode : undefined, item.context.workflowid, item.solutionId), retryFunction);
                        break;
                    case "Key":
                        Utilities.Browser.openWindow(CdsUrlResolver.getManageEntityKeyUrl(item.config, item.parent.context.MetadataId, item.context.MetadataId, item.solutionId), retryFunction);
                        break;
                    case "OneToManyRelationship":
                    case "ManyToOneRelationship":
                    case "ManyToManyRelationship":
                        Utilities.Browser.openWindow(CdsUrlResolver.getManageEntityRelationshipUrl(item.config, item.parent.context.MetadataId, item.context.MetadataId, item.solutionId), retryFunction);
                        break;
                    case "Form":
                        Utilities.Browser.openWindow(CdsUrlResolver.getManageEntityFormUri(item.config, item.parent.context.ObjectTypeCode, CdsUrlResolver.parseFormType(item.context.type), item.context.formid, item.solutionId), retryFunction);
                        break;
                    case "Dashboard":
                        Utilities.Browser.openWindow(CdsUrlResolver.getManageEntityDashboardUri(item.config, undefined, undefined, "1032", item.context.formid, item.solutionId), retryFunction);
                        break;
                    case "View":
                        Utilities.Browser.openWindow(CdsUrlResolver.getManageEntityViewUri(item.config, item.parent.context.MetadataId, item.parent.context.ObjectTypeCode, item.context.savedqueryid, item.solutionId), retryFunction);
                        break;     
                    case "Chart":
                        Utilities.Browser.openWindow(CdsUrlResolver.getManageEntityChartUrl(item.config, item.parent.context.ObjectTypeCode, item.context.savedqueryvisualizationid, item.solutionId), retryFunction);
                        break;     
                    case "WebResources":
                        if (hasWorkspace) {
                            vscode.commands.executeCommand(cs.dynamics.deployment.unpackWebResource, item.config, item.context, undefined, true);
                        } else {
                            Utilities.Browser.openWindow(CdsUrlResolver.getManageWebResourceUri(item.config, item.context.webresourceid, item.solutionId), retryFunction);
                        }

                        break;
                    case "PluginStep":
                        if (!item.context.eventhandler_plugintype) { return; }
                        vscode.commands.executeCommand(cs.dynamics.controls.pluginStep.open, item.context.eventhandler_plugintype._pluginassemblyid_value, item.context);
                        break;
                    case "PluginStepImage":
                        vscode.commands.executeCommand(cs.dynamics.controls.pluginStepImage.open, item.context._sdkmessageprocessingstepid_value, item.context, item.config);
                        break;
                }
           }) 
           , vscode.commands.registerCommand(cs.dynamics.controls.dynamicsTreeView.openInApp, async (item: TreeEntry) => {
                let retryFunction = () => vscode.commands.executeCommand(cs.dynamics.controls.dynamicsTreeView.openInApp, item);

                switch (item.itemType) {
                    case "Entity":
                        Utilities.Browser.openWindow(CdsUrlResolver.getOpenEntityUsingAppUrl(item.context.LogicalName), retryFunction);
                        break;
                    case "Dashboard":
                        Utilities.Browser.openWindow(CdsUrlResolver.getOpenEntityDashboardUsingAppUrl(item.context.formid), retryFunction);
                        break;
                    case "View":
                        Utilities.Browser.openWindow(CdsUrlResolver.getOpenEntityViewUsingAppUrl(item.parent.context.LogicalName, item.context.savedqueryid), retryFunction);
                        break;
                }
           })
           , vscode.commands.registerCommand(cs.dynamics.controls.dynamicsTreeView.openInBrowser, async (item: TreeEntry) => {
                let retryFunction = () => vscode.commands.executeCommand(cs.dynamics.controls.dynamicsTreeView.openInBrowser, item);

                switch (item.itemType) {
                    case "Entity":
                        Utilities.Browser.openWindow(CdsUrlResolver.getOpenEntityFormUri(item.config, item.context.LogicalName), retryFunction);
                        break;
                    case "Form":
                    case "Dashboard":
                        Utilities.Browser.openWindow(CdsUrlResolver.getOpenEntityFormUri(item.config, item.parent.context.LogicalName, item.context.formid), retryFunction);
                        break;
                    case "View":
                        Utilities.Browser.openWindow(CdsUrlResolver.getOpenEntityViewUri(item.config, item.parent.context.LogicalName, item.context.savedqueryid), retryFunction);
                        break;
                }
           })
           , vscode.commands.registerCommand(cs.dynamics.controls.dynamicsTreeView.openInEditor, async (item: TreeEntry) => {
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

    addConnection(...options: DynamicsWebApi.Config[]): void {
        options.forEach(o => {
            // Make sure the connection has an id
            if (!o.id) {
                // give this an id
                o.id = Utilities.Guid.newGuid();
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

    getConnections():DynamicsWebApi.Config[] {
        return this._connections;
    }

    removeConnection(connection: DynamicsWebApi.Config): void { 
        const removeIndex = this._connections.findIndex(c => c.webApiUrl === connection.webApiUrl);
        
        if (removeIndex >= 0) {
            this._connections.splice(removeIndex, 1);
            DiscoveryRepository.saveConnections(this._context, this._connections);
            this.refresh();
        }
    }

    async removePluginStep(config: DynamicsWebApi.Config, step: any) {
        if (step && step.sdkmessageprocessingstepid) {
            const api = new ApiRepository(config);
            await api.removePluginStep(step);
        }
    }

    async removePluginStepImage (config: DynamicsWebApi.Config, stepImage: any) {
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
                    command: cs.dynamics.controls.dynamicsTreeView.clickEntry,
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
                    command: cs.dynamics.controls.dynamicsTreeView.clickEntry,
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
                    command: cs.dynamics.controls.dynamicsTreeView.clickEntry,
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
                    command: cs.dynamics.controls.dynamicsTreeView.clickEntry,
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
                    command: cs.dynamics.controls.dynamicsTreeView.clickEntry,
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
                    command: cs.dynamics.controls.dynamicsTreeView.clickEntry,
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
                    command: cs.dynamics.controls.dynamicsTreeView.clickEntry,
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
                        command: cs.dynamics.controls.dynamicsTreeView.clickEntry,
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
                command: cs.dynamics.controls.dynamicsTreeView.clickEntry,
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
                command: cs.dynamics.controls.dynamicsTreeView.clickEntry,
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
                command: cs.dynamics.controls.dynamicsTreeView.clickEntry,
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
                command: cs.dynamics.controls.dynamicsTreeView.clickEntry,
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
                command: cs.dynamics.controls.dynamicsTreeView.clickEntry,
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
                command: cs.dynamics.controls.dynamicsTreeView.clickEntry,
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
                command: cs.dynamics.controls.dynamicsTreeView.clickEntry,
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
                command: cs.dynamics.controls.dynamicsTreeView.clickEntry,
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
                    command: cs.dynamics.controls.dynamicsTreeView.clickEntry,
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
                    command: cs.dynamics.controls.dynamicsTreeView.clickEntry,
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
                    command: cs.dynamics.controls.dynamicsTreeView.clickEntry,
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
                    command: cs.dynamics.controls.dynamicsTreeView.clickEntry,
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
                    command: cs.dynamics.controls.dynamicsTreeView.clickEntry,
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
                    command: cs.dynamics.controls.dynamicsTreeView.clickEntry,
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
                    command: cs.dynamics.controls.dynamicsTreeView.clickEntry,
                    title: webresource.displayname,
                    arguments: [`${commandPrefix || ''}/${webresource.webresourceid}`]
                },
                element.config,
                webresource),
            `An error occurred while retrieving web resources from ${element.config.webApiUrl}`, 
            () => this.getWebResourcesDetails(element, commandPrefix, solution, folder))
            .then(results => { 
                if (folder) {
                    results.forEach(r => r.label = r.label.replace(Utilities.String.withTrailingSlash(r.folder), '')); 
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
                    command: cs.dynamics.controls.dynamicsTreeView.clickEntry,
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
                        command: cs.dynamics.controls.dynamicsTreeView.clickEntry,
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
                        command: cs.dynamics.controls.dynamicsTreeView.clickEntry,
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
                        command: cs.dynamics.controls.dynamicsTreeView.clickEntry,
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
                    command: cs.dynamics.controls.dynamicsTreeView.clickEntry,
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
                    command: cs.dynamics.controls.dynamicsTreeView.clickEntry,
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
                    command: cs.dynamics.controls.dynamicsTreeView.clickEntry,
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
                    command: cs.dynamics.controls.dynamicsTreeView.clickEntry,
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
                        command: cs.dynamics.controls.dynamicsTreeView.clickEntry,
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
                                command: cs.dynamics.controls.dynamicsTreeView.clickEntry,
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
                                command: cs.dynamics.controls.dynamicsTreeView.clickEntry,
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
                                command: cs.dynamics.controls.dynamicsTreeView.clickEntry,
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
                const result : TreeEntry[] = new Array();

                if (!items)
                {
                    return;
                }

                for (let i = 0; i < items.length; i++) {
                    const item: any = items[i];
                    const treeItem = parser(item);

                    result.push(treeItem);
                }

                return result;
            })
            .catch(err => {
                console.error(err.innererror ? err.innererror : err);

                if (errorMessage && retryFunction) {
                    Quickly.askToRetry(errorMessage, retryFunction);
                }

                return null;
            });
    }
}

class TreeEntryCache {
    private static _instance:TreeEntryCache;
    private static _context:vscode.ExtensionContext;

    private _items:TreeEntry[] = [];
    private _solutionMap:SolutionMap;

    private constructor() { 
    }

    static get Instance(): TreeEntryCache {
        if (!this._instance) {
            this._instance = new TreeEntryCache();
        }

        return this._instance;
    }

    static set Context(value:vscode.ExtensionContext) {
        TreeEntryCache._context = value;
    }
    
    AddEntry(entry:TreeEntry): void {
        this._items.push(entry);
    }

    Clear(): void {
        this._items = [];
    }

    ClearMap(): void { 
        this._solutionMap = null;
    }

    get Items(): TS.Linq.Enumerator<TreeEntry> {
        return new TS.Linq.Enumerator(this._items);
    }

    get SolutionMap(): SolutionMap {
        if (!this._solutionMap && TreeEntryCache._context) {
            this._solutionMap = SolutionMap.loadFromWorkspace(TreeEntryCache._context);
        }

        return this._solutionMap;
    }

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
        public readonly config?: DynamicsWebApi.Config,
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
            const maps = TreeEntryCache.Instance.SolutionMap.getBySolutionId(this.context.solutionid, this.config.orgId);

            if (maps && maps.length > 0) {
                return maps[0];
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