import * as vscode from 'vscode';

export interface IWireUpCommands {
    wireUpCommands(context: vscode.ExtensionContext, config?: vscode.WorkspaceConfiguration): void;
}