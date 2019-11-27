import * as vscode from 'vscode';
import * as cs from '../../cs';
import IContributor from '../../core/CommandBuilder';
import addSolutionComponent from "../../commands/cs.dynamics.deployment.addSolutionComponent";
import removeSolutionComponent from "../../commands/cs.dynamics.deployment.removeSolutionComponent";
import packSolutionFromFolder from "../../commands/cs.dynamics.controls.explorer.packSolutionFromFolder";
import packSolution from "../../commands/cs.dynamics.powerShell.packSolution";
import unpackSolution from "../../commands/cs.dynamics.powerShell.unpackSolution";
import unpackSolutionFromTreeView from "../../commands/cs.dynamics.controls.dynamicsTreeView.unpackSolution";
import unpackSolutionToFolder from "../../commands/cs.dynamics.controls.explorer.unpackSolutionToFolder";
import registerPluginAssembly from "../../commands/cs.dynamics.deployment.registerPluginAssembly";
import registerPluginFile from "../../commands/cs.dynamics.controls.explorer.registerPluginFile";
import publishCustomizations from "../../commands/cs.dynamics.deployment.publishCustomizations";

export default class SolutionManager implements IContributor {
    contribute(context: vscode.ExtensionContext, wconfig: vscode.WorkspaceConfiguration) {
        // now wire a command into the context
        context.subscriptions.push(
            vscode.commands.registerCommand(cs.dynamics.deployment.addSolutionComponent, addSolutionComponent.bind(this)),
            vscode.commands.registerCommand(cs.dynamics.deployment.removeSolutionComponent, removeSolutionComponent.bind(this)),
			vscode.commands.registerCommand(cs.dynamics.controls.explorer.packSolutionFromFolder, packSolutionFromFolder.bind(this)),
			vscode.commands.registerCommand(cs.dynamics.powerShell.packSolution, packSolution.bind(this)),
			vscode.commands.registerCommand(cs.dynamics.controls.dynamicsTreeView.unpackSolution, unpackSolutionFromTreeView.bind(this)),
			vscode.commands.registerCommand(cs.dynamics.controls.explorer.unpackSolutionToFolder, unpackSolutionToFolder.bind(this)),
            vscode.commands.registerCommand(cs.dynamics.powerShell.unpackSolution, unpackSolution.bind(this)),
			vscode.commands.registerCommand(cs.dynamics.controls.explorer.registerPluginFile, registerPluginFile.bind(this)),
            vscode.commands.registerCommand(cs.dynamics.deployment.registerPluginAssembly, registerPluginAssembly.bind(this)),
            vscode.commands.registerCommand(cs.dynamics.deployment.publishCustomizations, publishCustomizations.bind(this))
        );
    }
}