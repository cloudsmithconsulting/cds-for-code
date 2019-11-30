import * as vscode from 'vscode';
import * as cs from '../../cs';
import IContributor from '../../core/CommandBuilder';
import generateEntityCodeToFile from "../../commands/cs.dynamics.controls.explorer.generateEntityCodeToFile";
import generateEntityCodeToFolder from "../../commands/cs.dynamics.controls.explorer.generateEntityCodeToFolder";
import generateEntities from "../../commands/cs.dynamics.powerShell.generateEntities";

export default class CodeGenerationManager implements IContributor {
    contribute(context: vscode.ExtensionContext, config: vscode.WorkspaceConfiguration) {
        // now wire a command into the context
        context.subscriptions.push(
            vscode.commands.registerCommand(cs.dynamics.controls.explorer.generateEntityCodeToFile, generateEntityCodeToFile.bind(this)),
            vscode.commands.registerCommand(cs.dynamics.controls.explorer.generateEntityCodeToFolder, generateEntityCodeToFolder.bind(this)),
            vscode.commands.registerCommand(cs.dynamics.powerShell.generateEntities, generateEntities.bind(this)));
    }
}