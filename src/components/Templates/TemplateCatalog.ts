import * as vscode from 'vscode';
import * as path from 'path';
import * as FileSystem from '../../core/io/FileSystem';
import { TS } from 'typescript-linq/TS';
import { TemplateItem, TemplateType } from './Types';
import TemplateManager from './TemplateManager';
import Quickly from '../../core/Quickly';

export class TemplateCatalog {
    constructor(catalog?: TemplateCatalog) {
        if (catalog) {
            this.items = catalog.items.map(i => TemplateItem.from(i));
        }
        else {
            this.items = [];
        }
    }

    static from(catalog: TemplateCatalog): TemplateCatalog {
        return new TemplateCatalog(catalog);
    }

    items: TemplateItem[];

    add(...items: TemplateItem[]): TemplateCatalog {
        this.items.push(...items);

        return this;
    }

    remove(item: TemplateItem): TemplateCatalog {
        this.items.slice(this.items.indexOf(item, 0), 1);

        return this;
    }

    queryCategoriesByType(type?: TemplateType): string[] {
        const allCategories = this.query(c => c
            .where(i => type ? i.type === type : i.type === i.type)
            .select(i => i && i.categories ? i.categories : []));

            return new TS.Linq.Enumerator([].concat(...allCategories)).distinct().toArray();
    }

    queryPublishersByType(type?: TemplateType): string[] {
        return this.query(c => c
            .where(i => type ? i.type === type : i.type === i.type)
            .select(i => i.publisher ? i.publisher : "")
            .where(s => s !== "")
            .distinct());
    }

    queryByCategory(type?: TemplateType, category?: string): TemplateItem[] {
        return this.query(c => c
            .where(i => type ? i.type === type : i.type === i.type)
            .where(i => category ? new TS.Linq.Enumerator(i.categories).any(c => c === category) : i.categories === i.categories));
    }

    queryByPublisher(type?: TemplateType, publisher?: string): TemplateItem[] {
        return this.query(c => c
            .where(i => type ? i.type === type : i.type === i.type)
            .where(i => publisher ? i.publisher === publisher : i.publisher === i.publisher));
    }

    queryByType(type?: TemplateType): TemplateItem[] {
        return this.query(c => c
            .where(i => type ? i.type === type : i.type === i.type));
    }

    query<T>(query: (queryable: TS.Linq.Enumerator<TemplateItem>) => TS.Linq.Enumerator<T>): T[] {
        return query(new TS.Linq.Enumerator(this.items)).toArray();
    }

    async load(filename?: string): Promise<TemplateCatalog> {
        return (TemplateCatalog.read(filename).then(catalog => TemplateCatalog.from(catalog)));
    }

    async save(filename?: string): Promise<TemplateCatalog> {
        return TemplateCatalog.write(this, filename);
    }

    static async read(filename: string = "catalog.json"): Promise<TemplateCatalog> {
        const file = path.isAbsolute(filename) ? filename : path.join(await TemplateManager.getTemplatesFolder(), filename);

        if (FileSystem.exists(file)) {
            try {
                let returnObject = JSON.parse(FileSystem.readFileSync(file));
 
                if (returnObject) {
                    return new TemplateCatalog(returnObject);
                }
            }
            catch (error) {
                Quickly.error(`The template catalog '${filename}' was found but could not be parsed.  A new file will be created.${error ? '  The error returned was: ' + error : ''}`);
            }
        }

        return new TemplateCatalog();
    }
    
    static async write(catalog: TemplateCatalog, filename: string = "catalog.json"): Promise<TemplateCatalog> {
        const folder = path.isAbsolute(filename) ? path.dirname(filename) : path.join(await TemplateManager.getTemplatesFolder(), path.dirname(filename));
        
        if (!FileSystem.exists(folder)) {
            FileSystem.makeFolderSync(folder);
        }
        
        const file = path.isAbsolute(filename) ? filename : path.join(folder, filename);
        
        try {
            FileSystem.writeFileSync(file, JSON.stringify(catalog));
        }
        catch (error) {
            Quickly.error(`The template catalog '${filename}' could not be saved to the templates folder.${error ? '  The error returned was: ' + error : ''}`);
        }
        
        return catalog;
    }
}