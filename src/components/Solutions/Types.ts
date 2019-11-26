import { RelativePattern } from "vscode";
import { DynamicsWebApi } from "../../webapi/Types";
import * as vscode from 'vscode';
import SolutionMap from "./SolutionMap";

export class SolutionWorkspaceMapping {
    constructor(organizationId?: string, solutionId?: string, path?: string) {
        this.organizationId = organizationId;
        this.solutionId = solutionId;
        this.path = path;
    }

    solutionId: string;
    organizationId: string;
    path: string;
    
    getPath(component?: DynamicsWebApi.SolutionComponent, item?: any): string {
        return SolutionMap.mapWorkspacePath(this.path, component, item);
    }

    static getSolutionWatcherPattern(mapping: SolutionWorkspaceMapping): vscode.GlobPattern {
        return new RelativePattern(mapping.path, "*");
    }

    static getWebResourceWatcherPattern(mapping: SolutionWorkspaceMapping): vscode.GlobPattern {
        return new RelativePattern(mapping.path, "*/WebResources/**/*.*");
    }
}
