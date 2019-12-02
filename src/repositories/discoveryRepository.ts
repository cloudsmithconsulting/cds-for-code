import * as vscode from 'vscode';
import { Utilities } from '../core/Utilities';
import GlobalState from '../components/Configuration/GlobalState';
import { DynamicsWebApi } from '../api/cds-webapi/DynamicsWebApi';

export default class DiscoveryRepository {
    private config:DynamicsWebApi.Config;

    constructor (config:DynamicsWebApi.Config) {
        this.config = config;
        this.webapi = new DynamicsWebApi.WebApiClient(this.config);
    }

    private webapi: DynamicsWebApi.WebApiClient;

    async retrieveOrganizations() : Promise<any> {
        return this.webapi.discover()
            .then(result => result.value);
    }

    static getConnections(context: vscode.ExtensionContext): DynamicsWebApi.Config[] {
        const connections: DynamicsWebApi.Config[] | undefined = GlobalState.Instance.DynamicsConnections;

        return connections;
    }

    static async getOrgConnections(context: vscode.ExtensionContext):Promise<DynamicsWebApi.Config[]> {        
        const returnObject:DynamicsWebApi.Config[] = [];
        const connections = this.getConnections(context);

        if (connections) {
            for (var i = 0; i < connections.length; i++) {
                const api = new DiscoveryRepository(connections[i]);
                const orgs = await api.retrieveOrganizations();

                for (var j = 0; j < orgs.length; j++) {
                    returnObject.push(this.createOrganizationConnection(orgs[j], connections[i]));
                }
            }
        }

        return returnObject;
    }

    static saveConnections(context: vscode.ExtensionContext, connections:DynamicsWebApi.Config[]): void {
        GlobalState.Instance.DynamicsConnections = connections;
    }

    static createOrganizationConnection(org: any, connection: DynamicsWebApi.Config): DynamicsWebApi.Config {
        const versionSplit = org.Version.split('.');
        // Clone the current connection and override the endpoint and version.
        const orgConnection = Utilities.$Object.clone<DynamicsWebApi.Config>(connection);

        orgConnection.webApiUrl = org.ApiUrl;
        orgConnection.webApiVersion = `${versionSplit[0]}.${versionSplit[1]}`;
        orgConnection.name = org.FriendlyName;
        orgConnection.orgName = org.UniqueName || org.Name;
        orgConnection.orgId = org.Id;

        return orgConnection;
    }
}