import WebviewBridge from "./WebviewBridge";
import { IPromiseInfo } from "../types/PromiseInfo";
import * as WebSocket from "ws";

export class WebSocketBridge extends WebviewBridge {
    ws: WebSocket;

    constructor(ws: WebSocket) {
        super();
        this.ws = ws;
        this.ws.on("message", message => {
            // assuming message is a stringified JSON
            const messageObject: any = JSON.parse(message as string);

            switch (messageObject.command) {
                case "WebViewBridge:response":
                    this.handleResponse(messageObject);
                    break;
                case "WebViewBridge:request":
                    this.handleRequest(messageObject);
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

        const requestObject: any = {
            command: "WebViewBridge:request",
            id: guid,
            method: method,
            params: params
        };

        this.ws.send(JSON.stringify(requestObject));
    }

    respond(guid: string, response: any, success: boolean = true): void {
        const responseObject: any = {
            command: "WebViewBridge:response",
            id: guid,
            response: response,
            success: success
        };

        this.ws.send(JSON.stringify(responseObject));
    }
}