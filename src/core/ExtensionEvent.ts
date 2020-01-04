import * as vscode from 'vscode';
import Logger, { ExtensionLogger } from './Logger';
import ExtensionContext from './ExtensionContext';

export interface IExtensionEventWrapper {
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

export class ExtensionEventWrapper implements IExtensionEventWrapper {
    onActivate() {
        if (!ExtensionEventWrapper._hasActivated) {
            ExtensionEventWrapper._hasActivated = true;

            this.options.logger.info(`Extension: ${this.id} (${this.description}) activated`);
        }
    }
    
    onDeactivate() {
        if (!ExtensionEventWrapper._hasDeactivated) {
            ExtensionEventWrapper._hasDeactivated = true;

            this.options.logger.info(`Extension: ${this.id} (${this.description}) de-activated`);
        }
    }

    readonly description: string;

    private static _hasActivated: boolean = false;
    private static _hasDeactivated: boolean = false;

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

export function extensionActivate(id: string, options?: IExtensionEventInvocationOptions, wrapper: ExtensionEventWrapper = new ExtensionEventWrapper(id, options)) {
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

export function extensionDeactivate(id: string, options?: IExtensionEventInvocationOptions, wrapper: ExtensionEventWrapper = new ExtensionEventWrapper(id, options)) {
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
