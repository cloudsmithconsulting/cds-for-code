import * as vscode from 'vscode';
import * as FileSystem from '../../core/io/FileSystem';
import * as path from 'path';
import Dictionary from '../../core/types/Dictionary';
import TemplateManager from './TemplateManager';
import Quickly from '../../core/Quickly';
import TemplateEngine from './TemplateEngine';

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
        public placeholders?: TemplatePlaceholder[],
        public directives?: TemplateDirective[]) { 
        if (!categories) { categories = []; }
        if (!placeholders) { placeholders = []; }
        if (!directives) { directives = []; }
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
            from.categories,
            from.placeholders,
            from.directives);
    }
    
    async apply(placeholders: Dictionary<string, string>, object?: any): Promise<string | Buffer> {
        if (this.type !== TemplateType.ItemTemplate) {
            throw new Error("Only item templates may invoke the .Apply function inline");
        }
        const systemTemplates = await TemplateManager.getDefaultTemplatesFolder(true);
        const userTemplates = await TemplateManager.getDefaultTemplatesFolder(true);
        let fileContents: Buffer;

        if (FileSystem.exists(path.join(systemTemplates, this.location))) {
            fileContents = FileSystem.readFileSync(path.join(systemTemplates, this.location));
        }
        else if (FileSystem.exists(path.join(userTemplates, this.location))) {
            fileContents = FileSystem.readFileSync(path.join(userTemplates, this.location));
        }

        if (fileContents) {
            return await TemplateEngine.applyTemplate(this, fileContents, placeholders, object);
        }
    }

    async load(filename?: string): Promise<TemplateItem> {
        return (TemplateItem.read(filename).then(item => TemplateItem.from(item)));
    }

    async save(filename?: string): Promise<TemplateItem> {
        return TemplateItem.write(this, filename);
    }

    static async read(filename: string = "template.json"): Promise<TemplateItem> {
        const file = path.isAbsolute(filename) ? filename : path.join(await TemplateManager.getTemplatesFolder(), filename);

        if (FileSystem.exists(file)) {
            try {
                let returnObject = JSON.parse(FileSystem.readFileSync(file));
 
                if (returnObject) {
                    return TemplateItem.from(returnObject);
                }
            }
            catch (error) {
                Quickly.error(`The template '${filename}' was found but could not be parsed.${error ? '  The error returned was: ' + error : ''}`);
            }
        }

        return new TemplateItem();
    }
    
    static async write(template: TemplateItem, filename: string = "template.json"): Promise<TemplateItem> {
        const folder = path.isAbsolute(filename) ? path.dirname(filename) : path.join(await TemplateManager.getTemplateFolder(template), path.dirname(filename));
        
        if (!FileSystem.exists(folder)) {
            FileSystem.makeFolderSync(folder);
        }
        
        const file = path.isAbsolute(filename) ? filename : path.join(folder, filename);
        
        try {
            FileSystem.writeFileSync(file, JSON.stringify(template));
        }
        catch (error) {
            Quickly.error(`The template '${filename}' could not be saved to the template folder.${error ? '  The error returned was: ' + error : ''}`);
        }
        
        return template;
    }    
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
        this.usePlaceholders = true;
        this.usePlaceholdersInFilename = true;
    }
    
    name: string;
    usePlaceholders: boolean;   
    usePlaceholdersInFilename: boolean;
}

export class TemplatePlaceholder {
    constructor(name?: string) {
        if (name) {
            this.name = name;
        }

        this.required = false;
    }
    
    name: string;
    displayName: string;
    required: boolean;
    type: string;
}


export enum TemplateType {
    ProjectTemplate = "Project Template",
    ItemTemplate = "Item Template"
}
