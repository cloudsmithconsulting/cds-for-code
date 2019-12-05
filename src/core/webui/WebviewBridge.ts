import PromiseInfo, { IPromiseInfo } from "../types/PromiseInfo";

export interface IWebviewBridge {
    invoke(method: string, params?: any): Promise<any>;
    request(id: number, method: string, params?: any[]): void;
    respond(id: number, response: any, success?: boolean): void;
    handleResponse(message: any): void;
    handleRequest(message: any): void;
    add(method: IFunctionReference): void;
    remove(method: IFunctionReference): void;
    setTimeout(timeout: number): void;
    locals(): string[];
    remote(): Promise<string[]>;
}

export interface IFunctionReference {
    func: Function;
    thisArg?: any;
    name?: string;
}

export default abstract class WebviewBridge implements IWebviewBridge {
    abstract request(id: number, method: string, params?: any[]): void;
    abstract respond(id: number, response: any, success?: boolean): void;
    protected promises: Map<number, IPromiseInfo<any>>; // promise resolve and reject callbacks that are called when returning from remote
    protected functions: Map<string, IFunctionReference>;
    // TODO: timeouts do not make sense for user interactions. consider not using timeouts by default
    protected timeout: number = 3600000; // timeout for response from remote in milliseconds

    constructor() {
        this.promises = new Map();
        this.functions = new Map();
        this.add({ func: this.locals, thisArg: this });
    }

    setTimeout(timeout: number): void {
        this.timeout = timeout;
    }

    add(method: IFunctionReference): void {
        this.functions.set((method.name ? method.name : method.func.name), method);
    }

    remove(method: IFunctionReference): void {
        this.functions.delete((method.name ? method.name : method.func.name));
    }

    locals(): string[] {
        return Array.from(this.functions.keys());
    }

    remote(): Promise<string[]> {
        return this.invoke("listLocalMethods");
    }

    invoke(method: string, params?: any[]): Promise<any> {
        // TODO: change to something more unique (or check to see if id doesn't alreday exist in this.promiseCallbacks)
        const id = Math.random();

        const promise = new Promise((resolve, reject) => {
            this.promises.set(id, new PromiseInfo(resolve, reject));
        });

        this.request(id, method, params);
        return promise;
    }

    handleResponse(message: any): void {
        const promiseCallbacks: IPromiseInfo<any> | undefined = this.promises.get(message.id);

        if (promiseCallbacks) {
            if (message.success) {
                promiseCallbacks.resolve(message.response);
            } else {
                promiseCallbacks.reject(message.response);
            }

            this.promises.delete(message.id);
        }
    }

    async handleRequest(message: any): Promise<void> {
        const method: IFunctionReference | undefined = this.functions.get(message.method);

        if (method) {
            const func: Function = method.func;
            const thisArg: any = method.thisArg;
            
            try {
                let response: any = func.apply(thisArg, message.params);
                // if response is a promise, delay the response until the promise is fulfilled
                if (typeof response.then === "function") {
                    response = await response;
                }
                
                this.respond(message.id, response);
            } catch (err) {
                this.respond(message.id, err, false);
            }
        }
    }
}