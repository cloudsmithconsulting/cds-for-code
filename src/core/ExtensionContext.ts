import * as vscode from 'vscode';

export default class ExtensionContext {
    constructor(context:vscode.ExtensionContext) {
        ExtensionContext._disposables.map(d => context.subscriptions.push(d));
        ExtensionContext._disposables = [];
        ExtensionContext._instance = context;
     }

    private static _instance:vscode.ExtensionContext;
    private static _disposables: vscode.Disposable[] = [];

    static get Instance():vscode.ExtensionContext {
        return this._instance;
    }

    static subscribe(item: vscode.Disposable): void {
        if (!this._instance) {
            this._disposables.push(item);
        } else {
            this._instance.subscriptions.push(item);
        }
    }

    static registerCommand(command: string, callback: (...args: any[]) => any, thisArg?: any): void {
        const handle = vscode.commands.registerCommand(command, callback, thisArg);

        this.subscribe(handle);
    }
}