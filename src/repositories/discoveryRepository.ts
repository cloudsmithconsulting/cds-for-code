import * as vscode from 'vscode';
import { DynamicsWebApiClient } from "../api/DynamicsWebApi";

export default class DiscoveryRepository
{
    private config:DynamicsWebApi.Config;

    public constructor (config:DynamicsWebApi.Config)
    {
        this.config = config;
        this.webapi = new DynamicsWebApiClient(this.config);
    }

    private webapi: DynamicsWebApiClient;

    public async retrieveOrganizations() : Promise<any> {
        return this.webapi.discover()
            .then(result => result.value);
    }
}