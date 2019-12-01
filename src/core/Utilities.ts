import { performance } from "perf_hooks";
import * as vscode from 'vscode';
import { TextEncoder } from "util";
import * as opn from "opn";
import Quickly from "./Quickly";

export namespace Utilities {
    export class String {
        static parseUtcDate(date: string) : Date {
            let regexMatch: RegExpExecArray | (string | number)[];
            
            if (typeof date === 'string') {
                regexMatch = /^(\d{4})-(\d{2})-(\d{2})T(\d{2}):(\d{2}):(\d{2})(?:Z|[-+]\d{2}:\d{2})$/.exec(date);
    
                if (regexMatch) {
                    return new Date(Date.UTC(+regexMatch[1], +regexMatch[2] - 1, +regexMatch[3], +regexMatch[4], +regexMatch[5], +regexMatch[6]));
                }
            }
    
            return new Date(date);        
        }

        static dateAsFilename(): string {
            const now = new Date();
            let dateString = now.toISOString();

            dateString = dateString.substr(0, dateString.length - 5);
            dateString = dateString.replace("T", "-").replace(":", "").replace(":", "");
           
            return dateString;
        }

        static withTrailingSlash(path: string | undefined): string {
            if (path && !path.endsWith("/")) {
                path = `${path}/`;
            }

            return path ? path : "";
        }

        static noTrailingSlash(string: string): string {
            if (string.endsWith("/") || string.endsWith("\\")) {
                string = string.substr(0, string.length - 1);
            }

            return string;
        }

        static noSlashes(string:string): string {
            return string.replace(/\/$/, "");
        }

        static powerShellSafe(value: string) : string {
            return value.replace('$', '`$');
        }
    
        static plural(value:string): string { 
            if (value.endsWith("s")) {
                return `${value}es`;
            } else if (value.endsWith("y")) {
                return `${value.substring(0, value.length - 1)}ies`;
            } else {
                return `${value}s`;
            }
        }
   
    }

    export class $Object {
        static isNullOrEmpty(value: any): boolean {
            return !(value && value.length > 0);
        }

        static IsNull(value: any): boolean {
            return typeof value === "undefined" || value === null;
        }        

        static isObject(obj):boolean {
            const type = typeof obj;
    
            return type === 'function' || type === 'object' && !!obj;
        }
    
        static asQuerystring(source:any):string {
            return Object.keys(source).map(key => key + '=' + encodeURIComponent(source[key])).join('&');
        }
    
        static clone<T>(src: T, target?: any): T {
            if (!target) { 
                target = {};
            }
    
            for (let prop in src) {
                if (src.hasOwnProperty(prop)) {
                    // if the value is a nested object, recursively copy all it's properties
                    if (this.isObject(src[prop])) {
                        target[prop] = this.clone(src[prop]);
                    } else {
                        target[prop] = src[prop];
                    }
                }
            }
    
            return <T>target;
        }
    }

    export class Guid { 
        //https://stackoverflow.com/a/8809472
        static newGuid(): string {
            var d = new Date().getTime();

            if (typeof performance !== 'undefined' && typeof performance.now === 'function') {
                d += performance.now(); //use high-precision timer if available
            }
            
            return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
                var r = (d + Math.random() * 16) % 16 | 0;

                d = Math.floor(d / 16);
                
                return (c === 'x' ? r : (r & 0x3 | 0x8)).toString(16);
            });
        }    

        static isGuid(parameter:string): boolean {
            try {
                const match = /[0-9A-F]{8}[-]?([0-9A-F]{4}[-]?){3}[0-9A-F]{12}/i.exec(parameter)[0];
    
                return !$Object.IsNull(match);
            }
            catch (error) {
                return false;
            }
        }    
    
        static trimGuid(id: string):string {
            return (id || '').replace(/{|}/g, '');
        }
    }
    
    export class Browser {
        static openWindow(uri:vscode.Uri | string, retryFunction:(...rest:any) => any, tryAgainMessage:string = "Try Again", closeMessage:string = "Close", ...rest:any): void {
            if (uri instanceof vscode.Uri) {
                vscode.env.openExternal(<vscode.Uri>uri).then(opened => {
                    if (!opened && retryFunction) {
                        Quickly.askToRetry("There was a problem opening the Dynamics 365 browser window", retryFunction, tryAgainMessage, closeMessage, rest);
                    }
                });
            } else {
                // Cross platform, and cross browser me, please :)
                opn(<string>uri);
            }
        }
    }

    export class Encoding { 
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
}