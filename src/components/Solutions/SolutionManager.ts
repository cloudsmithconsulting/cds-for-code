import * as vscode from 'vscode';
import * as cs from '../../cs';
import { CdsWebApi } from '../../api/cds-webapi/CdsWebApi';
import { CdsSolutions } from '../../api/CdsSolutions';
import addSolutionComponent from "../../commands/cs.cds.deployment.addSolutionComponent";
import removeSolutionComponent from "../../commands/cs.cds.deployment.removeSolutionComponent";
import exportSolution, { ExportSolutionOptions } from "../../commands/cs.cds.deployment.exportSolution";
import importSolution, { ImportSolutionOptions } from "../../commands/cs.cds.deployment.importSolution";
import packSolution from "../../commands/cs.cds.powerShell.packSolution";
import unpackSolution from "../../commands/cs.cds.powerShell.unpackSolution";
import registerPluginAssembly from "../../commands/cs.cds.deployment.registerPluginAssembly";
import publishCustomizations from "../../commands/cs.cds.deployment.publishCustomizations";
import createProcess from "../../commands/cs.cds.deployment.createProcess";
import command from '../../core/Command';

export default class SolutionManager {
    @command(cs.cds.deployment.createProcess, "Add a process to a solution")
    static async createProcess(config?: CdsWebApi.Config, solutionId?: string) {
        return await createProcess.apply(this, [config, solutionId]);
    }

    @command(cs.cds.deployment.addSolutionComponent, "Add component to solution")
    static async addSolutionComponent(config?: CdsWebApi.Config, solution?: any, componentId?: string, componentType?: CdsSolutions.SolutionComponent, addRequiredComponents?: boolean, doNotIncludeSubcomponents?: boolean, componentSettings?: string): Promise<any> {
        return await addSolutionComponent.apply(this, [config, solution, componentId, componentType, addRequiredComponents, doNotIncludeSubcomponents, componentSettings]);
    }

    @command(cs.cds.deployment.removeSolutionComponent, "Remove component from solution")
    static async removeSolutionComponent(config?: CdsWebApi.Config, solution?: any, componentId?: string, componentType?: CdsSolutions.SolutionComponent): Promise<any> {
        return await removeSolutionComponent.apply(this, [config, solution, componentId, componentType]);
    }

    @command(cs.cds.deployment.exportSolution, "Export Solution")
    static async exportSolution(config?: CdsWebApi.Config, solution?: any, solutionFile?: vscode.Uri, options?: ExportSolutionOptions, inform: boolean = true): Promise<void> {
        return await exportSolution.apply(this, [ config, solution, solutionFile, options, inform ]);
    }

    @command(cs.cds.deployment.importSolution, "Import Solution")
    static async importSolution(config?: CdsWebApi.Config, solutionFile?: vscode.Uri, options?: ImportSolutionOptions, inform: boolean = true): Promise<void> {
        return await importSolution.apply(this, [ config, solutionFile, options, inform ]);
    }

    @command(cs.cds.controls.explorer.importSolution, "Import Solution")
    static async importSolutionFromFile(solutionFile?: vscode.Uri): Promise<void> {
        return await importSolution.apply(this, [ undefined, solutionFile ]);
    }

    @command(cs.cds.controls.explorer.packSolutionFromFolder, "Pack solution from folder")
    static async packSolutionFromFolder(folder?: vscode.Uri) {
        return await vscode.commands.executeCommand(cs.cds.powerShell.packSolution, undefined, folder.fsPath);
    }

    @command(cs.cds.powerShell.packSolution, "Pack and deploy solution")
    static async packSolution(config?: CdsWebApi.Config, folder?: string, solution?: any, toolsPath?: string, logFile?: string, mappingFile?: string, includeResourceFiles?: boolean, solutionPath?: string, managed?: boolean) {
        return await packSolution.apply(this, [config, folder, solution, toolsPath, logFile, mappingFile, includeResourceFiles, solutionPath, managed]);
    }

    @command(cs.cds.controls.cdsExplorer.unpackSolution, "Download and unpack solution from CDS Explorer")
    static async unpackSolutionFromTreeView(item: any) {
        return await vscode.commands.executeCommand(cs.cds.powerShell.unpackSolution, item.config, undefined, item.context);
    }

    @command(cs.cds.controls.explorer.unpackSolutionToFolder, "Download and unpack solution from File Explorer")
    static async unpackSolutionToFolder(folder?: vscode.Uri) {
        return await vscode.commands.executeCommand(cs.cds.powerShell.unpackSolution, undefined, folder.fsPath);
    }

    @command(cs.cds.powerShell.unpackSolution, "Download and unpack solution")
    static async unpackSolution(config?: CdsWebApi.Config, folder?: string, solution?: any, toolsPath?: string, logFile?: string, mappingFile?: string, templateResourceCode?: string, includeResourceFiles?: boolean, allowDelete: boolean = true) {
        return await unpackSolution.apply(this, [config, folder, solution, toolsPath, logFile, mappingFile, templateResourceCode, includeResourceFiles, allowDelete]);
    }    

    @command(cs.cds.controls.explorer.registerPluginFile, "Register plugin file from File Explorer")
    static async registerPluginFile(file?: vscode.Uri) {
        return await vscode.commands.executeCommand(cs.cds.deployment.registerPluginAssembly, undefined, undefined, file);
    }

    @command(cs.cds.deployment.registerPluginAssembly, "Register plugin assembly")
    static async registerPluginAssembly(config?: CdsWebApi.Config, pluginAssembly?: any, file?: vscode.Uri, solution?: any): Promise<any> {
        return await registerPluginAssembly.apply(this, [config, pluginAssembly, file, solution]);
    }

    @command(cs.cds.deployment.publishCustomizations, "Publish Customizations")
    static async publishCustomizations(config?: CdsWebApi.Config, components?: {type: CdsSolutions.SolutionComponent, id: string}[]) {
        return await publishCustomizations.apply(this, [config, components]);
    }
}