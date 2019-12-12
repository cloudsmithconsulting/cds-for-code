import * as vscode from "vscode";
import * as cs from '../../cs';
import Quickly from "../../core/Quickly";
import * as path from 'path';
import * as FileSystem from '../../core/io/FileSystem';
import { TS } from "typescript-linq";
import { ExtensionContext } from "vscode";
import IContributor from "../../core/CommandBuilder";
import { DynamicsWebApi } from "../../api/cds-webapi/DynamicsWebApi";
import { CdsSolutions } from "../../api/CdsSolutions";
import { Utilities } from "../../core/Utilities";
import { WorkspaceFileSystemWatcher } from "../../core/io/FileManager";
import SolutionWorkspaceMapping from "./SolutionWorkspaceMapping";


export default class SolutionMap implements IContributor {
    constructor (map?:SolutionMap) {
        if (map && map.mappings) {
            this.mappings = map.mappings;
        } else {
            this.mappings = [];
        }

        if (this.mappings && this.mappings.length > 0) {
            this.monitorMappedFolders();
        }
    }

    contribute(context: vscode.ExtensionContext, config?: vscode.WorkspaceConfiguration) {
        // load default map as it will force filesystemwatchers to intialize.
        if (vscode.workspace.workspaceFolders && vscode.workspace.workspaceFolders.length > 0) {
            // Watch the files in the workspace for changes.
            vscode.workspace.workspaceFolders.forEach(f => WorkspaceFileSystemWatcher.Instance.openWorkspace(f));
        }

        context.subscriptions.push(
            vscode.commands.registerCommand(cs.dynamics.deployment.removeSolutionMapping, async (item?: SolutionWorkspaceMapping): Promise<boolean> => {
                const map = await SolutionMap.loadFromWorkspace();
                let returnValue = false;

                if (!item) { 
                    map.clear();
                } else {
                    if (item && item.path) {
                        if (FileSystem.exists(item.path)) {
                            returnValue = true;
                            await FileSystem.deleteFolder(item.path);
                        }
                    }

                    const itemIndex = map.mappings.indexOf(item);

                    if (itemIndex > -1) {
                        map.mappings.slice(itemIndex, 1);
                    }
                }
                
                map.saveToWorkspace();

                return returnValue;
            })
            , vscode.commands.registerCommand(cs.dynamics.deployment.updateSolutionMapping, async (item?: SolutionWorkspaceMapping, config?:DynamicsWebApi.Config, folder?: string): Promise<SolutionWorkspaceMapping[]> => {
                let solutionId;
                let organizationId;
                const workspaceFolder = vscode.workspace.workspaceFolders && vscode.workspace.workspaceFolders.length > 0 ? vscode.workspace.workspaceFolders[0] : null;

                if (item) { 
                    organizationId = item.organizationId;
                    solutionId = item.solutionId;
                } 

                if (!organizationId) {
                    config = config || await Quickly.pickCdsOrganization(context, "Choose a Dynamics 365 Organization", true);
                    if (!config) { return; }
    
                    organizationId = config.orgId;
                }

                if (!solutionId) {
                    let solution = await Quickly.pickCdsSolution(config, "Choose a Solution to map to the local workspace", true);
                    if (!solution) { return; }
    
                    solutionId = solution.solutionid;
                }

				folder = folder || await Quickly.pickWorkspaceFolder(workspaceFolder ? workspaceFolder.uri : undefined, "Choose a workplace folder containing solution items.");
                if (Utilities.$Object.isNullOrEmpty(folder)) { return; }
                
                const map = await SolutionMap.loadFromWorkspace();
                item = item || map.hasSolutionMap(solutionId, organizationId) ? map.getBySolutionId(solutionId, organizationId)[0] : null;
                
                if (item && item.path && item.path !== folder) {
                    // If we're moving into a new folder that's not called the solution name, let's add it (assuming you didn't just rename it).
                    if (!folder.endsWith(path.basename(item.path)) 
                        && (item.path.indexOf("\\") === -1 || item.path.substring(0, item.path.lastIndexOf("\\")) !== folder.substring(0, folder.lastIndexOf("\\"))) 
                        && (item.path.indexOf("/") === -1 || item.path.substring(0, item.path.lastIndexOf("/")) !== folder.substring(0, folder.lastIndexOf("/")))) {
                        folder = path.join(folder, path.basename(item.path));
                    }

                    if (item.path !== folder) {
                        if (FileSystem.exists(item.path)) {
                            await FileSystem.copyFolder(item.path, folder)
                                .then(() => FileSystem.deleteFolder(item.path));
                        }
                    }
                }

                map.map(organizationId, solutionId, folder);
                map.saveToWorkspace(context);

                return map.getByPath(folder, organizationId);
            })
        );
    }

    mappings:SolutionWorkspaceMapping[];

    map(organizationId:string, solutionId:string, path:string): SolutionMap {
        let workspaceMapping = this.hasPathMap(path) ? this.getByPath(path)[0] : this.hasSolutionMap(solutionId, organizationId) ? this.getBySolutionId(solutionId, organizationId)[0] : null;
        const isNew = (!workspaceMapping);

        if (isNew) {
             workspaceMapping = new SolutionWorkspaceMapping(organizationId, solutionId, path); 
        } else {
            workspaceMapping.solutionId = solutionId;
            workspaceMapping.organizationId = organizationId;
            workspaceMapping.path = path;
        }

        if (isNew) {
            this.mappings.push(workspaceMapping);
            this.monitorMappedFolders(workspaceMapping);
        } 
        
        return this;
    }

    unmap(organizationId?:string, solutionId?:string, path?:string): boolean {
        const items = new TS.Linq.Enumerator(this.mappings)
            .where(m => organizationId ? m.organizationId === organizationId : true)
            .where(m => solutionId ? m.solutionId === solutionId : true)
            .where(m => path ? m.path === path || m.path === path + "/" || m.path === path + "\\" : true)
            .toArray();

        if (items && items.length > 0) {
            items.forEach(i => {
                this.unmonitorMappedFolders(i);
                this.mappings.slice(this.mappings.indexOf(i), 1);
            });

            return true;
        }

        return false;
    }

    hasPathMap(path:string, organizationId?:string): boolean {
        return this.getByPath(path, organizationId).length > 0;
    }

    hasSolutionMap(solutionId:string, organizationId?:string): boolean {
        return this.getBySolutionId(solutionId, organizationId).length > 0;
    }

    getByPath(fsPath:string, organizationId?:string): SolutionWorkspaceMapping[] {
        if (fsPath.endsWith(path.sep)) {
            fsPath = fsPath.substring(0, fsPath.length - 1); 
        }

        return new TS.Linq.Enumerator(this.mappings)
            .where(m => m.path && (m.path === fsPath || m.path === fsPath + "/" || m.path === fsPath + "\\") && (!organizationId || organizationId && m.organizationId === organizationId))
            .select(m => new SolutionWorkspaceMapping(m.organizationId, m.solutionId, m.path))
            .toArray();
    }

    getByPathOrParent(fsPath:string, organizationId?:string): SolutionWorkspaceMapping[] {
        const results = this.getByPath(fsPath, organizationId);

        if (results.length > 0) {
            return results;
        } else {
            const parentPath = path.join(fsPath, "../");

            if (parentPath && parentPath !== path.parse(parentPath).root) {
                return this.getByPathOrParent(parentPath, organizationId);
            }
        }

        return [];
    }

    getBySolutionId(solutionId:string, organizationId?:string): SolutionWorkspaceMapping[] {
        return new TS.Linq.Enumerator(this.mappings)
            .where(m => m.solutionId && m.solutionId === solutionId && (!organizationId || organizationId && m.organizationId === organizationId))
            .toArray();
    }

    static from(map:SolutionMap): SolutionMap {
        return new SolutionMap(map);
    }

    async load(filename?:string): Promise<SolutionMap> {
        return (SolutionMap.read(filename).then(solutionMap => SolutionMap.from(solutionMap)));
    }

    async save(filename?:string): Promise<SolutionMap> {
        return SolutionMap.write(this, filename);
    }

    async saveToWorkspace(context?: ExtensionContext): Promise<SolutionMap> {
        if (context) {
            context.workspaceState.update(cs.dynamics.configuration.workspaceState.solutionMap, this);
        } else {
            await SolutionMap.write(this);
        }

        return this;
    }

    clear(): SolutionMap { 
        this.unmonitorMappedFolders();
        this.mappings = [];

        return this;
    }

    static async loadFromWorkspace(context?: ExtensionContext, forceWorkspaceOpen: boolean = true): Promise<SolutionMap> {
        if (context) {
            const value = context.workspaceState.get<SolutionMap>(cs.dynamics.configuration.workspaceState.solutionMap);

            if (value) {
                return new SolutionMap(value);
            }
        } else {
            return await SolutionMap.read(undefined, forceWorkspaceOpen);
        }

        return new SolutionMap();
    }

    static mapWorkspacePath(solutionPath: string, component?: CdsSolutions.SolutionComponent, item?: any): string {
        let returnPath: string;
        
        if (!component) {
            returnPath = path.join(solutionPath, "Other", "Solution.xml");
        } else {
            switch (component) {
                case CdsSolutions.SolutionComponent.PluginAssembly:                    
                    //TODO: Ira - complete this switch statement as part of work item 380
                    break;
                case CdsSolutions.SolutionComponent.WebResource:
                    returnPath = path.join(solutionPath, "WebResources");
                    
                    if (item && item.name) {
                        returnPath = path.join(returnPath, item.name);
                    }
                    break;
                default:
                    throw new Error(`SolutionMap cannot determine the local path for solution component '${component.toString()}'`);
            }
        }

        return returnPath;
    }    
    
    static async read(filename: string = ".dynamics/solutionMap.json", forceWorkspaceOpen: boolean = true): Promise<SolutionMap> {
        let workspacePath = vscode.workspace.workspaceFolders && vscode.workspace.workspaceFolders.length > 0 ? vscode.workspace.workspaceFolders[0].uri.fsPath : undefined;

        if (forceWorkspaceOpen) {
            workspacePath = workspacePath || await Quickly.pickWorkspaceRoot(undefined, "Choose a location that houses your .dynamics folder.", true).then(uri => uri ? uri.fsPath : null);
        }

        if (!workspacePath) { return; }

        const file = path.join(workspacePath, filename);

        if (FileSystem.exists(file)) {
            try {
                let returnObject = JSON.parse(FileSystem.readFileSync(file));

                if (returnObject && returnObject instanceof SolutionMap) {
                    return <SolutionMap>returnObject;
                } else { 
                    return new SolutionMap(returnObject);
                }
            } catch (error) {
                Quickly.error(`The file '${filename}' file was found but could not be parsed.  A new file will be created.${error ? '  The error returned was: ' + error : ''}`);
            }
        }

        return new SolutionMap();
    }

    static async write(map:SolutionMap, filename:string = ".dynamics/solutionMap.json"): Promise<SolutionMap> {
        const workspacePath = await Quickly.pickWorkspaceRoot(undefined, "Choose a location where your .dynamics folder will go.", true).then(uri => uri ? uri.fsPath : null);
        if (!workspacePath) { return; }

        const folder  = path.join(workspacePath, path.dirname(filename));

        if (!FileSystem.exists(folder)) {
            FileSystem.makeFolderSync(folder);
        }

        const file = path.join(workspacePath, filename);

        try {
            FileSystem.writeFileSync(file, JSON.stringify(map));
        } catch (error) {
            Quickly.error(`The file '${filename}' could not be saved to the workspace.${error ? '  The error returned was: ' + error : ''}`);
        }

        return map;
    }

    private monitorMappedFolders(mapping?:SolutionWorkspaceMapping): void {
        const toMonitor:SolutionWorkspaceMapping[] = mapping ? [ mapping ] : this.mappings;
        
        if (toMonitor && toMonitor.length > 0) {
            toMonitor.forEach(m => {
                const pattern = SolutionWorkspaceMapping.getSolutionWatcherPattern(m);

                WorkspaceFileSystemWatcher.Instance.watch(SolutionMap.patternName(pattern), pattern, "Create", "Modify", "Delete", "Move", "Rename")
                    .then(change => {
                        if (change.event === "Move" || change.event === "Rename") {
                            const items = this.getByPath(change.sourceUri.fsPath);

                            if (items && items.length > 0) {
                                items.forEach(async m => {
                                    this.unmonitorMappedFolders(m);
    
                                    const mappedItems = <SolutionWorkspaceMapping[]>await vscode.commands.executeCommand(cs.dynamics.deployment.updateSolutionMapping, m, undefined, change.targetUri.fsPath);

                                    if (mappedItems && mappedItems.length > 0) {
                                        mappedItems.forEach(m => this.monitorMappedFolders(m));
                                    }
                                });
                            }
                        } else if (change.event === "Delete") {
                            const items = this.getByPath(change.sourceUri.fsPath).;
                            
                            if (items && items.length > 0) {
                                items.forEach(async m => {
                                    this.unmonitorMappedFolders(m);
    
                                    await vscode.commands.executeCommand(cs.dynamics.deployment.removeSolutionMapping, m);
                                });
                            }
                        }
                    });
            });
        }
    }

    private unmonitorMappedFolders(mapping?:SolutionWorkspaceMapping): void {
        const toUnmonitor:SolutionWorkspaceMapping[] = mapping ? [ mapping ] : this.mappings;

        if (toUnmonitor && toUnmonitor.length > 0) {
            toUnmonitor.forEach(m => {
                const pattern = SolutionWorkspaceMapping.getSolutionWatcherPattern(m);
    
                WorkspaceFileSystemWatcher.Instance.stopWatching(SolutionMap.patternName(pattern));
            });
        }
    }

    private static patternName(pattern:vscode.GlobPattern): string {
        if (pattern instanceof vscode.RelativePattern) {
            return `SolutionMap:${(<vscode.RelativePattern>pattern).base}${(<vscode.RelativePattern>pattern).pattern}`;
        }

        return `SolutionMap:${pattern}`;
    }
}

