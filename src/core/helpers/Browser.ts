import * as vscode from 'vscode';
import * as opn from "opn";
import Quickly from "../Quickly";

export default class Browser {
    static openWindow(uri:vscode.Uri | string, retryFunction:(...rest:any) => any, tryAgainMessage:string = "Try Again", closeMessage:string = "Close", ...rest:any): void {
        if (uri instanceof vscode.Uri) {
            vscode.env.openExternal(<vscode.Uri>uri).then(opened => {
                if (!opened && retryFunction) {
                    Quickly.askToRetry("There was a problem opening the Dynamics 365 browser window", retryFunction, tryAgainMessage, closeMessage, rest);
                }
            });
        } else {
            // Cross platform, and cross browser me, please :)
            opn(<string>uri);
        }
    }
}
