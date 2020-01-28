import * as path from 'path';
import * as FileSystem from "../../core/io/FileSystem";
import fetch from 'node-fetch';
import nodeJsRequest from './nodeJsRequest';
import Dictionary from '../types/Dictionary';
import ExtensionContext from '../ExtensionContext';

const mimeTypes = new Dictionary<string, string>([
    { key: ".zip", value: "application/x-zip-compressed" },
    { key: ".ps1", value: "text/plain" },
    { key: ".css", value: "text/css" },
    { key: ".js", value: "application/javascript" },
    { key: ".json", value: "application/json" },
    { key: ".svg", value: "image/svg+xml" },
    { key: ".gif", value: "image/gif" },
    { key: ".jpg", value: "image/jpeg" }
]);

export default async function download(remoteFilePath: string, localFilePath: string): Promise<string> {
    const extension = path.extname(localFilePath);
    let mimeType: string;

    if (mimeTypes.containsKey(extension)) {
        mimeType = mimeTypes.get(extension);
    } else {
        mimeType = "*/*";
    }

    return fetch(remoteFilePath, { method: 'get', headers: { 'Accepts': mimeType } })
        .then(res => res.text())
        .then(async body => {
            if (remoteFilePath.indexOf('manifest.json') !== -1 && body.indexOf('<?xml') !== -1) {
                // we got an error, use manifest from local dev
                const manifestPath = path.join(ExtensionContext.Instance.extensionPath, 'dist/manifest.json');
                if (FileSystem.exists(manifestPath)) {
                    await FileSystem.copyItem(manifestPath, localFilePath);
                    return localFilePath;
                }
            }
            FileSystem.writeFileSync(localFilePath, body);

            return localFilePath;
        }).catch(error => {
            throw error;
        });  

    /*
    TODO: fix me
    return new Promise((resolve, reject) => {
        nodeJsRequest({
            method: 'GET',
            timeout: 10000,
            uri: remoteFilePath,
            additionalHeaders: { 'Accepts': mimeType },
            successCallback: response => {
                FileSystem.writeFileSync(localFilePath, response.data);

                resolve(localFilePath);
            },
            errorCallback: error => {
                error.localPath = localFilePath;

                reject(error);
            }
        });
    });
    */
}