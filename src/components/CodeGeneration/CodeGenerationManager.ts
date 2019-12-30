import * as vscode from 'vscode';
import * as cs from '../../cs';
import IContributor from '../../core/CommandBuilder';
import generateEntityCodeToFile from "../../commands/cs.cds.controls.explorer.generateEntityCodeToFile";
import generateEntityCodeToFolder from "../../commands/cs.cds.controls.explorer.generateEntityCodeToFolder";
import generateEntities from "../../commands/cs.cds.powerShell.generateEntities";

export default class CodeGenerationManager implements IContributor {
    contribute(context: vscode.ExtensionContext, config: vscode.WorkspaceConfiguration) {
        // now wire a command into the context
        context.subscriptions.push(
            vscode.commands.registerCommand(cs.cds.controls.explorer.generateEntityCodeToFile, generateEntityCodeToFile.bind(this)),
            vscode.commands.registerCommand(cs.cds.controls.explorer.generateEntityCodeToFolder, generateEntityCodeToFolder.bind(this)),
            vscode.commands.registerCommand(cs.cds.powerShell.generateEntities, generateEntities.bind(this)));
    }
}