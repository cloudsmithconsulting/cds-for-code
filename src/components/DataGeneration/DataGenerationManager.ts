import * as cs from '../../cs';
import getFaker from "../../commands/cs.cds.data.getFaker";
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
}