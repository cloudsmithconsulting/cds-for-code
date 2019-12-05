// must specify ".js" for import in browser to locate rpc-common.js
// see: https://github.com/microsoft/TypeScript/issues/16577#issuecomment-343610106

import WebviewBridge from "./WebviewBridge.js";
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
        const requestBody: any = {
            command: "rpc-request",
            id: id,
            method: method,
            params: params
        };

        this.ws.send(JSON.stringify(requestBody));
    }

    respond(id: number, response: any, success: boolean = true): void {
        const responseBody: any = {
            command: "rpc-response",
            id: id,
            response: response,
            success: success
        };

        this.ws.send(JSON.stringify(responseBody));
    }
}