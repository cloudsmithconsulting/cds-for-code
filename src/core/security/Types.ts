import Encryption from "./Encryption";
import { Utilities } from "../Utilities";

/**
 * @type represents an item that can be secured.
 */
export type Securable = Buffer | string | undefined;

/**
 * Represents the type of output to use when decrypting a secure value.
 * @export SecureOutput
 * @enum {number} representing a Buffer or String
 */
export enum SecureOutput {
    Buffer,
    String
}

/**
 * Represents an type that can perform symetric encryption/decryption.
 * @export ICryptography
 * @interface ICryptography
 */
export interface ICryptography {
    encrypt(value: Securable): SecureItem | null;
    decrypt(value: SecureItem, preferredOutput?: SecureOutput): Securable | null;
}

/**
 * Represents an item that has been encrypted and can be decrypted by it's correspodnign 
 * private key (or private key store)
 *
 * @export
 * @interface ISecureItem
 */
export interface ISecureItem {
    readonly buffer: { iv: Buffer; data: Buffer; };
    readonly string: { iv: string; data: string; };
    
    decrypt(decryptStore: ICryptography, preferredOutput?: SecureOutput): Securable | null;
}

/**
 * Represents a set of credentials that can be encrypted and decrypted.
 *
 * @export
 * @interface ICredential
 */
export interface ICredential {
    /**
     * Represents a public key that can be used to refer to this credential when in the credential store.
     * @type {string}
     * @memberof ICredential
     */
    readonly storeKey?: string;

    username: Securable | ISecureItem;
    password: Securable | ISecureItem;

    readonly isSecure: boolean;

    decrypt<T extends ICredential>(store: ICredentialStore, key: string, preferredOutput?: SecureOutput): T | null;
    store(store: ICredentialStore): string | null;
    toString(): string;
}

export interface ICredentialStore { 
    readonly cryptography: ICryptography;

    decrypt<T extends ICredential>(key: string, credential?: T | undefined, preferredOutput?: SecureOutput): T | null;
    delete(key: string): void;
    retreive<T extends ICredential>(key: string, credential?: T | undefined): T | null;
    secure(securable: Securable): SecureItem | null;
    store<T extends ICredential>(credential: T, key?: string): string | null;
}

/**
 * Represents a secure item (string or buffer) with the needed components
 * (minus key, of course) to decrypt them.
 *
 * @class SecureItem
 */
export class SecureItem implements ISecureItem {
    static from(iv: Securable, data: Securable, preferredOutput: SecureOutput = SecureOutput.Buffer): SecureItem {
        return new SecureItem(iv, data, preferredOutput);
    }

    static isSecure(item:any) {
        return item instanceof SecureItem || (typeof item !== "undefined" && item.data && item.iv);
    }

    static asSecureItem(item:any): SecureItem | undefined {
        if (item instanceof SecureItem) {
            return <SecureItem>item;
        }

        if (item.data && item.iv) {
            return Encryption.createSecureItem(item.iv, item.data);
        }
    }

    private constructor(readonly iv: Securable, readonly data: Securable, readonly preferredOutput: SecureOutput) {
        if (iv && !Buffer.isBuffer(iv)) {
            this.iv = Buffer.from(Utilities.Encoding.hexToBytes(iv));
        }
    
        if (data && !Buffer.isBuffer(data)) {
            this.data = Buffer.from(Utilities.Encoding.hexToBytes(data));
        }
    }

    decrypt(decryptStore:ICryptography, preferredOutput?: SecureOutput): Securable | null | undefined {
        return decryptStore.decrypt(this, preferredOutput || this.preferredOutput);
    }
    
    get buffer(): { iv: Buffer; data: Buffer; } {
        return { iv: <Buffer>this.iv, data: <Buffer>this.data };
    }
    
    get string(): { iv: string; data: string; } {
        return { iv: this.iv ? this.iv.toString('hex') : "", data: this.data ? this.data.toString('hex') : "" };
    }
}

export abstract class CredentialStore implements ICredentialStore {
    public abstract get cryptography(): ICryptography;
    protected abstract onStore(encrypted: any, key: string): void;
    protected abstract onRetreive(key: string): any;
    protected abstract onDelete(key: string): void;

    delete(key: string): void {
        const encrypteed = this.onRetreive(key);

        if (!encrypteed) { return; }

        this.onDelete(key);
    }

    decrypt<T extends ICredential>(key: string, credential?:T, preferredOutput?: SecureOutput): T | null {
        let encrypted = this.onRetreive(key);

        // We don't really want byte arrays for creds (most of the time).
        preferredOutput = preferredOutput || SecureOutput.String;

        if (!encrypted && Credential.isCredential(credential) && (<Credential>credential).isSecure) {
             encrypted = credential;
        } else if (!encrypted) {
            return null;
        }

        if (!credential) { 
            credential = <T>{ storeKey: key };
        }

        if (credential) { 
            Object.keys(encrypted).forEach(k => {
                if (SecureItem.isSecure(encrypted[k])) {
                    (<any>credential)[k] = this.cryptography.decrypt(<SecureItem>encrypted[k], preferredOutput);
                } else {
                    (<any>credential)[k] = encrypted[k];
                }
            });
        }

        return credential;
    }

    retreive<T extends ICredential>(key: string, credential?:T): T | null {
        const encrypted = this.onRetreive(key);

        if (!encrypted) { return null; }

        if (!credential) { 
            credential = <T>{ storeKey: key };
        }

        Object.keys(encrypted).forEach(k => {
            if (SecureItem.isSecure(encrypted[k])) {
                (<any>credential)[k] = SecureItem.asSecureItem(encrypted[k]);
            } else {
                (<any>credential)[k] = encrypted[k];
            }
        });

        return credential;
    }

    secure(securable:Securable): SecureItem | null {
        return this.cryptography.encrypt(securable);
    }

    store<T extends ICredential>(credential: T, key?: string): string {        
        let storeObject:any = {};
        key = key || credential.storeKey || Utilities.Guid.newGuid();

        Object.keys(credential).forEach(k => {
            if (Encryption.isSecurable((<any>credential)[k])) {
                const secured: any | null = this.cryptography.encrypt((<any>credential)[k]);

                if (secured !== null) {
                    storeObject[k] = secured.string;
                }
            } else if (SecureItem.isSecure((<any>credential)[k])) {
                storeObject[k] = (<ISecureItem>(<any>credential)[k]).string;
            }
        });
    
        this.onStore(storeObject, key);

        return key;
    }
}

export abstract class Credential implements ICredential {
    protected constructor(
        public username: ISecureItem | Securable,
        public password: ISecureItem | Securable, 
        public storeKey?:string) { 
    }

    static get Empty(): Credential {
        return <Credential>{};
    }

    static from<T extends ICredential>(value:any, key?:string): T {
        let cred:Credential = Credential.Empty;

        if (this.isCdsOnlineUserCredential(value)) {
            cred = new CdsOnlineCredential(value.username, value.password, value.authority, value.tenant, value.clientId, value.resource, value.token);
        } else if (this.isAzureAdClientCredential(value)) {
            cred = new AzureAdClientCredential(value.clientId, value.clientSecret, value.authority, value.callbackUrl);
        } else if (this.isAzureAdUserCredential(value)) {
            cred = new AzureAdUserCredential(value.username, value.password, value.clientId, value.clientSecret, value.authority);
        } else if (this.isWindowsCredential(value)) {
            cred = new WindowsCredential(value.domain, value.username, value.password);
        } else if (this.isOauthCredential(value)) {
            cred = new OAuthCredential(value.username, value.password, value.token);
        }

        if (cred && key) {
            cred.storeKey = key;
        }

        return <T>cred;
    }

    static isCredential(value:any): boolean {
        return value && value.hasOwnProperty("username") && value.hasOwnProperty("password");
    }

    static isWindowsCredential(value:ICredential): boolean {
        return value && this.isCredential(value) && value.hasOwnProperty("domain");
    }

    static isOauthCredential(value:ICredential): boolean {
        return value && this.isCredential(value) && value.hasOwnProperty("token");
    }

    static isAzureAdClientCredential(value:ICredential): boolean {
        return value && value.hasOwnProperty("clientId") && value.hasOwnProperty("clientSecret") && value.hasOwnProperty("authority") && value.hasOwnProperty("callback");
    }

    static isAzureAdUserCredential(value:ICredential): boolean {
        return value && this.isOauthCredential(value) && value.hasOwnProperty("clientId") && value.hasOwnProperty("clientSecret") && value.hasOwnProperty("authority");
    }

    static isCdsOnlineUserCredential(value:ICredential): boolean {
        return value && this.isOauthCredential(value) && value.hasOwnProperty("resource");
    }

    static needsToken(value:ICredential): boolean { 
        return this.requireToken(value) && !Utilities.$Object.isNullOrEmpty((<OAuthCredential>value).token);
    }

    static requireToken(value:ICredential): boolean { 
        return this.isOauthCredential(value);
    }

    static retreive<T extends ICredential>(store:ICredentialStore, key: string): T | null {
        if (!store) { return null; }

        return store.retreive<T>(key, undefined);
    }

    static setToken(value:ICredential, token:string) {
        if (this.isOauthCredential(value)) {            
            (<OAuthCredential>value).token = token;
        }
    }

    static isSecureCredential<T extends ICredential>(credential: T): boolean {
        return credential.isSecure;
    }

    get isSecure(): boolean {
        return SecureItem.isSecure(this.username) && SecureItem.isSecure(this.password);
    }

    decrypt<T extends ICredential>(store:ICredentialStore, key:string, preferredOutput?: SecureOutput): T | null {
        if (!store) { return null; }

        const decrypted = store.decrypt<T>(key, undefined, preferredOutput);

        if (!Utilities.$Object.isNullOrEmpty(decrypted)) {
            Utilities.$Object.clone(decrypted, this);
        }

        return decrypted;
    }

    store(store:ICredentialStore): string | null {
        if (!store) { return null; }

        return store.store(<ICredential>this);
    }

    toString():string {
        return (SecureItem.isSecure(this.username) ? "" : this.username ? this.username.toString() : "");
    }
}

export class WindowsCredential extends Credential {
    constructor(public domain: Securable, username: SecureItem | Securable, password: SecureItem | Securable) {
        super(username, password);
    }

    toString():string {
        return (this.domain && this.domain !== "" ? `${this.domain.toString()}\\` : "") + SecureItem.isSecure(this.username) ? "" : this.username ? this.username.toString() : "";
    }
}

export class OAuthCredential extends Credential {
    constructor(username: SecureItem | Securable, password: SecureItem | Securable, public token?:string) {
        super(username, password);
    }
}

export class AzureAdClientCredential extends Credential {
    constructor(public clientId: Securable | SecureItem, public clientSecret: Securable | SecureItem, public authority: string, public callbackUrl?: string) {
        super(clientId, clientSecret);
    }
}

export class AzureAdUserCredential extends OAuthCredential {
    constructor(username: SecureItem | Securable, password: SecureItem | Securable, public clientId: Securable | SecureItem, public clientSecret: Securable | SecureItem, public authority: string) {
        super(username, password);
    }
}

export class CdsOnlineCredential extends OAuthCredential {
    static readonly defaultClientId:string = "51f81489-12ee-4a9e-aaae-a2591f45987d";
    //static readonly defaultAuthority:string = "https://login.microsoftonline.com/common/oauth2/authorize?resource=";
    static readonly defaultAuthority:string = "https://login.microsoftonline.com";
    static readonly defaultTenant:string = "common";

    constructor(
        username: SecureItem | Securable,
        password: SecureItem | Securable, 
        public authority: string = CdsOnlineCredential.defaultAuthority, 
        public tenant: string = CdsOnlineCredential.defaultTenant,
        public clientId: string = CdsOnlineCredential.defaultClientId,
        public resource: string,
        token?: string) {
        super(username, password, token);
    }
}