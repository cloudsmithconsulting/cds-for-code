import * as vscode from 'vscode';
import { DynamicsWebApi } from './cds-webapi/DynamicsWebApi';
import { ICredential, WindowsCredential, OAuthCredential, AzureAdUserCredential } from '../core/security/Types';

export default class CdsConnectionString {
    constructor(connectionString?:string | undefined) {
        if (connectionString) {
            CdsConnectionString.from(connectionString, this);
        }
    }

    type: DynamicsWebApi.ConfigType;
    uri: vscode.Uri;
    domain?: string;
    username?: string;
    password?: string;
    homeRealm?: vscode.Uri;
    requireNewInstance?: boolean;
    clientId?: string;
    redirectUri?: vscode.Uri;
    tokenCacheStorePath?: string;

    static from(connectionString:string, into?:CdsConnectionString): CdsConnectionString {
        into = into || new CdsConnectionString();

        connectionString.split(';').forEach(pair => {
            let keyValuePairs = pair.split('=');
            let key: string = "";
            let value: string = "";

            if (keyValuePairs.length > 0) {
                key = keyValuePairs[0].trim().toLowerCase();
            }

            if (keyValuePairs.length > 1) {
                value = keyValuePairs[1].trim();
            }

            switch (key) {
                case "authtype":
                case "auth type":
                case "authentication":
                    switch (value.toLowerCase()) {
                        case "ad":
                        case "activedirectory":
                        case "active directory":
                            into.type = DynamicsWebApi.ConfigType.OnPremises;
                            break;
                        case "adfs":
                        case "ifd":
                            into.type = DynamicsWebApi.ConfigType.IFD;

                            break;
                        case "oauth":
                            into.type = DynamicsWebApi.ConfigType.AzureAdAuth;

                            break;
                        case "office365":
                        case "office 365":
                        case "crmlive":
                        case "crm live":
                            into.type = DynamicsWebApi.ConfigType.Online;

                            break;
                        default:
                            throw Error(`The authentication type '${value}' is not known.`);
                    }

                    break;
                case "serviceuri":
                case "service uri":
                case "url":
                case "server":
                    into.uri = vscode.Uri.parse(value);

                    break;
                case "domain":
                    into.domain = value;

                    break;
                case "username":
                case "user name":
                case "userid":
                case "user id":
                    into.username = value;

                    break;
                case "password":
                case "pwd":
                    into.password = value;

                    break;
                case "homerealmuri":
                case "home realm uri":
                    into.homeRealm = vscode.Uri.parse(value);

                    break;
                case "requirenewinstance":
                case "require new instance":
                    into.requireNewInstance = value && value !== "false" && value !== "no";

                    break;
                case "clientid":
                case "client id":
                case "appid":
                case "app id":
                case "applicationid":
                case "application id":
                    into.clientId = value;

                    break;
                case "redirecturi":
                case "redirect uri":
                case "replyurl":
                case "reply url":
                    into.redirectUri = vscode.Uri.parse(value);

                    break;
                case "tokencachestorepath":
                case "token cache store path":
                    into.tokenCacheStorePath = value;

                    break;
                }
        });

        return into;
    }

    toString(): string {
        const returnString:string[] = [];

        if (this.type) {
            switch (this.type) {
                case DynamicsWebApi.ConfigType.OnPremises:
                    returnString.push("AuthType=AD; ");
                    break;
                case DynamicsWebApi.ConfigType.Online:
                    returnString.push("AuthType=Office365; ");
                    break;
                case DynamicsWebApi.ConfigType.AzureAdAuth:
                    returnString.push("AuthType=OAuth; ");
                    break;
                case DynamicsWebApi.ConfigType.IFD:
                    returnString.push("AuthType=IFD; ");
                    break;
            }
        }

        if (this.uri) {
            returnString.push(`ServiceUri=${this.uri.toString()}; `);
        }

        if (this.domain) {
            returnString.push(`Domain=${this.domain}; `);
        }

        if (this.username) {
            returnString.push(`UserName=${this.username}; `);
        }

        if (this.password) {
            returnString.push(`Password=${this.password}; `);
        }

        if (this.homeRealm) {
            returnString.push(`HomeRealmUri=${this.homeRealm.toString()}; `);
        }

        if (typeof this.requireNewInstance !== "undefined") {
            returnString.push(`RequireNewInstance=${this.homeRealm.toString()}; `);
        }

        if (this.clientId) {
            returnString.push(`ClientId=${this.clientId}; `);
        }

        if (this.redirectUri) {
            returnString.push(`RedirectUri=${this.redirectUri.toString()}; `);
        }

        if (this.tokenCacheStorePath) {
            returnString.push(`TokenCacheStorePath=${this.tokenCacheStorePath}; `);
        }

        return returnString.join("");
    }

    toConfig(): DynamicsWebApi.Config {
        let credentials: ICredential;

        // TODO: put in IFD creds
        switch (this.type) {
            case DynamicsWebApi.ConfigType.OnPremises:
                credentials = new WindowsCredential(this.domain, this.username, this.password);
                break;
            case DynamicsWebApi.ConfigType.Online:
                credentials = new OAuthCredential(this.username, this.password);
                break;
            case DynamicsWebApi.ConfigType.AzureAdAuth:
                credentials = new AzureAdUserCredential(this.username, this.password, this.clientId, undefined, this.uri.toString());
                break;
        }

        const config: DynamicsWebApi.Config = {
            id: null,
            name: null,
            type: this.type,
            webApiUrl: this.uri ? this.uri.toString() : null,
            credentials: credentials,
            webApiVersion: "v8.0",            
        };

        return config;
    }
}