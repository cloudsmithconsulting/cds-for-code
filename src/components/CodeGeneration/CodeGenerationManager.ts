import * as path from 'path';
import * as vscode from 'vscode';
import * as cs from '../../cs';
import generateEntities from "../../commands/cs.cds.powerShell.generateEntities";
import command from '../../core/Command';
import { CdsWebApi } from '../../api/cds-webapi/CdsWebApi';

export default class CodeGenerationManager {
    @command(cs.cds.controls.explorer.generateEntityCodeToFile, "Generate entity code to a file")
    static async generateEntityCodeToFile(file?:vscode.Uri) {
        return await vscode.commands.executeCommand(cs.cds.powerShell.generateEntities, undefined, path.dirname(file.fsPath), path.basename(file.fsPath), undefined);
    }

    @command(cs.cds.controls.explorer.generateEntityCodeToFolder, "Generate entity code to a folder")
    static async generateEntityCodeToFolder(folder?:vscode.Uri) {
        return await vscode.commands.executeCommand(cs.cds.powerShell.generateEntities, undefined, folder.fsPath, undefined, undefined);
    }

    @command(cs.cds.powerShell.generateEntities, "Generate entity code using CrmSvcUtil")
    static async generateEntities(config?: CdsWebApi.Config, folder?: string, outputFileName?: string, namespace?: string) {
        generateEntities.apply(this, [config, folder, outputFileName, namespace]);
    }
}