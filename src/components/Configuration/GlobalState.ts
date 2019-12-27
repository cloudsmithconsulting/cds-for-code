import * as cs from '../../cs';
import * as vscode from 'vscode';
import { DynamicsWebApi } from '../../api/cds-webapi/DynamicsWebApi';
import ExtensionContext from '../../core/ExtensionContext';
import GlobalStateCredentialStore from '../../core/security/GlobalStateCredentialStore';
import { Credential } from '../../core/security/Types';
import Dictionary from '../../core/types/Dictionary';

export default class GlobalState {
    private constructor() { }

    get DynamicsConnections(): DynamicsWebApi.Config[] {
        const connections = ExtensionContext.Instance.globalState.get<DynamicsWebApi.Config[]>(cs.dynamics.configuration.globalState.dynamicsConnections);

        if (connections && connections.length > 0) {
            connections.forEach(c => {
                const creds = GlobalStateCredentialStore.Instance.retreive(c.id);
    
                if (creds) {
                    c.credentials = Credential.from(creds, c.id);
                }
            });
        }

        return connections;
    }
    set DynamicsConnections(value: DynamicsWebApi.Config[]) {
        const keys = new Dictionary<number, string>();
        
        if (value && value.length > 0) {
            // Store each connection without creds.
            value.forEach((c, index) => {
                if (c.credentials) {
                    const anyCreds = <any>c.credentials;
                    const key = GlobalStateCredentialStore.Instance.store(anyCreds, c.id, [ "accessToken", "isMultiFactorAuthentication", "resource" ]);
                    
                    delete c.credentials;

                    keys.add(index, key);
                }
            });
        }

        ExtensionContext.Instance.globalState.update(cs.dynamics.configuration.globalState.dynamicsConnections, value);

        if (value && value.length > 0) {
            // Reload the creds (encrypted) for use in the session.
            value.forEach((c, index) => {
                if (keys.containsKey(index)) {
                    c.credentials = GlobalStateCredentialStore.Instance.retreive(keys[index]);
                }
            });
        }
    }

    get PowerShellScriptVersion(): number {
        return ExtensionContext.Instance.globalState.get<number>(cs.dynamics.configuration.globalState.powerShellScriptVersion);
    }
    set PowerShellScriptVersion(value: number) {
        ExtensionContext.Instance.globalState.update(cs.dynamics.configuration.globalState.powerShellScriptVersion, value);
    }
    
    static get Instance(): GlobalState {
        return new GlobalState();
    }
}
