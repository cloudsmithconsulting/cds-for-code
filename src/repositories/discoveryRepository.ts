import * as vscode from 'vscode';
import { DynamicsWebApiClient } from "../api/DynamicsWebApi";
import { Utilities } from '../helpers/Utilities';
import * as cs from '../cs';
import { connect } from 'http2';

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

    public static getConnections(context: vscode.ExtensionContext):DynamicsWebApi.Config[]
    {
        const connections: DynamicsWebApi.Config[] | undefined = context.globalState.get(cs.dynamics.configuration.explorer.connectionsGlobalStateKey);

        return connections;
    }

    public static async getOrgConnections(context: vscode.ExtensionContext):Promise<DynamicsWebApi.Config[]>
    {        
        const returnObject:DynamicsWebApi.Config[] = [];
        const connections = this.getConnections(context);

        if (connections)
        {
            for (var i = 0; i < connections.length; i++)
            {
                const api = new DiscoveryRepository(connections[i]);

                var orgs = await api.retrieveOrganizations();

                for (var j = 0; j < orgs.length; j++)
                {
                    returnObject.push(this.createOrganizationConnection(orgs[j], connections[i]));
                }
            }
        }

        return returnObject;
    }

    public static saveConnections(context: vscode.ExtensionContext, connections:DynamicsWebApi.Config[]): void
    {
        context.globalState.update(cs.dynamics.configuration.explorer.connectionsGlobalStateKey, connections);
    }

    public static createOrganizationConnection(org: any, connection: DynamicsWebApi.Config):DynamicsWebApi.Config {
        const versionSplit = org.Version.split('.');
        // Clone the current connection and override the endpoint and version.
        const orgConnection = Utilities.Clone<DynamicsWebApi.Config>(connection);

        orgConnection.webApiUrl = org.ApiUrl;
        orgConnection.webApiVersion = `${versionSplit[0]}.${versionSplit[1]}`;
        orgConnection.name = org.FriendlyName;
        orgConnection.orgName = org.Name;

        return orgConnection;
    }
}