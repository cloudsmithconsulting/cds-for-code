import * as Security from "../security/Types";
import Encryption from "../security/Encryption";
import ExtensionContext from "../ExtensionContext";

export default class GlobalStateCredentialStore extends Security.CredentialStore {
    private static _instance:GlobalStateCredentialStore;    
    private static keyPrefix = "cs.credentialStore:";

    static get Instance():GlobalStateCredentialStore { 
        if (!this._instance) {
            this._instance = new GlobalStateCredentialStore();
        }

        return this._instance;
    }

    private constructor() { super(); }

    get cryptography(): Security.ICryptography {
        return Encryption.machine;
    }
    
    protected onDelete(key: string): void {
        ExtensionContext.Instance.globalState.update(`${GlobalStateCredentialStore.keyPrefix}${key}`, undefined);
    }

    protected onStore(encrypted: any, key: string): void {
        ExtensionContext.Instance.globalState.update(`${GlobalStateCredentialStore.keyPrefix}${key}`, encrypted);
    }

    protected onRetreive(key: string): any {
        return ExtensionContext.Instance.globalState.get<any>(`${GlobalStateCredentialStore.keyPrefix}${key}`);
    }

    editPassword(key: string, password: Security.Securable): Security.ICredential {
        const credential = this.retreive(key);  

        if (credential) {
            credential.password = password;

            this.store(credential, key, [ "accessToken", "isMultiFactorAuthentication", "resource" ]);

            return this.retreive(key);
        }
    }
}