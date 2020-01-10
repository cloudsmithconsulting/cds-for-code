export type EnumValueType = string | number;

export default class EnumParser {
    static getNamesAndValues<T extends EnumValueType>(e: any): { name: string, value: T }[] {
        return this.getNames(e).map(name => { return { name, value: e[name] as T }; });
    }

    static getNames(e: any): string[] {
        return Object.keys(e).filter(key => isNaN(+key));
    }

    static getNameFromValue<T extends EnumValueType>(e: any, value: T): string | null {
        const all = this.getNamesAndValues(e).filter(pair => pair.value === value);

        return all.length === 1 ? all[0].name : null;
    }

    static getValues<T extends EnumValueType>(e: any): T[] {
        return this.getNames(e).map(name => e[name]) as T[];
    }
}