export function isNullOrEmpty(source: any): boolean {
    return !(source && source.length > 0);
}

export function isNull(source: any): boolean {
    return typeof source === "undefined" || source === null;
}        

export function isObject(source: any):boolean {
    const type = typeof source;

    return type === 'function' || type === 'object' && !!source;
}

export function asQuerystring(source:any):string {
    return global.Object.keys(source).map(key => key + '=' + encodeURIComponent(source[key])).join('&');
}

export function clone<T extends Object>(source: T, target?: any, excludeProperties?: string[]): T {
    if (!target) { 
        target = {};
    }

    for (let prop in source) {
        if (source.hasOwnProperty(prop) && (!excludeProperties || excludeProperties.indexOf(prop) === -1)) {
            // we deep clone here
            if (isObject(source[prop])) {
                target[prop] = Object.assign({}, source[prop]);
            } else {
                target[prop] = source[prop];
            }
        }
    }

    return <T>target;
}

export function createInstance<T>(context: Object, name: string, ...args: any[]) : T {
    const instance = Object.create(context[name].prototype);
    
    instance.constructor.apply(instance, args);

    return <T> instance;
}