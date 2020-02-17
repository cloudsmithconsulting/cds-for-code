import * as vscode from 'vscode';
import * as path from 'path';
import * as doT from 'dot';
import * as FileSystem from '../../core/io/FileSystem';
import TemplateManager from './TemplateManager';
import Quickly from '../../core/Quickly';
import TemplateEngine from './TemplateEngine';
import { Utilities } from '../../core/Utilities';

export class TemplateItem {
    constructor(
        public type?: TemplateType,
        public name?: string,
        public displayName?: string,
        public description?: string,
        public publisher?: string,
        public location?: string,
        public outputPath?: string,
        public categories?: string[],
        public directives?: TemplateDirective[]) { 
        if (!categories) { this.categories = []; }
        if (!directives) { this.directives = []; }
    }

    static from(from:TemplateItem): TemplateItem {
        return new TemplateItem(
            from.type, 
            from.name,
            from.displayName, 
            from.description, 
            from.publisher,
            from.location, 
            from.outputPath,
            from.categories || [],
            from.directives || []);
    }

    static merge(to: TemplateItem, from: TemplateItem) : TemplateItem {
        const result = new TemplateItem(
            from.type || to.type, 
            from.name || to.name,
            from.displayName || to.displayName, 
            from.description || to.description, 
            from.publisher || to.publisher,
            from.location || to.location, 
            from.outputPath || to.outputPath);
        
        result.categories = to.categories || [];

        if (from.categories?.length > 0) {
            from.categories.forEach(c => {
                if (result.categories.indexOf(c) === -1) {
                    result.categories.push(c);
                }
            });
        }

        result.directives = to.directives || [];
        
        if (from.directives?.length > 0) {
            result.directives.push(...from.directives);
        }

        return result;
    }
    
    async apply(outputPath: string, ...object: any): Promise<void> {
        if (this.type !== TemplateType.ItemTemplate) {
            throw new Error("Only item templates may invoke the .apply function inline");
        }
        await TemplateEngine.executeTemplate(this, outputPath, ...object);
    }  
}

export interface Interactive {
    type: string;
    message: string;
    items?: string[];
    connection?: string;
}

export enum TemplateCommandExecutionStage {
    PreRun = "PreRun",
    PostRun = "PostRun"
}

export interface TemplateCommand {
    type: string;
    commandArgs: string;
    stage: TemplateCommandExecutionStage;
    output?: string;
}

export interface TemplateFileAnalysis {
    destination: string;
    source: string;
    fileContents: string | Buffer;
    templateFn: doT.RenderFunction;
}

export class TemplateAnalysis {
    sourcePath: string;
    outputPath: string;
    interactives: { [name: string]: Interactive } = {};
    commands: TemplateCommand[] = [];
    files: TemplateFileAnalysis[] = [];
    template: TemplateItem;
}

export class TemplateContext {
    userCanceled: boolean = false;
    sourcePath: string;
    outputPath: string;
    commands: TemplateCommand[] = [];
    parameters: { [name: string] : any } = {};
    executionContext: any = {};
}

export class TemplateFilesystemItem {
    constructor(
        public type: vscode.FileType,
        public name: string
    ) { }
}

export class TemplateDirective { 
    constructor(name?:string) {
        this.name = name;
        this.processFile = true;
    }
    
    name: string;  
    processFile: boolean;
}


export enum TemplateType {
    ProjectTemplate = "Project Template",
    ItemTemplate = "Item Template"
}
