import * as vscode from 'vscode';
import { ConnectionOptions, AuthenticationType } from './Dynamics/DynamicsRequest';
import { Dynamics } from './Dynamics/Dynamics';
import { QueryOperator } from './Query/Query';
import dynamicsDiscovery, { DynamicsDiscovery, OrganizationMetadata } from './Dynamics/DynamicsDiscovery';

export default class DiscoveryRepository
{
    public static wireUpCommands(context: vscode.ExtensionContext) {
        // now wire a command into the context
        context.subscriptions.push(
            vscode.commands.registerCommand('cloudSmith.getOrganizationsCommand', () => { // Gets a list of organizations in a connection
                //TODO: fix this to take an actual connection parameter.
                const options = new ConnectionOptions();

                options.authType = AuthenticationType.Windows;
                options.domain = "CONTOSO";
                options.username = "Administrator";
                options.password = "p@ssw0rd1";
                options.serverUrl = "http://win-a6ljo0slrsh/";
                options.webApiVersion = "v8.2";         // Defaults to latest.

                const api = new DiscoveryRepository(options);
                
                return api.retrieveOrganizations();
            })
        );
    }

    private options:ConnectionOptions;

    public constructor (connectionOptions:ConnectionOptions)
    {
        this.options = connectionOptions;
        this.webapi = dynamicsDiscovery(connectionOptions); 
    }

    private webapi: DynamicsDiscovery;

    public retrieveOrganizations() : Promise<OrganizationMetadata[]> {
        let q = this.webapi.discover();

        return q;
    }
}