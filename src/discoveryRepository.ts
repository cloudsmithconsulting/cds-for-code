import * as vscode from 'vscode';
import { DynamicsWebApiClient } from "./DynamicsWebApi/DynamicsWebApi";

export default class DiscoveryRepository
{
    public static wireUpCommands(context: vscode.ExtensionContext) {
        // now wire a command into the context
        context.subscriptions.push(
            vscode.commands.registerCommand('cloudSmith.getOrganizationsCommand', async (options:DynamicsWebApi.Config) => { // Gets a list of organizations in a connection
                const api = new DiscoveryRepository(options);
                
                return await api.retrieveOrganizations();
            })
        );
    }

    private config:DynamicsWebApi.Config;

    public constructor (config:DynamicsWebApi.Config)
    {
        this.config = config;
        this.webapi = new DynamicsWebApiClient(config);
    }

    private webapi: DynamicsWebApiClient;

    public async retrieveOrganizations() : Promise<any> {
        return this.webapi.discover()
            .then(result => result.value);
    }
}