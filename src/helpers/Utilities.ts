import { performance } from "perf_hooks";
import * as vscode from 'vscode';
import { TextEncoder } from "util";

export default class Utilities
{
    public static IsNullOrEmpty(value: any) : boolean {
        return !(value && value.length > 0);
    }

    public static IsNull(value: any) : boolean
    {
        return typeof value === "undefined" || value === null;
    }

    //https://stackoverflow.com/a/8809472
    public static NewGuid() : string 
    {
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

    public static ParseDate(date: string) : Date
    {
        let regexMatch: RegExpExecArray | (string | number)[];
        
        if (typeof date === 'string') 
        {
            regexMatch = /^(\d{4})-(\d{2})-(\d{2})T(\d{2}):(\d{2}):(\d{2})(?:Z|[-+]\d{2}:\d{2})$/.exec(date);

            if (regexMatch) {
                return new Date(Date.UTC(+regexMatch[1], +regexMatch[2] - 1, +regexMatch[3], +regexMatch[4], +regexMatch[5], +regexMatch[6]));
            }
        }

        return new Date(date);        
    }

    public static IsGuid(parameter:string): boolean {
        try {
            const match = /[0-9A-F]{8}[-]?([0-9A-F]{4}[-]?){3}[0-9A-F]{12}/i.exec(parameter)[0];

            return !this.IsNull(match);
        }
        catch (error) {
            return false;
        }
    }    

    public static TrimGuid(id: string) {
        return (id || '').replace(/{|}/g, '');
    }

    public static EnforceTrailingSlash(path: string): string {
        if (!path.endsWith("/"))
        {
            path = `${path}/`;
        }

        return path;
    }

    public static RemoveTrailingSlash(string:string): string {
        return string.replace(/\/$/, "");
    }

    public static InitWebApiUrl(version:string): string {
        return '/api/data/v' + version + '/';
    }

    public static IsObject(obj):boolean {
        const type = typeof obj;
        return type === 'function' || type === 'object' && !!obj;
    }

    public static Clone<T>(src: any): T {
        let target = {};

        for (let prop in src) {
            if (src.hasOwnProperty(prop)) {
                // if the value is a nested object, recursively copy all it's properties
                if (Utilities.IsObject(src[prop])) {
                    target[prop] = Utilities.Clone(src[prop]);
                } else {
                    target[prop] = src[prop];
                }
            }
        }

        return <T>target;
    }

    public static OpenWindow(uri:vscode.Uri, retryFunction?:any, tryAgainMessage:string = "Try Again", closeMessage:string = "Close"): void
    {
        vscode.env.openExternal(uri).then(opened =>
        {
            if (!opened && retryFunction)
            {
                this.RetryWithMessage("There was a problem opening the Dynamics 365 browser window", retryFunction, tryAgainMessage, closeMessage);
            }
        });
    }

    public static RetryWithMessage(errorMessage:string, retryFunction:any, tryAgainMessage:string = "Try Again", closeMessage:string = "Close"): void
    {
        vscode.window
            .showErrorMessage(errorMessage, tryAgainMessage, closeMessage)
            .then(selectedItem =>
            {
                switch (selectedItem)
                {
                    case tryAgainMessage:
                        if (typeof retryFunction === "function")
                        {
                            retryFunction();
                        }

                        break;
                    case closeMessage:
                        break;
                }

                Promise.resolve(this);
            });
    }    

    public static BuildFunctionParameters(parameters?: any) : string {
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

    public static ObjectToQuerystring(source:any):string {
        return Object.keys(source).map(key => key + '=' + encodeURIComponent(source[key])).join('&');
    }

    public static ConvertToReferenceObject(responseData:any):any {
        const result = /\/(\w+)\(([0-9A-F]{8}[-]?([0-9A-F]{4}[-]?){3}[0-9A-F]{12})/i.exec(responseData["@odata.id"]);

        return { id: result[2], collection: result[1], oDataContext: responseData["@odata.context"] };
    }

    public static PowerShellSafeString(value: string) : string {
        return value.replace('$', '`$');
    }

    public static ToPlural(value:string): string { 
        if (value.endsWith("s")) {
            return `${value}es`;
        } else if (value.endsWith("y")) {
            return `${value.substring(0, value.length - 1)}ies`;
        } else {
            return `${value}s`;
        }
    }

    private static utf8encoder = new TextEncoder();
    
    // All solutions at MDN only provide a way to encode a native JS string to UTF-16 base64 string.
    // Here, you can apply any encoding supported by TextEncoder.
    public static Base64utf8Encode(str:string): string {
        return this.BytesToBase64(this.utf8encoder.encode(str));
    }

    public static BytesToBase64(bytes:Uint8Array): string {
        const base64abc = () => {
            let abc = [],
                A = "A".charCodeAt(0),
                a = "a".charCodeAt(0),
                n = "0".charCodeAt(0);
    
            for (let i = 0; i < 26; ++i) {
                abc.push(String.fromCharCode(A + i));
            }
            
            for (let i = 0; i < 26; ++i) {
                abc.push(String.fromCharCode(a + i));
            }
    
            for (let i = 0; i < 10; ++i) {
                abc.push(String.fromCharCode(n + i));
            }
    
            abc.push("+");
            abc.push("/");
    
            return abc;
        };

        const base64alphabet = base64abc();
        let result = '', i: number, l = bytes.length;

        for (i = 2; i < l; i += 3) {
            result += base64alphabet[bytes[i - 2] >> 2];
            result += base64alphabet[((bytes[i - 2] & 0x03) << 4) | (bytes[i - 1] >> 4)];
            result += base64alphabet[((bytes[i - 1] & 0x0F) << 2) | (bytes[i] >> 6)];
            result += base64alphabet[bytes[i] & 0x3F];
        }
        
        if (i === l + 1) { // 1 octet missing
            result += base64alphabet[bytes[i - 2] >> 2];
            result += base64alphabet[(bytes[i - 2] & 0x03) << 4];
            result += "==";
        }
        
        if (i === l) { // 2 octets missing
            result += base64alphabet[bytes[i - 2] >> 2];
            result += base64alphabet[((bytes[i - 2] & 0x03) << 4) | (bytes[i - 1] >> 4)];
            result += base64alphabet[(bytes[i - 1] & 0x0F) << 2];
            result += "=";
        }
        
        return result;
    }    
}