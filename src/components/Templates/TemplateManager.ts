import * as vscode from 'vscode';
import * as cs from '../../cs';
import * as fs from 'fs';
import * as path from 'path';
import * as os from 'os';
import * as FileSystem from '../../core/io/FileSystem';
import * as EnvironmentVariables from '../../core/framework/EnvironmentVariables';
import * as _ from 'lodash';
import { TemplateItem, TemplateType, TemplateFilesystemItem } from './Types';
import ExtensionConfiguration from '../../core/ExtensionConfiguration';
import Quickly from '../../core/Quickly';
import { TemplateCatalog } from './TemplateCatalog';
import TemplateTreeView from '../../views/cs.cds.viewContainers.templateExplorer';
import ExtensionContext from '../../core/ExtensionContext';
import command from '../../core/Command';
import TemplateEngine from './TemplateEngine';

import createTemplate from '../../commands/cs.cds.templates.createFromTemplate';
import deleteTemplate from '../../commands/cs.cds.templates.deleteTemplate';
import editTemplateCatalog from '../../commands/cs.cds.templates.editTemplateCatalog';
import exportTemplate from '../../commands/cs.cds.templates.exportTemplate';
import importTemplate from '../../commands/cs.cds.templates.importTemplate';
import openTemplateFolder from '../../commands/cs.cds.templates.openTemplateFolder';
import saveTemplate from '../../commands/cs.cds.templates.saveTemplate';

/**
 * Main class to handle the logic of the Project Templates
 * @export
 * @class TemplateManager
 */
export default class TemplateManager {
    constructor(context: vscode.ExtensionContext) {
        TemplateManager.createTemplatesDirIfNotExists();
    }

    @command(cs.cds.controls.explorer.createFromItemTemplate, "Create from item template")
    static async createItemTemplate(uri?: vscode.Uri) {
        return await vscode.commands.executeCommand(cs.cds.templates.createFromTemplate, uri, TemplateType.ItemTemplate);
    }

    @command(cs.cds.controls.explorer.createFromProjectTemplate, "Create from project template")
    static async createProjectTemplate(uri?: vscode.Uri) {
        return await vscode.commands.executeCommand(cs.cds.templates.createFromTemplate, uri, TemplateType.ProjectTemplate);
    }

    @command(cs.cds.controls.explorer.saveTemplateFile, "Save item template to file")
    static async saveItemTemplate(uri?: vscode.Uri) {
        return await vscode.commands.executeCommand(cs.cds.templates.saveTemplate, uri, TemplateType.ItemTemplate);
    }

    @command(cs.cds.controls.explorer.saveTemplateFolder, "Save project template to file")
    static async saveProjectTemplate(uri?: vscode.Uri) {
        return await vscode.commands.executeCommand(cs.cds.templates.saveTemplate, uri, TemplateType.ProjectTemplate);
    }

    @command(cs.cds.templates.createFromTemplate, "Create from template")
    async createTemplate(destinationUri?: vscode.Uri, type?:TemplateType, template?:TemplateItem): Promise<void> {
        return await createTemplate.apply(this, [destinationUri, type, template]);
    }

    @command(cs.cds.templates.deleteTemplate, "Delete template")
    async deleteTemplate(template: TemplateItem): Promise<void> {
        return await deleteTemplate.apply(this, [template]);
    }

    @command(cs.cds.templates.editTemplateCatalog, "Edit template catalog")
    async editTemplateCatalog(configFile?:vscode.Uri) {
        return await editTemplateCatalog.apply(this, [configFile]);
    }

    @command(cs.cds.templates.exportTemplate, "Export template")
    async exportTemplate(template: TemplateItem, destinationUri:vscode.Uri): Promise<void> {
        return await exportTemplate.apply(this, [template, destinationUri]);
    }

    @command(cs.cds.templates.importTemplate, "Import template")
    async importTemplate(sourceUri:vscode.Uri): Promise<void> {
        return await importTemplate.apply(this, [sourceUri]);
    }

    @command(cs.cds.templates.openTemplateFolder, "Open template folder")
    static async openTemplateFolder(template: TemplateItem): Promise<void> { 
        return await openTemplateFolder.apply(this, [template]);
    }

    @command(cs.cds.templates.saveTemplate, "Save Template") 
    async saveTemplate(templateUri: vscode.Uri, type:TemplateType) {
        return await saveTemplate.apply(this, [templateUri, type]);
    }

    getTemplates(): Promise<TemplateItem[]> {
        return TemplateManager.getTemplateCatalog().then(c => c.items);
    }

    /**
     * Populates a workspace folder with the contents of a template
     * @param fsPath current workspace folder to populate
     */
    async createFromFilesystem(fsPath: string, type:TemplateType, template?:TemplateItem) {
        await TemplateManager.createTemplatesDirIfNotExists();

        // choose a template
        template = template || await Quickly.pickTemplate("Choose a template that you would like to create.", type);

        if (!template) {
            return;
        }

        await TemplateEngine.executeTemplate(template, fsPath);

        return template;
    }

    /**
     * Deletes a template from the template root directory
     * @param template name of template
     * @returns success or failure
     */
    async deleteFromFilesystem(template: TemplateItem) : Promise<boolean> {
        // no template, cancel
        if (!template || !template.location) {
            return false;
        }
            
        let templateRoot = await TemplateManager.getTemplatesFolder();
        let templateLocation:string = path.join(templateRoot, template.name);

        if (FileSystem.exists(templateLocation)) {
            const choice = await Quickly.pickBoolean(`Are you sure you want to delete the template '${template.name}'?`, "Yes", "No");

            if (choice) {
                const catalog = await TemplateManager.getTemplateCatalog();
                const index = catalog.items.findIndex(i => i.name === template.name);
                
                if (index > -1) {
                    catalog.items.splice(index, 1);
                    catalog.save();
                }

                await FileSystem.deleteFolder(templateLocation);
            }

            return choice;
        }

        return false;
    }

    static async getTemplateFolder(template: TemplateItem, systemTemplate:boolean = false): Promise<string> {
        const templateRoot = await TemplateManager.getTemplatesFolder(systemTemplate);
        
        if (template && template.location) {
            let templateDir:string = path.isAbsolute(template.location) ? template.location : path.join(templateRoot, template.location);

            if (template.type === TemplateType.ItemTemplate) {
                templateDir = path.join(templateDir, "..");
            }

            return templateDir;
        } else {
            return templateRoot;
        }
    }

    static async exportTemplate(template: TemplateItem, archive: string, systemTemplate:boolean = false): Promise<void> {
        const folder = await this.getTemplateFolder(template, systemTemplate);
        
        await template.save(path.join(folder, "template.json"));
        await FileSystem.zipFolder(archive, folder);
        await FileSystem.deleteItem(path.join(folder, "template.json"));
    }

    static async importTemplate(archive: string, systemTemplate:boolean = false): Promise<TemplateItem> {
        try {
            const folder = await this.getTemplatesFolder(systemTemplate);
            const templateFolder = path.join(folder, path.basename(archive).replace(path.extname(archive), ""));
    
            await FileSystem.makeFolderSync(templateFolder);
            await FileSystem.unzip(archive, templateFolder);
    
            if (FileSystem.exists(path.join(templateFolder, "template.json"))) {
                const template = await TemplateItem.read(path.join(templateFolder, "template.json"));
                const catalog = await this.getTemplateCatalog(undefined, systemTemplate);
                
                if (template && catalog) {
                    // We may have moved the location of the template (+ items), and need to re-calculate.                
                    const filename = path.extname(template.location) !== "" ? path.basename(template.location) : "";

                    if (template.type === TemplateType.ProjectTemplate) {
                        template.location = path.relative(folder, templateFolder);
                    } else {
                        template.location = path.join(path.relative(folder, templateFolder), filename);
                    }
    
                    const index = catalog.items.findIndex(i => i.name === template.name);
    
                    if (index > -1) {
                        catalog.items.splice(index, 1);
                    }
    
                    catalog.items.push(template);
                    catalog.save();
    
                    await FileSystem.deleteItem(path.join(templateFolder, "template.json"));
    
                    return template;
                }
            }
        } catch (error) {
            console.log(error);
        }
    }

    static async openTemplateFolderInExplorer(template: TemplateItem, systemTemplate:boolean = false): Promise<void> {
        FileSystem.openFolderInExplorer(await this.getTemplateFolder(template, systemTemplate));
    }

    /**
     * Saves a workspace as a new template
     * @param  fsPath absolute path of workspace folder/item
     * @param type the type of template to store.
     * @returns  name of template
     */
    async saveToFilesystem(fsPath: string, type: TemplateType): Promise<TemplateItem> {
        // ensure templates directory exists
        await TemplateManager.createTemplatesDirIfNotExists();

        type = type || TemplateType.ProjectTemplate;
        const fsBaseName = path.basename(fsPath, path.extname(fsPath));

        // prompt user
        return await Quickly.ask("Enter the desired template name", undefined, fsBaseName)
            .then(async templateName => {
                // empty filename exits
                if (!templateName) {
                    return undefined;
                }

                // determine template dir
                const templatesDir = await TemplateManager.getTemplatesFolder();
                const templateDir = path.join(templatesDir, templateName);
                
                // check if exists
                if (FileSystem.exists(templateDir)) {
                    const overwrite = await Quickly.pickBoolean(`Template '${templateName}' aleady exists.  Do you wish to overwrite?`, "Yes", "No");
                    if (overwrite) { 
                        await FileSystem.deleteFolder(templateDir); 
                        FileSystem.makeFolderSync(templateDir);
                    } else {
                        return undefined;
                    }
                } else {
                    // Make the folder.
                    FileSystem.makeFolderSync(templateDir);
                }

                // Check to see if this template exists in the catalog.
                const templateCatalog = await TemplateManager.getTemplateCatalog();
                const categoryList = templateCatalog.queryCategoriesByType();

                let location:string;

                if (type === TemplateType.ProjectTemplate) {
                    location = templateDir;
                    // copy current workspace to new template folder
                    await FileSystem.copyFolder(fsPath, templateDir);
                } else {
                    location = path.join(templateDir, fsBaseName + path.extname(fsPath));
                    FileSystem.copyItemSync(fsPath, location);
                }

                location = path.relative(templatesDir, location);
                let templateItem;
                let isNew:boolean = false;

                if (templateCatalog && templateCatalog.query(c => c.where(i => i.name === templateName)).length === 0) {
                    templateItem = new TemplateItem();
                    isNew = true;
                } else {
                    templateItem = templateCatalog.query(c => c.where(i => i.name === templateName))[0];
                }

                templateItem.name = templateName;
                templateItem.location = location;
                templateItem.displayName = templateItem.displayName || await Quickly.ask(`What should we call the display name for '${templateName}'`, undefined, templateName);
                templateItem.publisher = templateItem.publisher || await Quickly.ask(`Who is the publisher name for '${templateItem.displayName}'`);
                templateItem.type = type;
                templateItem.categories = templateItem.categories || await Quickly.pickAnyOrNew("What categories apply to this template?", ...categoryList).then(i => i.map(c => c.label));

                if (isNew) {
                    templateCatalog.add(templateItem);
                }

                templateCatalog.save();

                TemplateTreeView.Instance.refresh();

                return templateItem;
            }
        );
    }

    /**
     * Gets a copy of the template catalog
     *
     * @static
     * @param {string} [filename]
     * @returns {Promise<TemplateCatalog>}
     * @memberof TemplateManager
     */
    static async getTemplateCatalog(filename?:string, getSystemCatalog:boolean = false): Promise<TemplateCatalog> {
        const templatesDir = await TemplateManager.getDefaultTemplatesFolder(getSystemCatalog);
        let returnCatalog:TemplateCatalog;
        let defaultCatalog:boolean = true;

        if (!filename) { filename = path.join(templatesDir, "catalog.json"); }

        if (filename && FileSystem.exists(filename)) {
            defaultCatalog = false;
            returnCatalog = await TemplateCatalog.read(filename);
        } else {
            returnCatalog = new TemplateCatalog();
        }

        // Load the catalog with all items by default.
        return await TemplateManager.getTemplates(templatesDir, returnCatalog.items, [ "catalog.json" ])
            .then(items => {
                returnCatalog.items = items;

                if (defaultCatalog) {
                    returnCatalog.save(filename);
                }

                return returnCatalog;
            });
    }

    private static _systemTemplates:TemplateItem[];

    static async getSystemTemplates(): Promise<TemplateItem[]> {
        if (!TemplateManager._systemTemplates || TemplateManager._systemTemplates.length === 0) { 
            TemplateManager._systemTemplates = await TemplateManager.getTemplatesFolder(true).then(folder => TemplateManager.getTemplates(folder));
        }

        return TemplateManager._systemTemplates;
    }

    static async getSystemTemplate(name:string): Promise<TemplateItem> {
        return await TemplateManager.getSystemTemplates()
            .then(templates => templates.find(t => t.name === name));
    }

    static async getTemplates(folder: string, mergeWith?:TemplateItem[], exclusions?:string[]):Promise<TemplateItem[]> {
        const templates: TemplateItem[] = [];

        await this.getTemplateFolderItems(folder)
            .then(items => {
                if (items && items.length > 0) {
                    items.forEach(async (i) => {
                        let templateItem:TemplateItem;
                        let type:TemplateType;
                        const isExclusion:boolean = exclusions && exclusions.length > 0 ? exclusions.findIndex(e => e === i.name) > -1 ? true : false : false;
    
                        if (!isExclusion) {
                            if (mergeWith && mergeWith.length > 0) {
                                const current = mergeWith.find(m => m.name === i.name);
    
                                if (current) {
                                    templateItem = current;
                                }
                            }
    
                            templateItem = templateItem || new TemplateItem();
                            type = templateItem.type ? templateItem.type : i.type === vscode.FileType.Directory ? TemplateType.ProjectTemplate : TemplateType.ItemTemplate;
    
                            templateItem.name = templateItem.name || i.name;
                            templateItem.type = type;
                            templateItem.location = templateItem.location || i.name;
    
                            templates.push(templateItem);
                        }
                    });
                }
            });

        return templates;
    }

    /**
     * Returns the templates directory location.
     * If no user configuration is found, the extension will look for
     * templates in USER_DATA_DIR/Code/Templates.
     * Otherwise it will look for the path defined in the extension configuration.
     * @return the templates directory
     */
    static async getTemplatesFolder(systemTemplates:boolean = false): Promise<string> {
        let dir:string = ExtensionConfiguration.getConfigurationValue(cs.cds.configuration.templates.templatesDirectory);

        if (systemTemplates || !dir) {
            dir = path.normalize(TemplateManager.getDefaultTemplatesFolder(systemTemplates));

            return Promise.resolve(dir);
        }

        // resolve path with variables
        await new EnvironmentVariables.default().resolve(dir)
            .then(p => dir = path.normalize(p));

        return Promise.resolve(dir);
    }

    /**
     * Returns the default templates location, which is based on the global storage-path directory.
     * @returns default template directory
     */
    static getDefaultTemplatesFolder(systemTemplates:boolean = false): string {
        const templatesFolderName:string = systemTemplates ? "BuiltInTemplates" : "UserTemplates";
        
        if (!ExtensionContext.Instance) {
            // no workspace, default to OS-specific hard-coded path
             switch (process.platform) {
                 case 'linux':
                     return path.join(os.homedir(), '.config', 'Code-Templates', templatesFolderName);
                 case 'darwin':
                     return path.join(os.homedir(), 'Library', 'Application Support', 'Code-Templates', templatesFolderName);
                 case 'win32':
                     return path.join(process.env.APPDATA!, "CloudSmith", "Code-Templates", templatesFolderName);
                 default:
                     throw Error("Unrecognized operating system: " + process.platform);
             }
        }

        // extract from workspace-specific storage path
        let userDataDir = ExtensionContext.Instance.storagePath;

        if (!userDataDir) {
            // extract from log path
            userDataDir = ExtensionContext.Instance.logPath;
            let gggparent = path.dirname(path.dirname(path.dirname(path.dirname(userDataDir))));
            userDataDir = path.join(gggparent, 'User', 'Templates', templatesFolderName);
        } else {
            // get parent of parent of parent to remove workspaceStorage/<UID>/<extension>
            // this is done this way to be filesystem agnostic (\ or /)
            let ggparent = path.dirname(path.dirname(path.dirname(userDataDir)));
            // add subfolder 'ProjectTemplates'
            userDataDir = path.join(ggparent, 'Templates', templatesFolderName);
        }

        return userDataDir;
    }

    /**
     * Returns a list of available project templates by reading the Templates Directory.
     * @returns list of templates found
     */
    private static async getTemplateFolderItems(folder?: string): Promise<TemplateFilesystemItem[]> {
        await this.createTemplatesDirIfNotExists();

        const templateDir: string = folder || await this.getTemplatesFolder();
        
        if (!FileSystem.exists(templateDir)) { return; }

        const templates: TemplateFilesystemItem[] = fs.readdirSync(templateDir)
            .map(item => {
                // ignore hidden folders
                if (!/^\./.exec(item)) {
                    const stat = fs.statSync(path.join(templateDir, item));
                    if (stat.isDirectory()) {
                        return new TemplateFilesystemItem(vscode.FileType.Directory, item);
                    } else if (stat.isFile()) {
                        return new TemplateFilesystemItem(vscode.FileType.File, item);
                    }
                }

                return null;
            }).filter(items => {
                return items !== null;
		    }) as TemplateFilesystemItem[];
		
        return templates;
    }

    /**
     * Creates the templates directory if it does not exists
	 * @throws Error
     */
    private static async createTemplatesDirIfNotExists() {
        const templatesDirs = [ await TemplateManager.getTemplatesFolder(true), await TemplateManager.getTemplatesFolder(false) ];
        
        if (templatesDirs && templatesDirs.length > 0) {
            templatesDirs.forEach(templatesDir => {
                if (templatesDir && !fs.existsSync(templatesDir)) {
                    try {
                        FileSystem.makeFolderSync(templatesDir, 0o775);
                        fs.mkdirSync(templatesDir);
                    } catch (err) {
                        if (err.code !== 'EEXIST') {
                            throw err;
                        }
                    }
                }
            });
        }
    }
} // templateManager