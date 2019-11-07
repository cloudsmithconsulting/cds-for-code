import * as vscode from "vscode";
import * as fs from 'fs';
import * as cs from '../cs';
import QuickPicker from "../helpers/QuickPicker";
import * as path from 'path';
import * as FileSystem from '../helpers/FileSystem';
import { TS } from "typescript-linq";
import { ExtensionContext } from "vscode";
import WorkspaceState from "./WorkspaceState";
import IWireUpCommands from "../wireUpCommand";
import { DynamicsWebApi } from "../api/Types";
import Utilities from "../helpers/Utilities";

export default class SolutionMap implements IWireUpCommands
{
    constructor (map?:SolutionMap) {
        if (map) {
            this.mappings = map.mappings;
        }
    }

    public wireUpCommands(context: vscode.ExtensionContext, config?: vscode.WorkspaceConfiguration) {
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

				folder = folder || await QuickPicker.pickWorkspaceFolder(workspaceFolder ? workspaceFolder.uri : undefined, "Choose a workplace folder where solution items will be placed.");
                if (Utilities.IsNullOrEmpty(folder)) { return; }
                
                const map = SolutionMap.loadFromWorkspace(context);
                item = item || map.hasSolutionMap(organizationId, solutionId) ? map.getPath(organizationId, solutionId) : null;
                
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

    public mappings:SolutionWorkspaceMapping[] = [];

    public map(organizationId:string, solutionId:string, path:string): SolutionMap {
        let existing = this.hasPathMap(path) ? this.getMapping(path) : this.hasSolutionMap(organizationId, solutionId) ? this.getPath(organizationId, solutionId) : null;
        const isNew = (!existing);

        if (isNew) {
             existing = new SolutionWorkspaceMapping(organizationId, solutionId, path); 
        } else {
            existing.solutionId = solutionId;
            existing.organizationId = organizationId;
            existing.path = path;
        }

        if (isNew) {
            this.mappings.push(new SolutionWorkspaceMapping(organizationId, solutionId, path));
        } 
        
        return this;
    }

    public hasPathMap(path:string): boolean {
        return new TS.Linq.Enumerator(this.mappings)
            .where(m => m.path && m.path === path)
            .toArray()
            .length > 0;
    }

    public hasSolutionMap(organizationId:string, solutionId:string): boolean {
        return new TS.Linq.Enumerator(this.mappings)
            .where(m => m.organizationId && m.organizationId === organizationId && m.solutionId && m.solutionId === solutionId)
            .toArray()
            .length > 0;
    }

    public getMapping(path:string): SolutionWorkspaceMapping {
        let items = new TS.Linq.Enumerator(this.mappings)
            .where(m => m.path && m.path === path)
            .toArray();

        if (items.length > 0) {
            return items[0];
        }
    
        return new SolutionWorkspaceMapping(undefined, undefined, path);
    }

    public getPath(organizationId:string, solutionId:string): SolutionWorkspaceMapping {
        let items = new TS.Linq.Enumerator(this.mappings)
            .where(m => m.organizationId && m.organizationId === organizationId && m.solutionId && m.solutionId === solutionId)
            .toArray();

        if (items.length > 0) {
            return items[0];
        }
        
        return new SolutionWorkspaceMapping(organizationId, solutionId, undefined);
    }

    public async load(filename?:string): Promise<SolutionMap>
    {
        return (SolutionMap.read(filename)
            .then(solutionMap => { this.mappings = solutionMap.mappings; return this; }));
    }

    public async save(filename?:string): Promise<SolutionMap>
    {
        return SolutionMap.write(this, filename);
    }

    public saveToWorkspace(context: ExtensionContext) : SolutionMap {
        WorkspaceState.Instance(context).SolutionMap = this;

        return this;
    }

    public clear(): SolutionMap { 
        this.mappings = [];

        return this;
    }

    public static loadFromWorkspace(context: ExtensionContext) : SolutionMap {
        return WorkspaceState.Instance(context).SolutionMap;
    }
    
    public static async read(filename:string = ".dynamics/solutionMap.json"): Promise<SolutionMap> {
        const workspacePath = await QuickPicker.pickWorkspaceRoot(undefined, "Choose a location that houses your .dynamics folder.", true).then(uri => uri ? uri.fsPath : null);
        if (!workspacePath) { return; }

        const file  = path.join(workspacePath, filename);

        if (fs.existsSync(file)) {
            try {
                let returnObject = JSON.parse(fs.readFileSync(file, 'utf8'));

                if (returnObject && returnObject instanceof SolutionMap) {
                    return <SolutionMap>returnObject;
                }
            }
            catch (error) {
                vscode.window.showErrorMessage(`The file '${filename}' file was found but could not be parsed.  A new file will be created.${error ? '  The error returned was: ' + error : ''}`);
            }
        }

        return new SolutionMap();
    }

    public static async write(map:SolutionMap, filename:string = ".dynamics/solutionMap.json"): Promise<SolutionMap> {
        const workspacePath = await QuickPicker.pickWorkspaceRoot(undefined, "Choose a location where your .dynamics folder will go.", true).then(uri => uri ? uri.fsPath : null);
        if (!workspacePath) { return; }

        const folder  = path.join(workspacePath, path.dirname(filename));

        if (!fs.existsSync(folder)) {
            FileSystem.MakeFolderSync(folder);
        }

        const file = path.join(workspacePath, filename);

        try {
            fs.writeFileSync(file, JSON.stringify(map), 'utf8');
        }
        catch (error) {
            vscode.window.showErrorMessage(`The file '${filename}' could not be saved to the workspace.${error ? '  The error returned was: ' + error : ''}`);
        }

        return map;
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
}