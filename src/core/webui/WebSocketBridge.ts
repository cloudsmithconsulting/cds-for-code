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
        case "rpc-response":
          this.handleResponse(messageObject);
          break;
        case "rpc-request":
          this.handleRequest(messageObject);
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

    const requestObject: any = {
      command: "rpc-request",
      id: id,
      method: method,
      params: params
    };

    this.ws.send(JSON.stringify(requestObject));
  }

  respond(id: number, response: any, success: boolean = true): void {
    const responseObject: any = {
      command: "rpc-response",
      id: id,
      response: response,
      success: success
    };

    this.ws.send(JSON.stringify(responseObject));
  }
}