import * as Security from "../security/Types";
import Encryption from "../security/Encryption";

export default class GlobalStateCredentialStore extends Security.CredentialStore {
    
    protected get cryptography(): Security.ICryptography {
        return Encryption.machine;
    }
    
    protected onStore(encrypted: any, key: string): void {
        throw new Error("Method not implemented.");
    }

    protected onRetreive(key: string) {
        throw new Error("Method not implemented.");
    }



}