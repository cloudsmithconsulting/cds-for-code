import * as vscode from 'vscode';
import { DynamicsWebApi } from "./DynamicsWebApi/DynamicsWebApi";
import dynamicsDiscovery, { DynamicsDiscovery } from "./Dynamics/DynamicsDiscovery";
import { AuthenticationType } from '../out/Dynamics/DynamicsRequest';
import { ConnectionOptions } from '../out/DynamicsWebApi/WebApiRequest';

export default class DiscoveryRepository
{
    public static wireUpCommands(context: vscode.ExtensionContext) {
        // now wire a command into the context
        context.subscriptions.push(
            vscode.commands.registerCommand('cloudSmith.getOrganizationsCommand', () => { // Gets a list of organizations in a connection
                //TODO: fix this to take an actual connection parameter.
                const options:DynamicsWebApi.Config = {
                    domain: "CONTOSO",
                    username: "Administrator",
                    password: "p@ssw0rd1",
                    webApiUrl: "http://win-oi4mlu9323r/",       // Server name only here.
                    webApiVersion: "9.0",
                };

                const api = new DiscoveryRepository(options);
                
                return api.retrieveOrganizations();
            })
        );
    }

    private config:DynamicsWebApi.Config;

    public constructor (config:DynamicsWebApi.Config)
    {
        this.config = config;
        this.webapi = new DynamicsWebApi(config);
    }

    private webapi: DynamicsWebApi;

    public async retrieveOrganizations() : Promise<any> {
        const options:ConnectionOptions = {
            authType: AuthenticationType.Windows,
            username: this.config.username,
            password: this.config.password,
            domain: this.config.domain,
            webApiVersion: "v8.0",
            serverUrl: this.config.webApiUrl
        };

        let discovery = dynamicsDiscovery(options);
        let results = await discovery.discover();

        return this.webapi.discover();
    }
}