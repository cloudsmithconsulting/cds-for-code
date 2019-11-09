import * as vscode from 'vscode';
import * as cs from '../cs';

export default class ExtensionConfiguration {
    private static _configurations: { [key: string]: vscode.WorkspaceConfiguration } = {};
    private static _validConfigurations: { [key: string]: boolean } = {};

    static extensionPath:string = "";
    
    public static updateConfiguration(namespace:string): void
    {
        if (this._configurations && this._configurations[namespace]) {
            delete this._configurations[namespace];
        }
    }

    public static getConfiguration(namespace:string): vscode.WorkspaceConfiguration {
        if (!this._configurations || !this._configurations[namespace] || !this._validConfigurations || !this._validConfigurations[namespace])
        {
            // get root config
            const config = vscode.workspace.getConfiguration(namespace);

            this._configurations[namespace] = config;
            this._validConfigurations[namespace] = this.validateConfiguration(namespace, config);
        }
        
        // return the configuration
        return this._configurations[namespace];
    }

    public static getConfigurationValue<T>(...config:string[]): T {
        const parsedKey = this.parseConfigurationString(...config);

        if (parsedKey.namespace && this.getConfiguration(parsedKey.namespace)) {
            return this.getConfiguration(parsedKey.namespace).get(parsedKey.configKey) as T;
        } else {
            return null;
        }
    }

    public static setConfigurationValue<T>(config:string, value:T, configurationTarget?:boolean | vscode.ConfigurationTarget): Thenable<void> {
        const parsedKey = this.parseConfigurationString(...config);

        if (parsedKey.namespace && this.getConfiguration(parsedKey.namespace)) {
            return this.getConfiguration(parsedKey.namespace).update(parsedKey.configKey, value, configurationTarget);
        } else {
            return null;
        }
    }

    public static getConfigurationValueOrDefault<T>(config:string, defaultValue:T): T {
        const returnValue:T = this.getConfigurationValue(config);

        return returnValue || defaultValue;
    }

    // can be called 2 ways:
    // parseConfigurationValue<string>(config, "root.namespace", "value");
    // parseConfigurationValue<string>(config, "root.namespace.value");
    public static parseConfigurationValue<T>(workspaceConfig:vscode.WorkspaceConfiguration, ...config:string[]): T {
        const parsedKey = this.parseConfigurationString(...config);

        return workspaceConfig.get(parsedKey.configKey) as T;
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

        if (config.length === 1) {
            const splitValues = config[0].split(".");
            
            if (splitValues.length < 2) {
                throw new Error(`The parameter '${config[0]}' supplied to parseConfigurationString() does not contain a namespace and configuration value.`);
            }
            else {
                configKey = splitValues[splitValues.length - 1];
                namespace = config[0].replace(`.${configKey}`, "");
            }
        } else if (config.length === 2) {
            configKey = config[1];
            namespace = config[0];
        } else {
            throw new Error(`The parameter '${config.join(", ")}' supplied to parseConfigurationString() has too many elements.`);
        }

        return { namespace, configKey };
    }
}