import * as vscode from 'vscode';

export default interface IContributor {
    contribute(context: vscode.ExtensionContext, config?: vscode.WorkspaceConfiguration): void;
}
