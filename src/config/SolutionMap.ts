import * as vscode from "vscode";
import * as fs from 'fs';
import * as cs from '../cs';
import QuickPicker from "../helpers/QuickPicker";
import * as path from 'path';
import * as FileSystem from '../helpers/FileSystem';
import { TS } from "typescript-linq";
import { ExtensionContext, RelativePattern } from "vscode";
import IWireUpCommands from "../wireUpCommand";
import { DynamicsWebApi } from "../api/Types";
import Utilities from "../helpers/Utilities";
import { WorkspaceFileSystemWatcher } from "../helpers/FileManager";

export default class SolutionMap implements IWireUpCommands
{
    private constructor (map?:SolutionMap) {
        if (map && map.mappings) {
            this.mappings = map.mappings;
        } else {
            this.mappings = [];
        }

        if (this.mappings && this.mappings.length > 0) {
            this.monitorMappedFolders();
        }
    }

    wireUpCommands(context: vscode.ExtensionContext, config?: vscode.WorkspaceConfiguration) {
        // load default map as it will force filesystemwatchers to intialize.
        SolutionMap.loadFromWorkspace(context);

        context.subscriptions.push(
            vscode.commands.registerCommand(cs.dynamics.deployment.updateSolutionMapping, async (item?: SolutionWorkspaceMapping, config?:DynamicsWebApi.Config, folder?: string) => {
                let solutionId;
                let organizationId;
                const workspaceFolder = vscode.workspace.workspaceFolders && vscode.workspace.workspaceFolders.length > 0 ? vscode.workspace.workspaceFolders[0] : null;

                if (item) { 
                    organizationId = item.organizationId;
                    solutionId = item.solutionId;
                } 

                if (!organizationId) {
                    config = config || await QuickPicker.pickDynamicsOrganization(context, "Choose a Dynamics 365 Organization", true);
                    if (!config) { return; }
    
                    organizationId = config.orgId;
                }

                if (!solutionId) {
                    let solution = await QuickPicker.pickDynamicsSolution(config, "Choose a Solution to map to the local workspace", true);
                    if (!solution) { return; }
    
                    solutionId = solution.solutionid;
                }

				folder = folder || await QuickPicker.pickWorkspaceFolder(workspaceFolder ? workspaceFolder.uri : undefined, "Choose a workplace folder containing solution items.");
                if (Utilities.IsNullOrEmpty(folder)) { return; }
                
                const map = SolutionMap.loadFromWorkspace(context);
                item = item || map.hasSolutionMap(solutionId, organizationId) ? map.getBySolutionId(solutionId, organizationId)[0] : null;
                
                if (item && item.path && item.path !== folder) {
                    folder = path.join(folder, path.basename(item.path));

                    if (item.path !== folder) {
                        await FileSystem.CopyFolder(item.path, folder)
                            .then(() => FileSystem.DeleteFolder(item.path));
                    }
                }

                map.map(organizationId, solutionId, folder);
                map.saveToWorkspace(context);
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
            .where(m => path ? m.path === path : true)
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

    getByPath(path:string, organizationId?:string): SolutionWorkspaceMapping[] {
        return new TS.Linq.Enumerator(this.mappings)
            .where(m => m.path && m.path === path && (!organizationId || organizationId && m.organizationId === organizationId))
            .toArray();
    }

    getBySolutionId(solutionId:string, organizationId?:string): SolutionWorkspaceMapping[] {
        return new TS.Linq.Enumerator(this.mappings)
            .where(m => m.solutionId && m.solutionId === solutionId && (!organizationId || organizationId && m.organizationId === organizationId))
            .toArray();
    }

    static from(map:SolutionMap) {
        return new SolutionMap(map);
    }

    async load(filename?:string): Promise<SolutionMap> {
        return (SolutionMap.read(filename).then(solutionMap => SolutionMap.from(solutionMap)));
    }

    async save(filename?:string): Promise<SolutionMap> {
        return SolutionMap.write(this, filename);
    }

    saveToWorkspace(context: ExtensionContext) : SolutionMap {
        if (context) {
            context.workspaceState.update(cs.dynamics.configuration.workspaceState.solutionMap, this);
        }

        return this;
    }

    clear(): SolutionMap { 
        this.unmonitorMappedFolders();
        this.mappings = [];

        return this;
    }

    static loadFromWorkspace(context: ExtensionContext) : SolutionMap {
        if (context) {
            const value = context.workspaceState.get<SolutionMap>(cs.dynamics.configuration.workspaceState.solutionMap);

            if (value) {
                return new SolutionMap(value);
            }
        }

        return new SolutionMap();
    }
    
    static async read(filename:string = ".dynamics/solutionMap.json"): Promise<SolutionMap> {
        const workspacePath = await QuickPicker.pickWorkspaceRoot(undefined, "Choose a location that houses your .dynamics folder.", true).then(uri => uri ? uri.fsPath : null);
        if (!workspacePath) { return; }

        const file  = path.join(workspacePath, filename);

        if (fs.existsSync(file)) {
            try {
                let returnObject = JSON.parse(fs.readFileSync(file, 'utf8'));

                if (returnObject && returnObject instanceof SolutionMap) {
                    return <SolutionMap>returnObject;
                }
            } catch (error) {
                vscode.window.showErrorMessage(`The file '${filename}' file was found but could not be parsed.  A new file will be created.${error ? '  The error returned was: ' + error : ''}`);
            }
        }

        return new SolutionMap();
    }

    static async write(map:SolutionMap, filename:string = ".dynamics/solutionMap.json"): Promise<SolutionMap> {
        const workspacePath = await QuickPicker.pickWorkspaceRoot(undefined, "Choose a location where your .dynamics folder will go.", true).then(uri => uri ? uri.fsPath : null);
        if (!workspacePath) { return; }

        const folder  = path.join(workspacePath, path.dirname(filename));

        if (!fs.existsSync(folder)) {
            FileSystem.MakeFolderSync(folder);
        }

        const file = path.join(workspacePath, filename);

        try {
            fs.writeFileSync(file, JSON.stringify(map), 'utf8');
        } catch (error) {
            vscode.window.showErrorMessage(`The file '${filename}' could not be saved to the workspace.${error ? '  The error returned was: ' + error : ''}`);
        }

        return map;
    }

    private monitorMappedFolders(mapping?:SolutionWorkspaceMapping): void {
        const toMonitor:SolutionWorkspaceMapping[] = mapping ? [ mapping ] : this.mappings;

        toMonitor.forEach(m => {
            WorkspaceFileSystemWatcher.Instance.watch(SolutionWorkspaceMapping.getSolutionWatcherPattern(m), "Create", "Modify", "Delete")
                .then((pattern, uri, event) => {
                    console.log(pattern, uri, event);
                });
        });
    }

    private unmonitorMappedFolders(mapping?:SolutionWorkspaceMapping): void {
        const toUnmonitor:SolutionWorkspaceMapping[] = mapping ? [ mapping ] : this.mappings;

        toUnmonitor.forEach(m => {
            WorkspaceFileSystemWatcher.Instance.stopWatching(SolutionWorkspaceMapping.getSolutionWatcherPattern(m), "Create", "Modify", "Delete");
        });
    }
}

export class SolutionWorkspaceMapping
{
    constructor(organizationId?:string, solutionId?:string, path?:string)
    {
        this.organizationId = organizationId;
        this.solutionId = solutionId;
        this.path = path;
    }

    public solutionId:string;
    public organizationId:string;
    public path:string;

    static getSolutionWatcherPattern(mapping:SolutionWorkspaceMapping):vscode.GlobPattern { 
        return new RelativePattern(mapping.path, "/**/Other/Solution.xml");
    }

    static getWebResourceWatcherPattern(mapping:SolutionWorkspaceMapping):vscode.GlobPattern { 
        return new RelativePattern(mapping.path, "/**/WebResources/*.*");
    }
}