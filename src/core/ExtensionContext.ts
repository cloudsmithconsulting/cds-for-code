import * as vscode from 'vscode';
import Dictionary from './types/Dictionary';

export default class ExtensionContext {
    constructor(context:vscode.ExtensionContext) {
        ExtensionContext._disposables.map(d => context.subscriptions.push(d));
        ExtensionContext._disposables = [];
        ExtensionContext._instance = context;
     }

    private static _onActivate = new Dictionary<string, any[]>();
    private static _onDeactivate = new Dictionary<string, any[]>();
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

    static registerActivateFunction(id: string, event: any): void {
        if (!this._onActivate.containsKey(id)) {
            this._onActivate.add(id, [ event ]);
        } else {
            this._onActivate[id].push(event);
        }
    }

    static registerDeactivateFunction(id: string, event: any): void {
        if (!this._onDeactivate.containsKey(id)) {
            this._onDeactivate.add(id, [ event ]);
        } else {
            this._onDeactivate[id].push(event);
        }
    }

    async activate(id?: string, config?: vscode.WorkspaceConfiguration) {
        if (!id) {
            await ExtensionContext._onActivate.values.forEach(async v => await v.forEach(async a => await a(ExtensionContext._instance, config)));
        } else if (id && ExtensionContext._onActivate.containsKey(id)) {
            await ExtensionContext._onActivate[id].forEach(async a => await a(ExtensionContext._instance, config));
        }
    }

    async deactivate(id?: string, config?: vscode.WorkspaceConfiguration) { 
        if (!id) {
            await ExtensionContext._onDeactivate.values.forEach(async v => await v.forEach(async a => await a(ExtensionContext._instance, config)));
        } else if (id && ExtensionContext._onDeactivate.containsKey(id)) {
            await ExtensionContext._onDeactivate[id].forEach(async a => await a(ExtensionContext._instance, config));
        }
    }

    static get isDebugging(): boolean {
        return vscode.env.machineId === 'someValue.machineId';
    }
}