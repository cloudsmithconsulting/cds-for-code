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
    
        xml.configuration?.ServiceExtensions[0]?.Filtering[0]?.Whitelist[0]?.Entities[0]?.add?.forEach(e => {
            viewModel.filterRules.push({ id: `whitelist.entity.exact-match.${e.$.entity}`, listType: 'whitelist', scope: 'entity', ruleType: 'exact-match', value: e.$.entity });
        });

        return viewModel;
    }
}