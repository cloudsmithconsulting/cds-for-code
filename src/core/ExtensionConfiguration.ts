import * as vscode from 'vscode';
import * as cs from '../cs';
import ExtensionContext from './ExtensionContext';

export default class ExtensionConfiguration {
    private static _configurations: { [key: string]: vscode.WorkspaceConfiguration } = {};
    private static _notifiers: { [key: string]: (config: vscode.WorkspaceConfiguration) => void } = {};
    private static _validConfigurations: { [key: string]: boolean } = {};

    static get extensionPath():string {
        return ExtensionContext.Instance.extensionPath;
    }
    
    static updateConfiguration(namespace:string): void {
        if (this._configurations && this._configurations[namespace]) {
            delete this._configurations[namespace];
        }
    }

    static getConfiguration(namespace:string): vscode.WorkspaceConfiguration {
        if (!this._configurations || !this._configurations[namespace] || !this._validConfigurations || !this._validConfigurations[namespace]) {
            // get root config
            const config = vscode.workspace.getConfiguration(namespace);
            
            // Auto-update configuration.
            vscode.workspace.onDidChangeConfiguration(e => {                
                if (e.affectsConfiguration(namespace) && this._configurations[namespace]) {
                    if (this._notifiers[namespace]) {
                        this._notifiers[namespace](vscode.workspace.getConfiguration(namespace));
                    }

                    delete this._configurations[namespace];
                }
            });

            if (this._notifiers[namespace]) {
                delete this._notifiers[namespace];
            }

            this._configurations[namespace] = config;
            this._validConfigurations[namespace] = this.validateConfiguration(namespace, config);
        }
        
        // return the configuration
        return this._configurations[namespace];
    }

    static getConfigurationInfo<T>(...config:string[]): { key: string; defaultValue?: T; globalValue?: T; workspaceValue?: T, workspaceFolderValue?: T } | undefined {
        const parsedKey = this.parseConfigurationString(...config);

        if (parsedKey && parsedKey.namespace) {
            const configuration = this.getConfiguration(parsedKey.namespace);

            if (configuration) {
                return configuration.inspect(parsedKey.configKey);
            }
        }

        return undefined;
    }

    static getConfigurationValue<T>(...config:string[]): T | undefined {
        const parsedKey = this.parseConfigurationString(...config);

        if (parsedKey && parsedKey.namespace) {
            const configuration = this.getConfiguration(parsedKey.namespace);

            if (configuration && configuration.has(parsedKey.configKey)) {
                return configuration.get(parsedKey.configKey, undefined);
            }
        }

        return undefined;
    }

    static setConfigurationValue<T>(config:string, value?:T, configurationTarget:vscode.ConfigurationTarget = vscode.ConfigurationTarget.Global): Thenable<void> {
        const parsedKey = this.parseConfigurationString(...config);

        if (parsedKey && parsedKey.namespace) {
            const configuration = this.getConfiguration(parsedKey.namespace);

            if (configuration && value) {
                configuration.update(parsedKey.configKey, value, configurationTarget);
            }
        } 

        return undefined;
    }

    static getConfigurationValueOrDefault<T>(config:string, defaultValue:T): T {
        const returnValue:T = this.getConfigurationValue(config);

        return returnValue || defaultValue;
    }

    // can be called 2 ways:
    // parseConfigurationValue<string>(config, "root.namespace", "value");
    // parseConfigurationValue<string>(config, "root.namespace.value");
    static parseConfigurationValue<T>(workspaceConfig:vscode.WorkspaceConfiguration, ...config:string[]): T {
        const parsedKey = this.parseConfigurationString(...config);

        return workspaceConfig.get(parsedKey.configKey) as T;
    }

    static notify(namespace:string, notify?:(config:vscode.WorkspaceConfiguration) => void) {
        if (namespace && notify) {
            this._notifiers[namespace] = notify;
        }
    }

    static unnotify(namespace:string) {
        if (this._notifiers[namespace]) {
            delete this._notifiers[namespace];
        }
    }

    private static validateConfiguration(namespace:string, workspaceConfig:vscode.WorkspaceConfiguration): boolean {
        let returnValue:boolean = true;

        switch (namespace)
        {
            case cs.dynamics.configuration.tools._namespace:
                // Check SDK Install Path
                const sdkInstallPath = this.parseConfigurationValue<string>(workspaceConfig, cs.dynamics.configuration.tools.sdkInstallPath);

                if (!sdkInstallPath
                    || sdkInstallPath === undefined
                    || sdkInstallPath.length === 0) {
                        returnValue = false;
                        vscode.window.showErrorMessage(
                            `The configuration setting ${cs.dynamics.configuration.tools.sdkInstallPath} is invalid or not set.`
                    );
                }

                break;
        }

        return returnValue;
    }

    private static parseConfigurationString(...config:string[]): { namespace:string, configKey:string } {
        let namespace:string, configKey:string;
        // Join and split, in case one of the config array items includes "." as in ... parseConfigurationString("ns.something", "somethingElse", "oneMore");
        const splitValues = config.join(".").split(".");
        configKey = splitValues[splitValues.length - 1];
        
        if (splitValues.length > 1) {
            namespace = splitValues.splice(0, splitValues.length - 1).join(".");
        }

        return { namespace, configKey };
    }
}