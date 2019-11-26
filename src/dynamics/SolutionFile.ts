import * as FileSystem from "../core/FileSystem";
import * as path from 'path';
import XmlParser from '../core/XmlParser';
import { DynamicsWebApi } from '../api/Types';

export default class SolutionFile {
    get file():string { return this._file; }
    
    private _file:string;
    private _xml:string;
    private _data:any;
    
    private constructor(file?:string, xml?:string) {
        this._file = file;
        this._xml = xml || this._file && FileSystem.exists(this._file) ? FileSystem.readFileSync(this._file) : undefined;
     }

    static async from(file?:string): Promise<SolutionFile> { const returnObject = new SolutionFile(file); await returnObject.data; return returnObject; }
    static async xml(input?:string): Promise<SolutionFile> { const returnObject = new SolutionFile(undefined, input); await returnObject.data; return returnObject; }

    async save(file?:string): Promise<void> {
        const save = await XmlParser.createXml(await this.data);

        FileSystem.makeFolderSync(path.dirname(file));
        FileSystem.writeFileSync(file, save);
    }

    get data(): Promise<any> { 
        if (!this._data) {
            if (this._file && !this._xml) { 
                this._xml = FileSystem.readFileSync(this._file);
            }

            return XmlParser.parseString(this._xml).then(results => this._data = results).then(() => this._data);
        }
        
        return Promise.resolve(this._data);
    }

    toString(): string | undefined { return this._xml; }

    get solutionManifests(): Promise<any[]> {
        return this.data.then(xml => xml
            && xml.ImportExportXml 
            && xml.ImportExportXml.SolutionManifest  
                ? xml.ImportExportXml.SolutionManifest
                : []);
    }

    get solutionManifest(): Promise<any> {
        return this.solutionManifests.then(manifests => manifests.length > 0 ? manifests[0] : undefined);
    }

    get isValid(): Promise<boolean> {
        return this.solutionManifest.then(manifest => manifest && manifest.UniqueName); 
    }

    get uniqueName(): Promise<string> {
        return this.solutionManifest.then(manifest => manifest.UniqueName.toString());
    }

    get localizedNames(): Promise<any[]> {
        return this.solutionManifest.then(manifest => manifest && manifest.LocalizedNames ? manifest.LocalizedNames : []);
    }

    get descriptions(): Promise<any[]> {
        return this.solutionManifest.then(manifest => manifest && manifest.Descriptions ? manifest.Descriptions : []);
    }

    get version(): Promise<string> {
        return this.solutionManifest.then(manifest => manifest && manifest.Version ? manifest.Version : undefined);
    }

    get isManaged(): Promise<boolean> {
        return this.solutionManifest.then(manifest => manifest && manifest.Managed && manifest.Managed === "1");
    }

    get publisher(): Promise<any> {
        return this.solutionManifest.then(manifest => manifest ? manifest.Publisher : undefined);
    }

    get components(): Promise<SolutionFileComponentElement[]> {
        return this.solutionManifest
            .then(manifest => {
                const returnValue = manifest 
                    && manifest.RootComponents 
                    && manifest.RootComponents.length > 0
                    && manifest.RootComponents[0].RootComponent 
                    && manifest.RootComponents[0].RootComponent.length > 0 
                    ? manifest.RootComponents[0].RootComponent.map(c => new SolutionFileComponentElement(c.$.type, c.$.id, c.$.schemaName, c.$.behavior)) 
                    : [];

                return returnValue;
            });
    }    

    async addComponent(type:DynamicsWebApi.SolutionComponent | number, id?:string, schemaName?:string, behavior?:number): Promise<void> {
        const components = await this.components;
        let typeCode = parseInt(type.toString());
    
        if (!Number.isInteger(typeCode)) {
            typeCode = DynamicsWebApi.CodeMappings.getSolutionComponentCode(<DynamicsWebApi.SolutionComponent>type);
        }

        if (schemaName && components.findIndex(c => c.type === typeCode && c.schemaName === schemaName) === -1) {
            components.push(new SolutionFileComponentElement(type, undefined, schemaName, behavior));
        } else if (id && components.findIndex(c => c.type === typeCode && c.id === id) === -1) {
            components.push(new SolutionFileComponentElement(type, id, undefined, behavior));
        }

        if (this._data) {
            this._data.ImportExportXml.SolutionManifest[0].RootComponents[0].RootComponent = components.map(c => c.xml);
        }
    }

    async removeComponent(type:DynamicsWebApi.SolutionComponent | number, id?:string, schemaName?:string): Promise<number> {
        const components = await this.components;
        let typeCode = parseInt(type.toString());
    
        if (!Number.isInteger(typeCode)) {
            typeCode = DynamicsWebApi.CodeMappings.getSolutionComponentCode(<DynamicsWebApi.SolutionComponent>type);
        }

        let index:number;
        
        if (schemaName) {
            index = components.findIndex(c => c.type === typeCode && c.schemaName === schemaName);
        } else if (id) {
            index = components.findIndex(c => c.type === typeCode && c.id === id);
        }

        if (index && index > -1) {
            components.splice(index, 1);
        }

        if (this._data) {
            this._data.ImportExportXml.SolutionManifest[0].RootComponents[0].RootComponent = components.map(c => c.xml);
        }

        return index;
    }
}

class SolutionFileComponentElement {
    constructor(type:DynamicsWebApi.SolutionComponent | number, id?:string, schemaName?:string, behavior?:number) {
        const typeCode = parseInt(type.toString());
    
        if (!Number.isInteger(typeCode)) {
            this.type = DynamicsWebApi.CodeMappings.getSolutionComponentCode(<DynamicsWebApi.SolutionComponent>type);
        } else {
            this.type = typeCode;
        }

        if (id) { this.id = id; }
        if (schemaName) { this.schemaName = schemaName; }
        if (behavior !== undefined) { this.behavior = behavior; }
    }

    id: string;
    type: number;
    schemaName: string;
    behavior: number;

    get xml(): any { 
        return { $: { type: this.type, schemaName: this.schemaName, behavior: this.behavior, id: this.id } };
    }
}