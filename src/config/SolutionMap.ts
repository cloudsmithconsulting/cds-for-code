import * as vscode from "vscode";
import * as fs from 'fs';
import { QuickPicker } from "../helpers/QuickPicker";
import * as path from 'path';
import * as FileSystem from '../helpers/FileSystem';
import { TS } from "typescript-linq";

export default class SolutionMap
{
    public mappings:SolutionWorkspaceMapping[] = [];

    public map(organizationId:string, solutionId:string, path:string) {
        this.mappings.push(new SolutionWorkspaceMapping(organizationId, solutionId, path));
    }

    public getMapping(path:string): SolutionWorkspaceMapping {
        return new TS.Linq.Enumerator(this.mappings)
            .where(m => m.path === path)
            .firstOrDefault(new SolutionWorkspaceMapping(undefined, undefined, path));
    }

    public getPath(organizationId:string, solutionId:string): SolutionWorkspaceMapping {
        return new TS.Linq.Enumerator(this.mappings)
            .where(m => m.organizationId === organizationId && m.solutionId === solutionId)
            .firstOrDefault(new SolutionWorkspaceMapping(organizationId, solutionId, undefined));
    }

    public static async read(): Promise<SolutionMap>
    {
        const workspacePath = await QuickPicker.pickWorkspacePath(undefined, "Choose a location where your .dynamics folder will go.", true);
        const file  = path.join(workspacePath, ".dynamics/solutionMap.json");

        if (fs.existsSync(file))
        {
            try {
                return JSON.parse(fs.readFileSync(file, 'utf8'));
            }
            catch (error) {
                vscode.window.showErrorMessage(`The file '.dynamics/solutionMap.json' file was found but could not be parsed.  A new file will be created.${error ? '  The error returned was: ' + error : ''}`);
            }
        }

        return new SolutionMap();
    }

    public static async write(map:SolutionMap): Promise<void>
    {
        const workspacePath = await QuickPicker.pickWorkspacePath(undefined, "Choose a location where your .dynamics folder will go.", true);
        const folder  = path.join(workspacePath, ".dynamics/");

        if (!fs.existsSync(folder))
        {
            FileSystem.MakeFolderSync(folder);
        }

        const file = path.join(folder, "solutionMap.json");

        try {
            fs.writeFileSync(file, map, 'utf8');
        }
        catch (error) {
            vscode.window.showErrorMessage(`The file '.dynamics/solutionMap.json' could not be saved to the workspace.${error ? '  The error returned was: ' + error : ''}`);
        }
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