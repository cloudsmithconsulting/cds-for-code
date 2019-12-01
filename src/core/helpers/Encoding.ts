import { TextEncoder } from "util";

export const utf8encoder = new TextEncoder();
    
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