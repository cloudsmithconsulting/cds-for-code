import * as path from 'path';
import * as vscode from 'vscode';
import * as cs from '../../cs';
import generateEntities from "../../commands/cs.cds.powerShell.generateEntities";
import createCrmSvcUtilConfig from "../../commands/cs.cds.deployment.createCrmSvcUtilConfig";
import command from '../../core/Command';
import { CdsWebApi } from '../../api/cds-webapi/CdsWebApi';

export default class CodeGenerationManager {
    @command(cs.cds.controls.explorer.generateEntityCodeToFile, "Generate entity code to a file")
    async generateEntityCodeToFile(file?:vscode.Uri) {
        return await vscode.commands.executeCommand(cs.cds.powerShell.generateEntities, undefined, path.dirname(file.fsPath), path.basename(file.fsPath), undefined);
    }

    @command(cs.cds.controls.explorer.generateEntityCodeToFolder, "Generate entity code to a folder")
    async generateEntityCodeToFolder(folder?:vscode.Uri) {
        return await vscode.commands.executeCommand(cs.cds.powerShell.generateEntities, undefined, folder.fsPath, undefined, undefined);
    }

    @command(cs.cds.controls.explorer.createCrmSvcUtilConfig, "Create or edit CrmSvcUtil.exe.config from File Explorer")
    async createCrmSvcUtilConfigToFile(defaultUri?: vscode.Uri) {
        return await vscode.commands.executeCommand(cs.cds.deployment.createCrmSvcUtilConfig, undefined, defaultUri);
    }

    @command(cs.cds.controls.cdsExplorer.createCrmSvcUtilConfig, "Create or edit CrmSvcUtil.exe.config from CDS Explorer")
    async createCrmSvcUtilConfigFromConfig(config?: CdsWebApi.Config) {
        return await vscode.commands.executeCommand(cs.cds.deployment.createCrmSvcUtilConfig, config, undefined);
    }

    @command(cs.cds.powerShell.generateEntities, "Generate entity code using CrmSvcUtil")
    async generateEntities(config?: CdsWebApi.Config, folder?: string, outputFileName?: string, namespace?: string) {
        generateEntities.apply(this, [config, folder, outputFileName, namespace]);
    }

    @command(cs.cds.deployment.createCrmSvcUtilConfig, "Create or edit CrmSvcUtil.exe.config")
    async createCrmSvcUtilConfig(config?: CdsWebApi.Config, file?: vscode.Uri) {
        createCrmSvcUtilConfig.apply(this, [config, file]);
    }

    parseXml(xml: any): any {
        const viewModel = {
            filterRules: [],
            namingRules: [],
            codeGeneration: { namingRules: [] }
        };

        if (!xml.configuration) {
            return;
        }

        const serviceExtensionsElement = xml.configuration?.ServiceExtensions?.length > 0 ? xml.configuration.ServiceExtensions[0] : undefined;
        const filteringElement = serviceExtensionsElement.Filtering?.length > 0 ? serviceExtensionsElement.Filtering[0] : undefined;

        if (filteringElement) {
            [ 'whitelist', 'blacklist '].forEach(list => {
                const listElement = (list === 'whitelist' && filteringElement?.Whitelist?.length > 0) 
                    ? filteringElement?.Whitelist[0]
                    : (list === 'blacklist' && filteringElement?.Blacklist?.length > 0)
                        ? filteringElement?.Blacklist[0] 
                        : undefined;

                if (!listElement) {
                    return;
                }

                // entities
                if (listElement.Entities && listElement.Entities?.length > 0) {
                    listElement.Entities[0]?.add?.forEach(e => {
                        viewModel.filterRules.push({ id: `${list}.entity.exact-match.${e.$.entity}`, listType: list, scope: 'entity', ruleType: 'exact-match', value: e.$.entity });
                    });
                }
    
                // attributes
                if (listElement.Attributes && listElement.Attributes?.length > 0) {
                    listElement.Attributes[0]?.add?.forEach(e => {
                        viewModel.filterRules.push({ id: `${list}.attribute.exact-match.${e.$.entity}.${e.$.attribute}`, listType: list, scope: 'attribute', ruleType: 'exact-match', value: e.$.attribute, options: { entity: e.$.entity || '*' } });
                    });
                } 

                // option sets
                if (listElement.OptionSets && listElement.OptionSets?.length > 0) {
                    listElement.OptionSets[0]?.add?.forEach(e => {
                        viewModel.filterRules.push({ id: `${list}.optionSet.exact-match.${e.$.entity}.${e.$.optionSet}`, listType: list, scope: 'optionSet', ruleType: 'exact-match', value: e.$.optionSet, options: { entity: e.$.entity || '*' } });
                    });
                }

                // solutions
                if (listElement.Solutions && listElement.Solutions?.length > 0) {
                    listElement.Solutions[0]?.add?.forEach(e => {
                        viewModel.filterRules.push({ id: `${list}.solution.exact-match.${e.$.solution}`, listType: list, scope: 'solution', ruleType: 'exact-match', value: e.$.solution });
                    });
                }

                // filters
                if (listElement.Filters && listElement.Filters?.length > 0 ) {
                    listElement.Filters?.forEach(f => {
                        Object.keys(f).forEach(key => {
                            var obj = f[key][0];
    
                            viewModel.filterRules.push({ id: `${list}.${key}.regex.${obj.$.expression}`, listType: list, scope: key, ruleType: 'regex', value: obj.$.expression, options: { ignoreCase: obj.$.ignoreCase, entity: obj.$.entity } });
                        });
                    });
                }
            });
        }

        const namingElement = serviceExtensionsElement?.Naming && serviceExtensionsElement?.Naming?.length > 0 ? serviceExtensionsElement?.Naming[0] : undefined;

        if (namingElement?.MappingRules && namingElement?.MappingRules?.length > 0) {
            namingElement.MappingRules[0]?.add?.forEach(m => {
                viewModel.namingRules.push({ id: `${m.$.type}.${m.$.from}`, scope: m.$.type, ruleType: 'Mapping', oldValue: m.$.from, newValue: m.$.to });
            });
        }

        if (namingElement?.PublisherRules && namingElement?.PublisherRules?.length > 0) {
            namingElement.PublisherRules[0]?.add?.forEach(p => {
                viewModel.namingRules.push({ id: `Publisher.${p.$.name}`, ruleType: 'Publisher', oldValue: p.$.name, newValue: p.$.action && p.$.action === "remove" ? "" : p.$.replacement });
            });
        }

        return viewModel;
    }
}