import * as vscode from "vscode";
import Dictionary from "../types/Dictionary";
import { TS } from 'typescript-linq/TS';

export class FileWatcherDeclaration {
    private readonly _watcher:WorkspaceFileSystemWatcher;
    private readonly _pattern:vscode.GlobPattern;
    private readonly _events:ChangeEvent[];
    private _actions:((change:FileWatcherChange) => void)[];
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

    then(action:(change:FileWatcherChange) => void): FileWatcherDeclaration {
        this._actions.push(action);

        if (!this.isWatching) {
            this.start();
        }

        return this;
    }

    catch(handler:(error:any) => void): FileWatcherDeclaration {
        this._handler = handler;

        return this;
    }

    start(): void {
        this._fsWatcher = vscode.workspace.createFileSystemWatcher(
            this.pattern, 
            this.events.find(() => "Create") ? false : true, 
            this.events.find(() => "Modify") ? false : true, 
            this.events.find(() => "Delete") ? false : true);

        this._fsWatcher.onDidChange(e => {
            this._watcher.observe(new FileWatcherChange(this._watcher.nameOf(this), this.pattern, this, "Modify", e));
        });

        this._fsWatcher.onDidCreate(e => {
            this._watcher.observe(new FileWatcherChange(this._watcher.nameOf(this), this.pattern, this, "Create", e));
        });

        this._fsWatcher.onDidDelete(e => {
            this._watcher.observe(new FileWatcherChange(this._watcher.nameOf(this), this.pattern, this, "Delete", e));
        });
    }

    stop(): void {
        this.dispose();
        this._fsWatcher = null;
    }

    invoke(change:FileWatcherChange): boolean {
        let returnValue = true;

        if (this._actions && this._actions.length > 0) {
            this._actions.forEach(a => {
                try {
                    a(change);
                } catch (error) {
                    returnValue = false;
    
                    if (this._handler) {
                        this._handler(error);
                    } else {
                        throw error;
                    }
                }
            });
        }

        return returnValue;
    }

    dispose(): void {
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
        this._changes = [];
        this._watchers = new Dictionary<string, FileWatcherDeclaration>();
        this._workspaceWatchers = new Dictionary<string, FileWatcherDeclaration>();
     }

    private _changes:FileWatcherChange[];
    private _timeout:NodeJS.Timeout;
    private _watchers:Dictionary<string, FileWatcherDeclaration>;
    private _workspaceWatchers:Dictionary<string, FileWatcherDeclaration>;

    public readonly watcherLatency:number = 400;

    get watchers():Dictionary<string, FileWatcherDeclaration> {
        return this._watchers;
    }

    named(value:string): FileWatcherDeclaration {
        return this._watchers.get(value) || this._workspaceWatchers.get(value) || null;
    }

    nameOf(value:FileWatcherDeclaration): string {
        return this._watchers.getKey(value) || this._workspaceWatchers.getKey(value) || null;
    }

    observe(value:FileWatcherChange): void {
        this._changes.push(value);

        if (this._timeout) {
            global.clearTimeout(this._timeout);
        }

        this._timeout = global.setTimeout(() => this.flushChanges(), this.watcherLatency);
    }

    openWorkspace(value:vscode.WorkspaceFolder): FileWatcherDeclaration {
        const workspaceKey:string = `Workspace:${value.uri.fsPath}`;

        if (!this._workspaceWatchers.containsKey(workspaceKey)) {
            const newItem = new FileWatcherDeclaration(this, new vscode.RelativePattern(value, "**/*"), "Create", "Delete", "Modify");

            // Wire handler.
            newItem.then(value => this.observe(value));

            this._workspaceWatchers.add(workspaceKey, newItem);
        }

        return this._watchers.get(workspaceKey);
    }

    closeWorkspace(value:vscode.WorkspaceFolder): void {
        const workspaceKey:string = `Workspace:${value.uri.fsPath}`;

        if (this._workspaceWatchers.containsKey(workspaceKey)) {
            this._workspaceWatchers.get(workspaceKey).dispose();
            this._workspaceWatchers.remove(workspaceKey);
        }
    }

    watch(name:string, pattern:vscode.GlobPattern, ...events:ChangeEvent[]): FileWatcherDeclaration {
        if (!this._watchers.containsKey(name)) {
            this._watchers.add(name, new FileWatcherDeclaration(this, pattern, ...events));
        }
        
        return this._watchers.get(name);
    }

    stopWatching(name:string): void {
        if (this._watchers.containsKey(name)) {
            this._watchers.get(name).dispose();
            this._watchers.remove(name);
        }
    }

    private flushChanges() {
        if (this._timeout) {
            clearTimeout(this._timeout);
        }

        const removeTo:number = this._changes.length;
        const changes = new TS.Linq.Enumerator(this._changes);
        const workspaceChanges = changes.where(c => c.rule.startsWith("Workspace:"));
        const changesToProcess = changes.where(c => !c.rule.startsWith("Workspace:")).toArray();

        const workspaceContains = (uri?:vscode.Uri, ...events:ChangeEvent[]) => {
            return workspaceFilter(uri, ...events).toArray().length === events.length;
        };

        const workspaceFilter = (uri?:vscode.Uri, ...events:ChangeEvent[]) => {
            return workspaceChanges.where(c => c.sourceUri === uri || c.sourceUri && new TS.Linq.Enumerator(events).any(e => c.event === e));
        };

        const returnList:FileWatcherChange[] = [];

        if (changesToProcess && changesToProcess.length > 0) {
            changesToProcess.forEach(c => {
                // Create into this folder means we have a corresponding create/modify pair.
                if (c.event === "Create" && workspaceContains(c.sourceUri, "Create") && workspaceContains(c.sourceUri, "Delete")) {
                    const sourceUri = workspaceFilter(undefined, "Delete").first().sourceUri;
    
                    // If source + target = same path, it's a rename.
                    if (sourceUri.path.substr(0, sourceUri.path.lastIndexOf("/")) === c.sourceUri.path.substr(0, c.sourceUri.path.lastIndexOf("/"))) {
                        returnList.push(new FileWatcherChange(c.rule, c.pattern, c.source, "Rename", sourceUri, c.sourceUri));
                    }
                    else {
                        returnList.push(new FileWatcherChange(c.rule, c.pattern, c.source, "Move", sourceUri, c.sourceUri));
                    }
    
                    return;
                }
    
                // Delete into this folder means we have a corresponding delete/modify pair.
                if (c.event === "Delete" && workspaceContains(c.sourceUri, "Create") && workspaceContains(c.sourceUri, "Delete")) {
                    const targetUri = workspaceFilter(undefined, "Create").first().sourceUri;
    
                    if (targetUri.path.substr(0, targetUri.path.lastIndexOf("/")) === c.sourceUri.path.substr(0, c.sourceUri.path.lastIndexOf("/"))) {
                        returnList.push(new FileWatcherChange(c.rule, c.pattern, c.source, "Rename", c.sourceUri, targetUri));
                    } else {
                        returnList.push(new FileWatcherChange(c.rule, c.pattern, c.source, "Move", c.sourceUri, targetUri));
                    }
    
                    return;
                }
    
                returnList.push(c);
            });
        }

        this._changes.splice(0, removeTo);

        if (returnList && returnList.length > 0) {
            returnList.forEach(c => c.source.invoke(c));
        }
    }
}

export class FileWatcherChange {
    constructor(rule?:string, pattern?:vscode.GlobPattern, source?:FileWatcherDeclaration, event?:ChangeEvent, sourceUri?:vscode.Uri, targetUri?:vscode.Uri) {
        this.rule = rule;
        this.pattern = pattern;
        this.source = source;
        this.event = event;
        this.sourceUri = sourceUri;
        this.targetUri = targetUri;
    }

    rule: string;
    pattern: vscode.GlobPattern;
    source: FileWatcherDeclaration;
    event: ChangeEvent;
    sourceUri: vscode.Uri;
    targetUri: vscode.Uri;
}

export type ChangeEvent = 
    "Create" |
    "Modify" | 
    "Delete" | 
    "Rename" |
    "Move";