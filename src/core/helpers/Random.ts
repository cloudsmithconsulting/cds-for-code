import * as crypto from 'crypto';

export function randomStringHex(length: number): string {
    return crypto
        .randomBytes(Math.ceil(length / 2))
        .toString('hex') // convert to hexadecimal format
        .slice(0, length); // return required number of characters
}

export function randomStringBase64(length: number): string {
    return crypto
        .randomBytes(Math.ceil((length * 3) / 4))
        .toString('base64') // convert to base64 format
        .slice(0, length) // return required number of characters
        .replace(/\+/g, '0') // replace '+' with '0'
        .replace(/\//g, '0'); // replace '/' with '0'
}

export function randomString(length: number, chars?: string): string {
    chars = chars || 'abcdefghijklmnopqrstuwxyzABCDEFGHIJKLMNOPQRSTUWXYZ0123456789';

    const rnd = crypto.randomBytes(length);
    const value = new Array(length);
    const d = 256 / Math.min(256, chars.length);

    for (var i = 0; i < length; i++) {
        value[i] = chars[Math.floor(rnd[i] / d)];
    }

    return value.join('');
}