export interface IDictionary<TKey, T> {
    add(key: TKey, value: T): void;
    insert(index: number, key: TKey, value: T);
    containsKey(key: TKey): boolean;
    get(key: TKey): T;
    getKey(value: T): TKey;
    keys: TKey[];
    length: number;
    remove(key: TKey): void;
    values: T[];
}

export default class Dictionary<TKey, T> implements IDictionary<TKey, T> {
    _keys: TKey[] = [];
    _values: T[] = [];

    constructor(init?: { key: TKey; value: T; }[]) {
        if (init) {
            for (var x = 0; x < init.length; x++) {
                this.add(init[x].key, init[x].value);
            }
        }
    }

    add(key: TKey, value: T) {
        this[key.toString()] = value;

        this._keys.push(key);
        this._values.push(value);
    }

    insert(index: number, key: TKey, value: T) {
        this[key.toString()] = value;

        this._keys.splice(index, 0, key);
        this._values.splice(index, 0, value);
    }

    remove(key: TKey) {
        const index = this._keys.indexOf(key, 0);

        this._keys.splice(index, 1);
        this._values.splice(index, 1);
        
        delete this[key.toString()];
    }

    get(key: TKey): T {
        return this[key.toString()];
    }

    getKey(value: T): TKey {
        const index = this._values.indexOf(value);

        if (index > -1) {
            return this._keys[index];
        }

        return undefined;
    }

    get keys(): TKey[] {
        return this._keys;
    }

    get length(): number {
        return this._keys.length;
    }

    get values(): T[] {
        return this._values;
    }

    containsKey(key: TKey) {
        if (typeof this[key.toString()] === "undefined") {
            return false;
          }
  
          return true;
    }

    toLookup(): IDictionary<TKey, T> {
        return this;
    }
}