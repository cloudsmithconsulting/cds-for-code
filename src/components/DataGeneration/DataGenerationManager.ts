import * as vscode from 'vscode';
import * as cs from '../../cs';
import createDataMap from "../../commands/cs.cds.data.createDataMap";
import getFaker from "../../commands/cs.cds.data.getFaker";
import insertCsvData from "../../commands/cs.cds.data.insertCsvData";
import insertFakeData from "../../commands/cs.cds.data.insertFakeData";
import command from '../../core/Command';
import { CdsWebApi } from '../../api/cds-webapi/CdsWebApi';

export default class DataGenerationManager {
    @command(cs.cds.data.getFaker, "Get entity generation faker")
    async getFaker(config?: CdsWebApi.Config, entity?: any, selectedAttributes?: string[]) {
        return await getFaker.apply(this, [ config, entity, selectedAttributes ]);
    }

    @command(cs.cds.data.insertFakeData, "Insert fake data into an entity")
    async insertFakeData(config?: CdsWebApi.Config, entity?: any, selectedAttributes?: string[], count: number = 25): Promise<string[]> {
        return await insertFakeData.apply(this, [ config, entity, selectedAttributes, count ]);
    }

    @command(cs.cds.data.insertCsvData, "Insert CSV data into an entity")
    async insertCsvData(config?: CdsWebApi.Config, entity?: any, file?: vscode.Uri) {
        return await insertCsvData.apply(this, [ config, entity, file ]);
    }

    @command(cs.cds.controls.explorer.importCsvToEntity, "Import data from a CSV file into an entity")
    static async importCsvFromFileExplorer(file?: vscode.Uri) {
        return await vscode.commands.executeCommand(cs.cds.data.insertCsvData, undefined, undefined, file);
    }
}