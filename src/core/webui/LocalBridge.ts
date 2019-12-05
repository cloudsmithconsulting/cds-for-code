import * as vscode from "vscode";
import { IPromiseInfo } from "../types/PromiseInfo";
import WebviewBridge from "./WebviewBridge";

export class LocalBridge extends WebviewBridge {
    webview: vscode.Webview;

    constructor(webview: vscode.Webview) {
        super();
        this.webview = webview;
        this.webview.onDidReceiveMessage(message => {
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
        // consider cancelling the timer if the promise if fulfilled before timeout is reached
        setTimeout(() => {
            const promiseCallbacks: IPromiseInfo<any> | undefined = this.promises.get(id);
            if (promiseCallbacks) {
                promiseCallbacks.reject("Request timed out");
                this.promises.delete(id);
            }
        }, this.timeout);

        this.webview.postMessage({
            command: "rpc-request",
            id: id,
            method: method,
            params: params
        });
    }

    respond(id: number, response: any, success: boolean = true): void {
        this.webview.postMessage({
            command: "rpc-response",
            id: id,
            response: response,
            success: success
        });
    }
}