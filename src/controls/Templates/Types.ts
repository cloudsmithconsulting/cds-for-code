import * as FileSystem from '../../helpers/FileSystem';
import * as path from 'path';
import Dictionary from '../../helpers/Dictionary';
import TemplateManager from './TemplateManager';

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
        public placeholders?: TemplatePlaceholder[]) { 
        if (!categories) { categories = []; }
        if (!placeholders) { placeholders = []; }
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
            from.placeholders);
    }
    
    async apply(placeholders: Dictionary<string, string>, object?: any): Promise<string | Buffer> {
        if (this.type !== TemplateType.ItemTemplate) {
            throw new Error("Only item templates may invoke the .Apply function inline");
        }
        const systemTemplates = await TemplateManager.getDefaultTemplatesDir(true);
        const userTemplates = await TemplateManager.getDefaultTemplatesDir(true);
        let fileContents: Buffer;

        if (FileSystem.exists(path.join(systemTemplates, this.location))) {
            fileContents = FileSystem.readFileSync(path.join(systemTemplates, this.location));
        }
        else if (FileSystem.exists(path.join(userTemplates, this.location))) {
            fileContents = FileSystem.readFileSync(path.join(userTemplates, this.location));
        }

        if (fileContents) {
            return await TemplateManager.applyTemplate(this, fileContents, placeholders, object);
        }
    }
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
