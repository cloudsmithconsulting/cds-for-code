import * as vscode from 'vscode';
import * as _ from 'lodash';
import * as cs from '../../cs';
import { TemplateItem, TemplatePlaceholder } from './Types';
import Dictionary from '../../core/types/Dictionary';
import * as FileSystem from '../../core/io/FileSystem';
import ExtensionConfiguration from '../../core/ExtensionConfiguration';
import { Utilities } from '../../core/Utilities';
import Quickly from '../../core/Quickly';

export default class TemplateEngine {
    //static apply() {}
    //static analyize() {}

    static async applyTemplate(template: TemplateItem, data:string | Buffer, placeholders?: Dictionary<string, string>, object?: any): Promise<string | Buffer> {
        const usePlaceholders = ExtensionConfiguration.getConfigurationValueOrDefault(cs.cds.configuration.templates.usePlaceholders, false);
        const placeholderRegExp = ExtensionConfiguration.getConfigurationValueOrDefault(cs.cds.configuration.templates.placeholderRegExp, "#{([\\s\\S]+?)}");
        placeholders = placeholders || ExtensionConfiguration.getConfigurationValueOrDefault<Dictionary<string, string>>(cs.cds.configuration.templates.placeholders, new Dictionary<string, string>());

        const resolver = (data:string | Buffer, placeholderRegExp:RegExp) => {
            // use custom delimiter #{ }
            _.templateSettings.interpolate = placeholderRegExp;
            // compile the template
            const compiled = _.template(data.toString());

            return compiled(object);
        };

        if (usePlaceholders && placeholderRegExp) {
            const returnValue = await this.resolvePlaceholders(data, placeholderRegExp, placeholders, template, object ? [ resolver ] : undefined);

            return returnValue;
        }
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
    static async resolvePlaceholders(
        data: string | Buffer, 
        placeholderRegExp: string,
        placeholders: Dictionary<string, string>,
        templateInfo: TemplateItem,
        resolvers?:((data:string | Buffer, placeholderRegExp:RegExp, template?:TemplateItem, defaultPlaceholders?:Dictionary<string, string>) => string | Buffer)[]): Promise<string | Buffer> {

        // resolve each placeholder
        const regex = RegExp(placeholderRegExp, 'g');

        placeholders = placeholders || new Dictionary<string, string>();
        resolvers = resolvers || [];

        data = await this.defaultResolver(data, regex, templateInfo, placeholders);

        if (resolvers && resolvers.length > 0) {
            await resolvers.forEach(async resolver => {
                data = await resolver(data, regex, templateInfo, placeholders);
            });
        }

        return data;
    }

    private static async defaultResolver(data:string | Buffer, placeholderRegExp:RegExp, template?:TemplateItem, defaultPlaceholders?:Dictionary<string, string>): Promise<string | Buffer> {
        let encoding: string = "utf8";
        let isBuffer: boolean = false;

        if (Buffer.isBuffer(data)) {
            // get default encoding
            encoding = vscode.workspace.getConfiguration('files').get("files.encoding", "utf8");
            isBuffer = true;

            try {
                data = data.toString(encoding);
            } catch(error) {
                // cannot decipher text from encoding, assume raw data
                return data;
            }
        } else {
            data = data;
        }

        let match;
        let nmatches = 0;
        let placeholders = defaultPlaceholders || new Dictionary<string, string>();

        while (match = placeholderRegExp.exec(<string>data)) {
            let key = match[1];
            let val : string | undefined = placeholders[key];
            let placeholderItem;

            if (template.placeholders && template.placeholders.length > 0) {
                placeholderItem = <TemplatePlaceholder>template.placeholders.find(p => p.name === key);
            }

            let attempts:number = 0;
            let cancel:boolean = false;

            // This parser can't compile object expressions.
            if (key && key.indexOf(".") > -1) {
                continue;
            }

            while ((!val && attempts === 0) || (!val && placeholderItem && placeholderItem.required) || !cancel) {
                if (attempts >= 1) {
                    await Quickly.inform(`The template requires a response for the placeholder '${match[0]}'.`, false, "Try Again", undefined, "Cancel", () => cancel = true);
                    
                    if (cancel) {
                        const error = new Error(`The user has requested to cancel template processing${template ? " for '" + template.name : "'"}`);
                        error.name = cs.cds.errors.userCancelledAction;

                        throw error;
                    }
                }

                val = val || await Quickly.ask(placeholderItem ? placeholderItem.displayName : `Please enter the desired value for "${match[0]}"`)
                    .then(value => { if (value) { placeholders[key] = value; } return value; });

                if (Utilities.$Object.isNullOrEmpty(val)) { val = undefined; }
                if (val) { cancel = true; }

                attempts++;
            }

            ++nmatches;
        }

        // reset regex
        placeholderRegExp.lastIndex = 0;

        // compute output
        let out : string | Buffer = data;
        
        if (nmatches > 0) {
            // replace placeholders in string
            data = data.replace(placeholderRegExp, (match, key) => placeholders[key] || match);

            // if input was a buffer, re-encode to buffer
            if (isBuffer) {
                out = Buffer.from(data, encoding);
            } else {
                out = data;
            }
        }

        return out;
    }

    static getPlaceholders(fsItem: string, placeholderRegExp: string, isFolder:boolean): string[] {
        const returnValue: string[] = [];
        const _getPlaceholders:(data: string | Buffer) => string[] = (data) => {
            // resolve each placeholder
            const regex = RegExp(placeholderRegExp, 'g');
            const returnValue: string[] = [];
    
            // collect set of expressions and their replacements
            let match;
            let str: string;
            let encoding: string = "utf8";
    
            if (Buffer.isBuffer(data)) {
                // get default encoding
                encoding = vscode.workspace.getConfiguration('files').get("files.encoding", "utf8");
    
                try {
                    str = data.toString(encoding);
                } catch(error) {
                    // cannot decipher text from encoding, assume raw data
                    return null;
                }
            } else {
                str = data;
            }
    
            while (match = regex.exec(str)) {
                const key = match[1];
                
                if (returnValue.indexOf(key) === -1) {
                    returnValue.push(key);
                }
            }
    
            return returnValue;
        };

        if (isFolder) {
            const paths = FileSystem.walkSync(fsItem);

            if (paths && paths.length > 0) {
                paths.forEach(p => {
                    const filenamePlaceholders = _getPlaceholders(p);

                    if (filenamePlaceholders && filenamePlaceholders.length > 0) {
                        filenamePlaceholders.forEach(i => { if (returnValue.indexOf(i) === -1) { returnValue.push(i); } });
                    }

                    const projectTemplatePlaceholders = _getPlaceholders(FileSystem.readFileSync(p));

                    if (projectTemplatePlaceholders && projectTemplatePlaceholders.length > 0) {
                        projectTemplatePlaceholders.forEach(i => { if (returnValue.indexOf(i) === -1) { returnValue.push(i); } });
                    }
                });        
            }
        } else {
            const filenamePlaceholders = _getPlaceholders(fsItem);

            if (filenamePlaceholders && filenamePlaceholders.length > 0) {
                filenamePlaceholders.forEach(i => { if (returnValue.indexOf(i) === -1) { returnValue.push(i); } });
            }

            const projectTemplatePlaceholders = _getPlaceholders(FileSystem.readFileSync(fsItem));
            
            if (projectTemplatePlaceholders && projectTemplatePlaceholders.length > 0) {
                projectTemplatePlaceholders.forEach(i => { if (returnValue.indexOf(i) === -1) { returnValue.push(i); } });
            }
        }

        return returnValue;
    }

    static mergePlaceholders(source:TemplatePlaceholder[], merge:TemplatePlaceholder[]) {
        let merged:TemplatePlaceholder[] = [];
        
        if (source) { 
            merged.push(...source);
        }

        if (merge && merge.length > 0) {
            merge.forEach(i => {
                const index = merged.findIndex(m => m.name === i.name);

                if (index === -1) {
                    merged.push(i);
                }
            });
        }

        return merged;
    }
}