import * as _ from 'lodash';
import * as path from 'path';
import * as FileSystem from '../../core/io/FileSystem';
import { TemplateItem } from "./Types";
import TemplateManager from './TemplateManager';
import * as doT from 'dot';
import Quickly from '../../core/Quickly';

export interface Interactive {
    type: string;
    message: string;
    items?: string[];
}

export default class TemplateResolver {
    static readonly filePathRegex = /\${([\s\S]+?)}/g;
    static readonly dotSettings: doT.TemplateSettings = {
        evaluate: /\{\{([\s\S]+?)\}\}\n?/g,
        interpolate: /\{\{=([\s\S]+?)\}\}/g,
        encode: /\{\{!([\s\S]+?)\}\}\n?/g,
        use: /.*?\{\{#([\s\S]+?)\}\}\n?/g,
        useParams: /(^|[^\w$])def(?:\.|\[[\'\"])([\w$\.]+)(?:[\'\"]\])?\s*\:\s*([\w$\.]+|\"[^\"]+\"|\'[^\']+\'|\{[^\}]+\})/g,
        define: /.*?\{\{##\s*([\w\.$]+)\s*(\:|=)([\s\S]+?)#\}\}\n?/g,
        defineParams: /^\s*([\w$]+):([\s\S]+)/,
        conditional: /\{\{\?(\?)?\s*([\s\S]*?)\s*\}\}\n?/g,
        iterate: /\{\{~\s*(?:\}\}|([\s\S]+?)\s*\:\s*([\w$]+)\s*(?:\:\s*([\w$]+))?\s*\}\})\n?/g,
        varname: '$',
        strip: false,
        append: true,
        selfcontained: false,
    };

    static async resolveTokens(template: TemplateItem): Promise<object> {
        const fsPath = path.join(await TemplateManager.getTemplatesFolder(false), template.location);
        const fsTemplatePaths = FileSystem.walkSync(fsPath);

        const templateParams = {};
        const interactives: { [name: string]: Interactive } = {};

        for (let i = 0; i < fsTemplatePaths.length; i++) {
            const filePath = fsTemplatePaths[i];
            let match;
            let canceled = false;

            while (!canceled && (match = this.filePathRegex.exec(filePath))) {
                let key = match[1];
                templateParams[key] = templateParams[key] || await Quickly.ask(`Please enter a value for ${key}`);
                canceled = !templateParams[key];
            }

            // user canceled
            if (canceled) { return undefined; }

            // do any file name replacement
            filePath.replace(this.filePathRegex, (match, key) => {
                return templateParams[key] || match;
            });

            // look at file contents
            const fileContents = FileSystem.readFileSync(filePath);

            doT.template(fileContents, this.dotSettings, {
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
        }

        const variables = Object.keys(interactives);
        const iterator = variables[Symbol.iterator]();
        let item = iterator.next();

        while (!item.done) {
            const key = item.value;
            const interactive = interactives[key];
            switch (interactive.type) {
                case 'select':
                    templateParams[key] = templateParams[key] || await Quickly.pick(interactive.message, ...interactive.items)
                        .then(item => item.label);
                    break;
                case 'prompt':
                    templateParams[key] = templateParams[key] || await Quickly.ask(interactive.message);
                    break;
                case 'confirm':
                    templateParams[key] = templateParams[key] || await Quickly.pickBoolean(interactive.message, 'Yes', 'No');
                    break;
            }
            item = iterator.next();
        }

        return templateParams;
    }

    static async apply(template: TemplateItem, outputPath: string) {
        let templatePath = path.join(await TemplateManager.getTemplatesFolder(false), template.location);
        if (templatePath && template.outputPath && !path.isAbsolute(template.outputPath)) {
            outputPath = path.join(templatePath, template.outputPath);
        } else if (template.outputPath && path.isAbsolute(template.outputPath)) {
            outputPath = template.outputPath;
        }

        const tokens = this.resolveTokens(template);

        const copyInternal = async (source: string, dest): Promise<boolean> => {
            // do any file name replacement
            dest = dest.replace(this.filePathRegex, (match, key) => {
                return tokens[key] || match;
            });

            const isDir = FileSystem.stats(dest).isDirectory();
            if (isDir) {
                if (!FileSystem.exists(dest)) {
                    FileSystem.makeFolderSync(dest);
                }
            } else {

            }

            return true;
        };

        await FileSystem.recurse(templatePath, outputPath, copyInternal);
    }
}