import * as cs from '../cs';
import Logger, { ExtensionLogger } from './Logger';
import ExtensionContext from './ExtensionContext';
import Telemetry from './Telemetry';
import { Utilities } from './Utilities';
import moment = require('moment');

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
    { 
        this.invocationId = Utilities.Guid.newGuid();
    }

    readonly invocationId: string;
    startTime: number;
    endTime: number;

    abstract onCommandInvoked(...args: any[]): void; 
    abstract onCommandError(error: Error): void;
    abstract onCommandCompleted(result: T): T;
}

export class DefaultCommandWrapper<T> extends CommandWrapper<T>{
    static sensitiveKeys: string[] = [ "credentials", "password", "refreshToken", "accessToken" ];
    
    onCommandInvoked(...args: any[]): void {    
        const argString = args.map(a => { try { return JSON.stringify(Utilities.$Object.clone(a, undefined, DefaultCommandWrapper.sensitiveKeys)); } catch (error) { return a.toString(); } }).join();        
        this.options.logger.info(`Command: ${this.id} (${this.description}) invoked with: ${argString}`);

        const telemetryProps = { commandId: this.id, invocationId: this.invocationId, arguments: argString };
        Telemetry.Instance.sendTelemetry(cs.cds.telemetryEvents.commandInvoked, telemetryProps);
        this.startTime = moment.now();
    }

    onCommandError(error: Error): void {
        this.endTime = moment.now();
        this.options.logger.error(`Command: ${this.id} error occurred: ${error.message}`);

        const telemetryProps = { commandId: this.id, invocationId: this.invocationId };
        const telemetryMeasures = { callDuration: this.endTime - this.startTime };

        Telemetry.Instance.error(error, telemetryProps, telemetryMeasures);
    }

    onCommandCompleted(result: T): T {
        this.endTime = moment.now();
        this.options.logger.info(`Command: ${this.id} invocation complete`);

        const telemetryProps = { commandId: this.id, invocationId: this.invocationId };
        const telemetryMeasures = { callDuration: this.endTime - this.startTime };

        Telemetry.Instance.sendTelemetry(cs.cds.telemetryEvents.commandCompleted, telemetryProps, telemetryMeasures);

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
                }
            }

            return result;
        };

        ExtensionContext.registerCommand(id, descriptor.value);
    };
}
