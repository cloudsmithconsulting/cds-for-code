import * as vscode from 'vscode';

export default class ExtensionContext {
    constructor(context:vscode.ExtensionContext) {
        ExtensionContext._instance = context;
     }

    private static _instance:vscode.ExtensionContext;

    static get Instance():vscode.ExtensionContext {
        return this._instance;
    }

}