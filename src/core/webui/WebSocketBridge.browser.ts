import WebviewBridge from "./WebviewBridge";
import { IPromiseInfo } from "../types/PromiseInfo";
import * as WebSocket from "ws";

export class WebSocketBridge extends WebviewBridge {
    ws: WebSocket;

    constructor(ws: WebSocket) {
        super();
        this.ws = ws;
        this.ws.addEventListener("message", (event) => {
            const message: any = JSON.parse(event.data as string);
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
        const requestBody: any = {
            command: "WebViewBridge:request",
            id: guid,
            method: method,
            params: params
        };

        this.ws.send(JSON.stringify(requestBody));
    }

    respond(guid: string, response: any, success: boolean = true): void {
        const responseBody: any = {
            command: "WebViewBridge:response",
            id: guid,
            response: response,
            success: success
        };

        this.ws.send(JSON.stringify(responseBody));
    }
}