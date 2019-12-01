import * as Security from "../security/Types";
import Encryption from "../security/Encryption";
import ExtensionContext from "../ExtensionContext";

export default class GlobalStateCredentialStore extends Security.CredentialStore {
    private static keyPrefix = "cs.credentialStore:";

    protected get cryptography(): Security.ICryptography {
        return Encryption.machine;
    }
    
    protected onStore(encrypted: any, key: string): void {
        ExtensionContext.Instance.globalState.update(`${GlobalStateCredentialStore.keyPrefix}${key}`, encrypted);
    }

    protected onRetreive(key: string): any {
        return ExtensionContext.Instance.globalState.get<any>(`${GlobalStateCredentialStore.keyPrefix}${key}`);
    }
}