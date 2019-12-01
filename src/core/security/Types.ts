import Encryption from "./Encryption";
import { Utilities } from "../Utilities";

/**
 * @type represents an item that can be secured.
 */
export type Securable = Buffer | string;

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
    encrypt(value: Securable): ISecureItem;
    decrypt(value: ISecureItem): Securable;
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
    
    decrypt(decryptStore:ICryptography): Securable;
}

/**
 * Represents a set of credentials that can be encrypted and decrypted.
 *
 * @export
 * @interface ICredential
 */
export interface ICredential {
    username:Securable | ISecureItem;
    password:ISecureItem;

    decrypt(store:ICredentialStore, key:string);
    store(store:ICredentialStore): string;
    toString(): string;
}

export interface ICredentialStore { 
    readonly cryptography: ICryptography;
    secure(securable:Securable): ISecureItem;
    store<T extends ICredential>(credential:T, key?:string): string;
    retreive<T extends ICredential>(key:string, credential?:T): T;
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
        return item instanceof SecureItem;
    }

    private constructor(readonly iv: Securable, readonly data: Securable, readonly preferredOutput: SecureOutput) {
        if (!Buffer.isBuffer(iv)) {
            this.iv = Buffer.from(iv);
        }
    
        if (!Buffer.isBuffer(data)) {
            this.data = Buffer.from(data);
        }
    }

    decrypt(decryptStore:ICryptography): Securable {
        const returnValue = decryptStore.decrypt(this);
    
        if (this.preferredOutput === SecureOutput.Buffer) {
            return returnValue;
        }
        else {
            return returnValue.toString();
        }
    }
    
    get buffer(): { iv: Buffer; data: Buffer; } {
        return { iv: <Buffer>this.iv, data: <Buffer>this.data };
    }
    
    get string(): { iv: string; data: string; } {
        return { iv: this.iv.toString('hex'), data: this.data.toString('hex') };
    }
}

export abstract class CredentialStore implements ICredentialStore {
    public abstract get cryptography(): ICryptography;
    protected abstract onStore(encrypted: any, key: string): void;
    protected abstract onRetreive(key: string): any;

    secure(securable:Securable): ISecureItem {
        return this.cryptography.encrypt(securable);
    }

    store<T extends ICredential>(credential: T, key?: string): string {        
        let storeObject:any = {};
        key = key || Utilities.Guid.NewGuid();

        Object.keys(credential).forEach(k => {
            if (SecureItem.isSecure(credential[k])) {
                const secured = this.cryptography.encrypt(credential[k]);

                storeObject[k] = secured.string;
            } else {
                storeObject[k] = (<ISecureItem>credential[k]).string;
            }
        });
    
        this.onStore(storeObject, key);

        return key;
    }
    
    retreive<T extends ICredential>(key: string, credential?:T): T {
        const encrypted = this.onRetreive(key);

        if (!credential) { 
            credential = <T>{};
        }

        Object.keys(encrypted).forEach(k => {
            if (SecureItem.isSecure(encrypted[k])) {
                const secureItem:ISecureItem = encrypted[k];

                credential[k] = Encryption.createSecureItem(secureItem.buffer.iv, secureItem.buffer.data);
            } else {
                credential[k] = encrypted[k];
            }
        });

        return credential;
    }
}

export abstract class Credential implements ICredential {
    public password: ISecureItem;
    private _unencrypted: Securable;

    protected constructor(public username: Securable, password: SecureItem | Securable) { 
        if (SecureItem.isSecure(password)) {
            this.password = <SecureItem>password;
        } else {
            this._unencrypted = <Securable>password;
        }
    }

    static isWindowsCredential(value:ICredential):boolean {
        return value && value instanceof Credential && value.hasOwnProperty("domain");
    }

    static isOauthCredential(value:ICredential):boolean {
        return value && value instanceof Credential && value.hasOwnProperty("token");
    }

    static retreive<T extends Credential>(store:ICredentialStore, key: string): T {
        if (!store) { return; }

        return store.retreive(key, undefined);
    }

    decrypt(store:ICredentialStore, key:string): Securable {
        return store.retreive(key).password.decrypt(store.cryptography);
    }

    store(store:ICredentialStore): string {
        if (!store) { return; }

        if (this._unencrypted) {
            this.password = store.secure(this._unencrypted);

            // Remove the unencrypted vlaue, it is stored now.
            delete this._unencrypted;
        }

        return store.store(this);
    }

    toString():string {
        return (SecureItem.isSecure(this.username) ? "" : this.username.toString());
    }
}

export class OAuthCredential extends Credential {
    constructor(username: Securable, password: SecureItem | Securable, token?:string) {
        super(username, password);
        this.token = token;
    }

    token: Securable;
}

export class WindowsCredential extends Credential {
    constructor(domain: string, username: Securable, password: SecureItem | Securable) {
        super(username, password);
        this.domain = domain;
    }

    domain: Securable;

    toString():string {
        return (this.domain && this.domain !== "" ? `${this.domain.toString()}\\` : "") + SecureItem.isSecure(this.username) ? "" : this.username.toString();
    }
}