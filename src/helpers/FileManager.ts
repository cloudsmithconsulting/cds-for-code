import * as vscode from "vscode";

export class FileWatcherItem {
    private readonly _watcher:WorkspaceFileSystemWatcher;
    private readonly _pattern:vscode.GlobPattern;
    private readonly _events:ChangeEvent[];
    private _actions:((pattern:vscode.GlobPattern, match:vscode.Uri, event:ChangeEvent) => void)[];
    private _handler:(error:any) => void;
    private _fsWatcher: vscode.FileSystemWatcher;

    get pattern(): vscode.GlobPattern {
        return this._pattern;
    }

    get events(): ChangeEvent[] {
        return this._events;
    }

    get isWatching(): boolean {
        return this._fsWatcher && this._fsWatcher !== null;
    }

    constructor(watcher:WorkspaceFileSystemWatcher, pattern:vscode.GlobPattern, ...events:ChangeEvent[]) { 
        this._actions = [];
        this._watcher = watcher;
        this._pattern = pattern;
        this._events = events;
    }

    then(action:(pattern:vscode.GlobPattern, match:vscode.Uri, event:ChangeEvent) => void): WorkspaceFileSystemWatcher {
        this._actions.push(action);

        if (!this.isWatching) {
            this.start();
        }

        return this._watcher;
    }

    catch(handler:(error:any) => void) {
        this._handler = handler;
    }

    start() {
        this._fsWatcher = vscode.workspace.createFileSystemWatcher(
            this.pattern, 
            this.events.find(() => "Create") ? false : true, 
            this.events.find(() => "Modify") ? false : true, 
            this.events.find(() => "Delete") ? false : true);

        this._fsWatcher.onDidChange(e => {
            this._change(e, "Modify"); 
        });

        this._fsWatcher.onDidCreate(e => {
            this._change(e, "Create"); 
        });

        this._fsWatcher.onDidDelete(e => {
            this._change(e, "Delete"); 
        });
    }

    stop() {
        this.dispose();
        this._fsWatcher = null;
    }

    private _change(match:vscode.Uri, event:ChangeEvent) {
        this._actions.forEach(a => {
            try {
                a(this._pattern, match, event);
            } catch (error) {
                if (this._handler) {
                    this._handler(error);
                } else {
                    throw error;
                }
            }
        });
    }

    dispose() {
        if (this._fsWatcher) {
            this._fsWatcher.dispose();
        }
    }
}

export class WorkspaceFileSystemWatcher {
    private static _instance:WorkspaceFileSystemWatcher;

    static get Instance():WorkspaceFileSystemWatcher {
        if (!this._instance) { this._instance = new WorkspaceFileSystemWatcher(); }

        return this._instance;
    }

    private constructor() {
        this._watchers = [];
     }

    private _watchers:FileWatcherItem[];

    get watchers():FileWatcherItem[] {
        return this._watchers;
    }

    public watch(pattern:vscode.GlobPattern, ...events:ChangeEvent[]):FileWatcherItem {
        const existingIndex = this._watchers.findIndex(w => w.pattern === pattern && w.events === events); 
        
        if (existingIndex > -1) {
            return this._watchers[existingIndex];
        }

        const watcherItem = new FileWatcherItem(this, pattern, ...events);
        this._watchers.push(watcherItem);

        return watcherItem;
    }

    public stopWatching(pattern:vscode.GlobPattern, ...events:ChangeEvent[]): void {
        const existingIndex = this._watchers.findIndex(w => w.pattern === pattern && w.events === events); 
        
        if (existingIndex > -1) {
            this._watchers[existingIndex].stop();
            this._watchers.slice(existingIndex, 1);
        }
    }
}

export type ChangeEvent = 
    "Create" |
    "Modify" | 
    "Delete";