import * as vscode from 'vscode';
import * as cs from '../cs';
import TelemetryReporter from "vscode-extension-telemetry";
import { extensionActivate, extensionDeactivate } from "./ExtensionEvent";
import moment = require('moment');

export function telemetry(event: string, properties?: { [key: string]: string; }, measurements?: { [key: string]: number; }) {
    return function (target: any, propertyKey: string, descriptor: PropertyDescriptor) {
        const originalMethod = descriptor.value;

        properties = properties || {};
        measurements = measurements || {};
          
        descriptor.value = async function (...args: any[]) {
            let result;

            let startTime = moment.now();
            let endTime;

            try {
                result = await originalMethod.apply(target, args);
                endTime = moment.now();
            } catch (error) {
                endTime = moment.now();
                measurements["callDuration"] = endTime - startTime;
                Telemetry.Instance.error(error, properties, measurements);

                throw error;
            }

            measurements["callDuration"] = endTime - startTime;
            Telemetry.Instance.sendTelemetry(event, properties, measurements);

            return result;
        };
    };
}

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

    sendTelemetry(event: string, properties?: { [key: string]: string; }, measurements?: { [key: string]: number; }): void {
        this.reporter.sendTelemetryEvent(event, properties, measurements);
    }

    error(error: Error, properties?: { [key: string]: string; }, measurements?: { [key: string]: number; }): void {
        this.reporter.sendTelemetryException(error, properties, measurements);
    }
}