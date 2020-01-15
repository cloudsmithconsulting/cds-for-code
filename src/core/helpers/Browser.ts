import * as vscode from 'vscode';
import * as opn from "opn";
import logger from '../framework/Logger';

export async function openWindow(uri:vscode.Uri | string): Promise<void> {
    if (uri instanceof vscode.Uri) {
        return await vscode.env.openExternal(<vscode.Uri>uri).then(opened => {
            if (!opened) {
                throw new Error(`Could not open window for '${uri.toString()}`);
            } else {
                logger.info(`Browser: ${uri.toString()} opened by 'vscode.env.openExternal'`);
            }
        });
    } else {
        // Cross platform, and cross browser me, please :)
        return Promise.resolve(opn(<string>uri))
            .then(() => logger.info(`Browser: ${uri.toString()} opened by 'opn'`));
    }
}