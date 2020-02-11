import * as fs from 'fs';
import * as path from 'path';
import * as doT from 'dot';
import * as FileSystem from '../../core/io/FileSystem';
import { TemplateItem, Interactive, TemplateAnalysis, TemplateContext } from "./Types";
import TemplateManager from './TemplateManager';
import Quickly from '../../core/Quickly';
import ExtensionContext from '../../core/ExtensionContext';

export default class TemplateEngine {
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
        varname: '$',
        strip: false,
        append: true,
        selfcontained: false
    };

    static async executeTemplate(template: TemplateItem, outputPath: string, ...object: any): Promise<void> {    
        const analysis = await this.analyzeTemplate(template, outputPath);
        const templateContext = await this.resolveInteractives(analysis);
        templateContext.parameters = Object.assign(templateContext.parameters, ...object);

        for (let i = 0; i < analysis.files.length; i++) {
            const file = analysis.files[i];

            if (file.destination?.length === 0) {
                continue;
            }            

            const destination = file.destination.replace(this.fileNameRegex, (match, key) => {
                return templateContext.parameters[key] || match;
            });

            const fileContents = (file.templateFn)
                ? file.templateFn(templateContext)
                : file.fileContents;

            const parentDir = path.dirname(destination);
            FileSystem.makeFolderSync(parentDir);

            FileSystem.writeFileSync(destination, fileContents);
        }
    }

    public static async analyzeTemplate(template: TemplateItem, outputPath?: string): Promise<TemplateAnalysis> {
        if (outputPath && template.outputPath && !path.isAbsolute(template.outputPath)) {
            outputPath = path.join(outputPath, template.outputPath);
        } else if (template.outputPath && path.isAbsolute(template.outputPath)) {
            outputPath = template.outputPath;
        }

        let templatePath;
        const systemTemplates = await TemplateManager.getDefaultTemplatesFolder(true);
        if (FileSystem.exists(path.join(systemTemplates, template.location))) {
            templatePath = path.join(systemTemplates, template.location);
        } else {
            templatePath = path.join(TemplateManager.getDefaultTemplatesFolder(false), template.location);
        }

        const result = new TemplateAnalysis();
        const interactives: { [name: string]: Interactive } = {};

        const allTemplatePaths = (path.isAbsolute(templatePath) && !FileSystem.stats(templatePath).isDirectory())
            ? [ templatePath ]
            : FileSystem.walkSync(templatePath);

        const templateDefs = {
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
        };

        for (let i = 0; i < allTemplatePaths.length; i++) {
            const source = allTemplatePaths[i];
            const directive = template.directives?.find(d => d.name === path.basename(source));
            const destination =  !source.toLowerCase().endsWith('.def')
                ? source.replace(templatePath, outputPath)
                : '';
            const fileContents = fs.readFileSync(source);
            const templateFn = (!directive || directive.usePlaceholders)
                ? doT.template(fileContents.toString(), this.dotSettings, templateDefs)
                : null;

            let match;
            while (match = this.fileNameRegex.exec(destination)) {
                let key = match[1];
                interactives[key] = interactives[key] || {
                    type: 'prompt',
                    message: `Please supply a value for ${key}`
                };
            }

            result.files.push({
                destination,
                source,
                fileContents,
                templateFn
            });
        }

        result.interactives = interactives;

        return result;
    }

    public static async resolveInteractives(templateAnalysis: TemplateAnalysis): Promise<TemplateContext> {
        const result = new TemplateContext();
        const interactives = templateAnalysis.interactives;
        const templateInputs = Object.keys(interactives);
        const iterator = templateInputs[Symbol.iterator]();
        let item = iterator.next();

        while (!item.done) {
            const key = item.value;
            const interactive = interactives[key];
            switch (interactive.type) {
                case 'prompt': {
                    result.parameters[key] = result.parameters[key] || await Quickly.ask(interactive.message);
                }
                    break;
                case 'select': {
                    result.parameters[key] = result.parameters[key] || await Quickly.pick(interactive.message, ...interactive.items)
                        .then(item => item.label);
                }
                    break;
                case 'confirm': {
                    result.parameters[key] = (result.parameters[key] === undefined)
                        ? await Quickly.pickBoolean(interactive.message, 'Yes', 'No')
                        : result.parameters[key];
                }
                    break;
                case 'cdsConnection': {
                    const config = await Quickly.pickCdsOrganization(ExtensionContext.Instance, interactive.message, true);
                    result.parameters[key] = config;
                }
                    break;
                case 'solution': {
                    let config = interactive.connection ? result[interactive.connection] : undefined;
                    config = config || await Quickly.pickCdsOrganization(ExtensionContext.Instance, `Pick CDS Organization that contains ${key}`, true);
                    result.parameters[key] = result.parameters[key] || await Quickly.pickCdsSolution(config, interactive.message, true);
                }
                    break;
            }
            item = iterator.next();
        }

        return result;
    }
}