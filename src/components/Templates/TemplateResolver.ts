import * as _ from 'lodash';
import * as path from 'path';
import * as FileSystem from '../../core/io/FileSystem';
import { TemplateItem, Interactive } from "./Types";
import TemplateManager from './TemplateManager';
import * as doT from 'dot';
import Quickly from '../../core/Quickly';

export default class TemplateResolver {
    private static readonly filePathRegex = /\${([\s\S]+?)}/g;
    private static readonly dotSettings: doT.TemplateSettings = {
        evaluate: /\{\{([\s\S]+?)\}\}\n?/g,
        interpolate: /\{\{=([\s\S]+?)\}\}/g,
        encode: /\{\{!([\s\S]+?)\}\}\n?/g,
        use: /.*?\{\{#([\s\S]+?)\}\}\n?/g,
        useParams: /(^|[^\w$])def(?:\.|\[[\'\"])([\w$\.]+)(?:[\'\"]\])?\s*\:\s*([\w$\.]+|\"[^\"]+\"|\'[^\']+\'|\{[^\}]+\})/g,
        define: /.*?\{\{##\s*([\w\.$]+)\s*(\:|=)([\s\S]+?)#\}\}\n?/g,
        defineParams: /^\s*([\w$]+):([\s\S]+)/,
        conditional: /\{\{\?(\?)?\s*([\s\S]*?)\s*\}\}\n?/g,
        iterate: /\{\{~\s*(?:\}\}|([\s\S]+?)\s*\:\s*([\w$]+)\s*(?:\:\s*([\w$]+))?\s*\}\})\n?/g,
        varname: 'context',
        strip: false,
        append: true,
        selfcontained: false,
    };

    static async executeTemplate(template: TemplateItem, outputPath: string): Promise<void> {
        if (outputPath && template.outputPath && !path.isAbsolute(template.outputPath)) {
            outputPath = path.join(outputPath, template.outputPath);
        } else if (template.outputPath && path.isAbsolute(template.outputPath)) {
            outputPath = template.outputPath;
        }

        const templatePath = path.join(await TemplateManager.getTemplatesFolder(false), template.location);
        const templateContext = {};
        const interactives: { [name: string]: Interactive } = {};

        const copyInternal = async (source: string, dest): Promise<boolean> => {
            let match;
            while (match = this.filePathRegex.exec(dest)) {
                let key = match[1];
                templateContext[key] = templateContext[key] || await Quickly.ask(`Please enter a value for ${key}`);
            }

            // do any file name replacement
            dest = dest.replace(this.filePathRegex, (match, key) => {
                return templateContext[key] || match;
            });

            const isDir = FileSystem.stats(source).isDirectory();
            if (isDir) {
                if (!FileSystem.exists(dest)) {
                    FileSystem.makeFolderSync(dest);
                }
            } else {
                let fileContents = FileSystem.readFileSync(source);

                const templateFn = doT.template(fileContents, this.dotSettings, {
                    prompt(name: string, message: string) {
                        interactives[name] = {
                            type: 'prompt',
                            message
                        };
                        return '';
                    },
                    select(name: string, message: string, items: string[]) {
                        interactives[name] = {
                            type: 'select',
                            message,
                            items
                        };
                    },
                    confirm(name: string, message: string) {
                        interactives[name] = {
                            type: 'confirm',
                            message
                        };
                    }
                });
    
                const variables = Object.keys(interactives);
                const iterator = variables[Symbol.iterator]();
                let item = iterator.next();
    
                while (!item.done) {
                    const key = item.value;
                    const interactive = interactives[key];
                    switch (interactive.type) {
                        case 'select':
                            templateContext[key] = templateContext[key] || await Quickly.pick(interactive.message, ...interactive.items)
                                .then(item => item.label);
                            break;
                        case 'prompt':
                            templateContext[key] = templateContext[key] || await Quickly.ask(interactive.message);
                            break;
                        case 'confirm':
                            templateContext[key] = templateContext[key] || await Quickly.pickBoolean(interactive.message, 'Yes', 'No');
                            break;
                    }
                    item = iterator.next();
                }

                fileContents = templateFn(templateContext);
                FileSystem.writeFileSync(dest, fileContents);
            }

            return true;
        };

        await FileSystem.recurse(templatePath, outputPath, copyInternal);
    }
}