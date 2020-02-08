import * as fs from 'fs';
import * as path from 'path';
import * as doT from 'dot';
import * as FileSystem from '../../core/io/FileSystem';
import { TemplateItem, Interactive, TemplateContext } from "./Types";
import TemplateManager from './TemplateManager';
import Quickly from '../../core/Quickly';
import { CdsWebApi } from '../../api/cds-webapi/CdsWebApi';
import ExtensionContext from '../../core/ExtensionContext';

export default class TemplateResolver {
    private static readonly fileNameRegex = /\$\{([\s\S]+?)\}/g;
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
        selfcontained: false
    };

    static async executeTemplate(template: TemplateItem, outputPath: string): Promise<void> {
        if (outputPath && template.outputPath && !path.isAbsolute(template.outputPath)) {
            outputPath = path.join(outputPath, template.outputPath);
        } else if (template.outputPath && path.isAbsolute(template.outputPath)) {
            outputPath = template.outputPath;
        }

        const templatePath = path.join(await TemplateManager.getTemplatesFolder(false), template.location);
        const interactives: { [name: string]: Interactive } = {};
        // const templateContext: TemplateContext = {
        //     commands: [],
        //     params: {},
        //     context: {}
        // };
        const templateContext = {};    

        const allTemplatePaths = FileSystem.walkSync(templatePath);

        let defIndex = allTemplatePaths.findIndex(p => p.endsWith('.def'));
        while (defIndex >= 0) {
            const source = allTemplatePaths[defIndex];
            const templateFn = await this.resolveTemplateFn(source, interactives, templateContext);

            const op = templateFn(templateContext);
            const obj = JSON.parse(op);

            allTemplatePaths.splice(defIndex);
            defIndex = allTemplatePaths.findIndex(p => p.endsWith('.def'));
        }

        for (let i = 0; i < allTemplatePaths.length; i++) {
            const source = allTemplatePaths[i];
            const directive = template.directives?.find(d => d.name === path.basename(source));
            let dest = source.replace(templatePath, outputPath);

            let match;
            while (match = this.fileNameRegex.exec(dest)) {
                let key = match[1];
                templateContext[key] = templateContext[key] || await Quickly.ask(`Please enter a value for ${key}`);
            }

            if (!directive || (directive.usePlaceholdersInFilename)) {
                dest = dest.replace(this.fileNameRegex, (match, key) => {
                    return templateContext[key] || match;
                });
            }

            const parentDir = path.dirname(dest);
            FileSystem.makeFolderSync(parentDir);

            if (directive && !directive.usePlaceholders) {
                // using fs.readFileSync here, this way we write direct buffer
                FileSystem.writeFileSync(dest, fs.readFileSync(source));
                continue;
            }

            const templateFn = await this.resolveTemplateFn(source, interactives, templateContext);
            const fileContents = templateFn(templateContext);
            FileSystem.writeFileSync(dest, fileContents);
        }
    }

    private static async resolveTemplateFn(sourcePath: string, interactives: { [name: string]: Interactive }, templateContext: any): Promise<doT.RenderFunction> {
        const fileContents = FileSystem.readFileSync(sourcePath);

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
                return '';
            },
            confirm(name: string, message: string) {
                interactives[name] = {
                    type: 'confirm',
                    message
                };
                return '';
            },
            solution(name: string, message: string, connection: string) {
                interactives[name] = {
                    type: 'solution',
                    message: message,
                    connection: connection
                };
                return '';
            },
            cdsConnection(name: string, message: string) {
                interactives[name] = {
                    type: 'cdsConnection',
                    message: message
                };
                return '';
            }
        });

        const templateInputs = Object.keys(interactives);
        const iterator = templateInputs[Symbol.iterator]();
        let item = iterator.next();

        while (!item.done) {
            const key = item.value;
            const interactive = interactives[key];
            switch (interactive.type) {
                case 'prompt': {
                    templateContext[key] = templateContext[key] || await Quickly.ask(interactive.message);
                }
                    break;
                case 'select': {
                    templateContext[key] = templateContext[key] || await Quickly.pick(interactive.message, ...interactive.items)
                        .then(item => item.label);
                }
                    break;
                case 'confirm': {
                    templateContext[key] = (templateContext[key] === undefined)
                        ? await Quickly.pickBoolean(interactive.message, 'Yes', 'No')
                        : templateContext[key];
                }
                    break;
                case 'cdsConnection': {
                    const config = await Quickly.pickCdsOrganization(ExtensionContext.Instance, interactive.message, true);
                    templateContext[key] = config;
                }
                    break;
                case 'solution': {
                    let config = interactive.connection ? templateContext[interactive.connection] : undefined;
                    config = config || await Quickly.pickCdsOrganization(ExtensionContext.Instance, `Pick CDS Organization that contains ${key}`, true);
                    templateContext[key] = templateContext[key] || await Quickly.pickCdsSolution(config, interactive.message, true);
                }
                    break;
            }
            item = iterator.next();
        }

        return templateFn;
    }
}