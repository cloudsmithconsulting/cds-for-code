import * as xml2js from 'xml2js';
import * as fs from 'fs';

export default class XmlParser {
    public static async parseFile(file:string, encoding:string = 'utf8'): Promise<any> {
        return new Promise((resolve, reject) => {
            if (fs.existsSync(file)) {
                xml2js.parseString(fs.readFileSync(file, encoding), (error, results) => {
                    if (error) { reject(error); }
                    if (results) { resolve(results); }
                });
            } else { 
                reject(new Error(`The file '${file}' does not exist.`)); 
            }
        });
    }

    public static async parseString(xmlString:string): Promise<any> {
        return new Promise((resolve, reject) => {
            xml2js.parseString(xmlString, (error, results) => {
                if (error) { reject(error); }
                if (results) { resolve(results); }
            });
        });
    }

    public static async createXml(object:any, options?:xml2js.OptionsV2): Promise<string> {
        const builder = new xml2js.Builder(options);
        
        return Promise.resolve(builder.buildObject(object));
    }
}