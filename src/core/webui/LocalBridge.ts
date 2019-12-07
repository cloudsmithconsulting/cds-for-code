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
                case "WebViewBridge:response":
                    this.handleResponse(message);
                    break;
                case "WebViewBridge:request":
                    this.handleRequest(message);
                    break;
            }
        });
    }

    request(guid: string, method: string, params?: any[]) {
        // consider cancelling the timer if the promise if fulfilled before timeout is reached
        setTimeout(() => {
            const promiseCallbacks: IPromiseInfo<any> | undefined = this.promises.get(guid);
            if (promiseCallbacks) {
                promiseCallbacks.reject("Request timed out");
                this.promises.delete(guid);
            }
        }, this.timeout);

        this.webview.postMessage({
            command: "WebViewBridge:request",
            id: guid,
            method: method,
            params: params
        });
    }

    respond(guid: string, response: any, success: boolean = true): void {
        this.webview.postMessage({
            command: "WebViewBridge:response",
            id: guid,
            response: response,
            success: success
        });
    }
}