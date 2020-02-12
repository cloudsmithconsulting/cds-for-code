import * as vscode from 'vscode';
import * as fs from 'fs';
import * as path from 'path';
import * as doT from 'dot';
import * as cs from '../../cs';
import * as FileSystem from '../../core/io/FileSystem';
import { TemplateItem, Interactive, TemplateAnalysis, TemplateContext, TemplateCommand, TemplateCommandExecutionStage, TemplateType } from "./Types";
import TemplateManager from './TemplateManager';
import Quickly from '../../core/Quickly';
import ExtensionContext from '../../core/ExtensionContext';
import TerminalManager, { TerminalCommand } from '../Terminal/SecureTerminal';
import ExtensionConfiguration from '../../core/ExtensionConfiguration';

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
        varname: '$this',
        strip: false,
        append: true,
        selfcontained: false
    };

    static async executeTemplate(template: TemplateItem, outputPath: string, ...object: any): Promise<TemplateContext> {  
        if (template.type === TemplateType.ItemTemplate && path.extname(outputPath).length === 0) {
            throw Error(`Item templates must have a full file path`);
        }  

        const analysis = await this.analyzeTemplate(template, outputPath);
        const templateContext = await this.buildTemplateContext(analysis);

        if (templateContext.userCanceled) { return templateContext; }

        templateContext.parameters = Object.assign(templateContext.parameters, ...object);
        templateContext.parameters = Object.assign(templateContext.parameters, 
            ExtensionConfiguration.getConfigurationValueOrDefault(cs.cds.configuration.templates.templateParameters, {}));

        await this.executeCommands(templateContext, TemplateCommandExecutionStage.PreRun);

        for (let i = 0; i < analysis.files.length; i++) {
            const file = analysis.files[i];

            if (file.destination?.length === 0) {
                continue;
            }            

            const destination = file.destination.replace(this.fileNameRegex, (match, key) => templateContext.parameters[key] || match);

            templateContext.executionContext.currentFile = {
                source: file.source,
                destination
            };

            const fileContents = (file.templateFn)
                ? file.templateFn(templateContext)
                : file.fileContents;

            const parentDir = path.dirname(destination);
            FileSystem.makeFolderSync(parentDir);

            FileSystem.writeFileSync(destination, fileContents);

            templateContext.executionContext.processedFiles = templateContext.executionContext.processedFiles || [];
            templateContext.executionContext.processedFiles.push({
                source: file.source,
                destination
            });
        }

        await this.executeCommands(templateContext, TemplateCommandExecutionStage.PostRun);

        return templateContext;
    }

    static async analyzeTemplate(template: TemplateItem, outputPath?: string): Promise<TemplateAnalysis> {
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
        const commands: TemplateCommand[] = [];

        const allTemplatePaths = !FileSystem.stats(templatePath).isDirectory()
            ? [ templatePath ]
            : FileSystem.walkSync(templatePath);

        const templateDefs = {
            ui: {
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
                cdsSolution(name: string, message: string, connection: string) {
                    interactives[name] = {
                        type: 'cdsSolution',
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
            },
            run: {
                dotnet(commandArgs: string) {
                    commands.push({
                        type: 'dotnet',
                        commandArgs,
                        stage: TemplateCommandExecutionStage.PostRun
                    });
                    return '';
                },
                npm(commandArgs: string) {
                    commands.push({
                        type: 'npm',
                        commandArgs,
                        stage: TemplateCommandExecutionStage.PostRun
                    });
                    return '';
                },
                powershell(commandArgs: string) {
                    commands.push({
                        type: 'powershell',
                        commandArgs,
                        stage: TemplateCommandExecutionStage.PostRun
                    });
                    return '';
                }
            }
        };

        for (let i = 0; i < allTemplatePaths.length; i++) {
            const source = allTemplatePaths[i];
            const fileContents = fs.readFileSync(source);
            const directive = template.directives?.find(d => d.name === path.basename(source));
            
            const destination = !source.toLowerCase().endsWith('.def')
                ? source.replace(templatePath, outputPath)
                : '';
            
            let templateFn;
            try {
                templateFn = (!directive || directive.usePlaceholders)
                    ? doT.template(fileContents.toString(), this.dotSettings, templateDefs)
                    : null;
            } catch (error) {
                Quickly.error(`Error while trying to parse the template file at ${source}, error message: ${error.message}`);
                throw error;
            }

            let match;
            while (match = this.fileNameRegex.exec(destination)) {
                let key = match[1];
                interactives[key] = interactives[key] || {
                    type: 'prompt',
                    message: `Please enter a file name for ${key}`
                };
            }

            result.files.push({
                destination,
                source,
                fileContents,
                templateFn
            });
        }

        result.sourcePath = templatePath;
        result.outputPath = outputPath;
        result.commands = commands;
        result.interactives = interactives;

        return result;
    }

    private static async executeCommands(templateContext: TemplateContext, stage: TemplateCommandExecutionStage): Promise<void> {
        const commands = templateContext.commands.filter(s => s.stage === stage);
        for (let i = 0; i < commands.length; i++) {
            const command = commands[i];

            const rootPath = FileSystem.stats(templateContext.outputPath).isDirectory()
                ? templateContext.outputPath
                : path.dirname(templateContext.outputPath);
            
            switch (command.type) {
                case 'dotnet': {
                    command.output = await TerminalManager.showTerminal(rootPath)
                        .then(async terminal => { 
                            return await terminal.run(new TerminalCommand(`dotnet ${command.commandArgs}`))
                                .then(async tc => tc.output);                      
                        });
                }
                    break;
                case 'npm': {
                    command.output = await TerminalManager.showTerminal(rootPath)
                        .then(async terminal => { 
                            return await terminal.run(new TerminalCommand(`npm ${command.commandArgs}`))
                                .then(async tc => tc.output);                      
                        });
                }
                    break;
                case 'powershell': {
                    command.output = await TerminalManager.showTerminal(rootPath)
                        .then(async terminal => { 
                            return await terminal.run(new TerminalCommand(`${command.commandArgs}`))
                                .then(async tc => tc.output);                      
                        });
                }
                    break;
            }
        }
    }

    private static async buildTemplateContext(templateAnalysis: TemplateAnalysis): Promise<TemplateContext> {
        const result = new TemplateContext();
        const interactives = templateAnalysis.interactives;
        const templateInputs = Object.keys(interactives);
        const iterator = templateInputs[Symbol.iterator]();
        let item = iterator.next();

        while (!item.done) {
            if (result.userCanceled) { 
                item.done = true;
                continue; 
            }

            const key = item.value;
            const interactive = interactives[key];
            switch (interactive.type) {
                case 'prompt': {
                    result.parameters[key] = result.parameters[key] || await Quickly.ask(interactive.message);
                    if (!result.parameters[key]) { result.userCanceled = true; }
                }
                    break;
                case 'select': {
                    result.parameters[key] = result.parameters[key] || await Quickly.pick(interactive.message, ...interactive.items)
                        .then(item => item.label);
                    if (!result.parameters[key]) { result.userCanceled = true; }
                }
                    break;
                case 'confirm': {
                    result.parameters[key] = (result.parameters[key] === undefined)
                        ? await Quickly.pickBoolean(interactive.message, 'Yes', 'No')
                        : result.parameters[key];
                    if (!result.parameters[key] === undefined) { result.userCanceled = true; }
                }
                    break;
                case 'cdsConnection': {
                    const config = await Quickly.pickCdsOrganization(ExtensionContext.Instance, interactive.message, true);
                    result.parameters[key] = config;
                    if (!result.parameters[key]) { result.userCanceled = true; }
                }
                    break;
                case 'cdsSolution': {
                    let config = interactive.connection ? result[interactive.connection] : undefined;
                    config = config || await Quickly.pickCdsOrganization(ExtensionContext.Instance, `Pick CDS Organization that contains ${key}`, true);
                    result.parameters[key] = result.parameters[key] || await Quickly.pickCdsSolution(config, interactive.message, true);
                    if (!result.parameters[key]) { result.userCanceled = true; }
                }
                    break;
            }
            item = iterator.next();
        }

        result.sourcePath = templateAnalysis.sourcePath;
        result.outputPath = templateAnalysis.outputPath.replace(this.fileNameRegex, (match, key) => result.parameters[key] || match);
        result.commands = templateAnalysis.commands;

        return result;
    }
}