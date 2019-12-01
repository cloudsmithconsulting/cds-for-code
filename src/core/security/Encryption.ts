import * as vscode from 'vscode';
import * as crypto from 'crypto';
import { ICryptography, ISecureItem, Securable, SecureOutput, SecureItem } from './Types';

/**
 * Abstraction for handling symetric cryptography using algorithms like AES, 3DES, etc.
 *
 * @class SymetricCryptography
 */
class SymetricCryptography {
    /**
     * Creates a new instance of cryptography capabiltiies.
     * @param {Securable} [key] Pre-determined key.  If one isn't supplied a 32-byte key will be generated.
     * @param {Securable} [iv] Pre-determined iv.  If one isn't supplied it can be generated at encryption-time.
     * @memberof SymetricCryptography
     */
    constructor(key?: Securable, iv?: Securable) {
        this.key = key || crypto.randomBytes(32);
        this.iv = iv;
    }

    private static defaultAlgorithm = 'aes-256-cbc';
    private key: Securable;
    private iv: Securable;

    encrypt(value: Securable, algorithm: string = SymetricCryptography.defaultAlgorithm, key?: Securable, iv?: Securable): SecureItem {
        key = key || this.key;
        iv = iv || this.iv || crypto.randomBytes(16);

        const output: SecureOutput = Buffer.isBuffer(value) ? SecureOutput.Buffer : SecureOutput.String;

        if (!Buffer.isBuffer(key)) {
            key = Buffer.from(key);
        }

        if (!Buffer.isBuffer(iv)) {
            iv = Buffer.from(iv);
        }

        const cipher = crypto.createCipheriv(algorithm, key, iv);
        let encrypted = cipher.update(value);

        encrypted = Buffer.concat([encrypted, cipher.final()]);

        return SecureItem.from(iv, encrypted, output);
    }

    decrypt(value: SecureItem, algorithm: string = SymetricCryptography.defaultAlgorithm, key?: Securable): Buffer {
        key = key || this.key;

        if (!Buffer.isBuffer(key)) {
            key = Buffer.from(key);
        }

        const iv = value.buffer.iv;
        const encrypted = value.buffer.data;
        const decipher = crypto.createDecipheriv(algorithm, key, iv);
        let decrypted = decipher.update(encrypted);

        decrypted = Buffer.concat([decrypted, decipher.final()]);

        return decrypted;
    }
}

/**
 * Represents a cryptography API that can secure items on a given computer.  The
 * encrypted values cannot be decrypted on other machines.
 *
 * @export
 * @class MachineCryptography
 */
class MachineCryptography implements ICryptography {
    private static _instance:MachineCryptography;

    static get Instance(): MachineCryptography {
        this._instance = this._instance || new MachineCryptography();

        return this._instance;
    }

    private readonly symetricCrypto;

    private constructor() {
        this.symetricCrypto = new SymetricCryptography(vscode.env.machineId);
    }

    encrypt(value:Securable): SecureItem {
        return this.symetricCrypto.encrypt(value);
    }

    decrypt(value:SecureItem): Securable {
        return this.symetricCrypto.decrypt(value);
    }
}

/**
 * Represents a cryptography API that can secure items inside a given process.  The
 * encrypted values cannot be decrypted outside the current application/process.
 *
 * @export
 * @class MachineCryptography
 */
class ProcessCryptography implements ICryptography {
    private static _instance:ProcessCryptography;

    static get Instance(): ProcessCryptography {
        this._instance = this._instance || new ProcessCryptography();

        return this._instance;
    }

    private readonly symetricCrypto;

    private constructor() {
        this.symetricCrypto = new SymetricCryptography(vscode.env.sessionId);
    }

    encrypt(value:Securable): SecureItem {
        return this.symetricCrypto.encrypt(value);
    }

    decrypt(value:SecureItem): Securable {
        return this.symetricCrypto.decrypt(value);
    }
}

class LocalCryptography implements ICryptography {
    private readonly symetricCrypto;

    constructor(key?:Securable) {
        this.symetricCrypto = new SymetricCryptography(key);
    }

    get key(): Securable {
        return this.symetricCrypto.key;
    }

    encrypt(value:Securable): SecureItem {
        return this.symetricCrypto.encrypt(value);
    }

    decrypt(value:SecureItem): Securable {
        return this.symetricCrypto.decrypt(value);
    }
}

export default class Encryption {
    /**
     * Offers machine-level encryption/decryption methods for export.  You cannot
     * decrypt values encrypted this way on other machines.
     *
     * @static
     * @type {ICryptography}
     * @memberof Encryption
     */
    static machine:ICryptography = MachineCryptography.Instance;
    static process:ICryptography = ProcessCryptography.Instance;
    
    static local(key?:Securable):ICryptography {
        return new LocalCryptography(key);
    }

    static createSecureItem(iv:Securable, data:Securable, preferredOutput?:SecureOutput): SecureItem {
        return SecureItem.from(iv, data, preferredOutput);
    }

    static isSecurable(item:any): boolean {
        return Buffer.isBuffer(item) || typeof(item) === "string";
    }

    static decrypt(item:ISecureItem, store:ICryptography): Securable {
        return item.decrypt(store);
    }

    static encrypt(item:Securable, store:ICryptography): ISecureItem {
        return store.encrypt(item);
    }
}