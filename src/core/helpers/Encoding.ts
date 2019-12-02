import { TextEncoder } from "util";

export const utf8encoder:TextEncoder = new TextEncoder();

export function stringToBase64(string:string): string {
    return this.bytesToBase64(this.utf8encoder.encode(string));
}

export function bytesToBase64(bytes:Uint8Array): string {
    return Buffer.from(bytes).toString("base64");
}    

export function base64ToBytes(str:string): Uint8Array {
    return this.utf8encoder.encode(Buffer.from(str, "base64").toString());
}

export function base64ToString(str:string): string { 
    return Buffer.from(str, "base64").toString();
}

export function bytesToHex(byteArray: Uint8Array): string {
    let returnString = '';

    for (var i = 0; i < byteArray.length; i++) {
        let hex = (byteArray[i] & 0xff).toString(16);

        hex = (hex.length === 1) ? '0' + hex : hex;
        returnString += hex;
    }

    return returnString.toUpperCase();
}

export function hexToBytes(hexString: string): Uint8Array {
    if (!hexString) {
        return Uint8Array.from([]);
    }

    let array = [];

    for (var i = 0, len = hexString.length; i < len; i += 2) {
        array.push(parseInt(hexString.substr(i, 2), 16));
    }

    return Uint8Array.from(array);
}