import * as vscode from 'vscode';
import * as cs from '../../cs';
import * as Security from '../../core/security/Types';
import Logger from '../framework/Logger';
import TelemetryReporter from "vscode-extension-telemetry";
import { extensionActivate, extensionDeactivate } from "../Extension";
import moment = require('moment');
import { Utilities } from '../Utilities';
import Dictionary from '../types/Dictionary';
import logger, { ExtensionLogger } from './Logger';

export default class Telemetry {
    static get Instance(): Telemetry {
        if (!this.instance) {
            this.instance = new Telemetry();
        }

        return this.instance;
    }

    private static instance:Telemetry;
    protected reporter: TelemetryReporter;

    private constructor() {
        const extension = vscode.extensions.getExtension(cs.cds.extension.productId);
        
        this.reporter = new TelemetryReporter(extension.packageJSON.name, extension.packageJSON.version, cs.cds.extension.telemetryKey);
    }

    @extensionActivate(cs.cds.extension.productId)
    static async activate(context: vscode.ExtensionContext): Promise<void> {
    }

    @extensionDeactivate(cs.cds.extension.productId)
    static async deactivate(): Promise<void> {
        if (Telemetry.Instance.reporter) {
            await Telemetry.Instance.reporter.dispose();
        }
    }

    context(key: string): TelemetryContext { 
        return TelemetryContext.get(key);
    }

    error(error: Error, properties?: { [key: string]: string; }, measurements?: { [key: string]: number; }): void {
        if (vscode.env.machineId !== 'someValue.machineId') {
            this.reporter.sendTelemetryException(error, properties, measurements);
        } else {
            const errorText = JSON.stringify(error); 
            const propertiesText = JSON.stringify(properties);
            const measurementsText = JSON.stringify(measurements);

            logger.log(`[Debug] Telemetry.error(error: ${errorText}, properties: ${propertiesText}, measurements: ${measurementsText})`);
        }
    }

    sendTelemetry(event: string, properties?: { [key: string]: string; }, measurements?: { [key: string]: number; }): void {
        if (vscode.env.machineId !== 'someValue.machineId') {
            this.reporter.sendTelemetryEvent(event, properties, measurements);
        } else {
            const propertiesText = JSON.stringify(properties);
            const measurementsText = JSON.stringify(measurements);

            logger.log(`[Debug] Telemetry.sendTelemetry(event: ${event}, properties: ${propertiesText}, measurements: ${measurementsText})`);
        }
    }
}

export class TelemetryContext {
    readonly event: string;
    readonly instanceId: string;
    readonly key: string;
    readonly inputs: Dictionary<string, number>;
    properties: { [key: string]: string; };
    measurements: { [key: string]: number; };
    
    private static readonly definitions = new Dictionary<string, TelemetryDefinition>();
    private static readonly preserves = new Dictionary<string, { inputKeys: string[], propertyKeys: string[] }>();

    private constructor(definition: TelemetryDefinition) { 
        this.instanceId = Utilities.Guid.newGuid();
        this.inputs = new Dictionary<string, number>();
        this.event = definition.event;
        this.key = definition.key;

        definition.inputs = definition.inputs || [];
        definition.inputs.map(i => this.inputs.add(i.key, i.value));
        
        if (!TelemetryContext.preserves.containsKey(this.key)) {
            TelemetryContext.preserves.add(this.key, { 
                inputKeys: definition.inputs ? definition.inputs.map(i => i.key) : [],
                propertyKeys: definition.properties ? definition.properties.keys : [] });
        }

        TelemetryContext.definitions.set(this.key, definition);
    }

    static from(definition: TelemetryDefinition): TelemetryContext {
        this.definitions.set(definition.key, definition);

        return this.get(definition.key);
    }

    static get(key: string): TelemetryContext {
        return new TelemetryContext(this.definitions.get(key));
    }

    error(error: Error): TelemetryContext { 
        this.prepareForSend();

        Telemetry.Instance.error(error, this.properties, this.measurements);

        return this;
    }

    input(key: string, value: number): TelemetryContext {
        const definition: TelemetryDefinition = TelemetryContext.definitions.get(this.key);

        this.inputs.set(key, value);

        if (definition) { 
            const index = definition.inputs.findIndex(i => i.key === key);

            if (index !== -1) {
                definition.inputs[index] = { key, value }; 
            } else {
                definition.inputs.push({ key, value });
            }

            TelemetryContext.definitions.set(this.key, definition);
        }

        return this;
    }

    mark(key: string): TelemetryContext {
        this.input(key, moment.now());

        return this;
    }

    property(key: string, value: string): TelemetryContext {
        const definition: TelemetryDefinition = TelemetryContext.definitions.get(this.key);

        if (definition) {
            definition.properties = definition.properties || new Dictionary<string, (key: string, context: TelemetryContext) => string>();
            definition.properties.set(key, (k, c) => value);
            TelemetryContext.definitions.set(this.key, definition);
        }

        return this;
    }

    sendTelemetry(): TelemetryContext { 
        this.prepareForSend();

        Telemetry.Instance.sendTelemetry(this.event, this.properties, this.measurements);

        return this;
    }

    dispose(): void {
        const definition: TelemetryDefinition = TelemetryContext.definitions.get(this.key);
        const preserves = TelemetryContext.preserves.get(this.key);

        if (definition.inputs) {
            for (let i = definition.inputs.length; i > 0; --i) {
                if (!preserves.inputKeys.find(k => definition.inputs[i])) {
                    definition.inputs.splice(i - 1, 1);
                }
            }
        }

        if (definition.properties) {
            for (let i = definition.properties.keys.length; i > 0; --i) {
                if (!preserves.propertyKeys.find(k => definition.properties.keys[i])) {
                    definition.properties.remove(definition.properties.keys[i]);
                }
            }
        }
    }

    private prepareForSend() {
        const definition: TelemetryDefinition = TelemetryContext.definitions.get(this.key);

        if (definition) {
            definition.inputs.map(i => this.inputs.set(i.key, i.value));

            this.properties = definition.properties ? definition.properties.map((key, value) => value(key, this)) : null;
            this.measurements = definition.measures ? definition.measures.map((key, value) => value(key, this)) : null;
        }

        if (!this.properties.instanceId) {
            this.properties.instanceId = this.instanceId;
        }
    }
}

export type TelemetryDefinition = { 
    readonly event: string,
    readonly key: string,
    inputs?: TelemetryItem<number>[],
    properties?: Dictionary<string, (key: string, context: TelemetryContext) => string>,
    measures?: Dictionary<string, (key: string, context: TelemetryContext) => number>
};

export type TelemetryItem<T> = {
    key: string;
    value?: T;
};

export interface ITelemetryInvocationOptions {
    readonly logger?: ExtensionLogger;
    readonly onStart?: (logger: ExtensionLogger, ...args: any[]) => void;
    readonly onEnd?: (logger: ExtensionLogger, context: TelemetryContext, ...args: any[]) => void;
}

export class TelemetryInvocationOptions implements ITelemetryInvocationOptions {
    constructor(options?: ITelemetryInvocationOptions) {
        if (options && options.logger) {
            this.logger = options.logger;
        }

        this.onStart = options.onStart;
        this.onEnd = options.onEnd;
     }

    readonly logger: ExtensionLogger = Logger;
    readonly onStart?: (logger: ExtensionLogger, ...args: any[]) => void;
    readonly onEnd?: (logger: ExtensionLogger, context: TelemetryContext, ...args: any[]) => void;
}

export function telemetry(definition: TelemetryDefinition, options: ITelemetryInvocationOptions = new TelemetryInvocationOptions()) {
    return function (target: any, propertyKey: string, descriptor: PropertyDescriptor) {
        const originalMethod = descriptor.value;
        const context = TelemetryContext.from(definition);

        descriptor.value = async function (...args: any[]) {
            let result;
            const argString = args.map(a => { try { return JSON.stringify(Utilities.$Object.clone(a, undefined, Security.sensitiveKeys)); } catch (error) { return a.toString(); } }).join();

            if (context) { 
                context
                    .property("arguments", argString)
                    .property("method", context.key)
                    .mark("invocation.start"); 
            }

            if (options && options.onStart) {
                options.onStart(options.logger || Logger, ...args);
            }

            try {
                result = await originalMethod.apply(target, args);
            } catch (error) {
                if (context) { 
                    context
                        .mark("invocation.end")
                        .error(error); 

                    if (options && options.onEnd) {
                        options.onEnd(options.logger || Logger, context, ...args);
                    }

                    context.dispose();
                }
    
                throw error;
            }

            if (context) {
                context
                    .mark("invocation.end")
                    .sendTelemetry(); 

                if (options && options.onEnd) {
                    options.onEnd(options.logger || Logger, context, ...args);
                }

                context.dispose();
            }

            return result;
        };
    };
}