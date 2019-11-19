export type Securable = Buffer | string;

export enum SecureOutput {
    Buffer,
    String
}

export interface ICryptography {
    encrypt(value: Securable): ISecureItem;
    decrypt(value: ISecureItem): Securable;
}

export interface ISecureItem {
    readonly buffer: { iv: Buffer; data: Buffer; };
    readonly string: { iv: string; data: string; };
    
    decrypt(decryptStore:ICryptography): Securable;
}

export interface ICredential {
    username:Securable | ISecureItem;
    password:ISecureItem;
}

export class WindowsCredential implements ICredential {
    domain:Securable;
    username:Securable;
    password:ISecureItem;

    toString():string {
        return (this.domain ? `${this.domain.toString()}\\` : "") + this.username.toString();
    }

    static isWindowsCredential(value:ICredential):boolean {
        return value && (<any>value).domain;
    }
}