import * as vscode from "vscode";
import Dictionary from "./Dictionary";

export class DynamicsWatcher {
    private static _instance:DynamicsWatcher;

    static get Instance():DynamicsWatcher {
        if (!this._instance) { this._instance = new DynamicsWatcher(); }

        return this._instance;
    }

    private constructor() { }

    private _watchers:Dictionary<vscode.GlobPattern, vscode.FileSystemWatcher>;

    get watchers():Dictionary<vscode.GlobPattern, vscode.FileSystemWatcher> {
        return this._watchers;
    }

    public watch(pattern:vscode.GlobPattern, ...events:WatchPattern[]) {
        if (this._watchers.containsKey(pattern)) {
            this._watchers.get(pattern).dispose();
            this._watchers.remove(pattern);
        }

        const watcher = vscode.workspace.createFileSystemWatcher(
            pattern, 
            events.find(() => "Create") ? false : true, 
            events.find(() => "Modify") ? false : true, 
            events.find(() => "Delete") ? false : true);

        this._watchers.add(pattern, watcher);
    }

}

export type WatchPattern = 
    "Create" |
    "Modify" | 
    "Delete";