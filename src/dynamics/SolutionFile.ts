import * as vscode from 'vscode';
import * as cs from '../cs';
import * as FileSystem from "../helpers/FileSystem";
import * as path from 'path';
import { TS } from 'typescript-linq/TS';
import XmlParser from '../helpers/XmlParser';
import { DynamicsWebApi } from '../api/Types';

export default class SolutionFile {
    get file():string { return this._file; }
    
    private _file:string;
    private _xml:string;
    
    private constructor(file?:string, xml?:string) {
        this._file = file;
        this._xml = xml || this._file && FileSystem.exists(this._file) ? FileSystem.readFileSync(this._file) : undefined;
     }

    static from(file?:string) { return new SolutionFile(file); }
    static xml(input?:string) { return new SolutionFile(undefined, input); }

    get data(): Promise<any> { 
        if (this._file && !this._xml) { 
            this._xml = FileSystem.readFileSync(this._file);
        }
        
        return XmlParser.parseString(this._xml);
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

    get components(): Promise<SolutionComponentElement[]> {
        return this.solutionManifest.then(manifest => manifest ? manifest.RootComponents : undefined);
    }    
}

export class SolutionComponentElement {
    type: DynamicsWebApi.SolutionComponent;
    schemaName: string;
    behavior: number;
}