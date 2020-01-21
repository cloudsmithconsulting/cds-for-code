import * as vscode from 'vscode';
import * as cs from '../cs';
import { Utilities } from '../core/Utilities';
import GlobalState from '../components/Configuration/GlobalState';
import { CdsWebApi } from '../api/cds-webapi/CdsWebApi';
import Quickly from '../core/Quickly';

export default class DiscoveryRepository {
    constructor (config:CdsWebApi.Config) {
        this.webapi = new CdsWebApi.WebApiClient(config);
    }

    private webapi: CdsWebApi.WebApiClient;
    
    get config(): CdsWebApi.Config {
        return this.webapi ? this.webapi.config : null;
    }

    async retrieveOrganizations(filter?:string) : Promise<any> {
        return this.webapi.discover(filter)
            .then(result => result.value)
            .catch(error => {
                Quickly.error(
                    `There were errors retreiving organizations from '${this.webapi.config.name ? this.webapi.config.name : "your connection"}': ${error.message}`, 
                    undefined,
                    "Retry",
                    () => this.retrieveOrganizations(filter),
                    "Edit Connection",
                    () => vscode.commands.executeCommand(cs.cds.controls.cdsExplorer.editConnection, this.webapi.config));
            });
    }

    static getConnections(context: vscode.ExtensionContext): CdsWebApi.Config[] {
        const connections: CdsWebApi.Config[] | undefined = GlobalState.Instance.DynamicsConnections;

        return connections;
    }

    static async getOrgConnections(context: vscode.ExtensionContext, exactMatchesOnly: boolean = false): Promise<CdsWebApi.Config[]> {        
        const returnObject:CdsWebApi.Config[] = [];
        const connections = this.getConnections(context);

        if (connections) {
            for (var i = 0; i < connections.length; i++) {
                const api = new DiscoveryRepository(connections[i]);
                const orgs = await api.retrieveOrganizations();

                if (orgs) {
                    for (var j = 0; j < orgs.length; j++) {
                        if (!exactMatchesOnly 
                            || connections[i].type !== CdsWebApi.ConfigType.Online 
                            || (connections[i].type === CdsWebApi.ConfigType.Online && orgs[j].ApiUrl === connections[i].webApiUrl)) {
                            returnObject.push(this.createOrganizationConnection(orgs[j], connections[i]));
                        }
                    }
                }
            }
        }

        return returnObject;
    }

    static saveConnections(context: vscode.ExtensionContext, connections:CdsWebApi.Config[]): CdsWebApi.Config[] {
        GlobalState.Instance.DynamicsConnections = connections;

        return GlobalState.Instance.DynamicsConnections;
    }

    static createOrganizationConnection(org: any, connection: CdsWebApi.Config): CdsWebApi.Config {
        const versionSplit = org.Version.split('.');
        // Clone the current connection and override the endpoint and version.
        const orgConnection = Utilities.$Object.clone<CdsWebApi.Config>(connection);

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