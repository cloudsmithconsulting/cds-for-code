import * as vscode from 'vscode';

export default interface IBuildCommands {
    buildCommands(context: vscode.ExtensionContext, config?: vscode.WorkspaceConfiguration): void;
}