import * as vscode from 'vscode';
import * as cs from '../cs';
import { TS } from 'typescript-linq/TS';
import DiscoveryRepository from '../repositories/discoveryRepository';
import ApiRepository from '../repositories/apiRepository';
import { Utilities } from '../core/Utilities';
import MetadataRepository from '../repositories/metadataRepository';
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
    private static solutionComponentMappings = new Dictionary<EntryType, { componentId: (item?: TreeEntry) => Promise<void>, componentType: CdsSolutions.SolutionComponent }>([
        { key: "Plugin", value: { componentId: (item) => item.context.pluginassemblyid, componentType: CdsSolutions.SolutionComponent.PluginAssembly }},
        { key: "WebResource", value: { componentId: (item) => item.context.webresourceid, componentType: CdsSolutions.SolutionComponent.WebResource }},
        { key: "Process", value: { componentId: (item) => item.context.workflowid, componentType: CdsSolutions.SolutionComponent.Workflow }},
        { key: "Entity", value: { componentId: (item) => item.context.MetadataId, componentType: CdsSolutions.SolutionComponent.Entity }},
        { key: "OptionSet", value: { componentId: (item) => item.context.MetadataId, componentType: CdsSolutions.SolutionComponent.OptionSet }}
    ]);

    private static deleteCommands = new Dictionary<EntryType, (item?: TreeEntry) => Promise<void>>([
        { key: "Connection", value: async (item) => CdsExplorerTreeProvider.Instance.removeConnection(item.config) },
        { key: "PluginStep", value: async (item) => CdsExplorerTreeProvider.Instance.removePluginStep(item.config, item.context).then(() => CdsExplorerTreeProvider.Instance.refresh(item.parent)) },
        { key: "PluginStepImage", value: async (item) => CdsExplorerTreeProvider.Instance.removePluginStepImage(item.config, item.context).then(() => CdsExplorerTreeProvider.Instance.refresh(item.parent)) }
    ]);
    
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

    private static openInAppCommands = new Dictionary<EntryType, (item?: TreeEntry) => Promise<void>>([
        { key: "Entity", value: async (item) => Utilities.Browser.openWindow(CdsUrlResolver.getOpenEntityUsingAppUrl(item.context.LogicalName)) },
        { key: "Dashboard", value: async (item) => Utilities.Browser.openWindow(CdsUrlResolver.getOpenEntityDashboardUsingAppUrl(item.context.formid)) },
        { key: "View", value: async (item) => Utilities.Browser.openWindow(CdsUrlResolver.getOpenEntityViewUsingAppUrl(item.parent.context.LogicalName, item.context.savedqueryid)) },
    ]);

    private static openInBrowserCommands = new Dictionary<EntryType, (item?: TreeEntry) => Promise<void>>([
        { key: "Entity", value: async (item) => Utilities.Browser.openWindow(CdsUrlResolver.getOpenEntityFormUri(item.config, item.context.LogicalName)) },
        { key: "Form", value: async (item) => Utilities.Browser.openWindow(CdsUrlResolver.getOpenEntityFormUri(item.config, item.parent.context.LogicalName, item.context.formid)) },
        { key: "Dashboard", value: async (item) => Utilities.Browser.openWindow(CdsUrlResolver.getOpenEntityFormUri(item.config, item.parent.context.LogicalName, item.context.formid)) },
        { key: "View", value: async (item) => Utilities.Browser.openWindow(CdsUrlResolver.getOpenEntityViewUri(item.config, item.parent.context.LogicalName, item.context.savedqueryid)) },
    ]);

    private static openInEditorCommands = new Dictionary<EntryType, (item?: TreeEntry) => Promise<void>>([
        { key: "Form", value: async (item) => await vscode.workspace.openTextDocument({ language:"xml", content:item.context.formxml }).then(d => vscode.window.showTextDocument(d)).then(e => logger.log(`Form loaded in editor`)) },
        { key: "Dashboard", value: async (item) => await vscode.workspace.openTextDocument({ language:"xml", content:item.context.formxml }).then(d => vscode.window.showTextDocument(d)).then(e => logger.log(`Dashboard loaded in editor`)) },
        { key: "View", value: async (item) => await vscode.workspace.openTextDocument({ language:"xml", content:item.context.layoutxml }).then(d => vscode.window.showTextDocument(d)).then(e => logger.log(`View loaded in editor`)) },
        { key: "Chart", value: async (item) => await vscode.workspace.openTextDocument({ language:"xml", content:item.context.presentationdescription }).then(d => vscode.window.showTextDocument(d)).then(e => logger.log(`Chart loaded in editor`)) }
    ]);

    private static async runCommand(definitions: Dictionary<EntryType, (item?: TreeEntry) => Promise<void>>, item?: TreeEntry) {
        if (definitions.containsKey(item.itemType)) {
            return await definitions[item.itemType](item);
        }
    }

    @command(cs.cds.controls.cdsExplorer.refreshEntry, "Refresh")
    static async refreshEntry(item?: TreeEntry) {
        return await CdsExplorerTreeProvider.Instance.refresh(item);
    }

    @command(cs.cds.controls.cdsExplorer.addConnection, "Add Connection")
    static async addConnection(config?: CdsWebApi.Config) {
        return await CdsExplorerTreeProvider.Instance.addConnection(config);
    }

    @command(cs.cds.controls.cdsExplorer.clickEntry, "Click")
    static async clickEntry(item?: TreeEntry) {
        if (item.collapsibleState === vscode.TreeItemCollapsibleState.Collapsed) {
            item.collapsibleState = vscode.TreeItemCollapsibleState.Expanded;
            return await this.refreshEntry(item);
        }            
    }

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

                    CdsExplorerTreeProvider.Instance.refreshSolution(solutionPath.join("/")); 
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
                        .then(response => CdsExplorerTreeProvider.Instance.refreshSolution(item.solutionIdPath));
                }
            }
        }
    }

    @command(cs.cds.controls.cdsExplorer.addEntry, "Add")
    static async addEntry(item?: TreeEntry): Promise<void> {
        if (!item) {
            await vscode.commands.executeCommand(cs.cds.controls.cdsExplorer.editConnection);
        } else {
            return this.runCommand(this.addCommands, item);
        }
    }

    @command(cs.cds.controls.cdsExplorer.editEntry, "Edit")
    static async editEntry(item?: TreeEntry): Promise<void> {
        return this.runCommand(this.editCommands, item);
    }

    @command(cs.cds.controls.cdsExplorer.openInApp, "Open in App")
    static async openInApp(item?: TreeEntry): Promise<void> {
        return this.runCommand(this.openInAppCommands, item);
    }

    @command(cs.cds.controls.cdsExplorer.openInBrowser, "Open in Browser")
    static async openInBrowser(item?: TreeEntry): Promise<void> {
        return this.runCommand(this.openInBrowserCommands, item);
    }

    @command(cs.cds.controls.cdsExplorer.openInEditor, "Open in Editor")
    static async openInEditor(item?: TreeEntry): Promise<void> {
        return this.runCommand(this.openInEditorCommands, item);
    }

    @extensionActivate(cs.cds.extension.productId)
    async activate(context: vscode.ExtensionContext) {
        TreeEntryCache.Instance.SolutionMap = await SolutionMap.loadFromWorkspace(undefined, false);

        vscode.window.registerTreeDataProvider(cs.cds.viewContainers.cdsExplorer, CdsExplorerTreeProvider.Instance);
    }
}

class CdsExplorerTreeProvider implements vscode.TreeDataProvider<TreeEntry> {
	private _onDidChangeTreeData: vscode.EventEmitter<TreeEntry | undefined> = new vscode.EventEmitter<TreeEntry | undefined>();
    readonly onDidChangeTreeData: vscode.Event<TreeEntry | undefined> = this._onDidChangeTreeData.event;
    private _connections: CdsWebApi.Config[] = [];

    private static instance: CdsExplorerTreeProvider;

	private constructor() {
        this._connections = DiscoveryRepository.getConnections(ExtensionContext.Instance);

        if (this._connections && this._connections.length > 0) {
            this.refresh();
        }
    }

    static get Instance(): CdsExplorerTreeProvider {
        if (!this.instance) {
            this.instance = new CdsExplorerTreeProvider();
        }

        return this.instance;
    }

    private getChildrenCommands = new Dictionary<EntryType, (element?: TreeEntry, commandPrefix?: string) => Promise<TreeEntry[]>>([
        { key: "Connection", value: async (element?, commandPrefix?) => await this.getConnectionDetails(element, commandPrefix) },
        { key: "Organization", value: async (element?, commandPrefix?) => await this.getSolutionLevelDetails(element, commandPrefix) },
        { key: "Solutions", value: async (element?, commandPrefix?) => await this.getSolutionDetails(element, commandPrefix) },
        { key: "Solution", value: async (element?, commandPrefix?) => await this.getSolutionLevelDetails(element, commandPrefix) },
        { key: "Processes", value: async (element?, commandPrefix?) => await this.getProcessDetails(element, commandPrefix, element.context) },
        { key: "Plugins", value: async (element?, commandPrefix?) => await this.getPluginDetails(element, commandPrefix, element.context) },
        { key: "Entities", value: async (element?, commandPrefix?) => await this.getEntityDetails(element, commandPrefix, element.context) },
        { key: "OptionSets", value: async (element?, commandPrefix?) => await this.getOptionSetDetails(element, commandPrefix, element.context) },
        { key: "WebResources", value: async (element?, commandPrefix?) => {
            const folders = await this.getWebResourcesFolderDetails(element, commandPrefix, (element.context && element.context.innerContext ? element.context.innerContext : element.context));
            const items = await this.getWebResourcesDetails(element, commandPrefix, (element.context && element.context.innerContext ? element.context.innerContext : element.context));

            if (items && folders) { items.forEach(i => folders.push(i)); }

            return folders && folders.length > 0 ? folders : items;
        }},
        { key: "Folder", value: async (element?, commandPrefix?) => await this.getChildrenCommands[element.context.innerType](element, commandPrefix) },
        { key: "Plugin", value: async (element?, commandPrefix?) => await this.getPluginTypeDetails(element, commandPrefix, element.context) },
        { key: "PluginType", value: async (element?, commandPrefix?) => await this.getPluginStepDetails(element, commandPrefix, element.context) },
        { key: "Entity", value: async (element?, commandPrefix?) => await this.createContainers(element, commandPrefix, element.itemType, [ "Keys", "Attributes", "Relationships", "Views", "Charts", "Forms", "Dashboards", "Processes"]) },
        { key: "Keys", value: async (element?, commandPrefix?) => await this.getEntityKeyDetails(element, commandPrefix, element.context) },
        { key: "Attributes", value: async (element?, commandPrefix?) => await this.getEntityAttributeDetails(element, commandPrefix, element.context) },
        { key: "Views", value: async (element?, commandPrefix?) => await this.getEntityViewDetails(element, commandPrefix, element.solutionId, element.context) },
        { key: "Charts", value: async (element?, commandPrefix?) => await this.getEntityChartDetails(element, commandPrefix, element.solutionId, element.context) },
        { key: "Forms", value: async (element?, commandPrefix?) => await this.getEntityFormDetails(element, commandPrefix, element.solutionId, element.context) },
        { key: "Dashboards", value: async (element?, commandPrefix?) => await this.getEntityDashboardDetails(element, commandPrefix, element.solutionId, element.context) },
        { key: "Relationships", value: async (element?, commandPrefix?) => await this.getEntityRelationshipDetails(element, commandPrefix, element.context) },
    ]);

    private parsers = new Dictionary<EntryType, (item: any, element?: TreeEntry, commandPrefix?: string, ...rest: any[]) => TreeEntry>([
        { key: "Connection", value: connection => {
            const displayName = (connection.name) ? connection.name : connection.webApiUrl.replace("http://", "").replace("https://", "");
    
            return new TreeEntry(displayName, "Connection", vscode.TreeItemCollapsibleState.Collapsed, connection.webApiUrl, { command: cs.cds.controls.cdsExplorer.clickEntry, title: connection.webApiUrl, arguments: [connection.webApiUrl] }, connection );
        }}, 
        { key: "Organization", value: (org, element, commandPrefix) => new TreeEntry(org.FriendlyName, "Organization", vscode.TreeItemCollapsibleState.Collapsed, org.Version, { command: cs.cds.controls.cdsExplorer.clickEntry, title: org.FriendlyName, arguments: [`${commandPrefix || ''}/${org.Id}`] }, DiscoveryRepository.createOrganizationConnection(org, element.config), org) },
        { key: "Solution", value: (solution, element, commandPrefix) => new TreeEntry(solution.friendlyname, "Solution", vscode.TreeItemCollapsibleState.Collapsed, `v${solution.version} (${solution.ismanaged ? "Managed" :  "Unmanaged"})`, { command: cs.cds.controls.cdsExplorer.clickEntry, title: solution.friendlyname, arguments: [`${commandPrefix || ''}/${solution.solutionid}`] }, element.config, solution) },
        { key: "Plugin", value: (plugin, element, commandPrefix) => new TreeEntry(plugin.name, "Plugin", vscode.TreeItemCollapsibleState.Collapsed, `v${plugin.version} (${plugin.publickeytoken})`, { command: cs.cds.controls.cdsExplorer.clickEntry, title: plugin.friendlyname, arguments: [`${commandPrefix || ''}/${plugin.pluginassemblyid}`] }, element.config, plugin) },
        { key: "PluginType", value: (pluginType, element, commandPrefix, plugin?: any) => new TreeEntry(pluginType.friendlyname, "PluginType", vscode.TreeItemCollapsibleState.Collapsed, pluginType.name.replace(plugin.name + ".", ''), { command: cs.cds.controls.cdsExplorer.clickEntry, title: pluginType.friendlyname, arguments: [`${commandPrefix || ''}/${pluginType.name}`] }, element.config, pluginType) },
        { key: "PluginStep", value: (pluginStep, element, commandPrefix, pluginType?: any) => new TreeEntry(pluginStep.name.replace(pluginType.name + ": ", ''), "PluginStep", vscode.TreeItemCollapsibleState.Collapsed, pluginStep.description, { command: cs.cds.controls.cdsExplorer.clickEntry, title: pluginStep.name, arguments: [`${commandPrefix || ''}/${pluginStep.name}`] }, element.config, pluginStep) },
        { key: "PluginStepImage", value: (pluginImage, element, commandPrefix, pluginStep?: any) => new TreeEntry(pluginImage.name, "PluginStepImage", vscode.TreeItemCollapsibleState.None, pluginImage.description, { command: cs.cds.controls.cdsExplorer.clickEntry, title: pluginImage.name, arguments: [`${commandPrefix || ''}/${pluginImage.name}`] }, element.config, pluginImage) },
        { key: "WebResource", value: (webresource, element, commandPrefix) => new TreeEntry(webresource.name, "WebResource", vscode.TreeItemCollapsibleState.None, webresource.displayname, { command: cs.cds.controls.cdsExplorer.clickEntry, title: webresource.displayname, arguments: [`${commandPrefix || ''}/${webresource.webresourceid}`] }, element.config, webresource) }, 
        { key: "Process", value: (process, element, commandPrefix) => new TreeEntry(process.name, "Process", vscode.TreeItemCollapsibleState.None, <string | undefined>CdsUrlResolver.parseProcessType(process.category), { command: cs.cds.controls.cdsExplorer.clickEntry, title: process.displayname, arguments: [`${commandPrefix || ''}/${process.workflowid}`] }, element.config, process) }, 
        { key: "OptionSet", value: (optionSet, element, commandPrefix) => {
            const displayName = optionSet.DisplayName && optionSet.DisplayName.LocalizedLabels && optionSet.DisplayName.LocalizedLabels.length > 0 ? optionSet.DisplayName.LocalizedLabels[0].Label : "";

            return new TreeEntry(displayName, "OptionSet", vscode.TreeItemCollapsibleState.Collapsed, optionSet.Name, { command: cs.cds.controls.cdsExplorer.clickEntry, title: displayName, arguments: [`${commandPrefix || ''}/${optionSet.Name}`] }, element.config, optionSet);
        }}, 
        { key: "Entity", value: (entity, element, commandPrefix) => {
            const displayName = entity.DisplayName && entity.DisplayName.LocalizedLabels && entity.DisplayName.LocalizedLabels.length > 0 ? entity.DisplayName.LocalizedLabels[0].Label : "";

            return new TreeEntry(displayName, "Entity", vscode.TreeItemCollapsibleState.Collapsed, entity.LogicalName, { command: cs.cds.controls.cdsExplorer.clickEntry, title: displayName, arguments: [`${commandPrefix || ''}/${entity.LogicalName}`] }, element.config, entity);
        }}, 
        { key: "Attribute", value: (attribute, element, commandPrefix) => {
            const displayName = attribute.DisplayName && attribute.DisplayName.LocalizedLabels && attribute.DisplayName.LocalizedLabels.length > 0 ? attribute.DisplayName.LocalizedLabels[0].Label : "";

            return new TreeEntry(displayName, "Attribute", vscode.TreeItemCollapsibleState.None, attribute.LogicalName, { command: cs.cds.controls.cdsExplorer.clickEntry, title: displayName, arguments: [`${commandPrefix || ''}/${attribute.LogicalName}`] }, element.config, attribute);
        }}, 
        { key: "View", value: (query, element, commandPrefix) => new TreeEntry(query.name, "View", vscode.TreeItemCollapsibleState.None, query.description, { command: cs.cds.controls.cdsExplorer.clickEntry, title: query.name, arguments: [`${commandPrefix || ''}/${query.savedqueryid}`] }, element.config, query) }, 
        { key: "Chart", value: (queryvisualization, element, commandPrefix) => new TreeEntry(queryvisualization.name, "Chart", vscode.TreeItemCollapsibleState.None, queryvisualization.description, { command: cs.cds.controls.cdsExplorer.clickEntry, title: queryvisualization.name, arguments: [`${commandPrefix || ''}/${queryvisualization.savedqueryvisualizationid}`] }, element.config, queryvisualization) }, 
        { key: "Form", value: (form, element, commandPrefix) => new TreeEntry(form.name, "Form", vscode.TreeItemCollapsibleState.None, form.description, { command: cs.cds.controls.cdsExplorer.clickEntry, title: form.name, arguments: [`${commandPrefix || ''}/${form.formid}`] }, element.config, form) }, 
        { key: "Dashboard", value: (dashboard, element, commandPrefix) => new TreeEntry(dashboard.name, "Dashboard", vscode.TreeItemCollapsibleState.None, dashboard.description, { command: cs.cds.controls.cdsExplorer.clickEntry, title: dashboard.name, arguments: [`${commandPrefix || ''}/${dashboard.formid}`] }, element.config, dashboard) }, 
        { key: "Key", value: (key, element, commandPrefix) => {
            const displayName = key.DisplayName && key.DisplayName.LocalizedLabels && key.DisplayName.LocalizedLabels.length > 0 ? key.DisplayName.LocalizedLabels[0].Label : "";

            return new TreeEntry(displayName, "Key", vscode.TreeItemCollapsibleState.None, key.LogicalName, { command: cs.cds.controls.cdsExplorer.clickEntry, title: key.name, arguments: [`${commandPrefix || ''}/${key.savedqueryvisualizationid}`] }, element.config, key);
        }}, 
        { key: "OneToManyRelationship", value: (relationship, element, commandPrefix) => new TreeEntry(relationship.SchemaName, 'OneToManyRelationship', vscode.TreeItemCollapsibleState.None, relationship.RelationshipType, { command: cs.cds.controls.cdsExplorer.clickEntry, title: relationship.SchemaName, arguments: [`${commandPrefix || ''}/${relationship.SchemaName}`] }, element.config, relationship)}, 
        { key: "ManyToOneRelationship", value: (relationship, element, commandPrefix) => new TreeEntry(relationship.SchemaName, 'ManyToOneRelationship', vscode.TreeItemCollapsibleState.None, relationship.RelationshipType, { command: cs.cds.controls.cdsExplorer.clickEntry, title: relationship.SchemaName, arguments: [`${commandPrefix || ''}/${relationship.SchemaName}`] }, element.config, relationship)}, 
        { key: "ManyToManyRelationship", value: (relationship, element, commandPrefix) => new TreeEntry(relationship.SchemaName, 'ManyToManyRelationship', vscode.TreeItemCollapsibleState.None, relationship.RelationshipType, { command: cs.cds.controls.cdsExplorer.clickEntry, title: relationship.SchemaName, arguments: [`${commandPrefix || ''}/${relationship.SchemaName}`] }, element.config, relationship)}, 
    ]);

    private folderParsers = new Dictionary<EntryType, (item: any, element?: TreeEntry, commandPrefix?: string, ...rest: any[]) => TreeEntry>([
        { key: "WebResource", value: (container, element, commandPrefix) => new TreeEntry(container, "Folder", vscode.TreeItemCollapsibleState.Collapsed, '', { command: cs.cds.controls.cdsExplorer.clickEntry, title: container, arguments: [`${commandPrefix || ''}/${container}`] }, element.config, { innerType: "WebResources", innerContext: (element.context && element.context.innerContext ? element.context.innerContext : element.context) }) }, 
    ]);

    getTreeItem(element: TreeEntry): vscode.TreeItem {
		return element;
	}

	async getChildren(element?: TreeEntry): Promise<TreeEntry[]> {
        if (element && this.getChildrenCommands.containsKey(element.itemType)) {
            const commandPrefix:string = Utilities.String.noSlashes(((element.command && element.command.arguments) || '').toString());

            return await this.getChildrenCommands[element.itemType](element, commandPrefix);
        }

        return await Promise.resolve(this.getConnectionEntries());
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
            this._connections.forEach(connection => result.push(this.parsers["Connection"](connection)));
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

        const returnValue = this.createEntries(
            () => api.retrieveOrganizations(filter), 
            org => this.parsers["Organization"](org, element, commandPrefix),
            `An error occurred while accessing organizations from ${connection.webApiUrl}`, 
            () => this.getConnectionDetails(element, commandPrefix));

        return returnValue;
    }

    private getSolutionLevelDetails(element: TreeEntry, commandPrefix?:string) : TreeEntry[] {
        const showDefaultSolution = <boolean>ExtensionConfiguration.getConfigurationValue(cs.cds.configuration.explorer.showDefaultSolution);
        const returnValue: TreeEntry[] = [];

        if (element.itemType === "Solution" || showDefaultSolution) {
            this.createContainers(element, commandPrefix, element.itemType, [ "Entities", "OptionSets", "Processes", "WebResources", "Plugins" ]).forEach(e => returnValue.push(e));
        } 
        
        if (element.itemType === "Organization") {
            this.createContainers(element, commandPrefix, element.itemType, [ "Solutions" ]).forEach(e => returnValue.push(e));
        }

        return returnValue;
    }

    private getSolutionDetails(element: TreeEntry, commandPrefix?:string): Promise<TreeEntry[]> {
        const api = new ApiRepository(element.config);
        const returnValue = this.createEntries(
            () => api.retrieveSolutions(), 
            solution => this.parsers["Solution"](solution, element, commandPrefix),
            `An error occurred while retrieving solutions from ${element.config.webApiUrl}`, 
            () => this.getSolutionDetails(element, commandPrefix));

        return returnValue;
    }

    private getPluginDetails(element: TreeEntry, commandPrefix?: string, solution?: any): Thenable<TreeEntry[]> {
		const api = new ApiRepository(element.config);
        const returnValue = this.createEntries(
            () => api.retrievePluginAssemblies(solution ? solution.solutionid : undefined), 
            plugin => this.parsers["Plugin"](plugin, element, commandPrefix),
            `An error occurred while retrieving plug-in assemblies from ${element.config.webApiUrl}`,
            () => this.getPluginDetails(element, commandPrefix, solution));

        return returnValue;
    }

    private getPluginTypeDetails(element: TreeEntry, commandPrefix?: string, plugin?: any): Thenable<TreeEntry[]> {
		const api = new ApiRepository(element.config);
        const returnValue = this.createEntries(
            () => api.retrievePluginTypes(plugin.pluginassemblyid), 
            pluginType => this.parsers["PluginType"](pluginType, element, commandPrefix, plugin),
            `An error occurred while retrieving plug-in types from ${element.config.webApiUrl}`,
            () => this.getPluginTypeDetails(element, commandPrefix, plugin));

        return returnValue;
    }

    private getPluginStepDetails(element: TreeEntry, commandPrefix?: string, pluginType?: any): Thenable<TreeEntry[]> {
		const api = new ApiRepository(element.config);
        const returnValue = this.createEntries(
            () => api.retrievePluginSteps(pluginType.plugintypeid), 
            pluginStep => this.parsers["PluginStep"](pluginStep, element, commandPrefix, pluginType),
            `An error occurred while retrieving plug-in steps from ${element.config.webApiUrl}`,
            () => this.getPluginStepDetails(element, commandPrefix, pluginType));

        return returnValue;
    }

    private getPluginStepImageDetails(element: TreeEntry, commandPrefix?: string, pluginStep?: any): Thenable<TreeEntry[]> {
		const api = new ApiRepository(element.config);
        const returnValue = this.createEntries(
            () => api.retrievePluginStepImages(pluginStep.sdkmessageprocessingstepid), 
            pluginImage => this.parsers["PluginStepImage"](pluginImage, element, commandPrefix, pluginStep),
            `An error occurred while retrieving plug-in step images from ${element.config.webApiUrl}`,
            () => this.getPluginStepImageDetails(element, commandPrefix, pluginStep));

        return returnValue;
    }

    private getWebResourcesFolderDetails(element: TreeEntry, commandPrefix?: string, solution?: any, folder?: string): Thenable<TreeEntry[]> {
        const api = new ApiRepository(element.config);
        const returnValue = this.createEntries(
            () => api.retrieveWebResourceFolders(solution ? solution.solutionid : undefined, folder),
            container => this.folderParsers["WebResource"](container, element, commandPrefix),
            `An error occurred while retrieving web resources from ${element.config.webApiUrl}`, 
            () => this.getWebResourcesFolderDetails(element, commandPrefix, solution, folder));

        return returnValue;
    }

    private getWebResourcesDetails(element: TreeEntry, commandPrefix?: string, solution?: any, folder?: string): Thenable<TreeEntry[]> {
        const api = new ApiRepository(element.config);
        const returnValue = this.createEntries(
            () => api.retrieveWebResources(solution ? solution.solutionid : undefined, folder), 
            webresource => this.parsers["WebResource"](webresource, element, commandPrefix),
            `An error occurred while retrieving web resources from ${element.config.webApiUrl}`, 
            () => this.getWebResourcesDetails(element, commandPrefix, solution, folder))
            .then(results => { 
                if (folder && results && results.length > 0) {
                    results.forEach(r => r.label = r.label.replace(Utilities.String.withTrailingSlash(r.folder), '')); 
                }
            
                return results; 
            });

        return returnValue;
    }

    private getProcessDetails(element: TreeEntry, commandPrefix?: string, context?: any): Thenable<TreeEntry[]> {
		const api = new ApiRepository(element.config);
        const returnValue = this.createEntries(
            () => api.retrieveProcesses(context && context.LogicalName ? context.LogicalName : undefined, element.solutionId), 
            process => this.parsers["Process"](process, element, commandPrefix),
            `An error occurred while retrieving business processes from ${element.config.webApiUrl}`,
            () => this.getProcessDetails(element, commandPrefix, context));

        return returnValue;
    }

    private getOptionSetDetails(element: TreeEntry, commandPrefix?: string, solution?: any): Thenable<TreeEntry[]> {
		const api = new MetadataRepository(element.config);
        const returnValue = this.createEntries(
            () => api.retrieveOptionSets(solution ? solution.solutionid : undefined), 
            optionSet => this.parsers["OptionSet"](optionSet, element, commandPrefix),
            `An error occurred while retrieving option sets from ${element.config.webApiUrl}`,
            () => this.getOptionSetDetails(element, commandPrefix, solution));
    
        return returnValue;
    }

    private getEntityDetails(element: TreeEntry, commandPrefix?: string, solution?: any): Thenable<TreeEntry[]> {
		const api = new MetadataRepository(element.config);
        const returnValue = this.createEntries(
            () => api.retrieveEntities(solution ? solution.solutionid : undefined), 
            entity => this.parsers["Entity"](entity, element, commandPrefix),
            `An error occurred while retrieving entities from ${element.config.webApiUrl}`,
            () => this.getEntityDetails(element, commandPrefix, solution));
    
        return returnValue;
    }

    private getEntityAttributeDetails(element: TreeEntry, commandPrefix?: string, entity?:any): Thenable<TreeEntry[]> {
        const api = new MetadataRepository(element.config);
        const returnValue = this.createEntries(
            () => api.retrieveAttributes(entity.MetadataId), 
            attribute => this.parsers["Attribute"](attribute, element, commandPrefix),
            `An error occurred while retrieving attributes from ${element.config.webApiUrl}`,
            () => this.getEntityAttributeDetails(element, commandPrefix, entity));

        return returnValue;
    }

    private getEntityViewDetails(element: TreeEntry, commandPrefix?: string, solutionId?:string, entity?:any): Thenable<TreeEntry[]> {
        const api = new MetadataRepository(element.config);
        const returnValue = this.createEntries(
            () => api.retrieveViews(entity.LogicalName, solutionId), 
            query => this.parsers["View"](query, element, commandPrefix),
            `An error occurred while retrieving views from ${element.config.webApiUrl}`,
            () => this.getEntityViewDetails(element, commandPrefix, entity));
            
        return returnValue;
    }

    private getEntityChartDetails(element: TreeEntry, commandPrefix?: string, solutionId?:string, entity?:any): Thenable<TreeEntry[]> {
        const api = new MetadataRepository(element.config);
        const returnValue = this.createEntries(
            () => api.retrieveCharts(entity.LogicalName, solutionId), 
            queryvisualization => this.parsers["Chart"](queryvisualization, element, commandPrefix),
            `An error occurred while retrieving charts from ${element.config.webApiUrl}`,
            () => this.getEntityChartDetails(element, commandPrefix, entity));
            
        return returnValue;
    }

    private getEntityFormDetails(element: TreeEntry, commandPrefix?: string, solutionId?:string, entity?:any): Thenable<TreeEntry[]> {
        const api = new MetadataRepository(element.config);
        const returnValue = this.createEntries(
            () => api.retrieveForms(entity.LogicalName, solutionId), 
            form => this.parsers["Form"](form, element, commandPrefix),
            `An error occurred while retrieving forms from ${element.config.webApiUrl}`,
            () => this.getEntityFormDetails(element, commandPrefix, entity));

        return returnValue;
    }

    private getEntityDashboardDetails(element: TreeEntry, commandPrefix?: string, solutionId?:string, entity?:any): Thenable<TreeEntry[]> {
        const api = new MetadataRepository(element.config);
        const returnValue = this.createEntries(
            () => api.retrieveDashboards(entity.LogicalName, solutionId), 
            dashboard => this.parsers["Dashboard"](dashboard, element, commandPrefix),
            `An error occurred while retrieving dashboards from ${element.config.webApiUrl}`,
            () => this.getEntityDashboardDetails(element, commandPrefix, entity));

        return returnValue;
    }

    private getEntityKeyDetails(element: TreeEntry, commandPrefix?: string, entity?:any): Thenable<TreeEntry[]> {
        const api = new MetadataRepository(element.config);
        const returnValue = this.createEntries(
            () => api.retrieveKeys(entity.MetadataId), 
            key => this.parsers["Key"](key, element, commandPrefix),
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
                    returnValue.oneToMany.forEach(r => result.push(this.parsers["OneToManyRelationship"](r, element, commandPrefix)));
                }

                if (returnValue && returnValue.manyToOne && returnValue.manyToOne.length > 0) {
                    returnValue.manyToOne.forEach(r => result.push(this.parsers["ManyToOneRelationship"](r, element, commandPrefix)));
                }

                if (returnValue && returnValue.manyToMany && returnValue.manyToMany.length > 0) {
                    returnValue.manyToMany.forEach(r => result.push(this.parsers["ManyToManyRelationship"](r, element, commandPrefix)));
                }

                return new TS.Linq.Enumerator(result).orderBy(r => r.label).toArray();
            }).catch(error => {
                Quickly.askToRetry(`An error occurred while retrieving relationships from ${element.config.webApiUrl}`, () => this.getEntityRelationshipDetails(element, commandPrefix, entity));

                return null;
            });
    }

    private createContainers(element: TreeEntry, commandPrefix: string, parentType: EntryType, types: EntryType[]) : TreeEntry[] {
        let returnObject = [];

        types.forEach(type => {
            returnObject.push(new TreeEntry(
                type,
                type,
                vscode.TreeItemCollapsibleState.Collapsed,
                null,
                { command: cs.cds.controls.cdsExplorer.clickEntry, title: type, arguments: [`${commandPrefix || ''}/${type}`] },
                element.config,
                element.itemType === parentType ? element.context : undefined
            ));
        });

        return returnObject;
    }

    private createEntries(retriever: () => Promise<any[]>, parser: (item: any) => TreeEntry, errorMessage?: string, retryFunction?: any): Promise<TreeEntry[]> {
        return retriever()
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