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

    private getChildrenCommands = new Dictionary<EntryType, (element?: TreeEntry) => Promise<TreeEntry[]>>([
        { key: "Connection", value: async (element?) => await this.getConnectionDetails(element) },
        { key: "Organization", value: async (element?) => await this.getSolutionLevelDetails(element) },
        { key: "Solutions", value: async (element?) => await this.getSolutionDetails(element) },
        { key: "Solution", value: async (element?) => await this.getSolutionLevelDetails(element) },
        { key: "Processes", value: async (element?) => await this.getProcessDetails(element, element.context) },
        { key: "Plugins", value: async (element?) => await this.getPluginDetails(element, element.context) },
        { key: "Entities", value: async (element?) => await this.getEntityDetails(element, element.context) },
        { key: "OptionSets", value: async (element?) => await this.getOptionSetDetails(element, element.context) },
        { key: "WebResources", value: async (element?) => {
            const folders = await this.getWebResourcesFolderDetails(element, (element.context && element.context.innerContext ? element.context.innerContext : element.context));
            const items = await this.getWebResourcesDetails(element, (element.context && element.context.innerContext ? element.context.innerContext : element.context));

            if (items && folders) { items.forEach(i => folders.push(i)); }

            return folders && folders.length > 0 ? folders : items;
        }},
        { key: "Folder", value: async (element?) => await this.getChildrenCommands[element.context.innerType](element) },
        { key: "Plugin", value: async (element?) => await this.getPluginTypeDetails(element, element.context) },
        { key: "PluginType", value: async (element?) => await this.getPluginStepDetails(element, element.context) },
        { key: "Entity", value: async (element?) => await this.createContainers(element, element.itemType, [ "Keys", "Attributes", "Relationships", "Views", "Charts", "Forms", "Dashboards", "Processes"]) },
        { key: "Keys", value: async (element?) => await this.getEntityKeyDetails(element, element.context) },
        { key: "Attributes", value: async (element?) => await this.getEntityAttributeDetails(element, element.context) },
        { key: "Views", value: async (element?) => await this.getEntityViewDetails(element, element.solutionId, element.context) },
        { key: "Charts", value: async (element?) => await this.getEntityChartDetails(element, element.solutionId, element.context) },
        { key: "Forms", value: async (element?) => await this.getEntityFormDetails(element, element.solutionId, element.context) },
        { key: "Dashboards", value: async (element?) => await this.getEntityDashboardDetails(element, element.solutionId, element.context) },
        { key: "Relationships", value: async (element?) => await this.getEntityRelationshipDetails(element, element.context) },
    ]);

    private parsers = new Dictionary<EntryType, (item: any, element?: TreeEntry, ...rest: any[]) => TreeEntry>([
        { key: "Connection", value: connection => {
            const displayName = (connection.name) ? connection.name : connection.webApiUrl.replace("http://", "").replace("https://", "");

            return new TreeEntry(undefined, "Connection", connection.webApiUrl, displayName, connection.webApiUrl, vscode.TreeItemCollapsibleState.Collapsed, connection);
        }}, 
        { key: "Organization", value: (org, element) => element.createChildItem("Organization", org.Id, org.FriendlyName, `v${org.Version}`, vscode.TreeItemCollapsibleState.Collapsed, org) },
        { key: "Solution", value: (solution, element) => element.createChildItem("Solution", solution.solutionid, solution.friendlyname, `v${solution.version} (${solution.ismanaged ? "Managed" :  "Unmanaged"})`, vscode.TreeItemCollapsibleState.Collapsed, solution) },
        { key: "Plugin", value: (plugin, element) => element.createChildItem("Plugin", plugin.pluginassemblyid, plugin.name, `v${plugin.version} (${plugin.publickeytoken})`, vscode.TreeItemCollapsibleState.Collapsed, plugin) },
        { key: "PluginType", value: (pluginType, element, plugin?: any) => element.createChildItem("PluginType", pluginType.name, pluginType.friendlyname, pluginType.name.replace(plugin.name + ".", ''), vscode.TreeItemCollapsibleState.Collapsed, pluginType) },
        { key: "PluginStep", value: (pluginStep, element, pluginType?: any) => element.createChildItem("PluginStep", pluginStep.name, pluginStep.name.replace(pluginType.name + ": ", ''), pluginStep.description, vscode.TreeItemCollapsibleState.Collapsed, pluginStep) },
        { key: "PluginStepImage", value: (pluginImage, element) => element.createChildItem("PluginStepImage", pluginImage.name, pluginImage.name, pluginImage.description, vscode.TreeItemCollapsibleState.None, pluginImage) },
        { key: "WebResource", value: (webresource, element) => element.createChildItem("WebResource", webresource.webresourceid, webresource.name, webresource.displayname, vscode.TreeItemCollapsibleState.None, webresource) }, 
        { key: "Process", value: (process, element) => element.createChildItem("Process", process.workflowid, process.name, <string | undefined>CdsUrlResolver.parseProcessType(process.category), vscode.TreeItemCollapsibleState.None, process) }, 
        { key: "OptionSet", value: (optionSet, element) => {
            const displayName = optionSet.DisplayName && optionSet.DisplayName.LocalizedLabels && optionSet.DisplayName.LocalizedLabels.length > 0 ? optionSet.DisplayName.LocalizedLabels[0].Label : "";

            return element.createChildItem("OptionSet", optionSet.Name, displayName, optionSet.Name, vscode.TreeItemCollapsibleState.Collapsed, optionSet);
        }}, 
        { key: "Entity", value: (entity, element) => {
            const displayName = entity.DisplayName && entity.DisplayName.LocalizedLabels && entity.DisplayName.LocalizedLabels.length > 0 ? entity.DisplayName.LocalizedLabels[0].Label : "";

            return element.createChildItem("Entity", entity.LogicalName, displayName, entity.LogicalName, vscode.TreeItemCollapsibleState.Collapsed, entity);
        }}, 
        { key: "Attribute", value: (attribute, element) => {
            const displayName = attribute.DisplayName && attribute.DisplayName.LocalizedLabels && attribute.DisplayName.LocalizedLabels.length > 0 ? attribute.DisplayName.LocalizedLabels[0].Label : "";

            return element.createChildItem("Attribute", attribute.LogicalName, displayName, attribute.LogicalName, vscode.TreeItemCollapsibleState.None, attribute);
        }}, 
        { key: "View", value: (query, element) => element.createChildItem("View", query.savedqueryid, query.name, query.description, vscode.TreeItemCollapsibleState.None, query) }, 
        { key: "Chart", value: (queryvisualization, element) => element.createChildItem("Chart", queryvisualization.savedqueryvisualizationid, queryvisualization.name, queryvisualization.description, vscode.TreeItemCollapsibleState.None, queryvisualization) }, 
        { key: "Form", value: (form, element) => element.createChildItem("Form", form.formid, form.name, form.description, vscode.TreeItemCollapsibleState.None, form) }, 
        { key: "Dashboard", value: (dashboard, element) => element.createChildItem("Dashboard", dashboard.formid, dashboard.name, dashboard.description, vscode.TreeItemCollapsibleState.None, dashboard) }, 
        { key: "Key", value: (key, element) => {
            const displayName = key.DisplayName && key.DisplayName.LocalizedLabels && key.DisplayName.LocalizedLabels.length > 0 ? key.DisplayName.LocalizedLabels[0].Label : "";

            return element.createChildItem("Key", key.savedqueryvisualizationid, displayName, key.LogicalName, vscode.TreeItemCollapsibleState.None, key);
        }}, 
        { key: "OneToManyRelationship", value: (relationship, element) => element.createChildItem('OneToManyRelationship', relationship.SchemaName, relationship.SchemaName, relationship.RelationshipType, vscode.TreeItemCollapsibleState.None, relationship)}, 
        { key: "ManyToOneRelationship", value: (relationship, element) => element.createChildItem('ManyToOneRelationship', relationship.SchemaName, relationship.SchemaName, relationship.RelationshipType, vscode.TreeItemCollapsibleState.None, relationship)}, 
        { key: "ManyToManyRelationship", value: (relationship, element) => element.createChildItem('ManyToManyRelationship', relationship.SchemaName, relationship.SchemaName, relationship.RelationshipType, vscode.TreeItemCollapsibleState.None, relationship)}, 
    ]);

    private folderParsers = new Dictionary<EntryType, (item: any, element?: TreeEntry, ...rest: any[]) => TreeEntry>([
        { key: "WebResource", value: (container, element) => element.createChildItem("Folder", container, container, '', vscode.TreeItemCollapsibleState.Collapsed, { innerType: "WebResources", innerContext: (element.context && element.context.innerContext ? element.context.innerContext : element.context) }) }
    ]);

    getTreeItem(element: TreeEntry): vscode.TreeItem {
		return element;
	}

	async getChildren(element?: TreeEntry): Promise<TreeEntry[]> {
        if (element && this.getChildrenCommands.containsKey(element.itemType)) {
            return await this.getChildrenCommands[element.itemType](element);
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

    get connections(): CdsWebApi.Config[] {
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
    
    private getConnectionDetails(element: TreeEntry): Promise<TreeEntry[]> {
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
            org => this.parsers["Organization"](org, element),
            error => `An error occurred while accessing organizations from ${connection.webApiUrl}: ${error}`, 
            () => this.getConnectionDetails(element));

        return returnValue;
    }

    private getSolutionLevelDetails(element: TreeEntry) : TreeEntry[] {
        const showDefaultSolution = <boolean>ExtensionConfiguration.getConfigurationValue(cs.cds.configuration.explorer.showDefaultSolution);
        const returnValue: TreeEntry[] = [];

        if (element.itemType === "Solution" || showDefaultSolution) {
            this.createContainers(element, element.itemType, [ "Entities", "OptionSets", "Processes", "WebResources", "Plugins" ]).forEach(e => returnValue.push(e));
        } 
        
        if (element.itemType === "Organization") {
            this.createContainers(element, element.itemType, [ "Solutions" ]).forEach(e => returnValue.push(e));
        }

        return returnValue;
    }

    private getSolutionDetails(element: TreeEntry): Promise<TreeEntry[]> {
        const api = new ApiRepository(element.config);
        const returnValue = this.createEntries(
            () => api.retrieveSolutions(), 
            solution => this.parsers["Solution"](solution, element),
            error => `An error occurred while retrieving solutions from ${element.config.webApiUrl}: ${error}`, 
            () => this.getSolutionDetails(element));

        return returnValue;
    }

    private getPluginDetails(element: TreeEntry, solution?: any): Thenable<TreeEntry[]> {
		const api = new ApiRepository(element.config);
        const returnValue = this.createEntries(
            () => api.retrievePluginAssemblies(solution ? solution.solutionid : undefined), 
            plugin => this.parsers["Plugin"](plugin, element),
            error => `An error occurred while retrieving plug-in assemblies from ${element.config.webApiUrl}: ${error}`,
            () => this.getPluginDetails(element, solution));

        return returnValue;
    }

    private getPluginTypeDetails(element: TreeEntry, plugin?: any): Thenable<TreeEntry[]> {
		const api = new ApiRepository(element.config);
        const returnValue = this.createEntries(
            () => api.retrievePluginTypes(plugin.pluginassemblyid), 
            pluginType => this.parsers["PluginType"](pluginType, element, plugin),
            error => `An error occurred while retrieving plug-in types from ${element.config.webApiUrl}: ${error}`,
            () => this.getPluginTypeDetails(element, plugin));

        return returnValue;
    }

    private getPluginStepDetails(element: TreeEntry, pluginType?: any): Thenable<TreeEntry[]> {
		const api = new ApiRepository(element.config);
        const returnValue = this.createEntries(
            () => api.retrievePluginSteps(pluginType.plugintypeid), 
            pluginStep => this.parsers["PluginStep"](pluginStep, element, pluginType),
            error => `An error occurred while retrieving plug-in steps from ${element.config.webApiUrl}: ${error}`,
            () => this.getPluginStepDetails(element, pluginType));

        return returnValue;
    }

    private getPluginStepImageDetails(element: TreeEntry, pluginStep?: any): Thenable<TreeEntry[]> {
		const api = new ApiRepository(element.config);
        const returnValue = this.createEntries(
            () => api.retrievePluginStepImages(pluginStep.sdkmessageprocessingstepid), 
            pluginImage => this.parsers["PluginStepImage"](pluginImage, element, pluginStep),
            error => `An error occurred while retrieving plug-in step images from ${element.config.webApiUrl}: ${error}`,
            () => this.getPluginStepImageDetails(element, pluginStep));

        return returnValue;
    }

    private getWebResourcesFolderDetails(element: TreeEntry, solution?: any, folder?: string): Thenable<TreeEntry[]> {
        const api = new ApiRepository(element.config);
        const returnValue = this.createEntries(
            () => api.retrieveWebResourceFolders(solution ? solution.solutionid : undefined, folder),
            container => this.folderParsers["WebResource"](container, element),
            error => `An error occurred while retrieving web resources from ${element.config.webApiUrl}: ${error}`, 
            () => this.getWebResourcesFolderDetails(element, solution, folder));

        return returnValue;
    }

    private getWebResourcesDetails(element: TreeEntry, solution?: any, folder?: string): Thenable<TreeEntry[]> {
        const api = new ApiRepository(element.config);
        const returnValue = this.createEntries(
            () => api.retrieveWebResources(solution ? solution.solutionid : undefined, folder), 
            webresource => this.parsers["WebResource"](webresource, element),
            error => `An error occurred while retrieving web resources from ${element.config.webApiUrl}: ${error}`, 
            () => this.getWebResourcesDetails(element, solution, folder))
            .then(results => { 
                if (folder && results && results.length > 0) {
                    results.forEach(r => r.label = r.label.replace(Utilities.String.withTrailingSlash(r.folder), '')); 
                }
            
                return results; 
            });

        return returnValue;
    }

    private getProcessDetails(element: TreeEntry, context?: any): Thenable<TreeEntry[]> {
		const api = new ApiRepository(element.config);
        const returnValue = this.createEntries(
            () => api.retrieveProcesses(context && context.LogicalName ? context.LogicalName : undefined, element.solutionId), 
            process => this.parsers["Process"](process, element),
            error => `An error occurred while retrieving business processes from ${element.config.webApiUrl}: ${error}`,
            () => this.getProcessDetails(element, context));

        return returnValue;
    }

    private getOptionSetDetails(element: TreeEntry, solution?: any): Thenable<TreeEntry[]> {
		const api = new MetadataRepository(element.config);
        const returnValue = this.createEntries(
            () => api.retrieveOptionSets(solution ? solution.solutionid : undefined), 
            optionSet => this.parsers["OptionSet"](optionSet, element),
            error => `An error occurred while retrieving option sets from ${element.config.webApiUrl}: ${error}`,
            () => this.getOptionSetDetails(element, solution));
    
        return returnValue;
    }

    private getEntityDetails(element: TreeEntry, solution?: any): Thenable<TreeEntry[]> {
		const api = new MetadataRepository(element.config);
        const returnValue = this.createEntries(
            () => api.retrieveEntities(solution ? solution.solutionid : undefined), 
            entity => this.parsers["Entity"](entity, element),
            error => `An error occurred while retrieving entities from ${element.config.webApiUrl}: ${error}`,
            () => this.getEntityDetails(element, solution));
    
        return returnValue;
    }

    private getEntityAttributeDetails(element: TreeEntry, entity?:any): Thenable<TreeEntry[]> {
        const api = new MetadataRepository(element.config);
        const returnValue = this.createEntries(
            () => api.retrieveAttributes(entity.MetadataId), 
            attribute => this.parsers["Attribute"](attribute, element),
            error => `An error occurred while retrieving attributes from ${element.config.webApiUrl}: ${error}`,
            () => this.getEntityAttributeDetails(element, entity));

        return returnValue;
    }

    private getEntityViewDetails(element: TreeEntry, solutionId?:string, entity?:any): Thenable<TreeEntry[]> {
        const api = new MetadataRepository(element.config);
        const returnValue = this.createEntries(
            () => api.retrieveViews(entity.LogicalName, solutionId), 
            query => this.parsers["View"](query, element),
            error => `An error occurred while retrieving views from ${element.config.webApiUrl}: ${error}`,
            () => this.getEntityViewDetails(element, entity));
            
        return returnValue;
    }

    private getEntityChartDetails(element: TreeEntry, solutionId?:string, entity?:any): Thenable<TreeEntry[]> {
        const api = new MetadataRepository(element.config);
        const returnValue = this.createEntries(
            () => api.retrieveCharts(entity.LogicalName, solutionId), 
            queryvisualization => this.parsers["Chart"](queryvisualization, element),
            error => `An error occurred while retrieving charts from ${element.config.webApiUrl}: ${error}`,
            () => this.getEntityChartDetails(element, entity));
            
        return returnValue;
    }

    private getEntityFormDetails(element: TreeEntry, solutionId?:string, entity?:any): Thenable<TreeEntry[]> {
        const api = new MetadataRepository(element.config);
        const returnValue = this.createEntries(
            () => api.retrieveForms(entity.LogicalName, solutionId), 
            form => this.parsers["Form"](form, element),
            error => `An error occurred while retrieving forms from ${element.config.webApiUrl}: ${error}`,
            () => this.getEntityFormDetails(element, entity));

        return returnValue;
    }

    private getEntityDashboardDetails(element: TreeEntry, solutionId?:string, entity?:any): Thenable<TreeEntry[]> {
        const api = new MetadataRepository(element.config);
        const returnValue = this.createEntries(
            () => api.retrieveDashboards(entity.LogicalName, solutionId), 
            dashboard => this.parsers["Dashboard"](dashboard, element),
            error => `An error occurred while retrieving dashboards from ${element.config.webApiUrl}: ${error}`,
            () => this.getEntityDashboardDetails(element, entity));

        return returnValue;
    }

    private getEntityKeyDetails(element: TreeEntry, entity?:any): Thenable<TreeEntry[]> {
        const api = new MetadataRepository(element.config);
        const returnValue = this.createEntries(
            () => api.retrieveKeys(entity.MetadataId), 
            key => this.parsers["Key"](key, element),
            error => `An error occurred while retrieving key definitions from ${element.config.webApiUrl}: ${error}`,
            () => this.getEntityKeyDetails(element, entity));
            
        return returnValue;
    }

    private getEntityRelationshipDetails(element: TreeEntry, entity?: any): Thenable<TreeEntry[]> {
        const api = new MetadataRepository(element.config);

        return api.retrieveRelationships(entity.MetadataId)
            .then(returnValue => {
                const result : TreeEntry[] = new Array();

                if (returnValue && returnValue.oneToMany && returnValue.oneToMany.length > 0) {
                    returnValue.oneToMany.forEach(r => result.push(this.parsers["OneToManyRelationship"](r, element)));
                }

                if (returnValue && returnValue.manyToOne && returnValue.manyToOne.length > 0) {
                    returnValue.manyToOne.forEach(r => result.push(this.parsers["ManyToOneRelationship"](r, element)));
                }

                if (returnValue && returnValue.manyToMany && returnValue.manyToMany.length > 0) {
                    returnValue.manyToMany.forEach(r => result.push(this.parsers["ManyToManyRelationship"](r, element)));
                }

                return new TS.Linq.Enumerator(result).orderBy(r => r.label).toArray();
            }).catch(error => {
                Quickly.askToRetry(`An error occurred while retrieving relationships from ${element.config.webApiUrl}: ${(error.message || error).toString()}`, () => this.getEntityRelationshipDetails(element, entity));

                return null;
            });
    }

    private createContainers(element: TreeEntry, parentType: EntryType, types: EntryType[]) : TreeEntry[] {
        let returnObject = [];

        types.forEach(type => {
            returnObject.push(element.createChildItem(type, type, type, '', vscode.TreeItemCollapsibleState.Collapsed, element.itemType === parentType ? element.context : undefined));
        });

        return returnObject;
    }

    private createEntries(onRetreive: () => Promise<any[]>, onParse: (item: any) => TreeEntry, onErrorMessage?: (message: string) => string, onRetry?: Function): Promise<TreeEntry[]> {
        return onRetreive()
            .then(items => {
                logger.log(`createTreeEntries: items = ${items && items.length ? 'new Array(' + items.length + ')' : 'undefined' }`);

                const result : TreeEntry[] = new Array();

                if (!items) {
                    return;
                }

                for (let i = 0; i < items.length; i++) {
                    const item: any = items[i];
                    let treeItem;

                    try {
                        treeItem = onParse(item);
                    } catch (error) {
                        Quickly.error(`There was an error parsing one of the tree entries: ${(error.message || error).toString()}`);
                    }

                    if (treeItem) {
                        result.push(treeItem);
                    }
                }

                logger.log(`createTreeEntries: result = ${result && result.length ? 'new Array(' + result.length + ')' : 'undefined' }`);

                return result;
            })
            .catch(err => {
                if (onErrorMessage && onRetry) {
                    Quickly.askToRetry(onErrorMessage((err.message || err).toString()), onRetry);
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
    private static readonly canRefreshEntryTypes: EntryType[] = [ "Solutions", "Plugins", "Entities", "OptionSets", "WebResources", "Processes", "Attributes", "Forms", "Views", "Charts", "Dashboards", "Keys", "Relationships", "Entries" ];
    private static readonly canAddEntryTypes: EntryType[] = [ "Solutions", "Plugins", "Entities", "OptionSets", "WebResources", "Processes", "Attributes", "Forms", "Views", "Charts", "Dashboards", "Keys", "Relationships", "Entries", "PluginType", "PluginStep" ];
    private static readonly canEditEntryTypes: EntryType[] = [ "Connection", "Solution", "Entity", "OptionSet", "WebResource", "Process", "Attribute", "Form", "View", "Chart", "Dashboard", "Key", "OneToManyRelationship", "ManyToOneRelationship", "ManyToManyRelationship", "Entry", "PluginStep", "PluginStepImage" ];
    private static readonly canDeleteEntryTypes: EntryType[] = [ "Connection", "PluginStep", "PluginStepImage" ];
    private static readonly canInspectEntryTypes: EntryType[] = [ "Connection", "Solution", "Entity", "OptionSet", "WebResource", "Process", "Attribute", "Form", "View", "Chart", "Dashboard", "Key", "OneToManyRelationship", "ManyToOneRelationship", "ManyToManyRelationship", "Entry", "PluginStep" ];
    private static readonly canUnpackSolutionEntryTypes: EntryType[] = [ "Solution" ];
    private static readonly canMoveSolutionEntryTypes: EntryType[] = [ "Solution" ];
    private static readonly canOpenInAppEntryTypes: EntryType[] = [ "View", "Entity", "Dashboard" ];
    private static readonly canOpenInBrowserEntryTypes: EntryType[] = [ "Form", "View", "Entity", "Dashboard" ];
    private static readonly canOpenInEditorEntryTypes: EntryType[] = [ "Form", "View", "Chart", "Dashboard" ];
    private static readonly canAddToSolutionEntryTypes: EntryType[] = [ "Plugin", "Entity", "OptionSet", "WebResource", "Process", "Form", "View", "Chart", "Dashboard" ];
    private static readonly canRemoveFromSolutionEntryTypes: EntryType[] = [ "Plugin", "Entity", "OptionSet", "WebResource", "Process", "Form", "View", "Chart", "Dashboard" ];

    constructor(
        parentItem: TreeEntry,
        public readonly itemType: EntryType,
        readonly id: string,
        public label: string,
        public readonly subtext?: string,
        public collapsibleState: vscode.TreeItemCollapsibleState = vscode.TreeItemCollapsibleState.None,
        public readonly context?: any
	) {
        super(label, collapsibleState);
        
        const resolver = ExtensionIconThemes.selected.resolve("~/Resources/icons/", itemType);

        if (resolver) {
            this.iconPath = resolver.iconPath;
        }

        if (id) {
            if (parentItem) {
                this.id = `${Utilities.String.noTrailingSlash(parentItem.id)}/${id}`;
            } else {
                this.id = id;
            }

            // We can't have duplicate ids in the treeview.
            const count = TreeEntryCache.Instance.Items.count(t => t.id === this.id || t.id.startsWith(this.id + "_"));
            
            if (count > 0) {
                this.id = `${this.id.substr(0, this.id.length - (count.toString().length + 1))}_${count}`;
            }

            this.command = { command: cs.cds.controls.cdsExplorer.clickEntry, title: this.subtext || this.label, arguments: [ this ] };
        }

        if (parentItem && parentItem.configId) {
            this.configId = parentItem.configId;
        } else if (context && context.id) {
            this.configId = context.id;
            this.context = undefined;
        }

        this.contextValue = this.capabilities.join(",");

        TreeEntryCache.Instance.AddEntry(this);
    }

    configId: string; 

	get tooltip(): string {
		return `${this.label}`;
	}

	get description(): string {
		return this.subtext || this.itemType.toString(); 
    }

    get config(): CdsWebApi.Config {
        if (this.configId) {
            const connection = CdsExplorerTreeProvider.Instance.connections.find(c => c.id === this.configId);
            const split = this.id.split("/");            
            
            if (split.length >= 4 && connection) {
                const orgEntry = TreeEntryCache.Instance.Items.first(i => i.id === split.slice(0, 4).join("/"));

                return DiscoveryRepository.createOrganizationConnection(orgEntry.context, connection);
            }

            return connection;
        }
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
            const index = this.id.lastIndexOf(`${this.context.innerType.toString()}/`);

            return this.id.substring(index + this.context.innerType.toString().length + 1);
        } else if (this.parent && this.parent.itemType === "Folder" && this.parent.id) {
            return this.parent.folder;
        }

        return '';
    }

    get solutionId(): string {
        if (this.id) {
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

        if (this.id) {
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

    createChildItem(itemType: EntryType, id: string, label: string, subtext?: string, collapsibleState: vscode.TreeItemCollapsibleState = vscode.TreeItemCollapsibleState.None, context?: any): TreeEntry {
        return new TreeEntry(this, itemType, id, label, subtext, collapsibleState, context);
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