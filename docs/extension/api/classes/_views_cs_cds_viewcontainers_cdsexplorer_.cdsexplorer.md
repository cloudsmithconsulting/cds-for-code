---
id: "_views_cs_cds_viewcontainers_cdsexplorer_.cdsexplorer"
title: "CdsExplorer"
sidebar_label: "CdsExplorer"
---

[cds-for-code](../index.md) › [Globals](../globals.md) › ["views/cs.cds.viewContainers.cdsExplorer"](../modules/_views_cs_cds_viewcontainers_cdsexplorer_.md) › [CdsExplorer](_views_cs_cds_viewcontainers_cdsexplorer_.cdsexplorer.md)

TreeView implementation that helps end-users navigate items in their Common Data Services (CDS) environments.
This class implements VSCode's TreeDataProvider and is used as a single-instance (singleton) in the CDS for Code toolkit.

**`export`** 

**`class`** CdsExplorerView

**`implements`** {vscode.TreeDataProvider<CdsTreeEntry>}

## Hierarchy

* **CdsExplorer**

## Implements

* TreeDataProvider‹[CdsTreeEntry](_views_cs_cds_viewcontainers_cdsexplorer_.cdstreeentry.md)›

## Index

### Constructors

* [constructor](_views_cs_cds_viewcontainers_cdsexplorer_.cdsexplorer.md#private-constructor)

### Properties

* [_connections](_views_cs_cds_viewcontainers_cdsexplorer_.cdsexplorer.md#private-_connections)
* [_onDidChangeTreeData](_views_cs_cds_viewcontainers_cdsexplorer_.cdsexplorer.md#private-_ondidchangetreedata)
* [_orgConnections](_views_cs_cds_viewcontainers_cdsexplorer_.cdsexplorer.md#private-_orgconnections)
* [getChildrenCommands](_views_cs_cds_viewcontainers_cdsexplorer_.cdsexplorer.md#private-getchildrencommands)
* [onDidChangeTreeData](_views_cs_cds_viewcontainers_cdsexplorer_.cdsexplorer.md#ondidchangetreedata)
* [addCommands](_views_cs_cds_viewcontainers_cdsexplorer_.cdsexplorer.md#static-private-addcommands)
* [deleteCommands](_views_cs_cds_viewcontainers_cdsexplorer_.cdsexplorer.md#static-private-deletecommands)
* [editCommands](_views_cs_cds_viewcontainers_cdsexplorer_.cdsexplorer.md#static-private-editcommands)
* [folderParsers](_views_cs_cds_viewcontainers_cdsexplorer_.cdsexplorer.md#static-private-folderparsers)
* [instance](_views_cs_cds_viewcontainers_cdsexplorer_.cdsexplorer.md#static-private-instance)
* [openInAppCommands](_views_cs_cds_viewcontainers_cdsexplorer_.cdsexplorer.md#static-private-openinappcommands)
* [openInBrowserCommands](_views_cs_cds_viewcontainers_cdsexplorer_.cdsexplorer.md#static-private-openinbrowsercommands)
* [openInEditorCommands](_views_cs_cds_viewcontainers_cdsexplorer_.cdsexplorer.md#static-private-openineditorcommands)
* [parsers](_views_cs_cds_viewcontainers_cdsexplorer_.cdsexplorer.md#static-private-parsers)
* [solutionComponentMappings](_views_cs_cds_viewcontainers_cdsexplorer_.cdsexplorer.md#static-private-solutioncomponentmappings)

### Accessors

* [connections](_views_cs_cds_viewcontainers_cdsexplorer_.cdsexplorer.md#connections)
* [orgConnections](_views_cs_cds_viewcontainers_cdsexplorer_.cdsexplorer.md#orgconnections)
* [Instance](_views_cs_cds_viewcontainers_cdsexplorer_.cdsexplorer.md#static-instance)

### Methods

* [activate](_views_cs_cds_viewcontainers_cdsexplorer_.cdsexplorer.md#activate)
* [add](_views_cs_cds_viewcontainers_cdsexplorer_.cdsexplorer.md#add)
* [addConnection](_views_cs_cds_viewcontainers_cdsexplorer_.cdsexplorer.md#addconnection)
* [addToSolution](_views_cs_cds_viewcontainers_cdsexplorer_.cdsexplorer.md#addtosolution)
* [click](_views_cs_cds_viewcontainers_cdsexplorer_.cdsexplorer.md#click)
* [createContainers](_views_cs_cds_viewcontainers_cdsexplorer_.cdsexplorer.md#private-createcontainers)
* [createEntries](_views_cs_cds_viewcontainers_cdsexplorer_.cdsexplorer.md#private-createentries)
* [delete](_views_cs_cds_viewcontainers_cdsexplorer_.cdsexplorer.md#delete)
* [edit](_views_cs_cds_viewcontainers_cdsexplorer_.cdsexplorer.md#edit)
* [exportSolution](_views_cs_cds_viewcontainers_cdsexplorer_.cdsexplorer.md#exportsolution)
* [getApplicationDetails](_views_cs_cds_viewcontainers_cdsexplorer_.cdsexplorer.md#private-getapplicationdetails)
* [getChildren](_views_cs_cds_viewcontainers_cdsexplorer_.cdsexplorer.md#getchildren)
* [getConnectionDetails](_views_cs_cds_viewcontainers_cdsexplorer_.cdsexplorer.md#private-getconnectiondetails)
* [getConnectionEntries](_views_cs_cds_viewcontainers_cdsexplorer_.cdsexplorer.md#private-getconnectionentries)
* [getEntityAttributeDetails](_views_cs_cds_viewcontainers_cdsexplorer_.cdsexplorer.md#private-getentityattributedetails)
* [getEntityChartDetails](_views_cs_cds_viewcontainers_cdsexplorer_.cdsexplorer.md#private-getentitychartdetails)
* [getEntityDashboardDetails](_views_cs_cds_viewcontainers_cdsexplorer_.cdsexplorer.md#private-getentitydashboarddetails)
* [getEntityDetails](_views_cs_cds_viewcontainers_cdsexplorer_.cdsexplorer.md#private-getentitydetails)
* [getEntityFormDetails](_views_cs_cds_viewcontainers_cdsexplorer_.cdsexplorer.md#private-getentityformdetails)
* [getEntityKeyDetails](_views_cs_cds_viewcontainers_cdsexplorer_.cdsexplorer.md#private-getentitykeydetails)
* [getEntityRelationshipDetails](_views_cs_cds_viewcontainers_cdsexplorer_.cdsexplorer.md#private-getentityrelationshipdetails)
* [getEntityViewDetails](_views_cs_cds_viewcontainers_cdsexplorer_.cdsexplorer.md#private-getentityviewdetails)
* [getOptionDetails](_views_cs_cds_viewcontainers_cdsexplorer_.cdsexplorer.md#private-getoptiondetails)
* [getOptionSetDetails](_views_cs_cds_viewcontainers_cdsexplorer_.cdsexplorer.md#private-getoptionsetdetails)
* [getPluginDetails](_views_cs_cds_viewcontainers_cdsexplorer_.cdsexplorer.md#private-getplugindetails)
* [getPluginStepDetails](_views_cs_cds_viewcontainers_cdsexplorer_.cdsexplorer.md#private-getpluginstepdetails)
* [getPluginStepImageDetails](_views_cs_cds_viewcontainers_cdsexplorer_.cdsexplorer.md#private-getpluginstepimagedetails)
* [getPluginTypeDetails](_views_cs_cds_viewcontainers_cdsexplorer_.cdsexplorer.md#private-getplugintypedetails)
* [getProcessDetails](_views_cs_cds_viewcontainers_cdsexplorer_.cdsexplorer.md#private-getprocessdetails)
* [getSolutionDetails](_views_cs_cds_viewcontainers_cdsexplorer_.cdsexplorer.md#private-getsolutiondetails)
* [getSolutionLevelDetails](_views_cs_cds_viewcontainers_cdsexplorer_.cdsexplorer.md#private-getsolutionleveldetails)
* [getTreeItem](_views_cs_cds_viewcontainers_cdsexplorer_.cdsexplorer.md#gettreeitem)
* [getWebResourcesDetails](_views_cs_cds_viewcontainers_cdsexplorer_.cdsexplorer.md#private-getwebresourcesdetails)
* [getWebResourcesFolderDetails](_views_cs_cds_viewcontainers_cdsexplorer_.cdsexplorer.md#private-getwebresourcesfolderdetails)
* [inspect](_views_cs_cds_viewcontainers_cdsexplorer_.cdsexplorer.md#inspect)
* [moveSolution](_views_cs_cds_viewcontainers_cdsexplorer_.cdsexplorer.md#movesolution)
* [openInApp](_views_cs_cds_viewcontainers_cdsexplorer_.cdsexplorer.md#openinapp)
* [openInBrowser](_views_cs_cds_viewcontainers_cdsexplorer_.cdsexplorer.md#openinbrowser)
* [openInEditor](_views_cs_cds_viewcontainers_cdsexplorer_.cdsexplorer.md#openineditor)
* [refresh](_views_cs_cds_viewcontainers_cdsexplorer_.cdsexplorer.md#refresh)
* [refreshSolution](_views_cs_cds_viewcontainers_cdsexplorer_.cdsexplorer.md#refreshsolution)
* [removeConnection](_views_cs_cds_viewcontainers_cdsexplorer_.cdsexplorer.md#removeconnection)
* [removeFromSolution](_views_cs_cds_viewcontainers_cdsexplorer_.cdsexplorer.md#removefromsolution)
* [removePluginStep](_views_cs_cds_viewcontainers_cdsexplorer_.cdsexplorer.md#private-removepluginstep)
* [removePluginStepImage](_views_cs_cds_viewcontainers_cdsexplorer_.cdsexplorer.md#private-removepluginstepimage)
* [runCommand](_views_cs_cds_viewcontainers_cdsexplorer_.cdsexplorer.md#private-runcommand)

## Constructors

### `Private` constructor

\+ **new CdsExplorer**(): *[CdsExplorer](_views_cs_cds_viewcontainers_cdsexplorer_.cdsexplorer.md)*

Defined in src/views/cs.cds.viewContainers.cdsExplorer.ts:38

**Returns:** *[CdsExplorer](_views_cs_cds_viewcontainers_cdsexplorer_.cdsexplorer.md)*

## Properties

### `Private` _connections

• **_connections**: *[Config](../interfaces/_api_cds_webapi_cdswebapi_.cdswebapi.config.md)[]* = []

Defined in src/views/cs.cds.viewContainers.cdsExplorer.ts:35

___

### `Private` _onDidChangeTreeData

• **_onDidChangeTreeData**: *EventEmitter‹[CdsTreeEntry](_views_cs_cds_viewcontainers_cdsexplorer_.cdstreeentry.md) | undefined›* = new vscode.EventEmitter<CdsTreeEntry | undefined>()

Defined in src/views/cs.cds.viewContainers.cdsExplorer.ts:33

___

### `Private` _orgConnections

• **_orgConnections**: *[Config](../interfaces/_api_cds_webapi_cdswebapi_.cdswebapi.config.md)[]* = []

Defined in src/views/cs.cds.viewContainers.cdsExplorer.ts:36

___

### `Private` getChildrenCommands

• **getChildrenCommands**: *any* = new Dictionary<CdsExplorerEntryType, (element?: CdsTreeEntry) => Promise<CdsTreeEntry[]>>([
        { key: "Connection", value: async (element?) => await this.getConnectionDetails(element) },
        { key: "Organization", value: async (element?) => await this.getSolutionLevelDetails(element) },
        { key: "Applications", value: async (element?) => await this.getApplicationDetails(element, element.context) },
        { key: "Solutions", value: async (element?) => await this.getSolutionDetails(element) },
        { key: "Solution", value: async (element?) => await this.getSolutionLevelDetails(element) },
        { key: "Processes", value: async (element?) => await this.getProcessDetails(element, element.context) },
        { key: "Plugins", value: async (element?) => await this.getPluginDetails(element, element.context) },
        { key: "Entities", value: async (element?) => await this.getEntityDetails(element, element.context) },
        { key: "OptionSets", value: async (element?) => await this.getOptionSetDetails(element, element.context) },
        { key: "OptionSet", value: async (element?) => await this.getOptionDetails(element) },
        { key: "WebResources", value: async (element?) => {
            const results = Promise.all([ 
                CdsExplorer.Instance.getWebResourcesFolderDetails(element, (element.context && element.context.innerContext ? element.context.innerContext : element.context), element.folder), 
                CdsExplorer.Instance.getWebResourcesDetails(element, (element.context && element.context.innerContext ? element.context.innerContext : element.context), element.folder)
            ]);

            let [ folders, items ] = await results;
            if (items && folders) { items.forEach(i => folders.push(i)); }

            return folders && folders.length > 0 ? folders : items;
        }},
        { key: "Folder", value: async (element?) => await this.getChildrenCommands[element.context.innerType](element) },
        { key: "Plugin", value: async (element?) => await this.getPluginTypeDetails(element, element.context) },
        { key: "PluginType", value: async (element?) => await this.getPluginStepDetails(element, element.context) },
        { key: "PluginStep", value: async (element?) => await this.getPluginStepImageDetails(element, element.context) },
        { key: "Entity", value: async (element?) => await this.createContainers(element, element.itemType, [ "Keys", "Attributes", "Relationships", "Views", "Charts", "Forms", "Dashboards", "Processes"]) },
        { key: "Keys", value: async (element?) => await this.getEntityKeyDetails(element, element.context) },
        { key: "Attributes", value: async (element?) => await this.getEntityAttributeDetails(element, element.context) },
        { key: "Views", value: async (element?) => await this.getEntityViewDetails(element, element.solutionId, element.context) },
        { key: "Charts", value: async (element?) => await this.getEntityChartDetails(element, element.solutionId, element.context) },
        { key: "Forms", value: async (element?) => await this.getEntityFormDetails(element, element.solutionId, element.context) },
        { key: "Dashboards", value: async (element?) => await this.getEntityDashboardDetails(element, element.solutionId, element.context) },
        { key: "Relationships", value: async (element?) => await this.getEntityRelationshipDetails(element, element.context) },
    ])

Defined in src/views/cs.cds.viewContainers.cdsExplorer.ts:144

___

###  onDidChangeTreeData

• **onDidChangeTreeData**: *Event‹[CdsTreeEntry](_views_cs_cds_viewcontainers_cdsexplorer_.cdstreeentry.md) | undefined›* = this._onDidChangeTreeData.event

Defined in src/views/cs.cds.viewContainers.cdsExplorer.ts:34

___

### `Static` `Private` addCommands

▪ **addCommands**: *[Dictionary](_core_types_dictionary_.dictionary.md)‹"Connection" | "Organization" | "Entities" | "OptionSets" | "WebResources" | "Plugins" | "Processes" | "Solutions" | "Applications" | "Entity" | "OptionSet" | "Option" | "WebResource" | "Plugin" | "PluginType" | "PluginStep" | "PluginStepImage" | "Process" | "Solution" | "Application" | "Attributes" | "Views" | "Charts" | "Dashboards" | "Keys" | "Relationships" | "Forms" | "Attribute" | "View" | "Chart" | "Dashboard" | "Key" | "OneToManyRelationship" | "ManyToOneRelationship" | "ManyToManyRelationship" | "Form" | "Entry" | "Entries" | "Folder", function›* = new Dictionary<CdsExplorerEntryType, (item?: CdsTreeEntry) => Promise<void>>([
        { key: "Applications", value: async (item) => Utilities.Browser.openWindow(CdsUrlResolver.getManageAppUri(item.config, undefined, item.solution || item.parent.context.ActiveSolution)) },
        { key: "Solutions", value: async (item) => Utilities.Browser.openWindow(CdsUrlResolver.getManageSolutionUri(item.config)) },
        { key: "Entities", value: async (item) => Utilities.Browser.openWindow(CdsUrlResolver.getManageEntityUri(item.config, undefined, item.solution)) },
        { key: "Attributes", value: async (item) => Utilities.Browser.openWindow(CdsUrlResolver.getManageAttributeUri(item.config, item.context.MetadataId, undefined, item.solutionId)) },
        { key: "OptionSets", value: async (item) => Utilities.Browser.openWindow(CdsUrlResolver.getManageOptionSetUri(item.config, item.parent && item.parent.context ? item.parent.context.MetadataId : undefined, item.parent && item.parent.context ? item.parent.context.ObjectTypeCode : undefined, undefined, item.solutionId)) },
        { key: "Processes", value: async (item) => {
            const process: any = await vscode.commands.executeCommand(cs.cds.deployment.createProcess, item.config, item.solutionId);
            
            if (process) {
                CdsExplorer.Instance.refresh(item);
                Utilities.Browser.openWindow(CdsUrlResolver.getManageBusinessProcessUri(item.config, process.processType, process.workflowid, process.solutionid || undefined));
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
        { key: "PluginStep", value: async (item) => await vscode.commands.executeCommand(cs.cds.controls.pluginStepImage.open, item.context.sdkmessageprocessingstepid, undefined, item.config) }
    ])

Defined in src/views/cs.cds.viewContainers.cdsExplorer.ts:60

___

### `Static` `Private` deleteCommands

▪ **deleteCommands**: *[Dictionary](_core_types_dictionary_.dictionary.md)‹"Connection" | "Organization" | "Entities" | "OptionSets" | "WebResources" | "Plugins" | "Processes" | "Solutions" | "Applications" | "Entity" | "OptionSet" | "Option" | "WebResource" | "Plugin" | "PluginType" | "PluginStep" | "PluginStepImage" | "Process" | "Solution" | "Application" | "Attributes" | "Views" | "Charts" | "Dashboards" | "Keys" | "Relationships" | "Forms" | "Attribute" | "View" | "Chart" | "Dashboard" | "Key" | "OneToManyRelationship" | "ManyToOneRelationship" | "ManyToManyRelationship" | "Form" | "Entry" | "Entries" | "Folder", function›* = new Dictionary<CdsExplorerEntryType, (item?: CdsTreeEntry) => Promise<void>>([
        { key: "Connection", value: async (item) => CdsExplorer.Instance.removeConnection(item.config) },
        { key: "PluginStep", value: async (item) => CdsExplorer.Instance.removePluginStep(item.config, item.context).then(() => CdsExplorer.Instance.refresh(item.parent)) },
        { key: "PluginStepImage", value: async (item) => CdsExplorer.Instance.removePluginStepImage(item.config, item.context).then(() => CdsExplorer.Instance.refresh(item.parent)) }
    ])

Defined in src/views/cs.cds.viewContainers.cdsExplorer.ts:105

___

### `Static` `Private` editCommands

▪ **editCommands**: *[Dictionary](_core_types_dictionary_.dictionary.md)‹"Connection" | "Organization" | "Entities" | "OptionSets" | "WebResources" | "Plugins" | "Processes" | "Solutions" | "Applications" | "Entity" | "OptionSet" | "Option" | "WebResource" | "Plugin" | "PluginType" | "PluginStep" | "PluginStepImage" | "Process" | "Solution" | "Application" | "Attributes" | "Views" | "Charts" | "Dashboards" | "Keys" | "Relationships" | "Forms" | "Attribute" | "View" | "Chart" | "Dashboard" | "Key" | "OneToManyRelationship" | "ManyToOneRelationship" | "ManyToManyRelationship" | "Form" | "Entry" | "Entries" | "Folder", function›* = new Dictionary<CdsExplorerEntryType, (item?: CdsTreeEntry) => Promise<void>>([
        { key: "Connection", value: async (item) => await vscode.commands.executeCommand(cs.cds.controls.cdsExplorer.editConnection, item.config) },
        { key: "Application", value: async (item) => Utilities.Browser.openWindow(CdsUrlResolver.getManageAppUri(item.config, item.context, item.solution || item.parent.context.ActiveSolution)) },
        { key: "Solution", value: async (item) => Utilities.Browser.openWindow(CdsUrlResolver.getManageSolutionUri(item.config, item.context)) },
        { key: "Entity", value: async (item) => Utilities.Browser.openWindow(CdsUrlResolver.getManageEntityUri(item.config, item.context, item.solution)) },
        { key: "Attribute", value: async (item) => Utilities.Browser.openWindow(CdsUrlResolver.getManageAttributeUri(item.config, item.parent.context.MetadataId, item.context.MetadataId, item.solutionId)) },
        { key: "OptionSet", value: async (item) => Utilities.Browser.openWindow(CdsUrlResolver.getManageOptionSetUri(item.config, item.parent && item.parent.context ? item.parent.context.MetadataId : undefined, item.parent && item.parent.context ? item.parent.context.ObjectTypeCode : undefined, item.context.MetadataId, item.solutionId)) },
        { key: "Process", value: async (item) => Utilities.Browser.openWindow(CdsUrlResolver.getManageBusinessProcessUri(item.config, CdsUrlResolver.parseProcessType(item.context.category), item.context.workflowid, item.solutionId || undefined)) },
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
    ])

Defined in src/views/cs.cds.viewContainers.cdsExplorer.ts:111

___

### `Static` `Private` folderParsers

▪ **folderParsers**: *[Dictionary](_core_types_dictionary_.dictionary.md)‹"Connection" | "Organization" | "Entities" | "OptionSets" | "WebResources" | "Plugins" | "Processes" | "Solutions" | "Applications" | "Entity" | "OptionSet" | "Option" | "WebResource" | "Plugin" | "PluginType" | "PluginStep" | "PluginStepImage" | "Process" | "Solution" | "Application" | "Attributes" | "Views" | "Charts" | "Dashboards" | "Keys" | "Relationships" | "Forms" | "Attribute" | "View" | "Chart" | "Dashboard" | "Key" | "OneToManyRelationship" | "ManyToOneRelationship" | "ManyToManyRelationship" | "Form" | "Entry" | "Entries" | "Folder", function›* = new Dictionary<CdsExplorerEntryType, (item: any, element?: CdsTreeEntry, ...rest: any[]) => CdsTreeEntry>([
        { key: "WebResource", value: (container, element) => element.createChildItem("Folder", container, container, '', vscode.TreeItemCollapsibleState.Collapsed, { innerType: "WebResources", innerContext: (element.context && element.context.innerContext ? element.context.innerContext : element.context) }) }
    ])

Defined in src/views/cs.cds.viewContainers.cdsExplorer.ts:140

___

### `Static` `Private` instance

▪ **instance**: *[CdsExplorer](_views_cs_cds_viewcontainers_cdsexplorer_.cdsexplorer.md)*

Defined in src/views/cs.cds.viewContainers.cdsExplorer.ts:38

___

### `Static` `Private` openInAppCommands

▪ **openInAppCommands**: *[Dictionary](_core_types_dictionary_.dictionary.md)‹"Connection" | "Organization" | "Entities" | "OptionSets" | "WebResources" | "Plugins" | "Processes" | "Solutions" | "Applications" | "Entity" | "OptionSet" | "Option" | "WebResource" | "Plugin" | "PluginType" | "PluginStep" | "PluginStepImage" | "Process" | "Solution" | "Application" | "Attributes" | "Views" | "Charts" | "Dashboards" | "Keys" | "Relationships" | "Forms" | "Attribute" | "View" | "Chart" | "Dashboard" | "Key" | "OneToManyRelationship" | "ManyToOneRelationship" | "ManyToManyRelationship" | "Form" | "Entry" | "Entries" | "Folder", function›* = new Dictionary<CdsExplorerEntryType, (item?: CdsTreeEntry) => Promise<void>>([
        { key: "Entity", value: async (item) => Utilities.Browser.openWindow(CdsUrlResolver.getOpenEntityUsingAppUrl(item.context.LogicalName)) },
        { key: "Dashboard", value: async (item) => Utilities.Browser.openWindow(CdsUrlResolver.getOpenEntityDashboardUsingAppUrl(item.context.formid)) },
        { key: "View", value: async (item) => Utilities.Browser.openWindow(CdsUrlResolver.getOpenEntityViewUsingAppUrl(item.parent.context.LogicalName, item.context.savedqueryid)) },
    ])

Defined in src/views/cs.cds.viewContainers.cdsExplorer.ts:180

___

### `Static` `Private` openInBrowserCommands

▪ **openInBrowserCommands**: *[Dictionary](_core_types_dictionary_.dictionary.md)‹"Connection" | "Organization" | "Entities" | "OptionSets" | "WebResources" | "Plugins" | "Processes" | "Solutions" | "Applications" | "Entity" | "OptionSet" | "Option" | "WebResource" | "Plugin" | "PluginType" | "PluginStep" | "PluginStepImage" | "Process" | "Solution" | "Application" | "Attributes" | "Views" | "Charts" | "Dashboards" | "Keys" | "Relationships" | "Forms" | "Attribute" | "View" | "Chart" | "Dashboard" | "Key" | "OneToManyRelationship" | "ManyToOneRelationship" | "ManyToManyRelationship" | "Form" | "Entry" | "Entries" | "Folder", function›* = new Dictionary<CdsExplorerEntryType, (item?: CdsTreeEntry) => Promise<void>>([
        { key: "Application", value: async (item) => Utilities.Browser.openWindow(CdsUrlResolver.getOpenAppUsingBrowserUri(item.config, item.context)) },
        { key: "Entity", value: async (item) => Utilities.Browser.openWindow(CdsUrlResolver.getOpenEntityFormUri(item.config, item.context.LogicalName)) },
        { key: "Form", value: async (item) => Utilities.Browser.openWindow(CdsUrlResolver.getOpenEntityFormUri(item.config, item.parent.context.LogicalName, item.context.formid)) },
        { key: "Dashboard", value: async (item) => Utilities.Browser.openWindow(CdsUrlResolver.getOpenEntityFormUri(item.config, item.parent.context.LogicalName, item.context.formid)) },
        { key: "View", value: async (item) => Utilities.Browser.openWindow(CdsUrlResolver.getOpenEntityViewUri(item.config, item.parent.context.LogicalName, item.context.savedqueryid)) },
    ])

Defined in src/views/cs.cds.viewContainers.cdsExplorer.ts:186

___

### `Static` `Private` openInEditorCommands

▪ **openInEditorCommands**: *[Dictionary](_core_types_dictionary_.dictionary.md)‹"Connection" | "Organization" | "Entities" | "OptionSets" | "WebResources" | "Plugins" | "Processes" | "Solutions" | "Applications" | "Entity" | "OptionSet" | "Option" | "WebResource" | "Plugin" | "PluginType" | "PluginStep" | "PluginStepImage" | "Process" | "Solution" | "Application" | "Attributes" | "Views" | "Charts" | "Dashboards" | "Keys" | "Relationships" | "Forms" | "Attribute" | "View" | "Chart" | "Dashboard" | "Key" | "OneToManyRelationship" | "ManyToOneRelationship" | "ManyToManyRelationship" | "Form" | "Entry" | "Entries" | "Folder", function›* = new Dictionary<CdsExplorerEntryType, (item?: CdsTreeEntry) => Promise<void>>([
        { key: "Form", value: async (item) => await vscode.workspace.openTextDocument({ language:"xml", content:item.context.formxml }).then(d => vscode.window.showTextDocument(d)).then(e => logger.log(`Form loaded in editor`)) },
        { key: "Dashboard", value: async (item) => await vscode.workspace.openTextDocument({ language:"xml", content:item.context.formxml }).then(d => vscode.window.showTextDocument(d)).then(e => logger.log(`Dashboard loaded in editor`)) },
        { key: "View", value: async (item) => await vscode.workspace.openTextDocument({ language:"xml", content:item.context.layoutxml }).then(d => vscode.window.showTextDocument(d)).then(e => logger.log(`View loaded in editor`)) },
        { key: "Chart", value: async (item) => await vscode.workspace.openTextDocument({ language:"xml", content:item.context.presentationdescription }).then(d => vscode.window.showTextDocument(d)).then(e => logger.log(`Chart loaded in editor`)) }
    ])

Defined in src/views/cs.cds.viewContainers.cdsExplorer.ts:194

___

### `Static` `Private` parsers

▪ **parsers**: *[Dictionary](_core_types_dictionary_.dictionary.md)‹"Connection" | "Organization" | "Entities" | "OptionSets" | "WebResources" | "Plugins" | "Processes" | "Solutions" | "Applications" | "Entity" | "OptionSet" | "Option" | "WebResource" | "Plugin" | "PluginType" | "PluginStep" | "PluginStepImage" | "Process" | "Solution" | "Application" | "Attributes" | "Views" | "Charts" | "Dashboards" | "Keys" | "Relationships" | "Forms" | "Attribute" | "View" | "Chart" | "Dashboard" | "Key" | "OneToManyRelationship" | "ManyToOneRelationship" | "ManyToManyRelationship" | "Form" | "Entry" | "Entries" | "Folder", function›* = new Dictionary<CdsExplorerEntryType, (item: any, element?: CdsTreeEntry, ...rest: any[]) => CdsTreeEntry>([
        { key: "Connection", value: connection => {
            const displayName = (connection.name) ? connection.name : connection.webApiUrl.replace("http://", "").replace("https://", "");

            return new CdsTreeEntry(undefined, "Connection", connection.webApiUrl, displayName, connection.webApiUrl, vscode.TreeItemCollapsibleState.Collapsed, connection);
        }}, 
        { key: "Organization", value: (org, element) => element.createChildItem("Organization", org.Id, org.FriendlyName, `v${org.Version}`, vscode.TreeItemCollapsibleState.Collapsed, org) },
        { key: "Application", value: (application, element) => element.createChildItem("Application", application.appmoduleid, application.name, `${application.appmoduleversion ? 'v' + application.appmoduleversion + ' ' : ''}(${application.ismanaged ? "Managed" :  "Unmanaged"})`, vscode.TreeItemCollapsibleState.None, application) },
        { key: "Solution", value: (solution, element) => element.createChildItem("Solution", solution.solutionid, solution.friendlyname, `v${solution.version} (${solution.ismanaged ? "Managed" :  "Unmanaged"})`, vscode.TreeItemCollapsibleState.Collapsed, solution) },
        { key: "Plugin", value: (plugin, element) => element.createChildItem("Plugin", plugin.pluginassemblyid, plugin.name, `v${plugin.version} (${plugin.publickeytoken})`, vscode.TreeItemCollapsibleState.Collapsed, plugin) },
        { key: "PluginType", value: (pluginType, element, plugin?: any) => element.createChildItem("PluginType", pluginType.name, pluginType.friendlyname, pluginType.name.replace(plugin.name + ".", ''), vscode.TreeItemCollapsibleState.Collapsed, pluginType) },
        { key: "PluginStep", value: (pluginStep, element, pluginType?: any) => element.createChildItem("PluginStep", pluginStep.name, pluginStep.name.replace(pluginType.name + ": ", ''), pluginStep.description, vscode.TreeItemCollapsibleState.Collapsed, pluginStep) },
        { key: "PluginStepImage", value: (pluginImage, element) => element.createChildItem("PluginStepImage", pluginImage.name, pluginImage.name, pluginImage.description, vscode.TreeItemCollapsibleState.None, pluginImage) },
        { key: "WebResource", value: (webresource, element) => element.createChildItem("WebResource", webresource.webresourceid, webresource.name, webresource.displayname, vscode.TreeItemCollapsibleState.None, webresource) }, 
        { key: "Process", value: (process, element) => element.createChildItem("Process", process.workflowid, process.name, <string | undefined>CdsUrlResolver.parseProcessType(process.category), vscode.TreeItemCollapsibleState.None, process) }, 
        { key: "OptionSet", value: (optionSet, element) => element.createChildItem("OptionSet", optionSet.Name, optionSet.Name, optionSet['@odata.type'].substr(1), vscode.TreeItemCollapsibleState.Collapsed, optionSet) }, 
        { key: "Option", value: (option, element) => element.createChildItem("Option", option.Value, CdsUtilities.getLocalizedName(option.Label), option.Value.toString(), vscode.TreeItemCollapsibleState.None, option) }, 
        { key: "Entity", value: (entity, element) => element.createChildItem("Entity", entity.LogicalName, CdsUtilities.getLocalizedName(entity.DisplayName), entity.LogicalName, vscode.TreeItemCollapsibleState.Collapsed, entity) }, 
        { key: "Attribute", value: (attribute, element) => element.createChildItem("Attribute", attribute.LogicalName, CdsUtilities.getLocalizedName(attribute.DisplayName), attribute.LogicalName, vscode.TreeItemCollapsibleState.None, attribute) }, 
        { key: "View", value: (query, element) => element.createChildItem("View", query.savedqueryid, query.name, query.description, vscode.TreeItemCollapsibleState.None, query) }, 
        { key: "Chart", value: (queryvisualization, element) => element.createChildItem("Chart", queryvisualization.savedqueryvisualizationid, queryvisualization.name, queryvisualization.description, vscode.TreeItemCollapsibleState.None, queryvisualization) }, 
        { key: "Form", value: (form, element) => element.createChildItem("Form", form.formid, form.name, form.description, vscode.TreeItemCollapsibleState.None, form) }, 
        { key: "Dashboard", value: (dashboard, element) => element.createChildItem("Dashboard", dashboard.formid, dashboard.name, dashboard.description, vscode.TreeItemCollapsibleState.None, dashboard) }, 
        { key: "Key", value: (key, element) => element.createChildItem("Key", key.LogicalName, CdsUtilities.getLocalizedName(key), key.LogicalName, vscode.TreeItemCollapsibleState.None, key) }, 
        { key: "OneToManyRelationship", value: (relationship, element) => element.createChildItem('OneToManyRelationship', relationship.SchemaName, relationship.SchemaName, relationship.RelationshipType, vscode.TreeItemCollapsibleState.None, relationship)}, 
        { key: "ManyToOneRelationship", value: (relationship, element) => element.createChildItem('ManyToOneRelationship', relationship.SchemaName, relationship.SchemaName, relationship.RelationshipType, vscode.TreeItemCollapsibleState.None, relationship)}, 
        { key: "ManyToManyRelationship", value: (relationship, element) => element.createChildItem('ManyToManyRelationship', relationship.SchemaName, relationship.SchemaName, relationship.RelationshipType, vscode.TreeItemCollapsibleState.None, relationship)}, 
    ])

Defined in src/views/cs.cds.viewContainers.cdsExplorer.ts:201

___

### `Static` `Private` solutionComponentMappings

▪ **solutionComponentMappings**: *[Dictionary](_core_types_dictionary_.dictionary.md)‹"Connection" | "Organization" | "Entities" | "OptionSets" | "WebResources" | "Plugins" | "Processes" | "Solutions" | "Applications" | "Entity" | "OptionSet" | "Option" | "WebResource" | "Plugin" | "PluginType" | "PluginStep" | "PluginStepImage" | "Process" | "Solution" | "Application" | "Attributes" | "Views" | "Charts" | "Dashboards" | "Keys" | "Relationships" | "Forms" | "Attribute" | "View" | "Chart" | "Dashboard" | "Key" | "OneToManyRelationship" | "ManyToOneRelationship" | "ManyToManyRelationship" | "Form" | "Entry" | "Entries" | "Folder", object›* = new Dictionary<CdsExplorerEntryType, { componentId: (item?: CdsTreeEntry) => Promise<void>, componentType: CdsSolutions.SolutionComponent }>([
        { key: "Plugin", value: { componentId: (item) => item.context.pluginassemblyid, componentType: CdsSolutions.SolutionComponent.PluginAssembly }},
        { key: "WebResource", value: { componentId: (item) => item.context.webresourceid, componentType: CdsSolutions.SolutionComponent.WebResource }},
        { key: "Process", value: { componentId: (item) => item.context.workflowid, componentType: CdsSolutions.SolutionComponent.Workflow }},
        { key: "Entity", value: { componentId: (item) => item.context.MetadataId, componentType: CdsSolutions.SolutionComponent.Entity }},
        { key: "OptionSet", value: { componentId: (item) => item.context.MetadataId, componentType: CdsSolutions.SolutionComponent.OptionSet }}
    ])

Defined in src/views/cs.cds.viewContainers.cdsExplorer.ts:230

## Accessors

###  connections

• **get connections**(): *[Config](../interfaces/_api_cds_webapi_cdswebapi_.cdswebapi.config.md)[]*

Defined in src/views/cs.cds.viewContainers.cdsExplorer.ts:245

Gets an array of connections registered in the CDS explorer instance.

**`readonly`** 

**`type`** {CdsWebApi.Config[]}

**`memberof`** CdsExplorerView

**Returns:** *[Config](../interfaces/_api_cds_webapi_cdswebapi_.cdswebapi.config.md)[]*

___

###  orgConnections

• **get orgConnections**(): *[Config](../interfaces/_api_cds_webapi_cdswebapi_.cdswebapi.config.md)[]*

Defined in src/views/cs.cds.viewContainers.cdsExplorer.ts:256

Gets an array of connections for individual organizations registered in the CDS explorer instance.

**`readonly`** 

**`type`** {CdsWebApi.Config[]}

**`memberof`** CdsExplorer

**Returns:** *[Config](../interfaces/_api_cds_webapi_cdswebapi_.cdswebapi.config.md)[]*

___

### `Static` Instance

• **get Instance**(): *[CdsExplorer](_views_cs_cds_viewcontainers_cdsexplorer_.cdsexplorer.md)*

Defined in src/views/cs.cds.viewContainers.cdsExplorer.ts:52

Gets the singleton implementation of CdsExplorerView

**`readonly`** 

**`static`** 

**`type`** {CdsExplorer}

**`memberof`** CdsExplorerView

**Returns:** *[CdsExplorer](_views_cs_cds_viewcontainers_cdsexplorer_.cdsexplorer.md)*

## Methods

###  activate

▸ **activate**(`context`: ExtensionContext): *Promise‹void›*

Defined in src/views/cs.cds.viewContainers.cdsExplorer.ts:267

Runs when the extension is loaded and registers the TreeView data provider.

**`memberof`** CdsExplorerView

**Parameters:**

Name | Type |
------ | ------ |
`context` | ExtensionContext |

**Returns:** *Promise‹void›*

___

###  add

▸ **add**(`item?`: [CdsTreeEntry](_views_cs_cds_viewcontainers_cdsexplorer_.cdstreeentry.md)): *Promise‹void›*

Defined in src/views/cs.cds.viewContainers.cdsExplorer.ts:274

**Parameters:**

Name | Type |
------ | ------ |
`item?` | [CdsTreeEntry](_views_cs_cds_viewcontainers_cdsexplorer_.cdstreeentry.md) |

**Returns:** *Promise‹void›*

___

###  addConnection

▸ **addConnection**(...`options`: [Config](../interfaces/_api_cds_webapi_cdswebapi_.cdswebapi.config.md)[]): *void*

Defined in src/views/cs.cds.viewContainers.cdsExplorer.ts:283

**Parameters:**

Name | Type |
------ | ------ |
`...options` | [Config](../interfaces/_api_cds_webapi_cdswebapi_.cdswebapi.config.md)[] |

**Returns:** *void*

___

###  addToSolution

▸ **addToSolution**(`item?`: [CdsTreeEntry](_views_cs_cds_viewcontainers_cdsexplorer_.cdstreeentry.md)): *Promise‹void›*

Defined in src/views/cs.cds.viewContainers.cdsExplorer.ts:309

**Parameters:**

Name | Type |
------ | ------ |
`item?` | [CdsTreeEntry](_views_cs_cds_viewcontainers_cdsexplorer_.cdstreeentry.md) |

**Returns:** *Promise‹void›*

___

###  click

▸ **click**(`item?`: [CdsTreeEntry](_views_cs_cds_viewcontainers_cdsexplorer_.cdstreeentry.md)): *Promise‹void›*

Defined in src/views/cs.cds.viewContainers.cdsExplorer.ts:332

**Parameters:**

Name | Type |
------ | ------ |
`item?` | [CdsTreeEntry](_views_cs_cds_viewcontainers_cdsexplorer_.cdstreeentry.md) |

**Returns:** *Promise‹void›*

___

### `Private` createContainers

▸ **createContainers**(`element`: [CdsTreeEntry](_views_cs_cds_viewcontainers_cdsexplorer_.cdstreeentry.md), `parentType`: [CdsExplorerEntryType](../modules/_views_cs_cds_viewcontainers_cdsexplorer_.md#cdsexplorerentrytype), `types`: [CdsExplorerEntryType](../modules/_views_cs_cds_viewcontainers_cdsexplorer_.md#cdsexplorerentrytype)[]): *[CdsTreeEntry](_views_cs_cds_viewcontainers_cdsexplorer_.cdstreeentry.md)[]*

Defined in src/views/cs.cds.viewContainers.cdsExplorer.ts:455

**Parameters:**

Name | Type |
------ | ------ |
`element` | [CdsTreeEntry](_views_cs_cds_viewcontainers_cdsexplorer_.cdstreeentry.md) |
`parentType` | [CdsExplorerEntryType](../modules/_views_cs_cds_viewcontainers_cdsexplorer_.md#cdsexplorerentrytype) |
`types` | [CdsExplorerEntryType](../modules/_views_cs_cds_viewcontainers_cdsexplorer_.md#cdsexplorerentrytype)[] |

**Returns:** *[CdsTreeEntry](_views_cs_cds_viewcontainers_cdsexplorer_.cdstreeentry.md)[]*

___

### `Private` createEntries

▸ **createEntries**(`element`: [CdsTreeEntry](_views_cs_cds_viewcontainers_cdsexplorer_.cdstreeentry.md), `onRetreive`: function, `onParse`: function, `onErrorMessage?`: function, `onRetry?`: Function): *Promise‹[CdsTreeEntry](_views_cs_cds_viewcontainers_cdsexplorer_.cdstreeentry.md)[]›*

Defined in src/views/cs.cds.viewContainers.cdsExplorer.ts:481

**Parameters:**

▪ **element**: *[CdsTreeEntry](_views_cs_cds_viewcontainers_cdsexplorer_.cdstreeentry.md)*

▪ **onRetreive**: *function*

▸ (): *Promise‹any[]›*

▪ **onParse**: *function*

▸ (`item`: any): *[CdsTreeEntry](_views_cs_cds_viewcontainers_cdsexplorer_.cdstreeentry.md)*

**Parameters:**

Name | Type |
------ | ------ |
`item` | any |

▪`Optional`  **onErrorMessage**: *function*

▸ (`message`: string): *string*

**Parameters:**

Name | Type |
------ | ------ |
`message` | string |

▪`Optional`  **onRetry**: *Function*

**Returns:** *Promise‹[CdsTreeEntry](_views_cs_cds_viewcontainers_cdsexplorer_.cdstreeentry.md)[]›*

___

###  delete

▸ **delete**(`item?`: [CdsTreeEntry](_views_cs_cds_viewcontainers_cdsexplorer_.cdstreeentry.md)): *Promise‹any›*

Defined in src/views/cs.cds.viewContainers.cdsExplorer.ts:340

**Parameters:**

Name | Type |
------ | ------ |
`item?` | [CdsTreeEntry](_views_cs_cds_viewcontainers_cdsexplorer_.cdstreeentry.md) |

**Returns:** *Promise‹any›*

___

###  edit

▸ **edit**(`item?`: [CdsTreeEntry](_views_cs_cds_viewcontainers_cdsexplorer_.cdstreeentry.md)): *Promise‹void›*

Defined in src/views/cs.cds.viewContainers.cdsExplorer.ts:345

**Parameters:**

Name | Type |
------ | ------ |
`item?` | [CdsTreeEntry](_views_cs_cds_viewcontainers_cdsexplorer_.cdstreeentry.md) |

**Returns:** *Promise‹void›*

___

###  exportSolution

▸ **exportSolution**(`item?`: [CdsTreeEntry](_views_cs_cds_viewcontainers_cdsexplorer_.cdstreeentry.md)): *Promise‹unknown›*

Defined in src/views/cs.cds.viewContainers.cdsExplorer.ts:350

**Parameters:**

Name | Type |
------ | ------ |
`item?` | [CdsTreeEntry](_views_cs_cds_viewcontainers_cdsexplorer_.cdstreeentry.md) |

**Returns:** *Promise‹unknown›*

___

### `Private` getApplicationDetails

▸ **getApplicationDetails**(`element`: [CdsTreeEntry](_views_cs_cds_viewcontainers_cdsexplorer_.cdstreeentry.md), `solution?`: any): *Promise‹[CdsTreeEntry](_views_cs_cds_viewcontainers_cdsexplorer_.cdstreeentry.md)[]›*

Defined in src/views/cs.cds.viewContainers.cdsExplorer.ts:598

**Parameters:**

Name | Type |
------ | ------ |
`element` | [CdsTreeEntry](_views_cs_cds_viewcontainers_cdsexplorer_.cdstreeentry.md) |
`solution?` | any |

**Returns:** *Promise‹[CdsTreeEntry](_views_cs_cds_viewcontainers_cdsexplorer_.cdstreeentry.md)[]›*

___

###  getChildren

▸ **getChildren**(`element?`: [CdsTreeEntry](_views_cs_cds_viewcontainers_cdsexplorer_.cdstreeentry.md)): *Promise‹[CdsTreeEntry](_views_cs_cds_viewcontainers_cdsexplorer_.cdstreeentry.md)[]›*

Defined in src/views/cs.cds.viewContainers.cdsExplorer.ts:364

**Parameters:**

Name | Type |
------ | ------ |
`element?` | [CdsTreeEntry](_views_cs_cds_viewcontainers_cdsexplorer_.cdstreeentry.md) |

**Returns:** *Promise‹[CdsTreeEntry](_views_cs_cds_viewcontainers_cdsexplorer_.cdstreeentry.md)[]›*

___

### `Private` getConnectionDetails

▸ **getConnectionDetails**(`element`: [CdsTreeEntry](_views_cs_cds_viewcontainers_cdsexplorer_.cdstreeentry.md)): *Promise‹[CdsTreeEntry](_views_cs_cds_viewcontainers_cdsexplorer_.cdstreeentry.md)[]›*

Defined in src/views/cs.cds.viewContainers.cdsExplorer.ts:550

**Parameters:**

Name | Type |
------ | ------ |
`element` | [CdsTreeEntry](_views_cs_cds_viewcontainers_cdsexplorer_.cdstreeentry.md) |

**Returns:** *Promise‹[CdsTreeEntry](_views_cs_cds_viewcontainers_cdsexplorer_.cdstreeentry.md)[]›*

___

### `Private` getConnectionEntries

▸ **getConnectionEntries**(): *[CdsTreeEntry](_views_cs_cds_viewcontainers_cdsexplorer_.cdstreeentry.md)[]*

Defined in src/views/cs.cds.viewContainers.cdsExplorer.ts:540

**Returns:** *[CdsTreeEntry](_views_cs_cds_viewcontainers_cdsexplorer_.cdstreeentry.md)[]*

___

### `Private` getEntityAttributeDetails

▸ **getEntityAttributeDetails**(`element`: [CdsTreeEntry](_views_cs_cds_viewcontainers_cdsexplorer_.cdstreeentry.md), `entity?`: any): *Thenable‹[CdsTreeEntry](_views_cs_cds_viewcontainers_cdsexplorer_.cdstreeentry.md)[]›*

Defined in src/views/cs.cds.viewContainers.cdsExplorer.ts:757

**Parameters:**

Name | Type |
------ | ------ |
`element` | [CdsTreeEntry](_views_cs_cds_viewcontainers_cdsexplorer_.cdstreeentry.md) |
`entity?` | any |

**Returns:** *Thenable‹[CdsTreeEntry](_views_cs_cds_viewcontainers_cdsexplorer_.cdstreeentry.md)[]›*

___

### `Private` getEntityChartDetails

▸ **getEntityChartDetails**(`element`: [CdsTreeEntry](_views_cs_cds_viewcontainers_cdsexplorer_.cdstreeentry.md), `solutionId?`: string, `entity?`: any): *Thenable‹[CdsTreeEntry](_views_cs_cds_viewcontainers_cdsexplorer_.cdstreeentry.md)[]›*

Defined in src/views/cs.cds.viewContainers.cdsExplorer.ts:781

**Parameters:**

Name | Type |
------ | ------ |
`element` | [CdsTreeEntry](_views_cs_cds_viewcontainers_cdsexplorer_.cdstreeentry.md) |
`solutionId?` | string |
`entity?` | any |

**Returns:** *Thenable‹[CdsTreeEntry](_views_cs_cds_viewcontainers_cdsexplorer_.cdstreeentry.md)[]›*

___

### `Private` getEntityDashboardDetails

▸ **getEntityDashboardDetails**(`element`: [CdsTreeEntry](_views_cs_cds_viewcontainers_cdsexplorer_.cdstreeentry.md), `solutionId?`: string, `entity?`: any): *Thenable‹[CdsTreeEntry](_views_cs_cds_viewcontainers_cdsexplorer_.cdstreeentry.md)[]›*

Defined in src/views/cs.cds.viewContainers.cdsExplorer.ts:805

**Parameters:**

Name | Type |
------ | ------ |
`element` | [CdsTreeEntry](_views_cs_cds_viewcontainers_cdsexplorer_.cdstreeentry.md) |
`solutionId?` | string |
`entity?` | any |

**Returns:** *Thenable‹[CdsTreeEntry](_views_cs_cds_viewcontainers_cdsexplorer_.cdstreeentry.md)[]›*

___

### `Private` getEntityDetails

▸ **getEntityDetails**(`element`: [CdsTreeEntry](_views_cs_cds_viewcontainers_cdsexplorer_.cdstreeentry.md), `solution?`: any): *Thenable‹[CdsTreeEntry](_views_cs_cds_viewcontainers_cdsexplorer_.cdstreeentry.md)[]›*

Defined in src/views/cs.cds.viewContainers.cdsExplorer.ts:745

**Parameters:**

Name | Type |
------ | ------ |
`element` | [CdsTreeEntry](_views_cs_cds_viewcontainers_cdsexplorer_.cdstreeentry.md) |
`solution?` | any |

**Returns:** *Thenable‹[CdsTreeEntry](_views_cs_cds_viewcontainers_cdsexplorer_.cdstreeentry.md)[]›*

___

### `Private` getEntityFormDetails

▸ **getEntityFormDetails**(`element`: [CdsTreeEntry](_views_cs_cds_viewcontainers_cdsexplorer_.cdstreeentry.md), `solutionId?`: string, `entity?`: any): *Thenable‹[CdsTreeEntry](_views_cs_cds_viewcontainers_cdsexplorer_.cdstreeentry.md)[]›*

Defined in src/views/cs.cds.viewContainers.cdsExplorer.ts:793

**Parameters:**

Name | Type |
------ | ------ |
`element` | [CdsTreeEntry](_views_cs_cds_viewcontainers_cdsexplorer_.cdstreeentry.md) |
`solutionId?` | string |
`entity?` | any |

**Returns:** *Thenable‹[CdsTreeEntry](_views_cs_cds_viewcontainers_cdsexplorer_.cdstreeentry.md)[]›*

___

### `Private` getEntityKeyDetails

▸ **getEntityKeyDetails**(`element`: [CdsTreeEntry](_views_cs_cds_viewcontainers_cdsexplorer_.cdstreeentry.md), `entity?`: any): *Thenable‹[CdsTreeEntry](_views_cs_cds_viewcontainers_cdsexplorer_.cdstreeentry.md)[]›*

Defined in src/views/cs.cds.viewContainers.cdsExplorer.ts:817

**Parameters:**

Name | Type |
------ | ------ |
`element` | [CdsTreeEntry](_views_cs_cds_viewcontainers_cdsexplorer_.cdstreeentry.md) |
`entity?` | any |

**Returns:** *Thenable‹[CdsTreeEntry](_views_cs_cds_viewcontainers_cdsexplorer_.cdstreeentry.md)[]›*

___

### `Private` getEntityRelationshipDetails

▸ **getEntityRelationshipDetails**(`element`: [CdsTreeEntry](_views_cs_cds_viewcontainers_cdsexplorer_.cdstreeentry.md), `entity?`: any): *Thenable‹[CdsTreeEntry](_views_cs_cds_viewcontainers_cdsexplorer_.cdstreeentry.md)[]›*

Defined in src/views/cs.cds.viewContainers.cdsExplorer.ts:845

**Parameters:**

Name | Type |
------ | ------ |
`element` | [CdsTreeEntry](_views_cs_cds_viewcontainers_cdsexplorer_.cdstreeentry.md) |
`entity?` | any |

**Returns:** *Thenable‹[CdsTreeEntry](_views_cs_cds_viewcontainers_cdsexplorer_.cdstreeentry.md)[]›*

___

### `Private` getEntityViewDetails

▸ **getEntityViewDetails**(`element`: [CdsTreeEntry](_views_cs_cds_viewcontainers_cdsexplorer_.cdstreeentry.md), `solutionId?`: string, `entity?`: any): *Thenable‹[CdsTreeEntry](_views_cs_cds_viewcontainers_cdsexplorer_.cdstreeentry.md)[]›*

Defined in src/views/cs.cds.viewContainers.cdsExplorer.ts:769

**Parameters:**

Name | Type |
------ | ------ |
`element` | [CdsTreeEntry](_views_cs_cds_viewcontainers_cdsexplorer_.cdstreeentry.md) |
`solutionId?` | string |
`entity?` | any |

**Returns:** *Thenable‹[CdsTreeEntry](_views_cs_cds_viewcontainers_cdsexplorer_.cdstreeentry.md)[]›*

___

### `Private` getOptionDetails

▸ **getOptionDetails**(`element`: [CdsTreeEntry](_views_cs_cds_viewcontainers_cdsexplorer_.cdstreeentry.md)): *Thenable‹[CdsTreeEntry](_views_cs_cds_viewcontainers_cdsexplorer_.cdstreeentry.md)[]›*

Defined in src/views/cs.cds.viewContainers.cdsExplorer.ts:725

**Parameters:**

Name | Type |
------ | ------ |
`element` | [CdsTreeEntry](_views_cs_cds_viewcontainers_cdsexplorer_.cdstreeentry.md) |

**Returns:** *Thenable‹[CdsTreeEntry](_views_cs_cds_viewcontainers_cdsexplorer_.cdstreeentry.md)[]›*

___

### `Private` getOptionSetDetails

▸ **getOptionSetDetails**(`element`: [CdsTreeEntry](_views_cs_cds_viewcontainers_cdsexplorer_.cdstreeentry.md), `solution?`: any): *Thenable‹[CdsTreeEntry](_views_cs_cds_viewcontainers_cdsexplorer_.cdstreeentry.md)[]›*

Defined in src/views/cs.cds.viewContainers.cdsExplorer.ts:713

**Parameters:**

Name | Type |
------ | ------ |
`element` | [CdsTreeEntry](_views_cs_cds_viewcontainers_cdsexplorer_.cdstreeentry.md) |
`solution?` | any |

**Returns:** *Thenable‹[CdsTreeEntry](_views_cs_cds_viewcontainers_cdsexplorer_.cdstreeentry.md)[]›*

___

### `Private` getPluginDetails

▸ **getPluginDetails**(`element`: [CdsTreeEntry](_views_cs_cds_viewcontainers_cdsexplorer_.cdstreeentry.md), `solution?`: any): *Thenable‹[CdsTreeEntry](_views_cs_cds_viewcontainers_cdsexplorer_.cdstreeentry.md)[]›*

Defined in src/views/cs.cds.viewContainers.cdsExplorer.ts:622

**Parameters:**

Name | Type |
------ | ------ |
`element` | [CdsTreeEntry](_views_cs_cds_viewcontainers_cdsexplorer_.cdstreeentry.md) |
`solution?` | any |

**Returns:** *Thenable‹[CdsTreeEntry](_views_cs_cds_viewcontainers_cdsexplorer_.cdstreeentry.md)[]›*

___

### `Private` getPluginStepDetails

▸ **getPluginStepDetails**(`element`: [CdsTreeEntry](_views_cs_cds_viewcontainers_cdsexplorer_.cdstreeentry.md), `pluginType?`: any): *Thenable‹[CdsTreeEntry](_views_cs_cds_viewcontainers_cdsexplorer_.cdstreeentry.md)[]›*

Defined in src/views/cs.cds.viewContainers.cdsExplorer.ts:646

**Parameters:**

Name | Type |
------ | ------ |
`element` | [CdsTreeEntry](_views_cs_cds_viewcontainers_cdsexplorer_.cdstreeentry.md) |
`pluginType?` | any |

**Returns:** *Thenable‹[CdsTreeEntry](_views_cs_cds_viewcontainers_cdsexplorer_.cdstreeentry.md)[]›*

___

### `Private` getPluginStepImageDetails

▸ **getPluginStepImageDetails**(`element`: [CdsTreeEntry](_views_cs_cds_viewcontainers_cdsexplorer_.cdstreeentry.md), `pluginStep?`: any): *Thenable‹[CdsTreeEntry](_views_cs_cds_viewcontainers_cdsexplorer_.cdstreeentry.md)[]›*

Defined in src/views/cs.cds.viewContainers.cdsExplorer.ts:658

**Parameters:**

Name | Type |
------ | ------ |
`element` | [CdsTreeEntry](_views_cs_cds_viewcontainers_cdsexplorer_.cdstreeentry.md) |
`pluginStep?` | any |

**Returns:** *Thenable‹[CdsTreeEntry](_views_cs_cds_viewcontainers_cdsexplorer_.cdstreeentry.md)[]›*

___

### `Private` getPluginTypeDetails

▸ **getPluginTypeDetails**(`element`: [CdsTreeEntry](_views_cs_cds_viewcontainers_cdsexplorer_.cdstreeentry.md), `plugin?`: any): *Thenable‹[CdsTreeEntry](_views_cs_cds_viewcontainers_cdsexplorer_.cdstreeentry.md)[]›*

Defined in src/views/cs.cds.viewContainers.cdsExplorer.ts:634

**Parameters:**

Name | Type |
------ | ------ |
`element` | [CdsTreeEntry](_views_cs_cds_viewcontainers_cdsexplorer_.cdstreeentry.md) |
`plugin?` | any |

**Returns:** *Thenable‹[CdsTreeEntry](_views_cs_cds_viewcontainers_cdsexplorer_.cdstreeentry.md)[]›*

___

### `Private` getProcessDetails

▸ **getProcessDetails**(`element`: [CdsTreeEntry](_views_cs_cds_viewcontainers_cdsexplorer_.cdstreeentry.md), `context?`: any): *Thenable‹[CdsTreeEntry](_views_cs_cds_viewcontainers_cdsexplorer_.cdstreeentry.md)[]›*

Defined in src/views/cs.cds.viewContainers.cdsExplorer.ts:701

**Parameters:**

Name | Type |
------ | ------ |
`element` | [CdsTreeEntry](_views_cs_cds_viewcontainers_cdsexplorer_.cdstreeentry.md) |
`context?` | any |

**Returns:** *Thenable‹[CdsTreeEntry](_views_cs_cds_viewcontainers_cdsexplorer_.cdstreeentry.md)[]›*

___

### `Private` getSolutionDetails

▸ **getSolutionDetails**(`element`: [CdsTreeEntry](_views_cs_cds_viewcontainers_cdsexplorer_.cdstreeentry.md)): *Promise‹[CdsTreeEntry](_views_cs_cds_viewcontainers_cdsexplorer_.cdstreeentry.md)[]›*

Defined in src/views/cs.cds.viewContainers.cdsExplorer.ts:610

**Parameters:**

Name | Type |
------ | ------ |
`element` | [CdsTreeEntry](_views_cs_cds_viewcontainers_cdsexplorer_.cdstreeentry.md) |

**Returns:** *Promise‹[CdsTreeEntry](_views_cs_cds_viewcontainers_cdsexplorer_.cdstreeentry.md)[]›*

___

### `Private` getSolutionLevelDetails

▸ **getSolutionLevelDetails**(`element`: [CdsTreeEntry](_views_cs_cds_viewcontainers_cdsexplorer_.cdstreeentry.md)): *Promise‹[CdsTreeEntry](_views_cs_cds_viewcontainers_cdsexplorer_.cdstreeentry.md)[]›*

Defined in src/views/cs.cds.viewContainers.cdsExplorer.ts:572

**Parameters:**

Name | Type |
------ | ------ |
`element` | [CdsTreeEntry](_views_cs_cds_viewcontainers_cdsexplorer_.cdstreeentry.md) |

**Returns:** *Promise‹[CdsTreeEntry](_views_cs_cds_viewcontainers_cdsexplorer_.cdstreeentry.md)[]›*

___

###  getTreeItem

▸ **getTreeItem**(`element`: [CdsTreeEntry](_views_cs_cds_viewcontainers_cdsexplorer_.cdstreeentry.md)): *TreeItem*

Defined in src/views/cs.cds.viewContainers.cdsExplorer.ts:360

**Parameters:**

Name | Type |
------ | ------ |
`element` | [CdsTreeEntry](_views_cs_cds_viewcontainers_cdsexplorer_.cdstreeentry.md) |

**Returns:** *TreeItem*

___

### `Private` getWebResourcesDetails

▸ **getWebResourcesDetails**(`element`: [CdsTreeEntry](_views_cs_cds_viewcontainers_cdsexplorer_.cdstreeentry.md), `solution?`: any, `folder?`: string): *Thenable‹[CdsTreeEntry](_views_cs_cds_viewcontainers_cdsexplorer_.cdstreeentry.md)[]›*

Defined in src/views/cs.cds.viewContainers.cdsExplorer.ts:682

**Parameters:**

Name | Type |
------ | ------ |
`element` | [CdsTreeEntry](_views_cs_cds_viewcontainers_cdsexplorer_.cdstreeentry.md) |
`solution?` | any |
`folder?` | string |

**Returns:** *Thenable‹[CdsTreeEntry](_views_cs_cds_viewcontainers_cdsexplorer_.cdstreeentry.md)[]›*

___

### `Private` getWebResourcesFolderDetails

▸ **getWebResourcesFolderDetails**(`element`: [CdsTreeEntry](_views_cs_cds_viewcontainers_cdsexplorer_.cdstreeentry.md), `solution?`: any, `folder?`: string): *Thenable‹[CdsTreeEntry](_views_cs_cds_viewcontainers_cdsexplorer_.cdstreeentry.md)[]›*

Defined in src/views/cs.cds.viewContainers.cdsExplorer.ts:670

**Parameters:**

Name | Type |
------ | ------ |
`element` | [CdsTreeEntry](_views_cs_cds_viewcontainers_cdsexplorer_.cdstreeentry.md) |
`solution?` | any |
`folder?` | string |

**Returns:** *Thenable‹[CdsTreeEntry](_views_cs_cds_viewcontainers_cdsexplorer_.cdstreeentry.md)[]›*

___

###  inspect

▸ **inspect**(`item?`: [CdsTreeEntry](_views_cs_cds_viewcontainers_cdsexplorer_.cdstreeentry.md)): *Promise‹unknown›*

Defined in src/views/cs.cds.viewContainers.cdsExplorer.ts:377

**Parameters:**

Name | Type |
------ | ------ |
`item?` | [CdsTreeEntry](_views_cs_cds_viewcontainers_cdsexplorer_.cdstreeentry.md) |

**Returns:** *Promise‹unknown›*

___

###  moveSolution

▸ **moveSolution**(`item?`: [CdsTreeEntry](_views_cs_cds_viewcontainers_cdsexplorer_.cdstreeentry.md)): *Promise‹void›*

Defined in src/views/cs.cds.viewContainers.cdsExplorer.ts:382

**Parameters:**

Name | Type |
------ | ------ |
`item?` | [CdsTreeEntry](_views_cs_cds_viewcontainers_cdsexplorer_.cdstreeentry.md) |

**Returns:** *Promise‹void›*

___

###  openInApp

▸ **openInApp**(`item?`: [CdsTreeEntry](_views_cs_cds_viewcontainers_cdsexplorer_.cdstreeentry.md)): *Promise‹void›*

Defined in src/views/cs.cds.viewContainers.cdsExplorer.ts:388

**Parameters:**

Name | Type |
------ | ------ |
`item?` | [CdsTreeEntry](_views_cs_cds_viewcontainers_cdsexplorer_.cdstreeentry.md) |

**Returns:** *Promise‹void›*

___

###  openInBrowser

▸ **openInBrowser**(`item?`: [CdsTreeEntry](_views_cs_cds_viewcontainers_cdsexplorer_.cdstreeentry.md)): *Promise‹void›*

Defined in src/views/cs.cds.viewContainers.cdsExplorer.ts:393

**Parameters:**

Name | Type |
------ | ------ |
`item?` | [CdsTreeEntry](_views_cs_cds_viewcontainers_cdsexplorer_.cdstreeentry.md) |

**Returns:** *Promise‹void›*

___

###  openInEditor

▸ **openInEditor**(`item?`: [CdsTreeEntry](_views_cs_cds_viewcontainers_cdsexplorer_.cdstreeentry.md)): *Promise‹void›*

Defined in src/views/cs.cds.viewContainers.cdsExplorer.ts:398

**Parameters:**

Name | Type |
------ | ------ |
`item?` | [CdsTreeEntry](_views_cs_cds_viewcontainers_cdsexplorer_.cdstreeentry.md) |

**Returns:** *Promise‹void›*

___

###  refresh

▸ **refresh**(`item?`: [CdsTreeEntry](_views_cs_cds_viewcontainers_cdsexplorer_.cdstreeentry.md)): *void*

Defined in src/views/cs.cds.viewContainers.cdsExplorer.ts:403

**Parameters:**

Name | Type |
------ | ------ |
`item?` | [CdsTreeEntry](_views_cs_cds_viewcontainers_cdsexplorer_.cdstreeentry.md) |

**Returns:** *void*

___

###  refreshSolution

▸ **refreshSolution**(`solutionPath?`: string): *void*

Defined in src/views/cs.cds.viewContainers.cdsExplorer.ts:414

**Parameters:**

Name | Type |
------ | ------ |
`solutionPath?` | string |

**Returns:** *void*

___

###  removeConnection

▸ **removeConnection**(`connection`: [Config](../interfaces/_api_cds_webapi_cdswebapi_.cdswebapi.config.md)): *Promise‹void›*

Defined in src/views/cs.cds.viewContainers.cdsExplorer.ts:422

**Parameters:**

Name | Type |
------ | ------ |
`connection` | [Config](../interfaces/_api_cds_webapi_cdswebapi_.cdswebapi.config.md) |

**Returns:** *Promise‹void›*

___

###  removeFromSolution

▸ **removeFromSolution**(`item?`: [CdsTreeEntry](_views_cs_cds_viewcontainers_cdsexplorer_.cdstreeentry.md)): *Promise‹void›*

Defined in src/views/cs.cds.viewContainers.cdsExplorer.ts:433

**Parameters:**

Name | Type |
------ | ------ |
`item?` | [CdsTreeEntry](_views_cs_cds_viewcontainers_cdsexplorer_.cdstreeentry.md) |

**Returns:** *Promise‹void›*

___

### `Private` removePluginStep

▸ **removePluginStep**(`config`: [Config](../interfaces/_api_cds_webapi_cdswebapi_.cdswebapi.config.md), `step`: any): *Promise‹void›*

Defined in src/views/cs.cds.viewContainers.cdsExplorer.ts:923

**Parameters:**

Name | Type |
------ | ------ |
`config` | [Config](../interfaces/_api_cds_webapi_cdswebapi_.cdswebapi.config.md) |
`step` | any |

**Returns:** *Promise‹void›*

___

### `Private` removePluginStepImage

▸ **removePluginStepImage**(`config`: [Config](../interfaces/_api_cds_webapi_cdswebapi_.cdswebapi.config.md), `stepImage`: any): *Promise‹void›*

Defined in src/views/cs.cds.viewContainers.cdsExplorer.ts:930

**Parameters:**

Name | Type |
------ | ------ |
`config` | [Config](../interfaces/_api_cds_webapi_cdswebapi_.cdswebapi.config.md) |
`stepImage` | any |

**Returns:** *Promise‹void›*

___

### `Private` runCommand

▸ **runCommand**(`definitions`: [Dictionary](_core_types_dictionary_.dictionary.md)‹[CdsExplorerEntryType](../modules/_views_cs_cds_viewcontainers_cdsexplorer_.md#cdsexplorerentrytype), function›, `item?`: [CdsTreeEntry](_views_cs_cds_viewcontainers_cdsexplorer_.cdstreeentry.md)): *Promise‹any›*

Defined in src/views/cs.cds.viewContainers.cdsExplorer.ts:937

**Parameters:**

Name | Type |
------ | ------ |
`definitions` | [Dictionary](_core_types_dictionary_.dictionary.md)‹[CdsExplorerEntryType](../modules/_views_cs_cds_viewcontainers_cdsexplorer_.md#cdsexplorerentrytype), function› |
`item?` | [CdsTreeEntry](_views_cs_cds_viewcontainers_cdsexplorer_.cdstreeentry.md) |

**Returns:** *Promise‹any›*
