import { performance } from "perf_hooks";

//https://stackoverflow.com/a/8809472
export function newGuid(): string {
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

export function isGuid(parameter:string): boolean {
    try {
        const matches = /[0-9A-F]{8}[-]?([0-9A-F]{4}[-]?){3}[0-9A-F]{12}/i.exec(parameter);
        const match = matches && matches.length > 0 ? matches[0] : undefined;

        return !(typeof match === "undefined" || match === null);
    }
    catch (error) {
        return false;
    }
}    

export function trimGuid(id: string): string {
    return (id || '').replace(/{|}/g, '');
}