/* must specify ".js" for import in browser to locate rpc-common.js
 see: https://github.com/microsoft/TypeScript/issues/16577#issuecomment-343610106
*/

import WebviewBridge from "./WebviewBridge.js";
import { IPromiseInfo } from "../types/PromiseInfo";
import { Webview } from "vscode";

export class LocalBridge extends WebviewBridge {
    window: any;
    vscode: Webview;

    constructor(window: any, vscode: Webview) {
        super();
        this.window = window;
        this.vscode = vscode;
        this.window.addEventListener("message", (event) => {
            const message = event.data;
            switch (message.command) {
                case "rpc-response":
                    this.handleResponse(message);
                    break;
                case "rpc-request":
                    this.handleRequest(message);
                    break;
            }
        });
    }

    request(id: number, method: string, params?: any[]) {
        // TODO: consider cancelling the timer if the promise if fulfilled before timeout is reached
        setTimeout(() => {
            const promiseCallbacks: IPromiseInfo<any> | undefined = this.promises.get(id);
            if (promiseCallbacks) {
                promiseCallbacks.reject("Request timed out");
                this.promises.delete(id);
            }
        }, this.timeout);

        // TODO: find an alternative to appending vscode to the global scope (perhaps providing vscode as parameter to constructor)
        this.vscode.postMessage({
            command: "rpc-request",
            id: id,
            method: method,
            params: params
        });
    }

    respond(id: number, response: any, success: boolean = true): void {
        this.vscode.postMessage({
            command: "rpc-response",
            id: id,
            response: response,
            success: success
        });
    }
}