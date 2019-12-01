import { performance } from "perf_hooks";
import * as vscode from 'vscode';
import { TextEncoder } from "util";
import * as opn from "opn";
import Quickly from "./Quickly";

export namespace Utilities {
    export class String {
        static ParseDate(date: string) : Date {
            let regexMatch: RegExpExecArray | (string | number)[];
            
            if (typeof date === 'string') {
                regexMatch = /^(\d{4})-(\d{2})-(\d{2})T(\d{2}):(\d{2}):(\d{2})(?:Z|[-+]\d{2}:\d{2})$/.exec(date);
    
                if (regexMatch) {
                    return new Date(Date.UTC(+regexMatch[1], +regexMatch[2] - 1, +regexMatch[3], +regexMatch[4], +regexMatch[5], +regexMatch[6]));
                }
            }
    
            return new Date(date);        
        }

        static dateAsFilename():string {
            let dateString = new Date().toISOString();
    
            dateString = dateString.substr(0, dateString.length - 5);
            dateString = dateString.replace("T", "-").replace(":", "").replace(":", "");
           
            return dateString;
        }
    
        static NormalizeLineBreaks(value: string): string {
            return value.replace("\r\n", "\n").replace("\n\r", "\n").replace("\n", "\r\n");
        }

        static EnforceTrailingSlash(path: string | undefined): string {
            if (path && !path.endsWith("/")) {
                path = `${path}/`;
            }

            return path ? path : "";
        }

        static RemoveTrailingSlash(string:string): string {
            return string.replace(/\/$/, "");
        }

        static PowerShellSafeString(value: string) : string {
            return value.replace('$', '`$');
        }
    
        static ToPlural(value:string): string { 
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
        static IsNullOrEmpty(value: any): boolean {
            return !(value && value.length > 0);
        }

        static IsNull(value: any): boolean {
            return typeof value === "undefined" || value === null;
        }        

        static IsObject(obj):boolean {
            const type = typeof obj;
    
            return type === 'function' || type === 'object' && !!obj;
        }

        static ConvertToReferenceObject(responseData:any):any {
            const result = /\/(\w+)\(([0-9A-F]{8}[-]?([0-9A-F]{4}[-]?){3}[0-9A-F]{12})/i.exec(responseData["@odata.id"]);
    
            return { id: result[2], collection: result[1], oDataContext: responseData["@odata.context"] };
        }
    
        static ToQuerystring(source:any):string {
            return Object.keys(source).map(key => key + '=' + encodeURIComponent(source[key])).join('&');
        }
    
        static Clone<T>(src: T, target?: any): T {
            if (!target) { 
                target = {};
            }
    
            for (let prop in src) {
                if (src.hasOwnProperty(prop)) {
                    // if the value is a nested object, recursively copy all it's properties
                    if (this.IsObject(src[prop])) {
                        target[prop] = this.Clone(src[prop]);
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
        static NewGuid(): string {
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

        static IsGuid(parameter:string): boolean {
            try {
                const match = /[0-9A-F]{8}[-]?([0-9A-F]{4}[-]?){3}[0-9A-F]{12}/i.exec(parameter)[0];
    
                return !$Object.IsNull(match);
            }
            catch (error) {
                return false;
            }
        }    
    
        static TrimGuid(id: string):string {
            return (id || '').replace(/{|}/g, '');
        }
    }
    
    export class WebApi { 
        static InitWebApiUrl(version:string): string {
            return '/api/data/v' + version + '/';
        }

        static BuildFunctionParameters(parameters?: any) : string {
            if (parameters) {
                var parameterNames = Object.keys(parameters);
                var functionParameters = "";
                var urlQuery = "";
        
                for (var i = 1; i <= parameterNames.length; i++) {
                    var parameterName = parameterNames[i - 1];
                    var value = parameters[parameterName];
        
                    if (value === undefined || value === null) {
                        continue;
                    }
        
                    if (typeof value === "string") {
                        value = "'" + value + "'";
                    }
                    else if (typeof value === "object") {
                        value = JSON.stringify(value);
                    }
        
                    if (i > 1) {
                        functionParameters += ",";
                        urlQuery += "&";
                    }
        
                    functionParameters += parameterName + "=@p" + i;
                    urlQuery += "@p" + i + "=" + value;
                }
        
                return "(" + functionParameters + ")?" + urlQuery;
            }
            else {
                return "()";
            }
        }    
    }

    export class Browser {
        static OpenWindow(uri:vscode.Uri | string, retryFunction:(...rest:any) => any, tryAgainMessage:string = "Try Again", closeMessage:string = "Close", ...rest:any): void {
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
        
        static StringToBase64(string:string): string {
            return this.BytesToBase64(this.utf8encoder.encode(string));
        }
    
        static BytesToBase64(bytes:Uint8Array): string {
            return Buffer.from(bytes).toString("base64");
        }    
    
        static Base64ToBytes(str:string): Uint8Array {
            return this.utf8encoder.encode(Buffer.from(str, "base64").toString());
        }
    
        static Base64ToString(str:string): string { 
            return Buffer.from(str, "base64").toString();
        }
    }
}