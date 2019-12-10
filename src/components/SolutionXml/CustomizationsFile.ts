import * as FileSystem from "../../core/io/FileSystem";
import * as path from 'path';
import Xml from '../../core/io/Xml';
import { CdsSolutions } from "../../api/CdsSolutions";

export default class CustomizationsFile {
    get file():string { return this._file; }
    
    private _file:string;
    private _xml:string;
    private _data:any;
    
    private constructor(file?:string, xml?:string) {
        this._file = file;
        this._xml = xml || this._file && FileSystem.exists(this._file) ? FileSystem.readFileSync(this._file) : undefined;
     }

    static async from(file?:string): Promise<CustomizationsFile> { const returnObject = new CustomizationsFile(file); await returnObject.data; return returnObject; }
    static async xml(input?:string): Promise<CustomizationsFile> { const returnObject = new CustomizationsFile(undefined, input); await returnObject.data; return returnObject; }

    async save(file?:string): Promise<void> {
        const save = await Xml.createXml(await this.data);

        FileSystem.makeFolderSync(path.dirname(file));
        FileSystem.writeFileSync(file, save);
    }

    get data(): Promise<any> { 
        if (!this._data) {
            if (this._file && !this._xml) { 
                this._xml = FileSystem.readFileSync(this._file);
            }

            return Xml.parseString(this._xml).then(results => this._data = results).then(() => this._data);
        }
        
        return Promise.resolve(this._data);
    }

    toString(): string | undefined { return this._xml; }

    get importExportXml(): Promise<any[]> {
        return this.data.then(xml => xml
            && xml.ImportExportXml 
                ? xml.ImportExportXml
                : []);
    }

    async addElement(elementName: string): Promise<void> {
        const importExportXml = await this.importExportXml;

        if (!importExportXml.hasOwnProperty(elementName)) {
            importExportXml[elementName] = [ "" ];

            if (this._data) {
                this._data.ImportExportXml = importExportXml;
            }
        }
    }

    async removeElement(elementName: string): Promise<void> {
        const importExportXml = await this.importExportXml;

        if (importExportXml.hasOwnProperty(elementName)) {
            delete importExportXml[elementName];

            if (this._data) {
                this._data.ImportExportXml = importExportXml;
            }
        }
    }
}