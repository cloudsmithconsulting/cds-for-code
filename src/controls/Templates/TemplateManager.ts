import * as vscode from 'vscode';
import * as cs from '../../cs';
import * as fs from 'fs';
import * as path from 'path';
import * as os from 'os';
import * as FileSystem from '../../helpers/FileSystem';
import * as EnvironmentVariables from '../../helpers/EnvironmentVariables';
import ExtensionConfiguration from '../../config/ExtensionConfiguration';
import IWireUpCommands from '../../wireUpCommand';

import CreateProjectFromTemplateCommand from '../../commands/createProjectFromTemplate';
import DeleteProjectTemplateCommand from '../../commands/deleteProjectTemplate';
import OpenProjectTemplatesFolderCommand from '../../commands/openProjectTemplatesFolder';
import SaveProjectAsTemplateCommand from '../../commands/saveProjectTemplate';
import { TS } from 'typescript-linq/TS';
import QuickPicker from '../../helpers/QuickPicker';
import Dictionary from '../../helpers/Dictionary';

/**
 * Main class to handle the logic of the Project Templates
 * @export
 * @class TemplateManager
 */
export default class TemplateManager implements IWireUpCommands {
    /**
     * local copy of workspace configuration to maintain consistency between calls
     */
    private static context: vscode.ExtensionContext;

    constructor(context: vscode.ExtensionContext) {
        TemplateManager.context = context;
        TemplateManager.createTemplatesDirIfNotExists();
    }

    wireUpCommands(context: vscode.ExtensionContext, config: vscode.WorkspaceConfiguration) {
        // now wire a command into the context
        context.subscriptions.push(
            vscode.commands.registerCommand(cs.dynamics.extension.createProjectFromTemplate, CreateProjectFromTemplateCommand.bind(undefined, this)),
            vscode.commands.registerCommand(cs.dynamics.extension.deleteProjectTemplate, DeleteProjectTemplateCommand.bind(undefined, this)),
            vscode.commands.registerCommand(cs.dynamics.extension.openProjectTemplatesFolder, OpenProjectTemplatesFolderCommand.bind(undefined, this)),
            vscode.commands.registerCommand(cs.dynamics.extension.saveProjectAsTemplate, SaveProjectAsTemplateCommand.bind(undefined, this)),
        );
    }

    getTemplates(): Promise<TemplateItem[]> {
        return TemplateManager.getTemplateCatalog().then(c => c.items);
    }
    
    async openTemplateFolderInExplorer(): Promise<void> {
        FileSystem.openFolderInExplorer(await TemplateManager.getTemplatesFolder());
    }
    
    static async getTemplateCatalog(filename?:string): Promise<TemplateCatalog> {
        const templatesDir = await TemplateManager.getDefaultTemplatesDir();
        if (!filename) { filename = path.join(templatesDir, "catalog.json"); }

        if (filename && FileSystem.Exists(filename)) {
            return TemplateCatalog.read(filename);
        } else {
            const catalog = new TemplateCatalog();

            // Load the catalog with all items by default.
            await this.getTemplateFolderItems().then(items => {
                items.forEach(i => {
                    if (path.basename(i.name) !== path.basename(filename)) {
                        const templateItem = new TemplateItem(); 
    
                        templateItem.name = i.name;
                        templateItem.type = i.type === vscode.FileType.Directory ? TemplateType.ProjectTemplate : TemplateType.ItemTemplate;
                        templateItem.location = i.name;
                        
                        catalog.add(templateItem);
                    }
                });
            });

            catalog.save(filename);

            return catalog;
        }
    }

    /**
     * Returns the templates directory location.
     * If no user configuration is found, the extension will look for
     * templates in USER_DATA_DIR/Code/Templates.
     * Otherwise it will look for the path defined in the extension configuration.
     * @return the templates directory
     */
    static async getTemplatesFolder(): Promise<string> {
        let dir:string = ExtensionConfiguration.getConfigurationValue(cs.dynamics.configuration.templates.templatesDirectory);

        if (!dir) {
            dir = path.normalize(TemplateManager.getDefaultTemplatesDir());

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
    static getDefaultTemplatesDir(): string {
        if (!TemplateManager.context) {
            // no workspace, default to OS-specific hard-coded path
             switch (process.platform) {
                 case 'linux':
                     return path.join(os.homedir(), '.config', 'Code-Templates');
                 case 'darwin':
                     return path.join(os.homedir(), 'Library', 'Application Support', 'Code-Templates');
                 case 'win32':
                     return path.join(process.env.APPDATA!, "CloudSmith", "Code-Templates");
                 default:
                     throw Error("Unrecognized operating system: " + process.platform);
             }
        }

        // extract from workspace-specific storage path
        let userDataDir = TemplateManager.context.storagePath;

        if (!userDataDir) {
            // extract from log path
            userDataDir = TemplateManager.context.logPath;
            let gggparent = path.dirname(path.dirname(path.dirname(path.dirname(userDataDir))));
            userDataDir = path.join(gggparent, 'User', 'Templates');
        } else {
            // get parent of parent of parent to remove workspaceStorage/<UID>/<extension>
            // this is done this way to be filesystem agnostic (\ or /)
            let ggparent = path.dirname(path.dirname(path.dirname(userDataDir)));
            // add subfolder 'ProjectTemplates'
            userDataDir = path.join(ggparent, 'Templates');
        }

        return userDataDir;
    }

    /**
     * Returns a list of available project templates by reading the Templates Directory.
     * @returns list of templates found
     */
    private static async getTemplateFolderItems(): Promise<TemplateFilesystemItem[]> {
        await this.createTemplatesDirIfNotExists();

		const templateDir: string = await this.getTemplatesFolder();
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
		let templatesDir = await TemplateManager.getTemplatesFolder();
		
		if (templatesDir && !fs.existsSync(templatesDir)) {
			try {
                FileSystem.MakeFolderSync(templatesDir, 0o775);
				fs.mkdirSync(templatesDir);
			} catch (err) {
				if (err.code !== 'EEXIST') {
					throw err;
				}
			}
		}
    }

    /**
     * Deletes a template from the template root directory
     * @param template name of template
     * @returns success or failure
     */
    async deleteFromFilesystem(template: string) {
        // no template, cancel
        if (!template) {
            return false;
        }
            
        let templateRoot = await TemplateManager.getTemplatesFolder();
        let templateDir : string = path.join(templateRoot, template);

        if (fs.existsSync(templateDir) && fs.lstatSync(templateDir).isDirectory()) {
            QuickPicker.pickBoolean(`Are you sure you want to delete the project template '${template}'?`, "Yes", "No")
                .then(async (choice) => choice ? await FileSystem.DeleteFolder(templateDir) : false);

            return true;
        }

        return false;
    }

    /**
     * Saves a workspace as a new template
     * @param  folder absolute path of workspace
     * @returns  name of template
     */
    async saveToFilesystem(folder: string) {
        // ensure templates directory exists
        await TemplateManager.createTemplatesDirIfNotExists();

        let projectName = path.basename(folder);

        // prompt user
        return await QuickPicker.ask("Enter the desired template name", undefined, projectName)
            .then(async folder => {
                // empty filename exits
                if (!folder) {
                    return undefined;
                }

                // determine template dir
                let template = path.basename(folder);
                let templateDir = path.join(await TemplateManager.getTemplatesFolder(), template);
    
                // check if exists
                if (fs.existsSync(templateDir)) {
                    await QuickPicker.pickBoolean(`Template '${template}' aleady exists.  Do you wish to overwrite?`, "Yes", "No")
                        .then(async choice => { 
                            if (choice) { 
                                await FileSystem.DeleteFolder(templateDir); 
                                await FileSystem.CopyFolder(folder, templateDir); 
                            }
                        });
                } else {
                    // copy current workspace to new template folder
                    await FileSystem.CopyFolder(folder, templateDir);
                }

                return template;
            }
        );
    }

    /**
     * Populates a workspace folder with the contents of a template
     * @param folder current workspace folder to populate
     */
    async createFromFilesystem(folder: string) {
        await TemplateManager.createTemplatesDirIfNotExists();

        // choose a template
        let template = await QuickPicker.pickTemplate("Choose a template that you would like to create.");

        if (!template) {
            return;
        }

        // get template folder
        let templateDir = template.location;

        if (!fs.existsSync(templateDir) || !fs.lstatSync(templateDir).isDirectory()) {
            QuickPicker.error(`Cannot extract this template as ${templateDir} is not a valid path.`);

            return undefined;
        }

        // update placeholder configuration
        const usePlaceholders = ExtensionConfiguration.getConfigurationValueOrDefault(cs.dynamics.configuration.templates.usePlaceholders, false);
        const placeholderRegExp = ExtensionConfiguration.getConfigurationValueOrDefault(cs.dynamics.configuration.templates.placeholderRegExp, "#{([\\s\\S]+?)}");
        const placeholders = ExtensionConfiguration.getConfigurationValueOrDefault<Dictionary<string, string>>(cs.dynamics.configuration.templates.placeholders, new Dictionary<string, string>());

        // recursively copy files, replacing placeholders as necessary
		const copyInternal = async (source: string, destination: string) => {
            // maybe replace placeholders in filename
            if (usePlaceholders) {
                destination = await this.resolvePlaceholders(destination, placeholderRegExp, placeholders, template) as string;
            }

			if (fs.lstatSync(source).isDirectory()) {
                // create directory if doesn't exist
				if (!fs.existsSync(destination)) {
					fs.mkdirSync(destination);
				} else if (!fs.lstatSync(destination).isDirectory()) {
                    // fail if file exists
					throw new Error(`Failed to create directory "${destination}": A file with same name exists.`);
				}
            } else {
                // ask before overwriting existing file
                while (fs.existsSync(destination)) {
                    // if it is not a file, cannot overwrite
                    if (!fs.lstatSync(destination).isFile()) {
                        let reldest = path.relative(folder, destination);
       
                        // get user's input
                        destination = await QuickPicker.ask(`Cannot overwrite "${reldest}".  Please enter a new filename"`, undefined, reldest)
                            .then(value => value ? value : destination);

                        // if not absolute path, make workspace-relative
                        if (!path.isAbsolute(destination)) {
                            destination = path.join(folder, destination);
                        }
                    } else {
                        // ask if user wants to replace, otherwise prompt for new filename
                        let reldest = path.relative(folder, destination);

                        switch((await QuickPicker.pick(`Destination file "${reldest}" already exists.  What would you like to do?`, "Overwrite", "Rename", "Skip", "Abort")).label) {
                            case "Overwrite":
                                // delete existing file
                                fs.unlinkSync(destination);

                                break;
                            case "Rename":
                                // get user's input
                                destination = await QuickPicker
                                    .ask("Please enter a new filename", undefined, reldest)
                                    .then(value => value ? value : destination);

                                // if not absolute path, make workspace-relative
                                if (!path.isAbsolute(destination)) {
                                    destination = path.join(folder, destination);
                                }

                                break;
                            case "Skip":
                                // skip
                                return true;
                            default:
                                // abort
                                return false;
                        }
                    }  // if file
                } // while file exists

                // get src file contents
                let fileContents : Buffer = fs.readFileSync(source);
                if (usePlaceholders) {
                    fileContents = await this.resolvePlaceholders(fileContents, placeholderRegExp, placeholders, template) as Buffer;
                }

                // ensure directories exist
                let parent = path.dirname(destination);
                FileSystem.MakeFolderSync(parent);

                // write file contents to destination
                fs.writeFileSync(destination, fileContents);
            }

            return true;
        };  // copy function
        
        // actually copy the file recursively
        await FileSystem.Recurse(templateDir, folder, copyInternal);    
        
        return template;
    }

        /**
     * Replaces any placeholders found within the input data.  Will use a 
     * dictionary of values from the user's workspace settings, or will prompt
     * if value is not known.
     * 
     * @param data input data
     * @param placeholderRegExp  regular expression to use for detecting 
     *                           placeholders.  The first capture group is used
     *                           as the key.
     * @param placeholders dictionary of placeholder key-value pairs
     * @returns the (potentially) modified data, with the same type as the input data 
     */
    private async resolvePlaceholders(
        data: string | Buffer, 
        placeholderRegExp: string,
        placeholders: Dictionary<string, string>,
        templateInfo: TemplateItem): Promise<string | Buffer> {

        // resolve each placeholder
        const regex = RegExp(placeholderRegExp, 'g');

        // collect set of expressions and their replacements
        let match;
        let nmatches = 0;
        let str : string;
        let encoding : string = "utf8";

        if (Buffer.isBuffer(data)) {
            // get default encoding
            let fconfig = vscode.workspace.getConfiguration('files');
            encoding = fconfig.get("files.encoding", "utf8");

            try {
                str = data.toString(encoding);
            } catch(Err) {
                // cannot decipher text from encoding, assume raw data
                return data;
            }
        } else {
            str = data;
        }

        while (match = regex.exec(str)) {
            let key = match[1];
            let val : string | undefined = placeholders[key];

            val = val || await QuickPicker.ask(templateInfo.placeholder(match[0]) ? templateInfo.placeholder(match[0]).displayName : `Please enter the desired value for "${match[0]}"`)
                .then(value => { if (value) { placeholders[key] = value; } return value; });

            ++nmatches;
        }

        // reset regex
        regex.lastIndex = 0;

        // compute output
        let out : string | Buffer = data;
        
        if (nmatches > 0) {
            // replace placeholders in string
            str = str.replace(regex, (match, key) => placeholders[key] || match);

            // if input was a buffer, re-encode to buffer
            if (Buffer.isBuffer(data)) {
                out = Buffer.from(str, encoding);
            } else {
                out = str;
            }
        }

        return out;
    }
} // templateManager

export class TemplateCatalog {
    constructor(catalog?:TemplateCatalog) {
        if (catalog) { this.items = catalog.items; } else { this.items = []; }
    }

    static from(catalog:TemplateCatalog): TemplateCatalog {
        return new TemplateCatalog(catalog);
    }

    items: TemplateItem[];

    add(item:TemplateItem): TemplateCatalog {
        this.items.push(item);

        return this;
    }

    remove(item:TemplateItem): TemplateCatalog {
        this.items.slice(this.items.indexOf(item, 0), 1);

        return this;
    }

    query(query:(queryable:TS.Linq.Enumerator<TemplateItem>) => TS.Linq.Enumerator<TemplateItem>):TemplateItem[] {
        return query(new TS.Linq.Enumerator(this.items)).toArray();
    }

    async load(filename?:string): Promise<TemplateCatalog> {
        return (TemplateCatalog.read(filename).then(catalog => TemplateCatalog.from(catalog)));
    }

    async save(filename?:string): Promise<TemplateCatalog> {
        return TemplateCatalog.write(this, filename);
    }

    static async read(filename:string = "catalog.json"): Promise<TemplateCatalog> {
        const file = path.join(await TemplateManager.getTemplatesFolder(), filename);

        if (FileSystem.Exists(file)) {
            try {
                let returnObject = JSON.parse(FileSystem.ReadFileSync(file));

                if (returnObject && returnObject instanceof TemplateCatalog) {
                    return <TemplateCatalog>returnObject;
                }
            } catch (error) {
                vscode.window.showErrorMessage(`The template catalog '${filename}' was found but could not be parsed.  A new file will be created.${error ? '  The error returned was: ' + error : ''}`);
            }
        }

        return new TemplateCatalog();
    }

    static async write(catalog:TemplateCatalog, filename:string = "catalog.json"): Promise<TemplateCatalog> {
        const folder = path.join(await TemplateManager.getTemplatesFolder(), path.dirname(filename));

        if (!FileSystem.Exists(folder)) {
            FileSystem.MakeFolderSync(folder);
        }

        const file = path.join(folder, filename);

        try {
            FileSystem.WriteFileSync(file, JSON.stringify(catalog));
        } catch (error) {
            vscode.window.showErrorMessage(`The template catalog '${filename}' could not be saved to the templates folder.${error ? '  The error returned was: ' + error : ''}`);
        }

        return catalog;
    }
}

class TemplateFilesystemItem {
    constructor(
        public type: vscode.FileType,
        public name: string
    ) { }
}

export enum TemplateType {
    ProjectTemplate = "Project Template",
    ItemTemplate = "Item Template"
}

export class TemplateItem {
    type: TemplateType;
    name: string;
    displayName: string;
    description: string;
    publisher: string;
    location: string;
    categories: string[];
    placeholders: TemplatePlaceholder[] = [];

    placeholder(name:string): TemplatePlaceholder {
        if (this.placeholders && this.placeholders.length > 0) {
            return this.placeholders.find(i => i.name === name);
        }

        return null;
    }
}

export class TemplatePlaceholder {
    constructor(name?:string) {
        if (name) { this.name = name; }
    }

    name: string;
    displayName: string;
    type: string;
}
