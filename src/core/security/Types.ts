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

    store(store:ICredentialStore): string;
    toString(): string;
}

export interface ICredentialStore { 
    secure(securable:Securable): ISecureItem;
    store<T extends ICredential>(credential:T, key?:string): string;
    retreive<T extends ICredential>(key:string, credential?:T): T;
}

export abstract class CredentialStore implements ICredentialStore {
    protected abstract get cryptography(): ICryptography;
    protected abstract onStore(encrypted: any, key: string): void;
    protected abstract onRetreive(key: string): any;

    secure(securable:Securable): ISecureItem {
        return this.cryptography.encrypt(securable);
    }

    store<T extends ICredential>(credential: T, key?: string): string {        
        let storeObject:any = {};
        key = key || Utilities.Guid.NewGuid();

        Object.keys(credential).forEach(k => {
            if (!Encryption.isSecure(credential[k])) {
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
            if (Encryption.isSecure(encrypted[k])) {
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

    protected constructor(public username: Securable, password: ISecureItem | Securable) { 
        if (Encryption.isSecure(password)) {
            this.password = <ISecureItem>password;
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

        return store.retreive(key);
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
        return (Encryption.isSecure(this.username) ? "" : this.username.toString());
    }
}

export class OAuthCredential extends Credential {
    constructor(username: Securable, password: ISecureItem | Securable, token?:string) {
        super(username, password);
        this.token = token;
    }

    token: Securable;
}

export class WindowsCredential extends Credential {
    constructor(domain: string, username: Securable, password: ISecureItem | Securable) {
        super(username, password);
        this.domain = domain;
    }

    domain: Securable;

    toString():string {
        return (this.domain && this.domain !== "" ? `${this.domain.toString()}\\` : "") + Encryption.isSecure(this.username) ? "" : this.username.toString();
    }
}