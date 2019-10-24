export interface IDictionary<TKey, T> {
    add(key: TKey, value: T): void;
    remove(key: TKey): void;
    get(key: TKey): T;
    containsKey(key: TKey): boolean;
    keys(): TKey[];
    values(): T[];
}

export class Dictionary<TKey, T> implements IDictionary<TKey, T> {
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

    remove(key: TKey) {
        var index = this._keys.indexOf(key, 0);

        this._keys.splice(index, 1);
        this._values.splice(index, 1);
        
        delete this[key.toString()];
    }

    get(key: TKey): T {
        return this[key.toString()];
    }

    keys(): TKey[] {
        return this._keys;
    }

    values(): T[] {
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