import * as crypto from 'crypto';

export type Securable = Buffer | string;
export enum SecureOutput {
    Buffer,
    String
}

/**
 * Abstraction for handling semantic cryptography using algorithms like AES, 3DES, etc.
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
    constructor(key?:Securable, iv?:Securable) {
        this.key = key || crypto.randomBytes(32);
        this.iv = iv;
    }

    private static defaultAlgorithm = 'aes-256-cbc';

    private key:Securable;
    private iv:Securable;

    encrypt(value:Securable, algorithm:string = SymetricCryptography.defaultAlgorithm, key?:Securable, iv?:Securable): SecureItem {
        key = key || this.key;
        iv = iv || this.iv || crypto.randomBytes(16);
        
        const output:SecureOutput = Buffer.isBuffer(value) ? SecureOutput.Buffer : SecureOutput.String;

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
       
    decrypt(value:SecureItem, algorithm:string = SymetricCryptography.defaultAlgorithm, key?:Securable): Securable {
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
 * Represents a secure item (string or buffer) with the needed components
 * (minus key, of course) to decrypt them.
 *
 * @class SecureItem
 */
class SecureItem {
    static from(iv:Securable, data:Securable, preferredOutput:SecureOutput = SecureOutput.Buffer) {
        return new SecureItem(iv, data, preferredOutput);
    }

    private constructor(readonly iv:Securable, readonly data:Securable, readonly preferredOutput:SecureOutput) {
        if (!Buffer.isBuffer(iv)) {
            this.iv = Buffer.from(iv);
        }

        if (!Buffer.isBuffer(data)) {
            this.data = Buffer.from(data);
        }
    }

    decrypt(key:Securable, algorithm?:string): Securable {
        const returnValue = new SymetricCryptography(key, this.iv).decrypt(this, algorithm);

        if (this.preferredOutput === SecureOutput.Buffer) {
            return returnValue;
        } else {
            return returnValue.toString();
        }
    }

    get buffer(): { iv: Buffer, data: Buffer } {
        return { iv: <Buffer>this.iv, data: <Buffer>this.data };
    }

    get string(): { iv: string, data: string } { 
        return { iv: this.iv.toString('hex'), data: this.data.toString('hex') };
    }
}

