export default class Object {
    static isNullOrEmpty(value: any): boolean {
        return !(value && value.length > 0);
    }

    static isNull(value: any): boolean {
        return typeof value === "undefined" || value === null;
    }        

    static isObject(obj):boolean {
        const type = typeof obj;

        return type === 'function' || type === 'object' && !!obj;
    }

    static asQuerystring(source:any):string {
        return global.Object.keys(source).map(key => key + '=' + encodeURIComponent(source[key])).join('&');
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