import { performance } from "perf_hooks";

export class Utilities
{
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

    public static TrimGuid(id: string) {
        return (id || '').replace(/{|}/g, '');
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

    public static FormatDynamicsResponse(data: any): any {
        var items = []; 
        if (data && data.error) {
            throw new Error(data.error);
        }
        if (data && data.value) {
            data = data.value;
        }
        if (!Array.isArray(data)) {
            return Utilities.FormatDynamicsResponse([data])[0];
        }
        if (data) {
            for (var item of data) {
                let row:any = {};
    
                for (let key in item) {
                    var name: string = key;
    
                    if (name.indexOf('@odata') === 0) {
                        continue;
                    }
    
                    if (name.indexOf('transactioncurrencyid') > -1) {
                        continue;
                    }
    
                    if (name.indexOf('@') > -1) {
                        name = name.substring(0, name.indexOf('@'));
    
                        if (name.indexOf('_') === 0) {
                            name = name.slice(1, -6);
                        }
                        
                        name += "_formatted";
                    }
                    else if (name.indexOf('_') === 0) {
                        name = name.slice(1, -6);
                    }
    
                    if (name.indexOf('_x002e_') > -1) {
                        var obj = name.substring(0, name.indexOf('_x002e_'));
                        name = name.substring(name.indexOf('_x002e_') + 7);
    
                        if (!row[obj]) {
                            row[obj] = {};
                        }
                        row[obj][name] = item[key];
                    }
                    else {
                        row[name] = item[key];
                    }
                }
                items.push(row);
            }
        }
        return items;
    }    
}