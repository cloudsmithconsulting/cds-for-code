import * as vscode from 'vscode';
import * as cs from '../../cs';
import IContributor from '../../core/CommandBuilder';
import addSolutionComponent from "../../commands/cs.cds.deployment.addSolutionComponent";
import removeSolutionComponent from "../../commands/cs.cds.deployment.removeSolutionComponent";
import packSolutionFromFolder from "../../commands/cs.cds.controls.explorer.packSolutionFromFolder";
import packSolution from "../../commands/cs.cds.powerShell.packSolution";
import unpackSolution from "../../commands/cs.cds.powerShell.unpackSolution";
import unpackSolutionFromTreeView from "../../commands/cs.cds.controls.cdsExplorer.unpackSolution";
import unpackSolutionToFolder from "../../commands/cs.cds.controls.explorer.unpackSolutionToFolder";
import registerPluginAssembly from "../../commands/cs.cds.deployment.registerPluginAssembly";
import registerPluginFile from "../../commands/cs.cds.controls.explorer.registerPluginFile";
import publishCustomizations from "../../commands/cs.cds.deployment.publishCustomizations";

export default class SolutionManager implements IContributor {
    contribute(context: vscode.ExtensionContext, wconfig: vscode.WorkspaceConfiguration) {
        // now wire a command into the context
        context.subscriptions.push(
            vscode.commands.registerCommand(cs.cds.deployment.addSolutionComponent, addSolutionComponent.bind(this)),
            vscode.commands.registerCommand(cs.cds.deployment.removeSolutionComponent, removeSolutionComponent.bind(this)),
			vscode.commands.registerCommand(cs.cds.controls.explorer.packSolutionFromFolder, packSolutionFromFolder.bind(this)),
			vscode.commands.registerCommand(cs.cds.powerShell.packSolution, packSolution.bind(this)),
			vscode.commands.registerCommand(cs.cds.controls.cdsExplorer.unpackSolution, unpackSolutionFromTreeView.bind(this)),
			vscode.commands.registerCommand(cs.cds.controls.explorer.unpackSolutionToFolder, unpackSolutionToFolder.bind(this)),
            vscode.commands.registerCommand(cs.cds.powerShell.unpackSolution, unpackSolution.bind(this)),
			vscode.commands.registerCommand(cs.cds.controls.explorer.registerPluginFile, registerPluginFile.bind(this)),
            vscode.commands.registerCommand(cs.cds.deployment.registerPluginAssembly, registerPluginAssembly.bind(this)),
            vscode.commands.registerCommand(cs.cds.deployment.publishCustomizations, publishCustomizations.bind(this))
        );
    }
}