import * as path from 'path';
import * as FileSystem from "../../core/io/FileSystem";
import nodeJsRequest from './nodeJsRequest';

export default async function download(remoteFilePath: string, localFilePath: string): Promise<string> {
    let mimeType: string;

    switch (path.extname(localFilePath)) {
        case ".zip":
            mimeType = "application/x-zip-compressed";
            break;
        case ".ps1":
            mimeType = "text/plain";
            break;
        case ".css":
            mimeType = "text/css";
            break;
        case ".js":
            mimeType = "application/x-javascript";
            break;
        case ".json":
            mimeType = "application/json";
            break;
        default:
            mimeType = "*";
            break;
    }

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
}