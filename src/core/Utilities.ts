import * as vscode from 'vscode';
import * as BrowserHelper from "./helpers/Browser";
import * as EncodingHelper from "./helpers/Encoding";
import * as GuidHelper from "./helpers/Guid";
import * as ObjectHelper from "./helpers/Object";
import * as StringHelper from "./helpers/String";
import { TextEncoder } from 'util';

export interface BrowserUtility { 
   openWindow(uri:vscode.Uri | string, retryFunction:(...rest:any) => any, tryAgainMessage?:string, closeMessage?:string, ...rest:any): void;
}

export interface EncodingUtility {
   utf8encoder:TextEncoder;
   
   stringToBase64(string:string): string;
   bytesToBase64(bytes:Uint8Array): string;
   base64ToBytes(str:string): Uint8Array;
   base64ToString(str:string): string;
   bytesToHex(byteArray: Uint8Array): string;
   hexToBytes(hexString: string): Uint8Array;
}

export interface GuidUtility { 
   newGuid(): string;
   isGuid(parameter:string): boolean;
   trimGuid(id: string): string;
}

export interface ObjectUtility {
   isNullOrEmpty(source: any): boolean;
   isNull(source: any): boolean;
   isObject(source: any):boolean;
   asQuerystring(source:any): string;
   clone<T>(source: T, target?: any): T;
}

export interface StringUtility {
   parseUtcDate(date: string): Date;
   dateAsFilename(): string;
   withTrailingSlash(path: string | undefined): string;
   noTrailingSlash(string: string): string;
   noSlashes(string:string): string;
   powerShellSafe(value: string): string;
   plural(value:string): string;
}

export interface UtilityObject {
   readonly Browser: BrowserUtility;
   readonly Encoding: EncodingUtility;
   readonly Guid: GuidUtility;
   readonly $Object: ObjectUtility;
   readonly String: StringUtility;
}

export class Utilities {
   static get Browser(): BrowserUtility { return BrowserHelper; }
   static get Encoding(): EncodingUtility { return EncodingHelper; }
   static get Guid(): GuidUtility { return GuidHelper; }
   static get $Object(): ObjectUtility { return ObjectHelper; }
   static get String(): StringUtility { return StringHelper; }
}