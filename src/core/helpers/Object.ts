export function isNullOrEmpty(value: any): boolean {
    return !(value && value.length > 0);
}

export function isNull(value: any): boolean {
    return typeof value === "undefined" || value === null;
}        

export function isObject(obj):boolean {
    const type = typeof obj;

    return type === 'function' || type === 'object' && !!obj;
}

export function asQuerystring(source:any):string {
    return global.Object.keys(source).map(key => key + '=' + encodeURIComponent(source[key])).join('&');
}

export function clone<T>(src: T, target?: any): T {
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