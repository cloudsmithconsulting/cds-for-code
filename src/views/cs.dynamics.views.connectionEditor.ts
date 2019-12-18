import * as vscode from 'vscode';
import * as cs from '../cs';
import { View, BridgeCommunicationMethod } from '../core/webui/View';
import { ViewRenderer } from "../core/webui/ViewRenderer";
import { DynamicsWebApi } from '../api/cds-webapi/DynamicsWebApi';
import DiscoveryRepository from '../repositories/discoveryRepository';
import CdsConnectionString from '../api/CdsConnectionString';
import Quickly, { QuickPickOption } from '../core/Quickly';
import GlobalStateCredentialStore from '../core/security/GlobalStateCredentialStore';
import Dictionary from '../core/types/Dictionary';
import { Credential, CdsOnlineCredential, SecureOutput } from "../core/security/Types";
import { Octicon } from '../core/types/Octicon';

export default async function openView(config?: DynamicsWebApi.Config): Promise<View> {
    const view = View.show(CdsConnectionEditor, {
        icon: './resources/images/cloudsmith-logo-only-50px.png',
        title: (config && config.name) ? `Edit CDS Connection - ${config.name}` : 'New CDS Connection',
        type: cs.dynamics.views.connectionEditor,
        preserveFocus: false,
        bridge: BridgeCommunicationMethod.Ipc,
        onReady: view => view.setInitialState(config)
    });

    return view;
}

class CdsConnectionEditor extends View {
    construct(viewRenderer: ViewRenderer): string {
        // add script and css assets
        viewRenderer.addScript('materialize.js');
        viewRenderer.addScript('connection-editor.js');

        viewRenderer.addStyleSheet("materialize.vscode.css");
        viewRenderer.addStyleSheet("webViewStyles.css");

        // add image assets
        viewRenderer.addImage('cloudsmith-logo-only-50px.png');

        // return rendered html
        return viewRenderer.renderFile('connection-editor.html');
    } 

    get commands(): Dictionary<string, Function> {
        return new Dictionary<string, Function>([
            { key: 'parse-connectionstring', value: message => this.parseConnectionString(message.connectionString) }, 
            { key: 'discover', value: message => this.save(message.settings, true) },
            { key: 'save', value: message => this.save(message.settings, false) },
            { key: 'edit-password', value: message => this.editPassword(message.settings) }
        ]);
    }

    private async editPassword(config: DynamicsWebApi.Config) {
        if (config.id) {
            const password1 = await Quickly.password(`Please enter the new password for '${config.name || config.appUrl}'`);
            const password2 = await Quickly.password(`Please re-enter (verify) the new password for '${config.name || config.appUrl}'`);

            if (password1 !== password2) {
                await Quickly.error("The passwords do not match", undefined, "Retry", () => this.editPassword(config));
            } else {
                config.credentials = GlobalStateCredentialStore.Instance.editPassword(config.id, password1);
            }
        }
    }

    private parseConnectionString(connectionString: string): void {
        try {
            const connection = CdsConnectionString.from(connectionString);                
            const config = connection ? connection.toConfig() : null;

            this.setInitialState(config);
        } catch (error) {
            Quickly.error(`The configuration string could not be parsed: ${error}`);
        }
    }

    private async save(config: DynamicsWebApi.Config, discoverOnly: boolean = false): Promise<void> {
        // set a timeout if it doesn't exist
        config.timeout = config.timeout || (1000 * 5); // 5 seconds

        const resource = (<CdsOnlineCredential>config.credentials).resource;

        if (config.id && (!config.credentials.password || config.credentials.password === "")) {
            // We don't edit passwords here, so if we don't have one, that's ok, let's go get it.
            const existingCreds = GlobalStateCredentialStore.Instance.retreive(config.id);

            config.credentials.password = existingCreds.password;                            
        }

        if (!config.appUrl && resource && resource !== CdsOnlineCredential.defaultResource) {
            config.appUrl = resource;
        }

        if (!config.webApiUrl && resource && resource !== CdsOnlineCredential.defaultResource) {
            const urlParts = resource.split(".");
            const apiUrl = urlParts.concat(urlParts.slice(0, 1), [ "api" ], urlParts.slice(1)).join(".");

            config.webApiUrl = apiUrl;
        }

        if (config.type === DynamicsWebApi.ConfigType.Online && (!config.webApiUrl || config.webApiUrl === "")) {
            config.webApiUrl = CdsOnlineCredential.defaultResource;
        }

        // construct the api repo
        const api = new DiscoveryRepository(config);
        
        // try a discovery request
        await api.retrieveOrganizations()
            .then(async results => {
                // delete the prior timeout for the config
                delete config.timeout;
                
                if (!results) {
                    this.postMessage({ command: 'error', message: "The discovery request could not be completed.  Check the credentials and URL and try again." });
                } else {
                    if (discoverOnly) {
                        const options = results.map(r => new QuickPickOption(`${Octicon.database} ${r.FriendlyName}`, undefined, undefined, r));
                        const option = await Quickly.pick("Choose an organization", ...options);
    
                         if (option) {
                            this.postMessage({ command: 'bindDiscovery', organization: option.context.Url });
                        }
                    } else {
                        // success, add it to connection window
                        vscode.commands.executeCommand(cs.dynamics.controls.dynamicsTreeView.addConnection, config)
                            .then(() => {
                                this.dispose();
                            });
                    }
                }
            })
            .catch(err => {
                let message: string;

                if (err && err.message && err.message.startsWith("getaddrinfo ENOTFOUND")) {
                    message = `Could not connect to '${config.webApiUrl}': The host name is not valid`;
                } else if (err.message) {
                    message = err.message;
                }

                this.postMessage({ command: 'error', message });
            });
    }

    setInitialState(config?: DynamicsWebApi.Config): void {
        if (config) {
            if (Credential.isSecureCredential(config.credentials) && config.id) {
                config.credentials = GlobalStateCredentialStore.Instance.decrypt(config.id, config.credentials, SecureOutput.String, [ "password" ]);
                
                delete config.credentials.password;
            }

            this.postMessage({ command: 'load', message: config });
        } else {
            this.postMessage({ command: "load" });
        }
    }
}