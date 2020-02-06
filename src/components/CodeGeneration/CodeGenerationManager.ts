import * as path from 'path';
import * as vscode from 'vscode';
import * as cs from '../../cs';
import generateEntities from "../../commands/cs.cds.powerShell.generateEntities";
import createCrmSvcUtilConfig from "../../commands/cs.cds.deployment.createCrmSvcUtilConfig";
import command from '../../core/Command';
import saveCrmSvcUtilConfig from "../../commands/cs.cds.deployment.saveCrmSvcUtilConfig";
import { CdsWebApi } from '../../api/cds-webapi/CdsWebApi';

export default class CodeGenerationManager {
    @command(cs.cds.controls.explorer.generateEntityCodeToFile, "Generate entity code to a file")
    async generateEntityCodeToFile(file?: vscode.Uri) {
        return await vscode.commands.executeCommand(cs.cds.powerShell.generateEntities, undefined, path.dirname(file.fsPath), path.basename(file.fsPath), undefined);
    }

    @command(cs.cds.controls.explorer.generateEntityCodeUsingConfig, "Generate entities using configuration file")
    async generateEntityCodeUsingConfig(configFile?: vscode.Uri) {
        return await vscode.commands.executeCommand(cs.cds.powerShell.generateEntities, undefined, undefined, undefined, undefined, configFile);
    }

    @command(cs.cds.controls.explorer.generateEntityCodeToFolder, "Generate entity code to a folder")
    async generateEntityCodeToFolder(folder?: vscode.Uri) {
        return await vscode.commands.executeCommand(cs.cds.powerShell.generateEntities, undefined, folder.fsPath, undefined, undefined);
    }

    @command(cs.cds.controls.explorer.createCrmSvcUtilConfig, "Create CrmSvcUtil.exe.config from File Explorer")
    async createCrmSvcUtilConfigToFile(defaultUri?: vscode.Uri) {
        return await vscode.commands.executeCommand(cs.cds.deployment.createCrmSvcUtilConfig, undefined, defaultUri);
    }

    @command(cs.cds.controls.explorer.editCrmSvcUtilConfig, "Edit CrmSvcUtil.exe.config from File Explorer")
    async editCrmSvcUtilConfigToFile(defaultUri?: vscode.Uri) {
        return await vscode.commands.executeCommand(cs.cds.deployment.createCrmSvcUtilConfig, undefined, defaultUri);
    }

    @command(cs.cds.controls.cdsExplorer.createCrmSvcUtilConfig, "Create or edit CrmSvcUtil.exe.config from CDS Explorer")
    async createCrmSvcUtilConfigFromConfig(config?: CdsWebApi.Config) {
        return await vscode.commands.executeCommand(cs.cds.deployment.createCrmSvcUtilConfig, config, undefined);
    }

    @command(cs.cds.powerShell.generateEntities, "Generate entity code using CrmSvcUtil")
    async generateEntities(config?: CdsWebApi.Config, folder?: string, outputFileName?: string, namespace?: string, configFile?: vscode.Uri) {
        generateEntities.apply(this, [ config, folder, outputFileName, namespace, configFile ]);
    }

    @command(cs.cds.deployment.createCrmSvcUtilConfig, "Create or edit CrmSvcUtil.exe.config")
    async createCrmSvcUtilConfig(config?: CdsWebApi.Config, file?: vscode.Uri) {
        createCrmSvcUtilConfig.apply(this, [config, file]);
    }

    @command(cs.cds.deployment.saveCrmSvcUtilConfig, "Save CrmSvcUtil.exe.config")
    async saveCrmSvcUtilConfig(config: any, file?: vscode.Uri) {
        saveCrmSvcUtilConfig.apply(this, [config, file]);
    }

    parseXml(xml: any): any {
        const viewModel: any = {
            filterRules: [],
            namingRules: [],
            codeGeneration: { namingRules: [], behaviors: {} }
        };

        if (!xml.configuration) {
            return;
        }

        const serviceExtensionsElement = xml.configuration?.ServiceExtensions?.length > 0 ? xml.configuration.ServiceExtensions[0] : undefined;
        const filteringElement = serviceExtensionsElement.Filtering?.length > 0 ? serviceExtensionsElement.Filtering[0] : undefined;

        if (filteringElement) {
            [ 'whitelist', 'blacklist' ].forEach(list => {
                const listElement = (list === 'whitelist' && filteringElement?.Whitelist?.length > 0) 
                    ? filteringElement?.Whitelist[0]
                    : (list === 'blacklist' && filteringElement?.Blacklist?.length > 0)
                        ? filteringElement?.Blacklist[0] 
                        : undefined;

                if (!listElement) {
                    return;
                }

                // entities
                if (listElement.Entities?.length > 0) {
                    listElement.Entities[0]?.add?.forEach(e => {
                        viewModel.filterRules.push({ id: `${list}.entity.exact-match.${e.$.entity}`, listType: list, scope: 'entity', ruleType: 'exact-match', value: e.$.entity });
                    });
                }
    
                // attributes
                if (listElement.Attributes?.length > 0) {
                    listElement.Attributes[0]?.add?.forEach(e => {
                        viewModel.filterRules.push({ id: `${list}.attribute.exact-match.${e.$.entity}.${e.$.attribute}`, listType: list, scope: 'attribute', ruleType: 'exact-match', value: e.$.attribute, options: { entity: e.$.entity || '*' } });
                    });
                } 

                // option sets
                if (listElement.OptionSets?.length > 0) {
                    listElement.OptionSets[0]?.add?.forEach(e => {
                        viewModel.filterRules.push({ id: `${list}.optionSet.exact-match.${e.$.entity}.${e.$.optionSet}`, listType: list, scope: 'optionSet', ruleType: 'exact-match', value: e.$.optionSet, options: { entity: e.$.entity || '*' } });
                    });
                }

                // solutions
                if (listElement.Solutions?.length > 0) {
                    listElement.Solutions[0]?.add?.forEach(e => {
                        viewModel.filterRules.push({ id: `${list}.solution.exact-match.${e.$.solution}`, listType: list, scope: 'solution', ruleType: 'exact-match', value: e.$.solution });
                    });
                }

                // customizations
                if (listElement.Customizations?.length > 0 && listElement.Customizations[0]?.$?.strategy) {
                    viewModel.filterRules.push({ id: `${list}.customizations`, listType: list, scope: 'customizations', ruleType: 'customizations', value: listElement.Customizations[0].$.strategy });
                }

                // filters
                if (listElement.Filters?.length > 0 ) {
                    listElement.Filters?.forEach(f => {
                        Object.keys(f).forEach(key => {
                            var obj = f[key][0];
    
                            viewModel.filterRules.push({ id: `${list}.${key}.regex.${obj.$.expression}`, listType: list, scope: key, ruleType: 'regex', value: obj.$.expression, options: { ignoreCase: obj.$.ignoreCase, entity: obj.$.entity } });
                        });
                    });
                }
            });
        }

        const namingElement = serviceExtensionsElement?.Naming?.length > 0 ? serviceExtensionsElement?.Naming[0] : undefined;

        if (namingElement?.MappingRules?.length > 0) {
            namingElement.MappingRules[0]?.add?.forEach(m => {
                viewModel.namingRules.push({ id: `${m.$.type}.${m.$.from}`, scope: m.$.type, ruleType: 'Mapping', oldValue: m.$.from, newValue: m.$.to });
            });
        }

        if (namingElement?.PublisherRules?.length > 0) {
            namingElement.PublisherRules[0]?.add?.forEach(p => {
                viewModel.namingRules.push({ id: `Publisher.${p.$.name}`, scope: 'publisher', ruleType: 'Publisher', oldValue: p.$.name, newValue: p.$.action && p.$.action === "remove" ? "" : p.$.replacement });
            });
        }

        const codeGenerationElement = serviceExtensionsElement?.CodeGeneration?.length > 0 ? serviceExtensionsElement?.CodeGeneration[0] : undefined;

        if (codeGenerationElement?.$) {
            viewModel.codeGeneration.path = codeGenerationElement.$.path;
            viewModel.codeGeneration.language = codeGenerationElement.$.language;
        }

        if (codeGenerationElement?.Behaviors?.length > 0) {
            codeGenerationElement.Behaviors[0].add?.forEach(b => {
                switch (b.$?.name.toLowerCase()) {
                    case "translateoptionsetsasenums":
                        viewModel.codeGeneration.behaviors.translateOptionSetsAsEnums = true;
                        break;
                    case "importnamespaces":
                        viewModel.codeGeneration.behaviors.importNamespaces = b.$?.arguments;
                        break;
                }
            });
        }

        if (codeGenerationElement?.Files?.length > 0) {
            codeGenerationElement.Files[0].add?.forEach(f => {
                viewModel.codeGeneration.namingRules.push({ id: `${f.$?.generate}.${f.$?.type}`, strategy: f.$?.generate, fileType: f.$?.type, format: f.$?.filename });
            });
        }

        return viewModel;
    }

    saveConfig(config: any, xml: any): any {
        if (!xml.configuration) {
            return;
        }

        if (!xml.configuration?.ServiceExtensions || (xml.configuration?.ServiceExtensions[0]?.toString().trim() === "")) {
            xml.configuration.ServiceExtensions = [ { } ];
        }

        const serviceExtensionsElement = xml.configuration.ServiceExtensions[0];
        serviceExtensionsElement.Filtering = [ {} ];

        [ 'whitelist', 'blacklist' ].forEach(list => {
            if (list === 'whitelist' && !serviceExtensionsElement.Filtering[0].Whitelist) {
                serviceExtensionsElement.Filtering[0].Whitelist = [ { $: { filter: config.filterOptions.whitelistMode } } ];
            }

            if (list === 'blacklist' && !serviceExtensionsElement.Filtering[0].Blacklist) {
                serviceExtensionsElement.Filtering[0].Blacklist = [ {} ];
            }

            const listRules = config.filterRules?.filter(r => r.listType === list);
            const listElement = list === 'whitelist' ? serviceExtensionsElement.Filtering[0].Whitelist[0] : serviceExtensionsElement.Filtering[0].Blacklist[0];
            
            if (listRules?.length > 0) {
                listRules.forEach(r => {
                    if (r.ruleType === 'exact-match' || r.ruleType === 'customizations') {
                        switch (r.scope) {
                            case "entity":
                                if (!listElement.Entities) {
                                    listElement.Entities = [ { add: [] } ];
                                }

                                listElement.Entities[0].add.push({ $: { entity: r.value } });
                                break;
                            case "attribute":
                                if (!listElement.Attributes) {
                                    listElement.Attributes = [ { add: [] } ];
                                }

                                listElement.Attributes[0].add.push({ $: { entity: r.options ? r.options.entity : '*', attribute: r.value } });
                                break;
                            case "optionSet":
                                if (!listElement.OptionSets) {
                                    listElement.OptionSets = [ { add: [] } ];
                                }

                                listElement.OptionSets[0].add.push({ $: { entity: r.options ? r.options.entity : '*', optionSet: r.value } });
                                break;
                            case "solution":
                                if (!listElement.Solutions) {
                                    listElement.Solutions = [ { add: [] } ];
                                }

                                listElement.Solutions[0].add.push({ $: { solution: r.value } });
                                break;
                            case "customizations":
                                if (!listElement.Customizations) {
                                    listElement.Customizations = [ { $: {} } ];
                                }

                                listElement.Customizations[0].$.strategy = r.value;                                
                                break;
                        }
                    } else if (r.ruleType === 'regex') {
                        if (!listElement.Filters) {
                            listElement.Filters = [ { } ];
                        }

                        const itemType = r.scope.toLowerCase();

                        if (!listElement.Filters[0][itemType]) {
                            listElement.Filters[0][itemType] = [ ];
                        }

                        const newItem: any = {
                            $: { expression: r.value, ignoreCase: r.options && r.options.ignoreCase ? "true" : "false" }
                        };

                        if (r.options && r.options.entity) {
                            newItem.$.entity = r.options.enitty;
                        }

                        listElement.Filters[0][itemType].push(newItem);
                    }
                });
            }
        });

        serviceExtensionsElement.Naming = [ {} ];

        config.namingRules?.filter(r => r.ruleType === "Mapping").forEach(r => {
            if (!serviceExtensionsElement.Naming[0].MappingRules) {
                serviceExtensionsElement.Naming[0].MappingRules = [ { add: [] } ];
            }

            serviceExtensionsElement.Naming[0].MappingRules[0].add.push({
                $: { type: r.scope, from: r.oldValue, to: r.newValue }
            });
        });

        config.namingRules?.filter(r => r.ruleType === "Publisher").forEach(r => {
            if (!serviceExtensionsElement.Naming[0].PublisherRules) {
                serviceExtensionsElement.Naming[0].PublisherRules = [ { add: [] } ];
            }

            const newPublisherRule: any = {
                $: { name: r.oldValue, action: r.newValue === "" ? "remove" : "replace" }
            };

            if (r.replacement) {
                newPublisherRule.$.replacement = r.replacement;
            }

            serviceExtensionsElement.Naming[0].PublisherRules[0].add.push(newPublisherRule);
        });

        serviceExtensionsElement.CodeGeneration = [ { $: {
            path: config.codeGeneration?.path, 
            language: config.codeGeneration?.language 
        } } ];

        if (config.codeGeneration?.behaviors) {
            if (!serviceExtensionsElement.CodeGeneration[0].Behaviors) {
                serviceExtensionsElement.CodeGeneration[0].Behaviors = [ { add: [] } ];
            }

            Object.keys(config.codeGeneration.behaviors).forEach(k => {
                serviceExtensionsElement.CodeGeneration[0].Behaviors[0].add.push({ $: { name: k, arguments: config.codeGeneration.behaviors[k].toString() } });
            });
        }

        config.codeGeneration?.namingRules?.forEach(r => {
            if (!serviceExtensionsElement.CodeGeneration[0].Files) {
                serviceExtensionsElement.CodeGeneration[0].Files = [ { add: [] } ];
            }

            serviceExtensionsElement.CodeGeneration[0].Files[0].add.push({
                $: { generate: r.strategy, type: r.fileType, filename: r.format }
            });
        });

        return xml;
    }
}