import { CdsWebApi } from './cds-webapi/CdsWebApi';

export default abstract class CdsRepository {
    constructor (config: CdsWebApi.Config) {
        this.webapi = new CdsWebApi.WebApiClient(config);
    }

    protected readonly webapi: CdsWebApi.WebApiClient;

    get config(): CdsWebApi.Config {
        return this.webapi ? this.webapi.config : null;
    }
}