import * as vscode from 'vscode';
import Logger, { ExtensionLogger } from './Logger';
import ExtensionContext from './ExtensionContext';

export interface IExtensionEventWrapper<T> {
    readonly id: string;
    readonly description: string;
    readonly options: IExtensionEventInvocationOptions;

    onActivate(context: vscode.ExtensionContext, config?:vscode.WorkspaceConfiguration);
    onDeactivate(context: vscode.ExtensionContext, config?:vscode.WorkspaceConfiguration);
}

export interface IExtensionEventInvocationOptions {
    logger: ExtensionLogger;
}

export class DefaultExtensionEventInvocationOptions implements IExtensionEventInvocationOptions {
    logger: ExtensionLogger = Logger;
}

export class ExtensionEventWrapper<T> implements IExtensionEventWrapper<T> {
    onActivate() {
        this.options.logger.info(`Extension: ${this.id} (${this.description}) activated`);
        this.options.logger.group();
    }
    
    onDeactivate() {
        this.options.logger.groupEnd();
        this.options.logger.info(`Extension: ${this.id} (${this.description}) de-activated`);
    }

    readonly description: string;

    constructor(
        public readonly id: string,
        public readonly options: IExtensionEventInvocationOptions = new DefaultExtensionEventInvocationOptions())
    { 
        const extension = vscode.extensions.getExtension(id);

        if (extension) {
            this.description = extension.packageJSON.description;
        }
    }
}

export function extensionActivate<T>(id: string, options?: IExtensionEventInvocationOptions, wrapper: ExtensionEventWrapper<T> = new ExtensionEventWrapper<T>(id, options)) {
    return function (target: any, propertyKey: string, descriptor: PropertyDescriptor) {
        const originalMethod = descriptor.value;

        //wrapping the original method
        descriptor.value = async function (...args: any[]) {
            let result;

            if (wrapper) {
                wrapper.onActivate();
            }

            try {
                result = await originalMethod.apply(target, args);
            } catch (error) {
                wrapper.options.logger.error(`An error occurred while executing onExtensionActivate for ${id}.  The error received was: ${error.message}`);
            }

            return result;
        };

        ExtensionContext.registerActivateFunction(id, descriptor.value);
    };
}

export function extensionDeactivate<T>(id: string, options?: IExtensionEventInvocationOptions, wrapper: ExtensionEventWrapper<T> = new ExtensionEventWrapper<T>(id, options)) {
    return function (target: any, propertyKey: string, descriptor: PropertyDescriptor) {
        const originalMethod = descriptor.value;

        //wrapping the original method
        descriptor.value = async function (...args: any[]) {
            let result;

            if (wrapper) {
                wrapper.onDeactivate();
            }

            try {
                result = await originalMethod.apply(target, args);
            } catch (error) {
                wrapper.options.logger.error(`An error occurred while executing onExtensionDeactivate for ${id}.  The error received was: ${error.message}`);
            }

            return result;
        };

        ExtensionContext.registerDeactivateFunction(id, descriptor.value);
    };
}
