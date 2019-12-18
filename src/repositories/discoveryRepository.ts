import * as vscode from 'vscode';
import { Utilities } from '../core/Utilities';
import GlobalState from '../components/Configuration/GlobalState';
import { DynamicsWebApi } from '../api/cds-webapi/DynamicsWebApi';
import Quickly from '../core/Quickly';

export default class DiscoveryRepository {
    config:DynamicsWebApi.Config;

    constructor (config:DynamicsWebApi.Config) {
        this.config = config;
        this.webapi = new DynamicsWebApi.WebApiClient(this.config);
    }

    private webapi: DynamicsWebApi.WebApiClient;

    async retrieveOrganizations(filter?:string) : Promise<any> {
        return this.webapi.discover(filter)
            .then(result => result.value)
            .catch(error => {
                Quickly.error(`There were errors retreiving organizations from '${this.webapi.config.name ? this.webapi.config.name : "your connection"}': ${error.message}`);
            });
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

                if (orgs) {
                    for (var j = 0; j < orgs.length; j++) {
                        returnObject.push(this.createOrganizationConnection(orgs[j], connections[i]));
                    }
                }
            }
        }

        return returnObject;
    }

    static saveConnections(context: vscode.ExtensionContext, connections:DynamicsWebApi.Config[]): DynamicsWebApi.Config[] {
        GlobalState.Instance.DynamicsConnections = connections;

        return GlobalState.Instance.DynamicsConnections;
    }

    static createOrganizationConnection(org: any, connection: DynamicsWebApi.Config): DynamicsWebApi.Config {
        const versionSplit = org.Version.split('.');
        // Clone the current connection and override the endpoint and version.
        const orgConnection = Utilities.$Object.clone<DynamicsWebApi.Config>(connection);

        if ((<any>orgConnection).accessToken) {
            delete (<any>orgConnection).accessToken;
        }

        if (orgConnection.timeout) {
            delete orgConnection.timeout;       
        }

        orgConnection.appUrl = org.Url;
        orgConnection.webApiUrl = org.ApiUrl;
        orgConnection.webApiVersion = `${versionSplit[0]}.${versionSplit[1]}`;
        orgConnection.name = org.FriendlyName;
        orgConnection.orgName = org.UniqueName || org.Name;
        orgConnection.orgId = org.Id;
        orgConnection.environmentId = org.EnvironmentId;

        return orgConnection;
    }
}