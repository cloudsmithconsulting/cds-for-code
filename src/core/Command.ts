import * as vscode from 'vscode';
import Logger, { ExtensionLogger } from './Logger';
import ExtensionContext from './ExtensionContext';

export interface ICommandWrapper<T> {
    readonly id: string;

    onCommandInvoked(...args: any[]): void;
    onCommandError(error: Error): void;
    onCommandCompleted(result: T): T;
}

export interface ICommandInvocationOptions {
    thisArg?: any;
    logger: ExtensionLogger;
}

export class DefaultCommandInvocationOptions implements ICommandInvocationOptions {
    constructor(public thisArg?: any) 
    { }

    logger: ExtensionLogger = Logger;
}

export abstract class CommandWrapper<T> implements ICommandWrapper<T> {
    constructor(
        public readonly id: string, 
        public readonly description: string, 
        public readonly options: ICommandInvocationOptions = new DefaultCommandInvocationOptions())
    { }

    abstract onCommandInvoked(...args: any[]): void; 
    abstract onCommandError(error: Error): void;
    abstract onCommandCompleted(result: T): T;
}

export class DefaultCommandWrapper<T> extends CommandWrapper<T>{
    onCommandInvoked(...args: any[]): void {    
        var argString = args.map(a => { try { return JSON.stringify(a); } catch (error) { return a.toString(); } }).join();

        this.options.logger.info(`Command: ${this.id} (${this.description}) invoked with: ${argString}`);
        this.options.logger.group();
    }

    onCommandError(error: Error): void {
        this.options.logger.error(`Command: ${this.id} error occurred: ${error.message}`);
    }

    onCommandCompleted(result: T): T {
        this.options.logger.groupEnd();
        this.options.logger.info(`Command: ${this.id} completed with: ${JSON.stringify(result)}`);

        return result;
    }
}

export default function command<T>(id: string, description: string, options?: ICommandInvocationOptions, wrapper: CommandWrapper<T> = new DefaultCommandWrapper<T>(id, description, options)) {
    return function (target: any, propertyKey: string, descriptor: PropertyDescriptor) {
        const originalMethod = descriptor.value;

        //wrapping the original method
        descriptor.value = async function (...args: any[]) {
            let result;

            if (wrapper) {
                try { 
                    wrapper.onCommandInvoked(args);
                } catch (error) {
                    wrapper.options.logger.group();
                    wrapper.options.logger.error(`An error occurred while executing onCommandInvoked for ${id}.  The error received was: ${error.message}`);
                }
            }
        
            try {
                result = await originalMethod.apply(wrapper.options.thisArg || target, args);
            } catch (error) {
                if (wrapper) {
                    try {
                        wrapper.onCommandError(error);
                    } catch (innerError) {
                        wrapper.options.logger.error(`An error occurred while executing onCommandError for ${id}.  The error received was: ${innerError.message}`);
                    }
                }
            }

            if (wrapper) {
                try {
                    const result2 = wrapper.onCommandCompleted(result);

                    if (result2) {
                        result = result2;
                    }
                } catch (error) {
                    wrapper.options.logger.error(`An error occurred while executing onCommandCompleted for ${id}.  The error received was: ${error.message}`);
                    wrapper.options.logger.groupEnd();
                }
            }

            return result;
        };

        ExtensionContext.registerCommand(id, descriptor.value);
    };
}
