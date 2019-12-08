import WebviewBridge from "./WebviewBridge";
import { IPromiseInfo } from "../types/PromiseInfo";
import { Webview } from "vscode";

export class LocalBridge extends WebviewBridge {
    window: any;
    vscode: Webview;

    constructor(window: HTMLElement, vscode: Webview) {
        super();
        this.window = window;
        this.vscode = vscode;
        this.window.addEventListener("message", (event: any) => {
            const message = event.data;
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
        // TODO: consider cancelling the timer if the promise if fulfilled before timeout is reached
        setTimeout(() => {
            const promiseCallbacks: IPromiseInfo<any> | undefined = this.promises.get(guid);
            if (promiseCallbacks) {
                promiseCallbacks.reject("Request timed out");
                this.promises.delete(guid);
            }
        }, this.timeout);

        // TODO: find an alternative to appending vscode to the global scope (perhaps providing vscode as parameter to constructor)
        this.vscode.postMessage({
            command: "WebViewBridge:request",
            id: guid,
            method: method,
            params: params
        });
    }

    respond(guid: string, response: any, success: boolean = true): void {
        this.vscode.postMessage({
            command: "WebViewBridge:response",
            id: guid,
            response: response,
            success: success
        });
    }
}