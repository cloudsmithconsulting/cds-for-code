import Encryption from "./Encryption";

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
}

export interface ICredentialStore { 
    store(credential:ICredential): string;
    retreive<T extends ICredential>(key:string): T;
}

export abstract class Credential implements ICredential {
    username: Securable | ISecureItem;    
    password: ISecureItem;

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

        return store.store(this);
    }

    toString():string {
        return (Encryption.isSecure(this.username) ? "" : this.username.toString());
    }
}

export class OAuthCredential extends Credential {
    token: Securable;
}

export class WindowsCredential extends Credential {
    domain: Securable;

    toString():string {
        return (this.domain && this.domain !== "" ? `${this.domain.toString()}\\` : "") + Encryption.isSecure(this.username) ? "" : this.username.toString();
    }
}