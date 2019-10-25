import * as vscode from 'vscode';

export default interface IWireUpCommands {
    wireUpCommands(context: vscode.ExtensionContext, config?: vscode.WorkspaceConfiguration): void;
}