import { TextEncoder } from "util";

export default class Encoding { 
    static utf8encoder = new TextEncoder();
    
    static stringToBase64(string:string): string {
        return this.bytesToBase64(this.utf8encoder.encode(string));
    }

    static bytesToBase64(bytes:Uint8Array): string {
        return Buffer.from(bytes).toString("base64");
    }    

    static base64ToBytes(str:string): Uint8Array {
        return this.utf8encoder.encode(Buffer.from(str, "base64").toString());
    }

    static base64ToString(str:string): string { 
        return Buffer.from(str, "base64").toString();
    }
}